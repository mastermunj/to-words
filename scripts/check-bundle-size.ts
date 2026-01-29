#!/usr/bin/env npx tsx

/**
 * Bundle Size Verification Script
 *
 * This script verifies that tree-shaking works correctly by comparing:
 * 1. Full package import (all locales bundled)
 * 2. Each locale's individual bundle size
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, '../.bundle-test');
const LOCALES_DIR = path.join(__dirname, '../dist/esm/locales');

interface TestCase {
  name: string;
  code: string;
  isFullPackage: boolean;
}

interface BundleResult {
  name: string;
  raw: number;
  gzipped: number;
  error?: string;
}

// Get all locale codes from dist
function getLocaleCodes(): string[] {
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error('Error: dist/esm/locales not found. Run "npm run build" first.');
    process.exit(1);
  }
  return fs
    .readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith('.js') && f !== 'index.js')
    .map((f) => f.replace('.js', ''));
}

// Build test cases dynamically
function buildTestCases(): TestCase[] {
  const locales = getLocaleCodes();

  const testCases: TestCase[] = [
    {
      name: 'Full package (all locales)',
      code: `
        import { ToWords } from '../dist/esm/ToWords.js';
        const tw = new ToWords({ localeCode: 'en-IN' });
        console.log(tw.convert(1234));
      `,
      isFullPackage: true,
    },
  ];

  for (const locale of locales) {
    testCases.push({
      name: locale,
      code: `
        import { ToWords } from '../dist/esm/locales/${locale}.js';
        const tw = new ToWords();
        console.log(tw.convert(1234));
      `,
      isFullPackage: false,
    });
  }

  return testCases;
}

async function bundleAndMeasure(name: string, code: string): Promise<BundleResult> {
  // Ensure temp directory exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const inputFile = path.join(TEMP_DIR, 'input.js');
  const outputFile = path.join(TEMP_DIR, 'output.js');

  fs.writeFileSync(inputFile, code);

  try {
    // Bundle with esbuild
    await esbuild.build({
      entryPoints: [inputFile],
      bundle: true,
      minify: true,
      outfile: outputFile,
      platform: 'node',
      target: 'node20',
      treeShaking: true,
      format: 'esm',
      logLevel: 'silent',
    });

    // Read bundled file
    const bundled = fs.readFileSync(outputFile);
    const gzipped = zlib.gzipSync(bundled);

    return {
      name,
      raw: bundled.length,
      gzipped: gzipped.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error bundling "${name}":`, message);
    return { name, raw: 0, gzipped: 0, error: message };
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(2) + ' KB';
}

async function main(): Promise<void> {
  console.log('\n📦 Bundle Size Verification\n');
  console.log('Testing tree-shaking effectiveness for all locales...\n');

  const testCases = buildTestCases();
  const results: BundleResult[] = [];

  // Progress indicator
  const total = testCases.length;
  let completed = 0;

  for (const testCase of testCases) {
    const result = await bundleAndMeasure(testCase.name, testCase.code);
    results.push(result);
    completed++;
    process.stdout.write(`\rBundling: ${completed}/${total} locales...`);
  }
  console.log('\n');

  // Cleanup temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  // Separate full package from locales
  const fullPackage = results[0];
  const localeResults = results.slice(1).sort((a, b) => b.gzipped - a.gzipped);

  // Display full package result
  console.log('┌──────────────────────────────┬────────────┬────────────┐');
  console.log('│ Bundle                       │ Raw Size   │ Gzipped    │');
  console.log('├──────────────────────────────┼────────────┼────────────┤');
  console.log(
    `│ ${fullPackage.name.padEnd(28)} │ ${formatBytes(fullPackage.raw).padStart(10)} │ ${formatBytes(fullPackage.gzipped).padStart(10)} │`,
  );
  console.log('└──────────────────────────────┴────────────┴────────────┘');

  // Calculate locale statistics
  const gzippedSizes = localeResults.map((r) => r.gzipped);
  const maxSize = Math.max(...gzippedSizes);
  const avgSize = gzippedSizes.reduce((a, b) => a + b, 0) / gzippedSizes.length;
  const smallest = localeResults[localeResults.length - 1];
  const largest = localeResults[0];

  // Display locale summary
  console.log('\n📊 Locale Bundle Statistics:');
  console.log(`   • Total locales: ${localeResults.length}`);
  console.log(`   • Smallest: ${smallest.name} (${formatBytes(smallest.gzipped)} gzipped)`);
  console.log(`   • Largest: ${largest.name} (${formatBytes(largest.gzipped)} gzipped)`);
  console.log(`   • Average: ${formatBytes(avgSize)} gzipped`);

  // Calculate savings
  const savings = ((1 - avgSize / fullPackage.gzipped) * 100).toFixed(1);
  console.log(`   • Average savings vs full: ${savings}%`);

  // Display all locales sorted by size (largest first)
  console.log('\n📦 All Locales (sorted by size, largest first):');
  console.log('┌────────────┬────────────┬────────────┐');
  console.log('│ Locale     │ Raw Size   │ Gzipped    │');
  console.log('├────────────┼────────────┼────────────┤');

  for (const result of localeResults) {
    const name = result.name.padEnd(10);
    const raw = formatBytes(result.raw).padStart(10);
    const gzip = formatBytes(result.gzipped).padStart(10);
    console.log(`│ ${name} │ ${raw} │ ${gzip} │`);
  }

  console.log('└────────────┴────────────┴────────────┘');

  // Tree-shaking verification
  console.log('\n🌳 Tree-shaking Status:');
  if (maxSize < fullPackage.gzipped * 0.1) {
    console.log('   ✅ Tree-shaking is working! All locale bundles are <10% of full bundle.');
  } else {
    console.log('   ⚠️  Tree-shaking may not be optimal. Check your bundler config.');
  }
}

main().catch(console.error);

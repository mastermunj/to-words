#!/usr/bin/env node --experimental-strip-types
/// <reference types="node" />

/**
 * UMD Bundle Build Script (using Rolldown)
 *
 * Generates browser-ready bundles:
 * 1. Full package with all locales
 * 2. Individual locale bundles
 */

import { build, type BuildOptions, type OutputChunk, type RolldownOutput } from 'rolldown';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist/umd');
const LOCALES_DIR = path.join(SRC_DIR, 'locales');

function getLocaleCodes(): string[] {
  return fs
    .readdirSync(LOCALES_DIR)
    .filter((fileName: string) => fileName.endsWith('.ts') && fileName !== 'index.ts')
    .map((fileName: string) => fileName.replace('.ts', ''));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  }
  return (bytes / 1024).toFixed(2) + ' KB';
}

type BuildRequest = {
  input: string;
  outfile: string;
  minify: boolean;
  resultName: string | null;
};

function toBrowserGlobal(code: string): string {
  const exportMatch = code.match(/export\s*\{([^}]+)\}\s*;?\s*$/);
  if (!exportMatch) {
    throw new Error('Unable to find ToWords export in Rolldown output');
  }

  const exports = exportMatch[1];
  const directExport = exports
    .split(',')
    .map((name) => name.trim())
    .find((name) => name === 'ToWords');
  const aliasedExport = exports.match(/(\w+)\s+as\s+ToWords/);
  const varName = directExport ?? aliasedExport?.[1];

  if (!varName) {
    throw new Error('Unable to find ToWords symbol in Rolldown output');
  }

  const executableCode = code.replace(/export\s*\{[^}]+\}\s*;?\s*$/, `return ${varName};`);

  return `"use strict";var ToWords=(()=>{${executableCode}})();`;
}

async function buildBundle(output: RolldownOutput, outfile: string): Promise<{ raw: number; gzipped: number }> {
  const entryChunk = output.output.find((item): item is OutputChunk => item.type === 'chunk' && item.isEntry);
  if (!entryChunk) {
    throw new Error(`Unable to find entry chunk for ${outfile}`);
  }

  const wrapped = toBrowserGlobal(entryChunk.code);

  fs.writeFileSync(outfile, wrapped);

  const content = Buffer.from(wrapped);
  const gzipped = zlib.gzipSync(content);

  return { raw: content.length, gzipped: gzipped.length };
}

// Check for --verbose flag
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

async function main(): Promise<void> {
  if (verbose) {
    console.log('\n🔨 Building UMD bundles (Rolldown)...\n');
  }

  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const locales = getLocaleCodes();
  const results: { name: string; raw: number; gzipped: number }[] = [];
  const buildRequests: BuildRequest[] = [
    {
      input: path.join(SRC_DIR, 'ToWords.ts'),
      outfile: path.join(DIST_DIR, 'to-words.js'),
      minify: false,
      resultName: null,
    },
    {
      input: path.join(SRC_DIR, 'ToWords.ts'),
      outfile: path.join(DIST_DIR, 'to-words.min.js'),
      minify: true,
      resultName: 'to-words.min.js (full)',
    },
    ...locales.map((locale) => ({
      input: path.join(LOCALES_DIR, `${locale}.ts`),
      outfile: path.join(DIST_DIR, `${locale}.min.js`),
      minify: true,
      resultName: `${locale}.min.js`,
    })),
  ];

  if (verbose) {
    console.log(`Building ${buildRequests.length} bundles in one Rolldown build call...`);
  }

  const buildOptions: BuildOptions[] = buildRequests.map((request) => ({
    input: request.input,
    platform: 'browser',
    logLevel: 'silent',
    output: {
      format: 'es',
      codeSplitting: false,
      minify: request.minify,
    },
  }));
  const buildOutputs = await build(buildOptions);

  for (const [index, request] of buildRequests.entries()) {
    const result = await buildBundle(buildOutputs[index], request.outfile);
    if (request.resultName) {
      results.push({ name: request.resultName, ...result });
    }
  }

  if (verbose) {
    console.log('\n');
  }

  // Sort results by size
  const fullPkg = results[0];
  const localeResults = results.slice(1).sort((a, b) => a.gzipped - b.gzipped);

  if (verbose) {
    // Display results
    console.log('┌────────────────────────────────────┬────────────┬────────────┐');
    console.log('│ Bundle                             │ Raw Size   │ Gzipped    │');
    console.log('├────────────────────────────────────┼────────────┼────────────┤');
    console.log(
      `│ ${fullPkg.name.padEnd(34)} │ ${formatBytes(fullPkg.raw).padStart(10)} │ ${formatBytes(fullPkg.gzipped).padStart(10)} │`,
    );
    console.log('├────────────────────────────────────┼────────────┼────────────┤');

    const smallest = localeResults[0];
    const largest = localeResults[localeResults.length - 1];
    const avgGzipped = localeResults.reduce((a, b) => a + b.gzipped, 0) / localeResults.length;

    console.log(
      `│ ${'Smallest locale: ' + smallest.name.replace('.min.js', '').padEnd(17)} │ ${formatBytes(smallest.raw).padStart(10)} │ ${formatBytes(smallest.gzipped).padStart(10)} │`,
    );
    console.log(
      `│ ${'Largest locale: ' + largest.name.replace('.min.js', '').padEnd(18)} │ ${formatBytes(largest.raw).padStart(10)} │ ${formatBytes(largest.gzipped).padStart(10)} │`,
    );
    console.log(`│ ${'Average locale'.padEnd(34)} │ ${'—'.padStart(10)} │ ${formatBytes(avgGzipped).padStart(10)} │`);
    console.log('└────────────────────────────────────┴────────────┴────────────┘');

    console.log(`\n✅ Built ${results.length} UMD bundles to dist/umd/`);

    console.log('\n📝 Usage:');
    console.log('   <!-- Full package (all locales) -->');
    console.log('   <script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>');
    console.log('   <script>');
    console.log("     const tw = new ToWords({ localeCode: 'en-IN' });");
    console.log('     console.log(tw.convert(1234));');
    console.log('   </script>');
    console.log('');
    console.log('   <!-- Single locale (smaller bundle) -->');
    console.log('   <script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-IN.min.js"></script>');
    console.log('   <script>');
    console.log('     const tw = new ToWords();');
    console.log('     console.log(tw.convert(1234));');
    console.log('   </script>');
    console.log('');
  }
}

main().catch(console.error);

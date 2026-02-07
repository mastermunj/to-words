#!/usr/bin/env node --experimental-strip-types

/**
 * UMD Bundle Build Script (using esbuild)
 *
 * Generates browser-ready bundles:
 * 1. Full package with all locales
 * 2. Individual locale bundles for tree-shaking
 */

import * as esbuild from 'esbuild';
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
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => f.replace('.ts', ''));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(2) + ' KB';
}

async function buildBundle(
  entryPoint: string,
  outfile: string,
  minify: boolean,
): Promise<{ raw: number; gzipped: number }> {
  // Use ESM format (smaller, no CJS compat boilerplate) then wrap for browser
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    logLevel: 'silent',
  });

  // Wrap ESM in IIFE for browser global
  let code = result.outputFiles[0].text;

  // ESM export looks like: export{L as ToWords,W as default};
  // We need to find the ToWords export and return it
  // Match pattern: SomeVar as ToWords
  const exportMatch = code.match(/export\s*\{([^}]+)\}\s*;?\s*$/);
  if (exportMatch) {
    const exports = exportMatch[1];
    // Find "X as ToWords" pattern
    const toWordsMatch = exports.match(/(\w+)\s+as\s+ToWords/);
    if (toWordsMatch) {
      const varName = toWordsMatch[1];
      // Remove the export statement and add return
      code = code.replace(/export\s*\{[^}]+\}\s*;?\s*$/, `return ${varName};`);
    }
  }

  const wrapped = `"use strict";var ToWords=(()=>{${code}})();`;

  fs.writeFileSync(outfile, wrapped);

  const content = Buffer.from(wrapped);
  const gzipped = zlib.gzipSync(content);

  return { raw: content.length, gzipped: gzipped.length };
}

// Check for --verbose flag
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

async function main(): Promise<void> {
  if (verbose) {
    console.log('\n🔨 Building UMD bundles (esbuild)...\n');
  }

  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const locales = getLocaleCodes();
  const results: { name: string; raw: number; gzipped: number }[] = [];

  // Build full package (minified and unminified)
  if (verbose) console.log('Building full package...');
  const fullEntry = path.join(SRC_DIR, 'ToWords.ts');

  await buildBundle(fullEntry, path.join(DIST_DIR, 'to-words.js'), false);

  const fullResult = await buildBundle(fullEntry, path.join(DIST_DIR, 'to-words.min.js'), true);
  results.push({ name: 'to-words.min.js (full)', ...fullResult });

  // Build individual locale bundles
  if (verbose) console.log(`Building ${locales.length} locale bundles...`);
  let completed = 0;

  for (const locale of locales) {
    const localeEntry = path.join(LOCALES_DIR, `${locale}.ts`);

    // Minified only for locales (saves build time)
    const result = await buildBundle(localeEntry, path.join(DIST_DIR, `${locale}.min.js`), true);
    results.push({ name: `${locale}.min.js`, ...result });

    completed++;
    if (verbose) process.stdout.write(`\rProgress: ${completed}/${locales.length} locales...`);
  }
  if (verbose) console.log('\n');

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

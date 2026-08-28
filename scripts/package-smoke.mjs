/** Smoke-test the exact tarball that npm users receive. */
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'to-words-package-smoke-'));
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const tscCommand = path.join(repositoryRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');

function run(command, args, cwd = temporaryRoot) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: path.join(temporaryRoot, '.npm-cache') },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

try {
  const packResult = JSON.parse(
    run(npmCommand, ['pack', '--ignore-scripts', '--json', '--pack-destination', temporaryRoot], repositoryRoot),
  );
  const tarballPath = path.join(temporaryRoot, packResult[0].filename);

  fs.writeFileSync(
    path.join(temporaryRoot, 'package.json'),
    `${JSON.stringify({ private: true, type: 'module' }, null, 2)}\n`,
  );
  run(npmCommand, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', tarballPath]);

  const installedRoot = path.join(temporaryRoot, 'node_modules', 'to-words');
  for (const expectedFile of [
    'dist/esm/ToWords.js',
    'dist/cjs/ToWords.js',
    'dist/types/ToWords.d.ts',
    'dist/types/errors.d.ts',
    'dist/umd/to-words.min.js',
    'dist/esm/locales/ne-NP.js',
    'dist/cjs/locales/ne-NP.js',
    'dist/types/locales/ne-NP.d.ts',
  ]) {
    if (!fs.existsSync(path.join(installedRoot, expectedFile))) {
      throw new Error(`Packed artifact is missing ${expectedFile}`);
    }
  }

  fs.writeFileSync(
    path.join(temporaryRoot, 'consumer.mjs'),
    `import assert from 'node:assert/strict';
import { NumberOutOfRangeError, resolveLocale, toWords } from 'to-words';
import { NumberOutOfRangeError as SubpathRangeError } from 'to-words/errors';
import { toWords as toNepali } from 'to-words/ne-NP';
import { isSupportedLocale } from 'to-words/manifest';
assert.equal(toWords(42, { localeCode: 'en-US' }), 'Forty Two');
assert.equal(resolveLocale('EN_us'), 'en-US');
assert.equal(NumberOutOfRangeError, SubpathRangeError);
assert.equal(toNepali(42), 'बयालीस');
assert.equal(isSupportedLocale('ne-NP'), true);
assert.equal(isSupportedLocale('np-NP'), false);
`,
  );
  run(process.execPath, ['consumer.mjs']);

  fs.writeFileSync(
    path.join(temporaryRoot, 'consumer.cjs'),
    `const assert = require('node:assert/strict');
const { NumberOutOfRangeError, resolveLocale, toWords } = require('to-words');
const { NumberOutOfRangeError: SubpathRangeError } = require('to-words/errors');
const { toWords: toNepali } = require('to-words/ne-NP');
const { isSupportedLocale } = require('to-words/manifest');
assert.equal(toWords(42, { localeCode: 'en-US' }), 'Forty Two');
assert.equal(resolveLocale('EN_us'), 'en-US');
assert.equal(NumberOutOfRangeError, SubpathRangeError);
assert.equal(toNepali(42), 'बयालीस');
assert.equal(isSupportedLocale('ne-NP'), true);
assert.equal(isSupportedLocale('np-NP'), false);
`,
  );
  run(process.execPath, ['consumer.cjs']);

  fs.writeFileSync(
    path.join(temporaryRoot, 'consumer.ts'),
    `import { NumberOutOfRangeError, resolveLocale, ToWords, toWords, type LocaleCode } from 'to-words';
import { NumberOutOfRangeError as SubpathRangeError } from 'to-words/errors';
import { toWords as toNepali } from 'to-words/ne-NP';
import { LOCALE_MANIFEST } from 'to-words/manifest';
import { deriveLocaleCapabilities } from 'to-words/locale-contract';
import type { ConverterOptions } from 'to-words/types';

const localeCode: LocaleCode = 'ne-NP';
const options: ConverterOptions = { currency: true, rangeMode: 'strict' };
const converter = new ToWords({ localeCode });
const dynamicLocale: LocaleCode | undefined = resolveLocale('NE_np');
toWords(42, { ...options, localeCode });
toNepali(42, options);
deriveLocaleCapabilities(converter.getLocale().config);
LOCALE_MANIFEST[localeCode].metadata.numbering.system;
LOCALE_MANIFEST[localeCode].metadata.range.maximumSupported.currency;
NumberOutOfRangeError === SubpathRangeError;
dynamicLocale;
`,
  );
  run(tscCommand, [
    '--strict',
    '--noEmit',
    '--target',
    'ES2022',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    'consumer.ts',
  ]);

  console.log('✅ Packed npm artifact passed ESM, CommonJS, TypeScript, export, and file-content smoke checks');
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

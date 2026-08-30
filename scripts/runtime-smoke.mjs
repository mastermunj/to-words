/** Runtime smoke test for the compiled ESM, CommonJS, per-locale, and CLI entry points. */
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as vm from 'node:vm';

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`FAIL [${label}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  console.log(`  ✓ ${label}: ${actual}`);
}

async function assertMissingModule(label, load, expectedCode) {
  let actualCode;
  try {
    await load();
  } catch (error) {
    actualCode = error?.code;
  }
  if (actualCode !== expectedCode) {
    throw new Error(`FAIL [${label}]: expected ${expectedCode}, got ${actualCode ?? 'a successful import'}`);
  }
  console.log(`  ✓ ${label}: ${actualCode}`);
}

const esm = await import('../dist/esm/ToWords.js');
const cjs = await import('../dist/cjs/ToWords.js');
const esmLocale = await import('../dist/esm/locales/en-US.js');
const cjsLocale = await import('../dist/cjs/locales/en-US.js');
const esmEstonian = await import('to-words/et-EE');
const esmNepali = await import('to-words/ne-NP');
const esmManifest = await import('to-words/manifest');
const esmContract = await import('to-words/locale-contract');
const require = createRequire(import.meta.url);
const cjsManifest = require('to-words/manifest');
const cjsEstonian = require('to-words/et-EE');
const cjsNepali = require('to-words/ne-NP');
const cjsContract = require('to-words/locale-contract');
const cjsErrors = require('to-words/errors');

assertEqual('ESM root export', esm.toWords(1234, { localeCode: 'en-IN' }), 'One Thousand Two Hundred Thirty Four');
assertEqual('CommonJS root export', cjs.toOrdinal(3, { localeCode: 'en-IN' }), 'Third');
assertEqual('ESM canonical locale resolver', esm.resolveLocale('EN_us'), 'en-US');
assertEqual('CommonJS frozen locale registry', Object.isFrozen(cjs.LOCALES), true);
assertEqual('ESM frozen converter defaults', Object.isFrozen(esm.DefaultConverterOptions), true);
assertEqual('ESM locale export', esmLocale.toOrdinal(21), 'Twenty First');
assertEqual('CommonJS locale export', cjsLocale.toCurrency('1.01'), 'One Dollar And One Cent Only');
assertEqual('ESM Estonian locale export', esmEstonian.toWords(42), 'Nelikümmend Kaks');
assertEqual('CommonJS Estonian locale export', cjsEstonian.toWords(42), 'Nelikümmend Kaks');
assertEqual('ESM Nepali locale export', esmNepali.toWords(42), 'बयालीस');
assertEqual('CommonJS Nepali locale export', cjsNepali.toWords(42), 'बयालीस');
await assertMissingModule('removed ESM ee-EE entry point', () => import('to-words/ee-EE'), 'ERR_MODULE_NOT_FOUND');
await assertMissingModule('removed CommonJS ee-EE entry point', () => require('to-words/ee-EE'), 'MODULE_NOT_FOUND');
await assertMissingModule('removed ESM np-NP entry point', () => import('to-words/np-NP'), 'ERR_MODULE_NOT_FOUND');
await assertMissingModule('removed CommonJS np-NP entry point', () => require('to-words/np-NP'), 'MODULE_NOT_FOUND');
assertEqual('ESM manifest export', esmManifest.SUPPORTED_LOCALES.length, 136);
assertEqual('ESM Estonian manifest entry', esmManifest.isSupportedLocale('et-EE'), true);
assertEqual('ESM removed locale manifest entry', esmManifest.isSupportedLocale('ee-EE'), false);
assertEqual('ESM Nepali manifest entry', esmManifest.isSupportedLocale('ne-NP'), true);
assertEqual('ESM removed Nepali manifest entry', esmManifest.isSupportedLocale('np-NP'), false);
assertEqual('CommonJS manifest export', cjsManifest.getLocaleCapabilities('zh-CN').formal, true);
assertEqual('ESM manifest metadata export', esmManifest.getLocaleMetadata('hi-IN').numbering.system, 'indian');
assertEqual('ESM locale contract export', esmContract.validateLocaleConfig(new esmLocale.default().config).length, 0);
assertEqual(
  'CommonJS locale contract export',
  cjsContract.deriveLocaleCapabilities(new esmLocale.default().config).decimals.fraction,
  true,
);
assertEqual(
  'CommonJS locale contract metadata export',
  cjsContract.deriveLocaleMetadata(new esmLocale.default().config).numbering.system,
  'base-thousand',
);

const enUsMaximum = BigInt(esmManifest.getLocaleMetadata('en-US').range.maximumSupported.cardinal);
let strictRangeError;
try {
  esm.toWords(enUsMaximum + 1n, { localeCode: 'en-US' });
} catch (error) {
  strictRangeError = error;
}
assertEqual('ESM structured strict-range error', strictRangeError instanceof esm.NumberOutOfRangeError, true);
assertEqual('CommonJS errors subpath', cjsErrors.NumberOutOfRangeError.name, 'NumberOutOfRangeError');
assertEqual(
  'ESM compose-mode compatibility',
  typeof esm.toWords(enUsMaximum + 1n, { localeCode: 'en-US', rangeMode: 'compose' }),
  'string',
);

const cliPath = fileURLToPath(new URL('../dist/cjs/cli.js', import.meta.url));
const cliOutput = execFileSync(process.execPath, [cliPath, '--locale', 'en-US', '--', '-5'], {
  encoding: 'utf8',
}).trim();
assertEqual('CLI executable', cliOutput, 'Minus Five');

/** @param {string} label @param {string} fileName @param {object} options @param {string} expected */
function assertUmdBundle(label, fileName, options, expected) {
  const context = {};
  const bundlePath = fileURLToPath(new URL(`../dist/umd/${fileName}`, import.meta.url));
  vm.runInNewContext(fs.readFileSync(bundlePath, 'utf8'), context, { filename: bundlePath });
  const browserToWords = new context.ToWords(options);
  assertEqual(label, browserToWords.convert(42), expected);
}

if (!process.argv.includes('--skip-umd')) {
  assertUmdBundle('full UMD browser bundle', 'to-words.min.js', { localeCode: 'ne-NP' }, 'बयालीस');
  assertUmdBundle('single-locale UMD browser bundle', 'ne-NP.min.js', {}, 'बयालीस');
}

console.log('\n✅ All runtime smoke checks passed');

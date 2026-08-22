/** Runtime smoke test for the compiled ESM, CommonJS, per-locale, and CLI entry points. */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`FAIL [${label}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  console.log(`  ✓ ${label}: ${actual}`);
}

const esm = await import('../dist/esm/ToWords.js');
const cjs = await import('../dist/cjs/ToWords.js');
const esmLocale = await import('../dist/esm/locales/en-US.js');
const cjsLocale = await import('../dist/cjs/locales/en-US.js');
const esmManifest = await import('to-words/manifest');
const esmContract = await import('to-words/locale-contract');
const require = createRequire(import.meta.url);
const cjsManifest = require('to-words/manifest');
const cjsContract = require('to-words/locale-contract');

assertEqual('ESM root export', esm.toWords(1234, { localeCode: 'en-IN' }), 'One Thousand Two Hundred Thirty Four');
assertEqual('CommonJS root export', cjs.toOrdinal(3, { localeCode: 'en-IN' }), 'Third');
assertEqual('ESM locale export', esmLocale.toOrdinal(21), 'Twenty First');
assertEqual('CommonJS locale export', cjsLocale.toCurrency('1.01'), 'One Dollar And One Cent Only');
assertEqual('ESM manifest export', esmManifest.SUPPORTED_LOCALES.length, 135);
assertEqual('CommonJS manifest export', cjsManifest.getLocaleCapabilities('zh-CN').formal, true);
assertEqual('ESM locale contract export', esmContract.validateLocaleConfig(new esmLocale.default().config).length, 0);
assertEqual(
  'CommonJS locale contract export',
  cjsContract.deriveLocaleCapabilities(new esmLocale.default().config).decimals.fraction,
  true,
);

const cliPath = fileURLToPath(new URL('../dist/cjs/cli.js', import.meta.url));
const cliOutput = execFileSync(process.execPath, [cliPath, '--locale', 'en-US', '--', '-5'], {
  encoding: 'utf8',
}).trim();
assertEqual('CLI executable', cliOutput, 'Minus Five');

console.log('\n✅ All runtime smoke checks passed');

/**
 * Runtime smoke test — run locally after a build to verify the compiled ESM output:
 *   node scripts/runtime-smoke.mjs
 *   bun run scripts/runtime-smoke.mjs
 *   deno run --allow-read --allow-env scripts/runtime-smoke.mjs
 */
import { toWords, toOrdinal, toCurrency } from '../dist/esm/ToWords.js';

function assert(label, value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`FAIL [${label}]: got ${JSON.stringify(value)}`);
  }
  console.log(`  ✓ ${label}: ${value}`);
}

assert('toWords(1234)', toWords(1234, { localeCode: 'en-IN' }));
assert('toOrdinal(3)', toOrdinal(3, { localeCode: 'en-IN' }));
assert('toCurrency(10.5)', toCurrency(10.5, { localeCode: 'en-IN' }));

console.log('\n✅ All runtime smoke checks passed');

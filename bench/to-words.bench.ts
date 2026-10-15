/**
 * Comprehensive benchmark.
 *
 * Measures performance across multiple locales with various number types:
 * - Small, medium, and large integers
 * - Currency conversion
 * - BigInt values (including beyond MAX_SAFE_INTEGER)
 *
 * Vitest 5 runs benchmarks through the `bench` test-context fixture: each group is one `test()`
 * whose benchmarks are compared with `bench.compare()`. Run with `npm run bench`.
 */

import { describe, test } from 'vitest';
import { ToWords } from '../src/ToWords';
import type { LocaleCode } from '../src/locale-manifest.js';
import type { ConverterOptions } from '../src/types';

// =============================================================================
// Configuration
// =============================================================================

const testValues = {
  small: 42,
  medium: 12345,
  large: 900719925474099,
  maxSafe: Number.MAX_SAFE_INTEGER,
};

const bigIntValues = {
  medium: 12345n,
  beyondSafe: 9007199254740992n, // MAX_SAFE_INTEGER + 1
  veryLarge: 123456789012345678901234567890n,
};

// Locales to benchmark (representative sample)
const locales = ['en-IN', 'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'ar-AE', 'hi-IN', 'pt-BR', 'ko-KR'];

const currencyOptions: ConverterOptions = { currency: true };
// 30 digits is above most locales' verified range, so compose the scale words as before the range check.
const composeOptions: ConverterOptions = { rangeMode: 'compose' };

let sink: string = '';

// =============================================================================
// Per-locale Benchmarks
// =============================================================================

describe('Per-locale', () => {
  for (const localeCode of locales) {
    test(`${localeCode}`, async ({ bench }) => {
      const toWords = new ToWords({ localeCode: localeCode as LocaleCode });

      await bench.compare(
        bench(`small int (${testValues.small})`, () => {
          sink = toWords.convert(testValues.small);
        }),
        bench(`medium int (${testValues.medium})`, () => {
          sink = toWords.convert(testValues.medium);
        }),
        bench(`large int`, () => {
          sink = toWords.convert(testValues.large);
        }),
        bench(`currency`, () => {
          sink = toWords.convert(1234.56, currencyOptions);
        }),
        bench(`BigInt medium`, () => {
          sink = toWords.convert(bigIntValues.medium);
        }),
        bench(`BigInt large`, () => {
          sink = toWords.convert(bigIntValues.veryLarge, composeOptions);
        }),
      );
    });
  }
});

// =============================================================================
// Stress Tests (en-IN vs en-US comparison)
// =============================================================================

describe('Stress', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  test('MAX_SAFE_INTEGER', async ({ bench }) => {
    await bench.compare(
      bench('en-IN', () => {
        sink = enIn.convert(testValues.maxSafe);
      }),
      bench('en-US', () => {
        sink = enUs.convert(testValues.maxSafe);
      }),
    );
  });

  test('BigInt beyond safe', async ({ bench }) => {
    await bench.compare(
      bench('en-IN', () => {
        sink = enIn.convert(bigIntValues.beyondSafe);
      }),
      bench('en-US', () => {
        sink = enUs.convert(bigIntValues.beyondSafe);
      }),
    );
  });

  test('Very large BigInt', async ({ bench }) => {
    await bench.compare(
      bench('en-IN', () => {
        sink = enIn.convert(bigIntValues.veryLarge, composeOptions);
      }),
      bench('en-US', () => {
        sink = enUs.convert(bigIntValues.veryLarge, composeOptions);
      }),
    );
  });
});

test('Precision-preserving inputs', async ({ bench }) => {
  const enIn = new ToWords({ localeCode: 'en-IN' });

  await bench.compare(
    bench('integer string beyond safe', () => {
      sink = enIn.convert('9007199254740993');
    }),
    bench('exact decimal currency rounding', () => {
      sink = enIn.convert('2.675', currencyOptions);
    }),
  );
});

// =============================================================================
// Instance Creation Overhead
// =============================================================================

test('Instance creation', async ({ bench }) => {
  const existingInstance = new ToWords({ localeCode: 'en-IN' });

  await bench.compare(
    bench('create + convert', () => {
      const instance = new ToWords({ localeCode: 'en-IN' });
      sink = instance.convert(12345);
    }),
    bench('reuse instance', () => {
      sink = existingInstance.convert(12345);
    }),
  );
});

// Prevent tree-shaking
export { sink };

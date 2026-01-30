/**
 * Comprehensive benchmark.
 *
 * Measures performance across multiple locales with various number types:
 * - Small, medium, and large integers
 * - Currency conversion
 * - BigInt values (including beyond MAX_SAFE_INTEGER)
 *
 */

import { bench, describe } from 'vitest';
import { ToWords } from '../src/ToWords';
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

let sink: string = '';

// =============================================================================
// Per-locale Benchmarks
// =============================================================================

for (const localeCode of locales) {
  describe(`${localeCode}`, () => {
    const toWords = new ToWords({ localeCode });

    bench(`small int (${testValues.small})`, () => {
      sink = toWords.convert(testValues.small);
    });

    bench(`medium int (${testValues.medium})`, () => {
      sink = toWords.convert(testValues.medium);
    });

    bench(`large int`, () => {
      sink = toWords.convert(testValues.large);
    });

    bench(`currency`, () => {
      sink = toWords.convert(1234.56, currencyOptions);
    });

    bench(`BigInt medium`, () => {
      sink = toWords.convert(bigIntValues.medium);
    });

    bench(`BigInt large`, () => {
      sink = toWords.convert(bigIntValues.veryLarge);
    });
  });
}

// =============================================================================
// Stress Tests (en-IN vs en-US comparison)
// =============================================================================

describe('Stress: MAX_SAFE_INTEGER', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  bench('en-IN', () => {
    sink = enIn.convert(testValues.maxSafe);
  });

  bench('en-US', () => {
    sink = enUs.convert(testValues.maxSafe);
  });
});

describe('Stress: BigInt beyond safe', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  bench('en-IN', () => {
    sink = enIn.convert(bigIntValues.beyondSafe);
  });

  bench('en-US', () => {
    sink = enUs.convert(bigIntValues.beyondSafe);
  });
});

describe('Stress: Very large BigInt', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  bench('en-IN', () => {
    sink = enIn.convert(bigIntValues.veryLarge);
  });

  bench('en-US', () => {
    sink = enUs.convert(bigIntValues.veryLarge);
  });
});

// =============================================================================
// Instance Creation Overhead
// =============================================================================

describe('Instance creation', () => {
  bench('create + convert', () => {
    const instance = new ToWords({ localeCode: 'en-IN' });
    sink = instance.convert(12345);
  });

  const existingInstance = new ToWords({ localeCode: 'en-IN' });
  bench('reuse instance', () => {
    sink = existingInstance.convert(12345);
  });
});

// Prevent tree-shaking
export { sink };

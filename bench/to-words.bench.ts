/**
 * Comprehensive benchmark.
 *
 * Sections
 * --------
 * 1. Per-locale  – class instance methods: convert (int/decimal/BigInt),
 *                  toOrdinal, toCurrency across a representative locale sample.
 * 2. Functional API – module-level helpers toWords / toOrdinal / toCurrency
 *                     (they maintain an internal instance cache).
 * 3. Class vs Functional API – head-to-head on the same input to expose the
 *                     per-call overhead of the functional helper dispatch path.
 * 4. Stress / large inputs – MAX_SAFE_INTEGER, beyond-safe BigInt, very large
 *                     BigInt; en-IN vs en-US side-by-side.
 * 5. Cache warm-up cost – first call (cold locale cache) vs subsequent calls
 *                     (warm cache) to show locale-initialisation overhead.
 * 6. Locale-specific functional API – helpers imported directly from an individual
 *                     locale module (e.g. `to-words/en-IN`). These call a module-level
 *                     singleton with no Map lookup, so they should be fastest of all.
 *                     Head-to-head vs bundle functional helpers and class instance.
 */

import { bench, describe } from 'vitest';
import { ToWords, toWords, toOrdinal, toCurrency } from '../src/ToWords';
import { toWords as enInToWords, toOrdinal as enInToOrdinal, toCurrency as enInToCurrency } from '../src/locales/en-IN';
import { toWords as enUsToWords, toOrdinal as enUsToOrdinal, toCurrency as enUsToCurrency } from '../src/locales/en-US';
import type { ConverterOptions } from '../src/types';

// =============================================================================
// Configuration
// =============================================================================

const testValues = {
  small: 42,
  medium: 12345,
  decimal: 1234.56, // typical currency input
  negative: -987,
  ordinal: 21, // "Twenty First" — small ordinal representative
  large: 900719925474099,
  maxSafe: Number.MAX_SAFE_INTEGER,
};

const bigIntValues = {
  medium: 12345n,
  beyondSafe: 9007199254740992n, // MAX_SAFE_INTEGER + 1
  veryLarge: 123456789012345678901234567890n,
};

// Representative locale sample covering different word-building strategies:
// South-Asian (en-IN, hi-IN), Western (en-US, en-GB), Romance (es-ES, fr-FR),
// Arabic (ar-AE), East-Asian (ko-KR), Brazilian Portuguese (pt-BR),
// Latin-American Spanish (es-MX).
const locales = ['en-IN', 'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'ar-AE', 'hi-IN', 'pt-BR', 'ko-KR'];

const currencyOptions: ConverterOptions = { currency: true };

let sink: string = '';

// =============================================================================
// 1. Per-locale Benchmarks (class instance methods)
// =============================================================================

for (const localeCode of locales) {
  describe(`[class] ${localeCode}`, () => {
    const instance = new ToWords({ localeCode });

    // --- convert() ---
    bench(`convert · small int (${testValues.small})`, () => {
      sink = instance.convert(testValues.small);
    });

    bench(`convert · medium int (${testValues.medium})`, () => {
      sink = instance.convert(testValues.medium);
    });

    bench(`convert · decimal (${testValues.decimal})`, () => {
      sink = instance.convert(testValues.decimal);
    });

    bench(`convert · negative (${testValues.negative})`, () => {
      sink = instance.convert(testValues.negative);
    });

    bench(`convert · large int`, () => {
      sink = instance.convert(testValues.large);
    });

    bench(`convert · BigInt medium`, () => {
      sink = instance.convert(bigIntValues.medium);
    });

    bench(`convert · BigInt large`, () => {
      sink = instance.convert(bigIntValues.veryLarge);
    });

    // --- toOrdinal() ---
    bench(`toOrdinal · small (${testValues.ordinal})`, () => {
      sink = instance.toOrdinal(testValues.ordinal);
    });

    bench(`toOrdinal · medium (${testValues.medium})`, () => {
      sink = instance.toOrdinal(testValues.medium);
    });

    // --- toCurrency() / convert with currency flag ---
    bench(`toCurrency · decimal (${testValues.decimal})`, () => {
      sink = instance.convert(testValues.decimal, currencyOptions);
    });

    bench(`toCurrency · integer (${testValues.medium})`, () => {
      sink = instance.convert(testValues.medium, currencyOptions);
    });
  });
}

// =============================================================================
// 2. Functional API helpers (toWords / toOrdinal / toCurrency)
//    These maintain a module-level instance cache keyed by locale code.
// =============================================================================

describe('[functional API] en-IN', () => {
  const opts = { localeCode: 'en-IN' };

  bench(`toWords · medium int (${testValues.medium})`, () => {
    sink = toWords(testValues.medium, opts);
  });

  bench(`toWords · decimal (${testValues.decimal})`, () => {
    sink = toWords(testValues.decimal, opts);
  });

  bench(`toWords · large int`, () => {
    sink = toWords(testValues.large, opts);
  });

  bench(`toWords · BigInt large`, () => {
    sink = toWords(bigIntValues.veryLarge, opts);
  });

  bench(`toOrdinal · small (${testValues.ordinal})`, () => {
    sink = toOrdinal(testValues.ordinal, opts);
  });

  bench(`toOrdinal · medium (${testValues.medium})`, () => {
    sink = toOrdinal(testValues.medium, opts);
  });

  bench(`toCurrency · decimal (${testValues.decimal})`, () => {
    sink = toCurrency(testValues.decimal, opts);
  });

  bench(`toCurrency · integer (${testValues.medium})`, () => {
    sink = toCurrency(testValues.medium, opts);
  });
});

describe('[functional API] en-US', () => {
  const opts = { localeCode: 'en-US' };

  bench(`toWords · medium int (${testValues.medium})`, () => {
    sink = toWords(testValues.medium, opts);
  });

  bench(`toWords · decimal (${testValues.decimal})`, () => {
    sink = toWords(testValues.decimal, opts);
  });

  bench(`toOrdinal · small (${testValues.ordinal})`, () => {
    sink = toOrdinal(testValues.ordinal, opts);
  });

  bench(`toCurrency · decimal (${testValues.decimal})`, () => {
    sink = toCurrency(testValues.decimal, opts);
  });
});

// =============================================================================
// 3. Class vs Functional API — head-to-head (en-IN, medium int)
//    Isolates the dispatch overhead of the functional helper path
//    (module-level Map lookup) vs a direct method call on a held instance.
// =============================================================================

describe('Class vs Functional API · en-IN · convert/toWords', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const opts = { localeCode: 'en-IN' };

  bench('class · instance.convert()', () => {
    sink = classInstance.convert(testValues.medium);
  });

  bench('functional · toWords()', () => {
    sink = toWords(testValues.medium, opts);
  });
});

describe('Class vs Functional API · en-IN · toOrdinal', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const opts = { localeCode: 'en-IN' };

  bench('class · instance.toOrdinal()', () => {
    sink = classInstance.toOrdinal(testValues.ordinal);
  });

  bench('functional · toOrdinal()', () => {
    sink = toOrdinal(testValues.ordinal, opts);
  });
});

describe('Class vs Functional API · en-IN · toCurrency', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const opts = { localeCode: 'en-IN' };

  bench('class · instance.convert({ currency: true })', () => {
    sink = classInstance.convert(testValues.decimal, currencyOptions);
  });

  bench('functional · toCurrency()', () => {
    sink = toCurrency(testValues.decimal, opts);
  });
});

// =============================================================================
// 4. Stress Tests — large inputs, en-IN vs en-US
// =============================================================================

describe('Stress: MAX_SAFE_INTEGER → en-IN vs en-US', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  bench('en-IN', () => {
    sink = enIn.convert(testValues.maxSafe);
  });

  bench('en-US', () => {
    sink = enUs.convert(testValues.maxSafe);
  });
});

describe('Stress: BigInt beyond MAX_SAFE_INTEGER → en-IN vs en-US', () => {
  const enIn = new ToWords({ localeCode: 'en-IN' });
  const enUs = new ToWords({ localeCode: 'en-US' });

  bench('en-IN', () => {
    sink = enIn.convert(bigIntValues.beyondSafe);
  });

  bench('en-US', () => {
    sink = enUs.convert(bigIntValues.beyondSafe);
  });
});

describe('Stress: very large BigInt (30 digits) → en-IN vs en-US', () => {
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
// 5. Cache warm-up cost
//    Measures how much locale initialisation adds to the very first call.
//    Each "cold" bench creates a brand-new instance (triggers locale cache
//    build); the "warm" bench reuses a single pre-created instance.
// =============================================================================

describe('Cache warm-up · en-IN · convert', () => {
  bench('cold — new instance each call', () => {
    const instance = new ToWords({ localeCode: 'en-IN' });
    sink = instance.convert(testValues.medium);
  });

  const warm = new ToWords({ localeCode: 'en-IN' });
  bench('warm — reuse instance', () => {
    sink = warm.convert(testValues.medium);
  });
});

describe('Cache warm-up · en-IN · toOrdinal', () => {
  bench('cold — new instance each call', () => {
    const instance = new ToWords({ localeCode: 'en-IN' });
    sink = instance.toOrdinal(testValues.ordinal);
  });

  const warm = new ToWords({ localeCode: 'en-IN' });
  bench('warm — reuse instance', () => {
    sink = warm.toOrdinal(testValues.ordinal);
  });
});

describe('Cache warm-up · en-IN · toCurrency', () => {
  bench('cold — new instance each call', () => {
    const instance = new ToWords({ localeCode: 'en-IN' });
    sink = instance.convert(testValues.decimal, currencyOptions);
  });

  const warm = new ToWords({ localeCode: 'en-IN' });
  bench('warm — reuse instance', () => {
    sink = warm.convert(testValues.decimal, currencyOptions);
  });
});

// =============================================================================
// 6. Locale-specific Functional API
//    Imported directly from individual locale modules — e.g. `to-words/en-IN`.
//    These bind to a module-level singleton with no Map lookup overhead,
//    making them the lowest-overhead functional style available.
// =============================================================================

describe('[locale functional] en-IN', () => {
  bench(`toWords · medium int (${testValues.medium})`, () => {
    sink = enInToWords(testValues.medium);
  });

  bench(`toWords · decimal (${testValues.decimal})`, () => {
    sink = enInToWords(testValues.decimal);
  });

  bench(`toWords · large int`, () => {
    sink = enInToWords(testValues.large);
  });

  bench(`toWords · BigInt large`, () => {
    sink = enInToWords(bigIntValues.veryLarge);
  });

  bench(`toOrdinal · small (${testValues.ordinal})`, () => {
    sink = enInToOrdinal(testValues.ordinal);
  });

  bench(`toOrdinal · medium (${testValues.medium})`, () => {
    sink = enInToOrdinal(testValues.medium);
  });

  bench(`toCurrency · decimal (${testValues.decimal})`, () => {
    sink = enInToCurrency(testValues.decimal);
  });

  bench(`toCurrency · integer (${testValues.medium})`, () => {
    sink = enInToCurrency(testValues.medium);
  });
});

describe('[locale functional] en-US', () => {
  bench(`toWords · medium int (${testValues.medium})`, () => {
    sink = enUsToWords(testValues.medium);
  });

  bench(`toWords · decimal (${testValues.decimal})`, () => {
    sink = enUsToWords(testValues.decimal);
  });

  bench(`toOrdinal · small (${testValues.ordinal})`, () => {
    sink = enUsToOrdinal(testValues.ordinal);
  });

  bench(`toCurrency · decimal (${testValues.decimal})`, () => {
    sink = enUsToCurrency(testValues.decimal);
  });
});

// =============================================================================
// 7. Three-way comparison: class instance vs bundle functional vs locale functional
//    All on the same input (en-IN, medium int) to isolate dispatch overhead.
// =============================================================================

describe('Dispatch comparison · en-IN · toWords/convert', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const bundleOpts = { localeCode: 'en-IN' };

  bench('class · instance.convert()', () => {
    sink = classInstance.convert(testValues.medium);
  });

  bench('bundle functional · toWords() [Map lookup]', () => {
    sink = toWords(testValues.medium, bundleOpts);
  });

  bench('locale functional · toWords() [direct singleton]', () => {
    sink = enInToWords(testValues.medium);
  });
});

describe('Dispatch comparison · en-IN · toOrdinal', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const bundleOpts = { localeCode: 'en-IN' };

  bench('class · instance.toOrdinal()', () => {
    sink = classInstance.toOrdinal(testValues.ordinal);
  });

  bench('bundle functional · toOrdinal() [Map lookup]', () => {
    sink = toOrdinal(testValues.ordinal, bundleOpts);
  });

  bench('locale functional · toOrdinal() [direct singleton]', () => {
    sink = enInToOrdinal(testValues.ordinal);
  });
});

describe('Dispatch comparison · en-IN · toCurrency', () => {
  const classInstance = new ToWords({ localeCode: 'en-IN' });
  const bundleOpts = { localeCode: 'en-IN' };

  bench('class · instance.convert({ currency: true })', () => {
    sink = classInstance.convert(testValues.decimal, currencyOptions);
  });

  bench('bundle functional · toCurrency() [Map lookup]', () => {
    sink = toCurrency(testValues.decimal, bundleOpts);
  });

  bench('locale functional · toCurrency() [direct singleton]', () => {
    sink = enInToCurrency(testValues.decimal);
  });
});

// Prevent tree-shaking
export { sink };

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import daDk from '../src/locales/da-DK';

const localeCode = 'da-DK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(daDk);
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'Nul'],
  [137, 'Hundrede Syvogtredive'],
  [700, 'Syv Hundrede'],
  [1100, 'Tusind Hundrede'],
  [4680, 'Fire Tusind Seks Hundrede Firs'],
  [63892, 'Treogtres Tusind Otte Hundrede Tooghalvfems'],
  [86100, 'Seksogfirs Tusind Hundrede'],
  [792581, 'Syv Hundrede Tooghalvfems Tusind Fem Hundrede Enogfirs'],
  [2741034, 'To Million Syv Hundrede Enogfyrre Tusind Fireogtredive'],
  [86429753, 'Seksogfirs Million Fire Hundrede Niogtyve Tusind Syv Hundrede Treoghalvtreds'],
  [975310864, 'Ni Hundrede Femoghalvfjerds Million Tre Hundrede Ti Tusind Otte Hundrede Fireogtres'],
  [9876543210, 'Ni Milliard Otte Hundrede Seksoghalvfjerds Million Fem Hundrede Treogfyrre Tusind To Hundrede Ti'],
  [98765432101, 'Otteoghalvfems Milliard Syv Hundrede Femogtres Million Fire Hundrede Toogtredive Tusind Hundrede En'],
  [
    987654321012,
    'Ni Hundrede Syvogfirs Milliard Seks Hundrede Fireoghalvtreds Million Tre Hundrede Enogtyve Tusind Tolv',
  ],
  [
    9876543210123,
    'Ni Billion Otte Hundrede Seksoghalvfjerds Milliard Fem Hundrede Treogfyrre Million To Hundrede Ti Tusind Hundrede Treogtyve',
  ],
  [
    98765432101234,
    'Otteoghalvfems Billion Syv Hundrede Femogtres Milliard Fire Hundrede Toogtredive Million Hundrede En Tusind To Hundrede Fireogtredive',
  ],
];

describe('Test Integers with options = {}', () => {
  test.concurrent.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) {
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Kroner`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Kroner`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Kroner`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Kroner`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Kroner`;
  });

  test.concurrent.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'Nul'],
  [0.04, 'Nul Komma Nul Fire'],
  [0.0468, 'Nul Komma Nul Fire Seks Otte'],
  [0.4, 'Nul Komma Fire'],
  [0.973, 'Nul Komma Ni Hundrede Treoghalvfjerds'],
  [0.999, 'Nul Komma Ni Hundrede Nioghalvfems'],
  [37.06, 'Syvogtredive Komma Nul Seks'],
  [37.068, 'Syvogtredive Komma Nul Seks Otte'],
  [37.68, 'Syvogtredive Komma Otteogtres'],
  [37.683, 'Syvogtredive Komma Seks Hundrede Treogfirs'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Nul Kroner`],
  [0.04, `Nul Kroner Og Fire Øre`],
  [0.0468, `Nul Kroner Og Fem Øre`],
  [0.4, `Nul Kroner Og Fyrre Øre`],
  [0.973, `Nul Kroner Og Syvoghalvfems Øre`],
  [0.999, `En Krone`],
  [37.06, `Syvogtredive Kroner Og Seks Øre`],
  [37.068, `Syvogtredive Kroner Og Syv Øre`],
  [37.68, `Syvogtredive Kroner Og Otteogtres Øre`],
  [37.683, `Syvogtredive Kroner Og Otteogtres Øre`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace(`Nul Kroner Og `, '');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `Nul Kroner`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Og.*`), '');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testOrdinals: [number, string][] = [
  // Numbers 0-10
  [0, 'Nulte'],
  [1, 'Første'],
  [2, 'Anden'],
  [3, 'Tredje'],
  [4, 'Fjerde'],
  [5, 'Femte'],
  [6, 'Sjette'],
  [7, 'Syvende'],
  [8, 'Ottende'],
  [9, 'Niende'],
  [10, 'Tiende'],
  [11, 'Ellevte'],
  [12, 'Tolvte'],
  [13, 'Trettende'],
  [14, 'Fjortende'],
  [15, 'Femtende'],
  [16, 'Sekstende'],
  [17, 'Syttende'],
  [18, 'Attende'],
  [19, 'Nittende'],
  [20, 'Tyvende'],
  // Composite numbers (21, 22, etc.)
  [21, 'Enogtyvende'],
  [22, 'Toogtyvende'],
  [23, 'Treogtyvende'],
  [24, 'Fireogtyvende'],
  [25, 'Femogtyvende'],
  // Tens
  [30, 'Tredivte'],
  [40, 'Fyrretyvende'],
  [50, 'Halvtredsende'],
  [60, 'Tresende'],
  [70, 'Halvfjerdsende'],
  [80, 'Firsende'],
  [90, 'Halvfemsende'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundredende'],
  [200, 'To Hundredende'],
  [300, 'Tre Hundredende'],
  [1000, 'Tusindende'],
  [2000, 'To Tusindende'],
  [1000000, 'En Millionte'],
  [2000000, 'To Millionte'],
  // Complex numbers
  [101, 'Hundrede Første'],
  [102, 'Hundrede Anden'],
  [111, 'Hundrede Ellevte'],
  [123, 'Hundrede Treogtyvende'],
  [150, 'Hundrede Halvtredsende'],
  [1001, 'Tusind Første'],
  [1234, 'Tusind To Hundrede Fireogtredivte'],
  [1500, 'Tusind Fem Hundredende'],
  [10000, 'Ti Tusindende'],
  [100000, 'Hundrede Tusindende'],
  [1000001, 'En Million Første'],
];

describe('Test Ordinals with toOrdinal()', () => {
  test.concurrent.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for small decimal numbers', () => {
    expect(() => toWords.toOrdinal(0.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for large decimal numbers', () => {
    expect(() => toWords.toOrdinal(100.25)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Danish-specific numbers', () => {
  test('Single Krone (1)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('En Krone');
  });

  test('Two Kroner', () => {
    expect(toWords.convert(2, { currency: true })).toBe('To Kroner');
  });

  test('Teens (11-19)', () => {
    expect(toWords.convert(11)).toBe('Elleve');
    expect(toWords.convert(12)).toBe('Tolv');
    expect(toWords.convert(13)).toBe('Tretten');
    expect(toWords.convert(14)).toBe('Fjorten');
    expect(toWords.convert(15)).toBe('Femten');
    expect(toWords.convert(16)).toBe('Seksten');
    expect(toWords.convert(17)).toBe('Sytten');
    expect(toWords.convert(18)).toBe('Atten');
    expect(toWords.convert(19)).toBe('Nitten');
  });

  test('Twenties (Danish style: one-and-twenty)', () => {
    expect(toWords.convert(20)).toBe('Tyve');
    expect(toWords.convert(21)).toBe('Enogtyve');
    expect(toWords.convert(22)).toBe('Toogtyve');
    expect(toWords.convert(25)).toBe('Femogtyve');
    expect(toWords.convert(28)).toBe('Otteogtyve');
  });

  test('Special Danish tens (vigesimal system)', () => {
    expect(toWords.convert(50)).toBe('Halvtreds');
    expect(toWords.convert(60)).toBe('Tres');
    expect(toWords.convert(70)).toBe('Halvfjerds');
    expect(toWords.convert(80)).toBe('Firs');
    expect(toWords.convert(90)).toBe('Halvfems');
  });

  test('Compound numbers with special tens', () => {
    expect(toWords.convert(51)).toBe('Enoghalvtreds');
    expect(toWords.convert(63)).toBe('Treogtres');
    expect(toWords.convert(74)).toBe('Fireoghalvfjerds');
    expect(toWords.convert(85)).toBe('Femogfirs');
    expect(toWords.convert(99)).toBe('Nioghalvfems');
  });

  test('Large numbers', () => {
    expect(toWords.convert(1000000)).toBe('En Million');
    expect(toWords.convert(1000000000)).toBe('En Milliard');
    expect(toWords.convert(2000000)).toBe('To Million');
    expect(toWords.convert(2000000000)).toBe('To Milliard');
  });
});

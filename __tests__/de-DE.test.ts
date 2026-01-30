import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import deDe from '../src/locales/de-DE.js';
import { ToWords as LocaleToWords } from '../src/locales/de-DE.js';

const localeCode = 'de-DE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(deDe);
  });

  describe('Test Locale ToWords', () => {
    test('ToWords from locale file works correctly', () => {
      const tw = new LocaleToWords();
      expect(tw.convert(1)).toBeDefined();
      expect(typeof tw.convert(123)).toBe('string');
    });
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
  [0, 'Null'],
  [1, 'Eins'],
  [2, 'Zwei'],
  [3, 'Drei'],
  [4, 'Vier'],
  [5, 'Fünf'],
  [6, 'Sechs'],
  [7, 'Sieben'],
  [8, 'Acht'],
  [9, 'Neun'],
  [10, 'Zehn'],
  [11, 'Elf'],
  [12, 'Zwölf'],
  [13, 'Dreizehn'],
  [14, 'Vierzehn'],
  [15, 'Fünfzehn'],
  [16, 'Sechzehn'],
  [17, 'Siebzehn'],
  [18, 'Achtzehn'],
  [19, 'Neunzehn'],
  [20, 'Zwanzig'],
  [21, 'Einundzwanzig'],
  [22, 'Zweiundzwanzig'],
  [30, 'Dreißig'],
  [31, 'Einunddreißig'],
  [40, 'Vierzig'],
  [42, 'Zweiundvierzig'],
  [50, 'Fünfzig'],
  [60, 'Sechzig'],
  [70, 'Siebzig'],
  [80, 'Achtzig'],
  [90, 'Neunzig'],
  [99, 'Neunundneunzig'],
  [100, 'Hundert'],
  [137, 'Hundert Siebenunddreißig'],
  [200, 'Zwei Hundert'],
  [700, 'Sieben Hundert'],
  [1000, 'Tausend'],
  [1100, 'Tausend Hundert'],
  [4680, 'Vier Tausend Sechs Hundert Achtzig'],
  [63892, 'Dreiundsechzig Tausend Acht Hundert Zweiundneunzig'],
  [86100, 'Sechsundachtzig Tausend Hundert'],
  [792581, 'Sieben Hundert Zweiundneunzig Tausend Fünf Hundert Einundachtzig'],
  [1000000, 'Eins Million'],
  [2000000, 'Zwei Million'],
  [2741034, 'Zwei Million Sieben Hundert Einundvierzig Tausend Vierunddreißig'],
  [86429753, 'Sechsundachtzig Million Vier Hundert Neunundzwanzig Tausend Sieben Hundert Dreiundfünfzig'],
  [975310864, 'Neun Hundert Fünfundsiebzig Million Drei Hundert Zehn Tausend Acht Hundert Vierundsechzig'],
  [1000000000, 'Eins Milliarde'],
  [
    9876543210,
    'Neun Milliarde Acht Hundert Sechsundsiebzig Million Fünf Hundert Dreiundvierzig Tausend Zwei Hundert Zehn',
  ],
  [
    98765432101,
    'Achtundneunzig Milliarde Sieben Hundert Fünfundsechzig Million Vier Hundert Zweiunddreißig Tausend Hundert Eins',
  ],
  [
    987654321012,
    'Neun Hundert Siebenundachtzig Milliarde Sechs Hundert Vierundfünfzig Million Drei Hundert Einundzwanzig Tausend Zwölf',
  ],
  [
    9876543210123,
    'Neun Billion Acht Hundert Sechsundsiebzig Milliarde Fünf Hundert Dreiundvierzig Million Zwei Hundert Zehn Tausend Hundert Dreiundzwanzig',
  ],
  [
    98765432101234,
    'Achtundneunzig Billion Sieben Hundert Fünfundsechzig Milliarde Vier Hundert Zweiunddreißig Million Hundert Eins Tausend Zwei Hundert Vierunddreißig',
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
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Euro`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Euro`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Euro`;
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
  [0.0, 'Null'],
  [0.04, 'Null Komma Null Vier'],
  [0.0468, 'Null Komma Null Vier Sechs Acht'],
  [0.4, 'Null Komma Vier'],
  [0.973, 'Null Komma Neun Hundert Dreiundsiebzig'],
  [0.999, 'Null Komma Neun Hundert Neunundneunzig'],
  [37.06, 'Siebenunddreißig Komma Null Sechs'],
  [37.068, 'Siebenunddreißig Komma Null Sechs Acht'],
  [37.68, 'Siebenunddreißig Komma Achtundsechzig'],
  [37.683, 'Siebenunddreißig Komma Sechs Hundert Dreiundachtzig'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Null Euro`],
  [0.04, `Null Euro Und Vier Cent`],
  [0.0468, `Null Euro Und Fünf Cent`],
  [0.4, `Null Euro Und Vierzig Cent`],
  [0.973, `Null Euro Und Siebenundneunzig Cent`],
  [0.999, `Eins Euro`],
  [37.06, `Siebenunddreißig Euro Und Sechs Cent`],
  [37.068, `Siebenunddreißig Euro Und Sieben Cent`],
  [37.68, `Siebenunddreißig Euro Und Achtundsechzig Cent`],
  [37.683, `Siebenunddreißig Euro Und Achtundsechzig Cent`],
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
      row[1] = (row[1] as string).replace(`Null Euro Und `, '');
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
      row[1] = `Null Euro`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Euro.*`), 'Euro');
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
  [0, 'Nullte'],
  [1, 'Erste'],
  [2, 'Zweite'],
  [3, 'Dritte'],
  [4, 'Vierte'],
  [5, 'Fünfte'],
  [6, 'Sechste'],
  [7, 'Siebte'],
  [8, 'Achte'],
  [9, 'Neunte'],
  [10, 'Zehnte'],
  [11, 'Elfte'],
  [12, 'Zwölfte'],
  [13, 'Dreizehnte'],
  [14, 'Vierzehnte'],
  [15, 'Fünfzehnte'],
  [16, 'Sechzehnte'],
  [17, 'Siebzehnte'],
  [18, 'Achtzehnte'],
  [19, 'Neunzehnte'],
  [20, 'Zwanzigste'],
  // Composite numbers (21, 22, etc.)
  [21, 'Einundzwanzigste'],
  [22, 'Zweiundzwanzigste'],
  [23, 'Dreiundzwanzigste'],
  [24, 'Vierundzwanzigste'],
  [25, 'Fünfundzwanzigste'],
  // Tens
  [30, 'Dreißigste'],
  [40, 'Vierzigste'],
  [50, 'Fünfzigste'],
  [60, 'Sechzigste'],
  [70, 'Siebzigste'],
  [80, 'Achtzigste'],
  [90, 'Neunzigste'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundertste'],
  [200, 'Zwei Hundertste'],
  [300, 'Drei Hundertste'],
  [1000, 'Tausendste'],
  [2000, 'Zwei Tausendste'],
  [1000000, 'Eins Millionste'],
  [2000000, 'Zwei Millionste'],
  // Complex numbers
  [101, 'Hundert Erste'],
  [102, 'Hundert Zweite'],
  [111, 'Hundert Elfte'],
  [123, 'Hundert Dreiundzwanzigste'],
  [150, 'Hundert Fünfzigste'],
  [1001, 'Tausend Erste'],
  [1234, 'Tausend Zwei Hundert Vierunddreißigste'],
  [1500, 'Tausend Fünf Hundertste'],
  [10000, 'Zehn Tausendste'],
  [100000, 'Hundert Tausendste'],
  [1000001, 'Eins Million Erste'],
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

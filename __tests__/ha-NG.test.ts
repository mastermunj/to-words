import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import haNg from '../src/locales/ha-NG.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ha-NG.js';

const localeCode = 'ha-NG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(haNg);
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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, 'Sifili'],
  [1, 'Ɗaya'],
  [2, 'Biyu'],
  [3, 'Uku'],
  [4, 'Huɗu'],
  [5, 'Biyar'],
  [6, 'Shida'],
  [7, 'Bakwai'],
  [8, 'Takwas'],
  [9, 'Tara'],
  [10, 'Goma'],
  [11, 'Goma Sha Ɗaya'],
  [12, 'Goma Sha Biyu'],
  [13, 'Goma Sha Uku'],
  [14, 'Goma Sha Huɗu'],
  [15, 'Goma Sha Biyar'],
  [16, 'Goma Sha Shida'],
  [17, 'Goma Sha Bakwai'],
  [18, 'Goma Sha Takwas'],
  [19, 'Goma Sha Tara'],
  [20, 'Ashirin'],
  [21, 'Ashirin Da Ɗaya'],
  [22, 'Ashirin Da Biyu'],
  [30, 'Talatin'],
  [35, 'Talatin Da Biyar'],
  [40, "Arba'in"],
  [50, 'Hamsin'],
  [60, 'Sittin'],
  [70, "Saba'in"],
  [80, 'Tamanin'],
  [90, "Casa'in"],
  [99, "Casa'in Da Tara"],
  [100, 'Ɗari'],
  [137, 'Ɗari Da Talatin Da Bakwai'],
  [200, 'Ɗari Biyu'],
  [700, 'Ɗari Bakwai'],
  [1000, 'Dubu'],
  [1100, 'Dubu Da Ɗari'],
  [4680, 'Dubu Huɗu Da Ɗari Shida Da Tamanin'],
  [10000, 'Dubu Goma'],
  [63892, "Dubu Sittin Da Uku Da Ɗari Takwas Da Casa'in Da Biyu"],
  [100000, 'Dubu Ɗari'],
  [1000000, 'Miliyan Ɗaya'],
  [2741034, "Miliyan Biyu Da Dubu Ɗari Bakwai Da Arba'in Da Ɗaya Da Talatin Da Huɗu"],
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
    row[1] = `Ragi ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `Naira ${row[1]} Kawai`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `Naira ${row[1]}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `Naira ${row[1]} Kawai`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Ragi Naira ${row[1]} Kawai`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `Naira ${row[1]} Kawai`;
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

const testFloats: [number, string][] = [
  [0.0, 'Sifili'],
  [0.04, 'Sifili Digo Sifili Huɗu'],
  [0.4, 'Sifili Digo Huɗu'],
  [0.63, 'Sifili Digo Sittin Da Uku'],
  [37.06, 'Talatin Da Bakwai Digo Sifili Shida'],
  [37.68, 'Talatin Da Bakwai Digo Sittin Da Takwas'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Naira Ɗari Da Ashirin Da Uku Kawai`],
    ['123', `Naira Ɗari Da Ashirin Da Uku Kawai`],
    ['123.0', `Naira Ɗari Da Ashirin Da Uku Da Kobo Sifili Kawai`],
    ['123.00', `Naira Ɗari Da Ashirin Da Uku Da Kobo Sifili Kawai`],
    ['0.00', `Naira Sifili Da Kobo Sifili Kawai`],
    ['-123.00', `Ragi Naira Ɗari Da Ashirin Da Uku Da Kobo Sifili Kawai`],
    ['37.68', `Naira Talatin Da Bakwai Da Kobo Sittin Da Takwas Kawai`],
  ];

  test.concurrent.each(testIncludeZeroFractional)('convert %s => %s', (input, expected) => {
    expect(
      toWords.convert(input, {
        currency: true,
        includeZeroFractional: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Naira Sifili Kawai'],
  [0.04, 'Naira Sifili Da Kobo Huɗu Kawai'],
  [0.4, "Naira Sifili Da Kobo Arba'in Kawai"],
  [0.63, 'Naira Sifili Da Kobo Sittin Da Uku Kawai'],
  [0.999, 'Naira Ɗaya Kawai'],
  [37.06, 'Naira Talatin Da Bakwai Da Kobo Shida Kawai'],
  [37.68, 'Naira Talatin Da Bakwai Da Kobo Sittin Da Takwas Kawai'],
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
      row[1] = (row[1] as string).replace('Naira Sifili Da ', '');
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
      row[1] = 'Naira Sifili Kawai';
    } else {
      row[1] = (row[1] as string).replace(/ Da Kobo .*?(?= Kawai$)/u, '');
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

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-10 (special ordinal forms)
  [1, 'Na Farko'],
  [2, 'Na Biyu'],
  [3, 'Na Uku'],
  [4, 'Na Huɗu'],
  [5, 'Na Biyar'],
  [6, 'Na Shida'],
  [7, 'Na Bakwai'],
  [8, 'Na Takwas'],
  [9, 'Na Tara'],
  [10, 'Na Goma'],

  // Numbers 11-19
  [11, 'Na Goma Sha Ɗaya'],
  [12, 'Na Goma Sha Biyu'],
  [13, 'Na Goma Sha Uku'],
  [14, 'Na Goma Sha Huɗu'],
  [15, 'Na Goma Sha Biyar'],
  [16, 'Na Goma Sha Shida'],
  [17, 'Na Goma Sha Bakwai'],
  [18, 'Na Goma Sha Takwas'],
  [19, 'Na Goma Sha Tara'],

  // Tens
  [20, 'Na Ashirin'],
  [21, 'Na Ashirin Da Ɗaya'],
  [22, 'Na Ashirin Da Biyu'],
  [30, 'Na Talatin'],
  [40, "Na Arba'in"],
  [50, 'Na Hamsin'],
  [60, 'Na Sittin'],
  [70, "Na Saba'in"],
  [80, 'Na Tamanin'],
  [90, "Na Casa'in"],

  // Hundreds
  [100, 'Na Ɗari'],
  [101, 'Na Ɗari Da Ɗaya'],
  [200, 'Na Ɗari Biyu'],

  // Thousands
  [1000, 'Na Dubu'],
  [1001, 'Na Dubu Da Ɗaya'],

  // Millions
  [1000000, 'Na Miliyan Ɗaya'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(10.01)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(99.99)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// Powers of Ten Tests
const testPowersOfTen: [number, string][] = [
  [10, 'Goma'],
  [100, 'Ɗari'],
  [1000, 'Dubu'],
  [10000, 'Dubu Goma'],
  [100000, 'Dubu Ɗari'],
  [1000000, 'Miliyan Ɗaya'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Sifili'],
  [1n, 'Ɗaya'],
  [100n, 'Ɗari'],
  [1000n, 'Dubu'],
];

describe('Test BigInt with options = {}', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Ragi Ɗaya'],
  [-100n, 'Ragi Ɗari'],
  [-1000n, 'Ragi Dubu'],
];

describe('Test Negative BigInt with options = {}', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Sifili'],
  ['1', 'Ɗaya'],
  ['100', 'Ɗari'],
  ['-100', 'Ragi Ɗari'],
];

describe('Test String Inputs with options = {}', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Sifili', () => {
    expect(toWords.convert(0)).toBe('Sifili');
  });

  test('convert -0 => Sifili', () => {
    expect(toWords.convert(-0)).toBe('Sifili');
  });

  test('convert 0.0 => Sifili', () => {
    expect(toWords.convert(0.0)).toBe('Sifili');
  });

  test('convert 0n => Sifili', () => {
    expect(toWords.convert(0n)).toBe('Sifili');
  });

  test('convert "0" => Sifili', () => {
    expect(toWords.convert('0')).toBe('Sifili');
  });

  test('convert 0 with currency => Sifili Naira Kawai', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Naira Sifili Kawai');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() matches new ToWords().toOrdinal()', () => {
    const tw = new LocaleToWords();
    expect(localeToOrdinal(1)).toBe(tw.toOrdinal(1));
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Ashirin Da Ɗaya'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Ashirin Da Ɗaya'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Naira Ashirin Da Ɗaya Da Kobo Hamsin Kawai',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'naira ashirin da ɗaya da kobo hamsin kawai',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'NAIRA ASHIRIN DA ƊAYA DA KOBO HAMSIN KAWAI',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'naira ashirin da ɗaya da kobo hamsin kawai',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Naira ashirin da ɗaya da kobo hamsin kawai',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Na Ashirin Da Ɗaya'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'na ashirin da ɗaya',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Ɗaya Digo Ashirin Da Biyar'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Ɗaya Digo Biyu Biyar',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

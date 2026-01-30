import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import haNg from '../src/locales/ha-NG.js';
import { ToWords as LocaleToWords } from '../src/locales/ha-NG.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
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
  [100, 'Ɗari Ɗaya'],
  [137, 'Ɗaya Ɗari Da Talatin Da Bakwai'],
  [200, 'Biyu Ɗari'],
  [700, 'Bakwai Ɗari'],
  [1000, 'Ɗaya Dubu'],
  [1100, 'Ɗaya Dubu Da Ɗari Ɗaya'],
  [4680, 'Huɗu Dubu Da Shida Ɗari Da Tamanin'],
  [10000, 'Goma Dubu'],
  [63892, "Sittin Da Uku Dubu Da Takwas Ɗari Da Casa'in Da Biyu"],
  [100000, 'Ɗari Ɗaya Dubu'],
  [1000000, 'Ɗaya Miliyan'],
  [2741034, "Biyu Miliyan Da Bakwai Ɗari Da Arba'in Da Ɗaya Dubu Da Talatin Da Huɗu"],
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
    row[1] = `${row[1]} Naira Kawai`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Naira`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Naira Kawai`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Ragi ${row[1]} Naira Kawai`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Naira Kawai`;
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

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Sifili Naira Kawai'],
  [0.04, 'Sifili Naira Da Huɗu Kobo Kawai'],
  [0.4, "Sifili Naira Da Arba'in Kobo Kawai"],
  [0.63, 'Sifili Naira Da Sittin Da Uku Kobo Kawai'],
  [0.999, 'Ɗaya Naira Kawai'],
  [37.06, 'Talatin Da Bakwai Naira Da Shida Kobo Kawai'],
  [37.68, 'Talatin Da Bakwai Naira Da Sittin Da Takwas Kobo Kawai'],
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
      row[1] = (row[1] as string).replace('Sifili Naira Da ', '');
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
      row[1] = 'Sifili Naira Kawai';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Da [\\w'ɗƊ]+(?: Da [\\w'ɗƊ]+)* Kobo`), '');
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
  [21, 'Ashirin Da Na Farko'],
  [22, 'Ashirin Da Na Biyu'],
  [30, 'Na Talatin'],
  [40, "Na Arba'in"],
  [50, 'Na Hamsin'],
  [60, 'Na Sittin'],
  [70, "Na Saba'in"],
  [80, 'Na Tamanin'],
  [90, "Na Casa'in"],

  // Hundreds
  [100, 'Na Ɗari Ɗaya'],
  [101, 'Ɗaya Ɗari Da Na Farko'],
  [200, 'Biyu Na Ɗari'],

  // Thousands
  [1000, 'Ɗaya Na Dubu'],
  [1001, 'Ɗaya Dubu Da Na Farko'],

  // Millions
  [1000000, 'Ɗaya Na Miliyan'],
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

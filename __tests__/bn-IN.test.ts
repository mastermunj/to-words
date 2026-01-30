import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import bnIn from '../src/locales/bn-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/bn-IN.js';

const localeCode = 'bn-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(bnIn);
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
  [0, 'শূন্য'],
  [137, 'এক শত সাঁইত্রিশ'],
  [700, 'সাত শত'],
  [4680, 'চার হাজার ছয় শত আশি'],
  [63892, 'তেষট্টি হাজার আট শত বিরানব্বই'],
  [792581, 'সাত লাখ বিরানব্বই হাজার পাঁচ শত একাশী'],
  [2741034, 'সাতাশ লাখ একচল্লিশ হাজার চৌত্রিশ'],
  [86429753, 'আট কোটি চৌষট্টি লাখ ঊনত্রিশ হাজার সাত শত তিপ্পান্ন'],
  [975310864, 'সাতানব্বই কোটি তিপ্পান্ন লাখ দশ হাজার আট শত চৌষট্টি'],
  [9876543210, 'নয় আরব সাতাশি কোটি পঁয়ষট্টি লাখ তেতাল্লিশ হাজার দুই শত দশ'],
  [98765432101, 'আটানব্বই আরব ছিয়াত্তর কোটি চুয়ান্ন লাখ বত্রিশ হাজার এক শত এক'],
  [987654321012, 'নয় খরব সাতাশি আরব পঁয়ষট্টি কোটি তেতাল্লিশ লাখ একুশ হাজার বারো'],
  [9876543210123, 'আটানব্বই খরব ছিয়াত্তর আরব চুয়ান্ন কোটি বত্রিশ লাখ দশ হাজার এক শত তেইশ'],
  [98765432101234, 'নয় নীল সাতাশি খরব পঁয়ষট্টি আরব তেতাল্লিশ কোটি একুশ লাখ এক হাজার দুই শত চৌত্রিশ'],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
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
    row[1] = `ঋণ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'শূন্য'],
  [0.04, 'শূন্য দশমিক শূন্য চার'],
  [0.0468, 'শূন্য দশমিক শূন্য চার ছয় আট'],
  [0.4, 'শূন্য দশমিক চার'],
  [0.63, 'শূন্য দশমিক তেষট্টি'],
  [0.973, 'শূন্য দশমিক নয় শত তিয়াত্তর'],
  [0.999, 'শূন্য দশমিক নয় শত নিরানব্বই'],
  [37.06, 'সাঁইত্রিশ দশমিক শূন্য ছয়'],
  [37.068, 'সাঁইত্রিশ দশমিক শূন্য ছয় আট'],
  [37.68, 'সাঁইত্রিশ দশমিক অষ্টষষ্টি'],
  [37.683, 'সাঁইত্রিশ দশমিক ছয় শত তিরাশী'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'শূন্য টাকা'],
  [0.04, 'শূন্য টাকা এবং চার পয়সা'],
  [0.0468, 'শূন্য টাকা এবং পাঁচ পয়সা'],
  [0.4, 'শূন্য টাকা এবং চল্লিশ পয়সা'],
  [0.63, 'শূন্য টাকা এবং তেষট্টি পয়সা'],
  [0.973, 'শূন্য টাকা এবং সাতানব্বই পয়সা'],
  [0.999, 'এক টাকা'],
  [37.06, 'সাঁইত্রিশ টাকা এবং ছয় পয়সা'],
  [37.068, 'সাঁইত্রিশ টাকা এবং সাত পয়সা'],
  [37.68, 'সাঁইত্রিশ টাকা এবং অষ্টষষ্টি পয়সা'],
  [37.683, 'সাঁইত্রিশ টাকা এবং অষ্টষষ্টি পয়সা'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace(`শূন্য টাকা এবং `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = `শূন্য টাকা`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` এবং [\u0980-\u09FF ]+ পয়সা`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` এবং [\u0980-\u09FF ]+ পয়সা`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});
const testOrdinals: [number, string][] = [
  [0, 'শূন্যতম'],
  [1, 'প্রথম'],
  [2, 'দ্বিতীয়'],
  [3, 'তৃতীয়'],
  [4, 'চতুর্থ'],
  [5, 'পঞ্চম'],
  [6, 'ষষ্ঠ'],
  [7, 'সপ্তম'],
  [8, 'অষ্টম'],
  [9, 'নবম'],
  [10, 'দশম'],
  [11, 'এগারোতম'],
  [12, 'বারোতম'],
  [15, 'পনেরোতম'],
  [20, 'বিশতম'],
  [21, 'একুশতম'],
  [23, 'তেইশতম'],
  [25, 'পঁচিশতম'],
  [30, 'ত্রিশতম'],
  [50, 'পঞ্চাশতম'],
  [99, 'নিরানব্বইতম'],
  [100, 'শততম'],
  [101, 'এক শত প্রথম'],
  [111, 'এক শত এগারোতম'],
  [123, 'এক শত তেইশতম'],
  [500, 'পাঁচ শততম'],
  [1000, 'এক সহস্রতম'],
  [1001, 'এক হাজার প্রথম'],
  [1234, 'এক হাজার দুই শত চৌত্রিশতম'],
  [100000, 'এক লক্ষতম'],
  [10000000, 'এক কোটিতম'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow(/must be non-negative/);
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow(/must be non-negative integers/);
  });
});

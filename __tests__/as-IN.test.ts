import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import asIn from '../src/locales/as-IN.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/as-IN.js';

const localeCode = 'as-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(asIn);
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
  [0, 'শূন্য'],
  [137, 'এক এশ সাতত্ৰিছ'],
  [700, 'সাত এশ'],
  [4680, 'চাৰি হাজাৰ ছয় এশ আশী'],
  [63892, 'তেষষ্ঠি হাজাৰ আঠ এশ বিয়ান্নব্বৈ'],
  [792581, 'সাত লাখ বিয়ান্নব্বৈ হাজাৰ পাঁচ এশ একাশী'],
  [2741034, 'সাতাইছ লাখ একচল্লিছ হাজাৰ চৌত্ৰিছ'],
  [86429753, 'আঠ কোটি চৌষষ্ঠি লাখ ঊন্ত্ৰিছ হাজাৰ সাত এশ তেৱন'],
  [975310864, 'সাতান্নব্বৈ কোটি তেৱন লাখ দহ হাজাৰ আঠ এশ চৌষষ্ঠি'],
  [9876543210, 'ন আৰব সাতাশী কোটি পঁষষ্ঠি লাখ তিয়াল্লিছ হাজাৰ দুই এশ দহ'],
  [98765432101, 'আঠান্নব্বৈ আৰব ছয়সত্তৰ কোটি চৌৱন লাখ বত্ৰিছ হাজাৰ এক এশ এক'],
  [987654321012, 'ন খৰব সাতাশী আৰব পঁষষ্ঠি কোটি তিয়াল্লিছ লাখ একৈছ হাজাৰ বাৰ'],
  [9876543210123, 'আঠান্নব্বৈ খৰব ছয়সত্তৰ আৰব চৌৱন কোটি বত্ৰিছ লাখ দহ হাজাৰ এক এশ তেইছ'],
  [98765432101234, 'ন নীল সাতাশী খৰব পঁষষ্ঠি আৰব তিয়াল্লিছ কোটি একৈছ লাখ এক হাজাৰ দুই এশ চৌত্ৰিছ'],
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
    row[1] = `${row[1]} টকা`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} টকা`;
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
    row[1] = `${row[1]} টকা`;
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

const testFloats: [number, string][] = [
  [0.0, 'শূন্য'],
  [0.04, 'শূন্য দশমিক শূন্য চাৰি'],
  [0.0468, 'শূন্য দশমিক শূন্য চাৰি ছয় আঠ'],
  [0.4, 'শূন্য দশমিক চাৰি'],
  [0.63, 'শূন্য দশমিক তেষষ্ঠি'],
  [0.973, 'শূন্য দশমিক ন এশ তেসত্তৰ'],
  [0.999, 'শূন্য দশমিক ন এশ নিয়ান্নব্বৈ'],
  [37.06, 'সাতত্ৰিছ দশমিক শূন্য ছয়'],
  [37.068, 'সাতত্ৰিছ দশমিক শূন্য ছয় আঠ'],
  [37.68, 'সাতত্ৰিছ দশমিক আঠষষ্ঠি'],
  [37.683, 'সাতত্ৰিছ দশমিক ছয় এশ তিৰাশী'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, 'এক এশ তেইছ টকা'],
    ['123', 'এক এশ তেইছ টকা'],
    ['123.0', 'এক এশ তেইছ টকা আৰু শূন্য পইচা'],
    ['123.00', 'এক এশ তেইছ টকা আৰু শূন্য পইচা'],
    ['0.00', 'শূন্য টকা আৰু শূন্য পইচা'],
    ['-123.00', 'ঋণ এক এশ তেইছ টকা আৰু শূন্য পইচা'],
    ['37.68', 'সাতত্ৰিছ টকা আৰু আঠষষ্ঠি পইচা'],
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
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'শূন্য টকা'],
  [0.04, 'শূন্য টকা আৰু চাৰি পইচা'],
  [0.0468, 'শূন্য টকা আৰু পাঁচ পইচা'],
  [0.4, 'শূন্য টকা আৰু চল্লিছ পইচা'],
  [0.63, 'শূন্য টকা আৰু তেষষ্ঠি পইচা'],
  [0.973, 'শূন্য টকা আৰু সাতান্নব্বৈ পইচা'],
  [0.999, 'এক টকা'],
  [37.06, 'সাতত্ৰিছ টকা আৰু ছয় পইচা'],
  [37.068, 'সাতত্ৰিছ টকা আৰু সাত পইচা'],
  [37.68, 'সাতত্ৰিছ টকা আৰু আঠষষ্ঠি পইচা'],
  [37.683, 'সাতত্ৰিছ টকা আৰু আঠষষ্ঠি পইচা'],
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
      row[1] = (row[1] as string).replace('শূন্য টকা আৰু ', '');
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
      row[1] = 'শূন্য টকা';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(' আৰু [\\u0980-\\u09FF ]+ পইচা'), '');
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
    row[1] = (row[1] as string).replace(new RegExp(' আৰু [\\u0980-\\u09FF ]+ পইচা'), '');
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
  [1, 'প্ৰথম'],
  [2, 'দ্বিতীয়'],
  [3, 'তৃতীয়'],
  [4, 'চতুৰ্থ'],
  [5, 'পঞ্চম'],
  [6, 'ষষ্ঠ'],
  [7, 'সপ্তম'],
  [8, 'অষ্টম'],
  [9, 'নৱম'],
  [10, 'দশম'],
  [11, 'এঘাৰতম'],
  [12, 'বাৰতম'],
  [15, 'পোন্ধৰতম'],
  [20, 'বিছতম'],
  [21, 'একৈছতম'],
  [23, 'তেইছতম'],
  [25, 'পঁচিছতম'],
  [30, 'ত্ৰিছতম'],
  [50, 'পঞ্চাছতম'],
  [99, 'নিয়ান্নব্বৈতম'],
  [100, 'শততম'],
  [101, 'এক এশ প্ৰথম'],
  [111, 'এক এশ এঘাৰতম'],
  [123, 'এক এশ তেইছতম'],
  [500, 'পাঁচ শততম'],
  [1000, 'এক সহস্ৰতম'],
  [1001, 'এক হাজাৰ প্ৰথম'],
  [1234, 'এক হাজাৰ দুই এশ চৌত্ৰিছতম'],
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

const testPowersOfTen: [number, string][] = [
  [10, 'দহ'],
  [100, 'এশ'],
  [1000, 'এক হাজাৰ'],
  [10000, 'দহ হাজাৰ'],
  [100000, 'এক লাখ'],
  [1000000, 'দহ লাখ'],
  [10000000, 'এক কোটি'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'শূন্য'],
  [1n, 'এক'],
  [100n, 'এশ'],
  [1000n, 'এক হাজাৰ'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'ঋণ এক'],
  [-100n, 'ঋণ এশ'],
  [-1000n, 'ঋণ এক হাজাৰ'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'শূন্য'],
  ['1', 'এক'],
  ['100', 'এশ'],
  ['-100', 'ঋণ এশ'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => শূন্য', () => {
    expect(toWords.convert(0)).toBe('শূন্য');
  });

  test('convert -0 => শূন্য', () => {
    expect(toWords.convert(-0)).toBe('শূন্য');
  });

  test('convert 0.0 => শূন্য', () => {
    expect(toWords.convert(0.0)).toBe('শূন্য');
  });

  test('convert 0n => শূন্য', () => {
    expect(toWords.convert(0n)).toBe('শূন্য');
  });

  test('convert "0" => শূন্য', () => {
    expect(toWords.convert('0')).toBe('শূন্য');
  });

  test('convert 0 with currency => শূন্য টকা', () => {
    expect(toWords.convert(0, { currency: true })).toBe('শূন্য টকা');
  });
});

describe('Test Invalid Input', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number "NaN"/);
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number "Infinity"/);
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number "-Infinity"/);
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('' as unknown as number)).toThrow(/Invalid Number ""/);
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow(/Invalid Number "abc"/);
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

const testFractionStyleAsIN: [number, string][] = [
  [1.1, 'এক আৰু এক দশমাংশ'],
  [2.5, 'দুই আৰু পাঁচ দশমাংশ'],
  [1.01, 'এক আৰু এক শতাংশ'],
  [1.45, 'এক আৰু পঞ্চল্লিছ শতাংশ'],
  [0.05, 'শূন্য আৰু পাঁচ শতাংশ'],
  [1.001, 'এক আৰু এক সহস্ৰাংশ'],
  [1.005, 'এক আৰু পাঁচ সহস্ৰাংশ'],
  [1.0001, 'এক আৰু এক দহ-সহস্ৰাংশ'],
  [1.0005, 'এক আৰু পাঁচ দহ-সহস্ৰাংশ'],
  [1.00001, 'এক আৰু এক শত-সহস্ৰাংশ'],
  [1.00005, 'এক আৰু পাঁচ শত-সহস্ৰাংশ'],
  [1.000001, 'এক আৰু এক দহ-লাখাংশ'],
  [1.000005, 'এক আৰু পাঁচ দহ-লাখাংশ'],
  [123.45, 'এক এশ তেইছ আৰু পঞ্চল্লিছ শতাংশ'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleAsIN)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe('এক দশমিক বাৰ লাখ চৌত্ৰিছ হাজাৰ পাঁচ এশ সাতষষ্ঠি');
    expect(toWords.convert(1.1234567)).toBe('এক দশমিক বাৰ লাখ চৌত্ৰিছ হাজাৰ পাঁচ এশ সাতষষ্ঠি');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('এক দশমিক পাঁচ');
    expect(toWords.convert(0.05)).toBe('শূন্য দশমিক শূন্য পাঁচ');
  });
});

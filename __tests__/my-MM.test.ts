import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import myMm from '../src/locales/my-MM.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/my-MM.js';

const localeCode = 'my-MM';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(myMm);
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

// trim:true — all words joined without spaces
const testIntegers: [number, string][] = [
  [0, 'သုည'],
  [1, 'တစ်'],
  [2, 'နှစ်'],
  [3, 'သုံး'],
  [4, 'လေး'],
  [5, 'ငါး'],
  [6, 'ခြောက်'],
  [7, 'ခုနစ်'],
  [8, 'ရှစ်'],
  [9, 'ကိုး'],
  [10, 'တစ်ဆယ်'],
  [11, 'တစ်ဆယ့်တစ်'],
  [13, 'တစ်ဆယ့်သုံး'],
  [15, 'တစ်ဆယ့်ငါး'],
  [19, 'တစ်ဆယ့်ကိုး'],
  [20, 'နှစ်ဆယ်'],
  [21, 'နှစ်ဆယ့်တစ်'],
  [25, 'နှစ်ဆယ့်ငါး'],
  [30, 'သုံးဆယ်'],
  [40, 'လေးဆယ်'],
  [50, 'ငါးဆယ်'],
  [55, 'ငါးဆယ့်ငါး'],
  [60, 'ခြောက်ဆယ်'],
  [70, 'ခုနစ်ဆယ်'],
  [80, 'ရှစ်ဆယ်'],
  [90, 'ကိုးဆယ်'],
  [99, 'ကိုးဆယ့်ကိုး'],
  [100, 'တစ်ရာ'],
  [101, 'တစ်ရာတစ်'],
  [137, 'တစ်ရာသုံးဆယ့်ခုနစ်'],
  [200, 'နှစ်ရာ'],
  [500, 'ငါးရာ'],
  [700, 'ခုနစ်ရာ'],
  [999, 'ကိုးရာကိုးဆယ့်ကိုး'],
  [1000, 'တစ်ထောင်'],
  [1001, 'တစ်ထောင်တစ်'],
  [1100, 'တစ်ထောင်တစ်ရာ'],
  [2000, 'နှစ်ထောင်'],
  [4680, 'လေးထောင်ခြောက်ရာရှစ်ဆယ်'],
  [10000, 'တစ်သောင်း'],
  [20000, 'နှစ်သောင်း'],
  [50000, 'ငါးသောင်း'],
  [100000, 'တစ်သိန်း'],
  [500000, 'ငါးသိန်း'],
  [1000000, 'တစ်သန်း'],
  [5500000, 'ငါးသန်းငါးသိန်း'],
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
    row[1] = `အနုတ်${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}ကျပ်`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testData = [
    [-1, 'အနုတ်တစ်ကျပ်'],
    [-10, 'အနုတ်တစ်ဆယ်ကျပ်'],
    [-100, 'အနုတ်တစ်ရာကျပ်'],
    [-1000, 'အနုတ်တစ်ထောင်ကျပ်'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [0, ''],
    [5, 'ငါးကျပ်'],
    [100, 'တစ်ရာကျပ်'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.5, 'သုညဒသမငါး'],
  [1.5, 'တစ်ဒသမငါး'],
  [10.5, 'တစ်ဆယ်ဒသမငါး'],
  [12.34, 'တစ်ဆယ့်နှစ်ဒသမသုံးဆယ့်လေး'],
  [37.68, 'သုံးဆယ့်ခုနစ်ဒသမခြောက်ဆယ့်ရှစ်'],
  [0.04, 'သုညဒသမသုညလေး'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `တစ်ရာနှစ်ဆယ့်သုံးကျပ်`],
    ['123', `တစ်ရာနှစ်ဆယ့်သုံးကျပ်`],
    ['123.0', `တစ်ရာနှစ်ဆယ့်သုံးကျပ်သုညပြား`],
    ['123.00', `တစ်ရာနှစ်ဆယ့်သုံးကျပ်သုညပြား`],
    ['0.00', `သုညကျပ်သုညပြား`],
    ['-123.00', `အနုတ်တစ်ရာနှစ်ဆယ့်သုံးကျပ်သုညပြား`],
    ['37.68', `သုံးဆယ့်ခုနစ်ကျပ်ခြောက်ဆယ့်ရှစ်ပြား`],
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

const testFloatsWithCurrency = [
  [0.5, 'သုညကျပ်ငါးဆယ်ပြား'],
  [1.5, 'တစ်ကျပ်ငါးဆယ်ပြား'],
  [37.68, 'သုံးဆယ့်ခုနစ်ကျပ်ခြောက်ဆယ့်ရှစ်ပြား'],
  [0.04, 'သုညကျပ်လေးပြား'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [1.5, 'တစ်ကျပ်ငါးဆယ်ပြား'],
    [37.68, 'သုံးဆယ့်ခုနစ်ကျပ်ခြောက်ဆယ့်ရှစ်ပြား'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testData = [
    [10.99, 'တစ်ဆယ်ကျပ်'],
    [37.68, 'သုံးဆယ့်ခုနစ်ကျပ်'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

describe('Test Ordinal (unsupported — throws)', () => {
  test('toOrdinal throws for my-MM', () => {
    expect(() => toWords.toOrdinal(1)).toThrow('Ordinal conversion not supported for locale "my-MM"');
  });

  test('localeToOrdinal throws for my-MM', () => {
    expect(() => localeToOrdinal(1)).toThrow('Ordinal conversion not supported for locale');
  });
});

const testPowersOfTen = [
  [10, 'တစ်ဆယ်'],
  [100, 'တစ်ရာ'],
  [1000, 'တစ်ထောင်'],
  [10000, 'တစ်သောင်း'],
  [100000, 'တစ်သိန်း'],
  [1000000, 'တစ်သန်း'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'သုည'],
  [1n, 'တစ်'],
  [100n, 'တစ်ရာ'],
  [1000n, 'တစ်ထောင်'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'အနုတ်တစ်'],
  [-100n, 'အနုတ်တစ်ရာ'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'သုည'],
  ['1', 'တစ်'],
  ['10', 'တစ်ဆယ်'],
  ['100', 'တစ်ရာ'],
  ['-100', 'အနုတ်တစ်ရာ'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => သုည', () => {
    expect(toWords.convert(0)).toBe('သုည');
  });

  test('convert -0 => သုည', () => {
    expect(toWords.convert(-0)).toBe('သုည');
  });

  test('convert 0.0 => သုည', () => {
    expect(toWords.convert(0.0)).toBe('သုည');
  });

  test('convert 0n => သုည', () => {
    expect(toWords.convert(0n)).toBe('သုည');
  });

  test('convert "0" => သုည', () => {
    expect(toWords.convert('0')).toBe('သုည');
  });

  test('convert 0 with currency => သုညကျပ်', () => {
    expect(toWords.convert(0, { currency: true })).toBe('သုညကျပ်');
  });
});

describe('Test Invalid Input', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(21)).toBe('နှစ်ဆယ့်တစ်');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(10)).toBe('တစ်ဆယ်ကျပ်');
  });
});

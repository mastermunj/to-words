import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import viVn from '../src/locales/vi-VN.js';
import { ToWords as LocaleToWords } from '../src/locales/vi-VN.js';

const localeCode = 'vi-VN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(viVn);
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
  [0, 'Không'],
  [137, 'Một Trăm Ba Mươi Bảy'],
  [700, 'Bảy Trăm'],
  [1100, 'Một Nghìn Một Trăm'],
  [4680, 'Bốn Nghìn Sáu Trăm Tám Mươi'],
  [63892, 'Sáu Mươi Ba Nghìn Tám Trăm Chín Mươi Hai'],
  [86100, 'Tám Mươi Sáu Nghìn Một Trăm'],
  [792581, 'Bảy Trăm Chín Mươi Hai Nghìn Năm Trăm Tám Mươi Một'],
  [2741034, 'Hai Triệu Bảy Trăm Bốn Mươi Một Nghìn Ba Mươi Bốn'],
  [86429753, 'Tám Mươi Sáu Triệu Bốn Trăm Hai Mươi Chín Nghìn Bảy Trăm Năm Mươi Ba'],
  [975310864, 'Chín Trăm Bảy Mươi Năm Triệu Ba Trăm Mười Nghìn Tám Trăm Sáu Mươi Bốn'],
  [9876543210, 'Chín Tỷ Tám Trăm Bảy Mươi Sáu Triệu Năm Trăm Bốn Mươi Ba Nghìn Hai Trăm Mười'],
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
    row[1] = `Âm ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Đồng`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Đồng`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Đồng`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Âm ${row[1]} Đồng`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Đồng`;
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
  [0.0, 'Không'],
  [0.04, 'Không Phẩy Không Bốn'],
  [0.4, 'Không Phẩy Bốn'],
  [0.63, 'Không Phẩy Sáu Mươi Ba'],
  [0.973, 'Không Phẩy Chín Trăm Bảy Mươi Ba'],
  [37.06, 'Ba Mươi Bảy Phẩy Không Sáu'],
  [37.68, 'Ba Mươi Bảy Phẩy Sáu Mươi Tám'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Không Đồng'],
  [0.04, 'Không Đồng Và Bốn Xu'],
  [0.4, 'Không Đồng Và Bốn Mươi Xu'],
  [0.63, 'Không Đồng Và Sáu Mươi Ba Xu'],
  [37.06, 'Ba Mươi Bảy Đồng Và Sáu Xu'],
  [37.68, 'Ba Mươi Bảy Đồng Và Sáu Mươi Tám Xu'],
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
      row[1] = (row[1] as string).replace('Không Đồng Và ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'Không Đồng'],
    [0.04, 'Không Đồng'],
    [0.4, 'Không Đồng'],
    [0.63, 'Không Đồng'],
    [37.06, 'Ba Mươi Bảy Đồng'],
    [37.68, 'Ba Mươi Bảy Đồng'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

// Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, 'Thứ Nhất'],
  [2, 'Thứ Hai'],
  [3, 'Thứ Ba'],
  [4, 'Thứ Tư'],
  [5, 'Thứ Năm'],
  [6, 'Thứ Sáu'],
  [7, 'Thứ Bảy'],
  [8, 'Thứ Tám'],
  [9, 'Thứ Chín'],
  [10, 'Thứ Mười'],
  [21, 'Hai Mươi Thứ Nhất'],
  [100, 'Một Trăm'],
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

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Mười'],
  [100, 'Một Trăm'],
  [1000, 'Một Nghìn'],
  [10000, 'Mười Nghìn'],
  [100000, 'Một Trăm Nghìn'],
  [1000000, 'Một Triệu'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'Không'],
  [1n, 'Một'],
  [100n, 'Một Trăm'],
  [1000n, 'Một Nghìn'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Âm Một'],
  [-100n, 'Âm Một Trăm'],
  [-1000n, 'Âm Một Nghìn'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'Không'],
  ['1', 'Một'],
  ['100', 'Một Trăm'],
  ['-100', 'Âm Một Trăm'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  const testZeroVariants: [number | bigint | string, string][] = [
    [0, 'Không'],
    [-0, 'Không'],
    [0.0, 'Không'],
    [0n, 'Không'],
    ['0', 'Không'],
  ];

  test.concurrent.each(testZeroVariants)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });

  test('zero with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Không Đồng');
  });
});

describe('Test Invalid Inputs', () => {
  const testInvalidInputs: [unknown, string][] = [
    [NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(testInvalidInputs)('convert %s => throws %s', (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
  });
});

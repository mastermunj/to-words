import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import yueHk from '../src/locales/yue-HK.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/yue-HK.js';

const localeCode = 'yue-HK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(yueHk);
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
  [0, '零'],
  [137, '一 百 三十 七'],
  [700, '七 百'],
  [1100, '一 千 一百'],
  [4680, '四 千 六 百 八十'],
  [63892, '六 萬 三 千 八 百 九十 二'],
  [86100, '八 萬 六 千 一百'],
  [792581, '七十 九 萬 二 千 五 百 八十 一'],
  [2741034, '二 百 七十 四 萬 一 千 零 三十 四'],
  [86429753, '八 千 六 百 四十 二 萬 九 千 七 百 五十 三'],
  [975310864, '九 億 七 千 五 百 三十 一 萬 零 八 百 六十 四'],
  [1000000000, '十 億'],
  [9876543210, '九十 八 億 七 千 六 百 五十 四 萬 三 千 二 百 一十'],
  [10000000000, '一百 億'],
  [100000000000, '一 千 億'],
  [1000000000000, '一 兆'],
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
    row[1] = `負 ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} 元 整`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} 元`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} 元 整`;
      return;
    }
    row[0] = -row[0];
    row[1] = `負 ${row[1]} 元 整`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} 元 整`;
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
  [0, '零'],
  [0.04, '零 點 零 四'],
  [0.0468, '零 點 零 四 六 八'],
  [0.4, '零 點 四'],
  [0.63, '零 點 六十 三'],
  [0.973, '零 點 九 百 七十 三'],
  [0.999, '零 點 九 百 九十 九'],
  [37.06, '三十 七 點 零 六'],
  [37.068, '三十 七 點 零 六 八'],
  [37.68, '三十 七 點 六十 八'],
  [37.683, '三十 七 點 六 百 八十 三'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `一 百 二十 三 元 整`],
    ['123', `一 百 二十 三 元 整`],
    ['123.0', `一 百 二十 三 元 零 仙 整`],
    ['123.00', `一 百 二十 三 元 零 仙 整`],
    ['0.00', `零 元 零 仙 整`],
    ['-123.00', `負 一 百 二十 三 元 零 仙 整`],
    ['37.68', `三十 七 元 六十 八 仙 整`],
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
  [0, '零 元 整'],
  [0.01, '零 元 一 仙 整'],
  [0.04, '零 元 四 仙 整'],
  [0.0468, '零 元 五 仙 整'],
  [0.5, '零 元 五十 仙 整'],
  [0.63, '零 元 六十 三 仙 整'],
  [0.973, '零 元 九十 七 仙 整'],
  [0.999, '一 元 整'],
  [1.25, '一 元 二十 五 仙 整'],
  [10.99, '十 元 九十 九 仙 整'],
  [37.06, '三十 七 元 六 仙 整'],
  [37.68, '三十 七 元 六十 八 仙 整'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, '一 仙 整'],
    [0.04, '四 仙 整'],
    [0.0468, '五 仙 整'],
    [0.5, '五十 仙 整'],
    [0.63, '六十 三 仙 整'],
    [0.973, '九十 七 仙 整'],
    [0.999, '一 元 整'],
    [1.25, '一 元 二十 五 仙 整'],
    [10.99, '十 元 九十 九 仙 整'],
    [37.06, '三十 七 元 六 仙 整'],
    [37.68, '三十 七 元 六十 八 仙 整'],
  ];

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
    [0, '零 元 整'],
    [0.01, '零 元 整'],
    [0.04, '零 元 整'],
    [0.0468, '零 元 整'],
    [0.5, '零 元 整'],
    [0.63, '零 元 整'],
    [0.973, '零 元 整'],
    [0.999, '零 元 整'],
    [1.25, '一 元 整'],
    [10.99, '十 元 整'],
    [37.06, '三十 七 元 整'],
    [37.68, '三十 七 元 整'],
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

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals: [number, string][] = [
    [0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, '一 元 整'],
    [10.99, '十 元 整'],
    [37.06, '三十 七 元 整'],
    [37.68, '三十 七 元 整'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
          ignoreDecimal: true,
        }),
      ).toBe(expected);
    },
  );
});

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, '第一'],
  [2, '第二'],
  [3, '第三'],
  [4, '第四'],
  [5, '第五'],
  [6, '第六'],
  [7, '第七'],
  [8, '第八'],
  [9, '第九'],
  [10, '第十'],
  [11, '第十 一'],
  [12, '第十 二'],
  [13, '第十 三'],
  [14, '第十 四'],
  [15, '第十 五'],
  [16, '第十 六'],
  [17, '第十 七'],
  [18, '第十 八'],
  [19, '第十 九'],
  [20, '第二十'],
  [21, '第二十 一'],
  [22, '第二十 二'],
  [23, '第二十 三'],
  [30, '第三十'],
  [40, '第四十'],
  [50, '第五十'],
  [60, '第六十'],
  [70, '第七十'],
  [80, '第八十'],
  [90, '第九十'],
  [31, '第三十 一'],
  [32, '第三十 二'],
  [33, '第三十 三'],
  [41, '第四十 一'],
  [42, '第四十 二'],
  [43, '第四十 三'],
  [51, '第五十 一'],
  [52, '第五十 二'],
  [53, '第五十 三'],
  [100, '第一百'],
  [200, '第二 百'],
  [1000, '第一 千'],
  [10000, '第一 萬'],
  [100000, '第十 萬'],
  [1000000, '第一百 萬'],
  [100001, '第十 萬 零 一'],
  [100002, '第十 萬 零 二'],
  [100003, '第十 萬 零 三'],
  [101, '第一 百 零 一'],
  [102, '第一 百 零 二'],
  [103, '第一 百 零 三'],
  [111, '第一 百 一十 一'],
  [112, '第一 百 一十 二'],
  [113, '第一 百 一十 三'],
  [123, '第一 百 二十 三'],
  [1001, '第一 千 零 一'],
  [1234, '第一 千 二 百 三十 四'],
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

describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR yue-HK
// ============================================================

// Powers of Ten (Traditional Chinese system: 萬, 億, 兆)
const testPowersOfTen: [number, string][] = [
  [10, '十'],
  [100, '一百'],
  [1000, '一 千'],
  [10000, '一 萬'],
  [100000, '十 萬'],
  [1000000, '一百 萬'],
  [10000000, '一 千 萬'],
  [100000000, '一 億'],
  [1000000000, '十 億'],
  [10000000000, '一百 億'],
  [100000000000, '一 千 億'],
  [1000000000000, '一 兆'],
];

describe('Test Powers of Ten (Chinese System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, '零'],
  [1n, '一'],
  [100n, '一百'],
  [1000n, '一 千'],
  [10000n, '一 萬'],
  [100000000n, '一 億'],
  [1000000000000n, '一 兆'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, '負 一'],
  [-100n, '負 一百'],
  [-1000n, '負 一 千'],
  [-10000n, '負 一 萬'],
  [-100000000n, '負 一 億'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', '零'],
  ['1', '一'],
  ['100', '一百'],
  ['1000', '一 千'],
  ['-100', '負 一百'],
  ['  100  ', '一百'],
  ['10000', '一 萬'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('零');
  });

  test('converts -0 as 零', () => {
    expect(toWords.convert(-0)).toBe('零');
  });

  test('converts 0.0 as 零', () => {
    expect(toWords.convert(0.0)).toBe('零');
  });

  test('converts 0n as 零', () => {
    expect(toWords.convert(0n)).toBe('零');
  });

  test('converts "0" as 零', () => {
    expect(toWords.convert('0')).toBe('零');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('零 元 整');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('一 千 二 百 三十 四 元 整');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('一 千 二 百 三十 四 元');
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

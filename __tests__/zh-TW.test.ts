import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import zhTw from '../src/locales/zh-TW.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/zh-TW.js';

const localeCode = 'zh-TW';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(zhTw);
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
  [0, '零'],
  [137, '百 三十 七'],
  [700, '七 百'],
  [1100, '千 百'],
  [4680, '四 千 六 百 八十'],
  [63892, '六 萬 三 千 八 百 九十 二'],
  [86100, '八 萬 六 千 百'],
  [792581, '七 十萬 九 萬 二 千 五 百 八十 一'],
  [2741034, '二 百萬 七 十萬 四 萬 千 三十 四'],
  [86429753, '八 千萬 六 百萬 四 十萬 二 萬 九 千 七 百 五十 三'],
  [975310864, '九 億 七 千萬 五 百萬 三 十萬 萬 八 百 六十 四'],
  [1000000000, '十億'],
  [9876543210, '九 十億 八 億 七 千萬 六 百萬 五 十萬 四 萬 三 千 二 百 十'],
  [10000000000, '百億'],
  [100000000000, '千億'],
  [1000000000000, '兆'],
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

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, '零 元 整'],
  [0.01, '零 元  一 分 整'],
  [0.04, '零 元  四 分 整'],
  [0.0468, '零 元  五 分 整'],
  [0.5, '零 元  五十 分 整'],
  [0.63, '零 元  六十 三 分 整'],
  [0.973, '零 元  九十 七 分 整'],
  [0.999, '一 元 整'],
  [1.25, '一 元  二十 五 分 整'],
  [10.99, '十 元  九十 九 分 整'],
  [37.06, '三十 七 元  六 分 整'],
  [37.68, '三十 七 元  六十 八 分 整'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, '一 分 整'],
    [0.04, '四 分 整'],
    [0.0468, '五 分 整'],
    [0.5, '五十 分 整'],
    [0.63, '六十 三 分 整'],
    [0.973, '九十 七 分 整'],
    [0.999, '一 元 整'],
    [1.25, '一 元  二十 五 分 整'],
    [10.99, '十 元  九十 九 分 整'],
    [37.06, '三十 七 元  六 分 整'],
    [37.68, '三十 七 元  六十 八 分 整'],
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
  [11, '十 一'],
  [12, '十 二'],
  [13, '十 三'],
  [14, '十 四'],
  [15, '十 五'],
  [16, '十 六'],
  [17, '十 七'],
  [18, '十 八'],
  [19, '十 九'],
  [20, '第二十'],
  [21, '二十 第一'],
  [22, '二十 第二'],
  [23, '二十 第三'],
  [30, '第三十'],
  [40, '第四十'],
  [50, '第五十'],
  [60, '第六十'],
  [70, '第七十'],
  [80, '第八十'],
  [90, '第九十'],
  [31, '三十 第一'],
  [32, '三十 第二'],
  [33, '三十 第三'],
  [41, '四十 第一'],
  [42, '四十 第二'],
  [43, '四十 第三'],
  [51, '五十 第一'],
  [52, '五十 第二'],
  [53, '五十 第三'],
  [100, '第百'],
  [200, '二 第百'],
  [1000, '千'],
  [10000, '萬'],
  [100000, '十萬'],
  [1000000, '百萬'],
  [100001, '十萬 第一'],
  [100002, '十萬 第二'],
  [100003, '十萬 第三'],
  [101, '百 第一'],
  [102, '百 第二'],
  [103, '百 第三'],
  [111, '百 十 第一'],
  [112, '百 十 第二'],
  [113, '百 十 第三'],
  [123, '百 二十 第三'],
  [1001, '千 第一'],
  [1234, '千 二 百 三十 第四'],
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
    expect(() => toWords.convert(Number.NaN)).toThrow();
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR zh-TW
// ============================================================

// Powers of Ten (Traditional Chinese system: 萬, 億, 兆)
const testPowersOfTen: [number, string][] = [
  [10, '十'],
  [100, '百'],
  [1000, '千'],
  [10000, '萬'],
  [100000, '十萬'],
  [1000000, '百萬'],
  [10000000, '千萬'],
  [100000000, '億'],
  [1000000000, '十億'],
  [10000000000, '百億'],
  [100000000000, '千億'],
  [1000000000000, '兆'],
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
  [100n, '百'],
  [1000n, '千'],
  [10000n, '萬'],
  [100000000n, '億'],
  [1000000000000n, '兆'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, '負 一'],
  [-100n, '負 百'],
  [-1000n, '負 千'],
  [-10000n, '負 萬'],
  [-100000000n, '負 億'],
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
  ['100', '百'],
  ['1000', '千'],
  ['-100', '負 百'],
  ['  100  ', '百'],
  ['10000', '萬'],
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
    expect(toWords.convert(testValue, { currency: true })).toBe('千 二 百 三十 四 元 整');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('千 二 百 三十 四 元');
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

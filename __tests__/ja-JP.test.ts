import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import jaJp from '../src/locales/ja-JP.js';
import { ToWords as LocaleToWords } from '../src/locales/ja-JP.js';

const localeCode = 'ja-JP';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(jaJp);
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
  [0, '零'],
  [137, '百 三十 七'],
  [700, '七 百'],
  [1100, '千 百'],
  [4680, '四 千 六 百 八十'],
  [63892, '六 万 三 千 八 百 九十 二'],
  [86100, '八 万 六 千 百'],
  [792581, '七 十万 九 万 二 千 五 百 八十 一'],
  [2741034, '二 百万 七 十万 四 万 千 三十 四'],
  [86429753, '八 千万 六 百万 四 十万 二 万 九 千 七 百 五十 三'],
  [975310864, '九 億 七 千万 五 百万 三 十万 万 八 百 六十 四'],
  [1000000000, '十億'],
  [9876543210, '九 十億 八 億 七 千万 六 百万 五 十万 四 万 三 千 二 百 十'],
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
    row[1] = `マイナス ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} 円`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} 円`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} 円`;
      return;
    }
    row[0] = -row[0];
    row[1] = `マイナス ${row[1]} 円`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} 円`;
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
  [0, '零'],
  [0.04, '零 点 零 四'],
  [0.0468, '零 点 零 四 六 八'],
  [0.4, '零 点 四'],
  [0.63, '零 点 六十 三'],
  [0.973, '零 点 九 百 七十 三'],
  [0.999, '零 点 九 百 九十 九'],
  [37.06, '三十 七 点 零 六'],
  [37.068, '三十 七 点 零 六 八'],
  [37.68, '三十 七 点 六十 八'],
  [37.683, '三十 七 点 六 百 八十 三'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, '零 円'],
  [0.01, '零 円  一 銭'],
  [0.04, '零 円  四 銭'],
  [0.0468, '零 円  五 銭'],
  [0.5, '零 円  五十 銭'],
  [0.63, '零 円  六十 三 銭'],
  [0.973, '零 円  九十 七 銭'],
  [0.999, '一 円'],
  [1.25, '一 円  二十 五 銭'],
  [10.99, '十 円  九十 九 銭'],
  [37.06, '三十 七 円  六 銭'],
  [37.68, '三十 七 円  六十 八 銭'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.01, '一 銭'],
    [0.04, '四 銭'],
    [0.0468, '五 銭'],
    [0.5, '五十 銭'],
    [0.63, '六十 三 銭'],
    [0.973, '九十 七 銭'],
    [0.999, '一 円'],
    [1.25, '一 円  二十 五 銭'],
    [10.99, '十 円  九十 九 銭'],
    [37.06, '三十 七 円  六 銭'],
    [37.68, '三十 七 円  六十 八 銭'],
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
    [0.0, '零 円'],
    [0.01, '零 円'],
    [0.04, '零 円'],
    [0.0468, '零 円'],
    [0.5, '零 円'],
    [0.63, '零 円'],
    [0.973, '零 円'],
    [0.999, '零 円'],
    [1.25, '一 円'],
    [10.99, '十 円'],
    [37.06, '三十 七 円'],
    [37.68, '三十 七 円'],
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
    [0.0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, '一 円'],
    [10.99, '十 円'],
    [37.06, '三十 七 円'],
    [37.68, '三十 七 円'],
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

const testOrdinalNumbers: [number, string][] = [
  // Basic ordinals 1-20
  [1, '一番目'],
  [2, '二番目'],
  [3, '三番目'],
  [4, '四番目'],
  [5, '五番目'],
  [6, '六番目'],
  [7, '七番目'],
  [8, '八番目'],
  [9, '九番目'],
  [10, '十番目'],
  [11, '十 一番目'],
  [12, '十 二番目'],
  [13, '十 三番目'],
  [14, '十 四番目'],
  [15, '十 五番目'],
  [16, '十 六番目'],
  [17, '十 七番目'],
  [18, '十 八番目'],
  [19, '十 九番目'],
  [20, '二十番目'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, '二十 一番目'],
  [22, '二十 二番目'],
  [23, '二十 三番目'],
  [30, '三十番目'],
  [40, '四十番目'],
  [50, '五十番目'],
  [60, '六十番目'],
  [70, '七十番目'],
  [80, '八十番目'],
  [90, '九十番目'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, '三十 一番目'],
  [32, '三十 二番目'],
  [33, '三十 三番目'],
  [41, '四十 一番目'],
  [42, '四十 二番目'],
  [43, '四十 三番目'],
  [51, '五十 一番目'],
  [52, '五十 二番目'],
  [53, '五十 三番目'],

  // Round numbers (100, 200, 1000, etc.)
  [100, '百番目'],
  [200, '二 百番目'],
  [1000, '千番目'],
  [10000, '万番目'],

  // Larger numbers
  [100000, '十万番目'],
  [1000000, '百万番目'],
  [100001, '十万 一番目'],
  [100002, '十万 二番目'],
  [100003, '十万 三番目'],

  // Numbers in the hundreds with endings
  [101, '百 一番目'],
  [102, '百 二番目'],
  [103, '百 三番目'],
  [111, '百 十 一番目'],
  [112, '百 十 二番目'],
  [113, '百 十 三番目'],
  [123, '百 二十 三番目'],

  // Complex numbers
  [1001, '千 一番目'],
  [1234, '千 二 百 三十 四番目'],
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
  const testInvalidInputs: [unknown, string][] = [
    ['abc', 'Invalid Number'],
    ['', 'Invalid Number'],
    [Number.NaN, 'Invalid Number'],
    [Infinity, 'Invalid Number'],
  ];

  test.concurrent.each(testInvalidInputs)('should throw error for %s', (input, message) => {
    expect(() => toWords.convert(input as number)).toThrow(message);
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR ja-JP
// ============================================================

// Powers of Ten (Japanese system: 万, 億, 兆)
const testPowersOfTen: [number, string][] = [
  [10, '十'],
  [100, '百'],
  [1000, '千'],
  [10000, '万'],
  [100000, '十万'],
  [1000000, '百万'],
  [10000000, '千万'],
  [100000000, '億'],
  [1000000000, '十億'],
  [10000000000, '百億'],
  [100000000000, '千億'],
  [1000000000000, '兆'],
];

describe('Test Powers of Ten (Japanese System)', () => {
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
  [10000n, '万'],
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
  [-1n, 'マイナス 一'],
  [-100n, 'マイナス 百'],
  [-1000n, 'マイナス 千'],
  [-10000n, 'マイナス 万'],
  [-100000000n, 'マイナス 億'],
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
  ['-100', 'マイナス 百'],
  ['  100  ', '百'],
  ['10000', '万'],
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
    expect(toWords.convert(0, { currency: true })).toBe('零 円');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('千 二 百 三十 四 円');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('千 二 百 三十 四 円');
  });
});

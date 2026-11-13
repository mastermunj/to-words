import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import jaJp from '../src/locales/ja-JP.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ja-JP.js';

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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, '零'],
  [137, '百三十七'],
  [700, '七百'],
  [1100, '千百'],
  [4680, '四千六百八十'],
  [63892, '六万三千八百九十二'],
  [86100, '八万六千百'],
  [792581, '七十九万二千五百八十一'],
  [2741034, '二百七十四万千三十四'],
  [86429753, '八千六百四十二万九千七百五十三'],
  [975310864, '九億七千五百三十一万八百六十四'],
  [1000000000, '十億'],
  [9876543210, '九十八億七千六百五十四万三千二百十'],
  [10000000000, '百億'],
  [100000000000, '千億'],
  [1000000000000, '一兆'],
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
    row[1] = `マイナス${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}円`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}円`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}円`;
      return;
    }
    row[0] = -row[0];
    row[1] = `マイナス${row[1]}円`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}円`;
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
  [0.04, '零点零四'],
  [0.0468, '零点零四六八'],
  [0.4, '零点四'],
  [0.63, '零点六三'],
  [0.973, '零点九七三'],
  [0.999, '零点九九九'],
  [37.06, '三十七点零六'],
  [37.068, '三十七点零六八'],
  [37.68, '三十七点六八'],
  [37.683, '三十七点六八三'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `百二十三円`],
    ['123', `百二十三円`],
    ['123.0', `百二十三円零銭`],
    ['123.00', `百二十三円零銭`],
    ['0.00', `零円零銭`],
    ['-123.00', `マイナス百二十三円零銭`],
    ['37.68', `三十七円六十八銭`],
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
  [0.0, '零円'],
  [0.01, '零円一銭'],
  [0.04, '零円四銭'],
  [0.0468, '零円五銭'],
  [0.5, '零円五十銭'],
  [0.63, '零円六十三銭'],
  [0.973, '零円九十七銭'],
  [0.999, '一円'],
  [1.25, '一円二十五銭'],
  [10.99, '十円九十九銭'],
  [37.06, '三十七円六銭'],
  [37.68, '三十七円六十八銭'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.01, '一銭'],
    [0.04, '四銭'],
    [0.0468, '五銭'],
    [0.5, '五十銭'],
    [0.63, '六十三銭'],
    [0.973, '九十七銭'],
    [0.999, '一円'],
    [1.25, '一円二十五銭'],
    [10.99, '十円九十九銭'],
    [37.06, '三十七円六銭'],
    [37.68, '三十七円六十八銭'],
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
    [0.0, '零円'],
    [0.01, '零円'],
    [0.04, '零円'],
    [0.0468, '零円'],
    [0.5, '零円'],
    [0.63, '零円'],
    [0.973, '零円'],
    [0.999, '零円'],
    [1.25, '一円'],
    [10.99, '十円'],
    [37.06, '三十七円'],
    [37.68, '三十七円'],
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
    [1.25, '一円'],
    [10.99, '十円'],
    [37.06, '三十七円'],
    [37.68, '三十七円'],
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
  [11, '十一番目'],
  [12, '十二番目'],
  [13, '十三番目'],
  [14, '十四番目'],
  [15, '十五番目'],
  [16, '十六番目'],
  [17, '十七番目'],
  [18, '十八番目'],
  [19, '十九番目'],
  [20, '二十番目'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, '二十一番目'],
  [22, '二十二番目'],
  [23, '二十三番目'],
  [30, '三十番目'],
  [40, '四十番目'],
  [50, '五十番目'],
  [60, '六十番目'],
  [70, '七十番目'],
  [80, '八十番目'],
  [90, '九十番目'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, '三十一番目'],
  [32, '三十二番目'],
  [33, '三十三番目'],
  [41, '四十一番目'],
  [42, '四十二番目'],
  [43, '四十三番目'],
  [51, '五十一番目'],
  [52, '五十二番目'],
  [53, '五十三番目'],

  // Round numbers (100, 200, 1000, etc.)
  [100, '百番目'],
  [200, '二百番目'],
  [1000, '千番目'],
  [10000, '一万番目'],

  // Larger numbers
  [100000, '十万番目'],
  [1000000, '百万番目'],
  [100001, '十万一番目'],
  [100002, '十万二番目'],
  [100003, '十万三番目'],

  // Numbers in the hundreds with endings
  [101, '百一番目'],
  [102, '百二番目'],
  [103, '百三番目'],
  [111, '百十一番目'],
  [112, '百十二番目'],
  [113, '百十三番目'],
  [123, '百二十三番目'],

  // Complex numbers
  [1001, '千一番目'],
  [1234, '千二百三十四番目'],
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
  [10000, '一万'],
  [100000, '十万'],
  [1000000, '百万'],
  [10000000, '千万'],
  [100000000, '一億'],
  [1000000000, '十億'],
  [10000000000, '百億'],
  [100000000000, '千億'],
  [1000000000000, '一兆'],
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
  [10000n, '一万'],
  [100000000n, '一億'],
  [1000000000000n, '一兆'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'マイナス一'],
  [-100n, 'マイナス百'],
  [-1000n, 'マイナス千'],
  [-10000n, 'マイナス一万'],
  [-100000000n, 'マイナス一億'],
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
  ['-100', 'マイナス百'],
  ['  100  ', '百'],
  ['10000', '一万'],
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
    expect(toWords.convert(0, { currency: true })).toBe('零円');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('千二百三十四円');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('千二百三十四円');
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
  // This script has no capital letters, so every casing leaves the output unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), '二十一'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), '二十一'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), '二十一円五十銭'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), '二十一円五十銭'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), '二十一円五十銭'],
    ["casing 'natural'", () => styled.convert(21.5, { currency: true, casing: 'natural' }), '二十一円五十銭'],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      '二十一円五十銭',
    ],
    ['ordinal', () => styled.toOrdinal(21), '二十一番目'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      '二十一番目',
    ],
    ['default (digit by digit)', () => styled.convert(1.25), '一点二五'],
    ["decimalStyle 'digit-by-digit'", () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }), '一点二五'],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

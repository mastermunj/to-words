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
  [137, '一百三十七'],
  [700, '七百'],
  [1100, '一千一百'],
  [4680, '四千六百八十'],
  [63892, '六萬三千八百九十二'],
  [86100, '八萬六千一百'],
  [792581, '七十九萬二千五百八十一'],
  [2741034, '二百七十四萬一千零三十四'],
  [86429753, '八千六百四十二萬九千七百五十三'],
  [975310864, '九億七千五百三十一萬零八百六十四'],
  [1000000000, '十億'],
  [9876543210, '九十八億七千六百五十四萬三千二百一十'],
  [10000000000, '一百億'],
  [100000000000, '一千億'],
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
    row[1] = `負${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}元整`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}元`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}元整`;
      return;
    }
    row[0] = -row[0];
    row[1] = `負${row[1]}元整`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}元整`;
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
  [0.04, '零點零四'],
  [0.0468, '零點零四六八'],
  [0.4, '零點四'],
  [0.63, '零點六三'],
  [0.973, '零點九七三'],
  [0.999, '零點九九九'],
  [37.06, '三十七點零六'],
  [37.068, '三十七點零六八'],
  [37.68, '三十七點六八'],
  [37.683, '三十七點六八三'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `一百二十三元整`],
    ['123', `一百二十三元整`],
    ['123.0', `一百二十三元零仙整`],
    ['123.00', `一百二十三元零仙整`],
    ['0.00', `零元零仙整`],
    ['-123.00', `負一百二十三元零仙整`],
    ['37.68', `三十七元六毫八仙整`],
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
  [0, '零元整'],
  [0.01, '零元一仙整'],
  [0.04, '零元四仙整'],
  [0.0468, '零元五仙整'],
  [0.5, '零元五毫整'],
  [0.63, '零元六毫三仙整'],
  [0.973, '零元九毫七仙整'],
  [0.999, '一元整'],
  [1.25, '一元二毫五仙整'],
  [10.99, '十元九毫九仙整'],
  [37.06, '三十七元零六仙整'],
  [37.68, '三十七元六毫八仙整'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, '一仙整'],
    [0.04, '四仙整'],
    [0.0468, '五仙整'],
    [0.5, '五毫整'],
    [0.63, '六毫三仙整'],
    [0.973, '九毫七仙整'],
    [0.999, '一元整'],
    [1.25, '一元二毫五仙整'],
    [10.99, '十元九毫九仙整'],
    [37.06, '三十七元零六仙整'],
    [37.68, '三十七元六毫八仙整'],
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
    [0, '零元整'],
    [0.01, '零元整'],
    [0.04, '零元整'],
    [0.0468, '零元整'],
    [0.5, '零元整'],
    [0.63, '零元整'],
    [0.973, '零元整'],
    [0.999, '零元整'],
    [1.25, '一元整'],
    [10.99, '十元整'],
    [37.06, '三十七元整'],
    [37.68, '三十七元整'],
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
    [1.25, '一元整'],
    [10.99, '十元整'],
    [37.06, '三十七元整'],
    [37.68, '三十七元整'],
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
  [11, '第十一'],
  [12, '第十二'],
  [13, '第十三'],
  [14, '第十四'],
  [15, '第十五'],
  [16, '第十六'],
  [17, '第十七'],
  [18, '第十八'],
  [19, '第十九'],
  [20, '第二十'],
  [21, '第二十一'],
  [22, '第二十二'],
  [23, '第二十三'],
  [30, '第三十'],
  [40, '第四十'],
  [50, '第五十'],
  [60, '第六十'],
  [70, '第七十'],
  [80, '第八十'],
  [90, '第九十'],
  [31, '第三十一'],
  [32, '第三十二'],
  [33, '第三十三'],
  [41, '第四十一'],
  [42, '第四十二'],
  [43, '第四十三'],
  [51, '第五十一'],
  [52, '第五十二'],
  [53, '第五十三'],
  [100, '第一百'],
  [200, '第二百'],
  [1000, '第一千'],
  [10000, '第一萬'],
  [100000, '第十萬'],
  [1000000, '第一百萬'],
  [100001, '第十萬零一'],
  [100002, '第十萬零二'],
  [100003, '第十萬零三'],
  [101, '第一百零一'],
  [102, '第一百零二'],
  [103, '第一百零三'],
  [111, '第一百一十一'],
  [112, '第一百一十二'],
  [113, '第一百一十三'],
  [123, '第一百二十三'],
  [1001, '第一千零一'],
  [1234, '第一千二百三十四'],
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
  [1000, '一千'],
  [10000, '一萬'],
  [100000, '十萬'],
  [1000000, '一百萬'],
  [10000000, '一千萬'],
  [100000000, '一億'],
  [1000000000, '十億'],
  [10000000000, '一百億'],
  [100000000000, '一千億'],
  [1000000000000, '一兆'],
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
  [1000n, '一千'],
  [10000n, '一萬'],
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
  [-1n, '負一'],
  [-100n, '負一百'],
  [-1000n, '負一千'],
  [-10000n, '負一萬'],
  [-100000000n, '負一億'],
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
  ['1000', '一千'],
  ['-100', '負一百'],
  ['  100  ', '一百'],
  ['10000', '一萬'],
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
    expect(toWords.convert(0, { currency: true })).toBe('零元整');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('一千二百三十四元整');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('一千二百三十四元');
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
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), '二十一元五毫整'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), '二十一元五毫整'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), '二十一元五毫整'],
    ["casing 'natural'", () => styled.convert(21.5, { currency: true, casing: 'natural' }), '二十一元五毫整'],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      '二十一元五毫整',
    ],
    ['ordinal', () => styled.toOrdinal(21), '第二十一'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      '第二十一',
    ],
    ['default (digit by digit)', () => styled.convert(1.25), '一點二五'],
    ["decimalStyle 'digit-by-digit'", () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }), '一點二五'],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

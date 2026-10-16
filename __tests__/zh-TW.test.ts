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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, '零'],
  [137, '一 百 三十 七'],
  [700, '七 百'],
  [1100, '一 千 一 百'],
  [4680, '四 千 六 百 八十'],
  [63892, '六 萬 三 千 八 百 九十 二'],
  [86100, '八 萬 六 千 一 百'],
  [792581, '七十 九 萬 二 千 五 百 八十 一'],
  [2741034, '二 百 七十 四 萬 一 千 零 三十 四'],
  [86429753, '八 千 六 百 四十 二 萬 九 千 七 百 五十 三'],
  [975310864, '九 億 七 千 五 百 三十 一 萬 零 八 百 六十 四'],
  [1000000000, '十 億'],
  [9876543210, '九十 八 億 七 千 六 百 五十 四 萬 三 千 二 百 一十'],
  [10000000000, '一 百 億'],
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
    ['123.0', `一 百 二十 三 元 零 分 整`],
    ['123.00', `一 百 二十 三 元 零 分 整`],
    ['0.00', `零 元 零 分 整`],
    ['-123.00', `負 一 百 二十 三 元 零 分 整`],
    ['37.68', `三十 七 元 六 角 八 分`],
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
  [0.01, '零 元 一 分'],
  [0.04, '零 元 四 分'],
  [0.0468, '零 元 五 分'],
  [0.5, '零 元 五 角'],
  [0.63, '零 元 六 角 三 分'],
  [0.973, '零 元 九 角 七 分'],
  [0.999, '一 元 整'],
  [1.25, '一 元 二 角 五 分'],
  [10.99, '十 元 九 角 九 分'],
  [37.06, '三十 七 元 零 六 分'],
  [37.68, '三十 七 元 六 角 八 分'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, '一 分'],
    [0.04, '四 分'],
    [0.0468, '五 分'],
    [0.5, '五 角'],
    [0.63, '六 角 三 分'],
    [0.973, '九 角 七 分'],
    [0.999, '一 元 整'],
    [1.25, '一 元 二 角 五 分'],
    [10.99, '十 元 九 角 九 分'],
    [37.06, '三十 七 元 零 六 分'],
    [37.68, '三十 七 元 六 角 八 分'],
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
  [100, '第一 百'],
  [200, '第二 百'],
  [1000, '第一 千'],
  [10000, '第一 萬'],
  [100000, '第十 萬'],
  [1000000, '第一 百 萬'],
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
// COMPREHENSIVE TEST ADDITIONS FOR zh-TW
// ============================================================

// Powers of Ten (Traditional Chinese system: 萬, 億, 兆)
const testPowersOfTen: [number, string][] = [
  [10, '十'],
  [100, '一 百'],
  [1000, '一 千'],
  [10000, '一 萬'],
  [100000, '十 萬'],
  [1000000, '一 百 萬'],
  [10000000, '一 千 萬'],
  [100000000, '一 億'],
  [1000000000, '十 億'],
  [10000000000, '一 百 億'],
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
  [100n, '一 百'],
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
  [-100n, '負 一 百'],
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
  ['100', '一 百'],
  ['1000', '一 千'],
  ['-100', '負 一 百'],
  ['  100  ', '一 百'],
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

// ============================================================
// FORMAL (大寫) TESTS FOR zh-TW
// ============================================================

const testFormalIntegers: [number, string][] = [
  [0, '零'],
  [1, '壹'],
  [2, '貳'],
  [3, '參'],
  [4, '肆'],
  [5, '伍'],
  [6, '陸'],
  [7, '柒'],
  [8, '捌'],
  [9, '玖'],
  [10, '拾'],
  [11, '拾 壹'],
  [20, '貳拾'],
  [21, '貳拾 壹'],
  [50, '伍拾'],
  [99, '玖拾 玖'],
  [100, '壹 佰'],
  [137, '壹 佰 參拾 柒'],
  [700, '柒 佰'],
  [1100, '壹 仟 壹 佰'],
  [4680, '肆 仟 陸 佰 捌拾'],
  [10000, '壹 萬'],
  [63892, '陸 萬 參 仟 捌 佰 玖拾 貳'],
  [100000000, '壹 億'],
  [975310864, '玖 億 柒 仟 伍 佰 參拾 壹 萬 零 捌 佰 陸拾 肆'],
  [1000000000000, '壹 兆'],
];

describe('Test Formal Integers with options = { formal: true }', () => {
  test.concurrent.each(testFormalIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true })).toBe(expected);
  });
});

describe('Test Formal Integers with options = { formal: true, currency: true }', () => {
  const testFormalIntegersWithCurrency = cloneDeep(testFormalIntegers);
  testFormalIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} 圓 整`;
  });

  test.concurrent.each(testFormalIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true, currency: true })).toBe(expected);
  });
});

describe('Test Formal Floats with options = { formal: true, currency: true }', () => {
  const testFormalFloatsWithCurrency: [number, string][] = [
    [0.01, '零 圓 壹 分'],
    [1.25, '壹 圓 貳 角 伍 分'],
    [10.99, '拾 圓 玖 角 玖 分'],
    [37.68, '參拾 柒 圓 陸 角 捌 分'],
  ];

  test.concurrent.each(testFormalFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true, currency: true })).toBe(expected);
  });
});

const testFormalOrdinals: [number, string][] = [
  [1, '第壹'],
  [2, '第貳'],
  [3, '第參'],
  [4, '第肆'],
  [5, '第伍'],
  [6, '第陸'],
  [7, '第柒'],
  [8, '第捌'],
  [9, '第玖'],
  [10, '第拾'],
  [20, '第貳拾'],
  [30, '第參拾'],
  [50, '第伍拾'],
  [100, '第壹 佰'],
  [21, '第貳拾 壹'],
  [123, '第壹 佰 貳拾 參'],
  [1234, '第壹 仟 貳 佰 參拾 肆'],
];

describe('Test Formal Ordinal Numbers', () => {
  test.concurrent.each(testFormalOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number, { formal: true })).toBe(expected);
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
    ['default', () => styled.convert(21), '二十 一'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), '二十 一'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), '二十 一 元 五 角'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), '二十 一 元 五 角'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), '二十 一 元 五 角'],
    ["casing 'natural'", () => styled.convert(21.5, { currency: true, casing: 'natural' }), '二十 一 元 五 角'],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      '二十 一 元 五 角',
    ],
    ['ordinal', () => styled.toOrdinal(21), '第二十 一'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      '第二十 一',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), '一 點 二十 五'],
    ["decimalStyle 'digit-by-digit'", () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }), '一 點 二 五'],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

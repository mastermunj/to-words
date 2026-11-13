import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import zhCn from '../src/locales/zh-CN.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/zh-CN.js';

const localeCode = 'zh-CN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(zhCn);
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
  [63892, '六万三千八百九十二'],
  [86100, '八万六千一百'],
  [792581, '七十九万二千五百八十一'],
  [2741034, '二百七十四万一千零三十四'],
  [86429753, '八千六百四十二万九千七百五十三'],
  [975310864, '九亿七千五百三十一万零八百六十四'],
  [1000000000, '十亿'],
  [9876543210, '九十八亿七千六百五十四万三千二百一十'],
  [10000000000, '一百亿'],
  [100000000000, '一千亿'],
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
    row[1] = `负${row[1]}`;
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
    row[1] = `负${row[1]}元整`;
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
    [123, `一百二十三元整`],
    ['123', `一百二十三元整`],
    ['123.0', `一百二十三元零分整`],
    ['123.00', `一百二十三元零分整`],
    ['0.00', `零元零分整`],
    ['-123.00', `负一百二十三元零分整`],
    ['37.68', `三十七元六角八分`],
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
  [0.01, '零元一分'],
  [0.04, '零元四分'],
  [0.0468, '零元五分'],
  [0.5, '零元五角'],
  [0.63, '零元六角三分'],
  [0.973, '零元九角七分'],
  [0.999, '一元整'],
  [1.25, '一元二角五分'],
  [10.99, '十元九角九分'],
  [37.06, '三十七元零六分'],
  [37.68, '三十七元六角八分'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, '一分'],
    [0.04, '四分'],
    [0.0468, '五分'],
    [0.5, '五角'],
    [0.63, '六角三分'],
    [0.973, '九角七分'],
    [0.999, '一元整'],
    [1.25, '一元二角五分'],
    [10.99, '十元九角九分'],
    [37.06, '三十七元零六分'],
    [37.68, '三十七元六角八分'],
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
  [10000, '第一万'],
  [100000, '第十万'],
  [1000000, '第一百万'],
  [100001, '第十万零一'],
  [100002, '第十万零二'],
  [100003, '第十万零三'],
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
// COMPREHENSIVE TEST ADDITIONS FOR zh-CN
// ============================================================

// Powers of Ten (Chinese system: 万, 亿, 兆)
const testPowersOfTen: [number, string][] = [
  [10, '十'],
  [100, '一百'],
  [1000, '一千'],
  [10000, '一万'],
  [100000, '十万'],
  [1000000, '一百万'],
  [10000000, '一千万'],
  [100000000, '一亿'],
  [1000000000, '十亿'],
  [10000000000, '一百亿'],
  [100000000000, '一千亿'],
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
  [10000n, '一万'],
  [100000000n, '一亿'],
  [1000000000000n, '一兆'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, '负一'],
  [-100n, '负一百'],
  [-1000n, '负一千'],
  [-10000n, '负一万'],
  [-100000000n, '负一亿'],
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
  ['-100', '负一百'],
  ['  100  ', '一百'],
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

// ============================================================
// FORMAL (大写) TESTS FOR zh-CN
// ============================================================

const testFormalIntegers: [number, string][] = [
  [0, '零'],
  [1, '壹'],
  [2, '贰'],
  [3, '叁'],
  [4, '肆'],
  [5, '伍'],
  [6, '陆'],
  [7, '柒'],
  [8, '捌'],
  [9, '玖'],
  [10, '拾'],
  [11, '拾壹'],
  [20, '贰拾'],
  [21, '贰拾壹'],
  [50, '伍拾'],
  [99, '玖拾玖'],
  [100, '壹佰'],
  [137, '壹佰叁拾柒'],
  [700, '柒佰'],
  [1100, '壹仟壹佰'],
  [4680, '肆仟陆佰捌拾'],
  [10000, '壹萬'],
  [63892, '陆萬叁仟捌佰玖拾贰'],
  [100000000, '壹億'],
  [975310864, '玖億柒仟伍佰叁拾壹萬零捌佰陆拾肆'],
  [1000000000000, '壹兆'],
];

describe('Test Formal Integers with options = { formal: true }', () => {
  test.concurrent.each(testFormalIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true })).toBe(expected);
  });
});

describe('Test Formal Integers with options = { formal: true, currency: true }', () => {
  const testFormalIntegersWithCurrency = cloneDeep(testFormalIntegers);
  testFormalIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}圆整`;
  });

  test.concurrent.each(testFormalIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true, currency: true })).toBe(expected);
  });
});

describe('Test Formal Floats with options = { formal: true, currency: true }', () => {
  const testFormalFloatsWithCurrency: [number, string][] = [
    [0.01, '零圆壹分'],
    [1.25, '壹圆贰角伍分'],
    [10.99, '拾圆玖角玖分'],
    [37.68, '叁拾柒圆陆角捌分'],
  ];

  test.concurrent.each(testFormalFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { formal: true, currency: true })).toBe(expected);
  });
});

const testFormalOrdinals: [number, string][] = [
  [1, '第壹'],
  [2, '第贰'],
  [3, '第叁'],
  [4, '第肆'],
  [5, '第伍'],
  [6, '第陆'],
  [7, '第柒'],
  [8, '第捌'],
  [9, '第玖'],
  [10, '第拾'],
  [20, '第贰拾'],
  [30, '第叁拾'],
  [50, '第伍拾'],
  [100, '第壹佰'],
  [21, '第贰拾壹'],
  [123, '第壹佰贰拾叁'],
  [1234, '第壹仟贰佰叁拾肆'],
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
    ['default', () => styled.convert(21), '二十一'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), '二十一'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), '二十一元五角'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), '二十一元五角'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), '二十一元五角'],
    ["casing 'natural'", () => styled.convert(21.5, { currency: true, casing: 'natural' }), '二十一元五角'],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      '二十一元五角',
    ],
    ['ordinal', () => styled.toOrdinal(21), '第二十一'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      '第二十一',
    ],
    ['default (digit by digit)', () => styled.convert(1.25), '一点二五'],
    ["decimalStyle 'digit-by-digit'", () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }), '一点二五'],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

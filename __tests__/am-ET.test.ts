import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import amEt from '../src/locales/am-ET.js';
import { ToWords as LocaleToWords } from '../src/locales/am-ET.js';

const localeCode = 'am-ET';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(amEt);
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
  [0, 'ዜሮ'],
  [137, 'አንድ መቶ ሰላሳ ሰባት'],
  [700, 'ሰባት መቶ'],
  [1100, 'አንድ ሺ መቶ'],
  [4680, 'አራት ሺ ስድስት መቶ ሰማንያ'],
  [63892, 'ስድሳ ሦስት ሺ ስምንት መቶ ዘጠና ሁለት'],
  [86100, 'ሰማንያ ስድስት ሺ መቶ'],
  [792581, 'ሰባት መቶ ዘጠና ሁለት ሺ አምስት መቶ ሰማንያ አንድ'],
  [2741034, 'ሁለት ሚሊዮን ሰባት መቶ አርባ አንድ ሺ ሰላሳ አራት'],
  [86429753, 'ሰማንያ ስድስት ሚሊዮን አራት መቶ ሃያ ዘጠኝ ሺ ሰባት መቶ ሃምሳ ሦስት'],
  [975310864, 'ዘጠኝ መቶ ሰባ አምስት ሚሊዮን ሦስት መቶ አስር ሺ ስምንት መቶ ስድሳ አራት'],
  [1000000000, 'አንድ ቢሊዮን'],
  [9876543210, 'ዘጠኝ ቢሊዮን ስምንት መቶ ሰባ ስድስት ሚሊዮን አምስት መቶ አርባ ሦስት ሺ ሁለት መቶ አስር'],
  [10000000000, 'አስር ቢሊዮን'],
  [100000000000, 'መቶ ቢሊዮን'],
  [1000000000000, 'አንድ ትሪሊዮን'],
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
    row[1] = `አሉታዊ ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ብር ብቻ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ብር`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} ብር ብቻ`;
      return;
    }
    row[0] = -row[0];
    row[1] = `አሉታዊ ${row[1]} ብር ብቻ`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} ብር ብቻ`;
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
  [0.0, 'ዜሮ'],
  [0.04, 'ዜሮ ነጥብ ዜሮ አራት'],
  [0.0468, 'ዜሮ ነጥብ ዜሮ አራት ስድስት ስምንት'],
  [0.4, 'ዜሮ ነጥብ አራት'],
  [0.63, 'ዜሮ ነጥብ ስድሳ ሦስት'],
  [0.973, 'ዜሮ ነጥብ ዘጠኝ መቶ ሰባ ሦስት'],
  [0.999, 'ዜሮ ነጥብ ዘጠኝ መቶ ዘጠና ዘጠኝ'],
  [37.06, 'ሰላሳ ሰባት ነጥብ ዜሮ ስድስት'],
  [37.068, 'ሰላሳ ሰባት ነጥብ ዜሮ ስድስት ስምንት'],
  [37.68, 'ሰላሳ ሰባት ነጥብ ስድሳ ስምንት'],
  [37.683, 'ሰላሳ ሰባት ነጥብ ስድስት መቶ ሰማንያ ሦስት'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'ዜሮ ብር ብቻ'],
  [0.01, 'ዜሮ ብር እና አንድ ሳንቲም ብቻ'],
  [0.04, 'ዜሮ ብር እና አራት ሳንቲም ብቻ'],
  [0.0468, 'ዜሮ ብር እና አምስት ሳንቲም ብቻ'],
  [0.5, 'ዜሮ ብር እና ሃምሳ ሳንቲም ብቻ'],
  [0.63, 'ዜሮ ብር እና ስድሳ ሦስት ሳንቲም ብቻ'],
  [0.973, 'ዜሮ ብር እና ዘጠና ሰባት ሳንቲም ብቻ'],
  [0.999, 'አንድ ብር ብቻ'],
  [1.25, 'አንድ ብር እና ሃያ አምስት ሳንቲም ብቻ'],
  [10.99, 'አስር ብር እና ዘጠና ዘጠኝ ሳንቲም ብቻ'],
  [37.06, 'ሰላሳ ሰባት ብር እና ስድስት ሳንቲም ብቻ'],
  [37.68, 'ሰላሳ ሰባት ብር እና ስድሳ ስምንት ሳንቲም ብቻ'],
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
      row[1] = (row[1] as string).replace('ዜሮ ብር እና ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = 'ዜሮ ብር ብቻ';
    } else {
      row[1] = (row[1] as string).replace(/ እና [\u1200-\u137F ]+ ሳንቲም/, '');
    }
  });

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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    if (row[0] === 0.999) {
      row[1] = '';
    } else {
      row[1] = (row[1] as string).replace(/ እና [\u1200-\u137F ]+ ሳንቲም/, '');
    }
  });

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
  [1, 'አንደኛ'],
  [2, 'ሁለተኛ'],
  [3, 'ሦስተኛ'],
  [4, 'አራተኛ'],
  [5, 'አምስተኛ'],
  [6, 'ስድስተኛ'],
  [7, 'ሰባተኛ'],
  [8, 'ስምንተኛ'],
  [9, 'ዘጠነኛ'],
  [10, 'አስረኛ'],
  [11, 'አስራ አንደኛ'],
  [12, 'አስራ ሁለተኛ'],
  [13, 'አስራ ሦስተኛ'],
  [14, 'አስራ አራተኛ'],
  [15, 'አስራ አምስተኛ'],
  [16, 'አስራ ስድስተኛ'],
  [17, 'አስራ ሰባተኛ'],
  [18, 'አስራ ስምንተኛ'],
  [19, 'አስራ ዘጠነኛ'],
  [20, 'ሃያኛ'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'ሃያ አንደኛ'],
  [22, 'ሃያ ሁለተኛ'],
  [23, 'ሃያ ሦስተኛ'],
  [30, 'ሰላሳኛ'],
  [40, 'አርባኛ'],
  [50, 'ሃምሳኛ'],
  [60, 'ስድሳኛ'],
  [70, 'ሰባኛ'],
  [80, 'ሰማንያኛ'],
  [90, 'ዘጠናኛ'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'ሰላሳ አንደኛ'],
  [32, 'ሰላሳ ሁለተኛ'],
  [33, 'ሰላሳ ሦስተኛ'],
  [41, 'አርባ አንደኛ'],
  [42, 'አርባ ሁለተኛ'],
  [43, 'አርባ ሦስተኛ'],
  [51, 'ሃምሳ አንደኛ'],
  [52, 'ሃምሳ ሁለተኛ'],
  [53, 'ሃምሳ ሦስተኛ'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'መቶኛ'],
  [200, 'ሁለት መቶኛ'],
  [1000, 'አንድ ሺኛ'],
  [10000, 'አስር ሺኛ'],

  // Larger numbers
  [100000, 'መቶ ሺኛ'],
  [1000000, 'አንድ ሚሊዮንኛ'],
  [100001, 'መቶ ሺ አንደኛ'],
  [100002, 'መቶ ሺ ሁለተኛ'],
  [100003, 'መቶ ሺ ሦስተኛ'],

  // Numbers in the hundreds with endings
  [101, 'አንድ መቶ አንደኛ'],
  [102, 'አንድ መቶ ሁለተኛ'],
  [103, 'አንድ መቶ ሦስተኛ'],
  [111, 'አንድ መቶ አስራ አንደኛ'],
  [112, 'አንድ መቶ አስራ ሁለተኛ'],
  [113, 'አንድ መቶ አስራ ሦስተኛ'],
  [123, 'አንድ መቶ ሃያ ሦስተኛ'],

  // Complex numbers
  [1001, 'አንድ ሺ አንደኛ'],
  [1234, 'አንድ ሺ ሁለት መቶ ሰላሳ አራተኛ'],
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
  const testInvalids: [unknown, string][] = [
    ['abc', 'Invalid Number'],
    ['', 'Invalid Number'],
    [Number.NaN, 'Invalid Number'],
    [Infinity, 'Invalid Number'],
  ];

  test.concurrent.each(testInvalids)('should throw error for %s', (input, message) => {
    expect(() => toWords.convert(input as number)).toThrow(message);
  });
});

// Powers of Ten
const testPowersOfTen: [number, string][] = [
  [10, 'አስር'],
  [100, 'መቶ'],
  [1000, 'አንድ ሺ'],
  [10000, 'አስር ሺ'],
  [100000, 'መቶ ሺ'],
  [1000000, 'አንድ ሚሊዮን'],
  [10000000, 'አስር ሚሊዮን'],
  [100000000, 'መቶ ሚሊዮን'],
  [1000000000, 'አንድ ቢሊዮን'],
  [10000000000, 'አስር ቢሊዮን'],
  [100000000000, 'መቶ ቢሊዮን'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'ዜሮ'],
  [1n, 'አንድ'],
  [100n, 'መቶ'],
  [1000n, 'አንድ ሺ'],
  [1000000n, 'አንድ ሚሊዮን'],
  [1000000000n, 'አንድ ቢሊዮን'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'አሉታዊ አንድ'],
  [-100n, 'አሉታዊ መቶ'],
  [-1000n, 'አሉታዊ አንድ ሺ'],
  [-10000000n, 'አሉታዊ አስር ሚሊዮን'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'ዜሮ'],
  ['1', 'አንድ'],
  ['100', 'መቶ'],
  ['-100', 'አሉታዊ መቶ'],
  ['  100  ', 'መቶ'],
  ['1000', 'አንድ ሺ'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('ዜሮ');
  });

  test('converts -0 as ዜሮ', () => {
    expect(toWords.convert(-0)).toBe('ዜሮ');
  });

  test('converts 0.0 as ዜሮ', () => {
    expect(toWords.convert(0.0)).toBe('ዜሮ');
  });

  test('converts 0n as ዜሮ', () => {
    expect(toWords.convert(0n)).toBe('ዜሮ');
  });

  test('converts "0" as ዜሮ', () => {
    expect(toWords.convert('0')).toBe('ዜሮ');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ዜሮ ብር ብቻ');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests for am-ET
describe('Test Invalid Inputs for am-ET', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('throws for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('throws for invalid string', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
  });
});

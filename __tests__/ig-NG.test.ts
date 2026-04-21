import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import igNg from '../src/locales/ig-NG.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ig-NG.js';

const localeCode = 'ig-NG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(igNg);
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
  [0, 'Adịghị'],
  [1, 'Otu'],
  [2, 'Abụọ'],
  [3, 'Atọ'],
  [4, 'Anọ'],
  [5, 'Ise'],
  [6, 'Isii'],
  [7, 'Asaa'],
  [8, 'Asatọ'],
  [9, 'Eteghiete'],
  [10, 'Iri'],
  [11, 'Iri Na Otu'],
  [12, 'Iri Na Abụọ'],
  [13, 'Iri Na Atọ'],
  [14, 'Iri Na Anọ'],
  [15, 'Iri Na Ise'],
  [16, 'Iri Na Isii'],
  [17, 'Iri Na Asaa'],
  [18, 'Iri Na Asatọ'],
  [19, 'Iri Na Eteghiete'],
  [20, 'Iri Abụọ'],
  [21, 'Iri Abụọ Na Otu'],
  [22, 'Iri Abụọ Na Abụọ'],
  [23, 'Iri Abụọ Na Atọ'],
  [30, 'Iri Atọ'],
  [35, 'Iri Atọ Na Ise'],
  [40, 'Iri Anọ'],
  [50, 'Iri Ise'],
  [54, 'Iri Ise Na Anọ'],
  [60, 'Iri Isii'],
  [70, 'Iri Asaa'],
  [80, 'Iri Asatọ'],
  [90, 'Iri Eteghiete'],
  [99, 'Iri Eteghiete Na Eteghiete'],
  [100, 'Nnari'],
  [101, 'Nnari Na Otu'],
  [111, 'Nnari Na Iri Na Otu'],
  [150, 'Nnari Na Iri Ise'],
  [200, 'Nnari Abụọ'],
  [222, 'Nnari Abụọ Na Iri Abụọ Na Abụọ'],
  [300, 'Nnari Atọ'],
  [500, 'Nnari Ise'],
  [999, 'Nnari Eteghiete Na Iri Eteghiete Na Eteghiete'],
  [1000, 'Puku'],
  [1001, 'Puku Na Otu'],
  [1025, 'Puku Na Iri Abụọ Na Ise'],
  [1234, 'Puku Na Nnari Abụọ Na Iri Atọ Na Anọ'],
  [2000, 'Puku Abụọ'],
  [5000, 'Puku Ise'],
  [10000, 'Puku Iri'],
  [11000, 'Puku Iri Na Otu'],
  [21000, 'Puku Iri Abụọ Na Otu'],
  [100000, 'Puku Nnari'],
  [500000, 'Puku Nnari Ise'],
  [1000000, 'Nde'],
  [2000000, 'Nde Abụọ'],
  [10000000, 'Nde Iri'],
  [100000000, 'Nde Nnari'],
  [1000000000, 'Ijeri'],
  [2000000000, 'Ijeri Abụọ'],
  [1000000000000, 'Tirịlịọn'],
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
    row[1] = `Mwepu ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Naira Naanị`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Naira`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Naira Naanị`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Mwepu ${row[1]} Naira Naanị`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Naira Naanị`;
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
  [0, 'Adịghị'],
  [0.04, 'Adịghị Ntụpọ Adịghị Anọ'],
  [0.0468, 'Adịghị Ntụpọ Adịghị Anọ Isii Asatọ'],
  [0.4, 'Adịghị Ntụpọ Anọ'],
  [0.63, 'Adịghị Ntụpọ Iri Isii Na Atọ'],
  [0.973, 'Adịghị Ntụpọ Nnari Eteghiete Na Iri Asaa Na Atọ'],
  [0.999, 'Adịghị Ntụpọ Nnari Eteghiete Na Iri Eteghiete Na Eteghiete'],
  [37.06, 'Iri Atọ Na Asaa Ntụpọ Adịghị Isii'],
  [37.068, 'Iri Atọ Na Asaa Ntụpọ Adịghị Isii Asatọ'],
  [37.68, 'Iri Atọ Na Asaa Ntụpọ Iri Isii Na Asatọ'],
  [37.683, 'Iri Atọ Na Asaa Ntụpọ Nnari Isii Na Iri Asatọ Na Atọ'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, 'Adịghị Naira Naanị'],
  [0.01, 'Adịghị Naira Na Otu Kobo Naanị'],
  [0.04, 'Adịghị Naira Na Anọ Kobo Naanị'],
  [0.0468, 'Adịghị Naira Na Ise Kobo Naanị'],
  [0.5, 'Adịghị Naira Na Iri Ise Kobo Naanị'],
  [0.63, 'Adịghị Naira Na Iri Isii Na Atọ Kobo Naanị'],
  [0.973, 'Adịghị Naira Na Iri Eteghiete Na Asaa Kobo Naanị'],
  [0.999, 'Otu Naira Naanị'],
  [1.25, 'Otu Naira Na Iri Abụọ Na Ise Kobo Naanị'],
  [10.99, 'Iri Naira Na Iri Eteghiete Na Eteghiete Kobo Naanị'],
  [37.06, 'Iri Atọ Na Asaa Naira Na Isii Kobo Naanị'],
  [37.68, 'Iri Atọ Na Asaa Naira Na Iri Isii Na Asatọ Kobo Naanị'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, 'Otu Kobo Naanị'],
    [0.04, 'Anọ Kobo Naanị'],
    [0.0468, 'Ise Kobo Naanị'],
    [0.5, 'Iri Ise Kobo Naanị'],
    [0.63, 'Iri Isii Na Atọ Kobo Naanị'],
    [0.973, 'Iri Eteghiete Na Asaa Kobo Naanị'],
    [0.999, 'Otu Naira Naanị'],
    [1.25, 'Otu Naira Na Iri Abụọ Na Ise Kobo Naanị'],
    [10.99, 'Iri Naira Na Iri Eteghiete Na Eteghiete Kobo Naanị'],
    [37.06, 'Iri Atọ Na Asaa Naira Na Isii Kobo Naanị'],
    [37.68, 'Iri Atọ Na Asaa Naira Na Iri Isii Na Asatọ Kobo Naanị'],
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
    [0, 'Adịghị Naira Naanị'],
    [0.01, 'Adịghị Naira Naanị'],
    [0.04, 'Adịghị Naira Naanị'],
    [0.0468, 'Adịghị Naira Naanị'],
    [0.5, 'Adịghị Naira Naanị'],
    [0.63, 'Adịghị Naira Naanị'],
    [0.973, 'Adịghị Naira Naanị'],
    [0.999, 'Adịghị Naira Naanị'],
    [1.25, 'Otu Naira Naanị'],
    [10.99, 'Iri Naira Naanị'],
    [37.06, 'Iri Atọ Na Asaa Naira Naanị'],
    [37.68, 'Iri Atọ Na Asaa Naira Naanị'],
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
    [1.25, 'Otu Naira Naanị'],
    [10.99, 'Iri Naira Naanị'],
    [37.06, 'Iri Atọ Na Asaa Naira Naanị'],
    [37.68, 'Iri Atọ Na Asaa Naira Naanị'],
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

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, 'Nnari Na Iri Abụọ Na Atọ Naira Naanị'],
    ['123', 'Nnari Na Iri Abụọ Na Atọ Naira Naanị'],
    ['123.0', 'Nnari Na Iri Abụọ Na Atọ Naira Na Adịghị Kobo Naanị'],
    ['123.00', 'Nnari Na Iri Abụọ Na Atọ Naira Na Adịghị Kobo Naanị'],
    ['0.00', 'Adịghị Naira Na Adịghị Kobo Naanị'],
    ['-123.00', 'Mwepu Nnari Na Iri Abụọ Na Atọ Naira Na Adịghị Kobo Naanị'],
    ['37.68', 'Iri Atọ Na Asaa Naira Na Iri Isii Na Asatọ Kobo Naanị'],
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

// Powers of Ten
const testPowersOfTen: [number, string][] = [
  [10, 'Iri'],
  [100, 'Nnari'],
  [1000, 'Puku'],
  [10000, 'Puku Iri'],
  [100000, 'Puku Nnari'],
  [1000000, 'Nde'],
  [10000000, 'Nde Iri'],
  [100000000, 'Nde Nnari'],
  [1000000000, 'Ijeri'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Adịghị'],
  [1n, 'Otu'],
  [100n, 'Nnari'],
  [1000n, 'Puku'],
  [1000000n, 'Nde'],
  [1000000000n, 'Ijeri'],
  [1000000000000n, 'Tirịlịọn'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Mwepu Otu'],
  [-100n, 'Mwepu Nnari'],
  [-1000n, 'Mwepu Puku'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Adịghị'],
  ['1', 'Otu'],
  ['100', 'Nnari'],
  ['1000', 'Puku'],
  ['-100', 'Mwepu Nnari'],
  ['  100  ', 'Nnari'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Adịghị');
  });

  test('converts -0 as Adịghị', () => {
    expect(toWords.convert(-0)).toBe('Adịghị');
  });

  test('converts 0.0 as Adịghị', () => {
    expect(toWords.convert(0.0)).toBe('Adịghị');
  });

  test('converts 0n as Adịghị', () => {
    expect(toWords.convert(0n)).toBe('Adịghị');
  });

  test('converts "0" as Adịghị', () => {
    expect(toWords.convert('0')).toBe('Adịghị');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Adịghị Naira Naanị');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Puku Na Nnari Abụọ Na Iri Atọ Na Anọ Naira Naanị');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe(
      'Puku Na Nnari Abụọ Na Iri Atọ Na Anọ Naira',
    );
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

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() returns ordinal words', () => {
    expect(localeToOrdinal(1)).toBe('Mbụ');
    expect(localeToOrdinal(2)).toBe('Nke Abụọ');
    expect(localeToOrdinal(21)).toBe('Nke Iri Abụọ Na Otu');
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

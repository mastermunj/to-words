import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import jvId from '../src/locales/jv-ID.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/jv-ID.js';

const localeCode = 'jv-ID';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(jvId);
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
  [0, 'Nol'],
  [1, 'Siji'],
  [2, 'Loro'],
  [3, 'Telu'],
  [4, 'Papat'],
  [5, 'Lima'],
  [6, 'Enem'],
  [7, 'Pitu'],
  [8, 'Wolu'],
  [9, 'Sanga'],
  [10, 'Sepuluh'],
  [11, 'Sewelas'],
  [12, 'Rolas'],
  [13, 'Telulas'],
  [14, 'Patbelas'],
  [15, 'Limalas'],
  [16, 'Nembelas'],
  [17, 'Pitulas'],
  [18, 'Wolulas'],
  [19, 'Sangalas'],
  [20, 'Rong Puluh'],
  [21, 'Selikur'],
  [22, 'Rong Likur'],
  [23, 'Telu Likur'],
  [24, 'Pat Likur'],
  [25, 'Selawé'],
  [26, 'Nem Likur'],
  [27, 'Pitung Likur'],
  [28, 'Wolung Likur'],
  [29, 'Sangang Likur'],
  [30, 'Telung Puluh'],
  [31, 'Telung Puluh Siji'],
  [32, 'Telung Puluh Loro'],
  [40, 'Patang Puluh'],
  [42, 'Patang Puluh Loro'],
  [50, 'Sèket'],
  [51, 'Sèket Siji'],
  [55, 'Sèket Lima'],
  [60, 'Sewidak'],
  [61, 'Sewidak Siji'],
  [69, 'Sewidak Sanga'],
  [70, 'Pitung Puluh'],
  [75, 'Pitung Puluh Lima'],
  [80, 'Wolung Puluh'],
  [88, 'Wolung Puluh Wolu'],
  [90, 'Sangang Puluh'],
  [99, 'Sangang Puluh Sanga'],
  [100, 'Satus'],
  [101, 'Satus Siji'],
  [111, 'Satus Sewelas'],
  [121, 'Satus Selikur'],
  [125, 'Satus Selawé'],
  [150, 'Satus Sèket'],
  [200, 'Rong Atus'],
  [222, 'Rong Atus Rong Likur'],
  [300, 'Telung Atus'],
  [500, 'Limang Atus'],
  [999, 'Sangang Atus Sangang Puluh Sanga'],
  [1000, 'Sèwu'],
  [1001, 'Sèwu Siji'],
  [1025, 'Sèwu Selawé'],
  [1234, 'Sèwu Rong Atus Telung Puluh Papat'],
  [2000, 'Rong Èwu'],
  [5000, 'Limang Èwu'],
  [10000, 'Sepuluh Èwu'],
  [21000, 'Selikur Èwu'],
  [100000, 'Satus Èwu'],
  [500000, 'Limang Atus Èwu'],
  [1000000, 'Sayuta'],
  [2000000, 'Rong Yuta'],
  [10000000, 'Sepuluh Yuta'],
  [100000000, 'Satus Yuta'],
  [1000000000, 'Milyar'],
  [2000000000, 'Rong Milyar'],
  [1000000000000, 'Triliun'],
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Rupiah Waé`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Rupiah`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Rupiah Waé`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Rupiah Waé`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Rupiah Waé`;
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
  [0, 'Nol'],
  [0.04, 'Nol Koma Nol Papat'],
  [0.0468, 'Nol Koma Nol Papat Enem Wolu'],
  [0.4, 'Nol Koma Papat'],
  [0.63, 'Nol Koma Sewidak Telu'],
  [0.973, 'Nol Koma Sangang Atus Pitung Puluh Telu'],
  [0.999, 'Nol Koma Sangang Atus Sangang Puluh Sanga'],
  [37.06, 'Telung Puluh Pitu Koma Nol Enem'],
  [37.068, 'Telung Puluh Pitu Koma Nol Enem Wolu'],
  [37.68, 'Telung Puluh Pitu Koma Sewidak Wolu'],
  [37.683, 'Telung Puluh Pitu Koma Nem Atus Wolung Puluh Telu'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, 'Nol Rupiah Waé'],
  [0.01, 'Nol Rupiah Lan Siji Sen Waé'],
  [0.04, 'Nol Rupiah Lan Patang Sen Waé'],
  [0.0468, 'Nol Rupiah Lan Limang Sen Waé'],
  [0.5, 'Nol Rupiah Lan Sèket Sen Waé'],
  [0.63, 'Nol Rupiah Lan Sewidak Telung Sen Waé'],
  [0.973, 'Nol Rupiah Lan Sangang Puluh Pitung Sen Waé'],
  [0.999, 'Siji Rupiah Waé'],
  [1.25, 'Siji Rupiah Lan Selawé Sen Waé'],
  [10.99, 'Sepuluh Rupiah Lan Sangang Puluh Sangang Sen Waé'],
  [37.06, 'Telung Puluh Pitu Rupiah Lan Nem Sen Waé'],
  [37.68, 'Telung Puluh Pitu Rupiah Lan Sewidak Wolung Sen Waé'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, 'Siji Sen Waé'],
    [0.04, 'Patang Sen Waé'],
    [0.0468, 'Limang Sen Waé'],
    [0.5, 'Sèket Sen Waé'],
    [0.63, 'Sewidak Telung Sen Waé'],
    [0.973, 'Sangang Puluh Pitung Sen Waé'],
    [0.999, 'Siji Rupiah Waé'],
    [1.25, 'Siji Rupiah Lan Selawé Sen Waé'],
    [10.99, 'Sepuluh Rupiah Lan Sangang Puluh Sangang Sen Waé'],
    [37.06, 'Telung Puluh Pitu Rupiah Lan Nem Sen Waé'],
    [37.68, 'Telung Puluh Pitu Rupiah Lan Sewidak Wolung Sen Waé'],
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
    [0, 'Nol Rupiah Waé'],
    [0.01, 'Nol Rupiah Waé'],
    [0.04, 'Nol Rupiah Waé'],
    [0.0468, 'Nol Rupiah Waé'],
    [0.5, 'Nol Rupiah Waé'],
    [0.63, 'Nol Rupiah Waé'],
    [0.973, 'Nol Rupiah Waé'],
    [0.999, 'Nol Rupiah Waé'],
    [1.25, 'Siji Rupiah Waé'],
    [10.99, 'Sepuluh Rupiah Waé'],
    [37.06, 'Telung Puluh Pitu Rupiah Waé'],
    [37.68, 'Telung Puluh Pitu Rupiah Waé'],
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
    [1.25, 'Siji Rupiah Waé'],
    [10.99, 'Sepuluh Rupiah Waé'],
    [37.06, 'Telung Puluh Pitu Rupiah Waé'],
    [37.68, 'Telung Puluh Pitu Rupiah Waé'],
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
    [123, 'Satus Telu Likur Rupiah Waé'],
    ['123', 'Satus Telu Likur Rupiah Waé'],
    ['123.0', 'Satus Telu Likur Rupiah Lan Nol Sen Waé'],
    ['123.00', 'Satus Telu Likur Rupiah Lan Nol Sen Waé'],
    ['0.00', 'Nol Rupiah Lan Nol Sen Waé'],
    ['-123.00', 'Minus Satus Telu Likur Rupiah Lan Nol Sen Waé'],
    ['37.68', 'Telung Puluh Pitu Rupiah Lan Sewidak Wolung Sen Waé'],
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
  [10, 'Sepuluh'],
  [100, 'Satus'],
  [1000, 'Sèwu'],
  [10000, 'Sepuluh Èwu'],
  [100000, 'Satus Èwu'],
  [1000000, 'Sayuta'],
  [10000000, 'Sepuluh Yuta'],
  [100000000, 'Satus Yuta'],
  [1000000000, 'Milyar'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Nol'],
  [1n, 'Siji'],
  [100n, 'Satus'],
  [1000n, 'Sèwu'],
  [1000000n, 'Sayuta'],
  [1000000000n, 'Milyar'],
  [1000000000000n, 'Triliun'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Siji'],
  [-100n, 'Minus Satus'],
  [-1000n, 'Minus Sèwu'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Nol'],
  ['1', 'Siji'],
  ['100', 'Satus'],
  ['1000', 'Sèwu'],
  ['-100', 'Minus Satus'],
  ['  100  ', 'Satus'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Nol');
  });

  test('converts -0 as Nol', () => {
    expect(toWords.convert(-0)).toBe('Nol');
  });

  test('converts 0.0 as Nol', () => {
    expect(toWords.convert(0.0)).toBe('Nol');
  });

  test('converts 0n as Nol', () => {
    expect(toWords.convert(0n)).toBe('Nol');
  });

  test('converts "0" as Nol', () => {
    expect(toWords.convert('0')).toBe('Nol');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nol Rupiah Waé');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 1234;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Sèwu Rong Atus Telung Puluh Papat Rupiah Waé');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe(
      'Sèwu Rong Atus Telung Puluh Papat Rupiah',
    );
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

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() returns ordinal words', () => {
    expect(localeToOrdinal(1)).toBe('Kapisan');
    expect(localeToOrdinal(2)).toBe('Kaping Loro');
    expect(localeToOrdinal(21)).toBe('Kaping Selikur');
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

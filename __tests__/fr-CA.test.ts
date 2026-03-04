import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frCa from '../src/locales/fr-CA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/fr-CA.js';

const localeCode = 'fr-CA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frCa);
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
  [0, 'Zéro'],
  [137, 'Cent Trente-Sept'],
  [700, 'Sept Cents'],
  [4680, 'Quatre Mille Six Cent Quatre-Vingts'],
  [63892, 'Soixante-Trois Mille Huit Cent Quatre-Vingt-Douze'],
  [792581, 'Sept Cent Quatre-Vingt-Douze Mille Cinq Cent Quatre-Vingt-Un'],
  [1342823, 'Un Million Trois Cent Quarante-Deux Mille Huit Cent Vingt-Trois'],
  [2741034, 'Deux Millions Sept Cent Quarante Et Un Mille Trente-Quatre'],
  [86429753, 'Quatre-Vingt-Six Millions Quatre Cent Vingt-Neuf Mille Sept Cent Cinquante-Trois'],
  [975310864, 'Neuf Cent Soixante-Quinze Millions Trois Cent Dix Mille Huit Cent Soixante-Quatre'],
  [9876543210, 'Neuf Milliards Huit Cent Soixante-Seize Millions Cinq Cent Quarante-Trois Mille Deux Cent Dix'],
  [
    98765432101,
    'Quatre-Vingt-Dix-Huit Milliards Sept Cent Soixante-Cinq Millions Quatre Cent Trente-Deux Mille Cent Un',
  ],
  [
    987654321012,
    'Neuf Cent Quatre-Vingt-Sept Milliards Six Cent Cinquante-Quatre Millions Trois Cent Vingt Et Un Mille Douze',
  ],
  [
    9876543210123,
    'Neuf Billions Huit Cent Soixante-Seize Milliards Cinq Cent Quarante-Trois Millions Deux Cent Dix Mille Cent Vingt-Trois',
  ],
  [
    98765432101234,
    'Quatre-Vingt-Dix-Huit Billions Sept Cent Soixante-Cinq Milliards Quatre Cent Trente-Deux Millions Cent Un Mille Deux Cent Trente-Quatre',
  ],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
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
    row[1] = `Moins ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Dollars`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Dollars`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Dollars`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'Zéro'],
  [0.04, 'Zéro Virgule Zéro Quatre'],
  [0.0468, 'Zéro Virgule Zéro Quatre Six Huit'],
  [0.4, 'Zéro Virgule Quatre'],
  [0.63, 'Zéro Virgule Soixante-Trois'],
  [0.973, 'Zéro Virgule Neuf Cent Soixante-Treize'],
  [0.999, 'Zéro Virgule Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [37.06, 'Trente-Sept Virgule Zéro Six'],
  [37.068, 'Trente-Sept Virgule Zéro Six Huit'],
  [37.68, 'Trente-Sept Virgule Soixante-Huit'],
  [37.683, 'Trente-Sept Virgule Six Cent Quatre-Vingt-Trois'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zéro Dollars`],
  [0.04, `Zéro Dollars Et Quatre Cents`],
  [0.0468, `Zéro Dollars Et Cinq Cents`],
  [0.4, `Zéro Dollars Et Quarante Cents`],
  [0.63, `Zéro Dollars Et Soixante-Trois Cents`],
  [0.973, `Zéro Dollars Et Quatre-Vingt-Dix-Sept Cents`],
  [0.999, `Un Dollar`],
  [37.06, `Trente-Sept Dollars Et Six Cents`],
  [37.068, `Trente-Sept Dollars Et Sept Cents`],
  [37.68, `Trente-Sept Dollars Et Soixante-Huit Cents`],
  [37.683, `Trente-Sept Dollars Et Soixante-Huit Cents`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace(`Zéro Dollars Et `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = `Zéro Dollars`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Cents`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
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
    row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Cents`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testOrdinals: [number, string][] = [
  // Numbers 1-20
  [1, 'Premier'],
  [2, 'Deuxième'],
  [3, 'Troisième'],
  [4, 'Quatrième'],
  [5, 'Cinquième'],
  [6, 'Sixième'],
  [7, 'Septième'],
  [8, 'Huitième'],
  [9, 'Neuvième'],
  [10, 'Dixième'],
  [11, 'Onzième'],
  [12, 'Douzième'],
  [13, 'Treizième'],
  [14, 'Quatorzième'],
  [15, 'Quinzième'],
  [16, 'Seizième'],
  [17, 'Dix-Septième'],
  [18, 'Dix-Huitième'],
  [19, 'Dix-Neuvième'],
  [20, 'Vingtième'],
  // Composite numbers (21-29, 31-39, etc.)
  [21, 'Vingt Et Un'],
  [22, 'Vingt-Deux'],
  [23, 'Vingt-Trois'],
  [24, 'Vingt-Quatre'],
  [25, 'Vingt-Cinq'],
  [26, 'Vingt-Six'],
  [27, 'Vingt-Sept'],
  [28, 'Vingt-Huit'],
  [29, 'Vingt-Neuf'],
  // Tens (round numbers)
  [30, 'Trentième'],
  [31, 'Trente Et Un'],
  [40, 'Quarantième'],
  [41, 'Quarante Et Un'],
  [50, 'Cinquantième'],
  [51, 'Cinquante Et Un'],
  [60, 'Soixantième'],
  [61, 'Soixante Et Un'],
  // Special French numbers (60-79 based on 60, 80-99 based on 80)
  [70, 'Soixante-Dixième'],
  [71, 'Soixante Et Onze'],
  [72, 'Soixante-Douze'],
  [73, 'Soixante-Treize'],
  [79, 'Soixante-Dix-Neuf'],
  [80, 'Quatre-Vingtième'],
  [81, 'Quatre-Vingt-Un'],
  [82, 'Quatre-Vingt-Deux'],
  [89, 'Quatre-Vingt-Neuf'],
  [90, 'Quatre-Vingt-Dixième'],
  [91, 'Quatre-Vingt-Onze'],
  [92, 'Quatre-Vingt-Douze'],
  [99, 'Quatre-Vingt-Dix-Neuf'],
  // Round numbers (100, 200, etc.)
  [100, 'Centième'],
  [200, 'Deux Centième'],
  [300, 'Trois Centième'],
  [500, 'Cinq Centième'],
  // Complex numbers
  [101, 'Cent Premier'],
  [110, 'Cent Dixième'],
  [111, 'Cent Onzième'],
  [123, 'Cent Vingt-Trois'],
  [150, 'Cent Cinquantième'],
  [199, 'Cent Quatre-Vingt-Dix-Neuf'],
  // Thousands
  [1000, 'Millième'],
  [1001, 'Mille Premier'],
  [1010, 'Mille Dixième'],
  [1100, 'Mille Centième'],
  [1234, 'Mille Deux Cent Trente-Quatre'],
  [2000, 'Deux Millième'],
  [10000, 'Dix Millième'],
  [100000, 'Cent Millième'],
  // Millions and beyond
  [1000000, 'Un Millionième'],
  [10000000, 'Dix Millionième'],
  [100000000, 'Cent Millionième'],
  [1000000000, 'Un Milliardième'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for negative decimal numbers', () => {
    expect(() => toWords.toOrdinal(-3.14)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR fr-CA
// ============================================================

// Extended Integer Tests (1-100 covering French complexities)
const testIntegersExtended: [number, string][] = [
  [1, 'Un'],
  [2, 'Deux'],
  [3, 'Trois'],
  [4, 'Quatre'],
  [5, 'Cinq'],
  [6, 'Six'],
  [7, 'Sept'],
  [8, 'Huit'],
  [9, 'Neuf'],
  [10, 'Dix'],
  [11, 'Onze'],
  [12, 'Douze'],
  [13, 'Treize'],
  [14, 'Quatorze'],
  [15, 'Quinze'],
  [16, 'Seize'],
  [17, 'Dix-Sept'],
  [18, 'Dix-Huit'],
  [19, 'Dix-Neuf'],
  [20, 'Vingt'],
  [21, 'Vingt Et Un'],
  [22, 'Vingt-Deux'],
  [30, 'Trente'],
  [31, 'Trente Et Un'],
  [40, 'Quarante'],
  [50, 'Cinquante'],
  [60, 'Soixante'],
  [70, 'Soixante-Dix'],
  [71, 'Soixante Et Onze'],
  [72, 'Soixante-Douze'],
  [79, 'Soixante-Dix-Neuf'],
  [80, 'Quatre-Vingts'],
  [81, 'Quatre-Vingt-Un'],
  [90, 'Quatre-Vingt-Dix'],
  [91, 'Quatre-Vingt-Onze'],
  [99, 'Quatre-Vingt-Dix-Neuf'],
  [100, 'Cent'],
];

describe('Test Extended Integers (1-100)', () => {
  test.concurrent.each(testIntegersExtended)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Powers of Ten (International System - French)
const testPowersOfTen: [number, string][] = [
  [10, 'Dix'],
  [100, 'Cent'],
  [1000, 'Mille'],
  [10000, 'Dix Mille'],
  [100000, 'Cent Mille'],
  [1000000, 'Un Million'],
  [10000000, 'Dix Millions'],
  [100000000, 'Cent Millions'],
  [1000000000, 'Un Milliard'],
  [10000000000, 'Dix Milliards'],
  [100000000000, 'Cent Milliards'],
  [1000000000000, 'Un Billion'],
];

describe('Test Powers of Ten (International System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'Quatre-Vingt-Dix-Neuf'],
  [100, 'Cent'],
  [101, 'Cent Un'],
  [999, 'Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [1000, 'Mille'],
  [1001, 'Mille Un'],
  [9999, 'Neuf Mille Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [10000, 'Dix Mille'],
  [10001, 'Dix Mille Un'],
  [99999, 'Quatre-Vingt-Dix-Neuf Mille Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [100000, 'Cent Mille'],
  [999999, 'Neuf Cent Quatre-Vingt-Dix-Neuf Mille Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [1000000, 'Un Million'],
  [1000001, 'Un Million Un'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Moins Zéro Virgule Cinq'],
  [-0.25, 'Moins Zéro Virgule Vingt-Cinq'],
  [-0.99, 'Moins Zéro Virgule Quatre-Vingt-Dix-Neuf'],
  [-1.5, 'Moins Un Virgule Cinq'],
  [-3.14, 'Moins Trois Virgule Quatorze'],
  [-99.99, 'Moins Quatre-Vingt-Dix-Neuf Virgule Quatre-Vingt-Dix-Neuf'],
  [-100.01, 'Moins Cent Virgule Zéro Un'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Moins Zéro Dollars Et Cinquante Cents'],
  [-0.99, 'Moins Zéro Dollars Et Quatre-Vingt-Dix-Neuf Cents'],
  [-1.5, 'Moins Un Dollar Et Cinquante Cents'],
  [-1.01, 'Moins Un Dollar Et Un Cent'],
  [-100.5, 'Moins Cent Dollars Et Cinquante Cents'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zéro'],
  [1n, 'Un'],
  [100n, 'Cent'],
  [1000n, 'Mille'],
  [1000000n, 'Un Million'],
  [1000000000n, 'Un Milliard'],
  [1000000000000n, 'Un Billion'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Moins Un'],
  [-100n, 'Moins Cent'],
  [-1000n, 'Moins Mille'],
  [-1000000n, 'Moins Un Million'],
  [-1000000000n, 'Moins Un Milliard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Zéro Dollars'],
  [1n, 'Un Dollar'],
  [2n, 'Deux Dollars'],
  [100n, 'Cent Dollars'],
  [1000n, 'Mille Dollars'],
  [1000000n, 'Un Million Dollars'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zéro'],
  ['1', 'Un'],
  ['100', 'Cent'],
  ['1000', 'Mille'],
  ['-100', 'Moins Cent'],
  ['3.14', 'Trois Virgule Quatorze'],
  ['-3.14', 'Moins Trois Virgule Quatorze'],
  ['  100  ', 'Cent'],
  ['1000000', 'Un Million'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Zéro');
  });

  test('converts -0 as Zéro', () => {
    expect(toWords.convert(-0)).toBe('Zéro');
  });

  test('converts 0.0 as Zéro', () => {
    expect(toWords.convert(0.0)).toBe('Zéro');
  });

  test('converts 0n as Zéro', () => {
    expect(toWords.convert(0n)).toBe('Zéro');
  });

  test('converts "0" as Zéro', () => {
    expect(toWords.convert('0')).toBe('Zéro');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zéro Dollars');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Singular/Plural Tests
describe('Test Currency Singular/Plural', () => {
  test('1 Dollar (singular)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Un Dollar');
  });

  test('2 Dollars (plural)', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Deux Dollars');
  });

  test('0.01 Cent (singular)', () => {
    expect(toWords.convert(0.01, { currency: true })).toBe('Zéro Dollars Et Un Cent');
  });

  test('0.02 Cents (plural)', () => {
    expect(toWords.convert(0.02, { currency: true })).toBe('Zéro Dollars Et Deux Cents');
  });

  test('1.01 (singular + singular)', () => {
    expect(toWords.convert(1.01, { currency: true })).toBe('Un Dollar Et Un Cent');
  });

  test('2.02 (plural + plural)', () => {
    expect(toWords.convert(2.02, { currency: true })).toBe('Deux Dollars Et Deux Cents');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Cent Dollars Et Cinquante Cents');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('Cent Dollars Et Cinquante Cents');
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('Cent Dollars');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe(
      'Cent Dollars',
    );
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for fr-CA', () => {
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

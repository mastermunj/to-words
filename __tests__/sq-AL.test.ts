import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import sqAl from '../src/locales/sq-AL.js';
import { ToWords as LocaleToWords } from '../src/locales/sq-AL.js';

const localeCode = 'sq-AL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(sqAl);
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
  [0, 'Zero'],
  [1, 'Një'],
  [2, 'Dy'],
  [3, 'Tre'],
  [4, 'Katër'],
  [5, 'Pesë'],
  [6, 'Gjashtë'],
  [7, 'Shtatë'],
  [8, 'Tetë'],
  [9, 'Nëntë'],
  [10, 'Dhjetë'],
  [11, 'Njëmbëdhjetë'],
  [12, 'Dymbëdhjetë'],
  [13, 'Trembëdhjetë'],
  [14, 'Katërmbëdhjetë'],
  [15, 'Pesëmbëdhjetë'],
  [16, 'Gjashtëmbëdhjetë'],
  [17, 'Shtatëmbëdhjetë'],
  [18, 'Tetëmbëdhjetë'],
  [19, 'Nëntëmbëdhjetë'],
  [20, 'Njëzet'],
  [21, 'Njëzet Një'],
  [22, 'Njëzet Dy'],
  [30, 'Tridhjetë'],
  [35, 'Tridhjetë Pesë'],
  [40, 'Dyzet'],
  [50, 'Pesëdhjetë'],
  [60, 'Gjashtëdhjetë'],
  [70, 'Shtatëdhjetë'],
  [80, 'Tetëdhjetë'],
  [90, 'Nëntëdhjetë'],
  [99, 'Nëntëdhjetë Nëntë'],
  [100, 'Njëqind'],
  [137, 'Njëqind Tridhjetë Shtatë'],
  [200, 'Dyqind'],
  [300, 'Treqind'],
  [400, 'Katërqind'],
  [500, 'Pesëqind'],
  [600, 'Gjashtëqind'],
  [700, 'Shtatëqind'],
  [800, 'Tetëqind'],
  [900, 'Nëntëqind'],
  [1000, 'Një Mijë'],
  [1100, 'Një Mijë Njëqind'],
  [2000, 'Dy Mijë'],
  [3000, 'Tre Mijë'],
  [4000, 'Katër Mijë'],
  [5000, 'Pesë Mijë'],
  [4680, 'Katër Mijë Gjashtëqind Tetëdhjetë'],
  [10000, 'Dhjetë Mijë'],
  [63892, 'Gjashtëdhjetë Tre Mijë Tetëqind Nëntëdhjetë Dy'],
  [100000, 'Njëqind Mijë'],
  [1000000, 'Një Milion'],
  [2000000, 'Dy Milion'],
  [5000000, 'Pesë Milion'],
  [2741034, 'Dy Milion Shtatëqind Dyzet Një Mijë Tridhjetë Katër'],
  [1000000000, 'Një Miliard'],
  [2000000000, 'Dy Miliard'],
  [5000000000, 'Pesë Miliard'],
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
    row[1] = `${row[1]} Lekë Vetëm`;
  });
  testIntegersWithCurrency[1][1] = 'Një Lek Vetëm';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Lekë`;
  });
  testIntegersWithCurrency[1][1] = 'Një Lek';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Lekë Vetëm`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Lekë Vetëm`;
  });
  testNegativeIntegersWithCurrency[1][1] = 'Minus Një Lek Vetëm';

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else if (i === 1) {
      row[1] = 'Një Lek Vetëm';
    } else {
      row[1] = `${row[1]} Lekë Vetëm`;
    }
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
  [0.0, 'Zero'],
  [0.04, 'Zero Presje Zero Katër'],
  [0.4, 'Zero Presje Katër'],
  [0.63, 'Zero Presje Gjashtëdhjetë Tre'],
  [37.06, 'Tridhjetë Shtatë Presje Zero Gjashtë'],
  [37.68, 'Tridhjetë Shtatë Presje Gjashtëdhjetë Tetë'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Zero Lekë Vetëm'],
  [0.04, 'Zero Lekë E Katër Qindarka Vetëm'],
  [0.4, 'Zero Lekë E Dyzet Qindarka Vetëm'],
  [0.63, 'Zero Lekë E Gjashtëdhjetë Tre Qindarka Vetëm'],
  [0.999, 'Një Lek Vetëm'],
  [37.06, 'Tridhjetë Shtatë Lekë E Gjashtë Qindarka Vetëm'],
  [37.68, 'Tridhjetë Shtatë Lekë E Gjashtëdhjetë Tetë Qindarka Vetëm'],
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
      row[1] = (row[1] as string).replace('Zero Lekë E ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'Zero Lekë Vetëm'],
    [0.04, 'Zero Lekë Vetëm'],
    [0.4, 'Zero Lekë Vetëm'],
    [0.63, 'Zero Lekë Vetëm'],
    [0.999, 'Zero Lekë Vetëm'],
    [37.06, 'Tridhjetë Shtatë Lekë Vetëm'],
    [37.68, 'Tridhjetë Shtatë Lekë Vetëm'],
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

// Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, 'I Parë'],
  [2, 'I Dytë'],
  [3, 'I Tretë'],
  [4, 'I Katërt'],
  [5, 'I Pestë'],
  [6, 'I Gjashtë'],
  [7, 'I Shtatë'],
  [8, 'I Tetë'],
  [9, 'I Nëntë'],
  [10, 'I Dhjetëti'],
  [11, 'I Njëmbëdhjetëti'],
  [12, 'I Dymbëdhjetëti'],
  [13, 'I Trembëdhjetëti'],
  [14, 'I Katërmbëdhjetëti'],
  [15, 'I Pesëmbëdhjetëti'],
  [16, 'I Gjashtëmbëdhjetëti'],
  [17, 'I Shtatëmbëdhjetëti'],
  [18, 'I Tetëmbëdhjetëti'],
  [19, 'I Nëntëmbëdhjetëti'],
  [20, 'I Njëzetti'],
  [21, 'Njëzet I Parë'],
  [22, 'Njëzet I Dytë'],
  [30, 'I Tridhjetëti'],
  [40, 'I Dyzetti'],
  [50, 'I Pesëdhjetëti'],
  [60, 'I Gjashtëdhjetëti'],
  [70, 'I Shtatëdhjetëti'],
  [80, 'I Tetëdhjetëti'],
  [90, 'I Nëntëdhjetëti'],
  [100, 'I Njëqindti'],
  [101, 'Njëqind I Parë'],
  [200, 'I Dyqindti'],
  [300, 'I Treqindti'],
  [1000, 'I Mijëti'],
  [1001, 'Një Mijë I Parë'],
  [1000000, 'I Milionti'],
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

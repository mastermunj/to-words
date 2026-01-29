import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import caEs from '../src/locales/ca-ES.js';
import { ToWords as LocaleToWords } from '../src/locales/ca-ES.js';

const localeCode = 'ca-ES';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(caEs);
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
  [1, 'Un'],
  [2, 'Dos'],
  [3, 'Tres'],
  [4, 'Quatre'],
  [5, 'Cinc'],
  [6, 'Sis'],
  [7, 'Set'],
  [8, 'Vuit'],
  [9, 'Nou'],
  [10, 'Deu'],
  [11, 'Onze'],
  [12, 'Dotze'],
  [13, 'Tretze'],
  [14, 'Catorze'],
  [15, 'Quinze'],
  [16, 'Setze'],
  [17, 'Disset'],
  [18, 'Divuit'],
  [19, 'Dinou'],
  [20, 'Vint'],
  [21, 'Vint-I-Un'],
  [22, 'Vint-I-Dos'],
  [25, 'Vint-I-Cinc'],
  [29, 'Vint-I-Nou'],
  [30, 'Trenta'],
  [31, 'Trenta Un'],
  [35, 'Trenta Cinc'],
  [40, 'Quaranta'],
  [50, 'Cinquanta'],
  [60, 'Seixanta'],
  [70, 'Setanta'],
  [80, 'Vuitanta'],
  [90, 'Noranta'],
  [99, 'Noranta Nou'],
  [100, 'Cent'],
  [137, 'Cent Trenta Set'],
  [200, 'Dos-Cents'],
  [300, 'Tres-Cents'],
  [400, 'Quatre-Cents'],
  [500, 'Cinc-Cents'],
  [600, 'Sis-Cents'],
  [700, 'Set-Cents'],
  [800, 'Vuit-Cents'],
  [900, 'Nou-Cents'],
  [1000, 'Mil'],
  [1100, 'Mil Cent'],
  [2000, 'Dos Mil'],
  [4680, 'Quatre Mil Sis-Cents Vuitanta'],
  [10000, 'Deu Mil'],
  [63892, 'Seixanta Tres Mil Vuit-Cents Noranta Dos'],
  [100000, 'Cent Mil'],
  [1000000, 'Un Milió'],
  [2000000, 'Dos Milións'],
  [2741034, 'Dos Milións Set-Cents Quaranta Un Mil Trenta Quatre'],
  [1000000000, 'Mil Milions'],
  [2000000000, 'Dos Mil Milions'],
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
    row[1] = `Menys ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Zero Euros'],
    [1, 'Un Euro'],
    [2, 'Dos Euros'],
    [10, 'Deu Euros'],
    [100, 'Cent Euros'],
    [1000, 'Mil Euros'],
    [1000000, 'Un Milió Euros'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Zero Euros'],
    [1, 'Un Euro'],
    [2, 'Dos Euros'],
    [10, 'Deu Euros'],
    [100, 'Cent Euros'],
    [1000, 'Mil Euros'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency: [number, string][] = [
    [0, 'Zero Euros'],
    [-1, 'Menys Un Euro'],
    [-10, 'Menys Deu Euros'],
    [-100, 'Menys Cent Euros'],
  ];

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [1, 'Un Euro'],
    [10, 'Deu Euros'],
  ];

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
  [0.04, 'Zero Coma Zero Quatre'],
  [0.4, 'Zero Coma Quatre'],
  [0.63, 'Zero Coma Seixanta Tres'],
  [37.06, 'Trenta Set Coma Zero Sis'],
  [37.68, 'Trenta Set Coma Seixanta Vuit'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Zero Euros'],
  [0.04, 'Zero Euros I Quatre Cèntims'],
  [0.4, 'Zero Euros I Quaranta Cèntims'],
  [0.63, 'Zero Euros I Seixanta Tres Cèntims'],
  [37.06, 'Trenta Set Euros I Sis Cèntims'],
  [37.68, 'Trenta Set Euros I Seixanta Vuit Cèntims'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.04, 'Quatre Cèntims'],
    [0.4, 'Quaranta Cèntims'],
    [37.06, 'Trenta Set Euros I Sis Cèntims'],
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
    [0.0, 'Zero Euros'],
    [0.04, 'Zero Euros'],
    [0.4, 'Zero Euros'],
    [37.06, 'Trenta Set Euros'],
    [37.68, 'Trenta Set Euros'],
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
const testOrdinals: [number, string][] = [
  [1, 'Primer'],
  [2, 'Segon'],
  [3, 'Tercer'],
  [4, 'Quart'],
  [5, 'Cinquè'],
  [6, 'Sisè'],
  [7, 'Setè'],
  [8, 'Vuitè'],
  [9, 'Novè'],
  [10, 'Desè'],
  [11, 'Onzè'],
  [12, 'Dotzè'],
  [13, 'Tretzè'],
  [19, 'Dinovè'],
  [20, 'Vintè'],
  [21, 'Vint-I-Un'],
  [30, 'Trentè'],
  [50, 'Cinquantè'],
  [100, 'Centèsim'],
  [101, 'Cent Primer'],
  [110, 'Cent Desè'],
  [200, 'Dos-Centèsim'],
  [1000, 'Mil·lèsim'],
  [1001, 'Mil Primer'],
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

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

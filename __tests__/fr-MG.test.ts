import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frMg from '../src/locales/fr-MG.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/fr-MG.js';

const localeCode = 'fr-MG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frMg);
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
  [0, 'Zéro'],
  [1, 'Un'],
  [21, 'Vingt Et Un'],
  [100, 'Cent'],
  [137, 'Cent Trente-Sept'],
  [700, 'Sept Cents'],
  [1000, 'Mille'],
  [4680, 'Quatre Mille Six Cent Quatre-Vingts'],
  [63892, 'Soixante-Trois Mille Huit Cent Quatre-Vingt-Douze'],
  [792581, 'Sept Cent Quatre-Vingt-Douze Mille Cinq Cent Quatre-Vingt-Un'],
  [1000000, 'Un Million'],
  [1342823, 'Un Million Trois Cent Quarante-Deux Mille Huit Cent Vingt-Trois'],
  [2741034, 'Deux Millions Sept Cent Quarante Et Un Mille Trente-Quatre'],
  [86429753, 'Quatre-Vingt-Six Millions Quatre Cent Vingt-Neuf Mille Sept Cent Cinquante-Trois'],
  [975310864, 'Neuf Cent Soixante-Quinze Millions Trois Cent Dix Mille Huit Cent Soixante-Quatre'],
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
    row[1] = `${row[1]} Ariary`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Ariary`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} Ariary`;
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

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Cent Vingt-Trois Ariary`],
    ['123', `Cent Vingt-Trois Ariary`],
    ['123.0', `Cent Vingt-Trois Ariary Et Zéro Iraimbilanja`],
    ['123.00', `Cent Vingt-Trois Ariary Et Zéro Iraimbilanja`],
    ['0.00', `Zéro Ariary Et Zéro Iraimbilanja`],
    ['-123.00', `Moins Cent Vingt-Trois Ariary Et Zéro Iraimbilanja`],
    ['37.68', `Trente-Sept Ariary Et Soixante-Huit Iraimbilanja`],
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

const testFloats: [number, string][] = [
  [0.0, 'Zéro'],
  [0.04, 'Zéro Virgule Zéro Quatre'],
  [0.4, 'Zéro Virgule Quatre'],
  [0.73, 'Zéro Virgule Soixante-Treize'],
  [0.999, 'Zéro Virgule Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [37.06, 'Trente-Sept Virgule Zéro Six'],
  [37.68, 'Trente-Sept Virgule Soixante-Huit'],
  [37.683, 'Trente-Sept Virgule Six Cent Quatre-Vingt-Trois'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Zéro Ariary'],
  [0.04, 'Zéro Ariary Et Quatre Iraimbilanja'],
  [0.4, 'Zéro Ariary Et Quarante Iraimbilanja'],
  [0.63, 'Zéro Ariary Et Soixante-Trois Iraimbilanja'],
  [0.973, 'Zéro Ariary Et Quatre-Vingt-Dix-Sept Iraimbilanja'],
  [0.999, 'Un Ariary'],
  [1, 'Un Ariary'],
  [37.06, 'Trente-Sept Ariary Et Six Iraimbilanja'],
  [37.68, 'Trente-Sept Ariary Et Soixante-Huit Iraimbilanja'],
  [37.683, 'Trente-Sept Ariary Et Soixante-Huit Iraimbilanja'],
  [100, 'Cent Ariary'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace('Zéro Ariary Et ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, 'Zéro Ariary'];
      case value >= 1 && value < 2:
        return [value, 'Un Ariary'];
      case value >= 37 && value < 38:
        return [value, 'Trente-Sept Ariary'];
      case value >= 100 && value < 101:
        return [value, 'Cent Ariary'];
      default:
        return row;
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, ''];
      case value >= 1 && value < 2:
        return [value, 'Un Ariary'];
      case value >= 37 && value < 38:
        return [value, 'Trente-Sept Ariary'];
      case value >= 100 && value < 101:
        return [value, 'Cent Ariary'];
      default:
        return row;
    }
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

describe('Test Locale functional exports', () => {
  test('localeToWords works', () => {
    expect(localeToWords(1)).toBe('Un');
  });

  test('localeToOrdinal works', () => {
    expect(typeof localeToOrdinal(1)).toBe('string');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(1)).toBe('Un Ariary');
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frDz from '../src/locales/fr-DZ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/fr-DZ.js';

const localeCode = 'fr-DZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frDz);
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
    row[1] = row[0] === 1 ? `Un Dinar` : `${row[1]} Dinars`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = row[0] === 1 ? `Un Dinar` : `${row[1]} Dinars`;
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
    row[1] = row[0] === 1 ? `Un Dinar` : `${row[1]} Dinars`;
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
    [123, `Cent Vingt-Trois Dinars`],
    ['123', `Cent Vingt-Trois Dinars`],
    ['123.0', `Cent Vingt-Trois Dinars Et Zéro Centimes`],
    ['123.00', `Cent Vingt-Trois Dinars Et Zéro Centimes`],
    ['0.00', `Zéro Dinars Et Zéro Centimes`],
    ['-123.00', `Moins Cent Vingt-Trois Dinars Et Zéro Centimes`],
    ['37.68', `Trente-Sept Dinars Et Soixante-Huit Centimes`],
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
  [0.0, 'Zéro Dinars'],
  [0.04, 'Zéro Dinars Et Quatre Centimes'],
  [0.4, 'Zéro Dinars Et Quarante Centimes'],
  [0.63, 'Zéro Dinars Et Soixante-Trois Centimes'],
  [0.973, 'Zéro Dinars Et Quatre-Vingt-Dix-Sept Centimes'],
  [0.999, 'Un Dinar'],
  [1, 'Un Dinar'],
  [37.06, 'Trente-Sept Dinars Et Six Centimes'],
  [37.68, 'Trente-Sept Dinars Et Soixante-Huit Centimes'],
  [37.683, 'Trente-Sept Dinars Et Soixante-Huit Centimes'],
  [100, 'Cent Dinars'],
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
      row[1] = (row[1] as string).replace('Zéro Dinars Et ', '');
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

describe('Test Locale functional exports', () => {
  test('localeToWords works', () => {
    expect(localeToWords(1)).toBe('Un');
  });

  test('localeToOrdinal works', () => {
    expect(typeof localeToOrdinal(1)).toBe('string');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(1)).toBe('Un Dinar');
  });
});

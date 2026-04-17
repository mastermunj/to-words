import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frCh from '../src/locales/fr-CH.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/fr-CH.js';

const localeCode = 'fr-CH';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frCh);
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
  [4680, 'Quatre Mille Six Cent Huitante'],
  [63892, 'Soixante-Trois Mille Huit Cent Nonante-Deux'],
  [792581, 'Sept Cent Nonante-Deux Mille Cinq Cent Huitante Et Un'],
  [1342823, 'Un Million Trois Cent Quarante-Deux Mille Huit Cent Vingt-Trois'],
  [2741034, 'Deux Millions Sept Cent Quarante Et Un Mille Trente-Quatre'],
  [86429753, 'Huitante-Six Millions Quatre Cent Vingt-Neuf Mille Sept Cent Cinquante-Trois'],
  [975310864, 'Neuf Cent Septante-Cinq Millions Trois Cent Dix Mille Huit Cent Soixante-Quatre'],
  [9876543210, 'Neuf Milliards Huit Cent Septante-Six Millions Cinq Cent Quarante-Trois Mille Deux Cent Dix'],
  [98765432101, 'Nonante-Huit Milliards Sept Cent Soixante-Cinq Millions Quatre Cent Trente-Deux Mille Cent Un'],
  [
    987654321012,
    'Neuf Cent Huitante-Sept Milliards Six Cent Cinquante-Quatre Millions Trois Cent Vingt Et Un Mille Douze',
  ],
  [
    9876543210123,
    'Neuf Billions Huit Cent Septante-Six Milliards Cinq Cent Quarante-Trois Millions Deux Cent Dix Mille Cent Vingt-Trois',
  ],
  [
    98765432101234,
    'Nonante-Huit Billions Sept Cent Soixante-Cinq Milliards Quatre Cent Trente-Deux Millions Cent Un Mille Deux Cent Trente-Quatre',
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

const testIntegersCurrency: [number, string][] = [
  [0, 'Zéro'],
  [137, 'Cent Trente-Sept'],
  [700, 'Sept Cents'],
  [4680, 'Quatre Mille Six Cent Huitante'],
  [63892, 'Soixante-Trois Mille Huit Cent Nonante-Deux'],
  [792581, 'Sept Cent Nonante-Deux Mille Cinq Cent Huitante Et Un'],
];

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Francs`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Francs`;
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
  [0.4, 'Zéro Virgule Quatre'],
  [0.63, 'Zéro Virgule Soixante-Trois'],
  [0.973, 'Zéro Virgule Neuf Cent Septante-Trois'],
  [37.06, 'Trente-Sept Virgule Zéro Six'],
  [37.68, 'Trente-Sept Virgule Soixante-Huit'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Zéro Francs'],
  [0.04, 'Zéro Francs Et Quatre Centimes'],
  [0.4, 'Zéro Francs Et Quarante Centimes'],
  [0.63, 'Zéro Francs Et Soixante-Trois Centimes'],
  [37.06, 'Trente-Sept Francs Et Six Centimes'],
  [37.68, 'Trente-Sept Francs Et Soixante-Huit Centimes'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Swiss French specific numbers', () => {
  test('70 = Septante', () => {
    expect(toWords.convert(70)).toBe('Septante');
  });

  test('71 = Septante Et Un', () => {
    expect(toWords.convert(71)).toBe('Septante Et Un');
  });

  test('80 = Huitante', () => {
    expect(toWords.convert(80)).toBe('Huitante');
  });

  test('81 = Huitante Et Un', () => {
    expect(toWords.convert(81)).toBe('Huitante Et Un');
  });

  test('90 = Nonante', () => {
    expect(toWords.convert(90)).toBe('Nonante');
  });

  test('91 = Nonante Et Un', () => {
    expect(toWords.convert(91)).toBe('Nonante Et Un');
  });

  test('99 = Nonante-Neuf', () => {
    expect(toWords.convert(99)).toBe('Nonante-Neuf');
  });
});

describe('Test Ordinals', () => {
  const testOrdinals: [number, string][] = [
    [1, 'Premier'],
    [2, 'Deuxième'],
    [3, 'Troisième'],
    [10, 'Dixième'],
    [70, 'Septantième'],
    [80, 'Huitantième'],
    [90, 'Nonantième'],
    [100, 'Centième'],
    [1000, 'Millième'],
  ];

  test.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test functional API', () => {
  test('localeToWords works', () => {
    expect(localeToWords(70)).toBe('Septante');
  });

  test('localeToOrdinal works', () => {
    expect(localeToOrdinal(1)).toBe('Premier');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(100)).toBe('Cent Francs');
  });
});

const testFractionStyleFrCH: [number, string][] = [
  [1.1, 'Un Et Un Dixième'],
  [2.5, 'Deux Et Cinq Dixièmes'],
  [1.01, 'Un Et Un Centième'],
  [1.45, 'Un Et Quarante-Cinq Centièmes'],
  [0.05, 'Zéro Et Cinq Centièmes'],
  [1.001, 'Un Et Un Millième'],
  [1.005, 'Un Et Cinq Millièmes'],
  [1.0001, 'Un Et Un Dix-Millième'],
  [1.0005, 'Un Et Cinq Dix-Millièmes'],
  [1.00001, 'Un Et Un Cent-Millième'],
  [1.00005, 'Un Et Cinq Cent-Millièmes'],
  [1.000001, 'Un Et Un Millionième'],
  [1.000005, 'Un Et Cinq Millionièmes'],
  [123.45, 'Cent Vingt-Trois Et Quarante-Cinq Centièmes'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleFrCH)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Un Virgule Un Million Deux Cent Trente-Quatre Mille Cinq Cent Soixante-Sept',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Un Virgule Un Million Deux Cent Trente-Quatre Mille Cinq Cent Soixante-Sept',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Un Virgule Cinq');
    expect(toWords.convert(0.05)).toBe('Zéro Virgule Zéro Cinq');
  });
});

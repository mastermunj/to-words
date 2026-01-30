import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import skSk from '../src/locales/sk-SK.js';
import { ToWords as LocaleToWords } from '../src/locales/sk-SK.js';

const localeCode = 'sk-SK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(skSk);
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
  [0, 'Nula'],
  [1, 'Jeden'],
  [2, 'Dva'],
  [3, 'Tri'],
  [4, 'Štyri'],
  [5, 'Päť'],
  [6, 'Šesť'],
  [7, 'Sedem'],
  [8, 'Osem'],
  [9, 'Deväť'],
  [10, 'Desať'],
  [11, 'Jedenásť'],
  [12, 'Dvanásť'],
  [13, 'Trinásť'],
  [14, 'Štrnásť'],
  [15, 'Pätnásť'],
  [16, 'Šestnásť'],
  [17, 'Sedemnásť'],
  [18, 'Osemnásť'],
  [19, 'Devätnásť'],
  [20, 'Dvadsať'],
  [21, 'Dvadsať Jeden'],
  [22, 'Dvadsať Dva'],
  [30, 'Tridsať'],
  [35, 'Tridsať Päť'],
  [40, 'Štyridsať'],
  [50, 'Päťdesiat'],
  [60, 'Šesťdesiat'],
  [70, 'Sedemdesiat'],
  [80, 'Osemdesiat'],
  [90, 'Deväťdesiat'],
  [99, 'Deväťdesiat Deväť'],
  [100, 'Sto'],
  [137, 'Sto Tridsať Sedem'],
  [200, 'Dvesto'],
  [300, 'Tristo'],
  [400, 'Štyristo'],
  [500, 'Päťsto'],
  [600, 'Šesťsto'],
  [700, 'Sedemsto'],
  [800, 'Osemsto'],
  [900, 'Deväťsto'],
  [1000, 'Tisíc'],
  [1100, 'Tisíc Sto'],
  [2000, 'Dva Tisíce'],
  [3000, 'Tri Tisíce'],
  [4000, 'Štyri Tisíce'],
  [5000, 'Päť Tisíc'],
  [4680, 'Štyri Tisíce Šesťsto Osemdesiat'],
  [10000, 'Desať Tisíc'],
  [63892, 'Šesťdesiat Tri Tisíc Osemsto Deväťdesiat Dva'],
  [100000, 'Sto Tisíc'],
  [1000000, 'Milión'],
  [2000000, 'Dva Milióny'],
  [5000000, 'Päť Milión'],
  [2741034, 'Dva Milióny Sedemsto Štyridsať Jeden Tisíc Tridsať Štyri'],
  [1000000000, 'Miliarda'],
  [2000000000, 'Dva Miliardy'],
  [5000000000, 'Päť Miliarda'],
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
    row[1] = `Mínus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// Helper function to get Slovak currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Jeden') {
    return 'Euro';
  }
  // Default plural for all other numbers
  return 'Eur';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Len`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Eur Len`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Mínus ${row[1]} ${currencyName} Len`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else {
      const currencyName = getCurrencyName(row[1] as string);
      row[1] = `${row[1]} ${currencyName} Len`;
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
  [0.0, 'Nula'],
  [0.04, 'Nula Celá Nula Štyri'],
  [0.4, 'Nula Celá Štyri'],
  [0.63, 'Nula Celá Šesťdesiat Tri'],
  [37.06, 'Tridsať Sedem Celá Nula Šesť'],
  [37.68, 'Tridsať Sedem Celá Šesťdesiat Osem'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nula Eur Len'],
  [0.04, 'Nula Eur A Štyri Centov Len'],
  [0.4, 'Nula Eur A Štyridsať Centov Len'],
  [0.63, 'Nula Eur A Šesťdesiat Tri Centov Len'],
  [0.999, 'Jeden Euro Len'],
  [37.06, 'Tridsať Sedem Eur A Šesť Centov Len'],
  [37.68, 'Tridsať Sedem Eur A Šesťdesiat Osem Centov Len'],
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
      row[1] = (row[1] as string).replace('Nula Eur A ', '');
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
      row[1] = 'Nula Eur Len';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` A [\\wáäčďéíľňóôŕšťúýžÁÄČĎÉÍĽŇÓÔŔŠŤÚÝŽ ]+ Cent[ov]*`), '');
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

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-10 (special ordinal forms)
  [1, 'Prvý'],
  [2, 'Druhý'],
  [3, 'Tretí'],
  [4, 'Štvrtý'],
  [5, 'Piaty'],
  [6, 'Šiesty'],
  [7, 'Siedmy'],
  [8, 'Ôsmy'],
  [9, 'Deviaty'],
  [10, 'Desiaty'],

  // Numbers 11-19
  [11, 'Jedenásty'],
  [12, 'Dvanásty'],
  [13, 'Trinásty'],
  [14, 'Štrnásty'],
  [15, 'Pätnásty'],
  [16, 'Šestnásty'],
  [17, 'Sedemnásty'],
  [18, 'Osemnásty'],
  [19, 'Devätnásty'],

  // Tens
  [20, 'Dvadsiaty'],
  [21, 'Dvadsať Prvý'],
  [22, 'Dvadsať Druhý'],
  [30, 'Tridsiaty'],
  [40, 'Štyridsaťty'],
  [50, 'Päťdesiaty'],
  [60, 'Šesťdesiaty'],
  [70, 'Sedemdesiaty'],
  [80, 'Osemdesiaty'],
  [90, 'Deväťdesiaty'],

  // Hundreds
  [100, 'Stý'],
  [101, 'Sto Prvý'],
  [200, 'Dvestý'],
  [300, 'Tristý'],

  // Thousands
  [1000, 'Tisíci'],
  [1001, 'Tisíc Prvý'],

  // Millions
  [1000000, 'Milióntý'],
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

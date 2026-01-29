import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import bgBg from '../src/locales/bg-BG.js';
import { ToWords as LocaleToWords } from '../src/locales/bg-BG.js';

const localeCode = 'bg-BG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(bgBg);
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
  [0, 'Нула'],
  [1, 'Едно'],
  [2, 'Две'],
  [3, 'Три'],
  [4, 'Четири'],
  [5, 'Пет'],
  [6, 'Шест'],
  [7, 'Седем'],
  [8, 'Осем'],
  [9, 'Девет'],
  [10, 'Десет'],
  [11, 'Единадесет'],
  [12, 'Дванадесет'],
  [13, 'Тринадесет'],
  [14, 'Четиринадесет'],
  [15, 'Петнадесет'],
  [16, 'Шестнадесет'],
  [17, 'Седемнадесет'],
  [18, 'Осемнадесет'],
  [19, 'Деветнадесет'],
  [20, 'Двадесет'],
  [21, 'Двадесет Едно'],
  [22, 'Двадесет Две'],
  [30, 'Тридесет'],
  [35, 'Тридесет Пет'],
  [40, 'Четиридесет'],
  [50, 'Петдесет'],
  [60, 'Шестдесет'],
  [70, 'Седемдесет'],
  [80, 'Осемдесет'],
  [90, 'Деветдесет'],
  [99, 'Деветдесет Девет'],
  [100, 'Сто'],
  [137, 'Сто Тридесет Седем'],
  [200, 'Двеста'],
  [300, 'Триста'],
  [400, 'Четиристотин'],
  [500, 'Петстотин'],
  [600, 'Шестстотин'],
  [700, 'Седемстотин'],
  [800, 'Осемстотин'],
  [900, 'Деветстотин'],
  [1000, 'Хиляда'],
  [1100, 'Хиляда Сто'],
  [2000, 'Две Хиляди'],
  [3000, 'Три Хиляди'],
  [4000, 'Четири Хиляди'],
  [5000, 'Пет Хиляда'],
  [4680, 'Четири Хиляди Шестстотин Осемдесет'],
  [10000, 'Десет Хиляда'],
  [63892, 'Шестдесет Три Хиляди Осемстотин Деветдесет Две'],
  [100000, 'Сто Хиляди'],
  [1000000, 'Милион'],
  [2000000, 'Две Милиона'],
  [5000000, 'Пет Милион'],
  [2741034, 'Две Милиона Седемстотин Четиридесет Едно Хиляди Тридесет Четири'],
  [1000000000, 'Милиард'],
  [2000000000, 'Две Милиарда'],
  [5000000000, 'Пет Милиард'],
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
    row[1] = `Минус ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// Helper function to get Bulgarian currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Едно') {
    return 'Лев';
  }
  // Default plural for all other numbers
  return 'Лева';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Само`;
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
      row[1] = `${row[1]} Лева Само`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Минус ${row[1]} ${currencyName} Само`;
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
      row[1] = `${row[1]} ${currencyName} Само`;
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
  [0.0, 'Нула'],
  [0.04, 'Нула Цяло Нула Четири'],
  [0.4, 'Нула Цяло Четири'],
  [0.63, 'Нула Цяло Шестдесет Три'],
  [37.06, 'Тридесет Седем Цяло Нула Шест'],
  [37.68, 'Тридесет Седем Цяло Шестдесет Осем'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Нула Лева Само'],
  [0.04, 'Нула Лева И Четири Стотинки Само'],
  [0.4, 'Нула Лева И Четиридесет Стотинки Само'],
  [0.63, 'Нула Лева И Шестдесет Три Стотинки Само'],
  [0.999, 'Едно Лев Само'],
  [37.06, 'Тридесет Седем Лева И Шест Стотинки Само'],
  [37.68, 'Тридесет Седем Лева И Шестдесет Осем Стотинки Само'],
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
      row[1] = (row[1] as string).replace('Нула Лева И ', '');
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
      row[1] = 'Нула Лева Само';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` И [\\u0400-\\u04FF ]+ Стотинк[иа]*`), '');
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
  [1, 'Първи'],
  [2, 'Втори'],
  [3, 'Трети'],
  [4, 'Четвърти'],
  [5, 'Пети'],
  [6, 'Шести'],
  [7, 'Седми'],
  [8, 'Осми'],
  [9, 'Девети'],
  [10, 'Десети'],

  // Numbers 11-19
  [11, 'Единадесети'],
  [12, 'Дванадесети'],
  [13, 'Тринадесети'],
  [14, 'Четиринадесети'],
  [15, 'Петнадесети'],
  [16, 'Шестнадесети'],
  [17, 'Седемнадесети'],
  [18, 'Осемнадесети'],
  [19, 'Деветнадесети'],

  // Tens
  [20, 'Двадесети'],
  [21, 'Двадесет Първи'],
  [22, 'Двадесет Втори'],
  [30, 'Тридесети'],
  [40, 'Четиридесети'],
  [50, 'Петдесети'],
  [60, 'Шестдесети'],
  [70, 'Седемдесети'],
  [80, 'Осемдесети'],
  [90, 'Деветдесети'],

  // Hundreds
  [100, 'Стотен'],
  [101, 'Сто Първи'],
  [200, 'Двестотен'],
  [300, 'Тристотен'],

  // Thousands
  [1000, 'Хиляден'],
  [1001, 'Хиляда Първи'],

  // Millions
  [1000000, 'Милионен'],
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

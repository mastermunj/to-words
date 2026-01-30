import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ruRu from '../src/locales/ru-RU.js';
import { ToWords as LocaleToWords } from '../src/locales/ru-RU.js';

const localeCode = 'ru-RU';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ruRu);
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
  [0, 'Ноль'],
  [1, 'Один'],
  [2, 'Два'],
  [3, 'Три'],
  [4, 'Четыре'],
  [5, 'Пять'],
  [6, 'Шесть'],
  [7, 'Семь'],
  [8, 'Восемь'],
  [9, 'Девять'],
  [10, 'Десять'],
  [11, 'Одиннадцать'],
  [12, 'Двенадцать'],
  [13, 'Тринадцать'],
  [14, 'Четырнадцать'],
  [15, 'Пятнадцать'],
  [16, 'Шестнадцать'],
  [17, 'Семнадцать'],
  [18, 'Восемнадцать'],
  [19, 'Девятнадцать'],
  [20, 'Двадцать'],
  [21, 'Двадцать Один'],
  [22, 'Двадцать Два'],
  [30, 'Тридцать'],
  [35, 'Тридцать Пять'],
  [40, 'Сорок'],
  [50, 'Пятьдесят'],
  [60, 'Шестьдесят'],
  [70, 'Семьдесят'],
  [80, 'Восемьдесят'],
  [90, 'Девяносто'],
  [99, 'Девяносто Девять'],
  [100, 'Сто'],
  [137, 'Сто Тридцать Семь'],
  [200, 'Двести'],
  [300, 'Триста'],
  [400, 'Четыреста'],
  [500, 'Пятьсот'],
  [600, 'Шестьсот'],
  [700, 'Семьсот'],
  [800, 'Восемьсот'],
  [900, 'Девятьсот'],
  [1000, 'Тысяча'],
  [1100, 'Тысяча Сто'],
  [2000, 'Два Тысячи'],
  [3000, 'Три Тысячи'],
  [4000, 'Четыре Тысячи'],
  [5000, 'Пять Тысяча'],
  [4680, 'Четыре Тысячи Шестьсот Восемьдесят'],
  [10000, 'Десять Тысяча'],
  [63892, 'Шестьдесят Три Тысяч Восемьсот Девяносто Два'],
  [100000, 'Сто Тысяч'],
  [1000000, 'Миллион'],
  [2000000, 'Два Миллиона'],
  [5000000, 'Пять Миллион'],
  [2741034, 'Два Миллиона Семьсот Сорок Один Тысяч Тридцать Четыре'],
  [1000000000, 'Миллиард'],
  [2000000000, 'Два Миллиарда'],
  [5000000000, 'Пять Миллиард'],
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

// Helper function to get Russian currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Один') {
    return 'Рубль';
  }
  // Default plural for all other numbers
  return 'Рублей';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Только`;
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
      row[1] = `${row[1]} Рублей Только`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Минус ${row[1]} ${currencyName} Только`;
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
      row[1] = `${row[1]} ${currencyName} Только`;
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
  [0.0, 'Ноль'],
  [0.04, 'Ноль Целых Ноль Четыре'],
  [0.4, 'Ноль Целых Четыре'],
  [0.63, 'Ноль Целых Шестьдесят Три'],
  [37.06, 'Тридцать Семь Целых Ноль Шесть'],
  [37.68, 'Тридцать Семь Целых Шестьдесят Восемь'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Ноль Рублей Только'],
  [0.04, 'Ноль Рублей И Четыре Копеек Только'],
  [0.4, 'Ноль Рублей И Сорок Копеек Только'],
  [0.63, 'Ноль Рублей И Шестьдесят Три Копеек Только'],
  [0.999, 'Один Рубль Только'],
  [37.06, 'Тридцать Семь Рублей И Шесть Копеек Только'],
  [37.68, 'Тридцать Семь Рублей И Шестьдесят Восемь Копеек Только'],
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
      row[1] = (row[1] as string).replace('Ноль Рублей И ', '');
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
      row[1] = 'Ноль Рублей Только';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` И [\\wа-яА-ЯёЁ ]+ Копеек`), '');
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
  [1, 'Первый'],
  [2, 'Второй'],
  [3, 'Третий'],
  [4, 'Четвёртый'],
  [5, 'Пятый'],
  [6, 'Шестой'],
  [7, 'Седьмой'],
  [8, 'Восьмой'],
  [9, 'Девятый'],
  [10, 'Десятый'],

  // Numbers 11-19
  [11, 'Одиннадцатый'],
  [12, 'Двенадцатый'],
  [13, 'Тринадцатый'],
  [14, 'Четырнадцатый'],
  [15, 'Пятнадцатый'],
  [16, 'Шестнадцатый'],
  [17, 'Семнадцатый'],
  [18, 'Восемнадцатый'],
  [19, 'Девятнадцатый'],

  // Tens
  [20, 'Двадцатый'],
  [21, 'Двадцать Первый'],
  [22, 'Двадцать Второй'],
  [30, 'Тридцатый'],
  [40, 'Сороковой'],
  [50, 'Пятидесятый'],
  [60, 'Шестидесятый'],
  [70, 'Семидесятый'],
  [80, 'Восьмидесятый'],
  [90, 'Девяностый'],

  // Hundreds
  [100, 'Сотый'],
  [101, 'Сто Первый'],
  [200, 'Двухсотый'],
  [300, 'Трёхсотый'],

  // Thousands
  [1000, 'Тысячный'],
  [1001, 'Тысяча Первый'],

  // Millions
  [1000000, 'Миллионный'],
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

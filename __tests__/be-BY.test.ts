import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import beBy from '../src/locales/be-BY.js';
import { ToWords as LocaleToWords } from '../src/locales/be-BY.js';

const localeCode = 'be-BY';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(beBy);
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
  [0, 'Нуль'],
  [1, 'Адзін'],
  [2, 'Два'],
  [3, 'Тры'],
  [4, 'Чатыры'],
  [5, 'Пяць'],
  [6, 'Шэсць'],
  [7, 'Сем'],
  [8, 'Восем'],
  [9, 'Дзевяць'],
  [10, 'Дзесяць'],
  [11, 'Адзінаццаць'],
  [12, 'Дванаццаць'],
  [13, 'Трынаццаць'],
  [14, 'Чатырнаццаць'],
  [15, 'Пятнаццаць'],
  [16, 'Шаснаццаць'],
  [17, 'Сямнаццаць'],
  [18, 'Васямнаццаць'],
  [19, 'Дзевятнаццаць'],
  [20, 'Дваццаць'],
  [21, 'Дваццаць Адзін'],
  [22, 'Дваццаць Два'],
  [30, 'Трыццаць'],
  [35, 'Трыццаць Пяць'],
  [40, 'Сорак'],
  [50, 'Пяцьдзясят'],
  [60, 'Шэсцьдзясят'],
  [70, 'Семдзесят'],
  [80, 'Восемдзесят'],
  [90, 'Дзевяноста'],
  [99, 'Дзевяноста Дзевяць'],
  [100, 'Сто'],
  [137, 'Сто Трыццаць Сем'],
  [200, 'Дзвесце'],
  [300, 'Трыста'],
  [400, 'Чатырыста'],
  [500, 'Пяцьсот'],
  [600, 'Шэсцьсот'],
  [700, 'Семсот'],
  [800, 'Восемсот'],
  [900, 'Дзевяцьсот'],
  [1000, 'Тысяча'],
  [1100, 'Тысяча Сто'],
  [2000, 'Два Тысячы'],
  [3000, 'Тры Тысячы'],
  [4000, 'Чатыры Тысячы'],
  [5000, 'Пяць Тысяча'],
  [4680, 'Чатыры Тысячы Шэсцьсот Восемдзесят'],
  [10000, 'Дзесяць Тысяча'],
  [63892, 'Шэсцьдзясят Тры Тысяч Восемсот Дзевяноста Два'],
  [100000, 'Сто Тысяч'],
  [1000000, 'Мільён'],
  [2000000, 'Два Мільёны'],
  [5000000, 'Пяць Мільён'],
  [2741034, 'Два Мільёны Семсот Сорак Адзін Тысяч Трыццаць Чатыры'],
  [1000000000, 'Мільярд'],
  [2000000000, 'Два Мільярды'],
  [5000000000, 'Пяць Мільярд'],
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
    row[1] = `Мінус ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// Helper function to get Belarusian currency form
function getCurrencyName(words: string): string {
  if (words === 'Адзін') {
    return 'Рубель';
  }
  return 'Рублёў';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Толькі`;
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
      row[1] = `${row[1]} Рублёў Толькі`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Мінус ${row[1]} ${currencyName} Толькі`;
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
      row[1] = `${row[1]} ${currencyName} Толькі`;
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
  [0.0, 'Нуль'],
  [0.04, 'Нуль Цэлых Нуль Чатыры'],
  [0.4, 'Нуль Цэлых Чатыры'],
  [0.63, 'Нуль Цэлых Шэсцьдзясят Тры'],
  [37.06, 'Трыццаць Сем Цэлых Нуль Шэсць'],
  [37.68, 'Трыццаць Сем Цэлых Шэсцьдзясят Восем'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Нуль Рублёў Толькі'],
  [0.04, 'Нуль Рублёў І Чатыры Капеек Толькі'],
  [0.4, 'Нуль Рублёў І Сорак Капеек Толькі'],
  [0.63, 'Нуль Рублёў І Шэсцьдзясят Тры Капеек Толькі'],
  [0.999, 'Адзін Рубель Толькі'],
  [37.06, 'Трыццаць Сем Рублёў І Шэсць Капеек Толькі'],
  [37.68, 'Трыццаць Сем Рублёў І Шэсцьдзясят Восем Капеек Толькі'],
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
      row[1] = (row[1] as string).replace('Нуль Рублёў І ', '');
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
      row[1] = 'Нуль Рублёў Толькі';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` І [\\wа-яА-ЯёЁ ]+ Капеек`), '');
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

// Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, 'Першы'],
  [2, 'Другі'],
  [3, 'Трэці'],
  [4, 'Чацвёрты'],
  [5, 'Пяты'],
  [6, 'Шосты'],
  [7, 'Сёмы'],
  [8, 'Восьмы'],
  [9, 'Дзявяты'],
  [10, 'Дзясяты'],
  [11, 'Адзінаццаты'],
  [12, 'Дванаццаты'],
  [13, 'Трынаццаты'],
  [14, 'Чатырнаццаты'],
  [15, 'Пятнаццаты'],
  [16, 'Шаснаццаты'],
  [17, 'Сямнаццаты'],
  [18, 'Васямнаццаты'],
  [19, 'Дзевятнаццаты'],
  [20, 'Дваццаты'],
  [21, 'Дваццаць Першы'],
  [22, 'Дваццаць Другі'],
  [30, 'Трыццаты'],
  [40, 'Саракавы'],
  [50, 'Пяцідзясяты'],
  [60, 'Шасцідзясяты'],
  [70, 'Сямідзясяты'],
  [80, 'Васьмідзясяты'],
  [90, 'Дзевяносты'],
  [100, 'Соты'],
  [101, 'Сто Першы'],
  [200, 'Двухсоты'],
  [300, 'Трохсоты'],
  [1000, 'Тысячны'],
  [1001, 'Тысяча Першы'],
  [1000000, 'Мільённы'],
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

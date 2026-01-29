import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ukUa from '../src/locales/uk-UA';

const localeCode = 'uk-UA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ukUa);
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
  [1, 'Один'],
  [2, 'Два'],
  [3, 'Три'],
  [4, 'Чотири'],
  [5, "П'ять"],
  [6, 'Шість'],
  [7, 'Сім'],
  [8, 'Вісім'],
  [9, "Дев'ять"],
  [10, 'Десять'],
  [11, 'Одинадцять'],
  [12, 'Дванадцять'],
  [13, 'Тринадцять'],
  [14, 'Чотирнадцять'],
  [15, "П'ятнадцять"],
  [16, 'Шістнадцять'],
  [17, 'Сімнадцять'],
  [18, 'Вісімнадцять'],
  [19, "Дев'ятнадцять"],
  [20, 'Двадцять'],
  [21, 'Двадцять Один'],
  [22, 'Двадцять Два'],
  [30, 'Тридцять'],
  [35, "Тридцять П'ять"],
  [40, 'Сорок'],
  [50, "П'ятдесят"],
  [60, 'Шістдесят'],
  [70, 'Сімдесят'],
  [80, 'Вісімдесят'],
  [90, "Дев'яносто"],
  [99, "Дев'яносто Дев'ять"],
  [100, 'Сто'],
  [137, 'Сто Тридцять Сім'],
  [200, 'Двісті'],
  [300, 'Триста'],
  [400, 'Чотириста'],
  [500, "П'ятсот"],
  [600, 'Шістсот'],
  [700, 'Сімсот'],
  [800, 'Вісімсот'],
  [900, "Дев'ятсот"],
  [1000, 'Тисяча'],
  [1100, 'Тисяча Сто'],
  [2000, 'Два Тисячі'],
  [4680, 'Чотири Тисячі Шістсот Вісімдесят'],
  [10000, 'Десять Тисяча'],
  [63892, "Шістдесят Три Тисяч Вісімсот Дев'яносто Два"],
  [100000, 'Сто Тисяч'],
  [1000000, 'Мільйон'],
  [2000000, 'Два Мільйони'],
  [2741034, 'Два Мільйони Сімсот Сорок Один Тисяч Тридцять Чотири'],
  [1000000000, 'Мільярд'],
  [2000000000, 'Два Мільярди'],
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

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    // For 1, use singular "Гривня", otherwise use plural "Гривень"
    const currencyName = row[1] === 'Один' ? 'Гривня' : 'Гривень';
    row[1] = `${row[1]} ${currencyName} Тільки`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    // For 1, use singular "Гривня", otherwise use plural "Гривень"
    const currencyName = row[1] === 'Один' ? 'Гривня' : 'Гривень';
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
      row[1] = `${row[1]} Гривень Тільки`;
      return;
    }
    row[0] = -row[0];
    // For -1, use singular "Гривня", otherwise use plural "Гривень"
    const currencyName = row[1] === 'Один' ? 'Гривня' : 'Гривень';
    row[1] = `Мінус ${row[1]} ${currencyName} Тільки`;
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
      // For 1, use singular "Гривня", otherwise use plural "Гривень"
      const currencyName = row[1] === 'Один' ? 'Гривня' : 'Гривень';
      row[1] = `${row[1]} ${currencyName} Тільки`;
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
  [0.04, 'Нуль Цілих Нуль Чотири'],
  [0.4, 'Нуль Цілих Чотири'],
  [0.63, 'Нуль Цілих Шістдесят Три'],
  [37.06, 'Тридцять Сім Цілих Нуль Шість'],
  [37.68, 'Тридцять Сім Цілих Шістдесят Вісім'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Нуль Гривень Тільки'],
  [0.04, 'Нуль Гривень І Чотири Копійок Тільки'],
  [0.4, 'Нуль Гривень І Сорок Копійок Тільки'],
  [0.63, 'Нуль Гривень І Шістдесят Три Копійок Тільки'],
  [0.999, 'Один Гривня Тільки'],
  [37.06, 'Тридцять Сім Гривень І Шість Копійок Тільки'],
  [37.68, 'Тридцять Сім Гривень І Шістдесят Вісім Копійок Тільки'],
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
      row[1] = (row[1] as string).replace('Нуль Гривень І ', '');
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
      row[1] = 'Нуль Гривень Тільки';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` І [\\u0400-\\u04FF' ]+ Копійок`), '');
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
  [1, 'Перший'],
  [2, 'Другий'],
  [3, 'Третій'],
  [4, 'Четвертий'],
  [5, "П'ятий"],
  [6, 'Шостий'],
  [7, 'Сьомий'],
  [8, 'Восьмий'],
  [9, "Дев'ятий"],
  [10, 'Десятий'],

  // Numbers 11-19
  [11, 'Одинадцятий'],
  [12, 'Дванадцятий'],
  [13, 'Тринадцятий'],
  [14, 'Чотирнадцятий'],
  [15, "П'ятнадцятий"],
  [16, 'Шістнадцятий'],
  [17, 'Сімнадцятий'],
  [18, 'Вісімнадцятий'],
  [19, "Дев'ятнадцятий"],

  // Tens
  [20, 'Двадцятий'],
  [21, 'Двадцять Перший'],
  [22, 'Двадцять Другий'],
  [30, 'Тридцятий'],
  [40, 'Сороковий'],
  [50, "П'ятдесятий"],
  [60, 'Шістдесятий'],
  [70, 'Сімдесятий'],
  [80, 'Вісімдесятий'],
  [90, "Дев'яностий"],

  // Hundreds
  [100, 'Сотий'],
  [101, 'Сто Перший'],
  [200, 'Двохсотий'],
  [300, 'Трьохсотий'],

  // Thousands
  [1000, 'Тисячний'],
  [1001, 'Тисяча Перший'],

  // Millions
  [1000000, 'Мільйонний'],
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

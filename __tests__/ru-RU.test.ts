import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ruRu from '../src/locales/ru-RU.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ru-RU.js';

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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
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
  [2000, 'Две Тысячи'],
  [3000, 'Три Тысячи'],
  [4000, 'Четыре Тысячи'],
  [5000, 'Пять Тысяч'],
  [4680, 'Четыре Тысячи Шестьсот Восемьдесят'],
  [10000, 'Десять Тысяч'],
  [63892, 'Шестьдесят Три Тысячи Восемьсот Девяносто Два'],
  [100000, 'Сто Тысяч'],
  [1000000, 'Миллион'],
  [2000000, 'Два Миллиона'],
  [5000000, 'Пять Миллионов'],
  [2741034, 'Два Миллиона Семьсот Сорок Одна Тысяча Тридцать Четыре'],
  [1000000000, 'Миллиард'],
  [2000000000, 'Два Миллиарда'],
  [5000000000, 'Пять Миллиардов'],
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

// Russian unit form by plural category (CLDR ru: one / few / many)
function getCurrencyName(amount: number): string {
  const n = Math.abs(amount);
  if (n % 10 === 1 && n % 100 !== 11) {
    return 'Рубль';
  }
  if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) {
    return 'Рубля';
  }
  return 'Рублей';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `${row[1]} ${currencyName} Только`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
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
    const currencyName = getCurrencyName(row[0] as number);
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
      const currencyName = getCurrencyName(row[0] as number);
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

// Spec R9 (Грамота.ру, ответ № 320681): decimals read as a fraction by default.
const testFloats: [number, string][] = [
  [0.0, 'Ноль'],
  [0.04, 'Ноль Целых Четыре Сотых'],
  [0.4, 'Ноль Целых Четыре Десятых'],
  [0.63, 'Ноль Целых Шестьдесят Три Сотых'],
  [1.5, 'Одна Целая Пять Десятых'],
  [37.06, 'Тридцать Семь Целых Шесть Сотых'],
  [37.68, 'Тридцать Семь Целых Шестьдесят Восемь Сотых'],
];

describe("Test Floats with options = { decimalStyle: 'digit' }", () => {
  test.concurrent.each([
    [0.04, 'Ноль Целых Ноль Четыре'],
    [37.68, 'Тридцать Семь Целых Шестьдесят Восемь'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { decimalStyle: 'digit' })).toBe(expected);
  });
});

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Сто Двадцать Три Рубля Только`],
    ['123', `Сто Двадцать Три Рубля Только`],
    ['123.0', `Сто Двадцать Три Рубля И Ноль Копеек Только`],
    ['123.00', `Сто Двадцать Три Рубля И Ноль Копеек Только`],
    ['0.00', `Ноль Рублей И Ноль Копеек Только`],
    ['-123.00', `Минус Сто Двадцать Три Рубля И Ноль Копеек Только`],
    ['37.68', `Тридцать Семь Рублей И Шестьдесят Восемь Копеек Только`],
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

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Ноль Рублей Только'],
  [0.04, 'Ноль Рублей И Четыре Копейки Только'],
  [0.4, 'Ноль Рублей И Сорок Копеек Только'],
  [0.63, 'Ноль Рублей И Шестьдесят Три Копейки Только'],
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
      row[1] = (row[1] as string).replace(new RegExp(` И [\\wа-яА-ЯёЁ ]+ Копе(ек|йки|йка)`), '');
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

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR ru-RU
// ============================================================

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Ноль'],
  [1n, 'Один'],
  [100n, 'Сто'],
  [1000n, 'Тысяча'],
  [1000000n, 'Миллион'],
  [1000000000n, 'Миллиард'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Минус Один'],
  [-100n, 'Минус Сто'],
  [-1000n, 'Минус Тысяча'],
  [-1000000n, 'Минус Миллион'],
  [-1000000000n, 'Минус Миллиард'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Ноль'],
  ['1', 'Один'],
  ['100', 'Сто'],
  ['1000', 'Тысяча'],
  ['-100', 'Минус Сто'],
  ['  100  ', 'Сто'],
  ['1000000', 'Миллион'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Ноль');
  });

  test('converts -0 as Ноль', () => {
    expect(toWords.convert(-0)).toBe('Ноль');
  });

  test('converts 0.0 as Ноль', () => {
    expect(toWords.convert(0.0)).toBe('Ноль');
  });

  test('converts 0n as Ноль', () => {
    expect(toWords.convert(0n)).toBe('Ноль');
  });

  test('converts "0" as Ноль', () => {
    expect(toWords.convert('0')).toBe('Ноль');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Ноль Рублей Только');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for ru-RU', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('throws for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('throws for invalid string', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
  });
});

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() matches new ToWords().toOrdinal()', () => {
    const tw = new LocaleToWords();
    expect(localeToOrdinal(1)).toBe(tw.toOrdinal(1));
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

const testFractionStyleRuRU: [number, string][] = [
  // Slavic singular rule: singular when fracValue % 10 === 1 && fracValue % 100 !== 11
  [1.1, 'Одна Целая Одна Десятая'],
  [1.5, 'Одна Целая Пять Десятых'],
  [1.21, 'Одна Целая Двадцать Одна Сотая'],
  [1.11, 'Одна Целая Одиннадцать Сотых'],
  [123.45, 'Сто Двадцать Три Целых Сорок Пять Сотых'],
  [0.001, 'Ноль Целых Одна Тысячная'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleRuRU)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { decimalStyle: 'fraction' })).toBe(expected);
  });
});

// Spec R2 (ru.wiktionary: квинтиллион, секстиллион), R18, R20.
describe('Test scale words above a quadrillion', () => {
  test.each([
    [10n ** 18n, 'Квинтиллион'],
    [2n * 10n ** 21n, 'Два Секстиллиона'],
    [5n * 10n ** 21n + 10n ** 18n, 'Пять Секстиллионов Один Квинтиллион'],
  ])('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test.each([
    [10n ** 18n, 'Квинтиллионный'],
    [3n * 10n ** 21n, 'Трёхсекстиллионный'],
  ])('ordinal %s => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });

  test('a compose-mode multiplier of 1000+ is not fused into one ordinal word', () => {
    expect(toWords.toOrdinal(6n * 10n ** 24n, { rangeMode: 'compose' })).toBe('Шесть Тысяч Секстиллионный');
  });
});

// Spec R16: the rouble is masculine whatever the gender option says.
describe('Test currency with the gender option', () => {
  test.each([
    ['1', { gender: 'feminine' }, 'Один Рубль Только'],
    ['2.01', { gender: 'masculine' }, 'Два Рубля И Одна Копейка Только'],
  ] as const)('convert %s %o => %s', (input, options, expected) => {
    expect(toWords.convert(input, { currency: true, ...options })).toBe(expected);
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Двадцать Один'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Двадцать Один'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Двадцать Один Рубль И Пятьдесят Копеек Только',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'двадцать один рубль и пятьдесят копеек только',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'ДВАДЦАТЬ ОДИН РУБЛЬ И ПЯТЬДЕСЯТ КОПЕЕК ТОЛЬКО',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'двадцать один рубль и пятьдесят копеек только',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Двадцать один рубль и пятьдесят копеек только',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Двадцать Первый'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'двадцать первый',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Одна Целая Двадцать Пять Сотых'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Один Целых Два Пять',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

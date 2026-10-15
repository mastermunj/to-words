import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ukUa from '../src/locales/uk-UA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/uk-UA.js';

const localeCode = 'uk-UA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ukUa);
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
  [2000, 'Дві Тисячі'],
  [4680, 'Чотири Тисячі Шістсот Вісімдесят'],
  [10000, 'Десять Тисяч'],
  [63892, "Шістдесят Три Тисячі Вісімсот Дев'яносто Два"],
  [100000, 'Сто Тисяч'],
  [1000000, 'Мільйон'],
  [2000000, 'Два Мільйони'],
  [2741034, 'Два Мільйони Сімсот Сорок Одна Тисяча Тридцять Чотири'],
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

// Гривня is feminine: the amount agrees (Одна Гривня, Дві Гривні) and the unit follows
// CLDR uk plural categories (one / few / many).
function hryvnia(amount: number, words: string): string {
  const n = Math.abs(amount);
  const name =
    n % 10 === 1 && n % 100 !== 11
      ? 'Гривня'
      : n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)
        ? 'Гривні'
        : 'Гривень';
  return `${words.replace(/(^| )Один$/, '$1Одна').replace(/(^| )Два$/, '$1Дві')} ${name}`;
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${hryvnia(row[0] as number, row[1] as string)} Тільки`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${hryvnia(row[0] as number, row[1] as string)}`;
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
    row[1] = `Мінус ${hryvnia(row[0] as number, row[1] as string)} Тільки`;
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
      row[1] = `${hryvnia(row[0] as number, row[1] as string)} Тільки`;
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
  [0.04, 'Нуль Цілих Чотири Сотих'],
  [0.4, 'Нуль Цілих Чотири Десятих'],
  [0.63, 'Нуль Цілих Шістдесят Три Сотих'],
  [37.06, 'Тридцять Сім Цілих Шість Сотих'],
  [37.68, 'Тридцять Сім Цілих Шістдесят Вісім Сотих'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Сто Двадцять Три Гривні Тільки`],
    ['123', `Сто Двадцять Три Гривні Тільки`],
    ['123.0', `Сто Двадцять Три Гривні І Нуль Копійок Тільки`],
    ['123.00', `Сто Двадцять Три Гривні І Нуль Копійок Тільки`],
    ['0.00', `Нуль Гривень І Нуль Копійок Тільки`],
    ['-123.00', `Мінус Сто Двадцять Три Гривні І Нуль Копійок Тільки`],
    ['37.68', `Тридцять Сім Гривень І Шістдесят Вісім Копійок Тільки`],
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
  [0.0, 'Нуль Гривень Тільки'],
  [0.04, 'Нуль Гривень І Чотири Копійки Тільки'],
  [0.4, 'Нуль Гривень І Сорок Копійок Тільки'],
  [0.63, 'Нуль Гривень І Шістдесят Три Копійки Тільки'],
  [0.999, 'Одна Гривня Тільки'],
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
      row[1] = (row[1] as string).replace(new RegExp(` І [\\u0400-\\u04FF' ]+ Копій(ок|ки|ка)`), '');
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

const testPowersOfTen: [number, string][] = [
  [10, 'Десять'],
  [100, 'Сто'],
  [1000, 'Тисяча'],
  [10000, 'Десять Тисяч'],
  [100000, 'Сто Тисяч'],
  [1000000, 'Мільйон'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'Нуль'],
  [1n, 'Один'],
  [100n, 'Сто'],
  [1000n, 'Тисяча'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Мінус Один'],
  [-100n, 'Мінус Сто'],
  [-1000n, 'Мінус Тисяча'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'Нуль'],
  ['1', 'Один'],
  ['100', 'Сто'],
  ['-100', 'Мінус Сто'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Нуль', () => {
    expect(toWords.convert(0)).toBe('Нуль');
  });

  test('convert -0 => Нуль', () => {
    expect(toWords.convert(-0)).toBe('Нуль');
  });

  test('convert 0.0 => Нуль', () => {
    expect(toWords.convert(0.0)).toBe('Нуль');
  });

  test('convert 0n => Нуль', () => {
    expect(toWords.convert(0n)).toBe('Нуль');
  });

  test('convert "0" => Нуль', () => {
    expect(toWords.convert('0')).toBe('Нуль');
  });

  test('convert 0 with currency => Нуль Гривень Тільки', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Нуль Гривень Тільки');
  });
});

describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
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

const testFractionStyleUkUA: [number, string][] = [
  [1.1, 'Одна Ціла Одна Десята'],
  [2.5, "Дві Цілих П'ять Десятих"],
  [1.01, 'Одна Ціла Одна Сота'],
  [1.45, "Одна Ціла Сорок П'ять Сотих"],
  [0.05, "Нуль Цілих П'ять Сотих"],
  [1.001, 'Одна Ціла Одна Тисячна'],
  [1.005, "Одна Ціла П'ять Тисячних"],
  [1.0001, 'Одна Ціла Одна Десятитисячна'],
  [1.0005, "Одна Ціла П'ять Десятитисячних"],
  [1.00001, 'Одна Ціла Одна Стотисячна'],
  [1.00005, "Одна Ціла П'ять Стотисячних"],
  [1.000001, 'Одна Ціла Одна Мільйонна'],
  [1.000005, "Одна Ціла П'ять Мільйонних"],
  [123.45, "Сто Двадцять Три Цілих Сорок П'ять Сотих"],
  [1.21, 'Одна Ціла Двадцять Одна Сота'],
  [1.11, 'Одна Ціла Одинадцять Сотих'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleUkUA)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('7 decimal places use the ten-millionths denominator', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      "Одна Ціла Мільйон Двісті Тридцять Чотири Тисячі П'ятсот Шістдесят Сім Десятимільйонних",
    );
  });

  test('the fraction reading is the default; digit style is opt-in', () => {
    expect(toWords.convert(1.5)).toBe("Одна Ціла П'ять Десятих");
    expect(toWords.convert(1.5, { decimalStyle: 'digit' })).toBe("Один Цілих П'ять");
    expect(toWords.convert(0.05, { decimalStyle: 'digit' })).toBe("Нуль Цілих Нуль П'ять");
  });
});

// Український правопис 2019 §38 and §106.
describe('Test ordinals from the 2019 orthography', () => {
  test.each([
    [530000, "П'ятсоттридцятитисячний"],
    [500000, "П'ятисоттисячний"],
    [10000, 'Десятитисячний'],
    [65000000, "Шістдесятип'ятимільйонний"],
    [1003000, 'Мільйон Трьохтисячний'],
    [1004000000, 'Мільярд Чотирьохмільйонний'],
    [1988, "Тисяча Дев'ятсот Вісімдесят Восьмий"],
  ])('ordinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });

  test.each([
    [10n ** 18n, 'Квінтильйон'],
    [2n * 10n ** 21n, 'Два Секстильйони'],
  ])('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

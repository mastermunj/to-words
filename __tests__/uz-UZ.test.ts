import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import uzUz from '../src/locales/uz-UZ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/uz-UZ.js';

const localeCode = 'uz-UZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(uzUz);
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
  [0, 'Nol'],
  [1, 'Bir'],
  [2, 'Ikki'],
  [3, 'Uch'],
  [4, "To'rt"],
  [5, 'Besh'],
  [6, 'Olti'],
  [7, 'Yetti'],
  [8, 'Sakkiz'],
  [9, "To'qqiz"],
  [10, "O'n"],
  [11, "O'n Bir"],
  [12, "O'n Ikki"],
  [13, "O'n Uch"],
  [14, "O'n To'rt"],
  [15, "O'n Besh"],
  [16, "O'n Olti"],
  [17, "O'n Yetti"],
  [18, "O'n Sakkiz"],
  [19, "O'n To'qqiz"],
  [20, 'Yigirma'],
  [21, 'Yigirma Bir'],
  [22, 'Yigirma Ikki'],
  [25, 'Yigirma Besh'],
  [30, "O'ttiz"],
  [40, 'Qirq'],
  [50, 'Ellik'],
  [60, 'Oltmish'],
  [70, 'Yetmish'],
  [80, 'Sakson'],
  [90, "To'qson"],
  [99, "To'qson To'qqiz"],
  [100, 'Yuz'],
  [101, 'Yuz Bir'],
  [110, "Yuz O'n"],
  [137, "Yuz O'ttiz Yetti"],
  [200, 'Ikki Yuz'],
  [500, 'Besh Yuz'],
  [700, 'Yetti Yuz'],
  [999, "To'qqiz Yuz To'qson To'qqiz"],
  [1000, 'Ming'],
  [1001, 'Ming Bir'],
  [1100, 'Ming Yuz'],
  [2000, 'Ikki Ming'],
  [4680, "To'rt Ming Olti Yuz Sakson"],
  [10000, "O'n Ming"],
  [50000, 'Ellik Ming'],
  [86100, 'Sakson Olti Ming Yuz'],
  [100000, 'Yuz Ming'],
  [500000, 'Besh Yuz Ming'],
  [792581, "Yetti Yuz To'qson Ikki Ming Besh Yuz Sakson Bir"],
  [1000000, 'Bir Million'],
  [2000000, 'Ikki Million'],
  [5000000000, 'Besh Milliard'],
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} So'm`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} So'm`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testData = [
    [-1, "Minus Bir So'm"],
    [-10, "Minus O'n So'm"],
    [-99, "Minus To'qson To'qqiz So'm"],
    [-1000, "Minus Ming So'm"],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [0, ''],
    [5, "Besh So'm"],
    [100, "Yuz So'm"],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.5, 'Nol Vergul Besh'],
  [1.5, 'Bir Vergul Besh'],
  [10.5, "O'n Vergul Besh"],
  [12.34, "O'n Ikki Vergul O'ttiz To'rt"],
  [37.68, "O'ttiz Yetti Vergul Oltmish Sakkiz"],
  [0.04, "Nol Vergul Nol To'rt"],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Yuz Yigirma Uch So'm`],
    ['123', `Yuz Yigirma Uch So'm`],
    ['123.0', `Yuz Yigirma Uch So'm Va Nol Tiyin`],
    ['123.00', `Yuz Yigirma Uch So'm Va Nol Tiyin`],
    ['0.00', `Nol So'm Va Nol Tiyin`],
    ['-123.00', `Minus Yuz Yigirma Uch So'm Va Nol Tiyin`],
    ['37.68', `O'ttiz Yetti So'm Va Oltmish Sakkiz Tiyin`],
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

const testFloatsWithCurrency = [
  [0.5, "Nol So'm Va Ellik Tiyin"],
  [1.5, "Bir So'm Va Ellik Tiyin"],
  [37.68, "O'ttiz Yetti So'm Va Oltmish Sakkiz Tiyin"],
  [0.04, "Nol So'm Va To'rt Tiyin"],
  [0.999, "Bir So'm"],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [1.5, "Bir So'm Va Ellik Tiyin"],
    [37.68, "O'ttiz Yetti So'm Va Oltmish Sakkiz Tiyin"],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testData = [
    [10.99, "O'n So'm"],
    [37.68, "O'ttiz Yetti So'm"],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

const testOrdinals = [
  [0, 'Nolinchi'],
  [1, 'Birinchi'],
  [2, 'Ikkinchi'],
  [3, 'Uchinchi'],
  [4, "To'rtinchi"],
  [5, 'Beshinchi'],
  [6, 'Oltinchi'],
  [7, 'Yettinchi'],
  [8, 'Sakkizinchi'],
  [9, "To'qqizinchi"],
  [10, "O'ninchi"],
  [11, "O'n Birinchi"],
  [12, "O'n Ikkinchi"],
  [13, "O'n Uchinchi"],
  [14, "O'n To'rtinchi"],
  [15, "O'n Beshinchi"],
  [16, "O'n Oltinchi"],
  [17, "O'n Yettinchi"],
  [18, "O'n Sakkizinchi"],
  [19, "O'n To'qqizinchi"],
  [20, 'Yigirmanchi'],
  [21, 'Yigirma Birinchi'],
  [22, 'Yigirma Ikkinchi'],
  [25, 'Yigirma Beshinchi'],
  [30, "O'ttizinchi"],
  [40, 'Qirqinchi'],
  [50, 'Ellikinchi'],
  [100, 'Yuzinchi'],
  [1000, 'Minginchi'],
];

describe('Test Ordinals with options = {}', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(42)).toBe('Qirq Ikki');
  });

  test('localeToOrdinal', () => {
    expect(localeToOrdinal(1)).toBe('Birinchi');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(10)).toBe("O'n So'm");
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arDz from '../src/locales/ar-DZ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ar-DZ.js';

const localeCode = 'ar-DZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arDz);
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
  [0, 'صفر'],
  [1, 'واحد'],
  [2, 'اثنان'],
  [3, 'ثلاثة'],
  [10, 'عشرة'],
  [11, 'أحد عشر'],
  [20, 'عشرون'],
  [21, 'واحد و عشرون'],
  [100, 'مائة'],
  [137, 'مائة و سبعة و ثلاثون'],
  [200, 'مائتان'],
  [1000, 'ألف'],
  [1234, 'ألف و مائتان و أربعة و ثلاثون'],
  [4680, 'أربعة آلاف و ستمائة و ثمانون'],
  [63892, 'ثلاثة و ستون ألف و ثمانمائة و اثنان و تسعون'],
  [1000000, 'مليون'],
  [2741034, 'مليونان و سبعمائة و واحد و أربعون ألف و أربعة و ثلاثون'],
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
    row[1] = `سالب ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'صفر دينار جزائري فقط لا غير'],
  [0.04, 'صفر دينار جزائري و أربعة سنتيمات فقط لا غير'],
  [0.4, 'صفر دينار جزائري و أربعون سنتيم فقط لا غير'],
  [0.63, 'صفر دينار جزائري و ثلاثة و ستون سنتيم فقط لا غير'],
  [0.999, 'دينار واحد فقط لا غير'],
  [1, 'دينار واحد فقط لا غير'],
  [2, 'ديناران فقط لا غير'],
  [3, 'ثلاثة دنانير فقط لا غير'],
  [37.06, 'سبعة و ثلاثون دينار جزائري و ستة سنتيمات فقط لا غير'],
  [37.68, 'سبعة و ثلاثون دينار جزائري و ثمانية و ستون سنتيم فقط لا غير'],
  [100, 'مائة دينار جزائري فقط لا غير'],
  [500.25, 'خمسمائة دينار جزائري و خمسة و عشرون سنتيم فقط لا غير'],
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
      row[1] = (row[1] as string).replace('صفر دينار جزائري و ', '');
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

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, 'صفر دينار جزائري فقط لا غير'];
      case value >= 1 && value < 2:
        return [value, 'دينار واحد فقط لا غير'];
      case value >= 2 && value < 3:
        return [value, 'ديناران فقط لا غير'];
      case value >= 3 && value < 4:
        return [value, 'ثلاثة دنانير فقط لا غير'];
      case value >= 37 && value < 38:
        return [value, 'سبعة و ثلاثون دينار جزائري فقط لا غير'];
      case value >= 100 && value < 101:
        return [value, 'مائة دينار جزائري فقط لا غير'];
      case value >= 500 && value < 501:
        return [value, 'خمسمائة دينار جزائري فقط لا غير'];
      default:
        return row;
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, ''];
      case value >= 1 && value < 2:
        return [value, 'دينار واحد فقط لا غير'];
      case value >= 2 && value < 3:
        return [value, 'ديناران فقط لا غير'];
      case value >= 3 && value < 4:
        return [value, 'ثلاثة دنانير فقط لا غير'];
      case value >= 37 && value < 38:
        return [value, 'سبعة و ثلاثون دينار جزائري فقط لا غير'];
      case value >= 100 && value < 101:
        return [value, 'مائة دينار جزائري فقط لا غير'];
      case value >= 500 && value < 501:
        return [value, 'خمسمائة دينار جزائري فقط لا غير'];
      default:
        return row;
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `مائة و ثلاثة و عشرون دينار جزائري فقط لا غير`],
    ['123', `مائة و ثلاثة و عشرون دينار جزائري فقط لا غير`],
    ['123.0', `مائة و ثلاثة و عشرون دينار جزائري و صفر سنتيم فقط لا غير`],
    ['123.00', `مائة و ثلاثة و عشرون دينار جزائري و صفر سنتيم فقط لا غير`],
    ['0.00', `صفر دينار جزائري و صفر سنتيم فقط لا غير`],
    ['-123.00', `سالب مائة و ثلاثة و عشرون دينار جزائري و صفر سنتيم فقط لا غير`],
    ['37.68', `سبعة و ثلاثون دينار جزائري و ثمانية و ستون سنتيم فقط لا غير`],
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
  [0.0, 'صفر'],
  [0.4, 'صفر فاصلة أربعة'],
  [0.04, 'صفر فاصلة صفر أربعة'],
  [0.63, 'صفر فاصلة ثلاثة و ستون'],
  [37.06, 'سبعة و ثلاثون فاصلة صفر ستة'],
  [37.68, 'سبعة و ثلاثون فاصلة ثمانية و ستون'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Ordinal Tests', () => {
  const toWordsOrdinal = new ToWords({
    localeCode: 'ar-DZ',
  });

  const testOrdinals: [number, string][] = [
    [1, 'الأول'],
    [2, 'الثاني'],
    [3, 'الثالث'],
    [4, 'الرابع'],
    [5, 'الخامس'],
    [6, 'السادس'],
    [7, 'السابع'],
    [8, 'الثامن'],
    [9, 'التاسع'],
    [10, 'العاشر'],
    [11, 'الحادي عشر'],
    [12, 'الثاني عشر'],
    [20, 'العشرون'],
    [30, 'الثلاثون'],
    [50, 'الخمسون'],
    [100, 'المائة'],
    [1000, 'الألف'],
    [1000000, 'المليون'],
  ];

  test.each(testOrdinals)('Number: %d => %s', (input, expected) => {
    expect(toWordsOrdinal.toOrdinal(input as number)).toBe(expected);
  });

  test('should throw error for negative numbers', () => {
    expect(() => toWordsOrdinal.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWordsOrdinal.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Locale functional exports', () => {
  test('localeToWords works', () => {
    expect(localeToWords(1)).toBe('واحد');
  });

  test('localeToOrdinal works', () => {
    expect(localeToOrdinal(1)).toBe('الأول');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(1)).toBe('دينار واحد فقط لا غير');
  });
});

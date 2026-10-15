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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
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
  [21, 'واحد وعشرون'],
  [100, 'مائة'],
  [137, 'مائة وسبعة وثلاثون'],
  [200, 'مائتان'],
  [1000, 'ألف'],
  [1234, 'ألف ومائتان وأربعة وثلاثون'],
  [4680, 'أربعة آلاف وستمائة وثمانون'],
  [63892, 'ثلاثة وستون ألفًا وثمانمائة واثنان وتسعون'],
  [1000000, 'مليون'],
  [2741034, 'مليونان وسبعمائة وواحد وأربعون ألفًا وأربعة وثلاثون'],
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
  [0.0, 'فقط صفر دينار جزائري لا غير'],
  [0.04, 'فقط صفر دينار جزائري وأربعة سنتيمات لا غير'],
  [0.4, 'فقط صفر دينار جزائري وأربعون سنتيمًا لا غير'],
  [0.63, 'فقط صفر دينار جزائري وثلاثة وستون سنتيمًا لا غير'],
  [0.999, 'فقط دينار جزائري واحد لا غير'],
  [1, 'فقط دينار جزائري واحد لا غير'],
  [2, 'فقط ديناران جزائريان لا غير'],
  [3, 'فقط ثلاثة دنانير جزائرية لا غير'],
  [37.06, 'فقط سبعة وثلاثون دينارًا جزائريًا وستة سنتيمات لا غير'],
  [37.68, 'فقط سبعة وثلاثون دينارًا جزائريًا وثمانية وستون سنتيمًا لا غير'],
  [100, 'فقط مائة دينار جزائري لا غير'],
  [500.25, 'فقط خمسمائة دينار جزائري وخمسة وعشرون سنتيمًا لا غير'],
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
      row[1] = (row[1] as string).replace('صفر دينار جزائري و', '');
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
        return [value, 'فقط صفر دينار جزائري لا غير'];
      case value >= 1 && value < 2:
        return [value, 'فقط دينار جزائري واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط ديناران جزائريان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة دنانير جزائرية لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون دينارًا جزائريًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة دينار جزائري لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة دينار جزائري لا غير'];
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
        return [value, 'فقط دينار جزائري واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط ديناران جزائريان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة دنانير جزائرية لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون دينارًا جزائريًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة دينار جزائري لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة دينار جزائري لا غير'];
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
    [123, `فقط مائة وثلاثة وعشرون دينارًا جزائريًا لا غير`],
    ['123', `فقط مائة وثلاثة وعشرون دينارًا جزائريًا لا غير`],
    ['123.0', `فقط مائة وثلاثة وعشرون دينارًا جزائريًا وصفر سنتيم لا غير`],
    ['123.00', `فقط مائة وثلاثة وعشرون دينارًا جزائريًا وصفر سنتيم لا غير`],
    ['0.00', `فقط صفر دينار جزائري وصفر سنتيم لا غير`],
    ['-123.00', `فقط سالب مائة وثلاثة وعشرون دينارًا جزائريًا وصفر سنتيم لا غير`],
    ['37.68', `فقط سبعة وثلاثون دينارًا جزائريًا وثمانية وستون سنتيمًا لا غير`],
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
  [0.63, 'صفر فاصلة ثلاثة وستون'],
  [37.06, 'سبعة وثلاثون فاصلة صفر ستة'],
  [37.68, 'سبعة وثلاثون فاصلة ثمانية وستون'],
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
    expect(localeToCurrency(1)).toBe('فقط دينار جزائري واحد لا غير');
  });
});

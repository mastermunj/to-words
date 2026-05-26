import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arIq from '../src/locales/ar-IQ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ar-IQ.js';

const localeCode = 'ar-IQ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arIq);
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
  [0.0, 'صفر دينار عراقي فقط لا غير'],
  [0.04, 'صفر دينار عراقي و أربعون فلس فقط لا غير'],
  [0.004, 'صفر دينار عراقي و أربعة فلوس فقط لا غير'],
  [0.4, 'صفر دينار عراقي و أربعمائة فلس فقط لا غير'],
  [0.63, 'صفر دينار عراقي و ستمائة و ثلاثون فلس فقط لا غير'],
  [0.999, 'صفر دينار عراقي و تسعمائة و تسعة و تسعون فلس فقط لا غير'],
  [1, 'دينار واحد فقط لا غير'],
  [2, 'ديناران فقط لا غير'],
  [3, 'ثلاثة دنانير فقط لا غير'],
  [37.068, 'سبعة و ثلاثون دينار عراقي و ثمانية و ستون فلس فقط لا غير'],
  [37.68, 'سبعة و ثلاثون دينار عراقي و ستمائة و ثمانون فلس فقط لا غير'],
  [37.683, 'سبعة و ثلاثون دينار عراقي و ستمائة و ثلاثة و ثمانون فلس فقط لا غير'],
  [100, 'مائة دينار عراقي فقط لا غير'],
  [500.25, 'خمسمائة دينار عراقي و مائتان و خمسون فلس فقط لا غير'],
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
      row[1] = (row[1] as string).replace('صفر دينار عراقي و ', '');
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

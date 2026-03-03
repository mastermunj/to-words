import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import siLk from '../src/locales/si-LK.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/si-LK.js';

const localeCode = 'si-LK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(siLk);
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

const testIntegers = [
  [0, 'ශූන්‍ය'],
  [1, 'එක'],
  [2, 'දෙ'],
  [3, 'තුන'],
  [4, 'හතර'],
  [5, 'පහ'],
  [6, 'හය'],
  [7, 'හත'],
  [8, 'අට'],
  [9, 'නවය'],
  [10, 'දහය'],
  [11, 'එකොළොස'],
  [12, 'දොළොස'],
  [13, 'දහය තුන'],
  [14, 'දහය හතර'],
  [15, 'දහය පහ'],
  [16, 'දහය හය'],
  [17, 'දහය හත'],
  [18, 'දහය අට'],
  [19, 'දහය නවය'],
  [20, 'විස'],
  [21, 'විස එක'],
  [25, 'විස පහ'],
  [30, 'තිස'],
  [40, 'හතළිස'],
  [50, 'පනස'],
  [60, 'හැට'],
  [70, 'හැත්තෑ'],
  [80, 'අසූ'],
  [90, 'අනූ'],
  [99, 'අනූ නවය'],
  [100, 'සිය'],
  [101, 'සිය එක'],
  [137, 'සිය තිස හත'],
  [200, 'දෙ සිය'],
  [500, 'පහ සිය'],
  [700, 'හත සිය'],
  [999, 'නවය සිය අනූ නවය'],
  [1000, 'දාහ'],
  [1001, 'දාහ එක'],
  [1100, 'දාහ සිය'],
  [2000, 'දෙ දාහ'],
  [4680, 'හතර දාහ හය සිය අසූ'],
  [10000, 'දහය දාහ'],
  [50000, 'පනස දාහ'],
  [100000, 'ලක්ෂය'],
  [200000, 'දෙ ලක්ෂය'],
  [250000, 'දෙ ලක්ෂය පනස දාහ'],
  [500000, 'පහ ලක්ෂය'],
  [1000000, 'එක මිලියනය'],
  [5000000, 'පහ මිලියනය'],
];

describe('Test Integers with options = {}', () => {
  test.concurrent.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) return;
    row[0] = -row[0];
    row[1] = `ඍණ ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} රුපියල`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testData = [
    [-1, 'ඍණ එක රුපියල'],
    [-10, 'ඍණ දහය රුපියල'],
    [-100, 'ඍණ සිය රුපියල'],
    [-1000, 'ඍණ දාහ රුපියල'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [0, ''],
    [5, 'පහ රුපියල'],
    [100, 'සිය රුපියල'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

const testFloats = [
  [0.5, 'ශූන්‍ය දශම පහ'],
  [1.5, 'එක දශම පහ'],
  [10.5, 'දහය දශම පහ'],
  [12.34, 'දොළොස දශම තිස හතර'],
  [37.68, 'තිස හත දශම හැට අට'],
  [0.04, 'ශූන්‍ය දශම ශූන්‍ය හතර'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.5, 'ශූන්‍ය රුපියල සහ පනස සත'],
  [1.5, 'එක රුපියල සහ පනස සත'],
  [37.68, 'තිස හත රුපියල සහ හැට අට සත'],
  [0.04, 'ශූන්‍ය රුපියල සහ හතර සත'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [1.5, 'එක රුපියල සහ පනස සත'],
    [37.68, 'තිස හත රුපියල සහ හැට අට සත'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testData = [
    [10.99, 'දහය රුපියල'],
    [37.68, 'තිස හත රුපියල'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

describe('Test Ordinal (unsupported — throws)', () => {
  test('toOrdinal throws for si-LK', () => {
    expect(() => toWords.toOrdinal(1)).toThrow('Ordinal conversion not supported for locale "si-LK"');
  });

  test('localeToOrdinal throws for si-LK', () => {
    expect(() => localeToOrdinal(1)).toThrow('Ordinal conversion not supported for locale');
  });
});

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(11)).toBe('එකොළොස');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(100)).toBe('සිය රුපියල');
  });
});

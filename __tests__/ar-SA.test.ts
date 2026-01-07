import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords';
import arSa from '../src/locales/ar-SA';

const localeCode = 'ar-SA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arSa);
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
  [0, 'صفر'],
  [1, 'واحد'],
  [2, 'اثنان'],
  [3, 'ثلاثة'],
  [10, 'عشرة'],
  [21, 'واحد و عشرون'],
  [100, 'مائة'],
  [1000, 'ألف'],
];

describe('Integer Conversion', () => {
  test.each(testIntegers)('should convert %i to %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testCurrency = [
  [1, 'ريال واحد فقط لا غير'],
  [2, 'ريالان فقط لا غير'],
  [100, 'مائة ريال فقط لا غير'],
];

describe('Currency Conversion', () => {
  test.each(testCurrency)('should convert %i riyal to %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

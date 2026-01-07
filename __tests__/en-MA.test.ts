import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords';
import enMa from '../src/locales/en-MA';

const localeCode = 'en-MA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enMa);
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
  [0, 'Zero'],
  [1, 'One'],
  [2, 'Two'],
  [10, 'Ten'],
  [21, 'Twenty One'],
  [100, 'One Hundred'],
  [1000, 'One Thousand'],
];

describe('Integer Conversion', () => {
  test.each(testIntegers)('should convert %i to %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testCurrency = [
  [1, 'One Dirham Only'],
  [100, 'One Hundred Dirhams Only'],
];

describe('Currency Conversion', () => {
  test.each(testCurrency)('should convert %i dirham to %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

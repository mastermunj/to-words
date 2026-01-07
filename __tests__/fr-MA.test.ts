import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords';
import frMa from '../src/locales/fr-MA';

const localeCode = 'fr-MA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frMa);
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
  [0, 'Zéro'],
  [1, 'Un'],
  [2, 'Deux'],
  [10, 'Dix'],
  [21, 'Vingt Et Un'],
  [100, 'Cent'],
  [1000, 'Mille'],
];

describe('Integer Conversion', () => {
  test.each(testIntegers)('should convert %i to %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testCurrency = [
  [1, 'Un Dirham'],
  [100, 'Cent Dirhams'],
];

describe('Currency Conversion', () => {
  test.each(testCurrency)('should convert %i dirham to %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

/**
 * Output style per locale: every locale that carries `compoundHyphen` or `naturalCaseWords`
 * data is exercised here, so a typo in one locale's list cannot pass unnoticed.
 */

import { describe, expect, test } from 'vitest';
import { ToWords, type LocaleCode } from '../src/ToWords';

const english: LocaleCode[] = [
  'en-AE',
  'en-AU',
  'en-BD',
  'en-CA',
  'en-GB',
  'en-GH',
  'en-HK',
  'en-IE',
  'en-IN',
  'en-IQ',
  'en-JM',
  'en-KE',
  'en-LK',
  'en-MA',
  'en-MM',
  'en-MU',
  'en-MY',
  'en-NG',
  'en-NP',
  'en-NZ',
  'en-OM',
  'en-PH',
  'en-PK',
  'en-SA',
  'en-SG',
  'en-TT',
  'en-TZ',
  'en-UG',
  'en-US',
  'en-ZA',
  'en-ZW',
];

describe('hyphenate in every English locale', () => {
  test.each(english)('%s', (localeCode) => {
    const tw = new ToWords({ localeCode });
    expect(tw.convert(21, { hyphenate: true })).toBe('Twenty-One');
    expect(tw.convert(99, { hyphenate: true, casing: 'lower' })).toBe('ninety-nine');
    expect(tw.toOrdinal(21, { hyphenate: true })).toBe('Twenty-First');
    expect(tw.convert(20, { hyphenate: true })).toBe('Twenty');
  });
});

describe('natural casing keeps the capitalised words of each locale', () => {
  const cases: [LocaleCode, number, string][] = [
    ['en-AU', 21, 'twenty-one Australian dollars only'],
    ['en-CA', 2, 'two Canadian dollars only'],
    ['en-NZ', 5, 'five New Zealand dollars only'],
    ['en-IQ', 3, 'three Iraqi dinars only'],
    ['en-OM', 4, 'four Omani rials only'],
    ['en-ZW', 6, 'six Zimbabwe Gold only'],
    ['en-US', 21, 'twenty-one dollars only'],
    ['fr-CI', 21, 'vingt et un francs CFA'],
    ['fr-CM', 2, 'deux francs CFA'],
    ['de-DE', 2000000, 'zwei Millionen Euro'],
    ['de-AT', 1000000, 'eine Million Euro'],
    ['de-CH', 2500000, 'zwei Millionen fünfhunderttausend Franken'],
  ];

  test.each(cases)('%s %d', (localeCode, amount, expected) => {
    const tw = new ToWords({ localeCode });
    expect(tw.convert(amount, { currency: true, casing: 'natural', hyphenate: true })).toBe(expected);
  });

  test('sentence case on a cheque line (en-AU)', () => {
    const tw = new ToWords({ localeCode: 'en-AU' });
    expect(tw.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true })).toBe(
      'Twenty-one Australian dollars and fifty cents only',
    );
  });

  test('German fraction denominators and scale nouns keep their capital', () => {
    const tw = new ToWords({ localeCode: 'de-DE' });
    expect(tw.convert(0.5, { decimalStyle: 'fraction', casing: 'natural' })).toBe('null und fünf Zehntel');
    expect(tw.convert(3000000000, { casing: 'natural' })).toBe('drei Milliarden');
    expect(tw.convert(1.25, { casing: 'natural' })).toBe('eins Komma fünfundzwanzig');
  });

  test('Dutch keeps the adjective of a place name (nl-SR)', () => {
    const tw = new ToWords({ localeCode: 'nl-SR' });
    expect(tw.convert(2, { currency: true, casing: 'natural' })).toBe('twee Surinaamse dollars');
  });
});

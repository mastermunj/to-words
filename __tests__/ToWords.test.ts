import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords';

describe('Wrong Locale', () => {
  const localeCode = 'en-INDIA';
  const toWords = new ToWords({
    localeCode: localeCode,
  });
  test(`With Locale: ${localeCode}`, () => {
    expect(() => toWords.convert(1)).toThrow(/Unknown Locale/);
  });
});

describe('Test Wrong Inputs', () => {
  const toWords = new ToWords();

  const testWrongInputs = [
    '',
    '1.2.3',
    '123,456',
    '--2',
    'NaN',
    NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  test.concurrent.each(testWrongInputs)('Input %s', (input) => {
    expect(() => toWords.convert(input as number)).toThrow(/Invalid Number/);
  });
});

describe('Test BigInt Inputs', () => {
  const toWords = new ToWords();

  test('Basic BigInt', () => {
    expect(toWords.convert(12345n)).toBe('Twelve Thousand Three Hundred Forty Five');
  });

  test('Negative BigInt', () => {
    expect(toWords.convert(-100n)).toBe('Minus One Hundred');
  });

  test('BigInt with currency', () => {
    expect(toWords.convert(1000n, { currency: true })).toBe('One Thousand Rupees Only');
  });

  test('Large BigInt beyond MAX_SAFE_INTEGER', () => {
    // 9007199254740992n is Number.MAX_SAFE_INTEGER + 1
    const result = toWords.convert(9007199254740992n);
    expect(result).toBe(
      'Ninety Crore Seven Lakh Nineteen Thousand Nine Hundred Twenty Five Crore Forty Seven Lakh Forty Thousand Nine Hundred Ninety Two',
    );
  });

  test('Zero BigInt', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('BigInt One with singular currency', () => {
    expect(toWords.convert(1n, { currency: true })).toBe('One Rupee Only');
  });
});

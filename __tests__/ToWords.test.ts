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

describe('Test setLocale method', () => {
  test('setLocale with en-US locale class', async () => {
    const { default: EnUsLocale } = await import('../src/locales/en-US');
    const toWords = new ToWords();
    toWords.setLocale(EnUsLocale);
    expect(toWords.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
  });

  test('setLocale with en-IN locale class', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const toWords = new ToWords();
    toWords.setLocale(EnInLocale);
    expect(toWords.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
    expect(toWords.convert(1234, { currency: true })).toBe('One Thousand Two Hundred Thirty Four Rupees Only');
  });

  test('setLocale with fr-FR locale class', async () => {
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const toWords = new ToWords();
    toWords.setLocale(FrFrLocale);
    expect(toWords.convert(80)).toBe('Quatre-Vingts');
  });

  test('setLocale returns this for chaining', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const toWords = new ToWords();
    const result = toWords.setLocale(EnInLocale).convert(100);
    expect(result).toBe('One Hundred');
  });

  test('setLocale overrides localeCode option', async () => {
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const toWords = new ToWords({ localeCode: 'en-IN' });
    toWords.setLocale(FrFrLocale);
    // Should use French, not English
    expect(toWords.convert(21)).toBe('Vingt Et Un');
  });
});

describe('Test per-locale entry points', () => {
  test('en-IN entry point has same API as main ToWords', async () => {
    const { ToWords: ToWordsEnIn } = await import('../src/locales/en-IN.js');
    const tw = new ToWordsEnIn();
    expect(tw.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
    expect(tw.convert(1234, { currency: true })).toBe('One Thousand Two Hundred Thirty Four Rupees Only');
    expect(tw.toOrdinal(42)).toBe('Forty Second');
  });

  test('fr-FR entry point works correctly', async () => {
    const { ToWords: ToWordsFrFr } = await import('../src/locales/fr-FR.js');
    const tw = new ToWordsFrFr();
    expect(tw.convert(80)).toBe('Quatre-Vingts');
    expect(tw.convert(21)).toBe('Vingt Et Un');
  });

  test('de-DE entry point works correctly', async () => {
    const { ToWords: ToWordsDeDe } = await import('../src/locales/de-DE.js');
    const tw = new ToWordsDeDe();
    expect(tw.convert(21)).toBe('Einundzwanzig');
  });

  test('ar-SA entry point works correctly', async () => {
    const { ToWords: ToWordsArSa } = await import('../src/locales/ar-SA.js');
    const tw = new ToWordsArSa();
    expect(tw.convert(1)).toBe('واحد');
  });

  test('entry point exports ToWords class', async () => {
    const entry = await import('../src/locales/en-IN.js');
    expect(entry.ToWords).toBeDefined();
  });

  test('multiple entry points can be used independently', async () => {
    const { ToWords: ToWordsEnIn } = await import('../src/locales/en-IN.js');
    const { ToWords: ToWordsFrFr } = await import('../src/locales/fr-FR.js');

    const twEn = new ToWordsEnIn();
    const twFr = new ToWordsFrFr();

    expect(twEn.convert(100)).toBe('One Hundred');
    expect(twFr.convert(100)).toBe('Cent');
  });
});

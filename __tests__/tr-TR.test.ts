import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import trTr from '../src/locales/tr-TR.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/tr-TR.js';

const localeCode = 'tr-TR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(trTr);
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
  [0, 'Sıfır'],
  [137, 'Yüz Otuz Yedi'],
  [700, 'Yedi Yüz'],
  [4680, 'Dört Bin Altı Yüz Seksen'],
  [63892, 'Altmış Üç Bin Sekiz Yüz Doksan İki'],
  [792581, 'Yedi Yüz Doksan İki Bin Beş Yüz Seksen Bir'],
  [2741034, 'İki Milyon Yedi Yüz Kırk Bir Bin Otuz Dört'],
  [86429753, 'Seksen Altı Milyon Dört Yüz Yirmi Dokuz Bin Yedi Yüz Elli Üç'],
  [975310864, 'Dokuz Yüz Yetmiş Beş Milyon Üç Yüz On Bin Sekiz Yüz Altmış Dört'],
  [9876543210, 'Dokuz Milyar Sekiz Yüz Yetmiş Altı Milyon Beş Yüz Kırk Üç Bin İki Yüz On'],
  [98765432101, 'Doksan Sekiz Milyar Yedi Yüz Altmış Beş Milyon Dört Yüz Otuz İki Bin Yüz Bir'],
  [987654321012, 'Dokuz Yüz Seksen Yedi Milyar Altı Yüz Elli Dört Milyon Üç Yüz Yirmi Bir Bin On İki'],
  [9876543210123, 'Dokuz Trilyon Sekiz Yüz Yetmiş Altı Milyar Beş Yüz Kırk Üç Milyon İki Yüz On Bin Yüz Yirmi Üç'],
  [
    98765432101234,
    'Doksan Sekiz Trilyon Yedi Yüz Altmış Beş Milyar Dört Yüz Otuz İki Milyon Yüz Bir Bin İki Yüz Otuz Dört',
  ],
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
    row[1] = `Eksi ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Lira`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Lira`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Lira`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'Sıfır'],
  [0.04, 'Sıfır Virgül Sıfır Dört'],
  [0.0468, 'Sıfır Virgül Sıfır Dört Altı Sekiz'],
  [0.4, 'Sıfır Virgül Dört'],
  [0.63, 'Sıfır Virgül Altmış Üç'],
  [0.973, 'Sıfır Virgül Dokuz Yüz Yetmiş Üç'],
  [0.999, 'Sıfır Virgül Dokuz Yüz Doksan Dokuz'],
  [37.06, 'Otuz Yedi Virgül Sıfır Altı'],
  [37.068, 'Otuz Yedi Virgül Sıfır Altı Sekiz'],
  [37.68, 'Otuz Yedi Virgül Altmış Sekiz'],
  [37.683, 'Otuz Yedi Virgül Altı Yüz Seksen Üç'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Yüz Yirmi Üç Lira`],
    ['123', `Yüz Yirmi Üç Lira`],
    ['123.0', `Yüz Yirmi Üç Lira Sıfır Kuruş`],
    ['123.00', `Yüz Yirmi Üç Lira Sıfır Kuruş`],
    ['0.00', `Sıfır Lira Sıfır Kuruş`],
    ['-123.00', `Eksi Yüz Yirmi Üç Lira Sıfır Kuruş`],
    ['37.68', `Otuz Yedi Lira Altmış Sekiz Kuruş`],
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

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });

  test.each([-0.5, '-0.5'])('preserves the sign for negative sub-unit input %s', (input) => {
    expect(toWords.convert(input)).toBe('Eksi Sıfır Virgül Beş');
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Sıfır Lira'],
  [0.04, 'Sıfır Lira Dört Kuruş'],
  [0.0468, 'Sıfır Lira Beş Kuruş'],
  [0.4, 'Sıfır Lira Kırk Kuruş'],
  [0.63, 'Sıfır Lira Altmış Üç Kuruş'],
  [0.973, 'Sıfır Lira Doksan Yedi Kuruş'],
  [0.999, 'Bir Lira'],
  [37.06, 'Otuz Yedi Lira Altı Kuruş'],
  [37.068, 'Otuz Yedi Lira Yedi Kuruş'],
  [37.68, 'Otuz Yedi Lira Altmış Sekiz Kuruş'],
  [37.683, 'Otuz Yedi Lira Altmış Sekiz Kuruş'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace('Sıfır Lira ', '');
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
    if (row[0] >= 0 && row[0] < 1) {
      return [row[0], 'Sıfır Lira'];
    }
    return [row[0], 'Otuz Yedi Lira'];
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
    if (row[0] >= 0 && row[0] < 1) {
      return [row[0], ''];
    }
    return [row[0], 'Otuz Yedi Lira'];
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

const testOrdinals: [number, string][] = [
  // Numbers 1-20
  [1, 'Birinci'],
  [2, 'İkinci'],
  [3, 'Üçüncü'],
  [4, 'Dördüncü'],
  [5, 'Beşinci'],
  [6, 'Altıncı'],
  [7, 'Yedinci'],
  [8, 'Sekizinci'],
  [9, 'Dokuzuncu'],
  [10, 'Onuncu'],
  [11, 'On Birinci'],
  [12, 'On İkinci'],
  [13, 'On Üçüncü'],
  [14, 'On Dördüncü'],
  [15, 'On Beşinci'],
  [16, 'On Altıncı'],
  [17, 'On Yedinci'],
  [18, 'On Sekizinci'],
  [19, 'On Dokuzuncu'],
  [20, 'Yirminci'],
  // Composite numbers (21, 22, etc.)
  [21, 'Yirmi Birinci'],
  [22, 'Yirmi İkinci'],
  // Decade numbers (30, 40, 50, etc.)
  [30, 'Otuzuncu'],
  [40, 'Kırkıncı'],
  [50, 'Ellinci'],
  [60, 'Altmışıncı'],
  [70, 'Yetmişinci'],
  [80, 'Sekseninci'],
  [90, 'Doksanıncı'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Yüzüncü'],
  [200, 'İki Yüzüncü'],
  [1000, 'Bininci'],
  [1000000, 'Bir Milyonuncu'],
  // Complex numbers
  [101, 'Yüz Birinci'],
  [123, 'Yüz Yirmi Üçüncü'],
  [1234, 'Bin İki Yüz Otuz Dördüncü'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR tr-TR
// ============================================================

// Powers of Ten (Turkish)
const testPowersOfTen: [number, string][] = [
  [10, 'On'],
  [100, 'Yüz'],
  [1000, 'Bin'],
  [10000, 'On Bin'],
  [100000, 'Yüz Bin'],
  [1000000, 'Bir Milyon'],
  [10000000, 'On Milyon'],
  [100000000, 'Yüz Milyon'],
  [1000000000, 'Bir Milyar'],
  [10000000000, 'On Milyar'],
  [100000000000, 'Yüz Milyar'],
  [1000000000000, 'Bir Trilyon'],
];

describe('Test Powers of Ten (Turkish System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Sıfır'],
  [1n, 'Bir'],
  [100n, 'Yüz'],
  [1000n, 'Bin'],
  [1000000n, 'Bir Milyon'],
  [1000000000n, 'Bir Milyar'],
  [1000000000000n, 'Bir Trilyon'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Eksi Bir'],
  [-100n, 'Eksi Yüz'],
  [-1000n, 'Eksi Bin'],
  [-1000000n, 'Eksi Bir Milyon'],
  [-1000000000n, 'Eksi Bir Milyar'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Sıfır'],
  ['1', 'Bir'],
  ['100', 'Yüz'],
  ['1000', 'Bin'],
  ['-100', 'Eksi Yüz'],
  ['  100  ', 'Yüz'],
  ['1000000', 'Bir Milyon'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Sıfır');
  });

  test('converts -0 as sıfır', () => {
    expect(toWords.convert(-0)).toBe('Sıfır');
  });

  test('converts 0.0 as sıfır', () => {
    expect(toWords.convert(0.0)).toBe('Sıfır');
  });

  test('converts 0n as sıfır', () => {
    expect(toWords.convert(0n)).toBe('Sıfır');
  });

  test('converts "0" as sıfır', () => {
    expect(toWords.convert('0')).toBe('Sıfır');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Sıfır Lira');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for tr-TR', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('throws for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('throws for invalid string', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
  });
});

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() matches new ToWords().toOrdinal()', () => {
    const tw = new LocaleToWords();
    expect(localeToOrdinal(1)).toBe(tw.toOrdinal(1));
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

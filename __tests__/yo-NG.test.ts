import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import yoNg from '../src/locales/yo-NG.js';
import { ToWords as LocaleToWords } from '../src/locales/yo-NG.js';

const localeCode = 'yo-NG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(yoNg);
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
  [0, 'Òdo'],
  [137, 'Ọ̀kan Ọgọ́rùn Ọgbọ̀n Méje'],
  [700, 'Méje Ọgọ́rùn'],
  [1100, 'Ọ̀kan Ẹgbẹ̀rún Ọgọ́rùn'],
  [4680, 'Mẹ́rin Ẹgbẹ̀rún Mẹ́fà Ọgọ́rùn Ọgọ́rin'],
  [63892, 'Ọgọ́ta Mẹ́ta Ẹgbẹ̀rún Mẹ́jọ Ọgọ́rùn Àádọ́rùn Méjì'],
  [86100, 'Ọgọ́rin Mẹ́fà Ẹgbẹ̀rún Ọgọ́rùn'],
  [792581, 'Méje Ọgọ́rùn Àádọ́rùn Méjì Ẹgbẹ̀rún Márùn-ún Ọgọ́rùn Ọgọ́rin Ọ̀kan'],
  [2741034, 'Méjì Mílíọ̀nù Méje Ọgọ́rùn Ogójì Ọ̀kan Ẹgbẹ̀rún Ọgbọ̀n Mẹ́rin'],
  [86429753, 'Ọgọ́rin Mẹ́fà Mílíọ̀nù Mẹ́rin Ọgọ́rùn Ogún Mẹ́sàn-án Ẹgbẹ̀rún Méje Ọgọ́rùn Àádọ́ta Mẹ́ta'],
  [975310864, 'Mẹ́sàn-án Ọgọ́rùn Àádọ́rin Márùn-ún Mílíọ̀nù Mẹ́ta Ọgọ́rùn Mẹ́wàá Ẹgbẹ̀rún Mẹ́jọ Ọgọ́rùn Ọgọ́ta Mẹ́rin'],
  [1000000000, 'Ọ̀kan Bílíọ̀nù'],
  [
    9876543210,
    'Mẹ́sàn-án Bílíọ̀nù Mẹ́jọ Ọgọ́rùn Àádọ́rin Mẹ́fà Mílíọ̀nù Márùn-ún Ọgọ́rùn Ogójì Mẹ́ta Ẹgbẹ̀rún Méjì Ọgọ́rùn Mẹ́wàá',
  ],
  [10000000000, 'Mẹ́wàá Bílíọ̀nù'],
  [100000000000, 'Ọgọ́rùn Bílíọ̀nù'],
  [1000000000000, 'Ọ̀kan Tirílíọ̀nù'],
];

describe('Test Integers with options = {}', () => {
  test.concurrent.each(testIntegers)('convert %d => %s', (input, expected) => {
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
    row[1] = `Òdì ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Naira Nìkan`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Naira`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Naira Nìkan`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Òdì ${row[1]} Naira Nìkan`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Naira Nìkan`;
  });

  test.concurrent.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0, 'Òdo'],
  [0.04, 'Òdo Àmì Òdo Mẹ́rin'],
  [0.0468, 'Òdo Àmì Òdo Mẹ́rin Mẹ́fà Mẹ́jọ'],
  [0.4, 'Òdo Àmì Mẹ́rin'],
  [0.63, 'Òdo Àmì Ọgọ́ta Mẹ́ta'],
  [0.973, 'Òdo Àmì Mẹ́sàn-án Ọgọ́rùn Àádọ́rin Mẹ́ta'],
  [0.999, 'Òdo Àmì Mẹ́sàn-án Ọgọ́rùn Àádọ́rùn Mẹ́sàn-án'],
  [37.06, 'Ọgbọ̀n Méje Àmì Òdo Mẹ́fà'],
  [37.068, 'Ọgbọ̀n Méje Àmì Òdo Mẹ́fà Mẹ́jọ'],
  [37.68, 'Ọgbọ̀n Méje Àmì Ọgọ́ta Mẹ́jọ'],
  [37.683, 'Ọgbọ̀n Méje Àmì Mẹ́fà Ọgọ́rùn Ọgọ́rin Mẹ́ta'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, 'Òdo Naira Nìkan'],
  [0.01, 'Òdo Naira Ati Ọ̀kan Kobo Nìkan'],
  [0.04, 'Òdo Naira Ati Mẹ́rin Kobo Nìkan'],
  [0.0468, 'Òdo Naira Ati Márùn-ún Kobo Nìkan'],
  [0.5, 'Òdo Naira Ati Àádọ́ta Kobo Nìkan'],
  [0.63, 'Òdo Naira Ati Ọgọ́ta Mẹ́ta Kobo Nìkan'],
  [0.973, 'Òdo Naira Ati Àádọ́rùn Méje Kobo Nìkan'],
  [0.999, 'Ọ̀kan Naira Nìkan'],
  [1.25, 'Ọ̀kan Naira Ati Ogún Márùn-ún Kobo Nìkan'],
  [10.99, 'Mẹ́wàá Naira Ati Àádọ́rùn Mẹ́sàn-án Kobo Nìkan'],
  [37.06, 'Ọgbọ̀n Méje Naira Ati Mẹ́fà Kobo Nìkan'],
  [37.68, 'Ọgbọ̀n Méje Naira Ati Ọgọ́ta Mẹ́jọ Kobo Nìkan'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, 'Ọ̀kan Kobo Nìkan'],
    [0.04, 'Mẹ́rin Kobo Nìkan'],
    [0.0468, 'Márùn-ún Kobo Nìkan'],
    [0.5, 'Àádọ́ta Kobo Nìkan'],
    [0.63, 'Ọgọ́ta Mẹ́ta Kobo Nìkan'],
    [0.973, 'Àádọ́rùn Méje Kobo Nìkan'],
    [0.999, 'Ọ̀kan Naira Nìkan'],
    [1.25, 'Ọ̀kan Naira Ati Ogún Márùn-ún Kobo Nìkan'],
    [10.99, 'Mẹ́wàá Naira Ati Àádọ́rùn Mẹ́sàn-án Kobo Nìkan'],
    [37.06, 'Ọgbọ̀n Méje Naira Ati Mẹ́fà Kobo Nìkan'],
    [37.68, 'Ọgbọ̀n Méje Naira Ati Ọgọ́ta Mẹ́jọ Kobo Nìkan'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0, 'Òdo Naira Nìkan'],
    [0.01, 'Òdo Naira Nìkan'],
    [0.04, 'Òdo Naira Nìkan'],
    [0.0468, 'Òdo Naira Nìkan'],
    [0.5, 'Òdo Naira Nìkan'],
    [0.63, 'Òdo Naira Nìkan'],
    [0.973, 'Òdo Naira Nìkan'],
    [0.999, 'Òdo Naira Nìkan'],
    [1.25, 'Ọ̀kan Naira Nìkan'],
    [10.99, 'Mẹ́wàá Naira Nìkan'],
    [37.06, 'Ọgbọ̀n Méje Naira Nìkan'],
    [37.68, 'Ọgbọ̀n Méje Naira Nìkan'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals: [number, string][] = [
    [0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, 'Ọ̀kan Naira Nìkan'],
    [10.99, 'Mẹ́wàá Naira Nìkan'],
    [37.06, 'Ọgbọ̀n Méje Naira Nìkan'],
    [37.68, 'Ọgbọ̀n Méje Naira Nìkan'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
          ignoreDecimal: true,
        }),
      ).toBe(expected);
    },
  );
});

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, 'Kìíní'],
  [2, 'Kẹ́jì'],
  [3, 'Kẹ́ta'],
  [4, 'Kẹ́rin'],
  [5, 'Kẹ́rún-ún'],
  [6, 'Kẹ́fà'],
  [7, 'Kẹ́je'],
  [8, 'Kẹ́jọ'],
  [9, 'Kẹ́sàn-án'],
  [10, 'Kẹ́wàá'],
  [11, 'Kẹ́ọkànlá'],
  [12, 'Kẹ́éjìlá'],
  [13, 'Kẹ́ẹ̀tàlá'],
  [14, 'Kẹ́ẹ̀rìnlá'],
  [15, 'Kẹ́ẹ̀dógún'],
  [16, 'Kẹ́ẹ̀rìndínlógún'],
  [17, 'Kẹ́ẹ̀tàdínlógún'],
  [18, 'Kẹ́éjìdínlógún'],
  [19, 'Kẹ́ọkàndínlógún'],
  [20, 'Kọgún'],
  [21, 'Ogún Kìíní'],
  [22, 'Ogún Kẹ́jì'],
  [23, 'Ogún Kẹ́ta'],
  [30, 'Kẹgbọ̀n'],
  [40, 'Kẹgójì'],
  [50, 'Kẹàádọ́ta'],
  [60, 'Kẹgọ́ta'],
  [70, 'Kẹàádọ́rin'],
  [80, 'Kẹgọ́rin'],
  [90, 'Kẹàádọ́rùn'],
  [31, 'Ọgbọ̀n Kìíní'],
  [32, 'Ọgbọ̀n Kẹ́jì'],
  [33, 'Ọgbọ̀n Kẹ́ta'],
  [41, 'Ogójì Kìíní'],
  [42, 'Ogójì Kẹ́jì'],
  [43, 'Ogójì Kẹ́ta'],
  [51, 'Àádọ́ta Kìíní'],
  [52, 'Àádọ́ta Kẹ́jì'],
  [53, 'Àádọ́ta Kẹ́ta'],
  [100, 'Kẹgọ́rùn'],
  [200, 'Méjì Kẹgọ́rùn'],
  [1000, 'Ọ̀kan Kẹgbẹ̀rún'],
  [10000, 'Mẹ́wàá Kẹgbẹ̀rún'],
  [100000, 'Ọgọ́rùn Kẹgbẹ̀rún'],
  [1000000, 'Ọ̀kan Kẹmílíọ̀nù'],
  [100001, 'Ọgọ́rùn Ẹgbẹ̀rún Kìíní'],
  [100002, 'Ọgọ́rùn Ẹgbẹ̀rún Kẹ́jì'],
  [100003, 'Ọgọ́rùn Ẹgbẹ̀rún Kẹ́ta'],
  [101, 'Ọ̀kan Ọgọ́rùn Kìíní'],
  [102, 'Ọ̀kan Ọgọ́rùn Kẹ́jì'],
  [103, 'Ọ̀kan Ọgọ́rùn Kẹ́ta'],
  [111, 'Ọ̀kan Ọgọ́rùn Kẹ́ọkànlá'],
  [112, 'Ọ̀kan Ọgọ́rùn Kẹ́éjìlá'],
  [113, 'Ọ̀kan Ọgọ́rùn Kẹ́ẹ̀tàlá'],
  [123, 'Ọ̀kan Ọgọ́rùn Ogún Kẹ́ta'],
  [1001, 'Ọ̀kan Ẹgbẹ̀rún Kìíní'],
  [1234, 'Ọ̀kan Ẹgbẹ̀rún Méjì Ọgọ́rùn Ọgbọ̀n Kẹ́rin'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(10.01)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(99.99)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Invalid Inputs', () => {
  const testInvalids: [unknown, string][] = [
    ['abc', 'Invalid Number'],
    ['', 'Invalid Number'],
    [Number.NaN, 'Invalid Number'],
    [Infinity, 'Invalid Number'],
  ];

  test.concurrent.each(testInvalids)('should throw error for %s', (input, message) => {
    expect(() => toWords.convert(input as number)).toThrow(message);
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'Mẹ́wàá'],
    [100, 'Ọgọ́rùn'],
    [1000, 'Ọ̀kan Ẹgbẹ̀rún'],
    [10000, 'Mẹ́wàá Ẹgbẹ̀rún'],
    [100000, 'Ọgọ́rùn Ẹgbẹ̀rún'],
    [1000000, 'Ọ̀kan Mílíọ̀nù'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test BigInt', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'Òdo'],
    [1n, 'Ọ̀kan'],
    [100n, 'Ọgọ́rùn'],
    [1000n, 'Ọ̀kan Ẹgbẹ̀rún'],
  ];

  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Negative BigInt', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'Òdì Ọ̀kan'],
    [-100n, 'Òdì Ọgọ́rùn'],
    [-1000n, 'Òdì Ọ̀kan Ẹgbẹ̀rún'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test String Input', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'Òdo'],
    ['1', 'Ọ̀kan'],
    ['100', 'Ọgọ́rùn'],
    ['-100', 'Òdì Ọgọ́rùn'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Òdo', () => {
    expect(toWords.convert(0)).toBe('Òdo');
  });

  test('convert -0 => Òdo', () => {
    expect(toWords.convert(-0)).toBe('Òdo');
  });

  test('convert 0.0 => Òdo', () => {
    expect(toWords.convert(0.0)).toBe('Òdo');
  });

  test('convert 0n => Òdo', () => {
    expect(toWords.convert(0n)).toBe('Òdo');
  });

  test('convert "0" => Òdo', () => {
    expect(toWords.convert('0')).toBe('Òdo');
  });

  test('convert 0 with currency => Òdo Naira Nìkan', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Òdo Naira Nìkan');
  });
});

describe('Test Invalid Input Errors', () => {
  const testInvalidInputs: [unknown, string][] = [
    [Number.NaN, 'Invalid Number'],
    [Infinity, 'Invalid Number'],
    [-Infinity, 'Invalid Number'],
    ['', 'Invalid Number'],
    ['abc', 'Invalid Number'],
  ];

  test.concurrent.each(testInvalidInputs)('should throw error for %s', (input, message) => {
    expect(() => toWords.convert(input as number)).toThrow(message);
  });
});

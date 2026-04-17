import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import mlIn from '../src/locales/ml-IN.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ml-IN.js';

const localeCode = 'ml-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(mlIn);
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
  [0, 'പൂജ്യം'],
  [137, 'ഒന്ന് നൂറ് മുപ്പത്തി ഏഴ്'],
  [700, 'ഏഴ് നൂറ്'],
  [4680, 'നാല് ആയിരം ആറ് നൂറ് എൺപത്'],
  [63892, 'അറുപത്തി മൂന്ന് ആയിരം എട്ട് നൂറ് തൊണ്ണൂറ്റി രണ്ട്'],
  [792581, 'ഏഴ് ലക്ഷം തൊണ്ണൂറ്റി രണ്ട് ആയിരം അഞ്ച് നൂറ് എൺപത്തി ഒന്ന്'],
  [2741034, 'ഇരുപത്തി ഏഴ് ലക്ഷം നാൽപത്തി ഒന്ന് ആയിരം മുപ്പത്തി നാല്'],
  [86429753, 'എട്ട് കോടി അറുപത്തി നാല് ലക്ഷം ഇരുപത്തി ഒൻപത് ആയിരം ഏഴ് നൂറ് അമ്പത്തി മൂന്ന്'],
  [975310864, 'തൊണ്ണൂറ്റി ഏഴ് കോടി അമ്പത്തി മൂന്ന് ലക്ഷം പത്ത് ആയിരം എട്ട് നൂറ് അറുപത്തി നാല്'],
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
    row[1] = `മൈനസ് ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} രൂപ`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} രൂപ`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} രൂപ`;
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
  [0.0, 'പൂജ്യം'],
  [0.04, 'പൂജ്യം പോയിന്റ് പൂജ്യം നാല്'],
  [0.0468, 'പൂജ്യം പോയിന്റ് പൂജ്യം നാല് ആറ് എട്ട്'],
  [0.4, 'പൂജ്യം പോയിന്റ് നാല്'],
  [0.63, 'പൂജ്യം പോയിന്റ് അറുപത്തി മൂന്ന്'],
  [0.973, 'പൂജ്യം പോയിന്റ് ഒൻപത് നൂറ് എഴുപത്തി മൂന്ന്'],
  [0.999, 'പൂജ്യം പോയിന്റ് ഒൻപത് നൂറ് തൊണ്ണൂറ്റി ഒൻപത്'],
  [37.06, 'മുപ്പത്തി ഏഴ് പോയിന്റ് പൂജ്യം ആറ്'],
  [37.068, 'മുപ്പത്തി ഏഴ് പോയിന്റ് പൂജ്യം ആറ് എട്ട്'],
  [37.68, 'മുപ്പത്തി ഏഴ് പോയിന്റ് അറുപത്തി എട്ട്'],
  [37.683, 'മുപ്പത്തി ഏഴ് പോയിന്റ് ആറ് നൂറ് എൺപത്തി മൂന്ന്'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് രൂപ`],
    ['123', `ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് രൂപ`],
    ['123.0', `ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് രൂപ ഉം പൂജ്യം പൈസ`],
    ['123.00', `ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് രൂപ ഉം പൂജ്യം പൈസ`],
    ['0.00', `പൂജ്യം രൂപ ഉം പൂജ്യം പൈസ`],
    ['-123.00', `മൈനസ് ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് രൂപ ഉം പൂജ്യം പൈസ`],
    ['37.68', `മുപ്പത്തി ഏഴ് രൂപ ഉം അറുപത്തി എട്ട് പൈസ`],
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
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'പൂജ്യം രൂപ'],
  [0.04, 'പൂജ്യം രൂപ ഉം നാല് പൈസ'],
  [0.0468, 'പൂജ്യം രൂപ ഉം അഞ്ച് പൈസ'],
  [0.4, 'പൂജ്യം രൂപ ഉം നാൽപത് പൈസ'],
  [0.63, 'പൂജ്യം രൂപ ഉം അറുപത്തി മൂന്ന് പൈസ'],
  [0.973, 'പൂജ്യം രൂപ ഉം തൊണ്ണൂറ്റി ഏഴ് പൈസ'],
  [0.999, 'ഒന്ന് രൂപ'],
  [37.06, 'മുപ്പത്തി ഏഴ് രൂപ ഉം ആറ് പൈസ'],
  [37.068, 'മുപ്പത്തി ഏഴ് രൂപ ഉം ഏഴ് പൈസ'],
  [37.68, 'മുപ്പത്തി ഏഴ് രൂപ ഉം അറുപത്തി എട്ട് പൈസ'],
  [37.683, 'മുപ്പത്തി ഏഴ് രൂപ ഉം അറുപത്തി എട്ട് പൈസ'],
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
      row[1] = (row[1] as string).replace(`പൂജ്യം രൂപ ഉം `, '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `പൂജ്യം രൂപ`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` ഉം [\u0D00-\u0D7F ]+ പൈസ`), '');
    }
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` ഉം [\u0D00-\u0D7F ]+ പൈസ`), '');
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
  [0, 'പൂജ്യത്താം'],
  [1, 'ഒന്നാം'],
  [2, 'രണ്ടാം'],
  [3, 'മൂന്നാം'],
  [4, 'നാലാം'],
  [5, 'അഞ്ചാം'],
  [6, 'ആറാം'],
  [7, 'ഏഴാം'],
  [8, 'എട്ടാം'],
  [9, 'ഒൻപതാം'],
  [10, 'പത്താം'],
  [11, 'പതിനൊന്നാം'],
  [12, 'പന്ത്രണ്ടാം'],
  [13, 'പതിമൂന്നാം'],
  [14, 'പതിനാലാം'],
  [15, 'പതിനഞ്ചാം'],
  [16, 'പതിനാറാം'],
  [17, 'പതിനേഴാം'],
  [18, 'പതിനെട്ടാം'],
  [19, 'പത്തൊൻപതാം'],
  [20, 'ഇരുപതാം'],
  [21, 'ഇരുപത്തി ഒന്നാം'],
  [22, 'ഇരുപത്തി രണ്ടാം'],
  [23, 'ഇരുപത്തി മൂന്നാം'],
  [24, 'ഇരുപത്തി നാലാം'],
  [25, 'ഇരുപത്തി അഞ്ചാം'],
  [30, 'മുപ്പതാം'],
  [40, 'നാൽപതാം'],
  [50, 'അമ്പതാം'],
  [60, 'അറുപതാം'],
  [70, 'എഴുപതാം'],
  [80, 'എൺപതാം'],
  [90, 'തൊണ്ണൂറാം'],
  [99, 'തൊണ്ണൂറ്റി ഒൻപതാം'],
  [100, 'നൂറാം'],
  [101, 'ഒന്ന് നൂറ് ഒന്നാം'],
  [111, 'ഒന്ന് നൂറ് പതിനൊന്നാം'],
  [123, 'ഒന്ന് നൂറ് ഇരുപത്തി മൂന്നാം'],
  [199, 'ഒന്ന് നൂറ് തൊണ്ണൂറ്റി ഒൻപതാം'],
  [200, 'രണ്ട് നൂറാം'],
  [500, 'അഞ്ച് നൂറാം'],
  [1000, 'ഒന്ന് ആയിരത്താം'],
  [1001, 'ഒന്ന് ആയിരം ഒന്നാം'],
  [1100, 'ഒന്ന് ആയിരം നൂറാം'],
  [1234, 'ഒന്ന് ആയിരം രണ്ട് നൂറ് മുപ്പത്തി നാലാം'],
  [10000, 'പത്ത് ആയിരത്താം'],
  [100000, 'ഒന്ന് ലക്ഷത്താം'],
  [100001, 'ഒന്ന് ലക്ഷം ഒന്നാം'],
  [1000000, 'പത്ത് ലക്ഷത്താം'],
  [10000000, 'ഒന്ന് കോടിയാം'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow(/must be non-negative/);
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow(/must be non-negative integers/);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'പത്ത്'],
  [100, 'നൂറ്'],
  [1000, 'ഒന്ന് ആയിരം'],
  [10000, 'പത്ത് ആയിരം'],
  [100000, 'ഒന്ന് ലക്ഷം'],
  [1000000, 'പത്ത് ലക്ഷം'],
  [10000000, 'ഒന്ന് കോടി'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'പൂജ്യം'],
  [1n, 'ഒന്ന്'],
  [100n, 'നൂറ്'],
  [1000n, 'ഒന്ന് ആയിരം'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'മൈനസ് ഒന്ന്'],
  [-100n, 'മൈനസ് നൂറ്'],
  [-1000n, 'മൈനസ് ഒന്ന് ആയിരം'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'പൂജ്യം'],
  ['1', 'ഒന്ന്'],
  ['100', 'നൂറ്'],
  ['-100', 'മൈനസ് നൂറ്'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test.concurrent.each([
    [0, 'പൂജ്യം'],
    [-0, 'പൂജ്യം'],
    [0.0, 'പൂജ്യം'],
  ] as [number, string][])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('convert 0n => പൂജ്യം', () => {
    expect(toWords.convert(0n)).toBe('പൂജ്യം');
  });

  test('convert "0" => പൂജ്യം', () => {
    expect(toWords.convert('0')).toBe('പൂജ്യം');
  });

  test('convert 0 with currency => പൂജ്യം രൂപ', () => {
    expect(toWords.convert(0, { currency: true })).toBe('പൂജ്യം രൂപ');
  });
});

describe('Test Invalid Input', () => {
  test.concurrent.each([
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
  ] as [number, string][])('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input)).toThrow(expectedMessage);
  });

  test.concurrent.each([
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ] as [string, string][])('convert "%s" throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input)).toThrow(expectedMessage);
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

const testFractionStyleMlIN: [number, string][] = [
  [1.1, 'ഒന്ന് ഉം ഒന്ന് ദശാംശം'],
  [2.5, 'രണ്ട് ഉം അഞ്ച് ദശാംശം'],
  [1.01, 'ഒന്ന് ഉം ഒന്ന് ശതാംശം'],
  [1.45, 'ഒന്ന് ഉം നാൽപത്തി അഞ്ച് ശതാംശം'],
  [0.05, 'പൂജ്യം ഉം അഞ്ച് ശതാംശം'],
  [1.001, 'ഒന്ന് ഉം ഒന്ന് സഹസ്രാംശം'],
  [1.005, 'ഒന്ന് ഉം അഞ്ച് സഹസ്രാംശം'],
  [1.0001, 'ഒന്ന് ഉം ഒന്ന് ദശ-സഹസ്രാംശം'],
  [1.0005, 'ഒന്ന് ഉം അഞ്ച് ദശ-സഹസ്രാംശം'],
  [1.00001, 'ഒന്ന് ഉം ഒന്ന് ശത-സഹസ്രാംശം'],
  [1.00005, 'ഒന്ന് ഉം അഞ്ച് ശത-സഹസ്രാംശം'],
  [1.000001, 'ഒന്ന് ഉം ഒന്ന് ദശ-ലക്ഷാംശം'],
  [1.000005, 'ഒന്ന് ഉം അഞ്ച് ദശ-ലക്ഷാംശം'],
  [123.45, 'ഒന്ന് നൂറ് ഇരുപത്തി മൂന്ന് ഉം നാൽപത്തി അഞ്ച് ശതാംശം'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleMlIN)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'ഒന്ന് പോയിന്റ് പന്ത്രണ്ട് ലക്ഷം മുപ്പത്തി നാല് ആയിരം അഞ്ച് നൂറ് അറുപത്തി ഏഴ്',
    );
    expect(toWords.convert(1.1234567)).toBe('ഒന്ന് പോയിന്റ് പന്ത്രണ്ട് ലക്ഷം മുപ്പത്തി നാല് ആയിരം അഞ്ച് നൂറ് അറുപത്തി ഏഴ്');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('ഒന്ന് പോയിന്റ് അഞ്ച്');
    expect(toWords.convert(0.05)).toBe('പൂജ്യം പോയിന്റ് പൂജ്യം അഞ്ച്');
  });
});

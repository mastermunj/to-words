import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import paIn from '../src/locales/pa-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/pa-IN.js';

const localeCode = 'pa-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(paIn);
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
  [0, 'ਸਿਫ਼ਰ'],
  [137, 'ਇੱਕ ਸੌ ਸੰਤੀ'],
  [700, 'ਸੱਤ ਸੌ'],
  [4680, 'ਚਾਰ ਹਜ਼ਾਰ ਛੇ ਸੌ ਅੱਸੀ'],
  [63892, 'ਤਰੇਹਠ ਹਜ਼ਾਰ ਅੱਠ ਸੌ ਬਾਣਵੇਂ'],
  [792581, 'ਸੱਤ ਲੱਖ ਬਾਣਵੇਂ ਹਜ਼ਾਰ ਪੰਜ ਸੌ ਇਕਾਸੀ'],
  [2741034, 'ਸਤਾਈ ਲੱਖ ਇਕਤਾਲੀ ਹਜ਼ਾਰ ਚੌਂਤੀ'],
  [86429753, 'ਅੱਠ ਕਰੋੜ ਚੌਂਹਠ ਲੱਖ ਉਣੱਤੀ ਹਜ਼ਾਰ ਸੱਤ ਸੌ ਤਿਰਵੰਜਾ'],
  [975310864, 'ਸਤਾਣਵੇਂ ਕਰੋੜ ਤਿਰਵੰਜਾ ਲੱਖ ਦਸ ਹਜ਼ਾਰ ਅੱਠ ਸੌ ਚੌਂਹਠ'],
  [9876543210, 'ਨੌਂ ਅਰਬ ਸਤਾਸੀ ਕਰੋੜ ਪੈਂਹਠ ਲੱਖ ਤਰਤਾਲੀ ਹਜ਼ਾਰ ਦੋ ਸੌ ਦਸ'],
  [98765432101, 'ਅਠਾਣਵੇਂ ਅਰਬ ਛਿਹੱਤਰ ਕਰੋੜ ਚੁਰੰਜਾ ਲੱਖ ਬੱਤੀ ਹਜ਼ਾਰ ਇੱਕ ਸੌ ਇੱਕ'],
  [987654321012, 'ਨੌਂ ਖਰਬ ਸਤਾਸੀ ਅਰਬ ਪੈਂਹਠ ਕਰੋੜ ਤਰਤਾਲੀ ਲੱਖ ਇੱਕੀ ਹਜ਼ਾਰ ਬਾਰਾਂ'],
  [9876543210123, 'ਅਠਾਣਵੇਂ ਖਰਬ ਛਿਹੱਤਰ ਅਰਬ ਚੁਰੰਜਾ ਕਰੋੜ ਬੱਤੀ ਲੱਖ ਦਸ ਹਜ਼ਾਰ ਇੱਕ ਸੌ ਤੇਈ'],
  [98765432101234, 'ਨੌਂ ਨੀਲ ਸਤਾਸੀ ਖਰਬ ਪੈਂਹਠ ਅਰਬ ਤਰਤਾਲੀ ਕਰੋੜ ਇੱਕੀ ਲੱਖ ਇੱਕ ਹਜ਼ਾਰ ਦੋ ਸੌ ਚੌਂਤੀ'],
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
    row[1] = `ਰਿਣ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ਰੁਪਏ`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ਰੁਪਏ`;
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
    row[1] = `${row[1]} ਰੁਪਏ`;
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

const testFloats = [
  [0.0, 'ਸਿਫ਼ਰ'],
  [0.04, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਸਿਫ਼ਰ ਚਾਰ'],
  [0.0468, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਸਿਫ਼ਰ ਚਾਰ ਛੇ ਅੱਠ'],
  [0.4, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਚਾਰ'],
  [0.63, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਤਰੇਹਠ'],
  [0.973, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਨੌਂ ਸੌ ਤਿਹੱਤਰ'],
  [0.999, 'ਸਿਫ਼ਰ ਦਸ਼ਮਲਵ ਨੌਂ ਸੌ ਨਿੰਨਾਣਵੇਂ'],
  [37.06, 'ਸੰਤੀ ਦਸ਼ਮਲਵ ਸਿਫ਼ਰ ਛੇ'],
  [37.068, 'ਸੰਤੀ ਦਸ਼ਮਲਵ ਸਿਫ਼ਰ ਛੇ ਅੱਠ'],
  [37.68, 'ਸੰਤੀ ਦਸ਼ਮਲਵ ਅਠਾਹਟ'],
  [37.683, 'ਸੰਤੀ ਦਸ਼ਮਲਵ ਛੇ ਸੌ ਤਿਰਾਸੀ'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'ਸਿਫ਼ਰ ਰੁਪਏ'],
  [0.04, 'ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ ਚਾਰ ਪੈਸੇ'],
  [0.0468, 'ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ ਪੰਜ ਪੈਸੇ'],
  [0.4, 'ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ ਚਾਲੀ ਪੈਸੇ'],
  [0.63, 'ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ ਤਰੇਹਠ ਪੈਸੇ'],
  [0.973, 'ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ ਸਤਾਣਵੇਂ ਪੈਸੇ'],
  [0.999, 'ਇੱਕ ਰੁਪਇਆ'],
  [37.06, 'ਸੰਤੀ ਰੁਪਏ ਅਤੇ ਛੇ ਪੈਸੇ'],
  [37.068, 'ਸੰਤੀ ਰੁਪਏ ਅਤੇ ਸੱਤ ਪੈਸੇ'],
  [37.68, 'ਸੰਤੀ ਰੁਪਏ ਅਤੇ ਅਠਾਹਟ ਪੈਸੇ'],
  [37.683, 'ਸੰਤੀ ਰੁਪਏ ਅਤੇ ਅਠਾਹਟ ਪੈਸੇ'],
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
      row[1] = (row[1] as string).replace(`ਸਿਫ਼ਰ ਰੁਪਏ ਅਤੇ `, '');
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
      row[1] = `ਸਿਫ਼ਰ ਰੁਪਏ`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` ਅਤੇ [\u0A00-\u0A7F ]+ ਪੈਸੇ`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` ਅਤੇ [\u0A00-\u0A7F ]+ ਪੈਸੇ`), '');
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
  [0, 'ਸਿਫ਼ਰਵਾਂ'],
  [1, 'ਪਹਿਲਾ'],
  [2, 'ਦੂਜਾ'],
  [3, 'ਤੀਜਾ'],
  [4, 'ਚੌਥਾ'],
  [5, 'ਪੰਜਵਾਂ'],
  [6, 'ਛੇਵਾਂ'],
  [7, 'ਸੱਤਵਾਂ'],
  [8, 'ਅੱਠਵਾਂ'],
  [9, 'ਨੌਂਵਾਂ'],
  [10, 'ਦਸਵਾਂ'],
  [11, 'ਗਿਆਰਾਂਵਾਂ'],
  [12, 'ਬਾਰਾਂਵਾਂ'],
  [13, 'ਤੇਰਾਂਵਾਂ'],
  [14, 'ਚੌਦਾਂਵਾਂ'],
  [15, 'ਪੰਦਰਾਂਵਾਂ'],
  [16, 'ਸੋਲਾਂਵਾਂ'],
  [17, 'ਸਤਾਰਾਂਵਾਂ'],
  [18, 'ਅਠਾਰਾਂਵਾਂ'],
  [19, 'ਉਨੀਵਾਂ'],
  [20, 'ਵੀਹਵਾਂ'],
  [21, 'ਇੱਕੀਵਾਂ'],
  [22, 'ਬਾਈਵਾਂ'],
  [23, 'ਤੇਈਵਾਂ'],
  [24, 'ਚੌਵੀਵਾਂ'],
  [25, 'ਪੱਚੀਵਾਂ'],
  [30, 'ਤੀਹਵਾਂ'],
  [40, 'ਚਾਲੀਵਾਂ'],
  [50, 'ਪੰਜਾਹਵਾਂ'],
  [60, 'ਸੱਠਵਾਂ'],
  [70, 'ਸੱਤਰਵਾਂ'],
  [80, 'ਅੱਸੀਵਾਂ'],
  [90, 'ਨੱਬੇਵਾਂ'],
  [99, 'ਨਿੰਨਾਣਵੇਂਵਾਂ'],
  [100, 'ਸੌਵਾਂ'],
  [101, 'ਇੱਕ ਸੌ ਪਹਿਲਾ'],
  [111, 'ਇੱਕ ਸੌ ਗਿਆਰਾਂਵਾਂ'],
  [123, 'ਇੱਕ ਸੌ ਤੇਈਵਾਂ'],
  [199, 'ਇੱਕ ਸੌ ਨਿੰਨਾਣਵੇਂਵਾਂ'],
  [200, 'ਦੋ ਸੌਵਾਂ'],
  [500, 'ਪੰਜ ਸੌਵਾਂ'],
  [1000, 'ਇੱਕ ਹਜ਼ਾਰਵਾਂ'],
  [1001, 'ਇੱਕ ਹਜ਼ਾਰ ਪਹਿਲਾ'],
  [1100, 'ਇੱਕ ਹਜ਼ਾਰ ਸੌਵਾਂ'],
  [1234, 'ਇੱਕ ਹਜ਼ਾਰ ਦੋ ਸੌ ਚੌਂਤੀਵਾਂ'],
  [10000, 'ਦਸ ਹਜ਼ਾਰਵਾਂ'],
  [100000, 'ਇੱਕ ਲੱਖਵਾਂ'],
  [100001, 'ਇੱਕ ਲੱਖ ਪਹਿਲਾ'],
  [1000000, 'ਦਸ ਲੱਖਵਾਂ'],
  [10000000, 'ਇੱਕ ਕਰੋੜਵਾਂ'],
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
  [10, 'ਦਸ'],
  [100, 'ਸੌ'],
  [1000, 'ਇੱਕ ਹਜ਼ਾਰ'],
  [10000, 'ਦਸ ਹਜ਼ਾਰ'],
  [100000, 'ਇੱਕ ਲੱਖ'],
  [1000000, 'ਦਸ ਲੱਖ'],
  [10000000, 'ਇੱਕ ਕਰੋੜ'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'ਸਿਫ਼ਰ'],
  [1n, 'ਇੱਕ'],
  [100n, 'ਸੌ'],
  [1000n, 'ਇੱਕ ਹਜ਼ਾਰ'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'ਰਿਣ ਇੱਕ'],
  [-100n, 'ਰਿਣ ਸੌ'],
  [-1000n, 'ਰਿਣ ਇੱਕ ਹਜ਼ਾਰ'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'ਸਿਫ਼ਰ'],
  ['1', 'ਇੱਕ'],
  ['100', 'ਸੌ'],
  ['-100', 'ਰਿਣ ਸੌ'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test.concurrent.each([
    [0, 'ਸਿਫ਼ਰ'],
    [-0, 'ਸਿਫ਼ਰ'],
    [0.0, 'ਸਿਫ਼ਰ'],
  ] as [number, string][])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('convert 0n => ਸਿਫ਼ਰ', () => {
    expect(toWords.convert(0n)).toBe('ਸਿਫ਼ਰ');
  });

  test('convert "0" => ਸਿਫ਼ਰ', () => {
    expect(toWords.convert('0')).toBe('ਸਿਫ਼ਰ');
  });

  test('convert 0 with currency => ਸਿਫ਼ਰ ਰੁਪਏ', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ਸਿਫ਼ਰ ਰੁਪਏ');
  });
});

describe('Test Invalid Input', () => {
  test.concurrent.each([
    [NaN, /Invalid Number/],
    [Infinity, /Invalid Number/],
    [-Infinity, /Invalid Number/],
    ['', /Invalid Number/],
    ['abc', /Invalid Number/],
  ] as [number | string, RegExp][])('convert %s throws error', (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
  });
});

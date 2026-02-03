import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import msMy from '../src/locales/ms-MY.js';
import { ToWords as LocaleToWords } from '../src/locales/ms-MY.js';

const localeCode = 'ms-MY';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(msMy);
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
  [0, 'Sifar'],
  [1, 'Satu'],
  [2, 'Dua'],
  [3, 'Tiga'],
  [4, 'Empat'],
  [5, 'Lima'],
  [6, 'Enam'],
  [7, 'Tujuh'],
  [8, 'Lapan'],
  [9, 'Sembilan'],
  [10, 'Sepuluh'],
  [11, 'Sebelas'],
  [12, 'Dua Belas'],
  [13, 'Tiga Belas'],
  [14, 'Empat Belas'],
  [15, 'Lima Belas'],
  [16, 'Enam Belas'],
  [17, 'Tujuh Belas'],
  [18, 'Lapan Belas'],
  [19, 'Sembilan Belas'],
  [20, 'Dua Puluh'],
  [21, 'Dua Puluh Satu'],
  [25, 'Dua Puluh Lima'],
  [30, 'Tiga Puluh'],
  [35, 'Tiga Puluh Lima'],
  [50, 'Lima Puluh'],
  [99, 'Sembilan Puluh Sembilan'],
  [100, 'Seratus'],
  [101, 'Seratus Satu'],
  [111, 'Seratus Sebelas'],
  [137, 'Seratus Tiga Puluh Tujuh'],
  [200, 'Dua Ratus'],
  [500, 'Lima Ratus'],
  [700, 'Tujuh Ratus'],
  [888, 'Lapan Ratus Lapan Puluh Lapan'],
  [999, 'Sembilan Ratus Sembilan Puluh Sembilan'],
  [1000, 'Seribu'],
  [1001, 'Seribu Satu'],
  [1100, 'Seribu Seratus'],
  [1111, 'Seribu Seratus Sebelas'],
  [2000, 'Dua Ribu'],
  [4680, 'Empat Ribu Enam Ratus Lapan Puluh'],
  [10000, 'Sepuluh Ribu'],
  [11000, 'Sebelas Ribu'],
  [21000, 'Dua Puluh Satu Ribu'],
  [63892, 'Enam Puluh Tiga Ribu Lapan Ratus Sembilan Puluh Dua'],
  [86100, 'Lapan Puluh Enam Ribu Seratus'],
  [100000, 'Seratus Ribu'],
  [123456, 'Seratus Dua Puluh Tiga Ribu Empat Ratus Lima Puluh Enam'],
  [792581, 'Tujuh Ratus Sembilan Puluh Dua Ribu Lima Ratus Lapan Puluh Satu'],
  [1000000, 'Satu Juta'],
  [2000000, 'Dua Juta'],
  [2741034, 'Dua Juta Tujuh Ratus Empat Puluh Satu Ribu Tiga Puluh Empat'],
  [10000000, 'Sepuluh Juta'],
  [86429753, 'Lapan Puluh Enam Juta Empat Ratus Dua Puluh Sembilan Ribu Tujuh Ratus Lima Puluh Tiga'],
  [100000000, 'Seratus Juta'],
  [975310864, 'Sembilan Ratus Tujuh Puluh Lima Juta Tiga Ratus Sepuluh Ribu Lapan Ratus Enam Puluh Empat'],
  [1000000000, 'Satu Bilion'],
  [9876543210, 'Sembilan Bilion Lapan Ratus Tujuh Puluh Enam Juta Lima Ratus Empat Puluh Tiga Ribu Dua Ratus Sepuluh'],
  [1000000000000, 'Satu Triliun'],
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Ringgit Sahaja`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Ringgit`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Ringgit Sahaja`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Ringgit Sahaja`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Ringgit Sahaja`;
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
  [0.0, 'Sifar'],
  [0.04, 'Sifar Perpuluhan Sifar Empat'],
  [0.0468, 'Sifar Perpuluhan Sifar Empat Enam Lapan'],
  [0.4, 'Sifar Perpuluhan Empat'],
  [0.63, 'Sifar Perpuluhan Enam Puluh Tiga'],
  [0.973, 'Sifar Perpuluhan Sembilan Ratus Tujuh Puluh Tiga'],
  [0.999, 'Sifar Perpuluhan Sembilan Ratus Sembilan Puluh Sembilan'],
  [37.06, 'Tiga Puluh Tujuh Perpuluhan Sifar Enam'],
  [37.068, 'Tiga Puluh Tujuh Perpuluhan Sifar Enam Lapan'],
  [37.68, 'Tiga Puluh Tujuh Perpuluhan Enam Puluh Lapan'],
  [37.683, 'Tiga Puluh Tujuh Perpuluhan Enam Ratus Lapan Puluh Tiga'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Sifar Ringgit Sahaja'],
  [0.04, 'Sifar Ringgit Dan Empat Sen Sahaja'],
  [0.0468, 'Sifar Ringgit Dan Lima Sen Sahaja'],
  [0.4, 'Sifar Ringgit Dan Empat Puluh Sen Sahaja'],
  [0.63, 'Sifar Ringgit Dan Enam Puluh Tiga Sen Sahaja'],
  [0.973, 'Sifar Ringgit Dan Sembilan Puluh Tujuh Sen Sahaja'],
  [0.999, 'Satu Ringgit Sahaja'],
  [37.06, 'Tiga Puluh Tujuh Ringgit Dan Enam Sen Sahaja'],
  [37.068, 'Tiga Puluh Tujuh Ringgit Dan Tujuh Sen Sahaja'],
  [37.68, 'Tiga Puluh Tujuh Ringgit Dan Enam Puluh Lapan Sen Sahaja'],
  [37.683, 'Tiga Puluh Tujuh Ringgit Dan Enam Puluh Lapan Sen Sahaja'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace('Sifar Ringgit Dan ', '');
    }
  });

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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = 'Sifar Ringgit Sahaja';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Dan [\\w ]+ Sen`), '');
    }
  });

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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` Dan [\\w ]+ Sen`), '');
  });

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
  // Numbers 1-20 (special ordinal forms)
  [0, 'Kesifar'],
  [1, 'Kesatu'],
  [2, 'Kedua'],
  [3, 'Ketiga'],
  [4, 'Keempat'],
  [5, 'Kelima'],
  [6, 'Keenam'],
  [7, 'Ketujuh'],
  [8, 'Kelapan'],
  [9, 'Kesembilan'],
  [10, 'Kesepuluh'],
  [11, 'Kesebelas'],
  [12, 'Kedua Belas'],
  [13, 'Ketiga Belas'],
  [14, 'Keempat Belas'],
  [15, 'Kelima Belas'],
  [16, 'Keenam Belas'],
  [17, 'Ketujuh Belas'],
  [18, 'Kelapan Belas'],
  [19, 'Kesembilan Belas'],
  [20, 'Kedua Puluh'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'Dua Puluh Kesatu'],
  [22, 'Dua Puluh Kedua'],
  [23, 'Dua Puluh Ketiga'],
  [30, 'Ketiga Puluh'],
  [40, 'Keempat Puluh'],
  [50, 'Kelima Puluh'],
  [60, 'Keenam Puluh'],
  [70, 'Ketujuh Puluh'],
  [80, 'Kelapan Puluh'],
  [90, 'Kesembilan Puluh'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Tiga Puluh Kesatu'],
  [32, 'Tiga Puluh Kedua'],
  [33, 'Tiga Puluh Ketiga'],
  [41, 'Empat Puluh Kesatu'],
  [42, 'Empat Puluh Kedua'],
  [43, 'Empat Puluh Ketiga'],
  [51, 'Lima Puluh Kesatu'],
  [52, 'Lima Puluh Kedua'],
  [53, 'Lima Puluh Ketiga'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Keseratus'],
  [200, 'Dua Keratus'],
  [1000, 'Keseribu'],
  [10000, 'Sepuluh Keribu'],
  [100000, 'Seratus Keribu'],
  [1000000, 'Satu Kejuta'],
  [10000000, 'Sepuluh Kejuta'],

  // Numbers in the hundreds with endings
  [101, 'Seratus Kesatu'],
  [102, 'Seratus Kedua'],
  [103, 'Seratus Ketiga'],
  [111, 'Seratus Kesebelas'],
  [112, 'Seratus Kedua Belas'],
  [113, 'Seratus Ketiga Belas'],
  [123, 'Seratus Dua Puluh Ketiga'],

  // Complex numbers
  [1001, 'Seribu Kesatu'],
  [1111, 'Seribu Seratus Kesebelas'],
  [1234, 'Seribu Dua Ratus Tiga Puluh Keempat'],
  [12345, 'Dua Belas Ribu Tiga Ratus Empat Puluh Kelima'],
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

// Powers of Ten Tests
const testPowersOfTen: [number, string][] = [
  [10, 'Sepuluh'],
  [100, 'Seratus'],
  [1000, 'Seribu'],
  [10000, 'Sepuluh Ribu'],
  [100000, 'Seratus Ribu'],
  [1000000, 'Satu Juta'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Sifar'],
  [1n, 'Satu'],
  [100n, 'Seratus'],
  [1000n, 'Seribu'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Satu'],
  [-100n, 'Minus Seratus'],
  [-1000n, 'Minus Seribu'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Sifar'],
  ['1', 'Satu'],
  ['100', 'Seratus'],
  ['-100', 'Minus Seratus'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  const testZeroVariants: [number | bigint | string, string][] = [
    [0, 'Sifar'],
    [-0, 'Sifar'],
    [0.0, 'Sifar'],
    [0n, 'Sifar'],
    ['0', 'Sifar'],
  ];

  test.concurrent.each(testZeroVariants)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });

  test('zero with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Sifar Ringgit Sahaja');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(NaN)).toThrow('Invalid Number "NaN"');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

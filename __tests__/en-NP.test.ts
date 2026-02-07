import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enNp from '../src/locales/en-NP.js';
import { ToWords as LocaleToWords } from '../src/locales/en-NP.js';

const localeCode = 'en-NP';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enNp);
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
  [0, 'Zero'],
  [137, 'One Hundred Thirty Seven'],
  [700, 'Seven Hundred'],
  [1100, 'One Thousand One Hundred'],
  [4680, 'Four Thousand Six Hundred Eighty'],
  [63892, 'Sixty Three Thousand Eight Hundred Ninety Two'],
  [86100, 'Eighty Six Thousand One Hundred'],
  [792581, 'Seven Lakh Ninety Two Thousand Five Hundred Eighty One'],
  [2741034, 'Twenty Seven Lakh Forty One Thousand Thirty Four'],
  [86429753, 'Eight Crore Sixty Four Lakh Twenty Nine Thousand Seven Hundred Fifty Three'],
  [975310864, 'Ninety Seven Crore Fifty Three Lakh Ten Thousand Eight Hundred Sixty Four'],
  [9876543210, 'Nine Arab Eighty Seven Crore Sixty Five Lakh Forty Three Thousand Two Hundred Ten'],
  [98765432101, 'Ninety Eight Arab Seventy Six Crore Fifty Four Lakh Thirty Two Thousand One Hundred One'],
  [9_87_65_43_21_012, 'Nine Kharab Eighty Seven Arab Sixty Five Crore Forty Three Lakh Twenty One Thousand Twelve'],
  [
    98_76_54_32_10_123,
    'Ninety Eight Kharab Seventy Six Arab Fifty Four Crore Thirty Two Lakh Ten Thousand One Hundred Twenty Three',
  ],
  [
    9_87_65_43_21_01_234,
    'Nine Neel Eighty Seven Kharab Sixty Five Arab Forty Three Crore Twenty One Lakh One Thousand Two Hundred Thirty Four',
  ],
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
    row[1] = `${row[1]} Rupees Only`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Rupees`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Rupees Only`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Rupees Only`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Rupees Only`;
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

const testFloats = [
  [0.0, 'Zero'],
  [0.04, 'Zero Point Zero Four'],
  [0.0468, 'Zero Point Zero Four Six Eight'],
  [0.4, 'Zero Point Four'],
  [0.63, 'Zero Point Sixty Three'],
  [0.973, 'Zero Point Nine Hundred Seventy Three'],
  [0.999, 'Zero Point Nine Hundred Ninety Nine'],
  [37.06, 'Thirty Seven Point Zero Six'],
  [37.068, 'Thirty Seven Point Zero Six Eight'],
  [37.68, 'Thirty Seven Point Sixty Eight'],
  [37.683, 'Thirty Seven Point Six Hundred Eighty Three'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Rupees Only`],
  [0.04, `Zero Rupees And Four Paisa Only`],
  [0.0468, `Zero Rupees And Five Paisa Only`],
  [0.4, `Zero Rupees And Forty Paisa Only`],
  [0.63, `Zero Rupees And Sixty Three Paisa Only`],
  [0.973, `Zero Rupees And Ninety Seven Paisa Only`],
  [0.999, `One Rupee Only`],
  [37.06, `Thirty Seven Rupees And Six Paisa Only`],
  [37.068, `Thirty Seven Rupees And Seven Paisa Only`],
  [37.68, `Thirty Seven Rupees And Sixty Eight Paisa Only`],
  [37.683, `Thirty Seven Rupees And Sixty Eight Paisa Only`],
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
      row[1] = (row[1] as string).replace(`Zero Rupees And `, '');
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
      row[1] = `Zero Rupees Only`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Paisa`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Paisa`), '');
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
  [1, 'First'],
  [2, 'Second'],
  [3, 'Third'],
  [4, 'Fourth'],
  [5, 'Fifth'],
  [6, 'Sixth'],
  [7, 'Seventh'],
  [8, 'Eighth'],
  [9, 'Ninth'],
  [10, 'Tenth'],
  [11, 'Eleventh'],
  [12, 'Twelfth'],
  [13, 'Thirteenth'],
  [14, 'Fourteenth'],
  [15, 'Fifteenth'],
  [16, 'Sixteenth'],
  [17, 'Seventeenth'],
  [18, 'Eighteenth'],
  [19, 'Nineteenth'],
  [20, 'Twentieth'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'Twenty First'],
  [22, 'Twenty Second'],
  [23, 'Twenty Third'],
  [30, 'Thirtieth'],
  [40, 'Fortieth'],
  [50, 'Fiftieth'],
  [60, 'Sixtieth'],
  [70, 'Seventieth'],
  [80, 'Eightieth'],
  [90, 'Ninetieth'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Thirty First'],
  [32, 'Thirty Second'],
  [33, 'Thirty Third'],
  [41, 'Forty First'],
  [42, 'Forty Second'],
  [43, 'Forty Third'],
  [51, 'Fifty First'],
  [52, 'Fifty Second'],
  [53, 'Fifty Third'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'One Hundredth'],
  [200, 'Two Hundredth'],
  [1000, 'One Thousandth'],
  [10000, 'Ten Thousandth'],
  [100000, 'One Lakh'],
  [1000000, 'Ten Lakh'],
  [10000000, 'One Crore'],

  // Numbers in the hundreds with endings
  [101, 'One Hundred First'],
  [102, 'One Hundred Second'],
  [103, 'One Hundred Third'],
  [111, 'One Hundred Eleventh'],
  [112, 'One Hundred Twelfth'],
  [113, 'One Hundred Thirteenth'],
  [123, 'One Hundred Twenty Third'],

  // Complex numbers
  [1001, 'One Thousand First'],
  [1111, 'One Thousand One Hundred Eleventh'],
  [1234, 'One Thousand Two Hundred Thirty Fourth'],
  [12345, 'Twelve Thousand Three Hundred Forty Fifth'],
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
  [10, 'Ten'],
  [100, 'One Hundred'],
  [1000, 'One Thousand'],
  [10000, 'Ten Thousand'],
  [100000, 'One Lakh'],
  [1000000, 'Ten Lakh'],
  [10000000, 'One Crore'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'One'],
  [100n, 'One Hundred'],
  [1000n, 'One Thousand'],
  [100000n, 'One Lakh'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus One'],
  [-100n, 'Minus One Hundred'],
  [-1000n, 'Minus One Thousand'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'One'],
  ['100', 'One Hundred'],
  ['-100', 'Minus One Hundred'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Zero', () => {
    expect(toWords.convert(0)).toBe('Zero');
  });

  test('convert -0 => Zero', () => {
    expect(toWords.convert(-0)).toBe('Zero');
  });

  test('convert 0.0 => Zero', () => {
    expect(toWords.convert(0.0)).toBe('Zero');
  });

  test('convert 0n => Zero', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('convert "0" => Zero', () => {
    expect(toWords.convert('0')).toBe('Zero');
  });

  test('convert 0 with currency => Zero Rupees Only', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Rupees Only');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
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

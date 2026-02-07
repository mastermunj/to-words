import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enCa from '../src/locales/en-CA.js';
import { ToWords as LocaleToWords } from '../src/locales/en-CA.js';

const localeCode = 'en-CA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enCa);
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
  [1, 'One'],
  [2, 'Two'],
  [3, 'Three'],
  [4, 'Four'],
  [5, 'Five'],
  [6, 'Six'],
  [7, 'Seven'],
  [8, 'Eight'],
  [9, 'Nine'],
  [10, 'Ten'],
  [11, 'Eleven'],
  [12, 'Twelve'],
  [13, 'Thirteen'],
  [14, 'Fourteen'],
  [15, 'Fifteen'],
  [16, 'Sixteen'],
  [17, 'Seventeen'],
  [18, 'Eighteen'],
  [19, 'Nineteen'],
  [20, 'Twenty'],
  [30, 'Thirty'],
  [40, 'Forty'],
  [50, 'Fifty'],
  [60, 'Sixty'],
  [70, 'Seventy'],
  [80, 'Eighty'],
  [90, 'Ninety'],
  [100, 'One Hundred'],
  [137, 'One Hundred Thirty Seven'],
  [700, 'Seven Hundred'],
  [1100, 'One Thousand One Hundred'],
  [4680, 'Four Thousand Six Hundred Eighty'],
  [63892, 'Sixty Three Thousand Eight Hundred Ninety Two'],
  [86100, 'Eighty Six Thousand One Hundred'],
  [792581, 'Seven Hundred Ninety Two Thousand Five Hundred Eighty One'],
  [2741034, 'Two Million Seven Hundred Forty One Thousand Thirty Four'],
  [86429753, 'Eighty Six Million Four Hundred Twenty Nine Thousand Seven Hundred Fifty Three'],
  [975310864, 'Nine Hundred Seventy Five Million Three Hundred Ten Thousand Eight Hundred Sixty Four'],
  [9876543210, 'Nine Billion Eight Hundred Seventy Six Million Five Hundred Forty Three Thousand Two Hundred Ten'],
  [
    98765432101,
    'Ninety Eight Billion Seven Hundred Sixty Five Million Four Hundred Thirty Two Thousand One Hundred One',
  ],
  [
    987654321012,
    'Nine Hundred Eighty Seven Billion Six Hundred Fifty Four Million Three Hundred Twenty One Thousand Twelve',
  ],
  [
    9876543210123,
    'Nine Trillion Eight Hundred Seventy Six Billion Five Hundred Forty Three Million Two Hundred Ten Thousand One Hundred Twenty Three',
  ],
  [
    98765432101234,
    'Ninety Eight Trillion Seven Hundred Sixty Five Billion Four Hundred Thirty Two Million One Hundred One Thousand Two Hundred Thirty Four',
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
    if (row[0] === 1) {
      row[1] = `${row[1]} Canadian Dollar Only`;
    } else {
      row[1] = `${row[1]} Canadian Dollars Only`;
    }
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    if (row[0] === 1) {
      row[1] = `${row[1]} Canadian Dollar`;
    } else {
      row[1] = `${row[1]} Canadian Dollars`;
    }
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Canadian Dollars Only`;
      return;
    }
    row[0] = -row[0];
    if (row[0] === -1) {
      row[1] = `Minus ${row[1]} Canadian Dollar Only`;
    } else {
      row[1] = `Minus ${row[1]} Canadian Dollars Only`;
    }
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else if (row[0] === 1) {
      row[1] = `${row[1]} Canadian Dollar Only`;
    } else {
      row[1] = `${row[1]} Canadian Dollars Only`;
    }
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
  [0.0, `Zero Canadian Dollars Only`],
  [0.04, `Zero Canadian Dollars And Four Cents Only`],
  [0.0468, `Zero Canadian Dollars And Five Cents Only`],
  [0.4, `Zero Canadian Dollars And Forty Cents Only`],
  [0.63, `Zero Canadian Dollars And Sixty Three Cents Only`],
  [0.973, `Zero Canadian Dollars And Ninety Seven Cents Only`],
  [0.999, `One Canadian Dollar Only`],
  [37.06, `Thirty Seven Canadian Dollars And Six Cents Only`],
  [37.068, `Thirty Seven Canadian Dollars And Seven Cents Only`],
  [37.68, `Thirty Seven Canadian Dollars And Sixty Eight Cents Only`],
  [37.683, `Thirty Seven Canadian Dollars And Sixty Eight Cents Only`],
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
      row[1] = (row[1] as string).replace(`Zero Canadian Dollars And `, '');
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
      row[1] = `Zero Canadian Dollars Only`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
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
  [0, 'Zeroth'],
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
  [24, 'Twenty Fourth'],
  [25, 'Twenty Fifth'],
  [26, 'Twenty Sixth'],
  [27, 'Twenty Seventh'],
  [28, 'Twenty Eighth'],
  [29, 'Twenty Ninth'],
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
  [61, 'Sixty First'],
  [62, 'Sixty Second'],
  [63, 'Sixty Third'],
  [71, 'Seventy First'],
  [72, 'Seventy Second'],
  [73, 'Seventy Third'],
  [81, 'Eighty First'],
  [82, 'Eighty Second'],
  [83, 'Eighty Third'],
  [91, 'Ninety First'],
  [92, 'Ninety Second'],
  [93, 'Ninety Third'],
  [99, 'Ninety Ninth'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'One Hundredth'],
  [200, 'Two Hundredth'],
  [1000, 'One Thousandth'],
  [10000, 'Ten Thousandth'],
  [100000, 'One Hundred Thousandth'],
  [1000000, 'One Millionth'],
  [10000000, 'Ten Millionth'],
  [1000000000, 'One Billionth'],

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

describe('Test Error Handling', () => {
  test('should throw error for invalid number input', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow();
  });

  test('should handle maximum safe integer', () => {
    const result = toWords.convert(Number.MAX_SAFE_INTEGER);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

// Powers of Ten Tests
const testPowersOfTen: [number, string][] = [
  [10, 'Ten'],
  [100, 'One Hundred'],
  [1000, 'One Thousand'],
  [10000, 'Ten Thousand'],
  [100000, 'One Hundred Thousand'],
  [1000000, 'One Million'],
  [1000000000, 'One Billion'],
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
  [1000000n, 'One Million'],
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
  ['  100  ', 'One Hundred'],
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

  test('convert 0 with currency => Zero Canadian Dollars Only', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Canadian Dollars Only');
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

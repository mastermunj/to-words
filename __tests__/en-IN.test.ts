import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enIn from '../src/locales/en-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/en-IN.js';

const localeCode = 'en-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enIn);
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
  [987654321012, 'Nine Kharab Eighty Seven Arab Sixty Five Crore Forty Three Lakh Twenty One Thousand Twelve'],
  [
    9876543210123,
    'Ninety Eight Kharab Seventy Six Arab Fifty Four Crore Thirty Two Lakh Ten Thousand One Hundred Twenty Three',
  ],
  [
    98765432101234,
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
  [0.01, `Zero Rupees And One Paisa Only`],
  [0.04, `Zero Rupees And Four Paise Only`],
  [0.0468, `Zero Rupees And Five Paise Only`],
  [0.4, `Zero Rupees And Forty Paise Only`],
  [0.63, `Zero Rupees And Sixty Three Paise Only`],
  [0.973, `Zero Rupees And Ninety Seven Paise Only`],
  [0.999, `One Rupee Only`],
  [37.06, `Thirty Seven Rupees And Six Paise Only`],
  [37.068, `Thirty Seven Rupees And Seven Paise Only`],
  [37.68, `Thirty Seven Rupees And Sixty Eight Paise Only`],
  [37.683, `Thirty Seven Rupees And Sixty Eight Paise Only`],
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
      row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ (Paise|Paisa)`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ (Paise|Paisa)`), '');
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

// Comprehensive Ordinal Tests (Indian Numbering System - Lakhs, Crores)
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

  // Indian numbering system - Lakhs
  [100000, 'One Lakh'],
  [200000, 'Two Lakh'],
  [100001, 'One Lakh First'],
  [100002, 'One Lakh Second'],
  [100003, 'One Lakh Third'],
  [100011, 'One Lakh Eleventh'],
  [100021, 'One Lakh Twenty First'],
  [100100, 'One Lakh Hundredth'],

  // Indian numbering system - Ten Lakhs
  [1000000, 'Ten Lakh'],
  [1000001, 'Ten Lakh First'],

  // Indian numbering system - Crores
  [10000000, 'One Crore'],
  [10000001, 'One Crore First'],
  [100000000, 'Ten Crore'],

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
  [1234, 'One Thousand Two Hundred Thirty Fourth'],
];

describe('Test Ordinal Numbers (Indian Numbering System)', () => {
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

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR en-IN
// ============================================================

// Extended Integer Tests (1-100)
const testIntegersExtended: [number, string][] = [
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
  [21, 'Twenty One'],
  [22, 'Twenty Two'],
  [23, 'Twenty Three'],
  [24, 'Twenty Four'],
  [25, 'Twenty Five'],
  [30, 'Thirty'],
  [35, 'Thirty Five'],
  [40, 'Forty'],
  [45, 'Forty Five'],
  [50, 'Fifty'],
  [55, 'Fifty Five'],
  [60, 'Sixty'],
  [65, 'Sixty Five'],
  [70, 'Seventy'],
  [75, 'Seventy Five'],
  [80, 'Eighty'],
  [85, 'Eighty Five'],
  [90, 'Ninety'],
  [95, 'Ninety Five'],
  [99, 'Ninety Nine'],
  [100, 'One Hundred'],
];

describe('Test Extended Integers (1-100)', () => {
  test.concurrent.each(testIntegersExtended)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Powers of Ten and Boundaries
const testPowersOfTen: [number, string][] = [
  [10, 'Ten'],
  [100, 'One Hundred'],
  [1000, 'One Thousand'],
  [10000, 'Ten Thousand'],
  [100000, 'One Lakh'],
  [1000000, 'Ten Lakh'],
  [10000000, 'One Crore'],
  [100000000, 'Ten Crore'],
  [1000000000, 'One Arab'],
  [10000000000, 'Ten Arab'],
  [100000000000, 'One Kharab'],
  [1000000000000, 'Ten Kharab'],
];

describe('Test Powers of Ten (Indian System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'Ninety Nine'],
  [100, 'One Hundred'],
  [101, 'One Hundred One'],
  [999, 'Nine Hundred Ninety Nine'],
  [1000, 'One Thousand'],
  [1001, 'One Thousand One'],
  [9999, 'Nine Thousand Nine Hundred Ninety Nine'],
  [10000, 'Ten Thousand'],
  [10001, 'Ten Thousand One'],
  [99999, 'Ninety Nine Thousand Nine Hundred Ninety Nine'],
  [100000, 'One Lakh'],
  [100001, 'One Lakh One'],
  [999999, 'Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine'],
  [1000000, 'Ten Lakh'],
  [1000001, 'Ten Lakh One'],
  [9999999, 'Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine'],
  [10000000, 'One Crore'],
  [10000001, 'One Crore One'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Minus Zero Point Five'],
  [-0.25, 'Minus Zero Point Twenty Five'],
  [-0.99, 'Minus Zero Point Ninety Nine'],
  [-1.5, 'Minus One Point Five'],
  [-3.14, 'Minus Three Point Fourteen'],
  [-99.99, 'Minus Ninety Nine Point Ninety Nine'],
  [-100.01, 'Minus One Hundred Point Zero One'],
  [-1000.999, 'Minus One Thousand Point Nine Hundred Ninety Nine'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Minus Zero Rupees And Fifty Paise Only'],
  [-0.99, 'Minus Zero Rupees And Ninety Nine Paise Only'],
  [-1.5, 'Minus One Rupee And Fifty Paise Only'],
  [-1.01, 'Minus One Rupee And One Paisa Only'],
  [-100.5, 'Minus One Hundred Rupees And Fifty Paise Only'],
  [-1000.99, 'Minus One Thousand Rupees And Ninety Nine Paise Only'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'One'],
  [100n, 'One Hundred'],
  [1000n, 'One Thousand'],
  [100000n, 'One Lakh'],
  [10000000n, 'One Crore'],
  [1000000000n, 'One Arab'],
  [100000000000n, 'One Kharab'],
  [10000000000000n, 'One Neel'],
  [
    1234567890123n,
    'Twelve Kharab Thirty Four Arab Fifty Six Crore Seventy Eight Lakh Ninety Thousand One Hundred Twenty Three',
  ],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus One'],
  [-100n, 'Minus One Hundred'],
  [-1000n, 'Minus One Thousand'],
  [-100000n, 'Minus One Lakh'],
  [-10000000n, 'Minus One Crore'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Zero Rupees Only'],
  [1n, 'One Rupee Only'],
  [2n, 'Two Rupees Only'],
  [100n, 'One Hundred Rupees Only'],
  [1000n, 'One Thousand Rupees Only'],
  [100000n, 'One Lakh Rupees Only'],
  [10000000n, 'One Crore Rupees Only'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'One'],
  ['100', 'One Hundred'],
  ['1000', 'One Thousand'],
  ['-100', 'Minus One Hundred'],
  ['3.14', 'Three Point Fourteen'],
  ['-3.14', 'Minus Three Point Fourteen'],
  ['  100  ', 'One Hundred'],
  ['100000', 'One Lakh'],
  ['10000000', 'One Crore'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String with Currency
const testStringInputsWithCurrency: [string, string][] = [
  ['0', 'Zero Rupees Only'],
  ['1', 'One Rupee Only'],
  ['100', 'One Hundred Rupees Only'],
  ['100.50', 'One Hundred Rupees And Fifty Paise Only'],
  ['-100', 'Minus One Hundred Rupees Only'],
];

describe('Test String Number Inputs with Currency', () => {
  test.concurrent.each(testStringInputsWithCurrency)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// Special Decimal Cases
const testSpecialDecimals: [number, string][] = [
  [0.001, 'Zero Point Zero Zero One'],
  [0.0001, 'Zero Point Zero Zero Zero One'],
  [0.00001, 'Zero Point Zero Zero Zero Zero One'],
  [0.1, 'Zero Point One'],
  [0.01, 'Zero Point Zero One'],
  [1.1, 'One Point One'],
  [1.11, 'One Point Eleven'],
  [1.111, 'One Point One Hundred Eleven'],
  // Note: JS removes trailing zeros, so 10.10 becomes 10.1
  [10.1, 'Ten Point One'],
  [100.1, 'One Hundred Point One'],
  [10.01, 'Ten Point Zero One'],
  [100.01, 'One Hundred Point Zero One'],
];

describe('Test Special Decimal Cases', () => {
  test.concurrent.each(testSpecialDecimals)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Zero');
  });

  test('converts -0 as Zero', () => {
    expect(toWords.convert(-0)).toBe('Zero');
  });

  test('converts 0.0 as Zero', () => {
    expect(toWords.convert(0.0)).toBe('Zero');
  });

  test('converts 0n as Zero', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('converts "0" as Zero', () => {
    expect(toWords.convert('0')).toBe('Zero');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Rupees Only');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Singular/Plural Tests
describe('Test Currency Singular/Plural', () => {
  test('1 Rupee (singular)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('One Rupee Only');
  });

  test('2 Rupees (plural)', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Two Rupees Only');
  });

  test('0.01 Paisa (singular)', () => {
    expect(toWords.convert(0.01, { currency: true })).toBe('Zero Rupees And One Paisa Only');
  });

  test('0.02 Paise (plural)', () => {
    expect(toWords.convert(0.02, { currency: true })).toBe('Zero Rupees And Two Paise Only');
  });

  test('1.01 (singular + singular)', () => {
    expect(toWords.convert(1.01, { currency: true })).toBe('One Rupee And One Paisa Only');
  });

  test('2.02 (plural + plural)', () => {
    expect(toWords.convert(2.02, { currency: true })).toBe('Two Rupees And Two Paise Only');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('One Hundred Rupees And Fifty Paise Only');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe(
      'One Hundred Rupees And Fifty Paise',
    );
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('One Hundred Rupees Only');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe(
      'One Hundred Rupees',
    );
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for en-IN', () => {
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

  test('throws for multiple decimal points', () => {
    expect(() => toWords.convert('1.2.3')).toThrow(/Invalid Number/);
  });
});

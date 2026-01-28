import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enPk from '../src/locales/en-PK';

const localeCode = 'en-PK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enPk);
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
  [9876543210, 'Nine Hundred Eighty Seven Crore Sixty Five Lakh Forty Three Thousand Two Hundred Ten'],
  [98765432101, 'Nine Thousand Eight Hundred Seventy Six Crore Fifty Four Lakh Thirty Two Thousand One Hundred One'],
  [987654321012, 'Ninety Eight Thousand Seven Hundred Sixty Five Crore Forty Three Lakh Twenty One Thousand Twelve'],
  [
    9876543210123,
    'Nine Lakh Eighty Seven Thousand Six Hundred Fifty Four Crore Thirty Two Lakh Ten Thousand One Hundred Twenty Three',
  ],
  [
    98765432101234,
    'Ninety Eight Lakh Seventy Six Thousand Five Hundred Forty Three Crore Twenty One Lakh One Thousand Two Hundred Thirty Four',
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

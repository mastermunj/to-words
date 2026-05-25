import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enOm from '../src/locales/en-OM.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/en-OM.js';

const localeCode = 'en-OM';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enOm);
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
  [0, 'Zero'],
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
    row[1] = `${row[1]} Omani Rials Only`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Omani Rials`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Omani Rials Only`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Omani Rials Only`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Omani Rials Only`;
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

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `One Hundred Twenty Three Omani Rials Only`],
    ['123', `One Hundred Twenty Three Omani Rials Only`],
    ['123.0', `One Hundred Twenty Three Omani Rials And Zero Baisa Only`],
    ['123.00', `One Hundred Twenty Three Omani Rials And Zero Baisa Only`],
    ['0.00', `Zero Omani Rials And Zero Baisa Only`],
    ['-123.00', `Minus One Hundred Twenty Three Omani Rials And Zero Baisa Only`],
    ['37.68', `Thirty Seven Omani Rials And Six Hundred Eighty Baisa Only`],
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
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Omani Rials Only`],
  [0.04, `Zero Omani Rials And Forty Baisa Only`],
  [0.0468, `Zero Omani Rials And Forty Seven Baisa Only`],
  [0.4, `Zero Omani Rials And Four Hundred Baisa Only`],
  [0.63, `Zero Omani Rials And Six Hundred Thirty Baisa Only`],
  [0.973, `Zero Omani Rials And Nine Hundred Seventy Three Baisa Only`],
  [0.999, `Zero Omani Rials And Nine Hundred Ninety Nine Baisa Only`],
  [37.06, `Thirty Seven Omani Rials And Sixty Baisa Only`],
  [37.068, `Thirty Seven Omani Rials And Sixty Eight Baisa Only`],
  [37.68, `Thirty Seven Omani Rials And Six Hundred Eighty Baisa Only`],
  [37.683, `Thirty Seven Omani Rials And Six Hundred Eighty Three Baisa Only`],
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
      row[1] = (row[1] as string).replace(`Zero Omani Rials And `, '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Baisa`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Baisa`), '');
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

describe('Test String inputs with 3-decimal precision { currency: true }', () => {
  const testStringWith3DecimalCurrency: [string, string][] = [
    ['500.500', `Five Hundred Omani Rials And Five Hundred Baisa Only`],
    ['2.010', `Two Omani Rials And Ten Baisa Only`],
    ['2.100', `Two Omani Rials And One Hundred Baisa Only`],
    ['0.001', `Zero Omani Rials And One Baisa Only`],
    ['-2.010', `Minus Two Omani Rials And Ten Baisa Only`],
    ['37.500', `Thirty Seven Omani Rials And Five Hundred Baisa Only`],
  ];

  test.concurrent.each(testStringWith3DecimalCurrency)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

describe('Test number inputs with 1 and 2-digit fractional parts scaled to 3-decimal { currency: true }', () => {
  const testScaledFractional: [number, string][] = [
    [0.1, `Zero Omani Rials And One Hundred Baisa Only`],
    [0.5, `Zero Omani Rials And Five Hundred Baisa Only`],
    [0.05, `Zero Omani Rials And Fifty Baisa Only`],
    [0.001, `Zero Omani Rials And One Baisa Only`],
    [1.1, `One Omani Rial And One Hundred Baisa Only`],
    [1.05, `One Omani Rial And Fifty Baisa Only`],
    [5.5, `Five Omani Rials And Five Hundred Baisa Only`],
    [999.999, `Nine Hundred Ninety Nine Omani Rials And Nine Hundred Ninety Nine Baisa Only`],
    [1000.5, `One Thousand Omani Rials And Five Hundred Baisa Only`],
  ];

  test.concurrent.each(testScaledFractional)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test 3-decimal precision rounding for 4+ decimal inputs { currency: true }', () => {
  const testRounding: [number, string][] = [
    // 4th decimal < 5 rounds down to zero fractional → integer result
    [0.0001, `Zero Omani Rials Only`],
    // 4th decimal < 5 keeps 3rd decimal as-is
    [1.9994, `One Omani Rial And Nine Hundred Ninety Nine Baisa Only`],
  ];

  test.concurrent.each(testRounding)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test negative float inputs with 3-decimal precision { currency: true }', () => {
  const testNegativeFloats: [number | string, string][] = [
    [-0.5, `Minus Zero Omani Rials And Five Hundred Baisa Only`],
    [-0.001, `Minus Zero Omani Rials And One Baisa Only`],
    [-37.001, `Minus Thirty Seven Omani Rials And One Baisa Only`],
    [-100.5, `Minus One Hundred Omani Rials And Five Hundred Baisa Only`],
    ['-0.500', `Minus Zero Omani Rials And Five Hundred Baisa Only`],
    ['-37.010', `Minus Thirty Seven Omani Rials And Ten Baisa Only`],
    ['-999.999', `Minus Nine Hundred Ninety Nine Omani Rials And Nine Hundred Ninety Nine Baisa Only`],
  ];

  test.concurrent.each(testNegativeFloats)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

describe('Test { currency: true, includeZeroFractional: true } with 3-digit zero fractional strings', () => {
  const testZeroFractional3Decimal: [string, string][] = [
    ['1.000', `One Omani Rial And Zero Baisa Only`],
    ['100.000', `One Hundred Omani Rials And Zero Baisa Only`],
    ['0.000', `Zero Omani Rials And Zero Baisa Only`],
  ];

  test.concurrent.each(testZeroFractional3Decimal)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true, includeZeroFractional: true })).toBe(expected);
  });
});

describe('Test { currency: true, ignoreZeroCurrency: true } with 3-decimal amounts', () => {
  const testIgnoreZeroCurrency3Decimal: [number | string, string][] = [
    [0.001, `One Baisa Only`],
    [0.5, `Five Hundred Baisa Only`],
    ['0.010', `Ten Baisa Only`],
    ['0.500', `Five Hundred Baisa Only`],
    [0.0, ``],
    [1.5, `One Omani Rial And Five Hundred Baisa Only`],
  ];

  test.concurrent.each(testIgnoreZeroCurrency3Decimal)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test { currency: true, doNotAddOnly: true } with 3-decimal amounts', () => {
  const testDoNotAddOnly3Decimal: [number | string, string][] = [
    [2.5, `Two Omani Rials And Five Hundred Baisa`],
    [0.001, `Zero Omani Rials And One Baisa`],
    ['37.500', `Thirty Seven Omani Rials And Five Hundred Baisa`],
    [100, `One Hundred Omani Rials`],
  ];

  test.concurrent.each(testDoNotAddOnly3Decimal)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test custom currencyOptions override with precision: 3 { currency: true }', () => {
  const kwdOptions = {
    currency: true as const,
    currencyOptions: {
      name: 'Kuwaiti Dinar',
      plural: 'Kuwaiti Dinars',
      singular: 'Kuwaiti Dinar',
      symbol: 'KWD',
      precision: 3,
      fractionalUnit: {
        name: 'Fils',
        plural: 'Fils',
        singular: 'Fils',
        symbol: '',
      },
    },
  };

  const testCustomPrecision3: [number | string, string][] = [
    [1.5, `One Kuwaiti Dinar And Five Hundred Fils Only`],
    [0.001, `Zero Kuwaiti Dinars And One Fils Only`],
    ['2.500', `Two Kuwaiti Dinars And Five Hundred Fils Only`],
    ['0.100', `Zero Kuwaiti Dinars And One Hundred Fils Only`],
    [-1.001, `Minus One Kuwaiti Dinar And One Fils Only`],
  ];

  test.concurrent.each(testCustomPrecision3)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input, kwdOptions)).toBe(expected);
  });
});

describe('Test currencyOptions override with precision: 2 overrides locale precision: 3 { currency: true }', () => {
  const twoPrecisionOverride = {
    currency: true as const,
    currencyOptions: {
      name: 'Omani Rial',
      plural: 'Omani Rials',
      singular: 'Omani Rial',
      symbol: 'OMR',
      precision: 2,
      fractionalUnit: {
        name: 'Baisa',
        plural: 'Baisa',
        singular: 'Baisa',
        symbol: '',
      },
    },
  };

  const testPrecision2Override: [number, string][] = [
    [0.04, `Zero Omani Rials And Four Baisa Only`],
    [0.4, `Zero Omani Rials And Forty Baisa Only`],
    [37.68, `Thirty Seven Omani Rials And Sixty Eight Baisa Only`],
  ];

  test.concurrent.each(testPrecision2Override)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, twoPrecisionOverride)).toBe(expected);
  });
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
  [100000, 'One Hundred Thousandth'],
  [1000000, 'One Millionth'],
  [10000000, 'Ten Millionth'],

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
  [100000, 'One Hundred Thousand'],
  [1000000, 'One Million'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'One'],
  [100n, 'One Hundred'],
  [1000n, 'One Thousand'],
];

describe('Test BigInt', () => {
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

describe('Test Negative BigInt', () => {
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
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
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

  test('convert 0 with currency => Zero Omani Rials Only', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Omani Rials Only');
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

const testFractionStyleEnOM: [number, string][] = [
  [1.1, 'One And One Tenth'],
  [2.5, 'Two And Five Tenths'],
  [1.01, 'One And One Hundredth'],
  [1.45, 'One And Forty Five Hundredths'],
  [0.05, 'Zero And Five Hundredths'],
  [1.001, 'One And One Thousandth'],
  [1.005, 'One And Five Thousandths'],
  [1.0001, 'One And One Ten-Thousandth'],
  [1.0005, 'One And Five Ten-Thousandths'],
  [1.00001, 'One And One Hundred-Thousandth'],
  [1.00005, 'One And Five Hundred-Thousandths'],
  [1.000001, 'One And One Millionth'],
  [1.000005, 'One And Five Millionths'],
  [123.45, 'One Hundred Twenty Three And Forty Five Hundredths'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleEnOM)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'One Point One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'One Point One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('One Point Five');
    expect(toWords.convert(0.05)).toBe('Zero Point Zero Five');
  });
});

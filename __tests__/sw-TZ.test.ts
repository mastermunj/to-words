import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import swTz from '../src/locales/sw-TZ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/sw-TZ.js';

const localeCode = 'sw-TZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(swTz);
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
  [0, 'Sifuri'],
  [137, 'Mia Moja Na Thelathini Na Saba'],
  [700, 'Mia Saba'],
  [1100, 'Elfu Moja Na Mia Moja'],
  [4680, 'Elfu Nne Na Mia Sita Na Themanini'],
  [63892, 'Elfu Sitini Na Tatu Na Mia Nane Na Tisini Na Mbili'],
  [86100, 'Elfu Themanini Na Sita Na Mia Moja'],
  [792581, 'Elfu Mia Saba Na Tisini Na Mbili Na Mia Tano Na Themanini Na Moja'],
  [2741034, 'Milioni Mbili Na Elfu Mia Saba Na Arobaini Na Moja Na Thelathini Na Nne'],
  [86429753, 'Milioni Themanini Na Sita Na Elfu Mia Nne Na Ishirini Na Tisa Na Mia Saba Na Hamsini Na Tatu'],
  [975310864, 'Milioni Mia Tisa Na Sabini Na Tano Na Elfu Mia Tatu Na Kumi Na Mia Nane Na Sitini Na Nne'],
  [
    9876543210,
    'Bilioni Tisa Na Milioni Mia Nane Na Sabini Na Sita Na Elfu Mia Tano Na Arobaini Na Tatu Na Mia Mbili Na Kumi',
  ],
  [
    98765432101,
    'Bilioni Tisini Na Nane Na Milioni Mia Saba Na Sitini Na Tano Na Elfu Mia Nne Na Thelathini Na Mbili Na Mia Moja Na Moja',
  ],
  [
    987654321012,
    'Bilioni Mia Tisa Na Themanini Na Saba Na Milioni Mia Sita Na Hamsini Na Nne Na Elfu Mia Tatu Na Ishirini Na Moja Na Kumi Na Mbili',
  ],
  [
    9876543210123,
    'Trilioni Tisa Na Bilioni Mia Nane Na Sabini Na Sita Na Milioni Mia Tano Na Arobaini Na Tatu Na Elfu Mia Mbili Na Kumi Na Mia Moja Na Ishirini Na Tatu',
  ],
  [
    98765432101234,
    'Trilioni Tisini Na Nane Na Bilioni Mia Saba Na Sitini Na Tano Na Milioni Mia Nne Na Thelathini Na Mbili Na Elfu Mia Moja Na Moja Na Mia Mbili Na Thelathini Na Nne',
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
    row[1] = `Hasi ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `Shilingi ${row[1]} Tu`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `Shilingi ${row[1]}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `Shilingi ${row[1]} Tu`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Hasi Shilingi ${row[1]} Tu`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `Shilingi ${row[1]} Tu`;
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
  [0.0, 'Sifuri'],
  [0.04, 'Sifuri Nukta Sifuri Nne'],
  [0.0468, 'Sifuri Nukta Sifuri Nne Sita Nane'],
  [0.4, 'Sifuri Nukta Nne'],
  [0.63, 'Sifuri Nukta Sitini Na Tatu'],
  [0.973, 'Sifuri Nukta Mia Tisa Na Sabini Na Tatu'],
  [0.999, 'Sifuri Nukta Mia Tisa Na Tisini Na Tisa'],
  [37.06, 'Thelathini Na Saba Nukta Sifuri Sita'],
  [37.068, 'Thelathini Na Saba Nukta Sifuri Sita Nane'],
  [37.68, 'Thelathini Na Saba Nukta Sitini Na Nane'],
  [37.683, 'Thelathini Na Saba Nukta Mia Sita Na Themanini Na Tatu'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Shilingi Mia Moja Na Ishirini Na Tatu Tu`],
    ['123', `Shilingi Mia Moja Na Ishirini Na Tatu Tu`],
    ['123.0', `Shilingi Mia Moja Na Ishirini Na Tatu Na Senti Sifuri Tu`],
    ['123.00', `Shilingi Mia Moja Na Ishirini Na Tatu Na Senti Sifuri Tu`],
    ['0.00', `Shilingi Sifuri Na Senti Sifuri Tu`],
    ['-123.00', `Hasi Shilingi Mia Moja Na Ishirini Na Tatu Na Senti Sifuri Tu`],
    ['37.68', `Shilingi Thelathini Na Saba Na Senti Sitini Na Nane Tu`],
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
  [0.0, `Shilingi Sifuri Tu`],
  [0.04, `Shilingi Sifuri Na Senti Nne Tu`],
  [0.0468, `Shilingi Sifuri Na Senti Tano Tu`],
  [0.4, `Shilingi Sifuri Na Senti Arobaini Tu`],
  [0.63, `Shilingi Sifuri Na Senti Sitini Na Tatu Tu`],
  [0.973, `Shilingi Sifuri Na Senti Tisini Na Saba Tu`],
  [0.999, `Shilingi Moja Tu`],
  [37.06, `Shilingi Thelathini Na Saba Na Senti Sita Tu`],
  [37.068, `Shilingi Thelathini Na Saba Na Senti Saba Tu`],
  [37.68, `Shilingi Thelathini Na Saba Na Senti Sitini Na Nane Tu`],
  [37.683, `Shilingi Thelathini Na Saba Na Senti Sitini Na Nane Tu`],
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
      row[1] = (row[1] as string).replace(`Shilingi Sifuri Na `, '');
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
      row[1] = `Shilingi Sifuri Tu`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Na Senti [\\w ]+?(?= Tu$)`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Na Senti [\\w ]+?(?= Tu$)`), '');
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

const testFloatsWithDollarCurrency = [
  [0.0, `Dola Sifuri Tu`],
  [0.04, `Dola Sifuri Na Senti Nne Tu`],
  [0.0468, `Dola Sifuri Na Senti Tano Tu`],
  [0.4, `Dola Sifuri Na Senti Arobaini Tu`],
  [0.63, `Dola Sifuri Na Senti Sitini Na Tatu Tu`],
  [0.973, `Dola Sifuri Na Senti Tisini Na Saba Tu`],
  [0.999, `Dola Moja Tu`],
  [37.06, `Dola Thelathini Na Saba Na Senti Sita Tu`],
  [37.068, `Dola Thelathini Na Saba Na Senti Saba Tu`],
  [37.68, `Dola Thelathini Na Saba Na Senti Sitini Na Nane Tu`],
  [37.683, `Dola Thelathini Na Saba Na Senti Sitini Na Nane Tu`],
];

const dollarCurrencyOptions = {
  name: 'Dola',
  plural: 'Dola',
  singular: 'Dola',
  symbol: '$',
  fractionalUnit: {
    name: 'Senti',
    plural: 'Senti',
    singular: 'Senti',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithDollarCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: dollarCurrencyOptions })).toBe(expected);
  });
});

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-20 (special ordinal forms)
  [1, 'Wa Kwanza'],
  [2, 'Wa Pili'],
  [3, 'Wa Tatu'],
  [4, 'Wa Nne'],
  [5, 'Wa Tano'],
  [6, 'Wa Sita'],
  [7, 'Wa Saba'],
  [8, 'Wa Nane'],
  [9, 'Wa Tisa'],
  [10, 'Wa Kumi'],
  [11, 'Wa Kumi Na Moja'],
  [12, 'Wa Kumi Na Mbili'],
  [13, 'Wa Kumi Na Tatu'],
  [14, 'Wa Kumi Na Nne'],
  [15, 'Wa Kumi Na Tano'],
  [16, 'Wa Kumi Na Sita'],
  [17, 'Wa Kumi Na Saba'],
  [18, 'Wa Kumi Na Nane'],
  [19, 'Wa Kumi Na Tisa'],
  [20, 'Wa Ishirini'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'Wa Ishirini Na Moja'],
  [22, 'Wa Ishirini Na Mbili'],
  [23, 'Wa Ishirini Na Tatu'],
  [30, 'Wa Thelathini'],
  [40, 'Wa Arobaini'],
  [50, 'Wa Hamsini'],
  [60, 'Wa Sitini'],
  [70, 'Wa Sabini'],
  [80, 'Wa Themanini'],
  [90, 'Wa Tisini'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Wa Thelathini Na Moja'],
  [32, 'Wa Thelathini Na Mbili'],
  [33, 'Wa Thelathini Na Tatu'],
  [41, 'Wa Arobaini Na Moja'],
  [42, 'Wa Arobaini Na Mbili'],
  [43, 'Wa Arobaini Na Tatu'],
  [51, 'Wa Hamsini Na Moja'],
  [52, 'Wa Hamsini Na Mbili'],
  [53, 'Wa Hamsini Na Tatu'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Wa Mia Moja'],
  [200, 'Wa Mia Mbili'],
  [1000, 'Wa Elfu Moja'],
  [10000, 'Wa Elfu Kumi'],
  [100000, 'Wa Elfu Mia Moja'],
  [1000000, 'Wa Milioni Moja'],
  [10000000, 'Wa Milioni Kumi'],

  // Numbers in the hundreds with endings
  [101, 'Wa Mia Moja Na Moja'],
  [102, 'Wa Mia Moja Na Mbili'],
  [103, 'Wa Mia Moja Na Tatu'],
  [111, 'Wa Mia Moja Na Kumi Na Moja'],
  [112, 'Wa Mia Moja Na Kumi Na Mbili'],
  [113, 'Wa Mia Moja Na Kumi Na Tatu'],
  [123, 'Wa Mia Moja Na Ishirini Na Tatu'],

  // Complex numbers
  [1001, 'Wa Elfu Moja Na Moja'],
  [1111, 'Wa Elfu Moja Na Mia Moja Na Kumi Na Moja'],
  [1234, 'Wa Elfu Moja Na Mia Mbili Na Thelathini Na Nne'],
  [12345, 'Wa Elfu Kumi Na Mbili Na Mia Tatu Na Arobaini Na Tano'],
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
  [10, 'Kumi'],
  [100, 'Mia Moja'],
  [1000, 'Elfu Moja'],
  [10000, 'Elfu Kumi'],
  [100000, 'Elfu Mia Moja'],
  [1000000, 'Milioni Moja'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Sifuri'],
  [1n, 'Moja'],
  [100n, 'Mia Moja'],
  [1000n, 'Elfu Moja'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Hasi Moja'],
  [-100n, 'Hasi Mia Moja'],
  [-1000n, 'Hasi Elfu Moja'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Sifuri'],
  ['1', 'Moja'],
  ['100', 'Mia Moja'],
  ['-100', 'Hasi Mia Moja'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Sifuri', () => {
    expect(toWords.convert(0)).toBe('Sifuri');
  });

  test('convert -0 => Sifuri', () => {
    expect(toWords.convert(-0)).toBe('Sifuri');
  });

  test('convert 0.0 => Sifuri', () => {
    expect(toWords.convert(0.0)).toBe('Sifuri');
  });

  test('convert 0n => Sifuri', () => {
    expect(toWords.convert(0n)).toBe('Sifuri');
  });

  test('convert "0" => Sifuri', () => {
    expect(toWords.convert('0')).toBe('Sifuri');
  });

  test('convert 0 with currency => Sifuri Shilingi Tu', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Shilingi Sifuri Tu');
  });
});

// Invalid Input Tests
const testInvalidInputs: [unknown, string][] = [
  [Number.NaN, 'Invalid Number "NaN"'],
  [Infinity, 'Invalid Number "Infinity"'],
  [-Infinity, 'Invalid Number "-Infinity"'],
  ['', 'Invalid Number ""'],
  ['abc', 'Invalid Number "abc"'],
];

describe('Test Invalid Inputs', () => {
  test.concurrent.each(testInvalidInputs)('convert %s throws error', (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
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

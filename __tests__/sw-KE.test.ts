import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import swKe from '../src/locales/sw-KE';

const localeCode = 'sw-KE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(swKe);
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
  [0, 'Sifuri'],
  [137, 'Moja Mia Thelathini Saba'],
  [700, 'Saba Mia'],
  [1100, 'Moja Elfu Mia Moja'],
  [4680, 'Nne Elfu Sita Mia Themanini'],
  [63892, 'Sitini Tatu Elfu Nane Mia Tisini Mbili'],
  [86100, 'Themanini Sita Elfu Mia Moja'],
  [792581, 'Saba Mia Tisini Mbili Elfu Tano Mia Themanini Moja'],
  [2741034, 'Mbili Milioni Saba Mia Arobaini Moja Elfu Thelathini Nne'],
  [86429753, 'Themanini Sita Milioni Nne Mia Ishirini Tisa Elfu Saba Mia Hamsini Tatu'],
  [975310864, 'Tisa Mia Sabini Tano Milioni Tatu Mia Kumi Elfu Nane Mia Sitini Nne'],
  [9876543210, 'Tisa Bilioni Nane Mia Sabini Sita Milioni Tano Mia Arobaini Tatu Elfu Mbili Mia Kumi'],
  [98765432101, 'Tisini Nane Bilioni Saba Mia Sitini Tano Milioni Nne Mia Thelathini Mbili Elfu Moja Mia Moja'],
  [
    987654321012,
    'Tisa Mia Themanini Saba Bilioni Sita Mia Hamsini Nne Milioni Tatu Mia Ishirini Moja Elfu Kumi Na Mbili',
  ],
  [
    9876543210123,
    'Tisa Trilioni Nane Mia Sabini Sita Bilioni Tano Mia Arobaini Tatu Milioni Mbili Mia Kumi Elfu Moja Mia Ishirini Tatu',
  ],
  [
    98765432101234,
    'Tisini Nane Trilioni Saba Mia Sitini Tano Bilioni Nne Mia Thelathini Mbili Milioni Moja Mia Moja Elfu Mbili Mia Thelathini Nne',
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
    row[1] = `${row[1]} Shilingi Tu`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Shilingi`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Shilingi Tu`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Hasi ${row[1]} Shilingi Tu`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Shilingi Tu`;
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
  [0.0, 'Sifuri'],
  [0.04, 'Sifuri Nukta Sifuri Nne'],
  [0.0468, 'Sifuri Nukta Sifuri Nne Sita Nane'],
  [0.4, 'Sifuri Nukta Nne'],
  [0.63, 'Sifuri Nukta Sitini Tatu'],
  [0.973, 'Sifuri Nukta Tisa Mia Sabini Tatu'],
  [0.999, 'Sifuri Nukta Tisa Mia Tisini Tisa'],
  [37.06, 'Thelathini Saba Nukta Sifuri Sita'],
  [37.068, 'Thelathini Saba Nukta Sifuri Sita Nane'],
  [37.68, 'Thelathini Saba Nukta Sitini Nane'],
  [37.683, 'Thelathini Saba Nukta Sita Mia Themanini Tatu'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Sifuri Shilingi Tu`],
  [0.04, `Sifuri Shilingi Na Nne Senti Tu`],
  [0.0468, `Sifuri Shilingi Na Tano Senti Tu`],
  [0.4, `Sifuri Shilingi Na Arobaini Senti Tu`],
  [0.63, `Sifuri Shilingi Na Sitini Tatu Senti Tu`],
  [0.973, `Sifuri Shilingi Na Tisini Saba Senti Tu`],
  [0.999, `Moja Shilingi Tu`],
  [37.06, `Thelathini Saba Shilingi Na Sita Senti Tu`],
  [37.068, `Thelathini Saba Shilingi Na Saba Senti Tu`],
  [37.68, `Thelathini Saba Shilingi Na Sitini Nane Senti Tu`],
  [37.683, `Thelathini Saba Shilingi Na Sitini Nane Senti Tu`],
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
      row[1] = (row[1] as string).replace(`Sifuri Shilingi Na `, '');
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
      row[1] = `Sifuri Shilingi Tu`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Na [\\w ]+ Senti`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Na [\\w ]+ Senti`), '');
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
  [0.0, `Sifuri Dola Tu`],
  [0.04, `Sifuri Dola Na Nne Senti Tu`],
  [0.0468, `Sifuri Dola Na Tano Senti Tu`],
  [0.4, `Sifuri Dola Na Arobaini Senti Tu`],
  [0.63, `Sifuri Dola Na Sitini Tatu Senti Tu`],
  [0.973, `Sifuri Dola Na Tisini Saba Senti Tu`],
  [0.999, `Moja Dola Tu`],
  [37.06, `Thelathini Saba Dola Na Sita Senti Tu`],
  [37.068, `Thelathini Saba Dola Na Saba Senti Tu`],
  [37.68, `Thelathini Saba Dola Na Sitini Nane Senti Tu`],
  [37.683, `Thelathini Saba Dola Na Sitini Nane Senti Tu`],
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
  [21, 'Ishirini Wa Kwanza'],
  [22, 'Ishirini Wa Pili'],
  [23, 'Ishirini Wa Tatu'],
  [30, 'Wa Thelathini'],
  [40, 'Wa Arobaini'],
  [50, 'Wa Hamsini'],
  [60, 'Wa Sitini'],
  [70, 'Wa Sabini'],
  [80, 'Wa Themanini'],
  [90, 'Wa Tisini'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Thelathini Wa Kwanza'],
  [32, 'Thelathini Wa Pili'],
  [33, 'Thelathini Wa Tatu'],
  [41, 'Arobaini Wa Kwanza'],
  [42, 'Arobaini Wa Pili'],
  [43, 'Arobaini Wa Tatu'],
  [51, 'Hamsini Wa Kwanza'],
  [52, 'Hamsini Wa Pili'],
  [53, 'Hamsini Wa Tatu'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Wa Mia Moja'],
  [200, 'Mbili Wa Mia'],
  [1000, 'Wa Elfu Moja'],
  [10000, 'Kumi Wa Elfu'],
  [100000, 'Mia Moja Wa Elfu'],
  [1000000, 'Wa Milioni Moja'],
  [10000000, 'Kumi Wa Milioni'],

  // Numbers in the hundreds with endings
  [101, 'Moja Mia Wa Kwanza'],
  [102, 'Moja Mia Wa Pili'],
  [103, 'Moja Mia Wa Tatu'],
  [111, 'Moja Mia Wa Kumi Na Moja'],
  [112, 'Moja Mia Wa Kumi Na Mbili'],
  [113, 'Moja Mia Wa Kumi Na Tatu'],
  [123, 'Moja Mia Ishirini Wa Tatu'],

  // Complex numbers
  [1001, 'Moja Elfu Wa Kwanza'],
  [1111, 'Moja Elfu Moja Mia Wa Kumi Na Moja'],
  [1234, 'Moja Elfu Mbili Mia Thelathini Wa Nne'],
  [12345, 'Kumi Na Mbili Elfu Tatu Mia Arobaini Wa Tano'],
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

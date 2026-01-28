import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import roRo from '../src/locales/ro-RO';

const localeCode = 'ro-RO';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(roRo);
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
  [137, 'O Sută Treizeci Șapte'],
  [700, 'Șapte Sute'],
  [1100, 'O Mie O Sută'],
  [4680, 'Patru Mii Șase Sute Optzeci'],
  [63892, 'Șaizeci Trei Mii Opt Sute Nouăzeci Două'],
  [86100, 'Optzeci Șase Mii O Sută'],
  [792581, 'Șapte Sute Nouăzeci Două Mii Cinci Sute Optzeci Unu'],
  [2741034, 'Două Milioane Șapte Sute Patruzeci Unu Mii Treizeci Patru'],
  [86429753, 'Optzeci Șase Milioane Patru Sute Douăzeci Nouă Mii Șapte Sute Cincizeci Trei'],
  [975310864, 'Nouă Sute Șaptezeci Cinci Milioane Trei Sute Zece Mii Opt Sute Șaizeci Patru'],
  [9876543210, 'Nouă Miliarde Opt Sute Șaptezeci Șase Milioane Cinci Sute Patruzeci Trei Mii Două Sute Zece'],
  [98765432101, 'Nouăzeci Opt Miliarde Șapte Sute Șaizeci Cinci Milioane Patru Sute Treizeci Două Mii O Sută Unu'],
  [
    987654321012,
    'Nouă Sute Optzeci Șapte Miliarde Șase Sute Cincizeci Patru Milioane Trei Sute Douăzeci Unu Mii Doisprezece',
  ],
  [
    9876543210123,
    'Nouă Trilion Opt Sute Șaptezeci Șase Miliarde Cinci Sute Patruzeci Trei Milioane Două Sute Zece Mii O Sută Douăzeci Trei',
  ],
  [
    98765432101234,
    'Nouăzeci Opt Trilion Șapte Sute Șaizeci Cinci Miliarde Patru Sute Treizeci Două Milioane O Sută Unu Mii Două Sute Treizeci Patru',
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
    row[1] = `${row[1]} Lei Exact`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Lei`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Lei Exact`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Lei Exact`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Lei Exact`;
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
  [0.04, 'Zero Virgulă Zero Patru'],
  [0.0468, 'Zero Virgulă Zero Patru Șase Opt'],
  [0.4, 'Zero Virgulă Patru'],
  [0.63, 'Zero Virgulă Șaizeci Trei'],
  [0.973, 'Zero Virgulă Nouă Sute Șaptezeci Trei'],
  [0.999, 'Zero Virgulă Nouă Sute Nouăzeci Nouă'],
  [37.06, 'Treizeci Șapte Virgulă Zero Șase'],
  [37.068, 'Treizeci Șapte Virgulă Zero Șase Opt'],
  [37.68, 'Treizeci Șapte Virgulă Șaizeci Opt'],
  [37.683, 'Treizeci Șapte Virgulă Șase Sute Optzeci Trei'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Lei Exact`],
  [0.04, `Zero Lei Și Patru Bani Exact`],
  [0.0468, `Zero Lei Și Cinci Bani Exact`],
  [0.4, `Zero Lei Și Patruzeci Bani Exact`],
  [0.63, `Zero Lei Și Șaizeci Trei Bani Exact`],
  [0.973, `Zero Lei Și Nouăzeci Șapte Bani Exact`],
  [0.999, `Unu Leu Exact`],
  [37.06, `Treizeci Șapte Lei Și Șase Bani Exact`],
  [37.068, `Treizeci Șapte Lei Și Șapte Bani Exact`],
  [37.68, `Treizeci Șapte Lei Și Șaizeci Opt Bani Exact`],
  [37.683, `Treizeci Șapte Lei Și Șaizeci Opt Bani Exact`],
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
      row[1] = (row[1] as string).replace(`Zero Lei Și `, '');
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
      row[1] = `Zero Lei Exact`;
    } else {
      row[1] = (row[1] as string).replace(/ Și .+ Bani/, '');
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
    row[1] = (row[1] as string).replace(/ Și .+ Bani/, '');
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

const testFloatsWithEuroCurrency = [
  [0.0, `Zero Euro Exact`],
  [0.04, `Zero Euro Și Patru Eurocenți Exact`],
  [0.0468, `Zero Euro Și Cinci Eurocenți Exact`],
  [0.4, `Zero Euro Și Patruzeci Eurocenți Exact`],
  [0.63, `Zero Euro Și Șaizeci Trei Eurocenți Exact`],
  [0.973, `Zero Euro Și Nouăzeci Șapte Eurocenți Exact`],
  [0.999, `Unu Euro Exact`],
  [37.06, `Treizeci Șapte Euro Și Șase Eurocenți Exact`],
  [37.068, `Treizeci Șapte Euro Și Șapte Eurocenți Exact`],
  [37.68, `Treizeci Șapte Euro Și Șaizeci Opt Eurocenți Exact`],
  [37.683, `Treizeci Șapte Euro Și Șaizeci Opt Eurocenți Exact`],
];

const euroCurrencyOptions = {
  name: 'Euro',
  plural: 'Euro',
  singular: 'Euro',
  symbol: '€',
  fractionalUnit: {
    name: 'Eurocent',
    plural: 'Eurocenți',
    singular: 'Eurocent',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithEuroCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: euroCurrencyOptions })).toBe(expected);
  });
});

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-20 (special ordinal forms)
  [1, 'Primul'],
  [2, 'Al Doilea'],
  [3, 'Al Treilea'],
  [4, 'Al Patrulea'],
  [5, 'Al Cincilea'],
  [6, 'Al Șaselea'],
  [7, 'Al Șaptelea'],
  [8, 'Al Optulea'],
  [9, 'Al Nouălea'],
  [10, 'Al Zecelea'],
  [11, 'Al Unsprezecelea'],
  [12, 'Al Doisprezecelea'],
  [13, 'Al Treisprezecelea'],
  [14, 'Al Paisprezecelea'],
  [15, 'Al Cincisprezecelea'],
  [16, 'Al Șaisprezecelea'],
  [17, 'Al Șaptesprezecelea'],
  [18, 'Al Optsprezecelea'],
  [19, 'Al Nouăsprezecelea'],
  [20, 'Al Douăzecilea'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'Douăzeci Primul'],
  [22, 'Douăzeci Al Doilea'],
  [23, 'Douăzeci Al Treilea'],
  [30, 'Al Treizecilea'],
  [40, 'Al Patruzecilea'],
  [50, 'Al Cincizecilea'],
  [60, 'Al Șaizecilea'],
  [70, 'Al Șaptezecilea'],
  [80, 'Al Optzecilea'],
  [90, 'Al Nouăzecilea'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Treizeci Primul'],
  [32, 'Treizeci Al Doilea'],
  [33, 'Treizeci Al Treilea'],
  [41, 'Patruzeci Primul'],
  [42, 'Patruzeci Al Doilea'],
  [43, 'Patruzeci Al Treilea'],
  [51, 'Cincizeci Primul'],
  [52, 'Cincizeci Al Doilea'],
  [53, 'Cincizeci Al Treilea'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Al O Sutălea'],
  [200, 'Al Două Sutelea'],
  [1000, 'Al O Miilea'],
  [10000, 'Zece Al Miilea'],
  [100000, 'O Sută Al Miilea'],
  [1000000, 'Al Un Milionulea'],
  [10000000, 'Zece Al Milionulea'],

  // Numbers in the hundreds with endings
  [101, 'O Sută Primul'],
  [102, 'O Sută Al Doilea'],
  [103, 'O Sută Al Treilea'],
  [111, 'O Sută Al Unsprezecelea'],
  [112, 'O Sută Al Doisprezecelea'],
  [113, 'O Sută Al Treisprezecelea'],
  [123, 'O Sută Douăzeci Al Treilea'],

  // Complex numbers
  [1001, 'O Mie Primul'],
  [1111, 'O Mie O Sută Al Unsprezecelea'],
  [1234, 'O Mie Două Sute Treizeci Al Patrulea'],
  [12345, 'Doisprezece Mii Trei Sute Patruzeci Al Cincilea'],
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

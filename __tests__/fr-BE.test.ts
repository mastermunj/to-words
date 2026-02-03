import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frBe from '../src/locales/fr-BE.js';
import { ToWords as LocaleToWords } from '../src/locales/fr-BE.js';

const localeCode = 'fr-BE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frBe);
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
  [0, 'Zéro'],
  [137, 'Cent Trente-Sept'],
  [700, 'Sept Cents'],
  [4680, 'Quatre Mille Six Cent Quatre-Vingts'],
  [63892, 'Soixante-Trois Mille Huit Cent Nonante-Deux'],
  [792581, 'Sept Cent Nonante-Deux Mille Cinq Cent Quatre-Vingt-Un'],
  [1342823, 'Un Million Trois Cent Quarante-Deux Mille Huit Cent Vingt-Trois'],
  [2741034, 'Deux Millions Sept Cent Quarante-Et-Un Mille Trente-Quatre'],
  [86429753, 'Quatre-Vingt-Six Millions Quatre Cent Vingt-Neuf Mille Sept Cent Cinquante-Trois'],
  [975310864, 'Neuf Cent Septante-Cinq Millions Trois Cent Dix Mille Huit Cent Soixante-Quatre'],
  [9876543210, 'Neuf Milliards Huit Cent Septante-Six Millions Cinq Cent Quarante-Trois Mille Deux Cent Dix'],
  [98765432101, 'Nonante-Huit Milliards Sept Cent Soixante-Cinq Millions Quatre Cent Trente-Deux Mille Cent Un'],
  [
    987654321012,
    'Neuf Cent Quatre-Vingt-Sept Milliards Six Cent Cinquante-Quatre Millions Trois Cent Vingt-Et-Un Mille Douze',
  ],
  [
    9876543210123,
    'Neuf Billions Huit Cent Septante-Six Milliards Cinq Cent Quarante-Trois Millions Deux Cent Dix Mille Cent Vingt-Trois',
  ],
  [
    98765432101234,
    'Nonante-Huit Billions Sept Cent Soixante-Cinq Milliards Quatre Cent Trente-Deux Millions Cent Un Mille Deux Cent Trente-Quatre',
  ],
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
    row[1] = `Moins ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euros`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euros`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Euros`;
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
  [0.0, 'Zéro'],
  [0.04, 'Zéro Virgule Zéro Quatre'],
  [0.0468, 'Zéro Virgule Zéro Quatre Six Huit'],
  [0.4, 'Zéro Virgule Quatre'],
  [0.63, 'Zéro Virgule Soixante-Trois'],
  [0.973, 'Zéro Virgule Neuf Cent Septante-Trois'],
  [0.999, 'Zéro Virgule Neuf Cent Nonante-Neuf'],
  [37.06, 'Trente-Sept Virgule Zéro Six'],
  [37.068, 'Trente-Sept Virgule Zéro Six Huit'],
  [37.68, 'Trente-Sept Virgule Soixante-Huit'],
  [37.683, 'Trente-Sept Virgule Six Cent Quatre-Vingt-Trois'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zéro Euros`],
  [0.04, `Zéro Euros Et Quatre Centimes`],
  [0.0468, `Zéro Euros Et Cinq Centimes`],
  [0.4, `Zéro Euros Et Quarante Centimes`],
  [0.63, `Zéro Euros Et Soixante-Trois Centimes`],
  [0.973, `Zéro Euros Et Nonante-Sept Centimes`],
  [0.999, `Un Euro`],
  [37.06, `Trente-Sept Euros Et Six Centimes`],
  [37.068, `Trente-Sept Euros Et Sept Centimes`],
  [37.68, `Trente-Sept Euros Et Soixante-Huit Centimes`],
  [37.683, `Trente-Sept Euros Et Soixante-Huit Centimes`],
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
      row[1] = (row[1] as string).replace(`Zéro Euros Et `, '');
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
      row[1] = `Zéro Euros`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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
  // Numbers 1-20
  [1, 'Premier'],
  [2, 'Deuxième'],
  [3, 'Troisième'],
  [4, 'Quatrième'],
  [5, 'Cinquième'],
  [6, 'Sixième'],
  [7, 'Septième'],
  [8, 'Huitième'],
  [9, 'Neuvième'],
  [10, 'Dixième'],
  [11, 'Onzième'],
  [12, 'Douzième'],
  [13, 'Treizième'],
  [14, 'Quatorzième'],
  [15, 'Quinzième'],
  [16, 'Seizième'],
  [17, 'Dix-Septième'],
  [18, 'Dix-Huitième'],
  [19, 'Dix-Neuvième'],
  [20, 'Vingtième'],
  // Composite numbers (21-29)
  [21, 'Vingt-Et-Un'],
  [22, 'Vingt-Deux'],
  [23, 'Vingt-Trois'],
  [24, 'Vingt-Quatre'],
  [25, 'Vingt-Cinq'],
  [26, 'Vingt-Six'],
  [27, 'Vingt-Sept'],
  [28, 'Vingt-Huit'],
  [29, 'Vingt-Neuf'],
  // Tens (round numbers)
  [30, 'Trentième'],
  [31, 'Trente-Et-Un'],
  [40, 'Quarantième'],
  [41, 'Quarante-Et-Un'],
  [50, 'Cinquantième'],
  [51, 'Cinquante-Et-Un'],
  [60, 'Soixantième'],
  [61, 'Soixante-Et-Un'],
  // Belgian French specific (septante = 70, nonante = 90)
  [70, 'Septantième'],
  [71, 'Septante-Et-Un'],
  [72, 'Septante-Deux'],
  [73, 'Septante-Trois'],
  [79, 'Septante-Neuf'],
  [80, 'Quatre-Vingtième'],
  [81, 'Quatre-Vingt-Un'],
  [82, 'Quatre-Vingt-Deux'],
  [89, 'Quatre-Vingt-Neuf'],
  [90, 'Nonantième'],
  [91, 'Nonante-Et-Un'],
  [92, 'Nonante-Deux'],
  [99, 'Nonante-Neuf'],
  // Round numbers (100, 200, etc.)
  [100, 'Centième'],
  [200, 'Deux Centième'],
  [300, 'Trois Centième'],
  [500, 'Cinq Centième'],
  // Complex numbers
  [101, 'Cent Premier'],
  [110, 'Cent Dixième'],
  [111, 'Cent Onzième'],
  [123, 'Cent Vingt-Trois'],
  [150, 'Cent Cinquantième'],
  [199, 'Cent Nonante-Neuf'],
  // Thousands
  [1000, 'Millième'],
  [1001, 'Mille Premier'],
  [1010, 'Mille Dixième'],
  [1100, 'Mille Centième'],
  [1234, 'Mille Deux Cent Trente-Quatre'],
  [2000, 'Deux Millième'],
  [10000, 'Dix Millième'],
  [100000, 'Cent Millième'],
  // Millions and beyond
  [1000000, 'Un Millionième'],
  [10000000, 'Dix Millionième'],
  [100000000, 'Cent Millionième'],
  [1000000000, 'Un Milliardième'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for negative decimal numbers', () => {
    expect(() => toWords.toOrdinal(-3.14)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Powers of Ten', () => {
  const powersOfTen: [number, string][] = [
    [10, 'Dix'],
    [100, 'Cent'],
    [1000, 'Mille'],
    [10000, 'Dix Mille'],
    [100000, 'Cent Mille'],
    [1000000, 'Un Million'],
  ];

  test.concurrent.each(powersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('BigInt Tests', () => {
  const bigIntValues: [bigint, string][] = [
    [0n, 'Zéro'],
    [1n, 'Un'],
    [100n, 'Cent'],
    [1000n, 'Mille'],
  ];

  test.concurrent.each(bigIntValues)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Negative BigInt Tests', () => {
  const negativeBigIntValues: [bigint, string][] = [
    [-1n, 'Moins Un'],
    [-100n, 'Moins Cent'],
    [-1000n, 'Moins Mille'],
  ];

  test.concurrent.each(negativeBigIntValues)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('String Input Tests', () => {
  const stringInputs: [string, string][] = [
    ['0', 'Zéro'],
    ['1', 'Un'],
    ['100', 'Cent'],
    ['-100', 'Moins Cent'],
  ];

  test.concurrent.each(stringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Zero Variants', () => {
  test('convert 0 => Zéro', () => {
    expect(toWords.convert(0)).toBe('Zéro');
  });

  test('convert -0 => Zéro', () => {
    expect(toWords.convert(-0)).toBe('Zéro');
  });

  test('convert 0.0 => Zéro', () => {
    expect(toWords.convert(0.0)).toBe('Zéro');
  });

  test('convert 0n => Zéro', () => {
    expect(toWords.convert(0n)).toBe('Zéro');
  });

  test('convert "0" => Zéro', () => {
    expect(toWords.convert('0')).toBe('Zéro');
  });

  test('convert 0 with currency => Zéro Euros', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zéro Euros');
  });
});

describe('Invalid Input Tests', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(NaN)).toThrow('Invalid Number "NaN"');
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

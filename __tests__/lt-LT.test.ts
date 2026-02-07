import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ltLt from '../src/locales/lt-LT.js';
import { ToWords as LocaleToWords } from '../src/locales/lt-LT.js';

const localeCode = 'lt-LT';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ltLt);
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
  [0, 'Nulis'],
  [1, 'Vienas'],
  [2, 'Du'],
  [3, 'Trys'],
  [4, 'Keturi'],
  [5, 'Penki'],
  [6, 'Šeši'],
  [7, 'Septyni'],
  [8, 'Aštuoni'],
  [9, 'Devyni'],
  [10, 'Dešimt'],
  [11, 'Vienuolika'],
  [12, 'Dvylika'],
  [13, 'Trylika'],
  [14, 'Keturiolika'],
  [15, 'Penkiolika'],
  [16, 'Šešiolika'],
  [17, 'Septyniolika'],
  [18, 'Aštuoniolika'],
  [19, 'Devyniolika'],
  [20, 'Dvidešimt'],
  [21, 'Dvidešimt Vienas'],
  [22, 'Dvidešimt Du'],
  [30, 'Trisdešimt'],
  [35, 'Trisdešimt Penki'],
  [40, 'Keturiasdešimt'],
  [50, 'Penkiasdešimt'],
  [60, 'Šešiasdešimt'],
  [70, 'Septyniasdešimt'],
  [80, 'Aštuoniasdešimt'],
  [90, 'Devyniasdešimt'],
  [99, 'Devyniasdešimt Devyni'],
  [100, 'Šimtas'],
  [137, 'Šimtas Trisdešimt Septyni'],
  [200, 'Du Šimtai'],
  [300, 'Trys Šimtai'],
  [400, 'Keturi Šimtai'],
  [500, 'Penki Šimtai'],
  [600, 'Šeši Šimtai'],
  [700, 'Septyni Šimtai'],
  [800, 'Aštuoni Šimtai'],
  [900, 'Devyni Šimtai'],
  [1000, 'Tūkstantis'],
  [1100, 'Tūkstantis Šimtas'],
  [2000, 'Du Tūkstančiai'],
  [3000, 'Trys Tūkstančiai'],
  [4000, 'Keturi Tūkstančiai'],
  [5000, 'Penki Tūkstančiai'],
  [4680, 'Keturi Tūkstančiai Šeši Šimtai Aštuoniasdešimt'],
  [10000, 'Dešimt Tūkstantis'],
  [63892, 'Šešiasdešimt Trys Tūkstančių Aštuoni Šimtai Devyniasdešimt Du'],
  [100000, 'Šimtas Tūkstančių'],
  [1000000, 'Milijonas'],
  [2000000, 'Du Milijonai'],
  [5000000, 'Penki Milijonai'],
  [2741034, 'Du Milijonai Septyni Šimtai Keturiasdešimt Vienas Tūkstančių Trisdešimt Keturi'],
  [1000000000, 'Milijardas'],
  [2000000000, 'Du Milijardai'],
  [5000000000, 'Penki Milijardai'],
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

// Helper function to get Lithuanian currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Vienas') {
    return 'Euras';
  }
  // Default plural for all other numbers
  return 'Eurų';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Tik`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Eurų Tik`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Minus ${row[1]} ${currencyName} Tik`;
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
    } else {
      const currencyName = getCurrencyName(row[1] as string);
      row[1] = `${row[1]} ${currencyName} Tik`;
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

const testFloats: [number, string][] = [
  [0.0, 'Nulis'],
  [0.04, 'Nulis Kablelis Nulis Keturi'],
  [0.4, 'Nulis Kablelis Keturi'],
  [0.63, 'Nulis Kablelis Šešiasdešimt Trys'],
  [37.06, 'Trisdešimt Septyni Kablelis Nulis Šeši'],
  [37.68, 'Trisdešimt Septyni Kablelis Šešiasdešimt Aštuoni'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nulis Eurų Tik'],
  [0.04, 'Nulis Eurų Ir Keturi Centų Tik'],
  [0.4, 'Nulis Eurų Ir Keturiasdešimt Centų Tik'],
  [0.63, 'Nulis Eurų Ir Šešiasdešimt Trys Centų Tik'],
  [0.999, 'Vienas Euras Tik'],
  [37.06, 'Trisdešimt Septyni Eurų Ir Šeši Centų Tik'],
  [37.68, 'Trisdešimt Septyni Eurų Ir Šešiasdešimt Aštuoni Centų Tik'],
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
      row[1] = (row[1] as string).replace('Nulis Eurų Ir ', '');
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
      row[1] = 'Nulis Eurų Tik';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Ir [\\wąčęėįšųūžĄČĘĖĮŠŲŪŽ ]+ Cent[ųas]*`), '');
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

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-10 (special ordinal forms)
  [1, 'Pirmasis'],
  [2, 'Antrasis'],
  [3, 'Trečiasis'],
  [4, 'Ketvirtasis'],
  [5, 'Penktasis'],
  [6, 'Šeštasis'],
  [7, 'Septintasis'],
  [8, 'Aštuntasis'],
  [9, 'Devintasis'],
  [10, 'Dešimtasis'],

  // Numbers 11-19
  [11, 'Vienuoliktasis'],
  [12, 'Dvyliktasis'],
  [13, 'Tryliktasis'],
  [14, 'Keturioliktasis'],
  [15, 'Penkioliktasis'],
  [16, 'Šešioliktasis'],
  [17, 'Septynioliktasis'],
  [18, 'Aštuonioliktasis'],
  [19, 'Devynioliktasis'],

  // Tens
  [20, 'Dvidešimtasis'],
  [21, 'Dvidešimt Pirmasis'],
  [22, 'Dvidešimt Antrasis'],
  [30, 'Trisdešimtasis'],
  [40, 'Keturiasdešimtasis'],
  [50, 'Penkiasdešimtasis'],
  [60, 'Šešiasdešimtasis'],
  [70, 'Septyniasdešimtasis'],
  [80, 'Aštuoniasdešimtasis'],
  [90, 'Devyniasdešimtasis'],

  // Hundreds
  [100, 'Šimtasis'],
  [101, 'Šimtas Pirmasis'],
  [200, 'Dvišimtasis'],
  [300, 'Trišimtasis'],

  // Thousands
  [1000, 'Tūkstantasis'],
  [1001, 'Tūkstantis Pirmasis'],

  // Millions
  [1000000, 'Milijonasis'],
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

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'Dešimt'],
    [100, 'Šimtas'],
    [1000, 'Tūkstantis'],
    [10000, 'Dešimt Tūkstantis'],
    [100000, 'Šimtas Tūkstančių'],
    [1000000, 'Milijonas'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'Nulis'],
    [1n, 'Vienas'],
    [100n, 'Šimtas'],
    [1000n, 'Tūkstantis'],
  ];

  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test Negative BigInt', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'Minus Vienas'],
    [-100n, 'Minus Šimtas'],
    [-1000n, 'Minus Tūkstantis'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test String Input', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'Nulis'],
    ['1', 'Vienas'],
    ['100', 'Šimtas'],
    ['-100', 'Minus Šimtas'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Nulis', () => {
    expect(toWords.convert(0)).toBe('Nulis');
  });

  test('convert -0 => Nulis', () => {
    expect(toWords.convert(-0)).toBe('Nulis');
  });

  test('convert 0.0 => Nulis', () => {
    expect(toWords.convert(0.0)).toBe('Nulis');
  });

  test('convert 0n => Nulis', () => {
    expect(toWords.convert(0n)).toBe('Nulis');
  });

  test('convert "0" => Nulis', () => {
    expect(toWords.convert('0')).toBe('Nulis');
  });

  test('convert 0 with currency => Nulis Eurų Tik', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nulis Eurų Tik');
  });
});

describe('Test Invalid Input', () => {
  const testInvalidInputs: [unknown, string][] = [
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(testInvalidInputs)('convert %s => throws %s', (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
  });
});

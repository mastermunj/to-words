import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import plPl from '../src/locales/pl-PL.js';
import { ToWords as LocaleToWords } from '../src/locales/pl-PL.js';

const localeCode = 'pl-PL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(plPl);
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
  [1, 'Jeden'],
  [2, 'Dwa'],
  [3, 'Trzy'],
  [4, 'Cztery'],
  [5, 'Pięć'],
  [6, 'Sześć'],
  [7, 'Siedem'],
  [8, 'Osiem'],
  [9, 'Dziewięć'],
  [10, 'Dziesięć'],
  [11, 'Jedenaście'],
  [12, 'Dwanaście'],
  [13, 'Trzynaście'],
  [14, 'Czternaście'],
  [15, 'Piętnaście'],
  [16, 'Szesnaście'],
  [17, 'Siedemnaście'],
  [18, 'Osiemnaście'],
  [19, 'Dziewiętnaście'],
  [20, 'Dwadzieścia'],
  [21, 'Dwadzieścia Jeden'],
  [22, 'Dwadzieścia Dwa'],
  [30, 'Trzydzieści'],
  [35, 'Trzydzieści Pięć'],
  [40, 'Czterdzieści'],
  [50, 'Pięćdziesiąt'],
  [60, 'Sześćdziesiąt'],
  [70, 'Siedemdziesiąt'],
  [80, 'Osiemdziesiąt'],
  [90, 'Dziewięćdziesiąt'],
  [99, 'Dziewięćdziesiąt Dziewięć'],
  [100, 'Sto'],
  [137, 'Sto Trzydzieści Siedem'],
  [200, 'Dwieście'],
  [300, 'Trzysta'],
  [400, 'Czterysta'],
  [500, 'Pięćset'],
  [600, 'Sześćset'],
  [700, 'Siedemset'],
  [800, 'Osiemset'],
  [900, 'Dziewięćset'],
  [1000, 'Tysiąc'],
  [1100, 'Tysiąc Sto'],
  [2000, 'Dwa Tysiące'],
  [3000, 'Trzy Tysiące'],
  [4000, 'Cztery Tysiące'],
  [5000, 'Pięć Tysiąc'],
  [4680, 'Cztery Tysiące Sześćset Osiemdziesiąt'],
  [10000, 'Dziesięć Tysiąc'],
  [63892, 'Sześćdziesiąt Trzy Tysięcy Osiemset Dziewięćdziesiąt Dwa'],
  [100000, 'Sto Tysięcy'],
  [1000000, 'Milion'],
  [2000000, 'Dwa Miliony'],
  [5000000, 'Pięć Milion'],
  [2741034, 'Dwa Miliony Siedemset Czterdzieści Jeden Tysięcy Trzydzieści Cztery'],
  [1000000000, 'Miliard'],
  [2000000000, 'Dwa Miliardy'],
  [5000000000, 'Pięć Miliard'],
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

// Helper function to get Polish currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Jeden') {
    return 'Złoty';
  }
  // Default plural for all other numbers
  return 'Złotych';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Tylko`;
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
      row[1] = `${row[1]} Złotych Tylko`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Minus ${row[1]} ${currencyName} Tylko`;
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
      row[1] = `${row[1]} ${currencyName} Tylko`;
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
  [0.0, 'Zero'],
  [0.04, 'Zero Przecinek Zero Cztery'],
  [0.4, 'Zero Przecinek Cztery'],
  [0.63, 'Zero Przecinek Sześćdziesiąt Trzy'],
  [37.06, 'Trzydzieści Siedem Przecinek Zero Sześć'],
  [37.68, 'Trzydzieści Siedem Przecinek Sześćdziesiąt Osiem'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Zero Złotych Tylko'],
  [0.04, 'Zero Złotych I Cztery Groszy Tylko'],
  [0.4, 'Zero Złotych I Czterdzieści Groszy Tylko'],
  [0.63, 'Zero Złotych I Sześćdziesiąt Trzy Groszy Tylko'],
  [0.999, 'Jeden Złoty Tylko'],
  [37.06, 'Trzydzieści Siedem Złotych I Sześć Groszy Tylko'],
  [37.68, 'Trzydzieści Siedem Złotych I Sześćdziesiąt Osiem Groszy Tylko'],
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
      row[1] = (row[1] as string).replace('Zero Złotych I ', '');
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
      row[1] = 'Zero Złotych Tylko';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` I [\\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+ Gros[zye]+`), '');
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
  [1, 'Pierwszy'],
  [2, 'Drugi'],
  [3, 'Trzeci'],
  [4, 'Czwarty'],
  [5, 'Piąty'],
  [6, 'Szósty'],
  [7, 'Siódmy'],
  [8, 'Ósmy'],
  [9, 'Dziewiąty'],
  [10, 'Dziesiąty'],

  // Numbers 11-19
  [11, 'Jedenasty'],
  [12, 'Dwunasty'],
  [13, 'Trzynasty'],
  [14, 'Czternasty'],
  [15, 'Piętnasty'],
  [16, 'Szesnasty'],
  [17, 'Siedemnasty'],
  [18, 'Osiemnasty'],
  [19, 'Dziewiętnasty'],

  // Tens
  [20, 'Dwudziesty'],
  [21, 'Dwadzieścia Pierwszy'],
  [22, 'Dwadzieścia Drugi'],
  [30, 'Trzydziesty'],
  [40, 'Czterdziesty'],
  [50, 'Pięćdziesiąty'],
  [60, 'Sześćdziesiąty'],
  [70, 'Siedemdziesiąty'],
  [80, 'Osiemdziesiąty'],
  [90, 'Dziewięćdziesiąty'],

  // Hundreds
  [100, 'Setny'],
  [101, 'Sto Pierwszy'],
  [200, 'Dwusetny'],
  [300, 'Trzechsetny'],

  // Thousands
  [1000, 'Tysięczny'],
  [1001, 'Tysiąc Pierwszy'],

  // Millions
  [1000000, 'Milionowy'],
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

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR pl-PL
// ============================================================

// Powers of Ten (Polish)
const testPowersOfTen: [number, string][] = [
  [10, 'Dziesięć'],
  [100, 'Sto'],
  [1000, 'Tysiąc'],
  [10000, 'Dziesięć Tysiąc'],
  [100000, 'Sto Tysięcy'],
  [1000000, 'Milion'],
  [10000000, 'Dziesięć Milion'],
  [100000000, 'Sto Milionów'],
  [1000000000, 'Miliard'],
  [10000000000, 'Dziesięć Miliard'],
  [100000000000, 'Sto Miliardów'],
  [1000000000000, 'Bilion'],
];

describe('Test Powers of Ten (Polish System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'Jeden'],
  [100n, 'Sto'],
  [1000n, 'Tysiąc'],
  [1000000n, 'Milion'],
  [1000000000n, 'Miliard'],
  [1000000000000n, 'Bilion'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Jeden'],
  [-100n, 'Minus Sto'],
  [-1000n, 'Minus Tysiąc'],
  [-1000000n, 'Minus Milion'],
  [-1000000000n, 'Minus Miliard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'Jeden'],
  ['100', 'Sto'],
  ['1000', 'Tysiąc'],
  ['-100', 'Minus Sto'],
  ['  100  ', 'Sto'],
  ['1000000', 'Milion'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
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
    expect(toWords.convert(0, { currency: true })).toBe('Zero Złotych Tylko');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for pl-PL', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(NaN)).toThrow(/Invalid Number/);
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
});

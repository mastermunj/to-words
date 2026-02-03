import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import afZa from '../src/locales/af-ZA.js';
import { ToWords as LocaleToWords } from '../src/locales/af-ZA.js';

const localeCode = 'af-ZA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(afZa);
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
  [0, 'Nul'],
  [137, 'Een Honderd Sewe En Dertig'],
  [700, 'Sewe Honderd'],
  [1100, 'Een Duisend Honderd'],
  [4680, 'Vier Duisend Ses Honderd Tagtig'],
  [63892, 'Drie En Sestig Duisend Agt Honderd Twee En Negentig'],
  [86100, 'Ses En Tagtig Duisend Honderd'],
  [792581, 'Sewe Honderd Twee En Negentig Duisend Vyf Honderd Een En Tagtig'],
  [2741034, 'Twee Miljoen Sewe Honderd Een En Veertig Duisend Vier En Dertig'],
  [86429753, 'Ses En Tagtig Miljoen Vier Honderd Nege En Twintig Duisend Sewe Honderd Drie En Vyftig'],
  [975310864, 'Nege Honderd Vyf En Sewentig Miljoen Drie Honderd Tien Duisend Agt Honderd Vier En Sestig'],
  [
    9876543210,
    'Nege Miljard Agt Honderd Ses En Sewentig Miljoen Vyf Honderd Drie En Veertig Duisend Twee Honderd Tien',
  ],
  [
    98765432101,
    'Agt En Negentig Miljard Sewe Honderd Vyf En Sestig Miljoen Vier Honderd Twee En Dertig Duisend Een Honderd Een',
  ],
  [
    987654321012,
    'Nege Honderd Sewe En Tagtig Miljard Ses Honderd Vier En Vyftig Miljoen Drie Honderd Een En Twintig Duisend Twaalf',
  ],
  [
    9876543210123,
    'Nege Biljoen Agt Honderd Ses En Sewentig Miljard Vyf Honderd Drie En Veertig Miljoen Twee Honderd Tien Duisend Een Honderd Drie En Twintig',
  ],
  [
    98765432101234,
    'Agt En Negentig Biljoen Sewe Honderd Vyf En Sestig Miljard Vier Honderd Twee En Dertig Miljoen Een Honderd Een Duisend Twee Honderd Vier En Dertig',
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
    row[1] = `Negatief ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Rand`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Rand`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Rand`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Negatief ${row[1]} Rand`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Rand`;
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
  [0.0, 'Nul'],
  [0.04, 'Nul Punt Nul Vier'],
  [0.0468, 'Nul Punt Nul Vier Ses Agt'],
  [0.4, 'Nul Punt Vier'],
  [0.973, 'Nul Punt Nege Honderd Drie En Sewentig'],
  [0.999, 'Nul Punt Nege Honderd Nege En Negentig'],
  [37.06, 'Sewe En Dertig Punt Nul Ses'],
  [37.068, 'Sewe En Dertig Punt Nul Ses Agt'],
  [37.68, 'Sewe En Dertig Punt Agt En Sestig'],
  [37.683, 'Sewe En Dertig Punt Ses Honderd Drie En Tagtig'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Nul Rand`],
  [0.04, `Nul Rand En Vier Sente`],
  [0.0468, `Nul Rand En Vyf Sente`],
  [0.4, `Nul Rand En Veertig Sente`],
  [0.973, `Nul Rand En Sewe En Negentig Sente`],
  [0.999, `Een Rand`],
  [37.06, `Sewe En Dertig Rand En Ses Sente`],
  [37.068, `Sewe En Dertig Rand En Sewe Sente`],
  [37.68, `Sewe En Dertig Rand En Agt En Sestig Sente`],
  [37.683, `Sewe En Dertig Rand En Agt En Sestig Sente`],
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
      row[1] = (row[1] as string).replace(`Nul Rand En `, '');
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
      row[1] = `Nul Rand`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Rand.*`), 'Rand');
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

const testOrdinals: [number, string][] = [
  // Numbers 0-10
  [0, 'Nulde'],
  [1, 'Eerste'],
  [2, 'Tweede'],
  [3, 'Derde'],
  [4, 'Vierde'],
  [5, 'Vyfde'],
  [6, 'Sesde'],
  [7, 'Sewende'],
  [8, 'Agtste'],
  [9, 'Negende'],
  [10, 'Tiende'],
  [11, 'Elfde'],
  [12, 'Twaalfde'],
  [13, 'Dertiende'],
  [14, 'Veertiende'],
  [15, 'Vyftiende'],
  [16, 'Sestiende'],
  [17, 'Sewentiende'],
  [18, 'Agtiende'],
  [19, 'Negentiende'],
  [20, 'Twintigste'],
  // Composite numbers (21, 22, etc.)
  [21, 'Een En Twintig'],
  [22, 'Twee En Twintig'],
  [23, 'Drie En Twintig'],
  [24, 'Vier En Twintig'],
  [25, 'Vyf En Twintig'],
  // Tens
  [30, 'Dertigste'],
  [40, 'Veertigste'],
  [50, 'Vyftigste'],
  [60, 'Sestigste'],
  [70, 'Sewentigste'],
  [80, 'Tagtigste'],
  [90, 'Negentigste'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Honderdste'],
  [200, 'Twee Honderdste'],
  [300, 'Drie Honderdste'],
  [1000, 'Een Duisendste'],
  [2000, 'Twee Duisendste'],
  [1000000, 'Een Miljoenste'],
  [2000000, 'Twee Miljoenste'],
  // Complex numbers
  [101, 'Een Honderd Eerste'],
  [102, 'Een Honderd Tweede'],
  [111, 'Een Honderd Elfde'],
  [123, 'Een Honderd Drie En Twintig'],
  [150, 'Een Honderd Vyftigste'],
  [1001, 'Een Duisend Eerste'],
  [1234, 'Een Duisend Twee Honderd Vier En Dertig'],
  [1500, 'Een Duisend Vyf Honderdste'],
  [10000, 'Tien Duisendste'],
  [100000, 'Honderd Duisendste'],
  [1000001, 'Een Miljoen Eerste'],
];

describe('Test Ordinals with toOrdinal()', () => {
  test.concurrent.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
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

  test('should throw error for small decimal numbers', () => {
    expect(() => toWords.toOrdinal(0.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for large decimal numbers', () => {
    expect(() => toWords.toOrdinal(100.25)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// Powers of Ten (International System)
const testPowersOfTen: [number, string][] = [
  [10, 'Tien'],
  [100, 'Honderd'],
  [1000, 'Een Duisend'],
  [10000, 'Tien Duisend'],
  [100000, 'Honderd Duisend'],
  [1000000, 'Een Miljoen'],
  [10000000, 'Tien Miljoen'],
  [100000000, 'Honderd Miljoen'],
  [1000000000, 'Een Miljard'],
  [10000000000, 'Tien Miljard'],
  [100000000000, 'Honderd Miljard'],
  [1000000000000, 'Een Biljoen'],
];

describe('Test Powers of Ten (International System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Nul'],
  [1n, 'Een'],
  [100n, 'Honderd'],
  [1000n, 'Een Duisend'],
  [1000000n, 'Een Miljoen'],
  [1000000000n, 'Een Miljard'],
  [1000000000000n, 'Een Biljoen'],
  [1000000000000000n, 'Een Biljard'],
  [
    1234567890123n,
    'Een Biljoen Twee Honderd Vier En Dertig Miljard Vyf Honderd Sewe En Sestig Miljoen Agt Honderd Negentig Duisend Een Honderd Drie En Twintig',
  ],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Negatief Een'],
  [-100n, 'Negatief Honderd'],
  [-1000n, 'Negatief Een Duisend'],
  [-1000000n, 'Negatief Een Miljoen'],
  [-1000000000n, 'Negatief Een Miljard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Nul Rand'],
  [1n, 'Een Rand'],
  [2n, 'Twee Rand'],
  [100n, 'Honderd Rand'],
  [1000n, 'Een Duisend Rand'],
  [1000000n, 'Een Miljoen Rand'],
  [1000000000n, 'Een Miljard Rand'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Nul'],
  ['1', 'Een'],
  ['100', 'Honderd'],
  ['1000', 'Een Duisend'],
  ['-100', 'Negatief Honderd'],
  ['3.14', 'Drie Punt Veertien'],
  ['-3.14', 'Negatief Drie Punt Veertien'],
  ['  100  ', 'Honderd'],
  ['1000000', 'Een Miljoen'],
  ['1000000000', 'Een Miljard'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String with Currency
const testStringInputsWithCurrency: [string, string][] = [
  ['0', 'Nul Rand'],
  ['1', 'Een Rand'],
  ['100', 'Honderd Rand'],
  ['100.50', 'Honderd Rand En Vyftig Sente'],
  ['-100', 'Negatief Honderd Rand'],
];

describe('Test String Number Inputs with Currency', () => {
  test.concurrent.each(testStringInputsWithCurrency)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Nul');
  });

  test('converts -0 as Nul', () => {
    expect(toWords.convert(-0)).toBe('Nul');
  });

  test('converts 0.0 as Nul', () => {
    expect(toWords.convert(0.0)).toBe('Nul');
  });

  test('converts 0n as Nul', () => {
    expect(toWords.convert(0n)).toBe('Nul');
  });

  test('converts "0" as Nul', () => {
    expect(toWords.convert('0')).toBe('Nul');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nul Rand');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for af-ZA', () => {
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

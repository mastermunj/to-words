import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import svSe from '../src/locales/sv-SE.js';
import { ToWords as LocaleToWords } from '../src/locales/sv-SE.js';

const localeCode = 'sv-SE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(svSe);
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
  [0, 'Noll'],
  [137, 'Hundra Trettiosju'],
  [700, 'Sju Hundra'],
  [1100, 'Tusen Hundra'],
  [4680, 'Fyra Tusen Sex Hundra Åttio'],
  [63892, 'Sextiotre Tusen Åtta Hundra Nittiotvå'],
  [86100, 'Åttiosex Tusen Hundra'],
  [792581, 'Sju Hundra Nittiotvå Tusen Fem Hundra Åttioett'],
  [2741034, 'Två Miljon Sju Hundra Fyrtioett Tusen Trettiofyra'],
  [86429753, 'Åttiosex Miljon Fyra Hundra Tjugonio Tusen Sju Hundra Femtiotre'],
  [975310864, 'Nio Hundra Sjuttiofem Miljon Tre Hundra Tio Tusen Åtta Hundra Sextiofyra'],
  [9876543210, 'Nio Miljard Åtta Hundra Sjuttiosex Miljon Fem Hundra Fyrtiotre Tusen Två Hundra Tio'],
  [98765432101, 'Nittioåtta Miljard Sju Hundra Sextiofem Miljon Fyra Hundra Trettiotvå Tusen Hundra Ett'],
  [987654321012, 'Nio Hundra Åttiosju Miljard Sex Hundra Femtiofyra Miljon Tre Hundra Tjugoett Tusen Tolv'],
  [
    9876543210123,
    'Nio Biljon Åtta Hundra Sjuttiosex Miljard Fem Hundra Fyrtiotre Miljon Två Hundra Tio Tusen Hundra Tjugotre',
  ],
  [
    98765432101234,
    'Nittioåtta Biljon Sju Hundra Sextiofem Miljard Fyra Hundra Trettiotvå Miljon Hundra Ett Tusen Två Hundra Trettiofyra',
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
    row[1] = `${row[1]} Kronor`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Kronor`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Kronor`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Kronor`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Kronor`;
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
  [0.0, 'Noll'],
  [0.04, 'Noll Komma Noll Fyra'],
  [0.0468, 'Noll Komma Noll Fyra Sex Åtta'],
  [0.4, 'Noll Komma Fyra'],
  [0.973, 'Noll Komma Nio Hundra Sjuttiotre'],
  [0.999, 'Noll Komma Nio Hundra Nittionio'],
  [37.06, 'Trettiosju Komma Noll Sex'],
  [37.068, 'Trettiosju Komma Noll Sex Åtta'],
  [37.68, 'Trettiosju Komma Sextioåtta'],
  [37.683, 'Trettiosju Komma Sex Hundra Åttiotre'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Noll Kronor`],
  [0.04, `Noll Kronor Och Fyra Öre`],
  [0.0468, `Noll Kronor Och Fem Öre`],
  [0.4, `Noll Kronor Och Fyrtio Öre`],
  [0.973, `Noll Kronor Och Nittiosju Öre`],
  [0.999, `Ett Krona`],
  [37.06, `Trettiosju Kronor Och Sex Öre`],
  [37.068, `Trettiosju Kronor Och Sju Öre`],
  [37.68, `Trettiosju Kronor Och Sextioåtta Öre`],
  [37.683, `Trettiosju Kronor Och Sextioåtta Öre`],
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
      row[1] = (row[1] as string).replace(`Noll Kronor Och `, '');
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
      row[1] = `Noll Kronor`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Kronor.*`), 'Kronor');
      row[1] = (row[1] as string).replace(new RegExp(`Krona.*`), 'Krona');
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
  [0, 'Nollte'],
  [1, 'Första'],
  [2, 'Andra'],
  [3, 'Tredje'],
  [4, 'Fjärde'],
  [5, 'Femte'],
  [6, 'Sjätte'],
  [7, 'Sjunde'],
  [8, 'Åttonde'],
  [9, 'Nionde'],
  [10, 'Tionde'],
  [11, 'Elfte'],
  [12, 'Tolfte'],
  [13, 'Trettonde'],
  [14, 'Fjortonde'],
  [15, 'Femtonde'],
  [16, 'Sextonde'],
  [17, 'Sjuttonde'],
  [18, 'Artonde'],
  [19, 'Nittonde'],
  [20, 'Tjugonde'],
  // Composite numbers (21, 22, etc.)
  [21, 'Tjugoförsta'],
  [22, 'Tjugoandra'],
  [23, 'Tjugotredje'],
  [24, 'Tjugofjärde'],
  [25, 'Tjugofemte'],
  // Tens
  [30, 'Trettionde'],
  [40, 'Fyrtionde'],
  [50, 'Femtionde'],
  [60, 'Sextionde'],
  [70, 'Sjuttionde'],
  [80, 'Åttionde'],
  [90, 'Nittionde'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundrade'],
  [200, 'Två Hundrade'],
  [300, 'Tre Hundrade'],
  [1000, 'Tusende'],
  [2000, 'Två Tusende'],
  [1000000, 'Ett Miljonte'],
  [2000000, 'Två Miljonte'],
  // Complex numbers
  [101, 'Hundra Första'],
  [102, 'Hundra Andra'],
  [111, 'Hundra Elfte'],
  [123, 'Hundra Tjugotredje'],
  [150, 'Hundra Femtionde'],
  [1001, 'Tusen Första'],
  [1234, 'Tusen Två Hundra Trettiofjärde'],
  [1500, 'Tusen Fem Hundrade'],
  [10000, 'Tio Tusende'],
  [100000, 'Hundra Tusende'],
  [1000001, 'Ett Miljon Första'],
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

describe('Test Swedish-specific numbers', () => {
  test('Single Krona (1)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Ett Krona');
  });

  test('Two Kronor', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Två Kronor');
  });

  test('Teens (11-19)', () => {
    expect(toWords.convert(11)).toBe('Elva');
    expect(toWords.convert(12)).toBe('Tolv');
    expect(toWords.convert(13)).toBe('Tretton');
    expect(toWords.convert(14)).toBe('Fjorton');
    expect(toWords.convert(15)).toBe('Femton');
    expect(toWords.convert(16)).toBe('Sexton');
    expect(toWords.convert(17)).toBe('Sjutton');
    expect(toWords.convert(18)).toBe('Arton');
    expect(toWords.convert(19)).toBe('Nitton');
  });

  test('Twenties', () => {
    expect(toWords.convert(20)).toBe('Tjugo');
    expect(toWords.convert(21)).toBe('Tjugoett');
    expect(toWords.convert(22)).toBe('Tjugotvå');
    expect(toWords.convert(25)).toBe('Tjugofem');
    expect(toWords.convert(28)).toBe('Tjugoåtta');
  });

  test('Large numbers', () => {
    expect(toWords.convert(1000000)).toBe('Ett Miljon');
    expect(toWords.convert(1000000000)).toBe('Ett Miljard');
    expect(toWords.convert(2000000)).toBe('Två Miljon');
    expect(toWords.convert(2000000000)).toBe('Två Miljard');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR sv-SE
// ============================================================

// Powers of Ten (Swedish)
const testPowersOfTen: [number, string][] = [
  [10, 'Tio'],
  [100, 'Hundra'],
  [1000, 'Tusen'],
  [10000, 'Tio Tusen'],
  [100000, 'Hundra Tusen'],
  [1000000, 'Ett Miljon'],
  [10000000, 'Tio Miljon'],
  [100000000, 'Hundra Miljon'],
  [1000000000, 'Ett Miljard'],
  [10000000000, 'Tio Miljard'],
  [100000000000, 'Hundra Miljard'],
  [1000000000000, 'Ett Biljon'],
];

describe('Test Powers of Ten (Swedish System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Noll'],
  [1n, 'Ett'],
  [100n, 'Hundra'],
  [1000n, 'Tusen'],
  [1000000n, 'Ett Miljon'],
  [1000000000n, 'Ett Miljard'],
  [1000000000000n, 'Ett Biljon'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Ett'],
  [-100n, 'Minus Hundra'],
  [-1000n, 'Minus Tusen'],
  [-1000000n, 'Minus Ett Miljon'],
  [-1000000000n, 'Minus Ett Miljard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Noll'],
  ['1', 'Ett'],
  ['100', 'Hundra'],
  ['1000', 'Tusen'],
  ['-100', 'Minus Hundra'],
  ['  100  ', 'Hundra'],
  ['1000000', 'Ett Miljon'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Noll');
  });

  test('converts -0 as Noll', () => {
    expect(toWords.convert(-0)).toBe('Noll');
  });

  test('converts 0.0 as Noll', () => {
    expect(toWords.convert(0.0)).toBe('Noll');
  });

  test('converts 0n as Noll', () => {
    expect(toWords.convert(0n)).toBe('Noll');
  });

  test('converts "0" as Noll', () => {
    expect(toWords.convert('0')).toBe('Noll');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Noll Kronor');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for sv-SE', () => {
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

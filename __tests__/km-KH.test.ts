import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import kmKh from '../src/locales/km-KH.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/km-KH.js';

const localeCode = 'km-KH';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(kmKh);
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

// trim:true — all words joined without spaces
const testIntegers: [number, string][] = [
  [0, 'សូន្យ'],
  [1, 'មួយ'],
  [2, 'ពីរ'],
  [3, 'បី'],
  [4, 'បួន'],
  [5, 'ប្រាំ'],
  [6, 'ប្រាំមួយ'],
  [7, 'ប្រាំពីរ'],
  [8, 'ប្រាំបី'],
  [9, 'ប្រាំបួន'],
  [10, 'ដប់'],
  [11, 'ដប់មួយ'],
  [12, 'ដប់ពីរ'],
  [13, 'ដប់បី'],
  [14, 'ដប់បួន'],
  [15, 'ដប់ប្រាំ'],
  [16, 'ដប់ប្រាំមួយ'],
  [19, 'ដប់ប្រាំបួន'],
  [20, 'ម្ភៃ'],
  [21, 'ម្ភៃមួយ'],
  [22, 'ម្ភៃពីរ'],
  [25, 'ម្ភៃប្រាំ'],
  [30, 'សាមសិប'],
  [40, 'សែសិប'],
  [50, 'ហាសិប'],
  [55, 'ហាសិបប្រាំ'],
  [60, 'ហុកសិប'],
  [70, 'ចិតសិប'],
  [80, 'ប៉ែតសិប'],
  [99, 'កៅសិបប្រាំបួន'],
  [100, 'មួយរយ'],
  [101, 'មួយរយមួយ'],
  [137, 'មួយរយសាមសិបប្រាំពីរ'],
  [200, 'ពីររយ'],
  [500, 'ប្រាំរយ'],
  [700, 'ប្រាំពីររយ'],
  [999, 'ប្រាំបួនរយកៅសិបប្រាំបួន'],
  [1000, 'មួយពាន់'],
  [1001, 'មួយពាន់មួយ'],
  [1100, 'មួយពាន់មួយរយ'],
  [2000, 'ពីរពាន់'],
  [4000, 'បួនពាន់'],
  [4680, 'បួនពាន់ប្រាំមួយរយប៉ែតសិប'],
  [10000, 'មួយមុឺន'],
  [20000, 'ពីរមុឺន'],
  [50000, 'ប្រាំមុឺន'],
  [63892, 'ប្រាំមួយមុឺនបីពាន់ប្រាំបីរយកៅសិបពីរ'],
  [86100, 'ប្រាំបីមុឺនប្រាំមួយពាន់មួយរយ'],
  [100000, 'មួយសែន'],
  [500000, 'ប្រាំសែន'],
  [792581, 'ប្រាំពីរសែនប្រាំបួនមុឺនពីរពាន់ប្រាំរយប៉ែតសិបមួយ'],
  [1000000, 'មួយលាន'],
  [2741034, 'ពីរលានប្រាំពីរសែនបួនមុឺនមួយពាន់សាមសិបបួន'],
  [86429753, 'ប៉ែតសិបប្រាំមួយលានបួនសែនពីរមុឺនប្រាំបួនពាន់ប្រាំពីររយហាសិបបី'],
  [975310864, 'ប្រាំបួនរយចិតសិបប្រាំលានបីសែនមួយមុឺនប្រាំបីរយហុកសិបបួន'],
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
    row[1] = `ដក${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}រៀល`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});
describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}រៀល`;
      return;
    }
    row[0] = -row[0];
    row[1] = `ដក${row[1]}រៀល`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}រៀល`;
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
  [0.0, 'សូន្យ'],
  [0.04, 'សូន្យចុចសូន្យបួន'],
  [0.4, 'សូន្យចុចបួន'],
  [0.63, 'សូន្យចុចហុកសិបបី'],
  [0.973, 'សូន្យចុចប្រាំបួនរយចិតសិបបី'],
  [0.5, 'សូន្យចុចប្រាំ'],
  [1.5, 'មួយចុចប្រាំ'],
  [10.5, 'ដប់ចុចប្រាំ'],
  [12.34, 'ដប់ពីរចុចសាមសិបបួន'],
  [37.06, 'សាមសិបប្រាំពីរចុចសូន្យប្រាំមួយ'],
  [37.68, 'សាមសិបប្រាំពីរចុចហុកសិបប្រាំបី'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.0, 'សូន្យរៀល'],
  [0.04, 'សូន្យរៀលបួនសេន'],
  [0.4, 'សូន្យរៀលសែសិបសេន'],
  [0.63, 'សូន្យរៀលហុកសិបបីសេន'],
  [0.973, 'សូន្យរៀលកៅសិបប្រាំពីរសេន'],
  [0.5, 'សូន្យរៀលហាសិបសេន'],
  [1.5, 'មួយរៀលហាសិបសេន'],
  [37.06, 'សាមសិបប្រាំពីររៀលប្រាំមួយសេន'],
  [37.68, 'សាមសិបប្រាំពីររៀលហុកសិបប្រាំបីសេន'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = [
    [0.0, ''],
    [0.04, 'បួនសេន'],
    [0.4, 'សែសិបសេន'],
    [0.63, 'ហុកសិបបីសេន'],
    [0.973, 'កៅសិបប្រាំពីរសេន'],
    [0.5, 'ហាសិបសេន'],
    [1.5, 'មួយរៀលហាសិបសេន'],
    [37.06, 'សាមសិបប្រាំពីររៀលប្រាំមួយសេន'],
    [37.68, 'សាមសិបប្រាំពីររៀលហុកសិបប្រាំបីសេន'],
  ];

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
  const testFloatsWithCurrencyAndIgnoreDecimal = [
    [0.0, 'សូន្យរៀល'],
    [0.04, 'សូន្យរៀល'],
    [0.4, 'សូន្យរៀល'],
    [0.63, 'សូន្យរៀល'],
    [0.973, 'សូន្យរៀល'],
    [0.5, 'សូន្យរៀល'],
    [1.5, 'មួយរៀល'],
    [37.06, 'សាមសិបប្រាំពីររៀល'],
    [37.68, 'សាមសិបប្រាំពីររៀល'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Ordinal (unsupported — throws)', () => {
  test('toOrdinal throws for km-KH', () => {
    expect(() => toWords.toOrdinal(1)).toThrow('Ordinal conversion not supported for locale "km-KH"');
  });

  test('localeToOrdinal throws for km-KH', () => {
    expect(() => localeToOrdinal(1)).toThrow('Ordinal conversion not supported for locale');
  });
});

const testPowersOfTen = [
  [10, 'ដប់'],
  [100, 'មួយរយ'],
  [1000, 'មួយពាន់'],
  [10000, 'មួយមុឺន'],
  [100000, 'មួយសែន'],
  [1000000, 'មួយលាន'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'សូន្យ'],
  [1n, 'មួយ'],
  [10n, 'ដប់'],
  [100n, 'មួយរយ'],
  [1000n, 'មួយពាន់'],
  [1000000n, 'មួយលាន'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'ដកមួយ'],
  [-10n, 'ដកដប់'],
  [-100n, 'ដកមួយរយ'],
  [-1000n, 'ដកមួយពាន់'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'សូន្យ'],
  ['1', 'មួយ'],
  ['10', 'ដប់'],
  ['100', 'មួយរយ'],
  ['1000', 'មួយពាន់'],
  ['-1', 'ដកមួយ'],
  ['-100', 'ដកមួយរយ'],
  ['-1000', 'ដកមួយពាន់'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => សូន្យ', () => {
    expect(toWords.convert(0)).toBe('សូន្យ');
  });

  test('convert -0 => សូន្យ', () => {
    expect(toWords.convert(-0)).toBe('សូន្យ');
  });

  test('convert 0.0 => សូន្យ', () => {
    expect(toWords.convert(0.0)).toBe('សូន្យ');
  });

  test('convert 0n => សូន្យ', () => {
    expect(toWords.convert(0n)).toBe('សូន្យ');
  });

  test('convert "0" => សូន្យ', () => {
    expect(toWords.convert('0')).toBe('សូន្យ');
  });

  test('convert 0 with currency => សូន្យរៀល', () => {
    expect(toWords.convert(0, { currency: true })).toBe('សូន្យរៀល');
  });
});

describe('Test Invalid Input', () => {
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

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(20)).toBe('ម្ភៃ');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(5)).toBe('ប្រាំរៀល');
  });
});

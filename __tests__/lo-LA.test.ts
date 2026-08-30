import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import loLa from '../src/locales/lo-LA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/lo-LA.js';

const localeCode = 'lo-LA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(loLa);
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
  [0, 'ສູນ'],
  [1, 'ໜຶ່ງ'],
  [2, 'ສອງ'],
  [3, 'ສາມ'],
  [4, 'ສີ່'],
  [5, 'ຫ້າ'],
  [6, 'ຫົກ'],
  [7, 'ເຈັດ'],
  [8, 'ແປດ'],
  [9, 'ເກົ້າ'],
  [10, 'ສິບ'],
  [11, 'ສິບເອັດ'],
  [12, 'ສິບສອງ'],
  [13, 'ສິບສາມ'],
  [14, 'ສິບສີ່'],
  [15, 'ສິບຫ້າ'],
  [16, 'ສິບຫົກ'],
  [17, 'ສິບເຈັດ'],
  [18, 'ສິບແປດ'],
  [19, 'ສິບເກົ້າ'],
  [20, 'ຊາວ'],
  [21, 'ຊາວເອັດ'],
  [25, 'ຊາວຫ້າ'],
  [30, 'ສາມສິບ'],
  [31, 'ສາມສິບເອັດ'],
  [42, 'ສີ່ສິບສອງ'],
  [50, 'ຫ້າສິບ'],
  [91, 'ເກົ້າສິບເອັດ'],
  [99, 'ເກົ້າສິບເກົ້າ'],
  [100, 'ໜຶ່ງຮ້ອຍ'],
  [137, 'ໜຶ່ງຮ້ອຍສາມສິບເຈັດ'],
  [200, 'ສອງຮ້ອຍ'],
  [300, 'ສາມຮ້ອຍ'],
  [500, 'ຫ້າຮ້ອຍ'],
  [700, 'ເຈັດຮ້ອຍ'],
  [999, 'ເກົ້າຮ້ອຍເກົ້າສິບເກົ້າ'],
  [1000, 'ໜຶ່ງພັນ'],
  [1234, 'ໜຶ່ງພັນສອງຮ້ອຍສາມສິບສີ່'],
  [4680, 'ສີ່ພັນຫົກຮ້ອຍແປດສິບ'],
  [10000, 'ສິບພັນ'],
  [63892, 'ຫົກສິບສາມພັນແປດຮ້ອຍເກົ້າສິບສອງ'],
  [100000, 'ໜຶ່ງແສນ'],
  [792581, 'ເຈັດແສນເກົ້າສິບສອງພັນຫ້າຮ້ອຍແປດສິບເອັດ'],
  [1000000, 'ໜຶ່ງລ້ານ'],
  [2741034, 'ສອງລ້ານເຈັດແສນສີ່ສິບເອັດພັນສາມສິບສີ່'],
  [86429753, 'ແປດສິບຫົກລ້ານສີ່ແສນຊາວເກົ້າພັນເຈັດຮ້ອຍຫ້າສິບສາມ'],
  [1000000000, 'ໜຶ່ງພັນລ້ານ'],
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
    row[1] = `ລົບ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'ສູນ'],
  [0.4, 'ສູນຈຸດສີ່'],
  [0.04, 'ສູນຈຸດສູນສີ່'],
  [0.63, 'ສູນຈຸດຫົກສິບສາມ'],
  [0.973, 'ສູນຈຸດເກົ້າຮ້ອຍເຈັດສິບສາມ'],
  [0.999, 'ສູນຈຸດເກົ້າຮ້ອຍເກົ້າສິບເກົ້າ'],
  [37.06, 'ສາມສິບເຈັດຈຸດສູນຫົກ'],
  [37.68, 'ສາມສິບເຈັດຈຸດຫົກສິບແປດ'],
  [37.683, 'ສາມສິບເຈັດຈຸດຫົກຮ້ອຍແປດສິບສາມ'],
];

// The kip has no live subunit, so there is no fractional unit to spell out:
// includeZeroFractional has nothing to add for a whole amount.
describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `ໜຶ່ງຮ້ອຍຊາວສາມກີບຖ້ວນ`],
    ['123', `ໜຶ່ງຮ້ອຍຊາວສາມກີບຖ້ວນ`],
    ['123.0', `ໜຶ່ງຮ້ອຍຊາວສາມກີບຖ້ວນ`],
    ['123.00', `ໜຶ່ງຮ້ອຍຊາວສາມກີບຖ້ວນ`],
    ['0.00', `ສູນກີບຖ້ວນ`],
    ['-123.00', `ລົບໜຶ່ງຮ້ອຍຊາວສາມກີບຖ້ວນ`],
    ['37.68', `ສາມສິບເຈັດກີບຈຸດຫົກສິບແປດຖ້ວນ`],
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

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}ກີບຖ້ວນ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}ກີບ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}ກີບຖ້ວນ`;
      return;
    }
    row[0] = -row[0];
    row[1] = `ລົບ${row[1]}ກີບຖ້ວນ`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}ກີບຖ້ວນ`;
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

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'ສູນກີບຖ້ວນ'],
  [0.04, 'ສູນກີບຈຸດສີ່ຖ້ວນ'],
  [0.4, 'ສູນກີບຈຸດສີ່ສິບຖ້ວນ'],
  [0.63, 'ສູນກີບຈຸດຫົກສິບສາມຖ້ວນ'],
  [0.973, 'ສູນກີບຈຸດເກົ້າສິບເຈັດຖ້ວນ'],
  [0.999, 'ໜຶ່ງກີບຖ້ວນ'],
  [37.06, 'ສາມສິບເຈັດກີບຈຸດຫົກຖ້ວນ'],
  [37.68, 'ສາມສິບເຈັດກີບຈຸດຫົກສິບແປດຖ້ວນ'],
  [37.683, 'ສາມສິບເຈັດກີບຈຸດຫົກສິບແປດຖ້ວນ'],
  [100, 'ໜຶ່ງຮ້ອຍກີບຖ້ວນ'],
  [500.25, 'ຫ້າຮ້ອຍກີບຈຸດຊາວຫ້າຖ້ວນ'],
  [1000.5, 'ໜຶ່ງພັນກີບຈຸດຫ້າສິບຖ້ວນ'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      // With the whole-kip part suppressed the leading ຈຸດ goes with it.
      row[1] = (row[1] as string).replace('ສູນກີບຈຸດ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'ສູນກີບຖ້ວນ'],
    [0.04, 'ສູນກີບຖ້ວນ'],
    [0.4, 'ສູນກີບຖ້ວນ'],
    [0.63, 'ສູນກີບຖ້ວນ'],
    [0.973, 'ສູນກີບຖ້ວນ'],
    [0.999, 'ສູນກີບຖ້ວນ'],
    [37.06, 'ສາມສິບເຈັດກີບຖ້ວນ'],
    [37.68, 'ສາມສິບເຈັດກີບຖ້ວນ'],
    [37.683, 'ສາມສິບເຈັດກີບຖ້ວນ'],
    [100, 'ໜຶ່ງຮ້ອຍກີບຖ້ວນ'],
    [500.25, 'ຫ້າຮ້ອຍກີບຖ້ວນ'],
    [1000.5, 'ໜຶ່ງພັນກີບຖ້ວນ'],
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

const testOrdinals: [number, string][] = [
  [0, 'ທີສູນ'],
  [1, 'ທີໜຶ່ງ'],
  [2, 'ທີສອງ'],
  [3, 'ທີສາມ'],
  [4, 'ທີສີ່'],
  [5, 'ທີຫ້າ'],
  [6, 'ທີຫົກ'],
  [7, 'ທີເຈັດ'],
  [8, 'ທີແປດ'],
  [9, 'ທີເກົ້າ'],
  [10, 'ທີສິບ'],
  [11, 'ທີສິບເອັດ'],
  [12, 'ທີສິບສອງ'],
  [19, 'ທີສິບເກົ້າ'],
  [20, 'ທີຊາວ'],
  [21, 'ທີຊາວເອັດ'],
  [25, 'ທີຊາວຫ້າ'],
  [30, 'ທີສາມສິບ'],
  [99, 'ທີເກົ້າສິບເກົ້າ'],
  [100, 'ທີໜຶ່ງຮ້ອຍ'],
  [1000, 'ທີໜຶ່ງພັນ'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR lo-LA
// ============================================================

// Powers of Ten (Lao myriad-based system)
const testPowersOfTen: [number, string][] = [
  [10, 'ສິບ'],
  [100, 'ໜຶ່ງຮ້ອຍ'],
  [1000, 'ໜຶ່ງພັນ'],
  [10000, 'ສິບພັນ'],
  [100000, 'ໜຶ່ງແສນ'],
  [1000000, 'ໜຶ່ງລ້ານ'],
  [10000000, 'ສິບລ້ານ'],
  [100000000, 'ໜຶ່ງຮ້ອຍລ້ານ'],
  [1000000000, 'ໜຶ່ງພັນລ້ານ'],
];

describe('Test Powers of Ten (Lao Scale)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Lao names 10^5 (ແສນ) but not 10^4, which is read as ສິບພັນ
const testScaleWords: [number, string][] = [
  [10000, 'ສິບພັນ'],
  [20000, 'ຊາວພັນ'],
  [99999, 'ເກົ້າສິບເກົ້າພັນເກົ້າຮ້ອຍເກົ້າສິບເກົ້າ'],
  [100000, 'ໜຶ່ງແສນ'],
  [500000, 'ຫ້າແສນ'],
  [1000000, 'ໜຶ່ງລ້ານ'],
];

describe('Test Scale Words (ສິບພັນ vs ແສນ)', () => {
  test.concurrent.each(testScaleWords)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// "ເອັດ" (et) replaces "ໜຶ່ງ" for a trailing 1 after a ten
const testEtForms: [number, string][] = [
  [11, 'ສິບເອັດ'],
  [21, 'ຊາວເອັດ'],
  [31, 'ສາມສິບເອັດ'],
  [41, 'ສີ່ສິບເອັດ'],
  [51, 'ຫ້າສິບເອັດ'],
  [61, 'ຫົກສິບເອັດ'],
  [71, 'ເຈັດສິບເອັດ'],
  [81, 'ແປດສິບເອັດ'],
  [91, 'ເກົ້າສິບເອັດ'],
  [121, 'ໜຶ່ງຮ້ອຍຊາວເອັດ'],
  [1091, 'ໜຶ່ງພັນເກົ້າສິບເອັດ'],
];

describe('Test ເອັດ Forms', () => {
  test.concurrent.each(testEtForms)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'ສູນ'],
  [1n, 'ໜຶ່ງ'],
  [100n, 'ໜຶ່ງຮ້ອຍ'],
  [1000n, 'ໜຶ່ງພັນ'],
  [10000n, 'ສິບພັນ'],
  [100000n, 'ໜຶ່ງແສນ'],
  [1000000n, 'ໜຶ່ງລ້ານ'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'ລົບໜຶ່ງ'],
  [-100n, 'ລົບໜຶ່ງຮ້ອຍ'],
  [-1000n, 'ລົບໜຶ່ງພັນ'],
  [-10000n, 'ລົບສິບພັນ'],
  [-1000000n, 'ລົບໜຶ່ງລ້ານ'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'ສູນ'],
  ['1', 'ໜຶ່ງ'],
  ['100', 'ໜຶ່ງຮ້ອຍ'],
  ['1000', 'ໜຶ່ງພັນ'],
  ['-100', 'ລົບໜຶ່ງຮ້ອຍ'],
  ['  100  ', 'ໜຶ່ງຮ້ອຍ'],
  ['1000000', 'ໜຶ່ງລ້ານ'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('ສູນ');
  });

  test('converts -0 as ສູນ', () => {
    expect(toWords.convert(-0)).toBe('ສູນ');
  });

  test('converts 0.0 as ສູນ', () => {
    expect(toWords.convert(0.0)).toBe('ສູນ');
  });

  test('converts 0n as ສູນ', () => {
    expect(toWords.convert(0n)).toBe('ສູນ');
  });

  test('converts "0" as ສູນ', () => {
    expect(toWords.convert('0')).toBe('ສູນ');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ສູນກີບຖ້ວນ');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for lo-LA', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
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

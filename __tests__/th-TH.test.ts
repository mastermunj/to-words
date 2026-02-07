import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import thTh from '../src/locales/th-TH.js';
import { ToWords as LocaleToWords } from '../src/locales/th-TH.js';

const localeCode = 'th-TH';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(thTh);
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
  [0, 'ศูนย์'],
  [1, 'หนึ่ง'],
  [2, 'สอง'],
  [3, 'สาม'],
  [4, 'สี่'],
  [5, 'ห้า'],
  [6, 'หก'],
  [7, 'เจ็ด'],
  [8, 'แปด'],
  [9, 'เก้า'],
  [10, 'สิบ'],
  [11, 'สิบเอ็ด'],
  [12, 'สิบสอง'],
  [13, 'สิบสาม'],
  [14, 'สิบสี่'],
  [15, 'สิบห้า'],
  [16, 'สิบหก'],
  [17, 'สิบเจ็ด'],
  [18, 'สิบแปด'],
  [19, 'สิบเก้า'],
  [20, 'ยี่สิบ'],
  [21, 'ยี่สิบหนึ่ง'],
  [25, 'ยี่สิบห้า'],
  [30, 'สามสิบ'],
  [42, 'สี่สิบสอง'],
  [50, 'ห้าสิบ'],
  [99, 'เก้าสิบเก้า'],
  [100, 'หนึ่งร้อย'],
  [137, 'หนึ่งร้อยสามสิบเจ็ด'],
  [200, 'สองร้อย'],
  [300, 'สามร้อย'],
  [500, 'ห้าร้อย'],
  [700, 'เจ็ดร้อย'],
  [999, 'เก้าร้อยเก้าสิบเก้า'],
  [1000, 'หนึ่งพัน'],
  [1001, 'หนึ่งพันหนึ่ง'],
  [1234, 'หนึ่งพันสองร้อยสามสิบสี่'],
  [4680, 'สี่พันหกร้อยแปดสิบ'],
  [10000, 'หนึ่งหมื่น'],
  [63892, 'หกหมื่นสามพันแปดร้อยเก้าสิบสอง'],
  [100000, 'หนึ่งแสน'],
  [792581, 'เจ็ดแสนเก้าหมื่นสองพันห้าร้อยแปดสิบหนึ่ง'],
  [1000000, 'หนึ่งล้าน'],
  [2741034, 'สองล้านเจ็ดแสนสี่หมื่นหนึ่งพันสามสิบสี่'],
  [86429753, 'แปดสิบหกล้านสี่แสนสองหมื่นเก้าพันเจ็ดร้อยห้าสิบสาม'],
  [1000000000, 'หนึ่งพันล้าน'],
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
    row[1] = `ลบ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'ศูนย์'],
  [0.4, 'ศูนย์จุดสี่'],
  [0.04, 'ศูนย์จุดศูนย์สี่'],
  [0.63, 'ศูนย์จุดหกสิบสาม'],
  [0.973, 'ศูนย์จุดเก้าร้อยเจ็ดสิบสาม'],
  [0.999, 'ศูนย์จุดเก้าร้อยเก้าสิบเก้า'],
  [37.06, 'สามสิบเจ็ดจุดศูนย์หก'],
  [37.68, 'สามสิบเจ็ดจุดหกสิบแปด'],
  [37.683, 'สามสิบเจ็ดจุดหกร้อยแปดสิบสาม'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}บาทถ้วน`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}บาท`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}บาทถ้วน`;
      return;
    }
    row[0] = -row[0];
    row[1] = `ลบ${row[1]}บาทถ้วน`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}บาทถ้วน`;
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
  [0.0, 'ศูนย์บาทถ้วน'],
  [0.04, 'ศูนย์บาทสี่สตางค์ถ้วน'],
  [0.4, 'ศูนย์บาทสี่สิบสตางค์ถ้วน'],
  [0.63, 'ศูนย์บาทหกสิบสามสตางค์ถ้วน'],
  [0.973, 'ศูนย์บาทเก้าสิบเจ็ดสตางค์ถ้วน'],
  [0.999, 'หนึ่งบาทถ้วน'],
  [37.06, 'สามสิบเจ็ดบาทหกสตางค์ถ้วน'],
  [37.68, 'สามสิบเจ็ดบาทหกสิบแปดสตางค์ถ้วน'],
  [37.683, 'สามสิบเจ็ดบาทหกสิบแปดสตางค์ถ้วน'],
  [100, 'หนึ่งร้อยบาทถ้วน'],
  [500.25, 'ห้าร้อยบาทยี่สิบห้าสตางค์ถ้วน'],
  [1000.5, 'หนึ่งพันบาทห้าสิบสตางค์ถ้วน'],
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
      row[1] = (row[1] as string).replace('ศูนย์บาท', '');
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
    [0.0, 'ศูนย์บาทถ้วน'],
    [0.04, 'ศูนย์บาทถ้วน'],
    [0.4, 'ศูนย์บาทถ้วน'],
    [0.63, 'ศูนย์บาทถ้วน'],
    [0.973, 'ศูนย์บาทถ้วน'],
    [0.999, 'ศูนย์บาทถ้วน'],
    [37.06, 'สามสิบเจ็ดบาทถ้วน'],
    [37.68, 'สามสิบเจ็ดบาทถ้วน'],
    [37.683, 'สามสิบเจ็ดบาทถ้วน'],
    [100, 'หนึ่งร้อยบาทถ้วน'],
    [500.25, 'ห้าร้อยบาทถ้วน'],
    [1000.5, 'หนึ่งพันบาทถ้วน'],
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
  [0, 'ที่ศูนย์'],
  [1, 'ที่หนึ่ง'],
  [2, 'ที่สอง'],
  [3, 'ที่สาม'],
  [4, 'ที่สี่'],
  [5, 'ที่ห้า'],
  [6, 'ที่หก'],
  [7, 'ที่เจ็ด'],
  [8, 'ที่แปด'],
  [9, 'ที่เก้า'],
  [10, 'ที่สิบ'],
  [11, 'ที่สิบเอ็ด'],
  [12, 'ที่สิบสอง'],
  [19, 'ที่สิบเก้า'],
  [20, 'ที่ยี่สิบ'],
  [21, 'ยี่สิบที่หนึ่ง'],
  [25, 'ยี่สิบที่ห้า'],
  [30, 'ที่สามสิบ'],
  [99, 'เก้าสิบที่เก้า'],
  [100, 'ที่ร้อย'],
  [1000, 'หนึ่งที่พัน'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR th-TH
// ============================================================

// Powers of Ten (Thai)
const testPowersOfTen: [number, string][] = [
  [10, 'สิบ'],
  [100, 'หนึ่งร้อย'],
  [1000, 'หนึ่งพัน'],
  [10000, 'หนึ่งหมื่น'],
  [100000, 'หนึ่งแสน'],
  [1000000, 'หนึ่งล้าน'],
  [10000000, 'สิบล้าน'],
  [100000000, 'หนึ่งร้อยล้าน'],
  [1000000000, 'หนึ่งพันล้าน'],
];

describe('Test Powers of Ten (Thai System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'ศูนย์'],
  [1n, 'หนึ่ง'],
  [100n, 'หนึ่งร้อย'],
  [1000n, 'หนึ่งพัน'],
  [10000n, 'หนึ่งหมื่น'],
  [100000n, 'หนึ่งแสน'],
  [1000000n, 'หนึ่งล้าน'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'ลบหนึ่ง'],
  [-100n, 'ลบหนึ่งร้อย'],
  [-1000n, 'ลบหนึ่งพัน'],
  [-10000n, 'ลบหนึ่งหมื่น'],
  [-1000000n, 'ลบหนึ่งล้าน'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'ศูนย์'],
  ['1', 'หนึ่ง'],
  ['100', 'หนึ่งร้อย'],
  ['1000', 'หนึ่งพัน'],
  ['-100', 'ลบหนึ่งร้อย'],
  ['  100  ', 'หนึ่งร้อย'],
  ['1000000', 'หนึ่งล้าน'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('ศูนย์');
  });

  test('converts -0 as ศูนย์', () => {
    expect(toWords.convert(-0)).toBe('ศูนย์');
  });

  test('converts 0.0 as ศูนย์', () => {
    expect(toWords.convert(0.0)).toBe('ศูนย์');
  });

  test('converts 0n as ศูนย์', () => {
    expect(toWords.convert(0n)).toBe('ศูนย์');
  });

  test('converts "0" as ศูนย์', () => {
    expect(toWords.convert('0')).toBe('ศูนย์');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ศูนย์บาทถ้วน');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for th-TH', () => {
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

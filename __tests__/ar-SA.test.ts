import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arSa from '../src/locales/ar-SA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ar-SA.js';

const localeCode = 'ar-SA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arSa);
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
  [0, 'صفر'],
  [1, 'واحد'],
  [2, 'اثنان'],
  [3, 'ثلاثة'],
  [4, 'أربعة'],
  [5, 'خمسة'],
  [6, 'ستة'],
  [7, 'سبعة'],
  [8, 'ثمانية'],
  [9, 'تسعة'],
  [10, 'عشرة'],
  [11, 'أحد عشر'],
  [12, 'اثنا عشر'],
  [13, 'ثلاثة عشر'],
  [14, 'أربعة عشر'],
  [15, 'خمسة عشر'],
  [16, 'ستة عشر'],
  [17, 'سبعة عشر'],
  [18, 'ثمانية عشر'],
  [19, 'تسعة عشر'],
  [20, 'عشرون'],
  [21, 'واحد وعشرون'],
  [25, 'خمسة وعشرون'],
  [30, 'ثلاثون'],
  [42, 'اثنان وأربعون'],
  [50, 'خمسون'],
  [99, 'تسعة وتسعون'],
  [100, 'مائة'],
  [137, 'مائة وسبعة وثلاثون'],
  [200, 'مائتان'],
  [300, 'ثلاثمائة'],
  [500, 'خمسمائة'],
  [700, 'سبعمائة'],
  [999, 'تسعمائة وتسعة وتسعون'],
  [1000, 'ألف'],
  [1001, 'ألف وواحد'],
  [1234, 'ألف ومائتان وأربعة وثلاثون'],
  [4680, 'أربعة آلاف وستمائة وثمانون'],
  [10000, 'عشرة آلاف'],
  [63892, 'ثلاثة وستون ألفًا وثمانمائة واثنان وتسعون'],
  [100000, 'مائة ألف'],
  [792581, 'سبعمائة واثنان وتسعون ألفًا وخمسمائة وواحد وثمانون'],
  [1000000, 'مليون'],
  [2741034, 'مليونان وسبعمائة وواحد وأربعون ألفًا وأربعة وثلاثون'],
  [86429753, 'ستة وثمانون مليونًا وأربعمائة وتسعة وعشرون ألفًا وسبعمائة وثلاثة وخمسون'],
  [975310864, 'تسعمائة وخمسة وسبعون مليونًا وثلاثمائة وعشرة آلاف وثمانمائة وأربعة وستون'],
  [1000000000, 'مليار'],
  [9876543210, 'تسعة مليارات وثمانمائة وستة وسبعون مليونًا وخمسمائة وثلاثة وأربعون ألفًا ومائتان وعشرة'],
  [98765432101, 'ثمانية وتسعون مليارًا وسبعمائة وخمسة وستون مليونًا وأربعمائة واثنان وثلاثون ألفًا ومائة وواحد'],
  [987654321012, 'تسعمائة وسبعة وثمانون مليارًا وستمائة وأربعة وخمسون مليونًا وثلاثمائة وواحد وعشرون ألفًا واثنا عشر'],
  [
    9876543210123,
    'تسعة تريليونات وثمانمائة وستة وسبعون مليارًا وخمسمائة وثلاثة وأربعون مليونًا ومائتان وعشرة آلاف ومائة وثلاثة وعشرون',
  ],
  [
    98765432101234,
    'ثمانية وتسعون تريليونًا وسبعمائة وخمسة وستون مليارًا وأربعمائة واثنان وثلاثون مليونًا ومائة وواحد ألف ومائتان وأربعة وثلاثون',
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
    row[1] = `سالب ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'صفر'],
  [0.4, 'صفر فاصلة أربعة'],
  [0.04, 'صفر فاصلة صفر أربعة'],
  [0.63, 'صفر فاصلة ثلاثة وستون'],
  [0.973, 'صفر فاصلة تسعمائة وثلاثة وسبعون'],
  [0.999, 'صفر فاصلة تسعمائة وتسعة وتسعون'],
  [37.06, 'سبعة وثلاثون فاصلة صفر ستة'],
  [37.68, 'سبعة وثلاثون فاصلة ثمانية وستون'],
  [37.683, 'سبعة وثلاثون فاصلة ستمائة وثلاثة وثمانون'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `فقط مائة وثلاثة وعشرون ريالًا لا غير`],
    ['123', `فقط مائة وثلاثة وعشرون ريالًا لا غير`],
    ['123.0', `فقط مائة وثلاثة وعشرون ريالًا وصفر هللة لا غير`],
    ['123.00', `فقط مائة وثلاثة وعشرون ريالًا وصفر هللة لا غير`],
    ['0.00', `فقط صفر ريال وصفر هللة لا غير`],
    ['-123.00', `فقط سالب مائة وثلاثة وعشرون ريالًا وصفر هللة لا غير`],
    ['37.68', `فقط سبعة وثلاثون ريالًا وثمان وستون هللةً لا غير`],
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
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'فقط صفر ريال لا غير'],
  [0.04, 'فقط صفر ريال وأربع هللات لا غير'],
  [0.4, 'فقط صفر ريال وأربعون هللةً لا غير'],
  [0.63, 'فقط صفر ريال وثلاث وستون هللةً لا غير'],
  [0.973, 'فقط صفر ريال وسبع وتسعون هللةً لا غير'],
  [0.999, 'فقط ريال واحد لا غير'],
  [1, 'فقط ريال واحد لا غير'],
  [2, 'فقط ريالان لا غير'],
  [3, 'فقط ثلاثة ريالات لا غير'],
  [37.06, 'فقط سبعة وثلاثون ريالًا وست هللات لا غير'],
  [37.68, 'فقط سبعة وثلاثون ريالًا وثمان وستون هللةً لا غير'],
  [37.683, 'فقط سبعة وثلاثون ريالًا وثمان وستون هللةً لا غير'],
  [100, 'فقط مائة ريال لا غير'],
  [500.25, 'فقط خمسمائة ريال وخمس وعشرون هللةً لا غير'],
  [1000.5, 'فقط ألف ريال وخمسون هللةً لا غير'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace('صفر ريال و', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, 'فقط صفر ريال لا غير'];
      case value >= 1 && value < 2:
        return [value, 'فقط ريال واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط ريالان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة ريالات لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون ريالًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة ريال لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة ريال لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'فقط ألف ريال لا غير'];
      default:
        return row;
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, ''];
      case value >= 1 && value < 2:
        return [value, 'فقط ريال واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط ريالان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة ريالات لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون ريالًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة ريال لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة ريال لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'فقط ألف ريال لا غير'];
      default:
        return row;
    }
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

describe('Ordinal Tests', () => {
  const toWordsOrdinal = new ToWords({
    localeCode: 'ar-SA',
  });

  const testOrdinals: [number, string][] = [
    // Numbers 1-10
    [1, 'الأول'],
    [2, 'الثاني'],
    [3, 'الثالث'],
    [4, 'الرابع'],
    [5, 'الخامس'],
    [6, 'السادس'],
    [7, 'السابع'],
    [8, 'الثامن'],
    [9, 'التاسع'],
    [10, 'العاشر'],
    // Numbers 11-20
    [11, 'الحادي عشر'],
    [12, 'الثاني عشر'],
    [13, 'الثالث عشر'],
    [14, 'الرابع عشر'],
    [15, 'الخامس عشر'],
    [16, 'السادس عشر'],
    [17, 'السابع عشر'],
    [18, 'الثامن عشر'],
    [19, 'التاسع عشر'],
    [20, 'العشرون'],
    // Composite numbers
    [21, 'الحادي والعشرون'],
    [25, 'الخامس والعشرون'],
    [30, 'الثلاثون'],
    [42, 'الثاني والأربعون'],
    [50, 'الخمسون'],
    [99, 'التاسع والتسعون'],
    // Round numbers
    [100, 'المائة'],
    [1000, 'الألف'],
    [1000000, 'المليون'],
    // Complex numbers
    [123, 'مائة والثالث والعشرون'],
    [1001, 'ألف والأول'],
  ];

  test.each(testOrdinals)('Number: %d => %s', (input, expected) => {
    expect(toWordsOrdinal.toOrdinal(input as number)).toBe(expected);
  });

  test('should throw error for negative numbers', () => {
    expect(() => toWordsOrdinal.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWordsOrdinal.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR ar-SA
// ============================================================

// Powers of Ten (Arabic)
const testPowersOfTen: [number, string][] = [
  [10, 'عشرة'],
  [100, 'مائة'],
  [1000, 'ألف'],
  [10000, 'عشرة آلاف'],
  [100000, 'مائة ألف'],
  [1000000, 'مليون'],
  [10000000, 'عشرة ملايين'],
  [100000000, 'مائة مليون'],
  [1000000000, 'مليار'],
  [10000000000, 'عشرة مليارات'],
  [100000000000, 'مائة مليار'],
  [1000000000000, 'تريليون'],
];

describe('Test Powers of Ten (Arabic System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'تسعة وتسعون'],
  [100, 'مائة'],
  [101, 'مائة وواحد'],
  [999, 'تسعمائة وتسعة وتسعون'],
  [1000, 'ألف'],
  [1001, 'ألف وواحد'],
  [9999, 'تسعة آلاف وتسعمائة وتسعة وتسعون'],
  [10000, 'عشرة آلاف'],
  [99999, 'تسعة وتسعون ألفًا وتسعمائة وتسعة وتسعون'],
  [100000, 'مائة ألف'],
  [1000000, 'مليون'],
  [1000001, 'مليون وواحد'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Numbers
const testNegativeInts: [number, string][] = [
  [-1, 'سالب واحد'],
  [-10, 'سالب عشرة'],
  [-100, 'سالب مائة'],
  [-1000, 'سالب ألف'],
  [-1000000, 'سالب مليون'],
];

describe('Test Negative Integers', () => {
  test.concurrent.each(testNegativeInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'سالب صفر فاصلة خمسة'],
  [-0.99, 'سالب صفر فاصلة تسعة وتسعون'],
  [-1.5, 'سالب واحد فاصلة خمسة'],
  [-3.14, 'سالب ثلاثة فاصلة أربعة عشر'],
  [-99.99, 'سالب تسعة وتسعون فاصلة تسعة وتسعون'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'صفر'],
  [1n, 'واحد'],
  [100n, 'مائة'],
  [1000n, 'ألف'],
  [1000000n, 'مليون'],
  [1000000000n, 'مليار'],
  [1000000000000n, 'تريليون'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'سالب واحد'],
  [-100n, 'سالب مائة'],
  [-1000n, 'سالب ألف'],
  [-1000000n, 'سالب مليون'],
  [-1000000000n, 'سالب مليار'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'فقط صفر ريال لا غير'],
  [1n, 'فقط ريال واحد لا غير'],
  [2n, 'فقط ريالان لا غير'],
  [100n, 'فقط مائة ريال لا غير'],
  [1000n, 'فقط ألف ريال لا غير'],
  [1000000n, 'فقط مليون ريال لا غير'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'صفر'],
  ['1', 'واحد'],
  ['100', 'مائة'],
  ['1000', 'ألف'],
  ['-100', 'سالب مائة'],
  ['3.14', 'ثلاثة فاصلة أربعة عشر'],
  ['-3.14', 'سالب ثلاثة فاصلة أربعة عشر'],
  ['  100  ', 'مائة'],
  ['1000000', 'مليون'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('صفر');
  });

  test('converts -0 as صفر', () => {
    expect(toWords.convert(-0)).toBe('صفر');
  });

  test('converts 0.0 as صفر', () => {
    expect(toWords.convert(0.0)).toBe('صفر');
  });

  test('converts 0n as صفر', () => {
    expect(toWords.convert(0n)).toBe('صفر');
  });

  test('converts "0" as صفر', () => {
    expect(toWords.convert('0')).toBe('صفر');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('فقط صفر ريال لا غير');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Tests
describe('Test Currency', () => {
  test('1 Riyal', () => {
    expect(toWords.convert(1, { currency: true })).toBe('فقط ريال واحد لا غير');
  });

  test('2 Riyals', () => {
    expect(toWords.convert(2, { currency: true })).toBe('فقط ريالان لا غير');
  });

  test('100 Riyals', () => {
    expect(toWords.convert(100, { currency: true })).toBe('فقط مائة ريال لا غير');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('فقط مائة ريال وخمسون هللةً لا غير');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('مائة ريال وخمسون هللةً');
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('فقط مائة ريال لا غير');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe('مائة ريال');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for ar-SA', () => {
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

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arSa from '../src/locales/ar-SA';

const localeCode = 'ar-SA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arSa);
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
  [21, 'واحد و عشرون'],
  [25, 'خمسة و عشرون'],
  [30, 'ثلاثون'],
  [42, 'اثنان و أربعون'],
  [50, 'خمسون'],
  [99, 'تسعة و تسعون'],
  [100, 'مائة'],
  [137, 'مائة و سبعة و ثلاثون'],
  [200, 'مائتان'],
  [300, 'ثلاثمائة'],
  [500, 'خمسمائة'],
  [700, 'سبعمائة'],
  [999, 'تسعمائة و تسعة و تسعون'],
  [1000, 'ألف'],
  [1001, 'ألف و واحد'],
  [1234, 'ألف و مائتان و أربعة و ثلاثون'],
  [4680, 'أربعة آلاف و ستمائة و ثمانون'],
  [10000, 'عشرة آلاف'],
  [63892, 'ثلاثة و ستون ألف و ثمانمائة و اثنان و تسعون'],
  [100000, 'مائة ألف'],
  [792581, 'سبعمائة و اثنان و تسعون ألف و خمسمائة و واحد و ثمانون'],
  [1000000, 'مليون'],
  [2741034, 'مليونان و سبعمائة و واحد و أربعون ألف و أربعة و ثلاثون'],
  [86429753, 'ستة و ثمانون مليون و أربعمائة و تسعة و عشرون ألف و سبعمائة و ثلاثة و خمسون'],
  [975310864, 'تسعمائة و خمسة و سبعون مليون و ثلاثمائة و عشرة آلاف و ثمانمائة و أربعة و ستون'],
  [1000000000, 'مليار'],
  [9876543210, 'تسعة مليارات و ثمانمائة و ستة و سبعون مليون و خمسمائة و ثلاثة و أربعون ألف و مائتان و عشرة'],
  [98765432101, 'ثمانية و تسعون مليار و سبعمائة و خمسة و ستون مليون و أربعمائة و اثنان و ثلاثون ألف و مائة و واحد'],
  [
    987654321012,
    'تسعمائة و سبعة و ثمانون مليار و ستمائة و أربعة و خمسون مليون و ثلاثمائة و واحد و عشرون ألف و اثنا عشر',
  ],
  [
    9876543210123,
    'تسعة تريليونات و ثمانمائة و ستة و سبعون مليار و خمسمائة و ثلاثة و أربعون مليون و مائتان و عشرة آلاف و مائة و ثلاثة و عشرون',
  ],
  [
    98765432101234,
    'ثمانية و تسعون تريليون و سبعمائة و خمسة و ستون مليار و أربعمائة و اثنان و ثلاثون مليون و مائة و واحد ألف و مائتان و أربعة و ثلاثون',
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

const testFloats = [
  [0.0, 'صفر'],
  [0.4, 'صفر فاصلة أربعة'],
  [0.04, 'صفر فاصلة صفر أربعة'],
  [0.63, 'صفر فاصلة ثلاثة و ستون'],
  [0.973, 'صفر فاصلة تسعمائة و ثلاثة و سبعون'],
  [0.999, 'صفر فاصلة تسعمائة و تسعة و تسعون'],
  [37.06, 'سبعة و ثلاثون فاصلة صفر ستة'],
  [37.68, 'سبعة و ثلاثون فاصلة ثمانية و ستون'],
  [37.683, 'سبعة و ثلاثون فاصلة ستمائة و ثلاثة و ثمانون'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'صفر ريال فقط لا غير'],
  [0.04, 'صفر ريال و أربع هللات فقط لا غير'],
  [0.4, 'صفر ريال و أربعون هللة فقط لا غير'],
  [0.63, 'صفر ريال و ثلاثة و ستون هللة فقط لا غير'],
  [0.973, 'صفر ريال و سبعة و تسعون هللة فقط لا غير'],
  [0.999, 'ريال واحد فقط لا غير'],
  [1, 'ريال واحد فقط لا غير'],
  [2, 'ريالان فقط لا غير'],
  [3, 'ثلاثة ريالات فقط لا غير'],
  [37.06, 'سبعة و ثلاثون ريال و ست هللات فقط لا غير'],
  [37.68, 'سبعة و ثلاثون ريال و ثمانية و ستون هللة فقط لا غير'],
  [37.683, 'سبعة و ثلاثون ريال و ثمانية و ستون هللة فقط لا غير'],
  [100, 'مائة ريال فقط لا غير'],
  [500.25, 'خمسمائة ريال و خمسة و عشرون هللة فقط لا غير'],
  [1000.5, 'ألف ريال و خمسون هللة فقط لا غير'],
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
      row[1] = (row[1] as string).replace('صفر ريال و ', '');
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
        return [value, 'صفر ريال فقط لا غير'];
      case value >= 1 && value < 2:
        return [value, 'ريال واحد فقط لا غير'];
      case value >= 2 && value < 3:
        return [value, 'ريالان فقط لا غير'];
      case value >= 3 && value < 4:
        return [value, 'ثلاثة ريالات فقط لا غير'];
      case value >= 37 && value < 38:
        return [value, 'سبعة و ثلاثون ريال فقط لا غير'];
      case value >= 100 && value < 101:
        return [value, 'مائة ريال فقط لا غير'];
      case value >= 500 && value < 501:
        return [value, 'خمسمائة ريال فقط لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'ألف ريال فقط لا غير'];
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
        return [value, 'ريال واحد فقط لا غير'];
      case value >= 2 && value < 3:
        return [value, 'ريالان فقط لا غير'];
      case value >= 3 && value < 4:
        return [value, 'ثلاثة ريالات فقط لا غير'];
      case value >= 37 && value < 38:
        return [value, 'سبعة و ثلاثون ريال فقط لا غير'];
      case value >= 100 && value < 101:
        return [value, 'مائة ريال فقط لا غير'];
      case value >= 500 && value < 501:
        return [value, 'خمسمائة ريال فقط لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'ألف ريال فقط لا غير'];
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
    [21, 'واحد و عشرون'],
    [25, 'خمسة و عشرون'],
    [30, 'الثلاثون'],
    [42, 'اثنان و أربعون'],
    [50, 'الخمسون'],
    [99, 'تسعة و تسعون'],
    // Round numbers
    [100, 'المائة'],
    [1000, 'الألف'],
    [1000000, 'المليون'],
    // Complex numbers
    [123, 'مائة و ثلاثة و عشرون'],
    [1001, 'ألف و الأول'],
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

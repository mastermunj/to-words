import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arMa from '../src/locales/ar-MA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ar-MA.js';

const localeCode = 'ar-MA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arMa);
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
    [123, `فقط مائة وثلاثة وعشرون درهمًا لا غير`],
    ['123', `فقط مائة وثلاثة وعشرون درهمًا لا غير`],
    ['123.0', `فقط مائة وثلاثة وعشرون درهمًا وصفر سنتيم لا غير`],
    ['123.00', `فقط مائة وثلاثة وعشرون درهمًا وصفر سنتيم لا غير`],
    ['0.00', `فقط صفر درهم وصفر سنتيم لا غير`],
    ['-123.00', `فقط سالب مائة وثلاثة وعشرون درهمًا وصفر سنتيم لا غير`],
    ['37.68', `فقط سبعة وثلاثون درهمًا وثمانية وستون سنتيمًا لا غير`],
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
  [0.0, 'فقط صفر درهم لا غير'],
  [0.04, 'فقط صفر درهم وأربعة سنتيمات لا غير'],
  [0.4, 'فقط صفر درهم وأربعون سنتيمًا لا غير'],
  [0.63, 'فقط صفر درهم وثلاثة وستون سنتيمًا لا غير'],
  [0.973, 'فقط صفر درهم وسبعة وتسعون سنتيمًا لا غير'],
  [0.999, 'فقط درهم واحد لا غير'],
  [1, 'فقط درهم واحد لا غير'],
  [2, 'فقط درهمان لا غير'],
  [3, 'فقط ثلاثة دراهم لا غير'],
  [37.06, 'فقط سبعة وثلاثون درهمًا وستة سنتيمات لا غير'],
  [37.68, 'فقط سبعة وثلاثون درهمًا وثمانية وستون سنتيمًا لا غير'],
  [37.683, 'فقط سبعة وثلاثون درهمًا وثمانية وستون سنتيمًا لا غير'],
  [100, 'فقط مائة درهم لا غير'],
  [500.25, 'فقط خمسمائة درهم وخمسة وعشرون سنتيمًا لا غير'],
  [1000.5, 'فقط ألف درهم وخمسون سنتيمًا لا غير'],
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
      row[1] = (row[1] as string).replace('صفر درهم و', '');
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
        return [value, 'فقط صفر درهم لا غير'];
      case value >= 1 && value < 2:
        return [value, 'فقط درهم واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط درهمان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة دراهم لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون درهمًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة درهم لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة درهم لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'فقط ألف درهم لا غير'];
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
        return [value, 'فقط درهم واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط درهمان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة دراهم لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون درهمًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة درهم لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة درهم لا غير'];
      case value >= 1000 && value < 1001:
        return [value, 'فقط ألف درهم لا غير'];
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
    localeCode: 'ar-MA',
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
    // From 100th up: the ordinal of the last two digits, then each larger group after «بعد»
    // (mawdoo3 «شرح العدد الترتيبي»; «الحديث الحادي والعشرون بعد المائة», Ibn al-Jawzi).
    [101, 'الأول بعد المائة'],
    [121, 'الحادي والعشرون بعد المائة'],
    [200, 'المائتان'],
    [201, 'الأول بعد المائتين'],
    [1100, 'المائة بعد الألف'],
    [1234, 'الرابع والثلاثون بعد المائتين بعد الألف'],
    [2000, 'الألفان'],
    [2021, 'الحادي والعشرون بعد الألفين'],
    // Complex numbers
    [123, 'الثالث والعشرون بعد المائة'],
    [1001, 'الأول بعد الألف'],
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

describe('Powers of Ten', () => {
  const powersOfTen: [number, string][] = [
    [10, 'عشرة'],
    [100, 'مائة'],
    [1000, 'ألف'],
    [10000, 'عشرة آلاف'],
    [100000, 'مائة ألف'],
    [1000000, 'مليون'],
  ];

  test.concurrent.each(powersOfTen)('convert %d => %s', async (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('BigInt Tests', () => {
  const bigIntTests: [bigint, string][] = [
    [0n, 'صفر'],
    [1n, 'واحد'],
    [100n, 'مائة'],
    [1000n, 'ألف'],
    [1000000n, 'مليون'],
  ];

  test.concurrent.each(bigIntTests)('convert %d => %s', async (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Negative BigInt Tests', () => {
  const negativeBigIntTests: [bigint, string][] = [
    [-1n, 'سالب واحد'],
    [-100n, 'سالب مائة'],
    [-1000n, 'سالب ألف'],
  ];

  test.concurrent.each(negativeBigIntTests)('convert %d => %s', async (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('String Input Tests', () => {
  const stringInputTests: [string, string][] = [
    ['0', 'صفر'],
    ['1', 'واحد'],
    ['100', 'مائة'],
    ['-100', 'سالب مائة'],
  ];

  test.concurrent.each(stringInputTests)('convert %s => %s', async (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Zero Variants', () => {
  test('converts 0', () => {
    expect(toWords.convert(0)).toBe('صفر');
  });

  test('converts -0', () => {
    expect(toWords.convert(-0)).toBe('صفر');
  });

  test('converts 0.0', () => {
    expect(toWords.convert(0.0)).toBe('صفر');
  });

  test('converts 0n', () => {
    expect(toWords.convert(0n)).toBe('صفر');
  });

  test('converts "0"', () => {
    expect(toWords.convert('0')).toBe('صفر');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('فقط صفر درهم لا غير');
  });
});

describe('Invalid Input Tests', () => {
  const invalidInputTests: [unknown, string][] = [
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(invalidInputTests)('convert %s throws error', async (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
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

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  // This script has no capital letters, so every casing leaves the output unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'واحد وعشرون'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'واحد وعشرون'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'فقط واحد وعشرون درهمًا وخمسون سنتيمًا لا غير',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'فقط واحد وعشرون درهمًا وخمسون سنتيمًا لا غير',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'فقط واحد وعشرون درهمًا وخمسون سنتيمًا لا غير',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'فقط واحد وعشرون درهمًا وخمسون سنتيمًا لا غير',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'فقط واحد وعشرون درهمًا وخمسون سنتيمًا لا غير',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'الحادي والعشرون'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'الحادي والعشرون',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'واحد فاصلة خمسة وعشرون'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'واحد فاصلة اثنان خمسة',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

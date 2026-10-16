import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arEg from '../src/locales/ar-EG.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ar-EG.js';

const localeCode = 'ar-EG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arEg);
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
  [10, 'عشرة'],
  [11, 'أحد عشر'],
  [20, 'عشرون'],
  [21, 'واحد وعشرون'],
  [100, 'مائة'],
  [137, 'مائة وسبعة وثلاثون'],
  [200, 'مائتان'],
  [1000, 'ألف'],
  [1234, 'ألف ومائتان وأربعة وثلاثون'],
  [4680, 'أربعة آلاف وستمائة وثمانون'],
  [63892, 'ثلاثة وستون ألفًا وثمانمائة واثنان وتسعون'],
  [1000000, 'مليون'],
  [2741034, 'مليونان وسبعمائة وواحد وأربعون ألفًا وأربعة وثلاثون'],
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

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'فقط صفر جنيه مصري لا غير'],
  [0.04, 'فقط صفر جنيه مصري وأربعة قروش لا غير'],
  [0.4, 'فقط صفر جنيه مصري وأربعون قرشًا لا غير'],
  [0.63, 'فقط صفر جنيه مصري وثلاثة وستون قرشًا لا غير'],
  [0.999, 'فقط جنيه مصري واحد لا غير'],
  [1, 'فقط جنيه مصري واحد لا غير'],
  [2, 'فقط جنيهان مصريان لا غير'],
  [3, 'فقط ثلاثة جنيهات مصرية لا غير'],
  [37.06, 'فقط سبعة وثلاثون جنيهًا مصريًا وستة قروش لا غير'],
  [37.68, 'فقط سبعة وثلاثون جنيهًا مصريًا وثمانية وستون قرشًا لا غير'],
  [100, 'فقط مائة جنيه مصري لا غير'],
  [500.25, 'فقط خمسمائة جنيه مصري وخمسة وعشرون قرشًا لا غير'],
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
      row[1] = (row[1] as string).replace('صفر جنيه مصري و', '');
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
        return [value, 'فقط صفر جنيه مصري لا غير'];
      case value >= 1 && value < 2:
        return [value, 'فقط جنيه مصري واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط جنيهان مصريان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة جنيهات مصرية لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون جنيهًا مصريًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة جنيه مصري لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة جنيه مصري لا غير'];
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
        return [value, 'فقط جنيه مصري واحد لا غير'];
      case value >= 2 && value < 3:
        return [value, 'فقط جنيهان مصريان لا غير'];
      case value >= 3 && value < 4:
        return [value, 'فقط ثلاثة جنيهات مصرية لا غير'];
      case value >= 37 && value < 38:
        return [value, 'فقط سبعة وثلاثون جنيهًا مصريًا لا غير'];
      case value >= 100 && value < 101:
        return [value, 'فقط مائة جنيه مصري لا غير'];
      case value >= 500 && value < 501:
        return [value, 'فقط خمسمائة جنيه مصري لا غير'];
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

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `فقط مائة وثلاثة وعشرون جنيهًا مصريًا لا غير`],
    ['123', `فقط مائة وثلاثة وعشرون جنيهًا مصريًا لا غير`],
    ['123.0', `فقط مائة وثلاثة وعشرون جنيهًا مصريًا وصفر قرش لا غير`],
    ['123.00', `فقط مائة وثلاثة وعشرون جنيهًا مصريًا وصفر قرش لا غير`],
    ['0.00', `فقط صفر جنيه مصري وصفر قرش لا غير`],
    ['-123.00', `فقط سالب مائة وثلاثة وعشرون جنيهًا مصريًا وصفر قرش لا غير`],
    ['37.68', `فقط سبعة وثلاثون جنيهًا مصريًا وثمانية وستون قرشًا لا غير`],
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

const testFloats: [number, string][] = [
  [0.0, 'صفر'],
  [0.4, 'صفر فاصلة أربعة'],
  [0.04, 'صفر فاصلة صفر أربعة'],
  [0.63, 'صفر فاصلة ثلاثة وستون'],
  [0.973, 'صفر فاصلة تسعمائة وثلاثة وسبعون'],
  [37.06, 'سبعة وثلاثون فاصلة صفر ستة'],
  [37.68, 'سبعة وثلاثون فاصلة ثمانية وستون'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Ordinal Tests', () => {
  const toWordsOrdinal = new ToWords({
    localeCode: 'ar-EG',
  });

  const testOrdinals: [number, string][] = [
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
    [11, 'الحادي عشر'],
    [12, 'الثاني عشر'],
    [13, 'الثالث عشر'],
    [14, 'الرابع عشر'],
    [15, 'الخامس عشر'],
    [20, 'العشرون'],
    [30, 'الثلاثون'],
    [50, 'الخمسون'],
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

describe('Test Locale functional exports', () => {
  test('localeToWords works', () => {
    expect(localeToWords(1)).toBe('واحد');
  });

  test('localeToOrdinal works', () => {
    expect(localeToOrdinal(1)).toBe('الأول');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(1)).toBe('فقط جنيه مصري واحد لا غير');
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
      'فقط واحد وعشرون جنيهًا مصريًا وخمسون قرشًا لا غير',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'فقط واحد وعشرون جنيهًا مصريًا وخمسون قرشًا لا غير',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'فقط واحد وعشرون جنيهًا مصريًا وخمسون قرشًا لا غير',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'فقط واحد وعشرون جنيهًا مصريًا وخمسون قرشًا لا غير',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'فقط واحد وعشرون جنيهًا مصريًا وخمسون قرشًا لا غير',
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

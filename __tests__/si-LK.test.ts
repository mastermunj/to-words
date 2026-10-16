import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import siLk from '../src/locales/si-LK.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/si-LK.js';

const localeCode = 'si-LK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(siLk);
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
  [0, 'ශූන්‍ය'],
  [1, 'එක'],
  [2, 'දෙක'],
  [3, 'තුන'],
  [4, 'හතර'],
  [5, 'පහ'],
  [6, 'හය'],
  [7, 'හත'],
  [8, 'අට'],
  [9, 'නවය'],
  [10, 'දහය'],
  [11, 'එකොළහ'],
  [12, 'දොළහ'],
  [13, 'දහතුන'],
  [14, 'දාහතර'],
  [15, 'පහළොව'],
  [16, 'දහසය'],
  [17, 'දහහත'],
  [18, 'දහඅට'],
  [19, 'දහනවය'],
  [20, 'විස්ස'],
  [21, 'විසි එක'],
  [25, 'විසි පහ'],
  [30, 'තිහ'],
  [40, 'හතලිහ'],
  [50, 'පනහ'],
  [60, 'හැට'],
  [70, 'හැත්තෑව'],
  [80, 'අසූව'],
  [90, 'අනූව'],
  [99, 'අනූ නවය'],
  [100, 'සියය'],
  [101, 'එකසිය එක'],
  [137, 'එකසිය තිස් හත'],
  [200, 'දෙසිය'],
  [500, 'පන්සියය'],
  [700, 'හත්සීය'],
  [999, 'නවසිය අනූ නවය'],
  [1000, 'දහස'],
  [1001, 'දහස් එක'],
  [1100, 'දහස් සියය'],
  [2000, 'දෙදහස'],
  [4680, 'හාරදහස් හයසිය අසූව'],
  [10000, 'දස දහස'],
  [50000, 'පනහ දහස'],
  [100000, 'ලක්ෂය'],
  [200000, 'දෙ ලක්ෂය'],
  [250000, 'දෙ ලක්ෂය පනහ දහස'],
  [500000, 'පන් ලක්ෂය'],
  [1000000, 'එක් මිලියනය'],
  [5000000, 'පන් මිලියනය'],
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
    row[1] = `ඍණ ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[0] === 1 ? 'රුපියල' : 'රුපියල්'} ${row[1]}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testData = [
    [-1, 'ඍණ රුපියල එක'],
    [-10, 'ඍණ රුපියල් දහය'],
    [-100, 'ඍණ රුපියල් සියය'],
    [-1000, 'ඍණ රුපියල් දහස'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [0, ''],
    [5, 'රුපියල් පහ'],
    [100, 'රුපියල් සියය'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.5, 'ශූන්‍ය දශම පහ'],
  [1.5, 'එක දශම පහ'],
  [10.5, 'දහය දශම පහ'],
  [12.34, 'දොළහ දශම තිස් හතර'],
  [37.68, 'තිස් හත දශම හැට අට'],
  [0.04, 'ශූන්‍ය දශම ශූන්‍ය හතර'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `රුපියල් එකසිය විසි තුන`],
    ['123', `රුපියල් එකසිය විසි තුන`],
    ['123.0', `රුපියල් එකසිය විසි තුන සහ සත ශූන්‍ය`],
    ['123.00', `රුපියල් එකසිය විසි තුන සහ සත ශූන්‍ය`],
    ['0.00', `රුපියල් ශූන්‍ය සහ සත ශූන්‍ය`],
    ['-123.00', `ඍණ රුපියල් එකසිය විසි තුන සහ සත ශූන්‍ය`],
    ['37.68', `රුපියල් තිස් හත සහ සත හැට අට`],
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

const testFloatsWithCurrency = [
  [0.5, 'රුපියල් ශූන්‍ය සහ සත පනහ'],
  [1.5, 'රුපියල එක සහ සත පනහ'],
  [37.68, 'රුපියල් තිස් හත සහ සත හැට අට'],
  [0.04, 'රුපියල් ශූන්‍ය සහ සත හාර'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [1.5, 'රුපියල එක සහ සත පනහ'],
    [37.68, 'රුපියල් තිස් හත සහ සත හැට අට'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testData = [
    [10.99, 'රුපියල් දහය'],
    [37.68, 'රුපියල් තිස් හත'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

describe('Test Ordinal', () => {
  test('toOrdinal handles irregular first ordinals', () => {
    expect(toWords.toOrdinal(1)).toBe('පළමු');
    expect(toWords.toOrdinal(2)).toBe('දෙවෙනි');
    expect(toWords.toOrdinal(3)).toBe('තෙවෙනි');
  });

  test('toOrdinal uses suffix for other values', () => {
    expect(localeToOrdinal(4)).toBe('හතරවැනි');
    expect(localeToOrdinal(21)).toBe('විසි එකවැනි');
  });
});

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(11)).toBe('එකොළහ');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(100)).toBe('රුපියල් සියය');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  // This script has no capital letters, so every casing leaves the output unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'විසි එක'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'විසි එක'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), 'රුපියල් විසි එක සහ සත පනහ'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), 'රුපියල් විසි එක සහ සත පනහ'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), 'රුපියල් විසි එක සහ සත පනහ'],
    ["casing 'natural'", () => styled.convert(21.5, { currency: true, casing: 'natural' }), 'රුපියල් විසි එක සහ සත පනහ'],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'රුපියල් විසි එක සහ සත පනහ',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'විසි එකවැනි'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'විසි එකවැනි',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'එක දශම විසි පහ'],
    ["decimalStyle 'digit-by-digit'", () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }), 'එක දශම දෙක පහ'],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

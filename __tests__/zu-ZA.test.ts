import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import zuZa from '../src/locales/zu-ZA.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/zu-ZA.js';

const localeCode = 'zu-ZA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(zuZa);
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

// NOTE: The connector particle (Na) used for compound numbers (21–99) is an
// approximation. Fully correct Zulu connector forms (nanye, nambili, etc.) require
// explicit 21–99 mappings, tracked in docs/locale-backlog.md.
const testIntegers: [number, string][] = [
  [0, 'Iqanda'],
  [1, 'Kunye'],
  [2, 'Kubili'],
  [3, 'Kuthathu'],
  [4, 'Kune'],
  [5, 'Kuhlanu'],
  [6, 'Isithupha'],
  [7, 'Isikhombisa'],
  [8, 'Isishiyagalombili'],
  [9, 'Isishiyagalolunye'],
  [10, 'Ishumi'],
  [11, 'Ishumi Nanye'],
  [12, 'Ishumi Nambili'],
  [13, 'Ishumi Nantathu'],
  [14, 'Ishumi Nane'],
  [15, 'Ishumi Nanhlanu'],
  [16, 'Ishumi Nesithupha'],
  [17, 'Ishumi Nesikhombisa'],
  [18, 'Ishumi Nesishiyagalombili'],
  [19, 'Ishumi Nesishiyagalolunye'],
  [20, 'Amashumi Amabili'],
  [21, 'Amashumi Amabili Na Kunye'],
  [22, 'Amashumi Amabili Na Kubili'],
  [30, 'Amashumi Amathathu'],
  [31, 'Amashumi Amathathu Na Kunye'],
  [40, 'Amashumi Amane'],
  [50, 'Amashumi Amahlanu'],
  [60, 'Amashumi Ayisithupha'],
  [70, 'Amashumi Ayisikhombisa'],
  [80, 'Amashumi Ayisishiyagalombili'],
  [90, 'Amashumi Ayisishiyagalolunye'],
  [99, 'Amashumi Ayisishiyagalolunye Na Isishiyagalolunye'],
  [100, 'Ikhulu'],
  [101, 'Ikhulu Na Kunye'],
  [110, 'Ikhulu Na Ishumi'],
  [137, 'Ikhulu Na Amashumi Amathathu Na Isikhombisa'],
  [200, 'Kubili Ikhulu'],
  [201, 'Kubili Ikhulu Na Kunye'],
  [500, 'Kuhlanu Ikhulu'],
  [999, 'Isishiyagalolunye Ikhulu Na Amashumi Ayisishiyagalolunye Na Isishiyagalolunye'],
  [1000, 'Inkulungwane'],
  [1001, 'Inkulungwane Na Kunye'],
  [1100, 'Inkulungwane Na Ikhulu'],
  [2000, 'Kubili Inkulungwane'],
  [4000, 'Kune Inkulungwane'],
  [
    63892,
    'Amashumi Ayisithupha Na Kuthathu Inkulungwane Na Isishiyagalombili Ikhulu Na Amashumi Ayisishiyagalolunye Na Kubili',
  ],
  [10000, 'Ishumi Inkulungwane'],
  [50000, 'Amashumi Amahlanu Inkulungwane'],
  [100000, 'Ikhulu Inkulungwane'],
  [500000, 'Kuhlanu Ikhulu Inkulungwane'],
  [1000000, 'Isigidi'],
  [2000000, 'Kubili Isigidi'],
  [10000000, 'Ishumi Isigidi'],
  [1000000000, 'Kunye Ibhiliyoni'],
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
    row[1] = `${row[1]} Rand`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testData = [
    [-1, 'Minus Kunye Rand'],
    [-10, 'Minus Ishumi Rand'],
    [-99, 'Minus Amashumi Ayisishiyagalolunye Na Isishiyagalolunye Rand'],
    [-1000, 'Minus Inkulungwane Rand'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [0, ''],
    [5, 'Kuhlanu Rand'],
    [100, 'Ikhulu Rand'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.5, 'Iqanda Iphoyinti Kuhlanu'],
  [1.5, 'Kunye Iphoyinti Kuhlanu'],
  [12.34, 'Ishumi Nambili Iphoyinti Amashumi Amathathu Na Kune'],
  [37.68, 'Amashumi Amathathu Na Isikhombisa Iphoyinti Amashumi Ayisithupha Na Isishiyagalombili'],
  [0.04, 'Iqanda Iphoyinti Iqanda Kune'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.5, 'Iqanda Rand Na Amashumi Amahlanu Senti'],
  [1.5, 'Kunye Rand Na Amashumi Amahlanu Senti'],
  [37.68, 'Amashumi Amathathu Na Isikhombisa Rand Na Amashumi Ayisithupha Na Isishiyagalombili Senti'],
  [0.04, 'Iqanda Rand Na Kune Senti'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testData = [
    [1.5, 'Kunye Rand Na Amashumi Amahlanu Senti'],
    [37.68, 'Amashumi Amathathu Na Isikhombisa Rand Na Amashumi Ayisithupha Na Isishiyagalombili Senti'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreZeroCurrency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testData = [
    [10.99, 'Ishumi Rand'],
    [37.68, 'Amashumi Amathathu Na Isikhombisa Rand'],
  ];

  test.concurrent.each(testData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

const testOrdinals = [
  [0, 'Kweqanda'],
  [1, 'Kwokuqala'],
  [2, 'Kwesibili'],
  [3, 'Kwathathu'],
  [4, 'Kwane'],
  [5, 'Kwehlanu'],
  [6, 'Kwesithupha'],
  [7, 'Kwesikhombisa'],
  [8, 'Kwesishiyagalombili'],
  [9, 'Kwesishiyagalolunye'],
  [10, 'Kweshumi'],
  [11, 'Kweshumi Nanye'],
  [12, 'Kweshumi Nambili'],
  [13, 'Kweshumi Nantathu'],
  [14, 'Kweshumi Nane'],
  [15, 'Kweshumi Nanhlanu'],
  [16, 'Kweshumi Nesithupha'],
  [17, 'Kweshumi Nesikhombisa'],
  [18, 'Kweshumi Nesishiyagalombili'],
  [19, 'Kweshumi Nesishiyagalolunye'],
  [20, 'Kwamashumi Amabili'],
  [21, 'Amashumi Amabili Na Kwokuqala'],
  [30, 'Kwamashumi Amathathu'],
  [50, 'Kwamashumi Amahlanu'],
  [100, 'Kwekhulu'],
  [1000, 'Kwenkulungwane'],
];

describe('Test Ordinals with options = {}', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Locale Functional API', () => {
  test('localeToWords', () => {
    expect(localeToWords(10)).toBe('Ishumi');
  });

  test('localeToOrdinal', () => {
    expect(localeToOrdinal(1)).toBe('Kwokuqala');
  });

  test('localeToCurrency', () => {
    expect(localeToCurrency(100)).toBe('Ikhulu Rand');
  });
});

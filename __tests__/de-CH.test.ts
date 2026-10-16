import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import deCh from '../src/locales/de-CH.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/de-CH.js';

const localeCode = 'de-CH';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(deCh);
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
  [0, 'Null'],
  [1, 'Eins'],
  [2, 'Zwei'],
  [3, 'Drei'],
  [4, 'Vier'],
  [5, 'Fünf'],
  [6, 'Sechs'],
  [7, 'Sieben'],
  [8, 'Acht'],
  [9, 'Neun'],
  [10, 'Zehn'],
  [11, 'Elf'],
  [12, 'Zwölf'],
  [13, 'Dreizehn'],
  [14, 'Vierzehn'],
  [15, 'Fünfzehn'],
  [16, 'Sechzehn'],
  [17, 'Siebzehn'],
  [18, 'Achtzehn'],
  [19, 'Neunzehn'],
  [20, 'Zwanzig'],
  [21, 'Einundzwanzig'],
  [22, 'Zweiundzwanzig'],
  [30, 'Dreißig'],
  [31, 'Einunddreißig'],
  [40, 'Vierzig'],
  [42, 'Zweiundvierzig'],
  [50, 'Fünfzig'],
  [60, 'Sechzig'],
  [70, 'Siebzig'],
  [80, 'Achtzig'],
  [90, 'Neunzig'],
  [99, 'Neunundneunzig'],
  [100, 'Hundert'],
  [137, 'Hundertsiebenunddreißig'],
  [200, 'Zweihundert'],
  [700, 'Siebenhundert'],
  [1000, 'Tausend'],
  [1100, 'Tausendhundert'],
  [4680, 'Viertausendsechshundertachtzig'],
  [63892, 'Dreiundsechzigtausendachthundertzweiundneunzig'],
  [86100, 'Sechsundachtzigtausendhundert'],
  [792581, 'Siebenhundertzweiundneunzigtausendfünfhunderteinundachtzig'],
  [1000000, 'Eine Million'],
  [2000000, 'Zwei Millionen'],
  [2741034, 'Zwei Millionen Siebenhunderteinundvierzigtausendvierunddreißig'],
  [86429753, 'Sechsundachtzig Millionen Vierhundertneunundzwanzigtausendsiebenhundertdreiundfünfzig'],
  [975310864, 'Neunhundertfünfundsiebzig Millionen Dreihundertzehntausendachthundertvierundsechzig'],
  [1000000000, 'Eine Milliarde'],
  [9876543210, 'Neun Milliarden Achthundertsechsundsiebzig Millionen Fünfhundertdreiundvierzigtausendzweihundertzehn'],
  [
    98765432101,
    'Achtundneunzig Milliarden Siebenhundertfünfundsechzig Millionen Vierhundertzweiunddreißigtausendhunderteins',
  ],
  [
    987654321012,
    'Neunhundertsiebenundachtzig Milliarden Sechshundertvierundfünfzig Millionen Dreihunderteinundzwanzigtausendzwölf',
  ],
  [
    9876543210123,
    'Neun Billionen Achthundertsechsundsiebzig Milliarden Fünfhundertdreiundvierzig Millionen Zweihundertzehntausendhundertdreiundzwanzig',
  ],
  [
    98765432101234,
    'Achtundneunzig Billionen Siebenhundertfünfundsechzig Milliarden Vierhundertzweiunddreißig Millionen Hunderteintausendzweihundertvierunddreißig',
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
    row[1] = `${(row[1] as string).replace(/([Ee])ins$/, '$1in')} Franken`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${(row[1] as string).replace(/([Ee])ins$/, '$1in')} Franken`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${(row[1] as string).replace(/([Ee])ins$/, '$1in')} Franken`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${(row[1] as string).replace(/([Ee])ins$/, '$1in')} Franken`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${(row[1] as string).replace(/([Ee])ins$/, '$1in')} Franken`;
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
  [0.0, 'Null'],
  [0.04, 'Null Komma Null Vier'],
  [0.0468, 'Null Komma Null Vier Sechs Acht'],
  [0.4, 'Null Komma Vier'],
  [0.973, 'Null Komma Neunhundertdreiundsiebzig'],
  [0.999, 'Null Komma Neunhundertneunundneunzig'],
  [37.06, 'Siebenunddreißig Komma Null Sechs'],
  [37.068, 'Siebenunddreißig Komma Null Sechs Acht'],
  [37.68, 'Siebenunddreißig Komma Achtundsechzig'],
  [37.683, 'Siebenunddreißig Komma Sechshundertdreiundachtzig'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Hundertdreiundzwanzig Franken`],
    ['123', `Hundertdreiundzwanzig Franken`],
    ['123.0', `Hundertdreiundzwanzig Franken Und Null Rappen`],
    ['123.00', `Hundertdreiundzwanzig Franken Und Null Rappen`],
    ['0.00', `Null Franken Und Null Rappen`],
    ['-123.00', `Minus Hundertdreiundzwanzig Franken Und Null Rappen`],
    ['37.68', `Siebenunddreißig Franken Und Achtundsechzig Rappen`],
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

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Null Franken`],
  [0.04, `Null Franken Und Vier Rappen`],
  [0.0468, `Null Franken Und Fünf Rappen`],
  [0.4, `Null Franken Und Vierzig Rappen`],
  [0.973, `Null Franken Und Siebenundneunzig Rappen`],
  [0.999, `Ein Franken`],
  [37.06, `Siebenunddreißig Franken Und Sechs Rappen`],
  [37.068, `Siebenunddreißig Franken Und Sieben Rappen`],
  [37.68, `Siebenunddreißig Franken Und Achtundsechzig Rappen`],
  [37.683, `Siebenunddreißig Franken Und Achtundsechzig Rappen`],
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
      row[1] = (row[1] as string).replace(`Null Franken Und `, '');
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
      row[1] = `Null Franken`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Franken.*`), 'Franken');
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
  [0, 'Nullte'],
  [1, 'Erste'],
  [2, 'Zweite'],
  [3, 'Dritte'],
  [4, 'Vierte'],
  [5, 'Fünfte'],
  [6, 'Sechste'],
  [7, 'Siebte'],
  [8, 'Achte'],
  [9, 'Neunte'],
  [10, 'Zehnte'],
  [11, 'Elfte'],
  [12, 'Zwölfte'],
  [13, 'Dreizehnte'],
  [14, 'Vierzehnte'],
  [15, 'Fünfzehnte'],
  [16, 'Sechzehnte'],
  [17, 'Siebzehnte'],
  [18, 'Achtzehnte'],
  [19, 'Neunzehnte'],
  [20, 'Zwanzigste'],
  // Composite numbers (21, 22, etc.)
  [21, 'Einundzwanzigste'],
  [22, 'Zweiundzwanzigste'],
  [23, 'Dreiundzwanzigste'],
  [24, 'Vierundzwanzigste'],
  [25, 'Fünfundzwanzigste'],
  // Tens
  [30, 'Dreißigste'],
  [40, 'Vierzigste'],
  [50, 'Fünfzigste'],
  [60, 'Sechzigste'],
  [70, 'Siebzigste'],
  [80, 'Achtzigste'],
  [90, 'Neunzigste'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundertste'],
  [200, 'Zweihundertste'],
  [300, 'Dreihundertste'],
  [1000, 'Tausendste'],
  [2000, 'Zweitausendste'],
  [1000000, 'Millionste'],
  [2000000, 'Zweimillionste'],
  // Complex numbers
  [101, 'Hunderterste'],
  [102, 'Hundertzweite'],
  [111, 'Hundertelfte'],
  [123, 'Hundertdreiundzwanzigste'],
  [150, 'Hundertfünfzigste'],
  [1001, 'Tausenderste'],
  [1234, 'Tausendzweihundertvierunddreißigste'],
  [1500, 'Tausendfünfhundertste'],
  [10000, 'Zehntausendste'],
  [100000, 'Hunderttausendste'],
  [1000001, 'Millionerste'],
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

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR de-CH
// ============================================================

// Powers of Ten (German International System)
const testPowersOfTen: [number, string][] = [
  [10, 'Zehn'],
  [100, 'Hundert'],
  [1000, 'Tausend'],
  [10000, 'Zehntausend'],
  [100000, 'Hunderttausend'],
  [1000000, 'Eine Million'],
  [10000000, 'Zehn Millionen'],
  [100000000, 'Hundert Millionen'],
  [1000000000, 'Eine Milliarde'],
  [10000000000, 'Zehn Milliarden'],
  [100000000000, 'Hundert Milliarden'],
  [1000000000000, 'Eine Billion'],
];

describe('Test Powers of Ten (German System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'Neunundneunzig'],
  [100, 'Hundert'],
  [101, 'Hunderteins'],
  [999, 'Neunhundertneunundneunzig'],
  [1000, 'Tausend'],
  [1001, 'Tausendeins'],
  [9999, 'Neuntausendneunhundertneunundneunzig'],
  [10000, 'Zehntausend'],
  [99999, 'Neunundneunzigtausendneunhundertneunundneunzig'],
  [100000, 'Hunderttausend'],
  [999999, 'Neunhundertneunundneunzigtausendneunhundertneunundneunzig'],
  [1000000, 'Eine Million'],
  [1000001, 'Eine Million Eins'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Minus Null Komma Fünf'],
  [-0.25, 'Minus Null Komma Fünfundzwanzig'],
  [-0.99, 'Minus Null Komma Neunundneunzig'],
  [-1.5, 'Minus Eins Komma Fünf'],
  [-3.14, 'Minus Drei Komma Vierzehn'],
  [-99.99, 'Minus Neunundneunzig Komma Neunundneunzig'],
  [-100.01, 'Minus Hundert Komma Null Eins'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Minus Null Franken Und Fünfzig Rappen'],
  [-0.99, 'Minus Null Franken Und Neunundneunzig Rappen'],
  [-1.5, 'Minus Ein Franken Und Fünfzig Rappen'],
  [-1.01, 'Minus Ein Franken Und Ein Rappen'],
  [-100.5, 'Minus Hundert Franken Und Fünfzig Rappen'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Null'],
  [1n, 'Eins'],
  [100n, 'Hundert'],
  [1000n, 'Tausend'],
  [1000000n, 'Eine Million'],
  [1000000000n, 'Eine Milliarde'],
  [1000000000000n, 'Eine Billion'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Eins'],
  [-100n, 'Minus Hundert'],
  [-1000n, 'Minus Tausend'],
  [-1000000n, 'Minus Eine Million'],
  [-1000000000n, 'Minus Eine Milliarde'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Null Franken'],
  [1n, 'Ein Franken'],
  [2n, 'Zwei Franken'],
  [100n, 'Hundert Franken'],
  [1000n, 'Tausend Franken'],
  [1000000n, 'Eine Million Franken'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Null'],
  ['1', 'Eins'],
  ['100', 'Hundert'],
  ['1000', 'Tausend'],
  ['-100', 'Minus Hundert'],
  ['3.14', 'Drei Komma Vierzehn'],
  ['-3.14', 'Minus Drei Komma Vierzehn'],
  ['  100  ', 'Hundert'],
  ['1000000', 'Eine Million'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Null');
  });

  test('converts -0 as Null', () => {
    expect(toWords.convert(-0)).toBe('Null');
  });

  test('converts 0.0 as Null', () => {
    expect(toWords.convert(0.0)).toBe('Null');
  });

  test('converts 0n as Null', () => {
    expect(toWords.convert(0n)).toBe('Null');
  });

  test('converts "0" as Null', () => {
    expect(toWords.convert('0')).toBe('Null');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Null Franken');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Hundert Franken Und Fünfzig Rappen');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe(
      'Hundert Franken Und Fünfzig Rappen',
    );
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('Hundert Franken');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe(
      'Hundert Franken',
    );
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for de-CH', () => {
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

const testFractionStyleDeCH: [number, string][] = [
  [1.1, 'Eins Und Ein Zehntel'],
  [2.5, 'Zwei Und Fünf Zehntel'],
  [1.01, 'Eins Und Ein Hundertstel'],
  [1.45, 'Eins Und Fünfundvierzig Hundertstel'],
  [0.05, 'Null Und Fünf Hundertstel'],
  [1.001, 'Eins Und Ein Tausendstel'],
  [1.005, 'Eins Und Fünf Tausendstel'],
  [1.0001, 'Eins Und Ein Zehntausendstel'],
  [1.0005, 'Eins Und Fünf Zehntausendstel'],
  [1.00001, 'Eins Und Ein Hunderttausendstel'],
  [1.00005, 'Eins Und Fünf Hunderttausendstel'],
  [1.000001, 'Eins Und Ein Millionstel'],
  [1.000005, 'Eins Und Fünf Millionstel'],
  [123.45, 'Hundertdreiundzwanzig Und Fünfundvierzig Hundertstel'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleDeCH)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Eins Komma Eine Million Zweihundertvierunddreißigtausendfünfhundertsiebenundsechzig',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Eins Komma Eine Million Zweihundertvierunddreißigtausendfünfhundertsiebenundsechzig',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Eins Komma Fünf');
    expect(toWords.convert(0.05)).toBe('Null Komma Null Fünf');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Einundzwanzig'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Einundzwanzig'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Einundzwanzig Franken Und Fünfzig Rappen',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'einundzwanzig franken und fünfzig rappen',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'EINUNDZWANZIG FRANKEN UND FÜNFZIG RAPPEN',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'einundzwanzig Franken und fünfzig Rappen',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Einundzwanzig Franken und fünfzig Rappen',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Einundzwanzigste'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'einundzwanzigste',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Eins Komma Fünfundzwanzig'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Eins Komma Zwei Fünf',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

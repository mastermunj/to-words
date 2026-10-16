import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import skSk from '../src/locales/sk-SK.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/sk-SK.js';

const localeCode = 'sk-SK';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(skSk);
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
  [0, 'Nula'],
  [1, 'Jeden'],
  [2, 'Dva'],
  [3, 'Tri'],
  [4, 'Štyri'],
  [5, 'Päť'],
  [6, 'Šesť'],
  [7, 'Sedem'],
  [8, 'Osem'],
  [9, 'Deväť'],
  [10, 'Desať'],
  [11, 'Jedenásť'],
  [12, 'Dvanásť'],
  [13, 'Trinásť'],
  [14, 'Štrnásť'],
  [15, 'Pätnásť'],
  [16, 'Šestnásť'],
  [17, 'Sedemnásť'],
  [18, 'Osemnásť'],
  [19, 'Devätnásť'],
  [20, 'Dvadsať'],
  [21, 'Dvadsaťjeden'],
  [22, 'Dvadsaťdva'],
  [30, 'Tridsať'],
  [35, 'Tridsaťpäť'],
  [40, 'Štyridsať'],
  [50, 'Päťdesiat'],
  [60, 'Šesťdesiat'],
  [70, 'Sedemdesiat'],
  [80, 'Osemdesiat'],
  [90, 'Deväťdesiat'],
  [99, 'Deväťdesiatdeväť'],
  [100, 'Sto'],
  [137, 'Stotridsaťsedem'],
  [200, 'Dvesto'],
  [300, 'Tristo'],
  [400, 'Štyristo'],
  [500, 'Päťsto'],
  [600, 'Šesťsto'],
  [700, 'Sedemsto'],
  [800, 'Osemsto'],
  [900, 'Deväťsto'],
  [1000, 'Tisíc'],
  [1100, 'Tisícsto'],
  [2000, 'Dvetisíc'],
  [3000, 'Tritisíc'],
  [4000, 'Štyritisíc'],
  [5000, 'Päťtisíc'],
  [4680, 'Štyritisícšesťstoosemdesiat'],
  [10000, 'Desaťtisíc'],
  [63892, 'Šesťdesiattritisícosemstodeväťdesiatdva'],
  [100000, 'Stotisíc'],
  [1000000, 'Milión'],
  [2000000, 'Dva Milióny'],
  [5000000, 'Päť Miliónov'],
  [2741034, 'Dva Milióny Sedemstoštyridsaťjedentisíctridsaťštyri'],
  [1000000000, 'Miliarda'],
  [2000000000, 'Dve Miliardy'],
  [5000000000, 'Päť Miliárd'],
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
    row[1] = `Mínus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// Slovak unit form (euro: one = 1; few = 2-4; otherwise genitive plural). Euro is neuter,
// so the amounts 1 and 2 have their own words (Jedno Euro, Dve Eurá).
function getCurrencyName(amount: number): string {
  const n = Math.abs(amount);
  if (n === 1) {
    return 'Euro';
  }
  if (n >= 2 && n <= 4) {
    return 'Eurá';
  }
  return 'Eur';
}

function euroAmount(words: string): string {
  return words.replace(/^(Mínus )?Jeden$/, '$1Jedno').replace(/^(Mínus )?Dva$/, '$1Dve');
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `${euroAmount(row[1] as string)} ${currencyName} Len`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `${euroAmount(row[1] as string)} ${currencyName}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Eur Len`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `Mínus ${euroAmount(row[1] as string)} ${currencyName} Len`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else {
      const currencyName = getCurrencyName(row[0] as number);
      row[1] = `${euroAmount(row[1] as string)} ${currencyName} Len`;
    }
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
  [0.0, 'Nula'],
  // Fraction reading is the default (sk.wiktionary «celá»: jedna celá štyri, tri celé štrnásť).
  [0.04, 'Nula Celá Štyri Stotiny'],
  [0.4, 'Nula Celá Štyri Desatiny'],
  [0.63, 'Nula Celá Šesťdesiattri Stotín'],
  [37.06, 'Tridsaťsedem Celých Šesť Stotín'],
  [37.68, 'Tridsaťsedem Celých Šesťdesiatosem Stotín'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Stodvadsaťtri Eur Len`],
    ['123', `Stodvadsaťtri Eur Len`],
    ['123.0', `Stodvadsaťtri Eur A Nula Centov Len`],
    ['123.00', `Stodvadsaťtri Eur A Nula Centov Len`],
    ['0.00', `Nula Eur A Nula Centov Len`],
    ['-123.00', `Mínus Stodvadsaťtri Eur A Nula Centov Len`],
    ['37.68', `Tridsaťsedem Eur A Šesťdesiatosem Centov Len`],
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
  [0.0, 'Nula Eur Len'],
  [0.04, 'Nula Eur A Štyri Centy Len'],
  [0.4, 'Nula Eur A Štyridsať Centov Len'],
  [0.63, 'Nula Eur A Šesťdesiattri Centov Len'],
  [0.999, 'Jedno Euro Len'],
  [37.06, 'Tridsaťsedem Eur A Šesť Centov Len'],
  [37.68, 'Tridsaťsedem Eur A Šesťdesiatosem Centov Len'],
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
      row[1] = (row[1] as string).replace('Nula Eur A ', '');
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
      row[1] = 'Nula Eur Len';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` A [\\wáäčďéíľňóôŕšťúýžÁÄČĎÉÍĽŇÓÔŔŠŤÚÝŽ ]+ Cent(ov|y)?`), '');
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

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-10 (special ordinal forms)
  [1, 'Prvý'],
  [2, 'Druhý'],
  [3, 'Tretí'],
  [4, 'Štvrtý'],
  [5, 'Piaty'],
  [6, 'Šiesty'],
  [7, 'Siedmy'],
  [8, 'Ôsmy'],
  [9, 'Deviaty'],
  [10, 'Desiaty'],

  // Numbers 11-19
  [11, 'Jedenásty'],
  [12, 'Dvanásty'],
  [13, 'Trinásty'],
  [14, 'Štrnásty'],
  [15, 'Pätnásty'],
  [16, 'Šestnásty'],
  [17, 'Sedemnásty'],
  [18, 'Osemnásty'],
  [19, 'Devätnásty'],

  // Tens
  [20, 'Dvadsiaty'],
  [21, 'Dvadsiaty Prvý'],
  [22, 'Dvadsiaty Druhý'],
  [30, 'Tridsiaty'],
  [40, 'Štyridsiaty'],
  [50, 'Päťdesiaty'],
  [60, 'Šesťdesiaty'],
  [70, 'Sedemdesiaty'],
  [80, 'Osemdesiaty'],
  [90, 'Deväťdesiaty'],

  // Hundreds
  [100, 'Stý'],
  [101, 'Stoprvý'],
  [124, 'Stodvadsiaty Štvrtý'],
  [200, 'Dvojstý'],
  [300, 'Trojstý'],
  [400, 'Štvorstý'],
  [500, 'Päťstý'],

  // Thousands
  [1000, 'Tisíci'],
  [1001, 'Tisícprvý'],
  [1985, 'Tisícdeväťstoosemdesiaty Piaty'],
  [2000, 'Dvojtisíci'],
  [2002, 'Dvetisícdruhý'],
  [10000, 'Desaťtisíci'],
  [22000, 'Dvadsaťdvatisíci'],
  [100000, 'Stotisíci'],

  // Millions
  [1000000, 'Miliónty'],
  [1000001, 'Milión Prvý'],
  [2000000, 'Dvojmiliónty'],
  [1000000000, 'Miliardtý'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(10.01)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(99.99)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// Powers of Ten Tests
const testPowersOfTen: [number, string][] = [
  [10, 'Desať'],
  [100, 'Sto'],
  [1000, 'Tisíc'],
  [10000, 'Desaťtisíc'],
  [100000, 'Stotisíc'],
  [1000000, 'Milión'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Nula'],
  [1n, 'Jeden'],
  [100n, 'Sto'],
  [1000n, 'Tisíc'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Mínus Jeden'],
  [-100n, 'Mínus Sto'],
  [-1000n, 'Mínus Tisíc'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Nula'],
  ['1', 'Jeden'],
  ['100', 'Sto'],
  ['-100', 'Mínus Sto'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Nula', () => {
    expect(toWords.convert(0)).toBe('Nula');
  });

  test('convert -0 => Nula', () => {
    expect(toWords.convert(-0)).toBe('Nula');
  });

  test('convert 0.0 => Nula', () => {
    expect(toWords.convert(0.0)).toBe('Nula');
  });

  test('convert 0n => Nula', () => {
    expect(toWords.convert(0n)).toBe('Nula');
  });

  test('convert "0" => Nula', () => {
    expect(toWords.convert('0')).toBe('Nula');
  });

  test('convert 0 with currency => Nula Eur Len', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nula Eur Len');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('should throw error for non-numeric string', () => {
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

const testFractionStyleSkSK: [number, string][] = [
  [1.1, 'Jedna Celá Jedna Desatina'],
  [2.5, 'Dve Celé Päť Desatín'],
  [1.01, 'Jedna Celá Jedna Stotina'],
  [1.45, 'Jedna Celá Štyridsaťpäť Stotín'],
  [0.05, 'Nula Celá Päť Stotín'],
  [1.001, 'Jedna Celá Jedna Tisícina'],
  [1.005, 'Jedna Celá Päť Tisícin'],
  [1.0001, 'Jedna Celá Jedna Desaťtisícina'],
  [1.0005, 'Jedna Celá Päť Desaťtisícin'],
  [1.00001, 'Jedna Celá Jedna Stotisícina'],
  [1.00005, 'Jedna Celá Päť Stotisícin'],
  [1.000001, 'Jedna Celá Jedna Milióntina'],
  [1.000005, 'Jedna Celá Päť Milióntin'],
  [123.45, 'Stodvadsaťtri Celých Štyridsaťpäť Stotín'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleSkSK)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('names denominators up to 15 decimal places (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Jedna Celá Milión Dvestotridsaťštyritisícpäťstošesťdesiatsedem Desaťmilióntin',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Jedna Celá Milión Dvestotridsaťštyritisícpäťstošesťdesiatsedem Desaťmilióntin',
    );
  });

  test("digit-by-digit style still available with decimalStyle: 'digit'", () => {
    expect(toWords.convert(1.5)).toBe('Jedna Celá Päť Desatín');
    expect(toWords.convert(1.5, { decimalStyle: 'digit' })).toBe('Jeden Celá Päť');
    expect(toWords.convert(0.05, { decimalStyle: 'digit' })).toBe('Nula Celá Nula Päť');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Dvadsaťjeden'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Dvadsaťjeden'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Dvadsaťjeden Eur A Päťdesiat Centov Len',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'dvadsaťjeden eur a päťdesiat centov len',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'DVADSAŤJEDEN EUR A PÄŤDESIAT CENTOV LEN',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'dvadsaťjeden eur a päťdesiat centov len',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Dvadsaťjeden eur a päťdesiat centov len',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Dvadsiaty Prvý'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'dvadsiaty prvý',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Jedna Celá Dvadsaťpäť Stotín'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Jeden Celá Dva Päť',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

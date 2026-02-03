import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import slSi from '../src/locales/sl-SI.js';
import { ToWords as LocaleToWords } from '../src/locales/sl-SI.js';

const localeCode = 'sl-SI';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(slSi);
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
  [0, 'Nič'],
  [1, 'Ena'],
  [2, 'Dva'],
  [3, 'Tri'],
  [4, 'Štiri'],
  [5, 'Pet'],
  [6, 'Šest'],
  [7, 'Sedem'],
  [8, 'Osem'],
  [9, 'Devet'],
  [10, 'Deset'],
  [11, 'Enajst'],
  [12, 'Dvanajst'],
  [13, 'Trinajst'],
  [14, 'Štirinajst'],
  [15, 'Petnajst'],
  [16, 'Šestnajst'],
  [17, 'Sedemnajst'],
  [18, 'Osemnajst'],
  [19, 'Devetnajst'],
  [20, 'Dvajset'],
  [21, 'Dvajset Ena'],
  [22, 'Dvajset Dva'],
  [30, 'Trideset'],
  [35, 'Trideset Pet'],
  [40, 'Štirideset'],
  [50, 'Petdeset'],
  [60, 'Šestdeset'],
  [70, 'Sedemdeset'],
  [80, 'Osemdeset'],
  [90, 'Devetdeset'],
  [99, 'Devetdeset Devet'],
  [100, 'Sto'],
  [137, 'Sto Trideset Sedem'],
  [200, 'Dvesto'],
  [300, 'Tristo'],
  [400, 'Štiristo'],
  [500, 'Petsto'],
  [600, 'Šeststo'],
  [700, 'Sedemsto'],
  [800, 'Osemsto'],
  [900, 'Devetsto'],
  [1000, 'Tisoč'],
  [1100, 'Tisoč Sto'],
  [2000, 'Dva Tisoč'],
  [4680, 'Štiri Tisoč Šeststo Osemdeset'],
  [10000, 'Deset Tisoč'],
  [63892, 'Šestdeset Tri Tisoč Osemsto Devetdeset Dva'],
  [100000, 'Sto Tisoč'],
  [1000000, 'Milijon'],
  [2000000, 'Dva Milijone'],
  [3000000, 'Tri Milijone'],
  [5000000, 'Pet Milijon'],
  [2741034, 'Dva Milijone Sedemsto Štirideset Ena Tisoč Trideset Štiri'],
  [1000000000, 'Milijarda'],
  [2000000000, 'Dva Milijarde'],
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
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov Samo'],
    [1, 'Ena Evro Samo'],
    [2, 'Dva Evrov Samo'],
    [10, 'Deset Evrov Samo'],
    [100, 'Sto Evrov Samo'],
    [1000, 'Tisoč Evrov Samo'],
    [1000000, 'Milijon Evrov Samo'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov'],
    [1, 'Ena Evro'],
    [2, 'Dva Evrov'],
    [10, 'Deset Evrov'],
    [100, 'Sto Evrov'],
    [1000, 'Tisoč Evrov'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov Samo'],
    [-1, 'Minus Ena Evro Samo'],
    [-10, 'Minus Deset Evrov Samo'],
    [-100, 'Minus Sto Evrov Samo'],
  ];

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [1, 'Ena Evro Samo'],
    [10, 'Deset Evrov Samo'],
  ];

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
  [0.0, 'Nič'],
  [0.04, 'Nič Vejica Nič Štiri'],
  [0.4, 'Nič Vejica Štiri'],
  [0.63, 'Nič Vejica Šestdeset Tri'],
  [37.06, 'Trideset Sedem Vejica Nič Šest'],
  [37.68, 'Trideset Sedem Vejica Šestdeset Osem'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nič Evrov Samo'],
  [0.04, 'Nič Evrov In Štiri Centov Samo'],
  [0.4, 'Nič Evrov In Štirideset Centov Samo'],
  [0.63, 'Nič Evrov In Šestdeset Tri Centov Samo'],
  [37.06, 'Trideset Sedem Evrov In Šest Centov Samo'],
  [37.68, 'Trideset Sedem Evrov In Šestdeset Osem Centov Samo'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.04, 'Štiri Centov Samo'],
    [0.4, 'Štirideset Centov Samo'],
    [37.06, 'Trideset Sedem Evrov In Šest Centov Samo'],
  ];

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
    [0.0, 'Nič Evrov Samo'],
    [0.04, 'Nič Evrov Samo'],
    [0.4, 'Nič Evrov Samo'],
    [37.06, 'Trideset Sedem Evrov Samo'],
    [37.68, 'Trideset Sedem Evrov Samo'],
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

// Ordinal Tests
const testOrdinals: [number, string][] = [
  [1, 'Prvi'],
  [2, 'Drugi'],
  [3, 'Tretji'],
  [4, 'Četrti'],
  [5, 'Peti'],
  [6, 'Šesti'],
  [7, 'Sedmi'],
  [8, 'Osmi'],
  [9, 'Deveti'],
  [10, 'Deseti'],
  [11, 'Enajsti'],
  [12, 'Dvanajsti'],
  [13, 'Trinajsti'],
  [19, 'Devetnajsti'],
  [20, 'Dvajseti'],
  [21, 'Dvajset Prvi'],
  [30, 'Trideseti'],
  [50, 'Petdeseti'],
  [100, 'Stoti'],
  [101, 'Sto Prvi'],
  [110, 'Sto Deseti'],
  [200, 'Dvestoti'],
  [1000, 'Tisoči'],
  [1001, 'Tisoč Prvi'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'Deset'],
    [100, 'Sto'],
    [1000, 'Tisoč'],
    [10000, 'Deset Tisoč'],
    [100000, 'Sto Tisoč'],
    [1000000, 'Milijon'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'Nič'],
    [1n, 'Ena'],
    [100n, 'Sto'],
    [1000n, 'Tisoč'],
  ];

  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Negative BigInt', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'Minus Ena'],
    [-100n, 'Minus Sto'],
    [-1000n, 'Minus Tisoč'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test String Input', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'Nič'],
    ['1', 'Ena'],
    ['100', 'Sto'],
    ['-100', 'Minus Sto'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Nič', () => {
    expect(toWords.convert(0)).toBe('Nič');
  });

  test('convert -0 => Nič', () => {
    expect(toWords.convert(-0)).toBe('Nič');
  });

  test('convert 0.0 => Nič', () => {
    expect(toWords.convert(0.0)).toBe('Nič');
  });

  test('convert 0n => Nič', () => {
    expect(toWords.convert(0n)).toBe('Nič');
  });

  test('convert "0" => Nič', () => {
    expect(toWords.convert('0')).toBe('Nič');
  });

  test('convert 0 with currency => Nič Evrov Samo', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nič Evrov Samo');
  });
});

describe('Test Invalid Input', () => {
  const testInvalidInputs: [unknown, string][] = [
    [NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(testInvalidInputs)('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedMessage);
  });
});

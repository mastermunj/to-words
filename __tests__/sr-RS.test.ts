import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import srRs from '../src/locales/sr-RS.js';
import { ToWords as LocaleToWords } from '../src/locales/sr-RS.js';

const localeCode = 'sr-RS';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(srRs);
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
  [0, 'Nula'],
  [1, 'Jedan'],
  [2, 'Dva'],
  [3, 'Tri'],
  [4, 'Četiri'],
  [5, 'Pet'],
  [6, 'Šest'],
  [7, 'Sedam'],
  [8, 'Osam'],
  [9, 'Devet'],
  [10, 'Deset'],
  [11, 'Jedanaest'],
  [12, 'Dvanaest'],
  [13, 'Trinaest'],
  [14, 'Četrnaest'],
  [15, 'Petnaest'],
  [16, 'Šesnaest'],
  [17, 'Sedamnaest'],
  [18, 'Osamnaest'],
  [19, 'Devetnaest'],
  [20, 'Dvadeset'],
  [21, 'Dvadeset Jedan'],
  [22, 'Dvadeset Dva'],
  [30, 'Trideset'],
  [35, 'Trideset Pet'],
  [40, 'Četrdeset'],
  [50, 'Pedeset'],
  [60, 'Šezdeset'],
  [70, 'Sedamdeset'],
  [80, 'Osamdeset'],
  [90, 'Devedeset'],
  [99, 'Devedeset Devet'],
  [100, 'Sto'],
  [137, 'Sto Trideset Sedam'],
  [200, 'Dvesta'],
  [300, 'Trista'],
  [400, 'Četiristo'],
  [500, 'Petsto'],
  [600, 'Šeststo'],
  [700, 'Sedamsto'],
  [800, 'Osamsto'],
  [900, 'Devetsto'],
  [1000, 'Hiljada'],
  [1100, 'Hiljada Sto'],
  [2000, 'Dva Hiljada'],
  [4680, 'Četiri Hiljada Šeststo Osamdeset'],
  [10000, 'Deset Hiljada'],
  [63892, 'Šezdeset Tri Hiljada Osamsto Devedeset Dva'],
  [100000, 'Sto Hiljada'],
  [1000000, 'Milion'],
  [2000000, 'Dva Milion'],
  [2741034, 'Dva Milion Sedamsto Četrdeset Jedan Hiljada Trideset Četiri'],
  [1000000000, 'Milijarda'],
  [2000000000, 'Dva Milijarda'],
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
    // For 1, use singular "Dinar", otherwise use plural "Dinara"
    const currencyName = row[1] === 'Jedan' ? 'Dinar' : 'Dinara';
    row[1] = `${row[1]} ${currencyName} Samo`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    // For 1, use singular "Dinar", otherwise use plural "Dinara"
    const currencyName = row[1] === 'Jedan' ? 'Dinar' : 'Dinara';
    row[1] = `${row[1]} ${currencyName}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Dinara Samo`;
      return;
    }
    row[0] = -row[0];
    // For -1, use singular "Dinar", otherwise use plural "Dinara"
    const currencyName = row[1] === 'Jedan' ? 'Dinar' : 'Dinara';
    row[1] = `Minus ${row[1]} ${currencyName} Samo`;
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
      // For 1, use singular "Dinar", otherwise use plural "Dinara"
      const currencyName = row[1] === 'Jedan' ? 'Dinar' : 'Dinara';
      row[1] = `${row[1]} ${currencyName} Samo`;
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
  [0.04, 'Nula Zarez Nula Četiri'],
  [0.4, 'Nula Zarez Četiri'],
  [0.63, 'Nula Zarez Šezdeset Tri'],
  [37.06, 'Trideset Sedam Zarez Nula Šest'],
  [37.68, 'Trideset Sedam Zarez Šezdeset Osam'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nula Dinara Samo'],
  [0.04, 'Nula Dinara I Četiri Para Samo'],
  [0.4, 'Nula Dinara I Četrdeset Para Samo'],
  [0.63, 'Nula Dinara I Šezdeset Tri Para Samo'],
  [0.999, 'Jedan Dinar Samo'],
  [37.06, 'Trideset Sedam Dinara I Šest Para Samo'],
  [37.68, 'Trideset Sedam Dinara I Šezdeset Osam Para Samo'],
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
      row[1] = (row[1] as string).replace('Nula Dinara I ', '');
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
      row[1] = 'Nula Dinara Samo';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` I [\\wčćšžČĆŠŽ ]+ Para`), '');
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
  [1, 'Prvi'],
  [2, 'Drugi'],
  [3, 'Treći'],
  [4, 'Četvrti'],
  [5, 'Peti'],
  [6, 'Šesti'],
  [7, 'Sedmi'],
  [8, 'Osmi'],
  [9, 'Deveti'],
  [10, 'Deseti'],

  // Numbers 11-19
  [11, 'Jedanaesti'],
  [12, 'Dvanaesti'],
  [13, 'Trinaesti'],
  [14, 'Četrnaesti'],
  [15, 'Petnaesti'],
  [16, 'Šesnaesti'],
  [17, 'Sedamnaesti'],
  [18, 'Osamnaesti'],
  [19, 'Devetnaesti'],

  // Tens
  [20, 'Dvadeseti'],
  [21, 'Dvadeset Prvi'],
  [22, 'Dvadeset Drugi'],
  [30, 'Trideseti'],
  [40, 'Četrdeseti'],
  [50, 'Pedeseti'],
  [60, 'Šezdeseti'],
  [70, 'Sedamdeseti'],
  [80, 'Osamdeseti'],
  [90, 'Devedeseti'],

  // Hundreds
  [100, 'Stoti'],
  [101, 'Sto Prvi'],
  [200, 'Dvestoti'],
  [300, 'Tristoti'],

  // Thousands
  [1000, 'Hiljaditi'],
  [1001, 'Hiljada Prvi'],

  // Millions
  [1000000, 'Milioniti'],
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
  [10, 'Deset'],
  [100, 'Sto'],
  [1000, 'Hiljada'],
  [10000, 'Deset Hiljada'],
  [100000, 'Sto Hiljada'],
  [1000000, 'Milion'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Nula'],
  [1n, 'Jedan'],
  [100n, 'Sto'],
  [1000n, 'Hiljada'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Jedan'],
  [-100n, 'Minus Sto'],
  [-1000n, 'Minus Hiljada'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Nula'],
  ['1', 'Jedan'],
  ['100', 'Sto'],
  ['-100', 'Minus Sto'],
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

  test('convert 0 with currency => Nula Dinara Samo', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nula Dinara Samo');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

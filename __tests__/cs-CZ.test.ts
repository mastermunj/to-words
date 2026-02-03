import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import csCz from '../src/locales/cs-CZ.js';
import { ToWords as LocaleToWords } from '../src/locales/cs-CZ.js';

const localeCode = 'cs-CZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(csCz);
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
  [1, 'Jeden'],
  [2, 'Dva'],
  [3, 'Tři'],
  [4, 'Čtyři'],
  [5, 'Pět'],
  [6, 'Šest'],
  [7, 'Sedm'],
  [8, 'Osm'],
  [9, 'Devět'],
  [10, 'Deset'],
  [11, 'Jedenáct'],
  [12, 'Dvanáct'],
  [13, 'Třináct'],
  [14, 'Čtrnáct'],
  [15, 'Patnáct'],
  [16, 'Šestnáct'],
  [17, 'Sedmnáct'],
  [18, 'Osmnáct'],
  [19, 'Devatenáct'],
  [20, 'Dvacet'],
  [21, 'Dvacet Jeden'],
  [22, 'Dvacet Dva'],
  [30, 'Třicet'],
  [35, 'Třicet Pět'],
  [40, 'Čtyřicet'],
  [50, 'Padesát'],
  [60, 'Šedesát'],
  [70, 'Sedmdesát'],
  [80, 'Osmdesát'],
  [90, 'Devadesát'],
  [99, 'Devadesát Devět'],
  [100, 'Sto'],
  [137, 'Sto Třicet Sedm'],
  [200, 'Dvě Stě'],
  [300, 'Tři Sta'],
  [400, 'Čtyři Sta'],
  [500, 'Pět Set'],
  [600, 'Šest Set'],
  [700, 'Sedm Set'],
  [800, 'Osm Set'],
  [900, 'Devět Set'],
  [1000, 'Tisíc'],
  [1100, 'Tisíc Sto'],
  [2000, 'Dva Tisíce'],
  [3000, 'Tři Tisíce'],
  [4000, 'Čtyři Tisíce'],
  [5000, 'Pět Tisíc'],
  [4680, 'Čtyři Tisíce Šest Set Osmdesát'],
  [10000, 'Deset Tisíc'],
  [63892, 'Šedesát Tři Tisíc Osm Set Devadesát Dva'],
  [100000, 'Sto Tisíc'],
  [1000000, 'Milion'],
  [2000000, 'Dva Miliony'],
  [5000000, 'Pět Milion'],
  [2741034, 'Dva Miliony Sedm Set Čtyřicet Jeden Tisíc Třicet Čtyři'],
  [1000000000, 'Miliarda'],
  [2000000000, 'Dva Miliardy'],
  [5000000000, 'Pět Miliarda'],
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

// Helper function to get Czech currency form
function getCurrencyName(words: string): string {
  // Check for singular (1)
  if (words === 'Jeden') {
    return 'Koruna';
  }
  // Default plural for all other numbers
  return 'Korun';
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `${row[1]} ${currencyName} Pouze`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[1] as string);
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
      row[1] = `${row[1]} Korun Pouze`;
      return;
    }
    row[0] = -row[0];
    const currencyName = getCurrencyName(row[1] as string);
    row[1] = `Mínus ${row[1]} ${currencyName} Pouze`;
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
      const currencyName = getCurrencyName(row[1] as string);
      row[1] = `${row[1]} ${currencyName} Pouze`;
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
  [0.04, 'Nula Celá Nula Čtyři'],
  [0.4, 'Nula Celá Čtyři'],
  [0.63, 'Nula Celá Šedesát Tři'],
  [37.06, 'Třicet Sedm Celá Nula Šest'],
  [37.68, 'Třicet Sedm Celá Šedesát Osm'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nula Korun Pouze'],
  [0.04, 'Nula Korun A Čtyři Haléřů Pouze'],
  [0.4, 'Nula Korun A Čtyřicet Haléřů Pouze'],
  [0.63, 'Nula Korun A Šedesát Tři Haléřů Pouze'],
  [0.999, 'Jeden Koruna Pouze'],
  [37.06, 'Třicet Sedm Korun A Šest Haléřů Pouze'],
  [37.68, 'Třicet Sedm Korun A Šedesát Osm Haléřů Pouze'],
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
      row[1] = (row[1] as string).replace('Nula Korun A ', '');
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
      row[1] = 'Nula Korun Pouze';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` A [\\wáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ ]+ Haléř[ůe]*`), '');
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
  [1, 'První'],
  [2, 'Druhý'],
  [3, 'Třetí'],
  [4, 'Čtvrtý'],
  [5, 'Pátý'],
  [6, 'Šestý'],
  [7, 'Sedmý'],
  [8, 'Osmý'],
  [9, 'Devátý'],
  [10, 'Desátý'],

  // Numbers 11-19
  [11, 'Jedenáctý'],
  [12, 'Dvanáctý'],
  [13, 'Třináctý'],
  [14, 'Čtrnáctý'],
  [15, 'Patnáctý'],
  [16, 'Šestnáctý'],
  [17, 'Sedmnáctý'],
  [18, 'Osmnáctý'],
  [19, 'Devatenáctý'],

  // Tens
  [20, 'Dvacátý'],
  [21, 'Dvacet První'],
  [22, 'Dvacet Druhý'],
  [30, 'Třicátý'],
  [40, 'Čtyřicátý'],
  [50, 'Padesátý'],
  [60, 'Šedesátý'],
  [70, 'Sedmdesátý'],
  [80, 'Osmdesátý'],
  [90, 'Devadesátý'],

  // Hundreds
  [100, 'Stý'],
  [101, 'Sto První'],
  [200, 'Dvoustý'],
  [300, 'Třístý'],

  // Thousands
  [1000, 'Tisící'],
  [1001, 'Tisíc První'],

  // Millions
  [1000000, 'Miliontý'],
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
  [1000, 'Tisíc'],
  [10000, 'Deset Tisíc'],
  [100000, 'Sto Tisíc'],
  [1000000, 'Milion'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
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
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
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
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
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

describe('Test String Input', () => {
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

  test('convert 0 with currency => Nula Korun Pouze', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nula Korun Pouze');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('convert NaN should throw error', () => {
    expect(() => toWords.convert(NaN)).toThrow();
  });

  test('convert Infinity should throw error', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('convert -Infinity should throw error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('convert empty string should throw error', () => {
    expect(() => toWords.convert('')).toThrow();
  });

  test('convert "abc" should throw error', () => {
    expect(() => toWords.convert('abc')).toThrow();
  });
});

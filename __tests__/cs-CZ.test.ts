import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import csCz from '../src/locales/cs-CZ.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/cs-CZ.js';

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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
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
  [21, 'Dvacet Jedna'],
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
  [63892, 'Šedesát Tři Tisíce Osm Set Devadesát Dva'],
  [100000, 'Sto Tisíc'],
  [1000000, 'Milion'],
  [2000000, 'Dva Miliony'],
  [5000000, 'Pět Milionů'],
  [2741034, 'Dva Miliony Sedm Set Čtyřicet Jedna Tisíc Třicet Čtyři'],
  [1000000000, 'Miliarda'],
  [2000000000, 'Dvě Miliardy'],
  [5000000000, 'Pět Miliard'],
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

// Czech unit form (koruna: one = 1; few = …2-4 except 12-14; otherwise genitive plural).
// Koruna is feminine, so the amount agrees: Jedna Koruna, Dvě Koruny, Dvacet Dvě Koruny.
function getCurrencyName(amount: number): string {
  const n = Math.abs(amount);
  if (n === 1) {
    return 'Koruna';
  }
  if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) {
    return 'Koruny';
  }
  return 'Korun';
}

function korunaAmount(words: string): string {
  return words.replace(/(^| )Jeden$/, '$1Jedna').replace(/(^| )Dva$/, '$1Dvě');
}

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `${korunaAmount(row[1] as string)} ${currencyName} Pouze`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `${korunaAmount(row[1] as string)} ${currencyName}`;
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
    const currencyName = getCurrencyName(row[0] as number);
    row[1] = `Mínus ${korunaAmount(row[1] as string)} ${currencyName} Pouze`;
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
      row[1] = `${korunaAmount(row[1] as string)} ${currencyName} Pouze`;
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

// IJP «Čtení desetinných čísel»: nula celá jedna desetina, pět celých jedna desetina.
const testFloats: [number, string][] = [
  [0.0, 'Nula'],
  [0.04, 'Nula Celá Čtyři Setiny'],
  [0.4, 'Nula Celá Čtyři Desetiny'],
  [0.63, 'Nula Celá Šedesát Tři Setiny'],
  [37.06, 'Třicet Sedm Celých Šest Setin'],
  [37.68, 'Třicet Sedm Celých Šedesát Osm Setin'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Sto Dvacet Tři Koruny Pouze`],
    ['123', `Sto Dvacet Tři Koruny Pouze`],
    ['123.0', `Sto Dvacet Tři Koruny A Nula Haléřů Pouze`],
    ['123.00', `Sto Dvacet Tři Koruny A Nula Haléřů Pouze`],
    ['0.00', `Nula Korun A Nula Haléřů Pouze`],
    ['-123.00', `Mínus Sto Dvacet Tři Koruny A Nula Haléřů Pouze`],
    ['37.68', `Třicet Sedm Korun A Šedesát Osm Haléřů Pouze`],
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
  [0.0, 'Nula Korun Pouze'],
  [0.04, 'Nula Korun A Čtyři Haléře Pouze'],
  [0.4, 'Nula Korun A Čtyřicet Haléřů Pouze'],
  [0.63, 'Nula Korun A Šedesát Tři Haléře Pouze'],
  [0.999, 'Jedna Koruna Pouze'],
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
  [21, 'Dvacátý První'],
  [22, 'Dvacátý Druhý'],
  [30, 'Třicátý'],
  [40, 'Čtyřicátý'],
  [50, 'Padesátý'],
  [60, 'Šedesátý'],
  [70, 'Sedmdesátý'],
  [80, 'Osmdesátý'],
  [90, 'Devadesátý'],

  // Hundreds (IJP: stý padesátý, čtyřstý sedmdesátý osmý)
  [100, 'Stý'],
  [101, 'Stý První'],
  [150, 'Stý Padesátý'],
  [200, 'Dvoustý'],
  [300, 'Třístý'],
  [478, 'Čtyřstý Sedmdesátý Osmý'],

  // Thousands (IJP: tisící dvoustý padesátý druhý; cs.wiktionary: stotisící)
  [1000, 'Tisící'],
  [1001, 'Tisící První'],
  [1252, 'Tisící Dvoustý Padesátý Druhý'],
  [2000, 'Dvoutisící'],
  [2345, 'Dvoutisící Třístý Čtyřicátý Pátý'],
  [100000, 'Stotisící'],

  // Millions and up
  [1000000, 'Miliontý'],
  [1002000, 'Miliontý Dvoutisící'],
  [2000000000, 'Dvoumiliardtý'],
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
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('convert Infinity should throw error', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('convert -Infinity should throw error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('convert empty string should throw error', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('convert "abc" should throw error', () => {
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

const testFractionStyleCsCZ: [number, string][] = [
  [1.1, 'Jedna Celá Jedna Desetina'],
  [2.5, 'Dvě Celé Pět Desetin'],
  [1.01, 'Jedna Celá Jedna Setina'],
  [1.45, 'Jedna Celá Čtyřicet Pět Setin'],
  [0.05, 'Nula Celá Pět Setin'],
  [1.001, 'Jedna Celá Jedna Tisícina'],
  [1.005, 'Jedna Celá Pět Tisícin'],
  [1.0001, 'Jedna Celá Jedna Desetitisícina'],
  [1.0005, 'Jedna Celá Pět Desetitisícin'],
  [1.00001, 'Jedna Celá Jedna Stotisícina'],
  [1.00005, 'Jedna Celá Pět Stotisícin'],
  [1.000001, 'Jedna Celá Jedna Miliontina'],
  [1.000005, 'Jedna Celá Pět Miliontin'],
  [123.45, 'Sto Dvacet Tři Celé Čtyřicet Pět Setin'],
  [1024.007, 'Tisíc Dvacet Čtyři Celé Sedm Tisícin'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleCsCZ)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('names fractions up to 15 places', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Jedna Celá Milion Dvě Stě Třicet Čtyři Tisíce Pět Set Šedesát Sedm Desetimiliontin',
    );
    expect(toWords.convert('0.000000001')).toBe('Nula Celá Jedna Miliardtina');
  });

  test('fraction reading is the default; digit style still opts out', () => {
    expect(toWords.convert(1.5)).toBe('Jedna Celá Pět Desetin');
    expect(toWords.convert(1.5, { decimalStyle: 'digit' })).toBe('Jeden Celá Pět');
    expect(toWords.convert(0.05, { decimalStyle: 'digit' })).toBe('Nula Celá Nula Pět');
  });
});

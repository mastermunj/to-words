import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import svSe from '../src/locales/sv-SE.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/sv-SE.js';

const localeCode = 'sv-SE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(svSe);
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
  [0, 'Noll'],
  [137, 'Hundratrettiosju'],
  [700, 'Sjuhundra'],
  [1100, 'Tusenhundra'],
  [4680, 'Fyratusensexhundraåttio'],
  [63892, 'Sextiotretusenåttahundranittiotvå'],
  [86100, 'Åttiosextusenhundra'],
  [792581, 'Sjuhundranittiotvåtusenfemhundraåttioett'],
  [2741034, 'Två Miljoner Sjuhundrafyrtioettusentrettiofyra'],
  [86429753, 'Åttiosex Miljoner Fyrahundratjugoniotusensjuhundrafemtiotre'],
  [975310864, 'Niohundrasjuttiofem Miljoner Trehundratiotusenåttahundrasextiofyra'],
  [9876543210, 'Nio Miljarder Åttahundrasjuttiosex Miljoner Femhundrafyrtiotretusentvåhundratio'],
  [98765432101, 'Nittioåtta Miljarder Sjuhundrasextiofem Miljoner Fyrahundratrettiotvåtusenhundraett'],
  [987654321012, 'Niohundraåttiosju Miljarder Sexhundrafemtiofyra Miljoner Trehundratjugoettusentolv'],
  [
    9876543210123,
    'Nio Biljoner Åttahundrasjuttiosex Miljarder Femhundrafyrtiotre Miljoner Tvåhundratiotusenhundratjugotre',
  ],
  [
    98765432101234,
    'Nittioåtta Biljoner Sjuhundrasextiofem Miljarder Fyrahundratrettiotvå Miljoner Hundraettusentvåhundratrettiofyra',
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
    row[1] = `${(row[1] as string).replace(/(hundra|tusen)ett$/, '$1en')} Kronor`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${(row[1] as string).replace(/(hundra|tusen)ett$/, '$1en')} Kronor`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${(row[1] as string).replace(/(hundra|tusen)ett$/, '$1en')} Kronor`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${(row[1] as string).replace(/(hundra|tusen)ett$/, '$1en')} Kronor`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${(row[1] as string).replace(/(hundra|tusen)ett$/, '$1en')} Kronor`;
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
  [0.0, 'Noll'],
  [0.04, 'Noll Komma Noll Fyra'],
  [0.0468, 'Noll Komma Noll Fyra Sex Åtta'],
  [0.4, 'Noll Komma Fyra'],
  [0.973, 'Noll Komma Niohundrasjuttiotre'],
  [0.999, 'Noll Komma Niohundranittionio'],
  [37.06, 'Trettiosju Komma Noll Sex'],
  [37.068, 'Trettiosju Komma Noll Sex Åtta'],
  [37.68, 'Trettiosju Komma Sextioåtta'],
  [37.683, 'Trettiosju Komma Sexhundraåttiotre'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Hundratjugotre Kronor`],
    ['123', `Hundratjugotre Kronor`],
    ['123.0', `Hundratjugotre Kronor Och Noll Öre`],
    ['123.00', `Hundratjugotre Kronor Och Noll Öre`],
    ['0.00', `Noll Kronor Och Noll Öre`],
    ['-123.00', `Minus Hundratjugotre Kronor Och Noll Öre`],
    ['37.68', `Trettiosju Kronor Och Sextioåtta Öre`],
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
  [0.0, `Noll Kronor`],
  [0.04, `Noll Kronor Och Fyra Öre`],
  [0.0468, `Noll Kronor Och Fem Öre`],
  [0.4, `Noll Kronor Och Fyrtio Öre`],
  [0.973, `Noll Kronor Och Nittiosju Öre`],
  [0.999, `En Krona`],
  [37.06, `Trettiosju Kronor Och Sex Öre`],
  [37.068, `Trettiosju Kronor Och Sju Öre`],
  [37.68, `Trettiosju Kronor Och Sextioåtta Öre`],
  [37.683, `Trettiosju Kronor Och Sextioåtta Öre`],
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
      row[1] = (row[1] as string).replace(`Noll Kronor Och `, '');
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
      row[1] = `Noll Kronor`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Kronor.*`), 'Kronor');
      row[1] = (row[1] as string).replace(new RegExp(`Krona.*`), 'Krona');
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
  [0, 'Nollte'],
  [1, 'Första'],
  [2, 'Andra'],
  [3, 'Tredje'],
  [4, 'Fjärde'],
  [5, 'Femte'],
  [6, 'Sjätte'],
  [7, 'Sjunde'],
  [8, 'Åttonde'],
  [9, 'Nionde'],
  [10, 'Tionde'],
  [11, 'Elfte'],
  [12, 'Tolfte'],
  [13, 'Trettonde'],
  [14, 'Fjortonde'],
  [15, 'Femtonde'],
  [16, 'Sextonde'],
  [17, 'Sjuttonde'],
  [18, 'Artonde'],
  [19, 'Nittonde'],
  [20, 'Tjugonde'],
  // Composite numbers (21, 22, etc.)
  [21, 'Tjugoförsta'],
  [22, 'Tjugoandra'],
  [23, 'Tjugotredje'],
  [24, 'Tjugofjärde'],
  [25, 'Tjugofemte'],
  // Tens
  [30, 'Trettionde'],
  [40, 'Fyrtionde'],
  [50, 'Femtionde'],
  [60, 'Sextionde'],
  [70, 'Sjuttionde'],
  [80, 'Åttionde'],
  [90, 'Nittionde'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundrade'],
  [200, 'Tvåhundrade'],
  [300, 'Trehundrade'],
  [1000, 'Tusende'],
  [2000, 'Tvåtusende'],
  [1000000, 'Miljonte'],
  [2000000, 'Tvåmiljonte'],
  // Complex numbers
  [101, 'Hundraförsta'],
  [102, 'Hundraandra'],
  [111, 'Hundraelfte'],
  [123, 'Hundratjugotredje'],
  [150, 'Hundrafemtionde'],
  [1001, 'Tusenförsta'],
  [1234, 'Tusentvåhundratrettiofjärde'],
  [1500, 'Tusenfemhundrade'],
  [10000, 'Tiotusende'],
  [100000, 'Hundratusende'],
  [1000001, 'Miljonförsta'],
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

describe('Test Swedish-specific numbers', () => {
  test('Single Krona (1)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('En Krona');
  });

  test('Two Kronor', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Två Kronor');
  });

  test('Teens (11-19)', () => {
    expect(toWords.convert(11)).toBe('Elva');
    expect(toWords.convert(12)).toBe('Tolv');
    expect(toWords.convert(13)).toBe('Tretton');
    expect(toWords.convert(14)).toBe('Fjorton');
    expect(toWords.convert(15)).toBe('Femton');
    expect(toWords.convert(16)).toBe('Sexton');
    expect(toWords.convert(17)).toBe('Sjutton');
    expect(toWords.convert(18)).toBe('Arton');
    expect(toWords.convert(19)).toBe('Nitton');
  });

  test('Twenties', () => {
    expect(toWords.convert(20)).toBe('Tjugo');
    expect(toWords.convert(21)).toBe('Tjugoett');
    expect(toWords.convert(22)).toBe('Tjugotvå');
    expect(toWords.convert(25)).toBe('Tjugofem');
    expect(toWords.convert(28)).toBe('Tjugoåtta');
  });

  test('Large numbers', () => {
    expect(toWords.convert(1000000)).toBe('En Miljon');
    expect(toWords.convert(1000000000)).toBe('En Miljard');
    expect(toWords.convert(2000000)).toBe('Två Miljoner');
    expect(toWords.convert(2000000000)).toBe('Två Miljarder');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS FOR sv-SE
// ============================================================

// Powers of Ten (Swedish)
const testPowersOfTen: [number, string][] = [
  [10, 'Tio'],
  [100, 'Hundra'],
  [1000, 'Tusen'],
  [10000, 'Tiotusen'],
  [100000, 'Hundratusen'],
  [1000000, 'En Miljon'],
  [10000000, 'Tio Miljoner'],
  [100000000, 'Hundra Miljoner'],
  [1000000000, 'En Miljard'],
  [10000000000, 'Tio Miljarder'],
  [100000000000, 'Hundra Miljarder'],
  [1000000000000, 'En Biljon'],
];

describe('Test Powers of Ten (Swedish System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Noll'],
  [1n, 'Ett'],
  [100n, 'Hundra'],
  [1000n, 'Tusen'],
  [1000000n, 'En Miljon'],
  [1000000000n, 'En Miljard'],
  [1000000000000n, 'En Biljon'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Minus Ett'],
  [-100n, 'Minus Hundra'],
  [-1000n, 'Minus Tusen'],
  [-1000000n, 'Minus En Miljon'],
  [-1000000000n, 'Minus En Miljard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Noll'],
  ['1', 'Ett'],
  ['100', 'Hundra'],
  ['1000', 'Tusen'],
  ['-100', 'Minus Hundra'],
  ['  100  ', 'Hundra'],
  ['1000000', 'En Miljon'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Noll');
  });

  test('converts -0 as Noll', () => {
    expect(toWords.convert(-0)).toBe('Noll');
  });

  test('converts 0.0 as Noll', () => {
    expect(toWords.convert(0.0)).toBe('Noll');
  });

  test('converts 0n as Noll', () => {
    expect(toWords.convert(0n)).toBe('Noll');
  });

  test('converts "0" as Noll', () => {
    expect(toWords.convert('0')).toBe('Noll');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Noll Kronor');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for sv-SE', () => {
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

const testFractionStyleSvSE: [number, string][] = [
  [1.1, 'Ett Och En Tiondel'],
  [2.5, 'Två Och Fem Tiondelar'],
  [1.01, 'Ett Och En Hundradel'],
  [1.45, 'Ett Och Fyrtiofem Hundradelar'],
  [0.05, 'Noll Och Fem Hundradelar'],
  [1.001, 'Ett Och En Tusendel'],
  [1.005, 'Ett Och Fem Tusendelar'],
  [1.0001, 'Ett Och En Tiotusendel'],
  [1.0005, 'Ett Och Fem Tiotusendelar'],
  [1.00001, 'Ett Och En Hundratusendel'],
  [1.00005, 'Ett Och Fem Hundratusendelar'],
  [1.000001, 'Ett Och En Miljondel'],
  [1.000005, 'Ett Och Fem Miljondelar'],
  [123.45, 'Hundratjugotre Och Fyrtiofem Hundradelar'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleSvSE)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Ett Komma En Miljon Tvåhundratrettiofyratusenfemhundrasextiosju',
    );
    expect(toWords.convert(1.1234567)).toBe('Ett Komma En Miljon Tvåhundratrettiofyratusenfemhundrasextiosju');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Ett Komma Fem');
    expect(toWords.convert(0.05)).toBe('Noll Komma Noll Fem');
  });
});

describe('sv.wikipedia «Räkneord»', () => {
  test.each([
    [8463, 'Åttatusenfyrahundrasextiotre'],
    [2007, 'Tvåtusensju'],
    [5000000, 'Fem Miljoner'],
    [21000, 'Tjugoettusen'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('ordinals, currency and fractions', () => {
    expect(toWords.toOrdinal(1000000)).toBe('Miljonte');
    expect(toWords.toOrdinal(101)).toBe('Hundraförsta');
    expect(toWords.convert(1, { currency: true })).toBe('En Krona');
    expect(toWords.convert(0.01, { currency: true, gender: 'feminine' })).toBe('Noll Kronor Och Ett Öre');
    expect(toWords.convert(0.01, { decimalStyle: 'fraction' })).toBe('Noll Och En Hundradel');
  });
});

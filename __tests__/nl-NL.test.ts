import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nlNl from '../src/locales/nl-NL.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/nl-NL.js';

const localeCode = 'nl-NL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(nlNl);
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
  [0, 'Nul'],
  [137, 'Honderdzevenendertig'],
  [700, 'Zevenhonderd'],
  [1100, 'Duizend Honderd'],
  [4680, 'Vierduizend Zeshonderdtachtig'],
  [63892, 'Drieënzestigduizend Achthonderdtweeënnegentig'],
  [86100, 'Zesentachtigduizend Honderd'],
  [792581, 'Zevenhonderdtweeënnegentigduizend Vijfhonderdeenentachtig'],
  [2741034, 'Twee Miljoen Zevenhonderdeenenveertigduizend Vierendertig'],
  [86429753, 'Zesentachtig Miljoen Vierhonderdnegenentwintigduizend Zevenhonderddrieënvijftig'],
  [975310864, 'Negenhonderdvijfenzeventig Miljoen Driehonderdtienduizend Achthonderdvierenzestig'],
  [9876543210, 'Negen Miljard Achthonderdzesenzeventig Miljoen Vijfhonderddrieënveertigduizend Tweehonderdtien'],
  [98765432101, 'Achtennegentig Miljard Zevenhonderdvijfenzestig Miljoen Vierhonderdtweeëndertigduizend Honderdeen'],
  [
    987654321012,
    'Negenhonderdzevenentachtig Miljard Zeshonderdvierenvijftig Miljoen Driehonderdeenentwintigduizend Twaalf',
  ],
  [
    9876543210123,
    'Negen Biljoen Achthonderdzesenzeventig Miljard Vijfhonderddrieënveertig Miljoen Tweehonderdtienduizend Honderddrieëntwintig',
  ],
  [
    98765432101234,
    'Achtennegentig Biljoen Zevenhonderdvijfenzestig Miljard Vierhonderdtweeëndertig Miljoen Honderdeenduizend Tweehonderdvierendertig',
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
    row[1] = `Min ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Euro`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Min ${row[1]} Euro`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Euro`;
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
  [0.0, 'Nul'],
  [0.04, 'Nul Komma Nul Vier'],
  [0.0468, 'Nul Komma Nul Vier Zes Acht'],
  [0.4, 'Nul Komma Vier'],
  [0.973, 'Nul Komma Negenhonderddrieënzeventig'],
  [0.999, 'Nul Komma Negenhonderdnegenennegentig'],
  [37.06, 'Zevenendertig Komma Nul Zes'],
  [37.068, 'Zevenendertig Komma Nul Zes Acht'],
  [37.68, 'Zevenendertig Komma Achtenzestig'],
  [37.683, 'Zevenendertig Komma Zeshonderddrieëntachtig'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Honderddrieëntwintig Euro`],
    ['123', `Honderddrieëntwintig Euro`],
    ['123.0', `Honderddrieëntwintig Euro En Nul Cent`],
    ['123.00', `Honderddrieëntwintig Euro En Nul Cent`],
    ['0.00', `Nul Euro En Nul Cent`],
    ['-123.00', `Min Honderddrieëntwintig Euro En Nul Cent`],
    ['37.68', `Zevenendertig Euro En Achtenzestig Cent`],
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
  [0.0, `Nul Euro`],
  [0.04, `Nul Euro En Vier Cent`],
  [0.0468, `Nul Euro En Vijf Cent`],
  [0.4, `Nul Euro En Veertig Cent`],
  [0.973, `Nul Euro En Zevenennegentig Cent`],
  [0.999, `Een Euro`],
  [37.06, `Zevenendertig Euro En Zes Cent`],
  [37.068, `Zevenendertig Euro En Zeven Cent`],
  [37.68, `Zevenendertig Euro En Achtenzestig Cent`],
  [37.683, `Zevenendertig Euro En Achtenzestig Cent`],
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
      row[1] = (row[1] as string).replace(`Nul Euro En `, '');
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
      row[1] = `Nul Euro`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Euro.*`), 'Euro');
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
  [0, 'Nulde'],
  [1, 'Eerste'],
  [2, 'Tweede'],
  [3, 'Derde'],
  [4, 'Vierde'],
  [5, 'Vijfde'],
  [6, 'Zesde'],
  [7, 'Zevende'],
  [8, 'Achtste'],
  [9, 'Negende'],
  [10, 'Tiende'],
  [11, 'Elfde'],
  [12, 'Twaalfde'],
  [13, 'Dertiende'],
  [14, 'Veertiende'],
  [15, 'Vijftiende'],
  [16, 'Zestiende'],
  [17, 'Zeventiende'],
  [18, 'Achttiende'],
  [19, 'Negentiende'],
  [20, 'Twintigste'],
  // Composite numbers (21, 22, etc.)
  [21, 'Eenentwintigste'],
  [22, 'Tweeëntwintigste'],
  [23, 'Drieëntwintigste'],
  [24, 'Vierentwintigste'],
  [25, 'Vijfentwintigste'],
  // Tens
  [30, 'Dertigste'],
  [40, 'Veertigste'],
  [50, 'Vijftigste'],
  [60, 'Zestigste'],
  [70, 'Zeventigste'],
  [80, 'Tachtigste'],
  [90, 'Negentigste'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Honderdste'],
  [200, 'Tweehonderdste'],
  [300, 'Driehonderdste'],
  [1000, 'Duizendste'],
  [2000, 'Tweeduizendste'],
  [1000000, 'Miljoenste'],
  [2000000, 'Tweemiljoenste'],
  // Complex numbers
  [101, 'Honderdeerste'],
  [102, 'Honderdtweede'],
  [111, 'Honderdelfde'],
  [123, 'Honderddrieëntwintigste'],
  [150, 'Honderdvijftigste'],
  [1001, 'Duizendeerste'],
  [1234, 'Duizendtweehonderdvierendertigste'],
  [1500, 'Duizendvijfhonderdste'],
  [10000, 'Tienduizendste'],
  [100000, 'Honderdduizendste'],
  [1000001, 'Miljoeneerste'],
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

// Powers of Ten
const testPowersOfTen: [number, string][] = [
  [10, 'Tien'],
  [100, 'Honderd'],
  [1000, 'Duizend'],
  [10000, 'Tienduizend'],
  [100000, 'Honderdduizend'],
  [1000000, 'Een Miljoen'],
  [10000000, 'Tien Miljoen'],
  [100000000, 'Honderd Miljoen'],
  [1000000000, 'Een Miljard'],
  [10000000000, 'Tien Miljard'],
  [100000000000, 'Honderd Miljard'],
  [1000000000000, 'Een Biljoen'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'Negenennegentig'],
  [100, 'Honderd'],
  [101, 'Honderdeen'],
  [999, 'Negenhonderdnegenennegentig'],
  [1000, 'Duizend'],
  [1001, 'Duizend Een'],
  [9999, 'Negenduizend Negenhonderdnegenennegentig'],
  [10000, 'Tienduizend'],
  [10001, 'Tienduizend Een'],
  [99999, 'Negenennegentigduizend Negenhonderdnegenennegentig'],
  [100000, 'Honderdduizend'],
  [100001, 'Honderdduizend Een'],
  [999999, 'Negenhonderdnegenennegentigduizend Negenhonderdnegenennegentig'],
  [1000000, 'Een Miljoen'],
  [1000001, 'Een Miljoen Een'],
  [9999999, 'Negen Miljoen Negenhonderdnegenennegentigduizend Negenhonderdnegenennegentig'],
  [10000000, 'Tien Miljoen'],
  [10000001, 'Tien Miljoen Een'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Min Nul Komma Vijf'],
  [-0.25, 'Min Nul Komma Vijfentwintig'],
  [-0.99, 'Min Nul Komma Negenennegentig'],
  [-1.5, 'Min Een Komma Vijf'],
  [-3.14, 'Min Drie Komma Veertien'],
  [-99.99, 'Min Negenennegentig Komma Negenennegentig'],
  [-100.01, 'Min Honderd Komma Nul Een'],
  [-1000.999, 'Min Duizend Komma Negenhonderdnegenennegentig'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Min Nul Euro En Vijftig Cent'],
  [-0.99, 'Min Nul Euro En Negenennegentig Cent'],
  [-1.5, 'Min Een Euro En Vijftig Cent'],
  [-1.01, 'Min Een Euro En Een Cent'],
  [-100.5, 'Min Honderd Euro En Vijftig Cent'],
  [-1000.99, 'Min Duizend Euro En Negenennegentig Cent'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Nul'],
  [1n, 'Een'],
  [100n, 'Honderd'],
  [1000n, 'Duizend'],
  [1000000n, 'Een Miljoen'],
  [1000000000n, 'Een Miljard'],
  [1000000000000n, 'Een Biljoen'],
  [1000000000000000n, 'Een Biljard'],
  [
    1234567890123n,
    'Een Biljoen Tweehonderdvierendertig Miljard Vijfhonderdzevenenzestig Miljoen Achthonderdnegentigduizend Honderddrieëntwintig',
  ],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Min Een'],
  [-100n, 'Min Honderd'],
  [-1000n, 'Min Duizend'],
  [-1000000n, 'Min Een Miljoen'],
  [-1000000000n, 'Min Een Miljard'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Nul Euro'],
  [1n, 'Een Euro'],
  [2n, 'Twee Euro'],
  [100n, 'Honderd Euro'],
  [1000n, 'Duizend Euro'],
  [1000000n, 'Een Miljoen Euro'],
  [1000000000n, 'Een Miljard Euro'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Nul'],
  ['1', 'Een'],
  ['100', 'Honderd'],
  ['1000', 'Duizend'],
  ['-100', 'Min Honderd'],
  ['3.14', 'Drie Komma Veertien'],
  ['-3.14', 'Min Drie Komma Veertien'],
  ['  100  ', 'Honderd'],
  ['1000000', 'Een Miljoen'],
  ['1000000000', 'Een Miljard'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String with Currency
const testStringInputsWithCurrency: [string, string][] = [
  ['0', 'Nul Euro'],
  ['1', 'Een Euro'],
  ['100', 'Honderd Euro'],
  ['100.50', 'Honderd Euro En Vijftig Cent'],
  ['-100', 'Min Honderd Euro'],
];

describe('Test String Number Inputs with Currency', () => {
  test.concurrent.each(testStringInputsWithCurrency)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Nul');
  });

  test('converts -0 as Nul', () => {
    expect(toWords.convert(-0)).toBe('Nul');
  });

  test('converts 0.0 as Nul', () => {
    expect(toWords.convert(0.0)).toBe('Nul');
  });

  test('converts 0n as Nul', () => {
    expect(toWords.convert(0n)).toBe('Nul');
  });

  test('converts "0" as Nul', () => {
    expect(toWords.convert('0')).toBe('Nul');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nul Euro');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Singular/Plural Tests
describe('Test Currency Singular/Plural', () => {
  test('1 Euro (singular)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Een Euro');
  });

  test('2 Euro (plural)', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Twee Euro');
  });

  test('0.01 Cent (singular)', () => {
    expect(toWords.convert(0.01, { currency: true })).toBe('Nul Euro En Een Cent');
  });

  test('0.02 Cent (plural)', () => {
    expect(toWords.convert(0.02, { currency: true })).toBe('Nul Euro En Twee Cent');
  });

  test('1.01 (singular + singular)', () => {
    expect(toWords.convert(1.01, { currency: true })).toBe('Een Euro En Een Cent');
  });

  test('2.02 (plural + plural)', () => {
    expect(toWords.convert(2.02, { currency: true })).toBe('Twee Euro En Twee Cent');
  });
});

// All Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Honderd Euro En Vijftig Cent');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('Honderd Euro En Vijftig Cent');
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('Honderd Euro');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe(
      'Honderd Euro',
    );
  });

  test('currency + ignoreZeroCurrency with zero value', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });

  test('currency + ignoreZeroCurrency with non-zero value', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreZeroCurrency: true })).toBe(
      'Honderd Euro En Vijftig Cent',
    );
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for nl-NL', () => {
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

const testFractionStyleNlNL: [number, string][] = [
  [1.1, 'Een En Een Tiende'],
  [2.5, 'Twee En Vijf Tienden'],
  [1.01, 'Een En Een Honderdste'],
  [1.45, 'Een En Vijfenveertig Honderdsten'],
  [0.05, 'Nul En Vijf Honderdsten'],
  [1.001, 'Een En Een Duizendste'],
  [1.005, 'Een En Vijf Duizendsten'],
  [1.0001, 'Een En Een Tienduizendste'],
  [1.0005, 'Een En Vijf Tienduizendsten'],
  [1.00001, 'Een En Een Honderdduizendste'],
  [1.00005, 'Een En Vijf Honderdduizendsten'],
  [1.000001, 'Een En Een Miljoenste'],
  [1.000005, 'Een En Vijf Miljoensten'],
  [123.45, 'Honderddrieëntwintig En Vijfenveertig Honderdsten'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleNlNL)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Een Komma Een Miljoen Tweehonderdvierendertigduizend Vijfhonderdzevenenzestig',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Een Komma Een Miljoen Tweehonderdvierendertigduizend Vijfhonderdzevenenzestig',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Een Komma Vijf');
    expect(toWords.convert(0.05)).toBe('Nul Komma Nul Vijf');
  });
});

describe('Taaladvies (Taalunie Leidraad 6.9, Team Taaladvies)', () => {
  test.each([
    [37, 'Zevenendertig'],
    [207, 'Tweehonderdzeven'],
    [2004, 'Tweeduizend Vier'],
    [1006, 'Duizend Zes'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test.each([
    [8, 'Achtste'],
    [104, 'Honderdvierde'],
    [200, 'Tweehonderdste'],
  ])('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });

  test('decimal comma', () => {
    expect(toWords.convert(8.5)).toBe('Acht Komma Vijf');
  });

  // CLDR rbnf nl %spellout-cardinal «-x: min >>» — negative read «min».
  test('negative reads min (CLDR)', () => {
    expect(toWords.convert(-5)).toBe('Min Vijf');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Eenentwintig'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Eenentwintig'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Eenentwintig Euro En Vijftig Cent',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'eenentwintig euro en vijftig cent',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'EENENTWINTIG EURO EN VIJFTIG CENT',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'eenentwintig euro en vijftig cent',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Eenentwintig euro en vijftig cent',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Eenentwintigste'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'eenentwintigste',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Een Komma Vijfentwintig'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Een Komma Twee Vijf',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

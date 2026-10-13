import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nlSr from '../src/locales/nl-SR.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/nl-SR.js';

const localeCode = 'nl-SR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(nlSr);
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
    row[1] = `${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Surinaamse dollars`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Min ${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Surinaamse dollars`;
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
  // DEBUG Not recieving expected results
  // [0.63, 'Nul Komma Drieënzestig'],
  [0.973, 'Nul Komma Negenhonderddrieënzeventig'],
  [0.999, 'Nul Komma Negenhonderdnegenennegentig'],
  [37.06, 'Zevenendertig Komma Nul Zes'],
  [37.068, 'Zevenendertig Komma Nul Zes Acht'],
  [37.68, 'Zevenendertig Komma Achtenzestig'],
  [37.683, 'Zevenendertig Komma Zeshonderddrieëntachtig'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Honderddrieëntwintig Surinaamse dollars`],
    ['123', `Honderddrieëntwintig Surinaamse dollars`],
    ['123.0', `Honderddrieëntwintig Surinaamse dollars En Nul Centen`],
    ['123.00', `Honderddrieëntwintig Surinaamse dollars En Nul Centen`],
    ['0.00', `Nul Surinaamse dollars En Nul Centen`],
    ['-123.00', `Min Honderddrieëntwintig Surinaamse dollars En Nul Centen`],
    ['37.68', `Zevenendertig Surinaamse dollars En Achtenzestig Centen`],
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
  [0.0, `Nul Surinaamse dollars`],
  [0.04, `Nul Surinaamse dollars En Vier Centen`],
  [0.0468, `Nul Surinaamse dollars En Vijf Centen`],
  [0.4, `Nul Surinaamse dollars En Veertig Centen`],
  // DEBUG Not recieving expected results
  // [0.63, `Nul Surinaamse dollars En Drieënzestig Centen`],
  [0.973, `Nul Surinaamse dollars En Zevenennegentig Centen`],
  [0.999, `Een Surinaamse dollar`],
  [37.06, `Zevenendertig Surinaamse dollars En Zes Centen`],
  [37.068, `Zevenendertig Surinaamse dollars En Zeven Centen`],
  [37.68, `Zevenendertig Surinaamse dollars En Achtenzestig Centen`],
  [37.683, `Zevenendertig Surinaamse dollars En Achtenzestig Centen`],
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
      row[1] = (row[1] as string).replace(`Nul Surinaamse dollars En `, '');
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
      row[1] = `Nul Surinaamse dollars`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` En [\\w ]+ Centen`), '');
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

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` En [\\w ]+ Centen`), '');
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
          ignoreDecimal: true,
        }),
      ).toBe(expected);
    },
  );
});

const testOrdinals: [number, string][] = [
  // Numbers 1-20
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

const testPowersOfTen: [number, string][] = [
  [10, 'Tien'],
  [100, 'Honderd'],
  [1000, 'Duizend'],
  [10000, 'Tienduizend'],
  [100000, 'Honderdduizend'],
  [1000000, 'Een Miljoen'],
];

describe('Test Powers of Ten with options = {}', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'Nul'],
  [1n, 'Een'],
  [100n, 'Honderd'],
  [1000n, 'Duizend'],
];

describe('Test BigInt with options = {}', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Min Een'],
  [-100n, 'Min Honderd'],
  [-1000n, 'Min Duizend'],
];

describe('Test Negative BigInt with options = {}', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'Nul'],
  ['1', 'Een'],
  ['100', 'Honderd'],
  ['-100', 'Min Honderd'],
];

describe('Test String Input with options = {}', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Nul', () => {
    expect(toWords.convert(0)).toBe('Nul');
  });

  test('convert -0 => Nul', () => {
    expect(toWords.convert(-0)).toBe('Nul');
  });

  test('convert 0.0 => Nul', () => {
    expect(toWords.convert(0.0)).toBe('Nul');
  });

  test('convert 0n => Nul', () => {
    expect(toWords.convert(0n)).toBe('Nul');
  });

  test('convert "0" => Nul', () => {
    expect(toWords.convert('0')).toBe('Nul');
  });

  test('convert 0 with currency => Nul Surinaamse dollars', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nul Surinaamse dollars');
  });
});

describe('Test Invalid Input', () => {
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

const testFractionStyleNlSR: [number, string][] = [
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
  test.concurrent.each(testFractionStyleNlSR)('convert %d => %s', (input, expected) => {
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

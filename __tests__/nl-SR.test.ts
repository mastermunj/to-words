import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nlSr from '../src/locales/nl-SR.js';
import { ToWords as LocaleToWords } from '../src/locales/nl-SR.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'Nul'],
  [137, 'Een Honderd Zevenendertig'],
  [700, 'Zeven Honderd'],
  [1100, 'Een Duizend Honderd'],
  [4680, 'Vier Duizend Zes Honderd Tachtig'],
  [63892, 'Drieënzestig Duizend Acht Honderd Tweeënnegentig'],
  [86100, 'Zesentachtig Duizend Honderd'],
  [792581, 'Zeven Honderd Tweeënnegentig Duizend Vijf Honderd Eenentachtig'],
  [2741034, 'Twee Miljoen Zeven Honderd Eenenveertig Duizend Vierendertig'],
  [86429753, 'Zesentachtig Miljoen Vier Honderd Negenentwintig Duizend Zeven Honderd Drieënvijftig'],
  [975310864, 'Negen Honderd Vijfenzeventig Miljoen Drie Honderd Tien Duizend Acht Honderd Vierenzestig'],
  [9876543210, 'Negen Miljard Acht Honderd Zesenzeventig Miljoen Vijf Honderd Drieënveertig Duizend Twee Honderd Tien'],
  [
    98765432101,
    'Achtennegentig Miljard Zeven Honderd Vijfenzestig Miljoen Vier Honderd Tweeëndertig Duizend Een Honderd Een',
  ],
  [
    987654321012,
    'Negen Honderd Zevenentachtig Miljard Zes Honderd Vierenvijftig Miljoen Drie Honderd Eenentwintig Duizend Twaalf',
  ],
  [
    9876543210123,
    'Negen Biljoen Acht Honderd Zesenzeventig Miljard Vijf Honderd Drieënveertig Miljoen Twee Honderd Tien Duizend Een Honderd Drieëntwintig',
  ],
  [
    98765432101234,
    'Achtennegentig Biljoen Zeven Honderd Vijfenzestig Miljard Vier Honderd Tweeëndertig Miljoen Een Honderd Een Duizend Twee Honderd Vierendertig',
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
    row[1] = `Negatief ${row[1]}`;
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
    row[1] = `Negatief ${row[1]} Surinaamse dollars`;
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

const testFloats = [
  [0.0, 'Nul'],
  [0.04, 'Nul Punt Nul Vier'],
  [0.0468, 'Nul Punt Nul Vier Zes Acht'],
  [0.4, 'Nul Punt Vier'],
  // DEBUG Not recieving expected results
  // [0.63, 'Nul Punt Drieënzestig'],
  [0.973, 'Nul Punt Negen Honderd Drieënzeventig'],
  [0.999, 'Nul Punt Negen Honderd Negenennegentig'],
  [37.06, 'Zevenendertig Punt Nul Zes'],
  [37.068, 'Zevenendertig Punt Nul Zes Acht'],
  [37.68, 'Zevenendertig Punt Achtenzestig'],
  [37.683, 'Zevenendertig Punt Zes Honderd Drieëntachtig'],
];

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
  [21, 'Eenentwintig'],
  [22, 'Tweeëntwintig'],
  [23, 'Drieëntwintig'],
  [24, 'Vierentwintig'],
  [25, 'Vijfentwintig'],
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
  [200, 'Twee Honderdste'],
  [300, 'Drie Honderdste'],
  [1000, 'Een Duizendste'],
  [2000, 'Twee Duizendste'],
  [1000000, 'Een Miljoenste'],
  [2000000, 'Twee Miljoenste'],
  // Complex numbers
  [101, 'Een Honderd Eerste'],
  [102, 'Een Honderd Tweede'],
  [111, 'Een Honderd Elfde'],
  [123, 'Een Honderd Drieëntwintig'],
  [150, 'Een Honderd Vijftigste'],
  [1001, 'Een Duizend Eerste'],
  [1234, 'Een Duizend Twee Honderd Vierendertig'],
  [1500, 'Een Duizend Vijf Honderdste'],
  [10000, 'Tien Duizendste'],
  [100000, 'Honderd Duizendste'],
  [1000001, 'Een Miljoen Eerste'],
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
  [1000, 'Een Duizend'],
  [10000, 'Tien Duizend'],
  [100000, 'Honderd Duizend'],
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
  [1000n, 'Een Duizend'],
];

describe('Test BigInt with options = {}', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Negatief Een'],
  [-100n, 'Negatief Honderd'],
  [-1000n, 'Negatief Een Duizend'],
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
  ['-100', 'Negatief Honderd'],
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
    expect(() => toWords.convert(Number.NaN)).toThrow();
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow();
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow();
  });
});

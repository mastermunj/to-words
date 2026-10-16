import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import roRo from '../src/locales/ro-RO.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ro-RO.js';

const localeCode = 'ro-RO';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(roRo);
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

// Currency phrase for an integer amount: «un leu», «de» after 00 / 20–99 (douăzeci de lei; DOOM).
const lei = (amount: number, words: string): string => {
  const n = Math.abs(amount);
  if (n === 1) {
    return 'Un Leu';
  }
  const lastTwo = n % 100;
  return `${words}${n !== 0 && (lastTwo === 0 || lastTwo >= 20) ? ' De' : ''} Lei`;
};

const testIntegers: [number, string][] = [
  [0, 'Zero'],
  [137, 'O Sută Treizeci Și Șapte'],
  [700, 'Șapte Sute'],
  [1100, 'O Mie O Sută'],
  [4680, 'Patru Mii Șase Sute Optzeci'],
  [63892, 'Șaizeci Și Trei De Mii Opt Sute Nouăzeci Și Doi'],
  [86100, 'Optzeci Și Șase De Mii O Sută'],
  [792581, 'Șapte Sute Nouăzeci Și Două De Mii Cinci Sute Optzeci Și Unu'],
  [2741034, 'Două Milioane Șapte Sute Patruzeci Și Una De Mii Treizeci Și Patru'],
  [86429753, 'Optzeci Și Șase De Milioane Patru Sute Douăzeci Și Nouă De Mii Șapte Sute Cincizeci Și Trei'],
  [975310864, 'Nouă Sute Șaptezeci Și Cinci De Milioane Trei Sute Zece Mii Opt Sute Șaizeci Și Patru'],
  [
    9876543210,
    'Nouă Miliarde Opt Sute Șaptezeci Și Șase De Milioane Cinci Sute Patruzeci Și Trei De Mii Două Sute Zece',
  ],
  [
    98765432101,
    'Nouăzeci Și Opt De Miliarde Șapte Sute Șaizeci Și Cinci De Milioane Patru Sute Treizeci Și Două De Mii O Sută Unu',
  ],
  [
    987654321012,
    'Nouă Sute Optzeci Și Șapte De Miliarde Șase Sute Cincizeci Și Patru De Milioane Trei Sute Douăzeci Și Una De Mii Doisprezece',
  ],
  [
    9876543210123,
    'Nouă Bilioane Opt Sute Șaptezeci Și Șase De Miliarde Cinci Sute Patruzeci Și Trei De Milioane Două Sute Zece Mii O Sută Douăzeci Și Trei',
  ],
  [
    98765432101234,
    'Nouăzeci Și Opt De Bilioane Șapte Sute Șaizeci Și Cinci De Miliarde Patru Sute Treizeci Și Două De Milioane O Sută Una Mii Două Sute Treizeci Și Patru',
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
    row[1] = `${lei(row[0] as number, row[1] as string)} Exact`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${lei(row[0] as number, row[1] as string)}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${lei(row[0] as number, row[1] as string)} Exact`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${lei(row[0] as number, row[1] as string)} Exact`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${lei(row[0] as number, row[1] as string)} Exact`;
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
  [0.0, 'Zero'],
  [0.04, 'Zero Virgulă Zero Patru'],
  [0.0468, 'Zero Virgulă Zero Patru Șase Opt'],
  [0.4, 'Zero Virgulă Patru'],
  [0.63, 'Zero Virgulă Șaizeci Și Trei'],
  [0.973, 'Zero Virgulă Nouă Sute Șaptezeci Și Trei'],
  [0.999, 'Zero Virgulă Nouă Sute Nouăzeci Și Nouă'],
  [37.06, 'Treizeci Și Șapte Virgulă Zero Șase'],
  [37.068, 'Treizeci Și Șapte Virgulă Zero Șase Opt'],
  [37.68, 'Treizeci Și Șapte Virgulă Șaizeci Și Opt'],
  [37.683, 'Treizeci Și Șapte Virgulă Șase Sute Optzeci Și Trei'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `O Sută Douăzeci Și Trei De Lei Exact`],
    ['123', `O Sută Douăzeci Și Trei De Lei Exact`],
    ['123.0', `O Sută Douăzeci Și Trei De Lei Și Zero Bani Exact`],
    ['123.00', `O Sută Douăzeci Și Trei De Lei Și Zero Bani Exact`],
    ['0.00', `Zero Lei Și Zero Bani Exact`],
    ['-123.00', `Minus O Sută Douăzeci Și Trei De Lei Și Zero Bani Exact`],
    ['37.68', `Treizeci Și Șapte De Lei Și Șaizeci Și Opt De Bani Exact`],
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
  [0.0, `Zero Lei Exact`],
  [0.04, `Zero Lei Și Patru Bani Exact`],
  [0.0468, `Zero Lei Și Cinci Bani Exact`],
  [0.4, `Zero Lei Și Patruzeci De Bani Exact`],
  [0.63, `Zero Lei Și Șaizeci Și Trei De Bani Exact`],
  [0.973, `Zero Lei Și Nouăzeci Și Șapte De Bani Exact`],
  [0.999, `Un Leu Exact`],
  [37.06, `Treizeci Și Șapte De Lei Și Șase Bani Exact`],
  [37.068, `Treizeci Și Șapte De Lei Și Șapte Bani Exact`],
  [37.68, `Treizeci Și Șapte De Lei Și Șaizeci Și Opt De Bani Exact`],
  [37.683, `Treizeci Și Șapte De Lei Și Șaizeci Și Opt De Bani Exact`],
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
      row[1] = (row[1] as string).replace(`Zero Lei Și `, '');
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
      row[1] = `Zero Lei Exact`;
    } else {
      row[1] = (row[1] as string).replace(/ (Lei|Leu) Și .+ Bani?/, ' $1');
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
    row[1] = (row[1] as string).replace(/ (Lei|Leu) Și .+ Bani?/, ' $1');
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

const testFloatsWithEuroCurrency = [
  [0.0, `Zero Euro Exact`],
  [0.04, `Zero Euro Și Patru Eurocenți Exact`],
  [0.0468, `Zero Euro Și Cinci Eurocenți Exact`],
  [0.4, `Zero Euro Și Patruzeci De Eurocenți Exact`],
  [0.63, `Zero Euro Și Șaizeci Și Trei De Eurocenți Exact`],
  [0.973, `Zero Euro Și Nouăzeci Și Șapte De Eurocenți Exact`],
  [0.999, `Unu Euro Exact`],
  [37.06, `Treizeci Și Șapte De Euro Și Șase Eurocenți Exact`],
  [37.068, `Treizeci Și Șapte De Euro Și Șapte Eurocenți Exact`],
  [37.68, `Treizeci Și Șapte De Euro Și Șaizeci Și Opt De Eurocenți Exact`],
  [37.683, `Treizeci Și Șapte De Euro Și Șaizeci Și Opt De Eurocenți Exact`],
];

const euroCurrencyOptions = {
  name: 'Euro',
  plural: 'Euro',
  singular: 'Euro',
  symbol: '€',
  fractionalUnit: {
    name: 'Eurocent',
    plural: 'Eurocenți',
    singular: 'Eurocent',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithEuroCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: euroCurrencyOptions })).toBe(expected);
  });
});

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Numbers 1-20 (special ordinal forms)
  [1, 'Primul'],
  [2, 'Al Doilea'],
  [3, 'Al Treilea'],
  [4, 'Al Patrulea'],
  [5, 'Al Cincilea'],
  [6, 'Al Șaselea'],
  [7, 'Al Șaptelea'],
  [8, 'Al Optulea'],
  [9, 'Al Nouălea'],
  [10, 'Al Zecelea'],
  [11, 'Al Unsprezecelea'],
  [12, 'Al Doisprezecelea'],
  [13, 'Al Treisprezecelea'],
  [14, 'Al Paisprezecelea'],
  [15, 'Al Cincisprezecelea'],
  [16, 'Al Șaisprezecelea'],
  [17, 'Al Șaptesprezecelea'],
  [18, 'Al Optsprezecelea'],
  [19, 'Al Nouăsprezecelea'],
  [20, 'Al Douăzecilea'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'Al Douăzeci Și Unulea'],
  [22, 'Al Douăzeci Și Doilea'],
  [23, 'Al Douăzeci Și Treilea'],
  [30, 'Al Treizecilea'],
  [40, 'Al Patruzecilea'],
  [50, 'Al Cincizecilea'],
  [60, 'Al Șaizecilea'],
  [70, 'Al Șaptezecilea'],
  [80, 'Al Optzecilea'],
  [90, 'Al Nouăzecilea'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Al Treizeci Și Unulea'],
  [32, 'Al Treizeci Și Doilea'],
  [33, 'Al Treizeci Și Treilea'],
  [41, 'Al Patruzeci Și Unulea'],
  [42, 'Al Patruzeci Și Doilea'],
  [43, 'Al Patruzeci Și Treilea'],
  [51, 'Al Cincizeci Și Unulea'],
  [52, 'Al Cincizeci Și Doilea'],
  [53, 'Al Cincizeci Și Treilea'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Al O Sutălea'],
  [200, 'Al Două Sutelea'],
  [1000, 'Al O Miilea'],
  [10000, 'Al Zece Miilea'],
  [100000, 'Al O Sută De Miilea'],
  [1000000, 'Al Un Milionulea'],
  [10000000, 'Al Zece Milioanelea'],

  // Numbers in the hundreds with endings
  [101, 'Al O Sută Unulea'],
  [102, 'Al O Sută Doilea'],
  [103, 'Al O Sută Treilea'],
  [111, 'Al O Sută Unsprezecelea'],
  [112, 'Al O Sută Doisprezecelea'],
  [113, 'Al O Sută Treisprezecelea'],
  [123, 'Al O Sută Douăzeci Și Treilea'],

  // Complex numbers
  [1001, 'Al O Mie Unulea'],
  [1111, 'Al O Mie O Sută Unsprezecelea'],
  [1234, 'Al O Mie Două Sute Treizeci Și Patrulea'],
  [12345, 'Al Douăsprezece Mii Trei Sute Patruzeci Și Cincilea'],
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
const powersOfTen: [number, string][] = [
  [10, 'Zece'],
  [100, 'O Sută'],
  [1000, 'O Mie'],
  [10000, 'Zece Mii'],
  [100000, 'O Sută De Mii'],
  [1000000, 'Un Milion'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(powersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
const bigIntTests: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'Unu'],
  [100n, 'O Sută'],
  [1000n, 'O Mie'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(bigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// Negative BigInt Tests
const negativeBigIntTests: [bigint, string][] = [
  [-1n, 'Minus Unu'],
  [-100n, 'Minus O Sută'],
  [-1000n, 'Minus O Mie'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(negativeBigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// String Input Tests
const stringInputTests: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'Unu'],
  ['100', 'O Sută'],
  ['-100', 'Minus O Sută'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(stringInputTests)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Zero', () => {
    expect(toWords.convert(0)).toBe('Zero');
  });

  test('convert -0 => Zero', () => {
    expect(toWords.convert(-0)).toBe('Zero');
  });

  test('convert 0.0 => Zero', () => {
    expect(toWords.convert(0.0)).toBe('Zero');
  });

  test('convert 0n => Zero', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('convert "0" => Zero', () => {
    expect(toWords.convert('0')).toBe('Zero');
  });

  test('convert 0 with currency => Zero Lei Exact', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Lei Exact');
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

const testFractionStyleRoRO: [number, string][] = [
  [1.1, 'Unu Și Unu Zecime'],
  [2.5, 'Doi Și Cinci Zecimi'],
  [1.01, 'Unu Și Unu Sutime'],
  [1.45, 'Unu Și Patruzeci Și Cinci Sutimi'],
  [0.05, 'Zero Și Cinci Sutimi'],
  [1.001, 'Unu Și Unu Miime'],
  [1.005, 'Unu Și Cinci Miimi'],
  [1.0001, 'Unu Și Unu Zecime de Miime'],
  [1.0005, 'Unu Și Cinci Zecimi de Miime'],
  [1.00001, 'Unu Și Unu Sutime de Miime'],
  [1.00005, 'Unu Și Cinci Sutimi de Miime'],
  [1.000001, 'Unu Și Unu Milionime'],
  [1.000005, 'Unu Și Cinci Milionime'],
  [123.45, 'O Sută Douăzeci Și Trei Și Patruzeci Și Cinci Sutimi'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleRoRO)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Unu Virgulă Un Milion Două Sute Treizeci Și Patru De Mii Cinci Sute Șaizeci Și Șapte',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Unu Virgulă Un Milion Două Sute Treizeci Și Patru De Mii Cinci Sute Șaizeci Și Șapte',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Unu Virgulă Cinci');
    expect(toWords.convert(0.05)).toBe('Zero Virgulă Zero Cinci');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Douăzeci Și Unu'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Douăzeci Și Unu'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Douăzeci Și Unu De Lei Și Cincizeci De Bani Exact',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'douăzeci și unu de lei și cincizeci de bani exact',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'DOUĂZECI ȘI UNU DE LEI ȘI CINCIZECI DE BANI EXACT',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'douăzeci și unu de lei și cincizeci de bani exact',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Douăzeci și unu de lei și cincizeci de bani exact',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Al Douăzeci Și Unulea'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'al douăzeci și unulea',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Unu Virgulă Douăzeci Și Cinci'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Unu Virgulă Doi Cinci',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import sqAl from '../src/locales/sq-AL.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/sq-AL.js';

const localeCode = 'sq-AL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(sqAl);
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
  [0, 'Zero'],
  [1, 'Një'],
  [2, 'Dy'],
  [3, 'Tre'],
  [4, 'Katër'],
  [5, 'Pesë'],
  [6, 'Gjashtë'],
  [7, 'Shtatë'],
  [8, 'Tetë'],
  [9, 'Nëntë'],
  [10, 'Dhjetë'],
  [11, 'Njëmbëdhjetë'],
  [12, 'Dymbëdhjetë'],
  [13, 'Trembëdhjetë'],
  [14, 'Katërmbëdhjetë'],
  [15, 'Pesëmbëdhjetë'],
  [16, 'Gjashtëmbëdhjetë'],
  [17, 'Shtatëmbëdhjetë'],
  [18, 'Tetëmbëdhjetë'],
  [19, 'Nëntëmbëdhjetë'],
  [20, 'Njëzet'],
  [21, 'Njëzet E Një'],
  [22, 'Njëzet E Dy'],
  [30, 'Tridhjetë'],
  [35, 'Tridhjetë E Pesë'],
  [40, 'Dyzet'],
  [50, 'Pesëdhjetë'],
  [60, 'Gjashtëdhjetë'],
  [70, 'Shtatëdhjetë'],
  [80, 'Tetëdhjetë'],
  [90, 'Nëntëdhjetë'],
  [99, 'Nëntëdhjetë E Nëntë'],
  [100, 'Njëqind'],
  [137, 'Njëqind E Tridhjetë E Shtatë'],
  [200, 'Dyqind'],
  [300, 'Treqind'],
  [400, 'Katërqind'],
  [500, 'Pesëqind'],
  [600, 'Gjashtëqind'],
  [700, 'Shtatëqind'],
  [800, 'Tetëqind'],
  [900, 'Nëntëqind'],
  [1000, 'Një Mijë'],
  [1100, 'Një Mijë E Njëqind'],
  [2000, 'Dy Mijë'],
  [3000, 'Tre Mijë'],
  [4000, 'Katër Mijë'],
  [5000, 'Pesë Mijë'],
  [4680, 'Katër Mijë E Gjashtëqind E Tetëdhjetë'],
  [10000, 'Dhjetë Mijë'],
  [63892, 'Gjashtëdhjetë E Tre Mijë E Tetëqind E Nëntëdhjetë E Dy'],
  [100000, 'Njëqind Mijë'],
  [1000000, 'Një Milion'],
  [2000000, 'Dy Milionë'],
  [5000000, 'Pesë Milionë'],
  [2741034, 'Dy Milionë E Shtatëqind E Dyzet E Një Mijë E Tridhjetë E Katër'],
  [1000000000, 'Një Miliard'],
  [2000000000, 'Dy Miliardë'],
  [5000000000, 'Pesë Miliardë'],
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
    row[1] = `${row[1]} Lekë Vetëm`;
  });
  testIntegersWithCurrency[1][1] = 'Një Lek Vetëm';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Lekë`;
  });
  testIntegersWithCurrency[1][1] = 'Një Lek';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Lekë Vetëm`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Lekë Vetëm`;
  });
  testNegativeIntegersWithCurrency[1][1] = 'Minus Një Lek Vetëm';

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else if (i === 1) {
      row[1] = 'Një Lek Vetëm';
    } else {
      row[1] = `${row[1]} Lekë Vetëm`;
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
  [0.0, 'Zero'],
  [0.04, 'Zero Presje Zero Katër'],
  [0.4, 'Zero Presje Katër'],
  [0.63, 'Zero Presje Gjashtëdhjetë E Tre'],
  [37.06, 'Tridhjetë E Shtatë Presje Zero Gjashtë'],
  [37.68, 'Tridhjetë E Shtatë Presje Gjashtëdhjetë E Tetë'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Njëqind E Njëzet E Tre Lekë Vetëm`],
    ['123', `Njëqind E Njëzet E Tre Lekë Vetëm`],
    ['123.0', `Njëqind E Njëzet E Tre Lekë E Zero Qindarka Vetëm`],
    ['123.00', `Njëqind E Njëzet E Tre Lekë E Zero Qindarka Vetëm`],
    ['0.00', `Zero Lekë E Zero Qindarka Vetëm`],
    ['-123.00', `Minus Njëqind E Njëzet E Tre Lekë E Zero Qindarka Vetëm`],
    ['37.68', `Tridhjetë E Shtatë Lekë E Gjashtëdhjetë E Tetë Qindarka Vetëm`],
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
  [0.0, 'Zero Lekë Vetëm'],
  [0.04, 'Zero Lekë E Katër Qindarka Vetëm'],
  [0.4, 'Zero Lekë E Dyzet Qindarka Vetëm'],
  [0.63, 'Zero Lekë E Gjashtëdhjetë E Tre Qindarka Vetëm'],
  [0.999, 'Një Lek Vetëm'],
  [37.06, 'Tridhjetë E Shtatë Lekë E Gjashtë Qindarka Vetëm'],
  [37.68, 'Tridhjetë E Shtatë Lekë E Gjashtëdhjetë E Tetë Qindarka Vetëm'],
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
      row[1] = (row[1] as string).replace('Zero Lekë E ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'Zero Lekë Vetëm'],
    [0.04, 'Zero Lekë Vetëm'],
    [0.4, 'Zero Lekë Vetëm'],
    [0.63, 'Zero Lekë Vetëm'],
    [0.999, 'Zero Lekë Vetëm'],
    [37.06, 'Tridhjetë E Shtatë Lekë Vetëm'],
    [37.68, 'Tridhjetë E Shtatë Lekë Vetëm'],
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
const testOrdinalNumbers: [number, string][] = [
  [1, 'I Parë'],
  [2, 'I Dytë'],
  [3, 'I Tretë'],
  [4, 'I Katërt'],
  [5, 'I Pestë'],
  [6, 'I Gjashtë'],
  [7, 'I Shtatë'],
  [8, 'I Tetë'],
  [9, 'I Nëntë'],
  [10, 'I Dhjetëti'],
  [11, 'I Njëmbëdhjetëti'],
  [12, 'I Dymbëdhjetëti'],
  [13, 'I Trembëdhjetëti'],
  [14, 'I Katërmbëdhjetëti'],
  [15, 'I Pesëmbëdhjetëti'],
  [16, 'I Gjashtëmbëdhjetëti'],
  [17, 'I Shtatëmbëdhjetëti'],
  [18, 'I Tetëmbëdhjetëti'],
  [19, 'I Nëntëmbëdhjetëti'],
  [20, 'I Njëzetti'],
  [21, 'I Njëzet E Njëti'],
  [22, 'I Njëzet E Dyti'],
  [30, 'I Tridhjetëti'],
  [40, 'I Dyzetti'],
  [50, 'I Pesëdhjetëti'],
  [60, 'I Gjashtëdhjetëti'],
  [70, 'I Shtatëdhjetëti'],
  [80, 'I Tetëdhjetëti'],
  [90, 'I Nëntëdhjetëti'],
  [100, 'I Njëqindti'],
  [101, 'I Njëqind E Njëti'],
  [200, 'I Dyqindti'],
  [300, 'I Treqindti'],
  [1000, 'I Mijëti'],
  [1001, 'I Një Mijë E Njëti'],
  [1000000, 'I Milionti'],
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
describe('Test Powers of Ten', () => {
  const powersOfTen: [number, string][] = [
    [10, 'Dhjetë'],
    [100, 'Njëqind'],
    [1000, 'Një Mijë'],
    [10000, 'Dhjetë Mijë'],
    [100000, 'Njëqind Mijë'],
    [1000000, 'Një Milion'],
  ];

  test.concurrent.each(powersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
describe('Test BigInt Inputs', () => {
  const bigIntTests: [bigint, string][] = [
    [0n, 'Zero'],
    [1n, 'Një'],
    [100n, 'Njëqind'],
    [1000n, 'Një Mijë'],
  ];

  test.concurrent.each(bigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// Negative BigInt Tests
describe('Test Negative BigInt Inputs', () => {
  const negativeBigIntTests: [bigint, string][] = [
    [-1n, 'Minus Një'],
    [-100n, 'Minus Njëqind'],
    [-1000n, 'Minus Një Mijë'],
  ];

  test.concurrent.each(negativeBigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// String Input Tests
describe('Test String Inputs', () => {
  const stringTests: [string, string][] = [
    ['0', 'Zero'],
    ['1', 'Një'],
    ['100', 'Njëqind'],
    ['-100', 'Minus Njëqind'],
  ];

  test.concurrent.each(stringTests)('convert %s => %s', (input, expected) => {
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

  test('convert 0 with currency => Zero Lekë Vetëm', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Lekë Vetëm');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  const invalidInputs: [unknown, string][] = [
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(invalidInputs)('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedMessage);
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

const testFractionStyleSqAL: [number, string][] = [
  [1.1, 'Një E Një E Dhjeta'],
  [2.5, 'Dy E Pesë Të Dhjeta'],
  [1.01, 'Një E Një E Qindta'],
  [1.45, 'Një E Dyzet E Pesë Të Qindtat'],
  [0.05, 'Zero E Pesë Të Qindtat'],
  [1.001, 'Një E Një E Mijëta'],
  [1.005, 'Një E Pesë Të Mijëtat'],
  [1.0001, 'Një E Një E Dhjetë Mijëta'],
  [1.0005, 'Një E Pesë Të Dhjetë Mijëtat'],
  [1.00001, 'Një E Një E Njëqind Mijëta'],
  [1.00005, 'Një E Pesë Të Njëqind Mijëtat'],
  [1.000001, 'Një E Një E Milionëta'],
  [1.000005, 'Një E Pesë Të Milionëtat'],
  [123.45, 'Njëqind E Njëzet E Tre E Dyzet E Pesë Të Qindtat'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleSqAL)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Një Presje Një Milion E Dyqind E Tridhjetë E Katër Mijë E Pesëqind E Gjashtëdhjetë E Shtatë',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Një Presje Një Milion E Dyqind E Tridhjetë E Katër Mijë E Pesëqind E Gjashtëdhjetë E Shtatë',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Një Presje Pesë');
    expect(toWords.convert(0.05)).toBe('Zero Presje Zero Pesë');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Njëzet E Një'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Njëzet E Një'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Njëzet E Një Lekë E Pesëdhjetë Qindarka Vetëm',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'njëzet e një lekë e pesëdhjetë qindarka vetëm',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'NJËZET E NJË LEKË E PESËDHJETË QINDARKA VETËM',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'njëzet e një lekë e pesëdhjetë qindarka vetëm',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Njëzet e një lekë e pesëdhjetë qindarka vetëm',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'I Njëzet E Njëti'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'i njëzet e njëti',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Një Presje Njëzet E Pesë'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Një Presje Dy Pesë',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

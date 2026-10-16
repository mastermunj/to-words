import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import bgBg from '../src/locales/bg-BG.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/bg-BG.js';

const localeCode = 'bg-BG';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(bgBg);
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
  [0, 'Нула'],
  [1, 'Едно'],
  [2, 'Две'],
  [3, 'Три'],
  [4, 'Четири'],
  [5, 'Пет'],
  [6, 'Шест'],
  [7, 'Седем'],
  [8, 'Осем'],
  [9, 'Девет'],
  [10, 'Десет'],
  [11, 'Единадесет'],
  [12, 'Дванадесет'],
  [13, 'Тринадесет'],
  [14, 'Четиринадесет'],
  [15, 'Петнадесет'],
  [16, 'Шестнадесет'],
  [17, 'Седемнадесет'],
  [18, 'Осемнадесет'],
  [19, 'Деветнадесет'],
  [20, 'Двадесет'],
  [21, 'Двадесет И Едно'],
  [22, 'Двадесет И Две'],
  [30, 'Тридесет'],
  [35, 'Тридесет И Пет'],
  [40, 'Четиридесет'],
  [50, 'Петдесет'],
  [60, 'Шестдесет'],
  [70, 'Седемдесет'],
  [80, 'Осемдесет'],
  [90, 'Деветдесет'],
  [99, 'Деветдесет И Девет'],
  [100, 'Сто'],
  [137, 'Сто Тридесет И Седем'],
  [200, 'Двеста'],
  [300, 'Триста'],
  [400, 'Четиристотин'],
  [500, 'Петстотин'],
  [600, 'Шестстотин'],
  [700, 'Седемстотин'],
  [800, 'Осемстотин'],
  [900, 'Деветстотин'],
  [1000, 'Хиляда'],
  [1100, 'Хиляда И Сто'],
  [2000, 'Две Хиляди'],
  [3000, 'Три Хиляди'],
  [4000, 'Четири Хиляди'],
  [5000, 'Пет Хиляди'],
  [4680, 'Четири Хиляди Шестстотин И Осемдесет'],
  [10000, 'Десет Хиляди'],
  [63892, 'Шестдесет И Три Хиляди Осемстотин Деветдесет И Две'],
  [100000, 'Сто Хиляди'],
  [1000000, 'Милион'],
  [2000000, 'Два Милиона'],
  [5000000, 'Пет Милиона'],
  [2741034, 'Два Милиона Седемстотин Четиридесет И Една Хиляди Тридесет И Четири'],
  [1000000000, 'Милиард'],
  [2000000000, 'Два Милиарда'],
  [5000000000, 'Пет Милиарда'],
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
    row[1] = `Минус ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// Helper function to get Bulgarian currency form
// Bulgaria uses the euro since 2026-01-01. Евро is invariable and neuter, so the amount keeps its
// default (neuter) form: Едно Евро, Две Евро, Пет Евро.
const currencyName = 'Евро';

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ${currencyName} Само`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
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
      row[1] = `${row[1]} Евро Само`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Минус ${row[1]} ${currencyName} Само`;
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
      row[1] = `${row[1]} ${currencyName} Само`;
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
  [0.0, 'Нула'],
  [0.04, 'Нула Цяло И Четири Стотни'],
  [0.4, 'Нула Цяло И Четири Десети'],
  [0.63, 'Нула Цяло И Шестдесет И Три Стотни'],
  [37.06, 'Тридесет И Седем Цяло И Шест Стотни'],
  [37.68, 'Тридесет И Седем Цяло И Шестдесет И Осем Стотни'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Сто Двадесет И Три Евро Само`],
    ['123', `Сто Двадесет И Три Евро Само`],
    ['123.0', `Сто Двадесет И Три Евро И Нула Евроцента Само`],
    ['123.00', `Сто Двадесет И Три Евро И Нула Евроцента Само`],
    ['0.00', `Нула Евро И Нула Евроцента Само`],
    ['-123.00', `Минус Сто Двадесет И Три Евро И Нула Евроцента Само`],
    ['37.68', `Тридесет И Седем Евро И Шестдесет И Осем Евроцента Само`],
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
  [0.0, 'Нула Евро Само'],
  [0.04, 'Нула Евро И Четири Евроцента Само'],
  [0.4, 'Нула Евро И Четиридесет Евроцента Само'],
  [0.63, 'Нула Евро И Шестдесет И Три Евроцента Само'],
  [0.999, 'Едно Евро Само'],
  [37.06, 'Тридесет И Седем Евро И Шест Евроцента Само'],
  [37.68, 'Тридесет И Седем Евро И Шестдесет И Осем Евроцента Само'],
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
      row[1] = (row[1] as string).replace('Нула Евро И ', '');
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
      row[1] = 'Нула Евро Само';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` (Евро) И [\\u0400-\\u04FF ]+ Евроцента?`), ' $1');
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
  [1, 'Първи'],
  [2, 'Втори'],
  [3, 'Трети'],
  [4, 'Четвърти'],
  [5, 'Пети'],
  [6, 'Шести'],
  [7, 'Седми'],
  [8, 'Осми'],
  [9, 'Девети'],
  [10, 'Десети'],

  // Numbers 11-19
  [11, 'Единадесети'],
  [12, 'Дванадесети'],
  [13, 'Тринадесети'],
  [14, 'Четиринадесети'],
  [15, 'Петнадесети'],
  [16, 'Шестнадесети'],
  [17, 'Седемнадесети'],
  [18, 'Осемнадесети'],
  [19, 'Деветнадесети'],

  // Tens
  [20, 'Двадесети'],
  [21, 'Двадесет И Първи'],
  [22, 'Двадесет И Втори'],
  [30, 'Тридесети'],
  [40, 'Четиридесети'],
  [50, 'Петдесети'],
  [60, 'Шестдесети'],
  [70, 'Седемдесети'],
  [80, 'Осемдесети'],
  [90, 'Деветдесети'],

  // Hundreds
  [100, 'Стотен'],
  [101, 'Сто И Първи'],
  [200, 'Двестотен'],
  [300, 'Тристотен'],

  // Thousands
  [1000, 'Хиляден'],
  [1001, 'Хиляда И Първи'],

  // Millions
  [1000000, 'Милионен'],
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
  [10, 'Десет'],
  [100, 'Сто'],
  [1000, 'Хиляда'],
  [10000, 'Десет Хиляди'],
  [100000, 'Сто Хиляди'],
  [1000000, 'Милион'],
  [10000000, 'Десет Милиона'],
  [100000000, 'Сто Милиона'],
  [1000000000, 'Милиард'],
  [10000000000, 'Десет Милиарда'],
  [100000000000, 'Сто Милиарда'],
  [1000000000000, 'Трилион'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Нула'],
  [1n, 'Едно'],
  [100n, 'Сто'],
  [1000n, 'Хиляда'],
  [1000000n, 'Милион'],
];

describe('Test BigInt Inputs', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Минус Едно'],
  [-100n, 'Минус Сто'],
  [-1000n, 'Минус Хиляда'],
  [-1000000n, 'Минус Милион'],
];

describe('Test Negative BigInt Inputs', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Нула'],
  ['1', 'Едно'],
  ['100', 'Сто'],
  ['-100', 'Минус Сто'],
  ['  100  ', 'Сто'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

// Zero Variants Tests
describe('Test Zero Variants', () => {
  test('convert 0 => Нула', () => {
    expect(toWords.convert(0)).toBe('Нула');
  });

  test('convert -0 => Нула', () => {
    expect(toWords.convert(-0)).toBe('Нула');
  });

  test('convert 0.0 => Нула', () => {
    expect(toWords.convert(0.0)).toBe('Нула');
  });

  test('convert 0n => Нула', () => {
    expect(toWords.convert(0n)).toBe('Нула');
  });

  test('convert "0" => Нула', () => {
    expect(toWords.convert('0')).toBe('Нула');
  });

  test('convert 0 with currency => Нула Евро Само', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Нула Евро Само');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('should throw error for non-numeric string', () => {
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

const testFractionStyleBgBG: [number, string][] = [
  [1.1, 'Едно Цяло И Една Десета'],
  [2.5, 'Две Цяло И Пет Десети'],
  [1.01, 'Едно Цяло И Една Стотна'],
  [1.45, 'Едно Цяло И Четиридесет И Пет Стотни'],
  [0.05, 'Нула Цяло И Пет Стотни'],
  [1.001, 'Едно Цяло И Една Хилядна'],
  [1.005, 'Едно Цяло И Пет Хилядни'],
  [1.0001, 'Едно Цяло И Една Десетхилядна'],
  [1.0005, 'Едно Цяло И Пет Десетхилядни'],
  [1.00001, 'Едно Цяло И Една Стохилядна'],
  [1.00005, 'Едно Цяло И Пет Стохилядни'],
  [1.000001, 'Едно Цяло И Една Милионна'],
  [1.000005, 'Едно Цяло И Пет Милионни'],
  [123.45, 'Сто Двадесет И Три Цяло И Четиридесет И Пет Стотни'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleBgBG)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Едно Цяло Милион Двеста Тридесет И Четири Хиляди Петстотин Шестдесет И Седем',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'Едно Цяло Милион Двеста Тридесет И Четири Хиляди Петстотин Шестдесет И Седем',
    );
  });

  test("fraction reading is the default; decimalStyle: 'digit' keeps the old reading", () => {
    // en.wiktionary «цяло»: пет цяло и две десети
    expect(toWords.convert(5.2)).toBe('Пет Цяло И Две Десети');
    expect(toWords.convert(1.5)).toBe('Едно Цяло И Пет Десети');
    expect(toWords.convert(0.05)).toBe('Нула Цяло И Пет Стотни');
    expect(toWords.convert(1.5, { decimalStyle: 'digit' })).toBe('Едно Цяло Пет');
  });
});

describe('«и» before the last component (bg.wikipedia number articles)', () => {
  test.each([
    [120, 'Сто И Двадесет'],
    [121, 'Сто Двадесет И Едно'],
    [1001, 'Хиляда И Едно'],
    [1100, 'Хиляда И Сто'],
    [1133, 'Хиляда Сто Тридесет И Три'],
    [2500000, 'Два Милиона И Петстотин Хиляди'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
    expect(toWords.convert(input, { useAnd: true })).toBe(expected);
  });

  test.each([
    [121, 'Сто Двадесет И Първи'],
    [156, 'Сто Петдесет И Шести'],
    [1001, 'Хиляда И Първи'],
    [2000, 'Двухиляден'],
    [1100000, 'Милион И Стохиляден'],
  ])('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Двадесет И Едно'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Двадесет И Едно'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Двадесет И Едно Евро И Петдесет Евроцента Само',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'двадесет и едно евро и петдесет евроцента само',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'ДВАДЕСЕТ И ЕДНО ЕВРО И ПЕТДЕСЕТ ЕВРОЦЕНТА САМО',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'двадесет и едно евро и петдесет евроцента само',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Двадесет и едно евро и петдесет евроцента само',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Двадесет И Първи'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'двадесет и първи',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Едно Цяло И Двадесет И Пет Стотни'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Едно Цяло Две Пет',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

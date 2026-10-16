import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import hboIl from '../src/locales/hbo-IL.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/hbo-IL.js';

const localeCode = 'hbo-IL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(hboIl);
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

// שקל is masculine and «one»/«two» follow their own forms (as he-IL).
const shekels = (amount: number): string => {
  const n = Math.abs(amount);
  if (n === 1) {
    return 'שקל אחד';
  }
  if (n === 2) {
    return 'שני שקלים';
  }
  return `${toWords.convert(n, { gender: 'masculine' })} שקלים`;
};

const testIntegers: [number, string][] = [
  [0, 'אפס'],
  [137, 'מאה שלשים ושבע'],
  [700, 'שבע מאות'],
  [1100, 'אלף ומאה'],
  [4680, 'ארבעת אלפים שש מאות ושמונים'],
  [63892, 'ששים ושלשה אלף שמנה מאות תשעים ושתים'],
  [86100, 'שמונים וששה אלף ומאה'],
  [792581, 'שבע מאות תשעים ושנים אלף חמש מאות שמונים ואחת'],
  [2741034, 'שני מיליון שבע מאות ארבעים ואחד אלף שלשים וארבע'],
  [86429753, 'שמונים וששה מיליון ארבע מאות עשרים ותשעה אלף שבע מאות חמשים ושלש'],
  [975310864, 'תשע מאות שבעים וחמשה מיליון שלש מאות ועשרה אלף שמנה מאות ששים וארבע'],
  [1000000000, 'מיליארד'],
  [9876543210, 'תשעה מיליארד שמנה מאות שבעים וששה מיליון חמש מאות ארבעים ושלשה אלף שתים מאה ועשר'],
  [10000000000, 'עשרה מיליארד'],
  [100000000000, 'מאה מיליארד'],
  [1000000000000, 'טריליון'],
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
    row[1] = `מינוס ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = shekels(row[0]);
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = shekels(row[0]);
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = shekels(row[0]);
      return;
    }
    row[0] = -row[0];
    row[1] = `מינוס ${shekels(row[0])}`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : shekels(row[0]);
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
  [0.0, 'אפס'],
  [0.04, 'אפס נקודה אפס ארבע'],
  [0.0468, 'אפס נקודה אפס ארבע שש שמנה'],
  [0.4, 'אפס נקודה ארבע'],
  [0.63, 'אפס נקודה ששים ושלש'],
  [0.973, 'אפס נקודה תשע מאות שבעים ושלש'],
  [0.999, 'אפס נקודה תשע מאות תשעים ותשע'],
  [37.06, 'שלשים ושבע נקודה אפס שש'],
  [37.068, 'שלשים ושבע נקודה אפס שש שמנה'],
  [37.68, 'שלשים ושבע נקודה ששים ושמנה'],
  [37.683, 'שלשים ושבע נקודה שש מאות שמונים ושלש'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `מאה עשרים ושלשה שקלים`],
    ['123', `מאה עשרים ושלשה שקלים`],
    ['123.0', `מאה עשרים ושלשה שקלים ואפס גרות`],
    ['123.00', `מאה עשרים ושלשה שקלים ואפס גרות`],
    ['0.00', `אפס שקלים ואפס גרות`],
    ['-123.00', `מינוס מאה עשרים ושלשה שקלים ואפס גרות`],
    ['37.68', `שלשים ושבעה שקלים וששים ושמנה גרות`],
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
  [0.0, 'אפס שקלים'],
  [0.01, 'אפס שקלים וגרה אחת'],
  [0.04, 'אפס שקלים וארבע גרות'],
  [0.0468, 'אפס שקלים וחמש גרות'],
  [0.5, 'אפס שקלים וחמשים גרות'],
  [0.63, 'אפס שקלים וששים ושלש גרות'],
  [0.973, 'אפס שקלים ותשעים ושבע גרות'],
  [0.999, 'שקל אחד'],
  [1.25, 'שקל אחד ועשרים וחמש גרות'],
  [10.99, 'עשרה שקלים ותשעים ותשע גרות'],
  [37.06, 'שלשים ושבעה שקלים ושש גרות'],
  [37.68, 'שלשים ושבעה שקלים וששים ושמנה גרות'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.01, 'גרה אחת'],
    [0.04, 'ארבע גרות'],
    [0.0468, 'חמש גרות'],
    [0.5, 'חמשים גרות'],
    [0.63, 'ששים ושלש גרות'],
    [0.973, 'תשעים ושבע גרות'],
    [0.999, 'שקל אחד'],
    [1.25, 'שקל אחד ועשרים וחמש גרות'],
    [10.99, 'עשרה שקלים ותשעים ותשע גרות'],
    [37.06, 'שלשים ושבעה שקלים ושש גרות'],
    [37.68, 'שלשים ושבעה שקלים וששים ושמנה גרות'],
  ];

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
    [0.0, 'אפס שקלים'],
    [0.01, 'אפס שקלים'],
    [0.04, 'אפס שקלים'],
    [0.0468, 'אפס שקלים'],
    [0.5, 'אפס שקלים'],
    [0.63, 'אפס שקלים'],
    [0.973, 'אפס שקלים'],
    [0.999, 'אפס שקלים'],
    [1.25, 'שקל אחד'],
    [10.99, 'עשרה שקלים'],
    [37.06, 'שלשים ושבעה שקלים'],
    [37.68, 'שלשים ושבעה שקלים'],
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

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals: [number, string][] = [
    [0.0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, 'שקל אחד'],
    [10.99, 'עשרה שקלים'],
    [37.06, 'שלשים ושבעה שקלים'],
    [37.68, 'שלשים ושבעה שקלים'],
  ];

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

// Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  // Basic ordinals 1-20
  [1, 'הראשון'],
  [2, 'השני'],
  [3, 'השלישי'],
  [4, 'הרביעי'],
  [5, 'החמישי'],
  [6, 'הששי'],
  [7, 'השביעי'],
  [8, 'השמיני'],
  [9, 'התשיעי'],
  [10, 'העשירי'],
  [11, 'האחת עשרה'],
  [12, 'השתים עשרה'],
  [13, 'השלש עשרה'],
  [14, 'הארבע עשרה'],
  [15, 'החמש עשרה'],
  [16, 'השש עשרה'],
  [17, 'השבע עשרה'],
  [18, 'השמנה עשרה'],
  [19, 'התשע עשרה'],
  [20, 'העשרים'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'העשרים ואחד'],
  [22, 'העשרים ושנים'],
  [23, 'העשרים ושלשה'],
  [30, 'השלשים'],
  [40, 'הארבעים'],
  [50, 'החמשים'],
  [60, 'הששים'],
  [70, 'השבעים'],
  [80, 'השמונים'],
  [90, 'התשעים'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'השלשים ואחד'],
  [32, 'השלשים ושנים'],
  [33, 'השלשים ושלשה'],
  [41, 'הארבעים ואחד'],
  [42, 'הארבעים ושנים'],
  [43, 'הארבעים ושלשה'],
  [51, 'החמשים ואחד'],
  [52, 'החמשים ושנים'],
  [53, 'החמשים ושלשה'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'המאה'],
  [200, 'המאתים'],
  [1000, 'האלף'],
  [10000, 'העשרת אלפים'],

  // Larger numbers
  [100000, 'המאה אלף'],
  [1000000, 'המיליון'],
  [100001, 'המאה אלף ואחד'],
  [100002, 'המאה אלף ושנים'],
  [100003, 'המאה אלף ושלשה'],

  // Numbers in the hundreds with endings
  [101, 'המאה ואחד'],
  [102, 'המאה ושנים'],
  [103, 'המאה ושלשה'],
  [111, 'המאה ואחד עשר'],
  [112, 'המאה ושנים עשר'],
  [113, 'המאה ושלשה עשר'],
  [123, 'המאה עשרים ושלשה'],

  // Complex numbers
  [1001, 'האלף ואחד'],
  [1234, 'האלף שתים מאה שלשים וארבעה'],
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

describe('Test Invalid Inputs', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for invalid string input', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow(/Invalid Number/);
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'עשר'],
    [100, 'מאה'],
    [1000, 'אלף'],
    [10000, 'עשרת אלפים'],
    [100000, 'מאה אלף'],
    [1000000, 'מיליון'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt Inputs', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'אפס'],
    [1n, 'אחת'],
    [100n, 'מאה'],
    [1000n, 'אלף'],
  ];

  test.concurrent.each(testBigInts)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test Negative BigInt Inputs', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'מינוס אחת'],
    [-100n, 'מינוס מאה'],
    [-1000n, 'מינוס אלף'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test String Inputs', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'אפס'],
    ['1', 'אחת'],
    ['100', 'מאה'],
    ['-100', 'מינוס מאה'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => אפס', () => {
    expect(toWords.convert(0)).toBe('אפס');
  });

  test('convert -0 => אפס', () => {
    expect(toWords.convert(-0)).toBe('אפס');
  });

  test('convert 0.0 => אפס', () => {
    expect(toWords.convert(0.0)).toBe('אפס');
  });

  test('convert 0n => אפס', () => {
    expect(toWords.convert(0n)).toBe('אפס');
  });

  test('convert "0" => אפס', () => {
    expect(toWords.convert('0')).toBe('אפס');
  });

  test('convert 0 with currency => אפס שקלים', () => {
    expect(toWords.convert(0, { currency: true })).toBe('אפס שקלים');
  });
});

describe('Test Invalid Inputs - Extended', () => {
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
    expect(() => toWords.convert('' as unknown as number)).toThrow(/Invalid Number/);
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow(/Invalid Number/);
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

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  // This script has no capital letters, so every casing leaves the output unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'עשרים ואחת'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'עשרים ואחת'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), 'עשרים ואחד שקלים וחמשים גרות'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), 'עשרים ואחד שקלים וחמשים גרות'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), 'עשרים ואחד שקלים וחמשים גרות'],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'עשרים ואחד שקלים וחמשים גרות',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'עשרים ואחד שקלים וחמשים גרות',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'העשרים ואחד'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'העשרים ואחד',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'אחת נקודה עשרים וחמש'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'אחת נקודה שתים חמש',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

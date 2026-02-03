import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import hboIl from '../src/locales/hbo-IL.js';
import { ToWords as LocaleToWords } from '../src/locales/hbo-IL.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, 'אפס'],
  [137, 'אחת מאה שלשים שבע'],
  [700, 'שבע מאה'],
  [1100, 'אלף מאה'],
  [4680, 'ארבע אלף שש מאה שמונים'],
  [63892, 'ששים שלש אלף שמנה מאה תשעים שתים'],
  [86100, 'שמונים שש אלף מאה'],
  [792581, 'שבע מאה תשעים שתים אלף חמש מאה שמונים אחת'],
  [2741034, 'שתים מיליון שבע מאה ארבעים אחת אלף שלשים ארבע'],
  [86429753, 'שמונים שש מיליון ארבע מאה עשרים תשע אלף שבע מאה חמשים שלש'],
  [975310864, 'תשע מאה שבעים חמש מיליון שלש מאה עשר אלף שמנה מאה ששים ארבע'],
  [1000000000, 'מיליארד'],
  [9876543210, 'תשע מיליארד שמנה מאה שבעים שש מיליון חמש מאה ארבעים שלש אלף שתים מאה עשר'],
  [10000000000, 'עשר מיליארד'],
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
    row[1] = `${row[1]} שקלים`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} שקלים`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} שקלים`;
      return;
    }
    row[0] = -row[0];
    row[1] = `מינוס ${row[1]} שקלים`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} שקלים`;
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
  [0.63, 'אפס נקודה ששים שלש'],
  [0.973, 'אפס נקודה תשע מאה שבעים שלש'],
  [0.999, 'אפס נקודה תשע מאה תשעים תשע'],
  [37.06, 'שלשים שבע נקודה אפס שש'],
  [37.068, 'שלשים שבע נקודה אפס שש שמנה'],
  [37.68, 'שלשים שבע נקודה ששים שמנה'],
  [37.683, 'שלשים שבע נקודה שש מאה שמונים שלש'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'אפס שקלים'],
  [0.01, 'אפס שקלים ו אחת גרה'],
  [0.04, 'אפס שקלים ו ארבע גרות'],
  [0.0468, 'אפס שקלים ו חמש גרות'],
  [0.5, 'אפס שקלים ו חמשים גרות'],
  [0.63, 'אפס שקלים ו ששים שלש גרות'],
  [0.973, 'אפס שקלים ו תשעים שבע גרות'],
  [0.999, 'אחת שקל'],
  [1.25, 'אחת שקל ו עשרים חמש גרות'],
  [10.99, 'עשר שקלים ו תשעים תשע גרות'],
  [37.06, 'שלשים שבע שקלים ו שש גרות'],
  [37.68, 'שלשים שבע שקלים ו ששים שמנה גרות'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.01, 'אחת גרה'],
    [0.04, 'ארבע גרות'],
    [0.0468, 'חמש גרות'],
    [0.5, 'חמשים גרות'],
    [0.63, 'ששים שלש גרות'],
    [0.973, 'תשעים שבע גרות'],
    [0.999, 'אחת שקל'],
    [1.25, 'אחת שקל ו עשרים חמש גרות'],
    [10.99, 'עשר שקלים ו תשעים תשע גרות'],
    [37.06, 'שלשים שבע שקלים ו שש גרות'],
    [37.68, 'שלשים שבע שקלים ו ששים שמנה גרות'],
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
    [1.25, 'אחת שקל'],
    [10.99, 'עשר שקלים'],
    [37.06, 'שלשים שבע שקלים'],
    [37.68, 'שלשים שבע שקלים'],
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
    [1.25, 'אחת שקל'],
    [10.99, 'עשר שקלים'],
    [37.06, 'שלשים שבע שקלים'],
    [37.68, 'שלשים שבע שקלים'],
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
  [21, 'עשרים הראשון'],
  [22, 'עשרים השני'],
  [23, 'עשרים השלישי'],
  [30, 'השלשים'],
  [40, 'הארבעים'],
  [50, 'החמשים'],
  [60, 'הששים'],
  [70, 'השבעים'],
  [80, 'השמונים'],
  [90, 'התשעים'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'שלשים הראשון'],
  [32, 'שלשים השני'],
  [33, 'שלשים השלישי'],
  [41, 'ארבעים הראשון'],
  [42, 'ארבעים השני'],
  [43, 'ארבעים השלישי'],
  [51, 'חמשים הראשון'],
  [52, 'חמשים השני'],
  [53, 'חמשים השלישי'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'המאה'],
  [200, 'המאתים'],
  [1000, 'האלף'],
  [10000, 'עשר האלף'],

  // Larger numbers
  [100000, 'מאה האלף'],
  [1000000, 'המיליון'],
  [100001, 'מאה אלף הראשון'],
  [100002, 'מאה אלף השני'],
  [100003, 'מאה אלף השלישי'],

  // Numbers in the hundreds with endings
  [101, 'אחת מאה הראשון'],
  [102, 'אחת מאה השני'],
  [103, 'אחת מאה השלישי'],
  [111, 'אחת מאה האחת עשרה'],
  [112, 'אחת מאה השתים עשרה'],
  [113, 'אחת מאה השלש עשרה'],
  [123, 'אחת מאה עשרים השלישי'],

  // Complex numbers
  [1001, 'אלף הראשון'],
  [1234, 'אלף שתים מאה שלשים הרביעי'],
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
    expect(() => toWords.convert(NaN)).toThrow();
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('should throw error for invalid string input', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow();
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'עשר'],
    [100, 'מאה'],
    [1000, 'אלף'],
    [10000, 'עשר אלף'],
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
    expect(() => toWords.convert(NaN)).toThrow();
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('' as unknown as number)).toThrow();
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow();
  });
});

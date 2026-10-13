import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import heIl from '../src/locales/he-IL.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/he-IL.js';

const localeCode = 'he-IL';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(heIl);
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
  [0, 'אפס'],
  [1, 'אחת'],
  [2, 'שתיים'],
  [3, 'שלוש'],
  [4, 'ארבע'],
  [5, 'חמש'],
  [6, 'שש'],
  [7, 'שבע'],
  [8, 'שמונה'],
  [9, 'תשע'],
  [10, 'עשר'],
  [11, 'אחת עשרה'],
  [12, 'שתים עשרה'],
  [13, 'שלוש עשרה'],
  [14, 'ארבע עשרה'],
  [15, 'חמש עשרה'],
  [16, 'שש עשרה'],
  [17, 'שבע עשרה'],
  [18, 'שמונה עשרה'],
  [19, 'תשע עשרה'],
  [20, 'עשרים'],
  [21, 'עשרים ואחת'],
  [25, 'עשרים וחמש'],
  [30, 'שלושים'],
  [42, 'ארבעים ושתיים'],
  [50, 'חמישים'],
  [99, 'תשעים ותשע'],
  [100, 'מאה'],
  [137, 'מאה שלושים ושבע'],
  [200, 'מאתיים'],
  [300, 'שלוש מאות'],
  [500, 'חמש מאות'],
  [700, 'שבע מאות'],
  [999, 'תשע מאות תשעים ותשע'],
  [1000, 'אלף'],
  [1001, 'אלף ואחת'],
  [1234, 'אלף מאתיים שלושים וארבע'],
  [2000, 'אלפיים'],
  [4680, 'ארבעת אלפים שש מאות ושמונים'],
  [10000, 'עשרת אלפים'],
  [63892, 'שישים ושלושה אלף שמונה מאות תשעים ושתיים'],
  [100000, 'מאה אלף'],
  [792581, 'שבע מאות תשעים ושניים אלף חמש מאות שמונים ואחת'],
  [1000000, 'מיליון'],
  [2741034, 'שני מיליון שבע מאות ארבעים ואחד אלף שלושים וארבע'],
  [86429753, 'שמונים ושישה מיליון ארבע מאות עשרים ותשעה אלף שבע מאות חמישים ושלוש'],
  [1000000000, 'מיליארד'],
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

const testFloats: [number, string][] = [
  [0.0, 'אפס'],
  [0.4, 'אפס נקודה ארבע'],
  [0.04, 'אפס נקודה אפס ארבע'],
  [0.63, 'אפס נקודה שישים ושלוש'],
  [0.973, 'אפס נקודה תשע מאות שבעים ושלוש'],
  [0.999, 'אפס נקודה תשע מאות תשעים ותשע'],
  [37.06, 'שלושים ושבע נקודה אפס שש'],
  [37.68, 'שלושים ושבע נקודה שישים ושמונה'],
  [37.683, 'שלושים ושבע נקודה שש מאות שמונים ושלוש'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `מאה עשרים ושלושה שקלים בלבד`],
    ['123', `מאה עשרים ושלושה שקלים בלבד`],
    ['123.0', `מאה עשרים ושלושה שקלים ואפס אגורות בלבד`],
    ['123.00', `מאה עשרים ושלושה שקלים ואפס אגורות בלבד`],
    ['0.00', `אפס שקלים ואפס אגורות בלבד`],
    ['-123.00', `מינוס מאה עשרים ושלושה שקלים ואפס אגורות בלבד`],
    ['37.68', `שלושים ושבעה שקלים ושישים ושמונה אגורות בלבד`],
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

// שקל is masculine and «one»/«two» have fixed phrases (שקל אחד, שני שקלים).
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

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${shekels(row[0] as number)} בלבד`;
  });
  // Fix for singular form
  testIntegersWithCurrency[1][1] = 'שקל אחד בלבד';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = shekels(row[0] as number);
  });
  // Fix for singular form
  testIntegersWithCurrency[1][1] = 'שקל אחד';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${shekels(row[0] as number)} בלבד`;
      return;
    }
    row[0] = -row[0];
    row[1] = `מינוס ${shekels(row[0] as number)} בלבד`;
  });
  // Fix for singular form
  testNegativeIntegersWithCurrency[1][1] = 'מינוס שקל אחד בלבד';

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${shekels(row[0] as number)} בלבד`;
  });
  // Fix for singular form
  testIntegersWithCurrencyAndIgnoreZeroCurrency[1][1] = 'שקל אחד בלבד';

  test.concurrent.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'אפס שקלים בלבד'],
  [0.04, 'אפס שקלים וארבע אגורות בלבד'],
  [0.4, 'אפס שקלים וארבעים אגורות בלבד'],
  [0.63, 'אפס שקלים ושישים ושלוש אגורות בלבד'],
  [0.973, 'אפס שקלים ותשעים ושבע אגורות בלבד'],
  [0.999, 'שקל אחד בלבד'],
  [37.06, 'שלושים ושבעה שקלים ושש אגורות בלבד'],
  [37.68, 'שלושים ושבעה שקלים ושישים ושמונה אגורות בלבד'],
  [37.683, 'שלושים ושבעה שקלים ושישים ושמונה אגורות בלבד'],
  [100, 'מאה שקלים בלבד'],
  [500.25, 'חמש מאות שקלים ועשרים וחמש אגורות בלבד'],
  [1000.5, 'אלף שקלים וחמישים אגורות בלבד'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace('אפס שקלים ו', '');
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
    [0.0, 'אפס שקלים בלבד'],
    [0.04, 'אפס שקלים בלבד'],
    [0.4, 'אפס שקלים בלבד'],
    [0.63, 'אפס שקלים בלבד'],
    [0.973, 'אפס שקלים בלבד'],
    [0.999, 'אפס שקלים בלבד'],
    [37.06, 'שלושים ושבעה שקלים בלבד'],
    [37.68, 'שלושים ושבעה שקלים בלבד'],
    [37.683, 'שלושים ושבעה שקלים בלבד'],
    [100, 'מאה שקלים בלבד'],
    [500.25, 'חמש מאות שקלים בלבד'],
    [1000.5, 'אלף שקלים בלבד'],
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

const testOrdinals: [number, string][] = [
  [0, 'האפס'],
  [1, 'הראשון'],
  [2, 'השני'],
  [3, 'השלישי'],
  [4, 'הרביעי'],
  [5, 'החמישי'],
  [6, 'השישי'],
  [7, 'השביעי'],
  [8, 'השמיני'],
  [9, 'התשיעי'],
  [10, 'העשירי'],
  [11, 'האחד עשר'],
  [12, 'השנים עשר'],
  [19, 'התשעה עשר'],
  [20, 'העשרים'],
  [21, 'העשרים ואחד'],
  [25, 'העשרים וחמישה'],
  [30, 'השלושים'],
  [99, 'התשעים ותשעה'],
  [100, 'המאה'],
  [200, 'המאתיים'],
  [1000, 'האלף'],
  [2000, 'האלפיים'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'עשר'],
  [100, 'מאה'],
  [1000, 'אלף'],
  [10000, 'עשרת אלפים'],
  [100000, 'מאה אלף'],
  [1000000, 'מיליון'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'אפס'],
  [1n, 'אחת'],
  [100n, 'מאה'],
  [1000n, 'אלף'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'מינוס אחת'],
  [-100n, 'מינוס מאה'],
  [-1000n, 'מינוס אלף'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'אפס'],
  ['1', 'אחת'],
  ['100', 'מאה'],
  ['-100', 'מינוס מאה'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  const testZeroVariants: [number | bigint | string, string][] = [
    [0, 'אפס'],
    [-0, 'אפס'],
    [0.0, 'אפס'],
    [0n, 'אפס'],
    ['0', 'אפס'],
  ];

  test.concurrent.each(testZeroVariants)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('convert 0 with currency => אפס שקלים בלבד', () => {
    expect(toWords.convert(0, { currency: true })).toBe('אפס שקלים בלבד');
  });
});

describe('Test Invalid Inputs', () => {
  const testInvalidInputs: [number | string, string][] = [
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(testInvalidInputs)('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input)).toThrow(expectedMessage);
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

const testFractionStyleHeIL: [number, string][] = [
  [1.1, 'אחת ואחת עשירית'],
  [2.5, 'שתיים וחמש עשיריות'],
  [1.01, 'אחת ואחת מאית'],
  [1.45, 'אחת וארבעים וחמש מאיות'],
  [0.05, 'אפס וחמש מאיות'],
  [1.001, 'אחת ואחת אלפית'],
  [1.005, 'אחת וחמש אלפיות'],
  [1.0001, 'אחת ואחת עשרת-אלפית'],
  [1.0005, 'אחת וחמש עשרת-אלפיות'],
  [1.00001, 'אחת ואחת מאה-אלפית'],
  [1.00005, 'אחת וחמש מאה-אלפיות'],
  [1.000001, 'אחת ואחת מיליונית'],
  [1.000005, 'אחת וחמש מיליוניות'],
  [123.45, 'מאה עשרים ושלוש וארבעים וחמש מאיות'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleHeIL)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'אחת נקודה מיליון מאתיים שלושים וארבעה אלף חמש מאות שישים ושבע',
    );
    expect(toWords.convert(1.1234567)).toBe('אחת נקודה מיליון מאתיים שלושים וארבעה אלף חמש מאות שישים ושבע');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('אחת נקודה חמש');
    expect(toWords.convert(0.05)).toBe('אפס נקודה אפס חמש');
  });
});

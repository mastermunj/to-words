import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import heIl from '../src/locales/he-IL.js';
import { ToWords as LocaleToWords } from '../src/locales/he-IL.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
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
  [21, 'עשרים ו אחת'],
  [25, 'עשרים ו חמש'],
  [30, 'שלושים'],
  [42, 'ארבעים ו שתיים'],
  [50, 'חמישים'],
  [99, 'תשעים ו תשע'],
  [100, 'מאה'],
  [137, 'אחת מאה ו שלושים ו שבע'],
  [200, 'מאתיים'],
  [300, 'שלוש מאה'],
  [500, 'חמש מאה'],
  [700, 'שבע מאה'],
  [999, 'תשע מאה ו תשעים ו תשע'],
  [1000, 'אלף'],
  [1001, 'אלף ו אחת'],
  [1234, 'אלף ו שתיים מאה ו שלושים ו ארבע'],
  [2000, 'אלפיים'],
  [4680, 'ארבע אלף ו שש מאה ו שמונים'],
  [10000, 'עשר אלף'],
  [63892, 'שישים ו שלוש אלף ו שמונה מאה ו תשעים ו שתיים'],
  [100000, 'מאה אלף'],
  [792581, 'שבע מאה ו תשעים ו שתיים אלף ו חמש מאה ו שמונים ו אחת'],
  [1000000, 'מיליון'],
  [2741034, 'שתיים מיליון ו שבע מאה ו ארבעים ו אחת אלף ו שלושים ו ארבע'],
  [86429753, 'שמונים ו שש מיליון ו ארבע מאה ו עשרים ו תשע אלף ו שבע מאה ו חמישים ו שלוש'],
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
  [0.63, 'אפס נקודה שישים ו שלוש'],
  [0.973, 'אפס נקודה תשע מאה ו שבעים ו שלוש'],
  [0.999, 'אפס נקודה תשע מאה ו תשעים ו תשע'],
  [37.06, 'שלושים ו שבע נקודה אפס שש'],
  [37.68, 'שלושים ו שבע נקודה שישים ו שמונה'],
  [37.683, 'שלושים ו שבע נקודה שש מאה ו שמונים ו שלוש'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} שקלים בלבד`;
  });
  // Fix for singular form
  testIntegersWithCurrency[1][1] = 'אחת שקל בלבד';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} שקלים`;
  });
  // Fix for singular form
  testIntegersWithCurrency[1][1] = 'אחת שקל';

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} שקלים בלבד`;
      return;
    }
    row[0] = -row[0];
    row[1] = `מינוס ${row[1]} שקלים בלבד`;
  });
  // Fix for singular form
  testNegativeIntegersWithCurrency[1][1] = 'מינוס אחת שקל בלבד';

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} שקלים בלבד`;
  });
  // Fix for singular form
  testIntegersWithCurrencyAndIgnoreZeroCurrency[1][1] = 'אחת שקל בלבד';

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
  [0.04, 'אפס שקלים ו ארבע אגורות בלבד'],
  [0.4, 'אפס שקלים ו ארבעים אגורות בלבד'],
  [0.63, 'אפס שקלים ו שישים ו שלוש אגורות בלבד'],
  [0.973, 'אפס שקלים ו תשעים ו שבע אגורות בלבד'],
  [0.999, 'אחת שקל בלבד'],
  [37.06, 'שלושים ו שבע שקלים ו שש אגורות בלבד'],
  [37.68, 'שלושים ו שבע שקלים ו שישים ו שמונה אגורות בלבד'],
  [37.683, 'שלושים ו שבע שקלים ו שישים ו שמונה אגורות בלבד'],
  [100, 'מאה שקלים בלבד'],
  [500.25, 'חמש מאה שקלים ו עשרים ו חמש אגורות בלבד'],
  [1000.5, 'אלף שקלים ו חמישים אגורות בלבד'],
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
      row[1] = (row[1] as string).replace('אפס שקלים ו ', '');
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
    [37.06, 'שלושים ו שבע שקלים בלבד'],
    [37.68, 'שלושים ו שבע שקלים בלבד'],
    [37.683, 'שלושים ו שבע שקלים בלבד'],
    [100, 'מאה שקלים בלבד'],
    [500.25, 'חמש מאה שקלים בלבד'],
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
  [11, 'האחת עשרה'],
  [12, 'השתים עשרה'],
  [19, 'התשע עשרה'],
  [20, 'העשרים'],
  [21, 'עשרים ו הראשון'],
  [25, 'עשרים ו החמישי'],
  [30, 'השלושים'],
  [99, 'תשעים ו התשיעי'],
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
  [10000, 'עשר אלף'],
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

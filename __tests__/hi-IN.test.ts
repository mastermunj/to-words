import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import hiIn from '../src/locales/hi-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/hi-IN.js';

const localeCode = 'hi-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(hiIn);
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
  [0, 'शून्य'],
  [137, 'एक सौ सैंतीस'],
  [700, 'सात सौ'],
  [4680, 'चार हज़ार छह सौ अस्सी'],
  [63892, 'तिरसठ हज़ार आठ सौ बानवे'],
  [792581, 'सात लाख बानवे हज़ार पांच सौ इक्यासी'],
  [2741034, 'सत्ताईस लाख इकतालीस हज़ार चौंतीस'],
  [86429753, 'आठ करोड़ चौंसठ लाख उनतीस हज़ार सात सौ तिरेपन'],
  [975310864, 'सत्तानवे करोड़ तिरेपन लाख दस हज़ार आठ सौ चौंसठ'],
  [9876543210, 'नौ सौ सतासी करोड़ पैंसठ लाख तैंतालीस हज़ार दो सौ दस'],
  [98765432101, 'नौ हज़ार आठ सौ छिहत्तर करोड़ चौवन लाख बत्तीस हज़ार एक सौ एक'],
  [987654321012, 'अट्ठानवे हज़ार सात सौ पैंसठ करोड़ तैंतालीस लाख इक्कीस हज़ार बारह'],
  [9876543210123, 'नौ लाख सतासी हज़ार छह सौ चौवन करोड़ बत्तीस लाख दस हज़ार एक सौ तेईस'],
  [98765432101234, 'अट्ठानवे लाख छिहत्तर हज़ार पांच सौ तैंतालीस करोड़ इक्कीस लाख एक हज़ार दो सौ चौंतीस'],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
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
    row[1] = `ऋण ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपये`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपये`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} रुपये`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'शून्य'],
  [0.04, 'शून्य दशांश शून्य चार'],
  [0.0468, 'शून्य दशांश शून्य चार छह आठ'],
  [0.4, 'शून्य दशांश चार'],
  [0.63, 'शून्य दशांश तिरसठ'],
  [0.973, 'शून्य दशांश नौ सौ तिहत्तर'],
  [0.999, 'शून्य दशांश नौ सौ निन्यानवे'],
  [37.06, 'सैंतीस दशांश शून्य छह'],
  [37.068, 'सैंतीस दशांश शून्य छह आठ'],
  [37.68, 'सैंतीस दशांश अड़सठ'],
  [37.683, 'सैंतीस दशांश छह सौ तिरासी'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'शून्य रुपये'],
  [0.04, 'शून्य रुपये और चार पैसे'],
  [0.0468, 'शून्य रुपये और पांच पैसे'],
  [0.4, 'शून्य रुपये और चालीस पैसे'],
  [0.63, 'शून्य रुपये और तिरसठ पैसे'],
  [0.973, 'शून्य रुपये और सत्तानवे पैसे'],
  [0.999, 'एक रुपया'],
  [37.06, 'सैंतीस रुपये और छह पैसे'],
  [37.068, 'सैंतीस रुपये और सात पैसे'],
  [37.68, 'सैंतीस रुपये और अड़सठ पैसे'],
  [37.683, 'सैंतीस रुपये और अड़सठ पैसे'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace(`शून्य रुपये और `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = `शून्य रुपये`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` और [\u0900-\u097F ]+ पैसे`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
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
    row[1] = (row[1] as string).replace(new RegExp(` और [\u0900-\u097F ]+ पैसे`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testOrdinals: [number, string][] = [
  [0, 'शून्यवां'],
  [1, 'पहला'],
  [2, 'दूसरा'],
  [3, 'तीसरा'],
  [4, 'चौथा'],
  [5, 'पांचवां'],
  [6, 'छठा'],
  [7, 'सातवां'],
  [8, 'आठवां'],
  [9, 'नौवां'],
  [10, 'दसवां'],
  [11, 'ग्यारहवां'],
  [12, 'बारहवां'],
  [13, 'तेरहवां'],
  [14, 'चौदहवां'],
  [15, 'पंद्रहवां'],
  [16, 'सोलहवां'],
  [17, 'सत्रहवां'],
  [18, 'अठारहवां'],
  [19, 'उन्नीसवां'],
  [20, 'बीसवां'],
  [21, 'इक्कीसवां'],
  [22, 'बाईसवां'],
  [23, 'तेईसवां'],
  [24, 'चौबीसवां'],
  [25, 'पच्चीसवां'],
  [30, 'तीसवां'],
  [40, 'चालीसवां'],
  [50, 'पचासवां'],
  [60, 'साठवां'],
  [70, 'सत्तरवां'],
  [80, 'अस्सीवां'],
  [90, 'नब्बेवां'],
  [99, 'निन्यानवेवां'],
  [100, 'सौवां'],
  [101, 'एक सौ पहला'],
  [111, 'एक सौ ग्यारहवां'],
  [123, 'एक सौ तेईसवां'],
  [199, 'एक सौ निन्यानवेवां'],
  [200, 'दो सौवां'],
  [500, 'पांच सौवां'],
  [1000, 'एक हज़ारवां'],
  [1001, 'एक हज़ार पहला'],
  [1100, 'एक हज़ार सौवां'],
  [1234, 'एक हज़ार दो सौ चौंतीसवां'],
  [10000, 'दस हज़ारवां'],
  [100000, 'एक लाखवां'],
  [100001, 'एक लाख पहला'],
  [1000000, 'दस लाखवां'],
  [10000000, 'एक करोड़वां'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow(/must be non-negative/);
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow(/must be non-negative integers/);
  });
});

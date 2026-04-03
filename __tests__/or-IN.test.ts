import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import orIn from '../src/locales/or-IN.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/or-IN.js';

const localeCode = 'or-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(orIn);
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
  [0, 'ଶୂନ'],
  [137, 'ଏକ ଶହ ସଇଁତିରିଶି'],
  [700, 'ସାତ ଶହ'],
  [4680, 'ଚାରି ହଜାର ଛଅ ଶହ ଅଶୀ'],
  [63892, 'ତେଷଠି ହଜାର ଆଠ ଶହ ବୟାନବେ'],
  [792581, 'ସାତ ଲକ୍ଷ ବୟାନବେ ହଜାର ପାଞ୍ଚ ଶହ ଏକାଅଶୀ'],
  [2741034, 'ସତେଇଶି ଲକ୍ଷ ଏକଚାଳିଶି ହଜାର ଚଉତିରିଶି'],
  [86429753, 'ଆଠ କୋଟି ଚଉଷଠି ଲକ୍ଷ ଅଣତିରିଶି ହଜାର ସାତ ଶହ ତେପନ'],
  [975310864, 'ସତାନବେ କୋଟି ତେପନ ଲକ୍ଷ ଦଶ ହଜାର ଆଠ ଶହ ଚଉଷଠି'],
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
    row[1] = `ଋଣ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ଟଙ୍କା`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ଟଙ୍କା`;
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
    row[1] = `${row[1]} ଟଙ୍କା`;
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

const testFloats: [number, string][] = [
  [0.0, 'ଶୂନ'],
  [0.04, 'ଶୂନ ଦଶମିକ ଶୂନ ଚାରି'],
  [0.0468, 'ଶୂନ ଦଶମିକ ଶୂନ ଚାରି ଛଅ ଆଠ'],
  [0.4, 'ଶୂନ ଦଶମିକ ଚାରି'],
  [0.63, 'ଶୂନ ଦଶମିକ ତେଷଠି'],
  [0.973, 'ଶୂନ ଦଶମିକ ନଅ ଶହ ତେସ୍ତରି'],
  [0.999, 'ଶୂନ ଦଶମିକ ନଅ ଶହ ଅନେଶତ'],
  [37.06, 'ସଇଁତିରିଶି ଦଶମିକ ଶୂନ ଛଅ'],
  [37.068, 'ସଇଁତିରିଶି ଦଶମିକ ଶୂନ ଛଅ ଆଠ'],
  [37.68, 'ସଇଁତିରିଶି ଦଶମିକ ଅଠଷଠି'],
  [37.683, 'ସଇଁତିରିଶି ଦଶମିକ ଛଅ ଶହ ତେୟାଅଶୀ'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `ଏକ ଶହ ତେଇଶି ଟଙ୍କା`],
    ['123', `ଏକ ଶହ ତେଇଶି ଟଙ୍କା`],
    ['123.0', `ଏକ ଶହ ତେଇଶି ଟଙ୍କା ଏବଂ ଶୂନ ପଇସା`],
    ['123.00', `ଏକ ଶହ ତେଇଶି ଟଙ୍କା ଏବଂ ଶୂନ ପଇସା`],
    ['0.00', `ଶୂନ ଟଙ୍କା ଏବଂ ଶୂନ ପଇସା`],
    ['-123.00', `ଋଣ ଏକ ଶହ ତେଇଶି ଟଙ୍କା ଏବଂ ଶୂନ ପଇସା`],
    ['37.68', `ସଇଁତିରିଶି ଟଙ୍କା ଏବଂ ଅଠଷଠି ପଇସା`],
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
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'ଶୂନ ଟଙ୍କା'],
  [0.04, 'ଶୂନ ଟଙ୍କା ଏବଂ ଚାରି ପଇସା'],
  [0.0468, 'ଶୂନ ଟଙ୍କା ଏବଂ ପାଞ୍ଚ ପଇସା'],
  [0.4, 'ଶୂନ ଟଙ୍କା ଏବଂ ଚାଳିଶ ପଇସା'],
  [0.63, 'ଶୂନ ଟଙ୍କା ଏବଂ ତେଷଠି ପଇସା'],
  [0.973, 'ଶୂନ ଟଙ୍କା ଏବଂ ସତାନବେ ପଇସା'],
  [0.999, 'ଏକ ଟଙ୍କା'],
  [37.06, 'ସଇଁତିରିଶି ଟଙ୍କା ଏବଂ ଛଅ ପଇସା'],
  [37.068, 'ସଇଁତିରିଶି ଟଙ୍କା ଏବଂ ସାତ ପଇସା'],
  [37.68, 'ସଇଁତିରିଶି ଟଙ୍କା ଏବଂ ଅଠଷଠି ପଇସା'],
  [37.683, 'ସଇଁତିରିଶି ଟଙ୍କା ଏବଂ ଅଠଷଠି ପଇସା'],
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
      row[1] = (row[1] as string).replace(`ଶୂନ ଟଙ୍କା ଏବଂ `, '');
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
      row[1] = `ଶୂନ ଟଙ୍କା`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` ଏବଂ [\u0B00-\u0B7F ]+ ପଇସା`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` ଏବଂ [\u0B00-\u0B7F ]+ ପଇସା`), '');
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
  [0, 'ଶୂନତମ'],
  [1, 'ପ୍ରଥମ'],
  [2, 'ଦ୍ୱିତୀୟ'],
  [3, 'ତୃତୀୟ'],
  [4, 'ଚତୁର୍ଥ'],
  [5, 'ପଞ୍ଚମ'],
  [6, 'ଷଷ୍ଠ'],
  [7, 'ସପ୍ତମ'],
  [8, 'ଅଷ୍ଟମ'],
  [9, 'ନବମ'],
  [10, 'ଦଶମ'],
  [11, 'ଏଗାରତମ'],
  [12, 'ବାରତମ'],
  [20, 'କୋଡ଼ିଏତମ'],
  [21, 'ଏକୋଇଶିତମ'],
  [25, 'ପଚିଶିତମ'],
  [30, 'ତିରିଶତମ'],
  [40, 'ଚାଳିଶତମ'],
  [50, 'ପଚାଶତମ'],
  [60, 'ଷାଠିଏତମ'],
  [70, 'ସତୁରିତମ'],
  [80, 'ଅଶୀତମ'],
  [90, 'ନବେତମ'],
  [99, 'ଅନେଶତତମ'],
  [100, 'ଶତତମ'],
  [101, 'ଏକ ଶହ ପ୍ରଥମ'],
  [111, 'ଏକ ଶହ ଏଗାରତମ'],
  [123, 'ଏକ ଶହ ତେଇଶିତମ'],
  [200, 'ଦୁଇ ଶତତମ'],
  [500, 'ପାଞ୍ଚ ଶତତମ'],
  [1000, 'ଏକ ସହସ୍ରତମ'],
  [1001, 'ଏକ ହଜାର ପ୍ରଥମ'],
  [1234, 'ଏକ ହଜାର ଦୁଇ ଶହ ଚଉତିରିଶିତମ'],
  [10000, 'ଦଶ ସହସ୍ରତମ'],
  [100000, 'ଏକ ଲକ୍ଷତମ'],
  [100001, 'ଏକ ଲକ୍ଷ ପ୍ରଥମ'],
  [1000000, 'ଦଶ ଲକ୍ଷତମ'],
  [10000000, 'ଏକ କୋଟିତମ'],
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

const testPowersOfTen: [number, string][] = [
  [10, 'ଦଶ'],
  [100, 'ଶହ'],
  [1000, 'ଏକ ହଜାର'],
  [10000, 'ଦଶ ହଜାର'],
  [100000, 'ଏକ ଲକ୍ଷ'],
  [1000000, 'ଦଶ ଲକ୍ଷ'],
  [10000000, 'ଏକ କୋଟି'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'ଶୂନ'],
  [1n, 'ଏକ'],
  [100n, 'ଶହ'],
  [1000n, 'ଏକ ହଜାର'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'ଋଣ ଏକ'],
  [-100n, 'ଋଣ ଶହ'],
  [-1000n, 'ଋଣ ଏକ ହଜାର'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'ଶୂନ'],
  ['1', 'ଏକ'],
  ['100', 'ଶହ'],
  ['-100', 'ଋଣ ଶହ'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test.concurrent.each([
    [0, 'ଶୂନ'],
    [-0, 'ଶୂନ'],
    [0.0, 'ଶୂନ'],
  ] as [number, string][])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('convert 0n => ଶୂନ', () => {
    expect(toWords.convert(0n)).toBe('ଶୂନ');
  });

  test('convert "0" => ଶୂନ', () => {
    expect(toWords.convert('0')).toBe('ଶୂନ');
  });

  test('convert 0 with currency => ଶୂନ ଟଙ୍କା', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ଶୂନ ଟଙ୍କା');
  });
});

describe('Test Invalid Input', () => {
  test.concurrent.each([
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
  ] as [number, string][])('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input)).toThrow(expectedMessage);
  });

  test.concurrent.each([
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ] as [string, string][])('convert "%s" throws error', (input, expectedMessage) => {
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

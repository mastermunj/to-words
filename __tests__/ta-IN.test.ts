import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import taIn from '../src/locales/ta-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/ta-IN.js';

const localeCode = 'ta-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(taIn);
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
  [0, 'பூஜ்ஜியம்'],
  [137, 'ஒன்று நூறு முப்பத்தி ஏழு'],
  [700, 'ஏழு நூறு'],
  [4680, 'நான்கு ஆயிரம் ஆறு நூறு எண்பது'],
  [63892, 'அறுபத்தி மூன்று ஆயிரம் எட்டு நூறு தொண்ணூற்றி இரண்டு'],
  [792581, 'ஏழு லட்சம் தொண்ணூற்றி இரண்டு ஆயிரம் ஐந்து நூறு எண்பத்தி ஒன்று'],
  [2741034, 'இருபத்தி ஏழு லட்சம் நாற்பத்தி ஒன்று ஆயிரம் முப்பத்தி நான்கு'],
  [86429753, 'எட்டு கோடி அறுபத்தி நான்கு லட்சம் இருபத்தி ஒன்பது ஆயிரம் ஏழு நூறு ஐம்பத்தி மூன்று'],
  [975310864, 'தொண்ணூற்றி ஏழு கோடி ஐம்பத்தி மூன்று லட்சம் பத்து ஆயிரம் எட்டு நூறு அறுபத்தி நான்கு'],
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
    row[1] = `கழித்தல் ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ரூபாய்`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ரூபாய்`;
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
    row[1] = `${row[1]} ரூபாய்`;
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
  [0.0, 'பூஜ்ஜியம்'],
  [0.04, 'பூஜ்ஜியம் புள்ளி பூஜ்ஜியம் நான்கு'],
  [0.0468, 'பூஜ்ஜியம் புள்ளி பூஜ்ஜியம் நான்கு ஆறு எட்டு'],
  [0.4, 'பூஜ்ஜியம் புள்ளி நான்கு'],
  [0.63, 'பூஜ்ஜியம் புள்ளி அறுபத்தி மூன்று'],
  [0.973, 'பூஜ்ஜியம் புள்ளி ஒன்பது நூறு எழுபத்தி மூன்று'],
  [0.999, 'பூஜ்ஜியம் புள்ளி ஒன்பது நூறு தொண்ணூற்றி ஒன்பது'],
  [37.06, 'முப்பத்தி ஏழு புள்ளி பூஜ்ஜியம் ஆறு'],
  [37.068, 'முப்பத்தி ஏழு புள்ளி பூஜ்ஜியம் ஆறு எட்டு'],
  [37.68, 'முப்பத்தி ஏழு புள்ளி அறுபத்தி எட்டு'],
  [37.683, 'முப்பத்தி ஏழு புள்ளி ஆறு நூறு எண்பத்தி மூன்று'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'பூஜ்ஜியம் ரூபாய்'],
  [0.04, 'பூஜ்ஜியம் ரூபாய் மற்றும் நான்கு பைசா'],
  [0.0468, 'பூஜ்ஜியம் ரூபாய் மற்றும் ஐந்து பைசா'],
  [0.4, 'பூஜ்ஜியம் ரூபாய் மற்றும் நாற்பது பைசா'],
  [0.63, 'பூஜ்ஜியம் ரூபாய் மற்றும் அறுபத்தி மூன்று பைசா'],
  [0.973, 'பூஜ்ஜியம் ரூபாய் மற்றும் தொண்ணூற்றி ஏழு பைசா'],
  [0.999, 'ஒன்று ரூபாய்'],
  [37.06, 'முப்பத்தி ஏழு ரூபாய் மற்றும் ஆறு பைசா'],
  [37.068, 'முப்பத்தி ஏழு ரூபாய் மற்றும் ஏழு பைசா'],
  [37.68, 'முப்பத்தி ஏழு ரூபாய் மற்றும் அறுபத்தி எட்டு பைசா'],
  [37.683, 'முப்பத்தி ஏழு ரூபாய் மற்றும் அறுபத்தி எட்டு பைசா'],
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
      row[1] = (row[1] as string).replace(`பூஜ்ஜியம் ரூபாய் மற்றும் `, '');
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
      row[1] = `பூஜ்ஜியம் ரூபாய்`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` மற்றும் [\u0B80-\u0BFF ]+ பைசா`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` மற்றும் [\u0B80-\u0BFF ]+ பைசா`), '');
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
  [0, 'பூஜ்ஜியமாவது'],
  [1, 'முதல்'],
  [2, 'இரண்டாவது'],
  [3, 'மூன்றாவது'],
  [4, 'நான்காவது'],
  [5, 'ஐந்தாவது'],
  [6, 'ஆறாவது'],
  [7, 'ஏழாவது'],
  [8, 'எட்டாவது'],
  [9, 'ஒன்பதாவது'],
  [10, 'பத்தாவது'],
  [11, 'பதினொன்றாவது'],
  [12, 'பன்னிரண்டாவது'],
  [13, 'பதின்மூன்றாவது'],
  [14, 'பதினான்காவது'],
  [15, 'பதினைந்தாவது'],
  [16, 'பதினாறாவது'],
  [17, 'பதினேழாவது'],
  [18, 'பதினெட்டாவது'],
  [19, 'பத்தொன்பதாவது'],
  [20, 'இருபதாவது'],
  [21, 'இருபத்தி ஒன்றாவது'],
  [22, 'இருபத்தி இரண்டாவது'],
  [23, 'இருபத்தி மூன்றாவது'],
  [24, 'இருபத்தி நான்காவது'],
  [25, 'இருபத்தி ஐந்தாவது'],
  [30, 'முப்பதாவது'],
  [40, 'நாற்பதாவது'],
  [50, 'ஐம்பதாவது'],
  [60, 'அறுபதாவது'],
  [70, 'எழுபதாவது'],
  [80, 'எண்பதாவது'],
  [90, 'தொண்ணூறாவது'],
  [99, 'தொண்ணூற்றி ஒன்பதாவது'],
  [100, 'நூறாவது'],
  [101, 'ஒன்று நூறு முதல்'],
  [111, 'ஒன்று நூறு பதினொன்றாவது'],
  [123, 'ஒன்று நூறு இருபத்தி மூன்றாவது'],
  [199, 'ஒன்று நூறு தொண்ணூற்றி ஒன்பதாவது'],
  [200, 'இரண்டு நூறாவது'],
  [500, 'ஐந்து நூறாவது'],
  [1000, 'ஒன்று ஆயிரத்தாவது'],
  [1001, 'ஒன்று ஆயிரம் முதல்'],
  [1100, 'ஒன்று ஆயிரம் நூறாவது'],
  [1234, 'ஒன்று ஆயிரம் இரண்டு நூறு முப்பத்தி நான்காவது'],
  [10000, 'பத்து ஆயிரத்தாவது'],
  [100000, 'ஒன்று லட்சத்தாவது'],
  [100001, 'ஒன்று லட்சம் முதல்'],
  [1000000, 'பத்து லட்சத்தாவது'],
  [10000000, 'ஒன்று கோடியாவது'],
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
  [10, 'பத்து'],
  [100, 'நூறு'],
  [1000, 'ஒன்று ஆயிரம்'],
  [10000, 'பத்து ஆயிரம்'],
  [100000, 'ஒன்று லட்சம்'],
  [1000000, 'பத்து லட்சம்'],
  [10000000, 'ஒன்று கோடி'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'பூஜ்ஜியம்'],
  [1n, 'ஒன்று'],
  [100n, 'நூறு'],
  [1000n, 'ஒன்று ஆயிரம்'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'கழித்தல் ஒன்று'],
  [-100n, 'கழித்தல் நூறு'],
  [-1000n, 'கழித்தல் ஒன்று ஆயிரம்'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'பூஜ்ஜியம்'],
  ['1', 'ஒன்று'],
  ['100', 'நூறு'],
  ['-100', 'கழித்தல் நூறு'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test.concurrent.each([
    [0, 'பூஜ்ஜியம்'],
    [-0, 'பூஜ்ஜியம்'],
    [0.0, 'பூஜ்ஜியம்'],
  ] as [number, string][])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('convert 0n => பூஜ்ஜியம்', () => {
    expect(toWords.convert(0n)).toBe('பூஜ்ஜியம்');
  });

  test('convert "0" => பூஜ்ஜியம்', () => {
    expect(toWords.convert('0')).toBe('பூஜ்ஜியம்');
  });

  test('convert 0 with currency => பூஜ்ஜியம் ரூபாய்', () => {
    expect(toWords.convert(0, { currency: true })).toBe('பூஜ்ஜியம் ரூபாய்');
  });
});

describe('Test Invalid Input', () => {
  test.concurrent.each([
    [NaN, 'Invalid Number "NaN"'],
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

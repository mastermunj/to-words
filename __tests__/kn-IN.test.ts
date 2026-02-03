import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import knIn from '../src/locales/kn-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/kn-IN.js';

const localeCode = 'kn-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(knIn);
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
  [0, 'ಶೂನ್ಯ'],
  [137, 'ಒಂದು ನೂರು ಮೂವತ್ತೇಳು'],
  [700, 'ಏಳು ನೂರು'],
  [4680, 'ನಾಲ್ಕು ಸಾವಿರ ಆರು ನೂರು ಎಂಭತ್ತು'],
  [63892, 'ಅರುವತ್ತಮೂರು ಸಾವಿರ ಎಂಟು ನೂರು ತೊಂಬತ್ತೆರಡು'],
  [792581, 'ಏಳು ಲಕ್ಷ ತೊಂಬತ್ತೆರಡು ಸಾವಿರ ಐದು ನೂರು ಎಂಭತ್ತೊಂದು'],
  [2741034, 'ಇಪ್ಪತ್ತೇಳು ಲಕ್ಷ ನಲವತ್ತೊಂದು ಸಾವಿರ ಮೂವತ್ತನಾಲ್ಕು'],
  [86429753, 'ಎಂಟು ಕೋಟಿ ಅರುವತ್ತನಾಲ್ಕು ಲಕ್ಷ ಇಪ್ಪತ್ತೊಂಬತ್ತು ಸಾವಿರ ಏಳು ನೂರು ಐವತ್ತಮೂರು'],
  [975310864, 'ತೊಂಬತ್ತೇಳು ಕೋಟಿ ಐವತ್ತಮೂರು ಲಕ್ಷ ಹತ್ತು ಸಾವಿರ ಎಂಟು ನೂರು ಅರುವತ್ತನಾಲ್ಕು'],
  [9876543210, 'ಒಂಬತ್ತು ಅರಬ್ ಎಂಭತ್ತೇಳು ಕೋಟಿ ಅರುವತ್ತೈದು ಲಕ್ಷ ನಲವತ್ತಮೂರು ಸಾವಿರ ಎರಡು ನೂರು ಹತ್ತು'],
  [98765432101, 'ತೊಂಬತ್ತೆಂಟು ಅರಬ್ ಎಪ್ಪತ್ತಾರು ಕೋಟಿ ಐವತ್ತನಾಲ್ಕು ಲಕ್ಷ ಮೂವತ್ತೆರಡು ಸಾವಿರ ಒಂದು ನೂರು ಒಂದು'],
  [987654321012, 'ಒಂಬತ್ತು ಖರಬ್ ಎಂಭತ್ತೇಳು ಅರಬ್ ಅರುವತ್ತೈದು ಕೋಟಿ ನಲವತ್ತಮೂರು ಲಕ್ಷ ಇಪ್ಪತ್ತೊಂದು ಸಾವಿರ ಹನ್ನೆರಡು'],
  [
    9876543210123,
    'ತೊಂಬತ್ತೆಂಟು ಖರಬ್ ಎಪ್ಪತ್ತಾರು ಅರಬ್ ಐವತ್ತನಾಲ್ಕು ಕೋಟಿ ಮೂವತ್ತೆರಡು ಲಕ್ಷ ಹತ್ತು ಸಾವಿರ ಒಂದು ನೂರು ಇಪ್ಪತ್ತಮೂರು',
  ],
  [
    98765432101234,
    'ಒಂಬತ್ತು ನೀಲ್ ಎಂಭತ್ತೇಳು ಖರಬ್ ಅರುವತ್ತೈದು ಅರಬ್ ನಲವತ್ತಮೂರು ಕೋಟಿ ಇಪ್ಪತ್ತೊಂದು ಲಕ್ಷ ಒಂದು ಸಾವಿರ ಎರಡು ನೂರು ಮೂವತ್ತನಾಲ್ಕು',
  ],
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
    row[1] = `ಋಣ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ರೂಪಾಯಿಗಳು`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ರೂಪಾಯಿಗಳು`;
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
    row[1] = `${row[1]} ರೂಪಾಯಿಗಳು`;
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
  [0.0, 'ಶೂನ್ಯ'],
  [0.04, 'ಶೂನ್ಯ ದಶಾಂಶ ಶೂನ್ಯ ನಾಲ್ಕು'],
  [0.0468, 'ಶೂನ್ಯ ದಶಾಂಶ ಶೂನ್ಯ ನಾಲ್ಕು ಆರು ಎಂಟು'],
  [0.4, 'ಶೂನ್ಯ ದಶಾಂಶ ನಾಲ್ಕು'],
  [0.63, 'ಶೂನ್ಯ ದಶಾಂಶ ಅರುವತ್ತಮೂರು'],
  [0.973, 'ಶೂನ್ಯ ದಶಾಂಶ ಒಂಬತ್ತು ನೂರು ಎಪ್ಪತ್ತಮೂರು'],
  [0.999, 'ಶೂನ್ಯ ದಶಾಂಶ ಒಂಬತ್ತು ನೂರು ತೊಂಬತ್ತೊಂಬತ್ತು'],
  [37.06, 'ಮೂವತ್ತೇಳು ದಶಾಂಶ ಶೂನ್ಯ ಆರು'],
  [37.068, 'ಮೂವತ್ತೇಳು ದಶಾಂಶ ಶೂನ್ಯ ಆರು ಎಂಟು'],
  [37.68, 'ಮೂವತ್ತೇಳು ದಶಾಂಶ ಅರುವತ್ತೆಂಟು'],
  [37.683, 'ಮೂವತ್ತೇಳು ದಶಾಂಶ ಆರು ನೂರು ಎಂಭತ್ತಮೂರು'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು'],
  [0.04, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು ನಾಲ್ಕು ಪೈಸೆಗಳು'],
  [0.0468, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು ಐದು ಪೈಸೆಗಳು'],
  [0.4, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು ನಲವತ್ತು ಪೈಸೆಗಳು'],
  [0.63, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು ಅರುವತ್ತಮೂರು ಪೈಸೆಗಳು'],
  [0.973, 'ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು ತೊಂಬತ್ತೇಳು ಪೈಸೆಗಳು'],
  [0.999, 'ಒಂದು ರೂಪಾಯಿ'],
  [37.06, 'ಮೂವತ್ತೇಳು ರೂಪಾಯಿಗಳು ಮತ್ತು ಆರು ಪೈಸೆಗಳು'],
  [37.068, 'ಮೂವತ್ತೇಳು ರೂಪಾಯಿಗಳು ಮತ್ತು ಏಳು ಪೈಸೆಗಳು'],
  [37.68, 'ಮೂವತ್ತೇಳು ರೂಪಾಯಿಗಳು ಮತ್ತು ಅರುವತ್ತೆಂಟು ಪೈಸೆಗಳು'],
  [37.683, 'ಮೂವತ್ತೇಳು ರೂಪಾಯಿಗಳು ಮತ್ತು ಅರುವತ್ತೆಂಟು ಪೈಸೆಗಳು'],
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
      row[1] = (row[1] as string).replace(`ಶೂನ್ಯ ರೂಪಾಯಿಗಳು ಮತ್ತು `, '');
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
      row[1] = `ಶೂನ್ಯ ರೂಪಾಯಿಗಳು`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` ಮತ್ತು [\u0C80-\u0CFF ]+ ಪೈಸೆಗಳು`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` ಮತ್ತು [\u0C80-\u0CFF ]+ ಪೈಸೆಗಳು`), '');
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
  [1, 'ಮೊದಲನೇ'],
  [2, 'ಎರಡನೇ'],
  [3, 'ಮೂರನೇ'],
  [10, 'ಹತ್ತನೇ'],
  [11, 'ಹನ್ನೊಂದನೇ'],
  [19, 'ಹತ್ತೊಂಬತ್ತನೇ'],
  [20, 'ಇಪ್ಪತ್ತನೇ'],
  [21, 'ಇಪ್ಪತ್ತೊಂದನೇ'],
  [25, 'ಇಪ್ಪತ್ತೈದನೇ'],
  [50, 'ಐವತ್ತನೇ'],
  [55, 'ಐವತ್ತೈದನೇ'],
  [99, 'ತೊಂಬತ್ತೊಂಬತ್ತನೇ'],
  [100, 'ನೂರನೇ'],
  [123, 'ಒಂದು ನೂರು ಇಪ್ಪತ್ತಮೂರನೇ'],
  [1000, 'ಒಂದು ಸಾವಿರನೇ'],
  [1001, 'ಒಂದು ಸಾವಿರ ಮೊದಲನೇ'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

const powersOfTen: [number, string][] = [
  [10, 'ಹತ್ತು'],
  [100, 'ನೂರು'],
  [1000, 'ಒಂದು ಸಾವಿರ'],
  [10000, 'ಹತ್ತು ಸಾವಿರ'],
  [100000, 'ಒಂದು ಲಕ್ಷ'],
  [1000000, 'ಹತ್ತು ಲಕ್ಷ'],
  [10000000, 'ಒಂದು ಕೋಟಿ'],
];

describe('Powers of Ten', () => {
  test.concurrent.each(powersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const bigIntTests: [bigint, string][] = [
  [0n, 'ಶೂನ್ಯ'],
  [1n, 'ಒಂದು'],
  [100n, 'ನೂರು'],
  [1000n, 'ಒಂದು ಸಾವಿರ'],
];

describe('BigInt Tests', () => {
  test.concurrent.each(bigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const negativeBigIntTests: [bigint, string][] = [
  [-1n, 'ಋಣ ಒಂದು'],
  [-100n, 'ಋಣ ನೂರು'],
  [-1000n, 'ಋಣ ಒಂದು ಸಾವಿರ'],
];

describe('Negative BigInt Tests', () => {
  test.concurrent.each(negativeBigIntTests)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const stringInputTests: [string, string][] = [
  ['0', 'ಶೂನ್ಯ'],
  ['1', 'ಒಂದು'],
  ['100', 'ನೂರು'],
  ['-100', 'ಋಣ ನೂರು'],
];

describe('String Input Tests', () => {
  test.concurrent.each(stringInputTests)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Zero Variants', () => {
  test.concurrent.each([
    [0, 'ಶೂನ್ಯ'],
    [-0, 'ಶೂನ್ಯ'],
    [0.0, 'ಶೂನ್ಯ'],
    [0n, 'ಶೂನ್ಯ'],
    ['0', 'ಶೂನ್ಯ'],
  ] as [number | bigint | string, string][])('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('zero with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ಶೂನ್ಯ ರೂಪಾಯಿಗಳು');
  });
});

describe('Invalid Input Tests', () => {
  test.concurrent.each([
    [NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ] as [number | string, string][])('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedMessage);
  });
});

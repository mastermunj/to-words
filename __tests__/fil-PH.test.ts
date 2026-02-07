import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import filPh from '../src/locales/fil-PH.js';
import { ToWords as LocaleToWords } from '../src/locales/fil-PH.js';

const localeCode = 'fil-PH';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(filPh);
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
  [0, 'Sero'],
  [1, 'Isa'],
  [2, 'Dalawa'],
  [3, 'Tatlo'],
  [4, 'Apat'],
  [5, 'Lima'],
  [6, 'Anim'],
  [7, 'Pito'],
  [8, 'Walo'],
  [9, 'Siyam'],
  [10, 'Sampu'],
  [11, 'Labing-isa'],
  [12, 'Labindalawa'],
  [13, 'Labintatlo'],
  [14, 'Labing-apat'],
  [15, 'Labinlima'],
  [16, 'Labing-anim'],
  [17, 'Labimpito'],
  [18, 'Labingwalo'],
  [19, 'Labinsiyam'],
  [20, 'Dalawampu'],
  [21, 'Dalawampu Isa'],
  [25, 'Dalawampu Lima'],
  [30, 'Tatlumpu'],
  [35, 'Tatlumpu Lima'],
  [50, 'Limampu'],
  [99, 'Siyamnapu Siyam'],
  [100, 'Isang Daan'],
  [101, 'Isa Daan Isa'],
  [111, 'Isa Daan Labing-isa'],
  [137, 'Isa Daan Tatlumpu Pito'],
  [200, 'Dalawa Daan'],
  [500, 'Lima Daan'],
  [700, 'Pito Daan'],
  [999, 'Siyam Daan Siyamnapu Siyam'],
  [1000, 'Isang Libo'],
  [1001, 'Isa Libo Isa'],
  [1100, 'Isa Libo Isang Daan'],
  [1111, 'Isa Libo Isa Daan Labing-isa'],
  [2000, 'Dalawa Libo'],
  [4680, 'Apat Libo Anim Daan Walumpu'],
  [10000, 'Sampu Libo'],
  [11000, 'Labing-isa Libo'],
  [21000, 'Dalawampu Isa Libo'],
  [63892, 'Animnapu Tatlo Libo Walo Daan Siyamnapu Dalawa'],
  [86100, 'Walumpu Anim Libo Isang Daan'],
  [100000, 'Isang Daan Libo'],
  [123456, 'Isa Daan Dalawampu Tatlo Libo Apat Daan Limampu Anim'],
  [792581, 'Pito Daan Siyamnapu Dalawa Libo Lima Daan Walumpu Isa'],
  [1000000, 'Isang Milyon'],
  [2000000, 'Dalawa Milyon'],
  [2741034, 'Dalawa Milyon Pito Daan Apatnapu Isa Libo Tatlumpu Apat'],
  [10000000, 'Sampu Milyon'],
  [86429753, 'Walumpu Anim Milyon Apat Daan Dalawampu Siyam Libo Pito Daan Limampu Tatlo'],
  [100000000, 'Isang Daan Milyon'],
  [975310864, 'Siyam Daan Pitumpu Lima Milyon Tatlo Daan Sampu Libo Walo Daan Animnapu Apat'],
  [1000000000, 'Isang Bilyon'],
  [9876543210, 'Siyam Bilyon Walo Daan Pitumpu Anim Milyon Lima Daan Apatnapu Tatlo Libo Dalawa Daan Sampu'],
  [1000000000000, 'Isang Trilyon'],
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

const testIntegersWithCurrency: [number, string][] = [
  [0, 'Sero Piso'],
  [1, 'Isa Piso'],
  [2, 'Dalawa Piso'],
  [3, 'Tatlo Piso'],
  [4, 'Apat Piso'],
  [5, 'Lima Piso'],
  [6, 'Anim Piso'],
  [7, 'Pito Piso'],
  [8, 'Walo Piso'],
  [9, 'Siyam Piso'],
  [10, 'Sampu Piso'],
  [21, 'Dalawampu Isa Piso'],
  [100, 'Isang Daan Piso'],
  [101, 'Isa Daan Isa Piso'],
  [111, 'Isa Daan Labing-isa Piso'],
  [137, 'Isa Daan Tatlumpu Pito Piso'],
  [1000, 'Isang Libo Piso'],
  [1001, 'Isa Libo Isa Piso'],
  [1100, 'Isa Libo Isang Daan Piso'],
  [1111, 'Isa Libo Isa Daan Labing-isa Piso'],
  [10000, 'Sampu Libo Piso'],
  [100000, 'Isang Daan Libo Piso'],
  [123456, 'Isa Daan Dalawampu Tatlo Libo Apat Daan Limampu Anim Piso'],
  [1000000, 'Isang Milyon Piso'],
];

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrencyData = cloneDeep(testIntegersWithCurrency);
  testIntegersWithCurrencyData.map((row) => {
    row[1] = `${row[1]} Lamang`;
  });

  test.concurrent.each(testIntegersWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrencyData = cloneDeep(testIntegersWithCurrency);

  test.concurrent.each(testIntegersWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegersWithCurrency);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Lamang`;
  });

  testNegativeIntegersWithCurrency[0][1] = 'Sero Piso Lamang';

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyData = cloneDeep(testIntegersWithCurrency);
  testIntegersWithCurrencyData.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} Lamang`;
  });

  test.concurrent.each(testIntegersWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, 'Sero Piso Lamang'],
  [0.04, 'Sero Piso At Apat Sentimo Lamang'],
  [0.0468, 'Sero Piso At Lima Sentimo Lamang'],
  [0.4, 'Sero Piso At Apatnapu Sentimo Lamang'],
  [0.63, 'Sero Piso At Animnapu Tatlo Sentimo Lamang'],
  [0.973, 'Sero Piso At Siyamnapu Pito Sentimo Lamang'],
  [0.999, 'Isa Piso Lamang'],
  [37.06, 'Tatlumpu Pito Piso At Anim Sentimo Lamang'],
  [37.068, 'Tatlumpu Pito Piso At Pito Sentimo Lamang'],
  [37.68, 'Tatlumpu Pito Piso At Animnapu Walo Sentimo Lamang'],
  [37.683, 'Tatlumpu Pito Piso At Animnapu Walo Sentimo Lamang'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyData = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyData[0][1] = '';
  testFloatsWithCurrencyData.map((row) => {
    row[1] = row[1].replace('Sero Piso At ', '');
  });

  test.concurrent.each(testFloatsWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyData = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyData.map((row) => {
    if (row[0] === 0.999) {
      row[1] = 'Sero Piso Lamang';
    } else {
      row[1] = row[1].replace(new RegExp(' At .* Sentimo'), '');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, ignoreDecimal: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyData = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyData.map((row, i) => {
    if (i < 7) {
      row[1] = '';
    } else {
      row[1] = row[1].replace(new RegExp(' At .* Sentimo'), '');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyData)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'Sero'],
  [0.04, 'Sero Tuldok Sero Apat'],
  [0.0468, 'Sero Tuldok Sero Apat Anim Walo'],
  [0.4, 'Sero Tuldok Apat'],
  [0.63, 'Sero Tuldok Animnapu Tatlo'],
  [0.973, 'Sero Tuldok Siyam Daan Pitumpu Tatlo'],
  [0.999, 'Sero Tuldok Siyam Daan Siyamnapu Siyam'],
  [37.06, 'Tatlumpu Pito Tuldok Sero Anim'],
  [37.068, 'Tatlumpu Pito Tuldok Sero Anim Walo'],
  [37.68, 'Tatlumpu Pito Tuldok Animnapu Walo'],
  [37.683, 'Tatlumpu Pito Tuldok Anim Daan Walumpu Tatlo'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testOrdinalNumbers: [number, string][] = [
  [0, 'Ikasero'],
  [1, 'Una'],
  [2, 'Ikalawa'],
  [3, 'Ikatlo'],
  [4, 'Ikaapat'],
  [5, 'Ikalima'],
  [6, 'Ikaanim'],
  [7, 'Ikapito'],
  [8, 'Ikawalo'],
  [9, 'Ikasiyam'],
  [10, 'Ikasampu'],
  [11, 'Ikalabing-isa'],
  [12, 'Ikalabindalawa'],
  [13, 'Ikalabintatlo'],
  [14, 'Ikalabing-apat'],
  [15, 'Ikalabinlima'],
  [16, 'Ikalabing-anim'],
  [17, 'Ikalabimpito'],
  [18, 'Ikalabingwalo'],
  [19, 'Ikalabinsiyam'],
  [20, 'Ikadalawampu'],
  [21, 'Dalawampu Una'],
  [22, 'Dalawampu Ikalawa'],
  [23, 'Dalawampu Ikatlo'],
  [30, 'Ikatatlumpu'],
  [40, 'Ikaapatnapu'],
  [50, 'Ikalimampu'],
  [60, 'Ikaanimnapu'],
  [70, 'Ikapitumpu'],
  [80, 'Ikawalumpu'],
  [90, 'Ikasiyamnapu'],
  [31, 'Tatlumpu Una'],
  [32, 'Tatlumpu Ikalawa'],
  [33, 'Tatlumpu Ikatlo'],
  [41, 'Apatnapu Una'],
  [42, 'Apatnapu Ikalawa'],
  [43, 'Apatnapu Ikatlo'],
  [51, 'Limampu Una'],
  [52, 'Limampu Ikalawa'],
  [53, 'Limampu Ikatlo'],
  [100, 'Isang Ikadaan'],
  [200, 'Dalawa Ikadaan'],
  [1000, 'Isang Ikalibo'],
  [10000, 'Sampu Ikalibo'],
  [100000, 'Isang Daan Ikalibo'],
  [1000000, 'Isang Ikamilyon'],
  [10000000, 'Sampu Ikamilyon'],
  [101, 'Isa Daan Una'],
  [102, 'Isa Daan Ikalawa'],
  [103, 'Isa Daan Ikatlo'],
  [111, 'Isa Daan Ikalabing-isa'],
  [112, 'Isa Daan Ikalabindalawa'],
  [113, 'Isa Daan Ikalabintatlo'],
  [123, 'Isa Daan Dalawampu Ikatlo'],
  [1001, 'Isa Libo Una'],
  [1111, 'Isa Libo Isa Daan Ikalabing-isa'],
  [1234, 'Isa Libo Dalawa Daan Tatlumpu Ikaapat'],
  [12345, 'Labindalawa Libo Tatlo Daan Apatnapu Ikalima'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test.concurrent('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow();
  });

  test.concurrent('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow();
  });

  test.concurrent('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow();
  });

  test.concurrent('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(0.1)).toThrow();
  });

  test.concurrent('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(10.5)).toThrow();
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Sampu'],
  [100, 'Isang Daan'],
  [1000, 'Isang Libo'],
  [10000, 'Sampu Libo'],
  [100000, 'Isang Daan Libo'],
  [1000000, 'Isang Milyon'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'Sero'],
  [1n, 'Isa'],
  [100n, 'Isang Daan'],
  [1000n, 'Isang Libo'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'Minus Isa'],
  [-100n, 'Minus Isang Daan'],
  [-1000n, 'Minus Isang Libo'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'Sero'],
  ['1', 'Isa'],
  ['100', 'Isang Daan'],
  ['-100', 'Minus Isang Daan'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test.concurrent('convert 0 => Sero', () => {
    expect(toWords.convert(0)).toBe('Sero');
  });

  test.concurrent('convert -0 => Sero', () => {
    expect(toWords.convert(-0)).toBe('Sero');
  });

  test.concurrent('convert 0.0 => Sero', () => {
    expect(toWords.convert(0.0)).toBe('Sero');
  });

  test.concurrent('convert 0n => Sero', () => {
    expect(toWords.convert(0n)).toBe('Sero');
  });

  test.concurrent('convert "0" => Sero', () => {
    expect(toWords.convert('0')).toBe('Sero');
  });

  test.concurrent('convert 0 with currency => Sero Piso Lamang', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Sero Piso Lamang');
  });
});

describe('Test Invalid Input', () => {
  test.concurrent('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test.concurrent('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test.concurrent('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test.concurrent('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test.concurrent('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

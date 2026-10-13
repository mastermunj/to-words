import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import filPh from '../src/locales/fil-PH.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/fil-PH.js';

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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
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
  [21, "Dalawampu't Isa"],
  [25, "Dalawampu't Lima"],
  [30, 'Tatlumpu'],
  [35, "Tatlumpu't Lima"],
  [50, 'Limampu'],
  [99, "Siyamnapu't Siyam"],
  [100, 'Isang Daan'],
  [101, 'Isang Daan At Isa'],
  [111, 'Isang Daan At Labing-isa'],
  [137, "Isang Daan At Tatlumpu't Pito"],
  [200, 'Dalawang Daan'],
  [500, 'Limang Daan'],
  [700, 'Pitong Daan'],
  [999, "Siyam Na Raan At Siyamnapu't Siyam"],
  [1000, 'Isang Libo'],
  [1001, "Isang Libo't Isa"],
  [1100, "Isang Libo't Isang Daan"],
  [1111, "Isang Libo't Isang Daan At Labing-isa"],
  [2000, 'Dalawang Libo'],
  [4680, "Apat Na Libo't Anim Na Raan At Walumpu"],
  [10000, 'Sampung Libo'],
  [11000, 'Labing-isang Libo'],
  [21000, "Dalawampu't Isang Libo"],
  [63892, "Animnapu't Tatlong Libo't Walong Daan At Siyamnapu't Dalawa"],
  [86100, "Walumpu't Anim Na Libo't Isang Daan"],
  [100000, 'Isang Daang Libo'],
  [123456, "Isang Daan At Dalawampu't Tatlong Libo't Apat Na Raan At Limampu't Anim"],
  [792581, "Pitong Daan At Siyamnapu't Dalawang Libo't Limang Daan At Walumpu't Isa"],
  [1000000, 'Isang Milyon'],
  [2000000, 'Dalawang Milyon'],
  [2741034, "Dalawang Milyon At Pitong Daan At Apatnapu't Isang Libo't Tatlumpu't Apat"],
  [10000000, 'Sampung Milyon'],
  [86429753, "Walumpu't Anim Na Milyon At Apat Na Raan At Dalawampu't Siyam Na Libo't Pitong Daan At Limampu't Tatlo"],
  [100000000, 'Isang Daang Milyon'],
  [
    975310864,
    "Siyam Na Raan At Pitumpu't Limang Milyon At Tatlong Daan At Sampung Libo't Walong Daan At Animnapu't Apat",
  ],
  [1000000000, 'Isang Bilyon'],
  [
    9876543210,
    "Siyam Na Bilyon At Walong Daan At Pitumpu't Anim Na Milyon At Limang Daan At Apatnapu't Tatlong Libo't Dalawang Daan At Sampu",
  ],
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
  [0, 'Serong Piso'],
  [1, 'Isang Piso'],
  [2, 'Dalawang Piso'],
  [3, 'Tatlong Piso'],
  [4, 'Apat Na Piso'],
  [5, 'Limang Piso'],
  [6, 'Anim Na Piso'],
  [7, 'Pitong Piso'],
  [8, 'Walong Piso'],
  [9, 'Siyam Na Piso'],
  [10, 'Sampung Piso'],
  [21, "Dalawampu't Isang Piso"],
  [100, 'Isang Daang Piso'],
  [101, 'Isang Daan At Isang Piso'],
  [111, 'Isang Daan At Labing-isang Piso'],
  [137, "Isang Daan At Tatlumpu't Pitong Piso"],
  [1000, 'Isang Libong Piso'],
  [1001, "Isang Libo't Isang Piso"],
  [1100, "Isang Libo't Isang Daang Piso"],
  [1111, "Isang Libo't Isang Daan At Labing-isang Piso"],
  [10000, 'Sampung Libong Piso'],
  [100000, 'Isang Daang Libong Piso'],
  [123456, "Isang Daan At Dalawampu't Tatlong Libo't Apat Na Raan At Limampu't Anim Na Piso"],
  [1000000, 'Isang Milyong Piso'],
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

  testNegativeIntegersWithCurrency[0][1] = 'Serong Piso Lamang';

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
  [0, 'Serong Piso Lamang'],
  [0.04, 'Serong Piso At Apat Na Sentimo Lamang'],
  [0.0468, 'Serong Piso At Limang Sentimo Lamang'],
  [0.4, 'Serong Piso At Apatnapung Sentimo Lamang'],
  [0.63, "Serong Piso At Animnapu't Tatlong Sentimo Lamang"],
  [0.973, "Serong Piso At Siyamnapu't Pitong Sentimo Lamang"],
  [0.999, 'Isang Piso Lamang'],
  [37.06, "Tatlumpu't Pitong Piso At Anim Na Sentimo Lamang"],
  [37.068, "Tatlumpu't Pitong Piso At Pitong Sentimo Lamang"],
  [37.68, "Tatlumpu't Pitong Piso At Animnapu't Walong Sentimo Lamang"],
  [37.683, "Tatlumpu't Pitong Piso At Animnapu't Walong Sentimo Lamang"],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Isang Daan At Dalawampu't Tatlong Piso Lamang`],
    ['123', `Isang Daan At Dalawampu't Tatlong Piso Lamang`],
    ['123.0', `Isang Daan At Dalawampu't Tatlong Piso At Serong Sentimo Lamang`],
    ['123.00', `Isang Daan At Dalawampu't Tatlong Piso At Serong Sentimo Lamang`],
    ['0.00', `Serong Piso At Serong Sentimo Lamang`],
    ['-123.00', `Minus Isang Daan At Dalawampu't Tatlong Piso At Serong Sentimo Lamang`],
    ['37.68', `Tatlumpu't Pitong Piso At Animnapu't Walong Sentimo Lamang`],
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

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyData = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyData[0][1] = '';
  testFloatsWithCurrencyData.map((row) => {
    row[1] = row[1].replace('Serong Piso At ', '');
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
      row[1] = 'Serong Piso Lamang';
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
  [0.63, "Sero Tuldok Animnapu't Tatlo"],
  [0.973, "Sero Tuldok Siyam Na Raan At Pitumpu't Tatlo"],
  [0.999, "Sero Tuldok Siyam Na Raan At Siyamnapu't Siyam"],
  [37.06, "Tatlumpu't Pito Tuldok Sero Anim"],
  [37.068, "Tatlumpu't Pito Tuldok Sero Anim Walo"],
  [37.68, "Tatlumpu't Pito Tuldok Animnapu't Walo"],
  [37.683, "Tatlumpu't Pito Tuldok Anim Na Raan At Walumpu't Tatlo"],
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
  [21, "Ikadalawampu't Isa"],
  [22, "Ikadalawampu't Dalawa"],
  [23, "Ikadalawampu't Tatlo"],
  [30, 'Ikatatlumpu'],
  [40, 'Ikaapatnapu'],
  [50, 'Ikalimampu'],
  [60, 'Ikaanimnapu'],
  [70, 'Ikapitumpu'],
  [80, 'Ikawalumpu'],
  [90, 'Ikasiyamnapu'],
  [31, "Ikatatlumpu't Isa"],
  [32, "Ikatatlumpu't Dalawa"],
  [33, "Ikatatlumpu't Tatlo"],
  [41, "Ikaapatnapu't Isa"],
  [42, "Ikaapatnapu't Dalawa"],
  [43, "Ikaapatnapu't Tatlo"],
  [51, "Ikalimampu't Isa"],
  [52, "Ikalimampu't Dalawa"],
  [53, "Ikalimampu't Tatlo"],
  [100, 'Ikaisang Daan'],
  [200, 'Ikadalawang Daan'],
  [1000, 'Ikaisang Libo'],
  [10000, 'Ikasampung Libo'],
  [100000, 'Ikaisang Daang Libo'],
  [1000000, 'Ikaisang Milyon'],
  [10000000, 'Ikasampung Milyon'],
  [101, 'Ikaisang Daan At Isa'],
  [102, 'Ikaisang Daan At Dalawa'],
  [103, 'Ikaisang Daan At Tatlo'],
  [111, 'Ikaisang Daan At Labing-isa'],
  [112, 'Ikaisang Daan At Labindalawa'],
  [113, 'Ikaisang Daan At Labintatlo'],
  [123, "Ikaisang Daan At Dalawampu't Tatlo"],
  [1001, "Ikaisang Libo't Isa"],
  [1111, "Ikaisang Libo't Isang Daan At Labing-isa"],
  [1234, "Ikaisang Libo't Dalawang Daan At Tatlumpu't Apat"],
  [12345, "Ikalabindalawang Libo't Tatlong Daan At Apatnapu't Lima"],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test.concurrent('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow(/Ordinal numbers must be non-negative integers/);
  });

  test.concurrent('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow(/Ordinal numbers must be non-negative integers/);
  });

  test.concurrent('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow(/Ordinal numbers must be non-negative integers/);
  });

  test.concurrent('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(0.1)).toThrow(/Ordinal numbers must be non-negative integers/);
  });

  test.concurrent('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(10.5)).toThrow(/Ordinal numbers must be non-negative integers/);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Sampu'],
  [100, 'Isang Daan'],
  [1000, 'Isang Libo'],
  [10000, 'Sampung Libo'],
  [100000, 'Isang Daang Libo'],
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

  test.concurrent('convert 0 with currency => Serong Piso Lamang', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Serong Piso Lamang');
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

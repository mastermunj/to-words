import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import lvLV from '../src/locales/lv-LV.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/lv-LV.js';

const localeCode = 'lv-LV';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(lvLV);
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
  [0, 'nulle'],
  [137, 'simt trīsdesmit septiņi'],
  [700, 'septiņsimt'],
  [4680, 'četri tūkstoši sešsimt astoņdesmit'],
  [63892, 'sešdesmit trīs tūkstoši astoņsimt deviņdesmit divi'],
  [792581, 'septiņsimt deviņdesmit divi tūkstoši piecsimt astoņdesmit viens'],
  [1234567, 'viens miljons divsimt trīsdesmit četri tūkstoši piecsimt sešdesmit septiņi'],
  [2741034, 'divi miljoni septiņsimt četrdesmit viens tūkstotis trīsdesmit četri'],
  [86429753, 'astoņdesmit seši miljoni četrsimt divdesmit deviņi tūkstoši septiņsimt piecdesmit trīs'],
  [975310864, 'deviņsimt septiņdesmit pieci miljoni trīssimt desmit tūkstoši astoņsimt sešdesmit četri'],
  [9876543210, 'deviņi miljardi astoņsimt septiņdesmit seši miljoni piecsimt četrdesmit trīs tūkstoši divsimt desmit'],
  [
    98765432101,
    'deviņdesmit astoņi miljardi septiņsimt sešdesmit pieci miljoni četrsimt trīsdesmit divi tūkstoši simt viens',
  ],
  [
    987654321012,
    'deviņsimt astoņdesmit septiņi miljardi sešsimt piecdesmit četri miljoni trīssimt divdesmit viens tūkstotis divpadsmit',
  ],
  [
    9876543210123,
    'deviņi triljoni astoņsimt septiņdesmit seši miljardi piecsimt četrdesmit trīs miljoni divsimt desmit tūkstoši simt divdesmit trīs',
  ],
  [
    98765432101234,
    'deviņdesmit astoņi triljoni septiņsimt sešdesmit pieci miljardi četrsimt trīsdesmit divi miljoni simt viens tūkstotis divsimt trīsdesmit četri',
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
    row[1] = `mīnus ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} eiro`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} eiro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} eiro`;
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
  [0.0, 'nulle'],
  [0.04, 'nulle komats nulle četri'],
  [0.0468, 'nulle komats nulle četri seši astoņi'],
  [0.4, 'nulle komats četri'],
  [0.63, 'nulle komats sešdesmit trīs'],
  [0.973, 'nulle komats deviņsimt septiņdesmit trīs'],
  [0.999, 'nulle komats deviņsimt deviņdesmit deviņi'],
  [37.06, 'trīsdesmit septiņi komats nulle seši'],
  [37.068, 'trīsdesmit septiņi komats nulle seši astoņi'],
  [37.68, 'trīsdesmit septiņi komats sešdesmit astoņi'],
  [37.683, 'trīsdesmit septiņi komats sešsimt astoņdesmit trīs'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `simt divdesmit trīs eiro`],
    ['123', `simt divdesmit trīs eiro`],
    ['123.0', `simt divdesmit trīs eiro un nulle centi`],
    ['123.00', `simt divdesmit trīs eiro un nulle centi`],
    ['0.00', `nulle eiro un nulle centi`],
    ['-123.00', `mīnus simt divdesmit trīs eiro un nulle centi`],
    ['37.68', `trīsdesmit septiņi eiro un sešdesmit astoņi centi`],
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
  [0.0, `nulle eiro`],
  [0.04, `nulle eiro un četri centi`],
  [0.0468, `nulle eiro un pieci centi`],
  [0.4, `nulle eiro un četrdesmit centi`],
  [0.63, `nulle eiro un sešdesmit trīs centi`],
  [0.973, `nulle eiro un deviņdesmit septiņi centi`],
  [0.999, `viens eiro`],
  [37.06, `trīsdesmit septiņi eiro un seši centi`],
  [37.068, `trīsdesmit septiņi eiro un septiņi centi`],
  [37.68, `trīsdesmit septiņi eiro un sešdesmit astoņi centi`],
  [37.683, `trīsdesmit septiņi eiro un sešdesmit astoņi centi`],
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
      row[1] = (row[1] as string).replace(`nulle eiro un `, '');
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
      row[1] = `nulle eiro`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` un .* centi`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` un .* centi`), '');
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
  [0, 'nulltais'],
  [1, 'pirmais'],
  [2, 'otrais'],
  [3, 'trešais'],
  [4, 'ceturtais'],
  [5, 'piektais'],
  [6, 'sestais'],
  [7, 'septītais'],
  [8, 'astotais'],
  [9, 'devītais'],
  [10, 'desmitais'],
  [11, 'vienpadsmitais'],
  [12, 'divpadsmitais'],
  [13, 'trīspadsmitais'],
  [14, 'četrpadsmitais'],
  [15, 'piecpadsmitais'],
  [16, 'sešpadsmitais'],
  [17, 'septiņpadsmitais'],
  [18, 'astoņpadsmitais'],
  [19, 'deviņpadsmitais'],
  [20, 'divdesmitais'],
  [21, 'divdesmit pirmais'],
  [22, 'divdesmit otrais'],
  [30, 'trīsdesmitais'],
  [33, 'trīsdesmit trešais'],
  [40, 'četrdesmitais'],
  [50, 'piecdesmitais'],
  [55, 'piecdesmit piektais'],
  [60, 'sešdesmitais'],
  [70, 'septiņdesmitais'],
  [80, 'astoņdesmitais'],
  [90, 'deviņdesmitais'],
  [99, 'deviņdesmit devītais'],
  [100, 'simtais'],
  [101, 'simt pirmais'],
  [123, 'simt divdesmit trešais'],
  [1000, 'tūkstošais'],
  [1001, 'viens tūkstotis pirmais'],
  [1000000, 'miljonais'],
  [1000000000, 'miljardais'],
];

describe('Test Ordinals with toOrdinal()', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'desmit'],
  [100, 'simts'],
  [1000, 'viens tūkstotis'],
  [10000, 'desmit tūkstoši'],
  [100000, 'simts tūkstoši'],
  [1000000, 'viens miljons'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'nulle'],
  [1n, 'viens'],
  [100n, 'simts'],
  [1000n, 'viens tūkstotis'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'mīnus viens'],
  [-100n, 'mīnus simts'],
  [-1000n, 'mīnus viens tūkstotis'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'nulle'],
  ['1', 'viens'],
  ['100', 'simts'],
  ['-100', 'mīnus simts'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => nulle', () => {
    expect(toWords.convert(0)).toBe('nulle');
  });

  test('convert -0 => nulle', () => {
    expect(toWords.convert(-0)).toBe('nulle');
  });

  test('convert 0.0 => nulle', () => {
    expect(toWords.convert(0.0)).toBe('nulle');
  });

  test('convert 0n => nulle', () => {
    expect(toWords.convert(0n)).toBe('nulle');
  });

  test('convert "0" => nulle', () => {
    expect(toWords.convert('0')).toBe('nulle');
  });

  test('convert 0 with currency => nulle eiro', () => {
    expect(toWords.convert(0, { currency: true })).toBe('nulle eiro');
  });
});

describe('Test Invalid Input', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
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

const testFractionStyleLvLV: [number, string][] = [
  [1.1, 'viens un viena desmitdaļa'],
  [2.5, 'divi un piecas desmitdaļas'],
  [1.01, 'viens un viena simtdaļa'],
  [1.45, 'viens un četrdesmit piecas simtdaļas'],
  [0.05, 'nulle un piecas simtdaļas'],
  [1.001, 'viens un viena tūkstošdaļa'],
  [1.005, 'viens un piecas tūkstošdaļas'],
  [1.0001, 'viens un viena desmittūkstošdaļa'],
  [1.0005, 'viens un piecas desmittūkstošdaļas'],
  [1.00001, 'viens un viena simttūkstošdaļa'],
  [1.00005, 'viens un piecas simttūkstošdaļas'],
  [1.000001, 'viens un viena miljondaļa'],
  [1.000005, 'viens un piecas miljondaļas'],
  [123.45, 'simt divdesmit trīs un četrdesmit piecas simtdaļas'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleLvLV)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'viens komats viens miljons divsimt trīsdesmit četri tūkstoši piecsimt sešdesmit septiņi',
    );
    expect(toWords.convert(1.1234567)).toBe(
      'viens komats viens miljons divsimt trīsdesmit četri tūkstoši piecsimt sešdesmit septiņi',
    );
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('viens komats pieci');
    expect(toWords.convert(0.05)).toBe('nulle komats nulle pieci');
  });
});

describe('Sourced forms (tezaurs.lv)', () => {
  const tw = new ToWords({ localeCode: 'lv-LV' });

  test.each([
    [100, 'simts'],
    [101, 'simt viens'],
    [2000, 'divi tūkstoši'],
    [1000000000000, 'viens triljons'],
  ])('convert %d => %s', (input, expected) => {
    expect(tw.convert(input)).toBe(expected);
  });

  test.each([
    [200, 'divsimtais'],
    [1000, 'tūkstošais'],
    [2000, 'divtūkstošais'],
    [1000000, 'miljonais'],
    [1200, 'viens tūkstotis divsimtais'],
  ])('toOrdinal %d => %s', (input, expected) => {
    expect(tw.toOrdinal(input)).toBe(expected);
  });

  test('feminine forms of 1-9; currency ignores the gender option', () => {
    expect(tw.convert(24, { gender: 'feminine' })).toBe('divdesmit četras');
    expect(tw.convert(1.01, { currency: true, gender: 'feminine' })).toBe('viens eiro un viens cents');
  });
});

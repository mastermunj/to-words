import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import lvLV from '../src/locales/lv-LV.js';
import { ToWords as LocaleToWords } from '../src/locales/lv-LV.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'nulle'],
  [137, 'simtu trīsdesmit septiņi'],
  [700, 'septiņi simti'],
  [4680, 'četri tūkstoši seši simti astoņdesmit'],
  [63892, 'sešdesmit trīs tūkstoši astoņi simti deviņdesmit divi'],
  [792581, 'septiņi simti deviņdesmit divi tūkstoši pieci simti astoņdesmit viens'],
  [1234567, 'viens miljons divi simti trīsdesmit četri tūkstoši pieci simti sešdesmit septiņi'],
  [2741034, 'divi miljoni septiņi simti četrdesmit viens tūkstotis trīsdesmit četri'],
  [86429753, 'astoņdesmit seši miljoni četri simti divdesmit deviņi tūkstoši septiņi simti piecdesmit trīs'],
  [975310864, 'deviņi simti septiņdesmit pieci miljoni trīs simti desmit tūkstoši astoņi simti sešdesmit četri'],
  [
    9876543210,
    'deviņi miljardi astoņi simti septiņdesmit seši miljoni pieci simti četrdesmit trīs tūkstoši divi simti desmit',
  ],
  [
    98765432101,
    'deviņdesmit astoņi miljardi septiņi simti sešdesmit pieci miljoni četri simti trīsdesmit divi tūkstoši simtu viens',
  ],
  [
    987654321012,
    'deviņi simti astoņdesmit septiņi miljardi seši simti piecdesmit četri miljoni trīs simti divdesmit viens tūkstotis divpadsmit',
  ],
  [
    9876543210123,
    'deviņi triljoni astoņi simti septiņdesmit seši miljardi pieci simti četrdesmit trīs miljoni divi simti desmit tūkstoši simtu divdesmit trīs',
  ],
  [
    98765432101234,
    'deviņdesmit astoņi triljoni septiņi simti sešdesmit pieci miljardi četri simti trīsdesmit divi miljoni simtu viens tūkstotis divi simti trīsdesmit četri',
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

const testFloats = [
  [0.0, 'nulle'],
  [0.04, 'nulle komats nulle četri'],
  [0.0468, 'nulle komats nulle četri seši astoņi'],
  [0.4, 'nulle komats četri'],
  [0.63, 'nulle komats sešdesmit trīs'],
  [0.973, 'nulle komats deviņi simti septiņdesmit trīs'],
  [0.999, 'nulle komats deviņi simti deviņdesmit deviņi'],
  [37.06, 'trīsdesmit septiņi komats nulle seši'],
  [37.068, 'trīsdesmit septiņi komats nulle seši astoņi'],
  [37.68, 'trīsdesmit septiņi komats sešdesmit astoņi'],
  [37.683, 'trīsdesmit septiņi komats seši simti astoņdesmit trīs'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
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
  [101, 'simtu pirmais'],
  [123, 'simtu divdesmit trešais'],
  [1000, 'viens tūkstošais'],
  [1001, 'viens tūkstotis pirmais'],
  [1000000, 'viens miljonais'],
  [1000000000, 'viens miljardais'],
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
  [100, 'Simtu'],
  [1000, 'viens tūkstotis'],
  [10000, 'desmit tūkstoši'],
  [100000, 'Simtu tūkstoši'],
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
  [100n, 'Simtu'],
  [1000n, 'viens tūkstotis'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'mīnus viens'],
  [-100n, 'mīnus Simtu'],
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
  ['100', 'Simtu'],
  ['-100', 'mīnus Simtu'],
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
    expect(() => toWords.convert(Number.NaN)).toThrow();
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow();
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow();
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import esPe from '../src/locales/es-PE.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/es-PE.js';

const localeCode = 'es-PE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(esPe);
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
  [0, 'Cero'],
  [137, 'Ciento Treinta Y Siete'],
  [700, 'Setecientos'],
  [1100, 'Mil Cien'],
  [4680, 'Cuatro Mil Seiscientos Ochenta'],
  [63892, 'Sesenta Y Tres Mil Ochocientos Noventa Y Dos'],
  [86100, 'Ochenta Y Seis Mil Cien'],
  [792581, 'Setecientos Noventa Y Dos Mil Quinientos Ochenta Y Uno'],
  [2741034, 'Dos Millones Setecientos Cuarenta Y Un Mil Treinta Y Cuatro'],
  [86429753, 'Ochenta Y Seis Millones Cuatrocientos Veintinueve Mil Setecientos Cincuenta Y Tres'],
  [975310864, 'Novecientos Setenta Y Cinco Millones Trescientos Diez Mil Ochocientos Sesenta Y Cuatro'],
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
    row[1] = `Menos ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testIntegersCurrency: [number, string][] = [
  [0, 'Cero'],
  [137, 'Ciento Treinta Y Siete'],
  [700, 'Setecientos'],
  [1100, 'Mil Cien'],
  [4680, 'Cuatro Mil Seiscientos Ochenta'],
  [63892, 'Sesenta Y Tres Mil Ochocientos Noventa Y Dos'],
  [86100, 'Ochenta Y Seis Mil Cien'],
  [792581, 'Setecientos Noventa Y Dos Mil Quinientos Ochenta Y Un'],
  [2741034, 'Dos Millones Setecientos Cuarenta Y Un Mil Treinta Y Cuatro'],
  [86429753, 'Ochenta Y Seis Millones Cuatrocientos Veintinueve Mil Setecientos Cincuenta Y Tres'],
  [975310864, 'Novecientos Setenta Y Cinco Millones Trescientos Diez Mil Ochocientos Sesenta Y Cuatro'],
];

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Soles`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Soles`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Soles`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Menos ${row[1]} Soles`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Soles`;
  });

  test.concurrent.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'Cero'],
  [0.04, 'Cero Coma Cero Cuatro'],
  [0.0468, 'Cero Coma Cero Cuatro Seis Ocho'],
  [0.4, 'Cero Coma Cuatro'],
  [0.63, 'Cero Coma Sesenta Y Tres'],
  [0.973, 'Cero Coma Novecientos Setenta Y Tres'],
  [0.999, 'Cero Coma Novecientos Noventa Y Nueve'],
  [37.06, 'Treinta Y Siete Coma Cero Seis'],
  [37.068, 'Treinta Y Siete Coma Cero Seis Ocho'],
  [37.68, 'Treinta Y Siete Coma Sesenta Y Ocho'],
  [37.683, 'Treinta Y Siete Coma Seiscientos Ochenta Y Tres'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Ciento Veintitrés Soles`],
    ['123', `Ciento Veintitrés Soles`],
    ['123.0', `Ciento Veintitrés Soles Y Cero Céntimos`],
    ['123.00', `Ciento Veintitrés Soles Y Cero Céntimos`],
    ['0.00', `Cero Soles Y Cero Céntimos`],
    ['-123.00', `Menos Ciento Veintitrés Soles Y Cero Céntimos`],
    ['37.68', `Treinta Y Siete Soles Y Sesenta Y Ocho Céntimos`],
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

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Cero Soles`],
  [0.04, `Cero Soles Y Cuatro Céntimos`],
  [0.0468, `Cero Soles Y Cinco Céntimos`],
  [0.4, `Cero Soles Y Cuarenta Céntimos`],
  [0.63, `Cero Soles Y Sesenta Y Tres Céntimos`],
  [0.973, `Cero Soles Y Noventa Y Siete Céntimos`],
  [0.999, `Un Sol`],
  [37.06, `Treinta Y Siete Soles Y Seis Céntimos`],
  [37.068, `Treinta Y Siete Soles Y Siete Céntimos`],
  [37.68, `Treinta Y Siete Soles Y Sesenta Y Ocho Céntimos`],
  [37.683, `Treinta Y Siete Soles Y Sesenta Y Ocho Céntimos`],
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
      row[1] = (row[1] as string).replace('Cero Soles Y ', '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, 'Cero Soles'];
      case value >= 0.999 && value < 1:
        return [value, 'Un Sol'];
      case value >= 37 && value < 38:
        return [value, 'Treinta Y Siete Soles'];
      default:
        return row;
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency).map((row) => {
    const value = row[0];

    switch (true) {
      case value >= 0 && value < 1:
        return [value, ''];
      case value >= 0.999 && value < 1:
        return [value, 'Un Sol'];
      case value >= 37 && value < 38:
        return [value, 'Treinta Y Siete Soles'];
      default:
        return row;
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
          ignoreDecimal: true,
        }),
      ).toBe(expected);
    },
  );
});

describe('Test Locale functional exports', () => {
  test('localeToWords works', () => {
    expect(localeToWords(1)).toBe('Uno');
  });

  test('localeToOrdinal works', () => {
    expect(localeToOrdinal(1)).toBe('Primero');
  });

  test('localeToCurrency works', () => {
    expect(localeToCurrency(1)).toBe('Un Sol');
  });
});

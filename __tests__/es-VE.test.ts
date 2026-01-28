import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import esVE from '../src/locales/es-VE';

const localeCode = 'es-VE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(esVE);
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
  [9876543210, 'Nueve Mil Ochocientos Setenta Y Seis Millones Quinientos Cuarenta Y Tres Mil Doscientos Diez'],
  [98765432101, 'Noventa Y Ocho Mil Setecientos Sesenta Y Cinco Millones Cuatrocientos Treinta Y Dos Mil Ciento Uno'],
  [
    987654321012,
    'Novecientos Ochenta Y Siete Mil Seiscientos Cincuenta Y Cuatro Millones Trescientos Veintiuno Mil Doce',
  ],
  [
    9876543210123,
    'Nueve Billones Ochocientos Setenta Y Seis Mil Quinientos Cuarenta Y Tres Millones Doscientos Diez Mil Ciento Veintitrés',
  ],
  [
    98765432101234,
    'Noventa Y Ocho Billones Setecientos Sesenta Y Cinco Mil Cuatrocientos Treinta Y Dos Millones Ciento Un Mil Doscientos Treinta Y Cuatro',
  ],
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

const testIntegersCurrency = [
  [0, 'Cero'],
  // [1, 'Un Bolivar'],
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
  [9876543210, 'Nueve Mil Ochocientos Setenta Y Seis Millones Quinientos Cuarenta Y Tres Mil Doscientos Diez'],
  [98765432101, 'Noventa Y Ocho Mil Setecientos Sesenta Y Cinco Millones Cuatrocientos Treinta Y Dos Mil Ciento Un'],
  [
    987654321012,
    'Novecientos Ochenta Y Siete Mil Seiscientos Cincuenta Y Cuatro Millones Trescientos Veintiuno Mil Doce',
  ],
  [
    9876543210123,
    'Nueve Billones Ochocientos Setenta Y Seis Mil Quinientos Cuarenta Y Tres Millones Doscientos Diez Mil Ciento Veintitrés',
  ],
  [
    98765432101234,
    'Noventa Y Ocho Billones Setecientos Sesenta Y Cinco Mil Cuatrocientos Treinta Y Dos Millones Ciento Un Mil Doscientos Treinta Y Cuatro',
  ],
];

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Bolivares`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Bolivares`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Bolivares`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Menos ${row[1]} Bolivares`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Bolivares`;
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

const testFloats = [
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

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Cero Bolivares`],
  [0.04, `Cero Bolivares Con Cuatro Centimos`],
  [0.0468, `Cero Bolivares Con Cinco Centimos`],
  [0.4, `Cero Bolivares Con Cuarenta Centimos`],
  [0.63, `Cero Bolivares Con Sesenta Y Tres Centimos`],
  [0.973, `Cero Bolivares Con Noventa Y Siete Centimos`],
  [0.999, `Un Bolivar`],
  [37.06, `Treinta Y Siete Bolivares Con Seis Centimos`],
  [37.068, `Treinta Y Siete Bolivares Con Siete Centimos`],
  [37.68, `Treinta Y Siete Bolivares Con Sesenta Y Ocho Centimos`],
  [37.683, `Treinta Y Siete Bolivares Con Sesenta Y Ocho Centimos`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace(`Cero Bolivares Con `, '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `Cero Bolivares`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Bolivares Con [\\w ]+ Centimos`), ' Bolivares');
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` Bolivares Con [\\w ]+ Centimos`), ' Bolivares');
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

const testFloatsWithDollarCurrency = [
  [0.0, `Cero Dolares`],
  [0.04, `Cero Dolares Con Cuatro Centavos`],
  [0.0468, `Cero Dolares Con Cinco Centavos`],
  [0.4, `Cero Dolares Con Cuarenta Centavos`],
  [0.63, `Cero Dolares Con Sesenta Y Tres Centavos`],
  [0.973, `Cero Dolares Con Noventa Y Siete Centavos`],
  [0.999, `Un Dolar`],
  [37.06, `Treinta Y Siete Dolares Con Seis Centavos`],
  [37.068, `Treinta Y Siete Dolares Con Siete Centavos`],
  [37.68, `Treinta Y Siete Dolares Con Sesenta Y Ocho Centavos`],
  [37.683, `Treinta Y Siete Dolares Con Sesenta Y Ocho Centavos`],
];

const dollarCurrencyOptions = {
  name: 'Dolar',
  plural: 'Dolares',
  singular: 'Dolar',
  symbol: '$',
  fractionalUnit: {
    name: 'Centavo',
    plural: 'Centavos',
    singular: 'Centavo',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithDollarCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: dollarCurrencyOptions })).toBe(expected);
  });
});

// Ordinal Tests
const testOrdinals: [number, string][] = [
  // Numbers 1-20
  [1, 'Primero'],
  [2, 'Segundo'],
  [3, 'Tercero'],
  [4, 'Cuarto'],
  [5, 'Quinto'],
  [6, 'Sexto'],
  [7, 'Séptimo'],
  [8, 'Octavo'],
  [9, 'Noveno'],
  [10, 'Décimo'],
  [11, 'Decimoprimero'],
  [12, 'Decimosegundo'],
  [13, 'Decimotercero'],
  [14, 'Decimocuarto'],
  [15, 'Decimoquinto'],
  [16, 'Decimosexto'],
  [17, 'Decimoséptimo'],
  [18, 'Decimoctavo'],
  [19, 'Decimonoveno'],
  [20, 'Vigésimo'],
  // Composite numbers (21-29)
  [21, 'Veintiuno'],
  [22, 'Veintidos'],
  [23, 'Veintitrés'],
  [24, 'Veinticuatro'],
  [25, 'Veinticinco'],
  // Tens
  [30, 'Trigésimo'],
  [40, 'Cuadragésimo'],
  [50, 'Quincuagésimo'],
  [60, 'Sexagésimo'],
  [70, 'Septuagésimo'],
  [80, 'Octogésimo'],
  [90, 'Nonagésimo'],
  // Round numbers
  [100, 'Centésimo'],
  [200, 'Ducentésimo'],
  [300, 'Tricentésimo'],
  [400, 'Cuadringentésimo'],
  [500, 'Quingentésimo'],
  [600, 'Sexcentésimo'],
  [700, 'Septingentésimo'],
  [800, 'Octingentésimo'],
  [900, 'Noningentésimo'],
  [1000, 'Milésimo'],
  [1000000, 'Un Millonésimo'],
  // Complex numbers
  [101, 'Ciento Primero'],
  [110, 'Ciento Décimo'],
  [111, 'Ciento Decimoprimero'],
  [123, 'Ciento Veintitrés'],
  [150, 'Ciento Quincuagésimo'],
  [199, 'Ciento Noventa Y Noveno'],
  [256, 'Doscientos Cincuenta Y Sexto'],
  [1001, 'Mil Primero'],
  [1010, 'Mil Décimo'],
  [1100, 'Mil Centésimo'],
  [1234, 'Mil Doscientos Treinta Y Cuarto'],
  [2000, 'Dos Milésimo'],
  [10000, 'Diez Milésimo'],
  [100000, 'Cien Milésimo'],
  [1000001, 'Un Millon Primero'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(10.01)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative decimal numbers', () => {
    expect(() => toWords.toOrdinal(-3.14)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

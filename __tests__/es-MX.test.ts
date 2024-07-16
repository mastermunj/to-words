import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import esMX from '../src/locales/es-MX';

const localeCode = 'es-MX';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(esMX);
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
  // [1, 'Un Peso Mexicano'],
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
    row[1] = `${row[1]} Pesos Mexicanos`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Pesos Mexicanos`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Pesos Mexicanos`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Menos ${row[1]} Pesos Mexicanos`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Pesos Mexicanos`;
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
  [0.04, 'Cero Punto Cero Cuatro'],
  [0.0468, 'Cero Punto Cero Cuatro Seis Ocho'],
  [0.4, 'Cero Punto Cuatro'],
  [0.63, 'Cero Punto Sesenta Y Tres'],
  [0.973, 'Cero Punto Novecientos Setenta Y Tres'],
  [0.999, 'Cero Punto Novecientos Noventa Y Nueve'],
  [37.06, 'Treinta Y Siete Punto Cero Seis'],
  [37.068, 'Treinta Y Siete Punto Cero Seis Ocho'],
  [37.68, 'Treinta Y Siete Punto Sesenta Y Ocho'],
  [37.683, 'Treinta Y Siete Punto Seiscientos Ochenta Y Tres'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Cero Pesos Mexicanos`],
  [0.04, `Cero Pesos Mexicanos Y Cuatro Centavos`],
  [0.0468, `Cero Pesos Mexicanos Y Cinco Centavos`],
  [0.4, `Cero Pesos Mexicanos Y Cuarenta Centavos`],
  [0.63, `Cero Pesos Mexicanos Y Sesenta Y Tres Centavos`],
  [0.973, `Cero Pesos Mexicanos Y Noventa Y Siete Centavos`],
  [0.999, `Un Peso Mexicano`],
  [37.06, `Treinta Y Siete Pesos Mexicanos Y Seis Centavos`],
  [37.068, `Treinta Y Siete Pesos Mexicanos Y Siete Centavos`],
  [37.68, `Treinta Y Siete Pesos Mexicanos Y Sesenta Y Ocho Centavos`],
  [37.683, `Treinta Y Siete Pesos Mexicanos Y Sesenta Y Ocho Centavos`],
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
      row[1] = (row[1] as string).replace(`Cero Pesos Mexicanos Y `, '');
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
      row[1] = `Cero Pesos Mexicanos`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Pesos Mexicanos Y [\\w ]+ Centavos`), ' Pesos Mexicanos');
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
    row[1] = (row[1] as string).replace(new RegExp(` Pesos Mexicanos Y [\\w ]+ Centavos`), ' Pesos Mexicanos');
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
  [0.04, `Cero Dolares Y Cuatro Centavos`],
  [0.0468, `Cero Dolares Y Cinco Centavos`],
  [0.4, `Cero Dolares Y Cuarenta Centavos`],
  [0.63, `Cero Dolares Y Sesenta Y Tres Centavos`],
  [0.973, `Cero Dolares Y Noventa Y Siete Centavos`],
  [0.999, `Un Dolar`],
  [37.06, `Treinta Y Siete Dolares Y Seis Centavos`],
  [37.068, `Treinta Y Siete Dolares Y Siete Centavos`],
  [37.68, `Treinta Y Siete Dolares Y Sesenta Y Ocho Centavos`],
  [37.683, `Treinta Y Siete Dolares Y Sesenta Y Ocho Centavos`],
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

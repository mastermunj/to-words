import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ptBr from '../src/locales/pt-BR';

const localeCode = 'pt-BR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ptBr);
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
  [0, 'Zero'],
  [137, 'Cento E Trinta E Sete'],
  [700, 'Setecentos'],
  [1100, 'Mil Cem'],
  [4680, 'Quatro Mil Seiscentos E Oitenta'],
  [63892, 'Sessenta E Três Mil Oitocentos E Noventa E Dois'],
  [86100, 'Oitenta E Seis Mil Cem'],
  [792581, 'Setecentos E Noventa E Dois Mil Quinhentos E Oitenta E Um'],
  [2741034, 'Dois Milhões Setecentos E Quarenta E Um Mil Trinta E Quatro'],
  [86429753, 'Oitenta E Seis Milhões Quatrocentos E Vinte E Nove Mil Setecentos E Cinquenta E Três'],
  [975310864, 'Novecentos E Setenta E Cinco Milhões Trezentos E Dez Mil Oitocentos E Sessenta E Quatro'],
  [9876543210, 'Nove Bilhões Oitocentos E Setenta E Seis Milhões Quinhentos E Quarenta E Três Mil Duzentos E Dez'],
  [
    98765432101,
    'Noventa E Oito Bilhões Setecentos E Sessenta E Cinco Milhões Quatrocentos E Trinta E Dois Mil Cento E Um',
  ],
  [
    987654321012,
    'Novecentos E Oitenta E Sete Bilhões Seiscentos E Cinquenta E Quatro Milhões Trezentos E Vinte E Um Mil Doze',
  ],
  [
    9876543210123,
    'Nove Trilhões Oitocentos E Setenta E Seis Bilhões Quinhentos E Quarenta E Três Milhões Duzentos E Dez Mil Cento E Vinte E Três',
  ],
  [
    98765432101234,
    'Noventa E Oito Trilhões Setecentos E Sessenta E Cinco Bilhões Quatrocentos E Trinta E Dois Milhões Cento E Um Mil Duzentos E Trinta E Quatro',
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

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Reais`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Reais`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Reais`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Menos ${row[1]} Reais`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Reais`;
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
  [0.0, 'Zero'],
  [0.04, 'Zero Vírgula Zero Quatro'],
  [0.0468, 'Zero Vírgula Zero Quatro Seis Oito'],
  [0.4, 'Zero Vírgula Quatro'],
  [0.63, 'Zero Vírgula Sessenta E Três'],
  [0.973, 'Zero Vírgula Novecentos E Setenta E Três'],
  [0.999, 'Zero Vírgula Novecentos E Noventa E Nove'],
  [37.06, 'Trinta E Sete Vírgula Zero Seis'],
  [37.068, 'Trinta E Sete Vírgula Zero Seis Oito'],
  [37.68, 'Trinta E Sete Vírgula Sessenta E Oito'],
  [37.683, 'Trinta E Sete Vírgula Seiscentos E Oitenta E Três'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Reais`],
  [0.04, `Zero Reais E Quatro Centavos`],
  [0.0468, `Zero Reais E Cinco Centavos`],
  [0.4, `Zero Reais E Quarenta Centavos`],
  [0.63, `Zero Reais E Sessenta E Três Centavos`],
  [0.973, `Zero Reais E Noventa E Sete Centavos`],
  [0.999, `Um Reais`],
  [37.06, `Trinta E Sete Reais E Seis Centavos`],
  [37.068, `Trinta E Sete Reais E Sete Centavos`],
  [37.68, `Trinta E Sete Reais E Sessenta E Oito Centavos`],
  [37.683, `Trinta E Sete Reais E Sessenta E Oito Centavos`],
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
      row[1] = (row[1] as string).replace(`Zero Reais E `, '');
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
      row[1] = `Zero Reais`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Reais.*`), 'Reais');
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
    row[1] = (row[1] as string).replace(new RegExp(`Reais.*`), 'Reais');
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

const testFloatsWithEuroCurrency = [
  [0.0, `Zero Euros`],
  [0.04, `Zero Euros E Quatro Centimos`],
  [0.0468, `Zero Euros E Cinco Centimos`],
  [0.4, `Zero Euros E Quarenta Centimos`],
  [0.63, `Zero Euros E Sessenta E Três Centimos`],
  [0.973, `Zero Euros E Noventa E Sete Centimos`],
  [0.999, `Um Euros`],
  [37.06, `Trinta E Sete Euros E Seis Centimos`],
  [37.068, `Trinta E Sete Euros E Sete Centimos`],
  [37.68, `Trinta E Sete Euros E Sessenta E Oito Centimos`],
  [37.683, `Trinta E Sete Euros E Sessenta E Oito Centimos`],
];

const euroCurrencyOptions = {
  name: 'Euro',
  plural: 'Euros',
  symbol: '€',
  fractionalUnit: {
    name: 'Centimo',
    plural: 'Centimos',
    symbol: 'cts',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithEuroCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: euroCurrencyOptions })).toBe(expected);
  });
});

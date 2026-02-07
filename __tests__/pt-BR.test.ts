import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import ptBr from '../src/locales/pt-BR.js';
import { ToWords as LocaleToWords } from '../src/locales/pt-BR.js';

const localeCode = 'pt-BR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(ptBr);
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
  [0.999, `Um Real`],
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

const testOrdinals: [number, string][] = [
  // Numbers 1-20
  [1, 'Primeiro'],
  [2, 'Segundo'],
  [3, 'Terceiro'],
  [4, 'Quarto'],
  [5, 'Quinto'],
  [6, 'Sexto'],
  [7, 'Sétimo'],
  [8, 'Oitavo'],
  [9, 'Nono'],
  [10, 'Décimo'],
  [11, 'Décimo Primeiro'],
  [12, 'Décimo Segundo'],
  [13, 'Décimo Terceiro'],
  [14, 'Décimo Quarto'],
  [15, 'Décimo Quinto'],
  [16, 'Décimo Sexto'],
  [17, 'Décimo Sétimo'],
  [18, 'Décimo Oitavo'],
  [19, 'Décimo Nono'],
  [20, 'Vigésimo'],
  // Composite numbers (21, 22, 30, 40, 50, 60, 70, 80, 90)
  [21, 'Vinte E Primeiro'],
  [22, 'Vinte E Segundo'],
  [30, 'Trigésimo'],
  [40, 'Quadragésimo'],
  [50, 'Quinquagésimo'],
  [60, 'Sexagésimo'],
  [70, 'Septuagésimo'],
  [80, 'Octogésimo'],
  [90, 'Nonagésimo'],
  // Round numbers (100, 200, 1000, 1000000)
  [100, 'Centésimo'],
  [200, 'Ducentésimo'],
  [1000, 'Milésimo'],
  [1000000, 'Milionésimo'],
  // Complex numbers (101, 123, 1234)
  [101, 'Cento E Primeiro'],
  [123, 'Cento E Vinte E Terceiro'],
  [1234, 'Mil Duzentos E Trinta E Quarto'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative decimal numbers', () => {
    expect(() => toWords.toOrdinal(-2.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// Powers of Ten (International System - Brazilian Portuguese)
const testPowersOfTen: [number, string][] = [
  [10, 'Dez'],
  [100, 'Cem'],
  [1000, 'Mil'],
  [10000, 'Dez Mil'],
  [100000, 'Cem Mil'],
  [1000000, 'Um Milhão'],
  [10000000, 'Dez Milhões'],
  [100000000, 'Cem Milhões'],
  [1000000000, 'Um Bilhão'],
  [10000000000, 'Dez Bilhões'],
  [100000000000, 'Cem Bilhões'],
  [1000000000000, 'Um Trilhão'],
];

describe('Test Powers of Ten (International System)', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values
const testBoundaries: [number, string][] = [
  [99, 'Noventa E Nove'],
  [100, 'Cem'],
  [101, 'Cento E Um'],
  [999, 'Novecentos E Noventa E Nove'],
  [1000, 'Mil'],
  [1001, 'Mil Um'],
  [9999, 'Nove Mil Novecentos E Noventa E Nove'],
  [10000, 'Dez Mil'],
  [10001, 'Dez Mil Um'],
  [99999, 'Noventa E Nove Mil Novecentos E Noventa E Nove'],
  [100000, 'Cem Mil'],
  [999999, 'Novecentos E Noventa E Nove Mil Novecentos E Noventa E Nove'],
  [1000000, 'Um Milhão'],
  [1000001, 'Um Milhões Um'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaries)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Menos Zero Vírgula Cinco'],
  [-0.25, 'Menos Zero Vírgula Vinte E Cinco'],
  [-0.99, 'Menos Zero Vírgula Noventa E Nove'],
  [-1.5, 'Menos Um Vírgula Cinco'],
  [-3.14, 'Menos Três Vírgula Quatorze'],
  [-99.99, 'Menos Noventa E Nove Vírgula Noventa E Nove'],
  [-100.01, 'Menos Cem Vírgula Zero Um'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Menos Zero Reais E Cinquenta Centavos'],
  [-0.99, 'Menos Zero Reais E Noventa E Nove Centavos'],
  [-1.5, 'Menos Um Real E Cinquenta Centavos'],
  [-1.01, 'Menos Um Real E Um Centavo'],
  [-100.5, 'Menos Cem Reais E Cinquenta Centavos'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'Um'],
  [100n, 'Cem'],
  [1000n, 'Mil'],
  [1000000n, 'Um Milhão'],
  [1000000000n, 'Um Bilhão'],
  [1000000000000n, 'Um Trilhão'],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Menos Um'],
  [-100n, 'Menos Cem'],
  [-1000n, 'Menos Mil'],
  [-1000000n, 'Menos Um Milhão'],
  [-1000000000n, 'Menos Um Bilhão'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Zero Reais'],
  [1n, 'Um Real'],
  [2n, 'Dois Reais'],
  [100n, 'Cem Reais'],
  [1000n, 'Mil Reais'],
  [1000000n, 'Um Milhão Reais'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'Um'],
  ['100', 'Cem'],
  ['1000', 'Mil'],
  ['-100', 'Menos Cem'],
  ['3.14', 'Três Vírgula Quatorze'],
  ['-3.14', 'Menos Três Vírgula Quatorze'],
  ['  100  ', 'Cem'],
  ['1000000', 'Um Milhão'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Zero');
  });

  test('converts -0 as Zero', () => {
    expect(toWords.convert(-0)).toBe('Zero');
  });

  test('converts 0.0 as Zero', () => {
    expect(toWords.convert(0.0)).toBe('Zero');
  });

  test('converts 0n as Zero', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('converts "0" as Zero', () => {
    expect(toWords.convert('0')).toBe('Zero');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Reais');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Singular/Plural Tests
describe('Test Currency Singular/Plural', () => {
  test('1 Real (singular)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Um Real');
  });

  test('2 Reais (plural)', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Dois Reais');
  });

  test('0.01 Centavo (singular)', () => {
    expect(toWords.convert(0.01, { currency: true })).toBe('Zero Reais E Um Centavo');
  });

  test('0.02 Centavos (plural)', () => {
    expect(toWords.convert(0.02, { currency: true })).toBe('Zero Reais E Dois Centavos');
  });

  test('1.01 (singular + singular)', () => {
    expect(toWords.convert(1.01, { currency: true })).toBe('Um Real E Um Centavo');
  });

  test('2.02 (plural + plural)', () => {
    expect(toWords.convert(2.02, { currency: true })).toBe('Dois Reais E Dois Centavos');
  });
});

// All Currency Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Cem Reais E Cinquenta Centavos');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('Cem Reais E Cinquenta Centavos');
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('Cem Reais');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe('Cem Reais');
  });

  test('currency + ignoreZeroCurrency (with non-zero value)', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreZeroCurrency: true })).toBe(
      'Cem Reais E Cinquenta Centavos',
    );
  });

  test('currency + ignoreZeroCurrency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true })).toBe(
      'Cem Reais',
    );
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs for pt-BR', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('throws for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('throws for invalid string', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
  });
});

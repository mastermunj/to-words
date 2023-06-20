import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import eeEe from '../src/locales/ee-EE';

const localeCode = 'ee-EE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(eeEe);
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
  [0, 'Null'],
  [100, 'Ükssada'],
  [137, 'Sada Kolmkümmend Seitse'],
  [700, 'Seitsesada'],
  [1100, 'Üks Tuhat Ükssada'],
  [4680, 'Neli Tuhat Kuussada Kaheksakümmend'],
  [63892, 'Kuuskümmend Kolm Tuhat Kaheksasada Üheksakümmend Kaks'],
  [792581, 'Seitsesada Üheksakümmend Kaks Tuhat Viissada Kaheksakümmend Üks'],
  [2741034, 'Kaks Miljonit Seitsesada Nelikümmend Üks Tuhat Kolmkümmend Neli'],
  [86429753, 'Kaheksakümmend Kuus Miljonit Nelisada Kakskümmend Üheksa Tuhat Seitsesada Viiskümmend Kolm'],
  [975310864, 'Üheksasada Seitsekümmend Viis Miljonit Kolmsada Kümme Tuhat Kaheksasada Kuuskümmend Neli'],
  [
    9999923128,
    'Üheksa Miljardit Üheksasada Üheksakümmend Üheksa Miljonit Üheksasada Kakskümmend Kolm Tuhat Sada Kakskümmend Kaheksa',
  ],
  [100000000000, 'Ükssada Miljardit'],
  [1000000000000, 'Üks Triljon'],
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
    row[1] = `Miinus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `Ainult ${row[1]} Eurot`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Eurot`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `Ainult ${row[1]} Eurot`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Ainult Miinus ${row[1]} Eurot`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `Ainult ${row[1]} Eurot`;
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
  [0.0, 'Null'],
  [0.04, 'Null Koma Null Neli'],
  [0.0468, 'Null Koma Null Neli Kuus Kaheksa'],
  [0.4, 'Null Koma Neli'],
  [0.63, 'Null Koma Kuuskümmend Kolm'],
  [0.973, 'Null Koma Üheksasada Seitsekümmend Kolm'],
  [0.999, 'Null Koma Üheksasada Üheksakümmend Üheksa'],
  [37.06, 'Kolmkümmend Seitse Koma Null Kuus'],
  [37.068, 'Kolmkümmend Seitse Koma Null Kuus Kaheksa'],
  [37.0684, 'Kolmkümmend Seitse Koma Null Kuus Kaheksa Neli'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Ainult Null Eurot`],
  [0.04, `Ainult Null Eurot Ja Neli Senti`],
  [0.0468, `Ainult Null Eurot Ja Viis Senti`],
  [0.4, `Ainult Null Eurot Ja Nelikümmend Senti`],
  [0.63, `Ainult Null Eurot Ja Kuuskümmend Kolm Senti`],
  [0.973, `Ainult Null Eurot Ja Üheksakümmend Seitse Senti`],
  [0.999, `Ainult Üks Eurot`],
  [37.06, `Ainult Kolmkümmend Seitse Eurot Ja Kuus Senti`],
  [37.068, `Ainult Kolmkümmend Seitse Eurot Ja Seitse Senti`],
  [37.0684, `Ainult Kolmkümmend Seitse Eurot Ja Seitse Senti`],
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
      row[1] = (row[1] as string).replace(`Null Eurot Ja `, '');
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
    if (row[0] === 0.999 || row[0] === 0.63 || row[0] === 0.4 || row[0] === 0.973) {
      row[1] = `Ainult Null Eurot`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Ja [\\w ]+ Senti`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Ja [\\w ]+ Senti`), '');
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
  [0.0, `Ainult Null Dollarit`],
  [0.04, `Ainult Null Dollarit Ja Neli Senti`],
  [0.0468, `Ainult Null Dollarit Ja Viis Senti`],
  [0.4, `Ainult Null Dollarit Ja Nelikümmend Senti`],
  [0.63, `Ainult Null Dollarit Ja Kuuskümmend Kolm Senti`],
  [0.973, `Ainult Null Dollarit Ja Üheksakümmend Seitse Senti`],
  [0.999, `Ainult Üks Dollarit`],
  [37.06, `Ainult Kolmkümmend Seitse Dollarit Ja Kuus Senti`],
  [37.068, `Ainult Kolmkümmend Seitse Dollarit Ja Seitse Senti`],
  [37.0684, `Ainult Kolmkümmend Seitse Dollarit Ja Seitse Senti`],
];

const dollarCurrencyOption = {
  name: 'Dollar',
  plural: 'Dollarit',
  symbol: '$',
  fractionalUnit: {
    name: 'Sent',
    plural: 'Senti',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithDollarCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: dollarCurrencyOption })).toBe(expected);
  });
});

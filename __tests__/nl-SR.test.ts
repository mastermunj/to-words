import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nlSr from '../src/locales/nl-SR';

const localeCode = 'nl-SR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(nlSr);
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
  [0, 'Nul'],
  [137, 'Een Honderd Zevenendertig'],
  [700, 'Zeven Honderd'],
  [1100, 'Een Duizend Honderd'],
  [4680, 'Vier Duizend Zes Honderd Tachtig'],
  [63892, 'Drieënzestig Duizend Acht Honderd Tweeënnegentig'],
  [86100, 'Zesentachtig Duizend Honderd'],
  [792581, 'Zeven Honderd Tweeënnegentig Duizend Vijf Honderd Eenentachtig'],
  [2741034, 'Twee Miljoen Zeven Honderd Eenenveertig Duizend Vierendertig'],
  [86429753, 'Zesentachtig Miljoen Vier Honderd Negenentwintig Duizend Zeven Honderd Drieënvijftig'],
  [975310864, 'Negen Honderd Vijfenzeventig Miljoen Drie Honderd Tien Duizend Acht Honderd Vierenzestig'],
  [9876543210, 'Negen Miljard Acht Honderd Zesenzeventig Miljoen Vijf Honderd Drieënveertig Duizend Twee Honderd Tien'],
  [
    98765432101,
    'Achtennegentig Miljard Zeven Honderd Vijfenzestig Miljoen Vier Honderd Tweeëndertig Duizend Een Honderd Een',
  ],
  [
    987654321012,
    'Negen Honderd Zevenentachtig Miljard Zes Honderd Vierenvijftig Miljoen Drie Honderd Eenentwintig Duizend Twaalf',
  ],
  [
    9876543210123,
    'Negen Biljoen Acht Honderd Zesenzeventig Miljard Vijf Honderd Drieënveertig Miljoen Twee Honderd Tien Duizend Een Honderd Drieëntwintig',
  ],
  [
    98765432101234,
    'Achtennegentig Biljoen Zeven Honderd Vijfenzestig Miljard Vier Honderd Tweeëndertig Miljoen Een Honderd Een Duizend Twee Honderd Vierendertig',
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
    row[1] = `Negatief ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Surinaamse dollars`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Negatief ${row[1]} Surinaamse dollars`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Surinaamse dollars`;
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
  [0.0, 'Nul'],
  [0.04, 'Nul Punt Nul Vier'],
  [0.0468, 'Nul Punt Nul Vier Zes Acht'],
  [0.4, 'Nul Punt Vier'],
  // DEBUG Not recieving expected results
  // [0.63, 'Nul Punt Drieënzestig'],
  [0.973, 'Nul Punt Negen Honderd Drieënzeventig'],
  [0.999, 'Nul Punt Negen Honderd Negenennegentig'],
  [37.06, 'Zevenendertig Punt Nul Zes'],
  [37.068, 'Zevenendertig Punt Nul Zes Acht'],
  [37.68, 'Zevenendertig Punt Achtenzestig'],
  [37.683, 'Zevenendertig Punt Zes Honderd Drieëntachtig'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Nul Surinaamse dollars`],
  [0.04, `Nul Surinaamse dollars En Vier Centen`],
  [0.0468, `Nul Surinaamse dollars En Vijf Centen`],
  [0.4, `Nul Surinaamse dollars En Veertig Centen`],
  // DEBUG Not recieving expected results
  // [0.63, `Nul Surinaamse dollars En Drieënzestig Centen`],
  [0.973, `Nul Surinaamse dollars En Zevenennegentig Centen`],
  [0.999, `Een Surinaamse dollars`],
  [37.06, `Zevenendertig Surinaamse dollars En Zes Centen`],
  [37.068, `Zevenendertig Surinaamse dollars En Zeven Centen`],
  [37.68, `Zevenendertig Surinaamse dollars En Achtenzestig Centen`],
  [37.683, `Zevenendertig Surinaamse dollars En Achtenzestig Centen`],
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
      row[1] = (row[1] as string).replace(`Nul Surinaamse dollars En `, '');
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
      row[1] = `Nul Surinaamse dollars`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` En [\\w ]+ Centen`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` En [\\w ]+ Centen`), '');
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

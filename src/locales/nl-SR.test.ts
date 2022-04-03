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
  [0, 'NUL'],
  [137, 'EEN HONDERD ZEVENENDERTIG'],
  [700, 'ZEVEN HONDERD'],
  [1100, 'EEN DUIZEND HONDERD'],
  [4680, 'VIER DUIZEND ZES HONDERD TACHTIG'],
  [63892, 'DRIEËNZESTIG DUIZEND ACHT HONDERD TWEEËNNEGENTIG'],
  [86100, 'ZESENTACHTIG DUIZEND HONDERD'],
  [792581, 'ZEVEN HONDERD TWEEËNNEGENTIG DUIZEND VIJF HONDERD EENENTACHTIG'],
  [2741034, 'TWEE MILJOEN ZEVEN HONDERD EENENVEERTIG DUIZEND VIERENDERTIG'],
  [86429753, 'ZESENTACHTIG MILJOEN VIER HONDERD NEGENENTWINTIG DUIZEND ZEVEN HONDERD DRIEËNVIJFTIG'],
  [975310864, 'NEGEN HONDERD VIJFENZEVENTIG MILJOEN DRIE HONDERD TIEN DUIZEND ACHT HONDERD VIERENZESTIG'],
  [9876543210, 'NEGEN MILJARD ACHT HONDERD ZESENZEVENTIG MILJOEN VIJF HONDERD DRIEËNVEERTIG DUIZEND TWEE HONDERD TIEN'],
  [
    98765432101,
    'ACHTENNEGENTIG MILJARD ZEVEN HONDERD VIJFENZESTIG MILJOEN VIER HONDERD TWEEËNDERTIG DUIZEND EEN HONDERD EEN',
  ],
  [
    987654321012,
    'NEGEN HONDERD ZEVENENTACHTIG MILJARD ZES HONDERD VIERENVIJFTIG MILJOEN DRIE HONDERD EENENTWINTIG DUIZEND TWAALF',
  ],
  [
    9876543210123,
    'NEGEN BILJOEN ACHT HONDERD ZESENZEVENTIG MILJARD VIJF HONDERD DRIEËNVEERTIG MILJOEN TWEE HONDERD TIEN DUIZEND EEN HONDERD DRIEËNTWINTIG',
  ],
  [
    98765432101234,
    'ACHTENNEGENTIG BILJOEN ZEVEN HONDERD VIJFENZESTIG MILJARD VIER HONDERD TWEEËNDERTIG MILJOEN EEN HONDERD EEN DUIZEND TWEE HONDERD VIERENDERTIG',
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
    row[1] = `NEGATIEF ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} SURINAAMSE DOLLARS`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} SURINAAMSE DOLLARS`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} SURINAAMSE DOLLARS`;
      return;
    }
    row[0] = -row[0];
    row[1] = `NEGATIEF ${row[1]} SURINAAMSE DOLLARS`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} SURINAAMSE DOLLARS`;
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
  [0.0, 'NUL'],
  [0.04, 'NUL PUNT NUL VIER'],
  [0.0468, 'NUL PUNT NUL VIER ZES ACHT'],
  [0.4, 'NUL PUNT VIER'],
  // [0.63, 'NUL PUNT DRIEËNZESTIG'],
  [0.973, 'NUL PUNT NEGEN HONDERD DRIEËNZEVENTIG'],
  [0.999, 'NUL PUNT NEGEN HONDERD NEGENENNEGENTIG'],
  [37.06, 'ZEVENENDERTIG PUNT NUL ZES'],
  [37.068, 'ZEVENENDERTIG PUNT NUL ZES ACHT'],
  [37.68, 'ZEVENENDERTIG PUNT ACHTENZESTIG'],
  [37.683, 'ZEVENENDERTIG PUNT ZES HONDERD DRIEËNTACHTIG'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.0, `NUL SURINAAMSE DOLLARS`],
  [0.04, `NUL SURINAAMSE DOLLARS EN VIER CENTEN`],
  [0.0468, `NUL SURINAAMSE DOLLARS EN VIJF CENTEN`],
  [0.4, `NUL SURINAAMSE DOLLARS EN VEERTIG CENTEN`],
  // [0.63, `NUL SURINAAMSE DOLLARS EN DRIEËNZESTIG CENTEN`],
  [0.973, `NUL SURINAAMSE DOLLARS EN ZEVENENNEGENTIG CENTEN`],
  [0.999, `EEN SURINAAMSE DOLLARS`],
  [37.06, `ZEVENENDERTIG SURINAAMSE DOLLARS EN ZES CENTEN`],
  [37.068, `ZEVENENDERTIG SURINAAMSE DOLLARS EN ZEVEN CENTEN`],
  [37.68, `ZEVENENDERTIG SURINAAMSE DOLLARS EN ACHTENZESTIG CENTEN`],
  [37.683, `ZEVENENDERTIG SURINAAMSE DOLLARS EN ACHTENZESTIG CENTEN`],
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
      row[1] = (row[1] as string).replace(`NUL SURINAAMSE DOLLARS EN `, '');
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
      row[1] = `NUL SURINAAMSE DOLLARS`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` EN [\\w ]+ CENTEN`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` EN [\\w ]+ CENTEN`), '');
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

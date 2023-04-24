import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import frFr from '../src/locales/fr-FR';

const localeCode = 'fr-FR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(frFr);
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
  [0, 'Zéro'],
  [137, 'Cent Trente-Sept'],
  [700, 'Sept Cent'],
  [4680, 'Quatre Mille Six Cent Quatre-Vingt'],
  [63892, 'Soixante-Trois Mille Huit Cent Quatre-Vingt-Douze'],
  [792581, 'Sept Cent Quatre-Vingt-Douze Mille Cinq Cent Quatre-Vingt-Un'],
  [1342823, 'Un Million Trois Cent Quarante-Deux Mille Huit Cent Vingt-Trois'],
  [2741034, 'Deux Millions Sept Cent Quarante Et Un Mille Trente-Quatre'],
  [86429753, 'Quatre-Vingt-Six Millions Quatre Cent Vingt-Neuf Mille Sept Cent Cinquante-Trois'],
  [975310864, 'Neuf Cent Soixante-Quinze Millions Trois Cent Dix Mille Huit Cent Soixante-Quatre'],
  [9876543210, 'Neuf Milliards Huit Cent Soixante-Seize Millions Cinq Cent Quarante-Trois Mille Deux Cent Dix'],
  [
    98765432101,
    'Quatre-Vingt-Dix-Huit Milliards Sept Cent Soixante-Cinq Millions Quatre Cent Trente-Deux Mille Cent Un',
  ],
  [
    987654321012,
    'Neuf Cent Quatre-Vingt-Sept Milliards Six Cent Cinquante-Quatre Millions Trois Cent Vingt Et Un Mille Douze',
  ],
  [
    9876543210123,
    'Neuf Billions Huit Cent Soixante-Seize Milliards Cinq Cent Quarante-Trois Millions Deux Cent Dix Mille Cent Vingt-Trois',
  ],
  [
    98765432101234,
    'Quatre-Vingt-Dix-Huit Billions Sept Cent Soixante-Cinq Milliards Quatre Cent Trente-Deux Millions Cent Un Mille Deux Cent Trente-Quatre',
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
    row[1] = `Moins ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euros`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euros`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Euros`;
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
  [0.0, 'Zéro'],
  [0.04, 'Zéro Virgule Zéro Quatre'],
  [0.0468, 'Zéro Virgule Zéro Quatre Six Huit'],
  [0.4, 'Zéro Virgule Quatre'],
  [0.63, 'Zéro Virgule Soixante-Trois'],
  [0.973, 'Zéro Virgule Neuf Cent Soixante-Treize'],
  [0.999, 'Zéro Virgule Neuf Cent Quatre-Vingt-Dix-Neuf'],
  [37.06, 'Trente-Sept Virgule Zéro Six'],
  [37.068, 'Trente-Sept Virgule Zéro Six Huit'],
  [37.68, 'Trente-Sept Virgule Soixante-Huit'],
  [37.683, 'Trente-Sept Virgule Six Cent Quatre-Vingt-Trois'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zéro Euros`],
  [0.04, `Zéro Euros Et Quatre Centimes`],
  [0.0468, `Zéro Euros Et Cinq Centimes`],
  [0.4, `Zéro Euros Et Quarante Centimes`],
  [0.63, `Zéro Euros Et Soixante-Trois Centimes`],
  [0.973, `Zéro Euros Et Quatre-Vingt-Dix-Sept Centimes`],
  [0.999, `Un Euros`],
  [37.06, `Trente-Sept Euros Et Six Centimes`],
  [37.068, `Trente-Sept Euros Et Sept Centimes`],
  [37.68, `Trente-Sept Euros Et Soixante-Huit Centimes`],
  [37.683, `Trente-Sept Euros Et Soixante-Huit Centimes`],
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
      row[1] = (row[1] as string).replace(`Zéro Euros Et `, '');
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
      row[1] = `Zéro Euros`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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

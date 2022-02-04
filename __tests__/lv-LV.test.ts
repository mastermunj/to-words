import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import lvLV from '../src/locales/lv-LV';

const localeCode = 'lv-LV';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(lvLV);
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
    row[1] = `${row[1]} euro`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} euro`;
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
  // [0.04, 'Zéro Virgule Zéro Quatre'],
  // [0.0468, 'Zéro Virgule Zéro Quatre Six Huit'],
  // [0.4, 'Zéro Virgule Quatre'],
  // [0.63, 'Zéro Virgule Soixante-Trois'],
  // [0.973, 'Zéro Virgule Neuf Cent Soixante-Treize'],
  // [0.999, 'Zéro Virgule Neuf Cent Quatre-Vingt-Dix-Neuf'],
  // [37.06, 'Trente-Sept Virgule Zéro Six'],
  // [37.068, 'Trente-Sept Virgule Zéro Six Huit'],
  // [37.68, 'Trente-Sept Virgule Soixante-Huit'],
  // [37.683, 'Trente-Sept Virgule Six Cent Quatre-Vingt-Trois'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.0, `nulle euro`],
  // [0.04, `nulle euro un četri centi`],
  // [0.0468, `Zéro Euros Et Cinq Centimes`],
  // [0.4, `nulle euro un četrdesmit centi`],
  // [0.63, `Zéro Euros Et Soixante-Trois Centimes`],
  // [0.973, `Zéro Euros Et Quatre-Vingt-Dix-Sept Centimes`],
  // [0.999, `Un Euros`],
  // [37.06, `Trente-Sept Euros Et Six Centimes`],
  // [37.068, `Trente-Sept Euros Et Sept Centimes`],
  // [37.68, `Trente-Sept Euros Et Soixante-Huit Centimes`],
  // [37.683, `Trente-Sept Euros Et Soixante-Huit Centimes`],
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
      row[1] = `nulle euro`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` un [\\w\\- ]+ centi`), '');
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

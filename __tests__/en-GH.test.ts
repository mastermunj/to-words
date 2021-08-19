import { ToWords } from '../src/to-words';
import cloneDeep from 'lodash/cloneDeep';

const toWords = new ToWords({
  localeCode: 'en-GH',
});

const testIntegers = [
  [0, 'Zero'],
  [137, 'One Hundred Thirty Seven'],
  [700, 'Seven Hundred'],
  [4680, 'Four Thousand Six Hundred Eighty'],
  [63892, 'Sixty Three Thousand Eight Hundred Ninety Two'],
  [792581, 'Seven Hundred Ninety Two Thousand Five Hundred Eighty One'],
  [2741034, 'Two Million Seven Hundred Forty One Thousand Thirty Four'],
  [86429753, 'Eighty Six Million Four Hundred Twenty Nine Thousand Seven Hundred Fifty Three'],
  [975310864, 'Nine Hundred Seventy Five Million Three Hundred Ten Thousand Eight Hundred Sixty Four'],
  [9876543210, 'Nine Billion Eight Hundred Seventy Six Million Five Hundred Forty Three Thousand Two Hundred Ten'],
  [
    98765432101,
    'Ninety Eight Billion Seven Hundred Sixty Five Million Four Hundred Thirty Two Thousand One Hundred One',
  ],
  [
    987654321012,
    'Nine Hundred Eighty Seven Billion Six Hundred Fifty Four Million Three Hundred Twenty One Thousand Twelve',
  ],
  [
    9876543210123,
    'Nine Trillion Eight Hundred Seventy Six Billion Five Hundred Forty Three Million Two Hundred Ten Thousand One Hundred Twenty Three',
  ],
  [
    98765432101234,
    'Ninety Eight Trillion Seven Hundred Sixty Five Billion Four Hundred Thirty Two Million One Hundred One Thousand Two Hundred Thirty Four',
  ],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testNegativeIntegers = cloneDeep(testIntegers);
testNegativeIntegers.map((row, i) => {
  if (i === 0) {
    return;
  }
  row[0] = -row[0];
  row[1] = `Minus ${row[1]}`;
});

describe('Test Negative Integers with options = {}', () => {
  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testIntegersWithCurrency = cloneDeep(testIntegers);
testIntegersWithCurrency.map((row) => {
  row[1] = `${row[1]} Cedis Only`;
});

describe('Test Integers with options = { currency: true }', () => {
  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersWithCurrency);
testIntegersWithCurrencyAndIgnoreZeroCurrency[0][1] = '';

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
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
  [0.0, 'Zero'],
  [0.04, 'Zero Point Zero Four'],
  [0.0468, 'Zero Point Zero Four Six Eight'],
  [0.4, 'Zero Point Four'],
  [0.63, 'Zero Point Sixty Three'],
  [0.973, 'Zero Point Nine Hundred Seventy Three'],
  [0.999, 'Zero Point Nine Hundred Ninety Nine'],
  [37.06, 'Thirty Seven Point Zero Six'],
  [37.068, 'Thirty Seven Point Zero Six Eight'],
  [37.68, 'Thirty Seven Point Sixty Eight'],
  [37.683, 'Thirty Seven Point Six Hundred Eighty Three'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.0, `Zero Cedis Only`],
  [0.04, `Zero Cedis And Four Pasewas Only`],
  [0.0468, `Zero Cedis And Five Pasewas Only`],
  [0.4, `Zero Cedis And Forty Pasewas Only`],
  [0.63, `Zero Cedis And Sixty Three Pasewas Only`],
  [0.973, `Zero Cedis And Ninety Seven Pasewas Only`],
  [0.999, `One Cedis Only`],
  [37.06, `Thirty Seven Cedis And Six Pasewas Only`],
  [37.068, `Thirty Seven Cedis And Seven Pasewas Only`],
  [37.68, `Thirty Seven Cedis And Sixty Eight Pasewas Only`],
  [37.683, `Thirty Seven Cedis And Sixty Eight Pasewas Only`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
  if (i === 0) {
    row[1] = '';
    return;
  }
  if (row[0] > 0 && row[0] < 1) {
    row[1] = (row[1] as string).replace(`Zero Cedis And `, '');
  }
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
  if (row[0] === 0.999) {
    row[1] = `Zero Cedis Only`;
  } else {
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Pasewas`), '');
  }
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
  if (row[0] > 0 && row[0] < 1) {
    row[1] = '';
  }
  row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Pasewas`), '');
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
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

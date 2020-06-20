import { ToWords } from '../src/to-words';
import cloneDeep from 'lodash/cloneDeep';

const toWords = new ToWords({
  localeCode: 'en-MU',
});

const testIntegers = [
  [0, 'Zero'],
  [137, 'One Hundred Thirty Seven'],
  [700, 'Seven Hundred'],
  [4680, 'Four Thousand Six Hundred Eighty'],
  [63892, 'Sixty Three Thousand Eight Hundred Ninety Two'],
  [792581, 'Seven Lakh Ninety Two Thousand Five Hundred Eighty One'],
  [2741034, 'Twenty Seven Lakh Forty One Thousand Thirty Four'],
  [
    86429753,
    'Eight Crore Sixty Four Lakh Twenty Nine Thousand Seven Hundred Fifty Three',
  ],
  [
    975310864,
    'Ninety Seven Crore Fifty Three Lakh Ten Thousand Eight Hundred Sixty Four',
  ],
  [
    9876543210,
    'Nine Hundred Eighty Seven Crore Sixty Five Lakh Forty Three Thousand Two Hundred Ten',
  ],
  [
    98765432101,
    'Nine Thousand Eight Hundred Seventy Six Crore Fifty Four Lakh Thirty Two Thousand One Hundred One',
  ],
  [
    987654321012,
    'Ninety Eight Thousand Seven Hundred Sixty Five Crore Forty Three Lakh Twenty One Thousand Twelve',
  ],
  [
    9876543210123,
    'Nine Lakh Eighty Seven Thousand Six Hundred Fifty Four Crore Thirty Two Lakh Ten Thousand One Hundred Twenty Three',
  ],
  [
    98765432101234,
    'Ninety Eight Lakh Seventy Six Thousand Five Hundred Forty Three Crore Twenty One Lakh One Thousand Two Hundred Thirty Four',
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
  row[1] = `${row[1]} Rupees Only`;
});

describe('Test Integers with options = { currency: true }', () => {
  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(
  testIntegersWithCurrency,
);
testIntegersWithCurrencyAndIgnoreZeroCurrency[0][1] = '';

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
        }),
      ).toBe(expected);
    },
  );
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
  [0.0, `Zero Rupees Only`],
  [0.04, `Zero Rupees And Four Cents Only`],
  [0.0468, `Zero Rupees And Five Cents Only`],
  [0.4, `Zero Rupees And Forty Cents Only`],
  [0.63, `Zero Rupees And Sixty Three Cents Only`],
  [0.973, `Zero Rupees And Ninety Seven Cents Only`],
  [0.999, `One Rupees Only`],
  [37.06, `Thirty Seven Rupees And Six Cents Only`],
  [37.068, `Thirty Seven Rupees And Seven Cents Only`],
  [37.68, `Thirty Seven Rupees And Sixty Eight Cents Only`],
  [37.683, `Thirty Seven Rupees And Sixty Eight Cents Only`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(
  testFloatsWithCurrency,
);
testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
  if (i === 0) {
    row[1] = '';
    return;
  }
  if (row[0] > 0 && row[0] < 1) {
    row[1] = (row[1] as string).replace(`Zero Rupees And `, '');
  }
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreZeroCurrency: true,
        }),
      ).toBe(expected);
    },
  );
});

const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(
  testFloatsWithCurrency,
);
testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
  if (row[0] === 0.999) {
    row[1] = `Zero Rupees Only`;
  } else {
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
  }
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  test.each(testFloatsWithCurrencyAndIgnoreDecimal)(
    'convert %d => %s',
    (input, expected) => {
      expect(
        toWords.convert(input as number, {
          currency: true,
          ignoreDecimal: true,
        }),
      ).toBe(expected);
    },
  );
});

const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(
  testFloatsWithCurrency,
);
testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
  if (row[0] > 0 && row[0] < 1) {
    row[1] = '';
  }
  row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)(
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

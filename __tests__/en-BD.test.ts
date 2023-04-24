import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import enBd from '../src/locales/en-BD';

const localeCode = 'en-BD';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(enBd);
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
  [137, 'One Hundred Thirty Seven'],
  [700, 'Seven Hundred'],
  [1100, 'One Thousand One Hundred'],
  [4680, 'Four Thousand Six Hundred Eighty'],
  [63892, 'Sixty Three Thousand Eight Hundred Ninety Two'],
  [86100, 'Eighty Six Thousand One Hundred'],
  [792581, 'Seven Lakh Ninety Two Thousand Five Hundred Eighty One'],
  [2741034, 'Twenty Seven Lakh Forty One Thousand Thirty Four'],
  [86429753, 'Eight Crore Sixty Four Lakh Twenty Nine Thousand Seven Hundred Fifty Three'],
  [975310864, 'Ninety Seven Crore Fifty Three Lakh Ten Thousand Eight Hundred Sixty Four'],
  [9876543210, 'Nine Hundred Eighty Seven Crore Sixty Five Lakh Forty Three Thousand Two Hundred Ten'],
  [98765432101, 'Nine Thousand Eight Hundred Seventy Six Crore Fifty Four Lakh Thirty Two Thousand One Hundred One'],
  [987654321012, 'Ninety Eight Thousand Seven Hundred Sixty Five Crore Forty Three Lakh Twenty One Thousand Twelve'],
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Taka Only`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Taka`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Taka Only`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Taka Only`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Taka Only`;
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
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Taka Only`],
  [0.04, `Zero Taka And Four Poysha Only`],
  [0.0468, `Zero Taka And Five Poysha Only`],
  [0.4, `Zero Taka And Forty Poysha Only`],
  [0.63, `Zero Taka And Sixty Three Poysha Only`],
  [0.973, `Zero Taka And Ninety Seven Poysha Only`],
  [0.999, `One Taka Only`],
  [37.06, `Thirty Seven Taka And Six Poysha Only`],
  [37.068, `Thirty Seven Taka And Seven Poysha Only`],
  [37.68, `Thirty Seven Taka And Sixty Eight Poysha Only`],
  [37.683, `Thirty Seven Taka And Sixty Eight Poysha Only`],
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
      row[1] = (row[1] as string).replace(`Zero Taka And `, '');
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
      row[1] = `Zero Taka Only`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Poysha`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Poysha`), '');
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

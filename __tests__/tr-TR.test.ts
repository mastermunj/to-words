import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import trTr from '../src/locales/tr-TR';

const localeCode = 'tr-TR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(trTr);
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
  [0, 'sıfır'],
  [137, 'yüz otuz yedi'],
  [700, 'yedi yüz'],
  [4680, 'dört bin altı yüz seksen'],
  [63892, 'altmış üç bin sekiz yüz doksan iki'],
  [792581, 'yedi yüz doksan iki bin beş yüz seksen bir'],
  [2741034, 'iki milyon yedi yüz kırk bir bin otuz dört'],
  [86429753, 'seksen altı milyon dört yüz yirmi dokuz bin yedi yüz elli üç'],
  [975310864, 'dokuz yüz yetmiş beş milyon üç yüz on bin sekiz yüz altmış dört'],
  [9876543210, 'dokuz milyar sekiz yüz yetmiş altı milyon beş yüz kırk üç bin iki yüz on'],
  [98765432101, 'doksan sekiz milyar yedi yüz altmış beş milyon dört yüz otuz iki bin yüz bir'],
  [987654321012, 'dokuz yüz seksen yedi milyar altı yüz elli dört milyon üç yüz yirmi bir bin on iki'],
  [9876543210123, 'dokuz trilyon sekiz yüz yetmiş altı milyar beş yüz kırk üç milyon iki yüz on bin yüz yirmi üç'],
  [
    98765432101234,
    'doksan sekiz trilyon yedi yüz altmış beş milyar dört yüz otuz iki milyon yüz bir bin iki yüz otuz dört',
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
    row[1] = `eksi ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} lira`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} lira`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} lira`;
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
  [0.0, 'sıfır'],
  [0.04, 'dört yüzüncü'],
  [0.0468, 'dört yüz altmış sekiz on bininci'],
  [0.4, 'dört onuncu'],
  [0.63, 'altmış üç yüzüncü'],
  [0.973, 'dokuz yüz yetmiş üç bininci'],
  [0.999, 'dokuz yüz doksan dokuz bininci'],
  [37.06, 'otuz yedi virgül altı yüzüncü'],
  [37.068, 'otuz yedi virgül altmış sekiz bininci'],
  [37.68, 'otuz yedi virgül altmış sekiz yüzüncü'],
  [37.683, 'otuz yedi virgül altı yüz seksen üç bininci'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'sıfır lira'],
  [0.04, 'dört yüzüncü lira'],
  [0.0468, 'beş yüzüncü lira'],
  [0.4, 'dört onuncu lira'],
  [0.63, 'altmış üç yüzüncü lira'],
  [0.973, 'doksan yedi yüzüncü lira'],
  [0.999, 'bir lira'],
  [37.06, 'otuz yedi virgül altı yüzüncü lira'],
  [37.068, 'otuz yedi virgül yedi yüzüncü lira'],
  [37.68, 'otuz yedi virgül altmış sekiz yüzüncü lira'],
  [37.683, 'otuz yedi virgül altmış sekiz yüzüncü lira'],
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
      row[1] = (row[1] as string).replace(`sıfır lira`, '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency).map((row) => {
    if (row[0] >= 0 && row[0] < 1) {
      return [row[0], 'sıfır lira'];
    }
    return [row[0], 'otuz yedi lira'];
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency).map((row) => {
    if (row[0] >= 0 && row[0] < 1) {
      return [row[0], ''];
    }
    return [row[0], 'otuz yedi lira'];
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

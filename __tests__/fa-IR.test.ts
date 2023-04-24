import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import faIr from '../src/locales/fa-IR';

const localeCode = 'fa-IR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(faIr);
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
  [0, 'صفر'],
  [137, 'صد و سی و هفت'],
  [700, 'هفتصد'],
  [4680, 'چهار هزار و ششصد و هشتاد'],
  [63892, 'شصت و سه هزار و هشتصد و نود و دو'],
  [792581, 'هفتصد و نود و دو هزار و پانصد و هشتاد و یک'],
  [2741034, 'دو میلیون و هفتصد و چهل و یک هزار و سی و چهار'],
  [86429753, 'هشتاد و شش میلیون و چهارصد و بیست و نه هزار و هفتصد و پنجاه و سه'],
  [975310864, 'نهصد و هفتاد و پنج میلیون و سیصد و ده هزار و هشتصد و شصت و چهار'],
  [9876543210, 'نه میلیارد و هشتصد و هفتاد و شش میلیون و پانصد و چهل و سه هزار و دویست و ده'],
  [98765432101, 'نود و هشت میلیارد و هفتصد و شصت و پنج میلیون و چهارصد و سی و دو هزار و صد و یک'],
  [987654321012, 'نهصد و هشتاد و هفت میلیارد و ششصد و پنجاه و چهار میلیون و سیصد و بیست و یک هزار و دوازده'],
  [
    9876543210123,
    'نه تیلیارد و هشتصد و هفتاد و شش میلیارد و پانصد و چهل و سه میلیون و دویست و ده هزار و صد و بیست و سه',
  ],
  [
    98765432101234,
    'نود و هشت تیلیارد و هفتصد و شصت و پنج میلیارد و چهارصد و سی و دو میلیون و صد و یک هزار و دویست و سی و چهار',
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
    row[1] = `منفی ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} تومان`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} تومان`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} تومان`;
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
  [0.0, 'صفر'],
  [0.04, 'چهار صدم'],
  [0.0468, 'چهارصد و شصت و هشت ده‌هزارم'],
  [0.4, 'چهار دهم'],
  [0.63, 'شصت و سه صدم'],
  [0.973, 'نهصد و هفتاد و سه هزارم'],
  [0.999, 'نهصد و نود و نه هزارم'],
  [37.06, 'سی و هفت و شش صدم'],
  [37.068, 'سی و هفت و شصت و هشت هزارم'],
  [37.68, 'سی و هفت و شصت و هشت صدم'],
  [37.683, 'سی و هفت و ششصد و هشتاد و سه هزارم'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'صفر تومان'],
  [0.04, 'چهار صدم تومان'],
  [0.0468, 'پنج صدم تومان'],
  [0.4, 'چهار دهم تومان'],
  [0.63, 'شصت و سه صدم تومان'],
  [0.973, 'نود و هفت صدم تومان'],
  [0.999, 'یک تومان'],
  [37.06, 'سی و هفت و شش صدم تومان'],
  [37.068, 'سی و هفت و هفت صدم تومان'],
  [37.68, 'سی و هفت و شصت و هشت صدم تومان'],
  [37.683, 'سی و هفت و شصت و هشت صدم تومان'],
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
      row[1] = (row[1] as string).replace(`صفر تومان`, '');
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
      return [row[0], 'صفر تومان'];
    }
    return [row[0], 'سی و هفت تومان'];
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
    return [row[0], 'سی و هفت تومان'];
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

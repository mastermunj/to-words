import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import koKr from '../src/locales/ko-KR';

const localeCode = 'ko-KR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(koKr);
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
  [0, '영'],
  [137, '일백삼십칠'],
  [700, '칠백'],
  [1100, '일천백'],
  [4680, '사천육백팔십'],
  [63892, '육만삼천팔백구십이'],
  [86100, '팔만육천백'],
  [792581, '칠십구만이천오백팔십일'],
  [2741034, '이백칠십사만일천삼십사'],
  [86429753, '팔천육백사십이만구천칠백오십삼'],
  [975310864, '구억칠천오백삼십일만팔백육십사'],
  [9876543210, '구십팔억칠천육백오십사만삼천이백십'],
  [98765432101, '구백팔십칠억육천오백사십삼만이천일백일'],
  [987654321012, '구천팔백칠십육억오천사백삼십이만일천십이'],
  [9876543210123, '구조팔천칠백육십오억사천삼백이십일만일백이십삼'],
  [98765432101234, '구십팔조칠천육백오십사억삼천이백십만일천이백삼십사'],
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
    row[1] = `마이너스${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}원`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]}원`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]}원`;
      return;
    }
    row[0] = -row[0];
    row[1] = `마이너스${row[1]}원`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]}원`;
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
  [0.0, '영'],
  [0.04, '영점영사'],
  [0.0468, '영점영사육팔'],
  [0.4, '영점사'],
  [0.63, '영점육십삼'],
  [0.973, '영점구백칠십삼'],
  [0.999, '영점구백구십구'],
  [37.06, '삼십칠점영육'],
  [37.068, '삼십칠점영육팔'],
  [37.68, '삼십칠점육십팔'],
  [37.683, '삼십칠점육백팔십삼'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, `영원`],
  [40, `사십원`],
  [468, `사백육십팔원`],
  [4, `사원`],
  [63, `육십삼원`],
  [973, `구백칠십삼원`],
  [1, `일원`],
  [37060, `삼만칠천육십원`],
  [37068, `삼만칠천육십팔원`],
  [37680, `삼만칠천육백팔십원`],
  [37683, `삼만칠천육백팔십삼원`],
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
      row[1] = (row[1] as string).replace(`Zero Dollars And `, '');
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
      row[1] = `영원`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` And [\\w ]+ Cents`), '');
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

const testFloatsWithEuroCurrency = [
  [0.0, `영유로`],
  [0.04, `영유로하고 사유로센트`],
  [0.0468, `영유로하고 오유로센트`],
  [0.4, `영유로하고 사십유로센트`],
  [0.63, `영유로하고 육십삼유로센트`],
  [0.973, `영유로하고 구십칠유로센트`],
  [0.999, `일유로`],
  [37.06, `삼십칠유로하고 육유로센트`],
  [37.068, `삼십칠유로하고 칠유로센트`],
  [37.68, `삼십칠유로하고 육십팔유로센트`],
  [37.683, `삼십칠유로하고 육십팔유로센트`],
  [537.683, `오백삼십칠유로하고 육십팔유로센트`],
];

const euroCurrencyOptions = {
  name: '유로',
  plural: '유로',
  symbol: '€',
  fractionalUnit: {
    name: '유로센트',
    plural: '유로센트',
    symbol: '¢',
  },
};

describe('Test Floats with options = { currency: true, currencyOptions }', () => {
  test.concurrent.each(testFloatsWithEuroCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, currencyOptions: euroCurrencyOptions })).toBe(expected);
  });
});

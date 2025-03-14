import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import urPk from '../src/locales/ur-PK';

const localeCode = 'ur-PK';
const toWords = new ToWords({ localeCode });

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(urPk);
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    const toWordsWrongLocale = new ToWords({ localeCode: wrongLocaleCode });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'صفر'],
  [137, 'ایک سو سینتیس'],
  [700, 'سات سو'],
  [1100, 'ایک ہزار ایک سو'],
  [4680, 'چار ہزار چھ سو اسی'],
  [63892, 'تریسٹھ ہزار آٹھ سو بانوے'],
  [86100, 'چھیاسی ہزار ایک سو'],
  [792581, 'سات لاکھ بانوے ہزار پانچ سو اکیاسی'],
  [2741034, 'ستائیس لاکھ اکتالیس ہزار چونتیس'],
  [86429753, 'آٹھ کروڑ چونسٹھ لاکھ انتیس ہزار سات سو ترپن'],
  [975310864, 'ستانوے کروڑ ترپن لاکھ دس ہزار آٹھ سو چونسٹھ'],
  [9876543210, 'نو سو ستاسی کروڑ پینسٹھ لاکھ تینتالیس ہزار دو سو دس'],
  [98765432101, 'نو ہزار آٹھ سو چھہتر کروڑ چون لاکھ بتیس ہزار ایک سو ایک'],
  [987654321012, 'اٹھانوے ہزار سات سو پینسٹھ کروڑ تینتالیس لاکھ اکیس ہزار بارہ'],
  [9876543210123, 'نو لاکھ ستاسی ہزار چھ سو چون کروڑ بتیس لاکھ دس ہزار ایک سو تئیس'],
  [98765432101234, 'اٹھانوے لاکھ چھہتر ہزار پانچ سو تینتالیس کروڑ اکیس لاکھ ایک ہزار دو سو چونتیس'],
];

describe('Test Integers with options = {}', () => {
  test.concurrent.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) return; // skip zero
    row[0] = -row[0];
    row[1] = `منفی ${row[1]}`;
  });
  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} روپے صرف`;
  });
  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} روپے`;
  });
  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} روپے صرف`;
    } else {
      row[0] = -row[0];
      row[1] = `منفی ${row[1]} روپے صرف`;
    }
  });
  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} روپے صرف`;
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
  [0.0, 'صفر'],
  [0.04, 'صفر اعشاریہ صفر چار'],
  [0.0468, 'صفر اعشاریہ صفر چار چھ آٹھ'],
  [0.4, 'صفر اعشاریہ چار'],
  [0.63, 'صفر اعشاریہ تریسٹھ'],
  [0.973, 'صفر اعشاریہ نو سو تہتر'],
  [0.999, 'صفر اعشاریہ نو سو نناوے'],
  [37.06, 'سینتیس اعشاریہ صفر چھ'],
  [37.068, 'سینتیس اعشاریہ صفر چھ آٹھ'],
  [37.68, 'سینتیس اعشاریہ اڑسٹھ'],
  [37.683, 'سینتیس اعشاریہ چھ سو تراسی'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'صفر روپے صرف'],
  [0.01, 'صفر روپے اور ایک پیسہ صرف'],
  [0.04, 'صفر روپے اور چار پیسے صرف'],
  [0.0468, 'صفر روپے اور پانچ پیسے صرف'],
  [0.4, 'صفر روپے اور چالیس پیسے صرف'],
  [0.63, 'صفر روپے اور تریسٹھ پیسے صرف'],
  [0.973, 'صفر روپے اور ستانوے پیسے صرف'],
  [0.999, 'ایک روپے صرف'],
  [37.06, 'سینتیس روپے اور چھ پیسے صرف'],
  [37.068, 'سینتیس روپے اور سات پیسے صرف'],
  [37.68, 'سینتیس روپے اور اڑسٹھ پیسے صرف'],
  [37.683, 'سینتیس روپے اور اڑسٹھ پیسے صرف'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = row[1].replace('صفر روپے اور ', '');
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
      row[1] = 'صفر روپے صرف';
    } else {
      row[1] = row[1].replace(/ اور [^]* پیسے/, '');
      row[1] = row[1].replace(/ اور [^]* پیسہ/, '');
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
    row[1] = row[1].replace(/ اور [^]* پیسے/, '');
    row[1] = row[1].replace(/ اور [^]* پیسہ/, '');
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

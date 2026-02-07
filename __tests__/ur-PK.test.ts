import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import urPk from '../src/locales/ur-PK.js';
import { ToWords as LocaleToWords } from '../src/locales/ur-PK.js';

const localeCode = 'ur-PK';
const toWords = new ToWords({ localeCode });

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(urPk);
  });

  describe('Test Locale ToWords', () => {
    test('ToWords from locale file works correctly', () => {
      const tw = new LocaleToWords();
      expect(tw.convert(1)).toBeDefined();
      expect(typeof tw.convert(123)).toBe('string');
    });
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

const testOrdinals: [number, string][] = [
  [1, 'پہلا'],
  [2, 'دوسرا'],
  [3, 'تیسرا'],
  [4, 'چوتھا'],
  [5, 'پانچواں'],
  [6, 'چھٹا'],
  [7, 'ساتواں'],
  [8, 'آٹھواں'],
  [9, 'نواں'],
  [10, 'دسواں'],
  [11, 'گیارہواں'],
  [12, 'بارہواں'],
  [13, 'تیرہواں'],
  [14, 'چودہواں'],
  [15, 'پندرہواں'],
  [16, 'سولہواں'],
  [17, 'سترہواں'],
  [18, 'اٹھارہواں'],
  [19, 'انیسواں'],
  [20, 'بیسواں'],
  [21, 'اکیسواں'],
  [22, 'بائیسواں'],
  [23, 'تئیسواں'],
  [24, 'چوبیسواں'],
  [25, 'پچیسواں'],
  [30, 'تیسواں'],
  [40, 'چالیسواں'],
  [50, 'پچاسواں'],
  [63, 'تریسٹھواں'],
  [75, 'پچھترواں'],
  [88, 'اٹھاسیواں'],
  [99, 'نناویواں'],
  [100, 'سَوواں'],
  [123, 'ایک سو تئیسواں'],
  [1000, 'ایک ہزارواں'],
  [100000, 'ایک لاکھواں'],
  [10000000, 'ایک کروڑواں'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'دس'],
  [100, 'ایک سو'],
  [1000, 'ایک ہزار'],
  [10000, 'دس ہزار'],
  [100000, 'ایک لاکھ'],
  [1000000, 'دس لاکھ'],
  [10000000, 'ایک کروڑ'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'صفر'],
  [1n, 'ایک'],
  [100n, 'ایک سو'],
  [1000n, 'ایک ہزار'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'منفی ایک'],
  [-100n, 'منفی ایک سو'],
  [-1000n, 'منفی ایک ہزار'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'صفر'],
  ['1', 'ایک'],
  ['100', 'ایک سو'],
  ['-100', 'منفی ایک سو'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testZeroVariants: [number | bigint | string, string][] = [
  [0, 'صفر'],
  [-0, 'صفر'],
  [0.0, 'صفر'],
  [0n, 'صفر'],
  ['0', 'صفر'],
];

describe('Test Zero Variants', () => {
  test.concurrent.each(testZeroVariants)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('Zero with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('صفر روپے صرف');
  });
});

describe('Test Invalid Input', () => {
  test('NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('-Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('Empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('Non-numeric string throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

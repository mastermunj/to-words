import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import npNp from '../src/locales/np-NP';

const localeCode = 'np-NP';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(npNp);
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
  [0, 'शून्य'],
  [137, 'एक सय सैंतीस'],
  [700, 'सात सय'],
  [1100, 'एक हजार एक सय'],
  [4680, 'चार हजार छ सय अस्सी'],
  [63892, 'त्रिसट्ठी हजार आठ सय बयान्नब्बे'],
  [86100, 'छयासी हजार एक सय'],
  [792581, 'सात लाख बयान्नब्बे हजार पाँच सय एकासी'],
  [2741034, 'सत्ताइस लाख एकचालीस हजार चौँतीस'],
  [86429753, 'आठ करोड चौंसट्ठी लाख उनन्तिस हजार सात सय त्रिपन्न'],
  [975310864, 'सन्तानब्बे करोड त्रिपन्न लाख दश हजार आठ सय चौंसट्ठी'],
  [9876543210, 'नौ अर्ब सतासी करोड पैंसट्ठी लाख त्रिचालीस हजार दुई सय दश'],
  [98765432101, 'अन्ठानब्बे अर्ब छयहत्तर करोड चवन्न लाख बत्तीस हजार एक सय एक'],
  [9_87_65_43_21_012, 'नौ खर्ब सतासी अर्ब पैंसट्ठी करोड त्रिचालीस लाख एक्काइस हजार बाह्र'],
  [98_76_54_32_10_123, 'अन्ठानब्बे खर्ब छयहत्तर अर्ब चवन्न करोड बत्तीस लाख दश हजार एक सय तेइस'],
  [9_87_65_43_21_01_234, 'नौ सय सतासी खर्ब पैंसट्ठी अर्ब त्रिचालीस करोड एक्काइस लाख एक हजार दुई सय चौँतीस'],
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
    row[1] = `माइनस ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपैयाँ मात्र`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपैयाँ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} रुपैयाँ मात्र`;
      return;
    }
    row[0] = -row[0];
    row[1] = `माइनस ${row[1]} रुपैयाँ मात्र`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} रुपैयाँ मात्र`;
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
  [0.0, 'शून्य'],
  [0.04, 'शून्य दशमलब शून्य चार'],
  [0.0468, 'शून्य दशमलब शून्य चार छ आठ'],
  [0.4, 'शून्य दशमलब चार'],
  [0.63, 'शून्य दशमलब त्रिसट्ठी'],
  [0.973, 'शून्य दशमलब नौ सय त्रिहत्तर'],
  [0.999, 'शून्य दशमलब नौ सय उनान्सय'],
  [37.06, 'सैंतीस दशमलब शून्य छ'],
  [37.068, 'सैंतीस दशमलब शून्य छ आठ'],
  [37.68, 'सैंतीस दशमलब अठसट्ठी'],
  [37.683, 'सैंतीस दशमलब छ सय त्रियासी'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `शून्य रुपैयाँ मात्र`],
  [0.04, `शून्य रुपैयाँ र चार पैसा मात्र`],
  [0.0468, `शून्य रुपैयाँ र पाँच पैसा मात्र`],
  [0.4, `शून्य रुपैयाँ र चालीस पैसा मात्र`],
  [0.63, `शून्य रुपैयाँ र त्रिसट्ठी पैसा मात्र`],
  [0.973, `शून्य रुपैयाँ र सन्तानब्बे पैसा मात्र`],
  [0.999, `एक रुपैयाँ मात्र`],
  [37.06, `सैंतीस रुपैयाँ र छ पैसा मात्र`],
  [37.068, `सैंतीस रुपैयाँ र सात पैसा मात्र`],
  [37.68, `सैंतीस रुपैयाँ र अठसट्ठी पैसा मात्र`],
  [37.683, `सैंतीस रुपैयाँ र अठसट्ठी पैसा मात्र`],
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
      row[1] = (row[1] as string).replace(`शून्य रुपैयाँ र `, '');
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
      row[1] = `शून्य रुपैयाँ मात्र`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` र [\\W]+ पैसा`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` र [\\W]+ पैसा`), '');
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

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import npNp from '../src/locales/np-NP.js';
import { ToWords as LocaleToWords } from '../src/locales/np-NP.js';

const localeCode = 'np-NP';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(npNp);
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
  [9_87_65_43_21_01_234, 'नौ नील सतासी खर्ब पैंसट्ठी अर्ब त्रिचालीस करोड एक्काइस लाख एक हजार दुई सय चौँतीस'],
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

const testOrdinals: [number, string][] = [
  [1, 'पहिलो'],
  [2, 'दोस्रो'],
  [3, 'तेस्रो'],
  [4, 'चौथो'],
  [5, 'पाँचौं'],
  [10, 'दशौं'],
  [11, 'एघारौं'],
  [15, 'पन्ध्रौं'],
  [20, 'बीसौं'],
  [21, 'एक्काइसौं'],
  [22, 'बाइसौं'],
  [25, 'पच्चिसौं'],
  [30, 'तीसौं'],
  [35, 'पैंतीसौं'],
  [40, 'चालीसौं'],
  [45, 'पैंतालीसौं'],
  [50, 'पचासौं'],
  [55, 'पचपन्नौं'],
  [60, 'साठीौं'],
  [65, 'पैंसट्ठीौं'],
  [70, 'सत्तरीौं'],
  [75, 'पचहत्तरौं'],
  [80, 'अस्सीौं'],
  [85, 'पचासीौं'],
  [90, 'नब्बेौं'],
  [95, 'पन्चानब्बेौं'],
  [99, 'उनान्सयौं'],
  [100, 'सयौं'],
  [123, 'एक सय तेइसौं'],
  [1000, 'एक हजारौं'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'दश'],
  [100, 'एक सय'],
  [1000, 'एक हजार'],
  [10000, 'दश हजार'],
  [100000, 'एक लाख'],
  [1000000, 'दश लाख'],
  [10000000, 'एक करोड'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'शून्य'],
  [1n, 'एक'],
  [100n, 'एक सय'],
  [1000n, 'एक हजार'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'माइनस एक'],
  [-100n, 'माइनस एक सय'],
  [-1000n, 'माइनस एक हजार'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'शून्य'],
  ['1', 'एक'],
  ['100', 'एक सय'],
  ['-100', 'माइनस एक सय'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => शून्य', () => {
    expect(toWords.convert(0)).toBe('शून्य');
  });

  test('convert -0 => शून्य', () => {
    expect(toWords.convert(-0)).toBe('शून्य');
  });

  test('convert 0.0 => शून्य', () => {
    expect(toWords.convert(0.0)).toBe('शून्य');
  });

  test('convert 0n => शून्य', () => {
    expect(toWords.convert(0n)).toBe('शून्य');
  });

  test('convert "0" => शून्य', () => {
    expect(toWords.convert('0')).toBe('शून्य');
  });

  test('convert 0 with currency => शून्य रुपैयाँ मात्र', () => {
    expect(toWords.convert(0, { currency: true })).toBe('शून्य रुपैयाँ मात्र');
  });
});

describe('Test Invalid Inputs', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(NaN)).toThrow('Invalid Number "NaN"');
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

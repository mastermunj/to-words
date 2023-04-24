import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import mrIn from '../src/locales/mr-IN';

const localeCode = 'mr-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(mrIn);
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
  [137, 'एकशे सदतीस'],
  [700, 'सातशे'],
  [1100, 'एक हजार एकशे'],
  [2100, 'दोन हजार एकशे'],
  [4680, 'चार हजार सहाशे ऐंशी'],
  [63892, 'त्रेसष्ठ हजार आठशे ब्याण्णव'],
  [792581, 'सात लाख ब्याण्णव हजार पाचशे एक्क्याऐंशी'],
  [2741034, 'सत्तावीस लाख एक्केचाळीस हजार चौतीस'],
  [86429753, 'आठ कोटी चौसष्ठ लाख एकोणतीस हजार सातशे त्रेपन्न'],
  [975310864, 'सत्त्याण्णव कोटी त्रेपन्न लाख दहा हजार आठशे चौसष्ठ'],
  [9876543210, 'नऊशे सत्त्याऐंशी कोटी पासष्ठ लाख त्रेचाळीस हजार दोनशे दहा'],
  [98765432101, 'नऊ हजार आठशे शहात्तर कोटी चोपन्न लाख बत्तीस हजार एकशे एक'],
  [987654321012, 'अठ्ठ्याण्णव हजार सातशे पासष्ठ कोटी त्रेचाळीस लाख एकवीस हजार बारा'],
  [9876543210123, 'नऊ लाख सत्त्याऐंशी हजार सहाशे चोपन्न कोटी बत्तीस लाख दहा हजार एकशे तेवीस'],
  [98765432101234, 'अठ्ठ्याण्णव लाख शहात्तर हजार पाचशे त्रेचाळीस कोटी एकवीस लाख एक हजार दोनशे चौतीस'],
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
    row[1] = `वजा ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपये`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} रुपये`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} रुपये`;
  });
  testIntegersWithCurrencyAndIgnoreZeroCurrency[0][1] = '';

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
  [0.0, 'शून्य'],
  [0.04, 'शून्य पूर्णांक शून्य चार'],
  [0.0468, 'शून्य पूर्णांक शून्य चार सहा आठ'],
  [0.4, 'शून्य पूर्णांक चार'],
  [0.63, 'शून्य पूर्णांक त्रेसष्ठ'],
  [0.973, 'शून्य पूर्णांक नऊशे त्र्याहत्तर'],
  [0.999, 'शून्य पूर्णांक नऊशे नव्व्याण्णव'],
  [37.06, 'सदतीस पूर्णांक शून्य सहा'],
  [37.068, 'सदतीस पूर्णांक शून्य सहा आठ'],
  [37.68, 'सदतीस पूर्णांक अडुसष्ठ'],
  [37.683, 'सदतीस पूर्णांक सहाशे त्र्याऐंशी'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'शून्य रुपये'],
  [0.04, 'शून्य रुपये आणि चार पैसे'],
  [0.0468, 'शून्य रुपये आणि पाच पैसे'],
  [0.4, 'शून्य रुपये आणि चाळीस पैसे'],
  [0.63, 'शून्य रुपये आणि त्रेसष्ठ पैसे'],
  [0.973, 'शून्य रुपये आणि सत्त्याण्णव पैसे'],
  [0.999, 'एक रुपये'],
  [37.06, 'सदतीस रुपये आणि सहा पैसे'],
  [37.068, 'सदतीस रुपये आणि सात पैसे'],
  [37.68, 'सदतीस रुपये आणि अडुसष्ठ पैसे'],
  [37.683, 'सदतीस रुपये आणि अडुसष्ठ पैसे'],
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
      row[1] = (row[1] as string).replace(`शून्य रुपये आणि `, '');
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
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `शून्य रुपये`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` आणि [\u0900-\u097F ]+ पैसे`), '');
    }
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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` आणि [\u0900-\u097F ]+ पैसे`), '');
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

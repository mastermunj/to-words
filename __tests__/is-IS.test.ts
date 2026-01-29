import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import isIs from '../src/locales/is-IS';

const localeCode = 'is-IS';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(isIs);
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
  [0, 'Núll'],
  [137, 'Hundrað Þrjátíu Og Sjö'],
  [700, 'Sjö Hundrað'],
  [1100, 'Þúsund Hundrað'],
  [4680, 'Fjórir Þúsund Sex Hundrað Áttatíu'],
  [63892, 'Sextíu Og Þrír Þúsund Átta Hundrað Níutíu Og Tveir'],
  [86100, 'Áttatíu Og Sex Þúsund Hundrað'],
  [792581, 'Sjö Hundrað Níutíu Og Tveir Þúsund Fimm Hundrað Áttatíu Og Einn'],
  [2741034, 'Tveir Milljón Sjö Hundrað Fjörutíu Og Einn Þúsund Þrjátíu Og Fjórir'],
  [86429753, 'Áttatíu Og Sex Milljón Fjórir Hundrað Tuttugu Og Níu Þúsund Sjö Hundrað Fimmtíu Og Þrír'],
  [975310864, 'Níu Hundrað Sjötíu Og Fimm Milljón Þrír Hundrað Tíu Þúsund Átta Hundrað Sextíu Og Fjórir'],
  [
    9876543210,
    'Níu Milljarður Átta Hundrað Sjötíu Og Sex Milljón Fimm Hundrað Fjörutíu Og Þrír Þúsund Tveir Hundrað Tíu',
  ],
  [
    98765432101,
    'Níutíu Og Átta Milljarður Sjö Hundrað Sextíu Og Fimm Milljón Fjórir Hundrað Þrjátíu Og Tveir Þúsund Hundrað Einn',
  ],
  [
    987654321012,
    'Níu Hundrað Áttatíu Og Sjö Milljarður Sex Hundrað Fimmtíu Og Fjórir Milljón Þrír Hundrað Tuttugu Og Einn Þúsund Tólf',
  ],
  [
    9876543210123,
    'Níu Billjón Átta Hundrað Sjötíu Og Sex Milljarður Fimm Hundrað Fjörutíu Og Þrír Milljón Tveir Hundrað Tíu Þúsund Hundrað Tuttugu Og Þrír',
  ],
  [
    98765432101234,
    'Níutíu Og Átta Billjón Sjö Hundrað Sextíu Og Fimm Milljarður Fjórir Hundrað Þrjátíu Og Tveir Milljón Hundrað Einn Þúsund Tveir Hundrað Þrjátíu Og Fjórir',
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
    row[1] = `Mínus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Krónur`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Krónur`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Krónur`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Mínus ${row[1]} Krónur`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Krónur`;
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
  [0.0, 'Núll'],
  [0.04, 'Núll Komma Núll Fjórir'],
  [0.0468, 'Núll Komma Núll Fjórir Sex Átta'],
  [0.4, 'Núll Komma Fjórir'],
  [0.973, 'Núll Komma Níu Hundrað Sjötíu Og Þrír'],
  [0.999, 'Núll Komma Níu Hundrað Níutíu Og Níu'],
  [37.06, 'Þrjátíu Og Sjö Komma Núll Sex'],
  [37.068, 'Þrjátíu Og Sjö Komma Núll Sex Átta'],
  [37.68, 'Þrjátíu Og Sjö Komma Sextíu Og Átta'],
  [37.683, 'Þrjátíu Og Sjö Komma Sex Hundrað Áttatíu Og Þrír'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Núll Krónur`],
  [0.04, `Núll Krónur Og Fjórir Aurar`],
  [0.0468, `Núll Krónur Og Fimm Aurar`],
  [0.4, `Núll Krónur Og Fjörutíu Aurar`],
  [0.973, `Núll Krónur Og Níutíu Og Sjö Aurar`],
  [0.999, `Einn Króna`],
  [37.06, `Þrjátíu Og Sjö Krónur Og Sex Aurar`],
  [37.068, `Þrjátíu Og Sjö Krónur Og Sjö Aurar`],
  [37.68, `Þrjátíu Og Sjö Krónur Og Sextíu Og Átta Aurar`],
  [37.683, `Þrjátíu Og Sjö Krónur Og Sextíu Og Átta Aurar`],
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
      row[1] = (row[1] as string).replace(`Núll Krónur Og `, '');
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
      row[1] = `Núll Krónur`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Krónur.*`), 'Krónur');
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

const testOrdinals: [number, string][] = [
  // Numbers 0-10
  [0, 'Núllti'],
  [1, 'Fyrsti'],
  [2, 'Annar'],
  [3, 'Þriðji'],
  [4, 'Fjórði'],
  [5, 'Fimmti'],
  [6, 'Sjötti'],
  [7, 'Sjöundi'],
  [8, 'Áttundi'],
  [9, 'Níundi'],
  [10, 'Tíundi'],
  [11, 'Ellefti'],
  [12, 'Tólfti'],
  [13, 'Þrettándi'],
  [14, 'Fjórtándi'],
  [15, 'Fimmtándi'],
  [16, 'Sextándi'],
  [17, 'Sautjándi'],
  [18, 'Átjándi'],
  [19, 'Nítjándi'],
  [20, 'Tuttugasti'],
  // Composite numbers (21, 22, etc.)
  [21, 'Tuttugu Og Einn'],
  [22, 'Tuttugu Og Tveir'],
  [23, 'Tuttugu Og Þrír'],
  [24, 'Tuttugu Og Fjórir'],
  [25, 'Tuttugu Og Fimm'],
  // Tens
  [30, 'Þrítugasti'],
  [40, 'Fertugasti'],
  [50, 'Fimmtugasti'],
  [60, 'Sextugasti'],
  [70, 'Sjötugasti'],
  [80, 'Áttugasti'],
  [90, 'Níutugasti'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundraðasti'],
  [200, 'Tveir Hundraðasti'],
  [300, 'Þrír Hundraðasti'],
  [1000, 'Þúsundasti'],
  [2000, 'Tveir Þúsundasti'],
  [1000000, 'Einn Milljónasti'],
  [2000000, 'Tveir Milljónasti'],
  // Complex numbers
  [101, 'Hundrað Fyrsti'],
  [102, 'Hundrað Annar'],
  [111, 'Hundrað Ellefti'],
  [123, 'Hundrað Tuttugu Og Þrír'],
  [150, 'Hundrað Fimmtugasti'],
  [1001, 'Þúsund Fyrsti'],
  [1234, 'Þúsund Tveir Hundrað Þrjátíu Og Fjórir'],
  [1500, 'Þúsund Fimm Hundraðasti'],
  [10000, 'Tíu Þúsundasti'],
  [100000, 'Hundrað Þúsundasti'],
  [1000001, 'Einn Milljón Fyrsti'],
];

describe('Test Ordinals with toOrdinal()', () => {
  test.concurrent.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for small decimal numbers', () => {
    expect(() => toWords.toOrdinal(0.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for large decimal numbers', () => {
    expect(() => toWords.toOrdinal(100.25)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

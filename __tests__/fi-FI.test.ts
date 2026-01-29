import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import fiFi from '../src/locales/fi-FI.js';
import { ToWords as LocaleToWords } from '../src/locales/fi-FI.js';

const localeCode = 'fi-FI';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(fiFi);
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

const testIntegers: [number, string][] = [
  [0, 'Nolla'],
  [1, 'Yksi'],
  [2, 'Kaksi'],
  [3, 'Kolme'],
  [4, 'Neljä'],
  [5, 'Viisi'],
  [6, 'Kuusi'],
  [7, 'Seitsemän'],
  [8, 'Kahdeksan'],
  [9, 'Yhdeksän'],
  [10, 'Kymmenen'],
  [11, 'Yksitoista'],
  [12, 'Kaksitoista'],
  [13, 'Kolmetoista'],
  [14, 'Neljätoista'],
  [15, 'Viisitoista'],
  [16, 'Kuusitoista'],
  [17, 'Seitsemäntoista'],
  [18, 'Kahdeksantoista'],
  [19, 'Yhdeksäntoista'],
  [20, 'Kaksikymmentä'],
  [21, 'Kaksikymmentä Yksi'],
  [22, 'Kaksikymmentä Kaksi'],
  [30, 'Kolmekymmentä'],
  [35, 'Kolmekymmentä Viisi'],
  [40, 'Neljäkymmentä'],
  [50, 'Viisikymmentä'],
  [60, 'Kuusikymmentä'],
  [70, 'Seitsemänkymmentä'],
  [80, 'Kahdeksankymmentä'],
  [90, 'Yhdeksänkymmentä'],
  [99, 'Yhdeksänkymmentä Yhdeksän'],
  [100, 'Sata'],
  [137, 'Sata Kolmekymmentä Seitsemän'],
  [200, 'Kaksisataa'],
  [300, 'Kolmesataa'],
  [400, 'Neljäsataa'],
  [500, 'Viisisataa'],
  [600, 'Kuusisataa'],
  [700, 'Seitsemänsataa'],
  [800, 'Kahdeksansataa'],
  [900, 'Yhdeksänsataa'],
  [1000, 'Tuhat'],
  [1100, 'Tuhat Sata'],
  [2000, 'Kaksi Tuhat'],
  [3000, 'Kolme Tuhat'],
  [4680, 'Neljä Tuhat Kuusisataa Kahdeksankymmentä'],
  [10000, 'Kymmenen Tuhat'],
  [63892, 'Kuusikymmentä Kolme Tuhat Kahdeksansataa Yhdeksänkymmentä Kaksi'],
  [100000, 'Sata Tuhat'],
  [1000000, 'Yksi Miljoona'],
  [2000000, 'Kaksi Miljoona'],
  [2741034, 'Kaksi Miljoona Seitsemänsataa Neljäkymmentä Yksi Tuhat Kolmekymmentä Neljä'],
  [1000000000, 'Yksi Miljardi'],
  [2000000000, 'Kaksi Miljardi'],
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
    row[1] = `Miinus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ${row[0] === 1 ? 'Euro' : 'Euroa'}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ${row[0] === 1 ? 'Euro' : 'Euroa'}`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Euroa`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Miinus ${row[1]} ${row[0] === -1 ? 'Euro' : 'Euroa'}`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
    } else {
      row[1] = `${row[1]} ${row[0] === 1 ? 'Euro' : 'Euroa'}`;
    }
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

const testFloats: [number, string][] = [
  [0.0, 'Nolla'],
  [0.04, 'Nolla Pilkku Nolla Neljä'],
  [0.4, 'Nolla Pilkku Neljä'],
  [0.63, 'Nolla Pilkku Kuusikymmentä Kolme'],
  [37.06, 'Kolmekymmentä Seitsemän Pilkku Nolla Kuusi'],
  [37.68, 'Kolmekymmentä Seitsemän Pilkku Kuusikymmentä Kahdeksan'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Nolla Euroa'],
  [0.04, 'Nolla Euroa Ja Neljä Senttiä'],
  [0.4, 'Nolla Euroa Ja Neljäkymmentä Senttiä'],
  [0.63, 'Nolla Euroa Ja Kuusikymmentä Kolme Senttiä'],
  [0.999, 'Yksi Euro'],
  [37.06, 'Kolmekymmentä Seitsemän Euroa Ja Kuusi Senttiä'],
  [37.68, 'Kolmekymmentä Seitsemän Euroa Ja Kuusikymmentä Kahdeksan Senttiä'],
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
      row[1] = (row[1] as string).replace('Nolla Euroa Ja ', '');
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
      row[1] = 'Nolla Euroa';
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Ja [\\wäöÄÖ ]+ Senttiä`), '');
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

// Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [0, 'Nollas'],
  [1, 'Ensimmäinen'],
  [2, 'Toinen'],
  [3, 'Kolmas'],
  [4, 'Neljäs'],
  [5, 'Viides'],
  [6, 'Kuudes'],
  [7, 'Seitsemäs'],
  [8, 'Kahdeksas'],
  [9, 'Yhdeksäs'],
  [10, 'Kymmenes'],
  [11, 'Yhdestoista'],
  [12, 'Kahdestoista'],
  [13, 'Kolmastoista'],
  [14, 'Neljästoista'],
  [15, 'Viidestoista'],
  [16, 'Kuudestoista'],
  [17, 'Seitsemästoista'],
  [18, 'Kahdeksastoista'],
  [19, 'Yhdeksästoista'],
  [20, 'Kahdeskymmenes'],
  [21, 'Kaksikymmentä Ensimmäinen'],
  [22, 'Kaksikymmentä Toinen'],
  [30, 'Kolmaskymmenes'],
  [40, 'Neljäskymmenes'],
  [50, 'Viideskymmenes'],
  [60, 'Kuudeskymmenes'],
  [70, 'Seitsemäskymmenes'],
  [80, 'Kahdeksaskymmenes'],
  [90, 'Yhdeksäskymmenes'],
  [100, 'Sadas'],
  [101, 'Sata Ensimmäinen'],
  [200, 'Kahdessadas'],
  [1000, 'Tuhannes'],
  [1001, 'Tuhat Ensimmäinen'],
  [1000000, 'Yksi Miljoonas'],
];

describe('Test Ordinal Numbers', () => {
  test.concurrent.each(testOrdinalNumbers)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for decimal numbers with small fraction', () => {
    expect(() => toWords.toOrdinal(10.01)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers with large fraction', () => {
    expect(() => toWords.toOrdinal(99.99)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Finnish-specific numbers', () => {
  test('Single Euro', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Yksi Euro');
  });

  test('Multiple Euros', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Kaksi Euroa');
    expect(toWords.convert(100, { currency: true })).toBe('Sata Euroa');
  });

  test('Teens (11-19)', () => {
    expect(toWords.convert(11)).toBe('Yksitoista');
    expect(toWords.convert(12)).toBe('Kaksitoista');
    expect(toWords.convert(13)).toBe('Kolmetoista');
    expect(toWords.convert(14)).toBe('Neljätoista');
    expect(toWords.convert(15)).toBe('Viisitoista');
    expect(toWords.convert(16)).toBe('Kuusitoista');
    expect(toWords.convert(17)).toBe('Seitsemäntoista');
    expect(toWords.convert(18)).toBe('Kahdeksantoista');
    expect(toWords.convert(19)).toBe('Yhdeksäntoista');
  });

  test('Large numbers', () => {
    expect(toWords.convert(1000000)).toBe('Yksi Miljoona');
    expect(toWords.convert(1000000000)).toBe('Yksi Miljardi');
    expect(toWords.convert(2000000)).toBe('Kaksi Miljoona');
    expect(toWords.convert(2000000000)).toBe('Kaksi Miljardi');
  });
});

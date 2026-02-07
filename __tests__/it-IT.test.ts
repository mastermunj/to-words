import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import itIT from '../src/locales/it-IT.js';
import { ToWords as LocaleToWords } from '../src/locales/it-IT.js';

const localeCode = 'it-IT';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(itIT);
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
  [0, 'Zero'],
  [1, 'Uno'],
  [2, 'Due'],
  [3, 'Tre'],
  [4, 'Quattro'],
  [5, 'Cinque'],
  [6, 'Sei'],
  [7, 'Sette'],
  [8, 'Otto'],
  [9, 'Nove'],
  [10, 'Dieci'],
  [11, 'Undici'],
  [12, 'Dodici'],
  [13, 'Tredici'],
  [14, 'Quattordici'],
  [15, 'Quindici'],
  [16, 'Sedici'],
  [17, 'Diciassette'],
  [18, 'Diciotto'],
  [19, 'Diciannove'],
  [20, 'Venti'],
  [21, 'Ventuno'],
  [22, 'Ventidue'],
  [23, 'Ventitré'],
  [24, 'Ventiquattro'],
  [25, 'Venticinque'],
  [26, 'Ventisei'],
  [27, 'Ventisette'],
  [28, 'Ventotto'],
  [29, 'Ventinove'],
  [30, 'Trenta'],
  [31, 'Trentuno'],
  [33, 'Trentatré'],
  [38, 'Trentotto'],
  [40, 'Quaranta'],
  [41, 'Quarantuno'],
  [48, 'Quarantotto'],
  [50, 'Cinquanta'],
  [51, 'Cinquantuno'],
  [58, 'Cinquantotto'],
  [60, 'Sessanta'],
  [61, 'Sessantuno'],
  [68, 'Sessantotto'],
  [70, 'Settanta'],
  [71, 'Settantuno'],
  [78, 'Settantotto'],
  [80, 'Ottanta'],
  [81, 'Ottantuno'],
  [88, 'Ottantotto'],
  [90, 'Novanta'],
  [91, 'Novantuno'],
  [98, 'Novantotto'],
  [99, 'Novantanove'],
  [100, 'Cento'],
  [101, 'Cento Uno'],
  [108, 'Cento Otto'],
  [111, 'Cento Undici'],
  [121, 'Cento Ventuno'],
  [128, 'Cento Ventotto'],
  [137, 'Cento Trentasette'],
  [200, 'Due Cento'],
  [300, 'Tre Cento'],
  [400, 'Quattro Cento'],
  [500, 'Cinque Cento'],
  [600, 'Sei Cento'],
  [700, 'Sette Cento'],
  [800, 'Otto Cento'],
  [900, 'Nove Cento'],
  [999, 'Nove Cento Novantanove'],
  [1000, 'Mille'],
  [1001, 'Mila Uno'],
  [1100, 'Mila Cento'],
  [2000, 'Due Mila'],
  [2001, 'Due Mila Uno'],
  [3000, 'Tre Mila'],
  [4680, 'Quattro Mila Sei Cento Ottanta'],
  [10000, 'Dieci Mila'],
  [21000, 'Ventuno Mila'],
  [63892, 'Sessantatré Mila Otto Cento Novantadue'],
  [86100, 'Ottantasei Mila Cento'],
  [100000, 'Cento Mila'],
  [500000, 'Cinque Cento Mila'],
  [792581, 'Sette Cento Novantadue Mila Cinque Cento Ottantuno'],
  [1000000, 'Un Milione'],
  [2000000, 'Milioni'],
  [2741034, 'Milioni Sette Cento Quarantuno Mila Trentaquattro'],
  [10000000, 'Dieci Milioni'],
  [86429753, 'Ottantasei Milioni Quattro Cento Ventinove Mila Sette Cento Cinquantatré'],
  [100000000, 'Cento Milioni'],
  [975310864, 'Nove Cento Settantacinque Milioni Tre Cento Dieci Mila Otto Cento Sessantaquattro'],
  [1000000000, 'Un Miliardo'],
  [2000000000, 'Miliardi'],
  [9876543210, 'Nove Miliardi Otto Cento Settantasei Milioni Cinque Cento Quarantatré Mila Due Cento Dieci'],
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
    row[1] = `Meno ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testIntegersCurrency: [number, string][] = [
  [0, 'Zero'],
  [1, 'Un'],
  [2, 'Due'],
  [21, 'Ventuno'],
  [100, 'Cento'],
  [101, 'Cento Un'],
  [137, 'Cento Trentasette'],
  [700, 'Sette Cento'],
  [1000, 'Mille'],
  [1100, 'Mila Cento'],
  [2000, 'Due Mila'],
  [4680, 'Quattro Mila Sei Cento Ottanta'],
  [63892, 'Sessantatré Mila Otto Cento Novantadue'],
  [86100, 'Ottantasei Mila Cento'],
  [792581, 'Sette Cento Novantadue Mila Cinque Cento Ottantuno'],
  [1000000, 'Un Milione'],
  [2741034, 'Milioni Sette Cento Quarantuno Mila Trentaquattro'],
];

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Euro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegersCurrency);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Euro`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Meno ${row[1]} Euro`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegersCurrency);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Euro`;
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
  [0.0, 'Zero'],
  [0.04, 'Zero Virgola Zero Quattro'],
  [0.0468, 'Zero Virgola Zero Quattro Sei Otto'],
  [0.4, 'Zero Virgola Quattro'],
  [0.63, 'Zero Virgola Sessantatré'],
  [0.973, 'Zero Virgola Nove Cento Settantatré'],
  [0.999, 'Zero Virgola Nove Cento Novantanove'],
  [37.06, 'Trentasette Virgola Zero Sei'],
  [37.068, 'Trentasette Virgola Zero Sei Otto'],
  [37.68, 'Trentasette Virgola Sessantotto'],
  [37.683, 'Trentasette Virgola Sei Cento Ottantatré'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Zero Euro`],
  [0.04, `Zero Euro E Quattro Centesimi`],
  [0.0468, `Zero Euro E Cinque Centesimi`],
  [0.4, `Zero Euro E Quaranta Centesimi`],
  [0.63, `Zero Euro E Sessantatré Centesimi`],
  [0.973, `Zero Euro E Novantasette Centesimi`],
  [0.999, `Un Euro`],
  [1.01, `Un Euro E Un Centesimo`],
  [37.06, `Trentasette Euro E Sei Centesimi`],
  [37.068, `Trentasette Euro E Sette Centesimi`],
  [37.68, `Trentasette Euro E Sessantotto Centesimi`],
  [37.683, `Trentasette Euro E Sessantotto Centesimi`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace(`Zero Euro E `, '');
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
      row[1] = `Zero Euro`;
    } else {
      row[1] = (row[1] as string).replace(/ E .+ Centesim[io]$/, '');
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
    row[1] = (row[1] as string).replace(/ E .+ Centesim[io]$/, '');
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

// Ordinal Tests
const testOrdinals: [number, string][] = [
  // Numbers 1-20
  [1, 'Primo'],
  [2, 'Secondo'],
  [3, 'Terzo'],
  [4, 'Quarto'],
  [5, 'Quinto'],
  [6, 'Sesto'],
  [7, 'Settimo'],
  [8, 'Ottavo'],
  [9, 'Nono'],
  [10, 'Decimo'],
  [11, 'Undicesimo'],
  [12, 'Dodicesimo'],
  [13, 'Tredicesimo'],
  [14, 'Quattordicesimo'],
  [15, 'Quindicesimo'],
  [16, 'Sedicesimo'],
  [17, 'Diciassettesimo'],
  [18, 'Diciottesimo'],
  [19, 'Diciannovesimo'],
  [20, 'Ventesimo'],
  // Composite numbers
  [21, 'Ventuno'],
  [22, 'Ventidue'],
  [23, 'Ventitré'],
  // Tens
  [30, 'Trentesimo'],
  [40, 'Quarantesimo'],
  [50, 'Cinquantesimo'],
  [60, 'Sessantesimo'],
  [70, 'Settantesimo'],
  [80, 'Ottantesimo'],
  [90, 'Novantesimo'],
  // Round numbers
  [100, 'Centesimo'],
  [1000, 'Millesimo'],
  [1000000, 'Un Milionesimo'],
  // Complex numbers
  [101, 'Cento Primo'],
  [110, 'Cento Decimo'],
  [111, 'Cento Undicesimo'],
  [150, 'Cento Cinquantesimo'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
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

  test('should throw error for negative decimal numbers', () => {
    expect(() => toWords.toOrdinal(-3.14)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

// Powers of Ten Tests
const testPowersOfTen: [number, string][] = [
  [10, 'Dieci'],
  [100, 'Cento'],
  [1000, 'Mille'],
  [1000000, 'Un Milione'],
  [1000000000, 'Un Miliardo'],
  [1000000000000, 'Un Bilione'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Boundary Values Tests
const testBoundaryValues: [number, string][] = [
  [99, 'Novantanove'],
  [100, 'Cento'],
  [999, 'Nove Cento Novantanove'],
  [1000, 'Mille'],
  [999999, 'Nove Cento Novantanove Mila Nove Cento Novantanove'],
  [1000000, 'Un Milione'],
  [999999999, 'Nove Cento Novantanove Milioni Nove Cento Novantanove Mila Nove Cento Novantanove'],
  [1000000000, 'Un Miliardo'],
];

describe('Test Boundary Values', () => {
  test.concurrent.each(testBoundaryValues)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats Tests
const testNegativeFloats: [number, string][] = [
  [-0.5, 'Meno Zero Virgola Cinque'],
  [-0.99, 'Meno Zero Virgola Novantanove'],
  [-1.5, 'Meno Uno Virgola Cinque'],
  [-1.01, 'Meno Uno Virgola Zero Uno'],
  [-100.5, 'Meno Cento Virgola Cinque'],
  [-1000.99, 'Meno Mille Virgola Novantanove'],
  [-3.14, 'Meno Tre Virgola Quattordici'],
];

describe('Test Negative Floats', () => {
  test.concurrent.each(testNegativeFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative Floats with Currency
const testNegativeFloatsWithCurrency: [number, string][] = [
  [-0.5, 'Meno Zero Euro E Cinquanta Centesimi'],
  [-0.99, 'Meno Zero Euro E Novantanove Centesimi'],
  [-1.5, 'Meno Un Euro E Cinquanta Centesimi'],
  [-1.01, 'Meno Un Euro E Un Centesimo'],
  [-100.5, 'Meno Cento Euro E Cinquanta Centesimi'],
  [-1000.99, 'Meno Mille Euro E Novantanove Centesimi'],
];

describe('Test Negative Floats with Currency', () => {
  test.concurrent.each(testNegativeFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// BigInt Tests
const testBigInts: [bigint, string][] = [
  [0n, 'Zero'],
  [1n, 'Uno'],
  [100n, 'Cento'],
  [1000n, 'Mille'],
  [1000000n, 'Un Milione'],
  [1000000000n, 'Un Miliardo'],
  [1000000000000n, 'Un Bilione'],
  [1000000000000000n, 'Un Biliardo'],
  [
    1234567890123n,
    'Un Bilione Due Cento Trentaquattro Miliardi Cinque Cento Sessantasette Milioni Otto Cento Novanta Mila Cento Ventitré',
  ],
];

describe('Test BigInt Values', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// Negative BigInt Tests
const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Meno Uno'],
  [-100n, 'Meno Cento'],
  [-1000n, 'Meno Mille'],
  [-1000000n, 'Meno Un Milione'],
  [-1000000000n, 'Meno Un Miliardo'],
];

describe('Test Negative BigInt Values', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// BigInt with Currency
const testBigIntsWithCurrency: [bigint, string][] = [
  [0n, 'Zero Euro'],
  [1n, 'Un Euro'],
  [2n, 'Due Euro'],
  [100n, 'Cento Euro'],
  [1000n, 'Mille Euro'],
  [1000000n, 'Un Milione Euro'],
  [1000000000n, 'Un Miliardo Euro'],
];

describe('Test BigInt with Currency', () => {
  test.concurrent.each(testBigIntsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// String Input Tests
const testStringInputs: [string, string][] = [
  ['0', 'Zero'],
  ['1', 'Uno'],
  ['100', 'Cento'],
  ['1000', 'Mille'],
  ['-100', 'Meno Cento'],
  ['3.14', 'Tre Virgola Quattordici'],
  ['-3.14', 'Meno Tre Virgola Quattordici'],
  ['  100  ', 'Cento'],
  ['1000000', 'Un Milione'],
  ['1000000000', 'Un Miliardo'],
];

describe('Test String Number Inputs', () => {
  test.concurrent.each(testStringInputs)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

// String with Currency
const testStringInputsWithCurrency: [string, string][] = [
  ['0', 'Zero Euro'],
  ['1', 'Un Euro'],
  ['100', 'Cento Euro'],
  ['100.50', 'Cento Euro E Cinquanta Centesimi'],
  ['-100', 'Meno Cento Euro'],
];

describe('Test String Number Inputs with Currency', () => {
  test.concurrent.each(testStringInputsWithCurrency)('convert "%s" => %s', (input, expected) => {
    expect(toWords.convert(input, { currency: true })).toBe(expected);
  });
});

// Zero Variants
describe('Test Zero Variants', () => {
  test('converts 0 correctly', () => {
    expect(toWords.convert(0)).toBe('Zero');
  });

  test('converts -0 as Zero', () => {
    expect(toWords.convert(-0)).toBe('Zero');
  });

  test('converts 0.0 as Zero', () => {
    expect(toWords.convert(0.0)).toBe('Zero');
  });

  test('converts 0n as Zero', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('converts "0" as Zero', () => {
    expect(toWords.convert('0')).toBe('Zero');
  });

  test('converts 0 with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Zero Euro');
  });

  test('converts 0 with currency and ignoreZeroCurrency', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });
});

// Currency Singular/Plural Tests
describe('Test Currency Singular/Plural', () => {
  test('1 Euro (singular)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('Un Euro');
  });

  test('2 Euro (plural)', () => {
    expect(toWords.convert(2, { currency: true })).toBe('Due Euro');
  });

  test('0.01 Centesimo (singular)', () => {
    expect(toWords.convert(0.01, { currency: true })).toBe('Zero Euro E Un Centesimo');
  });

  test('0.02 Centesimi (plural)', () => {
    expect(toWords.convert(0.02, { currency: true })).toBe('Zero Euro E Due Centesimi');
  });

  test('1.01 (singular + singular)', () => {
    expect(toWords.convert(1.01, { currency: true })).toBe('Un Euro E Un Centesimo');
  });

  test('2.02 (plural + plural)', () => {
    expect(toWords.convert(2.02, { currency: true })).toBe('Due Euro E Due Centesimi');
  });
});

// All Currency Options Combinations
describe('Test All Currency Options Combinations', () => {
  const testValue = 100.5;

  test('currency only', () => {
    expect(toWords.convert(testValue, { currency: true })).toBe('Cento Euro E Cinquanta Centesimi');
  });

  test('currency + doNotAddOnly', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true })).toBe('Cento Euro E Cinquanta Centesimi');
  });

  test('currency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreDecimal: true })).toBe('Cento Euro');
  });

  test('currency + doNotAddOnly + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe('Cento Euro');
  });

  test('currency + ignoreZeroCurrency with zero', () => {
    expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
  });

  test('currency + ignoreZeroCurrency with non-zero', () => {
    expect(toWords.convert(100, { currency: true, ignoreZeroCurrency: true })).toBe('Cento Euro');
  });

  test('currency + ignoreZeroCurrency + ignoreDecimal', () => {
    expect(toWords.convert(testValue, { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true })).toBe(
      'Cento Euro',
    );
  });

  test('all options combined', () => {
    expect(
      toWords.convert(testValue, { currency: true, doNotAddOnly: true, ignoreDecimal: true, ignoreZeroCurrency: true }),
    ).toBe('Cento Euro');
  });
});

// Invalid Input Tests
describe('Test Invalid Inputs', () => {
  test('throws for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('throws for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });

  test('throws for empty string', () => {
    expect(() => toWords.convert('')).toThrow(/Invalid Number/);
  });

  test('throws for invalid string', () => {
    expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
  });
});

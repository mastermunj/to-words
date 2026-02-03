import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import azAZ from '../src/locales/az-AZ.js';
import { ToWords as LocaleToWords } from '../src/locales/az-AZ.js';

const localeCode = 'az-AZ';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(azAZ);
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
  [0, 'Sıfır'],
  [137, 'Bir Yüz Otuz Yeddi'],
  [700, 'Yeddi Yüz'],
  [1100, 'Min Yüz'],
  [4680, 'Dörd Min Altı Yüz Səksən'],
  [63892, 'Altmış Üç Min Səkkiz Yüz Doxsan İki'],
  [86100, 'Səksən Altı Min Yüz'],
  [792581, 'Yeddi Yüz Doxsan İki Min Beş Yüz Səksən Bir'],
  [2741034, 'İki Milyon Yeddi Yüz Qırx Bir Min Otuz Dörd'],
  [86429753, 'Səksən Altı Milyon Dörd Yüz İyirmi Doqquz Min Yeddi Yüz Əlli Üç'],
  [975310864, 'Doqquz Yüz Yetmiş Beş Milyon Üç Yüz On Min Səkkiz Yüz Altmış Dörd'],
  [1000000000, 'Bir Milyard'],
  [9876543210, 'Doqquz Milyard Səkkiz Yüz Yetmiş Altı Milyon Beş Yüz Qırx Üç Min İki Yüz On'],
  [10000000000, 'On Milyard'],
  [100000000000, 'Yüz Milyard'],
  [1000000000000, 'Bir Trilyon'],
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
    row[1] = `Mənfi ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Manat`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Manat`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Manat`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Mənfi ${row[1]} Manat`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Manat`;
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
  [0.0, 'Sıfır'],
  [0.04, 'Sıfır Nöqtə Sıfır Dörd'],
  [0.0468, 'Sıfır Nöqtə Sıfır Dörd Altı Səkkiz'],
  [0.4, 'Sıfır Nöqtə Dörd'],
  [0.63, 'Sıfır Nöqtə Altmış Üç'],
  [0.973, 'Sıfır Nöqtə Doqquz Yüz Yetmiş Üç'],
  [0.999, 'Sıfır Nöqtə Doqquz Yüz Doxsan Doqquz'],
  [37.06, 'Otuz Yeddi Nöqtə Sıfır Altı'],
  [37.068, 'Otuz Yeddi Nöqtə Sıfır Altı Səkkiz'],
  [37.68, 'Otuz Yeddi Nöqtə Altmış Səkkiz'],
  [37.683, 'Otuz Yeddi Nöqtə Altı Yüz Səksən Üç'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Sıfır Manat'],
  [0.01, 'Sıfır Manat Və Bir Qəpik'],
  [0.04, 'Sıfır Manat Və Dörd Qəpik'],
  [0.0468, 'Sıfır Manat Və Beş Qəpik'],
  [0.5, 'Sıfır Manat Və Əlli Qəpik'],
  [0.63, 'Sıfır Manat Və Altmış Üç Qəpik'],
  [0.973, 'Sıfır Manat Və Doxsan Yeddi Qəpik'],
  [0.999, 'Bir Manat'],
  [1.25, 'Bir Manat Və İyirmi Beş Qəpik'],
  [10.99, 'On Manat Və Doxsan Doqquz Qəpik'],
  [37.06, 'Otuz Yeddi Manat Və Altı Qəpik'],
  [37.68, 'Otuz Yeddi Manat Və Altmış Səkkiz Qəpik'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.01, 'Bir Qəpik'],
    [0.04, 'Dörd Qəpik'],
    [0.0468, 'Beş Qəpik'],
    [0.5, 'Əlli Qəpik'],
    [0.63, 'Altmış Üç Qəpik'],
    [0.973, 'Doxsan Yeddi Qəpik'],
    [0.999, 'Bir Manat'],
    [1.25, 'Bir Manat Və İyirmi Beş Qəpik'],
    [10.99, 'On Manat Və Doxsan Doqquz Qəpik'],
    [37.06, 'Otuz Yeddi Manat Və Altı Qəpik'],
    [37.68, 'Otuz Yeddi Manat Və Altmış Səkkiz Qəpik'],
  ];

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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'Sıfır Manat'],
    [0.01, 'Sıfır Manat'],
    [0.04, 'Sıfır Manat'],
    [0.0468, 'Sıfır Manat'],
    [0.5, 'Sıfır Manat'],
    [0.63, 'Sıfır Manat'],
    [0.973, 'Sıfır Manat'],
    [0.999, 'Sıfır Manat'],
    [1.25, 'Bir Manat'],
    [10.99, 'On Manat'],
    [37.06, 'Otuz Yeddi Manat'],
    [37.68, 'Otuz Yeddi Manat'],
  ];

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
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals: [number, string][] = [
    [0.0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, 'Bir Manat'],
    [10.99, 'On Manat'],
    [37.06, 'Otuz Yeddi Manat'],
    [37.68, 'Otuz Yeddi Manat'],
  ];

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

const testOrdinalNumbers: [number, string][] = [
  // Basic ordinals 1-20
  [1, 'Birinci'],
  [2, 'İkinci'],
  [3, 'Üçüncü'],
  [4, 'Dördüncü'],
  [5, 'Beşinci'],
  [6, 'Altıncı'],
  [7, 'Yeddinci'],
  [8, 'Səkkizinci'],
  [9, 'Doqquzuncu'],
  [10, 'Onuncu'],
  [11, 'On Birinci'],
  [12, 'On İkinci'],
  [13, 'On Üçüncü'],
  [14, 'On Dördüncü'],
  [15, 'On Beşinci'],
  [16, 'On Altıncı'],
  [17, 'On Yeddinci'],
  [18, 'On Səkkizinci'],
  [19, 'On Doqquzuncu'],
  [20, 'İyirminci'],

  // Composite numbers (21-29, 30, 40, 50, etc.)
  [21, 'İyirmi Birinci'],
  [22, 'İyirmi İkinci'],
  [23, 'İyirmi Üçüncü'],
  [30, 'Otuzuncu'],
  [40, 'Qırxıncı'],
  [50, 'Əllinci'],
  [60, 'Altmışıncı'],
  [70, 'Yetmişinci'],
  [80, 'Səksəninci'],
  [90, 'Doxsanıncı'],

  // Numbers ending in 1, 2, 3 (various decades)
  [31, 'Otuz Birinci'],
  [32, 'Otuz İkinci'],
  [33, 'Otuz Üçüncü'],
  [41, 'Qırx Birinci'],
  [42, 'Qırx İkinci'],
  [43, 'Qırx Üçüncü'],
  [51, 'Əlli Birinci'],
  [52, 'Əlli İkinci'],
  [53, 'Əlli Üçüncü'],

  // Round numbers (100, 200, 1000, etc.)
  [100, 'Yüzüncü'],
  [200, 'İki Yüzüncü'],
  [1000, 'Mininci'],
  [10000, 'On Mininci'],

  // Larger numbers
  [100000, 'Yüz Mininci'],
  [1000000, 'Bir Milyonuncu'],
  [100001, 'Yüz Min Birinci'],
  [100002, 'Yüz Min İkinci'],
  [100003, 'Yüz Min Üçüncü'],

  // Numbers in the hundreds with endings
  [101, 'Bir Yüz Birinci'],
  [102, 'Bir Yüz İkinci'],
  [103, 'Bir Yüz Üçüncü'],
  [111, 'Bir Yüz On Birinci'],
  [112, 'Bir Yüz On İkinci'],
  [113, 'Bir Yüz On Üçüncü'],
  [123, 'Bir Yüz İyirmi Üçüncü'],

  // Complex numbers
  [1001, 'Min Birinci'],
  [1234, 'Min İki Yüz Otuz Dördüncü'],
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

describe('Test Invalid Inputs', () => {
  const testInvalids: [unknown, string][] = [
    ['abc', 'Invalid Number'],
    ['', 'Invalid Number'],
    [NaN, 'Invalid Number'],
    [Infinity, 'Invalid Number'],
  ];

  test.concurrent.each(testInvalids)('should throw error for %s', (input, message) => {
    expect(() => toWords.convert(input as number)).toThrow(message);
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'On'],
    [100, 'Yüz'],
    [1000, 'Min'],
    [10000, 'On Min'],
    [100000, 'Yüz Min'],
    [1000000, 'Bir Milyon'],
    [10000000, 'On Milyon'],
    [100000000, 'Yüz Milyon'],
    [1000000000, 'Bir Milyard'],
    [10000000000, 'On Milyard'],
    [100000000000, 'Yüz Milyard'],
    [1000000000000, 'Bir Trilyon'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt Inputs', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'Sıfır'],
    [1n, 'Bir'],
    [100n, 'Yüz'],
    [1000n, 'Min'],
    [1000000n, 'Bir Milyon'],
  ];

  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test Negative BigInt Inputs', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'Mənfi Bir'],
    [-100n, 'Mənfi Yüz'],
    [-1000n, 'Mənfi Min'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

describe('Test String Inputs', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'Sıfır'],
    ['1', 'Bir'],
    ['100', 'Yüz'],
    ['-100', 'Mənfi Yüz'],
    ['  100  ', 'Yüz'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Sıfır', () => {
    expect(toWords.convert(0)).toBe('Sıfır');
  });

  test('convert -0 => Sıfır', () => {
    expect(toWords.convert(-0)).toBe('Sıfır');
  });

  test('convert 0.0 => Sıfır', () => {
    expect(toWords.convert(0.0)).toBe('Sıfır');
  });

  test('convert 0n => Sıfır', () => {
    expect(toWords.convert(0n)).toBe('Sıfır');
  });

  test('convert "0" => Sıfır', () => {
    expect(toWords.convert('0')).toBe('Sıfır');
  });

  test('convert 0 with currency => Sıfır Manat', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Sıfır Manat');
  });

  test('convert 0n with currency => Sıfır Manat', () => {
    expect(toWords.convert(0n, { currency: true })).toBe('Sıfır Manat');
  });

  test('convert "0" with currency => Sıfır Manat', () => {
    expect(toWords.convert('0', { currency: true })).toBe('Sıfır Manat');
  });
});

describe('Test Invalid Input Errors', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(NaN)).toThrow('Invalid Number');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number');
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number');
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import kaGe from '../src/locales/ka-GE.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/ka-GE.js';

const localeCode = 'ka-GE';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(kaGe);
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
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, 'ნული'],
  [137, 'ას ოცდაჩვიდმეტი'],
  [700, 'შვიდასი'],
  [1100, 'ათას ასი'],
  [4680, 'ოთხი ათას ექვსას ოთხმოცი'],
  [63892, 'სამოცდასამი ათას რვაას ოთხმოცდათორმეტი'],
  [86100, 'ოთხმოცდაექვსი ათას ასი'],
  [792581, 'შვიდას ოთხმოცდათორმეტი ათას ხუთას ოთხმოცდაერთი'],
  [2741034, 'ორი მილიონ შვიდას ორმოცდაერთი ათას ოცდათოთხმეტი'],
  [86429753, 'ოთხმოცდაექვსი მილიონ ოთხას ოცდაცხრა ათას შვიდას ორმოცდაცამეტი'],
  [975310864, 'ცხრაას სამოცდათხუთმეტი მილიონ სამას ათი ათას რვაას სამოცდაოთხი'],
  [1000000000, 'ერთი მილიარდი'],
  [9876543210, 'ცხრა მილიარდ რვაას სამოცდათექვსმეტი მილიონ ხუთას ორმოცდასამი ათას ორას ათი'],
  [10000000000, 'ათი მილიარდი'],
  [100000000000, 'ასი მილიარდი'],
  [1000000000000, 'ერთი ტრილიონი'],
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
    row[1] = `მინუს ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ლარი`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} ლარი`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} ლარი`;
      return;
    }
    row[0] = -row[0];
    row[1] = `მინუს ${row[1]} ლარი`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} ლარი`;
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
  [0, 'ნული'],
  [0.04, 'ნული მძიმე ნული ოთხი'],
  [0.0468, 'ნული მძიმე ნული ოთხი ექვსი რვა'],
  [0.4, 'ნული მძიმე ოთხი'],
  [0.63, 'ნული მძიმე სამოცდასამი'],
  [0.973, 'ნული მძიმე ცხრაას სამოცდაცამეტი'],
  [0.999, 'ნული მძიმე ცხრაას ოთხმოცდაცხრამეტი'],
  [37.06, 'ოცდაჩვიდმეტი მძიმე ნული ექვსი'],
  [37.068, 'ოცდაჩვიდმეტი მძიმე ნული ექვსი რვა'],
  [37.68, 'ოცდაჩვიდმეტი მძიმე სამოცდარვა'],
  [37.683, 'ოცდაჩვიდმეტი მძიმე ექვსას ოთხმოცდასამი'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `ას ოცდასამი ლარი`],
    ['123', `ას ოცდასამი ლარი`],
    ['123.0', `ას ოცდასამი ლარი და ნული თეთრი`],
    ['123.00', `ას ოცდასამი ლარი და ნული თეთრი`],
    ['0.00', `ნული ლარი და ნული თეთრი`],
    ['-123.00', `მინუს ას ოცდასამი ლარი და ნული თეთრი`],
    ['37.68', `ოცდაჩვიდმეტი ლარი და სამოცდარვა თეთრი`],
  ];

  test.concurrent.each(testIncludeZeroFractional)('convert %s => %s', (input, expected) => {
    expect(
      toWords.convert(input, {
        currency: true,
        includeZeroFractional: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0, 'ნული ლარი'],
  [0.01, 'ნული ლარი და ერთი თეთრი'],
  [0.04, 'ნული ლარი და ოთხი თეთრი'],
  [0.0468, 'ნული ლარი და ხუთი თეთრი'],
  [0.5, 'ნული ლარი და ორმოცდაათი თეთრი'],
  [0.63, 'ნული ლარი და სამოცდასამი თეთრი'],
  [0.973, 'ნული ლარი და ოთხმოცდაჩვიდმეტი თეთრი'],
  [0.999, 'ერთი ლარი'],
  [1.25, 'ერთი ლარი და ოცდახუთი თეთრი'],
  [10.99, 'ათი ლარი და ოთხმოცდაცხრამეტი თეთრი'],
  [37.06, 'ოცდაჩვიდმეტი ლარი და ექვსი თეთრი'],
  [37.68, 'ოცდაჩვიდმეტი ლარი და სამოცდარვა თეთრი'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [0.01, 'ერთი თეთრი'],
    [0.04, 'ოთხი თეთრი'],
    [0.0468, 'ხუთი თეთრი'],
    [0.5, 'ორმოცდაათი თეთრი'],
    [0.63, 'სამოცდასამი თეთრი'],
    [0.973, 'ოთხმოცდაჩვიდმეტი თეთრი'],
    [0.999, 'ერთი ლარი'],
    [1.25, 'ერთი ლარი და ოცდახუთი თეთრი'],
    [10.99, 'ათი ლარი და ოთხმოცდაცხრამეტი თეთრი'],
    [37.06, 'ოცდაჩვიდმეტი ლარი და ექვსი თეთრი'],
    [37.68, 'ოცდაჩვიდმეტი ლარი და სამოცდარვა თეთრი'],
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
    [0, 'ნული ლარი'],
    [0.01, 'ნული ლარი'],
    [0.04, 'ნული ლარი'],
    [0.0468, 'ნული ლარი'],
    [0.5, 'ნული ლარი'],
    [0.63, 'ნული ლარი'],
    [0.973, 'ნული ლარი'],
    [0.999, 'ნული ლარი'],
    [1.25, 'ერთი ლარი'],
    [10.99, 'ათი ლარი'],
    [37.06, 'ოცდაჩვიდმეტი ლარი'],
    [37.68, 'ოცდაჩვიდმეტი ლარი'],
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
    [0, ''],
    [0.01, ''],
    [0.04, ''],
    [0.0468, ''],
    [0.5, ''],
    [0.63, ''],
    [0.973, ''],
    [0.999, ''],
    [1.25, 'ერთი ლარი'],
    [10.99, 'ათი ლარი'],
    [37.06, 'ოცდაჩვიდმეტი ლარი'],
    [37.68, 'ოცდაჩვიდმეტი ლარი'],
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

// Comprehensive Ordinal Tests
const testOrdinalNumbers: [number, string][] = [
  [1, 'პირველი'],
  [2, 'მეორე'],
  [3, 'მესამე'],
  [4, 'მეოთხე'],
  [5, 'მეხუთე'],
  [6, 'მეექვსე'],
  [7, 'მეშვიდე'],
  [8, 'მერვე'],
  [9, 'მეცხრე'],
  [10, 'მეათე'],
  [11, 'მეთერთმეტე'],
  [12, 'მეთორმეტე'],
  [13, 'მეცამეტე'],
  [14, 'მეთოთხმეტე'],
  [15, 'მეთხუთმეტე'],
  [16, 'მეთექვსმეტე'],
  [17, 'მეჩვიდმეტე'],
  [18, 'მეთვრამეტე'],
  [19, 'მეცხრამეტე'],
  [20, 'მეოცე'],
  [21, 'ოცდამეერთე'],
  [22, 'ოცდამეორე'],
  [23, 'ოცდამესამე'],
  [30, 'მეოცდაათე'],
  [40, 'მეორმოცე'],
  [50, 'მეორმოცდაათე'],
  [60, 'მესამოცე'],
  [70, 'მესამოცდაათე'],
  [80, 'მეოთხმოცე'],
  [90, 'მეოთხმოცდაათე'],
  [31, 'ოცდამეთერთმეტე'],
  [32, 'ოცდამეთორმეტე'],
  [33, 'ოცდამეცამეტე'],
  [41, 'ორმოცდამეერთე'],
  [42, 'ორმოცდამეორე'],
  [43, 'ორმოცდამესამე'],
  [51, 'ორმოცდამეთერთმეტე'],
  [52, 'ორმოცდამეთორმეტე'],
  [53, 'ორმოცდამეცამეტე'],
  [100, 'მეასე'],
  [200, 'მეორასე'],
  [1000, 'მეათასე'],
  [10000, 'ათი მეათასე'],
  [100000, 'ასი მეათასე'],
  [1000000, 'ერთი მემილიონე'],
  [100001, 'ასი ათას პირველი'],
  [100002, 'ასი ათას მეორე'],
  [100003, 'ასი ათას მესამე'],
  [101, 'ას პირველი'],
  [102, 'ას მეორე'],
  [103, 'ას მესამე'],
  [111, 'ას მეთერთმეტე'],
  [112, 'ას მეთორმეტე'],
  [113, 'ას მეცამეტე'],
  [123, 'ას ოცდამესამე'],
  [1001, 'ათას პირველი'],
  [1234, 'ათას ორას ოცდამეთოთხმეტე'],
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
  test('should throw error for invalid input type', () => {
    expect(() => toWords.convert('abc' as unknown as number)).toThrow(/Invalid Number/);
  });

  test('should throw error for NaN', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow(/Invalid Number/);
  });

  test('should throw error for negative Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow(/Invalid Number/);
  });
});

describe('Test Powers of Ten', () => {
  const powersOfTen: [number, string][] = [
    [10, 'ათი'],
    [100, 'ასი'],
    [1000, 'ათასი'],
    [10000, 'ათი ათასი'],
    [100000, 'ასი ათასი'],
    [1000000, 'ერთი მილიონი'],
  ];

  test.concurrent.each(powersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt', () => {
  const bigIntCases: [bigint, string][] = [
    [0n, 'ნული'],
    [1n, 'ერთი'],
    [100n, 'ასი'],
    [1000n, 'ათასი'],
  ];

  test.concurrent.each(bigIntCases)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Negative BigInt', () => {
  const negativeBigIntCases: [bigint, string][] = [
    [-1n, 'მინუს ერთი'],
    [-100n, 'მინუს ასი'],
    [-1000n, 'მინუს ათასი'],
  ];

  test.concurrent.each(negativeBigIntCases)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test String Input', () => {
  const stringInputCases: [string, string][] = [
    ['0', 'ნული'],
    ['1', 'ერთი'],
    ['100', 'ასი'],
    ['-100', 'მინუს ასი'],
  ];

  test.concurrent.each(stringInputCases)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => ნული', () => {
    expect(toWords.convert(0)).toBe('ნული');
  });

  test('convert -0 => ნული', () => {
    expect(toWords.convert(-0)).toBe('ნული');
  });

  test('convert 0.0 => ნული', () => {
    expect(toWords.convert(0.0)).toBe('ნული');
  });

  test('convert 0n => ნული', () => {
    expect(toWords.convert(0n)).toBe('ნული');
  });

  test('convert "0" => ნული', () => {
    expect(toWords.convert('0')).toBe('ნული');
  });

  test('convert 0 with currency => ნული ლარი', () => {
    expect(toWords.convert(0, { currency: true })).toBe('ნული ლარი');
  });
});

describe('Test Invalid Input Errors', () => {
  const invalidInputCases: [unknown, string][] = [
    [Number.NaN, 'NaN'],
    [Infinity, 'Infinity'],
    [-Infinity, '-Infinity'],
    ['', 'empty string'],
    ['abc', 'non-numeric string'],
  ];

  test.concurrent.each(invalidInputCases)('convert %s throws error', (input) => {
    expect(() => toWords.convert(input as number)).toThrow(/Invalid Number/);
  });
});

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() matches new ToWords().toOrdinal()', () => {
    const tw = new LocaleToWords();
    expect(localeToOrdinal(1)).toBe(tw.toOrdinal(1));
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

const testFractionStyleKaGE: [number, string][] = [
  [1.1, 'ერთი და ერთი მეათედი'],
  [2.5, 'ორი და ხუთი მეათედი'],
  [1.01, 'ერთი და ერთი მეასედი'],
  [1.45, 'ერთი და ორმოცდახუთი მეასედი'],
  [0.05, 'ნული და ხუთი მეასედი'],
  [1.001, 'ერთი და ერთი მეათასედი'],
  [1.005, 'ერთი და ხუთი მეათასედი'],
  [1.0001, 'ერთი და ერთი მეათი-ათასედი'],
  [1.0005, 'ერთი და ხუთი მეათი-ათასედი'],
  [1.00001, 'ერთი და ერთი მეასი-ათასედი'],
  [1.00005, 'ერთი და ხუთი მეასი-ათასედი'],
  [1.000001, 'ერთი და ერთი მემილიონედი'],
  [1.000005, 'ერთი და ხუთი მემილიონედი'],
  [123.45, 'ას ოცდასამი და ორმოცდახუთი მეასედი'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleKaGE)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'ერთი მძიმე ერთი მილიონ ორას ოცდათოთხმეტი ათას ხუთას სამოცდაშვიდი',
    );
    expect(toWords.convert(1.1234567)).toBe('ერთი მძიმე ერთი მილიონ ორას ოცდათოთხმეტი ათას ხუთას სამოცდაშვიდი');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('ერთი მძიმე ხუთი');
    expect(toWords.convert(0.05)).toBe('ნული მძიმე ნული ხუთი');
  });
});

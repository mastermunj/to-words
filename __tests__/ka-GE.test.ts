import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import kaGe from '../src/locales/ka-GE.js';
import { ToWords as LocaleToWords } from '../src/locales/ka-GE.js';

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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers: [number, string][] = [
  [0, 'ნული'],
  [137, 'ერთი ასი ოცდაათი შვიდი'],
  [700, 'შვიდასი'],
  [1100, 'ერთი ათასი ასი'],
  [4680, 'ოთხი ათასი ექვსი ასი ოთხმოცი'],
  [63892, 'სამოცი სამი ათასი რვა ასი ოთხმოცდაათი ორი'],
  [86100, 'ოთხმოცი ექვსი ათასი ასი'],
  [792581, 'შვიდი ასი ოთხმოცდაათი ორი ათასი ხუთი ასი ოთხმოცი ერთი'],
  [2741034, 'ორი მილიონი შვიდი ასი ორმოცი ერთი ათასი ოცდაათი ოთხი'],
  [86429753, 'ოთხმოცი ექვსი მილიონი ოთხი ასი ოცი ცხრა ათასი შვიდი ასი ორმოცდაათი სამი'],
  [975310864, 'ცხრა ასი სამოცდაათი ხუთი მილიონი სამი ასი ათი ათასი რვა ასი სამოცი ოთხი'],
  [1000000000, 'ერთი მილიარდი'],
  [9876543210, 'ცხრა მილიარდი რვა ასი სამოცდაათი ექვსი მილიონი ხუთი ასი ორმოცი სამი ათასი ორი ასი ათი'],
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
  [0.63, 'ნული მძიმე სამოცი სამი'],
  [0.973, 'ნული მძიმე ცხრა ასი სამოცდაათი სამი'],
  [0.999, 'ნული მძიმე ცხრა ასი ოთხმოცდაათი ცხრა'],
  [37.06, 'ოცდაათი შვიდი მძიმე ნული ექვსი'],
  [37.068, 'ოცდაათი შვიდი მძიმე ნული ექვსი რვა'],
  [37.68, 'ოცდაათი შვიდი მძიმე სამოცი რვა'],
  [37.683, 'ოცდაათი შვიდი მძიმე ექვსი ასი ოთხმოცი სამი'],
];

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
  [0.63, 'ნული ლარი და სამოცი სამი თეთრი'],
  [0.973, 'ნული ლარი და ოთხმოცდაათი შვიდი თეთრი'],
  [0.999, 'ერთი ლარი'],
  [1.25, 'ერთი ლარი და ოცი ხუთი თეთრი'],
  [10.99, 'ათი ლარი და ოთხმოცდაათი ცხრა თეთრი'],
  [37.06, 'ოცდაათი შვიდი ლარი და ექვსი თეთრი'],
  [37.68, 'ოცდაათი შვიდი ლარი და სამოცი რვა თეთრი'],
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
    [0.63, 'სამოცი სამი თეთრი'],
    [0.973, 'ოთხმოცდაათი შვიდი თეთრი'],
    [0.999, 'ერთი ლარი'],
    [1.25, 'ერთი ლარი და ოცი ხუთი თეთრი'],
    [10.99, 'ათი ლარი და ოთხმოცდაათი ცხრა თეთრი'],
    [37.06, 'ოცდაათი შვიდი ლარი და ექვსი თეთრი'],
    [37.68, 'ოცდაათი შვიდი ლარი და სამოცი რვა თეთრი'],
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
    [37.06, 'ოცდაათი შვიდი ლარი'],
    [37.68, 'ოცდაათი შვიდი ლარი'],
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
    [37.06, 'ოცდაათი შვიდი ლარი'],
    [37.68, 'ოცდაათი შვიდი ლარი'],
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
  [21, 'ოცი პირველი'],
  [22, 'ოცი მეორე'],
  [23, 'ოცი მესამე'],
  [30, 'მეოცდაათე'],
  [40, 'მეორმოცე'],
  [50, 'მეორმოცდაათე'],
  [60, 'მესამოცე'],
  [70, 'მესამოცდაათე'],
  [80, 'მეოთხმოცე'],
  [90, 'მეოთხმოცდაათე'],
  [31, 'ოცდაათი პირველი'],
  [32, 'ოცდაათი მეორე'],
  [33, 'ოცდაათი მესამე'],
  [41, 'ორმოცი პირველი'],
  [42, 'ორმოცი მეორე'],
  [43, 'ორმოცი მესამე'],
  [51, 'ორმოცდაათი პირველი'],
  [52, 'ორმოცდაათი მეორე'],
  [53, 'ორმოცდაათი მესამე'],
  [100, 'მეასე'],
  [200, 'მეორასე'],
  [1000, 'ერთი ათასე'],
  [10000, 'ათი ათასე'],
  [100000, 'ასი ათასე'],
  [1000000, 'ერთი მილიონე'],
  [100001, 'ასი ათასი პირველი'],
  [100002, 'ასი ათასი მეორე'],
  [100003, 'ასი ათასი მესამე'],
  [101, 'ერთი ასი პირველი'],
  [102, 'ერთი ასი მეორე'],
  [103, 'ერთი ასი მესამე'],
  [111, 'ერთი ასი მეთერთმეტე'],
  [112, 'ერთი ასი მეთორმეტე'],
  [113, 'ერთი ასი მეცამეტე'],
  [123, 'ერთი ასი ოცი მესამე'],
  [1001, 'ერთი ათასი პირველი'],
  [1234, 'ერთი ათასი ორი ასი ოცდაათი მეოთხე'],
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
    expect(() => toWords.convert('abc' as unknown as number)).toThrow();
  });

  test('should throw error for NaN', () => {
    expect(() => toWords.convert(NaN)).toThrow();
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('should throw error for negative Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });
});

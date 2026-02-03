import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import elGr from '../src/locales/el-GR.js';
import { ToWords as LocaleToWords } from '../src/locales/el-GR.js';

const localeCode = 'el-GR';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(elGr);
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
  [0, 'Μηδέν'],
  [137, 'Εκατό Τριάντα Επτά'],
  [700, 'Επτακόσια'],
  [1100, 'Χίλια Εκατό'],
  [4680, 'Τέσσερα Χιλιάδες Εξακόσια Ογδόντα'],
  [63892, 'Εξήντα Τρία Χιλιάδες Οκτακόσια Ενενήντα Δύο'],
  [86100, 'Ογδόντα Έξι Χιλιάδες Εκατό'],
  [792581, 'Επτακόσια Ενενήντα Δύο Χιλιάδες Πεντακόσια Ογδόντα Ένα'],
  [2741034, 'Δύο Εκατομμύριο Επτακόσια Σαράντα Ένα Χιλιάδες Τριάντα Τέσσερα'],
  [86429753, 'Ογδόντα Έξι Εκατομμύριο Τετρακόσια Είκοσι Εννέα Χιλιάδες Επτακόσια Πενήντα Τρία'],
  [975310864, 'Εννιακόσια Εβδομήντα Πέντε Εκατομμύριο Τριακόσια Δέκα Χιλιάδες Οκτακόσια Εξήντα Τέσσερα'],
  [
    9876543210,
    'Εννέα Δισεκατομμύριο Οκτακόσια Εβδομήντα Έξι Εκατομμύριο Πεντακόσια Σαράντα Τρία Χιλιάδες Διακόσια Δέκα',
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
    row[1] = `Μείον ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Ευρώ Μόνο`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Ευρώ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Ευρώ Μόνο`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Μείον ${row[1]} Ευρώ Μόνο`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Ευρώ Μόνο`;
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
  [0.0, 'Μηδέν'],
  [0.04, 'Μηδέν Κόμμα Μηδέν Τέσσερα'],
  [0.4, 'Μηδέν Κόμμα Τέσσερα'],
  [0.63, 'Μηδέν Κόμμα Εξήντα Τρία'],
  [0.973, 'Μηδέν Κόμμα Εννιακόσια Εβδομήντα Τρία'],
  [37.06, 'Τριάντα Επτά Κόμμα Μηδέν Έξι'],
  [37.68, 'Τριάντα Επτά Κόμμα Εξήντα Οκτώ'],
];

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'Μηδέν Ευρώ Μόνο'],
  [0.04, 'Μηδέν Ευρώ Και Τέσσερα Λεπτά Μόνο'],
  [0.4, 'Μηδέν Ευρώ Και Σαράντα Λεπτά Μόνο'],
  [0.63, 'Μηδέν Ευρώ Και Εξήντα Τρία Λεπτά Μόνο'],
  [37.06, 'Τριάντα Επτά Ευρώ Και Έξι Λεπτά Μόνο'],
  [37.68, 'Τριάντα Επτά Ευρώ Και Εξήντα Οκτώ Λεπτά Μόνο'],
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
      row[1] = (row[1] as string).replace('Μηδέν Ευρώ Και ', '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Και [\\wΆ-ώ ]+ Λεπτά`), '');
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
  [1, 'Πρώτο'],
  [2, 'Δεύτερο'],
  [3, 'Τρίτο'],
  [4, 'Τέταρτο'],
  [5, 'Πέμπτο'],
  [6, 'Έκτο'],
  [7, 'Έβδομο'],
  [8, 'Όγδοο'],
  [9, 'Ένατο'],
  [10, 'Δέκατο'],
  [11, 'Ενδέκατο'],
  [12, 'Δωδέκατο'],
  [20, 'Εικοστό'],
  [21, 'Είκοσι Πρώτο'],
  [100, 'Εκατοστό'],
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

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Δέκα'],
  [100, 'Εκατό'],
  [1000, 'Χίλια'],
  [10000, 'Δέκα Χιλιάδες'],
  [100000, 'Εκατό Χιλιάδες'],
  [1000000, 'Ένα Εκατομμύριο'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInts: [bigint, string][] = [
  [0n, 'Μηδέν'],
  [1n, 'Ένα'],
  [100n, 'Εκατό'],
  [1000n, 'Χίλια'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInts: [bigint, string][] = [
  [-1n, 'Μείον Ένα'],
  [-100n, 'Μείον Εκατό'],
  [-1000n, 'Μείον Χίλια'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'Μηδέν'],
  ['1', 'Ένα'],
  ['100', 'Εκατό'],
  ['-100', 'Μείον Εκατό'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Μηδέν', () => {
    expect(toWords.convert(0)).toBe('Μηδέν');
  });

  test('convert -0 => Μηδέν', () => {
    expect(toWords.convert(-0)).toBe('Μηδέν');
  });

  test('convert 0.0 => Μηδέν', () => {
    expect(toWords.convert(0.0)).toBe('Μηδέν');
  });

  test('convert 0n => Μηδέν', () => {
    expect(toWords.convert(0n)).toBe('Μηδέν');
  });

  test('convert "0" => Μηδέν', () => {
    expect(toWords.convert('0')).toBe('Μηδέν');
  });

  test('convert 0 with currency => Μηδέν Ευρώ Μόνο', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Μηδέν Ευρώ Μόνο');
  });
});

describe('Test Invalid Input', () => {
  test('should throw error for NaN', () => {
    expect(() => toWords.convert(NaN)).toThrow('Invalid Number "NaN"');
  });

  test('should throw error for Infinity', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('should throw error for -Infinity', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('should throw error for empty string', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('should throw error for non-numeric string', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

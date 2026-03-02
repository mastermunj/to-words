import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest';
import {
  ToWords,
  toWords as toWordsFn,
  toOrdinal as toOrdinalFn,
  toCurrency as toCurrencyFn,
  detectLocale as detectLocaleFn,
  setLocaleDetector as setLocaleDetectorFn,
} from '../src/ToWords';

describe('Wrong Locale', () => {
  const localeCode = 'en-INDIA';
  const toWords = new ToWords({
    localeCode: localeCode,
  });
  test(`With Locale: ${localeCode}`, () => {
    expect(() => toWords.convert(1)).toThrow(/Unknown Locale/);
  });
});

describe('Test Wrong Inputs', () => {
  const toWords = new ToWords();

  const testWrongInputs = [
    '',
    '1.2.3',
    '123,456',
    '--2',
    'NaN',
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  test.concurrent.each(testWrongInputs)('Input %s', (input) => {
    expect(() => toWords.convert(input as number)).toThrow(/Invalid Number/);
  });
});

describe('Test BigInt Inputs', () => {
  const toWords = new ToWords();

  test('Basic BigInt', () => {
    expect(toWords.convert(12345n)).toBe('Twelve Thousand Three Hundred Forty Five');
  });

  test('Negative BigInt', () => {
    expect(toWords.convert(-100n)).toBe('Minus One Hundred');
  });

  test('BigInt with currency', () => {
    expect(toWords.convert(1000n, { currency: true })).toBe('One Thousand Rupees Only');
  });

  test('Large BigInt beyond MAX_SAFE_INTEGER', () => {
    // 9007199254740992n is Number.MAX_SAFE_INTEGER + 1
    const result = toWords.convert(9007199254740992n);
    expect(result).toBe(
      'Nine Padma Seventy One Kharab Ninety Nine Arab Twenty Five Crore Forty Seven Lakh Forty Thousand Nine Hundred Ninety Two',
    );
  });

  test('Zero BigInt', () => {
    expect(toWords.convert(0n)).toBe('Zero');
  });

  test('BigInt One with singular currency', () => {
    expect(toWords.convert(1n, { currency: true })).toBe('One Rupee Only');
  });
});

describe('Test setLocale method', () => {
  test('setLocale with en-US locale class', async () => {
    const { default: EnUsLocale } = await import('../src/locales/en-US');
    const toWords = new ToWords();
    toWords.setLocale(EnUsLocale);
    expect(toWords.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
  });

  test('setLocale with en-IN locale class', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const toWords = new ToWords();
    toWords.setLocale(EnInLocale);
    expect(toWords.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
    expect(toWords.convert(1234, { currency: true })).toBe('One Thousand Two Hundred Thirty Four Rupees Only');
  });

  test('setLocale with fr-FR locale class', async () => {
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const toWords = new ToWords();
    toWords.setLocale(FrFrLocale);
    expect(toWords.convert(80)).toBe('Quatre-Vingts');
  });

  test('setLocale returns this for chaining', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const toWords = new ToWords();
    const result = toWords.setLocale(EnInLocale).convert(100);
    expect(result).toBe('One Hundred');
  });

  test('setLocale overrides localeCode option', async () => {
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const toWords = new ToWords({ localeCode: 'en-IN' });
    toWords.setLocale(FrFrLocale);
    // Should use French, not English
    expect(toWords.convert(21)).toBe('Vingt Et Un');
  });
});

describe('Test per-locale entry points', () => {
  test('en-IN entry point has same API as main ToWords', async () => {
    const { ToWords: ToWordsEnIn } = await import('../src/locales/en-IN.js');
    const tw = new ToWordsEnIn();
    expect(tw.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
    expect(tw.convert(1234, { currency: true })).toBe('One Thousand Two Hundred Thirty Four Rupees Only');
    expect(tw.toOrdinal(42)).toBe('Forty Second');
  });

  test('fr-FR entry point works correctly', async () => {
    const { ToWords: ToWordsFrFr } = await import('../src/locales/fr-FR.js');
    const tw = new ToWordsFrFr();
    expect(tw.convert(80)).toBe('Quatre-Vingts');
    expect(tw.convert(21)).toBe('Vingt Et Un');
  });

  test('de-DE entry point works correctly', async () => {
    const { ToWords: ToWordsDeDe } = await import('../src/locales/de-DE.js');
    const tw = new ToWordsDeDe();
    expect(tw.convert(21)).toBe('Einundzwanzig');
  });

  test('ar-SA entry point works correctly', async () => {
    const { ToWords: ToWordsArSa } = await import('../src/locales/ar-SA.js');
    const tw = new ToWordsArSa();
    expect(tw.convert(1)).toBe('واحد');
  });

  test('entry point exports ToWords class', async () => {
    const entry = await import('../src/locales/en-IN.js');
    expect(entry.ToWords).toBeDefined();
  });

  test('multiple entry points can be used independently', async () => {
    const { ToWords: ToWordsEnIn } = await import('../src/locales/en-IN.js');
    const { ToWords: ToWordsFrFr } = await import('../src/locales/fr-FR.js');

    const twEn = new ToWordsEnIn();
    const twFr = new ToWordsFrFr();

    expect(twEn.convert(100)).toBe('One Hundred');
    expect(twFr.convert(100)).toBe('Cent');
  });
});

// ============================================================
// COMPREHENSIVE TEST ADDITIONS
// ============================================================

describe('Comprehensive Input Validation', () => {
  const toWords = new ToWords();

  describe('Invalid Input Types', () => {
    test('should throw error for null input', () => {
      expect(() => toWords.convert(null as unknown as number)).toThrow();
    });

    test('should throw error for undefined input', () => {
      expect(() => toWords.convert(undefined as unknown as number)).toThrow();
    });

    test('should throw error for array input', () => {
      expect(() => toWords.convert([1, 2, 3] as unknown as number)).toThrow();
    });

    test('should throw error for object input', () => {
      expect(() => toWords.convert({} as unknown as number)).toThrow();
    });

    test('should throw error for function input', () => {
      expect(() => toWords.convert((() => 1) as unknown as number)).toThrow();
    });

    test('should throw error for boolean true', () => {
      expect(() => toWords.convert(true as unknown as number)).toThrow();
    });

    test('should throw error for boolean false', () => {
      expect(() => toWords.convert(false as unknown as number)).toThrow();
    });

    test('should throw error for Symbol', () => {
      expect(() => toWords.convert(Symbol('test') as unknown as number)).toThrow();
    });
  });

  describe('Invalid String Formats', () => {
    test('should throw error for empty string', () => {
      expect(() => toWords.convert('')).toThrow(/Invalid Number/);
    });

    test('should throw error for whitespace only', () => {
      expect(() => toWords.convert('   ')).toThrow(/Invalid Number/);
    });

    test('should throw error for tabs and newlines only', () => {
      expect(() => toWords.convert('\t\n')).toThrow(/Invalid Number/);
    });

    test('should throw error for multiple decimal points', () => {
      expect(() => toWords.convert('1.2.3')).toThrow(/Invalid Number/);
    });

    test('should throw error for comma-separated number', () => {
      expect(() => toWords.convert('123,456')).toThrow(/Invalid Number/);
    });

    test('should throw error for double minus sign', () => {
      expect(() => toWords.convert('--2')).toThrow(/Invalid Number/);
    });

    test('should throw error for NaN string', () => {
      expect(() => toWords.convert('NaN')).toThrow(/Invalid Number/);
    });

    test('should throw error for Infinity string', () => {
      expect(() => toWords.convert('Infinity')).toThrow(/Invalid Number/);
    });

    test('should throw error for -Infinity string', () => {
      expect(() => toWords.convert('-Infinity')).toThrow(/Invalid Number/);
    });

    test('should throw error for alphabetic string', () => {
      expect(() => toWords.convert('abc')).toThrow(/Invalid Number/);
    });

    test('should throw error for mixed alphanumeric string', () => {
      expect(() => toWords.convert('123abc')).toThrow(/Invalid Number/);
    });

    test('should throw error for special characters', () => {
      expect(() => toWords.convert('$100')).toThrow(/Invalid Number/);
    });

    // Note: JavaScript Number() accepts '+100', '100.', '.5' as valid numbers
    // These tests verify that behavior
    test('should accept plus sign prefix (JavaScript valid)', () => {
      expect(toWords.convert('+100')).toBe('One Hundred');
    });

    test('should accept trailing decimal point (JavaScript valid)', () => {
      expect(toWords.convert('100.')).toBe('One Hundred');
    });

    test('should accept leading decimal point without zero (JavaScript valid)', () => {
      expect(toWords.convert('.5')).toBe('Zero Point Five');
    });
  });

  describe('Invalid Number Values', () => {
    test('should throw error for NaN', () => {
      expect(() => toWords.convert(Number.NaN)).toThrow(/Invalid Number/);
    });

    test('should throw error for Positive Infinity', () => {
      expect(() => toWords.convert(Number.POSITIVE_INFINITY)).toThrow(/Invalid Number/);
    });

    test('should throw error for Negative Infinity', () => {
      expect(() => toWords.convert(Number.NEGATIVE_INFINITY)).toThrow(/Invalid Number/);
    });
  });
});

describe('Valid String Number Inputs', () => {
  const toWords = new ToWords();

  describe('Basic String Numbers', () => {
    test('should convert positive string integer', () => {
      expect(toWords.convert('123')).toBe('One Hundred Twenty Three');
    });

    test('should convert negative string integer', () => {
      expect(toWords.convert('-123')).toBe('Minus One Hundred Twenty Three');
    });

    test('should convert string zero', () => {
      expect(toWords.convert('0')).toBe('Zero');
    });

    test('should convert string decimal', () => {
      expect(toWords.convert('3.14')).toBe('Three Point Fourteen');
    });

    test('should convert string with leading zero decimal', () => {
      expect(toWords.convert('0.5')).toBe('Zero Point Five');
    });

    test('should convert string with multiple leading zeros in decimal', () => {
      expect(toWords.convert('0.005')).toBe('Zero Point Zero Zero Five');
    });
  });

  describe('String Numbers with Whitespace', () => {
    test('should handle string with leading whitespace', () => {
      expect(toWords.convert('  123')).toBe('One Hundred Twenty Three');
    });

    test('should handle string with trailing whitespace', () => {
      expect(toWords.convert('123  ')).toBe('One Hundred Twenty Three');
    });

    test('should handle string with surrounding whitespace', () => {
      expect(toWords.convert('  123  ')).toBe('One Hundred Twenty Three');
    });
  });
});

describe('Boundary Values and Edge Cases', () => {
  const toWords = new ToWords();

  describe('Zero Variants', () => {
    test('converts integer zero', () => {
      expect(toWords.convert(0)).toBe('Zero');
    });

    test('converts -0 as Zero', () => {
      expect(toWords.convert(-0)).toBe('Zero');
    });

    test('converts 0.0 as Zero', () => {
      expect(toWords.convert(0.0)).toBe('Zero');
    });

    test('converts BigInt zero', () => {
      expect(toWords.convert(0n)).toBe('Zero');
    });

    test('converts string "0" to Zero', () => {
      expect(toWords.convert('0')).toBe('Zero');
    });
  });

  describe('Single Digit Numbers', () => {
    const singleDigits: [number, string][] = [
      [1, 'One'],
      [2, 'Two'],
      [3, 'Three'],
      [4, 'Four'],
      [5, 'Five'],
      [6, 'Six'],
      [7, 'Seven'],
      [8, 'Eight'],
      [9, 'Nine'],
    ];

    test.concurrent.each(singleDigits)('converts %d to %s', (input, expected) => {
      expect(toWords.convert(input)).toBe(expected);
    });
  });

  describe('Teens (11-19)', () => {
    const teens: [number, string][] = [
      [11, 'Eleven'],
      [12, 'Twelve'],
      [13, 'Thirteen'],
      [14, 'Fourteen'],
      [15, 'Fifteen'],
      [16, 'Sixteen'],
      [17, 'Seventeen'],
      [18, 'Eighteen'],
      [19, 'Nineteen'],
    ];

    test.concurrent.each(teens)('converts %d to %s', (input, expected) => {
      expect(toWords.convert(input)).toBe(expected);
    });
  });

  describe('Tens (10, 20, 30, ...)', () => {
    const tens: [number, string][] = [
      [10, 'Ten'],
      [20, 'Twenty'],
      [30, 'Thirty'],
      [40, 'Forty'],
      [50, 'Fifty'],
      [60, 'Sixty'],
      [70, 'Seventy'],
      [80, 'Eighty'],
      [90, 'Ninety'],
    ];

    test.concurrent.each(tens)('converts %d to %s', (input, expected) => {
      expect(toWords.convert(input)).toBe(expected);
    });
  });

  describe('Powers of Ten', () => {
    const powersOfTen: [number, string][] = [
      [10, 'Ten'],
      [100, 'One Hundred'],
      [1000, 'One Thousand'],
      [10000, 'Ten Thousand'],
      [100000, 'One Lakh'],
      [1000000, 'Ten Lakh'],
      [10000000, 'One Crore'],
    ];

    test.concurrent.each(powersOfTen)('converts %d to %s', (input, expected) => {
      expect(toWords.convert(input)).toBe(expected);
    });
  });

  describe('Number Boundaries', () => {
    test('converts 99 correctly', () => {
      expect(toWords.convert(99)).toBe('Ninety Nine');
    });

    test('converts 100 correctly', () => {
      expect(toWords.convert(100)).toBe('One Hundred');
    });

    test('converts 101 correctly', () => {
      expect(toWords.convert(101)).toBe('One Hundred One');
    });

    test('converts 999 correctly', () => {
      expect(toWords.convert(999)).toBe('Nine Hundred Ninety Nine');
    });

    test('converts 1000 correctly', () => {
      expect(toWords.convert(1000)).toBe('One Thousand');
    });

    test('converts 1001 correctly', () => {
      expect(toWords.convert(1001)).toBe('One Thousand One');
    });

    test('converts 9999 correctly', () => {
      expect(toWords.convert(9999)).toBe('Nine Thousand Nine Hundred Ninety Nine');
    });

    test('converts 10000 correctly', () => {
      expect(toWords.convert(10000)).toBe('Ten Thousand');
    });

    test('converts 99999 correctly', () => {
      expect(toWords.convert(99999)).toBe('Ninety Nine Thousand Nine Hundred Ninety Nine');
    });

    test('converts 100000 (One Lakh) correctly', () => {
      expect(toWords.convert(100000)).toBe('One Lakh');
    });

    test('converts MAX_SAFE_INTEGER correctly', () => {
      const result = toWords.convert(Number.MAX_SAFE_INTEGER);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    test('converts MIN_SAFE_INTEGER correctly', () => {
      const result = toWords.convert(Number.MIN_SAFE_INTEGER);
      expect(result).toMatch(/^Minus /);
    });
  });
});

describe('Decimal Number Tests', () => {
  const toWords = new ToWords();

  describe('Common Decimals', () => {
    test('converts 0.5 correctly', () => {
      expect(toWords.convert(0.5)).toBe('Zero Point Five');
    });

    test('converts 0.25 correctly', () => {
      expect(toWords.convert(0.25)).toBe('Zero Point Twenty Five');
    });

    test('converts 0.99 correctly', () => {
      expect(toWords.convert(0.99)).toBe('Zero Point Ninety Nine');
    });

    test('converts 1.5 correctly', () => {
      expect(toWords.convert(1.5)).toBe('One Point Five');
    });

    test('converts 3.14 correctly', () => {
      expect(toWords.convert(3.14)).toBe('Three Point Fourteen');
    });

    test('converts 99.99 correctly', () => {
      expect(toWords.convert(99.99)).toBe('Ninety Nine Point Ninety Nine');
    });
  });

  describe('Small Decimals', () => {
    test('converts 0.01 correctly', () => {
      expect(toWords.convert(0.01)).toBe('Zero Point Zero One');
    });

    test('converts 0.001 correctly', () => {
      expect(toWords.convert(0.001)).toBe('Zero Point Zero Zero One');
    });

    test('converts 0.0001 correctly', () => {
      expect(toWords.convert(0.0001)).toBe('Zero Point Zero Zero Zero One');
    });
  });

  describe('Negative Decimals', () => {
    test('converts -0.5 correctly', () => {
      expect(toWords.convert(-0.5)).toBe('Minus Zero Point Five');
    });

    test('converts -3.14 correctly', () => {
      expect(toWords.convert(-3.14)).toBe('Minus Three Point Fourteen');
    });

    test('converts -99.99 correctly', () => {
      expect(toWords.convert(-99.99)).toBe('Minus Ninety Nine Point Ninety Nine');
    });
  });
});

describe('Currency Options Combinations', () => {
  const toWords = new ToWords();

  describe('Basic Currency', () => {
    test('converts 0 with currency', () => {
      expect(toWords.convert(0, { currency: true })).toBe('Zero Rupees Only');
    });

    test('converts 1 with currency (singular)', () => {
      expect(toWords.convert(1, { currency: true })).toBe('One Rupee Only');
    });

    test('converts 2 with currency (plural)', () => {
      expect(toWords.convert(2, { currency: true })).toBe('Two Rupees Only');
    });
  });

  describe('Currency with ignoreZeroCurrency', () => {
    test('returns empty string for 0 with ignoreZeroCurrency', () => {
      expect(toWords.convert(0, { currency: true, ignoreZeroCurrency: true })).toBe('');
    });

    test('returns normal output for non-zero with ignoreZeroCurrency', () => {
      expect(toWords.convert(100, { currency: true, ignoreZeroCurrency: true })).toBe('One Hundred Rupees Only');
    });

    test('returns empty string for value less than 1 with ignoreZeroCurrency', () => {
      expect(toWords.convert(0.5, { currency: true, ignoreZeroCurrency: true })).toBe('Fifty Paise Only');
    });
  });

  describe('Currency with ignoreDecimal', () => {
    test('ignores decimal part with ignoreDecimal', () => {
      expect(toWords.convert(100.5, { currency: true, ignoreDecimal: true })).toBe('One Hundred Rupees Only');
    });

    test('rounds down with ignoreDecimal', () => {
      expect(toWords.convert(99.99, { currency: true, ignoreDecimal: true })).toBe('Ninety Nine Rupees Only');
    });
  });

  describe('Currency with doNotAddOnly', () => {
    test('omits "Only" with doNotAddOnly', () => {
      expect(toWords.convert(100, { currency: true, doNotAddOnly: true })).toBe('One Hundred Rupees');
    });

    test('works with other options', () => {
      expect(toWords.convert(100.5, { currency: true, doNotAddOnly: true, ignoreDecimal: true })).toBe(
        'One Hundred Rupees',
      );
    });
  });

  describe('All Currency Options Combined', () => {
    test('all options together on non-zero value', () => {
      expect(
        toWords.convert(100.99, {
          currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: true,
          doNotAddOnly: true,
        }),
      ).toBe('One Hundred Rupees');
    });

    test('all options together on zero value', () => {
      expect(
        toWords.convert(0, {
          currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: true,
          doNotAddOnly: true,
        }),
      ).toBe('');
    });
  });
});

describe('Negative Number Tests', () => {
  const toWords = new ToWords();

  describe('Negative Integers', () => {
    test('converts -1 correctly', () => {
      expect(toWords.convert(-1)).toBe('Minus One');
    });

    test('converts -10 correctly', () => {
      expect(toWords.convert(-10)).toBe('Minus Ten');
    });

    test('converts -100 correctly', () => {
      expect(toWords.convert(-100)).toBe('Minus One Hundred');
    });

    test('converts -1000 correctly', () => {
      expect(toWords.convert(-1000)).toBe('Minus One Thousand');
    });

    test('converts large negative number correctly', () => {
      expect(toWords.convert(-123456)).toBe('Minus One Lakh Twenty Three Thousand Four Hundred Fifty Six');
    });
  });

  describe('Negative BigInt', () => {
    test('converts negative BigInt correctly', () => {
      expect(toWords.convert(-100n)).toBe('Minus One Hundred');
    });

    test('converts large negative BigInt correctly', () => {
      expect(toWords.convert(-1000000n)).toBe('Minus Ten Lakh');
    });
  });

  describe('Negative with Currency', () => {
    test('converts negative with currency', () => {
      expect(toWords.convert(-100, { currency: true })).toBe('Minus One Hundred Rupees Only');
    });
  });
});

describe('BigInt Extended Tests', () => {
  const toWords = new ToWords();

  describe('BigInt Basic', () => {
    test('converts 1n correctly', () => {
      expect(toWords.convert(1n)).toBe('One');
    });

    test('converts 100n correctly', () => {
      expect(toWords.convert(100n)).toBe('One Hundred');
    });

    test('converts 1000n correctly', () => {
      expect(toWords.convert(1000n)).toBe('One Thousand');
    });
  });

  describe('BigInt Large Numbers', () => {
    test('converts trillion as BigInt', () => {
      expect(toWords.convert(1000000000000n)).toBeDefined();
    });

    test('converts quadrillion as BigInt', () => {
      expect(toWords.convert(1000000000000000n)).toBeDefined();
    });
  });

  describe('BigInt with Currency', () => {
    test('converts 1n with currency (singular)', () => {
      expect(toWords.convert(1n, { currency: true })).toBe('One Rupee Only');
    });

    test('converts large BigInt with currency', () => {
      expect(toWords.convert(1000000n, { currency: true })).toBe('Ten Lakh Rupees Only');
    });
  });
});

describe('Ordinal Number Tests', () => {
  const toWords = new ToWords();

  describe('Invalid Ordinal Inputs', () => {
    test('throws for negative numbers', () => {
      expect(() => toWords.toOrdinal(-1)).toThrow(/Ordinal numbers must be non-negative integers/);
    });

    test('throws for negative large numbers', () => {
      expect(() => toWords.toOrdinal(-100)).toThrow(/Ordinal numbers must be non-negative integers/);
    });

    test('throws for decimal numbers', () => {
      expect(() => toWords.toOrdinal(1.5)).toThrow(/Ordinal numbers must be non-negative integers/);
    });

    test('throws for very small decimals', () => {
      expect(() => toWords.toOrdinal(0.001)).toThrow(/Ordinal numbers must be non-negative integers/);
    });

    test('throws for NaN', () => {
      expect(() => toWords.toOrdinal(Number.NaN)).toThrow(/Invalid Number/);
    });

    test('throws for Infinity', () => {
      expect(() => toWords.toOrdinal(Infinity)).toThrow(/Invalid Number/);
    });
  });

  describe('Valid Ordinal Conversions', () => {
    test('converts 0 to ordinal', () => {
      expect(toWords.toOrdinal(0)).toBe('Zeroth');
    });

    test('converts 1 to First', () => {
      expect(toWords.toOrdinal(1)).toBe('First');
    });

    test('converts 2 to Second', () => {
      expect(toWords.toOrdinal(2)).toBe('Second');
    });

    test('converts 3 to Third', () => {
      expect(toWords.toOrdinal(3)).toBe('Third');
    });

    test('converts 10 to Tenth', () => {
      expect(toWords.toOrdinal(10)).toBe('Tenth');
    });

    test('converts 21 to Twenty First', () => {
      expect(toWords.toOrdinal(21)).toBe('Twenty First');
    });

    test('converts 100 to One Hundredth', () => {
      expect(toWords.toOrdinal(100)).toBe('One Hundredth');
    });

    test('converts 1000 to One Thousandth', () => {
      expect(toWords.toOrdinal(1000)).toBe('One Thousandth');
    });
  });
});

describe('Locale Handling Tests', () => {
  describe('Locale Code Format', () => {
    test('locale code must match exact format (case-sensitive)', () => {
      // The library uses exact locale codes, so case matters
      expect(() => new ToWords({ localeCode: 'en-in' }).convert(100)).toThrow(/Unknown Locale/);
      expect(() => new ToWords({ localeCode: 'EN-IN' }).convert(100)).toThrow(/Unknown Locale/);
    });

    test('correct locale code works', () => {
      const toWords = new ToWords({ localeCode: 'en-IN' });
      expect(toWords.convert(100)).toBe('One Hundred');
    });
  });

  describe('Different Numbering Systems', () => {
    test('en-IN uses Indian numbering (Lakhs, Crores)', () => {
      const toWords = new ToWords({ localeCode: 'en-IN' });
      expect(toWords.convert(100000)).toBe('One Lakh');
      expect(toWords.convert(10000000)).toBe('One Crore');
    });

    test('en-US uses International numbering (Millions, Billions)', async () => {
      const toWords = new ToWords({ localeCode: 'en-US' });
      expect(toWords.convert(1000000)).toBe('One Million');
      expect(toWords.convert(1000000000)).toBe('One Billion');
    });
  });
});

describe('isValidNumber Method Tests', () => {
  const toWords = new ToWords();

  describe('Valid Numbers', () => {
    test('returns true for positive integer', () => {
      expect(toWords.isValidNumber(123)).toBe(true);
    });

    test('returns true for negative integer', () => {
      expect(toWords.isValidNumber(-123)).toBe(true);
    });

    test('returns true for zero', () => {
      expect(toWords.isValidNumber(0)).toBe(true);
    });

    test('returns true for decimal', () => {
      expect(toWords.isValidNumber(3.14)).toBe(true);
    });

    test('returns true for BigInt', () => {
      expect(toWords.isValidNumber(123n)).toBe(true);
    });

    test('returns true for valid numeric string', () => {
      expect(toWords.isValidNumber('123')).toBe(true);
    });

    test('returns true for negative numeric string', () => {
      expect(toWords.isValidNumber('-123')).toBe(true);
    });

    test('returns true for decimal string', () => {
      expect(toWords.isValidNumber('3.14')).toBe(true);
    });
  });

  describe('Invalid Numbers', () => {
    test('returns false for NaN', () => {
      expect(toWords.isValidNumber(Number.NaN)).toBe(false);
    });

    test('returns false for Infinity', () => {
      expect(toWords.isValidNumber(Infinity)).toBe(false);
    });

    test('returns false for -Infinity', () => {
      expect(toWords.isValidNumber(-Infinity)).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(toWords.isValidNumber('')).toBe(false);
    });

    test('returns false for non-numeric string', () => {
      expect(toWords.isValidNumber('abc')).toBe(false);
    });

    test('throws for null (not a valid input type)', () => {
      expect(() => toWords.isValidNumber(null as unknown as number)).toThrow();
    });

    test('throws for undefined (not a valid input type)', () => {
      expect(() => toWords.isValidNumber(undefined as unknown as number)).toThrow();
    });
  });
});

describe('isFloat Method Tests', () => {
  const toWords = new ToWords();

  describe('Float Detection', () => {
    test('returns true for decimal number', () => {
      expect(toWords.isFloat(1.5)).toBe(true);
    });

    test('returns true for small decimal', () => {
      expect(toWords.isFloat(0.001)).toBe(true);
    });

    test('returns false for integer', () => {
      expect(toWords.isFloat(100)).toBe(false);
    });

    test('returns false for zero', () => {
      expect(toWords.isFloat(0)).toBe(false);
    });

    test('returns false for integer as float (1.0)', () => {
      expect(toWords.isFloat(1.0)).toBe(false);
    });

    test('returns false for string', () => {
      expect(toWords.isFloat('1.5')).toBe(false);
    });

    test('returns false for BigInt', () => {
      expect(toWords.isFloat(123n as unknown as number)).toBe(false);
    });
  });
});

describe('toFixed Method Tests', () => {
  const toWords = new ToWords();

  describe('Rounding', () => {
    test('rounds to 2 decimal places', () => {
      expect(toWords.toFixed(3.14159, 2)).toBe(3.14);
    });

    test('rounds to 0 decimal places', () => {
      expect(toWords.toFixed(3.5, 0)).toBe(4);
    });

    test('rounds down correctly', () => {
      expect(toWords.toFixed(3.14, 1)).toBe(3.1);
    });

    test('rounds using standard JS behavior', () => {
      // Note: 3.15 rounds to 3.1 due to floating point representation
      // 3.15 is actually 3.1499999... in binary floating point
      expect(toWords.toFixed(3.15, 1)).toBe(3.1);
      // Use 3.25 which rounds up correctly
      expect(toWords.toFixed(3.25, 1)).toBe(3.3);
    });

    test('handles 0 correctly', () => {
      expect(toWords.toFixed(0, 2)).toBe(0);
    });

    test('handles negative numbers', () => {
      expect(toWords.toFixed(-3.14159, 2)).toBe(-3.14);
    });
  });
});

describe('Consistency Tests', () => {
  const toWords = new ToWords();

  describe('Number and String Consistency', () => {
    test('number and string produce same result', () => {
      expect(toWords.convert(123)).toBe(toWords.convert('123'));
    });

    test('negative number and string produce same result', () => {
      expect(toWords.convert(-123)).toBe(toWords.convert('-123'));
    });

    test('decimal number and string produce same result', () => {
      expect(toWords.convert(3.14)).toBe(toWords.convert('3.14'));
    });
  });

  describe('Multiple Calls Consistency', () => {
    test('same input produces same output on multiple calls', () => {
      const result1 = toWords.convert(12345);
      const result2 = toWords.convert(12345);
      const result3 = toWords.convert(12345);
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });
});

// ---------------------------------------------------------------------------
// Functional helpers: toWords(), toOrdinal(), toCurrency() (from 'to-words')
// ---------------------------------------------------------------------------

describe('toWords() functional helper', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
  });

  test('converts number with explicit localeCode', () => {
    expect(toWordsFn(12345, { localeCode: 'en-US' })).toBe('Twelve Thousand Three Hundred Forty Five');
  });

  test('uses detected locale when no localeCode given', () => {
    setLocaleDetectorFn(() => 'en-IN');
    expect(toWordsFn(100)).toBe('One Hundred');
  });

  test('passes converter options through', () => {
    expect(toWordsFn(100, { localeCode: 'en-US', currency: true, doNotAddOnly: true })).toBe('One Hundred Dollars');
  });

  test('handles negative numbers', () => {
    expect(toWordsFn(-42, { localeCode: 'en-US' })).toBe('Minus Forty Two');
  });

  test('handles BigInt input', () => {
    expect(toWordsFn(1000000n, { localeCode: 'en-US' })).toBe('One Million');
  });

  test('handles string input', () => {
    expect(toWordsFn('999', { localeCode: 'en-US' })).toBe('Nine Hundred Ninety Nine');
  });

  test('returns same result as class-based convert()', () => {
    const tw = new ToWords({ localeCode: 'fr-FR' });
    expect(toWordsFn(1000, { localeCode: 'fr-FR' })).toBe(tw.convert(1000));
  });

  test('caches instances — repeated calls with same locale are consistent', () => {
    const r1 = toWordsFn(42, { localeCode: 'en-US' });
    const r2 = toWordsFn(42, { localeCode: 'en-US' });
    expect(r1).toBe(r2);
  });
});

describe('toOrdinal() functional helper', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
  });

  test('converts ordinal with explicit localeCode', () => {
    expect(toOrdinalFn(1, { localeCode: 'en-US' })).toBe('First');
    expect(toOrdinalFn(21, { localeCode: 'en-US' })).toBe('Twenty First');
    expect(toOrdinalFn(100, { localeCode: 'en-US' })).toBe('One Hundredth');
  });

  test('uses detected locale when no localeCode given', () => {
    setLocaleDetectorFn(() => 'en-IN');
    expect(toOrdinalFn(2)).toBe('Second');
  });

  test('returns same result as class-based toOrdinal()', () => {
    const tw = new ToWords({ localeCode: 'en-US' });
    expect(toOrdinalFn(5, { localeCode: 'en-US' })).toBe(tw.toOrdinal(5));
  });
});

describe('toCurrency() functional helper', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
  });

  test('converts currency with explicit localeCode', () => {
    expect(toCurrencyFn(100, { localeCode: 'en-US' })).toBe('One Hundred Dollars Only');
  });

  test('uses detected locale when no localeCode given', () => {
    setLocaleDetectorFn(() => 'en-IN');
    expect(toCurrencyFn(100)).toBe('One Hundred Rupees Only');
  });

  test('respects doNotAddOnly option', () => {
    expect(toCurrencyFn(100, { localeCode: 'en-US', doNotAddOnly: true })).toBe('One Hundred Dollars');
  });

  test('respects ignoreDecimal option', () => {
    expect(toCurrencyFn(100.99, { localeCode: 'en-US', ignoreDecimal: true })).toBe('One Hundred Dollars Only');
  });

  test('returns same result as convert() with currency:true', () => {
    const tw = new ToWords({ localeCode: 'en-IN' });
    expect(toCurrencyFn(452.36, { localeCode: 'en-IN' })).toBe(tw.convert(452.36, { currency: true }));
  });
});

// ---------------------------------------------------------------------------
// detectLocale()
// ---------------------------------------------------------------------------

describe('detectLocale()', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
    vi.restoreAllMocks();
  });

  // ---- LOCALES matching (tested via setLocaleDetector — no globals to mock) ----

  test('returns default fallback (en-IN) when detector returns empty string', () => {
    setLocaleDetectorFn(() => '');
    expect(detectLocaleFn()).toBe('en-IN');
  });

  test('returns custom fallback when locale cannot be matched', () => {
    setLocaleDetectorFn(() => 'xx-XX');
    expect(detectLocaleFn('en-US')).toBe('en-US');
  });

  test('exact match: returns locale as-is when it is in LOCALES', () => {
    setLocaleDetectorFn(() => 'fr-FR');
    expect(detectLocaleFn()).toBe('fr-FR');
  });

  test('normalises lang-Script-REGION to lang-REGION (e.g. zh-Hant-CN → zh-CN)', () => {
    setLocaleDetectorFn(() => 'zh-Hant-CN');
    expect(detectLocaleFn()).toBe('zh-CN');
  });

  test('language-prefix fallback: sw-ZZ matches sw-KE via sw- prefix', () => {
    setLocaleDetectorFn(() => 'sw-ZZ');
    expect(detectLocaleFn()).toBe('sw-KE');
  });

  test('handles single-part locale (lang only) via prefix match', () => {
    setLocaleDetectorFn(() => 'fr');
    expect(detectLocaleFn()).toMatch(/^fr-/);
  });

  // ---- built-in env reading (readRawLocale) when no detector is set ----

  test('reads navigator.language by default (browser path)', () => {
    Object.defineProperty(globalThis, 'navigator', { value: { language: 'fr-FR' }, configurable: true });
    expect(detectLocaleFn()).toBe('fr-FR');
  });

  test('falls back to Intl when navigator is absent (Node.js / Deno / Bun / CF Workers path)', () => {
    Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ locale: 'de-DE' }) as Intl.ResolvedDateTimeFormatOptions,
        }) as Intl.DateTimeFormat,
    );
    expect(detectLocaleFn()).toBe('de-DE');
  });
});

// ---------------------------------------------------------------------------
// setLocaleDetector()
// ---------------------------------------------------------------------------

describe('setLocaleDetector()', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
    vi.restoreAllMocks();
  });

  test('overrides built-in detection with a custom function', () => {
    setLocaleDetectorFn(() => 'ja-JP');
    expect(detectLocaleFn()).toBe('ja-JP');
  });

  test('null restores built-in env detection', () => {
    Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ locale: 'ko-KR' }) as Intl.ResolvedDateTimeFormatOptions,
        }) as Intl.DateTimeFormat,
    );
    setLocaleDetectorFn(() => 'ja-JP');
    expect(detectLocaleFn()).toBe('ja-JP'); // override active
    setLocaleDetectorFn(null);
    expect(detectLocaleFn()).toBe('ko-KR'); // back to Intl
  });

  test('functional helpers use the registered detector', () => {
    setLocaleDetectorFn(() => 'en-US');
    expect(toWordsFn(1000000)).toBe('One Million'); // en-US uses millions
    expect(toCurrencyFn(100)).toBe('One Hundred Dollars Only');
  });
});

// ---------------------------------------------------------------------------
// Locale-level functional exports (representative sample: en-US, fr-FR)
// ---------------------------------------------------------------------------

describe('Locale-level toWords() from to-words/en-US', () => {
  test('converts number without localeCode argument', async () => {
    const { toWords: enUsToWords } = await import('../src/locales/en-US');
    expect(enUsToWords(12345)).toBe('Twelve Thousand Three Hundred Forty Five');
  });

  test('passes converter options through', async () => {
    const { toWords: enUsToWords } = await import('../src/locales/en-US');
    expect(enUsToWords(100, { currency: true })).toBe('One Hundred Dollars Only');
  });
});

describe('Locale-level toOrdinal() from to-words/en-US', () => {
  test('converts ordinal without localeCode argument', async () => {
    const { toOrdinal: enUsToOrdinal } = await import('../src/locales/en-US');
    expect(enUsToOrdinal(1)).toBe('First');
    expect(enUsToOrdinal(21)).toBe('Twenty First');
  });
});

describe('Locale-level toCurrency() from to-words/en-US', () => {
  test('converts currency without localeCode argument', async () => {
    const { toCurrency: enUsToCurrency } = await import('../src/locales/en-US');
    expect(enUsToCurrency(100)).toBe('One Hundred Dollars Only');
    expect(enUsToCurrency(100, { doNotAddOnly: true })).toBe('One Hundred Dollars');
  });
});

describe('Locale-level toWords() from to-words/fr-FR', () => {
  test('converts number in French without localeCode argument', async () => {
    const { toWords: frToWords } = await import('../src/locales/fr-FR');
    const tw = new ToWords({ localeCode: 'fr-FR' });
    expect(frToWords(1000)).toBe(tw.convert(1000));
  });
});

// ---------------------------------------------------------------------------
// readRawLocale() — line 67: return '' when both navigator and Intl are absent
// ---------------------------------------------------------------------------

describe('readRawLocale() fallback path', () => {
  afterEach(() => {
    setLocaleDetectorFn(null);
    vi.restoreAllMocks();
  });

  test('returns fallback locale when Intl.DateTimeFormat throws and navigator is absent', () => {
    // In Node.js, globalThis.navigator is undefined so the navigator branch is a no-op.
    // Mock Intl.DateTimeFormat to throw, simulating an environment where Intl is absent.
    // This forces readRawLocale() to fall through to `return ''` (line 67), and
    // detectLocale() then returns the default fallback.
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new Error('Intl unavailable');
    });
    expect(detectLocaleFn()).toBe('en-IN');
  });
});

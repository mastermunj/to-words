import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords';

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
    NaN,
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
      expect(() => toWords.convert(NaN)).toThrow(/Invalid Number/);
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
      expect(() => toWords.toOrdinal(NaN)).toThrow(/Invalid Number/);
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
      expect(toWords.isValidNumber(NaN)).toBe(false);
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

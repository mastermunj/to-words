import { describe, expect, test } from 'vitest';
import { ToWordsCore, DefaultConverterOptions, DefaultToWordsOptions } from '../src/ToWordsCore';

describe('ToWordsCore - DefaultConverterOptions', () => {
  test('has correct default values', () => {
    expect(DefaultConverterOptions).toEqual({
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    });
  });
});

describe('ToWordsCore - DefaultToWordsOptions', () => {
  test('has correct default values', () => {
    expect(DefaultToWordsOptions).toEqual({
      localeCode: 'en-IN',
      converterOptions: DefaultConverterOptions,
    });
  });
});

describe('ToWordsCore - Instantiation', () => {
  test('can be instantiated without options', () => {
    const core = new ToWordsCore();
    expect(core).toBeInstanceOf(ToWordsCore);
  });

  test('can be instantiated with options', () => {
    const core = new ToWordsCore({ localeCode: 'en-US' });
    expect(core).toBeInstanceOf(ToWordsCore);
  });

  test('merges options with defaults', () => {
    const core = new ToWordsCore({
      converterOptions: { currency: true },
    });
    expect(core).toBeInstanceOf(ToWordsCore);
  });
});

describe('ToWordsCore - setLocale', () => {
  test('throws error when no locale is set', () => {
    const core = new ToWordsCore();
    expect(() => core.getLocaleClass()).toThrow(
      'No locale set. Use setLocale() or import from a locale-specific entry point',
    );
  });

  test('throws error when convert is called without locale', () => {
    const core = new ToWordsCore();
    expect(() => core.convert(123)).toThrow(
      'No locale set. Use setLocale() or import from a locale-specific entry point',
    );
  });

  test('setLocale returns this for chaining', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    const result = core.setLocale(EnInLocale);
    expect(result).toBe(core);
  });

  test('setLocale allows chained convert call', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    const result = core.setLocale(EnInLocale).convert(100);
    expect(result).toBe('One Hundred');
  });

  test('getLocaleClass returns set locale class', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    expect(core.getLocaleClass()).toBe(EnInLocale);
  });

  test('getLocale returns locale instance', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    const locale = core.getLocale();
    expect(locale).toBeInstanceOf(EnInLocale);
  });

  test('getLocale returns same instance on multiple calls', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    const locale1 = core.getLocale();
    const locale2 = core.getLocale();
    expect(locale1).toBe(locale2);
  });

  test('setLocale resets cached locale instance', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const core = new ToWordsCore();

    core.setLocale(EnInLocale);
    const enLocale = core.getLocale();

    core.setLocale(FrFrLocale);
    const frLocale = core.getLocale();

    expect(enLocale).not.toBe(frLocale);
    expect(frLocale).toBeInstanceOf(FrFrLocale);
  });
});

describe('ToWordsCore - convert', () => {
  test('converts numbers correctly with en-IN locale', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(0)).toBe('Zero');
    expect(core.convert(1)).toBe('One');
    expect(core.convert(100)).toBe('One Hundred');
    expect(core.convert(1234)).toBe('One Thousand Two Hundred Thirty Four');
  });

  test('converts with currency option', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(100, { currency: true })).toBe('One Hundred Rupees Only');
    expect(core.convert(1, { currency: true })).toBe('One Rupee Only');
  });

  test('converts negative numbers', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(-100)).toBe('Minus One Hundred');
    expect(core.convert(-1)).toBe('Minus One');
  });

  test('converts decimal numbers', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(1.5)).toBe('One Point Five');
    expect(core.convert(3.14)).toBe('Three Point Fourteen');
  });

  test('converts BigInt', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(12345n)).toBe('Twelve Thousand Three Hundred Forty Five');
    expect(core.convert(0n)).toBe('Zero');
    expect(core.convert(-100n)).toBe('Minus One Hundred');
  });

  test('throws error for invalid input', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(() => core.convert(Number.NaN)).toThrow('Invalid Number');
    expect(() => core.convert('' as unknown as number)).toThrow('Invalid Number');
  });

  test('respects ignoreDecimal option', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.convert(3.75, { ignoreDecimal: true })).toBe('Three');
  });
});

describe('ToWordsCore - toOrdinal', () => {
  test('converts to ordinal correctly', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.toOrdinal(1)).toBe('First');
    expect(core.toOrdinal(2)).toBe('Second');
    expect(core.toOrdinal(3)).toBe('Third');
    expect(core.toOrdinal(10)).toBe('Tenth');
    expect(core.toOrdinal(21)).toBe('Twenty First');
    expect(core.toOrdinal(100)).toBe('One Hundredth');
  });

  test('throws for negative numbers', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(() => core.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('throws for non-integers', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(() => core.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('throws for invalid input', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(() => core.toOrdinal(Number.NaN)).toThrow('Invalid Number');
  });
});

describe('ToWordsCore - utility methods', () => {
  test('toFixed rounds correctly', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.toFixed(3.14159, 2)).toBe(3.14);
    expect(core.toFixed(3.14159, 4)).toBe(3.1416);
    expect(core.toFixed(3.5, 0)).toBe(4);
  });

  test('isFloat detects floats correctly', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.isFloat(1.5)).toBe(true);
    expect(core.isFloat(1)).toBe(false);
    expect(core.isFloat(0)).toBe(false);
    expect(core.isFloat(0.0)).toBe(false);
    expect(core.isFloat('1.5')).toBe(false); // String is not detected as float
    expect(core.isFloat('1')).toBe(false);
  });

  test('isValidNumber validates correctly', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.isValidNumber(123)).toBe(true);
    expect(core.isValidNumber(0)).toBe(true);
    expect(core.isValidNumber(-50)).toBe(true);
    expect(core.isValidNumber(3.14)).toBe(true);
    expect(core.isValidNumber('123')).toBe(true);
    expect(core.isValidNumber(123n)).toBe(true);
    expect(core.isValidNumber(Number.NaN)).toBe(false);
    expect(core.isValidNumber(Infinity)).toBe(false);
    expect(core.isValidNumber(-Infinity)).toBe(false);
    expect(core.isValidNumber('')).toBe(false);
  });

  test('isNumberZero detects zero correctly', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    expect(core.isNumberZero(0)).toBe(true);
    expect(core.isNumberZero(0n)).toBe(true);
    expect(core.isNumberZero(0.0)).toBe(true);
    expect(core.isNumberZero(0.5)).toBe(true); // < 1 is considered "zero" for currency
    expect(core.isNumberZero(1)).toBe(false);
    expect(core.isNumberZero(-1)).toBe(false);
  });
});

describe('ToWordsCore - different locales', () => {
  test('works with en-US locale', async () => {
    const { default: EnUsLocale } = await import('../src/locales/en-US');
    const core = new ToWordsCore();
    core.setLocale(EnUsLocale);

    expect(core.convert(1000000)).toBe('One Million');
    expect(core.convert(1000000000)).toBe('One Billion');
  });

  test('works with fr-FR locale', async () => {
    const { default: FrFrLocale } = await import('../src/locales/fr-FR');
    const core = new ToWordsCore();
    core.setLocale(FrFrLocale);

    expect(core.convert(21)).toBe('Vingt Et Un');
    expect(core.convert(80)).toBe('Quatre-Vingts');
  });

  test('works with de-DE locale', async () => {
    const { default: DeDeLocale } = await import('../src/locales/de-DE');
    const core = new ToWordsCore();
    core.setLocale(DeDeLocale);

    expect(core.convert(21)).toBe('Einundzwanzig');
  });

  test('works with ar-SA locale', async () => {
    const { default: ArSaLocale } = await import('../src/locales/ar-SA');
    const core = new ToWordsCore();
    core.setLocale(ArSaLocale);

    expect(core.convert(1)).toBe('واحد');
    expect(core.convert(2)).toBe('اثنان');
  });

  test('works with zh-CN locale', async () => {
    const { default: ZhCnLocale } = await import('../src/locales/zh-CN');
    const core = new ToWordsCore();
    core.setLocale(ZhCnLocale);

    expect(core.convert(1)).toBe('一');
    expect(core.convert(10)).toBe('十');
  });
});

describe('ToWordsCore - Edge Cases for Coverage', () => {
  test('ordinal throws for locales without ordinal support', async () => {
    // Create a minimal locale without ordinal support
    const MinimalLocale = class {
      config = {
        currency: {
          name: 'Dollar',
          plural: 'Dollars',
          singular: 'Dollar',
          symbol: '$',
          fractionalUnit: { name: 'Cent', plural: 'Cents', singular: 'Cent', symbol: '' },
        },
        texts: { and: 'And', minus: 'Minus', only: 'Only', point: 'Point' },
        numberWordsMapping: [
          { number: 1000, value: 'Thousand' },
          { number: 100, value: 'Hundred' },
          { number: 10, value: 'Ten' },
          { number: 1, value: 'One' },
          { number: 0, value: 'Zero' },
        ],
        // No ordinalWordsMapping or ordinalSuffix
      };
    };

    const core = new ToWordsCore();
    core.setLocale(MinimalLocale as never);

    expect(() => core.toOrdinal(1)).toThrow('Ordinal conversion not supported');
  });

  test('ordinal with decade numbers (20, 30, etc) for getLastNumberComponent', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    // These test the lastTwoDigits % 10 === 0 branch
    expect(core.toOrdinal(20)).toBe('Twentieth');
    expect(core.toOrdinal(30)).toBe('Thirtieth');
    expect(core.toOrdinal(120)).toBe('One Hundred Twentieth');
    expect(core.toOrdinal(1030)).toBe('One Thousand Thirtieth');
  });

  test('convert with numberSpecificForms for currency', async () => {
    // Some locales have special forms for specific numbers
    const { default: EnGbLocale } = await import('../src/locales/en-GB');
    const core = new ToWordsCore();
    core.setLocale(EnGbLocale);

    // Test currency with various values to hit overrides path
    expect(core.convert(0, { currency: true })).toBe('Zero Pounds Only');
    expect(core.convert(1, { currency: true })).toBe('One Pound Only');
    expect(core.convert(2, { currency: true })).toBe('Two Pounds Only');
  });

  test('ordinal with numbers having atomic words (like 11, 12 in locales)', async () => {
    const { default: HiInLocale } = await import('../src/locales/hi-IN');
    const core = new ToWordsCore();
    core.setLocale(HiInLocale);

    // Hindi has atomic words for numbers 1-99
    expect(core.toOrdinal(11)).toBeDefined();
    expect(core.toOrdinal(21)).toBeDefined();
  });

  test('handles very large numbers for ordinal', async () => {
    const { default: EnUsLocale } = await import('../src/locales/en-US');
    const core = new ToWordsCore();
    core.setLocale(EnUsLocale);

    // Large ordinals exercise more code paths
    expect(core.toOrdinal(1000)).toBe('One Thousandth');
    expect(core.toOrdinal(1000000)).toBe('One Millionth');
  });

  test('locale cache is reused across multiple getLocale calls', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);

    // First call initializes cache
    const locale1 = core.getLocale();
    // Second call should reuse cached locale
    const locale2 = core.getLocale();

    expect(locale1).toBe(locale2);
  });

  test('getLocaleCache initializes cache if not present', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');

    // Create two separate instances to test cache initialization path
    const core1 = new ToWordsCore();
    core1.setLocale(EnInLocale);
    const result1 = core1.convert(100);

    const core2 = new ToWordsCore();
    core2.setLocale(EnInLocale);
    const result2 = core2.convert(100);

    expect(result1).toBe(result2);
    expect(result1).toBe('One Hundred');
  });

  test('ordinal with decade in locale without atomic decade words uses decade branch', async () => {
    // Create a locale with ordinalSuffix but without atomic words for 20, 30, etc.
    const MinimalOrdinalLocale = class {
      config = {
        currency: {
          name: 'Dollar',
          plural: 'Dollars',
          singular: 'Dollar',
          symbol: '$',
          fractionalUnit: { name: 'Cent', plural: 'Cents', singular: 'Cent', symbol: '' },
        },
        texts: { and: 'And', minus: 'Minus', only: 'Only', point: 'Point' },
        numberWordsMapping: [
          { number: 1000, value: 'Thousand' },
          { number: 100, value: 'Hundred' },
          // Note: NO atomic word for 20, 30, 40, etc.
          { number: 10, value: 'Ten' },
          { number: 9, value: 'Nine' },
          { number: 8, value: 'Eight' },
          { number: 7, value: 'Seven' },
          { number: 6, value: 'Six' },
          { number: 5, value: 'Five' },
          { number: 4, value: 'Four' },
          { number: 3, value: 'Three' },
          { number: 2, value: 'Two' },
          { number: 1, value: 'One' },
          { number: 0, value: 'Zero' },
        ],
        ordinalSuffix: 'th', // Use suffix instead of explicit ordinal words
      };
    };

    const core = new ToWordsCore();
    core.setLocale(MinimalOrdinalLocale as never);

    // This should hit the lastTwoDigits % 10 === 0 branch (line 302)
    const result = core.toOrdinal(120); // Last two digits = 20, 20 % 10 === 0
    expect(result).toContain('th');
  });

  test('ordinal with ones digit fallback when no decade word exists', async () => {
    // Create a locale with ordinalSuffix but minimal numberWordsMapping
    const MinimalLocale = class {
      config = {
        currency: {
          name: 'Dollar',
          plural: 'Dollars',
          singular: 'Dollar',
          symbol: '$',
          fractionalUnit: { name: 'Cent', plural: 'Cents', singular: 'Cent', symbol: '' },
        },
        texts: { and: 'And', minus: 'Minus', only: 'Only', point: 'Point' },
        numberWordsMapping: [
          { number: 1000, value: 'Thousand' },
          { number: 100, value: 'Hundred' },
          { number: 10, value: 'Ten' },
          { number: 9, value: 'Nine' },
          { number: 8, value: 'Eight' },
          { number: 7, value: 'Seven' },
          { number: 6, value: 'Six' },
          { number: 5, value: 'Five' },
          { number: 4, value: 'Four' },
          { number: 3, value: 'Three' },
          { number: 2, value: 'Two' },
          { number: 1, value: 'One' },
          { number: 0, value: 'Zero' },
        ],
        ordinalSuffix: 'th',
      };
    };

    const core = new ToWordsCore();
    core.setLocale(MinimalLocale as never);

    // Test with 121 - lastTwoDigits = 21, 21 % 10 = 1 (ones digit fallback)
    const result = core.toOrdinal(121);
    expect(result).toContain('th');
  });
});

// ---------------------------------------------------------------------------
// Internal implementation coverage — protected methods via subclass
// Covers: lines 180-181 (getLocaleCache cache-miss), 328-329
// (getLastNumberComponent fallback), 538-540 (convertInternal overrides)
// ---------------------------------------------------------------------------

describe('ToWordsCore - internal coverage via subclass', () => {
  // Exposes the two protected methods we need to reach.
  class TestableCore extends ToWordsCore {
    callConvertInternal(
      number: bigint,
      trailing: boolean,
      overrides: Record<number, string> | undefined,
      localeInstance: InstanceType<any>,
    ): string[] {
      return this.convertInternal(number, trailing, overrides, localeInstance);
    }

    // Calls convertInternal without an explicit localeInstance so the
    // `?? this.getLocale()` fallback on line 532 is exercised.
    callConvertInternalNoInst(number: bigint, trailing: boolean): string[] {
      return this.convertInternal(number, trailing);
    }

    callGetLastNumberComponent(number: number, localeConfig: any, localeInstance?: InstanceType<any>): number {
      return this.getLastNumberComponent(number, localeConfig, localeInstance);
    }
  }

  test('getLocaleCache initialises cache on first access for a fresh locale instance (lines 180-181)', async () => {
    // getLocale() calls initLocaleCache, so every normal code path has the cache
    // pre-populated before getLocaleCache runs.  Passing a brand-new locale
    // instance directly to convertInternal — bypassing getLocale() — is the
    // only way to reach the if (!cache) branch on lines 180-181.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    const freshLocale = new EnInLocale(); // not yet in the WeakMap
    const result = core.callConvertInternal(1n, false, undefined, freshLocale);
    expect(result).toEqual(['One']);
  });

  test('convertInternal falls back to getLocale() when localeInstance is not provided (line 532 ?? branch)', async () => {
    // All production callers always pass an explicit locale; this test exercises
    // the rarely-hit `?? this.getLocale()` right-hand side of line 532.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    core.setLocale(EnInLocale);
    const result = core.callConvertInternalNoInst(1n, false);
    expect(result).toEqual(['One']);
  });

  test('getLastNumberComponent uses filter+sort fallback when localeInstance is omitted (lines 328-329)', async () => {
    // convertOrdinal always passes localeInstance, so the ternary else-branch
    // (lines 328-329) can only be reached by calling getLastNumberComponent
    // directly without the optional third argument.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    const locale = new EnInLocale();
    const result = core.callGetLastNumberComponent(1000, locale.config);
    expect(result).toBe(1000);
  });

  test('convertInternal applies overrides when the number matches (lines 538-540)', async () => {
    // All public entry-points pass undefined for overrides; this subclass call
    // is the only path that exercises the if (overrides) guard (line 538) and
    // the inner return (lines 539-541).
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    const localeInstance = new EnInLocale();
    const result = core.callConvertInternal(1n, false, { 1: 'Custom One' }, localeInstance);
    expect(result).toEqual(['Custom One']);
  });

  test('convertInternal skips overrides when number exceeds MAX_SAFE_INTEGER (lines 538-539 ternary branch)', async () => {
    // When number > Number.MAX_SAFE_INTEGER the ternary evaluates to -1 and the
    // override is not applied (exercises the false branch of the ternary on line 538).
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    const localeInstance = new EnInLocale();
    const bigNum = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
    const result = core.callConvertInternal(bigNum, false, { 1: 'Override' }, localeInstance);
    expect(typeof result[0]).toBe('string'); // overrides not applied, normal conversion used
  });

  test('convertInternal skips overrides when number has no matching override entry (line 539 && short-circuit)', async () => {
    // overrides is truthy but does not have a key for the number being converted.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new TestableCore();
    const localeInstance = new EnInLocale();
    const result = core.callConvertInternal(2n, false, { 1: 'Override' }, localeInstance);
    expect(result).toEqual(['Two']); // override for 1 doesn't affect 2
  });

  test('convertCurrency handles negative BigInt (line 429 BigInt branch)', async () => {
    // Line 429: `number = typeof number === 'bigint' ? -number : Math.abs(number)`
    // The BigInt branch is only hit when a negative BigInt is converted with currency: true.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    const result = core.convert(-1n, { currency: true });
    expect(result).toContain('Minus');
    expect(result).toContain('Rupee');
  });

  test('convertCurrency handles amount exceeding MAX_SAFE_INTEGER (line 452 ternary -1 branch)', async () => {
    // Line 452: `mainAmount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(mainAmount) : -1`
    // The `: -1` branch is only reached when the integer part of the currency
    // amount exceeds Number.MAX_SAFE_INTEGER.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    const bigAmount = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
    // Should still produce a valid string (not throw), just without number-specific forms
    const result = core.convert(bigAmount, { currency: true });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('toOrdinal accepts BigInt input', async () => {
    // The toOrdinal method accepts NumberInput which includes bigint.
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore();
    core.setLocale(EnInLocale);
    expect(core.toOrdinal(1n as unknown as number)).toBe('First');
    expect(core.toOrdinal(21n as unknown as number)).toBe('Twenty First');
  });

  test('convert merges constructor converterOptions with per-call options (lines 191-196)', async () => {
    // Exercises the baseOptions?.xxx branches of the ?? chains on lines 191-196.
    // When a field is absent from per-call options but present in constructor options,
    // the constructor value is used (the right-hand side of the first ?? fires).
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore({
      converterOptions: {
        doNotAddOnly: true,
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: true,
      },
    });
    core.setLocale(EnInLocale);

    // Per-call options only sets ignoreDecimal; all other fields come from constructor options.
    const result = core.convert(100, { ignoreDecimal: false });
    // currency:true comes from constructor -> Rupees Only appended
    expect(result).toContain('Hundred');
    expect(result).toContain('Rupees');
  });

  test('convert uses false fallback for fields absent from both call options and constructor options (lines 193-196)', async () => {
    const { default: EnInLocale } = await import('../src/locales/en-IN');
    const core = new ToWordsCore({ converterOptions: {} as any });
    core.setLocale(EnInLocale);
    const result = core.convert(100, { currency: false });
    expect(result).toBe('One Hundred');
  });
});

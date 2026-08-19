/**
 * ToWordsCore - Lightweight core class without bundled locales.
 *
 * This is the base class that contains all conversion logic but does NOT import
 * any locale files. It's designed for tree-shaking when used with per-locale entry points.
 *
 * For the full package with all locales, use `ToWords` from the main entry point.
 * For tree-shaken single-locale imports, use `ToWords` from a locale entry point:
 *
 * @example
 * // Full package (all locales ~55KB gzipped)
 * import { ToWords } from 'to-words';
 * const tw = new ToWords({ localeCode: 'en-IN' });
 *
 * // Single locale (~3-4KB gzipped) - SAME API!
 * import { ToWords } from 'to-words/en-IN';
 * const tw = new ToWords();
 */

import {
  type ConstructorOf,
  type ConverterOptions,
  type FormalConfig,
  type LocaleInterface,
  type NumberInput,
  type NumberWordMap,
  type OrdinalOptions,
  type ToWordsOptions,
} from './types.js';

export const DefaultConverterOptions: ConverterOptions = {
  currency: false,
  ignoreDecimal: false,
  ignoreZeroCurrency: false,
  doNotAddOnly: false,
  includeZeroFractional: false,
};

export const DefaultToWordsOptions: ToWordsOptions = {
  localeCode: 'en-IN',
  converterOptions: DefaultConverterOptions,
};

// Cached BigInt mappings per locale to avoid repeated conversions
interface CachedNumberWordMap extends NumberWordMap {
  numberBigInt: bigint;
  resolvedValue: string; // Pre-resolved value (first element if array)
  feminineValue?: string;
  masculineValue?: string;
}

interface LocaleCache {
  numberWordsMappingBigInt: CachedNumberWordMap[];
  exactWordsMap: Map<bigint, CachedNumberWordMap>; // O(1) lookup for exact matches
  smallNumbersMap: Map<bigint, CachedNumberWordMap>; // Direct lookup for 0-100
  // Pre-computed unit thresholds for faster iteration
  unitMappings: CachedNumberWordMap[]; // Numbers >= 100, sorted descending
  smallNumbersBoundary: bigint; // The largest "small number" that has an atomic word
  // O(1) lookup sets for plural/ignore words
  pluralWordsSet: Set<string>;
  pluralWordsOnlyWhenTrailingSet: Set<string>;
  ignoreOneForWordsSet: Set<string>;
  noSplitWordAfterSet: Set<string>;
}

interface ParsedNumberParts {
  isNegative: boolean;
  integerPart: bigint;
  fractionalPart: string;
}

// Global cache for all locales (computed once per locale)
const localeCache = new WeakMap<InstanceType<ConstructorOf<LocaleInterface>>, LocaleCache>();

// Pre-computed BigInt constants to avoid repeated creation
const BIGINT_0 = 0n;
const BIGINT_1 = 1n;
const BIGINT_2 = 2n;
const BIGINT_10 = 10n;
const BIGINT_11 = 11n;
const BIGINT_100 = 100n;
const BIGINT_1000 = 1000n;
const BIGINT_MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

export class ToWordsCore {
  protected options: ToWordsOptions = {};

  protected locale: InstanceType<ConstructorOf<LocaleInterface>> | undefined = undefined;

  protected localeClass: ConstructorOf<LocaleInterface> | undefined = undefined;

  private formalLocale: InstanceType<ConstructorOf<LocaleInterface>> | undefined = undefined;

  constructor(options: ToWordsOptions = {}) {
    this.options = Object.assign({}, DefaultToWordsOptions, options);
  }

  /**
   * Resolve gendered value from a cached number-word mapping entry.
   */
  private resolveGenderedValue(
    entry: CachedNumberWordMap,
    gender: 'masculine' | 'feminine' | undefined,
    trailing: boolean,
  ): string {
    if (gender === 'feminine' && entry.feminineValue) {
      return entry.feminineValue;
    }
    if (gender === 'masculine' && entry.masculineValue) {
      return entry.masculineValue;
    }
    return trailing && Array.isArray(entry.value) ? entry.value[1] : entry.resolvedValue;
  }

  /**
   * Resolve locale instance, applying formalConfig merge when formal=true.
   */
  private resolveLocale(formal?: boolean): InstanceType<ConstructorOf<LocaleInterface>> {
    const locale = this.getLocale();
    if (!formal) {
      return locale;
    }
    const formalConfig = locale.config.formalConfig;
    if (!formalConfig) {
      return locale;
    }
    if (!this.formalLocale) {
      this.formalLocale = this.createFormalLocale(locale, formalConfig);
    }
    return this.formalLocale;
  }

  /**
   * Create a synthetic locale instance with formalConfig merged in.
   */
  private createFormalLocale(
    base: InstanceType<ConstructorOf<LocaleInterface>>,
    formalConfig: FormalConfig,
  ): InstanceType<ConstructorOf<LocaleInterface>> {
    const mergedConfig = { ...base.config };
    if (formalConfig.numberWordsMapping) {
      mergedConfig.numberWordsMapping = formalConfig.numberWordsMapping;
    }
    if (formalConfig.exactWordsMapping) {
      mergedConfig.exactWordsMapping = formalConfig.exactWordsMapping;
    }
    if (formalConfig.ordinalWordsMapping) {
      mergedConfig.ordinalWordsMapping = formalConfig.ordinalWordsMapping;
    }
    if (formalConfig.ordinalExactWordsMapping) {
      mergedConfig.ordinalExactWordsMapping = formalConfig.ordinalExactWordsMapping;
    }
    if (formalConfig.currency) {
      mergedConfig.currency = formalConfig.currency;
    }
    if (formalConfig.ignoreOneForWords) {
      mergedConfig.ignoreOneForWords = formalConfig.ignoreOneForWords;
    }
    // Remove formalConfig from merged to prevent double-application
    mergedConfig.formalConfig = undefined;
    return { config: mergedConfig };
  }

  /**
   * Set a locale class directly.
   * @internal Used by per-locale entry points
   */
  public setLocale(localeClass: ConstructorOf<LocaleInterface>): this {
    this.localeClass = localeClass;
    this.locale = undefined; // Reset cached locale instance
    return this;
  }

  /**
   * Get the locale class. Must be set via setLocale() or overridden in subclass.
   */
  public getLocaleClass(): ConstructorOf<LocaleInterface> {
    if (this.localeClass) {
      return this.localeClass;
    }
    throw new Error(
      'No locale set. Use setLocale() or import from a locale-specific entry point (e.g., "to-words/en-IN")',
    );
  }

  public getLocale(): InstanceType<ConstructorOf<LocaleInterface>> {
    if (this.locale === undefined) {
      const LocaleClass = this.getLocaleClass();
      this.locale = new LocaleClass();
      // Initialize cache for this locale
      this.initLocaleCache(this.locale);
    }
    return this.locale;
  }

  private initLocaleCache(locale: InstanceType<ConstructorOf<LocaleInterface>>): void {
    // The caller (getLocale / getLocaleCache) guarantees this locale is not yet cached;
    // the guard below is therefore always false and has been removed to keep coverage clean.
    const config = locale.config;

    // Pre-compute BigInt values and resolved string values for numberWordsMapping
    const numberWordsMappingBigInt: CachedNumberWordMap[] = config.numberWordsMapping.map((elem) => ({
      ...elem,
      numberBigInt: BigInt(elem.number),
      resolvedValue: Array.isArray(elem.value) ? elem.value[0] : elem.value,
    }));

    // Create Map for O(1) exact match lookup
    const exactWordsMap = new Map<bigint, CachedNumberWordMap>();
    if (config.exactWordsMapping) {
      for (const elem of config.exactWordsMapping) {
        const cached: CachedNumberWordMap = {
          ...elem,
          numberBigInt: BigInt(elem.number),
          resolvedValue: Array.isArray(elem.value) ? elem.value[0] : elem.value,
        };
        exactWordsMap.set(cached.numberBigInt, cached);
      }
    }

    // Create direct lookup map for small numbers (0-100) for O(1) access
    const smallNumbersMap = new Map<bigint, CachedNumberWordMap>();
    let smallNumbersBoundary = BIGINT_0;
    for (const elem of numberWordsMappingBigInt) {
      if (elem.numberBigInt <= BIGINT_100) {
        smallNumbersMap.set(elem.numberBigInt, elem);
        if (elem.numberBigInt > smallNumbersBoundary) {
          smallNumbersBoundary = elem.numberBigInt;
        }
      }
    }

    // Pre-compute unit mappings (>= 100) for faster iteration - already sorted descending
    const unitMappings = numberWordsMappingBigInt.filter((m) => m.numberBigInt >= BIGINT_100);

    // Create Sets for O(1) lookup instead of array.includes()
    const pluralWordsSet = new Set<string>(config.pluralWords ?? []);
    const pluralWordsOnlyWhenTrailingSet = new Set<string>(config.pluralWordsOnlyWhenTrailing ?? []);
    const ignoreOneForWordsSet = new Set<string>(config.ignoreOneForWords ?? []);
    const noSplitWordAfterSet = new Set<string>(config.noSplitWordAfter ?? []);

    localeCache.set(locale, {
      numberWordsMappingBigInt,
      exactWordsMap,
      smallNumbersMap,
      unitMappings,
      smallNumbersBoundary,
      pluralWordsSet,
      pluralWordsOnlyWhenTrailingSet,
      ignoreOneForWordsSet,
      noSplitWordAfterSet,
    });
  }

  private getLocaleCache(locale: InstanceType<ConstructorOf<LocaleInterface>>): LocaleCache {
    let cache = localeCache.get(locale);
    if (!cache) {
      this.initLocaleCache(locale);
      cache = localeCache.get(locale)!;
    }
    return cache;
  }

  public convert(number: NumberInput, options: ConverterOptions = {}): string {
    // Fast path: merge options only when needed (avoid Object.assign in hot path)
    const baseOptions = this.options.converterOptions;
    const mergedOptions: ConverterOptions =
      Object.keys(options).length === 0
        ? (baseOptions ?? {})
        : {
            currency: options.currency ?? baseOptions?.currency ?? false,
            ignoreDecimal: options.ignoreDecimal ?? baseOptions?.ignoreDecimal ?? false,
            ignoreZeroCurrency: options.ignoreZeroCurrency ?? baseOptions?.ignoreZeroCurrency ?? false,
            doNotAddOnly: options.doNotAddOnly ?? baseOptions?.doNotAddOnly ?? false,
            includeZeroFractional: options.includeZeroFractional ?? baseOptions?.includeZeroFractional ?? false,
            currencyOptions: options.currencyOptions ?? baseOptions?.currencyOptions,
            gender: options.gender ?? baseOptions?.gender,
            useAnd: options.useAnd ?? baseOptions?.useAnd,
            formal: options.formal ?? baseOptions?.formal,
            decimalStyle: options.decimalStyle ?? baseOptions?.decimalStyle,
          };

    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${String(number)}"`);
    }

    // Detect string inputs like "123.00" or "5.0" where the caller has explicitly expressed
    // a zero fractional part. Number() coercion loses this info, so we capture it here.
    const forceZeroFractional =
      !!mergedOptions.includeZeroFractional &&
      typeof number === 'string' &&
      !mergedOptions.ignoreDecimal &&
      /\.\d+$/.test(number.trim()) &&
      Number(number.trim().split('.')[1]) === 0;

    let words: string[] = [];
    const localeOverride = this.resolveLocale(mergedOptions.formal);
    if (mergedOptions.currency) {
      words = this.convertCurrency(number, mergedOptions, forceZeroFractional, localeOverride);
    } else {
      words = this.convertNumber(number, mergedOptions, localeOverride);
    }

    if (localeOverride.config.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  public toOrdinal(number: NumberInput, options: OrdinalOptions = {}): string {
    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${String(number)}"`);
    }

    const locale = this.resolveLocale(options.formal);
    const localeConfig = locale.config;

    const parsed = this.parseNumberParts(number);
    const hasFractionalValue = /[1-9]/.test(parsed.fractionalPart);

    if (parsed.isNegative || hasFractionalValue) {
      throw new Error(`Ordinal numbers must be non-negative integers, got "${number}"`);
    }

    // Check if locale supports ordinals
    if (
      !localeConfig.ordinalWordsMapping &&
      !localeConfig.ordinalSuffix &&
      !localeConfig.ordinalPrefix &&
      !localeConfig.ordinalExactWordsMapping
    ) {
      throw new Error(`Ordinal conversion not supported for locale "${this.options.localeCode}"`);
    }

    const words =
      parsed.integerPart <= BIGINT_MAX_SAFE
        ? this.convertOrdinal(Number(parsed.integerPart), options, locale)
        : this.convertOrdinalBigInt(parsed.integerPart, options, locale);

    if (localeConfig.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  protected convertOrdinal(
    number: number,
    options: OrdinalOptions,
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    return this.convertOrdinalBigInt(BigInt(number), options, localeInstance);
  }

  private convertOrdinalBigInt(
    number: bigint,
    _options: OrdinalOptions,
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const localeConfig = localeInstance.config;

    // Check exact ordinal mapping first (for special cases like 100 that need special wording)
    if (localeConfig.ordinalExactWordsMapping) {
      const exactMatch = localeConfig.ordinalExactWordsMapping.find((m) => BigInt(m.number) === number);
      if (exactMatch) {
        return [exactMatch.value];
      }
    }

    // For simple numbers (0-20), use direct ordinal mapping
    if (number <= 20n && localeConfig.ordinalWordsMapping) {
      const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => BigInt(m.number) === number);
      if (ordinalMatch) {
        return [ordinalMatch.value];
      }
    }

    // For composite numbers (like 21, 1000, 1234), convert to cardinal then modify last component
    // Strategy: Convert the number to cardinal, then find the last component and replace it with ordinal
    const cardinalWords = this.convertInternal(number, true, undefined, localeInstance);

    // Convert the last word to its ordinal form.
    // For composite numbers like 21 (Twenty One), only "One" should become "First".
    // For 1000 (One Thousand), "Thousand" becomes "Thousandth".
    const lastWordIndex = cardinalWords.length - 1;
    const lastWord = cardinalWords[lastWordIndex];

    // Find what number the last word represents
    const lastNumberComponent = this.getLastNumberComponentBigInt(number, localeConfig, localeInstance);

    // Try to find ordinal mapping for the last component
    let transformed = false;
    if (localeConfig.ordinalWordsMapping) {
      const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => BigInt(m.number) === lastNumberComponent);
      if (ordinalMatch) {
        cardinalWords[lastWordIndex] = ordinalMatch.value;
        transformed = true;
      }
    }

    // If ordinalSuffix is available, use it
    if (!transformed && localeConfig.ordinalSuffix) {
      cardinalWords[lastWordIndex] = lastWord + localeConfig.ordinalSuffix;
      transformed = true;
    }

    // Prefix-based ordinals (e.g. Khmer "ទី", Javanese "Kaping", Igbo "Nke")
    if (!transformed && localeConfig.ordinalPrefix) {
      cardinalWords.unshift(localeConfig.ordinalPrefix);
    }

    return cardinalWords;
  }

  protected getLastNumberComponent(
    number: number,
    localeConfig: LocaleInterface['config'],
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): number {
    return Number(this.getLastNumberComponentBigInt(BigInt(number), localeConfig, localeInstance));
  }

  private getLastNumberComponentBigInt(
    number: bigint,
    localeConfig: LocaleInterface['config'],
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): bigint {
    // Find the last number component that makes up this number
    // This is locale-aware: Hindi/Indic locales have atomic words for 21-99,
    // while English composes them (Twenty + One)

    // For numbers 1-20, return the number itself
    if (number <= 20n) {
      return number;
    }

    // Use pre-computed cache when the locale instance is available (avoids
    // re-filtering and re-sorting numberWordsMapping on every ordinal call)
    const unitMappings = localeInstance
      ? this.getLocaleCache(localeInstance).unitMappings
      : localeConfig.numberWordsMapping
          .filter((m) => Number(m.number) >= 100)
          .sort((a, b) => Number(b.number) - Number(a.number))
          .map((mapping) => ({
            numberBigInt: BigInt(mapping.number),
          }));

    // Find if this is a round number ending in a unit
    for (const mapping of unitMappings) {
      const unit = mapping.numberBigInt;
      if (number % unit === BIGINT_0) {
        // This number is a multiple of this unit
        // Return the unit itself (e.g., for 1000000 = 10 × 100000, return 100000)
        return unit;
      }
    }

    // Get the last two digits
    const lastTwoDigits = number % BIGINT_100;

    // Check if locale has atomic word for the last two digits (1-99)
    // This is true for Hindi, Bengali, Gujarati, Marathi, etc.
    // For numbers like 111 (last two digits = 11), check if locale has word for 11
    // Note: lastTwoDigits === 0 is impossible here — multiples of 100 are caught above by the
    // unit-mapping loop (e.g. 200 % 100 === 0 returns 100 early), so lastTwoDigits is always 1-99.
    const hasAtomicWord = localeConfig.numberWordsMapping.some((m) => BigInt(m.number) === lastTwoDigits);
    if (hasAtomicWord) {
      return lastTwoDigits;
    }

    // For English-style locales that compose 21-99 (Twenty + One)
    // Check for decade (20, 30, 40, etc.)
    if (lastTwoDigits % BIGINT_10 === BIGINT_0) {
      return lastTwoDigits;
    }

    // Return the ones digit
    return number % BIGINT_10;
  }

  /**
   * Parse a supported number without coercing decimal strings through Number().
   * This preserves integers beyond Number.MAX_SAFE_INTEGER and expands finite
   * scientific notation into ordinary integer/fractional digit components.
   */
  private parseNumberParts(number: NumberInput): ParsedNumberParts {
    if (typeof number === 'bigint') {
      return {
        isNegative: number < BIGINT_0,
        integerPart: number < BIGINT_0 ? -number : number,
        fractionalPart: '',
      };
    }

    if (typeof number === 'number') {
      const isNegative = number < 0;
      const absoluteNumber = isNegative ? -number : number;
      if (Number.isInteger(absoluteNumber)) {
        return {
          isNegative,
          integerPart: BigInt(absoluteNumber),
          fractionalPart: '',
        };
      }

      const decimal = absoluteNumber.toString();
      const decimalPointIndex = decimal.indexOf('.');
      if (decimalPointIndex !== -1 && !decimal.includes('e')) {
        return {
          isNegative,
          integerPart: BigInt(decimal.slice(0, decimalPointIndex)),
          fractionalPart: decimal.slice(decimalPointIndex + 1),
        };
      }
    }

    const input = typeof number === 'number' ? number.toString() : number.trim();

    // Integer strings are both common and exactly representable by BigInt, including
    // the hexadecimal/octal/binary forms already accepted by Number().
    if (typeof number === 'string' && !input.includes('.') && !/[eE]/.test(input)) {
      const integer = BigInt(input);
      return {
        isNegative: integer < BIGINT_0,
        integerPart: integer < BIGINT_0 ? -integer : integer,
        fractionalPart: '',
      };
    }

    const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/.exec(input)!;

    const sign = match[1];
    const integerDigits = match[2] ?? '0';
    const fractionalDigits = match[3] ?? match[4] ?? '';
    const exponent = Number(match[5] ?? 0);
    const digits = integerDigits + fractionalDigits;
    const decimalPosition = integerDigits.length + exponent;

    // Number() accepts extremely small exponent strings by underflowing them to zero.
    // Avoid allocating an attacker-controlled number of zero characters while still
    // supporting every exponent that a finite JavaScript number can represent.
    if (Math.abs(decimalPosition) > 10_000) {
      throw new Error(`Invalid Number "${String(number)}"`);
    }

    let normalizedInteger: string;
    let normalizedFractional: string;
    if (decimalPosition <= 0) {
      normalizedInteger = '0';
      normalizedFractional = '0'.repeat(-decimalPosition) + digits;
    } else if (decimalPosition >= digits.length) {
      normalizedInteger = digits + '0'.repeat(decimalPosition - digits.length);
      normalizedFractional = '';
    } else {
      normalizedInteger = digits.slice(0, decimalPosition);
      normalizedFractional = digits.slice(decimalPosition);
    }

    normalizedInteger = normalizedInteger.replace(/^0+(?=\d)/, '');
    const hasNonZeroDigit = /[1-9]/.test(normalizedInteger) || /[1-9]/.test(normalizedFractional);

    return {
      isNegative: sign === '-' && hasNonZeroDigit,
      integerPart: BigInt(normalizedInteger),
      fractionalPart: normalizedFractional,
    };
  }

  /** Round a parsed positive amount to a currency precision using decimal arithmetic. */
  private roundNumberParts(parts: ParsedNumberParts, precision: number): ParsedNumberParts {
    if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
      throw new RangeError('Currency precision must be an integer between 0 and 100');
    }

    const scale = BIGINT_10 ** BigInt(precision);
    const retainedDigits = parts.fractionalPart.slice(0, precision).padEnd(precision, '0');
    let scaledAmount = parts.integerPart * scale + BigInt(retainedDigits || '0');

    if ((parts.fractionalPart[precision] ?? '0') >= '5') {
      scaledAmount += BIGINT_1;
    }

    const integerPart = scaledAmount / scale;
    const fractionalPart =
      precision === 0 ? '' : (scaledAmount % scale).toString().padStart(precision, '0').replace(/0+$/, '');

    return {
      isNegative: parts.isNegative,
      integerPart,
      fractionalPart,
    };
  }

  protected convertNumber(
    number: NumberInput,
    options: ConverterOptions = {},
    localeOverride?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const locale = localeOverride ?? this.getLocale();
    const localeConfig = locale.config;
    const gender = options.gender;
    const useAnd = options.useAnd;

    let isNegativeNumber: boolean;
    let integerPart: bigint;
    let fractionalPart: string;

    // Keep the overwhelmingly common integer/BigInt cardinal path allocation-free.
    if (typeof number === 'bigint') {
      isNegativeNumber = number < BIGINT_0;
      integerPart = isNegativeNumber ? -number : number;
      fractionalPart = '';
    } else if (typeof number === 'number' && (Number.isInteger(number) || options.ignoreDecimal)) {
      isNegativeNumber = number < 0;
      integerPart = BigInt(Math.trunc(isNegativeNumber ? -number : number));
      fractionalPart = '';
    } else if (typeof number === 'string') {
      const input = number.trim();
      if (!input.includes('.') && !/[eE]/.test(input)) {
        const integer = BigInt(input);
        isNegativeNumber = integer < BIGINT_0;
        integerPart = isNegativeNumber ? -integer : integer;
        fractionalPart = '';
      } else {
        const parsed = this.parseNumberParts(input);
        isNegativeNumber = parsed.isNegative;
        integerPart = parsed.integerPart;
        fractionalPart = options.ignoreDecimal ? '' : parsed.fractionalPart;
      }
    } else {
      const parsed = this.parseNumberParts(number);
      isNegativeNumber = parsed.isNegative;
      integerPart = parsed.integerPart;
      // Typed numbers with ignoreDecimal are handled by the fast path above.
      fractionalPart = parsed.fractionalPart;
    }

    const isFloat = fractionalPart.length > 0 && /[1-9]/.test(fractionalPart);

    const ignoreZero = integerPart === BIGINT_0 && localeConfig.ignoreZeroInDecimals;
    let words = this.convertInternal(integerPart, true, undefined, locale, gender, useAnd);
    if (isFloat && ignoreZero) {
      words = [];
    }

    const wordsWithDecimal: string[] = [];
    if (isFloat) {
      const fracValue = Number.parseInt(fractionalPart, 10);
      const denominator = localeConfig.fractionDenominatorMapping?.[fractionalPart.length];
      if (options.decimalStyle === 'fraction' && denominator) {
        // Fractional style: "One Hundred Twenty Three and Forty-Five Hundredths"
        if (!ignoreZero) {
          wordsWithDecimal.push(localeConfig.texts.and);
        }
        wordsWithDecimal.push(...this.convertInternal(BigInt(fracValue), true, undefined, locale, gender));
        const useSingular =
          localeConfig.fractionSingularRule === 'slavic'
            ? fracValue % 10 === 1 && fracValue % 100 !== 11
            : fracValue === 1;
        wordsWithDecimal.push(useSingular ? denominator.singular : denominator.plural);
      } else {
        // Default digit-by-digit style
        if (!ignoreZero) {
          wordsWithDecimal.push(localeConfig.texts.point);
        }
        if (fractionalPart.startsWith('0') && !localeConfig?.decimalLengthWordMapping) {
          const zeroWords: string[] = [];
          for (const num of fractionalPart) {
            zeroWords.push(...this.convertInternal(BigInt(num), true, undefined, locale, gender));
          }
          wordsWithDecimal.push(...zeroWords);
        } else {
          wordsWithDecimal.push(...this.convertInternal(BigInt(fractionalPart), true, undefined, locale, gender));
          const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];
          if (decimalLengthWord) {
            wordsWithDecimal.push(decimalLengthWord);
          }
        }
      }
    }
    const isEmpty = words.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(localeConfig.texts.minus);
    }
    words.push(...wordsWithDecimal);
    return words;
  }

  protected convertCurrency(
    number: NumberInput,
    options: ConverterOptions = {},
    forceZeroFractional = false,
    localeOverride?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const locale = localeOverride ?? this.getLocale();
    const localeConfig = locale.config;
    const gender = options.gender;
    const useAnd = options.useAnd;

    const currencyOptions = options.currencyOptions ?? localeConfig.currency;
    const precision = currencyOptions.precision ?? 2;
    const parsed = this.parseNumberParts(number);
    const rounded = options.ignoreDecimal
      ? { ...parsed, fractionalPart: '' }
      : this.roundNumberParts(parsed, precision);
    const isNegativeNumber = rounded.isNegative;
    const mainAmount = rounded.integerPart;
    const fractionalPart = rounded.fractionalPart;
    const isFloat = fractionalPart.length > 0;
    let words: string[] = [];

    const mainAmountNum = mainAmount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(mainAmount) : -1;
    if (mainAmountNum !== -1 && currencyOptions.numberSpecificForms?.[mainAmountNum]) {
      words = [currencyOptions.numberSpecificForms[mainAmountNum]];
    } else {
      // Determine if the main currency should be in singular form
      // e.g. 1 Dollar Only instead of 1 Dollars Only
      // Use useTrailingForCurrency config to determine trailing value
      // French needs trailing=true to get "Quatre-Vingts Euros" (with 's')
      // Spanish needs trailing=false to get "Un Euro" (not "Uno Euro")
      const trailing = localeConfig.useTrailingForCurrency ?? false;
      words = [...this.convertInternal(mainAmount, trailing, undefined, locale, gender, useAnd)];
      if (mainAmount === 1n && currencyOptions.singular) {
        words.push(currencyOptions.singular);
      } else if (currencyOptions.plural) {
        words.push(currencyOptions.plural);
      }
    }
    const totalIsNonZero = mainAmount !== BIGINT_0 || isFloat;
    const ignoreZero =
      mainAmount === BIGINT_0 && (options.ignoreZeroCurrency || (localeConfig.ignoreZeroInDecimals && totalIsNonZero));

    if (ignoreZero) {
      words = [];
    }

    const wordsWithDecimal = [];
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(localeConfig.texts.and);
      }
      const decimalBase =
        !localeConfig.decimalLengthWordMapping && fractionalPart.length
          ? BIGINT_10 ** BigInt(Math.max(0, precision - fractionalPart.length))
          : BIGINT_1;
      const decimalPart = BigInt(fractionalPart) * decimalBase;
      const decimalPartNumber = decimalPart <= BIGINT_MAX_SAFE ? Number(decimalPart) : -1;

      const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];

      if (decimalPartNumber !== -1 && currencyOptions.fractionalUnit.numberSpecificForms?.[decimalPartNumber]) {
        wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPartNumber]);
      } else {
        wordsWithDecimal.push(...this.convertInternal(decimalPart, false, undefined, locale, gender));

        if (decimalLengthWord?.length) {
          wordsWithDecimal.push(decimalLengthWord);
        }

        if (decimalPart === BIGINT_1 && currencyOptions.fractionalUnit.singular) {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.singular);
        } else {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
        }
      }
    } else if (
      forceZeroFractional &&
      !ignoreZero &&
      !localeConfig.decimalLengthWordMapping &&
      !!currencyOptions.fractionalUnit.plural
    ) {
      wordsWithDecimal.push(localeConfig.texts.and);
      if (currencyOptions.fractionalUnit.numberSpecificForms?.[0]) {
        wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[0]);
      } else {
        wordsWithDecimal.push(...this.convertInternal(0n, false, undefined, locale, gender));
        wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
      }
    } else if (localeConfig.decimalLengthWordMapping && words.length) {
      wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
    }
    const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(localeConfig.texts.minus);
    }
    if (!isEmpty && localeConfig.texts.only && !options.doNotAddOnly && !localeConfig.onlyInFront) {
      wordsWithDecimal.push(localeConfig.texts.only);
    }
    if (wordsWithDecimal.length) {
      words.push(...wordsWithDecimal);
    }

    if (!isEmpty && !options.doNotAddOnly && localeConfig.onlyInFront) {
      words.splice(0, 0, localeConfig.texts.only);
    }

    return words;
  }

  protected convertInternal(
    number: bigint,
    trailing: boolean = false,
    overrides?: Record<number, string>,
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
    gender?: 'masculine' | 'feminine',
    useAnd?: boolean,
  ): string[] {
    const locale = localeInstance ?? this.getLocale();
    const localeConfig = locale.config;
    const cache = this.getLocaleCache(locale);

    // Check overrides - avoid Object.keys() when overrides is undefined/empty
    if (overrides) {
      const numberAsNum = number <= BIGINT_MAX_SAFE ? Number(number) : -1;
      if (numberAsNum !== -1 && overrides[numberAsNum]) {
        return [overrides[numberAsNum]];
      }
    }

    // Check exactWordsMapping using O(1) Map lookup
    const exactMatch = cache.exactWordsMap.get(number);
    if (exactMatch) {
      return [this.resolveGenderedValue(exactMatch, gender, trailing)];
    }

    // Fast path: Use O(1) Map lookup for small numbers (0-100)
    let match: CachedNumberWordMap;
    if (number <= BIGINT_100) {
      const directMatch = cache.smallNumbersMap.get(number);
      if (directMatch) {
        return [this.resolveGenderedValue(directMatch, gender, trailing)];
      }
      // Number not directly in map, use binary search (e.g., 21 = 20 + 1)
      match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
    } else {
      // Use binary search on pre-computed BigInt values (array is sorted descending)
      match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
    }

    const matchNumber = match.numberBigInt;
    const words: string[] = [];

    if (number <= BIGINT_100 || (number < BIGINT_1000 && localeConfig.namedLessThan1000)) {
      words.push(this.resolveGenderedValue(match, gender, trailing));
      const remainder = number - matchNumber;
      if (remainder > BIGINT_0) {
        if (localeConfig.splitWord) {
          words.push(localeConfig.splitWord);
        }
        const remainderWords = this.convertInternal(remainder, trailing, overrides, locale, gender, useAnd);
        for (const remainderWord of remainderWords) {
          words.push(remainderWord);
        }
      }
      return words;
    }

    const quotient = number / matchNumber;
    const remainder = number % matchNumber;
    let matchValue = match.resolvedValue;
    const originalMatchValue = match.resolvedValue;

    const matchNumberNum = Number(matchNumber);
    const pluralForms = localeConfig.pluralForms?.[matchNumberNum];
    let usedPluralForm = false;

    // Check if this word uses ignoreOneForWords - use O(1) Set lookup
    const usesIgnoreOne = cache.ignoreOneForWordsSet.has(originalMatchValue);

    if (pluralForms) {
      const lastTwoDigits = Number(quotient % BIGINT_100);
      const useLastDigits = quotient >= BIGINT_11 && lastTwoDigits >= 3 && lastTwoDigits <= 10;

      if (quotient === BIGINT_2 && pluralForms.dual) {
        matchValue = pluralForms.dual;
        usedPluralForm = true;
      } else if (
        (quotient >= BigInt(localeConfig.paucalConfig?.min ?? 3) &&
          quotient <= BigInt(localeConfig.paucalConfig?.max ?? 10)) ||
        useLastDigits
      ) {
        if (pluralForms.paucal) {
          matchValue = pluralForms.paucal;
        }
      } else if (quotient >= BIGINT_11 && pluralForms.plural) {
        matchValue = pluralForms.plural;
      }
    } else {
      // Check if this word should get plural mark - use O(1) Set lookup
      const matchValueStr = match.value as string;
      const isInPluralWords = cache.pluralWordsSet.has(matchValueStr);
      const isInTrailingOnlyPluralWords = cache.pluralWordsOnlyWhenTrailingSet.has(matchValueStr);

      if (
        quotient > BIGINT_1 &&
        localeConfig.pluralMark &&
        (isInPluralWords || (isInTrailingOnlyPluralWords && remainder === BIGINT_0))
      ) {
        matchValue += localeConfig.pluralMark;
      }
      // Apply singularValue only when quotient ends in 1 AND this word doesn't use ignoreOneForWords
      // For ignoreOneForWords words, singularValue is handled separately below
      if (quotient % BIGINT_10 === BIGINT_1 && !usesIgnoreOne) {
        // matchValue is always resolvedValue (a string), so the Array.isArray guard is not needed.
        matchValue = match.singularValue || matchValue;
      }
    }

    if ((quotient === BIGINT_1 && usesIgnoreOne) || usedPluralForm) {
      // When ignoring "one" and quotient is exactly 1, use singularValue if available
      let valueToUse: string;
      if (usedPluralForm) {
        valueToUse = matchValue;
      } else if (match.singularValue) {
        valueToUse = match.singularValue;
      } else {
        // Gender-resolve the value (e.g. Spanish "Doscientos" → "Doscientas")
        valueToUse = this.resolveGenderedValue(match, gender, trailing);
      }
      words.push(valueToUse);
    } else {
      // Quotient does NOT get gender — gender applies to the number being described, not scale multipliers
      const quotientWords = this.convertInternal(quotient, false, overrides, locale, undefined, useAnd);
      if (localeConfig.scaleFirst) {
        // Scale-first ordering (e.g. Igbo: "Puku Abụọ" = Thousand Two = 2000)
        words.push(matchValue);
        for (const quotientWord of quotientWords) {
          words.push(quotientWord);
        }
      } else {
        for (const quotientWord of quotientWords) {
          words.push(quotientWord);
        }
        words.push(matchValue);
      }
    }

    if (remainder > BIGINT_0) {
      // useAnd: insert "And" between unit word and remainder when remainder < 100
      // Skip if locale already uses splitWord (e.g. Portuguese "E")
      const andWord = localeConfig.texts.and?.trim();
      if (useAnd && remainder < BIGINT_100 && !localeConfig.splitWord && andWord) {
        words.push(localeConfig.texts.and);
      }
      if (localeConfig.splitWord) {
        // Use O(1) Set lookup instead of array.includes()
        if (!cache.noSplitWordAfterSet.has(match.resolvedValue)) {
          words.push(localeConfig.splitWord);
        }
      }
      const remainderWords = this.convertInternal(remainder, trailing, overrides, locale, gender, useAnd);
      for (const remainderWord of remainderWords) {
        words.push(remainderWord);
      }
    }
    return words;
  }

  /**
   * Binary search on a descending-sorted array of CachedNumberWordMap.
   * Finds the first element where numberBigInt <= target.
   */
  private binarySearchDescending(arr: CachedNumberWordMap[], target: bigint): CachedNumberWordMap {
    let left = 0;
    let right = arr.length - 1;
    let result = arr[right]; // Default to smallest (last element)

    while (left <= right) {
      const mid = (left + right) >> 1; // Faster than Math.floor
      if (arr[mid].numberBigInt <= target) {
        result = arr[mid];
        right = mid - 1; // Look for larger match in left half
      } else {
        left = mid + 1; // Look in right half
      }
    }

    return result;
  }

  public toFixed(number: number, precision = 2): number {
    return Number(Number(number).toFixed(precision));
  }

  public isFloat(number: number | string): boolean {
    return Number(number) === number && number % 1 !== 0;
  }

  public isValidNumber(number: NumberInput): boolean {
    // Fast path for common types
    const type = typeof number;
    if (type === 'bigint') {
      return true;
    }
    if (type === 'number') {
      return !Number.isNaN(number) && Number.isFinite(number as number);
    }
    // String case - reject empty/whitespace strings, then check if valid number
    // Empty string converts to 0 via Number() but should be invalid
    if (type === 'string') {
      const str = number as string;
      if (str.trim() === '') {
        return false;
      }
      const converted = Number(str);
      return !Number.isNaN(converted) && Number.isFinite(converted);
    }

    return false;
  }

  public isNumberZero(number: number | bigint): boolean {
    if (typeof number === 'bigint') {
      return number === BIGINT_0;
    }
    return number >= 0 && number < 1;
  }
}

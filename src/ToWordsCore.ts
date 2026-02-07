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
};

export const DefaultToWordsOptions: ToWordsOptions = {
  localeCode: 'en-IN',
  converterOptions: DefaultConverterOptions,
};

// Cached BigInt mappings per locale to avoid repeated conversions
interface CachedNumberWordMap extends NumberWordMap {
  numberBigInt: bigint;
  resolvedValue: string; // Pre-resolved value (first element if array)
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

  constructor(options: ToWordsOptions = {}) {
    this.options = Object.assign({}, DefaultToWordsOptions, options);
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
    if (localeCache.has(locale)) return;

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
            currencyOptions: options.currencyOptions ?? baseOptions?.currencyOptions,
          };

    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${number}"`);
    }

    const isBigInt = typeof number === 'bigint';
    let numericValue: number | bigint = isBigInt ? number : Number(number);

    if (mergedOptions.ignoreDecimal && !isBigInt) {
      numericValue = Math.trunc(numericValue as number);
    }

    let words: string[] = [];
    if (mergedOptions.currency) {
      words = this.convertCurrency(numericValue, mergedOptions);
    } else {
      words = this.convertNumber(numericValue);
    }

    if (this.locale?.config.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  public toOrdinal(number: NumberInput, options: OrdinalOptions = {}): string {
    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${number}"`);
    }

    const locale = this.getLocale();
    const localeConfig = locale.config;

    // Convert to number (ordinals typically don't need BigInt support for practical use)
    const numValue = typeof number === 'bigint' ? Number(number) : Number(number);

    if (!Number.isInteger(numValue) || numValue < 0) {
      throw new Error(`Ordinal numbers must be non-negative integers, got "${number}"`);
    }

    // Check if locale supports ordinals
    if (!localeConfig.ordinalWordsMapping && !localeConfig.ordinalSuffix) {
      throw new Error(`Ordinal conversion not supported for locale "${this.options.localeCode}"`);
    }

    const words = this.convertOrdinal(numValue, options, locale);

    if (localeConfig.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  protected convertOrdinal(
    number: number,
    _options: OrdinalOptions,
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const localeConfig = localeInstance.config;

    // Check exact ordinal mapping first (for special cases like 100 that need special wording)
    if (localeConfig.ordinalExactWordsMapping) {
      const exactMatch = localeConfig.ordinalExactWordsMapping.find((m) => m.number === number);
      if (exactMatch) {
        return [exactMatch.value];
      }
    }

    // For simple numbers (0-20), use direct ordinal mapping
    if (number <= 20 && localeConfig.ordinalWordsMapping) {
      const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => m.number === number);
      if (ordinalMatch) {
        return [ordinalMatch.value];
      }
    }

    // For composite numbers (like 21, 1000, 1234), convert to cardinal then modify last component
    // Strategy: Convert the number to cardinal, then find the last component and replace it with ordinal
    const cardinalWords = this.convertInternal(BigInt(number), true, undefined, localeInstance);

    if (cardinalWords.length > 0) {
      // We need to convert only the last number word to ordinal form
      // For composite numbers like 21 (Twenty One), only "One" should become "First"
      // For 1000 (One Thousand), "Thousand" becomes "Thousandth"
      const lastWordIndex = cardinalWords.length - 1;
      const lastWord = cardinalWords[lastWordIndex];

      // Find what number the last word represents
      const lastNumberComponent = this.getLastNumberComponent(number, localeConfig);

      // Try to find ordinal mapping for the last component
      if (localeConfig.ordinalWordsMapping) {
        const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => m.number === lastNumberComponent);
        if (ordinalMatch) {
          cardinalWords[lastWordIndex] = ordinalMatch.value;
          return cardinalWords;
        }
      }

      // If ordinalSuffix is available, use it
      if (localeConfig.ordinalSuffix) {
        cardinalWords[lastWordIndex] = lastWord + localeConfig.ordinalSuffix;
      }
    }

    return cardinalWords;
  }

  protected getLastNumberComponent(number: number, localeConfig: LocaleInterface['config']): number {
    // Find the last number component that makes up this number
    // This is locale-aware: Hindi/Indic locales have atomic words for 21-99,
    // while English composes them (Twenty + One)

    // For numbers 1-20, return the number itself
    if (number <= 20) {
      return number;
    }

    // Get the units defined in the locale (sorted descending)
    const unitMappings = localeConfig.numberWordsMapping
      .filter((m) => Number(m.number) >= 100) // Units are 100 and above
      .sort((a, b) => Number(b.number) - Number(a.number));

    // Find if this is a round number ending in a unit
    for (const mapping of unitMappings) {
      const unit = Number(mapping.number);
      if (number % unit === 0) {
        // This number is a multiple of this unit
        // Return the unit itself (e.g., for 1000000 = 10 × 100000, return 100000)
        return unit;
      }
    }

    // Get the last two digits
    const lastTwoDigits = number % 100;

    // Check if locale has atomic word for the last two digits (1-99)
    // This is true for Hindi, Bengali, Gujarati, Marathi, etc.
    // For numbers like 111 (last two digits = 11), check if locale has word for 11
    if (lastTwoDigits >= 1 && lastTwoDigits <= 99) {
      const hasAtomicWord = localeConfig.numberWordsMapping.some((m) => Number(m.number) === lastTwoDigits);
      if (hasAtomicWord) {
        return lastTwoDigits;
      }
    }

    // For English-style locales that compose 21-99 (Twenty + One)
    // Check for decade (20, 30, 40, etc.)
    if (lastTwoDigits % 10 === 0) {
      return lastTwoDigits;
    }

    // Return the ones digit
    return number % 10;
  }

  protected convertNumber(number: number | bigint): string[] {
    const locale = this.getLocale();
    const localeConfig = locale.config;

    const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
    if (isNegativeNumber) {
      number = typeof number === 'bigint' ? -number : Math.abs(number);
    }

    const isBigInt = typeof number === 'bigint';
    const isFloat = !isBigInt && this.isFloat(number as number);
    let integerPart: bigint;
    let fractionalPart = '';

    if (isBigInt) {
      integerPart = number as bigint;
    } else if (isFloat) {
      const segments = number.toString().split('.');
      integerPart = BigInt(segments[0]);
      fractionalPart = segments[1] ?? '';
    } else {
      integerPart = BigInt(Math.trunc(number as number));
    }

    const ignoreZero = this.isNumberZero(number) && localeConfig.ignoreZeroInDecimals;
    let words = this.convertInternal(integerPart, true, undefined, locale);
    if (isFloat && ignoreZero) {
      words = [];
    }

    const wordsWithDecimal: string[] = [];
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(localeConfig.texts.point);
      }
      if (fractionalPart.startsWith('0') && !localeConfig?.decimalLengthWordMapping) {
        const zeroWords: string[] = [];
        for (const num of fractionalPart) {
          zeroWords.push(...this.convertInternal(BigInt(num), true, undefined, locale));
        }
        wordsWithDecimal.push(...zeroWords);
      } else if (fractionalPart.length) {
        wordsWithDecimal.push(...this.convertInternal(BigInt(fractionalPart), true, undefined, locale));
        const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];
        if (decimalLengthWord) {
          wordsWithDecimal.push(decimalLengthWord);
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

  protected convertCurrency(number: number | bigint, options: ConverterOptions = {}): string[] {
    const locale = this.getLocale();
    const localeConfig = locale.config;

    const currencyOptions = options.currencyOptions ?? localeConfig.currency;

    const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
    if (isNegativeNumber) {
      number = typeof number === 'bigint' ? -number : Math.abs(number);
    }

    const isBigInt = typeof number === 'bigint';
    if (!isBigInt) {
      number = this.toFixed(number as number);
    }
    // Extra check for isFloat to overcome 1.999 rounding off to 2
    const isFloat = !isBigInt && this.isFloat(number as number);
    let mainAmount: bigint;
    let fractionalPart = '';

    if (isBigInt) {
      mainAmount = number as bigint;
    } else if (isFloat) {
      const segments = number.toString().split('.');
      mainAmount = BigInt(segments[0]);
      fractionalPart = segments[1] ?? '';
    } else {
      mainAmount = BigInt(Math.trunc(number as number));
    }
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
      words = [...this.convertInternal(mainAmount, trailing, undefined, locale)];
      if (mainAmount === 1n && currencyOptions.singular) {
        words.push(currencyOptions.singular);
      } else if (currencyOptions.plural) {
        words.push(currencyOptions.plural);
      }
    }
    const ignoreZero =
      this.isNumberZero(number) &&
      (options.ignoreZeroCurrency || (localeConfig?.ignoreZeroInDecimals && number !== 0 && number !== 0n));

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
          ? Math.pow(10, Math.max(0, 2 - fractionalPart.length))
          : 1;
      const decimalPart = Number(fractionalPart || '0') * decimalBase;

      const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];

      if (currencyOptions.fractionalUnit.numberSpecificForms?.[decimalPart]) {
        wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPart]);
      } else {
        wordsWithDecimal.push(...this.convertInternal(BigInt(decimalPart), false, undefined, locale));

        if (decimalLengthWord?.length) {
          wordsWithDecimal.push(decimalLengthWord);
        }

        if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.singular);
        } else {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
        }
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
    overrides: Record<number, string> | undefined = undefined,
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
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
      return [trailing && Array.isArray(exactMatch.value) ? exactMatch.value[1] : exactMatch.resolvedValue];
    }

    // Fast path: Use O(1) Map lookup for small numbers (0-100)
    let match: CachedNumberWordMap;
    if (number <= BIGINT_100) {
      const directMatch = cache.smallNumbersMap.get(number);
      if (directMatch) {
        return [trailing && Array.isArray(directMatch.value) ? directMatch.value[1] : directMatch.resolvedValue];
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
      words.push(match.resolvedValue);
      const remainder = number - matchNumber;
      if (remainder > BIGINT_0) {
        if (localeConfig.splitWord) {
          words.push(localeConfig.splitWord);
        }
        const remainderWords = this.convertInternal(remainder, trailing, overrides, locale);
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
        matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
      }
    }

    if ((quotient === BIGINT_1 && usesIgnoreOne) || usedPluralForm) {
      // When ignoring "one" and quotient is exactly 1, use singularValue if available
      const valueToUse = quotient === BIGINT_1 && match.singularValue ? match.singularValue : matchValue;
      words.push(valueToUse);
    } else {
      const quotientWords = this.convertInternal(quotient, false, overrides, locale);
      for (const quotientWord of quotientWords) {
        words.push(quotientWord);
      }
      words.push(matchValue);
    }

    if (remainder > BIGINT_0) {
      if (localeConfig.splitWord) {
        // Use O(1) Set lookup instead of array.includes()
        if (!cache.noSplitWordAfterSet.has(match.resolvedValue)) {
          words.push(localeConfig.splitWord);
        }
      }
      const remainderWords = this.convertInternal(remainder, trailing, overrides, locale);
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
    const str = number as string;
    if (str.trim() === '') {
      return false;
    }
    const converted = Number(str);
    return !Number.isNaN(converted) && Number.isFinite(converted);
  }

  public isNumberZero(number: number | bigint): boolean {
    if (typeof number === 'bigint') {
      return number === BIGINT_0;
    }
    return number >= 0 && number < 1;
  }
}

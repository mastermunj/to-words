/**
 * Internal conversion core for prevalidated bundled locale entry points.
 *
 * This is the base class that contains all conversion logic but does NOT import
 * any locale files. It's designed for tree-shaking when used with per-locale entry points.
 *
 * For the full package with all locales, use `ToWords` from the main entry point.
 * For tree-shaken single-locale imports, use `ToWords` from a locale entry point:
 *
 * @example
 * // Full package (all locales)
 * import { ToWords } from 'to-words';
 * const tw = new ToWords({ localeCode: 'en-IN' });
 *
 * // Single-locale bundle - SAME API!
 * import { ToWords } from 'to-words/en-IN';
 * const tw = new ToWords();
 */

import {
  type ConstructorOf,
  type ConverterOptions,
  type ConversionForm,
  type FormalConfig,
  type LocaleInterface,
  type LocaleConfig,
  type NumberInput,
  type NumberWordMap,
  type OrdinalWordMap,
  type OrdinalOptions,
  type OutputStyleOptions,
  type RangeMode,
  type ToWordsOptions,
} from './types.js';
import { NumberOutOfRangeError } from './errors.js';
import { pickPluralForm, selectPluralCategory, type PluralCategory } from './plural-rules.js';

/**
 * Internal word-list marker: the words on either side are written as one compound word.
 * Only emitted when a locale sets `wordJoining.compoundBelow`; removed by joinWords().
 */
const GLUE = '\uE000';

const VOWEL_INITIAL = /^[aeiouyàâäéèêëîïôöùûüœæ]/iu;

/**
 * True when the number is one additive component: a unit, a teen, a round ten or a round hundred,
 * optionally times one power of 1000 with nothing below it (100, 20, 15, 100 000, 2 000 000).
 */
function isSingleComponent(value: bigint): boolean {
  let rest = value;
  while (rest >= 1000n && rest % 1000n === 0n) {
    rest /= 1000n;
  }
  return rest < 1000n && (rest <= 20n || (rest < 100n ? rest % 10n === 0n : rest % 100n === 0n));
}

/** One non-zero group of three, below 100 or a whole hundred, then only zeros (pt mil e cem, um milhão e duzentos mil). */
function isSimpleLastGroup(value: bigint): boolean {
  let rest = value;
  while (rest >= 1000n && rest % 1000n === 0n) {
    rest /= 1000n;
  }
  return rest < 1000n && (rest < 100n || rest % 100n === 0n);
}

/** ro «de»: a number whose last two digits are 00 or 20–99 takes «de» before its noun (douăzeci de mii, o sută de lei). */
function takesNounConnector(value: bigint): boolean {
  const lastTwo = value % 100n;
  return value > 0n && (lastTwo === 0n || lastTwo >= 20n);
}

function lowerFirst(word: string): string {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

/** Locale-aware case change (tr İki → iki); a tag the runtime rejects falls back to the root rules. */
function changeCase(text: string, tag: string, upper: boolean): string {
  try {
    return upper ? text.toLocaleUpperCase(tag) : text.toLocaleLowerCase(tag);
  } catch {
    return upper ? text.toUpperCase() : text.toLowerCase();
  }
}

export const DefaultConverterOptions: Readonly<ConverterOptions> = Object.freeze({
  currency: false,
  ignoreDecimal: false,
  ignoreZeroCurrency: false,
  doNotAddOnly: false,
  includeZeroFractional: false,
  rangeMode: 'strict',
});

export const DefaultToWordsOptions: Readonly<ToWordsOptions> = Object.freeze({
  localeCode: 'en-IN',
  converterOptions: DefaultConverterOptions,
});

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
  ordinalWordsMap: Map<bigint, OrdinalWordMap>;
  ordinalExactWordsMap: Map<bigint, OrdinalWordMap>;
  // Pre-computed unit thresholds for faster iteration
  unitMappings: CachedNumberWordMap[]; // Numbers >= 100, sorted descending
  smallNumbersBoundary: bigint; // The largest "small number" that has an atomic word
  // O(1) lookup sets for plural/ignore words
  pluralWordsSet: Set<string>;
  pluralWordsOnlyWhenTrailingSet: Set<string>;
  ignoreOneForWordsSet: Set<string>;
  noSplitWordAfterSet: Set<string>;
  maximumSupported: Readonly<Record<'cardinal' | 'ordinal' | 'currency', bigint>>;
  /** Word for zero, used by `zeroForSkippedPlaces`. */
  zeroWord: string;
  /** Ordinal mapping keys, descending, for `ordinalComposition: 'every-component'`. */
  ordinalUnitsDescending: bigint[];
  /** Cardinal word → number, for `ordinalComposition: 'last-token'`. */
  cardinalWordNumbers: Map<string, bigint>;
  compoundBelow: bigint | undefined;
  separateAfterSet: Set<bigint>;
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

/** Freeze locale data recursively so public inspection cannot invalidate internal caches. */
function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }
  return value;
}

function snapshotConverterOptions(options: ConverterOptions | undefined): ConverterOptions | undefined {
  if (!options) {
    return options;
  }
  const currencyOptions = options.currencyOptions;
  return {
    ...options,
    currencyOptions: currencyOptions
      ? {
          ...currencyOptions,
          numberSpecificForms: currencyOptions.numberSpecificForms
            ? { ...currencyOptions.numberSpecificForms }
            : undefined,
          fractionalUnit: {
            ...currencyOptions.fractionalUnit,
            numberSpecificForms: currencyOptions.fractionalUnit.numberSpecificForms
              ? { ...currencyOptions.fractionalUnit.numberSpecificForms }
              : undefined,
          },
        }
      : undefined,
  };
}

/** Compact derivation for built-in tables already checked by the locale quality gate. */
function getBundledMaximumSupportedValues(config: LocaleConfig): Readonly<Record<ConversionForm, string>> {
  const numbers = config.numberWordsMapping.map(({ number }) => BigInt(number));
  const numberSet = new Set(numbers);
  const largest = numbers[0];
  const outerWidth =
    numberSet.has(10_000n) && numberSet.has(100_000_000n)
      ? 4
      : numberSet.has(100_000n) && numberSet.has(10_000_000n)
        ? 2
        : 3;
  const derived = (largest * 10n ** BigInt(outerWidth) - 1n).toString();
  const configured = config.maximumSupportedValues;
  return {
    cardinal: String(configured?.cardinal ?? derived),
    ordinal: String(configured?.ordinal ?? derived),
    currency: String(configured?.currency ?? derived),
  };
}

export class ToWordsCore {
  protected options: ToWordsOptions = {};

  protected locale: InstanceType<ConstructorOf<LocaleInterface>> | undefined = undefined;

  protected localeClass: ConstructorOf<LocaleInterface> | undefined = undefined;

  protected localeIdentifier: string | undefined = undefined;

  private formalLocale: InstanceType<ConstructorOf<LocaleInterface>> | undefined = undefined;

  constructor(options: ToWordsOptions = {}) {
    this.options = deepFreeze({
      localeCode: options.localeCode ?? DefaultToWordsOptions.localeCode,
      converterOptions: snapshotConverterOptions(options.converterOptions) ?? DefaultToWordsOptions.converterOptions,
    });
  }

  /**
   * Resolve gendered value from a cached number-word mapping entry.
   */
  private resolveGenderedValue(
    entry: CachedNumberWordMap,
    gender: 'masculine' | 'feminine' | undefined,
    trailing: boolean,
    leading = true,
  ): string {
    if (!leading && entry.nonLeadingValue) {
      return entry.nonLeadingValue;
    }
    if (gender === 'feminine' && entry.feminineValue) {
      return entry.feminineValue;
    }
    if (gender === 'masculine' && entry.masculineValue) {
      return entry.masculineValue;
    }
    return trailing && Array.isArray(entry.value) ? entry.value[1] : entry.resolvedValue;
  }

  /** Resolve an ordinal mapping's explicit or locale-wide gender form. */
  private resolveOrdinalValue(
    entry: OrdinalWordMap,
    gender: OrdinalOptions['gender'],
    localeConfig: LocaleInterface['config'],
  ): string {
    if (gender === 'feminine') {
      if (entry.feminineValue) {
        return entry.feminineValue;
      }

      const suffixes = localeConfig.ordinalGenderSuffixMapping;
      if (suffixes && BigInt(entry.number) !== BIGINT_0 && entry.value.endsWith(suffixes.masculine)) {
        return entry.value.slice(0, -suffixes.masculine.length) + suffixes.feminine;
      }
    }
    if (gender === 'masculine' && entry.masculineValue) {
      return entry.masculineValue;
    }
    return entry.value;
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
    return { config: deepFreeze(mergedConfig) };
  }

  /**
   * Set a locale class directly.
   * @internal Used by per-locale entry points
   */
  public setLocale(localeClass: ConstructorOf<LocaleInterface>, localeIdentifier?: string): this {
    this.localeClass = localeClass;
    this.localeIdentifier = localeIdentifier;
    this.locale = undefined; // Reset cached locale instance
    this.formalLocale = undefined;
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
      this.validateLocaleClass(LocaleClass, this.locale);
      deepFreeze(this.locale.config);
      // Initialize cache for this locale
      this.initLocaleCache(this.locale);
    }
    return this.locale;
  }

  /** Hook used by the public core to validate untrusted custom locale classes. */
  protected validateLocaleClass(
    LocaleClass: ConstructorOf<LocaleInterface>,
    locale: InstanceType<ConstructorOf<LocaleInterface>>,
  ): void {
    void LocaleClass;
    void locale;
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

    const ordinalWordsMap = new Map<bigint, OrdinalWordMap>();
    for (const elem of config.ordinalWordsMapping ?? []) {
      ordinalWordsMap.set(BigInt(elem.number), elem);
    }

    const ordinalExactWordsMap = new Map<bigint, OrdinalWordMap>();
    for (const elem of config.ordinalExactWordsMapping ?? []) {
      ordinalExactWordsMap.set(BigInt(elem.number), elem);
    }

    // Pre-compute unit mappings (>= 100) for faster iteration - already sorted descending
    const unitMappings = numberWordsMappingBigInt.filter((m) => m.numberBigInt >= BIGINT_100);

    // Create Sets for O(1) lookup instead of array.includes()
    const pluralWordsSet = new Set<string>(config.pluralWords ?? []);
    const pluralWordsOnlyWhenTrailingSet = new Set<string>(config.pluralWordsOnlyWhenTrailing ?? []);
    const ignoreOneForWordsSet = new Set<string>(config.ignoreOneForWords ?? []);
    const noSplitWordAfterSet = new Set<string>(config.noSplitWordAfter ?? []);
    const maximumSupportedValues = this.getMaximumSupportedValues(config);

    const cardinalWordNumbers = new Map<string, bigint>();
    for (const elem of numberWordsMappingBigInt) {
      // nonLeadingValue too (it 103 → Cento Tré), so last-token ordinals find the compound form.
      const forms = [
        ...(Array.isArray(elem.value) ? elem.value : [elem.value]),
        ...(elem.nonLeadingValue ? [elem.nonLeadingValue] : []),
      ];
      for (const form of forms) {
        if (!cardinalWordNumbers.has(form)) {
          cardinalWordNumbers.set(form, elem.numberBigInt);
        }
      }
    }
    // Plural scale forms too (ro Două Milioane), so last-token ordinals find them.
    for (const [value, forms] of Object.entries(config.pluralForms ?? {})) {
      for (const form of Object.values(forms)) {
        if (typeof form === 'string' && !cardinalWordNumbers.has(form)) {
          // Keys of large scales stringify in exponent form (1e+21); powers of ten are exact doubles.
          cardinalWordNumbers.set(form, BigInt(Number(value)));
        }
      }
    }
    const compoundBelow = config.wordJoining?.compoundBelow;

    localeCache.set(locale, {
      numberWordsMappingBigInt,
      exactWordsMap,
      smallNumbersMap,
      ordinalWordsMap,
      ordinalExactWordsMap,
      unitMappings,
      smallNumbersBoundary,
      pluralWordsSet,
      pluralWordsOnlyWhenTrailingSet,
      ignoreOneForWordsSet,
      noSplitWordAfterSet,
      maximumSupported: Object.freeze({
        cardinal: BigInt(maximumSupportedValues.cardinal),
        ordinal: BigInt(maximumSupportedValues.ordinal),
        currency: BigInt(maximumSupportedValues.currency),
      }),
      // The contract guarantees a zero entry.
      zeroWord: smallNumbersMap.get(BIGINT_0)!.resolvedValue,
      ordinalUnitsDescending: [...ordinalWordsMap.keys()].sort((left, right) => Number(right - left)),
      cardinalWordNumbers,
      compoundBelow: compoundBelow === undefined ? undefined : BigInt(compoundBelow),
      separateAfterSet: new Set((config.wordJoining?.separateAfter ?? []).map((value) => BigInt(value))),
    });
  }

  /** Range derivation hook; the public core overrides this for arbitrary custom configurations. */
  protected getMaximumSupportedValues(config: LocaleConfig): Readonly<Record<ConversionForm, string>> {
    return getBundledMaximumSupportedValues(config);
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
        ? baseOptions!
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
            rangeMode: options.rangeMode ?? baseOptions?.rangeMode ?? 'strict',
            casing: options.casing ?? baseOptions?.casing,
            hyphenate: options.hyphenate ?? baseOptions?.hyphenate,
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

    return this.finishOutput(words, mergedOptions, localeOverride.config);
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

    this.assertWithinRange(parsed.integerPart, 'ordinal', options.rangeMode ?? 'strict', locale);

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

    // wordJoining.compoundOrdinals: an ordinal is one word even past a million, and a scale's
    // spoken "one" is dropped (de 2 000 000. → Zweimillionste, 1 000 000. → Millionste; Duden D 65).
    if (localeConfig.wordJoining?.compoundOrdinals) {
      const ones = new Set(
        localeConfig.numberWordsMapping.map((entry) => entry.multiplierForms?.[1]).filter((form) => form !== undefined),
      );
      const parts = words.filter((word, index) => word !== GLUE && !(ones.has(word) && index < words.length - 1));
      return this.finishOutput(
        parts.flatMap((word, index) => (index === 0 ? [word] : [GLUE, word])),
        options,
        localeConfig,
      );
    }
    return this.finishOutput(words, options, localeConfig);
  }

  /**
   * Join the words, then apply the output style: `hyphenate` joins compound tens and units with
   * `compoundHyphen` (en Twenty-One), and `casing` re-cases the text (see `LetterCase`).
   */
  private finishOutput(
    words: string[],
    options: OutputStyleOptions & Pick<ConverterOptions, 'currency' | 'currencyOptions'>,
    config: LocaleConfig,
  ): string {
    const hyphen = config.compoundHyphen;
    if (options.hyphenate && hyphen) {
      const tens = new Set<string>();
      const units = new Set<string>();
      for (const entry of [...config.numberWordsMapping, ...(config.ordinalWordsMapping ?? [])]) {
        const value = Number(entry.number);
        if (value >= 20 && value <= 90 && value % 10 === 0) {
          [entry.value].flat().forEach((word) => tens.add(word));
        } else if (value >= 1 && value <= 9) {
          [entry.value].flat().forEach((word) => units.add(word));
        }
      }
      words = words.reduce<string[]>((out, word, index) => {
        if (index > 0 && units.has(word) && tens.has(words[index - 1])) {
          out[out.length - 1] += hyphen + word;
        } else {
          out.push(word);
        }
        return out;
      }, []);
    }
    const text = this.joinWords(words, config);
    const casing = options.casing;
    if (!casing || casing === 'title') {
      return text;
    }
    const tag = this.localeIdentifier ?? this.options.localeCode!;
    if (casing === 'upper') {
      return changeCase(text, tag, true);
    }
    const keep = new Set(casing === 'lower' ? [] : (config.naturalCaseWords ?? []));
    const custom = options.currency ? options.currencyOptions : undefined;
    if (custom && casing !== 'lower') {
      // A caller-supplied currency keeps the spelling it was given.
      const unit = custom.fractionalUnit;
      const names = [custom.name, custom.plural, custom.singular, unit.name, unit.plural, unit.singular];
      names
        .join(' ')
        .split(' ')
        .forEach((part) => keep.add(part));
    }
    let output = keep.size
      ? text
          .split(' ')
          .map((word) => (keep.has(word) ? word : changeCase(word, tag, false)))
          .join(' ')
      : changeCase(text, tag, false);
    // sentence: capitalise the first letter, unless the script writes no capitals (ka ოცდაერთი).
    if (casing === 'sentence' && /\p{Lu}/u.test(text)) {
      const first = output.search(/\p{L}/u);
      output = output.slice(0, first) + changeCase(output[first], tag, true) + output.slice(first + 1);
    }
    return output;
  }

  /**
   * ligature: link a number to the scale word or unit it counts (fil Dalawang Libo, Isang Daang
   * Libo, Apat Na Libo). Without the setting the words are returned unchanged.
   */
  private link(words: string[], config: LocaleConfig): string[] {
    const ligature = config.ligature;
    if (!ligature || words.length === 0) {
      return words;
    }
    const last = words[words.length - 1];
    if (/[aeiou]$/iu.test(last)) {
      return [...words.slice(0, -1), last + ligature.vowel];
    }
    if (/n$/iu.test(last)) {
      return [...words.slice(0, -1), last + ligature.n];
    }
    return [...words, ligature.word];
  }

  /**
   * splitWordAfterVowel: write the contracted splitWord onto the last word when it ends in a
   * vowel (fil Dalawampu't). Returns whether it did, so the caller skips the separate connector.
   */
  private contractSplitWord(words: string[], connector: string, config: LocaleConfig): boolean {
    const form = config.splitWordAfterVowel;
    const last = words[words.length - 1];
    if (form === undefined || connector !== config.splitWord || last === undefined || !/[aeiou]$/iu.test(last)) {
      return false;
    }
    words[words.length - 1] = last + form;
    return true;
  }

  /**
   * Join a word list into the output string. Without `wordJoining` this is exactly the
   * historical behaviour (space, or nothing when `trim` is set). With it, empty words are
   * dropped and GLUE markers join their neighbours into one compound word.
   */
  private joinWords(words: string[], config: LocaleConfig): string {
    // connectorPrefix: the connector is written onto the next word (he ו: עשרים ואחת).
    if (config.connectorPrefix) {
      const prefix = config.connectorPrefix;
      words = words.reduce<string[]>((out, word, index) => {
        if (index > 0 && words[index - 1] === prefix) {
          out[out.length - 1] = prefix + word;
        } else {
          out.push(word);
        }
        return out;
      }, []);
    }
    const joining = config.wordJoining;
    if (!joining) {
      return words.join(config.trim ? '' : ' ');
    }
    const separator = joining.separator ?? (config.trim ? '' : ' ');
    const lowercaseParts = joining.lowercaseCompoundParts !== false;
    let output = '';
    let started = false;
    let glued = false;
    for (const word of words) {
      if (word === GLUE) {
        glued = true;
        continue;
      }
      if (!started) {
        output = word;
        started = true;
      } else if (glued) {
        let part = lowercaseParts ? lowerFirst(word) : word;
        // reduceTripleConsonants: three equal consonants at a compound seam become two (sv ett + tusen → ettusen).
        if (
          joining.reduceTripleConsonants &&
          part.length > 0 &&
          output.endsWith(part[0].repeat(2)) &&
          !/[aeiouyåäö]/iu.test(part[0])
        ) {
          part = part.slice(1);
        }
        output += part;
      } else {
        output += separator + word;
      }
      glued = false;
    }
    return output;
  }

  private assertWithinRange(
    integerPart: bigint,
    form: 'cardinal' | 'ordinal' | 'currency',
    rangeMode: RangeMode | undefined,
    locale: InstanceType<ConstructorOf<LocaleInterface>>,
  ): void {
    if (rangeMode === 'compose') {
      return;
    }
    const maximum = this.getLocaleCache(locale).maximumSupported[form];
    if (integerPart > maximum) {
      throw new NumberOutOfRangeError(
        this.localeIdentifier ?? this.options.localeCode!,
        form,
        integerPart.toString(),
        maximum.toString(),
      );
    }
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
    options: OrdinalOptions,
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const localeConfig = localeInstance.config;
    const cache = this.getLocaleCache(localeInstance);

    // Check exact ordinal mapping first (for special cases like 100 that need special wording)
    const exactMatch = cache.ordinalExactWordsMap.get(number);
    if (exactMatch) {
      return [this.resolveOrdinalValue(exactMatch, options.gender, localeConfig)];
    }

    // For simple numbers (0-20), use direct ordinal mapping
    if (number <= 20n) {
      const ordinalMatch = cache.ordinalWordsMap.get(number);
      if (ordinalMatch) {
        return [this.resolveOrdinalValue(ordinalMatch, options.gender, localeConfig)];
      }
    }

    // For composite numbers (like 21, 1000, 1234), convert to cardinal then modify last component
    // Strategy: Convert the number to cardinal, then find the last component and replace it with ordinal
    if (localeConfig.ordinalComposition === 'every-component') {
      const composed = this.composeEveryComponentOrdinal(number, options.gender, localeInstance);
      if (composed) {
        return composed;
      }
    }

    if (localeConfig.ordinalComposition === 'remainder-first' && number >= BIGINT_100) {
      return this.composeRemainderFirstOrdinal(number, options.gender, localeInstance);
    }

    if (localeConfig.ordinalScaleStems) {
      const fused = this.composeScaleStemOrdinal(
        number,
        localeConfig.ordinalScaleStems,
        options.gender,
        localeInstance,
      );
      if (fused) {
        return fused;
      }
    }

    const cardinalWords = this.convertInternal(number, true, undefined, localeInstance, options.gender);

    // cardinal: past the ordinal words the ordinal is the masculine cardinal (he 21st → עשרים ואחד),
    // with `ordinalPrefix` written onto its first word when set (he definite ה: העשרים ואחד).
    if (localeConfig.ordinalComposition === 'cardinal') {
      const [first, ...rest] = this.convertInternal(
        number,
        true,
        undefined,
        localeInstance,
        options.gender ?? 'masculine',
      );
      return [(localeConfig.ordinalPrefix ?? '') + first, ...rest];
    }

    // fused-prefix: the prefix joins the whole cardinal (id 21 → Kedua Puluh Satu, 100 → Keseratus).
    if (localeConfig.ordinalComposition === 'fused-prefix' && localeConfig.ordinalPrefix) {
      const [first, ...rest] = cardinalWords;
      // A prefix ending in a space is its own word (sw «wa ishirini na moja»).
      const prefix = localeConfig.ordinalPrefix;
      return [prefix.endsWith(' ') ? prefix + first : prefix + lowerFirst(first), ...rest];
    }

    if (localeConfig.ordinalComposition === 'last-token') {
      const composed = this.ordinalizeLastToken(number, cardinalWords, options.gender, localeInstance);
      if (composed) {
        return composed;
      }
    }

    // Convert the last word to its ordinal form.
    // For composite numbers like 21 (Twenty One), only "One" should become "First".
    // For 1000 (One Thousand), "Thousand" becomes "Thousandth".
    const lastWordIndex = cardinalWords.length - 1;
    const lastWord = cardinalWords[lastWordIndex];

    // Find what number the last word represents
    const lastNumberComponent = this.getLastNumberComponentBigInt(number, localeConfig, localeInstance);

    // Try to find ordinal mapping for the last component
    let transformed = false;
    // A last word written from exactWordsMapping (en 100 → One Hundred) takes the matching exact
    // ordinal (One Hundredth), so 1100 → One Thousand One Hundredth, not One Thousand Hundredth.
    const exactOrdinal =
      lastWord === cache.exactWordsMap.get(lastNumberComponent)?.resolvedValue
        ? cache.ordinalExactWordsMap.get(lastNumberComponent)
        : undefined;
    const ordinalMatch = exactOrdinal ?? cache.ordinalWordsMap.get(lastNumberComponent);
    if (ordinalMatch) {
      cardinalWords[lastWordIndex] = this.resolveOrdinalValue(ordinalMatch, options.gender, localeConfig);
      transformed = true;
    }

    // ordinalTensAndUnits: the tens word before an ordinal unit is ordinal too
    // (pl 21 → Dwudziesty Pierwszy). Larger components stay cardinal.
    if (transformed && localeConfig.ordinalTensAndUnits) {
      const lastTwo = number % BIGINT_100;
      const tens = lastTwo - (lastTwo % BIGINT_10);
      const tensOrdinal = cache.ordinalWordsMap.get(tens);
      // Step over a compound GLUE marker between the tens and the unit.
      const tensIndex = cardinalWords[lastWordIndex - 1] === GLUE ? lastWordIndex - 2 : lastWordIndex - 1;
      if (
        tens >= 20n &&
        tens !== lastTwo &&
        tensOrdinal &&
        cardinalWords[tensIndex] === cache.smallNumbersMap.get(tens)?.resolvedValue
      ) {
        cardinalWords[tensIndex] = this.resolveOrdinalValue(tensOrdinal, options.gender, localeConfig);
        // wordJoining.separateOrdinalUnit: the unit after the ordinal tens is its own word
        // (sk 124. → Stodvadsiaty Štvrtý, PSP).
        if (tensIndex === lastWordIndex - 2 && localeConfig.wordJoining?.separateOrdinalUnit) {
          cardinalWords.splice(lastWordIndex - 1, 1);
        }
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

  /**
   * `ordinalScaleStems`: an ordinal ending in a round scale group fuses that group's multiplier,
   * in its combining stem, with the scale's ordinal word (ru 25 000 → Двадцатипятитысячный,
   * 2 100 000 → Два Миллиона Стотысячный). Higher groups stay cardinal. Returns undefined when the
   * number does not end in a scale group or a stem is missing, so the caller falls back.
   */
  private composeScaleStemOrdinal(
    number: bigint,
    stems: Record<number, string>,
    gender: OrdinalOptions['gender'],
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] | undefined {
    const localeConfig = localeInstance.config;
    const cache = this.getLocaleCache(localeInstance);
    // numberWordsMappingBigInt is sorted descending, so the first dividing scale is the largest.
    const scales = cache.numberWordsMappingBigInt
      .map((entry) => entry.numberBigInt)
      .filter((value) => value >= BIGINT_1000);
    const index = scales.findIndex((scale) => number % scale === BIGINT_0);
    const scale = scales[index];
    const ordinalScale = scale === undefined ? undefined : cache.ordinalWordsMap.get(scale);
    if (!ordinalScale) {
      return undefined;
    }
    const group = index > 0 ? (number % scales[index - 1]) / scale : number / scale;
    // A multiplier of 1000+ only occurs past the largest scale (compose mode); stems cannot express
    // it, so the caller's last-word path handles it (ru 6·10²⁴ → Шесть Тысяч Секстиллионный).
    if (group >= BIGINT_1000) {
      return undefined;
    }
    let stem = '';
    if (group > BIGINT_1) {
      let rest = group;
      const keys = Object.keys(stems)
        .map(BigInt)
        .sort((left, right) => Number(right - left));
      for (const key of keys) {
        if (key <= rest) {
          // A hundreds component followed by more of the group may take its own stem
          // (uk 530 000 → П'ятсоттридцятитисячний, Український правопис 2019 §38); a component
          // after more of the group may too (sk 2000. → Dvojtisíci, but 22 000. → Dvadsaťdvatisíci).
          const beforeMore = rest > key ? localeConfig.ordinalScaleStemsBeforeMore?.[Number(key)] : undefined;
          const afterMore = rest < group ? localeConfig.ordinalScaleStemsAfterMore?.[Number(key)] : undefined;
          stem += beforeMore ?? afterMore ?? stems[Number(key)];
          rest -= key;
        }
      }
      if (rest !== BIGINT_0) {
        return undefined;
      }
    }
    const scaleWord = this.resolveOrdinalValue(ordinalScale, gender, localeConfig);
    const fused = stem
      ? stem.charAt(0).toUpperCase() + stem.slice(1) + scaleWord.charAt(0).toLowerCase() + scaleWord.slice(1)
      : scaleWord;
    const higher = number - group * scale;
    const prefix = higher > BIGINT_0 ? this.convertInternal(higher, false, undefined, localeInstance) : [];
    // andBeforeLastComponent: bg 1 100 000 → Милион И Стохиляден.
    if (prefix.length > 0 && localeConfig.andBeforeLastComponent && isSingleComponent(group * scale)) {
      prefix.push(localeConfig.texts.and);
    }
    return [...prefix, fused];
  }
  /**
   * `ordinalComposition: 'remainder-first'` (numbers from 100 up): the ordinal of the last two
   * digits, then each larger group from the hundreds up as a definite cardinal after the joiner
   * (ar 1234th الرابع والثلاثون بعد المائتين بعد الألف). Without a remainder the smallest group
   * is the ordinal itself (ar 2000th الألفان, 1100th المائة بعد الألف).
   */
  private composeRemainderFirstOrdinal(
    number: bigint,
    gender: OrdinalOptions['gender'],
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const localeConfig = localeInstance.config;
    const joiner = localeConfig.ordinalGroupJoiner as NonNullable<LocaleConfig['ordinalGroupJoiner']>;
    const prefix = joiner.definitePrefix ?? '';
    const remainder = number % BIGINT_100;
    const groups = [(number % BIGINT_1000) - remainder];
    for (let scale = BIGINT_1000; scale <= number; scale *= BIGINT_1000) {
      groups.push(((number / scale) % BIGINT_1000) * scale);
    }
    const words: string[] = [];
    if (remainder > BIGINT_0) {
      const ordinal = this.getLocaleCache(localeInstance).ordinalWordsMap.get(remainder);
      words.push(
        ordinal
          ? this.resolveOrdinalValue(ordinal, gender, localeConfig)
          : this.joinWords(this.convertInternal(remainder, false, undefined, localeInstance, gender), localeConfig),
      );
    }
    for (const group of groups) {
      if (group === BIGINT_0) {
        continue;
      }
      const [first, ...rest] = this.convertInternal(group, true, undefined, localeInstance);
      if (words.length) {
        words.push(joiner.word, prefix + (joiner.afterForms?.[first] ?? first), ...rest);
      } else {
        words.push(prefix + first, ...rest);
      }
    }
    return words;
  }

  /**
   * `ordinalComposition: 'every-component'`: every additive component takes its ordinal word
   * (es 121 → Centésimo Vigésimo Primero). Below 1000 each component must have its own ordinal
   * word; a multiplier above one in front of a larger scale stays cardinal (es 2000 → Dos Milésimo).
   * Returns undefined when the table cannot express the number, so the caller falls back.
   */
  private composeEveryComponentOrdinal(
    number: bigint,
    gender: OrdinalOptions['gender'],
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] | undefined {
    const localeConfig = localeInstance.config;
    const cache = this.getLocaleCache(localeInstance);
    const words: string[] = [];
    let rest = number;
    while (rest > BIGINT_0) {
      const direct = cache.ordinalExactWordsMap.get(rest) ?? cache.ordinalWordsMap.get(rest);
      if (direct) {
        words.push(this.resolveOrdinalValue(direct, gender, localeConfig));
        return words;
      }
      const unit = cache.ordinalUnitsDescending.find((candidate) => candidate > BIGINT_0 && candidate <= rest);
      if (unit === undefined) {
        return undefined;
      }
      const quotient = rest / unit;
      const ordinalMultiplier = localeConfig.ordinalMultipliers === true;
      if (unit < BIGINT_1000 && quotient !== BIGINT_1 && !ordinalMultiplier) {
        return undefined;
      }
      const unitWord = this.resolveOrdinalValue(cache.ordinalWordsMap.get(unit)!, gender, localeConfig);
      // A multiplier with its own entry in `ordinalScaleStems` fuses with the scale word
      // (cs 2000 → Dvoutisící, 100 000 → Stotisící); any other multiplier stays cardinal.
      const stemAllowed =
        localeConfig.ordinalScaleStemsMaxScale === undefined || unit <= BigInt(localeConfig.ordinalScaleStemsMaxScale);
      const stem = quotient > BIGINT_1 && stemAllowed ? localeConfig.ordinalScaleStems?.[Number(quotient)] : undefined;
      if (stem) {
        words.push(stem.charAt(0).toUpperCase() + stem.slice(1) + unitWord.charAt(0).toLowerCase() + unitWord.slice(1));
      } else {
        if (quotient > BIGINT_1 && ordinalMultiplier) {
          // ordinalMultipliers: the multiplier is ordinal too (fi 2000 → Kahdes Tuhannes).
          // A lone multiplier takes its compound form when it has one (fi 2 → Kahdes, not Toinen).
          const compound = cache.ordinalWordsMap.get(quotient)?.compoundValue;
          const multiplier = compound
            ? [compound]
            : this.composeEveryComponentOrdinal(quotient, gender, localeInstance);
          if (!multiplier) {
            return undefined;
          }
          words.push(...multiplier);
        } else if (quotient > BIGINT_1) {
          const multiplierGender = localeConfig.multiplierFollowsGender?.includes(Number(unit)) ? gender : undefined;
          words.push(...this.convertInternal(quotient, false, undefined, localeInstance, multiplierGender));
        }
        words.push(unitWord);
      }
      rest %= unit;
    }
    return words;
  }

  /**
   * `ordinalComposition: 'last-token'`: ordinalize the last token of the final cardinal word,
   * using the ordinal entry's `compoundValue` when the number is longer than that token
   * (fr 21 Vingt Et Un → Vingt Et Unième, 22 Vingt-Deux → Vingt-Deuxième).
   */
  private ordinalizeLastToken(
    number: bigint,
    cardinalWords: string[],
    gender: OrdinalOptions['gender'],
    localeInstance: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] | undefined {
    const cache = this.getLocaleCache(localeInstance);
    // Always matches: an optional head ending in a space or hyphen, then the last token.
    const [, head = '', token] = /^(.*[\s-])?([^\s-]*)$/su.exec(cardinalWords[cardinalWords.length - 1])!;
    // ordinalLastTokenForms: the ordinal form of the last word itself (ro Sute → Sutelea, Unu → Unulea).
    const tokenForm = localeInstance.config.ordinalLastTokenForms?.[token];
    if (tokenForm !== undefined) {
      const prefix = localeInstance.config.ordinalCompoundPrefix;
      const formed = [...cardinalWords.slice(0, -1), head + tokenForm];
      return prefix ? [prefix, ...formed] : formed;
    }
    const tokenNumber = cache.cardinalWordNumbers.get(token);
    // Map.get(undefined) is simply undefined, so an unknown token needs no separate check.
    const entry = cache.ordinalWordsMap.get(tokenNumber as bigint);
    if (!entry) {
      return undefined;
    }
    const ordinal =
      tokenNumber !== number && entry.compoundValue
        ? entry.compoundValue
        : this.resolveOrdinalValue(entry, gender, localeInstance.config);
    return [...cardinalWords.slice(0, -1), head + ordinal];
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

    // A round number ends in a unit word. Walk the same greedy decomposition the cardinal uses,
    // so atomic hundreds are not mistaken for the last word (ru 2100 = Две Тысячи Сто, whose
    // last word is 100 even though 2100 is also a multiple of 700).
    if (unitMappings.some((mapping) => number % mapping.numberBigInt === BIGINT_0)) {
      let rest = number;
      for (let match = unitMappings.find((m) => m.numberBigInt <= rest); match;) {
        const remainder = rest % match.numberBigInt;
        if (remainder === BIGINT_0) {
          return match.numberBigInt;
        }
        rest = remainder;
        match = unitMappings.find((m) => m.numberBigInt <= rest);
      }
    }

    // Get the last two digits
    const lastTwoDigits = number % BIGINT_100;

    // Check if locale has atomic word for the last two digits (1-99)
    // This is true for Hindi, Bengali, Gujarati, Marathi, etc.
    // For numbers like 111 (last two digits = 11), check if locale has word for 11
    // Note: lastTwoDigits === 0 is impossible here — multiples of 100 are caught above by the
    // unit-mapping loop (e.g. 200 % 100 === 0 returns 100 early), so lastTwoDigits is always 1-99.
    const hasAtomicWord = localeInstance
      ? this.getLocaleCache(localeInstance).smallNumbersMap.has(lastTwoDigits)
      : localeConfig.numberWordsMapping.some((m) => BigInt(m.number) === lastTwoDigits);
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
    const useAnd = options.useAnd ?? localeConfig.useAndByDefault;

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

    this.assertWithinRange(integerPart, 'cardinal', options.rangeMode ?? 'strict', locale);

    const ignoreZero = integerPart === BIGINT_0 && localeConfig.ignoreZeroInDecimals;
    let words = this.convertInternal(integerPart, true, undefined, locale, gender, useAnd);
    if (isFloat && ignoreZero) {
      words = [];
    }

    const wordsWithDecimal: string[] = [];
    if (isFloat) {
      const reading = localeConfig.fractionReading;
      // fractionReading.isDefault: the digit reading is ungrammatical in this locale, so the
      // fraction reading applies unless the caller asks for `decimalStyle: 'digit'`.
      const decimalStyle = options.decimalStyle ?? (reading?.isDefault ? 'fraction' : 'digit');
      const denominator = localeConfig.fractionDenominatorMapping?.[fractionalPart.length];
      if (decimalStyle === 'fraction' && denominator && reading && localeConfig.pluralRule) {
        // fractionReading: the whole part agrees with a whole-unit noun and both numbers take the
        // fraction's gender (ru 1.5 → Одна Целая Пять Десятых, 2.001 → Две Целых Одна Тысячная).
        const rule = localeConfig.pluralRule;
        const fractionGender = gender ?? reading.gender;
        if (!ignoreZero) {
          if (reading.wholeForms) {
            // wholeUsesDefaultGender: the whole part keeps the locale's default form (bg Едно Цяло).
            const wholeGender = reading.wholeUsesDefaultGender ? gender : fractionGender;
            words = this.convertInternal(integerPart, true, undefined, locale, wholeGender, useAnd);
          }
          wordsWithDecimal.push(
            reading.wholeForms
              ? this.selectUnitForm({ plural: localeConfig.texts.and }, reading.wholeForms, integerPart, rule)
              : localeConfig.texts.and,
          );
        }
        const numerator = BigInt(fractionalPart);
        // The numerator is followed by its noun, so it takes the non-final form (de ein Hundertstel).
        wordsWithDecimal.push(...this.convertInternal(numerator, false, undefined, locale, fractionGender));
        const denominatorForms = reading.denominatorForms?.[fractionalPart.length] ?? {
          one: denominator.singular,
          other: denominator.plural,
        };
        wordsWithDecimal.push(this.selectUnitForm(denominator, denominatorForms, numerator, rule));
      } else if (decimalStyle === 'fraction' && denominator) {
        // Fractional style: "One Hundred Twenty Three and Forty-Five Hundredths"
        const fracValue = Number.parseInt(fractionalPart, 10);
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
        if (
          decimalStyle === 'digit-by-digit' ||
          (fractionalPart.startsWith('0') && !localeConfig?.decimalLengthWordMapping)
        ) {
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
    if (isNegativeNumber) {
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
    const useAnd = options.useAnd ?? localeConfig.useAndByDefault;

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

    this.assertWithinRange(mainAmount, 'currency', options.rangeMode ?? 'strict', locale);

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
      // A unit's declared gender is grammar and wins over the gender option (ru Один Рубль).
      words = [
        ...this.convertInternal(mainAmount, trailing, undefined, locale, currencyOptions.gender ?? gender, useAnd),
      ];
      const connector = localeConfig.currencyScaleConnector;
      const unitName =
        localeConfig.pluralRule && currencyOptions.pluralForms
          ? this.selectUnitForm(currencyOptions, currencyOptions.pluralForms, mainAmount, localeConfig.pluralRule)
          : mainAmount === 1n && currencyOptions.singular
            ? currencyOptions.singular
            : currencyOptions.plural;
      const connect =
        connector !== undefined && mainAmount > BIGINT_0 && mainAmount % BigInt(connector.minScale) === BIGINT_0;
      if (connect && unitName && connector.elidedWord && VOWEL_INITIAL.test(unitName)) {
        words.push(connector.elidedWord + lowerFirst(unitName));
      } else {
        if (connect) {
          words.push(connector.word);
        } else if (localeConfig.nounConnector && unitName && takesNounConnector(mainAmount)) {
          words.push(localeConfig.nounConnector);
        }
        if (unitName && localeConfig.currencyUnitFirst) {
          // currencyUnitFirst: sw shilingi ishirini na moja.
          words.unshift(unitName);
        } else if (unitName) {
          // ligature: fil Dalawampu't Isang Piso.
          words = [...this.link(words, localeConfig), unitName];
        }
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
      // An empty «and» joins the units with nothing (tr bir lira elli kuruş).
      if (!ignoreZero && localeConfig.texts.and) {
        wordsWithDecimal.push(localeConfig.texts.and);
      }
      const decimalBase =
        !localeConfig.decimalLengthWordMapping && fractionalPart.length
          ? BIGINT_10 ** BigInt(Math.max(0, precision - fractionalPart.length))
          : BIGINT_1;
      const decimalPart = BigInt(fractionalPart) * decimalBase;
      const decimalPartNumber = decimalPart <= BIGINT_MAX_SAFE ? Number(decimalPart) : -1;

      const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];

      const fractionalUnit = currencyOptions.fractionalUnit;
      const fractionalGender = fractionalUnit.gender ?? gender;
      const largerUnit = localeConfig.decimalLengthWordMapping ? undefined : fractionalUnit.largerUnit;
      if (decimalPartNumber !== -1 && fractionalUnit.numberSpecificForms?.[decimalPartNumber]) {
        wordsWithDecimal.push(fractionalUnit.numberSpecificForms[decimalPartNumber]);
      } else if (largerUnit) {
        const factor = BigInt(largerUnit.factor);
        const larger = decimalPart / factor;
        const smaller = decimalPart % factor;
        if (larger > BIGINT_0) {
          wordsWithDecimal.push(...this.convertInternal(larger, false, undefined, locale, fractionalGender));
          wordsWithDecimal.push(largerUnit.name);
        } else if (largerUnit.zeroWord && mainAmount > BIGINT_0) {
          // zh 一百元零五分: a skipped 角 between the yuan and the fen reads 零.
          wordsWithDecimal.push(largerUnit.zeroWord);
        }
        if (smaller > BIGINT_0) {
          wordsWithDecimal.push(...this.convertInternal(smaller, false, undefined, locale, fractionalGender));
          wordsWithDecimal.push(this.selectFractionalUnitName(fractionalUnit, smaller, localeConfig));
        }
      } else {
        const unitFirst = localeConfig.currencyUnitFirst === true && !decimalLengthWord?.length;
        if (unitFirst) {
          wordsWithDecimal.push(this.selectFractionalUnitName(fractionalUnit, decimalPart, localeConfig));
        }
        const amountWords = this.convertInternal(decimalPart, false, undefined, locale, fractionalGender);
        wordsWithDecimal.push(
          ...(unitFirst || decimalLengthWord?.length ? amountWords : this.link(amountWords, localeConfig)),
        );

        if (decimalLengthWord?.length) {
          wordsWithDecimal.push(decimalLengthWord);
        } else if (localeConfig.nounConnector && takesNounConnector(decimalPart)) {
          wordsWithDecimal.push(localeConfig.nounConnector);
        }

        if (!unitFirst) {
          wordsWithDecimal.push(this.selectFractionalUnitName(fractionalUnit, decimalPart, localeConfig));
        }
      }
    } else if (
      forceZeroFractional &&
      !ignoreZero &&
      !localeConfig.decimalLengthWordMapping &&
      !!currencyOptions.fractionalUnit.plural
    ) {
      if (localeConfig.texts.and) {
        wordsWithDecimal.push(localeConfig.texts.and);
      }
      if (currencyOptions.fractionalUnit.numberSpecificForms?.[0]) {
        wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[0]);
      } else {
        const zeroWords = this.convertInternal(0n, false, undefined, locale, gender);
        const unit = currencyOptions.fractionalUnit.plural;
        wordsWithDecimal.push(
          ...(localeConfig.currencyUnitFirst ? [unit, ...zeroWords] : [...this.link(zeroWords, localeConfig), unit]),
        );
      }
    } else if (localeConfig.decimalLengthWordMapping && words.length) {
      wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
    }
    const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(localeConfig.texts.minus);
    }
    const addOnly = !isEmpty && !options.doNotAddOnly && !(localeConfig.onlyWhenWhole && isFloat);
    if (addOnly && localeConfig.texts.only && !localeConfig.onlyInFront) {
      wordsWithDecimal.push(localeConfig.texts.only);
    }
    if (wordsWithDecimal.length) {
      words.push(...wordsWithDecimal);
    }

    if (addOnly && localeConfig.onlyInFront) {
      words.splice(0, 0, localeConfig.texts.only);
    }
    if (addOnly && localeConfig.texts.onlyBefore) {
      words.unshift(localeConfig.texts.onlyBefore);
    }

    return words;
  }

  /**
   * Unit name for an amount under a plural rule, falling back to `singular` (one) or `plural`.
   * An explicit `zero` form applies to the amount 0 whatever the rule (cs 0,5 → Nula Celá Pět Desetin).
   */
  private selectUnitForm(
    unit: { singular?: string; plural: string },
    forms: Partial<Record<PluralCategory, string>>,
    amount: bigint,
    rule: NonNullable<LocaleConfig['pluralRule']>,
  ): string {
    const category = amount === BIGINT_0 && forms.zero ? 'zero' : selectPluralCategory(rule, amount);
    return pickPluralForm(forms, category) ?? (category === 'one' ? (unit.singular ?? unit.plural) : unit.plural);
  }

  private selectFractionalUnitName(
    unit: LocaleConfig['currency']['fractionalUnit'],
    amount: bigint,
    localeConfig: LocaleConfig,
  ): string {
    if (localeConfig.pluralRule && unit.pluralForms) {
      return this.selectUnitForm(unit, unit.pluralForms, amount, localeConfig.pluralRule);
    }
    return amount === BIGINT_1 && unit.singular ? unit.singular : unit.plural;
  }

  protected convertInternal(
    number: bigint,
    trailing: boolean = false,
    overrides?: Record<number, string>,
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
    gender?: 'masculine' | 'feminine',
    useAnd?: boolean,
    leading: boolean = true,
  ): string[] {
    const locale = localeInstance ?? this.getLocale();
    const localeConfig = locale.config;
    const cache = this.getLocaleCache(locale);

    // invariableOneInCompounds: a 1 inside a larger number keeps its base form whatever the
    // gender (pl dwadzieścia jeden kobiet, tysiąc jeden); only a lone 1 inflects (jedna).
    // invariableTwoInCompounds does the same for 2 (sk dvadsaťdva kníh; only a lone 2 is dve).
    if (
      !leading &&
      ((number === BIGINT_1 && localeConfig.invariableOneInCompounds) ||
        (number === BIGINT_2 && localeConfig.invariableTwoInCompounds))
    ) {
      gender = undefined;
    }
    if (overrides) {
      const numberAsNum = number <= BIGINT_MAX_SAFE ? Number(number) : -1;
      if (numberAsNum !== -1 && overrides[numberAsNum]) {
        return [overrides[numberAsNum]];
      }
    }

    // Check exactWordsMapping using O(1) Map lookup
    const exactMatch = cache.exactWordsMap.get(number);
    if (exactMatch) {
      return [this.resolveGenderedValue(exactMatch, gender, trailing, leading)];
    }

    // Fast path: Use O(1) Map lookup for small numbers (0-100)
    let match: CachedNumberWordMap;
    if (number <= BIGINT_100) {
      const directMatch = cache.smallNumbersMap.get(number);
      if (directMatch) {
        return [this.resolveGenderedValue(directMatch, gender, trailing, leading)];
      }
      // Number not directly in map, use binary search (e.g., 21 = 20 + 1)
      match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
    } else {
      // Use binary search on pre-computed BigInt values (array is sorted descending)
      match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
    }

    const matchNumber = match.numberBigInt;
    const words: string[] = [];
    // Compounding (wordJoining.compoundBelow): every part of this number joins into one word.
    const glue = cache.compoundBelow !== undefined && number < cache.compoundBelow;

    if (number <= BIGINT_100 || (number < BIGINT_1000 && localeConfig.namedLessThan1000)) {
      const remainder = number - matchNumber;
      // beforeRemainderValue: the form used when more of the number follows (ar مائتا ريال but
      // مائتان وخمسون ريالًا: the construct form only touches the noun directly).
      words.push(
        remainder > BIGINT_0 && match.beforeRemainderValue
          ? match.beforeRemainderValue
          : this.resolveGenderedValue(match, gender, trailing, leading),
      );
      if (remainder > BIGINT_0) {
        const remainderWords = this.convertInternal(remainder, trailing, overrides, locale, gender, useAnd, false);
        // splitWord (pt Vinte E Um) or andBeforeLastComponent (bg Двадесет И Едно) joins tens and units.
        const connector =
          localeConfig.splitWord ?? (localeConfig.andBeforeLastComponent ? localeConfig.texts.and : undefined);
        // splitWordAfterVowel: fil Dalawampu't Isa.
        if (connector !== undefined && this.contractSplitWord(words, connector, localeConfig)) {
          words.push(...remainderWords);
          return words;
        }
        const tail = connector ? [connector, ...remainderWords] : remainderWords;
        const glued = connector ? 2 : 1;
        for (let index = 0; index < tail.length; index++) {
          if (glue && index < glued) {
            words.push(GLUE);
          }
          words.push(tail[index]);
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
    // keepOneBeforeInnerScales: only the leading scale word drops its "one" (ru 1 001 000 →
    // Миллион Одна Тысяча); hundreds and smaller words follow ignoreOneForWords everywhere.
    const usesIgnoreOne =
      cache.ignoreOneForWordsSet.has(originalMatchValue) &&
      !(localeConfig.keepOneBeforeInnerScales && !leading && matchNumber >= BIGINT_1000);
    const usesPluralRule = Boolean(pluralForms && localeConfig.pluralRule);

    if (pluralForms && localeConfig.pluralRule) {
      // CLDR-style categories; legacy keys stand in for the matching categories.
      const category = selectPluralCategory(localeConfig.pluralRule, quotient);
      matchValue =
        category === 'one'
          ? (pluralForms.one ?? match.singularValue ?? match.resolvedValue)
          : (pickPluralForm(
              {
                zero: pluralForms.zero ?? pluralForms.plural,
                two: pluralForms.two ?? pluralForms.dual,
                few: pluralForms.few ?? pluralForms.paucal,
                many: pluralForms.many ?? pluralForms.plural,
                other: pluralForms.other ?? pluralForms.plural,
              },
              category,
            ) ?? match.resolvedValue);
      // pluralFormsBeforeNoun: the form a scale word ending the number takes before a counted noun
      // (ar أحد عشر ألفًا, but أحد عشر ألف ريال).
      const nounForms =
        !trailing && remainder === BIGINT_0 ? localeConfig.pluralFormsBeforeNoun?.[matchNumberNum] : undefined;
      matchValue = (nounForms && pickPluralForm(nounForms, category)) ?? matchValue;
    } else if (pluralForms) {
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
        (isInPluralWords || (isInTrailingOnlyPluralWords && remainder === BIGINT_0 && trailing))
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
      if (usedPluralForm || usesPluralRule) {
        // withoutOneValue: the form used when the "one" is not spoken (hr 1000 → Tisuću).
        valueToUse = quotient === BIGINT_1 && usesIgnoreOne ? (match.withoutOneValue ?? matchValue) : matchValue;
      } else if (match.singularValue) {
        valueToUse = match.singularValue;
      } else {
        // Gender-resolve the value (e.g. Spanish "Doscientos" → "Doscientas")
        valueToUse = this.resolveGenderedValue(match, gender, trailing, leading);
      }
      // beforeRemainderValue: the short form when more of the number follows (ka ასი → ას ერთი).
      words.push(remainder > BIGINT_0 && match.beforeRemainderValue ? match.beforeRemainderValue : valueToUse);
    } else {
      // The multiplier agrees with the scale word's own gender when the locale declares one
      // (ru Тысяча: Две Тысячи), never with the gender of the number being described.
      // multiplierForms: an exact multiplier word for this scale (sk 2000 → Dvetisíc).
      const multiplierForm = match.multiplierForms?.[Number(quotient)];
      // multiplierPhrases: the whole multiplier-and-scale phrase (he 3000 → שלושת אלפים, 2000 → אלפיים);
      // multiplierPhrasesBeforeRemainder when more of the number follows (ml രണ്ടായിരം, രണ്ടായിരത്തി അഞ്ഞൂറ്).
      const phrase =
        (remainder > BIGINT_0 ? match.multiplierPhrasesBeforeRemainder?.[Number(quotient)] : undefined) ??
        match.multiplierPhrases?.[Number(quotient)];
      const quotientWords =
        multiplierForm === undefined
          ? this.convertInternal(
              quotient,
              // trailingBeforeScales: a multiplier before a noun scale ends the numeral adjective
              // (fr deux cents millions, but deux cent mille).
              localeConfig.trailingBeforeScales?.includes(Number(match.numberBigInt)) ?? false,
              match.multiplierOverrides ? { ...overrides, ...match.multiplierOverrides } : overrides,
              locale,
              localeConfig.multiplierFollowsGender?.includes(Number(match.numberBigInt)) ? gender : match.gender,
              useAnd,
              leading,
            )
          : [multiplierForm];
      // Scale-first ordering (e.g. Igbo: "Puku Abụọ" = Thousand Two = 2000)
      // nounConnector: ro douăzeci de mii, o sută de milioane.
      const multiplierWords =
        localeConfig.nounConnector && !localeConfig.scaleFirst && takesNounConnector(quotient)
          ? [...quotientWords, localeConfig.nounConnector]
          : localeConfig.scaleFirst
            ? quotientWords
            : this.link(quotientWords, localeConfig);
      // beforeRemainderPluralValue also stands before a counted noun or a larger scale word
      // (te రెండు వందల రూపాయలు, రెండు వందల లక్షలు).
      const plural = quotient > BIGINT_1 ? match.beforeRemainderPluralValue : undefined;
      const scaleWord =
        plural && (remainder > BIGINT_0 || !trailing)
          ? plural
          : remainder > BIGINT_0 && match.beforeRemainderValue
            ? match.beforeRemainderValue
            : matchValue;
      const [first, second] = localeConfig.scaleFirst ? [[scaleWord], quotientWords] : [multiplierWords, [scaleWord]];
      if (phrase !== undefined) {
        words.push(phrase);
      } else {
        words.push(...first);
        if (glue) {
          words.push(GLUE);
        }
        words.push(...second);
      }
    }

    if (remainder > BIGINT_0) {
      // Connector words between the scale word and the remainder.
      const connectors: string[] = [];
      // useAnd: insert "And" between unit word and remainder when remainder < 100
      // Skip if locale already uses splitWord (e.g. Portuguese "E")
      const andWord = localeConfig.texts.and?.trim();
      // andBeforeLastComponent: the conjunction always precedes the last component instead
      // (bg сто и двадесет, сто двадесет и едно, хиляда и сто, два милиона и петстотин хиляди).
      const andAdded = localeConfig.andBeforeLastComponent
        ? isSingleComponent(remainder)
        : Boolean(useAnd && remainder < BIGINT_100 && !localeConfig.splitWord && andWord);
      if (andAdded) {
        connectors.push(localeConfig.texts.and);
      }
      // Use O(1) Set lookup instead of array.includes()
      // splitWordBeforeSimpleGroup: after a scale word the connector still appears when only one
      // simple group follows (pt mil e um, mil e cem, but mil cento e um).
      if (
        localeConfig.splitWord &&
        (!cache.noSplitWordAfterSet.has(match.resolvedValue) ||
          (localeConfig.splitWordBeforeSimpleGroup && isSimpleLastGroup(remainder)))
      ) {
        connectors.push(localeConfig.splitWord);
      }
      // zeroForSkippedPlaces: the remainder starts below the next lower place (zh 101 → 一百零一).
      if (localeConfig.zeroForSkippedPlaces && remainder * BIGINT_10 < matchNumber) {
        connectors.push(cache.zeroWord);
      }
      // unitsAfterScaleWord: a remainder below ten after a hundred or larger scale (vi một trăm lẻ một).
      if (localeConfig.unitsAfterScaleWord && remainder < BIGINT_10 && matchNumber >= BIGINT_100) {
        connectors.push(localeConfig.unitsAfterScaleWord);
      }
      const remainderWords = this.convertInternal(remainder, trailing, overrides, locale, gender, useAnd, false);
      // splitWordAfterVowel: fil Isang Libo't Isa.
      if (connectors.length === 1 && this.contractSplitWord(words, connectors[0], localeConfig)) {
        connectors.length = 0;
      }
      // In a compound, glue each connector and the first remainder word; the remainder's own
      // words already carry their internal glue.
      const glueRemainder = glue && !cache.separateAfterSet.has(matchNumber);
      // wordJoining.separateAnd: the useAnd word splits the compound (sk Tisíc A Jeden,
      // as in «Tisíc a jedna noc») instead of being glued into it (de Hundertundeins).
      const andSplits = andAdded && localeConfig.wordJoining?.separateAnd === true;
      const tail = [...connectors, ...remainderWords];
      for (let index = 0; index < tail.length; index++) {
        if (glueRemainder && index <= connectors.length && !(andSplits && index <= 1)) {
          words.push(GLUE);
        }
        words.push(tail[index]);
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

  /** Round a number at decimal precision using decimal, rather than binary, arithmetic. */
  public toFixed(number: number, precision = 2): number {
    if (!Number.isFinite(number)) {
      return Number(Number(number).toFixed(precision));
    }
    if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
      throw new RangeError('toFixed() precision must be an integer between 0 and 100');
    }

    const rounded = this.roundNumberParts(this.parseNumberParts(number), precision);
    const sign = rounded.isNegative ? '-' : '';
    const decimal = rounded.fractionalPart ? `.${rounded.fractionalPart}` : '';
    return Number(`${sign}${rounded.integerPart}${decimal}`);
  }

  /** Return whether a valid number input has a non-zero fractional component. */
  public isFloat(number: NumberInput): boolean {
    if (!this.isValidNumber(number)) {
      return false;
    }
    return /[1-9]/.test(this.parseNumberParts(number).fractionalPart);
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

  /** Return whether a numeric value is exactly zero. */
  public isNumberZero(number: number | bigint): boolean {
    return number === BIGINT_0 || number === 0;
  }
}

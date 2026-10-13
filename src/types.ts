import type { PluralCategory, PluralRuleName } from './plural-rules.js';

export type { PluralCategory, PluralRuleName } from './plural-rules.js';

export type GrammaticalGender = 'masculine' | 'feminine';

/** Unit name per plural category. Used only when the locale sets `pluralRule`. */
export type PluralUnitForms = Partial<Record<PluralCategory, string>>;

export interface CurrencyOptions {
  name: string;
  plural: string;
  symbol: string;
  singular?: string;
  precision?: number; // Number of decimal places for the fractional unit. Defaults to 2. Set to 3 for 3-decimal currencies (e.g. OMR, KWD, BHD).
  numberSpecificForms?: Record<number, string>;
  /**
   * Unit name per plural category of the amount (e.g. ru `{ one: 'Рубль', few: 'Рубля', many: 'Рублей' }`).
   * Requires the locale's `pluralRule`; a category without a form falls back along
   * two → few → other, many → other, zero → other, then to `singular` (one) or `plural`.
   */
  pluralForms?: PluralUnitForms;
  /** Grammatical gender of the unit; the amount agrees with it unless the caller passes `gender`. */
  gender?: GrammaticalGender;
  fractionalUnit: {
    name: string;
    plural: string;
    singular?: string;
    numberSpecificForms?: Record<number, string>;
    symbol: string;
    /** See `CurrencyOptions.pluralForms`. */
    pluralForms?: PluralUnitForms;
    /** See `CurrencyOptions.gender`. */
    gender?: GrammaticalGender;
    /**
     * Intermediate unit worth `factor` fractional units (e.g. zh 角 = 10 分). The fractional
     * amount is then read as `<n> <name> <m> <fractional unit>`, omitting a zero part.
     */
    largerUnit?: {
      name: string;
      factor: number;
    };
  };
}

export type RangeMode = 'strict' | 'compose';

export type ConversionForm = 'cardinal' | 'ordinal' | 'currency';

export type ConverterOptions = {
  currency?: boolean;
  ignoreDecimal?: boolean;
  ignoreZeroCurrency?: boolean;
  doNotAddOnly?: boolean; // applicable only when currency = true
  includeZeroFractional?: boolean; // applicable only when currency = true — when input is a string like "123.00", includes "And Zero <unit>" instead of omitting it
  currencyOptions?: CurrencyOptions; // applicable only when currency = true, overwrites options from locales
  gender?: 'masculine' | 'feminine';
  useAnd?: boolean;
  formal?: boolean;
  decimalStyle?: 'digit' | 'fraction'; // 'digit' (default): digit-by-digit after point; 'fraction': positional/fractional style (e.g. "Forty-Five Hundredths")
  rangeMode?: RangeMode; // 'strict' (default): enforce the locale's verified range; 'compose': recursively reuse the largest named scale
};

export type OrdinalOptions = {
  gender?: GrammaticalGender;
  formal?: boolean;
  rangeMode?: RangeMode;
};

export type ToWordsOptions = {
  localeCode?: string;
  converterOptions?: ConverterOptions;
};

export interface ConstructorOf<T> {
  new (...args: unknown[]): T;
}

export type NumberWordMap = {
  number: number | bigint;
  value: string | [string, string];
  singularValue?: string;
  feminineValue?: string;
  masculineValue?: string;
  /**
   * Grammatical gender of a scale word. Its multiplier then agrees with it
   * (ru Тысяча is feminine: 2000 → Две Тысячи, 21000 → Двадцать Одна Тысяча).
   */
  gender?: GrammaticalGender;
  /**
   * Exact multiplier words for this scale word, by multiplier (sk 1000: { 2: 'Dve' } gives
   * Dvetisíc, while 22 000 stays Dvadsaťdvatisíc). Other multipliers are converted normally.
   */
  multiplierForms?: Record<number, string>;
  /**
   * Word overrides applied anywhere inside this scale's multiplier (ro neuter milion takes the
   * feminine forms except 1: { 1: 'Unu' } with gender feminine → douăzeci și unu, două milioane).
   */
  multiplierOverrides?: Record<number, string>;
  /** Short form used when more of the number follows (ka ათასი → ათას ერთი, ორასი → ორას ოცდაერთი). */
  beforeRemainderValue?: string;
  /**
   * Short form after a multiplier above one when more of the number follows; `beforeRemainderValue`
   * then covers only a lone scale word (te 201 → రెండు వందల ఒకటి, 101 → నూట ఒకటి).
   */
  beforeRemainderPluralValue?: string;
  /** Whole multiplier-and-scale phrases by multiplier (he 1000: { 2: 'אלפיים', 3: 'שלושת אלפים' }). */
  multiplierPhrases?: Record<number, string>;
  /** `multiplierPhrases` used when more of the number follows (ml 2000 രണ്ടായിരം, 2500 രണ്ടായിരത്തി അഞ്ഞൂറ്). */
  multiplierPhrasesBeforeRemainder?: Record<number, string>;
  /**
   * Form used when the word's multiplier 1 is not spoken (hr 1000 → Tisuću, Hrvatski pravopis
   * «tisuću jedan»; inside a larger number it stays Jedna Tisuća). Needs `pluralRule`.
   */
  withoutOneValue?: string;
  /**
   * Form used when this word does not start the number (zh 十 at the start of 11, 一十 inside 110).
   */
  nonLeadingValue?: string;
};

export type OrdinalWordMap = {
  number: number | bigint;
  value: string;
  feminineValue?: string;
  masculineValue?: string;
  /**
   * Ordinal form when this number ends a larger compound, for `ordinalComposition: 'last-token'`
   * (fr 1 is Premier alone but Unième in Vingt Et Unième).
   */
  compoundValue?: string;
};

export type NumberInput = number | bigint | string;

/**
 * Scale word forms by multiplier. Without `pluralRule`, `dual` / `paucal` / `plural` follow the
 * built-in Arabic-style thresholds (and `dual` replaces the multiplier). With `pluralRule`, the
 * category keys are used instead, and the legacy keys stand in as two → `dual`, few → `paucal`,
 * many / other / zero → `plural`; `one` falls back to the word's `singularValue` or `value`.
 */
export type PluralFormsMapping = {
  [scaleNumber: number]: {
    dual?: string;
    paucal?: string;
    plural?: string;
  } & PluralUnitForms;
};

export type PaucalConfig = {
  min: number;
  max: number;
};

export type LocaleConfig = {
  currency: CurrencyOptions;
  texts: {
    and: string;
    minus: string;
    only: string;
    /**
     * Word that opens a currency amount when `only` is added, for formats that enclose the amount
     * (ar «فقط ألف ريال لا غير»: onlyBefore «فقط», only «لا غير»). Omitted with `doNotAddOnly`.
     */
    onlyBefore?: string;
    point: string;
  };
  numberWordsMapping: NumberWordMap[];
  exactWordsMapping?: NumberWordMap[];
  ordinalWordsMapping?: OrdinalWordMap[];
  ordinalSuffix?: string;
  ordinalPrefix?: string;
  ordinalExactWordsMapping?: OrdinalWordMap[];
  ordinalGenderSuffixMapping?: {
    masculine: string;
    feminine: string;
  };
  namedLessThan1000?: boolean;
  scaleFirst?: boolean;
  splitWord?: string;
  ignoreZeroInDecimals?: boolean;
  decimalLengthWordMapping?: Record<number, string>;
  fractionDenominatorMapping?: Record<number, { singular: string; plural: string }>; // key = decimal places; used when decimalStyle = 'fraction'
  fractionSingularRule?: 'slavic'; // if 'slavic', use singular when fractionalValue % 10 === 1 && fractionalValue % 100 !== 11
  ignoreOneForWords?: string[];
  pluralMark?: string;
  pluralWords?: string[];
  pluralWordsOnlyWhenTrailing?: string[]; // Words that only get pluralMark when not followed by another number
  pluralForms?: PluralFormsMapping;
  /**
   * With `pluralRule`: forms a scale word takes when it ends the number and a counted noun follows,
   * by scale and category; others fall back to `pluralForms` (ar 11 000 → أحد عشر ألفًا, but
   * أحد عشر ألف ريال).
   */
  pluralFormsBeforeNoun?: Record<number, PluralUnitForms>;
  paucalConfig?: PaucalConfig;
  noSplitWordAfter?: string[];
  onlyInFront?: boolean;
  trim?: boolean;
  useTrailingForCurrency?: boolean; // If true, use trailing=true in currency mode (for French-style plurals)
  formalConfig?: FormalConfig;
  /** Optional verified inclusive ceilings. Missing forms are derived from the locale's scale structure. */
  maximumSupportedValues?: Partial<Record<ConversionForm, NumberInput>>;

  // ---- Opt-in accuracy capabilities. Each defaults to the behaviour of a locale that omits it. ----

  /**
   * Plural rule used to pick scale-word forms (`pluralForms`) and currency unit forms
   * (`currency.pluralForms`). Replaces the built-in dual/paucal thresholds and `paucalConfig`.
   */
  pluralRule?: PluralRuleName;
  /**
   * Restrict `ignoreOneForWords` for scale words of 1000 and above to the leading group: inside a
   * larger number the "one" is kept (ru 1000 → Тысяча, but 1 001 000 → Миллион Одна Тысяча).
   */
  keepOneBeforeInnerScales?: boolean;
  /**
   * Combining stems by number (below 1000) for ordinals that end in a round scale group: the
   * group fuses with the scale's ordinal word (ru { 25 → 'двадцати' + 'пяти' }: 25 000 →
   * Двадцатипятитысячный). Stems are joined greedily from the largest key down.
   * With `ordinalComposition: 'every-component'`, only a multiplier that is itself a key fuses
   * (cs 2000 → Dvoutisící, 100 000 → Stotisící); other multipliers stay cardinal.
   */
  ordinalScaleStems?: Record<number, string>;
  /**
   * Largest scale whose ordinal fuses with `ordinalScaleStems` in every-component ordinals; larger
   * scales keep a cardinal multiplier (el { 2: 'δισ' }, max 1000: 2000 → Δισχιλιοστό, but
   * 2 000 000 → Δύο Εκατομμυριοστό, since δισεκατομμυριοστό means billionth).
   */
  ordinalScaleStemsMaxScale?: number;
  /**
   * Stems that replace `ordinalScaleStems` entries when more of the same group follows
   * (uk { 500: "п'ятсот" }: 530 000 → П'ятсоттридцятитисячний, but 500 000 → П'ятисоттисячний).
   */
  ordinalScaleStemsBeforeMore?: Record<number, string>;
  /**
   * Stems that replace `ordinalScaleStems` entries when more of the same group precedes them
   * (sk { 2: 'dva' }: 22 000 → Dvadsaťdvatisíci, but 2000 → Dvojtisíci).
   */
  ordinalScaleStemsAfterMore?: Record<number, string>;
  /**
   * A 1 inside a larger number keeps its base form whatever the gender; only a lone 1 inflects
   * (pl 1 → Jedna, but 21 → Dwadzieścia Jeden, 1001 → Tysiąc Jeden; pl.wiktionary «jeden»).
   */
  invariableOneInCompounds?: boolean;
  /**
   * A 2 inside a larger number keeps its base form whatever the gender; only a lone 2 inflects
   * (sk 2 → Dve, but 22 → Dvadsaťdva, as the compound takes the genitive plural: dvadsaťdva kníh).
   */
  invariableTwoInCompounds?: boolean;
  /**
   * Scale values whose multiplier agrees with the requested gender (the counted noun) instead of
   * the scale word's own gender (es «mil» is invariable: doscientas mil personas, veintiuna mil;
   * whereas millón is a masculine noun: un millón, doscientos millones).
   */
  multiplierFollowsGender?: number[];
  /**
   * Scale values that are nouns, before which a multiplier counts as the end of the numeral
   * (fr million, milliard: deux cents millions, quatre-vingts millions; mille is an adjective:
   * deux cent mille). Affects words in `pluralWordsOnlyWhenTrailing` and array values.
   */
  trailingBeforeScales?: number[];
  /**
   * After a word in `noSplitWordAfter`, still insert `splitWord` when the rest of the number is one
   * group below 100 or a whole hundred (pt mil e um, mil e cem, um milhão e duzentos mil; but mil
   * cento e um).
   */
  splitWordBeforeSimpleGroup?: boolean;
  /**
   * The tens word before an ordinal unit takes its ordinal form as well
   * (pl 21 → Dwudziesty Pierwszy, 2021 → Dwa Tysiące Dwudziesty Pierwszy).
   */
  ordinalTensAndUnits?: boolean;
  /**
   * Grammar of `decimalStyle: 'fraction'`, for locales with `pluralRule`. The whole part is
   * followed by a whole-unit noun chosen by its plural category instead of `texts.and`, both
   * numbers take `gender`, and the denominator form follows the numerator's category
   * (ru 1.5 → Одна Целая Пять Десятых, 2.25 → Две Целых Двадцать Пять Сотых).
   */
  fractionReading?: {
    /**
     * Use this reading when the caller passes no `decimalStyle`, because the digit reading is
     * ungrammatical in the locale (ru «Один Целых Пять»). `decimalStyle: 'digit'` still opts out.
     */
    isDefault?: boolean;
    wholeForms?: PluralUnitForms;
    gender?: GrammaticalGender;
    /** The whole part keeps the default form instead of `gender` (bg Едно Цяло, but Една Десета). */
    wholeUsesDefaultGender?: boolean;
    /** Denominator forms by number of decimal places; default one = singular, other = plural. */
    denominatorForms?: Record<number, PluralUnitForms>;
  };
  /**
   * Write `texts.and` before the last component of each group and of the whole number, instead of
   * the `useAnd` option's placement (bg 120 → Сто И Двадесет, 121 → Сто Двадесет И Едно,
   * 1100 → Хиляда И Сто). `useAnd` then has no further effect.
   */
  andBeforeLastComponent?: boolean;
  /**
   * Default for the `useAnd` option when the caller passes none, for languages whose written norm
   * includes the connector (da 120 → Hundrede Og Tyve, nb 1005 → Tusen Og Fem). `useAnd: false` opts out.
   */
  useAndByDefault?: boolean;
  /** Word separator and compounding. Its presence also drops empty words (e.g. a blank `texts.and`). */
  wordJoining?: WordJoiningConfig;
  /** Write the zero word where a place is skipped inside a group (zh 101 → 一百零一, 1010 → 一千零一十). */
  zeroForSkippedPlaces?: boolean;
  /**
   * How ordinals are built when the number has no direct ordinal word:
   * - `last-component` (default): ordinalize the last number component only.
   * - `every-component`: ordinalize every additive component (es 121 → Centésimo Vigésimo Primero);
   *   a multiplier above one stays cardinal (es 2000 → Dos Milésimo).
   * - `cardinal`: beyond the ordinal words the ordinal is the cardinal, masculine unless a gender is given (he).
   * - `fused-prefix`: `ordinalPrefix` joins the first word of the cardinal (id Kedua Puluh Satu);
   *   ordinalWordsMapping entries for 0–20 and exact entries still apply.
   * - `last-token`: ordinalize the last token of the final word, using `compoundValue` when set
   *   (fr 21 → Vingt Et Unième, 22 → Vingt-Deuxième).
   */
  ordinalComposition?: 'last-component' | 'every-component' | 'last-token' | 'fused-prefix' | 'cardinal';
  /**
   * Connector between a round large amount and the currency name
   * (es Un Millón De Euros, fr Un Million D'euros).
   */
  /**
   * Word between a number and the noun it counts (scale words and currency units) when the
   * number's last two digits are 00 or 20–99 (ro «de»: douăzeci de mii, o sută de lei; DOOM).
   */
  nounConnector?: string;
  /** Currency units precede the number (sw shilingi ishirini na moja na senti hamsini). */
  currencyUnitFirst?: boolean;
  /** Word before a remainder below ten after a hundred or larger scale word (vi «lẻ»: một trăm lẻ một). */
  unitsAfterScaleWord?: string;
  /** A connector word written onto the following word (he ו: עשרים ואחת, מאה ועשרים). */
  connectorPrefix?: string;
  /**
   * The form `splitWord` takes after a word ending in a vowel, written onto that word
   * (fil «'t»: Dalawampu't Isa, Isang Libo't Isa; but Isang Daan At Isa).
   */
  splitWordAfterVowel?: string;
  /**
   * Linker between a number and the scale word or currency unit it counts (fil «-ng/na»):
   * `vowel` is appended after a final vowel (Dalawang Libo), `n` after a final n (Isang Daang Libo),
   * and `word` follows any other ending as its own word (Apat Na Libo).
   */
  ligature?: { vowel: string; n: string; word: string };
  /** Article opening an ordinal built from `ordinalLastTokenForms` (ro «al»: al douăzeci și unulea). */
  ordinalCompoundPrefix?: string;
  /**
   * With `ordinalComposition: 'last-token'`: the ordinal form of a last word, keyed by the word
   * (ro { Unu: 'Unulea', Sute: 'Sutelea' } → Al Douăzeci Și Unulea, Al Două Sutelea).
   */
  ordinalLastTokenForms?: Record<string, string>;
  /**
   * With `ordinalComposition: 'every-component'`: multipliers are ordinal too
   * (fi 200 → Kahdes Sadas, 2000 → Kahdes Tuhannes, 21 000 → Kahdeskymmenes Ensimmäinen Tuhannes).
   */
  ordinalMultipliers?: boolean;
  currencyScaleConnector?: {
    word: string;
    /** Applies when the main amount is a non-zero multiple of this value. */
    minScale: number;
    /** Glued onto a vowel-initial currency name instead of `word` (fr "D'" → "D'euros"). */
    elidedWord?: string;
  };
};

export type WordJoiningConfig = {
  /** Separator between words. Defaults to a space, or to '' when `trim` is set. */
  separator?: string;
  /**
   * Numbers below this value are written as one word (de 101 → Hunderteins, it 500 → Cinquecento);
   * larger scale words stay separate (de Zwei Millionen).
   */
  compoundBelow?: number;
  /** Scale words followed by the separator even inside a compound (nl Tweeduizend Driehonderd: [1000]). */
  separateAfter?: number[];
  /** Lower-case the first letter of every compound part after the first. Default true. */
  lowercaseCompoundParts?: boolean;
  /**
   * Ordinals are always one word, also past `compoundBelow`, and a scale's `multiplierForms[1]`
   * is dropped (de 2 000 000. → Zweimillionste, 1 000 000. → Millionste; Duden D 65).
   */
  compoundOrdinals?: boolean;
  /** Three equal consonants at a compound seam are written as two (sv ett + tusen → Ettusen, SAOL). */
  reduceTripleConsonants?: boolean;
  /** Inside a compound ordinal, a final unit after the ordinal tens stays a separate word (sk 124. → Stodvadsiaty Štvrtý). */
  separateOrdinalUnit?: boolean;
  /** The `useAnd` word stays a separate word and splits the compound (sk 1001 → Tisíc A Jeden). */
  separateAnd?: boolean;
};

export interface LocaleInterface {
  config: LocaleConfig;
}

export type FormalConfig = {
  numberWordsMapping?: NumberWordMap[];
  exactWordsMapping?: NumberWordMap[];
  ordinalWordsMapping?: OrdinalWordMap[];
  ordinalExactWordsMapping?: OrdinalWordMap[];
  currency?: CurrencyOptions;
  ignoreOneForWords?: string[];
};

import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCoreBase.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Ευρώ',
      plural: 'Ευρώ',
      singular: 'Ευρώ',
      symbol: '€',
      fractionalUnit: {
        name: 'Λεπτό',
        plural: 'Λεπτά',
        singular: 'Λεπτό',
        symbol: '',
      },
    },
    texts: {
      and: 'Και',
      minus: 'Μείον',
      only: 'Μόνο',
      point: 'Κόμμα',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Τετράκις Εκατομμύριο' },
      { number: 1000000000000, value: 'Τρισεκατομμύριο' },
      { number: 1000000000, value: 'Δισεκατομμύριο' },
      { number: 1000000, value: 'Εκατομμύριο' },
      // χιλιάδες is feminine: τρεις χιλιάδες, διακόσιες χιλιάδες (CLDR el).
      { number: 1000, value: 'Χιλιάδες', singularValue: 'Χίλια', gender: 'feminine' },
      { number: 900, value: 'Εννιακόσια', feminineValue: 'Εννιακόσιες', masculineValue: 'Εννιακόσιοι' },
      { number: 800, value: 'Οκτακόσια', feminineValue: 'Οκτακόσιες', masculineValue: 'Οκτακόσιοι' },
      { number: 700, value: 'Επτακόσια', feminineValue: 'Επτακόσιες', masculineValue: 'Επτακόσιοι' },
      { number: 600, value: 'Εξακόσια', feminineValue: 'Εξακόσιες', masculineValue: 'Εξακόσιοι' },
      { number: 500, value: 'Πεντακόσια', feminineValue: 'Πεντακόσιες', masculineValue: 'Πεντακόσιοι' },
      { number: 400, value: 'Τετρακόσια', feminineValue: 'Τετρακόσιες', masculineValue: 'Τετρακόσιοι' },
      { number: 300, value: 'Τριακόσια', feminineValue: 'Τριακόσιες', masculineValue: 'Τριακόσιοι' },
      { number: 200, value: 'Διακόσια', feminineValue: 'Διακόσιες', masculineValue: 'Διακόσιοι' },
      // εκατόν before a following number (εκατόν ένα); a lone 100 is εκατό (exactWordsMapping).
      { number: 100, value: 'Εκατόν' },
      { number: 90, value: 'Ενενήντα' },
      { number: 80, value: 'Ογδόντα' },
      { number: 70, value: 'Εβδομήντα' },
      { number: 60, value: 'Εξήντα' },
      { number: 50, value: 'Πενήντα' },
      { number: 40, value: 'Σαράντα' },
      { number: 30, value: 'Τριάντα' },
      { number: 20, value: 'Είκοσι' },
      { number: 19, value: 'Δεκαεννέα' },
      { number: 18, value: 'Δεκαοκτώ' },
      { number: 17, value: 'Δεκαεπτά' },
      { number: 16, value: 'Δεκαέξι' },
      { number: 15, value: 'Δεκαπέντε' },
      { number: 14, value: 'Δεκατέσσερα', feminineValue: 'Δεκατέσσερις', masculineValue: 'Δεκατέσσερις' },
      { number: 13, value: 'Δεκατρία', feminineValue: 'Δεκατρείς', masculineValue: 'Δεκατρείς' },
      { number: 12, value: 'Δώδεκα' },
      { number: 11, value: 'Έντεκα' },
      { number: 10, value: 'Δέκα' },
      { number: 9, value: 'Εννέα' },
      { number: 8, value: 'Οκτώ' },
      { number: 7, value: 'Επτά' },
      { number: 6, value: 'Έξι' },
      { number: 5, value: 'Πέντε' },
      { number: 4, value: 'Τέσσερα', feminineValue: 'Τέσσερις', masculineValue: 'Τέσσερις' },
      { number: 3, value: 'Τρία', feminineValue: 'Τρεις', masculineValue: 'Τρεις' },
      { number: 2, value: 'Δύο' },
      { number: 1, value: 'Ένα', feminineValue: 'Μία', masculineValue: 'Ένας' },
      { number: 0, value: 'Μηδέν' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'Εκατό' },
      { number: 1000, value: 'Χίλια' },
    ],
    // CLDR el: εκατομμύρια, δισεκατομμύρια after 2+.
    pluralRule: 'one-other',
    pluralForms: {
      1000000: { other: 'Εκατομμύρια' },
      1000000000: { other: 'Δισεκατομμύρια' },
      1000000000000: { other: 'Τρισεκατομμύρια' },
      1000000000000000: { other: 'Τετράκις Εκατομμύρια' },
    },
    // CLDR el: every component of an ordinal is ordinal (εικοστό πρώτο, εκατοστό πρώτο).
    ordinalComposition: 'every-component',
    ignoreOneForWords: [
      'Εκατόν',
      'Χιλιάδες',
      'Διακόσια',
      'Τριακόσια',
      'Τετρακόσια',
      'Πεντακόσια',
      'Εξακόσια',
      'Επτακόσια',
      'Οκτακόσια',
      'Εννιακόσια',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Τετράκις Εκατομμυριοστό' },
      { number: 1000000000000, value: 'Τρισεκατομμυριοστό' },
      { number: 1000000000, value: 'Δισεκατομμυριοστό' },
      { number: 1000000, value: 'Εκατομμυριοστό' },
      { number: 1000, value: 'Χιλιοστό' },
      { number: 900, value: 'Εννεακοσιοστό' },
      { number: 800, value: 'Οκτακοσιοστό' },
      { number: 700, value: 'Επτακοσιοστό' },
      { number: 600, value: 'Εξακοσιοστό' },
      { number: 500, value: 'Πεντακοσιοστό' },
      { number: 400, value: 'Τετρακοσιοστό' },
      { number: 300, value: 'Τριακοσιοστό' },
      { number: 200, value: 'Διακοσιοστό' },
      { number: 100, value: 'Εκατοστό' },
      { number: 90, value: 'Ενενηκοστό' },
      { number: 80, value: 'Ογδοηκοστό' },
      { number: 70, value: 'Εβδομηκοστό' },
      { number: 60, value: 'Εξηκοστό' },
      { number: 50, value: 'Πεντηκοστό' },
      { number: 40, value: 'Τεσσαρακοστό' },
      { number: 30, value: 'Τριακοστό' },
      { number: 20, value: 'Εικοστό' },
      { number: 19, value: 'Δέκατο Ένατο' },
      { number: 18, value: 'Δέκατο Όγδοο' },
      { number: 17, value: 'Δέκατο Έβδομο' },
      { number: 16, value: 'Δέκατο Έκτο' },
      { number: 15, value: 'Δέκατο Πέμπτο' },
      { number: 14, value: 'Δέκατο Τέταρτο' },
      { number: 13, value: 'Δέκατο Τρίτο' },
      { number: 12, value: 'Δωδέκατο' },
      { number: 11, value: 'Ενδέκατο' },
      { number: 10, value: 'Δέκατο' },
      { number: 9, value: 'Ένατο' },
      { number: 8, value: 'Όγδοο' },
      { number: 7, value: 'Έβδομο' },
      { number: 6, value: 'Έκτο' },
      { number: 5, value: 'Πέμπτο' },
      { number: 4, value: 'Τέταρτο' },
      { number: 3, value: 'Τρίτο' },
      { number: 2, value: 'Δεύτερο' },
      { number: 1, value: 'Πρώτο' },
      { number: 0, value: 'Μηδενικό' },
    ],
    // Thousands from 2000 to 9000 fuse a multiplicative stem: CLDR el «δισχιλιοστό», «δισχιλιοστό πρώτο»,
    // «τρισχιλιοστό»; el.wikipedia «δισχιλιοστό» 1 vs «δύο χιλιοστό» 0. 4000+ take -άκις stems (CLDR τετράκις),
    // written as one word as in δισ-/τρισ-. Millions keep the cardinal (δισεκατομμυριοστό = billionth).
    ordinalExactWordsMapping: [{ number: 100, value: 'Εκατοστό' }],
    ordinalScaleStems: {
      2: 'Δισ',
      3: 'Τρισ',
      4: 'Τετρακισ',
      5: 'Πεντακισ',
      6: 'Εξακισ',
      7: 'Επτακισ',
      8: 'Οκτακισ',
      9: 'Εννεακισ',
    },
    ordinalScaleStemsMaxScale: 1000,
    fractionDenominatorMapping: {
      1: { singular: 'Δέκατο', plural: 'Δέκατα' },
      2: { singular: 'Εκατοστό', plural: 'Εκατοστά' },
      3: { singular: 'Χιλιοστό', plural: 'Χιλιοστά' },
      4: { singular: 'Δεκάκις Χιλιοστό', plural: 'Δεκάκις Χιλιοστά' },
      5: { singular: 'Εκατοντάκις Χιλιοστό', plural: 'Εκατοντάκις Χιλιοστά' },
      6: { singular: 'Εκατομμυριοστό', plural: 'Εκατομμυριοστά' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/el-GR';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'el-GR');
  }
}

// Lazily initialized module-level singleton — reused across calls
let instance: ToWords | undefined;

/**
 * Convert a number to words for this locale (functional style).
 */
export function toWords(number: NumberInput, options?: ConverterOptions): string {
  return (instance ??= new ToWords()).convert(number, options);
}

/**
 * Convert a number to ordinal words for this locale (functional style).
 */
export function toOrdinal(number: NumberInput, options?: OrdinalOptions): string {
  return (instance ??= new ToWords()).toOrdinal(number, options);
}

/**
 * Convert a number to currency words for this locale (functional style).
 * Shorthand for toWords(number, { currency: true, ...options }).
 */
export function toCurrency(number: NumberInput, options?: ConverterOptions): string {
  return (instance ??= new ToWords()).convert(number, { ...options, currency: true });
}

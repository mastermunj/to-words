import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCoreBase.js';

// Biblical Hebrew (Ancient Hebrew) number words
export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'שקל',
      plural: 'שקלים',
      singular: 'שקל',
      symbol: '',
      // שקל is masculine and «one» follows the noun (שקל אחד, שני שקלים); גרה feminine.
      gender: 'masculine',
      numberSpecificForms: { 1: 'שקל אחד', 2: 'שני שקלים' },
      fractionalUnit: {
        name: 'גרה',
        plural: 'גרות',
        singular: 'גרה',
        symbol: '',
        gender: 'feminine',
        numberSpecificForms: { 1: 'גרה אחת', 2: 'שתי גרות' },
      },
    },
    texts: {
      and: 'ו',
      minus: 'מינוס',
      only: '',
      point: 'נקודה',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'קואדריליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000000000, value: 'טריליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000000, value: 'מיליארד', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000, value: 'מיליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      // K (Gesenius § 97, as he-IL): masculine thousands, fixed phrases for 2–10 thousand,
      // hundreds in the plural מאות.
      {
        number: 1000,
        value: 'אלף',
        gender: 'masculine',
        multiplierPhrases: {
          2: 'אלפים',
          3: 'שלשת אלפים',
          4: 'ארבעת אלפים',
          5: 'חמשת אלפים',
          6: 'ששת אלפים',
          7: 'שבעת אלפים',
          8: 'שמנת אלפים',
          9: 'תשעת אלפים',
          10: 'עשרת אלפים',
        },
      },
      { number: 900, value: 'תשע מאות' },
      { number: 800, value: 'שמנה מאות' },
      { number: 700, value: 'שבע מאות' },
      { number: 600, value: 'שש מאות' },
      { number: 500, value: 'חמש מאות' },
      { number: 400, value: 'ארבע מאות' },
      { number: 300, value: 'שלש מאות' },
      { number: 100, value: 'מאה' },
      { number: 90, value: 'תשעים' },
      { number: 80, value: 'שמונים' },
      { number: 70, value: 'שבעים' },
      { number: 60, value: 'ששים' },
      { number: 50, value: 'חמשים' },
      { number: 40, value: 'ארבעים' },
      { number: 30, value: 'שלשים' },
      { number: 20, value: 'עשרים' },
      { number: 19, value: 'תשע עשרה', masculineValue: 'תשעה עשר' },
      { number: 18, value: 'שמנה עשרה', masculineValue: 'שמנה עשר' },
      { number: 17, value: 'שבע עשרה', masculineValue: 'שבעה עשר' },
      { number: 16, value: 'שש עשרה', masculineValue: 'ששה עשר' },
      { number: 15, value: 'חמש עשרה', masculineValue: 'חמשה עשר' },
      { number: 14, value: 'ארבע עשרה', masculineValue: 'ארבעה עשר' },
      { number: 13, value: 'שלש עשרה', masculineValue: 'שלשה עשר' },
      { number: 12, value: 'שתים עשרה', masculineValue: 'שנים עשר' },
      { number: 11, value: 'אחת עשרה', masculineValue: 'אחד עשר' },
      { number: 10, value: 'עשר', masculineValue: 'עשרה' },
      { number: 9, value: 'תשע', masculineValue: 'תשעה' },
      { number: 8, value: 'שמנה', masculineValue: 'שמנה' },
      { number: 7, value: 'שבע', masculineValue: 'שבעה' },
      { number: 6, value: 'שש', masculineValue: 'ששה' },
      { number: 5, value: 'חמש', masculineValue: 'חמשה' },
      { number: 4, value: 'ארבע', masculineValue: 'ארבעה' },
      { number: 3, value: 'שלש', masculineValue: 'שלשה' },
      { number: 2, value: 'שתים', masculineValue: 'שנים' },
      { number: 1, value: 'אחת', masculineValue: 'אחד' },
      { number: 0, value: 'אפס' },
    ],
    exactWordsMapping: [{ number: 200, value: 'מאתים' }],
    // ו before the last element only, written onto it (עשרים ואחת).
    andBeforeLastComponent: true,
    connectorPrefix: 'ו',
    ignoreOneForWords: [
      'אלף',
      'מיליון',
      'מיליארד',
      'טריליון',
      'קואדריליון',
      'מאה',
      'תשע מאות',
      'שמנה מאות',
      'שבע מאות',
      'שש מאות',
      'חמש מאות',
      'ארבע מאות',
      'שלש מאות',
      'מאתים',
    ],
    // Past ten the ordinal is the cardinal, with the article (as he-IL).
    ordinalComposition: 'cardinal',
    ordinalPrefix: 'ה',
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'הקואדריליון' },
      { number: 1000000000000, value: 'הטריליון' },
      { number: 1000000000, value: 'המיליארד' },
      { number: 1000000, value: 'המיליון' },
      { number: 1000, value: 'האלף' },
      { number: 100, value: 'המאה' },
      { number: 90, value: 'התשעים' },
      { number: 80, value: 'השמונים' },
      { number: 70, value: 'השבעים' },
      { number: 60, value: 'הששים' },
      { number: 50, value: 'החמשים' },
      { number: 40, value: 'הארבעים' },
      { number: 30, value: 'השלשים' },
      { number: 20, value: 'העשרים' },
      { number: 19, value: 'התשע עשרה' },
      { number: 18, value: 'השמנה עשרה' },
      { number: 17, value: 'השבע עשרה' },
      { number: 16, value: 'השש עשרה' },
      { number: 15, value: 'החמש עשרה' },
      { number: 14, value: 'הארבע עשרה' },
      { number: 13, value: 'השלש עשרה' },
      { number: 12, value: 'השתים עשרה' },
      { number: 11, value: 'האחת עשרה' },
      { number: 10, value: 'העשירי' },
      { number: 9, value: 'התשיעי' },
      { number: 8, value: 'השמיני' },
      { number: 7, value: 'השביעי' },
      { number: 6, value: 'הששי' },
      { number: 5, value: 'החמישי' },
      { number: 4, value: 'הרביעי' },
      { number: 3, value: 'השלישי' },
      { number: 2, value: 'השני' },
      { number: 1, value: 'הראשון' },
      { number: 0, value: 'האפס' },
    ],
    ordinalExactWordsMapping: [
      { number: 2000, value: 'האלפים' },
      { number: 200, value: 'המאתים' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/hbo-IL';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'hbo-IL');
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

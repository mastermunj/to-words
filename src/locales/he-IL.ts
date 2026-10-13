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
      name: 'שקל',
      plural: 'שקלים',
      singular: 'שקל',
      symbol: '₪',
      // שקל is masculine and «one» follows the noun (שקל אחד, שני שקלים); אגורה feminine.
      gender: 'masculine',
      numberSpecificForms: { 1: 'שקל אחד', 2: 'שני שקלים' },
      fractionalUnit: {
        name: 'אגורה',
        plural: 'אגורות',
        singular: 'אגורה',
        symbol: '',
        gender: 'feminine',
        numberSpecificForms: { 1: 'אגורה אחת', 2: 'שתי אגורות' },
      },
    },
    texts: {
      and: 'ו',
      minus: 'מינוס',
      only: 'בלבד',
      point: 'נקודה',
    },
    // CLDR he / Academy: ו before the last element only, written onto it (עשרים ואחת, מאה ושלושה אלף).
    andBeforeLastComponent: true,
    connectorPrefix: 'ו',
    ignoreOneForWords: [
      'אלף',
      'מיליון',
      'מיליארד',
      'טריליון',
      'קוודריליון',
      'מאה',
      'מאתיים',
      'שלוש מאות',
      'ארבע מאות',
      'חמש מאות',
      'שש מאות',
      'שבע מאות',
      'שמונה מאות',
      'תשע מאות',
    ],
    numberWordsMapping: [
      { number: 1000000000000000, value: 'קוודריליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000000000, value: 'טריליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000000, value: 'מיליארד', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      { number: 1000000, value: 'מיליון', gender: 'masculine', multiplierForms: { 2: 'שני' } },
      // Scale words are masculine (שלושה מיליון, אחד עשר אלף); 2–10 thousand are fixed phrases (CLDR he).
      {
        number: 1000,
        value: 'אלף',
        gender: 'masculine',
        multiplierPhrases: {
          2: 'אלפיים',
          3: 'שלושת אלפים',
          4: 'ארבעת אלפים',
          5: 'חמשת אלפים',
          6: 'ששת אלפים',
          7: 'שבעת אלפים',
          8: 'שמונת אלפים',
          9: 'תשעת אלפים',
          10: 'עשרת אלפים',
        },
      },
      { number: 900, value: 'תשע מאות' },
      { number: 800, value: 'שמונה מאות' },
      { number: 700, value: 'שבע מאות' },
      { number: 600, value: 'שש מאות' },
      { number: 500, value: 'חמש מאות' },
      { number: 400, value: 'ארבע מאות' },
      { number: 300, value: 'שלוש מאות' },
      { number: 200, value: 'מאתיים' },
      { number: 100, value: 'מאה' },
      { number: 90, value: 'תשעים' },
      { number: 80, value: 'שמונים' },
      { number: 70, value: 'שבעים' },
      { number: 60, value: 'שישים' },
      { number: 50, value: 'חמישים' },
      { number: 40, value: 'ארבעים' },
      { number: 30, value: 'שלושים' },
      { number: 20, value: 'עשרים' },
      { number: 19, value: 'תשע עשרה', masculineValue: 'תשעה עשר' },
      { number: 18, value: 'שמונה עשרה', masculineValue: 'שמונה עשר' },
      { number: 17, value: 'שבע עשרה', masculineValue: 'שבעה עשר' },
      { number: 16, value: 'שש עשרה', masculineValue: 'שישה עשר' },
      { number: 15, value: 'חמש עשרה', masculineValue: 'חמישה עשר' },
      { number: 14, value: 'ארבע עשרה', masculineValue: 'ארבעה עשר' },
      { number: 13, value: 'שלוש עשרה', masculineValue: 'שלושה עשר' },
      { number: 12, value: 'שתים עשרה', masculineValue: 'שנים עשר' },
      { number: 11, value: 'אחת עשרה', masculineValue: 'אחד עשר' },
      { number: 10, value: 'עשר', masculineValue: 'עשרה' },
      { number: 9, value: 'תשע', masculineValue: 'תשעה' },
      { number: 8, value: 'שמונה', masculineValue: 'שמונה' },
      { number: 7, value: 'שבע', masculineValue: 'שבעה' },
      { number: 6, value: 'שש', masculineValue: 'שישה' },
      { number: 5, value: 'חמש', masculineValue: 'חמישה' },
      { number: 4, value: 'ארבע', masculineValue: 'ארבעה' },
      { number: 3, value: 'שלוש', masculineValue: 'שלושה' },
      { number: 2, value: 'שתיים', masculineValue: 'שניים' },
      { number: 1, value: 'אחת', masculineValue: 'אחד' },
      { number: 0, value: 'אפס' },
    ],
    exactWordsMapping: [
      { number: 2000, value: 'אלפיים' },
      { number: 200, value: 'מאתיים' },
      { number: 100, value: 'מאה' },
    ],
    // CLDR he: past ten the ordinal is the masculine cardinal (עשרים ואחד); the library keeps its definite
    // style (הראשון … העשירי), so ה is written onto it (העשרים ואחד). Library had «עשרים והראשון».
    ordinalComposition: 'cardinal',
    ordinalPrefix: 'ה',
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'הקוודריליון' },
      { number: 1000000000000, value: 'הטריליון' },
      { number: 1000000000, value: 'המיליארד' },
      { number: 1000000, value: 'המיליון' },
      { number: 1000, value: 'האלף' },
      { number: 100, value: 'המאה' },
      { number: 90, value: 'התשעים' },
      { number: 80, value: 'השמונים' },
      { number: 70, value: 'השבעים' },
      { number: 60, value: 'השישים' },
      { number: 50, value: 'החמישים' },
      { number: 40, value: 'הארבעים' },
      { number: 30, value: 'השלושים' },
      { number: 20, value: 'העשרים' },
      { number: 10, value: 'העשירי', masculineValue: 'עשרה' },
      { number: 9, value: 'התשיעי', masculineValue: 'תשעה' },
      { number: 8, value: 'השמיני', masculineValue: 'שמונה' },
      { number: 7, value: 'השביעי', masculineValue: 'שבעה' },
      { number: 6, value: 'השישי', masculineValue: 'שישה' },
      { number: 5, value: 'החמישי', masculineValue: 'חמישה' },
      { number: 4, value: 'הרביעי', masculineValue: 'ארבעה' },
      { number: 3, value: 'השלישי', masculineValue: 'שלושה' },
      { number: 2, value: 'השני', masculineValue: 'שניים' },
      { number: 1, value: 'הראשון', masculineValue: 'אחד' },
      { number: 0, value: 'האפס' },
    ],
    ordinalExactWordsMapping: [
      { number: 2000, value: 'האלפיים' },
      { number: 200, value: 'המאתיים' },
      { number: 100, value: 'המאה' },
    ],
    fractionDenominatorMapping: {
      1: { singular: 'עשירית', plural: 'עשיריות' },
      2: { singular: 'מאית', plural: 'מאיות' },
      3: { singular: 'אלפית', plural: 'אלפיות' },
      4: { singular: 'עשרת-אלפית', plural: 'עשרת-אלפיות' },
      5: { singular: 'מאה-אלפית', plural: 'מאה-אלפיות' },
      6: { singular: 'מיליונית', plural: 'מיליוניות' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/he-IL';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'he-IL');
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

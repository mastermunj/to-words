import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'שקל',
      plural: 'שקלים',
      singular: 'שקל',
      symbol: '₪',
      fractionalUnit: {
        name: 'אגורה',
        plural: 'אגורות',
        singular: 'אגורה',
        symbol: '',
      },
    },
    texts: {
      and: 'ו',
      minus: 'מינוס',
      only: 'בלבד',
      point: 'נקודה',
    },
    splitWord: 'ו',
    ignoreOneForWords: ['אלף', 'מיליון', 'מיליארד', 'טריליון', 'קוודריליון'],
    numberWordsMapping: [
      { number: 1000000000000000, value: 'קוודריליון' },
      { number: 1000000000000, value: 'טריליון' },
      { number: 1000000000, value: 'מיליארד' },
      { number: 1000000, value: 'מיליון' },
      { number: 1000, value: 'אלף' },
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
      { number: 19, value: 'התשע עשרה' },
      { number: 18, value: 'השמונה עשרה' },
      { number: 17, value: 'השבע עשרה' },
      { number: 16, value: 'השש עשרה' },
      { number: 15, value: 'החמש עשרה' },
      { number: 14, value: 'הארבע עשרה' },
      { number: 13, value: 'השלוש עשרה' },
      { number: 12, value: 'השתים עשרה' },
      { number: 11, value: 'האחת עשרה' },
      { number: 10, value: 'העשירי' },
      { number: 9, value: 'התשיעי' },
      { number: 8, value: 'השמיני' },
      { number: 7, value: 'השביעי' },
      { number: 6, value: 'השישי' },
      { number: 5, value: 'החמישי' },
      { number: 4, value: 'הרביעי' },
      { number: 3, value: 'השלישי' },
      { number: 2, value: 'השני' },
      { number: 1, value: 'הראשון' },
      { number: 0, value: 'האפס' },
    ],
    ordinalExactWordsMapping: [
      { number: 2000, value: 'האלפיים' },
      { number: 200, value: 'המאתיים' },
      { number: 100, value: 'המאה' },
    ],
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
    this.setLocale(Locale);
  }
}

// Module-level singleton — reused across calls to avoid per-call instance creation
const instance = new ToWords();

/**
 * Convert a number to words for this locale (functional style).
 */
export function toWords(number: NumberInput, options?: ConverterOptions): string {
  return instance.convert(number, options);
}

/**
 * Convert a number to ordinal words for this locale (functional style).
 */
export function toOrdinal(number: NumberInput, options?: OrdinalOptions): string {
  return instance.toOrdinal(number, options);
}

/**
 * Convert a number to currency words for this locale (functional style).
 * Shorthand for toWords(number, { currency: true, ...options }).
 */
export function toCurrency(number: NumberInput, options?: ConverterOptions): string {
  return instance.convert(number, { ...options, currency: true });
}

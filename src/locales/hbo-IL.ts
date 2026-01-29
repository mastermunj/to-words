import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// Biblical Hebrew (Ancient Hebrew) number words
export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'שקל',
      plural: 'שקלים',
      singular: 'שקל',
      symbol: '',
      fractionalUnit: {
        name: 'גרה',
        plural: 'גרות',
        singular: 'גרה',
        symbol: '',
      },
    },
    texts: {
      and: 'ו',
      minus: 'מינוס',
      only: '',
      point: 'נקודה',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'קואדריליון' },
      { number: 1000000000000, value: 'טריליון' },
      { number: 1000000000, value: 'מיליארד' },
      { number: 1000000, value: 'מיליון' },
      { number: 1000, value: 'אלף' },
      { number: 100, value: 'מאה' },
      { number: 90, value: 'תשעים' },
      { number: 80, value: 'שמונים' },
      { number: 70, value: 'שבעים' },
      { number: 60, value: 'ששים' },
      { number: 50, value: 'חמשים' },
      { number: 40, value: 'ארבעים' },
      { number: 30, value: 'שלשים' },
      { number: 20, value: 'עשרים' },
      { number: 19, value: 'תשע עשרה' },
      { number: 18, value: 'שמנה עשרה' },
      { number: 17, value: 'שבע עשרה' },
      { number: 16, value: 'שש עשרה' },
      { number: 15, value: 'חמש עשרה' },
      { number: 14, value: 'ארבע עשרה' },
      { number: 13, value: 'שלש עשרה' },
      { number: 12, value: 'שתים עשרה' },
      { number: 11, value: 'אחת עשרה' },
      { number: 10, value: 'עשר' },
      { number: 9, value: 'תשע' },
      { number: 8, value: 'שמנה' },
      { number: 7, value: 'שבע' },
      { number: 6, value: 'שש' },
      { number: 5, value: 'חמש' },
      { number: 4, value: 'ארבע' },
      { number: 3, value: 'שלש' },
      { number: 2, value: 'שתים' },
      { number: 1, value: 'אחת' },
      { number: 0, value: 'אפס' },
    ],
    exactWordsMapping: [
      { number: 2000, value: 'אלפים' },
      { number: 200, value: 'מאתים' },
    ],
    ignoreOneForWords: ['אלף', 'מיליון', 'מיליארד', 'טריליון', 'קואדריליון'],
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
    this.setLocale(Locale);
  }
}

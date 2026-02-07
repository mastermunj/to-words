import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'ብር',
      plural: 'ብር',
      singular: 'ብር',
      symbol: 'ETB',
      fractionalUnit: {
        name: 'ሳንቲም',
        singular: 'ሳንቲም',
        plural: 'ሳንቲም',
        symbol: '',
      },
    },
    texts: {
      and: 'እና',
      minus: 'አሉታዊ',
      only: 'ብቻ',
      point: 'ነጥብ',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'ኳድሪሊዮን' },
      { number: 1000000000000, value: 'ትሪሊዮን' },
      { number: 1000000000, value: 'ቢሊዮን' },
      { number: 1000000, value: 'ሚሊዮን' },
      { number: 1000, value: 'ሺ' },
      { number: 100, value: 'መቶ' },
      { number: 90, value: 'ዘጠና' },
      { number: 80, value: 'ሰማንያ' },
      { number: 70, value: 'ሰባ' },
      { number: 60, value: 'ስድሳ' },
      { number: 50, value: 'ሃምሳ' },
      { number: 40, value: 'አርባ' },
      { number: 30, value: 'ሰላሳ' },
      { number: 20, value: 'ሃያ' },
      { number: 19, value: 'አስራ ዘጠኝ' },
      { number: 18, value: 'አስራ ስምንት' },
      { number: 17, value: 'አስራ ሰባት' },
      { number: 16, value: 'አስራ ስድስት' },
      { number: 15, value: 'አስራ አምስት' },
      { number: 14, value: 'አስራ አራት' },
      { number: 13, value: 'አስራ ሦስት' },
      { number: 12, value: 'አስራ ሁለት' },
      { number: 11, value: 'አስራ አንድ' },
      { number: 10, value: 'አስር' },
      { number: 9, value: 'ዘጠኝ' },
      { number: 8, value: 'ስምንት' },
      { number: 7, value: 'ሰባት' },
      { number: 6, value: 'ስድስት' },
      { number: 5, value: 'አምስት' },
      { number: 4, value: 'አራት' },
      { number: 3, value: 'ሦስት' },
      { number: 2, value: 'ሁለት' },
      { number: 1, value: 'አንድ' },
      { number: 0, value: 'ዜሮ' },
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'ኳድሪሊዮንኛ' },
      { number: 1000000000000, value: 'ትሪሊዮንኛ' },
      { number: 1000000000, value: 'ቢሊዮንኛ' },
      { number: 1000000, value: 'ሚሊዮንኛ' },
      { number: 1000, value: 'ሺኛ' },
      { number: 100, value: 'መቶኛ' },
      { number: 90, value: 'ዘጠናኛ' },
      { number: 80, value: 'ሰማንያኛ' },
      { number: 70, value: 'ሰባኛ' },
      { number: 60, value: 'ስድሳኛ' },
      { number: 50, value: 'ሃምሳኛ' },
      { number: 40, value: 'አርባኛ' },
      { number: 30, value: 'ሰላሳኛ' },
      { number: 20, value: 'ሃያኛ' },
      { number: 19, value: 'አስራ ዘጠነኛ' },
      { number: 18, value: 'አስራ ስምንተኛ' },
      { number: 17, value: 'አስራ ሰባተኛ' },
      { number: 16, value: 'አስራ ስድስተኛ' },
      { number: 15, value: 'አስራ አምስተኛ' },
      { number: 14, value: 'አስራ አራተኛ' },
      { number: 13, value: 'አስራ ሦስተኛ' },
      { number: 12, value: 'አስራ ሁለተኛ' },
      { number: 11, value: 'አስራ አንደኛ' },
      { number: 10, value: 'አስረኛ' },
      { number: 9, value: 'ዘጠነኛ' },
      { number: 8, value: 'ስምንተኛ' },
      { number: 7, value: 'ሰባተኛ' },
      { number: 6, value: 'ስድስተኛ' },
      { number: 5, value: 'አምስተኛ' },
      { number: 4, value: 'አራተኛ' },
      { number: 3, value: 'ሦስተኛ' },
      { number: 2, value: 'ሁለተኛ' },
      { number: 1, value: 'አንደኛ' },
      { number: 0, value: 'ዜሮኛ' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/am-ET';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

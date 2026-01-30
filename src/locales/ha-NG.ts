import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Naira',
      plural: 'Naira',
      singular: 'Naira',
      symbol: '₦',
      fractionalUnit: {
        name: 'Kobo',
        singular: 'Kobo',
        plural: 'Kobo',
        symbol: '',
      },
    },
    texts: {
      and: 'Da',
      minus: 'Ragi',
      only: 'Kawai',
      point: 'Digo',
    },
    splitWord: 'Da',
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kuwadirilyan' },
      { number: 1000000000000, value: 'Tiriliyan' },
      { number: 1000000000, value: 'Biliyan' },
      { number: 1000000, value: 'Miliyan' },
      { number: 1000, value: 'Dubu' },
      { number: 100, value: 'Ɗari' },
      { number: 90, value: "Casa'in" },
      { number: 80, value: 'Tamanin' },
      { number: 70, value: "Saba'in" },
      { number: 60, value: 'Sittin' },
      { number: 50, value: 'Hamsin' },
      { number: 40, value: "Arba'in" },
      { number: 30, value: 'Talatin' },
      { number: 20, value: 'Ashirin' },
      { number: 19, value: 'Goma Sha Tara' },
      { number: 18, value: 'Goma Sha Takwas' },
      { number: 17, value: 'Goma Sha Bakwai' },
      { number: 16, value: 'Goma Sha Shida' },
      { number: 15, value: 'Goma Sha Biyar' },
      { number: 14, value: 'Goma Sha Huɗu' },
      { number: 13, value: 'Goma Sha Uku' },
      { number: 12, value: 'Goma Sha Biyu' },
      { number: 11, value: 'Goma Sha Ɗaya' },
      { number: 10, value: 'Goma' },
      { number: 9, value: 'Tara' },
      { number: 8, value: 'Takwas' },
      { number: 7, value: 'Bakwai' },
      { number: 6, value: 'Shida' },
      { number: 5, value: 'Biyar' },
      { number: 4, value: 'Huɗu' },
      { number: 3, value: 'Uku' },
      { number: 2, value: 'Biyu' },
      { number: 1, value: 'Ɗaya' },
      { number: 0, value: 'Sifili' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Ɗari Ɗaya' }],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Na Kuwadirilyan' },
      { number: 1000000000000, value: 'Na Tiriliyan' },
      { number: 1000000000, value: 'Na Biliyan' },
      { number: 1000000, value: 'Na Miliyan' },
      { number: 1000, value: 'Na Dubu' },
      { number: 100, value: 'Na Ɗari' },
      { number: 90, value: "Na Casa'in" },
      { number: 80, value: 'Na Tamanin' },
      { number: 70, value: "Na Saba'in" },
      { number: 60, value: 'Na Sittin' },
      { number: 50, value: 'Na Hamsin' },
      { number: 40, value: "Na Arba'in" },
      { number: 30, value: 'Na Talatin' },
      { number: 20, value: 'Na Ashirin' },
      { number: 19, value: 'Na Goma Sha Tara' },
      { number: 18, value: 'Na Goma Sha Takwas' },
      { number: 17, value: 'Na Goma Sha Bakwai' },
      { number: 16, value: 'Na Goma Sha Shida' },
      { number: 15, value: 'Na Goma Sha Biyar' },
      { number: 14, value: 'Na Goma Sha Huɗu' },
      { number: 13, value: 'Na Goma Sha Uku' },
      { number: 12, value: 'Na Goma Sha Biyu' },
      { number: 11, value: 'Na Goma Sha Ɗaya' },
      { number: 10, value: 'Na Goma' },
      { number: 9, value: 'Na Tara' },
      { number: 8, value: 'Na Takwas' },
      { number: 7, value: 'Na Bakwai' },
      { number: 6, value: 'Na Shida' },
      { number: 5, value: 'Na Biyar' },
      { number: 4, value: 'Na Huɗu' },
      { number: 3, value: 'Na Uku' },
      { number: 2, value: 'Na Biyu' },
      { number: 1, value: 'Na Farko' },
      { number: 0, value: 'Na Sifili' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Na Ɗari Ɗaya' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ha-NG';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

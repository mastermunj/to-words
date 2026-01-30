import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Shilingi',
      plural: 'Shilingi',
      singular: 'Shilingi',
      symbol: 'KSh',
      fractionalUnit: {
        name: 'Senti',
        plural: 'Senti',
        singular: 'Senti',
        symbol: 'c',
      },
    },
    texts: {
      and: 'Na',
      minus: 'Hasi',
      only: 'Tu',
      point: 'Nukta',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kwadrilioni' },
      { number: 1000000000000, value: 'Trilioni' },
      { number: 1000000000, value: 'Bilioni' },
      { number: 1000000, value: 'Milioni' },
      { number: 1000, value: 'Elfu' },
      { number: 100, value: 'Mia' },
      { number: 90, value: 'Tisini' },
      { number: 80, value: 'Themanini' },
      { number: 70, value: 'Sabini' },
      { number: 60, value: 'Sitini' },
      { number: 50, value: 'Hamsini' },
      { number: 40, value: 'Arobaini' },
      { number: 30, value: 'Thelathini' },
      { number: 20, value: 'Ishirini' },
      { number: 19, value: 'Kumi Na Tisa' },
      { number: 18, value: 'Kumi Na Nane' },
      { number: 17, value: 'Kumi Na Saba' },
      { number: 16, value: 'Kumi Na Sita' },
      { number: 15, value: 'Kumi Na Tano' },
      { number: 14, value: 'Kumi Na Nne' },
      { number: 13, value: 'Kumi Na Tatu' },
      { number: 12, value: 'Kumi Na Mbili' },
      { number: 11, value: 'Kumi Na Moja' },
      { number: 10, value: 'Kumi' },
      { number: 9, value: 'Tisa' },
      { number: 8, value: 'Nane' },
      { number: 7, value: 'Saba' },
      { number: 6, value: 'Sita' },
      { number: 5, value: 'Tano' },
      { number: 4, value: 'Nne' },
      { number: 3, value: 'Tatu' },
      { number: 2, value: 'Mbili' },
      { number: 1, value: 'Moja' },
      { number: 0, value: 'Sifuri' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'Mia Moja' },
      { number: 1000, value: 'Elfu Moja' },
      { number: 1000000, value: 'Milioni Moja' },
      { number: 1000000000, value: 'Bilioni Moja' },
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Wa Kwadrilioni' },
      { number: 1000000000000, value: 'Wa Trilioni' },
      { number: 1000000000, value: 'Wa Bilioni' },
      { number: 1000000, value: 'Wa Milioni' },
      { number: 1000, value: 'Wa Elfu' },
      { number: 100, value: 'Wa Mia' },
      { number: 90, value: 'Wa Tisini' },
      { number: 80, value: 'Wa Themanini' },
      { number: 70, value: 'Wa Sabini' },
      { number: 60, value: 'Wa Sitini' },
      { number: 50, value: 'Wa Hamsini' },
      { number: 40, value: 'Wa Arobaini' },
      { number: 30, value: 'Wa Thelathini' },
      { number: 20, value: 'Wa Ishirini' },
      { number: 19, value: 'Wa Kumi Na Tisa' },
      { number: 18, value: 'Wa Kumi Na Nane' },
      { number: 17, value: 'Wa Kumi Na Saba' },
      { number: 16, value: 'Wa Kumi Na Sita' },
      { number: 15, value: 'Wa Kumi Na Tano' },
      { number: 14, value: 'Wa Kumi Na Nne' },
      { number: 13, value: 'Wa Kumi Na Tatu' },
      { number: 12, value: 'Wa Kumi Na Mbili' },
      { number: 11, value: 'Wa Kumi Na Moja' },
      { number: 10, value: 'Wa Kumi' },
      { number: 9, value: 'Wa Tisa' },
      { number: 8, value: 'Wa Nane' },
      { number: 7, value: 'Wa Saba' },
      { number: 6, value: 'Wa Sita' },
      { number: 5, value: 'Wa Tano' },
      { number: 4, value: 'Wa Nne' },
      { number: 3, value: 'Wa Tatu' },
      { number: 2, value: 'Wa Pili' },
      { number: 1, value: 'Wa Kwanza' },
      { number: 0, value: 'Wa Sifuri' },
    ],
    ordinalExactWordsMapping: [
      { number: 100, value: 'Wa Mia Moja' },
      { number: 1000, value: 'Wa Elfu Moja' },
      { number: 1000000, value: 'Wa Milioni Moja' },
      { number: 1000000000, value: 'Wa Bilioni Moja' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/sw-KE';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

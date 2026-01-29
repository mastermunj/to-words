import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Ringgit',
      plural: 'Ringgit',
      singular: 'Ringgit',
      symbol: 'RM',
      fractionalUnit: {
        name: 'Sen',
        plural: 'Sen',
        singular: 'Sen',
        symbol: '',
      },
    },
    texts: {
      and: 'Dan',
      minus: 'Minus',
      only: 'Sahaja',
      point: 'Perpuluhan',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kuadriliun' },
      { number: 1000000000000, value: 'Triliun' },
      { number: 1000000000, value: 'Bilion' },
      { number: 1000000, value: 'Juta' },
      { number: 1000, value: 'Ribu', singularValue: 'Seribu' },
      { number: 100, value: 'Ratus', singularValue: 'Seratus' },
      { number: 90, value: 'Sembilan Puluh' },
      { number: 80, value: 'Lapan Puluh' },
      { number: 70, value: 'Tujuh Puluh' },
      { number: 60, value: 'Enam Puluh' },
      { number: 50, value: 'Lima Puluh' },
      { number: 40, value: 'Empat Puluh' },
      { number: 30, value: 'Tiga Puluh' },
      { number: 20, value: 'Dua Puluh' },
      { number: 19, value: 'Sembilan Belas' },
      { number: 18, value: 'Lapan Belas' },
      { number: 17, value: 'Tujuh Belas' },
      { number: 16, value: 'Enam Belas' },
      { number: 15, value: 'Lima Belas' },
      { number: 14, value: 'Empat Belas' },
      { number: 13, value: 'Tiga Belas' },
      { number: 12, value: 'Dua Belas' },
      { number: 11, value: 'Sebelas' },
      { number: 10, value: 'Sepuluh' },
      { number: 9, value: 'Sembilan' },
      { number: 8, value: 'Lapan' },
      { number: 7, value: 'Tujuh' },
      { number: 6, value: 'Enam' },
      { number: 5, value: 'Lima' },
      { number: 4, value: 'Empat' },
      { number: 3, value: 'Tiga' },
      { number: 2, value: 'Dua' },
      { number: 1, value: 'Satu' },
      { number: 0, value: 'Sifar' },
    ],
    exactWordsMapping: [
      { number: 1000, value: 'Seribu' },
      { number: 100, value: 'Seratus' },
    ],
    ignoreOneForWords: ['Ribu', 'Ratus'],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Kekuadriliun' },
      { number: 1000000000000, value: 'Ketriliun' },
      { number: 1000000000, value: 'Kebilion' },
      { number: 1000000, value: 'Kejuta' },
      { number: 1000, value: 'Keribu' },
      { number: 100, value: 'Keratus' },
      { number: 90, value: 'Kesembilan Puluh' },
      { number: 80, value: 'Kelapan Puluh' },
      { number: 70, value: 'Ketujuh Puluh' },
      { number: 60, value: 'Keenam Puluh' },
      { number: 50, value: 'Kelima Puluh' },
      { number: 40, value: 'Keempat Puluh' },
      { number: 30, value: 'Ketiga Puluh' },
      { number: 20, value: 'Kedua Puluh' },
      { number: 19, value: 'Kesembilan Belas' },
      { number: 18, value: 'Kelapan Belas' },
      { number: 17, value: 'Ketujuh Belas' },
      { number: 16, value: 'Keenam Belas' },
      { number: 15, value: 'Kelima Belas' },
      { number: 14, value: 'Keempat Belas' },
      { number: 13, value: 'Ketiga Belas' },
      { number: 12, value: 'Kedua Belas' },
      { number: 11, value: 'Kesebelas' },
      { number: 10, value: 'Kesepuluh' },
      { number: 9, value: 'Kesembilan' },
      { number: 8, value: 'Kelapan' },
      { number: 7, value: 'Ketujuh' },
      { number: 6, value: 'Keenam' },
      { number: 5, value: 'Kelima' },
      { number: 4, value: 'Keempat' },
      { number: 3, value: 'Ketiga' },
      { number: 2, value: 'Kedua' },
      { number: 1, value: 'Kesatu' },
      { number: 0, value: 'Kesifar' },
    ],
    ordinalExactWordsMapping: [
      { number: 1000, value: 'Keseribu' },
      { number: 100, value: 'Keseratus' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ms-MY';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

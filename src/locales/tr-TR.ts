import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'lira',
      plural: '',
      singular: '',
      symbol: '₺',
      fractionalUnit: {
        name: '',
        singular: 'lira',
        plural: 'lira',
        symbol: '',
      },
    },
    texts: {
      and: 'virgül',
      minus: 'eksi',
      only: '',
      point: 'virgül',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'katrilyon' },
      { number: 1000000000000, value: 'trilyon' },
      { number: 1000000000, value: 'milyar' },
      { number: 1000000, value: 'milyon' },
      { number: 1000, value: 'bin' },
      { number: 900, value: 'dokuz yüz' },
      { number: 800, value: 'sekiz yüz' },
      { number: 700, value: 'yedi yüz' },
      { number: 600, value: 'altı yüz' },
      { number: 500, value: 'beş yüz' },
      { number: 400, value: 'dört yüz' },
      { number: 300, value: 'üç yüz' },
      { number: 200, value: 'iki yüz' },
      { number: 100, value: 'yüz' },
      { number: 90, value: 'doksan' },
      { number: 80, value: 'seksen' },
      { number: 70, value: 'yetmiş' },
      { number: 60, value: 'altmış' },
      { number: 50, value: 'elli' },
      { number: 40, value: 'kırk' },
      { number: 30, value: 'otuz' },
      { number: 20, value: 'yirmi' },
      { number: 19, value: 'on dokuz' },
      { number: 18, value: 'on sekiz' },
      { number: 17, value: 'on yedi' },
      { number: 16, value: 'on altı' },
      { number: 15, value: 'on beş' },
      { number: 14, value: 'on dört' },
      { number: 13, value: 'on üç' },
      { number: 12, value: 'on iki' },
      { number: 11, value: 'on bir' },
      { number: 10, value: 'on' },
      { number: 9, value: 'dokuz' },
      { number: 8, value: 'sekiz' },
      { number: 7, value: 'yedi' },
      { number: 6, value: 'altı' },
      { number: 5, value: 'beş' },
      { number: 4, value: 'dört' },
      { number: 3, value: 'üç' },
      { number: 2, value: 'iki' },
      { number: 1, value: 'bir' },
      { number: 0, value: 'sıfır' },
    ],
    namedLessThan1000: true,
    ignoreZeroInDecimals: true,
    decimalLengthWordMapping: {
      1: 'onuncu',
      2: 'yüzüncü',
      3: 'bininci',
      4: 'on bininci',
      5: 'yüz bininci',
      6: 'on milyonuncu',
      7: 'milyonuncu',
      8: 'yüz milyonuncu',
    },
    ordinalWordsMapping: [
      { number: 1000000000000, value: 'Trilyonuncu' },
      { number: 1000000000, value: 'Milyarıncı' },
      { number: 1000000, value: 'Milyonuncu' },
      { number: 1000, value: 'Bininci' },
      { number: 100, value: 'Yüzüncü' },
      { number: 90, value: 'Doksanıncı' },
      { number: 80, value: 'Sekseninci' },
      { number: 70, value: 'Yetmişinci' },
      { number: 60, value: 'Altmışıncı' },
      { number: 50, value: 'Ellinci' },
      { number: 40, value: 'Kırkıncı' },
      { number: 30, value: 'Otuzuncu' },
      { number: 20, value: 'Yirminci' },
      { number: 19, value: 'On Dokuzuncu' },
      { number: 18, value: 'On Sekizinci' },
      { number: 17, value: 'On Yedinci' },
      { number: 16, value: 'On Altıncı' },
      { number: 15, value: 'On Beşinci' },
      { number: 14, value: 'On Dördüncü' },
      { number: 13, value: 'On Üçüncü' },
      { number: 12, value: 'On İkinci' },
      { number: 11, value: 'On Birinci' },
      { number: 10, value: 'Onuncu' },
      { number: 9, value: 'Dokuzuncu' },
      { number: 8, value: 'Sekizinci' },
      { number: 7, value: 'Yedinci' },
      { number: 6, value: 'Altıncı' },
      { number: 5, value: 'Beşinci' },
      { number: 4, value: 'Dördüncü' },
      { number: 3, value: 'Üçüncü' },
      { number: 2, value: 'İkinci' },
      { number: 1, value: 'Birinci' },
      { number: 0, value: 'Sıfırıncı' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/tr-TR';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

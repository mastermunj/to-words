import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Manat',
      plural: 'Manat',
      singular: 'Manat',
      symbol: '₼',
      fractionalUnit: {
        name: 'Qəpik',
        singular: 'Qəpik',
        plural: 'Qəpik',
        symbol: '',
      },
    },
    texts: {
      and: 'Və',
      minus: 'Mənfi',
      only: '',
      point: 'Nöqtə',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Katrilyon' },
      { number: 1000000000000, value: 'Trilyon' },
      { number: 1000000000, value: 'Milyard' },
      { number: 1000000, value: 'Milyon' },
      { number: 1000, value: 'Min' },
      { number: 100, value: 'Yüz' },
      { number: 90, value: 'Doxsan' },
      { number: 80, value: 'Səksən' },
      { number: 70, value: 'Yetmiş' },
      { number: 60, value: 'Altmış' },
      { number: 50, value: 'Əlli' },
      { number: 40, value: 'Qırx' },
      { number: 30, value: 'Otuz' },
      { number: 20, value: 'İyirmi' },
      { number: 19, value: 'On Doqquz' },
      { number: 18, value: 'On Səkkiz' },
      { number: 17, value: 'On Yeddi' },
      { number: 16, value: 'On Altı' },
      { number: 15, value: 'On Beş' },
      { number: 14, value: 'On Dörd' },
      { number: 13, value: 'On Üç' },
      { number: 12, value: 'On İki' },
      { number: 11, value: 'On Bir' },
      { number: 10, value: 'On' },
      { number: 9, value: 'Doqquz' },
      { number: 8, value: 'Səkkiz' },
      { number: 7, value: 'Yeddi' },
      { number: 6, value: 'Altı' },
      { number: 5, value: 'Beş' },
      { number: 4, value: 'Dörd' },
      { number: 3, value: 'Üç' },
      { number: 2, value: 'İki' },
      { number: 1, value: 'Bir' },
      { number: 0, value: 'Sıfır' },
    ],
    ignoreOneForWords: ['Min'],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Katrilyonuncu' },
      { number: 1000000000000, value: 'Trilyonuncu' },
      { number: 1000000000, value: 'Milyardıncı' },
      { number: 1000000, value: 'Milyonuncu' },
      { number: 1000, value: 'Mininci' },
      { number: 100, value: 'Yüzüncü' },
      { number: 90, value: 'Doxsanıncı' },
      { number: 80, value: 'Səksəninci' },
      { number: 70, value: 'Yetmişinci' },
      { number: 60, value: 'Altmışıncı' },
      { number: 50, value: 'Əllinci' },
      { number: 40, value: 'Qırxıncı' },
      { number: 30, value: 'Otuzuncu' },
      { number: 20, value: 'İyirminci' },
      { number: 19, value: 'On Doqquzuncu' },
      { number: 18, value: 'On Səkkizinci' },
      { number: 17, value: 'On Yeddinci' },
      { number: 16, value: 'On Altıncı' },
      { number: 15, value: 'On Beşinci' },
      { number: 14, value: 'On Dördüncü' },
      { number: 13, value: 'On Üçüncü' },
      { number: 12, value: 'On İkinci' },
      { number: 11, value: 'On Birinci' },
      { number: 10, value: 'Onuncu' },
      { number: 9, value: 'Doqquzuncu' },
      { number: 8, value: 'Səkkizinci' },
      { number: 7, value: 'Yeddinci' },
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
 * import { ToWords } from 'to-words/az-AZ';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

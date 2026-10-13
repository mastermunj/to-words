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
      // Turkish nouns stay singular after a number (iki lira, elli kuruş).
      name: 'Lira',
      plural: 'Lira',
      singular: 'Lira',
      symbol: '₺',
      fractionalUnit: {
        name: 'Kuruş',
        singular: 'Kuruş',
        plural: 'Kuruş',
        symbol: 'kr',
      },
    },
    texts: {
      and: '',
      minus: 'Eksi',
      only: '',
      point: 'Virgül',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Katrilyon' },
      { number: 1000000000000, value: 'Trilyon' },
      { number: 1000000000, value: 'Milyar' },
      { number: 1000000, value: 'Milyon' },
      { number: 1000, value: 'Bin' },
      { number: 900, value: 'Dokuz Yüz' },
      { number: 800, value: 'Sekiz Yüz' },
      { number: 700, value: 'Yedi Yüz' },
      { number: 600, value: 'Altı Yüz' },
      { number: 500, value: 'Beş Yüz' },
      { number: 400, value: 'Dört Yüz' },
      { number: 300, value: 'Üç Yüz' },
      { number: 200, value: 'İki Yüz' },
      { number: 100, value: 'Yüz' },
      { number: 90, value: 'Doksan' },
      { number: 80, value: 'Seksen' },
      { number: 70, value: 'Yetmiş' },
      { number: 60, value: 'Altmış' },
      { number: 50, value: 'Elli' },
      { number: 40, value: 'Kırk' },
      { number: 30, value: 'Otuz' },
      { number: 20, value: 'Yirmi' },
      { number: 19, value: 'On Dokuz' },
      { number: 18, value: 'On Sekiz' },
      { number: 17, value: 'On Yedi' },
      { number: 16, value: 'On Altı' },
      { number: 15, value: 'On Beş' },
      { number: 14, value: 'On Dört' },
      { number: 13, value: 'On Üç' },
      { number: 12, value: 'On İki' },
      { number: 11, value: 'On Bir' },
      { number: 10, value: 'On' },
      { number: 9, value: 'Dokuz' },
      { number: 8, value: 'Sekiz' },
      { number: 7, value: 'Yedi' },
      { number: 6, value: 'Altı' },
      { number: 5, value: 'Beş' },
      { number: 4, value: 'Dört' },
      { number: 3, value: 'Üç' },
      { number: 2, value: 'İki' },
      { number: 1, value: 'Bir' },
      { number: 0, value: 'Sıfır' },
    ],
    // «bin» alone, never «bir bin» (CLDR tr).
    ignoreOneForWords: ['Bin'],
    namedLessThan1000: true,
    // Only the last word turns ordinal (iki yüzüncü, yirmi birinci; CLDR tr).
    ordinalComposition: 'last-token',
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Katrilyonuncu' },
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
    this.setLocale(Locale, 'tr-TR');
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

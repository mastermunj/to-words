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
      name: 'eiro',
      plural: 'eiro',
      symbol: '€',
      gender: 'masculine',
      fractionalUnit: {
        name: 'cents',
        plural: 'centi',
        symbol: '',
        gender: 'masculine',
        pluralForms: { one: 'cents', other: 'centi' },
      },
    },
    texts: {
      and: 'un',
      minus: 'mīnus',
      only: '',
      point: 'komats',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'kvadriljons' },
      { number: 1000000000000, value: 'triljons' },
      { number: 1000000000, value: 'miljards' },
      { number: 1000000, value: 'miljons' },
      { number: 1000, value: 'tūkstotis' },
      // tezaurs.lv and lv.wikipedia write hundreds as one word: «200 (divsimt)» 46 vs «divi simti» 9, «trīssimt» 26 vs 6.
      { number: 900, value: 'deviņsimt' },
      { number: 800, value: 'astoņsimt' },
      { number: 700, value: 'septiņsimt' },
      { number: 600, value: 'sešsimt' },
      { number: 500, value: 'piecsimt' },
      { number: 400, value: 'četrsimt' },
      { number: 300, value: 'trīssimt' },
      { number: 200, value: 'divsimt' },
      { number: 100, value: 'simt' },
      { number: 90, value: 'deviņdesmit' },
      { number: 80, value: 'astoņdesmit' },
      { number: 70, value: 'septiņdesmit' },
      { number: 60, value: 'sešdesmit' },
      { number: 50, value: 'piecdesmit' },
      { number: 40, value: 'četrdesmit' },
      { number: 30, value: 'trīsdesmit' },
      { number: 20, value: 'divdesmit' },
      { number: 19, value: 'deviņpadsmit' },
      { number: 18, value: 'astoņpadsmit' },
      { number: 17, value: 'septiņpadsmit' },
      { number: 16, value: 'sešpadsmit' },
      { number: 15, value: 'piecpadsmit' },
      { number: 14, value: 'četrpadsmit' },
      { number: 13, value: 'trīspadsmit' },
      { number: 12, value: 'divpadsmit' },
      { number: 11, value: 'vienpadsmit' },
      { number: 10, value: 'desmit' },
      { number: 9, value: 'deviņi', feminineValue: 'deviņas' },
      { number: 8, value: 'astoņi', feminineValue: 'astoņas' },
      { number: 7, value: 'septiņi', feminineValue: 'septiņas' },
      { number: 6, value: 'seši', feminineValue: 'sešas' },
      { number: 5, value: 'pieci', feminineValue: 'piecas' },
      { number: 4, value: 'četri', feminineValue: 'četras' },
      { number: 3, value: 'trīs' },
      { number: 2, value: 'divi', feminineValue: 'divas' },
      { number: 1, value: 'viens', feminineValue: 'viena' },
      { number: 0, value: 'nulle' },
    ],
    // tezaurs.lv: tūkstošais, miljonais, divsimtais, divtūkstošais.
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'kvadriljonais' },
      { number: 1000000000000, value: 'triljonais' },
      { number: 1000000000, value: 'miljardais' },
      { number: 1000000, value: 'miljonais' },
      { number: 1000, value: 'tūkstošais' },
      { number: 900, value: 'deviņsimtais' },
      { number: 800, value: 'astoņsimtais' },
      { number: 700, value: 'septiņsimtais' },
      { number: 600, value: 'sešsimtais' },
      { number: 500, value: 'piecsimtais' },
      { number: 400, value: 'četrsimtais' },
      { number: 300, value: 'trīssimtais' },
      { number: 200, value: 'divsimtais' },
      { number: 100, value: 'simtais' },
      { number: 90, value: 'deviņdesmitais' },
      { number: 80, value: 'astoņdesmitais' },
      { number: 70, value: 'septiņdesmitais' },
      { number: 60, value: 'sešdesmitais' },
      { number: 50, value: 'piecdesmitais' },
      { number: 40, value: 'četrdesmitais' },
      { number: 30, value: 'trīsdesmitais' },
      { number: 20, value: 'divdesmitais' },
      { number: 19, value: 'deviņpadsmitais' },
      { number: 18, value: 'astoņpadsmitais' },
      { number: 17, value: 'septiņpadsmitais' },
      { number: 16, value: 'sešpadsmitais' },
      { number: 15, value: 'piecpadsmitais' },
      { number: 14, value: 'četrpadsmitais' },
      { number: 13, value: 'trīspadsmitais' },
      { number: 12, value: 'divpadsmitais' },
      { number: 11, value: 'vienpadsmitais' },
      { number: 10, value: 'desmitais' },
      { number: 9, value: 'devītais' },
      { number: 8, value: 'astotais' },
      { number: 7, value: 'septītais' },
      { number: 6, value: 'sestais' },
      { number: 5, value: 'piektais' },
      { number: 4, value: 'ceturtais' },
      { number: 3, value: 'trešais' },
      { number: 2, value: 'otrais' },
      { number: 1, value: 'pirmais' },
      { number: 0, value: 'nulltais' },
    ],
    ignoreOneForWords: [
      'simt',
      'divsimt',
      'trīssimt',
      'četrsimt',
      'piecsimt',
      'sešsimt',
      'septiņsimt',
      'astoņsimt',
      'deviņsimt',
    ],
    exactWordsMapping: [{ number: 100, value: 'simts' }],
    // A round scale ordinal does not repeat «viens» and 2000 … 9000 are one word (tezaurs.lv divtūkstošais).
    ordinalExactWordsMapping: [
      { number: 1000, value: 'tūkstošais' },
      { number: 2000, value: 'divtūkstošais' },
      { number: 3000, value: 'trīstūkstošais' },
      { number: 4000, value: 'četrtūkstošais' },
      { number: 5000, value: 'piectūkstošais' },
      { number: 6000, value: 'seštūkstošais' },
      { number: 7000, value: 'septiņtūkstošais' },
      { number: 8000, value: 'astoņtūkstošais' },
      { number: 9000, value: 'deviņtūkstošais' },
      { number: 1000000, value: 'miljonais' },
      { number: 1000000000, value: 'miljardais' },
      { number: 1000000000000, value: 'triljonais' },
      { number: 1000000000000000, value: 'kvadriljonais' },
    ],
    pluralRule: 'latvian',
    pluralForms: {
      1000: { other: 'tūkstoši' },
      1000000: { other: 'miljoni' },
      1000000000: { other: 'miljardi' },
      1000000000000: { other: 'triljoni' },
      1000000000000000: { other: 'kvadriljoni' },
    },
    fractionDenominatorMapping: {
      1: { singular: 'desmitdaļa', plural: 'desmitdaļas' },
      2: { singular: 'simtdaļa', plural: 'simtdaļas' },
      3: { singular: 'tūkstošdaļa', plural: 'tūkstošdaļas' },
      4: { singular: 'desmittūkstošdaļa', plural: 'desmittūkstošdaļas' },
      5: { singular: 'simttūkstošdaļa', plural: 'simttūkstošdaļas' },
      6: { singular: 'miljondaļa', plural: 'miljondaļas' },
    },
    // decimalStyle 'fraction': viens un piecas desmitdaļas (feminine numerator; singular after …1 except …11).
    fractionReading: {
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'desmitdaļa', zero: 'desmitdaļas', other: 'desmitdaļas' },
        2: { one: 'simtdaļa', zero: 'simtdaļas', other: 'simtdaļas' },
        3: { one: 'tūkstošdaļa', zero: 'tūkstošdaļas', other: 'tūkstošdaļas' },
        4: { one: 'desmittūkstošdaļa', zero: 'desmittūkstošdaļas', other: 'desmittūkstošdaļas' },
        5: { one: 'simttūkstošdaļa', zero: 'simttūkstošdaļas', other: 'simttūkstošdaļas' },
        6: { one: 'miljondaļa', zero: 'miljondaļas', other: 'miljondaļas' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/lv-LV';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'lv-LV');
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

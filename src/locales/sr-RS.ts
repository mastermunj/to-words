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
      name: 'Dinar',
      plural: 'Dinara',
      singular: 'Dinar',
      symbol: 'RSD',
      gender: 'masculine',
      pluralForms: { one: 'Dinar', few: 'Dinara', many: 'Dinara' },
      fractionalUnit: {
        name: 'Para',
        singular: 'Para',
        plural: 'Para',
        symbol: '',
        gender: 'feminine',
        pluralForms: { one: 'Para', few: 'Pare', many: 'Para' },
      },
    },
    texts: {
      and: 'I',
      minus: 'Minus',
      only: 'Samo',
      point: 'Zarez',
    },
    numberWordsMapping: [
      { number: 1000000000000000000000n, value: 'Trilijarda', gender: 'feminine' },
      { number: 1000000000000000000n, value: 'Trilion' },
      { number: 1000000000000000, value: 'Bilijarda', gender: 'feminine' },
      { number: 1000000000000, value: 'Bilion' },
      { number: 1000000000, value: 'Milijarda', gender: 'feminine' },
      { number: 1000000, value: 'Milion' },
      // sr.wikipedia «1000 (број)»: хиљаду; en.wiktionary sh «hiljadu».
      { number: 1000, value: 'Hiljada', withoutOneValue: 'Hiljadu', gender: 'feminine' },
      { number: 900, value: 'Devetsto' },
      { number: 800, value: 'Osamsto' },
      { number: 700, value: 'Sedamsto' },
      { number: 600, value: 'Šeststo' },
      { number: 500, value: 'Petsto' },
      { number: 400, value: 'Četiristo' },
      { number: 300, value: 'Trista' },
      { number: 200, value: 'Dvesta' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Devedeset' },
      { number: 80, value: 'Osamdeset' },
      { number: 70, value: 'Sedamdeset' },
      { number: 60, value: 'Šezdeset' },
      { number: 50, value: 'Pedeset' },
      { number: 40, value: 'Četrdeset' },
      { number: 30, value: 'Trideset' },
      { number: 20, value: 'Dvadeset' },
      { number: 19, value: 'Devetnaest' },
      { number: 18, value: 'Osamnaest' },
      { number: 17, value: 'Sedamnaest' },
      { number: 16, value: 'Šesnaest' },
      { number: 15, value: 'Petnaest' },
      { number: 14, value: 'Četrnaest' },
      { number: 13, value: 'Trinaest' },
      { number: 12, value: 'Dvanaest' },
      { number: 11, value: 'Jedanaest' },
      { number: 10, value: 'Deset' },
      { number: 9, value: 'Devet' },
      { number: 8, value: 'Osam' },
      { number: 7, value: 'Sedam' },
      { number: 6, value: 'Šest' },
      { number: 5, value: 'Pet' },
      { number: 4, value: 'Četiri' },
      { number: 3, value: 'Tri' },
      { number: 2, value: 'Dva', feminineValue: 'Dve' },
      { number: 1, value: 'Jedan', feminineValue: 'Jedna' },
      { number: 0, value: 'Nula' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralRule: 'east-slavic',
    keepOneBeforeInnerScales: true,
    pluralForms: {
      1000: { few: 'Hiljade', many: 'Hiljada' },
      1000000: { few: 'Miliona', many: 'Miliona' },
      1000000000: { few: 'Milijarde', many: 'Milijardi' },
      1000000000000: { few: 'Biliona', many: 'Biliona' },
      1000000000000000: { few: 'Bilijarde', many: 'Bilijardi' },
      1000000000000000000: { few: 'Triliona', many: 'Triliona' },
      1000000000000000000000: { few: 'Trilijarde', many: 'Trilijardi' },
    },
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Trilijarditi' },
      { number: 1000000000000000000n, value: 'Trilioniti' },
      { number: 1000000000000000, value: 'Bilijarditi' },
      { number: 1000000000000, value: 'Bilioniti' },
      { number: 1000000000, value: 'Milijarditi' },
      { number: 1000000, value: 'Milioniti' },
      { number: 1000, value: 'Hiljaditi' },
      { number: 900, value: 'Devetstoti' },
      { number: 800, value: 'Osamstoti' },
      { number: 700, value: 'Sedamstoti' },
      { number: 600, value: 'Šeststoti' },
      { number: 500, value: 'Petstoti' },
      { number: 400, value: 'Četiristoti' },
      { number: 300, value: 'Tristoti' },
      { number: 200, value: 'Dvestoti' },
      { number: 100, value: 'Stoti' },
      { number: 90, value: 'Devedeseti' },
      { number: 80, value: 'Osamdeseti' },
      { number: 70, value: 'Sedamdeseti' },
      { number: 60, value: 'Šezdeseti' },
      { number: 50, value: 'Pedeseti' },
      { number: 40, value: 'Četrdeseti' },
      { number: 30, value: 'Trideseti' },
      { number: 20, value: 'Dvadeseti' },
      { number: 19, value: 'Devetnaesti' },
      { number: 18, value: 'Osamnaesti' },
      { number: 17, value: 'Sedamnaesti' },
      { number: 16, value: 'Šesnaesti' },
      { number: 15, value: 'Petnaesti' },
      { number: 14, value: 'Četrnaesti' },
      { number: 13, value: 'Trinaesti' },
      { number: 12, value: 'Dvanaesti' },
      { number: 11, value: 'Jedanaesti' },
      { number: 10, value: 'Deseti' },
      { number: 9, value: 'Deveti' },
      { number: 8, value: 'Osmi' },
      { number: 7, value: 'Sedmi' },
      { number: 6, value: 'Šesti' },
      { number: 5, value: 'Peti' },
      { number: 4, value: 'Četvrti' },
      { number: 3, value: 'Treći' },
      { number: 2, value: 'Drugi' },
      { number: 1, value: 'Prvi' },
      { number: 0, value: 'Nulti' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Stoti' }],
    ignoreOneForWords: [
      'Sto',
      'Dvesta',
      'Trista',
      'Četiristo',
      'Petsto',
      'Šeststo',
      'Sedamsto',
      'Osamsto',
      'Devetsto',
      'Hiljada',
      'Milion',
      'Milijarda',
      'Bilion',
      'Bilijarda',
      'Trilion',
      'Trilijarda',
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Desetinka', plural: 'Desetinke' },
      2: { singular: 'Stotinka', plural: 'Stotinke' },
      3: { singular: 'Hiljadinka', plural: 'Hiljadinke' },
      4: { singular: 'Desetohiljadinka', plural: 'Desetohiljadinke' },
      5: { singular: 'Stohiljadinka', plural: 'Stohiljadinke' },
      6: { singular: 'Milioninka', plural: 'Milioninke' },
    },
    // decimalStyle 'fraction': feminine numerator, denominator by plural category (jedna stotinka, pet stotinki).
    fractionReading: {
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'Desetinka', few: 'Desetinke', many: 'Desetinki' },
        2: { one: 'Stotinka', few: 'Stotinke', many: 'Stotinki' },
        3: { one: 'Hiljadinka', few: 'Hiljadinke', many: 'Hiljadinki' },
        4: { one: 'Desetohiljadinka', few: 'Desetohiljadinke', many: 'Desetohiljadinki' },
        5: { one: 'Stohiljadinka', few: 'Stohiljadinke', many: 'Stohiljadinki' },
        6: { one: 'Milioninka', few: 'Milioninke', many: 'Milioninki' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/sr-RS';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'sr-RS');
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

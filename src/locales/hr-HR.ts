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
      name: 'Euro',
      plural: 'Eura',
      singular: 'Euro',
      symbol: '€',
      gender: 'masculine',
      pluralForms: { one: 'Euro', few: 'Eura', many: 'Eura' },
      fractionalUnit: {
        name: 'Cent',
        singular: 'Cent',
        plural: 'Centi',
        symbol: 'c',
        gender: 'masculine',
        pluralForms: { one: 'Cent', few: 'Centa', many: 'Centi' },
      },
    },
    texts: {
      and: 'I',
      minus: 'Minus',
      only: 'Samo',
      point: 'Zarez',
    },
    numberWordsMapping: [
      // Hrvatski pravopis (IHJJ) dictionary: trilijun, trilijarda.
      { number: 1000000000000000000000n, value: 'Trilijarda', gender: 'feminine' },
      { number: 1000000000000000000n, value: 'Trilijun' },
      { number: 1000000000000000, value: 'Bilijarda', gender: 'feminine' },
      { number: 1000000000000, value: 'Bilijun' },
      { number: 1000000000, value: 'Milijarda', gender: 'feminine' },
      { number: 1000000, value: 'Milijun' },
      // Hrvatski pravopis 5.4.2: «tisuću tristo jedanaest», «tisuću jedan».
      { number: 1000, value: 'Tisuća', withoutOneValue: 'Tisuću', gender: 'feminine' },
      { number: 900, value: 'Devetsto' },
      { number: 800, value: 'Osamsto' },
      { number: 700, value: 'Sedamsto' },
      // Hrvatski pravopis: šeststo > šesto.
      { number: 600, value: 'Šesto' },
      { number: 500, value: 'Petsto' },
      { number: 400, value: 'Četiristo' },
      { number: 300, value: 'Tristo' },
      { number: 200, value: 'Dvjesto' },
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
      { number: 2, value: 'Dva', feminineValue: 'Dvije' },
      { number: 1, value: 'Jedan', feminineValue: 'Jedna' },
      { number: 0, value: 'Nula' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000: {
        paucal: 'Tisuće',
        plural: 'Tisuća',
      },
      1000000: {
        paucal: 'Milijuna',
        plural: 'Milijuna',
      },
      1000000000: {
        paucal: 'Milijarde',
        plural: 'Milijardi',
      },
      1000000000000: {
        paucal: 'Bilijuna',
        plural: 'Bilijuna',
      },
      1000000000000000: {
        paucal: 'Bilijarde',
        plural: 'Bilijardi',
      },
      1000000000000000000: {
        paucal: 'Trilijuna',
        plural: 'Trilijuna',
      },
      1000000000000000000000: {
        paucal: 'Trilijarde',
        plural: 'Trilijardi',
      },
    },
    pluralRule: 'east-slavic',
    keepOneBeforeInnerScales: true,
    // Hrvatski pravopis 5.4.2: only the last word is ordinal (tisuću tristo jedanaesti).
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Trilijarditi' },
      { number: 1000000000000000000n, value: 'Trilijunti' },
      { number: 1000000000000000, value: 'Bilijarditi' },
      { number: 1000000000000, value: 'Bilijunti' },
      { number: 1000000000, value: 'Milijarditi' },
      { number: 1000000, value: 'Milijunti' },
      { number: 1000, value: 'Tisućiti' },
      { number: 900, value: 'Devetstoti' },
      { number: 800, value: 'Osamstoti' },
      { number: 700, value: 'Sedamstoti' },
      { number: 600, value: 'Šestoti' },
      { number: 500, value: 'Petstoti' },
      { number: 400, value: 'Četiristoti' },
      { number: 300, value: 'Tristoti' },
      { number: 200, value: 'Dvjestoti' },
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
    // A round scale ordinal fuses its multiplier (Hrvatski pravopis «desettisućiti»).
    ordinalScaleStems: {
      1: 'jedan',
      2: 'dvo',
      3: 'tro',
      4: 'četvero',
      5: 'pet',
      6: 'šest',
      7: 'sedam',
      8: 'osam',
      9: 'devet',
      10: 'deset',
      11: 'jedanaest',
      12: 'dvanaest',
      13: 'trinaest',
      14: 'četrnaest',
      15: 'petnaest',
      16: 'šesnaest',
      17: 'sedamnaest',
      18: 'osamnaest',
      19: 'devetnaest',
      20: 'dvadeset',
      30: 'trideset',
      40: 'četrdeset',
      50: 'pedeset',
      60: 'šezdeset',
      70: 'sedamdeset',
      80: 'osamdeset',
      90: 'devedeset',
      100: 'sto',
      200: 'dvjesto',
      300: 'tristo',
      400: 'četiristo',
      500: 'petsto',
      600: 'šesto',
      700: 'sedamsto',
      800: 'osamsto',
      900: 'devetsto',
    },
    ordinalScaleStemsAfterMore: { 2: 'dva', 3: 'tri', 4: 'četiri' },
    ignoreOneForWords: [
      'Sto',
      'Dvjesto',
      'Tristo',
      'Četiristo',
      'Petsto',
      'Šesto',
      'Sedamsto',
      'Osamsto',
      'Devetsto',
      'Tisuća',
      'Milijun',
      'Milijarda',
      'Bilijun',
      'Bilijarda',
      'Trilijun',
      'Trilijarda',
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Desetinka', plural: 'Desetinke' },
      2: { singular: 'Stotinka', plural: 'Stotinke' },
      3: { singular: 'Tisućinka', plural: 'Tisućinke' },
      4: { singular: 'Desettisućinka', plural: 'Desettisućinke' },
      5: { singular: 'Stotisućinka', plural: 'Stotisućinke' },
      6: { singular: 'Milijuntinka', plural: 'Milijuntinke' },
    },
    // decimalStyle 'fraction': feminine numerator, denominator by plural category (jedna stotinka, pet desetinki).
    fractionReading: {
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'Desetinka', few: 'Desetinke', many: 'Desetinki' },
        2: { one: 'Stotinka', few: 'Stotinke', many: 'Stotinki' },
        3: { one: 'Tisućinka', few: 'Tisućinke', many: 'Tisućinki' },
        4: { one: 'Desettisućinka', few: 'Desettisućinke', many: 'Desettisućinki' },
        5: { one: 'Stotisućinka', few: 'Stotisućinke', many: 'Stotisućinki' },
        6: { one: 'Milijuntinka', few: 'Milijuntinke', many: 'Milijuntinki' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/hr-HR';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'hr-HR');
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

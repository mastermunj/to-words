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
      plural: 'Euros',
      singular: 'Euro',
      symbol: '€',
      fractionalUnit: {
        name: 'Cèntim',
        plural: 'Cèntims',
        singular: 'Cèntim',
        symbol: '¢',
      },
    },
    texts: {
      and: 'I',
      minus: 'Menys',
      only: '',
      point: 'Coma',
    },
    numberWordsMapping: [
      // Long scale (CLDR ca): bilió 10¹², trilió 10¹⁸; 10⁹ = mil milions, 10¹⁵ = mil bilions.
      { number: 1000000000000000000n, value: 'Trilió' },
      { number: 1000000000000, value: 'Bilió' },
      { number: 1000000, value: 'Milió' },
      { number: 1000, value: 'Mil' },
      { number: 900, value: 'Nou-Cents', feminineValue: 'Nou-Centes' },
      { number: 800, value: 'Vuit-Cents', feminineValue: 'Vuit-Centes' },
      { number: 700, value: 'Set-Cents', feminineValue: 'Set-Centes' },
      { number: 600, value: 'Sis-Cents', feminineValue: 'Sis-Centes' },
      { number: 500, value: 'Cinc-Cents', feminineValue: 'Cinc-Centes' },
      { number: 400, value: 'Quatre-Cents', feminineValue: 'Quatre-Centes' },
      { number: 300, value: 'Tres-Cents', feminineValue: 'Tres-Centes' },
      { number: 200, value: 'Dos-Cents', feminineValue: 'Dues-Centes' },
      { number: 100, value: 'Cent' },
      // IEC: a hyphen joins tens and units (trenta-dos, quaranta-cinc; vint-i-u from 21 to 29).
      { number: 99, value: 'Noranta-Nou' },
      { number: 98, value: 'Noranta-Vuit' },
      { number: 97, value: 'Noranta-Set' },
      { number: 96, value: 'Noranta-Sis' },
      { number: 95, value: 'Noranta-Cinc' },
      { number: 94, value: 'Noranta-Quatre' },
      { number: 93, value: 'Noranta-Tres' },
      { number: 92, value: 'Noranta-Dos', feminineValue: 'Noranta-Dues' },
      { number: 91, value: 'Noranta-Un', feminineValue: 'Noranta-Una' },
      { number: 90, value: 'Noranta' },
      { number: 89, value: 'Vuitanta-Nou' },
      { number: 88, value: 'Vuitanta-Vuit' },
      { number: 87, value: 'Vuitanta-Set' },
      { number: 86, value: 'Vuitanta-Sis' },
      { number: 85, value: 'Vuitanta-Cinc' },
      { number: 84, value: 'Vuitanta-Quatre' },
      { number: 83, value: 'Vuitanta-Tres' },
      { number: 82, value: 'Vuitanta-Dos', feminineValue: 'Vuitanta-Dues' },
      { number: 81, value: 'Vuitanta-Un', feminineValue: 'Vuitanta-Una' },
      { number: 80, value: 'Vuitanta' },
      { number: 79, value: 'Setanta-Nou' },
      { number: 78, value: 'Setanta-Vuit' },
      { number: 77, value: 'Setanta-Set' },
      { number: 76, value: 'Setanta-Sis' },
      { number: 75, value: 'Setanta-Cinc' },
      { number: 74, value: 'Setanta-Quatre' },
      { number: 73, value: 'Setanta-Tres' },
      { number: 72, value: 'Setanta-Dos', feminineValue: 'Setanta-Dues' },
      { number: 71, value: 'Setanta-Un', feminineValue: 'Setanta-Una' },
      { number: 70, value: 'Setanta' },
      { number: 69, value: 'Seixanta-Nou' },
      { number: 68, value: 'Seixanta-Vuit' },
      { number: 67, value: 'Seixanta-Set' },
      { number: 66, value: 'Seixanta-Sis' },
      { number: 65, value: 'Seixanta-Cinc' },
      { number: 64, value: 'Seixanta-Quatre' },
      { number: 63, value: 'Seixanta-Tres' },
      { number: 62, value: 'Seixanta-Dos', feminineValue: 'Seixanta-Dues' },
      { number: 61, value: 'Seixanta-Un', feminineValue: 'Seixanta-Una' },
      { number: 60, value: 'Seixanta' },
      { number: 59, value: 'Cinquanta-Nou' },
      { number: 58, value: 'Cinquanta-Vuit' },
      { number: 57, value: 'Cinquanta-Set' },
      { number: 56, value: 'Cinquanta-Sis' },
      { number: 55, value: 'Cinquanta-Cinc' },
      { number: 54, value: 'Cinquanta-Quatre' },
      { number: 53, value: 'Cinquanta-Tres' },
      { number: 52, value: 'Cinquanta-Dos', feminineValue: 'Cinquanta-Dues' },
      { number: 51, value: 'Cinquanta-Un', feminineValue: 'Cinquanta-Una' },
      { number: 50, value: 'Cinquanta' },
      { number: 49, value: 'Quaranta-Nou' },
      { number: 48, value: 'Quaranta-Vuit' },
      { number: 47, value: 'Quaranta-Set' },
      { number: 46, value: 'Quaranta-Sis' },
      { number: 45, value: 'Quaranta-Cinc' },
      { number: 44, value: 'Quaranta-Quatre' },
      { number: 43, value: 'Quaranta-Tres' },
      { number: 42, value: 'Quaranta-Dos', feminineValue: 'Quaranta-Dues' },
      { number: 41, value: 'Quaranta-Un', feminineValue: 'Quaranta-Una' },
      { number: 40, value: 'Quaranta' },
      { number: 39, value: 'Trenta-Nou' },
      { number: 38, value: 'Trenta-Vuit' },
      { number: 37, value: 'Trenta-Set' },
      { number: 36, value: 'Trenta-Sis' },
      { number: 35, value: 'Trenta-Cinc' },
      { number: 34, value: 'Trenta-Quatre' },
      { number: 33, value: 'Trenta-Tres' },
      { number: 32, value: 'Trenta-Dos', feminineValue: 'Trenta-Dues' },
      { number: 31, value: 'Trenta-Un', feminineValue: 'Trenta-Una' },
      { number: 30, value: 'Trenta' },
      { number: 29, value: 'Vint-I-Nou' },
      { number: 28, value: 'Vint-I-Vuit' },
      { number: 27, value: 'Vint-I-Set' },
      { number: 26, value: 'Vint-I-Sis' },
      { number: 25, value: 'Vint-I-Cinc' },
      { number: 24, value: 'Vint-I-Quatre' },
      { number: 23, value: 'Vint-I-Tres' },
      { number: 22, value: 'Vint-I-Dos', feminineValue: 'Vint-I-Dues' },
      { number: 21, value: 'Vint-I-Un', feminineValue: 'Vint-I-Una' },
      { number: 20, value: 'Vint' },
      { number: 19, value: 'Dinou' },
      { number: 18, value: 'Divuit' },
      { number: 17, value: 'Disset' },
      { number: 16, value: 'Setze' },
      { number: 15, value: 'Quinze' },
      { number: 14, value: 'Catorze' },
      { number: 13, value: 'Tretze' },
      { number: 12, value: 'Dotze' },
      { number: 11, value: 'Onze' },
      { number: 10, value: 'Deu' },
      { number: 9, value: 'Nou' },
      { number: 8, value: 'Vuit' },
      { number: 7, value: 'Set' },
      { number: 6, value: 'Sis' },
      { number: 5, value: 'Cinc' },
      { number: 4, value: 'Quatre' },
      { number: 3, value: 'Tres' },
      { number: 2, value: 'Dos', feminineValue: 'Dues' },
      { number: 1, value: 'Un', feminineValue: 'Una' },
      { number: 0, value: 'Zero' },
    ],
    ignoreOneForWords: [
      'Cent',
      'Dos-Cents',
      'Tres-Cents',
      'Quatre-Cents',
      'Cinc-Cents',
      'Sis-Cents',
      'Set-Cents',
      'Vuit-Cents',
      'Nou-Cents',
      'Mil',
    ],
    // milió → milions (the accent goes in the plural; library had «Milións»).
    pluralRule: 'one-other',
    pluralForms: {
      1000000: { other: 'Milions' },
      1000000000000: { other: 'Bilions' },
      1000000000000000000: { other: 'Trilions' },
    },
    exactWordsMapping: [
      { number: 100, value: 'Cent' },
      { number: 1000000, value: 'Un Milió' },
      { number: 1000000000000, value: 'Un Bilió' },
    ],
    // en.wiktionary «milió»: milió, bilió … are followed by de / d' unless a smaller number
    // comes between (mil tres-cents quaranta-dos milions d'euros).
    currencyScaleConnector: { word: 'De', minScale: 1000000, elidedWord: "D'" },
    // Only the last word turns ordinal; in compounds 1–4 are unè, dosè, tresè, quatrè (vint-i-unè; GIEC).
    ordinalComposition: 'last-token',
    ordinalWordsMapping: [
      { number: 1000000000000, value: 'Bilionèsim' },
      { number: 1000000, value: 'Milionèsim' },
      { number: 1000, value: 'Mil·lèsim' },
      { number: 900, value: 'Nou-Centèsim' },
      { number: 800, value: 'Vuit-Centèsim' },
      { number: 700, value: 'Set-Centèsim' },
      { number: 600, value: 'Sis-Centèsim' },
      { number: 500, value: 'Cinc-Centèsim' },
      { number: 400, value: 'Quatre-Centèsim' },
      { number: 300, value: 'Tres-Centèsim' },
      { number: 200, value: 'Dos-Centèsim' },
      { number: 100, value: 'Centèsim' },
      { number: 90, value: 'Norantè' },
      { number: 80, value: 'Vuitantè' },
      { number: 70, value: 'Setantè' },
      { number: 60, value: 'Seixantè' },
      { number: 50, value: 'Cinquantè' },
      { number: 40, value: 'Quarantè' },
      { number: 30, value: 'Trentè' },
      { number: 20, value: 'Vintè' },
      { number: 19, value: 'Dinovè' },
      { number: 18, value: 'Divuitè' },
      { number: 17, value: 'Dissetè' },
      { number: 16, value: 'Setzè' },
      { number: 15, value: 'Quinzè' },
      { number: 14, value: 'Catorzè' },
      { number: 13, value: 'Tretzè' },
      { number: 12, value: 'Dotzè' },
      { number: 11, value: 'Onzè' },
      { number: 10, value: 'Desè' },
      { number: 9, value: 'Novè' },
      { number: 8, value: 'Vuitè' },
      { number: 7, value: 'Setè' },
      { number: 6, value: 'Sisè' },
      { number: 5, value: 'Cinquè' },
      { number: 4, value: 'Quart', compoundValue: 'Quatrè' },
      { number: 3, value: 'Tercer', compoundValue: 'Tresè' },
      { number: 2, value: 'Segon', compoundValue: 'Dosè' },
      { number: 1, value: 'Primer', compoundValue: 'Unè' },
      { number: 0, value: 'Zero' },
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Dècim', plural: 'Dècims' },
      2: { singular: 'Centèsim', plural: 'Centèsims' },
      3: { singular: 'Mil·lèsim', plural: 'Mil·lèsims' },
      4: { singular: 'Deu-Mil·lèsim', plural: 'Deu-Mil·lèsims' },
      5: { singular: 'Cent-Mil·lèsim', plural: 'Cent-Mil·lèsims' },
      6: { singular: 'Milionèsim', plural: 'Milionèsims' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ca-ES';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'ca-ES');
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

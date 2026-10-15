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
      name: 'Koruna',
      plural: 'Korun',
      singular: 'Koruna',
      symbol: 'Kč',
      gender: 'feminine',
      pluralForms: { one: 'Koruna', few: 'Koruny', many: 'Korun', other: 'Korun' },
      fractionalUnit: {
        name: 'Haléř',
        singular: 'Haléř',
        plural: 'Haléřů',
        symbol: 'h',
        gender: 'masculine',
        pluralForms: { one: 'Haléř', few: 'Haléře', many: 'Haléřů', other: 'Haléřů' },
      },
    },
    texts: {
      and: 'A',
      minus: 'Mínus',
      only: 'Pouze',
      point: 'Celá',
    },
    numberWordsMapping: [
      // IJP «trilion», «triliarda»: milion bilionů je trilion, miliarda bilionů je triliarda.
      { number: 1000000000000000000000n, value: 'Triliarda', gender: 'feminine' },
      { number: 1000000000000000000n, value: 'Trilion' },
      { number: 1000000000000000, value: 'Biliarda', gender: 'feminine' },
      { number: 1000000000000, value: 'Bilion' },
      { number: 1000000000, value: 'Miliarda', gender: 'feminine' },
      { number: 1000000, value: 'Milion' },
      { number: 1000, value: 'Tisíc', singularValue: 'Tisíc' },
      { number: 900, value: 'Devět Set' },
      { number: 800, value: 'Osm Set' },
      { number: 700, value: 'Sedm Set' },
      { number: 600, value: 'Šest Set' },
      { number: 500, value: 'Pět Set' },
      { number: 400, value: 'Čtyři Sta' },
      { number: 300, value: 'Tři Sta' },
      { number: 200, value: 'Dvě Stě' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Devadesát' },
      { number: 80, value: 'Osmdesát' },
      { number: 70, value: 'Sedmdesát' },
      { number: 60, value: 'Šedesát' },
      { number: 50, value: 'Padesát' },
      { number: 40, value: 'Čtyřicet' },
      { number: 30, value: 'Třicet' },
      { number: 20, value: 'Dvacet' },
      { number: 19, value: 'Devatenáct' },
      { number: 18, value: 'Osmnáct' },
      { number: 17, value: 'Sedmnáct' },
      { number: 16, value: 'Šestnáct' },
      { number: 15, value: 'Patnáct' },
      { number: 14, value: 'Čtrnáct' },
      { number: 13, value: 'Třináct' },
      { number: 12, value: 'Dvanáct' },
      { number: 11, value: 'Jedenáct' },
      { number: 10, value: 'Deset' },
      { number: 9, value: 'Devět' },
      { number: 8, value: 'Osm' },
      { number: 7, value: 'Sedm' },
      { number: 6, value: 'Šest' },
      { number: 5, value: 'Pět' },
      { number: 4, value: 'Čtyři' },
      { number: 3, value: 'Tři' },
      { number: 2, value: 'Dva', feminineValue: 'Dvě' },
      { number: 1, value: 'Jeden', feminineValue: 'Jedna', nonLeadingValue: 'Jedna' },
      { number: 0, value: 'Nula' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000: {
        paucal: 'Tisíce',
        plural: 'Tisíc',
      },
      1000000: {
        paucal: 'Miliony',
        plural: 'Milionů',
      },
      1000000000: {
        paucal: 'Miliardy',
        plural: 'Miliard',
      },
      1000000000000: {
        paucal: 'Biliony',
        plural: 'Bilionů',
      },
      1000000000000000: {
        paucal: 'Biliardy',
        plural: 'Biliard',
      },
      1000000000000000000: {
        paucal: 'Triliony',
        plural: 'Trilionů',
      },
      1000000000000000000000: {
        paucal: 'Triliardy',
        plural: 'Triliard',
      },
    },
    pluralRule: 'polish',
    // IJP: every component of an ordinal is ordinal (tisící devítistý padesátý šestý, stý padesátý).
    ordinalComposition: 'every-component',
    // Multipliers that fuse with an ordinal scale word (stotisící; dvoutisící, dvoumiliontý).
    ordinalScaleStems: {
      2: 'dvou',
      3: 'tří',
      4: 'čtyř',
      5: 'pěti',
      6: 'šesti',
      7: 'sedmi',
      8: 'osmi',
      9: 'devíti',
      10: 'deseti',
      11: 'jedenácti',
      12: 'dvanácti',
      13: 'třinácti',
      14: 'čtrnácti',
      15: 'patnácti',
      16: 'šestnácti',
      17: 'sedmnácti',
      18: 'osmnácti',
      19: 'devatenácti',
      20: 'dvaceti',
      30: 'třiceti',
      40: 'čtyřiceti',
      50: 'padesáti',
      60: 'šedesáti',
      70: 'sedmdesáti',
      80: 'osmdesáti',
      90: 'devadesáti',
      100: 'sto',
    },
    ignoreOneForWords: [
      'Sto',
      'Dvě Stě',
      'Tři Sta',
      'Čtyři Sta',
      'Pět Set',
      'Šest Set',
      'Sedm Set',
      'Osm Set',
      'Devět Set',
      'Tisíc',
      'Milion',
      'Miliarda',
      'Bilion',
      'Biliarda',
      'Trilion',
      'Triliarda',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Triliardtý' },
      { number: 1000000000000000000n, value: 'Triliontý' },
      { number: 1000000000000000, value: 'Biliardtý' },
      { number: 1000000000000, value: 'Biliontý' },
      { number: 1000000000, value: 'Miliardtý' },
      { number: 1000000, value: 'Miliontý' },
      { number: 1000, value: 'Tisící' },
      { number: 900, value: 'Devítistý' },
      { number: 800, value: 'Osmistý' },
      { number: 700, value: 'Sedmistý' },
      { number: 600, value: 'Šestistý' },
      { number: 500, value: 'Pětistý' },
      { number: 400, value: 'Čtyřstý' },
      { number: 300, value: 'Třístý' },
      { number: 200, value: 'Dvoustý' },
      { number: 100, value: 'Stý' },
      { number: 90, value: 'Devadesátý' },
      { number: 80, value: 'Osmdesátý' },
      { number: 70, value: 'Sedmdesátý' },
      { number: 60, value: 'Šedesátý' },
      { number: 50, value: 'Padesátý' },
      { number: 40, value: 'Čtyřicátý' },
      { number: 30, value: 'Třicátý' },
      { number: 20, value: 'Dvacátý' },
      { number: 19, value: 'Devatenáctý' },
      { number: 18, value: 'Osmnáctý' },
      { number: 17, value: 'Sedmnáctý' },
      { number: 16, value: 'Šestnáctý' },
      { number: 15, value: 'Patnáctý' },
      { number: 14, value: 'Čtrnáctý' },
      { number: 13, value: 'Třináctý' },
      { number: 12, value: 'Dvanáctý' },
      { number: 11, value: 'Jedenáctý' },
      { number: 10, value: 'Desátý' },
      { number: 9, value: 'Devátý' },
      { number: 8, value: 'Osmý' },
      { number: 7, value: 'Sedmý' },
      { number: 6, value: 'Šestý' },
      { number: 5, value: 'Pátý' },
      { number: 4, value: 'Čtvrtý' },
      { number: 3, value: 'Třetí' },
      { number: 2, value: 'Druhý' },
      { number: 1, value: 'První' },
      { number: 0, value: 'Nultý' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Stý' }],
    // IJP «Čtení desetinných čísel»; Stotisícina and Miliardtina per cs.wiktionary, Miliontina per SSČ.
    fractionDenominatorMapping: {
      1: { singular: 'Desetina', plural: 'Desetiny' },
      2: { singular: 'Setina', plural: 'Setiny' },
      3: { singular: 'Tisícina', plural: 'Tisíciny' },
      4: { singular: 'Desetitisícina', plural: 'Desetitisíciny' },
      5: { singular: 'Stotisícina', plural: 'Stotisíciny' },
      6: { singular: 'Miliontina', plural: 'Miliontiny' },
      7: { singular: 'Desetimiliontina', plural: 'Desetimiliontiny' },
      8: { singular: 'Stomiliontina', plural: 'Stomiliontiny' },
      9: { singular: 'Miliardtina', plural: 'Miliardtiny' },
      10: { singular: 'Desetimiliardtina', plural: 'Desetimiliardtiny' },
      11: { singular: 'Stomiliardtina', plural: 'Stomiliardtiny' },
      12: { singular: 'Biliontina', plural: 'Biliontiny' },
      13: { singular: 'Desetibiliontina', plural: 'Desetibiliontiny' },
      14: { singular: 'Stobiliontina', plural: 'Stobiliontiny' },
      15: { singular: 'Biliardtina', plural: 'Biliardtiny' },
    },
    fractionReading: {
      // The digit reading «Jeden Celá Pět» is ungrammatical (IJP: jedna celá pět).
      isDefault: true,
      // IJP: nula celá jedna, jedna celá dvě, dvě celé tři, pět celých jedna.
      wholeForms: { zero: 'Celá', one: 'Celá', few: 'Celé', many: 'Celých', other: 'Celých' },
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'Desetina', few: 'Desetiny', many: 'Desetin', other: 'Desetin' },
        2: { one: 'Setina', few: 'Setiny', many: 'Setin', other: 'Setin' },
        3: { one: 'Tisícina', few: 'Tisíciny', many: 'Tisícin', other: 'Tisícin' },
        4: { one: 'Desetitisícina', few: 'Desetitisíciny', many: 'Desetitisícin', other: 'Desetitisícin' },
        5: { one: 'Stotisícina', few: 'Stotisíciny', many: 'Stotisícin', other: 'Stotisícin' },
        6: { one: 'Miliontina', few: 'Miliontiny', many: 'Miliontin', other: 'Miliontin' },
        7: { one: 'Desetimiliontina', few: 'Desetimiliontiny', many: 'Desetimiliontin', other: 'Desetimiliontin' },
        8: { one: 'Stomiliontina', few: 'Stomiliontiny', many: 'Stomiliontin', other: 'Stomiliontin' },
        9: { one: 'Miliardtina', few: 'Miliardtiny', many: 'Miliardtin', other: 'Miliardtin' },
        10: { one: 'Desetimiliardtina', few: 'Desetimiliardtiny', many: 'Desetimiliardtin', other: 'Desetimiliardtin' },
        11: { one: 'Stomiliardtina', few: 'Stomiliardtiny', many: 'Stomiliardtin', other: 'Stomiliardtin' },
        12: { one: 'Biliontina', few: 'Biliontiny', many: 'Biliontin', other: 'Biliontin' },
        13: { one: 'Desetibiliontina', few: 'Desetibiliontiny', many: 'Desetibiliontin', other: 'Desetibiliontin' },
        14: { one: 'Stobiliontina', few: 'Stobiliontiny', many: 'Stobiliontin', other: 'Stobiliontin' },
        15: { one: 'Biliardtina', few: 'Biliardtiny', many: 'Biliardtin', other: 'Biliardtin' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/cs-CZ';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'cs-CZ');
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

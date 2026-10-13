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
      name: 'Leu',
      plural: 'Lei',
      singular: 'Leu',
      symbol: 'lei',
      // «un» before a noun (un leu, un ban; DOOM).
      numberSpecificForms: { 1: 'Un Leu' },
      fractionalUnit: {
        name: 'Ban',
        plural: 'Bani',
        singular: 'Ban',
        symbol: 'b',
        numberSpecificForms: { 1: 'Un Ban' },
      },
    },
    texts: {
      and: 'Și',
      minus: 'Minus',
      only: 'Exact',
      point: 'Virgulă',
    },
    numberWordsMapping: [
      // Long scale (DOOM; CLDR ro): bilion 10¹², biliard 10¹⁵, trilion 10¹⁸. These nouns are neuter:
      // un milion, două milioane, douăzeci și unu de milioane (feminine forms except 1).
      {
        number: 1000000000000000000n,
        value: 'Trilion',
        gender: 'feminine',
        multiplierForms: { 1: 'Un' },
        multiplierOverrides: { 1: 'Unu' },
      },
      {
        number: 1000000000000000,
        value: 'Biliard',
        gender: 'feminine',
        multiplierForms: { 1: 'Un' },
        multiplierOverrides: { 1: 'Unu' },
      },
      {
        number: 1000000000000,
        value: 'Bilion',
        gender: 'feminine',
        multiplierForms: { 1: 'Un' },
        multiplierOverrides: { 1: 'Unu' },
      },
      {
        number: 1000000000,
        value: 'Miliard',
        gender: 'feminine',
        multiplierForms: { 1: 'Un' },
        multiplierOverrides: { 1: 'Unu' },
      },
      {
        number: 1000000,
        value: 'Milion',
        gender: 'feminine',
        multiplierForms: { 1: 'Un' },
        multiplierOverrides: { 1: 'Unu' },
      },
      // mie is feminine: două mii, douăzeci și una de mii.
      { number: 1000, value: 'Mii', singularValue: 'O Mie', gender: 'feminine' },
      { number: 900, value: 'Nouă Sute' },
      { number: 800, value: 'Opt Sute' },
      { number: 700, value: 'Șapte Sute' },
      { number: 600, value: 'Șase Sute' },
      { number: 500, value: 'Cinci Sute' },
      { number: 400, value: 'Patru Sute' },
      { number: 300, value: 'Trei Sute' },
      { number: 200, value: 'Două Sute' },
      { number: 100, value: 'Sută', singularValue: 'O Sută' },
      { number: 90, value: 'Nouăzeci' },
      { number: 80, value: 'Optzeci' },
      { number: 70, value: 'Șaptezeci' },
      { number: 60, value: 'Șaizeci' },
      { number: 50, value: 'Cincizeci' },
      { number: 40, value: 'Patruzeci' },
      { number: 30, value: 'Treizeci' },
      { number: 20, value: 'Douăzeci' },
      { number: 19, value: 'Nouăsprezece' },
      { number: 18, value: 'Optsprezece' },
      { number: 17, value: 'Șaptesprezece' },
      { number: 16, value: 'Șaisprezece' },
      { number: 15, value: 'Cincisprezece' },
      { number: 14, value: 'Paisprezece' },
      { number: 13, value: 'Treisprezece' },
      { number: 12, value: 'Doisprezece', feminineValue: 'Douăsprezece' },
      { number: 11, value: 'Unsprezece' },
      { number: 10, value: 'Zece' },
      { number: 9, value: 'Nouă' },
      { number: 8, value: 'Opt' },
      { number: 7, value: 'Șapte' },
      { number: 6, value: 'Șase' },
      { number: 5, value: 'Cinci' },
      { number: 4, value: 'Patru' },
      { number: 3, value: 'Trei' },
      // Counting forms are masculine (doi, doisprezece); feminine on request and before mii/sute.
      { number: 2, value: 'Doi', feminineValue: 'Două' },
      { number: 1, value: 'Unu', feminineValue: 'Una' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'O Sută' },
      { number: 1000, value: 'O Mie' },
    ],
    ignoreOneForWords: [
      'Sută',
      'Mii',
      'Nouă Sute',
      'Opt Sute',
      'Șapte Sute',
      'Șase Sute',
      'Cinci Sute',
      'Patru Sute',
      'Trei Sute',
      'Două Sute',
    ],
    pluralRule: 'one-other',
    pluralForms: {
      1000000: { other: 'Milioane' },
      1000000000: { other: 'Miliarde' },
      1000000000000: { other: 'Bilioane' },
      1000000000000000: { other: 'Biliarde' },
      1000000000000000000: { other: 'Trilioane' },
    },
    // «și» only between tens and units (douăzeci și unu; o sută unu).
    splitWord: 'Și',
    noSplitWordAfter: [
      'Sută',
      'Două Sute',
      'Trei Sute',
      'Patru Sute',
      'Cinci Sute',
      'Șase Sute',
      'Șapte Sute',
      'Opt Sute',
      'Nouă Sute',
      'Mii',
      'Milion',
      'Miliard',
      'Bilion',
      'Biliard',
      'Trilion',
    ],
    // «de» after numbers ending in 00 or 20–99 (douăzeci de mii, o sută de lei; DOOM).
    nounConnector: 'De',
    // Ordinal: «al» + cardinal with -lea on the last word (al douăzeci și unulea, al două sutelea).
    ordinalComposition: 'last-token',
    ordinalCompoundPrefix: 'Al',
    ordinalLastTokenForms: {
      Unu: 'Unulea',
      Doi: 'Doilea',
      Două: 'Doilea',
      Trei: 'Treilea',
      Patru: 'Patrulea',
      Cinci: 'Cincilea',
      Șase: 'Șaselea',
      Șapte: 'Șaptelea',
      Opt: 'Optulea',
      Nouă: 'Nouălea',
      Zece: 'Zecelea',
      Unsprezece: 'Unsprezecelea',
      Doisprezece: 'Doisprezecelea',
      Treisprezece: 'Treisprezecelea',
      Paisprezece: 'Paisprezecelea',
      Cincisprezece: 'Cincisprezecelea',
      Șaisprezece: 'Șaisprezecelea',
      Șaptesprezece: 'Șaptesprezecelea',
      Optsprezece: 'Optsprezecelea',
      Nouăsprezece: 'Nouăsprezecelea',
      Douăzeci: 'Douăzecilea',
      Treizeci: 'Treizecilea',
      Patruzeci: 'Patruzecilea',
      Cincizeci: 'Cincizecilea',
      Șaizeci: 'Șaizecilea',
      Șaptezeci: 'Șaptezecilea',
      Optzeci: 'Optzecilea',
      Nouăzeci: 'Nouăzecilea',
      Sută: 'Sutălea',
      Sute: 'Sutelea',
      Mie: 'Miilea',
      Mii: 'Miilea',
      Milion: 'Milionulea',
      Milioane: 'Milioanelea',
      Miliard: 'Miliardulea',
      Miliarde: 'Miliardelea',
      Bilion: 'Bilionulea',
      Bilioane: 'Bilioanelea',
      Biliard: 'Biliardulea',
      Biliarde: 'Biliardelea',
      Trilion: 'Trilionulea',
      Trilioane: 'Trilioanelea',
    },
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Al Biliardulea' },
      { number: 1000000000000, value: 'Al Bilionulea' },
      { number: 1000000000, value: 'Al Miliardulea' },
      { number: 1000000, value: 'Al Milionulea' },
      { number: 1000, value: 'Al Miilea' },
      { number: 900, value: 'Al Nouă Sutelea' },
      { number: 800, value: 'Al Opt Sutelea' },
      { number: 700, value: 'Al Șapte Sutelea' },
      { number: 600, value: 'Al Șase Sutelea' },
      { number: 500, value: 'Al Cinci Sutelea' },
      { number: 400, value: 'Al Patru Sutelea' },
      { number: 300, value: 'Al Trei Sutelea' },
      { number: 200, value: 'Al Două Sutelea' },
      { number: 100, value: 'Al Sutălea' },
      { number: 90, value: 'Al Nouăzecilea' },
      { number: 80, value: 'Al Optzecilea' },
      { number: 70, value: 'Al Șaptezecilea' },
      { number: 60, value: 'Al Șaizecilea' },
      { number: 50, value: 'Al Cincizecilea' },
      { number: 40, value: 'Al Patruzecilea' },
      { number: 30, value: 'Al Treizecilea' },
      { number: 20, value: 'Al Douăzecilea' },
      { number: 19, value: 'Al Nouăsprezecelea' },
      { number: 18, value: 'Al Optsprezecelea' },
      { number: 17, value: 'Al Șaptesprezecelea' },
      { number: 16, value: 'Al Șaisprezecelea' },
      { number: 15, value: 'Al Cincisprezecelea' },
      { number: 14, value: 'Al Paisprezecelea' },
      { number: 13, value: 'Al Treisprezecelea' },
      { number: 12, value: 'Al Doisprezecelea' },
      { number: 11, value: 'Al Unsprezecelea' },
      { number: 10, value: 'Al Zecelea' },
      { number: 9, value: 'Al Nouălea' },
      { number: 8, value: 'Al Optulea' },
      { number: 7, value: 'Al Șaptelea' },
      { number: 6, value: 'Al Șaselea' },
      { number: 5, value: 'Al Cincilea' },
      { number: 4, value: 'Al Patrulea' },
      { number: 3, value: 'Al Treilea' },
      { number: 2, value: 'Al Doilea' },
      { number: 1, value: 'Primul' },
      { number: 0, value: 'Al Zerolea' },
    ],
    ordinalExactWordsMapping: [
      { number: 100, value: 'Al O Sutălea' },
      { number: 1000, value: 'Al O Miilea' },
      { number: 1000000, value: 'Al Un Milionulea' },
      { number: 1000000000, value: 'Al Un Miliardulea' },
      { number: 1000000000000, value: 'Al Un Bilionulea' },
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Zecime', plural: 'Zecimi' },
      2: { singular: 'Sutime', plural: 'Sutimi' },
      3: { singular: 'Miime', plural: 'Miimi' },
      4: { singular: 'Zecime de Miime', plural: 'Zecimi de Miime' },
      5: { singular: 'Sutime de Miime', plural: 'Sutimi de Miime' },
      6: { singular: 'Milionime', plural: 'Milionime' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ro-RO';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'ro-RO');
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

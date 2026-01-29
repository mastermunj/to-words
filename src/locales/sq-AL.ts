import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Lek',
      plural: 'Lekë',
      singular: 'Lek',
      symbol: 'L',
      fractionalUnit: {
        name: 'Qindarkë',
        plural: 'Qindarka',
        singular: 'Qindarkë',
        symbol: 'q',
      },
    },
    texts: {
      and: 'E',
      minus: 'Minus',
      only: 'Vetëm',
      point: 'Presje',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kuadrilion' },
      { number: 1000000000000, value: 'Trilion' },
      { number: 1000000000, value: 'Miliard' },
      { number: 1000000, value: 'Milion' },
      { number: 1000, value: 'Mijë' },
      { number: 900, value: 'Nëntëqind' },
      { number: 800, value: 'Tetëqind' },
      { number: 700, value: 'Shtatëqind' },
      { number: 600, value: 'Gjashtëqind' },
      { number: 500, value: 'Pesëqind' },
      { number: 400, value: 'Katërqind' },
      { number: 300, value: 'Treqind' },
      { number: 200, value: 'Dyqind' },
      { number: 100, value: 'Njëqind' },
      { number: 90, value: 'Nëntëdhjetë' },
      { number: 80, value: 'Tetëdhjetë' },
      { number: 70, value: 'Shtatëdhjetë' },
      { number: 60, value: 'Gjashtëdhjetë' },
      { number: 50, value: 'Pesëdhjetë' },
      { number: 40, value: 'Dyzet' },
      { number: 30, value: 'Tridhjetë' },
      { number: 20, value: 'Njëzet' },
      { number: 19, value: 'Nëntëmbëdhjetë' },
      { number: 18, value: 'Tetëmbëdhjetë' },
      { number: 17, value: 'Shtatëmbëdhjetë' },
      { number: 16, value: 'Gjashtëmbëdhjetë' },
      { number: 15, value: 'Pesëmbëdhjetë' },
      { number: 14, value: 'Katërmbëdhjetë' },
      { number: 13, value: 'Trembëdhjetë' },
      { number: 12, value: 'Dymbëdhjetë' },
      { number: 11, value: 'Njëmbëdhjetë' },
      { number: 10, value: 'Dhjetë' },
      { number: 9, value: 'Nëntë' },
      { number: 8, value: 'Tetë' },
      { number: 7, value: 'Shtatë' },
      { number: 6, value: 'Gjashtë' },
      { number: 5, value: 'Pesë' },
      { number: 4, value: 'Katër' },
      { number: 3, value: 'Tre' },
      { number: 2, value: 'Dy' },
      { number: 1, value: 'Një' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'Njëqind' },
      { number: 1000, value: 'Një Mijë' },
      { number: 1000000, value: 'Një Milion' },
      { number: 1000000000, value: 'Një Miliard' },
    ],
    ignoreOneForWords: [
      'Njëqind',
      'Dyqind',
      'Treqind',
      'Katërqind',
      'Pesëqind',
      'Gjashtëqind',
      'Shtatëqind',
      'Tetëqind',
      'Nëntëqind',
    ],
    pluralForms: {
      1000: {
        plural: 'Mijë',
      },
      1000000: {
        plural: 'Milionë',
      },
      1000000000: {
        plural: 'Miliardë',
      },
      1000000000000: {
        plural: 'Trilionë',
      },
      1000000000000000: {
        plural: 'Kuadrilionë',
      },
    },
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'I Kuadrilionti' },
      { number: 1000000000000, value: 'I Trilionti' },
      { number: 1000000000, value: 'I Miliardti' },
      { number: 1000000, value: 'I Milionti' },
      { number: 1000, value: 'I Mijëti' },
      { number: 900, value: 'I Nëntëqindti' },
      { number: 800, value: 'I Tetëqindti' },
      { number: 700, value: 'I Shtatëqindti' },
      { number: 600, value: 'I Gjashtëqindti' },
      { number: 500, value: 'I Pesëqindti' },
      { number: 400, value: 'I Katërqindti' },
      { number: 300, value: 'I Treqindti' },
      { number: 200, value: 'I Dyqindti' },
      { number: 100, value: 'I Njëqindti' },
      { number: 90, value: 'I Nëntëdhjetëti' },
      { number: 80, value: 'I Tetëdhjetëti' },
      { number: 70, value: 'I Shtatëdhjetëti' },
      { number: 60, value: 'I Gjashtëdhjetëti' },
      { number: 50, value: 'I Pesëdhjetëti' },
      { number: 40, value: 'I Dyzetti' },
      { number: 30, value: 'I Tridhjetëti' },
      { number: 20, value: 'I Njëzetti' },
      { number: 19, value: 'I Nëntëmbëdhjetëti' },
      { number: 18, value: 'I Tetëmbëdhjetëti' },
      { number: 17, value: 'I Shtatëmbëdhjetëti' },
      { number: 16, value: 'I Gjashtëmbëdhjetëti' },
      { number: 15, value: 'I Pesëmbëdhjetëti' },
      { number: 14, value: 'I Katërmbëdhjetëti' },
      { number: 13, value: 'I Trembëdhjetëti' },
      { number: 12, value: 'I Dymbëdhjetëti' },
      { number: 11, value: 'I Njëmbëdhjetëti' },
      { number: 10, value: 'I Dhjetëti' },
      { number: 9, value: 'I Nëntë' },
      { number: 8, value: 'I Tetë' },
      { number: 7, value: 'I Shtatë' },
      { number: 6, value: 'I Gjashtë' },
      { number: 5, value: 'I Pestë' },
      { number: 4, value: 'I Katërt' },
      { number: 3, value: 'I Tretë' },
      { number: 2, value: 'I Dytë' },
      { number: 1, value: 'I Parë' },
      { number: 0, value: 'I Zeroti' },
    ],
    ordinalExactWordsMapping: [
      { number: 100, value: 'I Njëqindti' },
      { number: 1000, value: 'I Mijëti' },
      { number: 1000000, value: 'I Milionti' },
      { number: 1000000000, value: 'I Miliardti' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/sq-AL';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

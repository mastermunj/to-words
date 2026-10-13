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
      name: 'Złoty',
      plural: 'Złotych',
      singular: 'Złoty',
      symbol: 'zł',
      gender: 'masculine',
      pluralForms: { one: 'Złoty', few: 'Złote', many: 'Złotych' },
      fractionalUnit: {
        name: 'Grosz',
        singular: 'Grosz',
        plural: 'Groszy',
        symbol: 'gr',
        gender: 'masculine',
        pluralForms: { one: 'Grosz', few: 'Grosze', many: 'Groszy' },
      },
    },
    texts: {
      and: 'I',
      minus: 'Minus',
      only: 'Tylko',
      point: 'Przecinek',
    },
    numberWordsMapping: [
      { number: 1000000000000000000000n, value: 'Tryliard' },
      { number: 1000000000000000000n, value: 'Trylion' },
      { number: 1000000000000000, value: 'Biliard' },
      { number: 1000000000000, value: 'Bilion' },
      { number: 1000000000, value: 'Miliard' },
      { number: 1000000, value: 'Milion' },
      { number: 1000, value: 'Tysiąc', singularValue: 'Tysiąc' },
      { number: 900, value: 'Dziewięćset' },
      { number: 800, value: 'Osiemset' },
      { number: 700, value: 'Siedemset' },
      { number: 600, value: 'Sześćset' },
      { number: 500, value: 'Pięćset' },
      { number: 400, value: 'Czterysta' },
      { number: 300, value: 'Trzysta' },
      { number: 200, value: 'Dwieście' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Dziewięćdziesiąt' },
      { number: 80, value: 'Osiemdziesiąt' },
      { number: 70, value: 'Siedemdziesiąt' },
      { number: 60, value: 'Sześćdziesiąt' },
      { number: 50, value: 'Pięćdziesiąt' },
      { number: 40, value: 'Czterdzieści' },
      { number: 30, value: 'Trzydzieści' },
      { number: 20, value: 'Dwadzieścia' },
      { number: 19, value: 'Dziewiętnaście' },
      { number: 18, value: 'Osiemnaście' },
      { number: 17, value: 'Siedemnaście' },
      { number: 16, value: 'Szesnaście' },
      { number: 15, value: 'Piętnaście' },
      { number: 14, value: 'Czternaście' },
      { number: 13, value: 'Trzynaście' },
      { number: 12, value: 'Dwanaście' },
      { number: 11, value: 'Jedenaście' },
      { number: 10, value: 'Dziesięć' },
      { number: 9, value: 'Dziewięć' },
      { number: 8, value: 'Osiem' },
      { number: 7, value: 'Siedem' },
      { number: 6, value: 'Sześć' },
      { number: 5, value: 'Pięć' },
      { number: 4, value: 'Cztery' },
      { number: 3, value: 'Trzy' },
      { number: 2, value: 'Dwa', feminineValue: 'Dwie' },
      { number: 1, value: 'Jeden', feminineValue: 'Jedna' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000: {
        paucal: 'Tysiące',
        plural: 'Tysięcy',
      },
      1000000: {
        paucal: 'Miliony',
        plural: 'Milionów',
      },
      1000000000: {
        paucal: 'Miliardy',
        plural: 'Miliardów',
      },
      1000000000000: {
        paucal: 'Biliony',
        plural: 'Bilionów',
      },
      1000000000000000: {
        paucal: 'Biliardy',
        plural: 'Biliardów',
      },
      1000000000000000000: {
        paucal: 'Tryliony',
        plural: 'Trylionów',
      },
      1000000000000000000000: {
        paucal: 'Tryliardy',
        plural: 'Tryliardów',
      },
    },
    pluralRule: 'polish',
    ordinalTensAndUnits: true,
    // pl.wiktionary «jeden»: w złożeniach „dwadzieścia jeden” itp. nieodmienne.
    invariableOneInCompounds: true,
    ignoreOneForWords: [
      'Sto',
      'Dwieście',
      'Trzysta',
      'Czterysta',
      'Pięćset',
      'Sześćset',
      'Siedemset',
      'Osiemset',
      'Dziewięćset',
      'Tysiąc',
      'Milion',
      'Miliard',
      'Bilion',
      'Biliard',
      'Trylion',
      'Tryliard',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Tryliardowy' },
      { number: 1000000000000000000n, value: 'Trylionowy' },
      { number: 1000000000000000, value: 'Biliardowy' },
      { number: 1000000000000, value: 'Bilionowy' },
      { number: 1000000000, value: 'Miliardowy' },
      { number: 1000000, value: 'Milionowy' },
      { number: 1000, value: 'Tysięczny' },
      { number: 900, value: 'Dziewięćsetny' },
      { number: 800, value: 'Osiemsetny' },
      { number: 700, value: 'Siedemsetny' },
      { number: 600, value: 'Sześćsetny' },
      { number: 500, value: 'Pięćsetny' },
      { number: 400, value: 'Czterechsetny' },
      { number: 300, value: 'Trzechsetny' },
      { number: 200, value: 'Dwusetny' },
      { number: 100, value: 'Setny' },
      { number: 90, value: 'Dziewięćdziesiąty' },
      { number: 80, value: 'Osiemdziesiąty' },
      { number: 70, value: 'Siedemdziesiąty' },
      { number: 60, value: 'Sześćdziesiąty' },
      { number: 50, value: 'Pięćdziesiąty' },
      { number: 40, value: 'Czterdziesty' },
      { number: 30, value: 'Trzydziesty' },
      { number: 20, value: 'Dwudziesty' },
      { number: 19, value: 'Dziewiętnasty' },
      { number: 18, value: 'Osiemnasty' },
      { number: 17, value: 'Siedemnasty' },
      { number: 16, value: 'Szesnasty' },
      { number: 15, value: 'Piętnasty' },
      { number: 14, value: 'Czternasty' },
      { number: 13, value: 'Trzynasty' },
      { number: 12, value: 'Dwunasty' },
      { number: 11, value: 'Jedenasty' },
      { number: 10, value: 'Dziesiąty' },
      { number: 9, value: 'Dziewiąty' },
      { number: 8, value: 'Ósmy' },
      { number: 7, value: 'Siódmy' },
      { number: 6, value: 'Szósty' },
      { number: 5, value: 'Piąty' },
      { number: 4, value: 'Czwarty' },
      { number: 3, value: 'Trzeci' },
      { number: 2, value: 'Drugi' },
      { number: 1, value: 'Pierwszy' },
      { number: 0, value: 'Zerowy' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Setny' }],
    ordinalScaleStems: {
      900: 'dziewięćset',
      800: 'osiemset',
      700: 'siedemset',
      600: 'sześćset',
      500: 'pięćset',
      400: 'czterystu',
      300: 'trzystu',
      200: 'dwustu',
      100: 'stu',
      90: 'dziewięćdziesięcio',
      80: 'osiemdziesięcio',
      70: 'siedemdziesięcio',
      60: 'sześćdziesięcio',
      50: 'pięćdziesięcio',
      40: 'czterdziesto',
      30: 'trzydziesto',
      20: 'dwudziesto',
      19: 'dziewiętnasto',
      18: 'osiemnasto',
      17: 'siedemnasto',
      16: 'szesnasto',
      15: 'piętnasto',
      14: 'czternasto',
      13: 'trzynasto',
      12: 'dwunasto',
      11: 'jedenasto',
      10: 'dziesięcio',
      9: 'dziewięcio',
      8: 'ośmio',
      7: 'siedmio',
      6: 'sześcio',
      5: 'pięcio',
      4: 'cztero',
      3: 'trzy',
      2: 'dwu',
      1: 'jedno',
    },
    fractionDenominatorMapping: {
      1: { singular: 'Dziesiąta', plural: 'Dziesiąte' },
      2: { singular: 'Setna', plural: 'Setne' },
      3: { singular: 'Tysięczna', plural: 'Tysięczne' },
      4: { singular: 'Dziesięciotysięczna', plural: 'Dziesięciotysięczne' },
      5: { singular: 'Stutysięczna', plural: 'Stutysięczne' },
      6: { singular: 'Milionowa', plural: 'Milionowe' },
      7: { singular: 'Dziesięciomilionowa', plural: 'Dziesięciomilionowe' },
      8: { singular: 'Stumilionowa', plural: 'Stumilionowe' },
      9: { singular: 'Miliardowa', plural: 'Miliardowe' },
      10: { singular: 'Dziesięciomiliardowa', plural: 'Dziesięciomiliardowe' },
      11: { singular: 'Stumiliardowa', plural: 'Stumiliardowe' },
      12: { singular: 'Bilionowa', plural: 'Bilionowe' },
      13: { singular: 'Dziesięciobilionowa', plural: 'Dziesięciobilionowe' },
      14: { singular: 'Stubilionowa', plural: 'Stubilionowe' },
      15: { singular: 'Biliardowa', plural: 'Biliardowe' },
    },
    fractionReading: {
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'Dziesiąta', few: 'Dziesiąte', many: 'Dziesiątych', other: 'Dziesiątych' },
        2: { one: 'Setna', few: 'Setne', many: 'Setnych', other: 'Setnych' },
        3: { one: 'Tysięczna', few: 'Tysięczne', many: 'Tysięcznych', other: 'Tysięcznych' },
        4: {
          one: 'Dziesięciotysięczna',
          few: 'Dziesięciotysięczne',
          many: 'Dziesięciotysięcznych',
          other: 'Dziesięciotysięcznych',
        },
        5: { one: 'Stutysięczna', few: 'Stutysięczne', many: 'Stutysięcznych', other: 'Stutysięcznych' },
        6: { one: 'Milionowa', few: 'Milionowe', many: 'Milionowych', other: 'Milionowych' },
        7: {
          one: 'Dziesięciomilionowa',
          few: 'Dziesięciomilionowe',
          many: 'Dziesięciomilionowych',
          other: 'Dziesięciomilionowych',
        },
        8: { one: 'Stumilionowa', few: 'Stumilionowe', many: 'Stumilionowych', other: 'Stumilionowych' },
        9: { one: 'Miliardowa', few: 'Miliardowe', many: 'Miliardowych', other: 'Miliardowych' },
        10: {
          one: 'Dziesięciomiliardowa',
          few: 'Dziesięciomiliardowe',
          many: 'Dziesięciomiliardowych',
          other: 'Dziesięciomiliardowych',
        },
        11: { one: 'Stumiliardowa', few: 'Stumiliardowe', many: 'Stumiliardowych', other: 'Stumiliardowych' },
        12: { one: 'Bilionowa', few: 'Bilionowe', many: 'Bilionowych', other: 'Bilionowych' },
        13: {
          one: 'Dziesięciobilionowa',
          few: 'Dziesięciobilionowe',
          many: 'Dziesięciobilionowych',
          other: 'Dziesięciobilionowych',
        },
        14: { one: 'Stubilionowa', few: 'Stubilionowe', many: 'Stubilionowych', other: 'Stubilionowych' },
        15: { one: 'Biliardowa', few: 'Biliardowe', many: 'Biliardowych', other: 'Biliardowych' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/pl-PL';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'pl-PL');
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

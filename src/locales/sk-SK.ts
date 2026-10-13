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
      plural: 'Eur',
      singular: 'Euro',
      symbol: '€',
      // Euro is neuter (Jedno Euro, Dve Eurá); the gender option never changes the amount.
      gender: 'masculine',
      numberSpecificForms: { 1: 'Jedno Euro', 2: 'Dve Eurá' },
      pluralForms: { one: 'Euro', few: 'Eurá', many: 'Eur', other: 'Eur' },
      fractionalUnit: {
        name: 'Cent',
        singular: 'Cent',
        plural: 'Centov',
        symbol: 'c',
        gender: 'masculine',
        pluralForms: { one: 'Cent', few: 'Centy', many: 'Centov', other: 'Centov' },
      },
    },
    texts: {
      and: 'A',
      minus: 'Mínus',
      only: 'Len',
      point: 'Celá',
    },
    numberWordsMapping: [
      // sk.wikipedia «Trilión», «Triliarda»: long scale, 10^18 and 10^21.
      { number: 1000000000000000000000n, value: 'Triliarda', multiplierForms: { 2: 'Dve' } },
      { number: 1000000000000000000n, value: 'Trilión' },
      { number: 1000000000000000, value: 'Biliarda', multiplierForms: { 2: 'Dve' } },
      { number: 1000000000000, value: 'Bilión' },
      { number: 1000000000, value: 'Miliarda', multiplierForms: { 2: 'Dve' } },
      { number: 1000000, value: 'Milión' },
      { number: 1000, value: 'Tisíc', singularValue: 'Tisíc', multiplierForms: { 2: 'Dve' } },
      { number: 900, value: 'Deväťsto' },
      { number: 800, value: 'Osemsto' },
      { number: 700, value: 'Sedemsto' },
      { number: 600, value: 'Šesťsto' },
      { number: 500, value: 'Päťsto' },
      { number: 400, value: 'Štyristo' },
      { number: 300, value: 'Tristo' },
      { number: 200, value: 'Dvesto' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Deväťdesiat' },
      { number: 80, value: 'Osemdesiat' },
      { number: 70, value: 'Sedemdesiat' },
      { number: 60, value: 'Šesťdesiat' },
      { number: 50, value: 'Päťdesiat' },
      { number: 40, value: 'Štyridsať' },
      { number: 30, value: 'Tridsať' },
      { number: 20, value: 'Dvadsať' },
      { number: 19, value: 'Devätnásť' },
      { number: 18, value: 'Osemnásť' },
      { number: 17, value: 'Sedemnásť' },
      { number: 16, value: 'Šestnásť' },
      { number: 15, value: 'Pätnásť' },
      { number: 14, value: 'Štrnásť' },
      { number: 13, value: 'Trinásť' },
      { number: 12, value: 'Dvanásť' },
      { number: 11, value: 'Jedenásť' },
      { number: 10, value: 'Desať' },
      { number: 9, value: 'Deväť' },
      { number: 8, value: 'Osem' },
      { number: 7, value: 'Sedem' },
      { number: 6, value: 'Šesť' },
      { number: 5, value: 'Päť' },
      { number: 4, value: 'Štyri' },
      { number: 3, value: 'Tri' },
      { number: 2, value: 'Dva', feminineValue: 'Dve' },
      { number: 1, value: 'Jeden', feminineValue: 'Jedna' },
      { number: 0, value: 'Nula' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000: {
        paucal: 'Tisíc',
        plural: 'Tisíc',
      },
      1000000: {
        paucal: 'Milióny',
        plural: 'Miliónov',
      },
      1000000000: {
        paucal: 'Miliardy',
        plural: 'Miliárd',
      },
      1000000000000: {
        paucal: 'Bilióny',
        plural: 'Biliónov',
      },
      1000000000000000: {
        paucal: 'Biliardy',
        plural: 'Biliárd',
      },
      1000000000000000000: {
        paucal: 'Trilióny',
        plural: 'Triliónov',
      },
      1000000000000000000000: {
        paucal: 'Triliardy',
        plural: 'Triliárd',
      },
    },
    pluralRule: 'west-slavic',
    // PSP: one word below a million (stodvadsaťpäť), separate millions; ordinals «stodvadsiaty štvrtý».
    wordJoining: { compoundBelow: 1000000, separateOrdinalUnit: true, separateAnd: true },
    ordinalTensAndUnits: true,
    // A compound takes the genitive plural, so its 1 and 2 keep base forms (dvadsaťjeden, dvadsaťdva).
    invariableOneInCompounds: true,
    invariableTwoInCompounds: true,
    ignoreOneForWords: [
      'Sto',
      'Dvesto',
      'Tristo',
      'Štyristo',
      'Päťsto',
      'Šesťsto',
      'Sedemsto',
      'Osemsto',
      'Deväťsto',
      'Tisíc',
      'Milión',
      'Miliarda',
      'Bilión',
      'Biliarda',
      'Trilión',
      'Triliarda',
    ],
    // sk.wikipedia number articles and en.wiktionary (citing the JÚĽŠ portal): miliónty, dvojstý … päťstý,
    // štyridsiaty. -ónty by the rhythmic law (PSP «milióntej»).
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Triliardtý' },
      { number: 1000000000000000000n, value: 'Triliónty' },
      { number: 1000000000000000, value: 'Biliardtý' },
      { number: 1000000000000, value: 'Biliónty' },
      { number: 1000000000, value: 'Miliardtý' },
      { number: 1000000, value: 'Miliónty' },
      { number: 1000, value: 'Tisíci' },
      { number: 900, value: 'Deväťstý' },
      { number: 800, value: 'Osemstý' },
      { number: 700, value: 'Sedemstý' },
      { number: 600, value: 'Šesťstý' },
      { number: 500, value: 'Päťstý' },
      { number: 400, value: 'Štvorstý' },
      { number: 300, value: 'Trojstý' },
      { number: 200, value: 'Dvojstý' },
      { number: 100, value: 'Stý' },
      { number: 90, value: 'Deväťdesiaty' },
      { number: 80, value: 'Osemdesiaty' },
      { number: 70, value: 'Sedemdesiaty' },
      { number: 60, value: 'Šesťdesiaty' },
      { number: 50, value: 'Päťdesiaty' },
      { number: 40, value: 'Štyridsiaty' },
      { number: 30, value: 'Tridsiaty' },
      { number: 20, value: 'Dvadsiaty' },
      { number: 19, value: 'Devätnásty' },
      { number: 18, value: 'Osemnásty' },
      { number: 17, value: 'Sedemnásty' },
      { number: 16, value: 'Šestnásty' },
      { number: 15, value: 'Pätnásty' },
      { number: 14, value: 'Štrnásty' },
      { number: 13, value: 'Trinásty' },
      { number: 12, value: 'Dvanásty' },
      { number: 11, value: 'Jedenásty' },
      { number: 10, value: 'Desiaty' },
      { number: 9, value: 'Deviaty' },
      { number: 8, value: 'Ôsmy' },
      { number: 7, value: 'Siedmy' },
      { number: 6, value: 'Šiesty' },
      { number: 5, value: 'Piaty' },
      { number: 4, value: 'Štvrtý' },
      { number: 3, value: 'Tretí' },
      { number: 2, value: 'Druhý' },
      { number: 1, value: 'Prvý' },
      { number: 0, value: 'Nultý' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Stý' }],
    // A round scale ordinal fuses its multiplier (en.wiktionary dvojtisíci, desaťtisíci, stotisíci).
    ordinalScaleStems: {
      1: 'jeden',
      2: 'dvoj',
      3: 'troj',
      4: 'štvor',
      5: 'päť',
      6: 'šesť',
      7: 'sedem',
      8: 'osem',
      9: 'deväť',
      10: 'desať',
      11: 'jedenásť',
      12: 'dvanásť',
      13: 'trinásť',
      14: 'štrnásť',
      15: 'pätnásť',
      16: 'šestnásť',
      17: 'sedemnásť',
      18: 'osemnásť',
      19: 'devätnásť',
      20: 'dvadsať',
      30: 'tridsať',
      40: 'štyridsať',
      50: 'päťdesiat',
      60: 'šesťdesiat',
      70: 'sedemdesiat',
      80: 'osemdesiat',
      90: 'deväťdesiat',
      100: 'sto',
      200: 'dvesto',
      300: 'tristo',
      400: 'štyristo',
      500: 'päťsto',
      600: 'šesťsto',
      700: 'sedemsto',
      800: 'osemsto',
      900: 'deväťsto',
    },
    // Inside a compound multiplier the cardinal form stays (22 000. → Dvadsaťdvatisíci).
    ordinalScaleStemsAfterMore: { 2: 'dva', 3: 'tri', 4: 'štyri' },
    fractionDenominatorMapping: {
      1: { singular: 'Desatina', plural: 'Desatiny' },
      2: { singular: 'Stotina', plural: 'Stotiny' },
      3: { singular: 'Tisícina', plural: 'Tisíciny' },
      4: { singular: 'Desaťtisícina', plural: 'Desaťtisíciny' },
      5: { singular: 'Stotisícina', plural: 'Stotisíciny' },
      6: { singular: 'Milióntina', plural: 'Milióntiny' },
      7: { singular: 'Desaťmilióntina', plural: 'Desaťmilióntiny' },
      8: { singular: 'Stomilióntina', plural: 'Stomilióntiny' },
      9: { singular: 'Miliardtina', plural: 'Miliardtiny' },
      10: { singular: 'Desaťmiliardtina', plural: 'Desaťmiliardtiny' },
      11: { singular: 'Stomiliardtina', plural: 'Stomiliardtiny' },
      12: { singular: 'Bilióntina', plural: 'Bilióntiny' },
      13: { singular: 'Desaťbilióntina', plural: 'Desaťbilióntiny' },
      14: { singular: 'Stobilióntina', plural: 'Stobilióntiny' },
      15: { singular: 'Biliardtina', plural: 'Biliardtiny' },
    },
    fractionReading: {
      // The digit reading «Jeden Celá Päť» is ungrammatical (sk.wiktionary «celá»: jedna celá štyri).
      isDefault: true,
      wholeForms: { zero: 'Celá', one: 'Celá', few: 'Celé', many: 'Celých', other: 'Celých' },
      gender: 'feminine',
      denominatorForms: {
        1: { one: 'Desatina', few: 'Desatiny', many: 'Desatín', other: 'Desatín' },
        2: { one: 'Stotina', few: 'Stotiny', many: 'Stotín', other: 'Stotín' },
        3: { one: 'Tisícina', few: 'Tisíciny', many: 'Tisícin', other: 'Tisícin' },
        4: { one: 'Desaťtisícina', few: 'Desaťtisíciny', many: 'Desaťtisícin', other: 'Desaťtisícin' },
        5: { one: 'Stotisícina', few: 'Stotisíciny', many: 'Stotisícin', other: 'Stotisícin' },
        6: { one: 'Milióntina', few: 'Milióntiny', many: 'Milióntin', other: 'Milióntin' },
        7: { one: 'Desaťmilióntina', few: 'Desaťmilióntiny', many: 'Desaťmilióntin', other: 'Desaťmilióntin' },
        8: { one: 'Stomilióntina', few: 'Stomilióntiny', many: 'Stomilióntin', other: 'Stomilióntin' },
        9: { one: 'Miliardtina', few: 'Miliardtiny', many: 'Miliardtín', other: 'Miliardtín' },
        10: { one: 'Desaťmiliardtina', few: 'Desaťmiliardtiny', many: 'Desaťmiliardtín', other: 'Desaťmiliardtín' },
        11: { one: 'Stomiliardtina', few: 'Stomiliardtiny', many: 'Stomiliardtín', other: 'Stomiliardtín' },
        12: { one: 'Bilióntina', few: 'Bilióntiny', many: 'Bilióntin', other: 'Bilióntin' },
        13: { one: 'Desaťbilióntina', few: 'Desaťbilióntiny', many: 'Desaťbilióntin', other: 'Desaťbilióntin' },
        14: { one: 'Stobilióntina', few: 'Stobilióntiny', many: 'Stobilióntin', other: 'Stobilióntin' },
        15: { one: 'Biliardtina', few: 'Biliardtiny', many: 'Biliardtín', other: 'Biliardtín' },
      },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/sk-SK';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'sk-SK');
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

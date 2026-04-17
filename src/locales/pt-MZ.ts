import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Metical',
      plural: 'Meticais',
      singular: 'Metical',
      symbol: 'MT',
      fractionalUnit: {
        name: 'Centavo',
        singular: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
    texts: {
      and: 'E',
      minus: 'Menos',
      only: '',
      point: 'Vírgula',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Quatrilhões' },
      { number: 1000000000000, value: 'Trilhões' },
      { number: 1000000000, value: 'Mil Milhões' },
      { number: 1000000, value: 'Milhões' },
      { number: 1000, value: 'Mil' },
      { number: 900, value: 'Novecentos', feminineValue: 'Novecentas' },
      { number: 800, value: 'Oitocentos', feminineValue: 'Oitocentas' },
      { number: 700, value: 'Setecentos', feminineValue: 'Setecentas' },
      { number: 600, value: 'Seiscentos', feminineValue: 'Seiscentas' },
      { number: 500, value: 'Quinhentos', feminineValue: 'Quinhentas' },
      { number: 400, value: 'Quatrocentos', feminineValue: 'Quatrocentas' },
      { number: 300, value: 'Trezentos', feminineValue: 'Trezentas' },
      { number: 200, value: 'Duzentos', feminineValue: 'Duzentas' },
      { number: 100, value: 'Cento' },
      { number: 90, value: 'Noventa' },
      { number: 80, value: 'Oitenta' },
      { number: 70, value: 'Setenta' },
      { number: 60, value: 'Sessenta' },
      { number: 50, value: 'Cinquenta' },
      { number: 40, value: 'Quarenta' },
      { number: 30, value: 'Trinta' },
      { number: 20, value: 'Vinte' },
      { number: 19, value: 'Dezanove' },
      { number: 18, value: 'Dezoito' },
      { number: 17, value: 'Dezassete' },
      { number: 16, value: 'Dezasseis' },
      { number: 15, value: 'Quinze' },
      { number: 14, value: 'Catorze' },
      { number: 13, value: 'Treze' },
      { number: 12, value: 'Doze' },
      { number: 11, value: 'Onze' },
      { number: 10, value: 'Dez' },
      { number: 9, value: 'Nove' },
      { number: 8, value: 'Oito' },
      { number: 7, value: 'Sete' },
      { number: 6, value: 'Seis' },
      { number: 5, value: 'Cinco' },
      { number: 4, value: 'Quatro' },
      { number: 3, value: 'Três' },
      { number: 2, value: 'Dois', feminineValue: 'Duas' },
      { number: 1, value: 'Um', feminineValue: 'Uma' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'Cem' },
      { number: 1000000000000000, value: 'Um Quatrilhão' },
      { number: 1000000000000, value: 'Um Trilhão' },
      { number: 1000000000, value: 'Mil Milhões' },
      { number: 1000000, value: 'Um Milhão' },
    ],
    ignoreOneForWords: [
      'Mil',
      'Novecentos',
      'Oitocentos',
      'Setecentos',
      'Seiscentos',
      'Quinhentos',
      'Quatrocentos',
      'Trezentos',
      'Duzentos',
      'Cento',
    ],
    splitWord: 'E',
    noSplitWordAfter: ['Mil', 'Milhões', 'Mil Milhões', 'Trilhões', 'Quatrilhões'],
    ordinalWordsMapping: [
      { number: 1000000000000, value: 'Trilionésimo' },
      { number: 1000000000, value: 'Milésimo Milionésimo' },
      { number: 1000000, value: 'Milionésimo' },
      { number: 1000, value: 'Milésimo' },
      { number: 900, value: 'Noningentésimo' },
      { number: 800, value: 'Octingentésimo' },
      { number: 700, value: 'Septingentésimo' },
      { number: 600, value: 'Sexcentésimo' },
      { number: 500, value: 'Quingentésimo' },
      { number: 400, value: 'Quadringentésimo' },
      { number: 300, value: 'Tricentésimo' },
      { number: 200, value: 'Ducentésimo' },
      { number: 100, value: 'Centésimo' },
      { number: 90, value: 'Nonagésimo' },
      { number: 80, value: 'Octogésimo' },
      { number: 70, value: 'Septuagésimo' },
      { number: 60, value: 'Sexagésimo' },
      { number: 50, value: 'Quinquagésimo' },
      { number: 40, value: 'Quadragésimo' },
      { number: 30, value: 'Trigésimo' },
      { number: 20, value: 'Vigésimo' },
      { number: 19, value: 'Décimo Nono' },
      { number: 18, value: 'Décimo Oitavo' },
      { number: 17, value: 'Décimo Sétimo' },
      { number: 16, value: 'Décimo Sexto' },
      { number: 15, value: 'Décimo Quinto' },
      { number: 14, value: 'Décimo Quarto' },
      { number: 13, value: 'Décimo Terceiro' },
      { number: 12, value: 'Décimo Segundo' },
      { number: 11, value: 'Décimo Primeiro' },
      { number: 10, value: 'Décimo' },
      { number: 9, value: 'Nono' },
      { number: 8, value: 'Oitavo' },
      { number: 7, value: 'Sétimo' },
      { number: 6, value: 'Sexto' },
      { number: 5, value: 'Quinto' },
      { number: 4, value: 'Quarto' },
      { number: 3, value: 'Terceiro' },
      { number: 2, value: 'Segundo' },
      { number: 1, value: 'Primeiro' },
      { number: 0, value: 'Zero' },
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Décimo', plural: 'Décimos' },
      2: { singular: 'Centésimo', plural: 'Centésimos' },
      3: { singular: 'Milésimo', plural: 'Milésimos' },
      4: { singular: 'Décimo de Milésimo', plural: 'Décimos de Milésimo' },
      5: { singular: 'Centésimo de Milésimo', plural: 'Centésimos de Milésimo' },
      6: { singular: 'Milionésimo', plural: 'Milionésimos' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/pt-MZ';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

// Module-level singleton — reused across calls to avoid per-call instance creation
const instance = new ToWords();

/**
 * Convert a number to words for this locale (functional style).
 */
export function toWords(number: NumberInput, options?: ConverterOptions): string {
  return instance.convert(number, options);
}

/**
 * Convert a number to ordinal words for this locale (functional style).
 */
export function toOrdinal(number: NumberInput, options?: OrdinalOptions): string {
  return instance.toOrdinal(number, options);
}

/**
 * Convert a number to currency words for this locale (functional style).
 * Shorthand for toWords(number, { currency: true, ...options }).
 */
export function toCurrency(number: NumberInput, options?: ConverterOptions): string {
  return instance.convert(number, { ...options, currency: true });
}

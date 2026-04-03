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
      name: 'Peso Mexicano',
      plural: 'Pesos Mexicanos',
      singular: 'Peso Mexicano',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        singular: 'Centavo',
        symbol: '¢',
      },
    },
    texts: {
      and: 'Y',
      minus: 'Menos',
      only: '',
      point: 'Punto',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Trillon' },
      { number: 1000000000000, value: 'Billon' },
      { number: 1000000, value: 'Millon' },
      { number: 1000, value: 'Mil' },
      { number: 900, value: 'Novecientos', feminineValue: 'Novecientas' },
      { number: 800, value: 'Ochocientos', feminineValue: 'Ochocientas' },
      { number: 700, value: 'Setecientos', feminineValue: 'Setecientas' },
      { number: 600, value: 'Seiscientos', feminineValue: 'Seiscientas' },
      { number: 500, value: 'Quinientos', feminineValue: 'Quinientas' },
      { number: 400, value: 'Cuatrocientos', feminineValue: 'Cuatrocientas' },
      { number: 300, value: 'Trescientos', feminineValue: 'Trescientas' },
      { number: 200, value: 'Doscientos', feminineValue: 'Doscientas' },
      { number: 100, value: 'Ciento' },
      { number: 90, value: 'Noventa Y' },
      { number: 80, value: 'Ochenta Y' },
      { number: 70, value: 'Setenta Y' },
      { number: 60, value: 'Sesenta Y' },
      { number: 50, value: 'Cincuenta Y' },
      { number: 40, value: 'Cuarenta Y' },
      { number: 30, value: 'Treinta Y' },
      { number: 29, value: 'Veintinueve' },
      { number: 28, value: 'Veintiocho' },
      { number: 27, value: 'Veintisiete' },
      { number: 26, value: 'Veintiséis' },
      { number: 25, value: 'Veinticinco' },
      { number: 24, value: 'Veinticuatro' },
      { number: 23, value: 'Veintitrés' },
      { number: 22, value: 'Veintidós' },
      { number: 21, value: 'Veintiuno', feminineValue: 'Veintiuna' },
      { number: 20, value: 'Veinte' },
      { number: 19, value: 'Diecinueve' },
      { number: 18, value: 'Dieciocho' },
      { number: 17, value: 'Diecisiete' },
      { number: 16, value: 'Dieciséis' },
      { number: 15, value: 'Quince' },
      { number: 14, value: 'Catorce' },
      { number: 13, value: 'Trece' },
      { number: 12, value: 'Doce' },
      { number: 11, value: 'Once' },
      { number: 10, value: 'Diez' },
      { number: 9, value: 'Nueve' },
      { number: 8, value: 'Ocho' },
      { number: 7, value: 'Siete' },
      { number: 6, value: 'Seis' },
      { number: 5, value: 'Cinco' },
      { number: 4, value: 'Cuatro' },
      { number: 3, value: 'Tres' },
      { number: 2, value: 'Dos' },
      { number: 1, value: 'Uno', feminineValue: 'Una' },
      { number: 0, value: 'Cero' },
    ],
    ignoreOneForWords: [
      'Cien',
      'Ciento',
      'Doscientos',
      'Trescientos',
      'Cuatrocientos',
      'Quinientos',
      'Seiscientos',
      'Setecientos',
      'Ochocientos',
      'Novecientos',
      'Mil',
    ],
    pluralMark: 'es',
    pluralWords: ['Millon', 'Billon', 'Trillon'],
    exactWordsMapping: [
      { number: 100, value: 'Cien' },
      { number: 90, value: 'Noventa' },
      { number: 80, value: 'Ochenta' },
      { number: 70, value: 'Setenta' },
      { number: 60, value: 'Sesenta' },
      { number: 50, value: 'Cincuenta' },
      { number: 40, value: 'Cuarenta' },
      { number: 30, value: 'Treinta' },
      { number: 1, value: ['Un', 'Uno'], feminineValue: 'Una' },
    ],
    ordinalWordsMapping: [
      { number: 1000000000000, value: 'Billonésimo' },
      { number: 1000000, value: 'Millonésimo' },
      { number: 1000, value: 'Milésimo' },
      { number: 900, value: 'Noningentésimo' },
      { number: 800, value: 'Octingentésimo' },
      { number: 700, value: 'Septingentésimo' },
      { number: 600, value: 'Sexcentésimo' },
      { number: 500, value: 'Quingentésimo' },
      { number: 400, value: 'Cuadringentésimo' },
      { number: 300, value: 'Tricentésimo' },
      { number: 200, value: 'Ducentésimo' },
      { number: 100, value: 'Centésimo' },
      { number: 90, value: 'Nonagésimo' },
      { number: 80, value: 'Octogésimo' },
      { number: 70, value: 'Septuagésimo' },
      { number: 60, value: 'Sexagésimo' },
      { number: 50, value: 'Quincuagésimo' },
      { number: 40, value: 'Cuadragésimo' },
      { number: 30, value: 'Trigésimo' },
      { number: 20, value: 'Vigésimo' },
      { number: 19, value: 'Decimonoveno' },
      { number: 18, value: 'Decimoctavo' },
      { number: 17, value: 'Decimoséptimo' },
      { number: 16, value: 'Decimosexto' },
      { number: 15, value: 'Decimoquinto' },
      { number: 14, value: 'Decimocuarto' },
      { number: 13, value: 'Decimotercero' },
      { number: 12, value: 'Decimosegundo' },
      { number: 11, value: 'Decimoprimero' },
      { number: 10, value: 'Décimo' },
      { number: 9, value: 'Noveno' },
      { number: 8, value: 'Octavo' },
      { number: 7, value: 'Séptimo' },
      { number: 6, value: 'Sexto' },
      { number: 5, value: 'Quinto' },
      { number: 4, value: 'Cuarto' },
      { number: 3, value: 'Tercero' },
      { number: 2, value: 'Segundo' },
      { number: 1, value: 'Primero' },
      { number: 0, value: 'Cero' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/es-MX';
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

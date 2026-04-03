import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// Igbo (Standard Igbo) number words
// Decimal system with scale-first ordering: "nnari abụọ" = hundred two = 200
// Groups joined with "na" (and): "puku na nnari abụọ na iri atọ na anọ" = 1,234
// Ordinals use a "Nke" prefix (e.g. "Nke Abụọ" = second), with
// "Mbụ" as the irregular first form.
export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Naira',
      plural: 'Naira',
      singular: 'Naira',
      symbol: '₦',
      fractionalUnit: {
        name: 'Kobo',
        singular: 'Kobo',
        plural: 'Kobo',
        symbol: '',
      },
    },
    texts: {
      and: 'Na',
      minus: 'Mwepu',
      only: 'Naanị',
      point: 'Ntụpọ',
    },
    namedLessThan1000: true,
    scaleFirst: true,
    splitWord: 'Na',
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kuadirilịọn' },
      { number: 1000000000000, value: 'Tirịlịọn' },
      { number: 1000000000, value: 'Ijeri' },
      { number: 1000000, value: 'Nde' },
      { number: 1000, value: 'Puku' },
      { number: 900, value: 'Nnari Eteghiete' },
      { number: 800, value: 'Nnari Asatọ' },
      { number: 700, value: 'Nnari Asaa' },
      { number: 600, value: 'Nnari Isii' },
      { number: 500, value: 'Nnari Ise' },
      { number: 400, value: 'Nnari Anọ' },
      { number: 300, value: 'Nnari Atọ' },
      { number: 200, value: 'Nnari Abụọ' },
      { number: 100, value: 'Nnari' },
      { number: 90, value: 'Iri Eteghiete' },
      { number: 80, value: 'Iri Asatọ' },
      { number: 70, value: 'Iri Asaa' },
      { number: 60, value: 'Iri Isii' },
      { number: 50, value: 'Iri Ise' },
      { number: 40, value: 'Iri Anọ' },
      { number: 30, value: 'Iri Atọ' },
      { number: 20, value: 'Iri Abụọ' },
      { number: 19, value: 'Iri Na Eteghiete' },
      { number: 18, value: 'Iri Na Asatọ' },
      { number: 17, value: 'Iri Na Asaa' },
      { number: 16, value: 'Iri Na Isii' },
      { number: 15, value: 'Iri Na Ise' },
      { number: 14, value: 'Iri Na Anọ' },
      { number: 13, value: 'Iri Na Atọ' },
      { number: 12, value: 'Iri Na Abụọ' },
      { number: 11, value: 'Iri Na Otu' },
      { number: 10, value: 'Iri' },
      { number: 9, value: 'Eteghiete' },
      { number: 8, value: 'Asatọ' },
      { number: 7, value: 'Asaa' },
      { number: 6, value: 'Isii' },
      { number: 5, value: 'Ise' },
      { number: 4, value: 'Anọ' },
      { number: 3, value: 'Atọ' },
      { number: 2, value: 'Abụọ' },
      { number: 1, value: 'Otu' },
      { number: 0, value: 'Adịghị' },
    ],
    exactWordsMapping: [
      { number: 1000000000, value: 'Ijeri' },
      { number: 1000000, value: 'Nde' },
      { number: 1000, value: 'Puku' },
      { number: 100, value: 'Nnari' },
    ],
    ordinalExactWordsMapping: [{ number: 1, value: 'Mbụ' }],
    ordinalPrefix: 'Nke',
    ignoreOneForWords: ['Nnari', 'Puku', 'Nde', 'Ijeri', 'Tirịlịọn', 'Kuadirilịọn'],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ig-NG';
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

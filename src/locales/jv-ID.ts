import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// Javanese (ngoko register) number words
// Uses Latin script (dominant writing system for modern Javanese)
// Counting prefix forms (rong, telung, patang, etc.) via value arrays:
//   value[0] = counting/prefix form (used in quotient position, e.g. "Rong Atus" = 200)
//   value[1] = standalone form (used in final/trailing position, e.g. "Loro" = 2)
// Ordinals use the "Kaping" prefix, with irregular first form "Kapisan".
export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Rupiah',
      plural: 'Rupiah',
      singular: 'Rupiah',
      symbol: 'Rp',
      fractionalUnit: {
        name: 'Sen',
        plural: 'Sen',
        singular: 'Sen',
        symbol: '',
      },
    },
    texts: {
      and: 'Lan',
      minus: 'Minus',
      only: 'Waé',
      point: 'Koma',
    },
    useTrailingForCurrency: true,
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Kuadriliun' },
      { number: 1000000000000, value: 'Triliun' },
      { number: 1000000000, value: 'Milyar' },
      { number: 1000000, value: 'Yuta', singularValue: 'Sayuta' },
      { number: 1000, value: 'Èwu', singularValue: 'Sèwu' },
      { number: 100, value: 'Atus', singularValue: 'Satus' },
      { number: 90, value: 'Sangang Puluh' },
      { number: 80, value: 'Wolung Puluh' },
      { number: 70, value: 'Pitung Puluh' },
      { number: 60, value: 'Sewidak' },
      { number: 50, value: 'Sèket' },
      { number: 40, value: 'Patang Puluh' },
      { number: 30, value: 'Telung Puluh' },
      { number: 29, value: 'Sangang Likur' },
      { number: 28, value: 'Wolung Likur' },
      { number: 27, value: 'Pitung Likur' },
      { number: 26, value: 'Nem Likur' },
      { number: 25, value: 'Selawé' },
      { number: 24, value: 'Pat Likur' },
      { number: 23, value: 'Telu Likur' },
      { number: 22, value: 'Rong Likur' },
      { number: 21, value: 'Selikur' },
      { number: 20, value: 'Rong Puluh' },
      { number: 19, value: 'Sangalas' },
      { number: 18, value: 'Wolulas' },
      { number: 17, value: 'Pitulas' },
      { number: 16, value: 'Nembelas' },
      { number: 15, value: 'Limalas' },
      { number: 14, value: 'Patbelas' },
      { number: 13, value: 'Telulas' },
      { number: 12, value: 'Rolas' },
      { number: 11, value: 'Sewelas' },
      { number: 10, value: 'Sepuluh' },
      { number: 9, value: ['Sangang', 'Sanga'] },
      { number: 8, value: ['Wolung', 'Wolu'] },
      { number: 7, value: ['Pitung', 'Pitu'] },
      { number: 6, value: ['Nem', 'Enem'] },
      { number: 5, value: ['Limang', 'Lima'] },
      { number: 4, value: ['Patang', 'Papat'] },
      { number: 3, value: ['Telung', 'Telu'] },
      { number: 2, value: ['Rong', 'Loro'] },
      { number: 1, value: 'Siji' },
      { number: 0, value: 'Nol' },
    ],
    exactWordsMapping: [
      { number: 1000, value: 'Sèwu' },
      { number: 100, value: 'Satus' },
    ],
    ordinalExactWordsMapping: [{ number: 1, value: 'Kapisan' }],
    ordinalPrefix: 'Kaping',
    ignoreOneForWords: ['Atus', 'Èwu', 'Yuta', 'Milyar', 'Triliun', 'Kuadriliun'],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/jv-ID';
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

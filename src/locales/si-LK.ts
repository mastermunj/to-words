import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// NOTE: Ordinal conversion is not yet supported for this locale.
// Sinhala ordinals are irregular for 1–3 (පළමු, දෙවෙනි, තෙවෙනි) and the
// suffix form (-වෙනි) needs native-speaker review before shipping. toOrdinal() will throw.

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'රුපියල',
      plural: 'රුපියල',
      singular: 'රුපියල',
      symbol: 'රු',
      fractionalUnit: {
        name: 'සත',
        plural: 'සත',
        singular: 'සත',
        symbol: '',
      },
    },
    texts: {
      and: 'සහ',
      minus: 'ඍණ',
      only: '',
      point: 'දශම',
    },
    numberWordsMapping: [
      { number: 1000000000000, value: 'ට්‍රිලියනය' },
      { number: 1000000000, value: 'බිලියනය' },
      { number: 1000000, value: 'මිලියනය' },
      { number: 100000, value: 'ලක්ෂය' },
      { number: 1000, value: 'දාහ' },
      { number: 100, value: 'සිය' },
      { number: 90, value: 'අනූ' },
      { number: 80, value: 'අසූ' },
      { number: 70, value: 'හැත්තෑ' },
      { number: 60, value: 'හැට' },
      { number: 50, value: 'පනස' },
      { number: 40, value: 'හතළිස' },
      { number: 30, value: 'තිස' },
      { number: 20, value: 'විස' },
      { number: 10, value: 'දහය' },
      { number: 9, value: 'නවය' },
      { number: 8, value: 'අට' },
      { number: 7, value: 'හත' },
      { number: 6, value: 'හය' },
      { number: 5, value: 'පහ' },
      { number: 4, value: 'හතර' },
      { number: 3, value: 'තුන' },
      { number: 2, value: 'දෙ' },
      { number: 1, value: 'එක' },
      { number: 0, value: 'ශූන්‍ය' },
    ],
    // 100 = සිය (not "එක සිය"), 1000 = දාහ (not "එක දාහ"), 100000 = ලක්ෂය (not "එක ලක්ෂය")
    ignoreOneForWords: ['සිය', 'දාහ', 'ලක්ෂය'],
    // 11 and 12 are irregular — must use exactWordsMapping so that 13–19 compose
    // correctly from 10 + unit rather than 12 + unit (which would be wrong).
    exactWordsMapping: [
      { number: 12, value: 'දොළොස' },
      { number: 11, value: 'එකොළොස' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/si-LK';
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

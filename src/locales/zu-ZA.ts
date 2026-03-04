import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// NOTE: Zulu connector particles (nan-/na-/ne-) before unit words change form
// depending on the noun class of the unit (e.g. 21 = "amashumi amabili nanye"
// not "amashumi amabili na kunye"). The current implementation approximates this
// using splitWord: 'Na' for 21–99. A follow-up PR with explicit 21–99 mappings
// would produce fully correct output.

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Rand',
      plural: 'Rand',
      singular: 'Rand',
      symbol: 'R',
      fractionalUnit: {
        name: 'Senti',
        plural: 'Senti',
        singular: 'Senti',
        symbol: 'c',
      },
    },
    texts: {
      and: 'Na',
      minus: 'Minus',
      only: '',
      point: 'Iphoyinti',
    },
    splitWord: 'Na',
    numberWordsMapping: [
      { number: 1000000000000, value: 'Ithriliyoni' },
      { number: 1000000000, value: 'Ibhiliyoni' },
      { number: 1000000, value: 'Isigidi' },
      { number: 1000, value: 'Inkulungwane' },
      { number: 100, value: 'Ikhulu' },
      { number: 90, value: 'Amashumi Ayisishiyagalolunye' },
      { number: 80, value: 'Amashumi Ayisishiyagalombili' },
      { number: 70, value: 'Amashumi Ayisikhombisa' },
      { number: 60, value: 'Amashumi Ayisithupha' },
      { number: 50, value: 'Amashumi Amahlanu' },
      { number: 40, value: 'Amashumi Amane' },
      { number: 30, value: 'Amashumi Amathathu' },
      { number: 20, value: 'Amashumi Amabili' },
      // 11–19 with conjugated connector na-/nan-/ne-
      { number: 19, value: 'Ishumi Nesishiyagalolunye' },
      { number: 18, value: 'Ishumi Nesishiyagalombili' },
      { number: 17, value: 'Ishumi Nesikhombisa' },
      { number: 16, value: 'Ishumi Nesithupha' },
      { number: 15, value: 'Ishumi Nanhlanu' },
      { number: 14, value: 'Ishumi Nane' },
      { number: 13, value: 'Ishumi Nantathu' },
      { number: 12, value: 'Ishumi Nambili' },
      { number: 11, value: 'Ishumi Nanye' },
      { number: 10, value: 'Ishumi' },
      { number: 9, value: 'Isishiyagalolunye' },
      { number: 8, value: 'Isishiyagalombili' },
      { number: 7, value: 'Isikhombisa' },
      { number: 6, value: 'Isithupha' },
      { number: 5, value: 'Kuhlanu' },
      { number: 4, value: 'Kune' },
      { number: 3, value: 'Kuthathu' },
      { number: 2, value: 'Kubili' },
      { number: 1, value: 'Kunye' },
      { number: 0, value: 'Iqanda' },
    ],
    // 100 = Ikhulu (not "Kunye Ikhulu"), 1000 = Inkulungwane (not "Kunye Inkulungwane"),
    // 1M = Isigidi (not "Kunye Isigidi")
    ignoreOneForWords: ['Ikhulu', 'Inkulungwane', 'Isigidi'],
    ordinalSuffix: 'okwesikhathi',
    ordinalWordsMapping: [
      { number: 1000, value: 'Kwenkulungwane' },
      { number: 100, value: 'Kwekhulu' },
      { number: 90, value: 'Kwamashumi Ayisishiyagalolunye' },
      { number: 80, value: 'Kwamashumi Ayisishiyagalombili' },
      { number: 70, value: 'Kwamashumi Ayisikhombisa' },
      { number: 60, value: 'Kwamashumi Ayisithupha' },
      { number: 50, value: 'Kwamashumi Amahlanu' },
      { number: 40, value: 'Kwamashumi Amane' },
      { number: 30, value: 'Kwamashumi Amathathu' },
      { number: 20, value: 'Kwamashumi Amabili' },
      { number: 19, value: 'Kweshumi Nesishiyagalolunye' },
      { number: 18, value: 'Kweshumi Nesishiyagalombili' },
      { number: 17, value: 'Kweshumi Nesikhombisa' },
      { number: 16, value: 'Kweshumi Nesithupha' },
      { number: 15, value: 'Kweshumi Nanhlanu' },
      { number: 14, value: 'Kweshumi Nane' },
      { number: 13, value: 'Kweshumi Nantathu' },
      { number: 12, value: 'Kweshumi Nambili' },
      { number: 11, value: 'Kweshumi Nanye' },
      { number: 10, value: 'Kweshumi' },
      { number: 9, value: 'Kwesishiyagalolunye' },
      { number: 8, value: 'Kwesishiyagalombili' },
      { number: 7, value: 'Kwesikhombisa' },
      { number: 6, value: 'Kwesithupha' },
      { number: 5, value: 'Kwehlanu' },
      { number: 4, value: 'Kwane' },
      { number: 3, value: 'Kwathathu' },
      { number: 2, value: 'Kwesibili' },
      { number: 1, value: 'Kwokuqala' },
      { number: 0, value: 'Kweqanda' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/zu-ZA';
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

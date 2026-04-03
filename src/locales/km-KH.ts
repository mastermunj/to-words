import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

// Khmer ordinals use the prefix ទី (ti), e.g. ទីមួយ (first), ទីពីរ (second).

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'រៀល',
      plural: 'រៀល',
      singular: 'រៀល',
      symbol: '៛',
      fractionalUnit: {
        // Sen (100 sen = 1 riel) — rarely used in practice
        name: 'សេន',
        plural: 'សេន',
        singular: 'សេន',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: 'ដក',
      only: '',
      point: 'ចុច',
    },
    trim: true,
    ordinalPrefix: 'ទី',
    numberWordsMapping: [
      { number: 1000000000000, value: 'ទ្រីលាន' },
      { number: 1000000000, value: 'ប៊ីលាន' },
      { number: 1000000, value: 'លាន' },
      { number: 100000, value: 'សែន' },
      { number: 10000, value: 'មុឺន' },
      { number: 1000, value: 'ពាន់' },
      { number: 100, value: 'រយ' },
      { number: 90, value: 'កៅសិប' },
      { number: 80, value: 'ប៉ែតសិប' },
      { number: 70, value: 'ចិតសិប' },
      { number: 60, value: 'ហុកសិប' },
      { number: 50, value: 'ហាសិប' },
      { number: 40, value: 'សែសិប' },
      { number: 30, value: 'សាមសិប' },
      // 20 is irregular in Khmer (not "two-ten")
      { number: 20, value: 'ម្ភៃ' },
      { number: 19, value: 'ដប់ប្រាំបួន' },
      { number: 18, value: 'ដប់ប្រាំបី' },
      { number: 17, value: 'ដប់ប្រាំពីរ' },
      { number: 16, value: 'ដប់ប្រាំមួយ' },
      { number: 15, value: 'ដប់ប្រាំ' },
      { number: 14, value: 'ដប់បួន' },
      { number: 13, value: 'ដប់បី' },
      { number: 12, value: 'ដប់ពីរ' },
      { number: 11, value: 'ដប់មួយ' },
      { number: 10, value: 'ដប់' },
      // 6–9 are composed from 5+units in Khmer
      { number: 9, value: 'ប្រាំបួន' },
      { number: 8, value: 'ប្រាំបី' },
      { number: 7, value: 'ប្រាំពីរ' },
      { number: 6, value: 'ប្រាំមួយ' },
      { number: 5, value: 'ប្រាំ' },
      { number: 4, value: 'បួន' },
      { number: 3, value: 'បី' },
      { number: 2, value: 'ពីរ' },
      { number: 1, value: 'មួយ' },
      { number: 0, value: 'សូន្យ' },
    ],
    // 100 is in the <=100 fast path and returns just 'រយ'; exactWordsMapping corrects
    // the standalone case to 'មួយ រយ' (one hundred).
    exactWordsMapping: [{ number: 100, value: 'មួយរយ' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/km-KH';
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

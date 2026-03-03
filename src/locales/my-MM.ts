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
// Burmese ordinals use a prefix system (ပထမ, ဒုတိယ, တတိယ ...) that requires
// a future prefix-ordinal feature in the engine. toOrdinal() will throw.

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'ကျပ်',
      plural: 'ကျပ်',
      singular: 'ကျပ်',
      symbol: 'K',
      fractionalUnit: {
        name: 'ပြား',
        plural: 'ပြား',
        singular: 'ပြား',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: 'အနုတ်',
      only: '',
      point: 'ဒသမ',
    },
    trim: true,
    numberWordsMapping: [
      { number: 1000000000000, value: 'ထရီလီယံ' },
      { number: 1000000000, value: 'ဘီလီယံ' },
      { number: 1000000, value: 'သန်း' },
      { number: 100000, value: 'သိန်း' },
      { number: 10000, value: 'သောင်း' },
      { number: 1000, value: 'ထောင်' },
      { number: 100, value: 'ရာ' },
      // Explicit tens (standalone form, no connector)
      { number: 90, value: 'ကိုးဆယ်' },
      { number: 80, value: 'ရှစ်ဆယ်' },
      { number: 70, value: 'ခုနစ်ဆယ်' },
      { number: 60, value: 'ခြောက်ဆယ်' },
      { number: 50, value: 'ငါးဆယ်' },
      { number: 40, value: 'လေးဆယ်' },
      { number: 30, value: 'သုံးဆယ်' },
      { number: 20, value: 'နှစ်ဆယ်' },
      // Explicit 11-19 — connector ့ is required when a unit follows the tens digit
      { number: 19, value: 'တစ်ဆယ့်ကိုး' },
      { number: 18, value: 'တစ်ဆယ့်ရှစ်' },
      { number: 17, value: 'တစ်ဆယ့်ခုနစ်' },
      { number: 16, value: 'တစ်ဆယ့်ခြောက်' },
      { number: 15, value: 'တစ်ဆယ့်ငါး' },
      { number: 14, value: 'တစ်ဆယ့်လေး' },
      { number: 13, value: 'တစ်ဆယ့်သုံး' },
      { number: 12, value: 'တစ်ဆယ့်နှစ်' },
      { number: 11, value: 'တစ်ဆယ့်တစ်' },
      { number: 10, value: 'တစ်ဆယ်' },
      // Explicit 21-29
      { number: 29, value: 'နှစ်ဆယ့်ကိုး' },
      { number: 28, value: 'နှစ်ဆယ့်ရှစ်' },
      { number: 27, value: 'နှစ်ဆယ့်ခုနစ်' },
      { number: 26, value: 'နှစ်ဆယ့်ခြောက်' },
      { number: 25, value: 'နှစ်ဆယ့်ငါး' },
      { number: 24, value: 'နှစ်ဆယ့်လေး' },
      { number: 23, value: 'နှစ်ဆယ့်သုံး' },
      { number: 22, value: 'နှစ်ဆယ့်နှစ်' },
      { number: 21, value: 'နှစ်ဆယ့်တစ်' },
      // Explicit 31-39
      { number: 39, value: 'သုံးဆယ့်ကိုး' },
      { number: 38, value: 'သုံးဆယ့်ရှစ်' },
      { number: 37, value: 'သုံးဆယ့်ခုနစ်' },
      { number: 36, value: 'သုံးဆယ့်ခြောက်' },
      { number: 35, value: 'သုံးဆယ့်ငါး' },
      { number: 34, value: 'သုံးဆယ့်လေး' },
      { number: 33, value: 'သုံးဆယ့်သုံး' },
      { number: 32, value: 'သုံးဆယ့်နှစ်' },
      { number: 31, value: 'သုံးဆယ့်တစ်' },
      // Explicit 41-49
      { number: 49, value: 'လေးဆယ့်ကိုး' },
      { number: 48, value: 'လေးဆယ့်ရှစ်' },
      { number: 47, value: 'လေးဆယ့်ခုနစ်' },
      { number: 46, value: 'လေးဆယ့်ခြောက်' },
      { number: 45, value: 'လေးဆယ့်ငါး' },
      { number: 44, value: 'လေးဆယ့်လေး' },
      { number: 43, value: 'လေးဆယ့်သုံး' },
      { number: 42, value: 'လေးဆယ့်နှစ်' },
      { number: 41, value: 'လေးဆယ့်တစ်' },
      // Explicit 51-59
      { number: 59, value: 'ငါးဆယ့်ကိုး' },
      { number: 58, value: 'ငါးဆယ့်ရှစ်' },
      { number: 57, value: 'ငါးဆယ့်ခုနစ်' },
      { number: 56, value: 'ငါးဆယ့်ခြောက်' },
      { number: 55, value: 'ငါးဆယ့်ငါး' },
      { number: 54, value: 'ငါးဆယ့်လေး' },
      { number: 53, value: 'ငါးဆယ့်သုံး' },
      { number: 52, value: 'ငါးဆယ့်နှစ်' },
      { number: 51, value: 'ငါးဆယ့်တစ်' },
      // Explicit 61-69
      { number: 69, value: 'ခြောက်ဆယ့်ကိုး' },
      { number: 68, value: 'ခြောက်ဆယ့်ရှစ်' },
      { number: 67, value: 'ခြောက်ဆယ့်ခုနစ်' },
      { number: 66, value: 'ခြောက်ဆယ့်ခြောက်' },
      { number: 65, value: 'ခြောက်ဆယ့်ငါး' },
      { number: 64, value: 'ခြောက်ဆယ့်လေး' },
      { number: 63, value: 'ခြောက်ဆယ့်သုံး' },
      { number: 62, value: 'ခြောက်ဆယ့်နှစ်' },
      { number: 61, value: 'ခြောက်ဆယ့်တစ်' },
      // Explicit 71-79
      { number: 79, value: 'ခုနစ်ဆယ့်ကိုး' },
      { number: 78, value: 'ခုနစ်ဆယ့်ရှစ်' },
      { number: 77, value: 'ခုနစ်ဆယ့်ခုနစ်' },
      { number: 76, value: 'ခုနစ်ဆယ့်ခြောက်' },
      { number: 75, value: 'ခုနစ်ဆယ့်ငါး' },
      { number: 74, value: 'ခုနစ်ဆယ့်လေး' },
      { number: 73, value: 'ခုနစ်ဆယ့်သုံး' },
      { number: 72, value: 'ခုနစ်ဆယ့်နှစ်' },
      { number: 71, value: 'ခုနစ်ဆယ့်တစ်' },
      // Explicit 81-89
      { number: 89, value: 'ရှစ်ဆယ့်ကိုး' },
      { number: 88, value: 'ရှစ်ဆယ့်ရှစ်' },
      { number: 87, value: 'ရှစ်ဆယ့်ခုနစ်' },
      { number: 86, value: 'ရှစ်ဆယ့်ခြောက်' },
      { number: 85, value: 'ရှစ်ဆယ့်ငါး' },
      { number: 84, value: 'ရှစ်ဆယ့်လေး' },
      { number: 83, value: 'ရှစ်ဆယ့်သုံး' },
      { number: 82, value: 'ရှစ်ဆယ့်နှစ်' },
      { number: 81, value: 'ရှစ်ဆယ့်တစ်' },
      // Explicit 91-99
      { number: 99, value: 'ကိုးဆယ့်ကိုး' },
      { number: 98, value: 'ကိုးဆယ့်ရှစ်' },
      { number: 97, value: 'ကိုးဆယ့်ခုနစ်' },
      { number: 96, value: 'ကိုးဆယ့်ခြောက်' },
      { number: 95, value: 'ကိုးဆယ့်ငါး' },
      { number: 94, value: 'ကိုးဆယ့်လေး' },
      { number: 93, value: 'ကိုးဆယ့်သုံး' },
      { number: 92, value: 'ကိုးဆယ့်နှစ်' },
      { number: 91, value: 'ကိုးဆယ့်တစ်' },
      { number: 9, value: 'ကိုး' },
      { number: 8, value: 'ရှစ်' },
      { number: 7, value: 'ခုနစ်' },
      { number: 6, value: 'ခြောက်' },
      { number: 5, value: 'ငါး' },
      { number: 4, value: 'လေး' },
      { number: 3, value: 'သုံး' },
      { number: 2, value: 'နှစ်' },
      { number: 1, value: 'တစ်' },
      { number: 0, value: 'သုည' },
    ],
    // Exact standalone values (e.g. convert(100) → 'တစ်ရာ', not just 'ရာ')
    exactWordsMapping: [
      { number: 100, value: 'တစ်ရာ' },
      { number: 1000, value: 'တစ်ထောင်' },
      { number: 10000, value: 'တစ်သောင်း' },
      { number: 100000, value: 'တစ်သိန်း' },
      { number: 1000000, value: 'တစ်သန်း' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/my-MM';
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

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
    // The kip subunit (ອັດ / att) is defunct, so fractional amounts are read as a
    // decimal — ຈຸດ followed by the digits — instead of being given a unit name.
    // texts.and supplies that ຈຸດ, because the currency converter emits it before
    // the fractional words while a fractionalUnit name would follow them.
    currency: {
      name: 'ກີບ',
      plural: 'ກີບ',
      singular: 'ກີບ',
      symbol: '₭',
      fractionalUnit: {
        name: '',
        plural: '',
        singular: '',
        symbol: '',
      },
    },
    texts: {
      and: 'ຈຸດ',
      minus: 'ລົບ',
      only: 'ຖ້ວນ',
      point: 'ຈຸດ',
    },
    trim: true,
    onlyInFront: false,
    // Lao keeps a named scale word at 10^5 (ແສນ) but reads 10^4 as ສິບພັນ
    // ("ten thousand"), which is the form used in Lao banking and finance. The
    // verbal ໝື່ນ is therefore deliberately absent: leaving 10^4 unnamed lets the
    // composer build it from ພັນ.
    numberWordsMapping: [
      { number: 1000000000000000, value: 'ພັນລ້ານລ້ານ' },
      { number: 1000000000000, value: 'ລ້ານລ້ານ' },
      { number: 1000000000, value: 'ພັນລ້ານ' },
      { number: 1000000, value: 'ລ້ານ' },
      { number: 100000, value: 'ແສນ' },
      { number: 1000, value: 'ພັນ' },
      { number: 100, value: 'ຮ້ອຍ' },
      { number: 90, value: 'ເກົ້າສິບ' },
      { number: 80, value: 'ແປດສິບ' },
      { number: 70, value: 'ເຈັດສິບ' },
      { number: 60, value: 'ຫົກສິບ' },
      { number: 50, value: 'ຫ້າສິບ' },
      { number: 40, value: 'ສີ່ສິບ' },
      { number: 30, value: 'ສາມສິບ' },
      { number: 20, value: 'ຊາວ' },
      { number: 19, value: 'ສິບເກົ້າ' },
      { number: 18, value: 'ສິບແປດ' },
      { number: 17, value: 'ສິບເຈັດ' },
      { number: 16, value: 'ສິບຫົກ' },
      { number: 15, value: 'ສິບຫ້າ' },
      { number: 14, value: 'ສິບສີ່' },
      { number: 13, value: 'ສິບສາມ' },
      { number: 12, value: 'ສິບສອງ' },
      { number: 11, value: 'ສິບເອັດ' },
      { number: 10, value: 'ສິບ' },
      { number: 9, value: 'ເກົ້າ' },
      { number: 8, value: 'ແປດ' },
      { number: 7, value: 'ເຈັດ' },
      { number: 6, value: 'ຫົກ' },
      { number: 5, value: 'ຫ້າ' },
      { number: 4, value: 'ສີ່' },
      { number: 3, value: 'ສາມ' },
      { number: 2, value: 'ສອງ' },
      { number: 1, value: 'ໜຶ່ງ' },
      { number: 0, value: 'ສູນ' },
    ],
    exactWordsMapping: [
      { number: 100, value: 'ໜຶ່ງຮ້ອຍ' },
      { number: 91, value: 'ເກົ້າສິບເອັດ' },
      { number: 81, value: 'ແປດສິບເອັດ' },
      { number: 71, value: 'ເຈັດສິບເອັດ' },
      { number: 61, value: 'ຫົກສິບເອັດ' },
      { number: 51, value: 'ຫ້າສິບເອັດ' },
      { number: 41, value: 'ສີ່ສິບເອັດ' },
      { number: 31, value: 'ສາມສິບເອັດ' },
      { number: 21, value: 'ຊາວເອັດ' },
    ],
    // Lao ordinals use the prefix ທີ (thi), e.g. ທີໜຶ່ງ (first), ທີສອງ (second).
    ordinalPrefix: 'ທີ',
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/lo-LA';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'lo-LA');
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

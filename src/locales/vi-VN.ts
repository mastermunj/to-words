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
      name: 'Đồng',
      plural: 'Đồng',
      singular: 'Đồng',
      symbol: '₫',
      fractionalUnit: {
        name: 'Xu',
        plural: 'Xu',
        singular: 'Xu',
        symbol: '',
      },
    },
    texts: {
      and: 'Và',
      minus: 'Âm',
      only: '',
      point: 'Phẩy',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Triệu Tỷ' },
      // 10¹² is read as nghìn tỷ from tỷ (một nghìn một trăm tỷ; CLDR vi).
      { number: 1000000000, value: 'Tỷ' },
      { number: 1000000, value: 'Triệu' },
      { number: 1000, value: 'Nghìn' },
      { number: 100, value: 'Trăm' },
      { number: 90, value: 'Chín Mươi' },
      { number: 80, value: 'Tám Mươi' },
      { number: 70, value: 'Bảy Mươi' },
      { number: 60, value: 'Sáu Mươi' },
      { number: 50, value: 'Năm Mươi' },
      { number: 40, value: 'Bốn Mươi' },
      { number: 30, value: 'Ba Mươi' },
      { number: 20, value: 'Hai Mươi' },
      { number: 19, value: 'Mười Chín' },
      { number: 18, value: 'Mười Tám' },
      { number: 17, value: 'Mười Bảy' },
      { number: 16, value: 'Mười Sáu' },
      { number: 15, value: 'Mười Lăm' },
      { number: 14, value: 'Mười Bốn' },
      { number: 13, value: 'Mười Ba' },
      { number: 12, value: 'Mười Hai' },
      { number: 11, value: 'Mười Một' },
      { number: 10, value: 'Mười' },
      { number: 9, value: 'Chín' },
      { number: 8, value: 'Tám' },
      { number: 7, value: 'Bảy' },
      { number: 6, value: 'Sáu' },
      { number: 5, value: 'Năm' },
      { number: 4, value: 'Bốn' },
      { number: 3, value: 'Ba' },
      { number: 2, value: 'Hai' },
      { number: 1, value: 'Một' },
      { number: 0, value: 'Không' },
    ],
    // CLDR vi: mốt and lăm after a ten (hai mươi mốt, mười lăm, hai mươi lăm); lẻ before a unit after
    // trăm/nghìn/triệu (một trăm lẻ một); ordinals are thứ + the cardinal.
    exactWordsMapping: [
      { number: 100, value: 'Một Trăm' },
      { number: 21, value: 'Hai Mươi Mốt' },
      { number: 25, value: 'Hai Mươi Lăm' },
      { number: 31, value: 'Ba Mươi Mốt' },
      { number: 35, value: 'Ba Mươi Lăm' },
      { number: 41, value: 'Bốn Mươi Mốt' },
      { number: 45, value: 'Bốn Mươi Lăm' },
      { number: 51, value: 'Năm Mươi Mốt' },
      { number: 55, value: 'Năm Mươi Lăm' },
      { number: 61, value: 'Sáu Mươi Mốt' },
      { number: 65, value: 'Sáu Mươi Lăm' },
      { number: 71, value: 'Bảy Mươi Mốt' },
      { number: 75, value: 'Bảy Mươi Lăm' },
      { number: 81, value: 'Tám Mươi Mốt' },
      { number: 85, value: 'Tám Mươi Lăm' },
      { number: 91, value: 'Chín Mươi Mốt' },
      { number: 95, value: 'Chín Mươi Lăm' },
    ],
    unitsAfterScaleWord: 'Lẻ',
    ordinalPrefix: 'Thứ ',
    ordinalComposition: 'fused-prefix',
    ordinalWordsMapping: [
      { number: 4, value: 'Thứ Tư' },
      { number: 1, value: 'Thứ Nhất' },
      { number: 0, value: 'Thứ Không' },
    ],
    fractionDenominatorMapping: {
      1: { singular: 'Phần Mười', plural: 'Phần Mười' },
      2: { singular: 'Phần Trăm', plural: 'Phần Trăm' },
      3: { singular: 'Phần Nghìn', plural: 'Phần Nghìn' },
      4: { singular: 'Phần Mười Nghìn', plural: 'Phần Mười Nghìn' },
      5: { singular: 'Phần Trăm Nghìn', plural: 'Phần Trăm Nghìn' },
      6: { singular: 'Phần Triệu', plural: 'Phần Triệu' },
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/vi-VN';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'vi-VN');
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

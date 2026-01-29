import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

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
      { number: 1000000000000, value: 'Nghìn Tỷ' },
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
      { number: 15, value: 'Mười Năm' },
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
    exactWordsMapping: [{ number: 100, value: 'Một Trăm' }],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Triệu Tỷ' },
      { number: 1000000000000, value: 'Nghìn Tỷ' },
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
      { number: 15, value: 'Mười Năm' },
      { number: 14, value: 'Mười Bốn' },
      { number: 13, value: 'Mười Ba' },
      { number: 12, value: 'Mười Hai' },
      { number: 11, value: 'Mười Một' },
      { number: 10, value: 'Thứ Mười' },
      { number: 9, value: 'Thứ Chín' },
      { number: 8, value: 'Thứ Tám' },
      { number: 7, value: 'Thứ Bảy' },
      { number: 6, value: 'Thứ Sáu' },
      { number: 5, value: 'Thứ Năm' },
      { number: 4, value: 'Thứ Tư' },
      { number: 3, value: 'Thứ Ba' },
      { number: 2, value: 'Thứ Hai' },
      { number: 1, value: 'Thứ Nhất' },
      { number: 0, value: 'Thứ Không' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Một Trăm' }],
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
    this.setLocale(Locale);
  }
}

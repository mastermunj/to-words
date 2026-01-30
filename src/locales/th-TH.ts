import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'บาท',
      plural: 'บาท',
      singular: 'บาท',
      symbol: '฿',
      fractionalUnit: {
        name: 'สตางค์',
        plural: 'สตางค์',
        singular: 'สตางค์',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: 'ลบ',
      only: 'ถ้วน',
      point: 'จุด',
    },
    trim: true,
    onlyInFront: false,
    numberWordsMapping: [
      { number: 1000000000000000, value: 'พันล้านล้าน' },
      { number: 1000000000000, value: 'ล้านล้าน' },
      { number: 1000000000, value: 'พันล้าน' },
      { number: 1000000, value: 'ล้าน' },
      { number: 100000, value: 'แสน' },
      { number: 10000, value: 'หมื่น' },
      { number: 1000, value: 'พัน' },
      { number: 100, value: 'ร้อย' },
      { number: 90, value: 'เก้าสิบ' },
      { number: 80, value: 'แปดสิบ' },
      { number: 70, value: 'เจ็ดสิบ' },
      { number: 60, value: 'หกสิบ' },
      { number: 50, value: 'ห้าสิบ' },
      { number: 40, value: 'สี่สิบ' },
      { number: 30, value: 'สามสิบ' },
      { number: 20, value: 'ยี่สิบ' },
      { number: 19, value: 'สิบเก้า' },
      { number: 18, value: 'สิบแปด' },
      { number: 17, value: 'สิบเจ็ด' },
      { number: 16, value: 'สิบหก' },
      { number: 15, value: 'สิบห้า' },
      { number: 14, value: 'สิบสี่' },
      { number: 13, value: 'สิบสาม' },
      { number: 12, value: 'สิบสอง' },
      { number: 11, value: 'สิบเอ็ด' },
      { number: 10, value: 'สิบ' },
      { number: 9, value: 'เก้า' },
      { number: 8, value: 'แปด' },
      { number: 7, value: 'เจ็ด' },
      { number: 6, value: 'หก' },
      { number: 5, value: 'ห้า' },
      { number: 4, value: 'สี่' },
      { number: 3, value: 'สาม' },
      { number: 2, value: 'สอง' },
      { number: 1, value: 'หนึ่ง' },
      { number: 0, value: 'ศูนย์' },
    ],
    exactWordsMapping: [{ number: 100, value: 'หนึ่งร้อย' }],
    ordinalSuffix: '',
    ordinalExactWordsMapping: [
      { number: 10, value: 'ที่สิบ' },
      { number: 9, value: 'ที่เก้า' },
      { number: 8, value: 'ที่แปด' },
      { number: 7, value: 'ที่เจ็ด' },
      { number: 6, value: 'ที่หก' },
      { number: 5, value: 'ที่ห้า' },
      { number: 4, value: 'ที่สี่' },
      { number: 3, value: 'ที่สาม' },
      { number: 2, value: 'ที่สอง' },
      { number: 1, value: 'ที่หนึ่ง' },
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'ที่พันล้านล้าน' },
      { number: 1000000000000, value: 'ที่ล้านล้าน' },
      { number: 1000000000, value: 'ที่พันล้าน' },
      { number: 1000000, value: 'ที่ล้าน' },
      { number: 100000, value: 'ที่แสน' },
      { number: 10000, value: 'ที่หมื่น' },
      { number: 1000, value: 'ที่พัน' },
      { number: 100, value: 'ที่ร้อย' },
      { number: 90, value: 'ที่เก้าสิบ' },
      { number: 80, value: 'ที่แปดสิบ' },
      { number: 70, value: 'ที่เจ็ดสิบ' },
      { number: 60, value: 'ที่หกสิบ' },
      { number: 50, value: 'ที่ห้าสิบ' },
      { number: 40, value: 'ที่สี่สิบ' },
      { number: 30, value: 'ที่สามสิบ' },
      { number: 20, value: 'ที่ยี่สิบ' },
      { number: 19, value: 'ที่สิบเก้า' },
      { number: 18, value: 'ที่สิบแปด' },
      { number: 17, value: 'ที่สิบเจ็ด' },
      { number: 16, value: 'ที่สิบหก' },
      { number: 15, value: 'ที่สิบห้า' },
      { number: 14, value: 'ที่สิบสี่' },
      { number: 13, value: 'ที่สิบสาม' },
      { number: 12, value: 'ที่สิบสอง' },
      { number: 11, value: 'ที่สิบเอ็ด' },
      { number: 10, value: 'ที่สิบ' },
      { number: 9, value: 'ที่เก้า' },
      { number: 8, value: 'ที่แปด' },
      { number: 7, value: 'ที่เจ็ด' },
      { number: 6, value: 'ที่หก' },
      { number: 5, value: 'ที่ห้า' },
      { number: 4, value: 'ที่สี่' },
      { number: 3, value: 'ที่สาม' },
      { number: 2, value: 'ที่สอง' },
      { number: 1, value: 'ที่หนึ่ง' },
      { number: 0, value: 'ที่ศูนย์' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/th-TH';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

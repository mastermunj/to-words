import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: '円',
      plural: '円',
      singular: '円',
      symbol: '¥',
      fractionalUnit: {
        name: '銭',
        singular: '銭',
        plural: '銭',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: 'マイナス',
      only: '',
      point: '点',
    },
    numberWordsMapping: [
      { number: 100000000000000000000n, value: '垓' },
      { number: 10000000000000000000n, value: '千京' },
      { number: 1000000000000000000n, value: '百京' },
      { number: 100000000000000000n, value: '十京' },
      { number: 10000000000000000n, value: '京' },
      { number: 1000000000000000, value: '千兆' },
      { number: 100000000000000, value: '百兆' },
      { number: 10000000000000, value: '十兆' },
      { number: 1000000000000, value: '兆' },
      { number: 100000000000, value: '千億' },
      { number: 10000000000, value: '百億' },
      { number: 1000000000, value: '十億' },
      { number: 100000000, value: '億' },
      { number: 10000000, value: '千万' },
      { number: 1000000, value: '百万' },
      { number: 100000, value: '十万' },
      { number: 10000, value: '万' },
      { number: 1000, value: '千' },
      { number: 100, value: '百' },
      { number: 90, value: '九十' },
      { number: 80, value: '八十' },
      { number: 70, value: '七十' },
      { number: 60, value: '六十' },
      { number: 50, value: '五十' },
      { number: 40, value: '四十' },
      { number: 30, value: '三十' },
      { number: 20, value: '二十' },
      { number: 10, value: '十' },
      { number: 9, value: '九' },
      { number: 8, value: '八' },
      { number: 7, value: '七' },
      { number: 6, value: '六' },
      { number: 5, value: '五' },
      { number: 4, value: '四' },
      { number: 3, value: '三' },
      { number: 2, value: '二' },
      { number: 1, value: '一' },
      { number: 0, value: '零' },
    ],
    ignoreOneForWords: [
      '十',
      '百',
      '千',
      '万',
      '十万',
      '百万',
      '千万',
      '億',
      '十億',
      '百億',
      '千億',
      '兆',
      '十兆',
      '百兆',
      '千兆',
    ],
    ordinalSuffix: '番目',
    ordinalExactWordsMapping: [
      { number: 1, value: '一番目' },
      { number: 2, value: '二番目' },
      { number: 3, value: '三番目' },
      { number: 4, value: '四番目' },
      { number: 5, value: '五番目' },
      { number: 6, value: '六番目' },
      { number: 7, value: '七番目' },
      { number: 8, value: '八番目' },
      { number: 9, value: '九番目' },
      { number: 10, value: '十番目' },
      { number: 20, value: '二十番目' },
      { number: 30, value: '三十番目' },
      { number: 40, value: '四十番目' },
      { number: 50, value: '五十番目' },
      { number: 60, value: '六十番目' },
      { number: 70, value: '七十番目' },
      { number: 80, value: '八十番目' },
      { number: 90, value: '九十番目' },
      { number: 100, value: '百番目' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ja-JP';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

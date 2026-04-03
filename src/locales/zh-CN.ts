import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: '元',
      plural: '元',
      singular: '元',
      symbol: '¥',
      fractionalUnit: {
        name: '分',
        singular: '分',
        plural: '分',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: '负',
      only: '整',
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
      { number: 100000000000, value: '千亿' },
      { number: 10000000000, value: '百亿' },
      { number: 1000000000, value: '十亿' },
      { number: 100000000, value: '亿' },
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
      '亿',
      '十亿',
      '百亿',
      '千亿',
      '兆',
      '十兆',
      '百兆',
      '千兆',
    ],
    ordinalWordsMapping: [
      { number: 100, value: '第百' },
      { number: 90, value: '第九十' },
      { number: 80, value: '第八十' },
      { number: 70, value: '第七十' },
      { number: 60, value: '第六十' },
      { number: 50, value: '第五十' },
      { number: 40, value: '第四十' },
      { number: 30, value: '第三十' },
      { number: 20, value: '第二十' },
      { number: 10, value: '第十' },
      { number: 9, value: '第九' },
      { number: 8, value: '第八' },
      { number: 7, value: '第七' },
      { number: 6, value: '第六' },
      { number: 5, value: '第五' },
      { number: 4, value: '第四' },
      { number: 3, value: '第三' },
      { number: 2, value: '第二' },
      { number: 1, value: '第一' },
      { number: 0, value: '第零' },
    ],
    ordinalExactWordsMapping: [
      { number: 1, value: '第一' },
      { number: 2, value: '第二' },
      { number: 3, value: '第三' },
      { number: 4, value: '第四' },
      { number: 5, value: '第五' },
      { number: 6, value: '第六' },
      { number: 7, value: '第七' },
      { number: 8, value: '第八' },
      { number: 9, value: '第九' },
      { number: 10, value: '第十' },
      { number: 20, value: '第二十' },
      { number: 30, value: '第三十' },
      { number: 40, value: '第四十' },
      { number: 50, value: '第五十' },
      { number: 60, value: '第六十' },
      { number: 70, value: '第七十' },
      { number: 80, value: '第八十' },
      { number: 90, value: '第九十' },
      { number: 100, value: '第百' },
    ],
    formalConfig: {
      numberWordsMapping: [
        { number: 100000000000000000000n, value: '垓' },
        { number: 10000000000000000000n, value: '仟京' },
        { number: 1000000000000000000n, value: '佰京' },
        { number: 100000000000000000n, value: '拾京' },
        { number: 10000000000000000n, value: '京' },
        { number: 1000000000000000, value: '仟兆' },
        { number: 100000000000000, value: '佰兆' },
        { number: 10000000000000, value: '拾兆' },
        { number: 1000000000000, value: '兆' },
        { number: 100000000000, value: '仟億' },
        { number: 10000000000, value: '佰億' },
        { number: 1000000000, value: '拾億' },
        { number: 100000000, value: '億' },
        { number: 10000000, value: '仟萬' },
        { number: 1000000, value: '佰萬' },
        { number: 100000, value: '拾萬' },
        { number: 10000, value: '萬' },
        { number: 1000, value: '仟' },
        { number: 100, value: '佰' },
        { number: 90, value: '玖拾' },
        { number: 80, value: '捌拾' },
        { number: 70, value: '柒拾' },
        { number: 60, value: '陆拾' },
        { number: 50, value: '伍拾' },
        { number: 40, value: '肆拾' },
        { number: 30, value: '叁拾' },
        { number: 20, value: '贰拾' },
        { number: 10, value: '拾' },
        { number: 9, value: '玖' },
        { number: 8, value: '捌' },
        { number: 7, value: '柒' },
        { number: 6, value: '陆' },
        { number: 5, value: '伍' },
        { number: 4, value: '肆' },
        { number: 3, value: '叁' },
        { number: 2, value: '贰' },
        { number: 1, value: '壹' },
        { number: 0, value: '零' },
      ],
      ignoreOneForWords: [
        '拾',
        '佰',
        '仟',
        '萬',
        '拾萬',
        '佰萬',
        '仟萬',
        '億',
        '拾億',
        '佰億',
        '仟億',
        '兆',
        '拾兆',
        '佰兆',
        '仟兆',
      ],
      currency: {
        name: '圆',
        plural: '圆',
        singular: '圆',
        symbol: '¥',
        fractionalUnit: {
          name: '分',
          singular: '分',
          plural: '分',
          symbol: '',
        },
      },
      ordinalWordsMapping: [
        { number: 100, value: '第佰' },
        { number: 90, value: '第玖拾' },
        { number: 80, value: '第捌拾' },
        { number: 70, value: '第柒拾' },
        { number: 60, value: '第陆拾' },
        { number: 50, value: '第伍拾' },
        { number: 40, value: '第肆拾' },
        { number: 30, value: '第叁拾' },
        { number: 20, value: '第贰拾' },
        { number: 10, value: '第拾' },
        { number: 9, value: '第玖' },
        { number: 8, value: '第捌' },
        { number: 7, value: '第柒' },
        { number: 6, value: '第陆' },
        { number: 5, value: '第伍' },
        { number: 4, value: '第肆' },
        { number: 3, value: '第叁' },
        { number: 2, value: '第贰' },
        { number: 1, value: '第壹' },
        { number: 0, value: '第零' },
      ],
      ordinalExactWordsMapping: [
        { number: 1, value: '第壹' },
        { number: 2, value: '第贰' },
        { number: 3, value: '第叁' },
        { number: 4, value: '第肆' },
        { number: 5, value: '第伍' },
        { number: 6, value: '第陆' },
        { number: 7, value: '第柒' },
        { number: 8, value: '第捌' },
        { number: 9, value: '第玖' },
        { number: 10, value: '第拾' },
        { number: 20, value: '第贰拾' },
        { number: 30, value: '第叁拾' },
        { number: 40, value: '第肆拾' },
        { number: 50, value: '第伍拾' },
        { number: 60, value: '第陆拾' },
        { number: 70, value: '第柒拾' },
        { number: 80, value: '第捌拾' },
        { number: 90, value: '第玖拾' },
        { number: 100, value: '第佰' },
      ],
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/zh-CN';
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

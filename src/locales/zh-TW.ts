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
      name: '元',
      plural: '元',
      singular: '元',
      symbol: 'NT$',
      fractionalUnit: {
        name: '分',
        singular: '分',
        plural: '分',
        symbol: '',
      },
    },
    texts: {
      and: '',
      minus: '負',
      only: '整',
      point: '點',
    },
    numberWordsMapping: [
      { number: 100000000000000000000n, value: '垓' },
      { number: 10000000000000000n, value: '京' },
      { number: 1000000000000, value: '兆' },
      { number: 100000000, value: '億' },
      { number: 10000, value: '萬' },
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
      { number: 10, value: '十', nonLeadingValue: '一十' },
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
    // 一 is dropped only before a leading 十 (十五; inside: 一百一十五); a skipped place reads 零
    // (一百零一); ordinals are 第 + the cardinal (CLDR zh: 第二十一, 第一百).
    ignoreOneForWords: ['十'],
    zeroForSkippedPlaces: true,
    exactWordsMapping: [{ number: 100, value: '一百' }],
    ordinalPrefix: '第',
    ordinalComposition: 'fused-prefix',
    ordinalWordsMapping: [
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
    formalConfig: {
      numberWordsMapping: [
        { number: 100000000000000000000n, value: '垓' },
        { number: 10000000000000000n, value: '京' },
        { number: 1000000000000, value: '兆' },
        { number: 100000000, value: '億' },
        { number: 10000, value: '萬' },
        { number: 1000, value: '仟' },
        { number: 100, value: '佰' },
        { number: 90, value: '玖拾' },
        { number: 80, value: '捌拾' },
        { number: 70, value: '柒拾' },
        { number: 60, value: '陸拾' },
        { number: 50, value: '伍拾' },
        { number: 40, value: '肆拾' },
        { number: 30, value: '參拾' },
        { number: 20, value: '貳拾' },
        { number: 10, value: '拾', nonLeadingValue: '壹拾' },
        { number: 9, value: '玖' },
        { number: 8, value: '捌' },
        { number: 7, value: '柒' },
        { number: 6, value: '陸' },
        { number: 5, value: '伍' },
        { number: 4, value: '肆' },
        { number: 3, value: '參' },
        { number: 2, value: '貳' },
        { number: 1, value: '壹' },
        { number: 0, value: '零' },
      ],
      ignoreOneForWords: ['拾'],
      exactWordsMapping: [{ number: 100, value: '壹佰' }],
      currency: {
        name: '圓',
        plural: '圓',
        singular: '圓',
        symbol: 'NT$',
        fractionalUnit: {
          name: '分',
          singular: '分',
          plural: '分',
          symbol: '',
        },
      },
      ordinalWordsMapping: [
        { number: 20, value: '第貳拾' },
        { number: 10, value: '第拾' },
        { number: 9, value: '第玖' },
        { number: 8, value: '第捌' },
        { number: 7, value: '第柒' },
        { number: 6, value: '第陸' },
        { number: 5, value: '第伍' },
        { number: 4, value: '第肆' },
        { number: 3, value: '第參' },
        { number: 2, value: '第貳' },
        { number: 1, value: '第壹' },
        { number: 0, value: '第零' },
      ],
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/zh-TW';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'zh-TW');
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

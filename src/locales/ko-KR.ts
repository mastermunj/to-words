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
      name: '원',
      plural: '원',
      symbol: '',
      fractionalUnit: {
        name: '',
        plural: '',
        symbol: '',
      },
    },
    texts: {
      and: '하고 ',
      minus: '마이너스',
      only: '',
      point: '점',
    },
    ordinalSuffix: '번째',
    // 일 is not spoken before 십, 백, 천, 만 (백십, 천, 만; CLDR ko), but is before 억 (일억).
    ignoreOneForWords: ['십', '백', '천', '만'],
    trim: true,
    ordinalExactWordsMapping: [
      // CLDR ko (spellout-ordinal-sinokorean-count): native numerals below 50 (열한 번째, 스물한 번째).
      { number: 49, value: '마흔아홉번째' },
      { number: 48, value: '마흔여덟번째' },
      { number: 47, value: '마흔일곱번째' },
      { number: 46, value: '마흔여섯번째' },
      { number: 45, value: '마흔다섯번째' },
      { number: 44, value: '마흔네번째' },
      { number: 43, value: '마흔세번째' },
      { number: 42, value: '마흔두번째' },
      { number: 41, value: '마흔한번째' },
      { number: 40, value: '마흔번째' },
      { number: 39, value: '서른아홉번째' },
      { number: 38, value: '서른여덟번째' },
      { number: 37, value: '서른일곱번째' },
      { number: 36, value: '서른여섯번째' },
      { number: 35, value: '서른다섯번째' },
      { number: 34, value: '서른네번째' },
      { number: 33, value: '서른세번째' },
      { number: 32, value: '서른두번째' },
      { number: 31, value: '서른한번째' },
      { number: 30, value: '서른번째' },
      { number: 29, value: '스물아홉번째' },
      { number: 28, value: '스물여덟번째' },
      { number: 27, value: '스물일곱번째' },
      { number: 26, value: '스물여섯번째' },
      { number: 25, value: '스물다섯번째' },
      { number: 24, value: '스물네번째' },
      { number: 23, value: '스물세번째' },
      { number: 22, value: '스물두번째' },
      { number: 21, value: '스물한번째' },
      { number: 20, value: '스무번째' },
      { number: 19, value: '열아홉번째' },
      { number: 18, value: '열여덟번째' },
      { number: 17, value: '열일곱번째' },
      { number: 16, value: '열여섯번째' },
      { number: 15, value: '열다섯번째' },
      { number: 14, value: '열네번째' },
      { number: 13, value: '열세번째' },
      { number: 12, value: '열두번째' },
      { number: 11, value: '열한번째' },
      { number: 10, value: '열째' },
      { number: 9, value: '아홉째' },
      { number: 8, value: '여덟째' },
      { number: 7, value: '일곱째' },
      { number: 6, value: '여섯째' },
      { number: 5, value: '다섯째' },
      { number: 4, value: '넷째' },
      { number: 3, value: '셋째' },
      { number: 2, value: '둘째' },
      { number: 1, value: '첫째' },
    ],
    numberWordsMapping: [
      { number: 100000000000000000000n, value: '해' },
      { number: 10000000000000000000n, value: '천경' },
      { number: 1000000000000000000n, value: '백경' },
      { number: 100000000000000000n, value: '십경' },
      { number: 10000000000000000n, value: '경' },
      { number: 1000000000000, value: '조' },
      { number: 100000000, value: '억' },
      { number: 10000, value: '만' },
      { number: 1000, value: '천' },
      { number: 100, value: '백' },
      { number: 90, value: '구십' },
      { number: 80, value: '팔십' },
      { number: 70, value: '칠십' },
      { number: 60, value: '육십' },
      { number: 50, value: '오십' },
      { number: 40, value: '사십' },
      { number: 30, value: '삼십' },
      { number: 20, value: '이십' },
      { number: 19, value: '십구' },
      { number: 18, value: '십팔' },
      { number: 17, value: '십칠' },
      { number: 16, value: '십육' },
      { number: 15, value: '십오' },
      { number: 14, value: '십사' },
      { number: 13, value: '십삼' },
      { number: 12, value: '십이' },
      { number: 11, value: '십일' },
      { number: 10, value: '십' },
      { number: 9, value: '구' },
      { number: 8, value: '팔' },
      { number: 7, value: '칠' },
      { number: 6, value: '육' },
      { number: 5, value: '오' },
      { number: 4, value: '사' },
      { number: 3, value: '삼' },
      { number: 2, value: '이' },
      { number: 1, value: '일' },
      { number: 0, value: '영' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ko-KR';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'ko-KR');
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

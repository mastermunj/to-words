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
      name: 'Рубель',
      plural: 'Рублёў',
      singular: 'Рубель',
      symbol: 'Br',
      gender: 'masculine',
      pluralForms: { one: 'Рубель', few: 'Рублі', many: 'Рублёў' },
      fractionalUnit: {
        name: 'Капейка',
        singular: 'Капейка',
        plural: 'Капеек',
        symbol: 'кап.',
        gender: 'feminine',
        pluralForms: { one: 'Капейка', few: 'Капейкі', many: 'Капеек' },
      },
    },
    texts: {
      and: 'І',
      minus: 'Мінус',
      only: 'Толькі',
      point: 'Цэлых',
    },
    numberWordsMapping: [
      { number: 1000000000000000000000n, value: 'Секстыльён' },
      { number: 1000000000000000000n, value: 'Квінтыльён' },
      { number: 1000000000000000, value: 'Квадрыльён' },
      { number: 1000000000000, value: 'Трыльён' },
      { number: 1000000000, value: 'Мільярд' },
      { number: 1000000, value: 'Мільён' },
      { number: 1000, value: 'Тысяча', singularValue: 'Тысяча', gender: 'feminine' },
      { number: 900, value: 'Дзевяцьсот' },
      { number: 800, value: 'Восемсот' },
      { number: 700, value: 'Семсот' },
      { number: 600, value: 'Шэсцьсот' },
      { number: 500, value: 'Пяцьсот' },
      { number: 400, value: 'Чатырыста' },
      { number: 300, value: 'Трыста' },
      { number: 200, value: 'Дзвесце' },
      { number: 100, value: 'Сто' },
      { number: 90, value: 'Дзевяноста' },
      { number: 80, value: 'Восемдзесят' },
      { number: 70, value: 'Семдзесят' },
      { number: 60, value: 'Шэсцьдзясят' },
      { number: 50, value: 'Пяцьдзясят' },
      { number: 40, value: 'Сорак' },
      { number: 30, value: 'Трыццаць' },
      { number: 20, value: 'Дваццаць' },
      { number: 19, value: 'Дзевятнаццаць' },
      { number: 18, value: 'Васямнаццаць' },
      { number: 17, value: 'Сямнаццаць' },
      { number: 16, value: 'Шаснаццаць' },
      { number: 15, value: 'Пятнаццаць' },
      { number: 14, value: 'Чатырнаццаць' },
      { number: 13, value: 'Трынаццаць' },
      { number: 12, value: 'Дванаццаць' },
      { number: 11, value: 'Адзінаццаць' },
      { number: 10, value: 'Дзесяць' },
      { number: 9, value: 'Дзевяць' },
      { number: 8, value: 'Восем' },
      { number: 7, value: 'Сем' },
      { number: 6, value: 'Шэсць' },
      { number: 5, value: 'Пяць' },
      { number: 4, value: 'Чатыры' },
      { number: 3, value: 'Тры' },
      { number: 2, value: 'Два', feminineValue: 'Дзве' },
      { number: 1, value: 'Адзін', feminineValue: 'Адна' },
      { number: 0, value: 'Нуль' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Сто' }],
    pluralForms: {
      1000: {
        paucal: 'Тысячы',
        plural: 'Тысяч',
      },
      1000000: {
        paucal: 'Мільёны',
        plural: 'Мільёнаў',
      },
      1000000000: {
        paucal: 'Мільярды',
        plural: 'Мільярдаў',
      },
      1000000000000: {
        paucal: 'Трыльёны',
        plural: 'Трыльёнаў',
      },
      1000000000000000: {
        paucal: 'Квадрыльёны',
        plural: 'Квадрыльёнаў',
      },
      1000000000000000000: {
        paucal: 'Квінтыльёны',
        plural: 'Квінтыльёнаў',
      },
      1000000000000000000000: {
        paucal: 'Секстыльёны',
        plural: 'Секстыльёнаў',
      },
    },
    pluralRule: 'east-slavic',
    keepOneBeforeInnerScales: true,
    ignoreOneForWords: [
      'Сто',
      'Дзвесце',
      'Трыста',
      'Чатырыста',
      'Пяцьсот',
      'Шэсцьсот',
      'Семсот',
      'Восемсот',
      'Дзевяцьсот',
      'Тысяча',
      'Мільён',
      'Мільярд',
      'Трыльён',
      'Квадрыльён',
      'Квінтыльён',
      'Секстыльён',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Секстыльённы' },
      { number: 1000000000000000000n, value: 'Квінтыльённы' },
      { number: 1000000000000000, value: 'Квадрыльённы' },
      { number: 1000000000000, value: 'Трыльённы' },
      { number: 1000000000, value: 'Мільярдны' },
      { number: 1000000, value: 'Мільённы' },
      { number: 1000, value: 'Тысячны' },
      { number: 900, value: 'Дзевяцісоты' },
      { number: 800, value: 'Васьмісоты' },
      { number: 700, value: 'Сямісоты' },
      { number: 600, value: 'Шасцісоты' },
      { number: 500, value: 'Пяцісоты' },
      { number: 400, value: 'Чатырохсоты' },
      { number: 300, value: 'Трохсоты' },
      { number: 200, value: 'Двухсоты' },
      { number: 100, value: 'Соты' },
      { number: 90, value: 'Дзевяносты' },
      { number: 80, value: 'Васьмідзясяты' },
      { number: 70, value: 'Сямідзясяты' },
      { number: 60, value: 'Шасцідзясяты' },
      { number: 50, value: 'Пяцідзясяты' },
      { number: 40, value: 'Саракавы' },
      { number: 30, value: 'Трыццаты' },
      { number: 20, value: 'Дваццаты' },
      { number: 19, value: 'Дзевятнаццаты' },
      { number: 18, value: 'Васямнаццаты' },
      { number: 17, value: 'Сямнаццаты' },
      { number: 16, value: 'Шаснаццаты' },
      { number: 15, value: 'Пятнаццаты' },
      { number: 14, value: 'Чатырнаццаты' },
      { number: 13, value: 'Трынаццаты' },
      { number: 12, value: 'Дванаццаты' },
      { number: 11, value: 'Адзінаццаты' },
      { number: 10, value: 'Дзясяты' },
      { number: 9, value: 'Дзявяты' },
      { number: 8, value: 'Восьмы' },
      { number: 7, value: 'Сёмы' },
      { number: 6, value: 'Шосты' },
      { number: 5, value: 'Пяты' },
      { number: 4, value: 'Чацвёрты' },
      { number: 3, value: 'Трэці' },
      { number: 2, value: 'Другі' },
      { number: 1, value: 'Першы' },
      { number: 0, value: 'Нулявы' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Соты' }],
    ordinalScaleStems: {
      900: 'дзевяцісот',
      800: 'васьмісот',
      700: 'сямісот',
      600: 'шасцісот',
      500: 'пяцісот',
      400: 'чатырохсот',
      300: 'трохсот',
      200: 'двухсот',
      100: 'ста',
      90: 'дзевяноста',
      80: 'васьмідзесяці',
      70: 'сямідзесяці',
      60: 'шасцідзесяці',
      50: 'пяцідзесяці',
      40: 'сарака',
      30: 'трыццаці',
      20: 'дваццаці',
      19: 'дзевятнаццаці',
      18: 'васямнаццаці',
      17: 'сямнаццаці',
      16: 'шаснаццаці',
      15: 'пятнаццаці',
      14: 'чатырнаццаці',
      13: 'трынаццаці',
      12: 'дванаццаці',
      11: 'адзінаццаці',
      10: 'дзесяці',
      9: 'дзевяці',
      8: 'васьмі',
      7: 'сямі',
      6: 'шасці',
      5: 'пяці',
      4: 'чатырох',
      3: 'трох',
      2: 'двух',
      1: 'адна',
    },
    fractionDenominatorMapping: {
      1: { singular: 'Дзясятая', plural: 'Дзясятых' },
      2: { singular: 'Сотая', plural: 'Сотых' },
      3: { singular: 'Тысячная', plural: 'Тысячных' },
      4: { singular: 'Дзесяцітысячная', plural: 'Дзесяцітысячных' },
      5: { singular: 'Статысячная', plural: 'Статысячных' },
      6: { singular: 'Мільённая', plural: 'Мільённых' },
      7: { singular: 'Дзесяцімільённая', plural: 'Дзесяцімільённых' },
      8: { singular: 'Стамільённая', plural: 'Стамільённых' },
      9: { singular: 'Мільярдная', plural: 'Мільярдных' },
      10: { singular: 'Дзесяцімільярдная', plural: 'Дзесяцімільярдных' },
      11: { singular: 'Стамільярдная', plural: 'Стамільярдных' },
      12: { singular: 'Трыльённая', plural: 'Трыльённых' },
      13: { singular: 'Дзесяцітрыльённая', plural: 'Дзесяцітрыльённых' },
      14: { singular: 'Статрыльённая', plural: 'Статрыльённых' },
      15: { singular: 'Квадрыльённая', plural: 'Квадрыльённых' },
    },
    fractionSingularRule: 'slavic',
    fractionReading: {
      isDefault: true,
      // be.wikipedia «Лічэбнік»: дзве цэлыя пятнаццаць сотых, чатыры сёмыя, сем цэлых пяць дзясятых.
      wholeForms: { one: 'Цэлая', few: 'Цэлыя', other: 'Цэлых' },
      denominatorForms: {
        1: { one: 'Дзясятая', few: 'Дзясятыя', other: 'Дзясятых' },
        2: { one: 'Сотая', few: 'Сотыя', other: 'Сотых' },
        3: { one: 'Тысячная', few: 'Тысячныя', other: 'Тысячных' },
        4: { one: 'Дзесяцітысячная', few: 'Дзесяцітысячныя', other: 'Дзесяцітысячных' },
        5: { one: 'Статысячная', few: 'Статысячныя', other: 'Статысячных' },
        6: { one: 'Мільённая', few: 'Мільённыя', other: 'Мільённых' },
        7: { one: 'Дзесяцімільённая', few: 'Дзесяцімільённыя', other: 'Дзесяцімільённых' },
        8: { one: 'Стамільённая', few: 'Стамільённыя', other: 'Стамільённых' },
        9: { one: 'Мільярдная', few: 'Мільярдныя', other: 'Мільярдных' },
        10: { one: 'Дзесяцімільярдная', few: 'Дзесяцімільярдныя', other: 'Дзесяцімільярдных' },
        11: { one: 'Стамільярдная', few: 'Стамільярдныя', other: 'Стамільярдных' },
        12: { one: 'Трыльённая', few: 'Трыльённыя', other: 'Трыльённых' },
        13: { one: 'Дзесяцітрыльённая', few: 'Дзесяцітрыльённыя', other: 'Дзесяцітрыльённых' },
        14: { one: 'Статрыльённая', few: 'Статрыльённыя', other: 'Статрыльённых' },
        15: { one: 'Квадрыльённая', few: 'Квадрыльённыя', other: 'Квадрыльённых' },
      },
      gender: 'feminine',
    },
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/be-BY';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'be-BY');
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

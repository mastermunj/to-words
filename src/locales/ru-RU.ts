import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Рубль',
      plural: 'Рублей',
      singular: 'Рубль',
      symbol: '₽',
      fractionalUnit: {
        name: 'Копейка',
        singular: 'Копейка',
        plural: 'Копеек',
        symbol: 'коп.',
      },
    },
    texts: {
      and: 'И',
      minus: 'Минус',
      only: 'Только',
      point: 'Целых',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Квадриллион' },
      { number: 1000000000000, value: 'Триллион' },
      { number: 1000000000, value: 'Миллиард' },
      { number: 1000000, value: 'Миллион' },
      { number: 1000, value: 'Тысяча', singularValue: 'Тысяча' },
      { number: 900, value: 'Девятьсот' },
      { number: 800, value: 'Восемьсот' },
      { number: 700, value: 'Семьсот' },
      { number: 600, value: 'Шестьсот' },
      { number: 500, value: 'Пятьсот' },
      { number: 400, value: 'Четыреста' },
      { number: 300, value: 'Триста' },
      { number: 200, value: 'Двести' },
      { number: 100, value: 'Сто' },
      { number: 90, value: 'Девяносто' },
      { number: 80, value: 'Восемьдесят' },
      { number: 70, value: 'Семьдесят' },
      { number: 60, value: 'Шестьдесят' },
      { number: 50, value: 'Пятьдесят' },
      { number: 40, value: 'Сорок' },
      { number: 30, value: 'Тридцать' },
      { number: 20, value: 'Двадцать' },
      { number: 19, value: 'Девятнадцать' },
      { number: 18, value: 'Восемнадцать' },
      { number: 17, value: 'Семнадцать' },
      { number: 16, value: 'Шестнадцать' },
      { number: 15, value: 'Пятнадцать' },
      { number: 14, value: 'Четырнадцать' },
      { number: 13, value: 'Тринадцать' },
      { number: 12, value: 'Двенадцать' },
      { number: 11, value: 'Одиннадцать' },
      { number: 10, value: 'Десять' },
      { number: 9, value: 'Девять' },
      { number: 8, value: 'Восемь' },
      { number: 7, value: 'Семь' },
      { number: 6, value: 'Шесть' },
      { number: 5, value: 'Пять' },
      { number: 4, value: 'Четыре' },
      { number: 3, value: 'Три' },
      { number: 2, value: 'Два' },
      { number: 1, value: 'Один' },
      { number: 0, value: 'Ноль' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Сто' }],
    pluralForms: {
      1000: {
        paucal: 'Тысячи',
        plural: 'Тысяч',
      },
      1000000: {
        paucal: 'Миллиона',
        plural: 'Миллионов',
      },
      1000000000: {
        paucal: 'Миллиарда',
        plural: 'Миллиардов',
      },
      1000000000000: {
        paucal: 'Триллиона',
        plural: 'Триллионов',
      },
      1000000000000000: {
        paucal: 'Квадриллиона',
        plural: 'Квадриллионов',
      },
    },
    paucalConfig: {
      min: 2,
      max: 4,
    },
    ignoreOneForWords: [
      'Сто',
      'Двести',
      'Триста',
      'Четыреста',
      'Пятьсот',
      'Шестьсот',
      'Семьсот',
      'Восемьсот',
      'Девятьсот',
      'Тысяча',
      'Миллион',
      'Миллиард',
      'Триллион',
      'Квадриллион',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Квадриллионный' },
      { number: 1000000000000, value: 'Триллионный' },
      { number: 1000000000, value: 'Миллиардный' },
      { number: 1000000, value: 'Миллионный' },
      { number: 1000, value: 'Тысячный' },
      { number: 900, value: 'Девятисотый' },
      { number: 800, value: 'Восьмисотый' },
      { number: 700, value: 'Семисотый' },
      { number: 600, value: 'Шестисотый' },
      { number: 500, value: 'Пятисотый' },
      { number: 400, value: 'Четырёхсотый' },
      { number: 300, value: 'Трёхсотый' },
      { number: 200, value: 'Двухсотый' },
      { number: 100, value: 'Сотый' },
      { number: 90, value: 'Девяностый' },
      { number: 80, value: 'Восьмидесятый' },
      { number: 70, value: 'Семидесятый' },
      { number: 60, value: 'Шестидесятый' },
      { number: 50, value: 'Пятидесятый' },
      { number: 40, value: 'Сороковой' },
      { number: 30, value: 'Тридцатый' },
      { number: 20, value: 'Двадцатый' },
      { number: 19, value: 'Девятнадцатый' },
      { number: 18, value: 'Восемнадцатый' },
      { number: 17, value: 'Семнадцатый' },
      { number: 16, value: 'Шестнадцатый' },
      { number: 15, value: 'Пятнадцатый' },
      { number: 14, value: 'Четырнадцатый' },
      { number: 13, value: 'Тринадцатый' },
      { number: 12, value: 'Двенадцатый' },
      { number: 11, value: 'Одиннадцатый' },
      { number: 10, value: 'Десятый' },
      { number: 9, value: 'Девятый' },
      { number: 8, value: 'Восьмой' },
      { number: 7, value: 'Седьмой' },
      { number: 6, value: 'Шестой' },
      { number: 5, value: 'Пятый' },
      { number: 4, value: 'Четвёртый' },
      { number: 3, value: 'Третий' },
      { number: 2, value: 'Второй' },
      { number: 1, value: 'Первый' },
      { number: 0, value: 'Нулевой' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Сотый' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ru-RU';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

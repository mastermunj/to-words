import { LocaleInterface } from './locale.interface';

export class Locale implements LocaleInterface {
  public currency = {
    name: 'تومان',
    plural: 'تومان',
    symbol: 'تومان',
    fractionalUnit: {
      name: '',
      plural: '',
      symbol: '',
    },
  };

  public texts = {
    and: 'و',
    minus: 'منفی',
    only: '',
    point: 'و',
  };

  public splitters = {
    splitWord: 'و',
  };

  public numberWordsMapping = [
    { number: 1000000000000000, value: 'کوادریلیون' },
    { number: 1000000000000, value: 'تیلیارد' },
    { number: 1000000000, value: 'میلیارد' },
    { number: 1000000, value: 'میلیون' },
    { number: 1000, value: 'هزار' },
    { number: 100, value: 'صد' },
    { number: 90, value: 'نود' },
    { number: 80, value: 'هشتاد' },
    { number: 70, value: 'هفتاد' },
    { number: 60, value: 'شصت' },
    { number: 50, value: 'پنجاه' },
    { number: 40, value: 'چهل' },
    { number: 30, value: 'سی' },
    { number: 20, value: 'بیست' },
    { number: 19, value: 'نوزده' },
    { number: 18, value: 'هجده' },
    { number: 17, value: 'هفده' },
    { number: 16, value: 'شانزده' },
    { number: 15, value: 'پانزده' },
    { number: 14, value: 'چهارده' },
    { number: 13, value: 'سیزده' },
    { number: 12, value: 'دوازده' },
    { number: 11, value: 'یازده' },
    { number: 10, value: 'ده' },
    { number: 9, value: 'نه' },
    { number: 8, value: 'هشت' },
    { number: 7, value: 'هفت' },
    { number: 6, value: 'شش' },
    { number: 5, value: 'پنج' },
    { number: 4, value: 'چهار' },
    { number: 3, value: 'سه' },
    { number: 2, value: 'دو' },
    { number: 1, value: 'یک' },
    { number: 0, value: 'صفر' },
  ];
}

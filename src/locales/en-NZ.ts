import { LocaleConfig, LocaleInterface, ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class LocaleEnNZ implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'New Zealand Dollar',
      plural: 'New Zealand Dollars',
      singular: 'New Zealand Dollar',
      symbol: 'NZ$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        singular: 'Cent',
        symbol: 'c',
      },
    },
    texts: {
      and: 'and',
      minus: 'Minus',
      only: 'Only',
      point: 'Point',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Quadrillion' },
      { number: 1000000000000, value: 'Trillion' },
      { number: 1000000000, value: 'Billion' },
      { number: 1000000, value: 'Million' },
      { number: 1000, value: 'Thousand' },
      { number: 100, value: 'Hundred' },
      { number: 90, value: 'Ninety' },
      { number: 80, value: 'Eighty' },
      { number: 70, value: 'Seventy' },
      { number: 60, value: 'Sixty' },
      { number: 50, value: 'Fifty' },
      { number: 40, value: 'Forty' },
      { number: 30, value: 'Thirty' },
      { number: 20, value: 'Twenty' },
      { number: 19, value: 'Nineteen' },
      { number: 18, value: 'Eighteen' },
      { number: 17, value: 'Seventeen' },
      { number: 16, value: 'Sixteen' },
      { number: 15, value: 'Fifteen' },
      { number: 14, value: 'Fourteen' },
      { number: 13, value: 'Thirteen' },
      { number: 12, value: 'Twelve' },
      { number: 11, value: 'Eleven' },
      { number: 10, value: 'Ten' },
      { number: 9, value: 'Nine' },
      { number: 8, value: 'Eight' },
      { number: 7, value: 'Seven' },
      { number: 6, value: 'Six' },
      { number: 5, value: 'Five' },
      { number: 4, value: 'Four' },
      { number: 3, value: 'Three' },
      { number: 2, value: 'Two' },
      { number: 1, value: 'One' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'One hundred' }],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Quadrillionth' },
      { number: 1000000000000, value: 'Trillionth' },
      { number: 1000000000, value: 'Billionth' },
      { number: 1000000, value: 'Millionth' },
      { number: 1000, value: 'Thousandth' },
      { number: 100, value: 'Hundredth' },
      { number: 90, value: 'Ninetieth' },
      { number: 80, value: 'Eightieth' },
      { number: 70, value: 'Seventieth' },
      { number: 60, value: 'Sixtieth' },
      { number: 50, value: 'Fiftieth' },
      { number: 40, value: 'Fortieth' },
      { number: 30, value: 'Thirtieth' },
      { number: 20, value: 'Twentieth' },
      { number: 19, value: 'Nineteenth' },
      { number: 18, value: 'Eighteenth' },
      { number: 17, value: 'Seventeenth' },
      { number: 16, value: 'Sixteenth' },
      { number: 15, value: 'Fifteenth' },
      { number: 14, value: 'Fourteenth' },
      { number: 13, value: 'Thirteenth' },
      { number: 12, value: 'Twelfth' },
      { number: 11, value: 'Eleventh' },
      { number: 10, value: 'Tenth' },
      { number: 9, value: 'Ninth' },
      { number: 8, value: 'Eighth' },
      { number: 7, value: 'Seventh' },
      { number: 6, value: 'Sixth' },
      { number: 5, value: 'Fifth' },
      { number: 4, value: 'Fourth' },
      { number: 3, value: 'Third' },
      { number: 2, value: 'Second' },
      { number: 1, value: 'First' },
      { number: 0, value: 'Zeroth' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'One Hundredth' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/en-NZ';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(LocaleEnNZ);
  }
}

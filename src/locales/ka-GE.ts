import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'ლარი',
      plural: 'ლარი',
      singular: 'ლარი',
      symbol: '₾',
      fractionalUnit: {
        name: 'თეთრი',
        singular: 'თეთრი',
        plural: 'თეთრი',
        symbol: '',
      },
    },
    texts: {
      and: 'და',
      minus: 'მინუს',
      only: '',
      point: 'მძიმე',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'კვადრილიონი' },
      { number: 1000000000000, value: 'ტრილიონი' },
      { number: 1000000000, value: 'მილიარდი' },
      { number: 1000000, value: 'მილიონი' },
      { number: 1000, value: 'ათასი' },
      { number: 100, value: 'ასი' },
      { number: 90, value: 'ოთხმოცდაათი' },
      { number: 80, value: 'ოთხმოცი' },
      { number: 70, value: 'სამოცდაათი' },
      { number: 60, value: 'სამოცი' },
      { number: 50, value: 'ორმოცდაათი' },
      { number: 40, value: 'ორმოცი' },
      { number: 30, value: 'ოცდაათი' },
      { number: 20, value: 'ოცი' },
      { number: 19, value: 'ცხრამეტი' },
      { number: 18, value: 'თვრამეტი' },
      { number: 17, value: 'ჩვიდმეტი' },
      { number: 16, value: 'თექვსმეტი' },
      { number: 15, value: 'თხუთმეტი' },
      { number: 14, value: 'თოთხმეტი' },
      { number: 13, value: 'ცამეტი' },
      { number: 12, value: 'თორმეტი' },
      { number: 11, value: 'თერთმეტი' },
      { number: 10, value: 'ათი' },
      { number: 9, value: 'ცხრა' },
      { number: 8, value: 'რვა' },
      { number: 7, value: 'შვიდი' },
      { number: 6, value: 'ექვსი' },
      { number: 5, value: 'ხუთი' },
      { number: 4, value: 'ოთხი' },
      { number: 3, value: 'სამი' },
      { number: 2, value: 'ორი' },
      { number: 1, value: 'ერთი' },
      { number: 0, value: 'ნული' },
    ],
    exactWordsMapping: [
      { number: 900, value: 'ცხრაასი' },
      { number: 800, value: 'რვაასი' },
      { number: 700, value: 'შვიდასი' },
      { number: 600, value: 'ექვსასი' },
      { number: 500, value: 'ხუთასი' },
      { number: 400, value: 'ოთხასი' },
      { number: 300, value: 'სამასი' },
      { number: 200, value: 'ორასი' },
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'კვადრილიონე' },
      { number: 1000000000000, value: 'ტრილიონე' },
      { number: 1000000000, value: 'მილიარდე' },
      { number: 1000000, value: 'მილიონე' },
      { number: 1000, value: 'ათასე' },
      { number: 100, value: 'მეასე' },
      { number: 90, value: 'მეოთხმოცდაათე' },
      { number: 80, value: 'მეოთხმოცე' },
      { number: 70, value: 'მესამოცდაათე' },
      { number: 60, value: 'მესამოცე' },
      { number: 50, value: 'მეორმოცდაათე' },
      { number: 40, value: 'მეორმოცე' },
      { number: 30, value: 'მეოცდაათე' },
      { number: 20, value: 'მეოცე' },
      { number: 19, value: 'მეცხრამეტე' },
      { number: 18, value: 'მეთვრამეტე' },
      { number: 17, value: 'მეჩვიდმეტე' },
      { number: 16, value: 'მეთექვსმეტე' },
      { number: 15, value: 'მეთხუთმეტე' },
      { number: 14, value: 'მეთოთხმეტე' },
      { number: 13, value: 'მეცამეტე' },
      { number: 12, value: 'მეთორმეტე' },
      { number: 11, value: 'მეთერთმეტე' },
      { number: 10, value: 'მეათე' },
      { number: 9, value: 'მეცხრე' },
      { number: 8, value: 'მერვე' },
      { number: 7, value: 'მეშვიდე' },
      { number: 6, value: 'მეექვსე' },
      { number: 5, value: 'მეხუთე' },
      { number: 4, value: 'მეოთხე' },
      { number: 3, value: 'მესამე' },
      { number: 2, value: 'მეორე' },
      { number: 1, value: 'პირველი' },
      { number: 0, value: 'ნულოვანი' },
    ],
    ordinalExactWordsMapping: [
      { number: 900, value: 'მეცხრაასე' },
      { number: 800, value: 'მერვაასე' },
      { number: 700, value: 'მეშვიდასე' },
      { number: 600, value: 'მეექვსასე' },
      { number: 500, value: 'მეხუთასე' },
      { number: 400, value: 'მეოთხასე' },
      { number: 300, value: 'მესამასე' },
      { number: 200, value: 'მეორასე' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/ka-GE';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

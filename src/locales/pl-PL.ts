import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Złoty',
      plural: 'Złotych',
      singular: 'Złoty',
      symbol: 'zł',
      fractionalUnit: {
        name: 'Grosz',
        singular: 'Grosz',
        plural: 'Groszy',
        symbol: 'gr',
      },
    },
    texts: {
      and: 'I',
      minus: 'Minus',
      only: 'Tylko',
      point: 'Przecinek',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Biliard' },
      { number: 1000000000000, value: 'Bilion' },
      { number: 1000000000, value: 'Miliard' },
      { number: 1000000, value: 'Milion' },
      { number: 1000, value: 'Tysiąc', singularValue: 'Tysiąc' },
      { number: 900, value: 'Dziewięćset' },
      { number: 800, value: 'Osiemset' },
      { number: 700, value: 'Siedemset' },
      { number: 600, value: 'Sześćset' },
      { number: 500, value: 'Pięćset' },
      { number: 400, value: 'Czterysta' },
      { number: 300, value: 'Trzysta' },
      { number: 200, value: 'Dwieście' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Dziewięćdziesiąt' },
      { number: 80, value: 'Osiemdziesiąt' },
      { number: 70, value: 'Siedemdziesiąt' },
      { number: 60, value: 'Sześćdziesiąt' },
      { number: 50, value: 'Pięćdziesiąt' },
      { number: 40, value: 'Czterdzieści' },
      { number: 30, value: 'Trzydzieści' },
      { number: 20, value: 'Dwadzieścia' },
      { number: 19, value: 'Dziewiętnaście' },
      { number: 18, value: 'Osiemnaście' },
      { number: 17, value: 'Siedemnaście' },
      { number: 16, value: 'Szesnaście' },
      { number: 15, value: 'Piętnaście' },
      { number: 14, value: 'Czternaście' },
      { number: 13, value: 'Trzynaście' },
      { number: 12, value: 'Dwanaście' },
      { number: 11, value: 'Jedenaście' },
      { number: 10, value: 'Dziesięć' },
      { number: 9, value: 'Dziewięć' },
      { number: 8, value: 'Osiem' },
      { number: 7, value: 'Siedem' },
      { number: 6, value: 'Sześć' },
      { number: 5, value: 'Pięć' },
      { number: 4, value: 'Cztery' },
      { number: 3, value: 'Trzy' },
      { number: 2, value: 'Dwa' },
      { number: 1, value: 'Jeden' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000: {
        paucal: 'Tysiące',
        plural: 'Tysięcy',
      },
      1000000: {
        paucal: 'Miliony',
        plural: 'Milionów',
      },
      1000000000: {
        paucal: 'Miliardy',
        plural: 'Miliardów',
      },
      1000000000000: {
        paucal: 'Biliony',
        plural: 'Bilionów',
      },
      1000000000000000: {
        paucal: 'Biliardy',
        plural: 'Biliardów',
      },
    },
    paucalConfig: {
      min: 2,
      max: 4,
    },
    ignoreOneForWords: [
      'Sto',
      'Dwieście',
      'Trzysta',
      'Czterysta',
      'Pięćset',
      'Sześćset',
      'Siedemset',
      'Osiemset',
      'Dziewięćset',
      'Tysiąc',
      'Milion',
      'Miliard',
      'Bilion',
      'Biliard',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Biliardowy' },
      { number: 1000000000000, value: 'Bilionowy' },
      { number: 1000000000, value: 'Miliardowy' },
      { number: 1000000, value: 'Milionowy' },
      { number: 1000, value: 'Tysięczny' },
      { number: 900, value: 'Dziewięćsetny' },
      { number: 800, value: 'Osiemsetny' },
      { number: 700, value: 'Siedemsetny' },
      { number: 600, value: 'Sześćsetny' },
      { number: 500, value: 'Pięćsetny' },
      { number: 400, value: 'Czterysetny' },
      { number: 300, value: 'Trzechsetny' },
      { number: 200, value: 'Dwusetny' },
      { number: 100, value: 'Setny' },
      { number: 90, value: 'Dziewięćdziesiąty' },
      { number: 80, value: 'Osiemdziesiąty' },
      { number: 70, value: 'Siedemdziesiąty' },
      { number: 60, value: 'Sześćdziesiąty' },
      { number: 50, value: 'Pięćdziesiąty' },
      { number: 40, value: 'Czterdziesty' },
      { number: 30, value: 'Trzydziesty' },
      { number: 20, value: 'Dwudziesty' },
      { number: 19, value: 'Dziewiętnasty' },
      { number: 18, value: 'Osiemnasty' },
      { number: 17, value: 'Siedemnasty' },
      { number: 16, value: 'Szesnasty' },
      { number: 15, value: 'Piętnasty' },
      { number: 14, value: 'Czternasty' },
      { number: 13, value: 'Trzynasty' },
      { number: 12, value: 'Dwunasty' },
      { number: 11, value: 'Jedenasty' },
      { number: 10, value: 'Dziesiąty' },
      { number: 9, value: 'Dziewiąty' },
      { number: 8, value: 'Ósmy' },
      { number: 7, value: 'Siódmy' },
      { number: 6, value: 'Szósty' },
      { number: 5, value: 'Piąty' },
      { number: 4, value: 'Czwarty' },
      { number: 3, value: 'Trzeci' },
      { number: 2, value: 'Drugi' },
      { number: 1, value: 'Pierwszy' },
      { number: 0, value: 'Zerowy' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Setny' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/pl-PL';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

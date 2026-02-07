import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Euro',
      plural: 'Evrov',
      singular: 'Evro',
      symbol: '€',
      fractionalUnit: {
        name: 'Cent',
        singular: 'Cent',
        plural: 'Centov',
        symbol: 'c',
      },
    },
    texts: {
      and: 'In',
      minus: 'Minus',
      only: 'Samo',
      point: 'Vejica',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Bilijarda' },
      { number: 1000000000000, value: 'Bilijon' },
      { number: 1000000000, value: 'Milijarda' },
      { number: 1000000, value: 'Milijon' },
      { number: 1000, value: 'Tisoč' },
      { number: 900, value: 'Devetsto' },
      { number: 800, value: 'Osemsto' },
      { number: 700, value: 'Sedemsto' },
      { number: 600, value: 'Šeststo' },
      { number: 500, value: 'Petsto' },
      { number: 400, value: 'Štiristo' },
      { number: 300, value: 'Tristo' },
      { number: 200, value: 'Dvesto' },
      { number: 100, value: 'Sto' },
      { number: 90, value: 'Devetdeset' },
      { number: 80, value: 'Osemdeset' },
      { number: 70, value: 'Sedemdeset' },
      { number: 60, value: 'Šestdeset' },
      { number: 50, value: 'Petdeset' },
      { number: 40, value: 'Štirideset' },
      { number: 30, value: 'Trideset' },
      { number: 20, value: 'Dvajset' },
      { number: 19, value: 'Devetnajst' },
      { number: 18, value: 'Osemnajst' },
      { number: 17, value: 'Sedemnajst' },
      { number: 16, value: 'Šestnajst' },
      { number: 15, value: 'Petnajst' },
      { number: 14, value: 'Štirinajst' },
      { number: 13, value: 'Trinajst' },
      { number: 12, value: 'Dvanajst' },
      { number: 11, value: 'Enajst' },
      { number: 10, value: 'Deset' },
      { number: 9, value: 'Devet' },
      { number: 8, value: 'Osem' },
      { number: 7, value: 'Sedem' },
      { number: 6, value: 'Šest' },
      { number: 5, value: 'Pet' },
      { number: 4, value: 'Štiri' },
      { number: 3, value: 'Tri' },
      { number: 2, value: 'Dva' },
      { number: 1, value: 'Ena' },
      { number: 0, value: 'Nič' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralForms: {
      1000000: {
        paucal: 'Milijone',
        plural: 'Milijonov',
      },
      1000000000: {
        paucal: 'Milijarde',
        plural: 'Milijard',
      },
      1000000000000: {
        paucal: 'Bilijoni',
        plural: 'Bilijonov',
      },
      1000000000000000: {
        paucal: 'Bilijarde',
        plural: 'Bilijard',
      },
    },
    paucalConfig: {
      min: 2,
      max: 4,
    },
    ignoreOneForWords: [
      'Sto',
      'Dvesto',
      'Tristo',
      'Štiristo',
      'Petsto',
      'Šeststo',
      'Sedemsto',
      'Osemsto',
      'Devetsto',
      'Tisoč',
      'Milijon',
      'Milijarda',
      'Bilijon',
      'Bilijarda',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Bilijardti' },
      { number: 1000000000000, value: 'Bilijonti' },
      { number: 1000000000, value: 'Milijardti' },
      { number: 1000000, value: 'Milijonti' },
      { number: 1000, value: 'Tisoči' },
      { number: 900, value: 'Devetstoti' },
      { number: 800, value: 'Osemstoti' },
      { number: 700, value: 'Sedemstoti' },
      { number: 600, value: 'Šeststoti' },
      { number: 500, value: 'Petstoti' },
      { number: 400, value: 'Štiristoti' },
      { number: 300, value: 'Tristoti' },
      { number: 200, value: 'Dvestoti' },
      { number: 100, value: 'Stoti' },
      { number: 90, value: 'Devetdeseti' },
      { number: 80, value: 'Osemdeseti' },
      { number: 70, value: 'Sedemdeseti' },
      { number: 60, value: 'Šestdeseti' },
      { number: 50, value: 'Petdeseti' },
      { number: 40, value: 'Štirideseti' },
      { number: 30, value: 'Trideseti' },
      { number: 20, value: 'Dvajseti' },
      { number: 19, value: 'Devetnajsti' },
      { number: 18, value: 'Osemnajsti' },
      { number: 17, value: 'Sedemnajsti' },
      { number: 16, value: 'Šestnajsti' },
      { number: 15, value: 'Petnajsti' },
      { number: 14, value: 'Štirinajsti' },
      { number: 13, value: 'Trinajsti' },
      { number: 12, value: 'Dvanajsti' },
      { number: 11, value: 'Enajsti' },
      { number: 10, value: 'Deseti' },
      { number: 9, value: 'Deveti' },
      { number: 8, value: 'Osmi' },
      { number: 7, value: 'Sedmi' },
      { number: 6, value: 'Šesti' },
      { number: 5, value: 'Peti' },
      { number: 4, value: 'Četrti' },
      { number: 3, value: 'Tretji' },
      { number: 2, value: 'Drugi' },
      { number: 1, value: 'Prvi' },
      { number: 0, value: 'Ničti' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Stoti' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/sl-SI';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

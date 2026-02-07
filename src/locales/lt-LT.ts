import { type LocaleConfig, type LocaleInterface, type ToWordsOptions } from '../types.js';
import { ToWordsCore } from '../ToWordsCore.js';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'Euras',
      plural: 'Eurų',
      singular: 'Euras',
      symbol: '€',
      fractionalUnit: {
        name: 'Centas',
        singular: 'Centas',
        plural: 'Centų',
        symbol: 'ct',
      },
    },
    texts: {
      and: 'Ir',
      minus: 'Minus',
      only: 'Tik',
      point: 'Kablelis',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Biliardas' },
      { number: 1000000000000, value: 'Trilijonas' },
      { number: 1000000000, value: 'Milijardas' },
      { number: 1000000, value: 'Milijonas' },
      { number: 1000, value: 'Tūkstantis', singularValue: 'Tūkstantis' },
      { number: 900, value: 'Devyni Šimtai' },
      { number: 800, value: 'Aštuoni Šimtai' },
      { number: 700, value: 'Septyni Šimtai' },
      { number: 600, value: 'Šeši Šimtai' },
      { number: 500, value: 'Penki Šimtai' },
      { number: 400, value: 'Keturi Šimtai' },
      { number: 300, value: 'Trys Šimtai' },
      { number: 200, value: 'Du Šimtai' },
      { number: 100, value: 'Šimtas' },
      { number: 90, value: 'Devyniasdešimt' },
      { number: 80, value: 'Aštuoniasdešimt' },
      { number: 70, value: 'Septyniasdešimt' },
      { number: 60, value: 'Šešiasdešimt' },
      { number: 50, value: 'Penkiasdešimt' },
      { number: 40, value: 'Keturiasdešimt' },
      { number: 30, value: 'Trisdešimt' },
      { number: 20, value: 'Dvidešimt' },
      { number: 19, value: 'Devyniolika' },
      { number: 18, value: 'Aštuoniolika' },
      { number: 17, value: 'Septyniolika' },
      { number: 16, value: 'Šešiolika' },
      { number: 15, value: 'Penkiolika' },
      { number: 14, value: 'Keturiolika' },
      { number: 13, value: 'Trylika' },
      { number: 12, value: 'Dvylika' },
      { number: 11, value: 'Vienuolika' },
      { number: 10, value: 'Dešimt' },
      { number: 9, value: 'Devyni' },
      { number: 8, value: 'Aštuoni' },
      { number: 7, value: 'Septyni' },
      { number: 6, value: 'Šeši' },
      { number: 5, value: 'Penki' },
      { number: 4, value: 'Keturi' },
      { number: 3, value: 'Trys' },
      { number: 2, value: 'Du' },
      { number: 1, value: 'Vienas' },
      { number: 0, value: 'Nulis' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Šimtas' }],
    pluralForms: {
      1000: {
        paucal: 'Tūkstančiai',
        plural: 'Tūkstančių',
      },
      1000000: {
        paucal: 'Milijonai',
        plural: 'Milijonų',
      },
      1000000000: {
        paucal: 'Milijardai',
        plural: 'Milijardų',
      },
      1000000000000: {
        paucal: 'Trilijonai',
        plural: 'Trilijonų',
      },
      1000000000000000: {
        paucal: 'Biliardai',
        plural: 'Biliardų',
      },
    },
    paucalConfig: {
      min: 2,
      max: 9,
    },
    ignoreOneForWords: [
      'Šimtas',
      'Du Šimtai',
      'Trys Šimtai',
      'Keturi Šimtai',
      'Penki Šimtai',
      'Šeši Šimtai',
      'Septyni Šimtai',
      'Aštuoni Šimtai',
      'Devyni Šimtai',
      'Tūkstantis',
      'Milijonas',
      'Milijardas',
      'Trilijonas',
      'Biliardas',
    ],
    ordinalWordsMapping: [
      { number: 1000000000000000, value: 'Biliardasis' },
      { number: 1000000000000, value: 'Trilijonasis' },
      { number: 1000000000, value: 'Milijardasis' },
      { number: 1000000, value: 'Milijonasis' },
      { number: 1000, value: 'Tūkstantasis' },
      { number: 900, value: 'Devynišimtasis' },
      { number: 800, value: 'Aštuonišimtasis' },
      { number: 700, value: 'Septynišimtasis' },
      { number: 600, value: 'Šešišimtasis' },
      { number: 500, value: 'Penkišimtasis' },
      { number: 400, value: 'Keturišimtasis' },
      { number: 300, value: 'Trišimtasis' },
      { number: 200, value: 'Dvišimtasis' },
      { number: 100, value: 'Šimtasis' },
      { number: 90, value: 'Devyniasdešimtasis' },
      { number: 80, value: 'Aštuoniasdešimtasis' },
      { number: 70, value: 'Septyniasdešimtasis' },
      { number: 60, value: 'Šešiasdešimtasis' },
      { number: 50, value: 'Penkiasdešimtasis' },
      { number: 40, value: 'Keturiasdešimtasis' },
      { number: 30, value: 'Trisdešimtasis' },
      { number: 20, value: 'Dvidešimtasis' },
      { number: 19, value: 'Devynioliktasis' },
      { number: 18, value: 'Aštuonioliktasis' },
      { number: 17, value: 'Septynioliktasis' },
      { number: 16, value: 'Šešioliktasis' },
      { number: 15, value: 'Penkioliktasis' },
      { number: 14, value: 'Keturioliktasis' },
      { number: 13, value: 'Tryliktasis' },
      { number: 12, value: 'Dvyliktasis' },
      { number: 11, value: 'Vienuoliktasis' },
      { number: 10, value: 'Dešimtasis' },
      { number: 9, value: 'Devintasis' },
      { number: 8, value: 'Aštuntasis' },
      { number: 7, value: 'Septintasis' },
      { number: 6, value: 'Šeštasis' },
      { number: 5, value: 'Penktasis' },
      { number: 4, value: 'Ketvirtasis' },
      { number: 3, value: 'Trečiasis' },
      { number: 2, value: 'Antrasis' },
      { number: 1, value: 'Pirmasis' },
      { number: 0, value: 'Nulinis' },
    ],
    ordinalExactWordsMapping: [{ number: 100, value: 'Šimtasis' }],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/lt-LT';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale);
  }
}

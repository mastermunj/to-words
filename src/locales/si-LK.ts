import {
  type ConverterOptions,
  type LocaleConfig,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from '../types.js';
import { ToWordsCore } from '../ToWordsCoreBase.js';

// Sinhala ordinals have irregular forms for 1–3 and commonly use the "වැනි" suffix.

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'රුපියල',
      plural: 'රුපියල්',
      singular: 'රුපියල',
      symbol: 'රු',
      fractionalUnit: {
        name: 'සත',
        plural: 'සත',
        singular: 'සත',
        symbol: '',
      },
    },
    // The unit precedes the number (රුපියල් විසි එක), which keeps its standalone form.
    currencyUnitFirst: true,
    useTrailingForCurrency: true,
    texts: {
      and: 'සහ',
      minus: 'ඍණ',
      only: '',
      point: 'දශම',
    },
    ordinalSuffix: 'වැනි',
    ordinalExactWordsMapping: [
      { number: 1, value: 'පළමු' },
      { number: 2, value: 'දෙවෙනි' },
      { number: 3, value: 'තෙවෙනි' },
    ],
    numberWordsMapping: [
      { number: 1000000000000, value: 'ට්‍රිලියනය' },
      { number: 1000000000, value: 'බිලියනය' },
      { number: 1000000, value: 'මිලියනය' },
      { number: 100000, value: 'ලක්ෂය' },
      // A single-digit multiplier joins දහස (si.wikipedia «දෙදහස්» 36 vs «දෙ දහස්» 0, «තුන්දහස්» 2 vs 1,
      // «හාරදහස්» 2 vs 0, «අටදහස්» 3 vs 2); 10 takes its combining form, spaced («දස දහස්» 94 vs «දසදහස්» 7).
      {
        number: 1000,
        value: 'දහස',
        beforeRemainderValue: 'දහස්',
        multiplierPhrases: {
          2: 'දෙදහස',
          3: 'තුන්දහස',
          4: 'හාරදහස',
          5: 'පන්දහස',
          6: 'හයදහස',
          7: 'හත්දහස',
          8: 'අටදහස',
          9: 'නවදහස',
          10: 'දස දහස',
        },
        multiplierPhrasesBeforeRemainder: {
          2: 'දෙදහස්',
          3: 'තුන්දහස්',
          4: 'හාරදහස්',
          5: 'පන්දහස්',
          6: 'හයදහස්',
          7: 'හත්දහස්',
          8: 'අටදහස්',
          9: 'නවදහස්',
          10: 'දස දහස්',
        },
      },
      // en.wiktionary si: standalone 1–19, tens and hundreds; K: combining forms before more
      // (විසි එක, එකසිය එක) and before a scale word (දෙ දාහ).
      { number: 900, value: 'නවසීය', beforeRemainderValue: 'නවසිය' },
      { number: 800, value: 'අටසීය', beforeRemainderValue: 'අටසිය' },
      { number: 700, value: 'හත්සීය', beforeRemainderValue: 'හත්සිය' },
      { number: 600, value: 'හයසීය', beforeRemainderValue: 'හයසිය' },
      { number: 500, value: 'පන්සියය', beforeRemainderValue: 'පන්සිය' },
      { number: 400, value: 'හාරසියය', beforeRemainderValue: 'හාරසිය' },
      { number: 300, value: 'තුන්සියය', beforeRemainderValue: 'තුන්සිය' },
      { number: 200, value: 'දෙසිය' },
      { number: 100, value: 'සියය', beforeRemainderValue: 'එකසිය' },
      { number: 99, value: ['අනූ නව', 'අනූ නවය'] },
      { number: 98, value: ['අනූ අට', 'අනූ අට'] },
      { number: 97, value: ['අනූ හත්', 'අනූ හත'] },
      { number: 96, value: ['අනූ හය', 'අනූ හය'] },
      { number: 95, value: ['අනූ පන්', 'අනූ පහ'] },
      { number: 94, value: ['අනූ හාර', 'අනූ හතර'] },
      { number: 93, value: ['අනූ තුන්', 'අනූ තුන'] },
      { number: 92, value: ['අනූ දෙ', 'අනූ දෙක'] },
      { number: 91, value: ['අනූ එක්', 'අනූ එක'] },
      { number: 90, value: 'අනූව' },
      { number: 89, value: ['අසූ නව', 'අසූ නවය'] },
      { number: 88, value: ['අසූ අට', 'අසූ අට'] },
      { number: 87, value: ['අසූ හත්', 'අසූ හත'] },
      { number: 86, value: ['අසූ හය', 'අසූ හය'] },
      { number: 85, value: ['අසූ පන්', 'අසූ පහ'] },
      { number: 84, value: ['අසූ හාර', 'අසූ හතර'] },
      { number: 83, value: ['අසූ තුන්', 'අසූ තුන'] },
      { number: 82, value: ['අසූ දෙ', 'අසූ දෙක'] },
      { number: 81, value: ['අසූ එක්', 'අසූ එක'] },
      { number: 80, value: 'අසූව' },
      { number: 79, value: ['හැත්තෑ නව', 'හැත්තෑ නවය'] },
      { number: 78, value: ['හැත්තෑ අට', 'හැත්තෑ අට'] },
      { number: 77, value: ['හැත්තෑ හත්', 'හැත්තෑ හත'] },
      { number: 76, value: ['හැත්තෑ හය', 'හැත්තෑ හය'] },
      { number: 75, value: ['හැත්තෑ පන්', 'හැත්තෑ පහ'] },
      { number: 74, value: ['හැත්තෑ හාර', 'හැත්තෑ හතර'] },
      { number: 73, value: ['හැත්තෑ තුන්', 'හැත්තෑ තුන'] },
      { number: 72, value: ['හැත්තෑ දෙ', 'හැත්තෑ දෙක'] },
      { number: 71, value: ['හැත්තෑ එක්', 'හැත්තෑ එක'] },
      { number: 70, value: 'හැත්තෑව' },
      { number: 69, value: ['හැට නව', 'හැට නවය'] },
      { number: 68, value: ['හැට අට', 'හැට අට'] },
      { number: 67, value: ['හැට හත්', 'හැට හත'] },
      { number: 66, value: ['හැට හය', 'හැට හය'] },
      { number: 65, value: ['හැට පන්', 'හැට පහ'] },
      { number: 64, value: ['හැට හාර', 'හැට හතර'] },
      { number: 63, value: ['හැට තුන්', 'හැට තුන'] },
      { number: 62, value: ['හැට දෙ', 'හැට දෙක'] },
      { number: 61, value: ['හැට එක්', 'හැට එක'] },
      { number: 60, value: 'හැට' },
      { number: 59, value: ['පනස් නව', 'පනස් නවය'] },
      { number: 58, value: ['පනස් අට', 'පනස් අට'] },
      { number: 57, value: ['පනස් හත්', 'පනස් හත'] },
      { number: 56, value: ['පනස් හය', 'පනස් හය'] },
      { number: 55, value: ['පනස් පන්', 'පනස් පහ'] },
      { number: 54, value: ['පනස් හාර', 'පනස් හතර'] },
      { number: 53, value: ['පනස් තුන්', 'පනස් තුන'] },
      { number: 52, value: ['පනස් දෙ', 'පනස් දෙක'] },
      { number: 51, value: ['පනස් එක්', 'පනස් එක'] },
      { number: 50, value: 'පනහ' },
      { number: 49, value: ['හතළිස් නව', 'හතළිස් නවය'] },
      { number: 48, value: ['හතළිස් අට', 'හතළිස් අට'] },
      { number: 47, value: ['හතළිස් හත්', 'හතළිස් හත'] },
      { number: 46, value: ['හතළිස් හය', 'හතළිස් හය'] },
      { number: 45, value: ['හතළිස් පන්', 'හතළිස් පහ'] },
      { number: 44, value: ['හතළිස් හාර', 'හතළිස් හතර'] },
      { number: 43, value: ['හතළිස් තුන්', 'හතළිස් තුන'] },
      { number: 42, value: ['හතළිස් දෙ', 'හතළිස් දෙක'] },
      { number: 41, value: ['හතළිස් එක්', 'හතළිස් එක'] },
      { number: 40, value: 'හතලිහ' },
      { number: 39, value: ['තිස් නව', 'තිස් නවය'] },
      { number: 38, value: ['තිස් අට', 'තිස් අට'] },
      { number: 37, value: ['තිස් හත්', 'තිස් හත'] },
      { number: 36, value: ['තිස් හය', 'තිස් හය'] },
      { number: 35, value: ['තිස් පන්', 'තිස් පහ'] },
      { number: 34, value: ['තිස් හාර', 'තිස් හතර'] },
      { number: 33, value: ['තිස් තුන්', 'තිස් තුන'] },
      { number: 32, value: ['තිස් දෙ', 'තිස් දෙක'] },
      { number: 31, value: ['තිස් එක්', 'තිස් එක'] },
      { number: 30, value: 'තිහ' },
      { number: 29, value: ['විසි නව', 'විසි නවය'] },
      { number: 28, value: ['විසි අට', 'විසි අට'] },
      { number: 27, value: ['විසි හත්', 'විසි හත'] },
      { number: 26, value: ['විසි හය', 'විසි හය'] },
      { number: 25, value: ['විසි පන්', 'විසි පහ'] },
      { number: 24, value: ['විසි හාර', 'විසි හතර'] },
      { number: 23, value: ['විසි තුන්', 'විසි තුන'] },
      { number: 22, value: ['විසි දෙ', 'විසි දෙක'] },
      { number: 21, value: ['විසි එක්', 'විසි එක'] },
      { number: 20, value: 'විස්ස' },
      { number: 19, value: 'දහනවය' },
      { number: 18, value: 'දහඅට' },
      { number: 17, value: 'දහහත' },
      { number: 16, value: 'දහසය' },
      { number: 15, value: 'පහළොව' },
      { number: 14, value: 'දාහතර' },
      { number: 13, value: 'දහතුන' },
      { number: 12, value: 'දොළහ' },
      { number: 11, value: 'එකොළහ' },
      { number: 10, value: 'දහය' },
      { number: 9, value: ['නව', 'නවය'] },
      { number: 8, value: ['අට', 'අට'] },
      { number: 7, value: ['හත්', 'හත'] },
      { number: 6, value: ['හය', 'හය'] },
      { number: 5, value: ['පන්', 'පහ'] },
      { number: 4, value: ['හාර', 'හතර'] },
      { number: 3, value: ['තුන්', 'තුන'] },
      { number: 2, value: ['දෙ', 'දෙක'] },
      { number: 1, value: ['එක්', 'එක'] },
      { number: 0, value: 'ශූන්‍ය' },
    ],
    // 100 = සිය (not "එක සිය"), 1000 = දාහ (not "එක දාහ"), 100000 = ලක්ෂය (not "එක ලක්ෂය")
    ignoreOneForWords: ['සියය', 'දෙසිය', 'තුන්සියය', 'හාරසියය', 'පන්සියය', 'හයසීය', 'හත්සීය', 'අටසීය', 'නවසීය', 'දහස', 'ලක්ෂය'],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/si-LK';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'si-LK');
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

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
      name: 'Piso',
      plural: 'Piso',
      singular: 'Piso',
      symbol: '₱',
      fractionalUnit: {
        name: 'Sentimo',
        plural: 'Sentimo',
        singular: 'Sentimo',
        symbol: '',
      },
    },
    texts: {
      and: 'At',
      minus: 'Minus',
      only: 'Lamang',
      point: 'Tuldok',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Katrilyon' },
      { number: 1000000000000, value: 'Trilyon' },
      { number: 1000000000, value: 'Bilyon' },
      { number: 1000000, value: 'Milyon' },
      { number: 1000, value: 'Libo' },
      // Wiktionary tl: apat na raan / anim na raan / siyam na raan (d → r after the linker na).
      { number: 100, value: 'Daan', multiplierPhrases: { 4: 'Apat Na Raan', 6: 'Anim Na Raan', 9: 'Siyam Na Raan' } },
      { number: 90, value: 'Siyamnapu' },
      { number: 80, value: 'Walumpu' },
      { number: 70, value: 'Pitumpu' },
      { number: 60, value: 'Animnapu' },
      { number: 50, value: 'Limampu' },
      { number: 40, value: 'Apatnapu' },
      { number: 30, value: 'Tatlumpu' },
      { number: 20, value: 'Dalawampu' },
      { number: 19, value: 'Labinsiyam' },
      { number: 18, value: 'Labingwalo' },
      { number: 17, value: 'Labimpito' },
      { number: 16, value: 'Labing-anim' },
      { number: 15, value: 'Labinlima' },
      { number: 14, value: 'Labing-apat' },
      { number: 13, value: 'Labintatlo' },
      { number: 12, value: 'Labindalawa' },
      { number: 11, value: 'Labing-isa' },
      { number: 10, value: 'Sampu' },
      { number: 9, value: 'Siyam' },
      { number: 8, value: 'Walo' },
      { number: 7, value: 'Pito' },
      { number: 6, value: 'Anim' },
      { number: 5, value: 'Lima' },
      { number: 4, value: 'Apat' },
      { number: 3, value: 'Tatlo' },
      { number: 2, value: 'Dalawa' },
      { number: 1, value: 'Isa' },
      { number: 0, value: 'Sero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Isang Daan' }],
    // Wiktionary tl: «at» joins every component, «'t» after a vowel (dalawampu't isa, isang libo't isa).
    splitWord: 'At',
    splitWordAfterVowel: "'t",
    // Linker -ng / -g / na before a scale word or unit (dalawang daan, sandaang piso, apat na libo).
    ligature: { vowel: 'ng', n: 'g', word: 'Na' },
    // Wiktionary tl: ordinals are ika- + the cardinal (ikadalawampu, ikalabing-isa); una, ikalawa, ikatlo.
    ordinalPrefix: 'Ika',
    ordinalComposition: 'fused-prefix',
    ordinalWordsMapping: [
      { number: 3, value: 'Ikatlo' },
      { number: 2, value: 'Ikalawa' },
      { number: 1, value: 'Una' },
      { number: 0, value: 'Ikasero' },
    ],
  };
}

/**
 * ToWords class pre-configured for this locale.
 * This is a lightweight version that only bundles this specific locale.
 *
 * @example
 * import { ToWords } from 'to-words/fil-PH';
 * const tw = new ToWords();
 * tw.convert(1234);
 */
export class ToWords extends ToWordsCore {
  constructor(options: ToWordsOptions = {}) {
    super(options);
    this.setLocale(Locale, 'fil-PH');
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

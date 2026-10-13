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
      // evro is masculine (en.wiktionary «evro», Noun m-in); amount agrees by the slovenian plural rule.
      name: 'Evro',
      plural: 'Evrov',
      singular: 'Evro',
      symbol: '€',
      gender: 'masculine',
      pluralForms: { one: 'Evro', two: 'Evra', few: 'Evri', other: 'Evrov' },
      fractionalUnit: {
        name: 'Cent',
        singular: 'Cent',
        plural: 'Centov',
        symbol: 'c',
        gender: 'masculine',
        pluralForms: { one: 'Cent', two: 'Centa', few: 'Centi', other: 'Centov' },
      },
    },
    texts: {
      and: 'In',
      minus: 'Minus',
      only: 'Samo',
      point: 'Vejica',
    },
    // Slovene is space-separated; only 21-99 and the multiples of 100 are single words, so 21-99 are
    // listed directly (unit before ten, joined by "in" — en.wikipedia «Slovene numerals»). The counting
    // form is the feminine form (ibid.); 1-4 carry a masculineValue for use before a masculine scale noun.
    numberWordsMapping: [
      // en.wikipedia «Slovene numerals» / languagesandnumbers: long scale, alternating m / f genders.
      // A LONE multiplier 2/3/4 agrees with the noun's gender (masc. Dva/Trije/Štirje before milijon,
      // fem. Dve/Tri/Štiri before milijarda); a compound multiplier (101, 603, …) keeps the feminine
      // counting form, so masculine scales list only the lone forms via multiplierForms and declare no gender.
      { number: 1000000000000000000000n, value: 'Trilijarda' },
      { number: 1000000000000000000n, value: 'Trilijon', multiplierForms: { 2: 'Dva', 3: 'Trije', 4: 'Štirje' } },
      { number: 1000000000000000, value: 'Bilijarda' },
      { number: 1000000000000, value: 'Bilijon', multiplierForms: { 2: 'Dva', 3: 'Trije', 4: 'Štirje' } },
      { number: 1000000000, value: 'Milijarda' },
      { number: 1000000, value: 'Milijon', multiplierForms: { 2: 'Dva', 3: 'Trije', 4: 'Štirje' } },
      // tisoč is a masculine noun but does not decline after a number (dva tisoč, tri tisoč, pet tisoč);
      // 2 takes the masculine Dva, 3/4 keep the plain counting Tri/Štiri (en.wikipedia «Slovene numerals»).
      // tisoč is a masculine noun but does not decline after a number (dva tisoč, tri tisoč, pet tisoč).
      // A LONE multiplier 2/3/4 takes its own word (Dva masc., but Tri/Štiri plain); a compound multiplier
      // (101, 603, …) keeps the feminine counting form (Sto Ena Tisoč). en.wikipedia «Slovene numerals».
      { number: 1000, value: 'Tisoč', multiplierForms: { 2: 'Dva', 3: 'Tri', 4: 'Štiri' } },
      { number: 900, value: 'Devetsto' },
      { number: 800, value: 'Osemsto' },
      { number: 700, value: 'Sedemsto' },
      { number: 600, value: 'Šeststo' },
      { number: 500, value: 'Petsto' },
      { number: 400, value: 'Štiristo' },
      { number: 300, value: 'Tristo' },
      { number: 200, value: 'Dvesto' },
      { number: 100, value: 'Sto' },
      // 21-99: one word, unit + "in" + ten (en.wikipedia «Slovene numerals»).
      { number: 99, value: 'Devetindevetdeset' },
      { number: 98, value: 'Osemindevetdeset' },
      { number: 97, value: 'Sedemindevetdeset' },
      { number: 96, value: 'Šestindevetdeset' },
      { number: 95, value: 'Petindevetdeset' },
      { number: 94, value: 'Štiriindevetdeset' },
      { number: 93, value: 'Triindevetdeset' },
      { number: 92, value: 'Dvaindevetdeset' },
      { number: 91, value: 'Enaindevetdeset' },
      { number: 90, value: 'Devetdeset' },
      { number: 89, value: 'Devetinosemdeset' },
      { number: 88, value: 'Oseminosemdeset' },
      { number: 87, value: 'Sedeminosemdeset' },
      { number: 86, value: 'Šestinosemdeset' },
      { number: 85, value: 'Petinosemdeset' },
      { number: 84, value: 'Štiriinosemdeset' },
      { number: 83, value: 'Triinosemdeset' },
      { number: 82, value: 'Dvainosemdeset' },
      { number: 81, value: 'Enainosemdeset' },
      { number: 80, value: 'Osemdeset' },
      { number: 79, value: 'Devetinsedemdeset' },
      { number: 78, value: 'Oseminsedemdeset' },
      { number: 77, value: 'Sedeminsedemdeset' },
      { number: 76, value: 'Šestinsedemdeset' },
      { number: 75, value: 'Petinsedemdeset' },
      { number: 74, value: 'Štiriinsedemdeset' },
      { number: 73, value: 'Triinsedemdeset' },
      { number: 72, value: 'Dvainsedemdeset' },
      { number: 71, value: 'Enainsedemdeset' },
      { number: 70, value: 'Sedemdeset' },
      { number: 69, value: 'Devetinšestdeset' },
      { number: 68, value: 'Oseminšestdeset' },
      { number: 67, value: 'Sedeminšestdeset' },
      { number: 66, value: 'Šestinšestdeset' },
      { number: 65, value: 'Petinšestdeset' },
      { number: 64, value: 'Štiriinšestdeset' },
      { number: 63, value: 'Triinšestdeset' },
      { number: 62, value: 'Dvainšestdeset' },
      { number: 61, value: 'Enainšestdeset' },
      { number: 60, value: 'Šestdeset' },
      { number: 59, value: 'Devetinpetdeset' },
      { number: 58, value: 'Oseminpetdeset' },
      { number: 57, value: 'Sedeminpetdeset' },
      { number: 56, value: 'Šestinpetdeset' },
      { number: 55, value: 'Petinpetdeset' },
      { number: 54, value: 'Štiriinpetdeset' },
      { number: 53, value: 'Triinpetdeset' },
      { number: 52, value: 'Dvainpetdeset' },
      { number: 51, value: 'Enainpetdeset' },
      { number: 50, value: 'Petdeset' },
      { number: 49, value: 'Devetinštirideset' },
      { number: 48, value: 'Oseminštirideset' },
      { number: 47, value: 'Sedeminštirideset' },
      { number: 46, value: 'Šestinštirideset' },
      { number: 45, value: 'Petinštirideset' },
      { number: 44, value: 'Štiriinštirideset' },
      { number: 43, value: 'Triinštirideset' },
      { number: 42, value: 'Dvainštirideset' },
      { number: 41, value: 'Enainštirideset' },
      { number: 40, value: 'Štirideset' },
      { number: 39, value: 'Devetintrideset' },
      { number: 38, value: 'Osemintrideset' },
      { number: 37, value: 'Sedemintrideset' },
      { number: 36, value: 'Šestintrideset' },
      { number: 35, value: 'Petintrideset' },
      { number: 34, value: 'Štiriintrideset' },
      { number: 33, value: 'Triintrideset' },
      { number: 32, value: 'Dvaintrideset' },
      { number: 31, value: 'Enaintrideset' },
      { number: 30, value: 'Trideset' },
      { number: 29, value: 'Devetindvajset' },
      { number: 28, value: 'Osemindvajset' },
      { number: 27, value: 'Sedemindvajset' },
      { number: 26, value: 'Šestindvajset' },
      { number: 25, value: 'Petindvajset' },
      { number: 24, value: 'Štiriindvajset' },
      { number: 23, value: 'Triindvajset' },
      { number: 22, value: 'Dvaindvajset' },
      { number: 21, value: 'Enaindvajset' },
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
      // 1-4 decline for gender; the counting default is feminine, masc. form before a masculine noun.
      { number: 4, value: 'Štiri', masculineValue: 'Štirje' },
      { number: 3, value: 'Tri', masculineValue: 'Trije' },
      { number: 2, value: 'Dve', masculineValue: 'Dva' },
      { number: 1, value: 'Ena', masculineValue: 'En' }, // en.wiktionary «eden»: en before a noun
      { number: 0, value: 'Nič' },
    ],
    exactWordsMapping: [{ number: 100, value: 'Sto' }],
    pluralRule: 'slovenian',
    // Scale nouns decline for number by the slovenian plural category of the multiplier
    // (one ..01, two ..02, few ..03-04, other). en.wikipedia «Slovene numerals».
    pluralForms: {
      1000000: { one: 'Milijon', two: 'Milijona', few: 'Milijoni', other: 'Milijonov' },
      1000000000: { one: 'Milijarda', two: 'Milijardi', few: 'Milijarde', other: 'Milijard' },
      1000000000000: { one: 'Bilijon', two: 'Bilijona', few: 'Bilijoni', other: 'Bilijonov' },
      1000000000000000: { one: 'Bilijarda', two: 'Bilijardi', few: 'Bilijarde', other: 'Bilijard' },
      1000000000000000000: { one: 'Trilijon', two: 'Trilijona', few: 'Trilijoni', other: 'Trilijonov' },
      1000000000000000000000: { one: 'Trilijarda', two: 'Trilijardi', few: 'Trilijarde', other: 'Trilijard' },
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
      'Trilijon',
      'Trilijarda',
    ],
    // Only the last word of a multi-word number becomes the ordinal (en.wikipedia: 200. → Dvestoti,
    // 201. → Dvesto Prvi). 21-99 ordinals are one word built from the one-word cardinal.
    ordinalWordsMapping: [
      { number: 1000000000000000000000n, value: 'Trilijardti' },
      { number: 1000000000000000000n, value: 'Trilijonti' },
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
      { number: 99, value: 'Devetindevetdeseti' },
      { number: 98, value: 'Osemindevetdeseti' },
      { number: 97, value: 'Sedemindevetdeseti' },
      { number: 96, value: 'Šestindevetdeseti' },
      { number: 95, value: 'Petindevetdeseti' },
      { number: 94, value: 'Štiriindevetdeseti' },
      { number: 93, value: 'Triindevetdeseti' },
      { number: 92, value: 'Dvaindevetdeseti' },
      { number: 91, value: 'Enaindevetdeseti' },
      { number: 90, value: 'Devetdeseti' },
      { number: 89, value: 'Devetinosemdeseti' },
      { number: 88, value: 'Oseminosemdeseti' },
      { number: 87, value: 'Sedeminosemdeseti' },
      { number: 86, value: 'Šestinosemdeseti' },
      { number: 85, value: 'Petinosemdeseti' },
      { number: 84, value: 'Štiriinosemdeseti' },
      { number: 83, value: 'Triinosemdeseti' },
      { number: 82, value: 'Dvainosemdeseti' },
      { number: 81, value: 'Enainosemdeseti' },
      { number: 80, value: 'Osemdeseti' },
      { number: 79, value: 'Devetinsedemdeseti' },
      { number: 78, value: 'Oseminsedemdeseti' },
      { number: 77, value: 'Sedeminsedemdeseti' },
      { number: 76, value: 'Šestinsedemdeseti' },
      { number: 75, value: 'Petinsedemdeseti' },
      { number: 74, value: 'Štiriinsedemdeseti' },
      { number: 73, value: 'Triinsedemdeseti' },
      { number: 72, value: 'Dvainsedemdeseti' },
      { number: 71, value: 'Enainsedemdeseti' },
      { number: 70, value: 'Sedemdeseti' },
      { number: 69, value: 'Devetinšestdeseti' },
      { number: 68, value: 'Oseminšestdeseti' },
      { number: 67, value: 'Sedeminšestdeseti' },
      { number: 66, value: 'Šestinšestdeseti' },
      { number: 65, value: 'Petinšestdeseti' },
      { number: 64, value: 'Štiriinšestdeseti' },
      { number: 63, value: 'Triinšestdeseti' },
      { number: 62, value: 'Dvainšestdeseti' },
      { number: 61, value: 'Enainšestdeseti' },
      { number: 60, value: 'Šestdeseti' },
      { number: 59, value: 'Devetinpetdeseti' },
      { number: 58, value: 'Oseminpetdeseti' },
      { number: 57, value: 'Sedeminpetdeseti' },
      { number: 56, value: 'Šestinpetdeseti' },
      { number: 55, value: 'Petinpetdeseti' },
      { number: 54, value: 'Štiriinpetdeseti' },
      { number: 53, value: 'Triinpetdeseti' },
      { number: 52, value: 'Dvainpetdeseti' },
      { number: 51, value: 'Enainpetdeseti' },
      { number: 50, value: 'Petdeseti' },
      { number: 49, value: 'Devetinštirideseti' },
      { number: 48, value: 'Oseminštirideseti' },
      { number: 47, value: 'Sedeminštirideseti' },
      { number: 46, value: 'Šestinštirideseti' },
      { number: 45, value: 'Petinštirideseti' },
      { number: 44, value: 'Štiriinštirideseti' },
      { number: 43, value: 'Triinštirideseti' },
      { number: 42, value: 'Dvainštirideseti' },
      { number: 41, value: 'Enainštirideseti' },
      { number: 40, value: 'Štirideseti' },
      { number: 39, value: 'Devetintrideseti' },
      { number: 38, value: 'Osemintrideseti' },
      { number: 37, value: 'Sedemintrideseti' },
      { number: 36, value: 'Šestintrideseti' },
      { number: 35, value: 'Petintrideseti' },
      { number: 34, value: 'Štiriintrideseti' },
      { number: 33, value: 'Triintrideseti' },
      { number: 32, value: 'Dvaintrideseti' },
      { number: 31, value: 'Enaintrideseti' },
      { number: 30, value: 'Trideseti' },
      { number: 29, value: 'Devetindvajseti' },
      { number: 28, value: 'Osemindvajseti' },
      { number: 27, value: 'Sedemindvajseti' },
      { number: 26, value: 'Šestindvajseti' },
      { number: 25, value: 'Petindvajseti' },
      { number: 24, value: 'Štiriindvajseti' },
      { number: 23, value: 'Triindvajseti' },
      { number: 22, value: 'Dvaindvajseti' },
      { number: 21, value: 'Enaindvajseti' },
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
    fractionDenominatorMapping: {
      1: { singular: 'Desetinka', plural: 'Desetinke' },
      2: { singular: 'Stotinka', plural: 'Stotinke' },
      3: { singular: 'Tisočinka', plural: 'Tisočinke' },
      4: { singular: 'Desetotisočinka', plural: 'Desetotisočinke' },
      5: { singular: 'Sto-Tisočinka', plural: 'Sto-Tisočinke' },
      6: { singular: 'Milijontinka', plural: 'Milijontinke' },
    },
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
    this.setLocale(Locale, 'sl-SI');
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

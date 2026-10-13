/**
 * Built-in plural category rules for integer quantities.
 *
 * The categories follow Unicode CLDR naming (zero / one / two / few / many / other), but the
 * rules are bundled here rather than read from `Intl.PluralRules`, whose data varies between
 * runtimes and versions. Only integer operands are needed: the engine applies a rule to the
 * multiplier in front of a scale word and to a currency amount.
 *
 * Source: https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
 */

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export const PLURAL_CATEGORIES: readonly PluralCategory[] = Object.freeze([
  'zero',
  'one',
  'two',
  'few',
  'many',
  'other',
]);

/**
 * - `one-other`: one = 1 (English, German, Dutch, Scandinavian, Italian, Spanish, Bulgarian…).
 * - `zero-one-other`: one = 0 or 1 (French, Brazilian Portuguese). Named for the operands, not the categories.
 * - `east-slavic`: one = …1 except …11; few = …2-4 except …12-14; many = rest (ru, uk, be; also hr, sr, bs).
 * - `west-slavic`: one = 1; few = 2-4; other = rest (cs, sk).
 * - `polish`: one = 1; few = …2-4 except …12-14; many = rest (pl).
 * - `lithuanian`: one = …1 except …11-19; few = …2-9 except …12-19; other = rest (lt).
 * - `latvian`: zero = …0 or …11-19; one = …1 except …11; other = rest (lv).
 * - `slovenian`: one = …01; two = …02; few = …03-04; other = rest (sl).
 * - `arabic`: zero = 0; one = 1; two = 2; few = …03-10; many = …11-99; other = rest (ar).
 */
export type PluralRuleName =
  | 'one-other'
  | 'zero-one-other'
  | 'east-slavic'
  | 'west-slavic'
  | 'polish'
  | 'lithuanian'
  | 'latvian'
  | 'slovenian'
  | 'icelandic'
  | 'arabic';

export const PLURAL_RULE_NAMES: readonly PluralRuleName[] = Object.freeze([
  'one-other',
  'zero-one-other',
  'east-slavic',
  'west-slavic',
  'polish',
  'lithuanian',
  'latvian',
  'slovenian',
  'icelandic',
  'arabic',
]);

/** Plural category of a non-negative integer under the named rule. */
export function selectPluralCategory(rule: PluralRuleName, n: bigint): PluralCategory {
  const mod10 = Number(n % 10n);
  const mod100 = Number(n % 100n);
  const teen = mod100 >= 11 && mod100 <= 19;

  switch (rule) {
    case 'one-other':
      return n === 1n ? 'one' : 'other';
    case 'zero-one-other':
      return n <= 1n ? 'one' : 'other';
    case 'east-slavic':
      if (mod10 === 1 && mod100 !== 11) {
        return 'one';
      }
      if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return 'few';
      }
      return 'many';
    case 'west-slavic':
      if (n === 1n) {
        return 'one';
      }
      if (n >= 2n && n <= 4n) {
        return 'few';
      }
      return 'other';
    case 'polish':
      if (n === 1n) {
        return 'one';
      }
      if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return 'few';
      }
      return 'many';
    case 'lithuanian':
      if (mod10 === 1 && !teen) {
        return 'one';
      }
      if (mod10 >= 2 && !teen) {
        return 'few';
      }
      return 'other';
    case 'latvian':
      if (mod10 === 0 || teen) {
        return 'zero';
      }
      if (mod10 === 1 && mod100 !== 11) {
        return 'one';
      }
      return 'other';
    case 'icelandic':
      // CLDR is: one when the last digit is 1 except 11 (tuttugu og ein milljón, ellefu milljónir).
      return mod10 === 1 && mod100 !== 11 ? 'one' : 'other';
    case 'arabic':
      // The counted noun follows the last two digits (en.wikipedia «Arabic grammar», Numerals):
      // genitive plural after 3–10, accusative singular after 11–99, genitive singular otherwise.
      if (n <= 2n) {
        return n === 0n ? 'zero' : n === 1n ? 'one' : 'two';
      }
      if (mod100 >= 3 && mod100 <= 10) {
        return 'few';
      }
      return mod100 >= 11 ? 'many' : 'other';
    case 'slovenian':
      if (mod100 === 1) {
        return 'one';
      }
      if (mod100 === 2) {
        return 'two';
      }
      if (mod100 === 3 || mod100 === 4) {
        return 'few';
      }
      return 'other';
  }
}

export type PluralFormSet = Partial<Record<PluralCategory, string>>;

/**
 * Lookup order when a category has no form of its own. A category with no listed form
 * (and `one`, which falls back to the caller's singular) yields undefined.
 */
const FALLBACKS: Readonly<Record<PluralCategory, readonly PluralCategory[]>> = {
  zero: ['zero', 'other'],
  one: ['one'],
  two: ['two', 'few', 'other'],
  few: ['few', 'other'],
  many: ['many', 'other'],
  other: ['other'],
};

/** Pick the form for a category, walking the fallback chain. */
export function pickPluralForm(forms: PluralFormSet, category: PluralCategory): string | undefined {
  for (const candidate of FALLBACKS[category]) {
    const form = forms[candidate];
    if (form) {
      return form;
    }
  }
  return undefined;
}

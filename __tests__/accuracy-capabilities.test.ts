/**
 * Accuracy capabilities: opt-in engine features, exercised by switching each one on
 * for a copy of a bundled locale's data.
 *
 * Expected strings here test the ENGINE MECHANISM for that configuration. They are not
 * sourced accuracy claims — those live in `fixtures/accuracy/` once a locale adopts a capability.
 */

import { describe, expect, test } from 'vitest';
import { assertLocaleConfig } from '../src/locale-contract.js';
import BgBg from '../src/locales/bg-BG.js';
import DeDe from '../src/locales/de-DE.js';
import EnUs from '../src/locales/en-US.js';
import EsEs from '../src/locales/es-ES.js';
import HeIl from '../src/locales/he-IL.js';
import KaGe from '../src/locales/ka-GE.js';
import FilPh from '../src/locales/fil-PH.js';
import TeIn from '../src/locales/te-IN.js';
import ArSa from '../src/locales/ar-SA.js';
import ElGr from '../src/locales/el-GR.js';
import MlIn from '../src/locales/ml-IN.js';
import SqAl from '../src/locales/sq-AL.js';
import FiFi from '../src/locales/fi-FI.js';
import RoRo from '../src/locales/ro-RO.js';
import FrFr from '../src/locales/fr-FR.js';
import HrHr from '../src/locales/hr-HR.js';
import ItIt from '../src/locales/it-IT.js';
import KoKr from '../src/locales/ko-KR.js';
import NlNl from '../src/locales/nl-NL.js';
import PlPl from '../src/locales/pl-PL.js';
import PtBr from '../src/locales/pt-BR.js';
import RuRu from '../src/locales/ru-RU.js';
import SkSk from '../src/locales/sk-SK.js';
import ZhCn from '../src/locales/zh-CN.js';
import FaIr from '../src/locales/fa-IR.js';
import ThTh from '../src/locales/th-TH.js';
import TrTr from '../src/locales/tr-TR.js';
import { NumberOutOfRangeError } from '../src/errors.js';
import { PLURAL_RULE_NAMES, selectPluralCategory, type PluralRuleName } from '../src/plural-rules.js';
import { ToWordsCore } from '../src/ToWordsCore.js';
import type { LocaleConfig, LocaleInterface } from '../src/types.js';

type LocaleClass = new () => LocaleInterface;

/** A validated converter for a bundled locale's data with `patch` applied on top. */
function variant(Base: LocaleClass, patch: (config: LocaleConfig) => Partial<LocaleConfig>): ToWordsCore {
  const base = new Base().config;
  class Variant implements LocaleInterface {
    public config: LocaleConfig = { ...base, ...patch(base) };
  }
  return new ToWordsCore().setLocale(Variant, 'test-variant');
}

describe('selectPluralCategory', () => {
  const table: Record<PluralRuleName, Record<string, readonly number[]>> = {
    'one-other': { one: [1], other: [0, 2, 5, 11, 21, 101] },
    'zero-one-other': { one: [0, 1], other: [2, 5, 21] },
    'east-slavic': { one: [1, 21, 101, 1001], few: [2, 3, 4, 22, 104], many: [0, 5, 11, 12, 14, 20, 111, 112] },
    'west-slavic': { one: [1], few: [2, 3, 4], other: [0, 5, 21, 22] },
    polish: { one: [1], few: [2, 4, 22, 104], many: [0, 5, 12, 14, 21, 25, 112] },
    lithuanian: { one: [1, 21, 101], few: [2, 9, 22, 109], other: [0, 10, 11, 12, 19, 20, 111] },
    latvian: { zero: [0, 10, 11, 19, 20, 111], one: [1, 21, 101], other: [2, 9, 22] },
    slovenian: { one: [1, 101], two: [2, 102], few: [3, 4, 103], other: [0, 5, 11, 21, 111] },
    icelandic: { one: [1, 21, 101, 1001], other: [0, 2, 5, 11, 111, 211] },
    arabic: {
      zero: [0],
      one: [1],
      two: [2],
      few: [3, 10, 103, 210],
      many: [11, 99, 111, 1099],
      other: [100, 101, 102, 1000],
    },
  };

  test('every rule is covered', () => {
    expect(Object.keys(table).sort()).toEqual([...PLURAL_RULE_NAMES].sort());
  });

  test.each(Object.entries(table) as [PluralRuleName, Record<string, number[]>][])('%s', (rule, categories) => {
    for (const [category, values] of Object.entries(categories)) {
      for (const value of values) {
        expect([value, selectPluralCategory(rule, BigInt(value))]).toEqual([value, category]);
      }
    }
  });
});

describe('1a plural rules for scale words', () => {
  test('east-slavic with legacy paucal/plural keys (ru)', () => {
    const tw = variant(RuRu, () => ({ pluralRule: 'east-slavic' }));
    expect(tw.convert(1000)).toBe('Тысяча');
    expect(tw.convert(5000)).toBe('Пять Тысяч');
    expect(tw.convert(11000)).toBe('Одиннадцать Тысяч');
    expect(tw.convert(5000000)).toBe('Пять Миллионов');
    expect(tw.convert(21000000)).toBe('Двадцать Один Миллион');
    expect(tw.convert(22000000)).toBe('Двадцать Два Миллиона');
    expect(tw.convert(112000000)).toBe('Сто Двенадцать Миллионов');
  });

  test('polish with CLDR category keys (pl)', () => {
    const tw = variant(PlPl, (base) => ({
      pluralRule: 'polish',
      pluralForms: { ...base.pluralForms, 1000000: { few: 'Miliony', many: 'Milionów' } },
    }));
    expect(tw.convert(2000000)).toBe('Dwa Miliony');
    expect(tw.convert(5000000)).toBe('Pięć Milionów');
    expect(tw.convert(22000000)).toBe('Dwadzieścia Dwa Miliony');
    expect(tw.convert(25000000)).toBe('Dwadzieścia Pięć Milionów');
  });

  test('one-other gives Germanic plurals without touching scales that have no forms (de)', () => {
    const tw = variant(DeDe, () => ({
      pluralRule: 'one-other',
      pluralForms: { 1000000: { other: 'Millionen' } },
      wordJoining: undefined,
    }));
    expect(tw.convert(2000000)).toBe('Zwei Millionen');
    expect(tw.convert(2000)).toBe('Zwei Tausend');
  });
});

describe('1b agreement with the scale word and currency unit', () => {
  test('a scale word with a gender makes its multiplier agree (ru Тысяча)', () => {
    const tw = variant(RuRu, (base) => ({
      pluralRule: 'east-slavic',
      numberWordsMapping: base.numberWordsMapping.map((entry) =>
        entry.number === 1000 ? { ...entry, gender: 'feminine' as const } : entry,
      ),
    }));
    expect(tw.convert(2000)).toBe('Две Тысячи');
    expect(tw.convert(21000)).toBe('Двадцать Одна Тысяча');
    expect(tw.convert(22000)).toBe('Двадцать Две Тысячи');
    expect(tw.convert(2000000)).toBe('Два Миллиона');
    expect(tw.convert(2002)).toBe('Две Тысячи Два');
  });

  const rubles = variant(RuRu, (base) => ({
    pluralRule: 'east-slavic',
    currency: {
      ...base.currency,
      pluralForms: { one: 'Рубль', few: 'Рубля', many: 'Рублей' },
      fractionalUnit: {
        ...base.currency.fractionalUnit,
        gender: 'feminine',
        pluralForms: { one: 'Копейка', few: 'Копейки', many: 'Копеек' },
      },
    },
  }));

  test.each([
    ['1', 'Один Рубль'],
    ['2', 'Два Рубля'],
    ['5', 'Пять Рублей'],
    ['11', 'Одиннадцать Рублей'],
    ['21', 'Двадцать Один Рубль'],
    ['22', 'Двадцать Два Рубля'],
    ['1.01', 'Один Рубль И Одна Копейка'],
    ['2.02', 'Два Рубля И Две Копейки'],
    ['5.05', 'Пять Рублей И Пять Копеек'],
  ])('ru currency %s → %s', (input, expected) => {
    expect(rubles.convert(input, { currency: true, doNotAddOnly: true })).toBe(expected);
  });

  test("a unit's declared gender wins over an explicit gender option", () => {
    expect(rubles.convert('1.01', { currency: true, doNotAddOnly: true, gender: 'masculine' })).toBe(
      'Один Рубль И Одна Копейка',
    );
  });
});

describe('1c word joining and compounds', () => {
  const german = variant(DeDe, () => ({
    pluralRule: 'one-other',
    pluralForms: { 1000000: { other: 'Millionen' } },
    wordJoining: { compoundBelow: 1000000 },
  }));

  test.each([
    [21, 'Einundzwanzig'],
    [101, 'Hunderteins'],
    [1001, 'Tausendeins'],
    [2000, 'Zweitausend'],
    [1234, 'Tausendzweihundertvierunddreißig'],
    [2000101, 'Zwei Millionen Hunderteins'],
    [234000000, 'Zweihundertvierunddreißig Millionen'],
  ])('de %i → %s', (input, expected) => {
    expect(german.convert(input)).toBe(expected);
  });

  test('compounds apply inside currency output too', () => {
    expect(german.convert(2000, { currency: true, doNotAddOnly: true })).toBe('Zweitausend Euro');
  });

  test('it compounds below a million', () => {
    const tw = variant(ItIt, () => ({ wordJoining: { compoundBelow: 1000000 } }));
    expect(tw.convert(500)).toBe('Cinquecento');
    expect(tw.convert(2000)).toBe('Duemila');
    expect(tw.convert(2500)).toBe('Duemilacinquecento');
  });

  test('separateAfter keeps a space after a scale word inside a compound (nl duizend)', () => {
    const tw = variant(NlNl, () => ({ wordJoining: { compoundBelow: 1000000, separateAfter: [1000] } }));
    expect(tw.convert(2000)).toBe('Tweeduizend');
    expect(tw.convert(2300)).toBe('Tweeduizend Driehonderd');
  });

  test('lowercaseCompoundParts: false keeps each part as written', () => {
    const tw = variant(DeDe, () => ({ wordJoining: { compoundBelow: 1000000, lowercaseCompoundParts: false } }));
    expect(tw.convert(101)).toBe('HundertEins');
  });

  test('a blank texts.and adds no word, with or without a separator override', () => {
    const plain = variant(ZhCn, () => ({}));
    const joined = variant(ZhCn, () => ({ wordJoining: { separator: '' } }));
    expect(plain.convert('2.02', { currency: true, doNotAddOnly: true })).toBe('二 元 零 二 分');
    expect(joined.convert('2.02', { currency: true, doNotAddOnly: true })).toBe('二元零二分');
  });
});

describe('1d Chinese leading forms and zero for skipped places', () => {
  // Pure 10^4 grouping: drop zh-CN's compound scale entries (十万, 百万, …) for this test.
  const tw = variant(ZhCn, (base) => ({
    numberWordsMapping: base.numberWordsMapping
      .filter((entry) => typeof entry.value === 'string' && (entry.value.length === 1 || Number(entry.number) < 100))
      .map((entry) => (entry.number === 10 ? { ...entry, nonLeadingValue: '一十' } : entry)),
    exactWordsMapping: [{ number: 100, value: '一百' }],
    ignoreOneForWords: [],
    zeroForSkippedPlaces: true,
    wordJoining: { separator: '' },
  }));

  test.each([
    [10, '十'],
    [11, '十一'],
    [21, '二十一'],
    [101, '一百零一'],
    [110, '一百一十'],
    [1001, '一千零一'],
    [1010, '一千零一十'],
    [10000, '一万'],
    [110000, '十一万'],
    [100100, '十万零一百'],
    [20000001, '二千万零一'],
  ])('zh %i → %s', (input, expected) => {
    expect(tw.convert(input)).toBe(expected);
  });
});

describe('1e ordinal composition', () => {
  const spanish = variant(EsEs, () => ({ ordinalComposition: 'every-component' }));

  test.each([
    [1, 'Primero'],
    [21, 'Vigésimo Primero'],
    [121, 'Centésimo Vigésimo Primero'],
    [1001, 'Milésimo Primero'],
    [1234, 'Milésimo Ducentésimo Trigésimo Cuarto'],
    [2000, 'Dos Milésimo'],
  ])('es every-component %i → %s', (input, expected) => {
    expect(spanish.toOrdinal(input)).toBe(expected);
  });

  test('every-component keeps gender', () => {
    expect(spanish.toOrdinal(21, { gender: 'feminine' })).toBe('Vigésima Primera');
  });

  const french = variant(FrFr, (base) => ({
    ordinalComposition: 'last-token',
    ordinalWordsMapping: base.ordinalWordsMapping!.map((entry) =>
      entry.number === 1 ? { ...entry, compoundValue: 'Unième' } : entry,
    ),
  }));

  test.each([
    [1, 'Premier'],
    [2, 'Deuxième'],
    [21, 'Vingt Et Unième'],
    [22, 'Vingt-Deuxième'],
    [30, 'Trentième'],
  ])('fr last-token %i → %s', (input, expected) => {
    expect(french.toOrdinal(input)).toBe(expected);
  });
});

describe('1f currency phrasing', () => {
  test('connector after a round large amount (es)', () => {
    const tw = variant(EsEs, () => ({ currencyScaleConnector: { word: 'De', minScale: 1000000 } }));
    const currency = { currency: true, doNotAddOnly: true };
    expect(tw.convert(2000000, currency)).toBe('Dos Millones De Euros');
    expect(tw.convert(1000001, currency)).not.toContain(' De ');
    expect(tw.convert(1000, currency)).not.toContain(' De ');
  });

  test('elided connector before a vowel (fr)', () => {
    const tw = variant(FrFr, () => ({ currencyScaleConnector: { word: 'De', elidedWord: "D'", minScale: 1000000 } }));
    expect(tw.convert(1000000, { currency: true, doNotAddOnly: true })).toBe("Un Million D'euros");
  });

  test('larger fractional unit (zh 角)', () => {
    const tw = variant(ZhCn, (base) => ({
      wordJoining: { separator: '' },
      currency: {
        ...base.currency,
        fractionalUnit: { ...base.currency.fractionalUnit, largerUnit: { name: '角', factor: 10 } },
      },
    }));
    const currency = { currency: true, doNotAddOnly: true };
    expect(tw.convert('2.5', currency)).toBe('二元五角');
    expect(tw.convert('2.55', currency)).toBe('二元五角五分');
    expect(tw.convert('2.05', currency)).toBe('二元五分');
  });
});

describe('fallbacks and edge cases', () => {
  test('a plural rule with no matching form keeps the base word', () => {
    const tw = variant(PlPl, () => ({ pluralRule: 'polish', pluralForms: { 1000: { one: 'Tysiąc' } } }));
    expect(tw.convert(1000)).toBe('Tysiąc');
    expect(tw.convert(2000)).toBe('Dwa Tysiąc');
  });

  test('currency forms fall back to singular for one and plural otherwise', () => {
    const tw = variant(RuRu, (base) => ({
      pluralRule: 'east-slavic',
      currency: { ...base.currency, pluralForms: { few: 'Рубля' } },
    }));
    const currency = { currency: true, doNotAddOnly: true };
    expect(tw.convert(1, currency)).toBe('Один Рубль');
    expect(tw.convert(3, currency)).toBe('Три Рубля');
    expect(tw.convert(5, currency)).toBe('Пять Рублей');
    const noSingular = variant(RuRu, (base) => ({
      pluralRule: 'east-slavic',
      currency: { ...base.currency, singular: undefined, pluralForms: { few: 'Рубля' } },
    }));
    expect(noSingular.convert(1, currency)).toBe('Один Рублей');
  });

  test('every-component falls back when the table cannot express the number', () => {
    // The fallback is the default path on the SAME table, so compare against that.
    const withoutHundreds = (base: LocaleConfig) =>
      base.ordinalWordsMapping!.filter((entry) => entry.number !== 200 && entry.number !== 300);
    const sparsePlain = variant(EsEs, (base) => ({ ordinalWordsMapping: withoutHundreds(base) }));
    const sparse = variant(EsEs, (base) => ({
      ordinalComposition: 'every-component',
      ordinalWordsMapping: withoutHundreds(base),
    }));
    expect(sparse.toOrdinal(300)).toBe(sparsePlain.toOrdinal(300));
    const onlyLarge = (base: LocaleConfig) => base.ordinalWordsMapping!.filter((entry) => Number(entry.number) >= 1000);
    const noSmallPlain = variant(EsEs, (base) => ({ ordinalWordsMapping: onlyLarge(base) }));
    const noSmall = variant(EsEs, (base) => ({
      ordinalComposition: 'every-component',
      ordinalWordsMapping: onlyLarge(base),
    }));
    expect(noSmall.toOrdinal(25)).toBe(noSmallPlain.toOrdinal(25));
  });

  test('last-token falls back when the last token is not a cardinal word', () => {
    const plain = variant(FrFr, () => ({}));
    const tw = variant(FrFr, () => ({ ordinalComposition: 'last-token' }));
    expect(tw.toOrdinal(80)).toBe(plain.toOrdinal(80));
  });

  test('wordJoining keeps the trim separator when it sets none (ko)', () => {
    const plain = variant(KoKr, () => ({}));
    const tw = variant(KoKr, () => ({ wordJoining: {} }));
    expect(tw.convert(1234)).toBe(plain.convert(1234));
  });

  test('a split word joins into the compound (mechanism check, pt)', () => {
    const tw = variant(PtBr, () => ({ wordJoining: { compoundBelow: 1000 } }));
    expect(tw.convert(21)).toBe('Vinteeum');
    expect(tw.convert(121)).toBe('Centoevinteeum');
  });
});

describe('contract for the new keys', () => {
  const base = new RuRu().config;
  const invalid: [string, Partial<LocaleConfig>][] = [
    ['pluralRule', { pluralRule: 'klingon' as PluralRuleName }],
    ['pluralForms[1000].lots', { pluralForms: { 1000: { lots: 'x' } as never } }],
    ['wordJoining.compoundBelow', { wordJoining: { compoundBelow: 0 } }],
    ['wordJoining.separator', { wordJoining: { separator: 5 as never } }],
    ['wordJoining.separateAfter', { wordJoining: { separateAfter: [1.5] } }],
    ['ordinalComposition', { ordinalComposition: 'sideways' as never }],
    ['currencyScaleConnector', { currencyScaleConnector: { word: 'De', minScale: 0 } }],
    [
      'largerUnit',
      {
        currency: {
          ...base.currency,
          fractionalUnit: { ...base.currency.fractionalUnit, largerUnit: { name: '角', factor: 1 } },
        },
      },
    ],
    ['numberWordsMapping[0].gender', { numberWordsMapping: [{ number: 0, value: 'x', gender: 'neuter' as never }] }],
  ];

  test.each(invalid)('rejects an invalid %s', (key, patch) => {
    expect(() => assertLocaleConfig({ ...base, ...patch }, 'custom')).toThrow(key);
  });

  test('accepts a valid configuration of every new key', () => {
    expect(() =>
      assertLocaleConfig(
        {
          ...base,
          pluralRule: 'east-slavic',
          pluralForms: { 1000: { few: 'Тысячи', many: 'Тысяч' } },
          wordJoining: { separator: ' ', compoundBelow: 1000, separateAfter: [1000] },
          zeroForSkippedPlaces: true,
          ordinalComposition: 'last-token',
          currencyScaleConnector: { word: 'De', minScale: 1000000, elidedWord: "D'" },
        },
        'custom',
      ),
    ).not.toThrow();
  });
});

describe('inner "one" and fused scale ordinals (ru)', () => {
  const plain = variant(RuRu, () => ({ keepOneBeforeInnerScales: undefined, ordinalScaleStems: undefined }));
  const ru = variant(RuRu, () => ({}));

  test('keepOneBeforeInnerScales keeps "one" only before an inner scale word', () => {
    expect(ru.convert(1000)).toBe('Тысяча');
    expect(ru.convert(1001000)).toBe('Миллион Одна Тысяча');
    expect(ru.convert(2001000000)).toBe('Два Миллиарда Один Миллион');
    expect(ru.convert(1100)).toBe('Тысяча Сто');
    expect(plain.convert(1001000)).toBe('Миллион Тысяча');
  });

  test.each([
    [1000, 'Тысячный'],
    [2000, 'Двухтысячный'],
    [21000, 'Двадцатиоднотысячный'],
    [25000, 'Двадцатипятитысячный'],
    [125000, 'Стодвадцатипятитысячный'],
    [1001000, 'Миллион Тысячный'],
    [2100000, 'Два Миллиона Стотысячный'],
    [5000000, 'Пятимиллионный'],
    [2100, 'Две Тысячи Сотый'],
    [2700, 'Две Тысячи Семисотый'],
    [21, 'Двадцать Первый'],
  ])('ordinalScaleStems: %s → %s', (input, expected) => {
    expect(ru.toOrdinal(input)).toBe(expected);
  });

  test('ordinalScaleStems falls back when a stem or the scale ordinal is missing', () => {
    const noStems = variant(RuRu, () => ({ ordinalScaleStems: { 2: 'двух' } }));
    expect(noStems.toOrdinal(2000)).toBe('Двухтысячный');
    expect(noStems.toOrdinal(3000)).toBe(plain.toOrdinal(3000));
    const noScaleOrdinal = variant(RuRu, (base) => ({
      ordinalWordsMapping: base.ordinalWordsMapping?.filter((entry) => entry.number !== 1000),
    }));
    expect(noScaleOrdinal.toOrdinal(3000)).toBe(
      variant(RuRu, (base) => ({
        ordinalScaleStems: undefined,
        ordinalWordsMapping: base.ordinalWordsMapping?.filter((entry) => entry.number !== 1000),
      })).toOrdinal(3000),
    );
  });
});

describe('multiplier words, tens-and-units ordinals, separate ordinals', () => {
  const sk = variant(SkSk, () => ({}));
  const pl = variant(PlPl, () => ({}));

  test('multiplierForms replaces only the listed multiplier (sk)', () => {
    expect(sk.convert(2000)).toBe('Dvetisíc');
    expect(sk.convert(22000)).toBe('Dvadsaťdvatisíc');
    expect(sk.convert(2000000000)).toBe('Dve Miliardy');
    expect(sk.convert(3000000000)).toBe('Tri Miliardy');
  });

  test.each([
    [20, 'Dwudziesty'],
    [21, 'Dwudziesty Pierwszy'],
    [111, 'Sto Jedenasty'],
    [2021, 'Dwa Tysiące Dwudziesty Pierwszy'],
  ])('ordinalTensAndUnits (pl): %s → %s', (input, expected) => {
    expect(pl.toOrdinal(input)).toBe(expected);
  });

  test('separateOrdinalUnit keeps a final unit after the ordinal tens as its own word (sk)', () => {
    expect(sk.toOrdinal(21)).toBe('Dvadsiaty Prvý');
    expect(sk.toOrdinal(124)).toBe('Stodvadsiaty Štvrtý');
    expect(sk.toOrdinal(101)).toBe('Stoprvý');
    expect(sk.convert(21)).toBe('Dvadsaťjeden');
    const glued = variant(SkSk, (base) => ({ wordJoining: { ...base.wordJoining, separateOrdinalUnit: false } }));
    expect(glued.toOrdinal(124)).toBe('Stodvadsiatyštvrtý');
  });

  test('separateAnd splits the compound around the useAnd word (sk)', () => {
    expect(sk.convert(1001, { useAnd: true })).toBe('Tisíc A Jeden');
    expect(sk.convert(1000, { useAnd: true })).toBe('Tisíc');
    const glued = variant(SkSk, (base) => ({ wordJoining: { ...base.wordJoining, separateAnd: false } }));
    expect(glued.convert(1001, { useAnd: true })).toBe('Tisícajeden');
  });

  test.each([
    [2000, 'Dvojtisíci'],
    [22000, 'Dvadsaťdvatisíci'],
    [204000, 'Dvestoštyritisíci'],
    [3000000, 'Trojmiliónty'],
  ])('ordinalScaleStemsAfterMore (sk): %s → %s', (input, expected) => {
    expect(sk.toOrdinal(input)).toBe(expected);
  });

  test('invariableTwoInCompounds keeps a 2 inside a compound in its base form (sk)', () => {
    expect(sk.convert(2, { gender: 'feminine' })).toBe('Dve');
    expect(sk.convert(22, { gender: 'feminine' })).toBe('Dvadsaťdva');
    const inflecting = variant(SkSk, () => ({ invariableTwoInCompounds: false }));
    expect(inflecting.convert(22, { gender: 'feminine' })).toBe('Dvadsaťdve');
  });
});

describe('andBeforeLastComponent and wholeUsesDefaultGender (bg)', () => {
  test('without andBeforeLastComponent no «и» is written', () => {
    const plain = variant(BgBg, () => ({ andBeforeLastComponent: false }));
    expect(plain.convert(121)).toBe('Сто Двадесет Едно');
    expect(variant(BgBg, () => ({})).convert(121)).toBe('Сто Двадесет И Едно');
  });

  test('without wholeUsesDefaultGender the whole part takes the fraction gender', () => {
    const feminine = variant(BgBg, (base) => ({
      fractionReading: { ...base.fractionReading, wholeUsesDefaultGender: false },
    }));
    expect(feminine.convert(1.1)).toBe('Една Цяло И Една Десета');
    expect(variant(BgBg, () => ({})).convert(1.1)).toBe('Едно Цяло И Една Десета');
  });
});

describe('withoutOneValue (hr)', () => {
  const hr = variant(HrHr, () => ({}));

  test.each([
    [1000, 'Tisuću'],
    [1311, 'Tisuću Tristo Jedanaest'],
    [1001000, 'Milijun Jedna Tisuća'],
    [21000, 'Dvadeset Jedna Tisuća'],
  ])('%s → %s', (input, expected) => {
    expect(hr.convert(input)).toBe(expected);
  });

  test('without it the nominative is used', () => {
    const plain = variant(HrHr, (base) => ({
      numberWordsMapping: base.numberWordsMapping.map(({ withoutOneValue: _unused, ...entry }) => entry),
    }));
    expect(plain.convert(1000)).toBe('Tisuća');
  });
});

describe('fraction reading fallbacks', () => {
  test('without wholeForms the whole part keeps its gender and texts.and joins', () => {
    const noWholeForms = variant(RuRu, () => ({ fractionReading: { gender: 'feminine' } }));
    expect(noWholeForms.convert(1.5, { decimalStyle: 'fraction' })).toBe('Один И Пять Десятых');
  });

  test.each([
    [0.21, 'Ноль И Двадцать Один Сотая'],
    [0.5, 'Ноль И Пять Десятых'],
  ])('without fractionReading the legacy slavic singular rule applies: %d → %s', (input, expected) => {
    const legacy = variant(RuRu, () => ({ fractionReading: undefined }));
    expect(legacy.convert(input, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('isDefault applies only when no decimalStyle is passed', () => {
    const ru = variant(RuRu, () => ({}));
    expect(ru.convert(0.5)).toBe('Ноль Целых Пять Десятых');
    expect(ru.convert(0.5, { decimalStyle: 'digit' })).toBe('Ноль Целых Пять');
  });

  test('ignoreZeroInDecimals drops the zero whole part and its noun', () => {
    const noZero = variant(RuRu, () => ({ ignoreZeroInDecimals: true }));
    expect(noZero.convert(0.5)).toBe('Пять Десятых');
  });
});

describe('multiplierFollowsGender', () => {
  const es = variant(EsEs, () => ({}));
  const off = variant(EsEs, () => ({ multiplierFollowsGender: undefined }));

  test.each([
    [200000, 'Doscientas Mil'],
    [21000, 'Veintiuna Mil'],
    [200000000, 'Doscientos Millones'],
  ])('cardinal %d (feminine) → %s', (input, expected) => {
    expect(es.convert(input, { gender: 'feminine' })).toBe(expected);
  });

  test('ordinal multiplier of a listed scale takes the gender; others stay masculine', () => {
    expect(es.toOrdinal(200000, { gender: 'feminine' })).toBe('Doscientas Milésima');
    expect(es.toOrdinal(200000000, { gender: 'feminine' })).toBe('Doscientos Millonésima');
  });

  test('without the key the multiplier keeps the scale word gender', () => {
    expect(off.convert(200000, { gender: 'feminine' })).toBe('Doscientos Mil');
    expect(off.toOrdinal(200000, { gender: 'feminine' })).toBe('Doscientos Milésima');
  });
});

describe('ordinal of an exact-word last component', () => {
  const en = variant(EnUs, () => ({}));
  test.each([
    [100, 'One Hundredth'],
    [1100, 'One Thousand One Hundredth'],
    [2100, 'Two Thousand One Hundredth'],
    [1200, 'One Thousand Two Hundredth'],
  ])('toOrdinal %d → %s (CLDR en spellout-ordinal)', (input, expected) => {
    expect(en.toOrdinal(input)).toBe(expected);
  });
});

describe('trailingBeforeScales (fr cent/vingt agreement)', () => {
  const fr = variant(FrFr, () => ({}));
  const off = variant(FrFr, () => ({ trailingBeforeScales: undefined }));
  test.each([
    [200, 'Deux Cents'],
    [200000, 'Deux Cent Mille'],
    [200000000, 'Deux Cents Millions'],
    [80000000, 'Quatre-Vingts Millions'],
  ])('%d → %s', (input, expected) => {
    expect(fr.convert(input)).toBe(expected);
  });
  test('without the key a multiplier of a noun scale is not final', () => {
    expect(off.convert(80000000)).toBe('Quatre-Vingt Millions');
  });
  test.each([
    [21, 'Vingt Et Unième'],
    [24, 'Vingt-Quatrième'],
    [101, 'Cent Unième'],
    [2000001, 'Deux Millions Unième'],
  ])('ordinal %d → %s (last-token, compoundValue Unième)', (input, expected) => {
    expect(fr.toOrdinal(input)).toBe(expected);
  });
});

describe('ro-RO: nounConnector, multiplierOverrides, ordinalLastTokenForms', () => {
  const ro = variant(RoRo, () => ({}));
  const plain = variant(RoRo, () => ({ nounConnector: undefined, ordinalCompoundPrefix: undefined }));
  test.each([
    [20000, 'Douăzeci De Mii'],
    [101000, 'O Sută Una Mii'],
    [21000000, 'Douăzeci Și Unu De Milioane'],
    [22000000, 'Douăzeci Și Două De Milioane'],
  ])('cardinal %d → %s', (input, expected) => {
    expect(ro.convert(input)).toBe(expected);
  });
  test('currency takes «de» on both units', () => {
    expect(ro.convert(21.21, { currency: true })).toBe('Douăzeci Și Unu De Lei Și Douăzeci Și Unu De Bani Exact');
  });
  test.each([
    [21, 'Al Douăzeci Și Unulea'],
    [1200, 'Al O Mie Două Sutelea'],
    [2000000, 'Al Două Milioanelea'],
  ])('ordinal %d → %s', (input, expected) => {
    expect(ro.toOrdinal(input)).toBe(expected);
  });
  test('without the keys', () => {
    expect(plain.convert(20000)).toBe('Douăzeci Mii');
    expect(plain.toOrdinal(21)).toBe('Douăzeci Și Unulea');
  });
});

describe('pt-BR: splitWordBeforeSimpleGroup', () => {
  const pt = variant(PtBr, () => ({}));
  const off = variant(PtBr, () => ({ splitWordBeforeSimpleGroup: undefined }));
  test.each([
    [1001, 'Mil E Um'],
    [1100, 'Mil E Cem'],
    [1101, 'Mil Cento E Um'],
    [1200000, 'Um Milhão E Duzentos Mil'],
  ])('%d → %s', (input, expected) => {
    expect(pt.convert(input)).toBe(expected);
  });
  test('without the key no connector after Mil', () => {
    expect(off.convert(1001)).toBe('Mil Um');
  });
});

describe('fi-FI: ordinalMultipliers', () => {
  const fi = variant(FiFi, () => ({}));
  test.each([
    [2000, 'Kahdes Tuhannes'],
    [21000, 'Kahdeskymmenes Ensimmäinen Tuhannes'],
    [701, 'Seitsemässadas Ensimmäinen'],
  ])('ordinal %d → %s', (input, expected) => {
    expect(fi.toOrdinal(input)).toBe(expected);
  });
  test('a multiplier with no ordinal words falls back to the last-component ordinal', () => {
    const sparse = variant(FiFi, (config) => ({
      ordinalWordsMapping: config.ordinalWordsMapping!.filter(({ number }) => Number(number) >= 1000),
    }));
    expect(sparse.toOrdinal(2000)).toBe('Kaksi Tuhannes');
  });
});

describe('last-token ordinals with a repeated cardinal form', () => {
  test('a nonLeadingValue equal to the value maps once and still ordinalises', () => {
    const it = variant(ItIt, (config) => ({
      numberWordsMapping: config.numberWordsMapping.map((entry) =>
        entry.number === 3 ? { ...entry, nonLeadingValue: 'Tre' } : entry,
      ),
    }));
    expect(it.convert(103)).toBe('Cento Tre');
    expect(it.toOrdinal(103)).toBe('Cento Treesimo');
  });
});

describe('formalConfig ordinal exact words', () => {
  test('a formal ordinalExactWordsMapping replaces the plain one', () => {
    const zh = variant(ZhCn, (config) => ({
      formalConfig: { ...config.formalConfig, ordinalExactWordsMapping: [{ number: 100, value: '第壹佰' }] },
    }));
    expect(zh.toOrdinal(100, { formal: true })).toBe('第壹佰');
    expect(zh.toOrdinal(100)).toBe('第一 百');
  });

  test('a formalConfig without exactWordsMapping keeps the plain exact words', () => {
    const zh = variant(ZhCn, (config) => {
      const { exactWordsMapping: _ignored, ...formal } = config.formalConfig!;
      return { formalConfig: formal };
    });
    expect(zh.convert(100, { formal: true })).toBe('一 百');
  });
});

describe('legacy pluralForms without a paucal form', () => {
  test('a paucal-range multiplier keeps the base word; 11+ takes the plural', () => {
    const sq = variant(SqAl, () => ({ pluralRule: undefined, pluralForms: { 1000000: { plural: 'Milionë' } } }));
    expect(sq.convert(3000000)).toBe('Tre Milion');
    expect(sq.convert(11000000)).toBe('Njëmbëdhjetë Milionë');
  });
});

describe('he-IL: multiplierPhrases, connectorPrefix, cardinal ordinals', () => {
  const he = variant(HeIl, () => ({}));
  test.each([
    [21, 'עשרים ואחת'],
    [3500, 'שלושת אלפים וחמש מאות'],
    [11000, 'אחד עשר אלף'],
    [2000000, 'שני מיליון'],
  ])('cardinal %d → %s', (input, expected) => {
    expect(he.convert(input)).toBe(expected);
  });
  test('ordinals past ten are the masculine cardinal, with or without a prefix', () => {
    expect(he.toOrdinal(21)).toBe('העשרים ואחד');
    expect(he.toOrdinal(21, { gender: 'feminine' })).toBe('העשרים ואחת');
    const bare = variant(HeIl, () => ({ ordinalPrefix: undefined }));
    expect(bare.toOrdinal(21)).toBe('עשרים ואחד');
  });
});

describe('ka-GE: beforeRemainderValue', () => {
  const ka = variant(KaGe, () => ({}));
  test.each([
    [101, 'ას ერთი'],
    [1001, 'ათას ერთი'],
    [2000, 'ორი ათასი'],
    [2236, 'ორი ათას ორას ოცდათექვსმეტი'],
  ])('%d → %s', (input, expected) => {
    expect(ka.convert(input)).toBe(expected);
  });
});

describe('fil-PH: ligature, splitWordAfterVowel', () => {
  const fil = variant(FilPh, () => ({}));
  test.each([
    [21, "Dalawampu't Isa"],
    [101, 'Isang Daan At Isa'],
    [1001, "Isang Libo't Isa"],
    [4000, 'Apat Na Libo'],
    [100000, 'Isang Daang Libo'],
    [21000, "Dalawampu't Isang Libo"],
  ])('cardinal %d → %s', (input, expected) => {
    expect(fil.convert(input)).toBe(expected);
  });
  test('the linker also joins a currency amount to its unit', () => {
    expect(fil.convert(1.5, { currency: true, doNotAddOnly: true })).toBe('Isang Piso At Limampung Sentimo');
    expect(fil.convert(4, { currency: true, doNotAddOnly: true })).toBe('Apat Na Piso');
    expect(fil.convert('1.00', { currency: true, includeZeroFractional: true, doNotAddOnly: true })).toBe(
      'Isang Piso At Serong Sentimo',
    );
  });
  test('without the settings the connector and number stay separate words', () => {
    const plain = variant(FilPh, () => ({ ligature: undefined, splitWordAfterVowel: undefined }));
    expect(plain.convert(21)).toBe('Dalawampu At Isa');
    expect(plain.convert(4000)).toBe('Apat Libo');
  });
});

describe('te-IN: beforeRemainderPluralValue', () => {
  const te = variant(TeIn, () => ({}));
  test.each([
    [101, 'నూట ఒకటి'],
    [200, 'రెండు వందలు'],
    [201, 'రెండు వందల ఒకటి'],
    [250000, 'రెండు లక్షల యాభై వేలు'],
  ])('cardinal %d → %s', (input, expected) => {
    expect(te.convert(input)).toBe(expected);
  });
  test('the plural short form also stands before the counted noun', () => {
    expect(te.convert(200, { currency: true, doNotAddOnly: true })).toBe('రెండు వందల రూపాయలు');
    expect(te.convert(100, { currency: true, doNotAddOnly: true })).toBe('వంద రూపాయలు');
  });
});

describe('ar-SA: arabic plural rule, pluralFormsBeforeNoun', () => {
  const ar = variant(ArSa, () => ({}));
  test.each([
    [21, 'واحد وعشرون'],
    [3000, 'ثلاثة آلاف'],
    [11000, 'أحد عشر ألفًا'],
    [103000, 'مائة وثلاثة آلاف'],
    [200000, 'مائتا ألف'],
  ])('cardinal %d → %s', (input, expected) => {
    expect(ar.convert(input)).toBe(expected);
  });
  test('the counted noun follows the last two digits; a final scale word drops its tanwin before it', () => {
    expect(ar.convert(13, { currency: true, doNotAddOnly: true })).toBe('ثلاثة عشر ريالًا');
    expect(ar.convert(103, { currency: true, doNotAddOnly: true })).toBe('مائة وثلاثة ريالات');
    expect(ar.convert(11000, { currency: true, doNotAddOnly: true })).toBe('أحد عشر ألف ريال');
    expect(ar.convert(11500, { currency: true, doNotAddOnly: true })).toBe('أحد عشر ألفًا وخمسمائة ريال');
  });
});

describe('legacy dual / paucal / plural scale forms (no pluralRule)', () => {
  const legacy = variant(ArSa, () => ({
    pluralRule: undefined,
    pluralFormsBeforeNoun: undefined,
    pluralForms: { 1000: { dual: 'ألفان', paucal: 'آلاف', plural: 'ألف' } },
    paucalConfig: { min: 3, max: 10 },
  }));
  test.each([
    [2000, 'ألفان'],
    [5000, 'خمسة آلاف'],
    [11000, 'أحد عشر ألف'],
    [103000, 'مائة وثلاثة آلاف'],
  ])('%d → %s', (input, expected) => {
    expect(legacy.convert(input)).toBe(expected);
  });
  test('without a dual form a multiplier of two keeps the plain scale word', () => {
    const noDual = variant(ArSa, () => ({
      pluralRule: undefined,
      pluralFormsBeforeNoun: undefined,
      pluralForms: { 1000: { paucal: 'آلاف', plural: 'ألف' } },
    }));
    expect(noDual.convert(2000)).toBe('ألفان');
  });
});

describe('connector and only-word defaults', () => {
  test('useAndByDefault turns useAnd on unless the caller opts out (da, nb)', () => {
    const withAnd = variant(EnUs, () => ({ useAndByDefault: true }));
    expect(withAnd.convert(120)).toBe('One Hundred And Twenty');
    expect(withAnd.convert(1005, { currency: true })).toBe('One Thousand And Five Dollars Only');
    expect(withAnd.convert(120, { useAnd: false })).toBe('One Hundred Twenty');
  });

  test('onlyBefore opens the amount and only closes it (ar فقط ... لا غير)', () => {
    expect(new ToWordsCore().setLocale(ArSa, 'ar-SA').convert(100, { currency: true })).toBe('فقط مائة ريال لا غير');
    const enclosed = variant(EnUs, (config) => ({ texts: { ...config.texts, onlyBefore: 'Exactly' } }));
    expect(enclosed.convert(5, { currency: true })).toBe('Exactly Five Dollars Only');
    expect(enclosed.convert(5, { currency: true, doNotAddOnly: true })).toBe('Five Dollars');
  });

  test('beforeRemainderValue applies to directly named numbers too (ar مائتان وخمسون ريالًا)', () => {
    const arabic = new ToWordsCore().setLocale(ArSa, 'ar-SA');
    expect(arabic.convert(200, { currency: true, doNotAddOnly: true })).toBe('مائتا ريال');
    expect(arabic.convert(250, { currency: true, doNotAddOnly: true })).toBe('مائتان وخمسون ريالًا');
  });
});

describe('ordinalScaleStemsMaxScale', () => {
  test('stems fuse up to the limit and larger scales keep a cardinal multiplier (el)', () => {
    const greek = new ToWordsCore().setLocale(ElGr, 'el-GR');
    expect(greek.toOrdinal(2000)).toBe('Δισχιλιοστό');
    expect(greek.toOrdinal(2001)).toBe('Δισχιλιοστό Πρώτο');
    expect(greek.toOrdinal(2000000)).toBe('Δύο Εκατομμυριοστό');
    const unlimited = variant(ElGr, () => ({ ordinalScaleStemsMaxScale: undefined }));
    expect(unlimited.toOrdinal(2000000)).toBe('Δισεκατομμυριοστό');
  });
});

describe('multiplierPhrasesBeforeRemainder', () => {
  test('a fused multiplier phrase takes its joining form when more follows (ml)', () => {
    const malayalam = new ToWordsCore().setLocale(MlIn, 'ml-IN');
    expect(malayalam.convert(2000)).toBe('രണ്ടായിരം');
    expect(malayalam.convert(2500)).toBe('രണ്ടായിരത്തി അഞ്ഞൂറ്');
    const phraseOnly = variant(MlIn, (config) => ({
      numberWordsMapping: config.numberWordsMapping.map((entry) =>
        entry.number === 1000 ? { ...entry, multiplierPhrasesBeforeRemainder: undefined } : entry,
      ),
    }));
    expect(phraseOnly.convert(2500)).toBe('രണ്ടായിരം അഞ്ഞൂറ്');
  });
});

describe('output style: casing, hyphenate, digit-by-digit decimals', () => {
  const en = new ToWordsCore().setLocale(EnUs, 'en-US');
  const de = new ToWordsCore().setLocale(DeDe, 'de-DE');
  const dollar = {
    name: 'US-Dollar',
    plural: 'US-Dollar',
    symbol: '$',
    fractionalUnit: { name: 'Cent', plural: 'Cent', symbol: '' },
  };

  test('every casing mode', () => {
    expect(en.convert(21.5, { currency: true, casing: 'lower' })).toBe('twenty one dollars and fifty cents only');
    expect(en.convert(21, { casing: 'upper' })).toBe('TWENTY ONE');
    expect(en.convert(21, { casing: 'title' })).toBe('Twenty One');
    expect(en.convert(21, { casing: 'natural' })).toBe('twenty one');
    expect(en.convert(21, { casing: 'sentence', hyphenate: true })).toBe('Twenty-one');
    expect(en.toOrdinal(99, { casing: 'lower', hyphenate: true })).toBe('ninety-ninth');
  });

  test('natural keeps the words the language capitalises, and a caller-supplied currency', () => {
    expect(de.convert(2500000, { currency: true, casing: 'natural' })).toBe('zwei Millionen fünfhunderttausend Euro');
    expect(de.convert(2500000, { currency: true, casing: 'lower' })).toBe('zwei millionen fünfhunderttausend euro');
    expect(de.convert(1.45, { decimalStyle: 'fraction', casing: 'sentence' })).toBe(
      'Eins und fünfundvierzig Hundertstel',
    );
    expect(de.toOrdinal(1000000, { casing: 'sentence' })).toBe('Millionste');
    expect(de.convert(5, { currency: true, casing: 'natural', currencyOptions: dollar })).toBe('fünf US-Dollar');
    expect(en.convert(5, { currency: true, casing: 'natural', currencyOptions: dollar })).toBe('five US-Dollar only');
    expect(en.convert(5, { currency: true, casing: 'lower', currencyOptions: dollar })).toBe('five us-dollar only');
  });

  test("the locale's case rules apply, and scripts without capitals stay as they are", () => {
    const tr = new ToWordsCore().setLocale(TrTr, 'tr-TR');
    expect(tr.convert(2, { casing: 'upper' })).toBe('İKİ');
    expect(tr.convert(2, { casing: 'lower' })).toBe('iki');
    const ka = new ToWordsCore().setLocale(KaGe, 'ka-GE');
    expect(ka.convert(21, { casing: 'sentence' })).toBe(ka.convert(21));
    // A tag the runtime rejects falls back to the root case rules.
    const custom = variant(EnUs, () => ({}));
    expect(custom.convert(21, { casing: 'lower' })).toBe('twenty one');
    expect(custom.convert(21, { casing: 'upper' })).toBe('TWENTY ONE');
  });

  test('converter defaults carry the style options', () => {
    const lower = new ToWordsCore({ converterOptions: { casing: 'lower' } }).setLocale(EnUs, 'en-US');
    expect(lower.convert(21)).toBe('twenty one');
    expect(lower.convert(21, { hyphenate: true })).toBe('twenty-one');
  });

  test('hyphenate joins tens and units only where the locale sets compoundHyphen', () => {
    expect(en.convert(121000, { hyphenate: true })).toBe('One Hundred Twenty-One Thousand');
    expect(en.convert(120, { hyphenate: true })).toBe('One Hundred Twenty');
    expect(de.convert(21, { hyphenate: true })).toBe(de.convert(21));
    const cardinalOnly = variant(EnUs, () => ({ ordinalWordsMapping: undefined }));
    expect(cardinalOnly.convert(21, { hyphenate: true })).toBe('Twenty-One');
    // Without a locale identifier the converter's own locale code supplies the case rules.
    expect(new ToWordsCore().setLocale(EnUs).convert(21, { casing: 'lower' })).toBe('twenty one');
  });

  test('digit-by-digit reads every decimal digit on its own', () => {
    expect(en.convert(123.45, { decimalStyle: 'digit-by-digit' })).toBe('One Hundred Twenty Three Point Four Five');
    expect(en.convert(123.45)).toBe('One Hundred Twenty Three Point Forty Five');
    const fa = new ToWordsCore().setLocale(FaIr, 'fa-IR');
    expect(fa.convert(1.25, { decimalStyle: 'digit-by-digit' })).not.toBe(fa.convert(1.25));
  });
});

describe('onlyWhenWhole and largerUnit.zeroWord (th, zh)', () => {
  test('the only-word closes whole amounts only', () => {
    const th = new ToWordsCore().setLocale(ThTh, 'th-TH');
    expect(th.convert(100, { currency: true })).toBe('หนึ่งร้อยบาทถ้วน');
    expect(th.convert(100.25, { currency: true })).toBe('หนึ่งร้อยบาทยี่สิบห้าสตางค์');
    const front = variant(EnUs, () => ({ onlyWhenWhole: true, onlyInFront: true }));
    expect(front.convert(5, { currency: true })).toBe('Only Five Dollars');
    expect(front.convert(5.5, { currency: true })).toBe('Five Dollars And Fifty Cents');
  });

  test('a skipped larger unit reads its zero word after a non-zero main amount', () => {
    const zh = new ToWordsCore().setLocale(ZhCn, 'zh-CN');
    expect(zh.convert(100.05, { currency: true })).toBe('一 百 元 零 五 分');
    expect(zh.convert(0.05, { currency: true })).toBe('零 元 五 分');
    expect(zh.convert(100.55, { currency: true })).toBe('一 百 元 五 角 五 分');
    const noZero = variant(ZhCn, (config) => ({
      currency: {
        ...config.currency,
        fractionalUnit: { ...config.currency.fractionalUnit, largerUnit: { name: '角', factor: 10 } },
      },
    }));
    expect(noZero.convert(100.05, { currency: true })).toBe('一 百 元 五 分');
  });
});

describe('remainder-first ordinals (ar)', () => {
  const ar = new ToWordsCore().setLocale(ArSa, 'ar-SA');

  test('beyond the verified ordinal range the caller opts into composition', () => {
    expect(() => ar.toOrdinal(10000)).toThrow(NumberOutOfRangeError);
    expect(ar.toOrdinal(1000000, { rangeMode: 'compose' })).toBe('المليون');
  });

  test('a remainder without an ordinal word falls back to its cardinal; the prefix is optional', () => {
    const bare = variant(ArSa, (config) => ({
      ordinalWordsMapping: config.ordinalWordsMapping!.filter((entry) => entry.number !== 23),
      ordinalGroupJoiner: { word: 'بعد' },
    }));
    expect(bare.toOrdinal(123)).toBe('ثلاثة وعشرون بعد مائة');
    expect(bare.toOrdinal(200)).toBe('مائتان');
  });

  test('the contract requires the joiner', () => {
    const base = new ArSa().config;
    expect(() =>
      assertLocaleConfig({ ...base, ordinalGroupJoiner: undefined, ordinalComposition: 'remainder-first' }, 'custom'),
    ).toThrow('ordinalGroupJoiner.word');
    expect(() => assertLocaleConfig(base, 'custom')).not.toThrow();
  });
});

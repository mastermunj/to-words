import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import isIs from '../src/locales/is-IS.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/is-IS.js';

const localeCode = 'is-IS';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(isIs);
  });

  describe('Test Locale ToWords', () => {
    test('ToWords from locale file works correctly', () => {
      const tw = new LocaleToWords();
      expect(tw.convert(1)).toBeDefined();
      expect(typeof tw.convert(123)).toBe('string');
    });
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    expect(() => new ToWords({ localeCode: wrongLocaleCode as never }).convert(1)).toThrow(/Unknown Locale/);
  });
});

// Currency phrase for an integer amount: króna is feminine and singular after …1 except 11.
const kronur = (amount: number, words: string): string => {
  const n = Math.abs(amount);
  const feminine = words.replace(
    /(Einn|Tveir|Þrír|Fjórir)$/,
    (unit) => ({ Einn: 'Ein', Tveir: 'Tvær', Þrír: 'Þrjár', Fjórir: 'Fjórar' })[unit]!,
  );
  return `${feminine} ${n % 10 === 1 && n % 100 !== 11 ? 'Króna' : 'Krónur'}`;
};

const testIntegers: [number, string][] = [
  [0, 'Núll'],
  [137, 'Hundrað Þrjátíu Og Sjö'],
  [700, 'Sjö Hundruð'],
  [1100, 'Þúsund Og Hundrað'],
  [4680, 'Fjögur Þúsund Sex Hundruð Og Áttatíu'],
  [63892, 'Sextíu Og Þrjú Þúsund Átta Hundruð Níutíu Og Tveir'],
  [86100, 'Áttatíu Og Sex Þúsund Og Hundrað'],
  [792581, 'Sjö Hundruð Níutíu Og Tvö Þúsund Fimm Hundruð Áttatíu Og Einn'],
  [2741034, 'Tvær Milljónir Sjö Hundruð Fjörutíu Og Eitt Þúsund Þrjátíu Og Fjórir'],
  [86429753, 'Áttatíu Og Sex Milljónir Fjögur Hundruð Tuttugu Og Níu Þúsund Sjö Hundruð Fimmtíu Og Þrír'],
  [975310864, 'Níu Hundruð Sjötíu Og Fimm Milljónir Þrjú Hundruð Og Tíu Þúsund Átta Hundruð Sextíu Og Fjórir'],
  [
    9876543210,
    'Níu Milljarðar Átta Hundruð Sjötíu Og Sex Milljónir Fimm Hundruð Fjörutíu Og Þrjú Þúsund Tvö Hundruð Og Tíu',
  ],
  [
    98765432101,
    'Níutíu Og Átta Milljarðar Sjö Hundruð Sextíu Og Fimm Milljónir Fjögur Hundruð Þrjátíu Og Tvö Þúsund Hundrað Og Einn',
  ],
  [
    987654321012,
    'Níu Hundruð Áttatíu Og Sjö Milljarðar Sex Hundruð Fimmtíu Og Fjórar Milljónir Þrjú Hundruð Tuttugu Og Eitt Þúsund Og Tólf',
  ],
  [
    9876543210123,
    'Níu Billjónir Átta Hundruð Sjötíu Og Sex Milljarðar Fimm Hundruð Fjörutíu Og Þrjár Milljónir Tvö Hundruð Og Tíu Þúsund Hundrað Tuttugu Og Þrír',
  ],
  [
    98765432101234,
    'Níutíu Og Átta Billjónir Sjö Hundruð Sextíu Og Fimm Milljarðar Fjögur Hundruð Þrjátíu Og Tvær Milljónir Hundrað Og Eitt Þúsund Tvö Hundruð Þrjátíu Og Fjórir',
  ],
];

describe('Test Integers with options = {}', () => {
  test.concurrent.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) {
      return;
    }
    row[0] = -row[0];
    row[1] = `Mínus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = kronur(row[0] as number, row[1] as string);
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = kronur(row[0] as number, row[1] as string);
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = kronur(row[0] as number, row[1] as string);
      return;
    }
    row[0] = -row[0];
    row[1] = `Mínus ${kronur(row[0] as number, row[1] as string)}`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : kronur(row[0] as number, row[1] as string);
  });

  test.concurrent.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats: [number, string][] = [
  [0.0, 'Núll'],
  [0.04, 'Núll Komma Núll Fjórir'],
  [0.0468, 'Núll Komma Núll Fjórir Sex Átta'],
  [0.4, 'Núll Komma Fjórir'],
  [0.973, 'Núll Komma Níu Hundruð Sjötíu Og Þrír'],
  [0.999, 'Núll Komma Níu Hundruð Níutíu Og Níu'],
  [37.06, 'Þrjátíu Og Sjö Komma Núll Sex'],
  [37.068, 'Þrjátíu Og Sjö Komma Núll Sex Átta'],
  [37.68, 'Þrjátíu Og Sjö Komma Sextíu Og Átta'],
  [37.683, 'Þrjátíu Og Sjö Komma Sex Hundruð Áttatíu Og Þrír'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Hundrað Tuttugu Og Þrjár Krónur`],
    ['123', `Hundrað Tuttugu Og Þrjár Krónur`],
    ['123.0', `Hundrað Tuttugu Og Þrjár Krónur Og Núll Aurar`],
    ['123.00', `Hundrað Tuttugu Og Þrjár Krónur Og Núll Aurar`],
    ['0.00', `Núll Krónur Og Núll Aurar`],
    ['-123.00', `Mínus Hundrað Tuttugu Og Þrjár Krónur Og Núll Aurar`],
    ['37.68', `Þrjátíu Og Sjö Krónur Og Sextíu Og Átta Aurar`],
  ];

  test.concurrent.each(testIncludeZeroFractional)('convert %s => %s', (input, expected) => {
    expect(
      toWords.convert(input, {
        currency: true,
        includeZeroFractional: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = {}', () => {
  test.concurrent.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, `Núll Krónur`],
  [0.04, `Núll Krónur Og Fjórir Aurar`],
  [0.0468, `Núll Krónur Og Fimm Aurar`],
  [0.4, `Núll Krónur Og Fjörutíu Aurar`],
  [0.973, `Núll Krónur Og Níutíu Og Sjö Aurar`],
  [0.999, `Ein Króna`],
  [37.06, `Þrjátíu Og Sjö Krónur Og Sex Aurar`],
  [37.068, `Þrjátíu Og Sjö Krónur Og Sjö Aurar`],
  [37.68, `Þrjátíu Og Sjö Krónur Og Sextíu Og Átta Aurar`],
  [37.683, `Þrjátíu Og Sjö Krónur Og Sextíu Og Átta Aurar`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace(`Núll Krónur Og `, '');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `Núll Krónur`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Krónur.*`), 'Krónur');
    }
  });

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testOrdinals: [number, string][] = [
  // Numbers 0-10
  [0, 'Núllti'],
  [1, 'Fyrsti'],
  [2, 'Annar'],
  [3, 'Þriðji'],
  [4, 'Fjórði'],
  [5, 'Fimmti'],
  [6, 'Sjötti'],
  [7, 'Sjöundi'],
  [8, 'Áttundi'],
  [9, 'Níundi'],
  [10, 'Tíundi'],
  [11, 'Ellefti'],
  [12, 'Tólfti'],
  [13, 'Þrettándi'],
  [14, 'Fjórtándi'],
  [15, 'Fimmtándi'],
  [16, 'Sextándi'],
  [17, 'Sautjándi'],
  [18, 'Átjándi'],
  [19, 'Nítjándi'],
  [20, 'Tuttugasti'],
  // Composite numbers (21, 22, etc.)
  [21, 'Tuttugasti Og Fyrsti'],
  [22, 'Tuttugasti Og Annar'],
  [23, 'Tuttugasti Og Þriðji'],
  [24, 'Tuttugasti Og Fjórði'],
  [25, 'Tuttugasti Og Fimmti'],
  // Tens
  [30, 'Þrítugasti'],
  [40, 'Fertugasti'],
  [50, 'Fimmtugasti'],
  [60, 'Sextugasti'],
  [70, 'Sjötugasti'],
  [80, 'Áttugasti'],
  [90, 'Níutugasti'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundraðasti'],
  [200, 'Tvö Hundraðasti'],
  [300, 'Þrjú Hundraðasti'],
  [1000, 'Þúsundasti'],
  [2000, 'Tvö Þúsundasti'],
  [1000000, 'Ein Milljónasti'],
  [2000000, 'Tvær Milljónasti'],
  // Complex numbers
  [101, 'Hundrað Og Fyrsti'],
  [102, 'Hundrað Og Annar'],
  [111, 'Hundrað Og Ellefti'],
  [123, 'Hundrað Tuttugasti Og Þriðji'],
  [150, 'Hundrað Og Fimmtugasti'],
  [1001, 'Þúsund Og Fyrsti'],
  [1234, 'Þúsund Tvö Hundruð Þrítugasti Og Fjórði'],
  [1500, 'Þúsund Og Fimm Hundraðasti'],
  [10000, 'Tíu Þúsundasti'],
  [100000, 'Hundrað Þúsundasti'],
  [1000001, 'Ein Milljón Og Fyrsti'],
];

describe('Test Ordinals with toOrdinal()', () => {
  test.concurrent.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for negative large numbers', () => {
    expect(() => toWords.toOrdinal(-100)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for small decimal numbers', () => {
    expect(() => toWords.toOrdinal(0.5)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for large decimal numbers', () => {
    expect(() => toWords.toOrdinal(100.25)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Tíu'],
  [100, 'Hundrað'],
  [1000, 'Þúsund'],
  [10000, 'Tíu Þúsund'],
  [100000, 'Hundrað Þúsund'],
  [1000000, 'Ein Milljón'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigIntegers: [bigint, string][] = [
  [0n, 'Núll'],
  [1n, 'Einn'],
  [100n, 'Hundrað'],
  [1000n, 'Þúsund'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigIntegers: [bigint, string][] = [
  [-1n, 'Mínus Einn'],
  [-100n, 'Mínus Hundrað'],
  [-1000n, 'Mínus Þúsund'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInputs: [string, string][] = [
  ['0', 'Núll'],
  ['1', 'Einn'],
  ['100', 'Hundrað'],
  ['-100', 'Mínus Hundrað'],
];

describe('Test String Inputs', () => {
  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Núll', () => {
    expect(toWords.convert(0)).toBe('Núll');
  });

  test('convert -0 => Núll', () => {
    expect(toWords.convert(-0)).toBe('Núll');
  });

  test('convert 0.0 => Núll', () => {
    expect(toWords.convert(0.0)).toBe('Núll');
  });

  test('convert 0n => Núll', () => {
    expect(toWords.convert(0n)).toBe('Núll');
  });

  test('convert "0" => Núll', () => {
    expect(toWords.convert('0')).toBe('Núll');
  });

  test('convert 0 with currency => Núll Krónur', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Núll Krónur');
  });
});

describe('Test Invalid Inputs', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow('Invalid Number "NaN"');
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow('Invalid Number "Infinity"');
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow('Invalid Number "-Infinity"');
  });

  test('convert empty string throws error', () => {
    expect(() => toWords.convert('')).toThrow('Invalid Number ""');
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow('Invalid Number "abc"');
  });
});

describe('Functional helpers (locale-level)', () => {
  test('toWords() matches new ToWords().convert()', () => {
    const tw = new LocaleToWords();
    expect(localeToWords(1)).toBe(tw.convert(1));
    expect(localeToWords(100)).toBe(tw.convert(100));
  });

  test('toOrdinal() matches new ToWords().toOrdinal()', () => {
    const tw = new LocaleToWords();
    expect(localeToOrdinal(1)).toBe(tw.toOrdinal(1));
  });

  test('toCurrency() matches new ToWords().convert() with currency:true', () => {
    const tw = new LocaleToWords();
    expect(localeToCurrency(1)).toBe(tw.convert(1, { currency: true }));
    expect(localeToCurrency(100)).toBe(tw.convert(100, { currency: true }));
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Tuttugu Og Einn'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Tuttugu Og Einn'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Tuttugu Og Ein Króna Og Fimmtíu Aurar',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'tuttugu og ein króna og fimmtíu aurar',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'TUTTUGU OG EIN KRÓNA OG FIMMTÍU AURAR',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'tuttugu og ein króna og fimmtíu aurar',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Tuttugu og ein króna og fimmtíu aurar',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Tuttugasti Og Fyrsti'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'tuttugasti og fyrsti',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Einn Komma Tuttugu Og Fimm'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Einn Komma Tveir Fimm',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

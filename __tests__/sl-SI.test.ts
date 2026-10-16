import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import slSi from '../src/locales/sl-SI.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/sl-SI.js';

const localeCode = 'sl-SI';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(slSi);
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

const testIntegers: [number, string][] = [
  [0, 'Nič'],
  [1, 'Ena'],
  [2, 'Dve'],
  [3, 'Tri'],
  [4, 'Štiri'],
  [5, 'Pet'],
  [6, 'Šest'],
  [7, 'Sedem'],
  [8, 'Osem'],
  [9, 'Devet'],
  [10, 'Deset'],
  [11, 'Enajst'],
  [12, 'Dvanajst'],
  [13, 'Trinajst'],
  [14, 'Štirinajst'],
  [15, 'Petnajst'],
  [16, 'Šestnajst'],
  [17, 'Sedemnajst'],
  [18, 'Osemnajst'],
  [19, 'Devetnajst'],
  [20, 'Dvajset'],
  [21, 'Enaindvajset'],
  [22, 'Dvaindvajset'],
  [30, 'Trideset'],
  [35, 'Petintrideset'],
  [40, 'Štirideset'],
  [50, 'Petdeset'],
  [60, 'Šestdeset'],
  [70, 'Sedemdeset'],
  [80, 'Osemdeset'],
  [90, 'Devetdeset'],
  [99, 'Devetindevetdeset'],
  [100, 'Sto'],
  [137, 'Sto Sedemintrideset'],
  [200, 'Dvesto'],
  [300, 'Tristo'],
  [400, 'Štiristo'],
  [500, 'Petsto'],
  [600, 'Šeststo'],
  [700, 'Sedemsto'],
  [800, 'Osemsto'],
  [900, 'Devetsto'],
  [1000, 'Tisoč'],
  [1100, 'Tisoč Sto'],
  [2000, 'Dva Tisoč'],
  [4680, 'Štiri Tisoč Šeststo Osemdeset'],
  [10000, 'Deset Tisoč'],
  [63892, 'Triinšestdeset Tisoč Osemsto Dvaindevetdeset'],
  [100000, 'Sto Tisoč'],
  [1000000, 'Milijon'],
  [2000000, 'Dva Milijona'],
  [3000000, 'Trije Milijoni'],
  [5000000, 'Pet Milijonov'],
  [2741034, 'Dva Milijona Sedemsto Enainštirideset Tisoč Štiriintrideset'],
  [1000000000, 'Milijarda'],
  [2000000000, 'Dve Milijardi'],
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov Samo'],
    [1, 'En Evro Samo'],
    [2, 'Dva Evra Samo'],
    [10, 'Deset Evrov Samo'],
    [100, 'Sto Evrov Samo'],
    [1000, 'Tisoč Evrov Samo'],
    [1000000, 'Milijon Evrov Samo'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov'],
    [1, 'En Evro'],
    [2, 'Dva Evra'],
    [10, 'Deset Evrov'],
    [100, 'Sto Evrov'],
    [1000, 'Tisoč Evrov'],
  ];

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency: [number, string][] = [
    [0, 'Nič Evrov Samo'],
    [-1, 'Minus En Evro Samo'],
    [-10, 'Minus Deset Evrov Samo'],
    [-100, 'Minus Sto Evrov Samo'],
  ];

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0, ''],
    [1, 'En Evro Samo'],
    [10, 'Deset Evrov Samo'],
  ];

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
  [0.0, 'Nič'],
  [0.04, 'Nič Vejica Nič Štiri'],
  [0.4, 'Nič Vejica Štiri'],
  [0.63, 'Nič Vejica Triinšestdeset'],
  [37.06, 'Sedemintrideset Vejica Nič Šest'],
  [37.68, 'Sedemintrideset Vejica Oseminšestdeset'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Sto Triindvajset Evrov Samo`],
    ['123', `Sto Triindvajset Evrov Samo`],
    ['123.0', `Sto Triindvajset Evrov In Nič Centov Samo`],
    ['123.00', `Sto Triindvajset Evrov In Nič Centov Samo`],
    ['0.00', `Nič Evrov In Nič Centov Samo`],
    ['-123.00', `Minus Sto Triindvajset Evrov In Nič Centov Samo`],
    ['37.68', `Sedemintrideset Evrov In Oseminšestdeset Centov Samo`],
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
  [0.0, 'Nič Evrov Samo'],
  [0.04, 'Nič Evrov In Štirje Centi Samo'],
  [0.4, 'Nič Evrov In Štirideset Centov Samo'],
  [0.63, 'Nič Evrov In Triinšestdeset Centov Samo'],
  [37.06, 'Sedemintrideset Evrov In Šest Centov Samo'],
  [37.68, 'Sedemintrideset Evrov In Oseminšestdeset Centov Samo'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency: [number, string][] = [
    [0.0, ''],
    [0.04, 'Štirje Centi Samo'],
    [0.4, 'Štirideset Centov Samo'],
    [37.06, 'Sedemintrideset Evrov In Šest Centov Samo'],
  ];

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
  const testFloatsWithCurrencyAndIgnoreDecimal: [number, string][] = [
    [0.0, 'Nič Evrov Samo'],
    [0.04, 'Nič Evrov Samo'],
    [0.4, 'Nič Evrov Samo'],
    [37.06, 'Sedemintrideset Evrov Samo'],
    [37.68, 'Sedemintrideset Evrov Samo'],
  ];

  test.concurrent.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

// Ordinal Tests
const testOrdinals: [number, string][] = [
  [1, 'Prvi'],
  [2, 'Drugi'],
  [3, 'Tretji'],
  [4, 'Četrti'],
  [5, 'Peti'],
  [6, 'Šesti'],
  [7, 'Sedmi'],
  [8, 'Osmi'],
  [9, 'Deveti'],
  [10, 'Deseti'],
  [11, 'Enajsti'],
  [12, 'Dvanajsti'],
  [13, 'Trinajsti'],
  [19, 'Devetnajsti'],
  [20, 'Dvajseti'],
  [21, 'Enaindvajseti'],
  [30, 'Trideseti'],
  [50, 'Petdeseti'],
  [100, 'Stoti'],
  [101, 'Sto Prvi'],
  [110, 'Sto Deseti'],
  [200, 'Dvestoti'],
  [1000, 'Tisoči'],
  [1001, 'Tisoč Prvi'],
];

describe('Test Ordinals', () => {
  test.concurrent.each(testOrdinals)('toOrdinal %d => %s', (input, expected) => {
    expect(toWords.toOrdinal(input as number)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow('Ordinal numbers must be non-negative integers');
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow('Ordinal numbers must be non-negative integers');
  });
});

describe('Test Powers of Ten', () => {
  const testPowersOfTen: [number, string][] = [
    [10, 'Deset'],
    [100, 'Sto'],
    [1000, 'Tisoč'],
    [10000, 'Deset Tisoč'],
    [100000, 'Sto Tisoč'],
    [1000000, 'Milijon'],
  ];

  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test BigInt', () => {
  const testBigInts: [bigint, string][] = [
    [0n, 'Nič'],
    [1n, 'Ena'],
    [100n, 'Sto'],
    [1000n, 'Tisoč'],
  ];

  test.concurrent.each(testBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Negative BigInt', () => {
  const testNegativeBigInts: [bigint, string][] = [
    [-1n, 'Minus Ena'],
    [-100n, 'Minus Sto'],
    [-1000n, 'Minus Tisoč'],
  ];

  test.concurrent.each(testNegativeBigInts)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test String Input', () => {
  const testStringInputs: [string, string][] = [
    ['0', 'Nič'],
    ['1', 'Ena'],
    ['100', 'Sto'],
    ['-100', 'Minus Sto'],
  ];

  test.concurrent.each(testStringInputs)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => Nič', () => {
    expect(toWords.convert(0)).toBe('Nič');
  });

  test('convert -0 => Nič', () => {
    expect(toWords.convert(-0)).toBe('Nič');
  });

  test('convert 0.0 => Nič', () => {
    expect(toWords.convert(0.0)).toBe('Nič');
  });

  test('convert 0n => Nič', () => {
    expect(toWords.convert(0n)).toBe('Nič');
  });

  test('convert "0" => Nič', () => {
    expect(toWords.convert('0')).toBe('Nič');
  });

  test('convert 0 with currency => Nič Evrov Samo', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Nič Evrov Samo');
  });
});

describe('Test Invalid Input', () => {
  const testInvalidInputs: [unknown, string][] = [
    [Number.NaN, 'Invalid Number "NaN"'],
    [Infinity, 'Invalid Number "Infinity"'],
    [-Infinity, 'Invalid Number "-Infinity"'],
    ['', 'Invalid Number ""'],
    ['abc', 'Invalid Number "abc"'],
  ];

  test.concurrent.each(testInvalidInputs)('convert %s throws error', (input, expectedMessage) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedMessage);
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

const testFractionStyleSlSI: [number, string][] = [
  [1.1, 'Ena In Ena Desetinka'],
  [2.5, 'Dve In Pet Desetinke'],
  [1.01, 'Ena In Ena Stotinka'],
  [1.45, 'Ena In Petinštirideset Stotinke'],
  [0.05, 'Nič In Pet Stotinke'],
  [1.001, 'Ena In Ena Tisočinka'],
  [1.005, 'Ena In Pet Tisočinke'],
  [1.0001, 'Ena In Ena Desetotisočinka'],
  [1.0005, 'Ena In Pet Desetotisočinke'],
  [1.00001, 'Ena In Ena Sto-Tisočinka'],
  [1.00005, 'Ena In Pet Sto-Tisočinke'],
  [1.000001, 'Ena In Ena Milijontinka'],
  [1.000005, 'Ena In Pet Milijontinke'],
  [123.45, 'Sto Triindvajset In Petinštirideset Stotinke'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleSlSI)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'Ena Vejica Milijon Dvesto Štiriintrideset Tisoč Petsto Sedeminšestdeset',
    );
    expect(toWords.convert(1.1234567)).toBe('Ena Vejica Milijon Dvesto Štiriintrideset Tisoč Petsto Sedeminšestdeset');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('Ena Vejica Pet');
    expect(toWords.convert(0.05)).toBe('Nič Vejica Nič Pet');
  });
});

// Attested examples from en.wikipedia «Slovene numerals» and en.wiktionary. Units come before tens as one
// word (enaindvajset); hundreds/thousands/millions are separate words; scale nouns take dual/paucal/
// genitive-plural forms and the multiplier agrees with the noun's gender.
describe('en.wikipedia «Slovene numerals» / en.wiktionary — attested forms', () => {
  test.each([
    [21, 'Enaindvajset'],
    [22, 'Dvaindvajset'],
    [101, 'Sto Ena'],
    [121, 'Sto Enaindvajset'],
    [999, 'Devetsto Devetindevetdeset'],
    [1001, 'Tisoč Ena'],
    [1100, 'Tisoč Sto'],
    [5555, 'Pet Tisoč Petsto Petinpetdeset'],
    [2000, 'Dva Tisoč'],
    [3000, 'Tri Tisoč'],
    [4000, 'Štiri Tisoč'],
    [2000000, 'Dva Milijona'],
    [3000000, 'Trije Milijoni'],
    [7000000, 'Sedem Milijonov'],
    [7015027, 'Sedem Milijonov Petnajst Tisoč Sedemindvajset'],
    [2000000000, 'Dve Milijardi'],
    [3000000000, 'Tri Milijarde'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  test('only the last word of a multi-word number becomes the ordinal', () => {
    expect(toWords.toOrdinal(200)).toBe('Dvestoti');
    expect(toWords.toOrdinal(201)).toBe('Dvesto Prvi');
    expect(toWords.toOrdinal(21)).toBe('Enaindvajseti');
  });

  test('euro agrees with the amount (dual / paucal / genitive plural)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('En Evro Samo');
    expect(toWords.convert(2, { currency: true })).toBe('Dva Evra Samo');
    expect(toWords.convert(3, { currency: true })).toBe('Trije Evri Samo');
    expect(toWords.convert(5, { currency: true })).toBe('Pet Evrov Samo');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Enaindvajset'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Enaindvajset'],
    [
      "casing 'title'",
      () => styled.convert(21.5, { currency: true, casing: 'title' }),
      'Enaindvajset Evrov In Petdeset Centov Samo',
    ],
    [
      "casing 'lower'",
      () => styled.convert(21.5, { currency: true, casing: 'lower' }),
      'enaindvajset evrov in petdeset centov samo',
    ],
    [
      "casing 'upper'",
      () => styled.convert(21.5, { currency: true, casing: 'upper' }),
      'ENAINDVAJSET EVROV IN PETDESET CENTOV SAMO',
    ],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'enaindvajset evrov in petdeset centov samo',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Enaindvajset evrov in petdeset centov samo',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Enaindvajseti'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'enaindvajseti',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'Ena Vejica Petindvajset'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'Ena Vejica Dve Pet',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

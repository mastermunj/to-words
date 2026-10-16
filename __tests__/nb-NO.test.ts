import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nbNo from '../src/locales/nb-NO.js';
import {
  ToWords as LocaleToWords,
  toWords as localeToWords,
  toOrdinal as localeToOrdinal,
  toCurrency as localeToCurrency,
} from '../src/locales/nb-NO.js';

const localeCode = 'nb-NO';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(nbNo);
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
  [0, 'Null'],
  [137, 'Hundre Og Trettisju'],
  [700, 'Sju Hundre'],
  [1100, 'Tusen Hundre'],
  [4680, 'Fire Tusen Seks Hundre Og Åtti'],
  [63892, 'Sekstitre Tusen Åtte Hundre Og Nittito'],
  [86100, 'Åttiseks Tusen Hundre'],
  [792581, 'Sju Hundre Og Nittito Tusen Fem Hundre Og Åttien'],
  [2741034, 'To Millioner Sju Hundre Og Førtien Tusen Og Trettifire'],
  [86429753, 'Åttiseks Millioner Fire Hundre Og Tjueni Tusen Sju Hundre Og Femtitre'],
  [975310864, 'Ni Hundre Og Syttifem Millioner Tre Hundre Og Ti Tusen Åtte Hundre Og Sekstifire'],
  [9876543210, 'Ni Milliarder Åtte Hundre Og Syttiseks Millioner Fem Hundre Og Førtitre Tusen To Hundre Og Ti'],
  [98765432101, 'Nittiåtte Milliarder Sju Hundre Og Sekstifem Millioner Fire Hundre Og Trettito Tusen Hundre Og En'],
  [
    987654321012,
    'Ni Hundre Og Åttisju Milliarder Seks Hundre Og Femtifire Millioner Tre Hundre Og Tjueen Tusen Og Tolv',
  ],
  [
    9876543210123,
    'Ni Billioner Åtte Hundre Og Syttiseks Milliarder Fem Hundre Og Førtitre Millioner To Hundre Og Ti Tusen Hundre Og Tjuetre',
  ],
  [
    98765432101234,
    'Nittiåtte Billioner Sju Hundre Og Sekstifem Milliarder Fire Hundre Og Trettito Millioner Hundre Og En Tusen To Hundre Og Trettifire',
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
    row[1] = `Minus ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Kroner`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Kroner`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Kroner`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Minus ${row[1]} Kroner`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} Kroner`;
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
  [0.0, 'Null'],
  [0.04, 'Null Komma Null Fire'],
  [0.0468, 'Null Komma Null Fire Seks Åtte'],
  [0.4, 'Null Komma Fire'],
  [0.973, 'Null Komma Ni Hundre Syttitre'],
  [0.999, 'Null Komma Ni Hundre Nittini'],
  [37.06, 'Trettisju Komma Null Seks'],
  [37.068, 'Trettisju Komma Null Seks Åtte'],
  [37.68, 'Trettisju Komma Sekstiåtte'],
  [37.683, 'Trettisju Komma Seks Hundre Åttitre'],
];

describe('Test with options = { currency: true, includeZeroFractional: true }', () => {
  const testIncludeZeroFractional: [number | string, string][] = [
    [123, `Hundre Og Tjuetre Kroner`],
    ['123', `Hundre Og Tjuetre Kroner`],
    ['123.0', `Hundre Og Tjuetre Kroner Og Null Øre`],
    ['123.00', `Hundre Og Tjuetre Kroner Og Null Øre`],
    ['0.00', `Null Kroner Og Null Øre`],
    ['-123.00', `Minus Hundre Og Tjuetre Kroner Og Null Øre`],
    ['37.68', `Trettisju Kroner Og Sekstiåtte Øre`],
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
  [0.0, `Null Kroner`],
  [0.04, `Null Kroner Og Fire Øre`],
  [0.0468, `Null Kroner Og Fem Øre`],
  [0.4, `Null Kroner Og Førti Øre`],
  [0.973, `Null Kroner Og Nittisju Øre`],
  [0.999, `En Krone`],
  [37.06, `Trettisju Kroner Og Seks Øre`],
  [37.068, `Trettisju Kroner Og Sju Øre`],
  [37.68, `Trettisju Kroner Og Sekstiåtte Øre`],
  [37.683, `Trettisju Kroner Og Sekstiåtte Øre`],
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
      row[1] = (row[1] as string).replace(`Null Kroner Og `, '');
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
      row[1] = `Null Kroner`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(`Kroner.*`), 'Kroner');
      row[1] = (row[1] as string).replace(new RegExp(`Krone Og.*`), 'Krone');
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
  [0, 'Nullte'],
  [1, 'Første'],
  [2, 'Andre'],
  [3, 'Tredje'],
  [4, 'Fjerde'],
  [5, 'Femte'],
  [6, 'Sjette'],
  [7, 'Sjuende'],
  [8, 'Åttende'],
  [9, 'Niende'],
  [10, 'Tiende'],
  [11, 'Ellevte'],
  [12, 'Tolvte'],
  [13, 'Trettende'],
  [14, 'Fjortende'],
  [15, 'Femtende'],
  [16, 'Sekstende'],
  [17, 'Syttende'],
  [18, 'Attende'],
  [19, 'Nittende'],
  [20, 'Tjuende'],
  // Composite numbers (21, 22, etc.)
  [21, 'Tjueførste'],
  [22, 'Tjueandre'],
  [23, 'Tjuetredje'],
  [24, 'Tjuefjerde'],
  [25, 'Tjuefemte'],
  // Tens
  [30, 'Trettiende'],
  [40, 'Førtiende'],
  [50, 'Femtiende'],
  [60, 'Sekstiende'],
  [70, 'Syttiende'],
  [80, 'Åttiende'],
  [90, 'Nittiende'],
  // Round numbers (100, 200, 1000, etc.)
  [100, 'Hundrede'],
  [200, 'To Hundrede'],
  [300, 'Tre Hundrede'],
  [1000, 'Tusende'],
  [2000, 'To Tusende'],
  [1000000, 'En Millionte'],
  [2000000, 'To Millionte'],
  // Complex numbers
  [101, 'Hundre Første'],
  [102, 'Hundre Andre'],
  [111, 'Hundre Ellevte'],
  [123, 'Hundre Tjuetredje'],
  [150, 'Hundre Femtiende'],
  [1001, 'Tusen Første'],
  [1234, 'Tusen To Hundre Trettifjerde'],
  [1500, 'Tusen Fem Hundrede'],
  [10000, 'Ti Tusende'],
  [100000, 'Hundre Tusende'],
  [1000001, 'En Million Første'],
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

describe('Test Norwegian-specific numbers', () => {
  test('Single Krone (1)', () => {
    expect(toWords.convert(1, { currency: true })).toBe('En Krone');
  });

  test('Two Kroner', () => {
    expect(toWords.convert(2, { currency: true })).toBe('To Kroner');
  });

  test('Teens (11-19)', () => {
    expect(toWords.convert(11)).toBe('Elleve');
    expect(toWords.convert(12)).toBe('Tolv');
    expect(toWords.convert(13)).toBe('Tretten');
    expect(toWords.convert(14)).toBe('Fjorten');
    expect(toWords.convert(15)).toBe('Femten');
    expect(toWords.convert(16)).toBe('Seksten');
    expect(toWords.convert(17)).toBe('Sytten');
    expect(toWords.convert(18)).toBe('Atten');
    expect(toWords.convert(19)).toBe('Nitten');
  });

  test('Twenties', () => {
    expect(toWords.convert(20)).toBe('Tjue');
    expect(toWords.convert(21)).toBe('Tjueen');
    expect(toWords.convert(22)).toBe('Tjueto');
    expect(toWords.convert(25)).toBe('Tjuefem');
    expect(toWords.convert(28)).toBe('Tjueåtte');
  });

  test('Large numbers', () => {
    expect(toWords.convert(1000000)).toBe('En Million');
    expect(toWords.convert(1000000000)).toBe('En Milliard');
    expect(toWords.convert(2000000)).toBe('To Millioner');
    expect(toWords.convert(2000000000)).toBe('To Milliarder');
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'Ti'],
  [100, 'Hundre'],
  [1000, 'Tusen'],
  [10000, 'Ti Tusen'],
  [100000, 'Hundre Tusen'],
  [1000000, 'En Million'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'Null'],
  [1n, 'En'],
  [100n, 'Hundre'],
  [1000n, 'Tusen'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'Minus En'],
  [-100n, 'Minus Hundre'],
  [-1000n, 'Minus Tusen'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as bigint)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'Null'],
  ['1', 'En'],
  ['100', 'Hundre'],
  ['-100', 'Minus Hundre'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input as string)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('Zero as number', () => {
    expect(toWords.convert(0)).toBe('Null');
  });

  test('Negative zero', () => {
    expect(toWords.convert(-0)).toBe('Null');
  });

  test('Zero as float', () => {
    expect(toWords.convert(0.0)).toBe('Null');
  });

  test('Zero as BigInt', () => {
    expect(toWords.convert(0n)).toBe('Null');
  });

  test('Zero as string', () => {
    expect(toWords.convert('0')).toBe('Null');
  });

  test('Zero with currency', () => {
    expect(toWords.convert(0, { currency: true })).toBe('Null Kroner');
  });
});

const testInvalidInputs: [unknown, string][] = [
  [Number.NaN, 'Invalid Number "NaN"'],
  [Infinity, 'Invalid Number "Infinity"'],
  [-Infinity, 'Invalid Number "-Infinity"'],
  ['', 'Invalid Number ""'],
  ['abc', 'Invalid Number "abc"'],
];

describe('Test Invalid Inputs', () => {
  test.concurrent.each(testInvalidInputs)('convert %s => throws %s', (input, expectedError) => {
    expect(() => toWords.convert(input as number)).toThrow(expectedError);
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

const testFractionStyleNbNO: [number, string][] = [
  [1.1, 'En Og En Tiendedel'],
  [2.5, 'To Og Fem Tiendedeler'],
  [1.01, 'En Og En Hundredel'],
  [1.45, 'En Og Førtifem Hundredeler'],
  [0.05, 'Null Og Fem Hundredeler'],
  [1.001, 'En Og En Tusendel'],
  [1.005, 'En Og Fem Tusendeler'],
  [1.0001, 'En Og En Titusendel'],
  [1.0005, 'En Og Fem Titusendeler'],
  [1.00001, 'En Og En Hundretusendel'],
  [1.00005, 'En Og Fem Hundretusendeler'],
  [1.000001, 'En Og En Milliondel'],
  [1.000005, 'En Og Fem Milliondeler'],
  [123.45, 'Hundre Og Tjuetre Og Førtifem Hundredeler'],
];

describe("Test Floats with options = { decimalStyle: 'fraction' }", () => {
  test.concurrent.each(testFractionStyleNbNO)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { decimalStyle: 'fraction' })).toBe(expected);
  });

  test('falls back to digit-by-digit for unmapped decimal length (7 places)', () => {
    expect(toWords.convert(1.1234567, { decimalStyle: 'fraction' })).toBe(
      'En Komma En Million To Hundre Trettifire Tusen Fem Hundre Sekstisju',
    );
    expect(toWords.convert(1.1234567)).toBe('En Komma En Million To Hundre Trettifire Tusen Fem Hundre Sekstisju');
  });

  test('digit-by-digit style works without decimalStyle option', () => {
    expect(toWords.convert(1.5)).toBe('En Komma Fem');
    expect(toWords.convert(0.05)).toBe('Null Komma Null Fem');
  });
});

describe('Sourced examples (Bokmål number grammar)', () => {
  // Scale nouns million/milliard/billion/billiard pluralise with -er when the multiplier is not 1
  // (en.wiktionary nb-noun-m1 «millioner»/«milliarder»; ordbokene.no milliard «tusen millioner»;
  // elon.io Norwegian grammar «to millioner, tre milliarder»). hundre/tusen never pluralise.
  test.each([
    [1000000, 'En Million'],
    [2000000, 'To Millioner'],
    [3000000000, 'Tre Milliarder'],
    [1000000000, 'En Milliard'],
    [100, 'Hundre'],
    [700, 'Sju Hundre'],
    [1000, 'Tusen'],
  ])('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });

  // Ordinals: no.wiktionary «hundrede = ordenstallet til hundre», «andre = ordenstall til to».
  test('ordinals follow the dictionary', () => {
    expect(toWords.toOrdinal(100)).toBe('Hundrede');
    expect(toWords.toOrdinal(2)).toBe('Andre');
    expect(toWords.toOrdinal(1000000)).toBe('En Millionte');
  });
});

describe('Output style options', () => {
  const styled = new ToWords({ localeCode });
  // hyphenate applies to English only, so the output is unchanged.
  const cases: [string, () => string, string][] = [
    ['default', () => styled.convert(21), 'Tjueen'],
    ['hyphenate', () => styled.convert(21, { hyphenate: true }), 'Tjueen'],
    ["casing 'title'", () => styled.convert(21.5, { currency: true, casing: 'title' }), 'Tjueen Kroner Og Femti Øre'],
    ["casing 'lower'", () => styled.convert(21.5, { currency: true, casing: 'lower' }), 'tjueen kroner og femti øre'],
    ["casing 'upper'", () => styled.convert(21.5, { currency: true, casing: 'upper' }), 'TJUEEN KRONER OG FEMTI ØRE'],
    [
      "casing 'natural'",
      () => styled.convert(21.5, { currency: true, casing: 'natural' }),
      'tjueen kroner og femti øre',
    ],
    [
      "casing 'sentence' with hyphenate",
      () => styled.convert(21.5, { currency: true, casing: 'sentence', hyphenate: true }),
      'Tjueen kroner og femti øre',
    ],
    ['ordinal', () => styled.toOrdinal(21), 'Tjueførste'],
    [
      "ordinal with casing 'lower' and hyphenate",
      () => styled.toOrdinal(21, { casing: 'lower', hyphenate: true }),
      'tjueførste',
    ],
    ["decimalStyle 'digit' (default)", () => styled.convert(1.25), 'En Komma Tjuefem'],
    [
      "decimalStyle 'digit-by-digit'",
      () => styled.convert(1.25, { decimalStyle: 'digit-by-digit' }),
      'En Komma To Fem',
    ],
  ];

  test.each(cases)('%s', (_name, run, expected) => {
    expect(run()).toBe(expected);
  });
});

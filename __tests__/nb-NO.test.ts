import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import nbNo from '../src/locales/nb-NO';

const localeCode = 'nb-NO';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(nbNo);
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'Null'],
  [137, 'Hundre Trettisju'],
  [700, 'Sju Hundre'],
  [1100, 'Tusen Hundre'],
  [4680, 'Fire Tusen Seks Hundre Åtti'],
  [63892, 'Sekstitre Tusen Åtte Hundre Nittito'],
  [86100, 'Åttiseks Tusen Hundre'],
  [792581, 'Sju Hundre Nittito Tusen Fem Hundre Åttien'],
  [2741034, 'To Million Sju Hundre Førtien Tusen Trettifire'],
  [86429753, 'Åttiseks Million Fire Hundre Tjueni Tusen Sju Hundre Femtitre'],
  [975310864, 'Ni Hundre Syttifem Million Tre Hundre Ti Tusen Åtte Hundre Sekstifire'],
  [9876543210, 'Ni Milliard Åtte Hundre Syttiseks Million Fem Hundre Førtitre Tusen To Hundre Ti'],
  [98765432101, 'Nittiåtte Milliard Sju Hundre Sekstifem Million Fire Hundre Trettito Tusen Hundre En'],
  [987654321012, 'Ni Hundre Åttisju Milliard Seks Hundre Femtifire Million Tre Hundre Tjueen Tusen Tolv'],
  [
    9876543210123,
    'Ni Billion Åtte Hundre Syttiseks Milliard Fem Hundre Førtitre Million To Hundre Ti Tusen Hundre Tjuetre',
  ],
  [
    98765432101234,
    'Nittiåtte Billion Sju Hundre Sekstifem Milliard Fire Hundre Trettito Million Hundre En Tusen To Hundre Trettifire',
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

const testFloats = [
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
    expect(toWords.convert(2000000)).toBe('To Million');
    expect(toWords.convert(2000000000)).toBe('To Milliard');
  });
});

import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import teIn from '../src/locales/te-IN.js';
import { ToWords as LocaleToWords } from '../src/locales/te-IN.js';

const localeCode = 'te-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(teIn);
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
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'సున్నా'],
  [137, 'ఒకటి వంద ముప్పై ఏడు'],
  [700, 'ఏడు వంద'],
  [4680, 'నాలుగు వెయ్యి ఆరు వంద ఎనభై'],
  [63892, 'అరవై మూడు వెయ్యి ఎనిమిది వంద తొంభై రెండు'],
  [792581, 'ఏడు లక్ష తొంభై రెండు వెయ్యి ఐదు వంద ఎనభై ఒకటి'],
  [2741034, 'ఇరవై ఏడు లక్ష నలభై ఒకటి వెయ్యి ముప్పై నాలుగు'],
  [86429753, 'ఎనిమిది కోటి అరవై నాలుగు లక్ష ఇరవై తొమ్మిది వెయ్యి ఏడు వంద యాభై మూడు'],
  [975310864, 'తొంభై ఏడు కోటి యాభై మూడు లక్ష పది వెయ్యి ఎనిమిది వంద అరవై నాలుగు'],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
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
    row[1] = `తీసివేత ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} రూపాయలు`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} రూపాయలు`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} రూపాయలు`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'సున్నా'],
  [0.04, 'సున్నా బిందువు సున్నా నాలుగు'],
  [0.0468, 'సున్నా బిందువు సున్నా నాలుగు ఆరు ఎనిమిది'],
  [0.4, 'సున్నా బిందువు నాలుగు'],
  [0.63, 'సున్నా బిందువు అరవై మూడు'],
  [0.973, 'సున్నా బిందువు తొమ్మిది వంద డెబ్బై మూడు'],
  [0.999, 'సున్నా బిందువు తొమ్మిది వంద తొంభై తొమ్మిది'],
  [37.06, 'ముప్పై ఏడు బిందువు సున్నా ఆరు'],
  [37.068, 'ముప్పై ఏడు బిందువు సున్నా ఆరు ఎనిమిది'],
  [37.68, 'ముప్పై ఏడు బిందువు అరవై ఎనిమిది'],
  [37.683, 'ముప్పై ఏడు బిందువు ఆరు వంద ఎనభై మూడు'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'సున్నా రూపాయలు'],
  [0.04, 'సున్నా రూపాయలు మరియు నాలుగు పైసలు'],
  [0.0468, 'సున్నా రూపాయలు మరియు ఐదు పైసలు'],
  [0.4, 'సున్నా రూపాయలు మరియు నలభై పైసలు'],
  [0.63, 'సున్నా రూపాయలు మరియు అరవై మూడు పైసలు'],
  [0.973, 'సున్నా రూపాయలు మరియు తొంభై ఏడు పైసలు'],
  [0.999, 'ఒకటి రూపాయి'],
  [37.06, 'ముప్పై ఏడు రూపాయలు మరియు ఆరు పైసలు'],
  [37.068, 'ముప్పై ఏడు రూపాయలు మరియు ఏడు పైసలు'],
  [37.68, 'ముప్పై ఏడు రూపాయలు మరియు అరవై ఎనిమిది పైసలు'],
  [37.683, 'ముప్పై ఏడు రూపాయలు మరియు అరవై ఎనిమిది పైసలు'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = (row[1] as string).replace(`సున్నా రూపాయలు మరియు `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
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
      row[1] = `సున్నా రూపాయలు`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` మరియు [\u0C00-\u0C7F ]+ పైసలు`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` మరియు [\u0C00-\u0C7F ]+ పైసలు`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

const testOrdinals: [number, string][] = [
  [0, 'సున్నావ'],
  [1, 'మొదటి'],
  [2, 'రెండవ'],
  [3, 'మూడవ'],
  [4, 'నాలుగవ'],
  [5, 'ఐదవ'],
  [6, 'ఆరవ'],
  [7, 'ఏడవ'],
  [8, 'ఎనిమిదవ'],
  [9, 'తొమ్మిదవ'],
  [10, 'పదవ'],
  [11, 'పదకొండవ'],
  [12, 'పన్నెండవ'],
  [13, 'పదమూడవ'],
  [14, 'పద్నాలుగవ'],
  [15, 'పదిహేనవ'],
  [16, 'పదహారవ'],
  [17, 'పదిహేడవ'],
  [18, 'పద్దెనిమిదవ'],
  [19, 'పందొమ్మిదవ'],
  [20, 'ఇరవైవ'],
  [21, 'ఇరవై ఒకటవ'],
  [22, 'ఇరవై రెండవ'],
  [23, 'ఇరవై మూడవ'],
  [24, 'ఇరవై నాలుగవ'],
  [25, 'ఇరవై ఐదవ'],
  [30, 'ముప్పైవ'],
  [40, 'నలభైవ'],
  [50, 'యాభైవ'],
  [60, 'అరవైవ'],
  [70, 'డెబ్బైవ'],
  [80, 'ఎనభైవ'],
  [90, 'తొంభైవ'],
  [99, 'తొంభై తొమ్మిదవ'],
  [100, 'వందవ'],
  [101, 'ఒకటి వంద మొదటి'],
  [111, 'ఒకటి వంద పదకొండవ'],
  [123, 'ఒకటి వంద ఇరవై మూడవ'],
  [199, 'ఒకటి వంద తొంభై తొమ్మిదవ'],
  [200, 'రెండు వందవ'],
  [500, 'ఐదు వందవ'],
  [1000, 'ఒకటి వెయ్యవ'],
  [1001, 'ఒకటి వెయ్యి మొదటి'],
  [1100, 'ఒకటి వెయ్యి వందవ'],
  [1234, 'ఒకటి వెయ్యి రెండు వంద ముప్పై నాలుగవ'],
  [10000, 'పది వెయ్యవ'],
  [100000, 'ఒకటి లక్షవ'],
  [100001, 'ఒకటి లక్ష మొదటి'],
  [1000000, 'పది లక్షవ'],
  [10000000, 'ఒకటి కోటవ'],
];

describe('Test Ordinals', () => {
  test.each(testOrdinals)('toOrdinal(%d) => %s', (input, expected) => {
    expect(toWords.toOrdinal(input)).toBe(expected);
  });
});

describe('Test Ordinal Error Cases', () => {
  test('should throw error for negative numbers', () => {
    expect(() => toWords.toOrdinal(-1)).toThrow(/must be non-negative/);
  });

  test('should throw error for decimal numbers', () => {
    expect(() => toWords.toOrdinal(1.5)).toThrow(/must be non-negative integers/);
  });
});

const testPowersOfTen: [number, string][] = [
  [10, 'పది'],
  [100, 'వంద'],
  [1000, 'ఒకటి వెయ్యి'],
  [10000, 'పది వెయ్యి'],
  [100000, 'ఒకటి లక్ష'],
  [1000000, 'పది లక్ష'],
  [10000000, 'ఒకటి కోటి'],
];

describe('Test Powers of Ten', () => {
  test.concurrent.each(testPowersOfTen)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testBigInt: [bigint, string][] = [
  [0n, 'సున్నా'],
  [1n, 'ఒకటి'],
  [100n, 'వంద'],
  [1000n, 'ఒకటి వెయ్యి'],
];

describe('Test BigInt', () => {
  test.concurrent.each(testBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testNegativeBigInt: [bigint, string][] = [
  [-1n, 'తీసివేత ఒకటి'],
  [-100n, 'తీసివేత వంద'],
  [-1000n, 'తీసివేత ఒకటి వెయ్యి'],
];

describe('Test Negative BigInt', () => {
  test.concurrent.each(testNegativeBigInt)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

const testStringInput: [string, string][] = [
  ['0', 'సున్నా'],
  ['1', 'ఒకటి'],
  ['100', 'వంద'],
  ['-100', 'తీసివేత వంద'],
];

describe('Test String Input', () => {
  test.concurrent.each(testStringInput)('convert %s => %s', (input, expected) => {
    expect(toWords.convert(input)).toBe(expected);
  });
});

describe('Test Zero Variants', () => {
  test('convert 0 => సున్నా', () => {
    expect(toWords.convert(0)).toBe('సున్నా');
  });

  test('convert -0 => సున్నా', () => {
    expect(toWords.convert(-0)).toBe('సున్నా');
  });

  test('convert 0.0 => సున్నా', () => {
    expect(toWords.convert(0.0)).toBe('సున్నా');
  });

  test('convert 0n => సున్నా', () => {
    expect(toWords.convert(0n)).toBe('సున్నా');
  });

  test('convert "0" => సున్నా', () => {
    expect(toWords.convert('0')).toBe('సున్నా');
  });

  test('convert 0 with currency => సున్నా రూపాయలు', () => {
    expect(toWords.convert(0, { currency: true })).toBe('సున్నా రూపాయలు');
  });
});

describe('Test Invalid Input', () => {
  test('convert NaN throws error', () => {
    expect(() => toWords.convert(Number.NaN)).toThrow();
  });

  test('convert Infinity throws error', () => {
    expect(() => toWords.convert(Infinity)).toThrow();
  });

  test('convert -Infinity throws error', () => {
    expect(() => toWords.convert(-Infinity)).toThrow();
  });

  test('convert "" throws error', () => {
    expect(() => toWords.convert('')).toThrow();
  });

  test('convert "abc" throws error', () => {
    expect(() => toWords.convert('abc')).toThrow();
  });
});

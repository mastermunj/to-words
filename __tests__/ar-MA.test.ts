import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import arMA from '../src/locales/ar-MA';

const localeCode = 'ar-MA';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(arMA);
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
    [0, 'صفر'],
    [137, 'مئة وسبعة وثلاثون'],
    [700, 'سبعمائة'],
    [4680, 'أربعة آلاف وستمائة وثمانون'],
    [63892, 'ثلاثة وستون ألفًا وثمانمائة واثنان وتسعون'],
    [792581, 'سبعمائة واثنان وتسعون ألفًا وخمسمائة وواحد وثمانون'],
    [1342823, 'مليون وثلاثمائة واثنان وأربعون ألفًا وثمانمائة وثلاثة وعشرون'],
    [2741034, 'مليونان وسبعمائة وواحد وأربعون ألفًا وأربعة وثلاثون'],
    [86429753, 'ستة وثمانون مليونًا وأربعمائة وتسعة وعشرون ألفًا وسبعمائة وثلاثة وخمسون'],
    [975310864, 'تسعمائة وخمسة وسبعون مليونًا وثلاثمائة وعشرة آلاف وثمانمائة وأربعة وستون'],
    [9876543210, 'تسعة مليارات وثمانمائة وستة وسبعون مليونًا وخمسمائة وثلاثة وأربعون ألفًا ومائتان وعشرة'],
    [
      98765432101,
      'ثمانية وتسعون مليارًا وسبعمائة وخمسة وستون مليونًا وأربعمائة واثنان وثلاثون ألفًا ومائة وواحد',
    ],
    [
      987654321012,
      'تسعمائة وسبعة وثمانون مليارًا وستمائة وأربعة وخمسون مليونًا وثلاثمائة وواحد وعشرون ألفًا واثنا عشر',
    ],
    [
      9876543210123,
      'تسعة ترليونات وثمانمائة وستة وسبعون مليارًا وخمسمائة وثلاثة وأربعون مليونًا ومائتا ألف ومائة وثلاثة وعشرون',
    ],
    [
      98765432101234,
      'ثمانية وتسعون ترليونًا وسبعمائة وخمسة وستون مليارًا وأربعمائة واثنان وثلاثون مليونًا ومائة وألفان وأربعة وثلاثون',
    ],
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
    row[1] = `Moins ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} درهمًا`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} درهمًا`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} درهمًا`;
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
    [0.0, 'صفر'],
    [0.04, 'صفر فاصل صفر أربعة'],
    [0.0468, 'صفر فاصل صفر أربعة ستة ثمانية'],
    [0.4, 'صفر فاصل أربعة'],
    [0.63, 'صفر فاصل ثلاثة وستون'],
    [0.973, 'صفر فاصل تسعمائة وثلاثة وسبعون'],
    [0.999, 'صفر فاصل تسعمائة وتسعة وتسعون'],
    [37.06, 'سبعة وثلاثون فاصل صفر ستة'],
    [37.068, 'سبعة وثلاثون فاصل صفر ستة ثمانية'],
    [37.68, 'سبعة وثلاثون فاصل ثمانية وستون'],
    [37.683, 'سبعة وثلاثون فاصل ستمائة وثلاثة وثمانون'],
  ];
  

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
    [0.0, `صفر درهم`],
    [0.04, `صفر درهم وأربعة سنتيمات`],
    [0.0468, `صفر درهم وخمسة سنتيمات`],
    [0.4, `صفر درهم وأربعون سنتيمًا`],
    [0.63, `صفر درهم وثلاثة وستون سنتيمًا`],
    [0.973, `صفر درهم وسبعة وتسعون سنتيمًا`],
    [0.999, `درهم واحد`],
    [37.06, `سبعة وثلاثون درهمًا وستة سنتيمات`],
    [37.068, `سبعة وثلاثون درهمًا وسبعة سنتيمات`],
    [37.68, `سبعة وثلاثون درهمًا وثمانية وستون سنتيمًا`],
    [37.683, `سبعة وثلاثون درهمًا وثمانية وستون سنتيمًا`],
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
      row[1] = (row[1] as string).replace(`صفر درهم و`, '');
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
      row[1] = `صفر درهم`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` Et [\\w\\- ]+ Centimes`), '');
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

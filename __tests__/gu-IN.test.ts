import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import guIn from '../src/locales/gu-IN';

const localeCode = 'gu-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(guIn);
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
  [0, 'શૂન્ય'],
  [137, 'એક સો સાડત્રીસ'],
  [700, 'સાત સો'],
  [4680, 'ચાર હજાર છ સો એંસી'],
  [63892, 'ત્રેસઠ હજાર આઠ સો બાણું'],
  [792581, 'સાત લાખ બાણું હજાર પાંચ સો એક્યાસી'],
  [2741034, 'સત્તાવીસ લાખ એકતાલીસ હજાર ચોત્રીસ'],
  [86429753, 'આઠ કરોડ ચોસઠ લાખ ઓગણત્રીસ હજાર સાત સો ત્રેપન'],
  [975310864, 'સત્તાણું કરોડ ત્રેપન લાખ દસ હજાર આઠ સો ચોસઠ'],
  [9876543210, 'નવ સો સિત્યાસી કરોડ પાંસઠ લાખ ત્રેતાલીસ હજાર બે સો દસ'],
  [98765432101, 'નવ હજાર આઠ સો છોતેર કરોડ ચોપન લાખ બત્રીસ હજાર એક સો એક'],
  [987654321012, 'અઠ્ઠાણું હજાર સાત સો પાંસઠ કરોડ ત્રેતાલીસ લાખ એકવીસ હજાર બાર'],
  [9876543210123, 'નવ લાખ સિત્યાસી હજાર છ સો ચોપન કરોડ બત્રીસ લાખ દસ હજાર એક સો તેવીસ'],
  [98765432101234, 'અઠ્ઠાણું લાખ છોતેર હજાર પાંચ સો ત્રેતાલીસ કરોડ એકવીસ લાખ એક હજાર બે સો ચોત્રીસ'],
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
    row[1] = `ઋણ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} રૂપિયા`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} રૂપિયા`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} રૂપિયા`;
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
  [0.0, 'શૂન્ય'],
  [0.04, 'શૂન્ય દશાંશ શૂન્ય ચાર'],
  [0.0468, 'શૂન્ય દશાંશ શૂન્ય ચાર છ આઠ'],
  [0.4, 'શૂન્ય દશાંશ ચાર'],
  [0.63, 'શૂન્ય દશાંશ ત્રેસઠ'],
  [0.973, 'શૂન્ય દશાંશ નવ સો તોતેર'],
  [0.999, 'શૂન્ય દશાંશ નવ સો નવ્વાણું'],
  [37.06, 'સાડત્રીસ દશાંશ શૂન્ય છ'],
  [37.068, 'સાડત્રીસ દશાંશ શૂન્ય છ આઠ'],
  [37.68, 'સાડત્રીસ દશાંશ અડસઠ'],
  [37.683, 'સાડત્રીસ દશાંશ છ સો ત્યાસી'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'શૂન્ય રૂપિયા'],
  [0.04, 'શૂન્ય રૂપિયા અને ચાર પૈસા'],
  [0.0468, 'શૂન્ય રૂપિયા અને પાંચ પૈસા'],
  [0.4, 'શૂન્ય રૂપિયા અને ચાલીસ પૈસા'],
  [0.63, 'શૂન્ય રૂપિયા અને ત્રેસઠ પૈસા'],
  [0.973, 'શૂન્ય રૂપિયા અને સત્તાણું પૈસા'],
  [0.999, 'એક રૂપિયા'],
  [37.06, 'સાડત્રીસ રૂપિયા અને છ પૈસા'],
  [37.068, 'સાડત્રીસ રૂપિયા અને સાત પૈસા'],
  [37.68, 'સાડત્રીસ રૂપિયા અને અડસઠ પૈસા'],
  [37.683, 'સાડત્રીસ રૂપિયા અને અડસઠ પૈસા'],
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
      row[1] = (row[1] as string).replace(`શૂન્ય રૂપિયા અને `, '');
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
      row[1] = `શૂન્ય રૂપિયા`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` અને [\u0A80-\u0AFF ]+ પૈસા`), '');
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
    row[1] = (row[1] as string).replace(new RegExp(` અને [\u0A80-\u0AFF ]+ પૈસા`), '');
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

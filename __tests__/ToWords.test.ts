import { ToWords } from '../src/ToWords';

describe('Wrong Locale', () => {
  const localeCode = 'en-INDIA';
  const toWords = new ToWords({
    localeCode: localeCode,
  });
  test(`With Locale: ${localeCode}`, () => {
    expect(() => toWords.convert(1)).toThrow(/Unknown Locale/);
  });
});

describe('Test Wrong Inputs', () => {
  const toWords = new ToWords();

  const testWrongInputs = [
    '',
    '1.2.3',
    '123,456',
    '--2',
    'NaN',
    NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  test.concurrent.each(testWrongInputs)('Input %s', (input) => {
    expect(() => toWords.convert(input as number)).toThrow(/Invalid Number/);
  });
});

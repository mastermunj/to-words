import { ToWords } from '../src/to-words';

describe('Wrong Locale', () => {
  const localeCode = 'en-INDIA';
  const toWords = new ToWords({
    localeCode: localeCode,
  });
  test(`With Locale: ${localeCode}`, () => {
    expect(() => toWords.convert(1)).toThrow(/Unknown Locale /);
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

  test.each(testWrongInputs)('test input %s', (input) => {
    expect(() => toWords.convert(input as number)).toThrow();
  });
});

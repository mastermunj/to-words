import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import viVn from '../src/locales/vi-VN'; // Import the new Vietnamese locale

const localeCode = 'vi-VN'; // Update locale code to Vietnamese
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(viVn);
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
  [0, 'Không'],
  [137, 'Một trăm ba mươi bảy'],
  [700, 'Bảy trăm'],
  [1100, 'Một nghìn một trăm'],
  [4680, 'Bốn nghìn sáu trăm tám mươi'],
  [63892, 'Sáu mươi ba nghìn tám trăm chín mươi hai'],
  [86100, 'Tám mươi sáu nghìn một trăm'],
  [792581, 'Bảy trăm chín mươi hai nghìn năm trăm tám mươi mốt'],
  [2741034, 'Hai triệu bảy trăm bốn mươi mốt nghìn không ba mươi tư'],
  [86429753, 'Tám mươi sáu triệu bốn trăm hai mươi chín nghìn bảy trăm năm mươi ba'],
  [975310864, 'Chín trăm bảy mươi lăm triệu ba trăm mười nghìn tám trăm sáu mươi tư'],
  [9876543210, 'Chín tỷ tám trăm bảy mươi sáu triệu năm trăm bốn mươi ba nghìn hai trăm mười'],
  [98765432101, 'Chín mươi tám tỷ bảy trăm sáu mươi lăm triệu bốn trăm ba mươi hai nghìn một trăm lẻ một'],
  [987654321012, 'Chín trăm tám mươi bảy tỷ sáu trăm năm mươi tư triệu ba trăm hai mươi mốt nghìn không mười hai'],
  [
    9876543210123,
    'Chín triệu tám trăm bảy mươi sáu tỷ năm trăm bốn mươi ba triệu hai trăm mười nghìn một trăm hai mươi ba',
  ],
  [
    98765432101234,
    'Chín mươi tám triệu bảy trăm sáu mươi lăm tỷ bốn trăm ba mươi hai triệu một trăm lẻ một nghìn hai trăm ba mươi tư',
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
    row[1] = `Âm ${row[1]}`;
  });

  test.concurrent.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Việt Nam Đồng Chỉ`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} Việt Nam Đồng`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Negative Integers with options = { currency: true }', () => {
  const testNegativeIntegersWithCurrency = cloneDeep(testIntegers);
  testNegativeIntegersWithCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = `${row[1]} Việt Nam Đồng Chỉ`;
      return;
    }
    row[0] = -row[0];
    row[1] = `Âm ${row[1]} Việt Nam Đồng Chỉ`;
  });

  test.concurrent.each(testNegativeIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true }', () => {
  const testFloatsWithCurrency: [number, string][] = [
    [0.0, `Không Việt Nam Đồng Chỉ`],
    [0.04, `Không Việt Nam Đồng Và Bốn Xu Chỉ`],
    [0.0468, `Không Việt Nam Đồng Và Năm Xu Chỉ`],
    [0.4, `Không Việt Nam Đồng Và Bốn Mươi Xu Chỉ`],
    [0.63, `Không Việt Nam Đồng Và Sáu Mươi Ba Xu Chỉ`],
    [0.973, `Không Việt Nam Đồng Và Chín Mươi Bảy Xu Chỉ`],
    [0.999, `Một Việt Nam Đồng Chỉ`],
    [37.06, `Ba mươi bảy Việt Nam Đồng Và Sáu Xu Chỉ`],
    [37.068, `Ba mươi bảy Việt Nam Đồng Và Bảy Xu Chỉ`],
    [37.68, `Ba mươi bảy Việt Nam Đồng Và Sáu Mươi Tám Xu Chỉ`],
    [37.683, `Ba mươi bảy Việt Nam Đồng Và Sáu Mươi Tám Xu Chỉ`],
  ];

  test.concurrent.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

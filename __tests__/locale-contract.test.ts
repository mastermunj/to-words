import { describe, expect, test } from 'vitest';
import { assertLocaleConfig, deriveLocaleCapabilities, validateLocaleConfig } from '../src/locale-contract.js';
import type { LocaleConfig } from '../src/types.js';

function createConfig(overrides: Partial<LocaleConfig> = {}): LocaleConfig {
  return {
    currency: {
      name: 'Dollar',
      plural: 'Dollars',
      symbol: '$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '¢',
      },
    },
    texts: {
      and: 'And',
      minus: 'Minus',
      only: 'Only',
      point: 'Point',
    },
    numberWordsMapping: [
      { number: 1, value: 'One' },
      { number: 0, value: 'Zero' },
    ],
    ...overrides,
  };
}

describe('locale contract', () => {
  test('derives immutable baseline capabilities', () => {
    const capabilities = deriveLocaleCapabilities(createConfig());

    expect(capabilities).toEqual({
      cardinal: true,
      currency: true,
      ordinal: false,
      formal: false,
      gender: { cardinal: false, ordinal: false },
      decimals: { digit: true, fraction: false, fractionDigits: [] },
      currencyPrecision: 2,
    });
    expect(Object.isFrozen(capabilities)).toBe(true);
    expect(Object.isFrozen(capabilities.gender)).toBe(true);
    expect(Object.isFrozen(capabilities.decimals)).toBe(true);
    expect(Object.isFrozen(capabilities.decimals.fractionDigits)).toBe(true);
  });

  test('derives declared optional capabilities without manual metadata', () => {
    const capabilities = deriveLocaleCapabilities(
      createConfig({
        exactWordsMapping: [{ number: 1, value: 'One', feminineValue: 'One feminine' }],
        ordinalExactWordsMapping: [{ number: 1, value: 'First', masculineValue: 'First masculine' }],
        formalConfig: {},
        fractionDenominatorMapping: {
          3: { singular: 'Thousandth', plural: 'Thousandths' },
          1: { singular: 'Tenth', plural: 'Tenths' },
        },
        currency: {
          ...createConfig().currency,
          precision: 3,
        },
      }),
    );

    expect(capabilities).toMatchObject({
      ordinal: true,
      formal: true,
      gender: { cardinal: true, ordinal: true },
      decimals: { fraction: true, fractionDigits: [1, 3] },
      currencyPrecision: 3,
    });
  });

  test('recognises suffix- and prefix-based ordinal contracts', () => {
    expect(deriveLocaleCapabilities(createConfig({ ordinalSuffix: 'th' })).ordinal).toBe(true);
    expect(deriveLocaleCapabilities(createConfig({ ordinalPrefix: 'No.' })).ordinal).toBe(true);
    expect(
      deriveLocaleCapabilities(createConfig({ ordinalGenderSuffixMapping: { masculine: 'o', feminine: 'a' } })).gender
        .ordinal,
    ).toBe(true);
  });

  test('accepts valid base and effective formal configurations', () => {
    const config = createConfig({
      formalConfig: {
        numberWordsMapping: [
          { number: 1, value: 'Formal One' },
          { number: 0, value: 'Formal Zero' },
        ],
      },
      fractionDenominatorMapping: {
        1: { singular: 'Tenth', plural: 'Tenths' },
      },
    });

    expect(validateLocaleConfig(config)).toEqual([]);
    expect(validateLocaleConfig(createConfig({ formalConfig: {} }))).toEqual([]);
    expect(() => assertLocaleConfig(config)).not.toThrow();
  });

  test('reports every conversion-critical invariant violation', () => {
    const config = createConfig({
      numberWordsMapping: [
        {
          number: 2,
          value: ['', 'Two'],
          singularValue: '',
          feminineValue: '',
          masculineValue: '',
        },
        { number: 2, value: 'Duplicate' },
        { number: 3, value: 'Out of order' },
        { number: 1.5, value: 'Not an integer' },
        { number: -1, value: 'Negative' },
      ],
      exactWordsMapping: [
        { number: 1, value: 'One' },
        { number: 1, value: 'Duplicate' },
      ],
      ordinalWordsMapping: [
        { number: 1, value: 'First' },
        { number: 1, value: 'Duplicate' },
      ],
      ordinalExactWordsMapping: [{ number: 1, value: '' }],
      ordinalGenderSuffixMapping: { masculine: '', feminine: '' },
      fractionDenominatorMapping: {
        0: { singular: '', plural: '' },
      },
      currency: {
        ...createConfig().currency,
        precision: 1.5,
      },
      formalConfig: {
        numberWordsMapping: [],
      },
    });

    const issues = validateLocaleConfig(config, 'test-locale');

    expect(issues).toEqual(
      expect.arrayContaining([
        'test-locale.numberWordsMapping contains duplicate numeric entry 2',
        'test-locale.numberWordsMapping must be strictly descending at index 1',
        'test-locale.numberWordsMapping[3].number must be an integer',
        'test-locale.numberWordsMapping[4].number must be non-negative',
        'test-locale.numberWordsMapping must contain zero',
        'test-locale.currency.precision must be an integer between 0 and 100',
        'test-locale.ordinalGenderSuffixMapping values must be non-empty',
        'test-locale.fractionDenominatorMapping key 0 must be a positive integer',
        'test-locale.fractionDenominatorMapping[0] values must be non-empty',
        'test-locale.formalConfig.numberWordsMapping must contain at least one entry',
      ]),
    );
    expect(() => assertLocaleConfig(config, 'test-locale')).toThrow(
      /Invalid locale configuration:\n- test-locale\.numberWordsMapping/,
    );
  });

  test('requires a non-empty cardinal mapping', () => {
    expect(validateLocaleConfig(createConfig({ numberWordsMapping: [] }))).toEqual([
      'locale.numberWordsMapping must contain at least one entry',
      'locale.numberWordsMapping must contain zero',
    ]);
  });
});

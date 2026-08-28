import { describe, expect, test } from 'vitest';
import {
  assertLocaleConfig,
  deriveLocaleCapabilities,
  deriveLocaleMetadata,
  validateLocaleConfig,
} from '../src/locale-contract.js';
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

  test.each([
    {
      name: 'base-thousand',
      mappings: [
        { number: 1_000_000, value: 'Million' },
        { number: 1000, value: 'Thousand' },
        { number: 1, value: 'One' },
        { number: 0, value: 'Zero' },
      ],
      grouping: [3],
      exponents: [3, 6],
    },
    {
      name: 'indian',
      mappings: [
        { number: 10_000_000, value: 'Crore' },
        { number: 100_000, value: 'Lakh' },
        { number: 1000, value: 'Thousand' },
        { number: 1, value: 'One' },
        { number: 0, value: 'Zero' },
      ],
      grouping: [3, 2],
      exponents: [3, 5, 7],
    },
    {
      name: 'east-asian',
      mappings: [
        { number: 100_000_000, value: 'Hundred million' },
        { number: 10_000_000, value: 'Ten million' },
        { number: 100_000, value: 'Hundred thousand' },
        { number: 10_000, value: 'Ten thousand' },
        { number: 1, value: 'One' },
        { number: 0, value: 'Zero' },
      ],
      grouping: [4],
      exponents: [4, 5, 7, 8],
    },
  ])('derives immutable $name numbering metadata', ({ name, mappings, grouping, exponents }) => {
    const metadata = deriveLocaleMetadata(createConfig({ numberWordsMapping: mappings }));

    expect(metadata).toEqual({
      numbering: {
        system: name,
        grouping,
        largeUnitExponents: exponents,
      },
      range: {
        largestNamedMagnitude: String(mappings[0].number),
        largestNamedMagnitudeExponent: exponents.at(-1),
        maximumSupported: {
          cardinal: (BigInt(mappings[0].number) * 10n ** BigInt(grouping.at(-1)!) - 1n).toString(),
          ordinal: (BigInt(mappings[0].number) * 10n ** BigInt(grouping.at(-1)!) - 1n).toString(),
          currency: (BigInt(mappings[0].number) * 10n ** BigInt(grouping.at(-1)!) - 1n).toString(),
        },
        composeModeAvailable: true,
      },
    });
    expect(Object.isFrozen(metadata)).toBe(true);
    expect(Object.isFrozen(metadata.numbering)).toBe(true);
    expect(Object.isFrozen(metadata.numbering.grouping)).toBe(true);
    expect(Object.isFrozen(metadata.numbering.largeUnitExponents)).toBe(true);
    expect(Object.isFrozen(metadata.range)).toBe(true);
  });

  test('marks irregular and minimal configurations as locale-specific', () => {
    expect(
      deriveLocaleMetadata(
        createConfig({
          numberWordsMapping: [
            { number: 1001, value: 'Irregular scale' },
            { number: 1, value: 'One' },
            { number: 0, value: 'Zero' },
          ],
        }),
      ),
    ).toEqual({
      numbering: { system: 'locale-specific', grouping: [], largeUnitExponents: [] },
      range: {
        largestNamedMagnitude: '1001',
        largestNamedMagnitudeExponent: null,
        maximumSupported: {
          cardinal: '1000999',
          ordinal: '1000999',
          currency: '1000999',
        },
        composeModeAvailable: true,
      },
    });

    expect(deriveLocaleMetadata(createConfig()).numbering.system).toBe('locale-specific');
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

  test('supports explicit per-form verified ceilings', () => {
    const config = createConfig({
      maximumSupportedValues: { cardinal: '999', ordinal: 99n, currency: 499 },
    });

    expect(deriveLocaleMetadata(config).range.maximumSupported).toEqual({
      cardinal: '999',
      ordinal: '99',
      currency: '499',
    });
    expect(validateLocaleConfig(config)).toEqual([]);
    expect(validateLocaleConfig(createConfig({ maximumSupportedValues: { cardinal: '1.5' } }))).toContain(
      'locale.maximumSupportedValues.cardinal must be a non-negative integer',
    );
    expect(validateLocaleConfig(createConfig({ maximumSupportedValues: { ordinal: -1 } }))).toContain(
      'locale.maximumSupportedValues.ordinal must be a non-negative integer',
    );
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

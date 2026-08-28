import { describe, expect, test } from 'vitest';
import { deriveLocaleCapabilities, deriveLocaleMetadata } from '../src/locale-contract.js';
import {
  getLocaleCapabilities,
  getLocaleMetadata,
  isSupportedLocale,
  LOCALE_MANIFEST,
  SUPPORTED_LOCALES,
} from '../src/locale-manifest.js';
import LOCALES from '../src/locales/index.js';

describe('locale capability manifest', () => {
  test('contains every locale in deterministic order', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(135);
    expect(SUPPORTED_LOCALES).toEqual(Object.keys(LOCALES).sort());
    expect(Object.keys(LOCALE_MANIFEST)).toEqual(SUPPORTED_LOCALES);
    expect(Object.isFrozen(SUPPORTED_LOCALES)).toBe(true);
    expect(Object.isFrozen(LOCALE_MANIFEST)).toBe(true);
  });

  test('derives every entry from its locale configuration', () => {
    for (const localeCode of SUPPORTED_LOCALES) {
      const LocaleClass = LOCALES[localeCode];
      const entry = LOCALE_MANIFEST[localeCode];

      expect(entry.localeCode).toBe(localeCode);
      expect(entry.capabilities).toEqual(deriveLocaleCapabilities(new LocaleClass().config));
      expect(entry.metadata).toEqual(deriveLocaleMetadata(new LocaleClass().config));
      expect(Object.isFrozen(entry)).toBe(true);
    }
  });

  test('publishes verified numbering-system counts and immutable range metadata', () => {
    const metadata = SUPPORTED_LOCALES.map((localeCode) => LOCALE_MANIFEST[localeCode].metadata);

    expect(metadata.filter(({ numbering }) => numbering.system === 'base-thousand')).toHaveLength(107);
    expect(metadata.filter(({ numbering }) => numbering.system === 'indian')).toHaveLength(19);
    expect(metadata.filter(({ numbering }) => numbering.system === 'east-asian')).toHaveLength(5);
    expect(metadata.filter(({ numbering }) => numbering.system === 'locale-specific')).toHaveLength(4);
    expect(metadata.every(({ range }) => range.composeModeAvailable)).toBe(true);
    expect(metadata.every(({ range }) => /^\d+$/.test(range.maximumSupported.cardinal))).toBe(true);

    const indian = LOCALE_MANIFEST['hi-IN'].metadata;
    expect(indian.numbering.grouping).toEqual([3, 2]);
    expect(Object.isFrozen(indian)).toBe(true);
    expect(Object.isFrozen(indian.numbering)).toBe(true);
    expect(Object.isFrozen(indian.numbering.grouping)).toBe(true);
    expect(Object.isFrozen(indian.numbering.largeUnitExponents)).toBe(true);
    expect(Object.isFrozen(indian.range)).toBe(true);
    expect(Object.isFrozen(indian.range.maximumSupported)).toBe(true);
  });

  test('publishes verified aggregate capability counts', () => {
    const capabilities = SUPPORTED_LOCALES.map((localeCode) => LOCALE_MANIFEST[localeCode].capabilities);

    expect(capabilities.filter(({ ordinal }) => ordinal)).toHaveLength(135);
    expect(capabilities.filter(({ formal }) => formal)).toHaveLength(2);
    expect(capabilities.filter(({ gender }) => gender.cardinal)).toHaveLength(37);
    expect(capabilities.filter(({ gender }) => gender.ordinal)).toHaveLength(8);
    expect(capabilities.filter(({ decimals }) => decimals.fraction)).toHaveLength(100);
    expect(capabilities.filter(({ currencyPrecision }) => currencyPrecision === 3)).toHaveLength(3);
  });

  test('supports type-safe guards and lookups', () => {
    expect(isSupportedLocale('en-US')).toBe(true);
    expect(isSupportedLocale('et-EE')).toBe(true);
    expect(isSupportedLocale('ee-EE')).toBe(false);
    expect(isSupportedLocale('ne-NP')).toBe(true);
    expect(isSupportedLocale('np-NP')).toBe(false);
    expect(isSupportedLocale('xx-XX')).toBe(false);
    expect(getLocaleCapabilities('en-US')).toBe(LOCALE_MANIFEST['en-US'].capabilities);
    expect(getLocaleCapabilities('xx-XX')).toBeUndefined();
    expect(getLocaleMetadata('en-US')).toBe(LOCALE_MANIFEST['en-US'].metadata);
    expect(getLocaleCapabilities('ee-EE')).toBeUndefined();
    expect(getLocaleMetadata('ee-EE')).toBeUndefined();
    expect(getLocaleCapabilities('np-NP')).toBeUndefined();
    expect(getLocaleMetadata('np-NP')).toBeUndefined();
    expect(getLocaleMetadata('xx-XX')).toBeUndefined();
  });
});

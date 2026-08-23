import type { LocaleCapabilities, LocaleMetadata } from './locale-contract.js';
import { LOCALE_CAPABILITY_DATA } from './locale-manifest-data.js';
import type { GeneratedLocaleCode } from './locale-manifest-data.js';

export type LocaleCode = GeneratedLocaleCode;

export type LocaleManifestEntry<Code extends LocaleCode = LocaleCode> = Readonly<{
  localeCode: Code;
  capabilities: LocaleCapabilities;
  metadata: LocaleMetadata;
}>;

export type LocaleManifest = Readonly<{
  [Code in LocaleCode]: LocaleManifestEntry<Code>;
}>;

export const SUPPORTED_LOCALES: readonly LocaleCode[] = Object.freeze(
  (Object.keys(LOCALE_CAPABILITY_DATA) as LocaleCode[]).sort(),
);

export const LOCALE_MANIFEST = Object.freeze(
  Object.fromEntries(
    SUPPORTED_LOCALES.map((localeCode) => {
      const data = LOCALE_CAPABILITY_DATA[localeCode];
      const [
        ordinal,
        formal,
        cardinalGender,
        ordinalGender,
        fractionDigits,
        currencyPrecision,
        numberingSystem,
        grouping,
        largeUnitExponents,
        largestNamedMagnitude,
        largestNamedMagnitudeExponent,
      ] = data;
      const entry: LocaleManifestEntry<typeof localeCode> = Object.freeze({
        localeCode,
        capabilities: Object.freeze({
          cardinal: true,
          currency: true,
          ordinal,
          formal,
          gender: Object.freeze({
            cardinal: cardinalGender,
            ordinal: ordinalGender,
          }),
          decimals: Object.freeze({
            digit: true,
            fraction: fractionDigits.length > 0,
            fractionDigits: Object.freeze([...fractionDigits]),
          }),
          currencyPrecision,
        }),
        metadata: Object.freeze({
          numbering: Object.freeze({
            system: numberingSystem,
            grouping: Object.freeze([...grouping]),
            largeUnitExponents: Object.freeze([...largeUnitExponents]),
          }),
          range: Object.freeze({
            largestNamedMagnitude,
            largestNamedMagnitudeExponent,
            arbitraryPrecisionInput: true,
          }),
        }),
      });
      return [localeCode, entry];
    }),
  ),
) as LocaleManifest;

export function isSupportedLocale(localeCode: string): localeCode is LocaleCode {
  return Object.hasOwn(LOCALE_MANIFEST, localeCode);
}

export function getLocaleCapabilities(localeCode: LocaleCode): LocaleCapabilities;
export function getLocaleCapabilities(localeCode: string): LocaleCapabilities | undefined;
export function getLocaleCapabilities(localeCode: string): LocaleCapabilities | undefined {
  return isSupportedLocale(localeCode) ? LOCALE_MANIFEST[localeCode].capabilities : undefined;
}

export function getLocaleMetadata(localeCode: LocaleCode): LocaleMetadata;
export function getLocaleMetadata(localeCode: string): LocaleMetadata | undefined;
export function getLocaleMetadata(localeCode: string): LocaleMetadata | undefined {
  return isSupportedLocale(localeCode) ? LOCALE_MANIFEST[localeCode].metadata : undefined;
}

export type {
  LocaleCapabilities,
  LocaleMetadata,
  LocaleNumberingMetadata,
  LocaleRangeMetadata,
  NumberingSystem,
} from './locale-contract.js';

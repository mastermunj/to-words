import type { LocaleCapabilities } from './locale-contract.js';
import { LOCALE_CAPABILITY_DATA } from './locale-manifest-data.js';
import type { GeneratedLocaleCode } from './locale-manifest-data.js';

export type LocaleCode = GeneratedLocaleCode;

export type LocaleManifestEntry<Code extends LocaleCode = LocaleCode> = Readonly<{
  localeCode: Code;
  capabilities: LocaleCapabilities;
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
      const entry: LocaleManifestEntry<typeof localeCode> = Object.freeze({
        localeCode,
        capabilities: Object.freeze({
          cardinal: true,
          currency: true,
          ordinal: data.ordinal,
          formal: data.formal,
          gender: Object.freeze({
            cardinal: data.cardinalGender,
            ordinal: data.ordinalGender,
          }),
          decimals: Object.freeze({
            digit: true,
            fraction: data.fractionDigits.length > 0,
            fractionDigits: Object.freeze([...data.fractionDigits]),
          }),
          currencyPrecision: data.currencyPrecision,
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

export type { LocaleCapabilities } from './locale-contract.js';

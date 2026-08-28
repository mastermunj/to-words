import LOCALES from '../../../src/locales/index.ts';
import { deriveLocaleCapabilities, deriveLocaleMetadata } from '../../../src/locale-contract.ts';
import { LOCALE_LANGUAGE_IDENTITIES } from '../../../scripts/locale-language-identities.ts';

type DirectoryRow = {
  code: string;
  language: string;
  country: string;
  flag: string;
  currency: string;
  numberingSystem: 'Base thousand' | 'Indian' | 'East Asian' | 'Locale-specific';
  ordinal: boolean;
  gender: boolean;
  fractionStyle: boolean;
  formal: boolean;
  page?: string;
};

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function regionToFlag(region: string): string {
  return Array.from(region.toUpperCase())
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');
}

function getLanguageName(languageCode: string): string {
  return LOCALE_LANGUAGE_IDENTITIES[languageCode]?.displayName ?? languageCode;
}

function getCountryName(regionCode: string): string {
  return regionNames.of(regionCode) ?? regionCode;
}

function renderNumberingSystem(
  system: ReturnType<typeof deriveLocaleMetadata>['numbering']['system'],
): DirectoryRow['numberingSystem'] {
  const labels = {
    'base-thousand': 'Base thousand',
    indian: 'Indian',
    'east-asian': 'East Asian',
    'locale-specific': 'Locale-specific',
  } as const;

  return labels[system];
}

function getCurrencySummary(code: string): string {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;
  const symbol = config.currency.symbol ? ` ${config.currency.symbol}` : '';

  return `${config.currency.plural}${symbol}`;
}

const collator = new Intl.Collator('en', { sensitivity: 'base' });

export const localeDirectoryRows: DirectoryRow[] = Object.keys(LOCALES)
  .map((code) => {
    const [languageCode, regionCode] = code.split('-');
    const config = new LOCALES[code]().config;
    const capabilities = deriveLocaleCapabilities(config);
    const metadata = deriveLocaleMetadata(config);

    return {
      code,
      language: getLanguageName(languageCode),
      country: getCountryName(regionCode),
      flag: regionToFlag(regionCode),
      currency: getCurrencySummary(code),
      numberingSystem: renderNumberingSystem(metadata.numbering.system),
      ordinal: capabilities.ordinal,
      gender: capabilities.gender.cardinal,
      fractionStyle: capabilities.decimals.fraction,
      formal: capabilities.formal,
      page: LOCALE_LANGUAGE_IDENTITIES[languageCode]?.page,
    };
  })
  .sort((left, right) => {
    const byLanguage = collator.compare(left.language, right.language);
    if (byLanguage !== 0) {
      return byLanguage;
    }

    const byCountry = collator.compare(left.country, right.country);
    if (byCountry !== 0) {
      return byCountry;
    }

    return collator.compare(left.code, right.code);
  });

export type { DirectoryRow };

import LOCALES from '../../../src/locales/index.ts';

type DirectoryRow = {
  code: string;
  language: string;
  country: string;
  flag: string;
  currency: string;
  scale: 'Short' | 'Long' | 'Indian' | 'East Asian';
  ordinal: boolean;
  gender: boolean;
  fractionStyle: boolean;
  formal: boolean;
  page?: string;
};

const languageNames: Record<string, string> = {
  af: 'Afrikaans',
  am: 'Amharic',
  ar: 'Arabic',
  as: 'Assamese',
  az: 'Azerbaijani',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bn: 'Bengali',
  ca: 'Catalan',
  cs: 'Czech',
  da: 'Danish',
  de: 'German',
  ee: 'Estonian',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  fa: 'Persian',
  fi: 'Finnish',
  fil: 'Filipino',
  fr: 'French',
  gu: 'Gujarati',
  ha: 'Hausa',
  hbo: 'Biblical Hebrew',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  id: 'Indonesian',
  ig: 'Igbo',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  jv: 'Javanese',
  ka: 'Georgian',
  km: 'Khmer',
  kn: 'Kannada',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  ml: 'Malayalam',
  mr: 'Marathi',
  ms: 'Malay',
  my: 'Burmese',
  nb: 'Norwegian Bokmal',
  nl: 'Dutch',
  np: 'Nepali',
  or: 'Odia',
  pa: 'Punjabi',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  sq: 'Albanian',
  sr: 'Serbian',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  yo: 'Yoruba',
  yue: 'Cantonese',
  zh: 'Chinese',
  zu: 'Zulu',
};

const pageByLanguage: Record<string, string> = {
  af: '/locales/afrikaans',
  am: '/locales/amharic',
  ar: '/locales/arabic',
  as: '/locales/assamese',
  az: '/locales/azerbaijani',
  be: '/locales/belarusian',
  bg: '/locales/bulgarian',
  bn: '/locales/bengali',
  ca: '/locales/catalan',
  cs: '/locales/czech',
  da: '/locales/danish',
  de: '/locales/german',
  ee: '/locales/estonian',
  el: '/locales/greek',
  en: '/locales/english',
  es: '/locales/spanish',
  fa: '/locales/persian',
  fi: '/locales/finnish',
  fil: '/locales/filipino',
  fr: '/locales/french',
  gu: '/locales/gujarati',
  ha: '/locales/hausa',
  hbo: '/locales/hebrew',
  he: '/locales/hebrew',
  hi: '/locales/hindi',
  hr: '/locales/croatian',
  hu: '/locales/hungarian',
  id: '/locales/indonesian',
  ig: '/locales/igbo',
  is: '/locales/icelandic',
  it: '/locales/italian',
  ja: '/locales/japanese',
  jv: '/locales/indonesian',
  ka: '/locales/georgian',
  km: '/locales/khmer',
  kn: '/locales/kannada',
  ko: '/locales/korean',
  lt: '/locales/lithuanian',
  lv: '/locales/latvian',
  ml: '/locales/malayalam',
  mr: '/locales/marathi',
  ms: '/locales/malay',
  my: '/locales/burmese',
  nb: '/locales/norwegian',
  nl: '/locales/dutch',
  np: '/locales/nepali',
  or: '/locales/odia',
  pa: '/locales/punjabi',
  pl: '/locales/polish',
  pt: '/locales/portuguese',
  ro: '/locales/romanian',
  ru: '/locales/russian',
  si: '/locales/sinhala',
  sk: '/locales/slovak',
  sl: '/locales/slovenian',
  sq: '/locales/albanian',
  sr: '/locales/serbian',
  sv: '/locales/swedish',
  sw: '/locales/swahili',
  ta: '/locales/tamil',
  te: '/locales/telugu',
  th: '/locales/thai',
  tr: '/locales/turkish',
  uk: '/locales/ukrainian',
  ur: '/locales/urdu',
  uz: '/locales/uzbek',
  vi: '/locales/vietnamese',
  yo: '/locales/yoruba',
  yue: '/locales/chinese',
  zh: '/locales/chinese',
  zu: '/locales/zulu',
};

const indianScaleCodes = new Set([
  'as-IN',
  'bn-IN',
  'en-IN',
  'gu-IN',
  'hi-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'np-NP',
  'or-IN',
  'pa-IN',
  'si-LK',
  'ta-IN',
  'te-IN',
  'ur-PK',
]);

const eastAsianScaleCodes = new Set(['ja-JP', 'ko-KR', 'yue-HK', 'zh-CN', 'zh-TW']);

const longScaleCodes = new Set([
  'de-AT',
  'de-CH',
  'de-DE',
  'fr-BE',
  'fr-CA',
  'fr-CH',
  'fr-DZ',
  'fr-FR',
  'fr-MA',
  'fr-SA',
]);

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function regionToFlag(region: string): string {
  return Array.from(region.toUpperCase())
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');
}

function getLanguageName(languageCode: string): string {
  return languageNames[languageCode] ?? languageCode;
}

function getCountryName(regionCode: string): string {
  return regionNames.of(regionCode) ?? regionCode;
}

function getScale(code: string): DirectoryRow['scale'] {
  if (eastAsianScaleCodes.has(code)) {
    return 'East Asian';
  }

  if (indianScaleCodes.has(code)) {
    return 'Indian';
  }

  if (longScaleCodes.has(code)) {
    return 'Long';
  }

  return 'Short';
}

function getCurrencySummary(code: string): string {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;
  const symbol = config.currency.symbol ? ` ${config.currency.symbol}` : '';

  return `${config.currency.plural}${symbol}`;
}

function supportsGender(code: string): boolean {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;

  return config.numberWordsMapping.some((entry) => Boolean(entry.feminineValue) || Boolean(entry.masculineValue));
}

function supportsOrdinal(code: string): boolean {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;

  return Boolean(
    config.ordinalWordsMapping?.length ||
    config.ordinalExactWordsMapping?.length ||
    config.ordinalPrefix ||
    config.ordinalSuffix,
  );
}

function supportsFractionStyle(code: string): boolean {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;

  return Boolean(config.fractionDenominatorMapping);
}

function supportsFormal(code: string): boolean {
  const LocaleClass = LOCALES[code];
  const config = new LocaleClass().config;

  return Boolean(config.formalConfig);
}

const collator = new Intl.Collator('en', { sensitivity: 'base' });

export const localeDirectoryRows: DirectoryRow[] = Object.keys(LOCALES)
  .map((code) => {
    const [languageCode, regionCode] = code.split('-');

    return {
      code,
      language: getLanguageName(languageCode),
      country: getCountryName(regionCode),
      flag: regionToFlag(regionCode),
      currency: getCurrencySummary(code),
      scale: getScale(code),
      ordinal: supportsOrdinal(code),
      gender: supportsGender(code),
      fractionStyle: supportsFractionStyle(code),
      formal: supportsFormal(code),
      page: pageByLanguage[languageCode],
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

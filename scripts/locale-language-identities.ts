export type LocaleLanguageIdentity = Readonly<{
  /** English label shown in the documentation. */
  displayName: string;
  /** Exact description from the IANA Language Subtag Registry. */
  registryDescription: string;
  /** Documentation page shared by this language's regional variants. */
  page: string;
}>;

/**
 * Human-reviewed language identity for every supported language subtag.
 *
 * The registry description deliberately duplicates authoritative IANA data. A
 * test compares it with the committed registry snapshot, preventing a valid
 * but semantically wrong subtag (for example, Ewe `ee` for Estonian) from
 * silently becoming the documented identity of an implementation.
 */
export const LOCALE_LANGUAGE_IDENTITIES: Readonly<Record<string, LocaleLanguageIdentity>> = {
  af: { displayName: 'Afrikaans', registryDescription: 'Afrikaans', page: '/locales/afrikaans' },
  am: { displayName: 'Amharic', registryDescription: 'Amharic', page: '/locales/amharic' },
  ar: { displayName: 'Arabic', registryDescription: 'Arabic', page: '/locales/arabic' },
  as: { displayName: 'Assamese', registryDescription: 'Assamese', page: '/locales/assamese' },
  az: { displayName: 'Azerbaijani', registryDescription: 'Azerbaijani', page: '/locales/azerbaijani' },
  be: { displayName: 'Belarusian', registryDescription: 'Belarusian', page: '/locales/belarusian' },
  bg: { displayName: 'Bulgarian', registryDescription: 'Bulgarian', page: '/locales/bulgarian' },
  bn: { displayName: 'Bengali', registryDescription: 'Bengali', page: '/locales/bengali' },
  ca: { displayName: 'Catalan', registryDescription: 'Catalan', page: '/locales/catalan' },
  cs: { displayName: 'Czech', registryDescription: 'Czech', page: '/locales/czech' },
  da: { displayName: 'Danish', registryDescription: 'Danish', page: '/locales/danish' },
  de: { displayName: 'German', registryDescription: 'German', page: '/locales/german' },
  el: { displayName: 'Greek', registryDescription: 'Modern Greek (1453-)', page: '/locales/greek' },
  en: { displayName: 'English', registryDescription: 'English', page: '/locales/english' },
  es: { displayName: 'Spanish', registryDescription: 'Spanish', page: '/locales/spanish' },
  et: { displayName: 'Estonian', registryDescription: 'Estonian', page: '/locales/estonian' },
  fa: { displayName: 'Persian', registryDescription: 'Persian', page: '/locales/persian' },
  fi: { displayName: 'Finnish', registryDescription: 'Finnish', page: '/locales/finnish' },
  fil: { displayName: 'Filipino', registryDescription: 'Filipino', page: '/locales/filipino' },
  fr: { displayName: 'French', registryDescription: 'French', page: '/locales/french' },
  gu: { displayName: 'Gujarati', registryDescription: 'Gujarati', page: '/locales/gujarati' },
  ha: { displayName: 'Hausa', registryDescription: 'Hausa', page: '/locales/hausa' },
  hbo: { displayName: 'Biblical Hebrew', registryDescription: 'Ancient Hebrew', page: '/locales/hebrew' },
  he: { displayName: 'Hebrew', registryDescription: 'Hebrew', page: '/locales/hebrew' },
  hi: { displayName: 'Hindi', registryDescription: 'Hindi', page: '/locales/hindi' },
  hr: { displayName: 'Croatian', registryDescription: 'Croatian', page: '/locales/croatian' },
  hu: { displayName: 'Hungarian', registryDescription: 'Hungarian', page: '/locales/hungarian' },
  id: { displayName: 'Indonesian', registryDescription: 'Indonesian', page: '/locales/indonesian' },
  ig: { displayName: 'Igbo', registryDescription: 'Igbo', page: '/locales/igbo' },
  is: { displayName: 'Icelandic', registryDescription: 'Icelandic', page: '/locales/icelandic' },
  it: { displayName: 'Italian', registryDescription: 'Italian', page: '/locales/italian' },
  ja: { displayName: 'Japanese', registryDescription: 'Japanese', page: '/locales/japanese' },
  jv: { displayName: 'Javanese', registryDescription: 'Javanese', page: '/locales/indonesian' },
  ka: { displayName: 'Georgian', registryDescription: 'Georgian', page: '/locales/georgian' },
  km: { displayName: 'Khmer', registryDescription: 'Khmer', page: '/locales/khmer' },
  kn: { displayName: 'Kannada', registryDescription: 'Kannada', page: '/locales/kannada' },
  ko: { displayName: 'Korean', registryDescription: 'Korean', page: '/locales/korean' },
  lo: { displayName: 'Lao', registryDescription: 'Lao', page: '/locales/lao' },
  lt: { displayName: 'Lithuanian', registryDescription: 'Lithuanian', page: '/locales/lithuanian' },
  lv: { displayName: 'Latvian', registryDescription: 'Latvian', page: '/locales/latvian' },
  ml: { displayName: 'Malayalam', registryDescription: 'Malayalam', page: '/locales/malayalam' },
  mr: { displayName: 'Marathi', registryDescription: 'Marathi', page: '/locales/marathi' },
  ms: { displayName: 'Malay', registryDescription: 'Malay (macrolanguage)', page: '/locales/malay' },
  my: { displayName: 'Burmese', registryDescription: 'Burmese', page: '/locales/burmese' },
  nb: {
    displayName: 'Norwegian Bokmål',
    registryDescription: 'Norwegian Bokmål',
    page: '/locales/norwegian',
  },
  ne: { displayName: 'Nepali', registryDescription: 'Nepali (macrolanguage)', page: '/locales/nepali' },
  nl: { displayName: 'Dutch', registryDescription: 'Dutch', page: '/locales/dutch' },
  or: { displayName: 'Odia', registryDescription: 'Odia (macrolanguage)', page: '/locales/odia' },
  pa: { displayName: 'Punjabi', registryDescription: 'Punjabi', page: '/locales/punjabi' },
  pl: { displayName: 'Polish', registryDescription: 'Polish', page: '/locales/polish' },
  pt: { displayName: 'Portuguese', registryDescription: 'Portuguese', page: '/locales/portuguese' },
  ro: { displayName: 'Romanian', registryDescription: 'Romanian', page: '/locales/romanian' },
  ru: { displayName: 'Russian', registryDescription: 'Russian', page: '/locales/russian' },
  si: { displayName: 'Sinhala', registryDescription: 'Sinhala', page: '/locales/sinhala' },
  sk: { displayName: 'Slovak', registryDescription: 'Slovak', page: '/locales/slovak' },
  sl: { displayName: 'Slovenian', registryDescription: 'Slovenian', page: '/locales/slovenian' },
  sq: { displayName: 'Albanian', registryDescription: 'Albanian', page: '/locales/albanian' },
  sr: { displayName: 'Serbian', registryDescription: 'Serbian', page: '/locales/serbian' },
  sv: { displayName: 'Swedish', registryDescription: 'Swedish', page: '/locales/swedish' },
  sw: { displayName: 'Swahili', registryDescription: 'Swahili (macrolanguage)', page: '/locales/swahili' },
  ta: { displayName: 'Tamil', registryDescription: 'Tamil', page: '/locales/tamil' },
  te: { displayName: 'Telugu', registryDescription: 'Telugu', page: '/locales/telugu' },
  th: { displayName: 'Thai', registryDescription: 'Thai', page: '/locales/thai' },
  tr: { displayName: 'Turkish', registryDescription: 'Turkish', page: '/locales/turkish' },
  uk: { displayName: 'Ukrainian', registryDescription: 'Ukrainian', page: '/locales/ukrainian' },
  ur: { displayName: 'Urdu', registryDescription: 'Urdu', page: '/locales/urdu' },
  uz: { displayName: 'Uzbek', registryDescription: 'Uzbek', page: '/locales/uzbek' },
  vi: { displayName: 'Vietnamese', registryDescription: 'Vietnamese', page: '/locales/vietnamese' },
  yo: { displayName: 'Yoruba', registryDescription: 'Yoruba', page: '/locales/yoruba' },
  yue: { displayName: 'Cantonese', registryDescription: 'Cantonese', page: '/locales/chinese' },
  zh: { displayName: 'Chinese', registryDescription: 'Chinese', page: '/locales/chinese' },
  zu: { displayName: 'Zulu', registryDescription: 'Zulu', page: '/locales/zulu' },
};

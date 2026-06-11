---
title: All 132 Locales — Number to Words | to-words
description: Complete list of all 132 language and regional locales supported by to-words. Arabic, Chinese, Devanagari, Latin, CJK, Cyrillic scripts and more.
head:
  - - meta
    - name: keywords
      content: number to words supported locales, number to words 132 languages, to-words all locales list
---

<script setup>
import LocaleDirectory from '../.vitepress/components/LocaleDirectory.vue'
</script>

# All 132 Supported Locales

Use this directory when you need the exact locale code, currency setup, or feature coverage before wiring `to-words` into a real product. The table below is generated from the library's source locale registry, so it stays aligned with the package rather than drifting from it.

## Choosing The Right Locale

- Use the full bundle when the locale can change at runtime: `toWords(123, { localeCode: 'fr-FR' })`
- Use per-locale imports when bundle size matters: `import { toWords } from 'to-words/hi-IN'`
- Prefer a region-specific code when currency names matter: `es-ES` and `es-MX` both speak Spanish, but they spell money differently
- For legal or banking output, check the `Fraction` and `Formal` columns before assuming the locale supports them

## Language Guide Pages

These are dedicated language guides covering every supported language. Each guide includes code examples, currency setup, and ordinal usage.

| Language              | Guide                               | Locale codes covered                                                                                                                                                                                                    |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Afrikaans             | [afrikaans](/locales/afrikaans)     | af-ZA                                                                                                                                                                                                                   |
| Albanian              | [albanian](/locales/albanian)       | sq-AL                                                                                                                                                                                                                   |
| Amharic               | [amharic](/locales/amharic)         | am-ET                                                                                                                                                                                                                   |
| Arabic                | [arabic](/locales/arabic)           | ar-AE, ar-DZ, ar-EG, ar-IQ, ar-LB, ar-MA, ar-SA, ar-SD, ar-YE                                                                                                                                                           |
| Assamese              | [assamese](/locales/assamese)       | as-IN                                                                                                                                                                                                                   |
| Azerbaijani           | [azerbaijani](/locales/azerbaijani) | az-AZ                                                                                                                                                                                                                   |
| Belarusian            | [belarusian](/locales/belarusian)   | be-BY                                                                                                                                                                                                                   |
| Bengali               | [bengali](/locales/bengali)         | bn-BD, bn-IN                                                                                                                                                                                                            |
| Bulgarian             | [bulgarian](/locales/bulgarian)     | bg-BG                                                                                                                                                                                                                   |
| Burmese               | [burmese](/locales/burmese)         | my-MM                                                                                                                                                                                                                   |
| Catalan               | [catalan](/locales/catalan)         | ca-ES                                                                                                                                                                                                                   |
| Chinese               | [chinese](/locales/chinese)         | yue-HK, zh-CN, zh-TW                                                                                                                                                                                                    |
| Croatian              | [croatian](/locales/croatian)       | hr-HR                                                                                                                                                                                                                   |
| Czech                 | [czech](/locales/czech)             | cs-CZ                                                                                                                                                                                                                   |
| Danish                | [danish](/locales/danish)           | da-DK                                                                                                                                                                                                                   |
| Dutch                 | [dutch](/locales/dutch)             | nl-NL, nl-SR                                                                                                                                                                                                            |
| English               | [english](/locales/english)         | en-AE, en-AU, en-BD, en-CA, en-GB, en-GH, en-HK, en-IE, en-IN, en-IQ, en-JM, en-KE, en-LK, en-MA, en-MM, en-MU, en-MY, en-NG, en-NP, en-NZ, en-OM, en-PH, en-PK, en-SA, en-SG, en-TT, en-TZ, en-UG, en-US, en-ZA, en-ZW |
| Estonian              | [estonian](/locales/estonian)       | ee-EE                                                                                                                                                                                                                   |
| Filipino              | [filipino](/locales/filipino)       | fil-PH                                                                                                                                                                                                                  |
| Finnish               | [finnish](/locales/finnish)         | fi-FI                                                                                                                                                                                                                   |
| French                | [french](/locales/french)           | fr-BE, fr-CA, fr-CH, fr-DZ, fr-FR, fr-MA, fr-SA                                                                                                                                                                         |
| Georgian              | [georgian](/locales/georgian)       | ka-GE                                                                                                                                                                                                                   |
| German                | [german](/locales/german)           | de-AT, de-CH, de-DE                                                                                                                                                                                                     |
| Greek                 | [greek](/locales/greek)             | el-GR                                                                                                                                                                                                                   |
| Gujarati              | [gujarati](/locales/gujarati)       | gu-IN                                                                                                                                                                                                                   |
| Hausa                 | [hausa](/locales/hausa)             | ha-NG                                                                                                                                                                                                                   |
| Hebrew                | [hebrew](/locales/hebrew)           | he-IL, hbo-IL                                                                                                                                                                                                           |
| Hindi                 | [hindi](/locales/hindi)             | hi-IN                                                                                                                                                                                                                   |
| Hungarian             | [hungarian](/locales/hungarian)     | hu-HU                                                                                                                                                                                                                   |
| Icelandic             | [icelandic](/locales/icelandic)     | is-IS                                                                                                                                                                                                                   |
| Igbo                  | [igbo](/locales/igbo)               | ig-NG                                                                                                                                                                                                                   |
| Indonesian / Javanese | [indonesian](/locales/indonesian)   | id-ID, jv-ID                                                                                                                                                                                                            |
| Italian               | [italian](/locales/italian)         | it-IT                                                                                                                                                                                                                   |
| Japanese              | [japanese](/locales/japanese)       | ja-JP                                                                                                                                                                                                                   |
| Kannada               | [kannada](/locales/kannada)         | kn-IN                                                                                                                                                                                                                   |
| Khmer                 | [khmer](/locales/khmer)             | km-KH                                                                                                                                                                                                                   |
| Korean                | [korean](/locales/korean)           | ko-KR                                                                                                                                                                                                                   |
| Latvian               | [latvian](/locales/latvian)         | lv-LV                                                                                                                                                                                                                   |
| Lithuanian            | [lithuanian](/locales/lithuanian)   | lt-LT                                                                                                                                                                                                                   |
| Malay                 | [malay](/locales/malay)             | ms-MY, ms-SG                                                                                                                                                                                                            |
| Malayalam             | [malayalam](/locales/malayalam)     | ml-IN                                                                                                                                                                                                                   |
| Marathi               | [marathi](/locales/marathi)         | mr-IN                                                                                                                                                                                                                   |
| Nepali                | [nepali](/locales/nepali)           | np-NP                                                                                                                                                                                                                   |
| Norwegian             | [norwegian](/locales/norwegian)     | nb-NO                                                                                                                                                                                                                   |
| Odia                  | [odia](/locales/odia)               | or-IN                                                                                                                                                                                                                   |
| Persian               | [persian](/locales/persian)         | fa-IR                                                                                                                                                                                                                   |
| Polish                | [polish](/locales/polish)           | pl-PL                                                                                                                                                                                                                   |
| Portuguese            | [portuguese](/locales/portuguese)   | pt-AO, pt-BR, pt-MZ, pt-PT                                                                                                                                                                                              |
| Punjabi               | [punjabi](/locales/punjabi)         | pa-IN                                                                                                                                                                                                                   |
| Romanian              | [romanian](/locales/romanian)       | ro-RO                                                                                                                                                                                                                   |
| Russian               | [russian](/locales/russian)         | ru-RU                                                                                                                                                                                                                   |
| Serbian               | [serbian](/locales/serbian)         | sr-RS                                                                                                                                                                                                                   |
| Sinhala               | [sinhala](/locales/sinhala)         | si-LK                                                                                                                                                                                                                   |
| Slovak                | [slovak](/locales/slovak)           | sk-SK                                                                                                                                                                                                                   |
| Slovenian             | [slovenian](/locales/slovenian)     | sl-SI                                                                                                                                                                                                                   |
| Spanish               | [spanish](/locales/spanish)         | es-AR, es-CL, es-CO, es-ES, es-MX, es-PE, es-US, es-VE                                                                                                                                                                  |
| Swahili               | [swahili](/locales/swahili)         | sw-KE, sw-TZ                                                                                                                                                                                                            |
| Swedish               | [swedish](/locales/swedish)         | sv-SE                                                                                                                                                                                                                   |
| Tamil                 | [tamil](/locales/tamil)             | ta-IN                                                                                                                                                                                                                   |
| Telugu                | [telugu](/locales/telugu)           | te-IN                                                                                                                                                                                                                   |
| Thai                  | [thai](/locales/thai)               | th-TH                                                                                                                                                                                                                   |
| Turkish               | [turkish](/locales/turkish)         | tr-TR                                                                                                                                                                                                                   |
| Ukrainian             | [ukrainian](/locales/ukrainian)     | uk-UA                                                                                                                                                                                                                   |
| Urdu                  | [urdu](/locales/urdu)               | ur-PK                                                                                                                                                                                                                   |
| Uzbek                 | [uzbek](/locales/uzbek)             | uz-UZ                                                                                                                                                                                                                   |
| Vietnamese            | [vietnamese](/locales/vietnamese)   | vi-VN                                                                                                                                                                                                                   |
| Yoruba                | [yoruba](/locales/yoruba)           | yo-NG                                                                                                                                                                                                                   |
| Zulu                  | [zulu](/locales/zulu)               | zu-ZA                                                                                                                                                                                                                   |

## How The Directory Is Ordered

- Primary sort: language name
- Secondary sort: country name
- Tie-breaker: locale code

This ordering is optimized for scanning by language family rather than by BCP-47 code.

## Locale Directory

<LocaleDirectory />

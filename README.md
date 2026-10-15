# to-words

[![npm version](https://img.shields.io/npm/v/to-words.svg)](https://www.npmjs.com/package/to-words)
[![build](https://img.shields.io/github/actions/workflow/status/mastermunj/to-words/ci.yml?branch=main&label=build)](https://github.com/mastermunj/to-words/actions)
[![coverage](https://codecov.io/gh/mastermunj/to-words/branch/main/graph/badge.svg)](https://codecov.io/gh/mastermunj/to-words)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/mastermunj/to-words/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mastermunj/to-words)
[![license](https://img.shields.io/npm/l/to-words)](https://github.com/mastermunj/to-words/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/to-words)](https://www.npmjs.com/package/to-words)

Convert numbers and currency amounts into words across 136 locales — production-ready BigInt, ordinal, and TypeScript support.

```js
import { toWords } from 'to-words';

toWords(12345, { localeCode: 'en-US' });
// "Twelve Thousand Three Hundred Forty Five"

toWords(452.36, { localeCode: 'en-IN', currency: true });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"
```

**[Try the interactive demo →](https://mastermunj.github.io/to-words/)** — currency, ordinals, gender, and large numbers, live in the browser. The [documentation site](https://mastermunj.github.io/to-words/guide/getting-started) has a guide for every feature and a page for every language.

> Need the reverse conversion too? Use the companion package [to-numbers](https://www.npmjs.com/package/to-numbers) to parse spelled-out numbers back into numeric values across the same locales.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage) — [currency](#currency), [ordinals](#ordinal-numbers), [gender](#gender), [decimals](#decimals), [large numbers](#bigint--large-numbers), [locale detection](#locale-detection), [custom locales](#custom-locales)
- [CLI](#%EF%B8%8F-cli)
- [Framework Integration](#%EF%B8%8F-framework-integration)
- [Numbering Systems](#-numbering-systems)
- [API Reference](#%EF%B8%8F-api-reference)
- [Error Handling](#%EF%B8%8F-error-handling)
- [Supported Locales](#%EF%B8%8F-supported-locales)
- [Performance & Compatibility](#-performance--compatibility)
- [Migrating From Other Libraries](#-migrating-from-other-libraries)
- [FAQ](#-faq)
- [Contributing](#-contributing)

## ✨ Features

- **136 Locales** — 72 languages with their regional currencies, from English, Hindi and Arabic to Georgian, Yoruba and Khmer
- **Verified Output** — Every locale's cardinals, ordinals, currency and decimals are checked against independent references: CLDR number rules, dictionaries, language-authority guidance and real-world usage
- **Currency** — Locale-specific currency and fractional units, custom currencies, and 3-decimal currencies (KWD, OMR, BHD)
- **Ordinals** — First, Second, Third, and their equivalents in every locale
- **Grammar-Aware** — Grammatical gender, plural forms of scale and currency words, and language-specific connectors
- **Numbering Systems** — Short scale, long scale, Indian (lakh, crore) and East Asian (万, 億)
- **Large Numbers** — Exact BigInt and string input beyond `Number.MAX_SAFE_INTEGER`, with a verified range per locale
- **Legal Decimals** — "Forty Five Hundredths" style via `decimalStyle: 'fraction'` in 100 locales
- **Formal Chinese Numerals** — Financial characters (大写/大寫) via `formal: true`
- **Small Per-Locale Bundles** — Import only the locale you need; ESM, CommonJS and UMD builds, TypeScript types, zero dependencies
- **Locale Detection** — `detectLocale()` and `resolveLocale()` map browser, runtime or request locales to a supported locale
- **CLI** — `npx to-words 12345 --locale en-US`

Common uses: amounts in words on invoices, cheques, receipts, payslips and contracts; order totals in e-commerce; accessible, screen-reader friendly numbers; text-to-speech; and language-learning apps.

## 📦 Installation

```bash
npm install to-words
# or
yarn add to-words
# or
pnpm add to-words
```

Requires Node.js 20 or newer, or any modern browser. For a `<script>` tag, use the UMD bundles from a CDN:

```html
<!-- Single locale (recommended) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  const toWords = new ToWords(); // pre-configured for en-US
  toWords.convert(12345); // "Twelve Thousand Three Hundred Forty Five"
</script>

<!-- All locales -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>
<script>
  const toWords = new ToWords({ localeCode: 'fr-FR' });
  toWords.convert(12345); // "Douze Mille Trois Cent Quarante-Cinq"
</script>
```

## 🚀 Quick Start

There are three ways to use `to-words`:

**1. Class-based** — reuse one instance for many conversions:

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(12345); // "Twelve Thousand Three Hundred Forty Five"
tw.convert(100, { currency: true }); // "One Hundred Dollars Only"
tw.toOrdinal(3); // "Third"
```

**2. Functional, all locales** — one-liners with a `localeCode` option:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words';

toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
toCurrency(100, { localeCode: 'en-US' }); // "One Hundred Dollars Only"
toOrdinal(3, { localeCode: 'en-US' }); // "Third"
```

**3. Functional, one locale** — the locale is built in, and the bundle is about a tenth of the size:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(12345); // "Twelve Thousand Three Hundred Forty Five"
toCurrency(100); // "One Hundred Dollars Only"
toOrdinal(3); // "Third"
```

Every locale entry point (`to-words/<locale>`) also exports a pre-configured `ToWords` class (`new ToWords()`), and CommonJS works the same way (`const { ToWords } = require('to-words')`).

### Which one should I use?

| Situation                                        | Import                                  | Gzip size |
| ------------------------------------------------ | --------------------------------------- | --------- |
| Browser app with a fixed locale                  | `to-words/<locale>`, or its UMD bundle  | ~8.8 KiB  |
| Locale chosen at runtime (per user, per request) | `to-words`, passing `localeCode`        | ~89.7 KiB |
| Server code (Node.js, SSR, APIs)                 | `to-words` — bundle size rarely matters | —         |

Sizes are for the minified UMD builds of 7.2.0 (en-US for a single locale); the build enforces size budgets, and `npm run size:check` prints the current figures.

> **Default locale:** when no `localeCode` is given, the runtime locale is **auto-detected** (see [Locale Detection](#locale-detection)), falling back to `en-IN` if it cannot be matched.

## 📖 Usage

The examples use the class API; every option works the same with `toWords()`, `toCurrency()` and `toOrdinal()`.

### Basic Conversion

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(123); // "One Hundred Twenty Three"
tw.convert(-5); // "Minus Five"
tw.convert(123.45); // "One Hundred Twenty Three Point Forty Five"
tw.convert('1000'); // "One Thousand" (numeric strings are accepted)
```

### Currency

```js
const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert(452.36, { currency: true });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"

// Without the "Only" suffix
tw.convert(452, { currency: true, doNotAddOnly: true });
// "Four Hundred Fifty Two Rupees"

// Ignore the fractional part
tw.convert(452.36, { currency: true, ignoreDecimal: true });
// "Four Hundred Fifty Two Rupees Only"

// Skip a zero main amount
tw.convert(0.36, { currency: true, ignoreZeroCurrency: true });
// "Thirty Six Paise Only"

// Show a zero fractional part (string input keeps the .00)
tw.convert('452.00', { currency: true, includeZeroFractional: true });
// "Four Hundred Fifty Two Rupees And Zero Paise Only"
```

`toCurrency(n, options)` is shorthand for `toWords(n, { currency: true, ...options })`.

**Custom currency** — keep the locale's language and replace its currency:

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(100.5, {
  currency: true,
  currencyOptions: {
    name: 'Euro',
    plural: 'Euros',
    singular: 'Euro',
    symbol: '€',
    fractionalUnit: { name: 'Cent', plural: 'Cents', singular: 'Cent', symbol: '' },
  },
});
// "One Hundred Euros And Fifty Cents Only"
```

`singular` is the form used for an amount of exactly one; without it, the `plural` form is used for every amount ("One Euros").

**3-decimal currencies** — OMR, IQD, KWD and BHD have 1000 minor units. `en-OM`, `en-IQ` and `ar-IQ` have this built in; for a custom currency, add `precision: 3`:

```js
const om = new ToWords({ localeCode: 'en-OM' });
om.convert('500.500', { currency: true });
// "Five Hundred Omani Rials And Five Hundred Baisa Only"

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert('1.500', {
  currency: true,
  currencyOptions: {
    name: 'Kuwaiti Dinar',
    plural: 'Kuwaiti Dinars',
    singular: 'Kuwaiti Dinar',
    symbol: 'KWD',
    precision: 3,
    fractionalUnit: { name: 'Fils', plural: 'Fils', symbol: '' },
  },
});
// "One Kuwaiti Dinar And Five Hundred Fils Only"
```

> Pass amounts as **strings** when trailing zeros matter: in JavaScript `500.500 === 500.5`.

### Ordinal Numbers

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.toOrdinal(1); // "First"
tw.toOrdinal(21); // "Twenty First"
tw.toOrdinal(100); // "One Hundredth"
```

Ordinals are available in all 136 locales. They accept non-negative integers, plus the `gender` and `formal` options where the locale supports them.

### Gender

Languages with grammatical gender take a `gender` option, per call or as a constructor default:

```js
const es = new ToWords({ localeCode: 'es-ES' });
es.convert(1); // "Uno"
es.convert(1, { gender: 'feminine' }); // "Una"
es.convert(21, { gender: 'feminine' }); // "Veintiuna"
es.convert(200, { gender: 'feminine' }); // "Doscientas"

const ar = new ToWords({ localeCode: 'ar-AE' });
ar.convert(3, { gender: 'feminine' }); // "ثلاث"

const fem = new ToWords({ localeCode: 'pt-BR', converterOptions: { gender: 'feminine' } });
fem.convert(2); // "Duas"
```

Supported in 40 locales: Spanish (8), Arabic (9), Portuguese (4), Hebrew (2), Russian, Ukrainian, Belarusian, Polish, Czech, Slovak, Slovenian, Croatian, Serbian, Bulgarian, Greek, Catalan, Romanian, Latvian, Lithuanian, Icelandic, and Swedish. Currency amounts agree with the currency's own gender automatically (ru "Один Рубль", uk "Одна Гривня"). The [capability matrix](https://mastermunj.github.io/to-words/guide/locale-capabilities) lists support per locale.

### The "And" Connector

`useAnd` inserts the locale's "and" word before the last part of a number:

```js
const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(123, { useAnd: true }); // "One Hundred And Twenty Three"
tw.convert(1023, { useAnd: true }); // "One Thousand And Twenty Three"
```

- **Danish and Norwegian** (`da-DK`, `nb-NO`) include "Og" by default, as written Danish and Norwegian do ("Hundrede Og Tyve"). Pass `useAnd: false` to leave it out.
- It has no effect where the locale already joins numbers with a connector (Portuguese "E", Spanish "Y") or has none (ja-JP, zh-CN, zh-TW, yue-HK).

### Decimals

By default, the digits after the point word are read as a number, with any leading zeros read one by one. For legal and financial writing, `decimalStyle: 'fraction'` reads them as a fraction with a place-value denominator:

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(123.45); // "One Hundred Twenty Three Point Forty Five"
tw.convert(0.05); // "Zero Point Zero Five"

tw.convert(123.45, { decimalStyle: 'fraction' }); // "One Hundred Twenty Three And Forty Five Hundredths"
tw.convert(1.1, { decimalStyle: 'fraction' }); // "One And One Tenth"
tw.convert(0.001, { decimalStyle: 'fraction' }); // "Zero And One Thousandth"

const ru = new ToWords({ localeCode: 'ru-RU' });
ru.convert(1.21, { decimalStyle: 'fraction' }); // "Одна Целая Двадцать Одна Сотая"
```

- Fraction style covers 1 to 6 decimal places (tenths to millionths) in 100 locales, and up to 15 in Russian, Ukrainian, Belarusian, Polish, Czech and Slovak, each with its own grammar: Russian, for example, uses the singular denominator after 21, 31 and so on.
- For more decimal places, or a locale without fraction words (Arabic, East Asian and Turkic locales, among others), it falls back to the default style without an error. The [fraction-style guide](https://mastermunj.github.io/to-words/guide/fraction-style) lists the locales.
- Currency amounts always use the currency's fractional unit ("Fifty Six Cents"), whichever style is set.

### BigInt & Large Numbers

JavaScript numbers lose precision above `Number.MAX_SAFE_INTEGER` (and print in scientific notation past 1e21), so pass large values as a `bigint` or a string:

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(1000000000000000000n); // "One Quintillion"
tw.convert('9007199254740993');
// "Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion Two Hundred Fifty Four Million Seven Hundred Forty Thousand Nine Hundred Ninety Three"

tw.convert(123456789012345678901); // ❌ precision already lost: "...Six Hundred Eighty Three Thousand Nine Hundred Sixty Eight"
tw.convert(123456789012345678901n); // ✅ exact
```

Each locale has a verified range: en-US goes up to vigintillions (10^63), for example. A number above it throws a `NumberOutOfRangeError` (see [Error Handling](#%EF%B8%8F-error-handling)), unless you pass `{ rangeMode: 'compose' }` to compose the words from smaller scale words (`'1e70'` → "Ten Million Vigintillion"). The manifest reports each locale's exact range.

### Formal Chinese Numerals

```js
const cn = new ToWords({ localeCode: 'zh-CN' });
cn.convert(123); // "一 百 二十 三"
cn.convert(123, { formal: true }); // "壹 佰 贰拾 叁"

const tw = new ToWords({ localeCode: 'zh-TW' });
tw.toOrdinal(5, { formal: true }); // "第伍"
```

### Locale Detection

When no `localeCode` is given, `new ToWords()`, `toWords()`, `toOrdinal()` and `toCurrency()` call `detectLocale()`: it reads `navigator.language` in browsers and `Intl` in Node.js and other runtimes, and falls back to `en-IN`. `resolveLocale()` applies the same matching to any string, such as a user setting or an `Accept-Language` header, without reading the environment:

```js
import { detectLocale, resolveLocale, ToWords } from 'to-words';

const tw = new ToWords({ localeCode: detectLocale('en-US') }); // custom fallback

resolveLocale('EN_us'); // "en-US"
resolveLocale('zh-Hant-TW'); // "zh-TW"
resolveLocale('pt'); // "pt-BR" (language-only values use a fixed default)
resolveLocale('xx'); // undefined
```

In SSR and APIs, pass the request's locale explicitly. `setLocaleDetector()` replaces the detector for the whole process, so keep it to tests and app-wide setup.

### Locale Capability Manifest

`to-words/manifest` describes every locale without loading its word tables, for example to build a language picker or check a feature before using it:

```js
import { getLocaleCapabilities, getLocaleMetadata, isSupportedLocale, SUPPORTED_LOCALES } from 'to-words/manifest';

isSupportedLocale('en-US'); // true
getLocaleCapabilities('zh-CN')?.formal; // true
getLocaleMetadata('hi-IN')?.numbering.grouping; // [3, 2]
getLocaleMetadata('en-US')?.range.maximumSupported.cardinal; // exact inclusive ceiling
SUPPORTED_LOCALES.length; // 136
```

The same data is published as the [capability matrix](https://mastermunj.github.io/to-words/guide/locale-capabilities).

### Custom Locales

For units or wording no built-in locale has, define your own locale class and pass it to `ToWordsCore`; no fork or PR needed:

```ts
import { ToWordsCore } from 'to-words/core';
import type { LocaleInterface, LocaleConfig } from 'to-words/types';

class BitcoinLocale implements LocaleInterface {
  config: LocaleConfig = {
    currency: {
      name: 'Bitcoin',
      plural: 'Bitcoins',
      singular: 'Bitcoin',
      symbol: '₿',
      fractionalUnit: { name: 'Satoshi', plural: 'Satoshis', singular: 'Satoshi', symbol: 'sat' },
    },
    texts: { and: 'And', minus: 'Minus', only: 'Only', point: 'Point' },
    numberWordsMapping: [
      // Largest number first, same structure as any built-in locale
      // ...
      { number: 2, value: 'Two' },
      { number: 1, value: 'One' },
      { number: 0, value: 'Zero' },
    ],
  };
}

const tw = new ToWordsCore();
tw.setLocale(BitcoinLocale);
tw.convert(2.1, { currency: true }); // "Two Bitcoins And Ten Satoshis Only"
```

- The easiest start is to copy the nearest built-in locale from [`src/locales/`](src/locales/) and change only what differs.
- Beyond the required fields, `LocaleConfig` has optional keys for grammar such as plural rules, gender agreement, connector words and ordinal formation. Each is documented in [`src/types.ts`](src/types.ts), and the built-in locales show them in use.
- A custom locale is validated on first use; `assertLocaleConfig()` from `to-words/locale-contract` runs the same check in CI. Its configuration is frozen once initialized, so create a new class to change it.

## 🖥️ CLI

```bash
npx to-words 12345 --locale en-US
# Twelve Thousand Three Hundred Forty Five

npx to-words 1234.56 --locale en-US --currency
# One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only

npx to-words 3 --locale en-US --ordinal
# Third

npx to-words --locale en-US -- -5
# Minus Five

npx to-words --detect-locale
# en-US  (or whatever your system locale is)
```

Without `--locale`, the system locale is used. After `npm i -g to-words`, the `to-words` command is available directly.

## ⚛️ Framework Integration

`to-words` has no framework dependencies. Create an instance once, outside render, and call it like any function:

```tsx
// Change the locale import to match your users' region (e.g. 'to-words/en-GB')
import { ToWords } from 'to-words/en-US';

const toWords = new ToWords();

function PriceInWords({ amount }: { amount: number }) {
  return <span>{toWords.convert(amount, { currency: true })}</span>;
}
// <PriceInWords amount={1234.56} /> renders
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

The [framework guide](https://mastermunj.github.io/to-words/guide/framework-integration) has the same for Vue 3, Angular (a pipe), Svelte, Next.js (server and client components) and Express.

## 🌍 Numbering Systems

| System      | Used by                                                | Large numbers                                                                             |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Short scale | English and most locales                               | Million (10^6), Billion (10^9), Trillion (10^12) … up to Vigintillion (10^63)             |
| Long scale  | German, French, Spanish, Portuguese (pt-PT) and others | 10^9 is a thousand millions (Milliarde, Milliard, Mil Millones), 10^12 a Billion (Billón) |
| Indian      | India, Bangladesh, Nepal, Pakistan (`ur-PK`)           | Lakh (10^5), Crore (10^7)                                                                 |
| East Asian  | Japanese, Chinese, Korean                              | 万 (10^4), 億 (10^8), 兆 (10^12), 京 (10^16)                                              |

```js
new ToWords({ localeCode: 'de-DE' }).convert(1000000000); // "Eine Milliarde"
new ToWords({ localeCode: 'en-IN' }).convert(1000000000000n); // "One Lakh Crore"
new ToWords({ localeCode: 'hi-IN' }).convert(1000000000000n); // "एक लाख करोड़"
new ToWords({ localeCode: 'ja-JP' }).convert(100000000); // "一 億"
```

**Above a crore**, the Indian and Bangladeshi locales compose crore-based amounts, as official Indian usage does (Union Budget 2026-27: "₹53.5 lakh crore"): 10^9 is "One Hundred Crore" and 10^12 "One Lakh Crore". Nepal (`ne-NP`, `en-NP`) keeps Arba and Kharba, as its government budget does; `ur-PK` counts in ارب (ایک ہزار ارب = 10^12); and `en-PK` and `en-MU` use Million and Billion, as the Pakistani and Mauritian budget documents do.

## ⚙️ API Reference

### Entry points

| Import                                      | Exports                                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `to-words`                                  | `ToWords` class, `toWords`, `toOrdinal`, `toCurrency`, `detectLocale`, `resolveLocale`, `setLocaleDetector`, `LOCALES`, `NumberOutOfRangeError` |
| `to-words/<locale>` (e.g. `to-words/en-US`) | `ToWords` class (pre-configured), `toWords`, `toOrdinal`, `toCurrency` — no `localeCode` option                                                 |
| `to-words/manifest`                         | `SUPPORTED_LOCALES`, `isSupportedLocale`, `getLocaleCapabilities`, `getLocaleMetadata`                                                          |
| `to-words/core`                             | `ToWordsCore`, for [custom locales](#custom-locales)                                                                                            |
| `to-words/locale-contract`                  | `assertLocaleConfig`, `validateLocaleConfig`                                                                                                    |
| `to-words/errors`                           | `NumberOutOfRangeError`                                                                                                                         |
| `to-words/types`                            | TypeScript types (`ConverterOptions`, `LocaleConfig`, `LocaleCode` …)                                                                           |

### Methods and functions

| Call                                                             | Returns                                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `new ToWords({ localeCode?, converterOptions? })`                | An instance; `converterOptions` sets defaults that each call can override |
| `tw.convert(number, options?)` / `toWords(number, options?)`     | Number in words                                                           |
| `tw.toOrdinal(number, options?)` / `toOrdinal(number, options?)` | Ordinal in words; non-negative integers only; options `gender`, `formal`  |
| `toCurrency(number, options?)`                                   | Same as `toWords` with `currency: true`                                   |
| `detectLocale(fallback?)`                                        | The runtime's supported locale, or `fallback` (default `'en-IN'`)         |
| `resolveLocale(input)`                                           | The matching `LocaleCode`, or `undefined`                                 |

`number` can be a `number`, `bigint` or numeric string. The functional helpers take `localeCode` in their options and cache one instance per locale.

### Converter options

| Option                  | Type    | Default    | Description                                                                                                                      |
| ----------------------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `currency`              | boolean | `false`    | Convert as a currency amount, with the locale's currency                                                                         |
| `currencyOptions`       | object  | —          | Replace the locale's currency (`name`, `plural`, `singular`, `symbol`, `precision`, `fractionalUnit`); see [Currency](#currency) |
| `ignoreDecimal`         | boolean | `false`    | Drop the fractional part                                                                                                         |
| `ignoreZeroCurrency`    | boolean | `false`    | Skip a zero main amount ("Thirty Six Paise Only")                                                                                |
| `doNotAddOnly`          | boolean | `false`    | Omit the "Only" word in currency mode                                                                                            |
| `includeZeroFractional` | boolean | `false`    | For string input like `"123.00"`, include "And Zero Paise"                                                                       |
| `gender`                | string  | —          | `'masculine'` or `'feminine'`, in locales with gendered number words                                                             |
| `useAnd`                | boolean | —          | Insert the locale's "and" before the last part ("One Hundred And Twenty Three"); default `true` for da-DK and nb-NO              |
| `formal`                | boolean | —          | Formal/financial characters (zh-CN, zh-TW)                                                                                       |
| `decimalStyle`          | string  | `'digit'`  | `'digit'` reads the digits after the point as a number; `'fraction'` reads "Forty Five Hundredths"; see [Decimals](#decimals)    |
| `rangeMode`             | string  | `'strict'` | `'strict'` throws above the locale's verified range; `'compose'` composes larger numbers from smaller scale words                |

Option objects, `LOCALES` and the default option objects are frozen or copied when used, so changing them later has no effect on an instance. The [API reference](https://mastermunj.github.io/to-words/guide/api-reference) on the docs site also covers `setLocaleDetector()`, the utility methods and locale inspection.

## ⚠️ Error Handling

Invalid input throws an `Error` with a descriptive message:

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert('abc'); // Error: Invalid Number "abc"   (also NaN and Infinity)
tw.toOrdinal(-5); // Error: Ordinal numbers must be non-negative integers, got "-5"
new ToWords({ localeCode: 'xx-XX' }).convert(1); // Error: Unknown Locale "xx-XX".
```

A number above the locale's verified range throws a `NumberOutOfRangeError` (a `RangeError` with `code: 'NUMBER_OUT_OF_RANGE'`) that names the locale and its maximum:

```js
import { NumberOutOfRangeError } from 'to-words';

try {
  tw.convert(userInput);
} catch (error) {
  if (error instanceof NumberOutOfRangeError) {
    // too large for this locale; or retry with { rangeMode: 'compose' }
  } else {
    // invalid input
  }
}
```

## 🗺️ Supported Locales

| Group                              | Locales                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **English** (31)                   | en-AE, en-AU, en-BD, en-CA, en-GB, en-GH, en-HK, en-IE, en-IN, en-IQ, en-JM, en-KE, en-LK, en-MA, en-MM, en-MU, en-MY, en-NG, en-NP, en-NZ, en-OM, en-PH, en-PK, en-SA, en-SG, en-TT, en-TZ, en-UG, en-US, en-ZA, en-ZW                                                                                                                                                                                                                  |
| **French** (10)                    | fr-BE, fr-CA, fr-CH, fr-CI, fr-CM, fr-DZ, fr-FR, fr-MA, fr-MG, fr-SA                                                                                                                                                                                                                                                                                                                                                                     |
| **Arabic** (9)                     | ar-AE, ar-DZ, ar-EG, ar-IQ, ar-LB, ar-MA, ar-SA, ar-SD, ar-YE                                                                                                                                                                                                                                                                                                                                                                            |
| **Spanish** (8)                    | es-AR, es-CL, es-CO, es-ES, es-MX, es-PE, es-US, es-VE                                                                                                                                                                                                                                                                                                                                                                                   |
| **Portuguese** (4)                 | pt-AO, pt-BR, pt-MZ, pt-PT                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Other European** (29)            | Albanian sq-AL, Belarusian be-BY, Bulgarian bg-BG, Catalan ca-ES, Croatian hr-HR, Czech cs-CZ, Danish da-DK, Dutch nl-NL / nl-SR, Estonian et-EE, Finnish fi-FI, German de-AT / de-CH / de-DE, Greek el-GR, Hungarian hu-HU, Icelandic is-IS, Italian it-IT, Latvian lv-LV, Lithuanian lt-LT, Norwegian nb-NO, Polish pl-PL, Romanian ro-RO, Russian ru-RU, Serbian sr-RS, Slovak sk-SK, Slovenian sl-SI, Swedish sv-SE, Ukrainian uk-UA |
| **South Asian** (15)               | Assamese as-IN, Bengali bn-BD / bn-IN, Gujarati gu-IN, Hindi hi-IN, Kannada kn-IN, Malayalam ml-IN, Marathi mr-IN, Nepali ne-NP, Odia or-IN, Punjabi pa-IN, Sinhala si-LK, Tamil ta-IN, Telugu te-IN, Urdu ur-PK                                                                                                                                                                                                                         |
| **East & Southeast Asian** (15)    | Burmese my-MM, Cantonese yue-HK, Chinese zh-CN / zh-TW, Filipino fil-PH, Indonesian id-ID, Japanese ja-JP, Javanese jv-ID, Khmer km-KH, Korean ko-KR, Lao lo-LA, Malay ms-MY / ms-SG, Thai th-TH, Vietnamese vi-VN                                                                                                                                                                                                                       |
| **Middle East & Central Asia** (7) | Azerbaijani az-AZ, Georgian ka-GE, Hebrew he-IL, Biblical Hebrew hbo-IL, Persian fa-IR, Turkish tr-TR, Uzbek uz-UZ                                                                                                                                                                                                                                                                                                                       |
| **African** (8)                    | Afrikaans af-ZA, Amharic am-ET, Hausa ha-NG, Igbo ig-NG, Swahili sw-KE / sw-TZ, Yoruba yo-NG, Zulu zu-ZA                                                                                                                                                                                                                                                                                                                                 |

Every locale supports cardinals, ordinals and currency. Each language has a [docs page](https://mastermunj.github.io/to-words/locales/) with examples, and the [capability matrix](https://mastermunj.github.io/to-words/guide/locale-capabilities) shows numbering system, range, gender and fraction support per locale.

<details>
<summary><strong>Full table: country and currency of every locale</strong></summary>

| Locale | Language        | Country             | Currency      |
| ------ | --------------- | ------------------- | ------------- |
| af-ZA  | Afrikaans       | South Africa        | Rand          |
| am-ET  | Amharic         | Ethiopia            | ብር            |
| ar-AE  | Arabic          | UAE                 | درهم          |
| ar-DZ  | Arabic          | Algeria             | دينار         |
| ar-EG  | Arabic          | Egypt               | جنيه          |
| ar-IQ  | Arabic          | Iraq                | دينار         |
| ar-LB  | Arabic          | Lebanon             | ليرة          |
| ar-MA  | Arabic          | Morocco             | درهم          |
| ar-SA  | Arabic          | Saudi Arabia        | ريال          |
| ar-SD  | Arabic          | Sudan               | جنيه          |
| ar-YE  | Arabic          | Yemen               | ريال          |
| as-IN  | Assamese        | India               | টকা            |
| az-AZ  | Azerbaijani     | Azerbaijan          | Manat         |
| be-BY  | Belarusian      | Belarus             | Рубель        |
| bg-BG  | Bulgarian       | Bulgaria            | Евро          |
| bn-BD  | Bengali         | Bangladesh          | টাকা            |
| bn-IN  | Bengali         | India               | টাকা            |
| ca-ES  | Catalan         | Spain               | Euro          |
| cs-CZ  | Czech           | Czech Republic      | Koruna        |
| da-DK  | Danish          | Denmark             | Krone         |
| de-AT  | German          | Austria             | Euro          |
| de-CH  | German          | Switzerland         | Franken       |
| de-DE  | German          | Germany             | Euro          |
| el-GR  | Greek           | Greece              | Ευρώ          |
| en-AE  | English         | UAE                 | Dirham        |
| en-AU  | English         | Australia           | Dollar        |
| en-BD  | English         | Bangladesh          | Taka          |
| en-CA  | English         | Canada              | Dollar        |
| en-GB  | English         | United Kingdom      | Pound         |
| en-GH  | English         | Ghana               | Cedi          |
| en-HK  | English         | Hong Kong           | Dollar        |
| en-IE  | English         | Ireland             | Euro          |
| en-IN  | English         | India               | Rupee         |
| en-IQ  | English         | Iraq                | Dinar         |
| en-JM  | English         | Jamaica             | Dollar        |
| en-KE  | English         | Kenya               | Shilling      |
| en-LK  | English         | Sri Lanka           | Rupee         |
| en-MA  | English         | Morocco             | Dirham        |
| en-MM  | English         | Myanmar             | Kyat          |
| en-MU  | English         | Mauritius           | Rupee         |
| en-MY  | English         | Malaysia            | Ringgit       |
| en-NG  | English         | Nigeria             | Naira         |
| en-NP  | English         | Nepal               | Rupee         |
| en-NZ  | English         | New Zealand         | Dollar        |
| en-OM  | English         | Oman                | Rial          |
| en-PH  | English         | Philippines         | Peso          |
| en-PK  | English         | Pakistan            | Rupee         |
| en-SA  | English         | Saudi Arabia        | Riyal         |
| en-SG  | English         | Singapore           | Dollar        |
| en-TT  | English         | Trinidad and Tobago | Dollar        |
| en-TZ  | English         | Tanzania            | Shilling      |
| en-UG  | English         | Uganda              | Shilling      |
| en-US  | English         | USA                 | Dollar        |
| en-ZA  | English         | South Africa        | Rand          |
| en-ZW  | English         | Zimbabwe            | Zimbabwe Gold |
| es-AR  | Spanish         | Argentina           | Peso          |
| es-CL  | Spanish         | Chile               | Peso          |
| es-CO  | Spanish         | Colombia            | Peso          |
| es-ES  | Spanish         | Spain               | Euro          |
| es-MX  | Spanish         | Mexico              | Peso          |
| es-PE  | Spanish         | Peru                | Sol           |
| es-US  | Spanish         | USA                 | Dólar         |
| es-VE  | Spanish         | Venezuela           | Bolívar       |
| et-EE  | Estonian        | Estonia             | Euro          |
| fa-IR  | Persian         | Iran                | تومان         |
| fi-FI  | Finnish         | Finland             | Euro          |
| fil-PH | Filipino        | Philippines         | Piso          |
| fr-BE  | French          | Belgium             | Euro          |
| fr-CA  | French          | Canada              | Dollar        |
| fr-CH  | French          | Switzerland         | Franc         |
| fr-CI  | French          | Côte d'Ivoire       | Franc CFA     |
| fr-CM  | French          | Cameroon            | Franc CFA     |
| fr-DZ  | French          | Algeria             | Dinar         |
| fr-FR  | French          | France              | Euro          |
| fr-MA  | French          | Morocco             | Dirham        |
| fr-MG  | French          | Madagascar          | Ariary        |
| fr-SA  | French          | Saudi Arabia        | Riyal         |
| gu-IN  | Gujarati        | India               | રૂપિયો         |
| ha-NG  | Hausa           | Nigeria             | Naira         |
| hbo-IL | Biblical Hebrew | Israel              | שקל           |
| he-IL  | Hebrew          | Israel              | שקל           |
| hi-IN  | Hindi           | India               | रुपया          |
| hr-HR  | Croatian        | Croatia             | Euro          |
| hu-HU  | Hungarian       | Hungary             | Forint        |
| id-ID  | Indonesian      | Indonesia           | Rupiah        |
| ig-NG  | Igbo            | Nigeria             | Naira         |
| is-IS  | Icelandic       | Iceland             | Króna         |
| it-IT  | Italian         | Italy               | Euro          |
| ja-JP  | Japanese        | Japan               | 円            |
| jv-ID  | Javanese        | Indonesia           | Rupiah        |
| ka-GE  | Georgian        | Georgia             | ლარი          |
| km-KH  | Khmer           | Cambodia            | រៀល           |
| kn-IN  | Kannada         | India               | ರೂಪಾಯಿ          |
| ko-KR  | Korean          | South Korea         | 원            |
| lo-LA  | Lao             | Laos                | ກີບ            |
| lt-LT  | Lithuanian      | Lithuania           | Euras         |
| lv-LV  | Latvian         | Latvia              | Eiro          |
| ml-IN  | Malayalam       | India               | രൂപ            |
| mr-IN  | Marathi         | India               | रुपया          |
| ms-MY  | Malay           | Malaysia            | Ringgit       |
| ms-SG  | Malay           | Singapore           | Dolar         |
| my-MM  | Burmese         | Myanmar             | ကျပ်           |
| nb-NO  | Norwegian       | Norway              | Krone         |
| nl-NL  | Dutch           | Netherlands         | Euro          |
| nl-SR  | Dutch           | Suriname            | Dollar        |
| ne-NP  | Nepali          | Nepal               | रुपैयाँ          |
| or-IN  | Odia            | India               | ଟଙ୍କା           |
| pa-IN  | Punjabi         | India               | ਰੁਪਇਆ          |
| pl-PL  | Polish          | Poland              | Złoty         |
| pt-AO  | Portuguese      | Angola              | Kwanza        |
| pt-BR  | Portuguese      | Brazil              | Real          |
| pt-MZ  | Portuguese      | Mozambique          | Metical       |
| pt-PT  | Portuguese      | Portugal            | Euro          |
| ro-RO  | Romanian        | Romania             | Leu           |
| ru-RU  | Russian         | Russia              | Рубль         |
| si-LK  | Sinhala         | Sri Lanka           | රුපියල          |
| sk-SK  | Slovak          | Slovakia            | Euro          |
| sl-SI  | Slovenian       | Slovenia            | Evro          |
| sq-AL  | Albanian        | Albania             | Lek           |
| sr-RS  | Serbian         | Serbia              | Dinar         |
| sv-SE  | Swedish         | Sweden              | Krona         |
| sw-KE  | Swahili         | Kenya               | Shilingi      |
| sw-TZ  | Swahili         | Tanzania            | Shilingi      |
| ta-IN  | Tamil           | India               | ரூபாய்          |
| te-IN  | Telugu          | India               | రూపాయి          |
| th-TH  | Thai            | Thailand            | บาท           |
| tr-TR  | Turkish         | Turkey              | Lira          |
| uk-UA  | Ukrainian       | Ukraine             | Гривня        |
| ur-PK  | Urdu            | Pakistan            | روپیہ         |
| uz-UZ  | Uzbek           | Uzbekistan          | So'm          |
| vi-VN  | Vietnamese      | Vietnam             | Đồng          |
| yo-NG  | Yoruba          | Nigeria             | Naira         |
| yue-HK | Cantonese       | Hong Kong           | 元            |
| zh-CN  | Chinese         | China               | 元            |
| zh-TW  | Chinese         | Taiwan              | 元            |
| zu-ZA  | Zulu            | South Africa        | Rand          |

</details>

## ⚡ Performance & Compatibility

Conversions run at hundreds of thousands to millions per second. Benchmarked for en-US on an Apple M5 with Node.js 24:

| Operation                  | Throughput    |
| -------------------------- | ------------- |
| Small integers (42)        | ~6.7M ops/sec |
| Medium integers (12,345)   | ~2.4M ops/sec |
| Large integers (15 digits) | ~740K ops/sec |
| Currency conversion        | ~1.3M ops/sec |
| BigInt (30+ digits)        | ~230K ops/sec |

Run `npm run bench` to measure locally. Creating an instance costs far more than a conversion, so reuse one instance (or the functional helpers, which cache one per locale).

**Runtimes:** Node.js 20+ (tested in CI), and Deno, Bun and Cloudflare Workers, which work because the library uses only standard ECMAScript (BigInt, Intl, Map, `globalThis`) and no Node.js APIs.

**Browsers:** Chrome 67+, Firefox 68+, Safari 14+, Edge 79+, Opera 54+. BigInt is required, so Internet Explorer is not supported.

## 🔄 Migrating From Other Libraries

| Capability                 | **to-words**    | number-to-words | written-number | num-words      | n2words       |
| -------------------------- | --------------- | --------------- | -------------- | -------------- | ------------- |
| Locale / language coverage | **136 locales** | English-focused | Multi-language | Indian English | 70+ languages |
| TypeScript declarations    | ✅              | ❌              | ❌             | ✅             | ✅            |
| ESM-ready package          | ✅              | ❌              | ❌             | ❌             | ✅            |
| Package `exports` map      | ✅              | ❌              | ❌             | ❌             | ✅            |
| BigInt support             | ✅              | ❌              | ❌             | ❌             | ✅            |
| Currency conversion mode   | ✅              | ❌              | ❌             | ❌             | ✅            |
| Ordinal conversion         | ✅              | ✅              | ❌             | ❌             | ✅            |
| Subpath locale imports     | ✅              | ❌              | ❌             | ❌             | ✅            |

[`MIGRATION.md`](MIGRATION.md) maps each library's API to `to-words`, with behaviour notes and a regression checklist. The docs site has a [detailed comparison](https://mastermunj.github.io/to-words/compare/number-to-words-alternatives).

## ❓ FAQ

<details>
<summary><strong>Why does a large number come out wrong, or in scientific notation?</strong></summary>

JavaScript can't represent integers above `Number.MAX_SAFE_INTEGER` exactly, and writes numbers from 1e21 up in scientific notation, so the value is already wrong before `to-words` sees it. Pass a `bigint` (`123456789012345678901n`) or a string (`'123456789012345678901'`). See [BigInt & Large Numbers](#bigint--large-numbers).

</details>

<details>
<summary><strong>Why are amounts like 1234.56 read as "Point Fifty Six" and not "Fifty Six Hundredths"?</strong></summary>

That is the default `decimalStyle: 'digit'`. Pass `decimalStyle: 'fraction'` for the legal style, or `currency: true` for currency amounts. See [Decimals](#decimals).

</details>

<details>
<summary><strong>Which locale do I get without a localeCode?</strong></summary>

The runtime locale, detected from `navigator.language` or `Intl`, and `en-IN` if it can't be matched. Pass `localeCode` (or `detectLocale('your-fallback')`) to be explicit. See [Locale Detection](#locale-detection).

</details>

<details>
<summary><strong>How do I add support for a new locale?</strong></summary>

[CONTRIBUTING.md](CONTRIBUTING.md) walks through adding a locale file and its tests. To use your own locale without contributing it, see [Custom Locales](#custom-locales).

</details>

## 🤝 Contributing

Contributions are welcome! [CONTRIBUTING.md](CONTRIBUTING.md) covers development setup, coding guidelines, adding a locale, the commit message format, and the PR process.

For questions or ideas, [open an issue](https://github.com/mastermunj/to-words/issues) or [start a discussion](https://github.com/mastermunj/to-words/discussions). This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## 💖 Support

If `to-words` is useful in your work, consider supporting ongoing maintenance through [GitHub Sponsors](https://github.com/sponsors/mastermunj). After installation, `npm fund to-words` shows the same link.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 📄 License

[MIT](LICENSE)

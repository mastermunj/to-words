# to-words

[![npm version](https://img.shields.io/npm/v/to-words.svg)](https://www.npmjs.com/package/to-words)
[![build](https://img.shields.io/github/actions/workflow/status/mastermunj/to-words/ci.yml?branch=main&label=build)](https://github.com/mastermunj/to-words/actions)
[![coverage](https://codecov.io/gh/mastermunj/to-words/branch/main/graph/badge.svg)](https://codecov.io/gh/mastermunj/to-words)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/mastermunj/to-words/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mastermunj/to-words)
[![license](https://img.shields.io/npm/l/to-words)](https://github.com/mastermunj/to-words/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/to-words)](https://www.npmjs.com/package/to-words)

Convert numbers and currency amounts into words across 135 locales — production-ready BigInt, ordinal, and TypeScript support.

```js
import { toWords } from 'to-words';

toWords(12345, { localeCode: 'en-US' });
// "Twelve Thousand Three Hundred Forty Five"

toWords(452.36, { localeCode: 'en-IN', currency: true });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"
```

**[Try the interactive demo →](https://mastermunj.github.io/to-words/)** — currency, ordinals, gender, and large numbers, live in the browser.

> Need the reverse conversion too? Use the companion package [to-numbers](https://www.npmjs.com/package/to-numbers) to parse spelled-out numbers back into numeric values across the same locales.

## 📑 Table of Contents

- [Use Cases](#-use-cases)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [Migration Guide](#-migration-guide)
- [CLI](#%EF%B8%8F-cli)
- [Framework Integration](#%EF%B8%8F-framework-integration)
- [Numbering Systems](#-numbering-systems)
- [API Reference](#%EF%B8%8F-api-reference)
  - [Constructor Options](#constructor-options)
  - [Class Methods](#class-methods)
  - [Functional Exports](#functional-exports)
  - [Converter Options](#converter-options)
- [Spelled-Out Decimal (Fraction Style)](#-spelled-out-decimal-fraction-style)
- [Bundle Sizes](#-bundle-sizes)
- [Performance](#-performance)
- [Browser Compatibility](#-browser-compatibility)
- [Supported Locales](#%EF%B8%8F-supported-locales)
- [Error Handling](#%EF%B8%8F-error-handling)
- [Support](#-support)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Changelog](#-changelog)
- [License](#-license)

## 💼 Use Cases

- **Invoicing & Billing** — Display amounts in words on invoices, receipts, and financial documents
- **Check Printing** — Banks and financial institutions require amounts in words for check validation; use `decimalStyle: 'fraction'` for legal positional notation ("Forty-Five Hundredths")
- **E-commerce** — Show order totals in words for clarity and accessibility
- **Legal Documents** — Contracts and agreements often require written-out amounts, including spelled-out decimals
- **Educational Apps** — Teach number pronunciation and spelling in different languages
- **Accessibility** — Screen readers benefit from properly formatted number-to-text conversion
- **Localization** — Support global users with region-specific number formatting

## ✨ Features

- **135 Locales** — The most comprehensive locale coverage available
- **BigInt Support** — Exact integer input beyond `Number.MAX_SAFE_INTEGER`, with locale-specific supported ranges
- **Multiple Numbering Systems** — Short scale, Long scale, Indian, and East Asian
- **Currency Formatting** — Locale-specific currency with fractional units
- **Ordinal Numbers** — First, Second, Third, etc.
- **Gender-Aware** — Grammatical gender for locales that require it (Spanish, Portuguese, Arabic, Hebrew, Slavic, and more)
- **Fraction-Style Decimals** — Legal/financial positional decimals (`"Forty-Five Hundredths"`) via `decimalStyle: 'fraction'` across 100 locales
- **Formal Numerals** — Formal/financial Chinese characters (大写/大寫) via `formal: true`
- **Tree-Shakeable** — Import only the locales you need
- **TypeScript Native** — Full type definitions included
- **Multiple Formats** — ESM, CommonJS, and UMD browser bundles
- **Zero Dependencies** — Lightweight and self-contained
- **High Performance** — Up to 4.7M ops/sec (small integers; see benchmark section for full breakdown)
- **Functional API** — `toWords()`, `toOrdinal()`, `toCurrency()` named exports for ergonomic one-liners
- **Auto Locale Detection** — `detectLocale()` reads `navigator.language` or `Intl` in any runtime
- **Typed Locale Resolution** — Generated `LocaleCode` union plus `resolveLocale()` for dynamic BCP 47 input
- **Strict Locale Ranges** — Form-specific ceilings with structured errors and explicit legacy composition mode
- **Capability Manifest** — Query supported locales and derived feature support through `to-words/manifest`
- **CLI** — `npx to-words 12345 --locale en-US` for shell scripts and quick conversions
- **Wide Compatibility** — All modern browsers and Node.js 20+; compatible by architecture with Deno, Bun, and Cloudflare Workers (zero Node.js-specific APIs)

## 🚀 Quick Start

There are three ways to use `to-words`. Pick the one that fits your use case:

**1. Class-based** — best for high-volume workloads where you reuse one instance:

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(12345); // "Twelve Thousand Three Hundred Forty Five"
tw.convert(100, { currency: true }); // "One Hundred Dollars Only"
tw.toOrdinal(3); // "Third"
```

**2. Functional (full bundle)** — one-liners with a `localeCode` option, all 135 locales available:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words';

toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
toCurrency(100, { localeCode: 'en-US' }); // "One Hundred Dollars Only"
toOrdinal(3, { localeCode: 'en-US' }); // "Third"
```

**3. Functional (per-locale import)** — locale baked in, fully tree-shakeable, smallest bundle:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(12345); // "Twelve Thousand Three Hundred Forty Five"
toCurrency(100); // "One Hundred Dollars Only"
toOrdinal(3); // "Third"
```

> **Default locale:** When no `localeCode` is provided, the runtime locale is **auto-detected** via `detectLocale()` and falls back to `en-IN` if it cannot be matched.

## 📦 Installation

> **Runtime requirement:** Node.js `>= 20`.
>
> Moving from another library? See [`MIGRATION.md`](MIGRATION.md).

### npm / yarn / pnpm

```bash
npm install to-words
# or
yarn add to-words
# or
pnpm add to-words
```

### CDN (Browser)

```html
<!-- Full bundle with all locales -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>

<!-- Single locale bundle (smaller, recommended) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
```

## 📖 Usage

### Importing

```js
// Class-based — ESM
import { ToWords } from 'to-words';

// Class-based — CommonJS
const { ToWords } = require('to-words');

// Functional helpers (full bundle) — ESM
import { toWords, toOrdinal, toCurrency, detectLocale } from 'to-words';

// Functional helpers (per-locale, tree-shakeable) — ESM
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

// Per-locale class — ESM
import { ToWords } from 'to-words/en-US';
```

### Basic Conversion

**Class-based:**

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(123); // "One Hundred Twenty Three"
tw.convert(123.45); // "One Hundred Twenty Three Point Four Five"
tw.convert(123.045); // "One Hundred Twenty Three Point Zero Four Five"
```

**Functional (full bundle):**

```js
import { toWords } from 'to-words';

toWords(123, { localeCode: 'en-US' }); // "One Hundred Twenty Three"
toWords(123.45, { localeCode: 'en-US' }); // "One Hundred Twenty Three Point Four Five"
```

**Functional (per-locale):**

```js
import { toWords } from 'to-words/en-US';

toWords(123); // "One Hundred Twenty Three"
toWords(123.45); // "One Hundred Twenty Three Point Four Five"
```

> **Note:** When the fractional part starts with zero, digits after the decimal point are converted individually. For legal/financial positional notation ("Forty-Five Hundredths"), see [`decimalStyle: 'fraction'`](#-spelled-out-decimal-fraction-style).

### BigInt & Large Numbers

Handle numbers beyond JavaScript's safe integer limit without precision loss. Strict mode accepts values through the active locale's published ceiling:

```js
const toWords = new ToWords({ localeCode: 'en-US' });

// Using BigInt
toWords.convert(1000000000000000000n);
// "One Quintillion"

toWords.convert(1000000000000000000000000000000000000000000000000000000000000000n);
// "One Vigintillion"

// Using string for precision
toWords.convert('9007199254740993');
// "Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion
//  Two Hundred Fifty Four Million Seven Hundred Forty Thousand Nine Hundred Ninety Three"

// Legacy recursive scale composition is still available explicitly
toWords.convert('1e100', { rangeMode: 'compose' });
```

### Currency Conversion

**Class-based:**

```js
const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert(452, { currency: true });
// "Four Hundred Fifty Two Rupees Only"

tw.convert(452.36, { currency: true });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"

// Without "Only" suffix
tw.convert(452, { currency: true, doNotAddOnly: true });
// "Four Hundred Fifty Two Rupees"

// Ignore decimal/fractional part
tw.convert(452.36, { currency: true, ignoreDecimal: true });
// "Four Hundred Fifty Two Rupees Only"

// Ignore zero currency
tw.convert(0.36, { currency: true, ignoreZeroCurrency: true });
// "Thirty Six Paise Only"

// Show fractional unit even when zero (string input preserves .00)
tw.convert('452.00', { currency: true, includeZeroFractional: true });
// "Four Hundred Fifty Two Rupees And Zero Paise Only"
```

**Functional — `toCurrency()` shorthand:**

```js
import { toCurrency } from 'to-words';

toCurrency(452, { localeCode: 'en-IN' });
// "Four Hundred Fifty Two Rupees Only"

toCurrency(452.36, { localeCode: 'en-IN' });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"

toCurrency(452, { localeCode: 'en-IN', doNotAddOnly: true });
// "Four Hundred Fifty Two Rupees"
```

**Functional per-locale** (locale baked in, no `localeCode` needed):

```js
import { toCurrency } from 'to-words/en-IN';

toCurrency(452); // "Four Hundred Fifty Two Rupees Only"
toCurrency(452.36); // "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"
```

### Custom Currency

Override currency settings while keeping the locale's language:

```js
const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    currencyOptions: {
      name: 'Euro',
      plural: 'Euros',
      symbol: '€',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '',
      },
    },
  },
});

toWords.convert(100.5);
// "One Hundred Euros And Fifty Cents Only"
```

### 3-Decimal Currencies

Currencies like **OMR** (Omani Rial), **IQD** (Iraqi Dinar), **KWD** (Kuwaiti Dinar), and **BHD** (Bahraini Dinar) use 1000 minor units per major unit (3 decimal places). The `en-OM`, `en-IQ`, and `ar-IQ` locales have `precision: 3` built in:

```js
const toWords = new ToWords({ localeCode: 'en-OM' });

toWords.convert('500.500', { currency: true });
// "Five Hundred Omani Rials And Five Hundred Baisa Only"

toWords.convert('2.010', { currency: true });
// "Two Omani Rials And Ten Baisa Only"

toWords.convert('2.100', { currency: true });
// "Two Omani Rials And One Hundred Baisa Only"
```

For a **custom 3-decimal currency**, pass `precision: 3` in `currencyOptions`:

```js
const toWords = new ToWords({ localeCode: 'en-US' });

toWords.convert('1.500', {
  currency: true,
  currencyOptions: {
    name: 'Kuwaiti Dinar',
    plural: 'Kuwaiti Dinars',
    symbol: 'KWD',
    precision: 3,
    fractionalUnit: { name: 'Fils', plural: 'Fils', symbol: '' },
  },
});
// "One Kuwaiti Dinar And Five Hundred Fils Only"
```

> **Note:** JavaScript `number` literals cannot express trailing zeros (`500.500 === 500.5` in JS). For 3-decimal currencies, always pass the value as a **string** (`'500.500'`) to preserve the intended precision.

### Ordinal Numbers

**Class-based:**

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.toOrdinal(1); // "First"
tw.toOrdinal(21); // "Twenty First"
tw.toOrdinal(100); // "One Hundredth"
```

**Functional — `toOrdinal()` (full bundle):**

```js
import { toOrdinal } from 'to-words';

toOrdinal(1, { localeCode: 'en-US' }); // "First"
toOrdinal(21, { localeCode: 'en-US' }); // "Twenty First"
toOrdinal(100, { localeCode: 'en-US' }); // "One Hundredth"
```

**Functional per-locale:**

```js
import { toOrdinal } from 'to-words/en-US';

toOrdinal(1); // "First"
toOrdinal(21); // "Twenty First"
```

> **Note:** Full ordinal word mappings are available for English, Spanish, French, Portuguese, Turkish, and Dutch locales. Other locales use locale-specific suffix or prefix strategies.

### Gender-Aware Conversion

Many languages use grammatical gender for number words. Pass `gender` via converter options:

```js
// Spanish: masculine (default) vs feminine
const tw = new ToWords({ localeCode: 'es-ES' });
tw.convert(1); // "Uno"
tw.convert(1, { gender: 'feminine' }); // "Una"
tw.convert(21, { gender: 'feminine' }); // "Veintiuna"
tw.convert(200, { gender: 'feminine' }); // "Doscientas"

// Portuguese
const pt = new ToWords({ localeCode: 'pt-BR' });
pt.convert(2, { gender: 'feminine' }); // "Duas"

// Arabic
const ar = new ToWords({ localeCode: 'ar-AE' });
ar.convert(3, { gender: 'feminine' }); // "ثلاث"
```

Gender can also be set via constructor options and overridden per call:

```js
const tw = new ToWords({
  localeCode: 'es-ES',
  converterOptions: { gender: 'feminine' },
});
tw.convert(1); // "Una" (constructor default)
tw.convert(1, { gender: 'masculine' }); // "Uno" (per-call override)
```

> **Supported locales:** Spanish (7), Portuguese (4), Arabic (4), Hebrew (2), Russian, Ukrainian, Polish, Czech, Croatian, Slovak, Serbian, Belarusian, Bulgarian, Catalan, Romanian, Latvian, Lithuanian, and Slovenian.

### UseAnd Option

Insert the locale's "And" word before the last two digits:

```js
const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(123); // "One Hundred Twenty Three"
tw.convert(123, { useAnd: true }); // "One Hundred And Twenty Three"
tw.convert(1023, { useAnd: true }); // "One Thousand And Twenty Three"

// Works with currency too
tw.convert(123, { currency: true, useAnd: true });
// "One Hundred And Twenty Three Dollars Only"
```

> **Note:** `useAnd` is a no-op for locales that already use a split word (e.g., Portuguese uses "E" by default) and for locales where the connector token is empty (e.g., ja-JP, zh-CN, zh-TW, yue-HK).

### Formal Chinese Numerals

Use formal/financial characters (大写/大寫) for Chinese locales:

```js
// Simplified Chinese
const cn = new ToWords({ localeCode: 'zh-CN' });
cn.convert(123); // "百 二十 三"
cn.convert(123, { formal: true }); // "佰 贰拾 叁"
cn.convert(100, { currency: true, formal: true });
// "佰 圆 整"

// Traditional Chinese
const tw = new ToWords({ localeCode: 'zh-TW' });
tw.convert(123, { formal: true }); // "佰 貳拾 參"
tw.toOrdinal(5, { formal: true }); // "第伍"
```

### Tree-Shakeable Imports

Every locale entry point (`to-words/<locale>`) exports four things:

| Export       | Type     | Description                                   |
| ------------ | -------- | --------------------------------------------- |
| `ToWords`    | class    | Full class API pre-configured for this locale |
| `toWords`    | function | Convert number → words                        |
| `toOrdinal`  | function | Convert number → ordinal words                |
| `toCurrency` | function | Convert number → currency words               |

```js
// Class-based (locale pre-configured, no localeCode needed)
import { ToWords } from 'to-words/en-US';
const tw = new ToWords();
tw.convert(12345); // "Twelve Thousand Three Hundred Forty Five"

// Functional helpers (locale baked in — smallest possible import)
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';
toWords(12345); // "Twelve Thousand Three Hundred Forty Five"
toOrdinal(3); // "Third"
toCurrency(100); // "One Hundred Dollars Only"
```

> Individual imports are substantially smaller than the full bundle. See the measured [bundle sizes](#-bundle-sizes).

### Locale Capability Manifest

Feature discovery is available through an opt-in entry point:

```js
import { getLocaleCapabilities, getLocaleMetadata, isSupportedLocale, SUPPORTED_LOCALES } from 'to-words/manifest';

isSupportedLocale('en-US'); // true
getLocaleCapabilities('zh-CN')?.formal; // true
getLocaleMetadata('hi-IN')?.numbering.grouping; // [3, 2]
getLocaleMetadata('en-US')?.range.maximumSupported.cardinal; // exact inclusive ceiling
SUPPORTED_LOCALES.length; // 135
```

The manifest contains compact generated capability, numbering-system, and range metadata without loading locale conversion tables. Custom locale classes passed to the full `ToWords` class or `ToWordsCore` are validated automatically on first use; authors can also call `assertLocaleConfig()` from `to-words/locale-contract` in CI. Per-locale entry points use smaller, prevalidated built-in tables. See the [generated capability matrix](https://mastermunj.github.io/to-words/guide/locale-capabilities) and [locale quality gates](https://mastermunj.github.io/to-words/guide/locale-quality).

### Browser Usage (UMD)

```html
<!-- Single locale (recommended for smaller bundles) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  // ToWords is pre-configured for en-US
  const toWords = new ToWords();
  console.log(toWords.convert(12345));
  // "Twelve Thousand Three Hundred Forty Five"
</script>

<!-- Full bundle with all locales -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>
<script>
  // Specify locale when using full bundle
  const toWords = new ToWords({ localeCode: 'fr-FR' });
  console.log(toWords.convert(12345));
  // "Douze Mille Trois Cent Quarante-Cinq"
</script>
```

### Functional API

Two flavours depending on whether you need tree-shaking:

**Full bundle** — `localeCode` is optional; omit it to use the auto-detected runtime locale:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words';

// Explicit locale
toWords(12345, { localeCode: 'en-US' });
// "Twelve Thousand Three Hundred Forty Five"

toOrdinal(21, { localeCode: 'en-US' });
// "Twenty First"

toCurrency(1234.56, { localeCode: 'en-IN' });
// "One Thousand Two Hundred Thirty Four Rupees And Fifty Six Paise Only"

// No localeCode — uses detectLocale() automatically
toWords(12345);
// result depends on the runtime locale (e.g. 'en-US' → "Twelve Thousand Three Hundred Forty Five")

toCurrency(1234.56, { doNotAddOnly: true });
// currency in the runtime locale, without "Only" suffix
```

**Per-locale import** — locale baked in, no `localeCode` argument at all, fully tree-shakeable:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(12345); // "Twelve Thousand Three Hundred Forty Five"
toOrdinal(21); // "Twenty First"
toCurrency(1234.56); // "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

> **Performance note:** The functional API caches one `ToWords` instance per locale. Repeated calls for the same locale reuse the cached instance.

### Auto-Detect Locale

`detectLocale()` is automatically used by `new ToWords()`, `toWords()`, `toOrdinal()`, and `toCurrency()` when no `localeCode` is provided — so in most cases you don't need to call it directly. `resolveLocale()` applies the same matching rules to a dynamic string without reading the environment.

```js
import { detectLocale, resolveLocale, toWords, ToWords } from 'to-words';

// Used implicitly — no localeCode needed
toWords(1000);
// On a browser with navigator.language = 'fr-FR': "Mille"
// In a Node.js process with fr-FR locale:         "Mille"
// Fallback when nothing can be detected:           "One Thousand" (en-IN)

// Used explicitly — read once, reuse across many calls
const locale = detectLocale('en-US'); // custom fallback if detection misses
const tw = new ToWords({ localeCode: locale });
tw.convert(1000);

const requestLocale = resolveLocale('EN_us'); // 'en-US'
```

Locale matching canonicalises BCP 47 casing and aliases, ignores script subtags when matching a supported language-region pair, and uses deterministic defaults for language-only values (`en` → `en-US`, `es` → `es-ES`, `pt` → `pt-BR`). In SSR and APIs, pass the request locale explicitly; `setLocaleDetector()` changes process-wide state and is intended for tests or application-wide configuration.

> Reads `navigator.language` in browsers, `Intl.DateTimeFormat().resolvedOptions().locale` in Node.js (and compatible runtimes). Falls back to `'en-IN'` (or your custom fallback) if the detected value cannot be matched to a supported locale.

## 🔄 Migration Guide

Migrating from `number-to-words`, `written-number`, `num-words`, or `n2words`? Here's how `to-words` compares:

| Capability                 | **to-words**    | number-to-words | written-number | num-words      | n2words       |
| -------------------------- | --------------- | --------------- | -------------- | -------------- | ------------- |
| Locale / language coverage | **135 locales** | English-focused | Multi-language | Indian English | 70+ languages |
| TypeScript declarations    | ✅              | ❌              | ❌             | ✅             | ✅            |
| ESM-ready package          | ✅              | ❌              | ❌             | ❌             | ✅            |
| Package `exports` map      | ✅              | ❌              | ❌             | ❌             | ✅            |
| BigInt support             | ✅              | ❌              | ❌             | ❌             | ✅            |
| Currency conversion mode   | ✅              | ❌              | ❌             | ❌             | ✅            |
| Ordinal conversion         | ✅              | ✅              | ❌             | ❌             | ✅            |
| Subpath locale imports     | ✅              | ❌              | ❌             | ❌             | ✅            |

- See [`MIGRATION.md`](MIGRATION.md) for side-by-side API mapping and migration recipes.
- Includes package comparison, behavior notes, and a regression checklist.
- Deeper breakdown: docs [comparison page](https://mastermunj.github.io/to-words/compare/number-to-words-alternatives).

## 🖥️ CLI

Run one-off conversions from the command line without installing:

```bash
npx to-words 12345
# Twelve Thousand Three Hundred Forty Five

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

Once installed globally (`npm i -g to-words`), the `to-words` command is available directly.

## ⚛️ Framework Integration

### React

```tsx
// Change the locale import to match your users' region (e.g. 'to-words/en-GB' for UK)
import { ToWords } from 'to-words/en-US';

const toWords = new ToWords();

function PriceInWords({ amount }: { amount: number }) {
  const words = toWords.convert(amount, { currency: true });
  return <span className="price-words">{words}</span>;
}

// Usage: <PriceInWords amount={1234.56} />
// Renders: "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

### Vue 3

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { ToWords } from 'to-words/en-US';

const props = defineProps<{ amount: number }>();
const toWords = new ToWords();

const words = computed(() => toWords.convert(props.amount, { currency: true }));
</script>

<template>
  <span class="price-words">{{ words }}</span>
</template>
```

### Angular

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { ToWords } from 'to-words/en-US';

@Pipe({ name: 'toWords', standalone: true })
export class ToWordsPipe implements PipeTransform {
  private toWords = new ToWords();

  transform(value: number, currency = false): string {
    return this.toWords.convert(value, { currency });
  }
}

// Usage: {{ 1234.56 | toWords:true }}
```

### Svelte

```svelte
<script lang="ts">
  import { ToWords } from 'to-words/en-US';

  export let amount: number;

  const toWords = new ToWords();
  $: words = toWords.convert(amount, { currency: true });
</script>

<span class="price-words">{words}</span>
```

### Next.js

```tsx
// Server Component (App Router) — locale from request headers or user profile
import { toWords } from 'to-words';

type Props = { amount: number; locale: string };

export default function AmountInWords({ amount, locale }: Props) {
  return <p>{toWords(amount, { localeCode: locale, currency: true })}</p>;
}
```

```tsx
// Client Component — dynamic locale switching
'use client';

import { useState } from 'react';
import { toCurrency, detectLocale } from 'to-words';

export function CurrencyDisplay({ amount }: { amount: number }) {
  const [locale, setLocale] = useState(detectLocale('en-US'));
  return (
    <div>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="fr-FR">French</option>
        <option value="hi-IN">Hindi</option>
        <option value="ar-AE">Arabic</option>
      </select>
      <p>{toCurrency(amount, { localeCode: locale })}</p>
    </div>
  );
}
```

### Node.js / Express

```ts
import express from 'express';
import { toWords, toCurrency } from 'to-words';

const app = express();

app.get('/convert', (req, res) => {
  const number = String(req.query.number ?? '');
  const locale = String(req.query.locale ?? req.headers['accept-language']?.split(',')[0] ?? 'en-US');
  const currency = req.query.currency === 'true';

  try {
    const result = currency ? toCurrency(number, { localeCode: locale }) : toWords(number, { localeCode: locale });
    res.json({ result, locale });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
```

## 🌍 Numbering Systems

Different regions use different numbering systems. This library supports all major systems:

### Short Scale (Western)

Used in: USA, UK, Canada, Australia, and most English-speaking countries.

| Number | Name         |
| ------ | ------------ |
| 10^6   | Million      |
| 10^9   | Billion      |
| 10^12  | Trillion     |
| 10^15  | Quadrillion  |
| ...    | ...          |
| 10^63  | Vigintillion |

```js
const toWords = new ToWords({ localeCode: 'en-US' });
toWords.convert(1000000000000000000n);
// "One Quintillion"
```

### Long Scale (European)

Used in: Germany, France, and many European countries.

| Number | German    | French   |
| ------ | --------- | -------- |
| 10^6   | Million   | Million  |
| 10^9   | Milliarde | Milliard |
| 10^12  | Billion   | Billion  |
| 10^15  | Billiarde | Billiard |

```js
const toWords = new ToWords({ localeCode: 'de-DE' });
toWords.convert(1000000000);
// "Eins Milliarde"
```

### Indian System

Used in: India, Bangladesh, Nepal, Pakistan.

| Number | Name   |
| ------ | ------ |
| 10^5   | Lakh   |
| 10^7   | Crore  |
| 10^9   | Arab   |
| 10^11  | Kharab |
| 10^13  | Neel   |
| 10^15  | Padma  |
| 10^17  | Shankh |

```js
const toWords = new ToWords({ localeCode: 'en-IN' });
toWords.convert(100000000000000000n);
// "One Shankh"

const toWordsHindi = new ToWords({ localeCode: 'hi-IN' });
toWordsHindi.convert(100000000000000000n);
// "एक शंख"
```

### East Asian System

Used in: Japan, China, Korea.

| Number | Character     |
| ------ | ------------- |
| 10^4   | 万 (Man/Wan)  |
| 10^8   | 億 (Oku/Yi)   |
| 10^12  | 兆 (Chō/Zhao) |
| 10^16  | 京 (Kei/Jing) |
| 10^20  | 垓 (Gai)      |

```js
const toWords = new ToWords({ localeCode: 'ja-JP' });
toWords.convert(100000000);
// "一 億"
```

## ⚙️ API Reference

### Constructor Options

```typescript
interface BundledToWordsOptions {
  localeCode?: LocaleCode; // Default: auto-detected, then falls back to 'en-IN'
  converterOptions?: {
    currency?: boolean; // Default: false
    ignoreDecimal?: boolean; // Default: false
    ignoreZeroCurrency?: boolean; // Default: false
    doNotAddOnly?: boolean; // Default: false
    includeZeroFractional?: boolean; // Default: false
    rangeMode?: 'strict' | 'compose'; // Default: 'strict'
    currencyOptions?: {
      name: string;
      plural: string;
      symbol: string;
      precision?: number; // decimal places for fractional unit; defaults to 2
      fractionalUnit: {
        name: string;
        plural: string;
        symbol: string;
      };
    };
  };
}
```

### Class Methods

#### `convert(number, options?)`

Converts a number to words.

- **number**: `number | bigint | string` — The number to convert
- **options**: `ConverterOptions` — Override instance options
- **returns**: `string` — The number in words

#### `toOrdinal(number, options?)`

Converts a number to ordinal words.

- **number**: `number | bigint | string` — The number to convert (must be a non-negative integer value)
- **options**: `OrdinalOptions` — Optional settings (`{ formal?: boolean; gender?: 'masculine' | 'feminine' }`)
- **returns**: `string` — The ordinal in words (e.g., "First", "Twenty Third")

### Functional Exports

The three conversion helpers (`toWords`, `toOrdinal`, `toCurrency`) are available from the full bundle (`to-words`) and from every per-locale entry point (`to-words/<locale>`). `detectLocale` is only available from the full bundle. When importing from `to-words/<locale>`, the locale is already baked in and `localeCode` is not accepted.

#### `toWords(number, options?)`

Converts a number to words.

- **number**: `number | bigint | string` — The number to convert
- **options** _(full bundle)_: `ConverterOptions & { localeCode?: LocaleCode }` — When `localeCode` is omitted, `detectLocale()` is called automatically
- **options** _(per-locale)_: `ConverterOptions`
- **returns**: `string`

```js
import { toWords } from 'to-words';
toWords(12345, { localeCode: 'en-US' }); // explicit locale
toWords(12345); // auto-detects runtime locale

import { toWords } from 'to-words/en-US';
toWords(12345); // locale baked in, no detection needed
```

#### `toOrdinal(number, options?)`

Converts a number to ordinal words.

- **number**: `number | bigint | string` — Must represent a non-negative integer
- **options** _(full bundle)_: `OrdinalOptions & { localeCode?: LocaleCode }` — When `localeCode` is omitted, `detectLocale()` is called automatically
- **options** _(per-locale)_: `OrdinalOptions`
- **returns**: `string`

```js
import { toOrdinal } from 'to-words';
toOrdinal(21, { localeCode: 'en-US' }); // explicit locale
toOrdinal(21); // auto-detects runtime locale

import { toOrdinal } from 'to-words/en-US';
toOrdinal(21); // locale baked in
```

#### `toCurrency(number, options?)`

Shorthand for converting a number to currency words. Equivalent to `toWords(number, { currency: true, ...options })`.

- **number**: `number | bigint | string`
- **options** _(full bundle)_: `ConverterOptions & { localeCode?: LocaleCode }` — When `localeCode` is omitted, `detectLocale()` is called automatically
- **options** _(per-locale)_: `ConverterOptions`
- **returns**: `string`

```js
import { toCurrency } from 'to-words';
toCurrency(1234.56, { localeCode: 'en-US' }); // explicit locale
toCurrency(1234.56); // auto-detects runtime locale

import { toCurrency } from 'to-words/en-US';
toCurrency(1234.56); // locale baked in
```

#### `detectLocale(fallback?)`

Reads the current runtime locale.

- In **browsers**: reads `navigator.language`
- In **Node.js** (and compatible runtimes): reads `Intl.DateTimeFormat().resolvedOptions().locale`
- Normalises BCP 47 tags (e.g. `zh-Hant-TW` → `zh-TW`) and falls back to a language-prefix match

- **fallback** _(optional)_: `LocaleCode` — Returned when no supported locale can be matched. Default: `'en-IN'`
- **returns**: `LocaleCode` — A supported locale code

Matching canonicalises BCP 47 casing and aliases. Language-only or unknown-region inputs use explicit defaults rather than registry order, including `en` → `en-US`, `es` → `es-ES`, `pt` → `pt-BR`, and `sw` → `sw-KE`.

```js
import { detectLocale } from 'to-words';

detectLocale(); // e.g. 'en-US', 'fr-FR', 'ja-JP'
detectLocale('en-GB'); // custom fallback if detection fails
```

> `detectLocale` is only available from the full bundle (`to-words`), not from per-locale entry points.

#### `resolveLocale(input)`

Canonicalises and matches a dynamic BCP 47 string without reading the environment. It returns `LocaleCode | undefined`, making it the safe bridge between user/request data and the typed constructor/helpers.

```ts
import { resolveLocale, ToWords } from 'to-words';

const localeCode = resolveLocale('zh-Hant-TW'); // 'zh-TW'
if (localeCode) new ToWords({ localeCode });
```

`setLocaleDetector()` changes a process-wide detector and is intended for tests or application-wide configuration. Do not change it per SSR/API request; pass `{ localeCode }` explicitly instead.

### Utility Methods

- `toFixed(number, precision?)` returns a number rounded with decimal arithmetic (`toFixed(1.005, 2) === 1.01`).
- `isFloat(number)` returns whether a valid `number | bigint | string` has a non-zero fractional component.
- `isNumberZero(number)` returns `true` only for exact numeric zero.
- `getLocale().config` is available for inspection and is recursively frozen after initialization. Define custom locale data before passing its class to `setLocale()`.
- `resolveLocale(input)` returns a supported canonical `LocaleCode` or `undefined` without reading runtime globals.

`LOCALES`, `DefaultToWordsOptions`, and `DefaultConverterOptions` are frozen. Constructor options, including nested currency data, are snapshotted when an instance is created.

### Converter Options

| Option                  | Type    | Default    | Description                                                                                                                                                                                                                      |
| ----------------------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currency`              | boolean | false      | Convert as currency with locale-specific formatting                                                                                                                                                                              |
| `ignoreDecimal`         | boolean | false      | Ignore fractional part when converting                                                                                                                                                                                           |
| `ignoreZeroCurrency`    | boolean | false      | Skip zero main currency (e.g., show only "Thirty Six Paise")                                                                                                                                                                     |
| `doNotAddOnly`          | boolean | false      | Omit "Only" suffix in currency mode                                                                                                                                                                                              |
| `includeZeroFractional` | boolean | false      | When input is a string like `"123.00"`, include "And Zero Paise" even though the decimal is zero                                                                                                                                 |
| `currencyOptions`       | object  | undefined  | Override locale's default currency settings                                                                                                                                                                                      |
| `gender`                | string  | undefined  | Grammatical gender: `'masculine'` or `'feminine'`. Applies to locales with gendered number words                                                                                                                                 |
| `useAnd`                | boolean | undefined  | Insert the locale connector before the last two digits (e.g., "One Hundred **And** Twenty Three"). No-op when locale already defines a split word or has an empty connector token                                                |
| `formal`                | boolean | undefined  | Use formal/financial characters (currently supported for zh-CN and zh-TW)                                                                                                                                                        |
| `decimalStyle`          | string  | `'digit'`  | Decimal rendering style: `'digit'` (default — digit-by-digit after the point) or `'fraction'` (positional/legal style — "Forty-Five Hundredths"). See [Fraction Style](#-spelled-out-decimal-fraction-style) for locale support. |
| `rangeMode`             | string  | `'strict'` | `'strict'` enforces the locale's form-specific ceiling; `'compose'` opts into legacy recursive scale composition.                                                                                                                |

### Common Options Example

```js
const toWords = new ToWords({ localeCode: 'en-US' });

toWords.convert(1234.56, {
  currency: true,
  ignoreDecimal: false,
  doNotAddOnly: true,
});
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents"
```

## 🔢 Spelled-Out Decimal (Fraction Style)

By default, decimals are rendered digit-by-digit after the point word:

```js
const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(123.45); // "One Hundred Twenty Three Point Four Five"
```

Pass `decimalStyle: 'fraction'` to use the positional/legal style used in financial
and legal writing — the fractional part is converted as a whole number followed by
its place-value denominator:

```js
tw.convert(123.45, { decimalStyle: 'fraction' });
// "One Hundred Twenty Three And Forty Five Hundredths"

tw.convert(1.1, { decimalStyle: 'fraction' }); // "One And One Tenth"
tw.convert(0.05, { decimalStyle: 'fraction' }); // "Zero And Five Hundredths"
tw.convert(0.001, { decimalStyle: 'fraction' }); // "Zero And One Thousandth"
```

The denominator is **singular when the fractional value equals 1** and **plural otherwise**.
Russian, Ukrainian, and Belarusian follow the Slavic rule (`n % 10 === 1 && n % 100 !== 11`):

```js
const ru = new ToWords({ localeCode: 'ru-RU' });
ru.convert(1.21, { decimalStyle: 'fraction' }); // "...Двадцать Один Сотая"   (singular)
ru.convert(1.11, { decimalStyle: 'fraction' }); // "...Одиннадцать Сотых"     (plural)
```

**Fallback:** if the locale has no denominator word for the given decimal length (e.g., 7+
digits), it automatically falls back to the default digit-by-digit style — no error thrown.

### Supported denominator lengths

| Decimal places | English denominator                      | French denominator             | German denominator |
| -------------- | ---------------------------------------- | ------------------------------ | ------------------ |
| 1              | Tenth / Tenths                           | Dixième / Dixièmes             | Zehntel            |
| 2              | Hundredth / Hundredths                   | Centième / Centièmes           | Hundertstel        |
| 3              | Thousandth / Thousandths                 | Millième / Millièmes           | Tausendstel        |
| 4              | Ten-Thousandth / Ten-Thousandths         | Dix-Millième / Dix-Millièmes   | Zehntausendstel    |
| 5              | Hundred-Thousandth / Hundred-Thousandths | Cent-Millième / Cent-Millièmes | Hunderttausendstel |
| 6              | Millionth / Millionths                   | Millionième / Millionièmes     | Millionstel        |

### Locale support (100 locales)

| Language group                         | Locales                                                                                                                                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **English**                            | en-AE, en-AU, en-BD, en-CA, en-GB, en-GH, en-HK, en-IE, en-IN, en-IQ, en-JM, en-KE, en-LK, en-MA, en-MM, en-MU, en-MY, en-NG, en-NP, en-NZ, en-OM, en-PH, en-PK, en-SA, en-SG, en-TT, en-TZ, en-UG, en-US, en-ZA, en-ZW |
| **German**                             | de-AT, de-CH, de-DE                                                                                                                                                                                                     |
| **French**                             | fr-BE, fr-CA, fr-CH, fr-CI, fr-CM, fr-DZ, fr-FR, fr-MA, fr-MG, fr-SA                                                                                                                                                    |
| **Spanish**                            | es-AR, es-CL, es-CO, es-ES, es-MX, es-PE, es-US, es-VE                                                                                                                                                                  |
| **Portuguese**                         | pt-AO, pt-BR, pt-MZ, pt-PT                                                                                                                                                                                              |
| **Italian**                            | it-IT                                                                                                                                                                                                                   |
| **Dutch**                              | nl-NL, nl-SR                                                                                                                                                                                                            |
| **Scandinavian**                       | da-DK, nb-NO, sv-SE                                                                                                                                                                                                     |
| **Other European**                     | bg-BG, ca-ES, cs-CZ, el-GR, hr-HR, hu-HU, lv-LV, pl-PL, ro-RO, sk-SK, sl-SI, sq-AL, sr-RS                                                                                                                               |
| **Slavic (with Slavic singular rule)** | be-BY, ru-RU, uk-UA                                                                                                                                                                                                     |
| **Indic**                              | as-IN, bn-BD, bn-IN, gu-IN, hi-IN, kn-IN, ml-IN, mr-IN, ne-NP, or-IN, pa-IN, ta-IN, te-IN                                                                                                                               |
| **Others**                             | af-ZA, fa-IR, he-IL, id-ID, ka-GE, ms-MY, ms-SG, ur-PK, vi-VN                                                                                                                                                           |

> Locales not listed above (Arabic, East Asian, Turkic, etc.) do not yet support
> `decimalStyle: 'fraction'` — passing the option silently falls back to digit-by-digit.

## 📏 Bundle Sizes

| Import Method             | Raw      | Gzip     |
| ------------------------- | -------- | -------- |
| Full bundle (all locales) | 703 KiB  | 70.4 KiB |
| Single locale (en-US)     | 19.5 KiB | 5.5 KiB  |
| Single locale (en-IN)     | 17.2 KiB | 5.3 KiB  |

> **Tip:** Use tree-shakeable imports or single-locale UMD bundles for the smallest bundle size.

The build enforces gzip budgets for the full bundle, average locale, and largest locale. Run `npm run size:check` to inspect the current measurements locally.

## ⚡ Performance

Benchmarked on Apple M2 (Node.js 23):

| Operation                  | Throughput    |
| -------------------------- | ------------- |
| Small integers (42)        | ~4.7M ops/sec |
| Medium integers (12,345)   | ~2.2M ops/sec |
| Large integers (15 digits) | ~700K ops/sec |
| Currency conversion        | ~1M ops/sec   |
| BigInt (30+ digits)        | ~225K ops/sec |

Run benchmarks locally:

```bash
npm run bench
```

## 🌐 Browser Compatibility

| Browser | Version |
| ------- | ------- |
| Chrome  | 67+     |
| Firefox | 68+     |
| Safari  | 14+     |
| Edge    | 79+     |
| Opera   | 54+     |

**BigInt Support:** BigInt is required for full functionality. Internet Explorer is not supported.

### Runtime Compatibility

| Runtime            | Support                       |
| ------------------ | ----------------------------- |
| Node.js            | 20+ (CI-verified)             |
| Deno               | ✅ compatible by architecture |
| Bun                | ✅ compatible by architecture |
| Cloudflare Workers | ✅ compatible by architecture |

Deno, Bun, and Cloudflare Workers are compatible by architecture: the library uses only standard ECMAScript features (BigInt, Intl, Map, `globalThis`) with zero Node.js-specific APIs. Only Node.js is covered by CI.

## 🗺️ Supported Locales

All 135 locales with their core setup are listed below. Numbering-system, grouping, and named-range metadata is maintained in the [generated capability matrix](https://mastermunj.github.io/to-words/guide/locale-capabilities) rather than duplicated here.

| Locale | Language        | Country             | Currency      | Ordinal |
| ------ | --------------- | ------------------- | ------------- | ------- |
| af-ZA  | Afrikaans       | South Africa        | Rand          | ✓       |
| am-ET  | Amharic         | Ethiopia            | ብር            | ✓       |
| ar-AE  | Arabic          | UAE                 | درهم          | ✓       |
| ar-DZ  | Arabic          | Algeria             | دينار         | ✓       |
| ar-EG  | Arabic          | Egypt               | جنيه          | ✓       |
| ar-IQ  | Arabic          | Iraq                | دينار         | ✓       |
| ar-LB  | Arabic          | Lebanon             | ليرة          | ✓       |
| ar-MA  | Arabic          | Morocco             | درهم          | ✓       |
| ar-SA  | Arabic          | Saudi Arabia        | ريال          | ✓       |
| ar-SD  | Arabic          | Sudan               | جنيه          | ✓       |
| ar-YE  | Arabic          | Yemen               | ريال          | ✓       |
| as-IN  | Assamese        | India               | টকা           | ✓       |
| az-AZ  | Azerbaijani     | Azerbaijan          | Manat         | ✓       |
| be-BY  | Belarusian      | Belarus             | Рубель        | ✓       |
| bg-BG  | Bulgarian       | Bulgaria            | Лев           | ✓       |
| bn-BD  | Bengali         | Bangladesh          | টাকা          | ✓       |
| bn-IN  | Bengali         | India               | টাকা          | ✓       |
| ca-ES  | Catalan         | Spain               | Euro          | ✓       |
| cs-CZ  | Czech           | Czech Republic      | Koruna        | ✓       |
| da-DK  | Danish          | Denmark             | Krone         | ✓       |
| de-AT  | German          | Austria             | Euro          | ✓       |
| de-CH  | German          | Switzerland         | Franken       | ✓       |
| de-DE  | German          | Germany             | Euro          | ✓       |
| el-GR  | Greek           | Greece              | Ευρώ          | ✓       |
| en-AE  | English         | UAE                 | Dirham        | ✓       |
| en-AU  | English         | Australia           | Dollar        | ✓       |
| en-BD  | English         | Bangladesh          | Taka          | ✓       |
| en-CA  | English         | Canada              | Dollar        | ✓       |
| en-GB  | English         | United Kingdom      | Pound         | ✓       |
| en-GH  | English         | Ghana               | Cedi          | ✓       |
| en-HK  | English         | Hong Kong           | Dollar        | ✓       |
| en-IE  | English         | Ireland             | Euro          | ✓       |
| en-IN  | English         | India               | Rupee         | ✓       |
| en-IQ  | English         | Iraq                | Dinar         | ✓       |
| en-JM  | English         | Jamaica             | Dollar        | ✓       |
| en-KE  | English         | Kenya               | Shilling      | ✓       |
| en-LK  | English         | Sri Lanka           | Rupee         | ✓       |
| en-MA  | English         | Morocco             | Dirham        | ✓       |
| en-MM  | English         | Myanmar             | Kyat          | ✓       |
| en-MU  | English         | Mauritius           | Rupee         | ✓       |
| en-MY  | English         | Malaysia            | Ringgit       | ✓       |
| en-NG  | English         | Nigeria             | Naira         | ✓       |
| en-NP  | English         | Nepal               | Rupee         | ✓       |
| en-NZ  | English         | New Zealand         | Dollar        | ✓       |
| en-OM  | English         | Oman                | Rial          | ✓       |
| en-PH  | English         | Philippines         | Peso          | ✓       |
| en-PK  | English         | Pakistan            | Rupee         | ✓       |
| en-SA  | English         | Saudi Arabia        | Riyal         | ✓       |
| en-SG  | English         | Singapore           | Dollar        | ✓       |
| en-TT  | English         | Trinidad and Tobago | Dollar        | ✓       |
| en-TZ  | English         | Tanzania            | Shilling      | ✓       |
| en-UG  | English         | Uganda              | Shilling      | ✓       |
| en-US  | English         | USA                 | Dollar        | ✓       |
| en-ZA  | English         | South Africa        | Rand          | ✓       |
| en-ZW  | English         | Zimbabwe            | Zimbabwe Gold | ✓       |
| es-AR  | Spanish         | Argentina           | Peso          | ✓       |
| es-CL  | Spanish         | Chile               | Peso          | ✓       |
| es-CO  | Spanish         | Colombia            | Peso          | ✓       |
| es-ES  | Spanish         | Spain               | Euro          | ✓       |
| es-MX  | Spanish         | Mexico              | Peso          | ✓       |
| es-PE  | Spanish         | Peru                | Sol           | ✓       |
| es-US  | Spanish         | USA                 | Dólar         | ✓       |
| es-VE  | Spanish         | Venezuela           | Bolívar       | ✓       |
| et-EE  | Estonian        | Estonia             | Euro          | ✓       |
| fa-IR  | Persian         | Iran                | تومان         | ✓       |
| fi-FI  | Finnish         | Finland             | Euro          | ✓       |
| fil-PH | Filipino        | Philippines         | Piso          | ✓       |
| fr-BE  | French          | Belgium             | Euro          | ✓       |
| fr-CA  | French          | Canada              | Dollar        | ✓       |
| fr-CH  | French          | Switzerland         | Franc         | ✓       |
| fr-CI  | French          | Côte d'Ivoire       | Franc CFA     | ✓       |
| fr-CM  | French          | Cameroon            | Franc CFA     | ✓       |
| fr-DZ  | French          | Algeria             | Dinar         | ✓       |
| fr-FR  | French          | France              | Euro          | ✓       |
| fr-MA  | French          | Morocco             | Dirham        | ✓       |
| fr-MG  | French          | Madagascar          | Ariary        | ✓       |
| fr-SA  | French          | Saudi Arabia        | Riyal         | ✓       |
| gu-IN  | Gujarati        | India               | રૂપિયો        | ✓       |
| ha-NG  | Hausa           | Nigeria             | Naira         | ✓       |
| hbo-IL | Biblical Hebrew | Israel              | שקל           | ✓       |
| he-IL  | Hebrew          | Israel              | שקל           | ✓       |
| hi-IN  | Hindi           | India               | रुपया         | ✓       |
| hr-HR  | Croatian        | Croatia             | Euro          | ✓       |
| hu-HU  | Hungarian       | Hungary             | Forint        | ✓       |
| id-ID  | Indonesian      | Indonesia           | Rupiah        | ✓       |
| ig-NG  | Igbo            | Nigeria             | Naira         | ✓       |
| is-IS  | Icelandic       | Iceland             | Króna         | ✓       |
| it-IT  | Italian         | Italy               | Euro          | ✓       |
| ja-JP  | Japanese        | Japan               | 円            | ✓       |
| jv-ID  | Javanese        | Indonesia           | Rupiah        | ✓       |
| ka-GE  | Georgian        | Georgia             | ლარი          | ✓       |
| km-KH  | Khmer           | Cambodia            | រៀល           | ✓       |
| kn-IN  | Kannada         | India               | ರೂಪಾಯಿ        | ✓       |
| ko-KR  | Korean          | South Korea         | 원            | ✓       |
| lt-LT  | Lithuanian      | Lithuania           | Euras         | ✓       |
| lv-LV  | Latvian         | Latvia              | Eiro          | ✓       |
| ml-IN  | Malayalam       | India               | രൂപ           | ✓       |
| mr-IN  | Marathi         | India               | रुपया         | ✓       |
| ms-MY  | Malay           | Malaysia            | Ringgit       | ✓       |
| ms-SG  | Malay           | Singapore           | Dolar         | ✓       |
| my-MM  | Burmese         | Myanmar             | ကျပ်          | ✓       |
| nb-NO  | Norwegian       | Norway              | Krone         | ✓       |
| nl-NL  | Dutch           | Netherlands         | Euro          | ✓       |
| nl-SR  | Dutch           | Suriname            | Dollar        | ✓       |
| ne-NP  | Nepali          | Nepal               | रुपैयाँ       | ✓       |
| or-IN  | Odia            | India               | ଟଙ୍କା         | ✓       |
| pa-IN  | Punjabi         | India               | ਰੁਪਇਆ         | ✓       |
| pl-PL  | Polish          | Poland              | Złoty         | ✓       |
| pt-AO  | Portuguese      | Angola              | Kwanza        | ✓       |
| pt-BR  | Portuguese      | Brazil              | Real          | ✓       |
| pt-MZ  | Portuguese      | Mozambique          | Metical       | ✓       |
| pt-PT  | Portuguese      | Portugal            | Euro          | ✓       |
| ro-RO  | Romanian        | Romania             | Leu           | ✓       |
| ru-RU  | Russian         | Russia              | Рубль         | ✓       |
| si-LK  | Sinhala         | Sri Lanka           | රුපියල        | ✓       |
| sk-SK  | Slovak          | Slovakia            | Euro          | ✓       |
| sl-SI  | Slovenian       | Slovenia            | Euro          | ✓       |
| sq-AL  | Albanian        | Albania             | Lek           | ✓       |
| sr-RS  | Serbian         | Serbia              | Dinar         | ✓       |
| sv-SE  | Swedish         | Sweden              | Krona         | ✓       |
| sw-KE  | Swahili         | Kenya               | Shilingi      | ✓       |
| sw-TZ  | Swahili         | Tanzania            | Shilingi      | ✓       |
| ta-IN  | Tamil           | India               | ரூபாய்        | ✓       |
| te-IN  | Telugu          | India               | రూపాయి        | ✓       |
| th-TH  | Thai            | Thailand            | บาท           | ✓       |
| tr-TR  | Turkish         | Turkey              | Lira          | ✓       |
| uk-UA  | Ukrainian       | Ukraine             | Гривня        | ✓       |
| ur-PK  | Urdu            | Pakistan            | روپیہ         | ✓       |
| uz-UZ  | Uzbek           | Uzbekistan          | So'm          | ✓       |
| vi-VN  | Vietnamese      | Vietnam             | Đồng          | ✓       |
| yo-NG  | Yoruba          | Nigeria             | Naira         | ✓       |
| yue-HK | Cantonese       | Hong Kong           | 元            | ✓       |
| zh-CN  | Chinese         | China               | 元            | ✓       |
| zh-TW  | Chinese         | Taiwan              | 元            | ✓       |
| zu-ZA  | Zulu            | South Africa        | Rand          | ✓       |

**Gender Support:**

The following locales support grammatical gender via `{ gender: 'feminine' }` or `{ gender: 'masculine' }`:

- **Spanish:** es-ES, es-MX, es-CO, es-CL, es-AR, es-VE, es-US
- **Portuguese:** pt-BR, pt-PT, pt-AO, pt-MZ
- **Arabic:** ar-AE, ar-DZ, ar-EG, ar-IQ, ar-LB, ar-MA, ar-SA, ar-SD, ar-YE
- **Hebrew:** he-IL, hbo-IL
- **Slavic:** ru-RU, uk-UA, pl-PL, cs-CZ, hr-HR, sk-SK, sr-RS, be-BY, bg-BG
- **Other:** ca-ES, ro-RO, lv-LV, lt-LT, sl-SI

**Formal Numerals:** zh-CN and zh-TW support formal/financial Chinese characters (大写/大寫) via `{ formal: true }`.

**Scale-First Ordering:** ig-NG uses scale-first word ordering (e.g., "Puku Abụọ" = "Thousand Two" for 2000).

## ⚠️ Error Handling

The library throws descriptive errors for invalid inputs:

### Invalid Number

```js
toWords.convert('abc');
// Error: Invalid Number "abc"

toWords.convert(NaN);
// Error: Invalid Number "NaN"

toWords.convert(Infinity);
// Error: Invalid Number "Infinity"
```

### Unknown Locale

```js
const toWords = new ToWords({ localeCode: 'xx-XX' });
toWords.convert(123);
// Error: Unknown Locale "xx-XX"
```

### Invalid Ordinal Input

```js
toWords.toOrdinal(-5);
// Error: Ordinal numbers must be non-negative integers, got "-5"

toWords.toOrdinal(3.14);
// Error: Ordinal numbers must be non-negative integers, got "3.14"
```

### Handling Errors

```js
try {
  const words = toWords.convert(userInput);
  console.log(words);
} catch (error) {
  console.error('Conversion failed:', error.message);
}
```

## 💖 Support

If `to-words` is useful in your work, consider supporting ongoing maintenance through [GitHub Sponsors](https://github.com/sponsors/mastermunj).

After installation, `npm fund to-words` surfaces the same funding link from npm metadata.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide covering development setup, coding guidelines, how to add a new locale, commit message format, and the PR process.

For questions or ideas, [open an issue](https://github.com/mastermunj/to-words/issues) or [start a discussion](https://github.com/mastermunj/to-words/discussions).

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## ❓ FAQ

<details>
<summary><strong>How do I handle numbers larger than JavaScript's safe integer limit?</strong></summary>

Use BigInt or pass the number as a string:

```js
// Using BigInt
toWords.convert(9007199254740993n);

// Using string
toWords.convert('9007199254740993');
```

</details>

<details>
<summary><strong>Why am I seeing scientific notation in my output?</strong></summary>

JavaScript automatically converts large numbers to scientific notation. Pass them as strings or BigInt instead:

```js
// ❌ This may give unexpected results
toWords.convert(123456789012345678901);

// ✅ Use string or BigInt
toWords.convert('123456789012345678901');
toWords.convert(123456789012345678901n);
```

</details>

<details>
<summary><strong>Can I use a custom currency?</strong></summary>

Yes! Override the currency options:

```js
toWords.convert(1234.56, {
  currency: true,
  currencyOptions: {
    name: 'Bitcoin',
    plural: 'Bitcoins',
    symbol: '₿',
    fractionalUnit: { name: 'Satoshi', plural: 'Satoshis', symbol: 'sat' },
  },
});
// "One Thousand Two Hundred Thirty Four Bitcoins And Fifty Six Satoshis Only"
```

</details>

<details>
<summary><strong>Does this work in the browser?</strong></summary>

Yes! Use the UMD bundles via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  const toWords = new ToWords();
  console.log(toWords.convert(123));
</script>
```

</details>

<details>
<summary><strong>Can I inject a custom locale (crypto, internal units, custom currency)?</strong></summary>

Yes. `ToWordsCore` exposes a `setLocale()` method that accepts any class implementing `LocaleInterface` (`{ config: LocaleConfig }`). No need to fork the package or submit a PR — your custom locale stays in your own codebase.

```ts
import { ToWordsCore } from 'to-words';
import type { LocaleInterface, LocaleConfig } from 'to-words';

class BitcoinLocale implements LocaleInterface {
  config: LocaleConfig = {
    currency: {
      name: 'Bitcoin',
      plural: 'Bitcoins',
      symbol: '₿',
      fractionalUnit: { name: 'Satoshi', plural: 'Satoshis', symbol: 'sat' },
    },
    texts: { and: 'And', minus: 'Minus', only: 'Only', point: 'Point' },
    numberWordsMapping: [
      { number: 1, value: 'One' },
      { number: 2, value: 'Two' },
      // ... rest of the mapping, same structure as any built-in locale
    ],
  };
}

const tw = new ToWordsCore();
tw.setLocale(BitcoinLocale);
console.log(tw.convert(2.1, { currency: true }));
// "Two Bitcoins And Ten Satoshis Only"
```

The easiest starting point is to copy the nearest built-in locale from [`src/locales/`](src/locales/) and change only what differs. Locale configuration is recursively frozen when first initialized so cached lookup tables cannot diverge; treat it as immutable and create a new locale class when configuration changes.

</details>

<details>
<summary><strong>How do I add support for a new locale?</strong></summary>

See the [Contributing](#-contributing) section above. You'll need to create a locale file implementing the `LocaleInterface` and add tests.

</details>

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 📄 License

[MIT](LICENSE)

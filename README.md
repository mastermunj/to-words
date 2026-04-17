# to-words

[![npm version](https://img.shields.io/npm/v/to-words.svg)](https://www.npmjs.com/package/to-words)
[![npm downloads](https://img.shields.io/npm/dm/to-words.svg)](https://www.npmjs.com/package/to-words)
[![build](https://img.shields.io/github/actions/workflow/status/mastermunj/to-words/ci.yml?branch=main&label=build)](https://github.com/mastermunj/to-words/actions)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/mastermunj/to-words/badge)](https://securityscorecards.dev/viewer/?uri=github.com/mastermunj/to-words)
[![coverage](https://codecov.io/gh/mastermunj/to-words/branch/main/graph/badge.svg)](https://codecov.io/gh/mastermunj/to-words)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/to-words?label=minzipped)](https://bundlephobia.com/package/to-words)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/to-words)](https://github.com/mastermunj/to-words/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/to-words)](https://www.npmjs.com/package/to-words)
[![Bun](https://github.com/mastermunj/to-words/actions/workflows/bun.yml/badge.svg?branch=main)](https://github.com/mastermunj/to-words/actions/workflows/bun.yml)
[![Deno](https://github.com/mastermunj/to-words/actions/workflows/deno.yml/badge.svg?branch=main)](https://github.com/mastermunj/to-words/actions/workflows/deno.yml)
[![CF Workers](https://img.shields.io/badge/CF_Workers-compatible-F38020)](https://workers.cloudflare.com)

Convert numbers and currency amounts into words across 124 locales with production-ready BigInt, ordinal, and TypeScript support.

## 🎮 Live Demo

**Try it now:** **[Open Interactive Demo](https://mastermunj.github.io/to-words/)**

Test locale behavior, currency conversion, ordinals, and large number inputs in the browser.

## 🏆 Why to-words

- **124 locale implementations** with region-specific numbering and currency conventions
- **Built for real financial flows**: amount in words, decimals, currency units, and negatives
- **Large number safe** with `BigInt` and string input support
- **Run anywhere**: Node.js, Deno, Bun, Cloudflare Workers, and all modern browsers
- **Functional API** — `toWords(42, { localeCode: 'en-US' })` for one-liners, or class-based for high-volume workloads
- **Strong developer ergonomics**: TypeScript types, ESM/CJS/UMD, and per-locale imports
- **Performance focused** for high-volume conversion workloads

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

- **124 Locales** — The most comprehensive locale coverage available
- **BigInt Support** — Handle numbers up to 10^63 (Vigintillion) and beyond
- **Multiple Numbering Systems** — Short scale, Long scale, Indian, and East Asian
- **Currency Formatting** — Locale-specific currency with fractional units
- **Ordinal Numbers** — First, Second, Third, etc.
- **Gender-Aware** — Grammatical gender for locales that require it (Spanish, Portuguese, Arabic, Hebrew, Slavic, and more)
- **Fraction-Style Decimals** — Legal/financial positional decimals (`"Forty-Five Hundredths"`) via `decimalStyle: 'fraction'` across 94 locales
- **Formal Numerals** — Formal/financial Chinese characters (大写/大寫) via `formal: true`
- **Tree-Shakeable** — Import only the locales you need
- **TypeScript Native** — Full type definitions included
- **Multiple Formats** — ESM, CommonJS, and UMD browser bundles
- **Zero Dependencies** — Lightweight and self-contained
- **High Performance** — Up to 4.7M ops/sec (small integers; see benchmark section for full breakdown)
- **Functional API** — `toWords()`, `toOrdinal()`, `toCurrency()` named exports for ergonomic one-liners
- **Auto Locale Detection** — `detectLocale()` reads `navigator.language` or `Intl` in any runtime
- **CLI** — `npx to-words 12345 --locale en-US` for shell scripts and quick conversions
- **Wide Compatibility** — All modern browsers, Node.js 20+, Deno, Bun, and Cloudflare Workers

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

**2. Functional (full bundle)** — one-liners with a `localeCode` option, all 124 locales available:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words';

toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
toCurrency(100, { localeCode: 'en-US' }); // "One Hundred Dollars Only"
toOrdinal(3, { localeCode: 'en-US' }); // "Third"
```

**3. Functional (per-locale import)** — locale baked in, fully tree-shakeable, smallest bundle (~3.5 KB gzip):

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

Handle numbers beyond JavaScript's safe integer limit:

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

> Individual imports are ~3.5 KB gzip vs ~60 KB for the full bundle.

### Browser Usage (UMD)

```html
<!-- Single locale (recommended, ~3.5 KB gzip) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  // ToWords is pre-configured for en-US
  const toWords = new ToWords();
  console.log(toWords.convert(12345));
  // "Twelve Thousand Three Hundred Forty Five"
</script>

<!-- Full bundle with all locales (~60 KB gzip) -->
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

**Per-locale import** — locale baked in, no `localeCode` argument at all, fully tree-shakeable (~3.5 KB gzip):

```js
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(12345); // "Twelve Thousand Three Hundred Forty Five"
toOrdinal(21); // "Twenty First"
toCurrency(1234.56); // "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

> **Performance note:** The functional API caches one `ToWords` instance per locale. Repeated calls for the same locale reuse the cached instance.

### Auto-Detect Locale

`detectLocale()` is automatically used by `toWords()`, `toOrdinal()`, and `toCurrency()` when no `localeCode` is provided — so in most cases you don't need to call it directly. It is useful when you want to read the runtime locale for other purposes, display it to the user, or pass it explicitly to a class instance.

```js
import { detectLocale, toWords, ToWords } from 'to-words';

// Used implicitly — no localeCode needed
toWords(1000);
// On a browser with navigator.language = 'fr-FR': "Mille"
// In a Node.js process with fr-FR locale:         "Mille"
// Fallback when nothing can be detected:           "One Thousand" (en-IN)

// Used explicitly — read once, reuse across many calls
const locale = detectLocale('en-US'); // custom fallback if detection misses
const tw = new ToWords({ localeCode: locale });
tw.convert(1000);
```

> Reads `navigator.language` in browsers, `Intl.DateTimeFormat().resolvedOptions().locale` in Node.js / Deno / Bun / CF Workers. Falls back to `'en-IN'` (or your custom fallback) if the detected value cannot be matched to a supported locale.

## 🔄 Migration Guide

Migrating from `number-to-words`, `written-number`, `num-words`, or `n2words`?

- See [`MIGRATION.md`](MIGRATION.md) for side-by-side API mapping and migration recipes.
- Includes package comparison, behavior notes, and a regression checklist.

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
import { toWords, toCurrency, detectLocale } from 'to-words';

const app = express();

app.get('/convert', (req, res) => {
  const number = String(req.query.number ?? '');
  const locale = String(req.query.locale ?? detectLocale());
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
interface ToWordsOptions {
  localeCode?: string; // Default: 'en-IN'
  converterOptions?: {
    currency?: boolean; // Default: false
    ignoreDecimal?: boolean; // Default: false
    ignoreZeroCurrency?: boolean; // Default: false
    doNotAddOnly?: boolean; // Default: false
    includeZeroFractional?: boolean; // Default: false
    currencyOptions?: {
      name: string;
      plural: string;
      symbol: string;
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
- **options**: `OrdinalOptions` — Optional settings (`{ formal?: boolean }`)
- **returns**: `string` — The ordinal in words (e.g., "First", "Twenty Third")

### Functional Exports

The three conversion helpers (`toWords`, `toOrdinal`, `toCurrency`) are available from the full bundle (`to-words`) and from every per-locale entry point (`to-words/<locale>`). `detectLocale` is only available from the full bundle. When importing from `to-words/<locale>`, the locale is already baked in and `localeCode` is not accepted.

#### `toWords(number, options?)`

Converts a number to words.

- **number**: `number | bigint | string` — The number to convert
- **options** _(full bundle)_: `ConverterOptions & { localeCode?: string }` — When `localeCode` is omitted, `detectLocale()` is called automatically
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
- **options** _(full bundle)_: `OrdinalOptions & { localeCode?: string }` — When `localeCode` is omitted, `detectLocale()` is called automatically
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
- **options** _(full bundle)_: `ConverterOptions & { localeCode?: string }` — When `localeCode` is omitted, `detectLocale()` is called automatically
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
- In **Node.js / Deno / Bun / CF Workers**: reads `Intl.DateTimeFormat().resolvedOptions().locale`
- Normalises BCP 47 tags (e.g. `zh-Hant-TW` → `zh-TW`) and falls back to a language-prefix match

- **fallback** _(optional)_: `string` — Returned when no supported locale can be matched. Default: `'en-IN'`
- **returns**: `string` — A supported locale code

```js
import { detectLocale } from 'to-words';

detectLocale(); // e.g. 'en-US', 'fr-FR', 'ja-JP'
detectLocale('en-GB'); // custom fallback if detection fails
```

> `detectLocale` is only available from the full bundle (`to-words`), not from per-locale entry points.

### Converter Options

| Option                  | Type    | Default   | Description                                                                                                                                                                                                                      |
| ----------------------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currency`              | boolean | false     | Convert as currency with locale-specific formatting                                                                                                                                                                              |
| `ignoreDecimal`         | boolean | false     | Ignore fractional part when converting                                                                                                                                                                                           |
| `ignoreZeroCurrency`    | boolean | false     | Skip zero main currency (e.g., show only "Thirty Six Paise")                                                                                                                                                                     |
| `doNotAddOnly`          | boolean | false     | Omit "Only" suffix in currency mode                                                                                                                                                                                              |
| `includeZeroFractional` | boolean | false     | When input is a string like `"123.00"`, include "And Zero Paise" even though the decimal is zero                                                                                                                                 |
| `currencyOptions`       | object  | undefined | Override locale's default currency settings                                                                                                                                                                                      |
| `gender`                | string  | undefined | Grammatical gender: `'masculine'` or `'feminine'`. Applies to locales with gendered number words                                                                                                                                 |
| `useAnd`                | boolean | undefined | Insert the locale connector before the last two digits (e.g., "One Hundred **And** Twenty Three"). No-op when locale already defines a split word or has an empty connector token                                                |
| `formal`                | boolean | undefined | Use formal/financial characters (currently supported for zh-CN and zh-TW)                                                                                                                                                        |
| `decimalStyle`          | string  | `'digit'` | Decimal rendering style: `'digit'` (default — digit-by-digit after the point) or `'fraction'` (positional/legal style — "Forty-Five Hundredths"). See [Fraction Style](#-spelled-out-decimal-fraction-style) for locale support. |

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

## � Spelled-Out Decimal (Fraction Style)

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

### Locale support (94 locales)

| Language group                         | Locales                                                                                                                                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **English**                            | en-AE, en-AU, en-BD, en-CA, en-GB, en-GH, en-HK, en-IE, en-IN, en-JM, en-KE, en-LK, en-MA, en-MM, en-MU, en-MY, en-NG, en-NP, en-NZ, en-OM, en-PH, en-PK, en-SA, en-SG, en-TT, en-TZ, en-UG, en-US, en-ZA, en-ZW |
| **German**                             | de-AT, de-CH, de-DE                                                                                                                                                                                              |
| **French**                             | fr-BE, fr-CA, fr-CH, fr-FR, fr-MA, fr-SA                                                                                                                                                                         |
| **Spanish**                            | es-AR, es-CL, es-CO, es-ES, es-MX, es-US, es-VE                                                                                                                                                                  |
| **Portuguese**                         | pt-AO, pt-BR, pt-MZ, pt-PT                                                                                                                                                                                       |
| **Italian**                            | it-IT                                                                                                                                                                                                            |
| **Dutch**                              | nl-NL, nl-SR                                                                                                                                                                                                     |
| **Scandinavian**                       | da-DK, nb-NO, sv-SE                                                                                                                                                                                              |
| **Other European**                     | bg-BG, ca-ES, cs-CZ, el-GR, hr-HR, hu-HU, lv-LV, pl-PL, ro-RO, sk-SK, sl-SI, sq-AL, sr-RS                                                                                                                        |
| **Slavic (with Slavic singular rule)** | be-BY, ru-RU, uk-UA                                                                                                                                                                                              |
| **Indic**                              | as-IN, bn-BD, bn-IN, gu-IN, hi-IN, kn-IN, ml-IN, mr-IN, np-NP, or-IN, pa-IN, ta-IN, te-IN                                                                                                                        |
| **Others**                             | af-ZA, fa-IR, he-IL, id-ID, ka-GE, ms-MY, ms-SG, ur-PK, vi-VN                                                                                                                                                    |

> Locales not listed above (Arabic, East Asian, Turkic, etc.) do not yet support
> `decimalStyle: 'fraction'` — passing the option silently falls back to digit-by-digit.

## �📏 Bundle Sizes

| Import Method             | Raw    | Gzip   |
| ------------------------- | ------ | ------ |
| Full bundle (all locales) | 654 KB | 60 KB  |
| Single locale (en-US)     | 12 KB  | 3.5 KB |
| Single locale (en-IN)     | 10 KB  | 3.4 KB |

> **Tip:** Use tree-shakeable imports or single-locale UMD bundles for the smallest bundle size.

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

| Runtime            | Support |
| ------------------ | ------- |
| Node.js            | 20+     |
| Deno               | 1.28+   |
| Bun                | 1.0+    |
| Cloudflare Workers | ✅      |

The library uses only standard ECMAScript features (BigInt, Intl, Map) with zero Node.js-specific APIs, making it compatible with any modern JavaScript runtime.

## 🗺️ Supported Locales

All 124 locales with their features:

| Locale | Language        | Country             | Currency      | Scale      | Ordinal |
| ------ | --------------- | ------------------- | ------------- | ---------- | ------- |
| af-ZA  | Afrikaans       | South Africa        | Rand          | Short      | ✓       |
| am-ET  | Amharic         | Ethiopia            | ብር            | Short      | ✓       |
| ar-AE  | Arabic          | UAE                 | درهم          | Short      | ✓       |
| ar-LB  | Arabic          | Lebanon             | ليرة          | Short      | ✓       |
| ar-MA  | Arabic          | Morocco             | درهم          | Short      | ✓       |
| ar-SA  | Arabic          | Saudi Arabia        | ريال          | Short      | ✓       |
| as-IN  | Assamese        | India               | টকা           | Indian     | ✓       |
| az-AZ  | Azerbaijani     | Azerbaijan          | Manat         | Short      | ✓       |
| be-BY  | Belarusian      | Belarus             | Рубель        | Short      | ✓       |
| bg-BG  | Bulgarian       | Bulgaria            | Лев           | Short      | ✓       |
| bn-BD  | Bengali         | Bangladesh          | টাকা          | Short      | ✓       |
| bn-IN  | Bengali         | India               | টাকা          | Short      | ✓       |
| ca-ES  | Catalan         | Spain               | Euro          | Short      | ✓       |
| cs-CZ  | Czech           | Czech Republic      | Koruna        | Short      | ✓       |
| da-DK  | Danish          | Denmark             | Krone         | Long       | ✓       |
| de-AT  | German          | Austria             | Euro          | Long       | ✓       |
| de-CH  | German          | Switzerland         | Franken       | Long       | ✓       |
| de-DE  | German          | Germany             | Euro          | Long       | ✓       |
| ee-EE  | Estonian        | Estonia             | Euro          | Short      | ✓       |
| el-GR  | Greek           | Greece              | Ευρώ          | Short      | ✓       |
| en-AE  | English         | UAE                 | Dirham        | Short      | ✓       |
| en-AU  | English         | Australia           | Dollar        | Short      | ✓       |
| en-BD  | English         | Bangladesh          | Taka          | Indian     | ✓       |
| en-CA  | English         | Canada              | Dollar        | Short      | ✓       |
| en-GB  | English         | United Kingdom      | Pound         | Short      | ✓       |
| en-GH  | English         | Ghana               | Cedi          | Short      | ✓       |
| en-HK  | English         | Hong Kong           | Dollar        | Short      | ✓       |
| en-IE  | English         | Ireland             | Euro          | Short      | ✓       |
| en-IN  | English         | India               | Rupee         | Indian     | ✓       |
| en-JM  | English         | Jamaica             | Dollar        | Short      | ✓       |
| en-KE  | English         | Kenya               | Shilling      | Short      | ✓       |
| en-LK  | English         | Sri Lanka           | Rupee         | Short      | ✓       |
| en-MA  | English         | Morocco             | Dirham        | Short      | ✓       |
| en-MM  | English         | Myanmar             | Kyat          | Short      | ✓       |
| en-MU  | English         | Mauritius           | Rupee         | Indian     | ✓       |
| en-MY  | English         | Malaysia            | Ringgit       | Short      | ✓       |
| en-NG  | English         | Nigeria             | Naira         | Short      | ✓       |
| en-NP  | English         | Nepal               | Rupee         | Indian     | ✓       |
| en-NZ  | English         | New Zealand         | Dollar        | Short      | ✓       |
| en-OM  | English         | Oman                | Rial          | Short      | ✓       |
| en-PH  | English         | Philippines         | Peso          | Short      | ✓       |
| en-PK  | English         | Pakistan            | Rupee         | Indian     | ✓       |
| en-SA  | English         | Saudi Arabia        | Riyal         | Short      | ✓       |
| en-SG  | English         | Singapore           | Dollar        | Short      | ✓       |
| en-TT  | English         | Trinidad and Tobago | Dollar        | Short      | ✓       |
| en-TZ  | English         | Tanzania            | Shilling      | Short      | ✓       |
| en-UG  | English         | Uganda              | Shilling      | Short      | ✓       |
| en-US  | English         | USA                 | Dollar        | Short      | ✓       |
| en-ZA  | English         | South Africa        | Rand          | Short      | ✓       |
| en-ZW  | English         | Zimbabwe            | Zimbabwe Gold | Short      | ✓       |
| es-AR  | Spanish         | Argentina           | Peso          | Short      | ✓       |
| es-CL  | Spanish         | Chile               | Peso          | Short      | ✓       |
| es-CO  | Spanish         | Colombia            | Peso          | Short      | ✓       |
| es-ES  | Spanish         | Spain               | Euro          | Short      | ✓       |
| es-MX  | Spanish         | Mexico              | Peso          | Short      | ✓       |
| es-US  | Spanish         | USA                 | Dólar         | Short      | ✓       |
| es-VE  | Spanish         | Venezuela           | Bolívar       | Short      | ✓       |
| fa-IR  | Persian         | Iran                | تومان         | Short      | ✓       |
| fi-FI  | Finnish         | Finland             | Euro          | Short      | ✓       |
| fil-PH | Filipino        | Philippines         | Piso          | Short      | ✓       |
| fr-BE  | French          | Belgium             | Euro          | Long       | ✓       |
| fr-CA  | French          | Canada              | Dollar        | Long       | ✓       |
| fr-CH  | French          | Switzerland         | Franc         | Long       | ✓       |
| fr-FR  | French          | France              | Euro          | Long       | ✓       |
| fr-MA  | French          | Morocco             | Dirham        | Long       | ✓       |
| fr-SA  | French          | Saudi Arabia        | Riyal         | Long       | ✓       |
| gu-IN  | Gujarati        | India               | રૂપિયો        | Short      | ✓       |
| ha-NG  | Hausa           | Nigeria             | Naira         | Short      | ✓       |
| hbo-IL | Biblical Hebrew | Israel              | שקל           | Short      | ✓       |
| he-IL  | Hebrew          | Israel              | שקל           | Short      | ✓       |
| hi-IN  | Hindi           | India               | रुपया         | Indian     | ✓       |
| hr-HR  | Croatian        | Croatia             | Euro          | Short      | ✓       |
| hu-HU  | Hungarian       | Hungary             | Forint        | Short      | ✓       |
| id-ID  | Indonesian      | Indonesia           | Rupiah        | Short      | ✓       |
| ig-NG  | Igbo            | Nigeria             | Naira         | Short      | ✓       |
| is-IS  | Icelandic       | Iceland             | Króna         | Short      | ✓       |
| it-IT  | Italian         | Italy               | Euro          | Short      | ✓       |
| ja-JP  | Japanese        | Japan               | 円            | East Asian | ✓       |
| jv-ID  | Javanese        | Indonesia           | Rupiah        | Short      | ✓       |
| ka-GE  | Georgian        | Georgia             | ლარი          | Short      | ✓       |
| km-KH  | Khmer           | Cambodia            | រៀល           | Khmer      | ✓       |
| kn-IN  | Kannada         | India               | ರೂಪಾಯಿ        | Short      | ✓       |
| ko-KR  | Korean          | South Korea         | 원            | Short      | ✓       |
| lt-LT  | Lithuanian      | Lithuania           | Euras         | Short      | ✓       |
| lv-LV  | Latvian         | Latvia              | Eiro          | Short      | ✓       |
| ml-IN  | Malayalam       | India               | രൂപ           | Indian     | ✓       |
| mr-IN  | Marathi         | India               | रुपया         | Indian     | ✓       |
| ms-MY  | Malay           | Malaysia            | Ringgit       | Short      | ✓       |
| ms-SG  | Malay           | Singapore           | Dolar         | Short      | ✓       |
| my-MM  | Burmese         | Myanmar             | ကျပ်          | Burmese    | ✓       |
| nb-NO  | Norwegian       | Norway              | Krone         | Long       | ✓       |
| nl-NL  | Dutch           | Netherlands         | Euro          | Short      | ✓       |
| nl-SR  | Dutch           | Suriname            | Dollar        | Short      | ✓       |
| np-NP  | Nepali          | Nepal               | रुपैयाँ       | Indian     | ✓       |
| or-IN  | Odia            | India               | ଟଙ୍କା         | Short      | ✓       |
| pa-IN  | Punjabi         | India               | ਰੁਪਇਆ         | Short      | ✓       |
| pl-PL  | Polish          | Poland              | Złoty         | Short      | ✓       |
| pt-AO  | Portuguese      | Angola              | Kwanza        | Short      | ✓       |
| pt-BR  | Portuguese      | Brazil              | Real          | Short      | ✓       |
| pt-MZ  | Portuguese      | Mozambique          | Metical       | Short      | ✓       |
| pt-PT  | Portuguese      | Portugal            | Euro          | Short      | ✓       |
| ro-RO  | Romanian        | Romania             | Leu           | Short      | ✓       |
| ru-RU  | Russian         | Russia              | Рубль         | Short      | ✓       |
| si-LK  | Sinhala         | Sri Lanka           | රුපියල        | Indian     | ✓       |
| sk-SK  | Slovak          | Slovakia            | Euro          | Short      | ✓       |
| sl-SI  | Slovenian       | Slovenia            | Euro          | Short      | ✓       |
| sq-AL  | Albanian        | Albania             | Lek           | Short      | ✓       |
| sr-RS  | Serbian         | Serbia              | Dinar         | Short      | ✓       |
| sv-SE  | Swedish         | Sweden              | Krona         | Short      | ✓       |
| sw-KE  | Swahili         | Kenya               | Shilingi      | Short      | ✓       |
| sw-TZ  | Swahili         | Tanzania            | Shilingi      | Short      | ✓       |
| ta-IN  | Tamil           | India               | ரூபாய்        | Short      | ✓       |
| te-IN  | Telugu          | India               | రూపాయి        | Short      | ✓       |
| th-TH  | Thai            | Thailand            | บาท           | Short      | ✓       |
| tr-TR  | Turkish         | Turkey              | Lira          | Short      | ✓       |
| uk-UA  | Ukrainian       | Ukraine             | Гривня        | Short      | ✓       |
| ur-PK  | Urdu            | Pakistan            | روپیہ         | Short      | ✓       |
| uz-UZ  | Uzbek           | Uzbekistan          | So'm          | Short      | ✓       |
| vi-VN  | Vietnamese      | Vietnam             | Đồng          | Short      | ✓       |
| yo-NG  | Yoruba          | Nigeria             | Naira         | Short      | ✓       |
| yue-HK | Cantonese       | Hong Kong           | 元            | East Asian | ✓       |
| zh-CN  | Chinese         | China               | 元            | East Asian | ✓       |
| zh-TW  | Chinese         | Taiwan              | 元            | East Asian | ✓       |
| zu-ZA  | Zulu            | South Africa        | Rand          | Short      | ✓       |

**Scale Legend:**

- **Short** — Western short scale (Million, Billion, Trillion...)
- **Long** — European long scale (Million, Milliard, Billion, Billiard...)
- **Indian** — Indian numbering (Lakh, Crore, Arab, Kharab...)
- **East Asian** — East Asian numbering (万, 億, 兆, 京...)
- **Burmese** — Burmese traditional scale (သောင်း=10k, သိန်း=100k, သန်း=1M)
- **Khmer** — Khmer traditional scale (មុឺន=10k, សែន=100k, លាន=1M)

**Gender Support:**

The following locales support grammatical gender via `{ gender: 'feminine' }` or `{ gender: 'masculine' }`:

- **Spanish:** es-ES, es-MX, es-CO, es-CL, es-AR, es-VE, es-US
- **Portuguese:** pt-BR, pt-PT, pt-AO, pt-MZ
- **Arabic:** ar-AE, ar-LB, ar-MA, ar-SA
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

The easiest starting point is to copy the nearest built-in locale from [`src/locales/`](src/locales/) and change only what differs.

</details>

<details>
<summary><strong>How do I add support for a new locale?</strong></summary>

See the [Contributing](#-contributing) section above. You'll need to create a locale file implementing the `LocaleInterface` and add tests.

</details>

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 📄 License

[MIT](LICENSE)

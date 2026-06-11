---
title: to-words — Convert Numbers to Words in 132 Locales | JavaScript npm
description: The most complete number-to-words library for JavaScript. 132 locales, TypeScript, ESM/CJS/UMD, BigInt, currency, ordinal. npm install to-words.
layout: home
head:
  - - meta
    - property: og:title
      content: to-words — Convert Numbers to Words in 132 Locales | JavaScript npm
  - - meta
    - name: keywords
      content: number to words javascript, convert number to words js, number to words npm, amount in words typescript, number to words library node
---

<script setup>
import NumberDemo from './.vitepress/components/NumberDemo.vue'
</script>

<div class="vp-doc" style="max-width:960px;margin:0 auto;padding:2rem 1rem 0">

# Convert Numbers to Words in JavaScript

The most complete number-to-words library for JavaScript and TypeScript. **132 locales**, currency, ordinal, BigInt, ESM/CJS/UMD — single package, zero dependencies.

```bash
npm install to-words
```

<NumberDemo />

## Built For Real Product Work

- Convert invoice totals, cheques, payout slips, and receipts into legally readable text
- Support Indian, European long-scale, East Asian, and short-scale numbering from one package
- Keep frontend bundles small with per-locale imports such as `to-words/en-US`
- Use the same API across React, Vue, Next.js, Node.js, and CLI workflows

## Why to-words?

| Metric                         | to-words        | number-to-words | written-number | num-words      | n2words       |
| ------------------------------ | --------------- | --------------- | -------------- | -------------- | ------------- |
| Latest npm version             | 5.6.0           | 1.2.4           | 0.11.1         | 1.2.3          | 5.0.0         |
| Last publish (UTC)             | 2026-05-27      | 2018-08-09      | 2021-07-12     | 2023-02-21     | 2026-05-30    |
| npm downloads (last week)      | 111,476         | 492,316         | 53,011         | 6,319          | 24,404        |
| Language/locale coverage claim | **132 locales** | English-focused | Multi-language | Indian English | 70+ languages |
| TypeScript declarations        | ✅              | ❌              | ❌             | ✅             | ✅            |
| BigInt support                 | ✅              | ❌              | ❌             | ❌             | ✅            |
| Currency conversion            | ✅              | ❌              | ❌             | ❌             | ✅            |
| Ordinal output                 | ✅              | ✅              | ❌             | ❌             | ✅            |
| Subpath locale imports         | ✅              | ❌              | ❌             | ❌             | ✅            |

Snapshot verified on 2026-05-30 from published package metadata, package exports, and npm downloads API.

## Three Integration Patterns

**Reusable class** for repeated conversions at one locale:

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(12345);
tw.convert(1234.56, { currency: true });
tw.toOrdinal(3);
```

**Full-bundle helpers** when locale changes at runtime:

```js
import { detectLocale, toCurrency } from 'to-words';

const locale = detectLocale('en-US');
toCurrency(452.36, { localeCode: locale });
```

**Per-locale imports** when bundle size matters:

```js
import { toWords, toCurrency } from 'to-words/hi-IN';

toWords(12345);
toCurrency(452.36);
```

## Quick Start

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(12345); // "Twelve Thousand Three Hundred Forty Five"
tw.convert(1234.56, { currency: true }); // "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
tw.toOrdinal(3); // "Third"
```

**Or use the functional API (one-liner, auto locale detection):**

```js
import { toWords, toCurrency, toOrdinal } from 'to-words';

toWords(12345, { localeCode: 'hi-IN' }); // "बारह हजार तीन सौ पैंतालीस"
toCurrency(452.36, { localeCode: 'hi-IN' }); // "चार सौ बावन रुपये और छत्तीस पैसे"
```

## Feature Highlights

| Need                        | What to use                                    |
| --------------------------- | ---------------------------------------------- |
| Runtime locale switching    | `toWords()` / `toCurrency()` with `localeCode` |
| Minimal frontend bundle     | `to-words/<locale>` imports                    |
| Fraction-style decimals     | `decimalStyle: 'fraction'`                     |
| Gender-aware output         | `gender: 'feminine'` or `gender: 'masculine'`  |
| Anti-fraud Chinese numerals | `formal: true`                                 |
| Server locale from headers  | `setLocaleDetector()`                          |

## Use Cases

- **Invoicing & Billing** — print totals in words on PDF invoices across 132 countries
- **Cheque Printing** — banks require amounts in words; locale currency wording keeps major and minor unit names aligned
- **Text-to-Speech** — feed clean word strings to TTS engines in 132 languages
- **Payroll & Payslips** — generate salary slip amounts in words across regions
- **E-commerce Checkout** — reduce ambiguity on high-value order confirmations
- **Legal Documents** — contracts that require spelled-out numbers
- **Education** — number learning in native scripts (Devanagari, Arabic, CJK, Cyrillic…)

See dedicated walkthroughs for [invoicing](/use-cases/invoicing), [cheque printing](/use-cases/check-printing), [text-to-speech](/use-cases/tts), [payroll](/use-cases/payroll), [e-commerce checkout](/use-cases/ecommerce), and [legal documents](/use-cases/legal-documents).

## Locale Guide Shortcuts

These are dedicated locale guide pages, listed alphabetically by language name for predictable scanning.

<div class="locale-grid">
  <a href="/to-words/locales/arabic">🇸🇦 Arabic</a>
  <a href="/to-words/locales/bengali">🇧🇩 Bengali</a>
  <a href="/to-words/locales/chinese">🇨🇳 Chinese</a>
  <a href="/to-words/locales/english">🇺🇸 English</a>
  <a href="/to-words/locales/french">🇫🇷 French</a>
  <a href="/to-words/locales/german">🇩🇪 German</a>
  <a href="/to-words/locales/hindi">🇮🇳 Hindi</a>
  <a href="/to-words/locales/indonesian">🇮🇩 Indonesian</a>
  <a href="/to-words/locales/italian">🇮🇹 Italian</a>
  <a href="/to-words/locales/japanese">🇯🇵 Japanese</a>
  <a href="/to-words/locales/korean">🇰🇷 Korean</a>
  <a href="/to-words/locales/persian">🇮🇷 Persian</a>
  <a href="/to-words/locales/polish">🇵🇱 Polish</a>
  <a href="/to-words/locales/portuguese">🇧🇷 Portuguese</a>
  <a href="/to-words/locales/russian">🇷🇺 Russian</a>
  <a href="/to-words/locales/spanish">🇪🇸 Spanish</a>
  <a href="/to-words/locales/tamil">🇮🇳 Tamil</a>
  <a href="/to-words/locales/thai">🇹🇭 Thai</a>
  <a href="/to-words/locales/turkish">🇹🇷 Turkish</a>
  <a href="/to-words/locales/urdu">🇵🇰 Urdu</a>
  <a href="/to-words/locales/vietnamese">🇻🇳 Vietnamese</a>
</div>

→ [See all 132 locales](/locales/)

## Start Here Next

- [Getting Started](/guide/getting-started)
- [API Reference](/guide/api-reference)
- [Currency guide](/guide/currency)
- [Tree-shaking guide](/guide/tree-shaking)
- [Compare against alternatives](/compare/number-to-words-alternatives)

</div>

<style>
.locale-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}
.locale-grid a {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, color 0.2s;
}
.locale-grid a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>

---
title: Getting Started — to-words | Number to Words npm Package
description: Install to-words and convert your first number in under 2 minutes. Node.js 20+, ESM/CJS/UMD, TypeScript. npm install to-words.
head:
  - - meta
    - name: keywords
      content: number to words npm install, number to words typescript, toWords javascript
---

# Getting Started

`to-words` gives you three integration styles: a reusable class, full-bundle functional helpers, and per-locale tree-shakeable imports. Pick the smallest surface that matches your runtime and bundle-size needs.

## Installation

```bash
npm install to-words
# or
yarn add to-words
# or
pnpm add to-words
```

Node.js `>= 20` is the supported baseline. For browsers, the package ships ESM, CommonJS, and UMD builds.

## Quick First Conversion

```js
import { toWords } from 'to-words';

toWords(12345, { localeCode: 'en-US' });
// "Twelve Thousand Three Hundred Forty Five"
```

## Three ways to use it

**1. Class-based** — best for high-volume workloads:

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });
tw.convert(12345); // "Twelve Thousand Three Hundred Forty Five"
tw.convert(100, { currency: true }); // "One Hundred Dollars Only"
tw.toOrdinal(3); // "Third"
```

Use this when you want to instantiate once and convert many values with the same locale or default options.

**2. Functional (full bundle)** — one-liners with all 132 locales:

```js
import { detectLocale, toWords, toOrdinal, toCurrency } from 'to-words';

toWords(12345, { localeCode: 'en-US' });
toCurrency(100, { localeCode: 'en-US' });
toOrdinal(3, { localeCode: 'en-US' });

// Or let the runtime locale decide
const locale = detectLocale('en-US');
toCurrency(100, { localeCode: locale });
```

This is the simplest API when locale changes at runtime, for example from a user profile or a language picker.

**3. Per-locale import** — fully tree-shakeable, ~3.5 KB gzip:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(12345); // locale baked in
toCurrency(100);
toOrdinal(3);
```

Choose this when your bundle only needs one locale or a tiny, known set of locales.

## Browser and CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  const tw = new ToWords();
  console.log(tw.convert(12345));
</script>
```

Use the per-locale UMD file for the smallest browser payload. Reach for the full UMD bundle only when end users can switch locales dynamically on the client.

## CLI

```bash
npx to-words 12345 --locale en-US
npx to-words 1234.56 --locale en-US --currency
npx to-words --detect-locale
```

## Which API Should You Choose?

- Use the class API when one instance will convert many numbers at the same locale
- Use full-bundle functions when locale comes from runtime state
- Use per-locale imports when bundle size matters most
- Use string input for values where decimal precision must be preserved exactly, such as `'500.500'`

## Next steps

- [API Reference](/guide/api-reference)
- [Currency conversion](/guide/currency)
- [Tree-shaking and bundle size](/guide/tree-shaking)
- [Framework integration](/guide/framework-integration)
- [Supported locales](/locales/)

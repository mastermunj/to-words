---
title: Uzbek Number to Words in JavaScript (uz-UZ) | to-words
description: Convert numbers to Uzbek words in JavaScript with uz-UZ support, Uzbek Som currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: uzbek number to words javascript, uz-UZ number to words npm, o'zbek raqam so'zda, so'm so'zlar bilan javascript
---

# Uzbek Number to Words in JavaScript (uz-UZ)

Use `uz-UZ` when your application needs Uzbek number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `uz-UZ` · **Numbering system:** Short scale · **Currency:** So'm / Tiyin · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'uz-UZ' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - So'm / Tiyin

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/uz-UZ';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country    | Currency     | Notes                         |
| ----------- | ---------- | ------------ | ----------------------------- |
| `uz-UZ`     | Uzbekistan | So'm / Tiyin | Standard Uzbek number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Azerbaijani](/locales/azerbaijani)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Uzbek number-to-words output?**
Use `uz-UZ`.

**Q: Does `to-words` support Uzbek ordinal words?**
Yes. `uz-UZ` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

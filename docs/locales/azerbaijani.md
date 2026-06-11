---
title: Azerbaijani Number to Words in JavaScript (az-AZ) | to-words
description: Convert numbers to Azerbaijani words in JavaScript with az-AZ support, Azerbaijani Manat currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: azerbaijani number to words javascript, az-AZ number to words npm, azərbaycan rəqəm söz javascript, manat sözlə
---

# Azerbaijani Number to Words in JavaScript (az-AZ)

Use `az-AZ` when your application needs Azerbaijani number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `az-AZ` · **Numbering system:** Short scale · **Currency:** Manat / Qəpik · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'az-AZ' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Manat / Qəpik

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
import { toWords, toCurrency, toOrdinal } from 'to-words/az-AZ';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country    | Currency      | Notes                               |
| ----------- | ---------- | ------------- | ----------------------------------- |
| `az-AZ`     | Azerbaijan | Manat / Qəpik | Standard Azerbaijani number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Azerbaijani number-to-words output?**
Use `az-AZ`.

**Q: Does `to-words` support Azerbaijani ordinal words?**
Yes. `az-AZ` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

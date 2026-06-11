---
title: Khmer Number to Words in JavaScript (km-KH) | to-words
description: Convert numbers to Khmer words in JavaScript with km-KH support, Cambodian Riel currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: khmer number to words javascript, km-KH number to words npm, ចំនួនជាអក្សរ ខ្មែរ, រៀល ជាពាក្យ javascript
---

# Khmer Number to Words in JavaScript (km-KH)

Use `km-KH` when your application needs Khmer number words for Cambodian invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `km-KH` · **Numbering system:** Short scale · **Currency:** រៀល (Riel) / សេន (Sen) · **Script:** Khmer

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'km-KH' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Riel / Sen

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
import { toWords, toCurrency, toOrdinal } from 'to-words/km-KH';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country  | Currency  | Notes        |
| ----------- | -------- | --------- | ------------ |
| `km-KH`     | Cambodia | រៀល / សេន | Khmer script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Khmer number-to-words output?**
Use `km-KH`.

**Q: Does `to-words` output Khmer in the Khmer script?**
Yes. `km-KH` produces output in the Khmer script.

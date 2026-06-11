---
title: Greek Number to Words in JavaScript (el-GR) | to-words
description: Convert numbers to Greek words in JavaScript with el-GR support, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: greek number to words javascript, el-GR number to words npm, αριθμός σε λέξεις ελληνικά, ευρώ με λέξεις javascript
---

# Greek Number to Words in JavaScript (el-GR)

Use `el-GR` when your application needs Greek number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `el-GR` · **Numbering system:** Short scale · **Currency:** Ευρώ (Euro) / Λεπτό (Lepto) · **Script:** Greek

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'el-GR' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Lepto

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

## Locale Codes

| Locale code | Country | Currency     | Notes        |
| ----------- | ------- | ------------ | ------------ |
| `el-GR`     | Greece  | Ευρώ / Λεπτό | Greek script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Greek number-to-words output?**
Use `el-GR`.

**Q: Does `to-words` output Greek in the Greek alphabet?**
Yes. `el-GR` produces output in the Greek script.

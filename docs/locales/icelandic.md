---
title: Icelandic Number to Words in JavaScript (is-IS) | to-words
description: Convert numbers to Icelandic words in JavaScript with is-IS support, Icelandic Króna currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: icelandic number to words javascript, is-IS number to words npm, tölur í orðum íslenska, íslenskar krónur með orðum
---

# Icelandic Number to Words in JavaScript (is-IS)

Use `is-IS` when your application needs Icelandic number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `is-IS` · **Numbering system:** Short scale · **Currency:** Króna / Eyrir · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'is-IS' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Króna / Eyrir

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

| Locale code | Country | Currency      | Notes                             |
| ----------- | ------- | ------------- | --------------------------------- |
| `is-IS`     | Iceland | Króna / Eyrir | Standard Icelandic number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Norwegian](/locales/norwegian)
- [Danish](/locales/danish)
- [Swedish](/locales/swedish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Icelandic number-to-words output?**
Use `is-IS`.

**Q: Does `to-words` support Icelandic ordinal words?**
Yes. `is-IS` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

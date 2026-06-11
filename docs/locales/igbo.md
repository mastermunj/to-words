---
title: Igbo Number to Words in JavaScript (ig-NG) | to-words
description: Convert numbers to Igbo words in JavaScript with ig-NG support, Nigerian Naira currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: igbo number to words javascript, ig-NG number to words npm, ọnụọgụ igbo javascript, naira n'okwu igbo
---

# Igbo Number to Words in JavaScript (ig-NG)

Use `ig-NG` when your application needs Igbo number words for Nigerian invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `ig-NG` · **Numbering system:** Short scale · **Currency:** Naira / Kobo · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ig-NG' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Naira / Kobo

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

| Locale code | Country | Currency     | Notes                        |
| ----------- | ------- | ------------ | ---------------------------- |
| `ig-NG`     | Nigeria | Naira / Kobo | Standard Igbo number wording |

## Related

- [Currency guide](/guide/currency)
- [Hausa](/locales/hausa)
- [Yoruba](/locales/yoruba)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Igbo number-to-words output?**
Use `ig-NG`.

**Q: Does `to-words` support Igbo ordinal words?**
Yes. `ig-NG` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

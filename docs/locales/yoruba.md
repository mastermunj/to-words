---
title: Yoruba Number to Words in JavaScript (yo-NG) | to-words
description: Convert numbers to Yoruba words in JavaScript with yo-NG support, Nigerian Naira currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: yoruba number to words javascript, yo-NG number to words npm, nọmba si ọrọ yoruba, naira ni awọn ọrọ javascript
---

# Yoruba Number to Words in JavaScript (yo-NG)

Use `yo-NG` when your application needs Yoruba number words for Nigerian invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `yo-NG` · **Numbering system:** Short scale · **Currency:** Naira / Kobo · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'yo-NG' });

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

| Locale code | Country | Currency     | Notes                          |
| ----------- | ------- | ------------ | ------------------------------ |
| `yo-NG`     | Nigeria | Naira / Kobo | Standard Yoruba number wording |

## Related

- [Currency guide](/guide/currency)
- [Hausa](/locales/hausa)
- [Igbo](/locales/igbo)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Yoruba number-to-words output?**
Use `yo-NG`.

**Q: Does `to-words` support Yoruba ordinal words?**
Yes. `yo-NG` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

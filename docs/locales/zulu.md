---
title: Zulu Number to Words in JavaScript (zu-ZA) | to-words
description: Convert numbers to Zulu words in JavaScript with zu-ZA support, South African Rand currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: zulu number to words javascript, zu-ZA number to words npm, izinombolo ngamazwi zulu, rand ngamazwi javascript
---

# Zulu Number to Words in JavaScript (zu-ZA)

Use `zu-ZA` when your application needs Zulu number words for South African invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `zu-ZA` · **Numbering system:** Short scale · **Currency:** Rand / Senti · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'zu-ZA' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Rand / Senti

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

| Locale code | Country      | Currency     | Notes                        |
| ----------- | ------------ | ------------ | ---------------------------- |
| `zu-ZA`     | South Africa | Rand / Senti | Standard Zulu number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Afrikaans](/locales/afrikaans)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Zulu number-to-words output?**
Use `zu-ZA`.

**Q: Does `to-words` support Zulu ordinal words?**
Yes. `zu-ZA` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

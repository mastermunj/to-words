---
title: Danish Number to Words in JavaScript (da-DK) | to-words
description: Convert numbers to Danish words in JavaScript with da-DK support, Danish Krone currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: danish number to words javascript, da-DK number to words npm, tal til ord dansk, dansk krone med ord
---

# Danish Number to Words in JavaScript (da-DK)

Use `da-DK` when your application needs Danish number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `da-DK` · **Numbering system:** Short scale · **Currency:** Krone / Øre · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'da-DK' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Krone / Øre

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

| Locale code | Country | Currency    | Notes                          |
| ----------- | ------- | ----------- | ------------------------------ |
| `da-DK`     | Denmark | Krone / Øre | Standard Danish number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Norwegian](/locales/norwegian)
- [Swedish](/locales/swedish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Danish number-to-words output?**
Use `da-DK`.

**Q: Does `to-words` support Danish ordinal words?**
Yes. `da-DK` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

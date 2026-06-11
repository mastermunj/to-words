---
title: Swedish Number to Words in JavaScript (sv-SE) | to-words
description: Convert numbers to Swedish words in JavaScript with sv-SE support, Swedish Krona currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: swedish number to words javascript, sv-SE number to words npm, siffror till ord svenska, svensk krona med ord
---

# Swedish Number to Words in JavaScript (sv-SE)

Use `sv-SE` when your application needs Swedish number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `sv-SE` · **Numbering system:** Short scale · **Currency:** Krona / Öre · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sv-SE' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Krona / Öre

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

| Locale code | Country | Currency    | Notes                           |
| ----------- | ------- | ----------- | ------------------------------- |
| `sv-SE`     | Sweden  | Krona / Öre | Standard Swedish number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Danish](/locales/danish)
- [Norwegian](/locales/norwegian)
- [Finnish](/locales/finnish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Swedish number-to-words output?**
Use `sv-SE`.

**Q: Does `to-words` support Swedish ordinal words?**
Yes. `sv-SE` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

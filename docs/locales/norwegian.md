---
title: Norwegian Number to Words in JavaScript (nb-NO) | to-words
description: Convert numbers to Norwegian Bokmål words in JavaScript with nb-NO support, Norwegian Krone currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: norwegian number to words javascript, nb-NO number to words npm, tall til ord norsk, norsk krone med ord
---

# Norwegian Number to Words in JavaScript (nb-NO)

Use `nb-NO` when your application needs Norwegian Bokmål number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `nb-NO` · **Numbering system:** Short scale · **Currency:** Krone / Øre · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'nb-NO' });

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

| Locale code | Country | Currency    | Notes                              |
| ----------- | ------- | ----------- | ---------------------------------- |
| `nb-NO`     | Norway  | Krone / Øre | Norwegian Bokmål; standard wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Danish](/locales/danish)
- [Swedish](/locales/swedish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Norwegian number-to-words output?**
Use `nb-NO` for Norwegian Bokmål.

**Q: Does `to-words` support Norwegian ordinal words?**
Yes. `nb-NO` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

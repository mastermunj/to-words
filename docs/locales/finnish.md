---
title: Finnish Number to Words in JavaScript (fi-FI) | to-words
description: Convert numbers to Finnish words in JavaScript with fi-FI support, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: finnish number to words javascript, fi-FI number to words npm, numero sanaksi suomi, euro sanoin javascript
---

# Finnish Number to Words in JavaScript (fi-FI)

Use `fi-FI` when your application needs Finnish number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `fi-FI` · **Numbering system:** Short scale · **Currency:** Euro / Sentti · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'fi-FI' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Sentti

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

| Locale code | Country | Currency      | Notes                           |
| ----------- | ------- | ------------- | ------------------------------- |
| `fi-FI`     | Finland | Euro / Sentti | Standard Finnish number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Estonian](/locales/estonian)
- [Norwegian](/locales/norwegian)
- [Swedish](/locales/swedish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Finnish number-to-words output?**
Use `fi-FI`.

**Q: Does `to-words` support Finnish ordinal words?**
Yes. `fi-FI` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

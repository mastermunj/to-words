---
title: Estonian Number to Words in JavaScript (et-EE) | to-words
description: Convert numbers to Estonian words in JavaScript with et-EE support, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: estonian number to words javascript, et-EE number to words npm, arv sõnadesse eesti, euro sõnadega javascript
---

# Estonian Number to Words in JavaScript (et-EE)

Use `et-EE` when your application needs Estonian number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `et-EE` · **Numbering system:** Short scale · **Currency:** Euro / Sent · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'et-EE' });

tw.convert(100); // "Sada"
tw.convert(1000); // "Tuhat"
tw.convert(1000000);
```

## Currency - Euro / Sent

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
import { toWords, toCurrency, toOrdinal } from 'to-words/et-EE';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency    | Notes                            |
| ----------- | ------- | ----------- | -------------------------------- |
| `et-EE`     | Estonia | Euro / Sent | Standard Estonian number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Finnish](/locales/finnish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Estonian number-to-words output?**
Use `et-EE`.

**Q: Does `to-words` support Estonian ordinal words?**
Yes. `et-EE` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

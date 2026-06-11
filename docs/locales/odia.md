---
title: Odia Number to Words in JavaScript (or-IN) | to-words
description: Convert numbers to Odia words in JavaScript with or-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: odia number to words javascript, or-IN number to words npm, ଓଡ଼ିଆ ସଂଖ୍ୟା ଶବ୍ଦରେ, indian rupee odia words javascript
---

# Odia Number to Words in JavaScript (or-IN)

Use `or-IN` when your application needs Odia number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `or-IN` · **Numbering system:** Indian · **Currency:** ଟଙ୍କା (Tanka) / ପଇସା (Paisa) · **Script:** Odia

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'or-IN' });

tw.convert(100);
tw.convert(100000); // one lakh
tw.convert(10000000); // one crore
```

## Currency - Tanka / Paisa

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
```

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/or-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency     | Notes                     |
| ----------- | ------- | ------------ | ------------------------- |
| `or-IN`     | India   | ଟଙ୍କା / ପଇସା | Indian scale; Odia script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Bengali](/locales/bengali)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Odia number-to-words output?**
Use `or-IN`.

**Q: Does `or-IN` use the Indian number scale (lakh, crore)?**
Yes. `or-IN` uses Indian grouping with lakh and crore as the scale units.

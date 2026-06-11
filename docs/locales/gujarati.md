---
title: Gujarati Number to Words in JavaScript (gu-IN) | to-words
description: Convert numbers to Gujarati words in JavaScript with gu-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: gujarati number to words javascript, gu-IN number to words npm, ગુજરાતી સંખ્યા શબ્દોમાં, indian rupee gujarati words
---

# Gujarati Number to Words in JavaScript (gu-IN)

Use `gu-IN` when your application needs Gujarati number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `gu-IN` · **Numbering system:** Indian · **Currency:** રૂપિયો (Rupee) / પૈસા (Paisa) · **Script:** Gujarati

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'gu-IN' });

tw.convert(100);
tw.convert(100000); // one lakh
tw.convert(10000000); // one crore
```

## Currency - Rupee / Paisa

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
import { toWords, toCurrency, toOrdinal } from 'to-words/gu-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency      | Notes                         |
| ----------- | ------- | ------------- | ----------------------------- |
| `gu-IN`     | India   | રૂપિયો / પૈસા | Indian scale; Gujarati script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Marathi](/locales/marathi)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Gujarati number-to-words output?**
Use `gu-IN`.

**Q: Does `gu-IN` use the Indian number scale (lakh, crore)?**
Yes. `gu-IN` uses Indian grouping with lakh and crore as the scale units.

---
title: Punjabi Number to Words in JavaScript (pa-IN) | to-words
description: Convert numbers to Punjabi words in JavaScript with pa-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: punjabi number to words javascript, pa-IN number to words npm, ਪੰਜਾਬੀ ਸੰਖਿਆ ਸ਼ਬਦਾਂ ਵਿੱਚ, indian rupee punjabi words javascript
---

# Punjabi Number to Words in JavaScript (pa-IN)

Use `pa-IN` when your application needs Punjabi number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `pa-IN` · **Numbering system:** Indian · **Currency:** ਰੁਪਇਆ (Rupee) / ਪੈਸਾ (Paisa) · **Script:** Gurmukhi

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'pa-IN' });

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
import { toWords, toCurrency, toOrdinal } from 'to-words/pa-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency     | Notes                         |
| ----------- | ------- | ------------ | ----------------------------- |
| `pa-IN`     | India   | ਰੁਪਇਆ / ਪੈਸਾ | Indian scale; Gurmukhi script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Punjabi number-to-words output?**
Use `pa-IN`.

**Q: Does `pa-IN` use the Indian number scale (lakh, crore)?**
Yes. `pa-IN` uses Indian grouping with lakh and crore as the scale units.

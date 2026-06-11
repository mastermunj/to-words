---
title: Nepali Number to Words in JavaScript (np-NP) | to-words
description: Convert numbers to Nepali words in JavaScript with np-NP, Indian number scale, Nepali Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: nepali number to words javascript, np-NP number to words npm, नेपाली संख्या शब्दमा, nepali rupee in words javascript
---

# Nepali Number to Words in JavaScript (np-NP)

Use `np-NP` when your application needs Nepali number words with Indian number scale (lakh, crore) and Nepali Rupee currency.

> **Locale codes:** `np-NP` · **Numbering system:** Indian · **Currency:** रुपैयाँ (Rupee) / पैसा (Paisa) · **Script:** Devanagari

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'np-NP' });

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
import { toWords, toCurrency, toOrdinal } from 'to-words/np-NP';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency       | Notes                           |
| ----------- | ------- | -------------- | ------------------------------- |
| `np-NP`     | Nepal   | रुपैयाँ / पैसा | Indian scale; Devanagari script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Nepali number-to-words output?**
Use `np-NP`.

**Q: Does `np-NP` use the Indian number scale (lakh, crore)?**
Yes. `np-NP` uses Indian grouping with lakh and crore as the scale units.

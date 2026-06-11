---
title: Marathi Number to Words in JavaScript (mr-IN) | to-words
description: Convert numbers to Marathi words in JavaScript with mr-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: marathi number to words javascript, mr-IN number to words npm, मराठी संख्या शब्दात, indian rupee marathi words javascript
---

# Marathi Number to Words in JavaScript (mr-IN)

Use `mr-IN` when your application needs Marathi number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `mr-IN` · **Numbering system:** Indian · **Currency:** रुपया (Rupee) / पैसा (Paisa) · **Script:** Devanagari

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'mr-IN' });

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
import { toWords, toCurrency, toOrdinal } from 'to-words/mr-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency     | Notes                           |
| ----------- | ------- | ------------ | ------------------------------- |
| `mr-IN`     | India   | रुपया / पैसा | Indian scale; Devanagari script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Gujarati](/locales/gujarati)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Marathi number-to-words output?**
Use `mr-IN`.

**Q: Does `mr-IN` use the Indian number scale (lakh, crore)?**
Yes. `mr-IN` uses Indian grouping with lakh and crore as the scale units.

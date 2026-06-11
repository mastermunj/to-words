---
title: Kannada Number to Words in JavaScript (kn-IN) | to-words
description: Convert numbers to Kannada words in JavaScript with kn-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: kannada number to words javascript, kn-IN number to words npm, ಕನ್ನಡ ಸಂಖ್ಯೆ ಪದಗಳಲ್ಲಿ, indian rupee kannada words javascript
---

# Kannada Number to Words in JavaScript (kn-IN)

Use `kn-IN` when your application needs Kannada number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `kn-IN` · **Numbering system:** Indian · **Currency:** ರೂಪಾಯಿ (Rupee) / ಪೈಸೆ (Paise) · **Script:** Kannada

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'kn-IN' });

tw.convert(100);
tw.convert(100000); // one lakh
tw.convert(10000000); // one crore
```

## Currency - Rupee / Paise

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
import { toWords, toCurrency, toOrdinal } from 'to-words/kn-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency      | Notes                        |
| ----------- | ------- | ------------- | ---------------------------- |
| `kn-IN`     | India   | ರೂಪಾಯಿ / ಪೈಸೆ | Indian scale; Kannada script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Tamil](/locales/tamil)
- [Telugu](/locales/telugu)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Kannada number-to-words output?**
Use `kn-IN`.

**Q: Does `kn-IN` use the Indian number scale (lakh, crore)?**
Yes. `kn-IN` uses Indian grouping with lakh and crore as the scale units.

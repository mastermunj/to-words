---
title: Malayalam Number to Words in JavaScript (ml-IN) | to-words
description: Convert numbers to Malayalam words in JavaScript with ml-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: malayalam number to words javascript, ml-IN number to words npm, മലയാളം സംഖ്യ വാക്കുകൾ, indian rupee malayalam words javascript
---

# Malayalam Number to Words in JavaScript (ml-IN)

Use `ml-IN` when your application needs Malayalam number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `ml-IN` · **Numbering system:** Indian · **Currency:** രൂപ (Rupee) / പൈസ (Paisa) · **Script:** Malayalam

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ml-IN' });

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
import { toWords, toCurrency, toOrdinal } from 'to-words/ml-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency  | Notes                          |
| ----------- | ------- | --------- | ------------------------------ |
| `ml-IN`     | India   | രൂപ / പൈസ | Indian scale; Malayalam script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Tamil](/locales/tamil)
- [Kannada](/locales/kannada)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Malayalam number-to-words output?**
Use `ml-IN`.

**Q: Does `ml-IN` use the Indian number scale (lakh, crore)?**
Yes. `ml-IN` uses Indian grouping with lakh and crore as the scale units.

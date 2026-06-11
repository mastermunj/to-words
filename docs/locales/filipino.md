---
title: Filipino Number to Words in JavaScript (fil-PH) | to-words
description: Convert numbers to Filipino words in JavaScript with fil-PH support, Philippine Peso currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: filipino number to words javascript, fil-PH number to words npm, bilang sa salita filipino, piso sa salita javascript
---

# Filipino Number to Words in JavaScript (fil-PH)

Use `fil-PH` when your application needs Filipino number words for Philippine invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `fil-PH` · **Numbering system:** Short scale · **Currency:** Piso / Sentimo · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'fil-PH' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Piso / Sentimo

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
import { toWords, toCurrency, toOrdinal } from 'to-words/fil-PH';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country     | Currency       | Notes                                            |
| ----------- | ----------- | -------------- | ------------------------------------------------ |
| `fil-PH`    | Philippines | Piso / Sentimo | Standard Filipino (Tagalog-based) number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Filipino number-to-words output?**
Use `fil-PH`.

**Q: Does `to-words` support Filipino ordinal words?**
Yes. `fil-PH` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

---
title: Telugu Number to Words in JavaScript (te-IN) | to-words
description: Convert numbers to Telugu words in JavaScript with te-IN, Indian number scale, Rupee currency, and lakh/crore support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: telugu number to words javascript, te-IN number to words npm, తెలుగు సంఖ్య పదాలలో, indian rupee telugu words javascript
---

# Telugu Number to Words in JavaScript (te-IN)

Use `te-IN` when your application needs Telugu number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `te-IN` · **Numbering system:** Indian · **Currency:** రూపాయి (Rupee) / పైసా (Paisa) · **Script:** Telugu

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'te-IN' });

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
import { toWords, toCurrency, toOrdinal } from 'to-words/te-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency      | Notes                       |
| ----------- | ------- | ------------- | --------------------------- |
| `te-IN`     | India   | రూపాయి / పైసా | Indian scale; Telugu script |

## Related

- [Currency guide](/guide/currency)
- [Tamil](/locales/tamil)
- [Kannada](/locales/kannada)
- [Malayalam](/locales/malayalam)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Telugu number-to-words output?**
Use `te-IN`.

**Q: Does `te-IN` use the Indian number scale (lakh, crore)?**
Yes. `te-IN` uses Indian grouping with lakh and crore as the scale units.

---
title: Assamese Number to Words in JavaScript (as-IN) | to-words
description: Convert numbers to Assamese words in JavaScript with as-IN support, Indian Rupee currency, and Indian number scale. npm install to-words.
head:
  - - meta
    - name: keywords
      content: assamese number to words javascript, as-IN number to words npm, অসমীয়া সংখ্যা শব্দে, indian rupee in assamese words javascript
---

# Assamese Number to Words in JavaScript (as-IN)

Use `as-IN` when your application needs Assamese number words with Indian number scale (lakh, crore) and Rupee currency.

> **Locale codes:** `as-IN` · **Numbering system:** Indian · **Currency:** টকা (Taka) / পইচা (Poisha) · **Script:** Bengali-Assamese

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'as-IN' });

tw.convert(100);
tw.convert(100000); // one lakh
tw.convert(10000000); // one crore
```

## Currency - Taka / Poisha

```js
tw.convert(1234.56, { currency: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
```

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/as-IN';

toWords(100000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency   | Notes                                 |
| ----------- | ------- | ---------- | ------------------------------------- |
| `as-IN`     | India   | টকা / পইচা | Indian scale; Bengali-Assamese script |

## Related

- [Currency guide](/guide/currency)
- [Hindi](/locales/hindi)
- [Bengali](/locales/bengali)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Assamese number-to-words output?**
Use `as-IN`.

**Q: Does `as-IN` use the Indian number scale (lakh, crore)?**
Yes. `as-IN` uses Indian grouping with lakh and crore as the scale units.

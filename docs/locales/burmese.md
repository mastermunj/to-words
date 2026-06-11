---
title: Burmese Number to Words in JavaScript (my-MM) | to-words
description: Convert numbers to Burmese words in JavaScript with my-MM support, Myanmar Kyat currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: burmese number to words javascript, myanmar number to words, my-MM number to words npm, ကျပ် စကားလုံး javascript
---

# Burmese Number to Words in JavaScript (my-MM)

Use `my-MM` when your application needs Burmese (Myanmar) number words for invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `my-MM` · **Numbering system:** Short scale · **Currency:** ကျပ် (Kyat) / ပြား (Pya) · **Script:** Burmese (Myanmar)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'my-MM' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Kyat / Pya

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
import { toWords, toCurrency, toOrdinal } from 'to-words/my-MM';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency    | Notes          |
| ----------- | ------- | ----------- | -------------- |
| `my-MM`     | Myanmar | ကျပ် / ပြား | Burmese script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Burmese/Myanmar number-to-words output?**
Use `my-MM`.

**Q: Does `to-words` output Burmese in the Myanmar script?**
Yes. `my-MM` produces output in Burmese (Myanmar) script.

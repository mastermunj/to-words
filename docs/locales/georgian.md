---
title: Georgian Number to Words in JavaScript (ka-GE) | to-words
description: Convert numbers to Georgian words in JavaScript with ka-GE support, Georgian Lari currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: georgian number to words javascript, ka-GE number to words npm, ციფრი სიტყვებში ქართული, ლარი სიტყვებით javascript
---

# Georgian Number to Words in JavaScript (ka-GE)

Use `ka-GE` when your application needs Georgian number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `ka-GE` · **Numbering system:** Short scale · **Currency:** ლარი (Lari) / თეთრი (Tetri) · **Script:** Georgian (Mkhedruli)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ka-GE' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Lari / Tetri

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
import { toWords, toCurrency, toOrdinal } from 'to-words/ka-GE';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency     | Notes                       |
| ----------- | ------- | ------------ | --------------------------- |
| `ka-GE`     | Georgia | ლარი / თეთრი | Georgian (Mkhedruli) script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Georgian number-to-words output?**
Use `ka-GE`.

**Q: Does `to-words` output Georgian in the Mkhedruli script?**
Yes. `ka-GE` produces output in the Georgian Mkhedruli script.

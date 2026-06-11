---
title: Tamil Number to Words in JavaScript (ta-IN) | to-words
description: Convert numbers to Tamil words in JavaScript with ta-IN support, Indian-scale numbering, and Rupee currency output. npm install to-words.
head:
  - - meta
    - name: keywords
      content: tamil number to words javascript, ta-IN number to words npm, தமிழில் எண் javascript, tamil rupees in words
---

# Tamil Number to Words in JavaScript (ta-IN)

Use `ta-IN` when you need Tamil number wording for invoices, payment receipts, educational tools, or regional interfaces that should follow Indian-scale grouping.

> **Locale codes:** `ta-IN` · **Numbering system:** Indian scale · **Currency:** Rupee / Paisa · **Script:** Tamil

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ta-IN' });

tw.convert(125);
tw.convert(100000); // lakh-scale wording
tw.convert(10000000); // crore-scale wording
```

Tamil follows Indian grouping with words such as `லட்சம்` and `கோடி`, so large-number output matches common usage in India instead of western million-only phrasing.

## Currency - Rupee / Paisa

```js
tw.convert(452.36, { currency: true });
tw.convert('1000.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(3);
tw.toOrdinal(20);
tw.toOrdinal(100000);
```

## Locale Codes

| Locale code | Country | Currency      | Notes                                                       |
| ----------- | ------- | ------------- | ----------------------------------------------------------- |
| `ta-IN`     | India   | Rupee / Paisa | Tamil script with Indian numbering words for lakh and crore |

## Related

- [Hindi](/locales/hindi)
- [Bengali](/locales/bengali)
- [Currency guide](/guide/currency)

## FAQ

**Q: Does Tamil use lakh and crore output in `to-words`?**
Yes. `ta-IN` is configured for Indian-scale grouping.

**Q: Can I use Tamil output for invoice totals?**
Yes. `ta-IN` supports both cardinal and currency wording, so it fits invoicing and receipt flows.

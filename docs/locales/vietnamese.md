---
title: Vietnamese Number to Words in JavaScript (vi-VN) | to-words
description: Convert numbers to Vietnamese words in JavaScript with vi-VN support, Đồng currency, and native Vietnamese phrasing. npm install to-words.
head:
  - - meta
    - name: keywords
      content: vietnamese number to words javascript, vi-VN number to words npm, vietnamese dong in words javascript, amount in words vietnamese nodejs
---

# Vietnamese Number to Words in JavaScript (vi-VN)

Use `vi-VN` when you need Vietnamese wording for ecommerce totals, invoices, reports, or accessibility-friendly spoken-number output.

> **Locale codes:** `vi-VN` · **Numbering system:** Vietnamese large-number words · **Currency:** Đồng / Xu · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'vi-VN' });

tw.convert(0); // "Không"
tw.convert(10); // "Mười"
tw.convert(137);
tw.convert(1000000);
```

## Currency - Dong / Xu

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(2);
tw.toOrdinal(12);
```

## Locale Codes

| Locale code | Country | Currency  | Notes                                                           |
| ----------- | ------- | --------- | --------------------------------------------------------------- |
| `vi-VN`     | Vietnam | Dong / Xu | Vietnamese wording for cardinals, ordinals, and currency totals |

## Related

- [Thai](/locales/thai)
- [Indonesian](/locales/indonesian)
- [Currency guide](/guide/currency)

## FAQ

**Q: Which locale code should I use for Vietnamese number words?**
Use `vi-VN`.

**Q: Can I generate Vietnamese currency totals with the same API?**
Yes. `convert(value, { currency: true })` works with `vi-VN` for Dong and Xu wording.

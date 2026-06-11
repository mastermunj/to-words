---
title: Thai Number to Words in JavaScript (th-TH) | to-words
description: Convert numbers to Thai words in JavaScript with th-TH support, Thai Baht currency, and native Thai large-number wording. npm install to-words.
head:
  - - meta
    - name: keywords
      content: thai number to words javascript, th-TH number to words npm, thai baht in words javascript, thai amount in words nodejs
---

# Thai Number to Words in JavaScript (th-TH)

Use `th-TH` when your app needs Thai wording for receipts, invoices, educational products, or spoken-number features that should feel native to Thai users.

> **Locale codes:** `th-TH` · **Numbering system:** Thai large-number grouping · **Currency:** Baht / Satang · **Script:** Thai

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'th-TH' });

tw.convert(10); // "สิบ"
tw.convert(100);
tw.convert(10000);
tw.convert(1000000);
```

Thai uses native grouping words such as `หมื่น`, `แสน`, and `ล้าน`, which is why a locale-aware library is more reliable than generic English-first number formatters.

## Currency - Baht / Satang

```js
tw.convert(1234.56, { currency: true });
tw.convert('800.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(9);
tw.toOrdinal(10000);
```

## Locale Codes

| Locale code | Country  | Currency      | Notes                                                     |
| ----------- | -------- | ------------- | --------------------------------------------------------- |
| `th-TH`     | Thailand | Baht / Satang | Native Thai wording for currency, cardinals, and ordinals |

## Related

- [Currency guide](/guide/currency)
- [Vietnamese](/locales/vietnamese)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Thai number words?**
Use `th-TH`.

**Q: Does `to-words` handle Thai currency output too?**
Yes. `th-TH` supports Thai Baht and Satang wording via the same currency API used elsewhere in the library.

---
title: Turkish Number to Words in JavaScript (tr-TR) | to-words
description: Convert numbers to Turkish words in JavaScript with tr-TR support, Turkish Lira currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: turkish number to words javascript, tr-TR number to words npm, sayıdan yazıya javascript, turkish lira in words javascript
---

# Turkish Number to Words in JavaScript (tr-TR)

Use `to-words` when you need Turkish cardinals, ordinal words, or invoice totals in a format your application can trust across browsers and Node.js runtimes.

> **Locale codes:** `tr-TR` · **Numbering system:** Short scale · **Currency:** Turkish Lira / Kurus · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'tr-TR' });

tw.convert(137); // "yüz otuz yedi"
tw.convert(4680); // "dört bin altı yüz seksen"
tw.convert(1000000);
```

## Currency - Turkish Lira / Kurus

```js
tw.convert(1234.56, { currency: true });
tw.convert('5000.00', { currency: true, includeZeroFractional: true });
```

Use string input when legal or accounting flows need trailing zeros preserved exactly.

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(23);
tw.toOrdinal(1000);
```

Turkish ships with explicit ordinal mappings, so UI labels like rankings, steps, or competition results stay in full-word form instead of suffix hacks.

## Locale Codes

| Locale code | Country | Currency             | Notes                                                           |
| ----------- | ------- | -------------------- | --------------------------------------------------------------- |
| `tr-TR`     | Turkey  | Turkish Lira / Kurus | Best default for Turkish invoices, forms, and spoken-number UIs |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Turkish number-to-words output?**
Use `tr-TR`.

**Q: Does `to-words` support Turkish ordinal words?**
Yes. `tr-TR` includes ordinal mappings, so `toOrdinal()` works without any custom suffix logic.

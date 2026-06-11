---
title: Hausa Number to Words in JavaScript (ha-NG) | to-words
description: Convert numbers to Hausa words in JavaScript with ha-NG support, Nigerian Naira currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: hausa number to words javascript, ha-NG number to words npm, lissafin hausa javascript, naira da kalmomi
---

# Hausa Number to Words in JavaScript (ha-NG)

Use `ha-NG` when your application needs Hausa number words for Nigerian invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `ha-NG` · **Numbering system:** Short scale · **Currency:** Naira / Kobo · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ha-NG' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Naira / Kobo

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

## Locale Codes

| Locale code | Country | Currency     | Notes                         |
| ----------- | ------- | ------------ | ----------------------------- |
| `ha-NG`     | Nigeria | Naira / Kobo | Standard Hausa number wording |

## Related

- [Currency guide](/guide/currency)
- [Igbo](/locales/igbo)
- [Yoruba](/locales/yoruba)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Hausa number-to-words output?**
Use `ha-NG`.

**Q: Does `to-words` support Hausa ordinal words?**
Yes. `ha-NG` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

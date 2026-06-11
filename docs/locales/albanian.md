---
title: Albanian Number to Words in JavaScript (sq-AL) | to-words
description: Convert numbers to Albanian words in JavaScript with sq-AL support, Albanian Lek currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: albanian number to words javascript, sq-AL number to words npm, numrat me fjalë javascript, lek shqiptar me fjalë
---

# Albanian Number to Words in JavaScript (sq-AL)

Use `sq-AL` when your application needs Albanian number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `sq-AL` · **Numbering system:** Short scale · **Currency:** Lek / Qindarkë · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sq-AL' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Lek / Qindarkë

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

## Gender

Albanian supports grammatical gender. Pass `gender` in options when the sentence context requires it.

```js
tw.convert(1, { gender: 'masculine' });
tw.convert(1, { gender: 'feminine' });
```

## Locale Codes

| Locale code | Country | Currency       | Notes                            |
| ----------- | ------- | -------------- | -------------------------------- |
| `sq-AL`     | Albania | Lek / Qindarkë | Standard Albanian number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Gender guide](/guide/gender)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Albanian number-to-words output?**
Use `sq-AL`.

**Q: Does `to-words` support Albanian ordinal words?**
Yes. `sq-AL` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

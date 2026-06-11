---
title: Polish Number to Words in JavaScript (pl-PL) | to-words
description: Convert numbers to Polish words in JavaScript with pl-PL support, Zloty currency, gender-aware forms, and legal decimal wording. npm install to-words.
head:
  - - meta
    - name: keywords
      content: polish number to words javascript, pl-PL number to words npm, liczba słownie javascript, zloty in words javascript, polish gender numbers javascript
---

# Polish Number to Words in JavaScript (pl-PL)

Use `pl-PL` when you need Polish wording for invoices, cheque-style output, legal decimals, or UI copy where grammatical forms matter.

> **Locale codes:** `pl-PL` · **Numbering system:** European long scale · **Currency:** Złoty / Grosz · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'pl-PL' });

tw.convert(10); // "Dziesięć"
tw.convert(137); // "Sto Trzydzieści Siedem"
tw.convert(1000000);
```

## Currency - Zloty / Grosz

```js
tw.convert(1234.56, { currency: true });
tw.convert('400.00', { currency: true, includeZeroFractional: true });
```

## Gender and Fraction Style

```js
tw.convert(1, { gender: 'feminine' });
tw.convert(2, { gender: 'feminine' });
tw.convert(0.25, { decimalStyle: 'fraction' });
```

Polish supports gender-aware forms and Slavic fraction rules, which is important for banking and legal-style phrasing.

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(12);
tw.toOrdinal(1000000);
```

## Locale Codes

| Locale code | Country | Currency      | Notes                                                              |
| ----------- | ------- | ------------- | ------------------------------------------------------------------ |
| `pl-PL`     | Poland  | Złoty / Grosz | Supports ordinals, fraction-style decimals, and gender-aware forms |

## Related

- [Russian](/locales/russian)
- [Cheque printing](/use-cases/check-printing)
- [Currency guide](/guide/currency)

## FAQ

**Q: Does `pl-PL` support Polish legal decimal wording?**
Yes. Use `decimalStyle: 'fraction'` for formal decimal output.

**Q: Can I apply feminine forms in Polish?**
Yes. `pl-PL` supports gender-aware conversion with `gender: 'feminine'` where the locale defines it.

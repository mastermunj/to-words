---
title: Bengali Number to Words in JavaScript (bn-IN, bn-BD) | to-words
description: Convert numbers to Bengali words in JavaScript for India and Bangladesh. Supports bn-IN, bn-BD, lakh/crore scale, and Taka currency. npm install to-words.
head:
  - - meta
    - name: keywords
      content: bengali number to words javascript, bn-IN number to words npm, bn-BD number to words, বাংলায় সংখ্যা javascript, taka in words bengali javascript
---

# Bengali Number to Words in JavaScript

`to-words` supports Bengali output for both India and Bangladesh, making it practical for invoice totals, educational tools, banking statements, and multilingual commerce flows.

> **Locale codes:** `bn-IN`, `bn-BD` · **Numbering system:** Indian scale · **Currency:** Taka / Poysha · **Script:** Bengali

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const bd = new ToWords({ localeCode: 'bn-BD' });
const bn = new ToWords({ localeCode: 'bn-IN' });

bd.convert(63892); // "তেষট্টি হাজার আট শত বিরানব্বই"
bn.convert(100000); // lakh-scale wording
bn.convert(10000000);
```

Both Bengali locales expose lakh and crore style grouping, which is what most South Asian finance interfaces expect instead of western million-only phrasing.

## Currency - Taka / Poysha

```js
bd.convert(452.36, { currency: true });
bn.convert('1000.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
bd.toOrdinal(3);
bn.toOrdinal(25);
```

## Regional Notes

- `bn-BD` is useful for Bangladesh-specific output
- `bn-IN` covers Bengali-language output in Indian applications
- Both locales use Bengali script and Indian-scale words such as `লাখ` and `কোটি`

## Locale Codes

| Locale code | Country    | Currency      | Notes                                              |
| ----------- | ---------- | ------------- | -------------------------------------------------- |
| `bn-BD`     | Bangladesh | Taka / Poysha | Best fit for Bangladesh billing and education apps |
| `bn-IN`     | India      | Taka / Poysha | Bengali wording with Indian-region locale handling |

## Related

- [Hindi](/locales/hindi)
- [Urdu](/locales/urdu)
- [Currency guide](/guide/currency)

## FAQ

**Q: Do Bengali locales use lakh and crore wording?**
Yes. Both `bn-IN` and `bn-BD` use Indian-scale grouping with words like `লাখ` and `কোটি`.

**Q: Which Bengali locale should I choose?**
Use `bn-BD` for Bangladesh-specific output and `bn-IN` when you want Bengali wording in an India-oriented deployment.

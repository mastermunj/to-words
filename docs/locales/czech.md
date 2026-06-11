---
title: Czech Number to Words in JavaScript (cs-CZ) | to-words
description: Convert numbers to Czech words in JavaScript with cs-CZ support, gender-aware forms, Czech Koruna currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: czech number to words javascript, cs-CZ number to words npm, čísla slovy čeština, česká koruna slovy javascript
---

# Czech Number to Words in JavaScript (cs-CZ)

Use `cs-CZ` when your application needs Czech number words with gender-aware forms and Koruna currency wording for Czech invoices or legal documents.

> **Locale codes:** `cs-CZ` · **Numbering system:** Short scale · **Currency:** Koruna / Haléř · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'cs-CZ' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Koruna / Haléř

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Czech has grammatical gender. Pass `gender` in options when the noun context requires it.

```js
tw.convert(1, { gender: 'masculine' });
tw.convert(1, { gender: 'feminine' });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Locale Codes

| Locale code | Country        | Currency       | Notes                                      |
| ----------- | -------------- | -------------- | ------------------------------------------ |
| `cs-CZ`     | Czech Republic | Koruna / Haléř | Gender-aware forms; standard Czech wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Slovak](/locales/slovak)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Czech number-to-words output?**
Use `cs-CZ`.

**Q: Does `cs-CZ` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

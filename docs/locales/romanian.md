---
title: Romanian Number to Words in JavaScript (ro-RO) | to-words
description: Convert numbers to Romanian words in JavaScript with ro-RO support, gender-aware forms, Romanian Leu currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: romanian number to words javascript, ro-RO number to words npm, număr în cuvinte română, leu românesc în cuvinte javascript
---

# Romanian Number to Words in JavaScript (ro-RO)

Use `ro-RO` when your application needs Romanian number words with gender-aware forms and Leu currency wording for Romanian invoices or legal documents.

> **Locale codes:** `ro-RO` · **Numbering system:** Short scale · **Currency:** Leu / Ban · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ro-RO' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Leu / Ban

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Romanian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country | Currency  | Notes                                         |
| ----------- | ------- | --------- | --------------------------------------------- |
| `ro-RO`     | Romania | Leu / Ban | Gender-aware forms; standard Romanian wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Romanian number-to-words output?**
Use `ro-RO`.

**Q: Does `ro-RO` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

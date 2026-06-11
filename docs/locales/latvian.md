---
title: Latvian Number to Words in JavaScript (lv-LV) | to-words
description: Convert numbers to Latvian words in JavaScript with lv-LV support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: latvian number to words javascript, lv-LV number to words npm, skaitlis vārdos latviešu, eiro vārdos javascript
---

# Latvian Number to Words in JavaScript (lv-LV)

Use `lv-LV` when your application needs Latvian number words with gender-aware forms and Euro currency wording for Latvian invoices or legal documents.

> **Locale codes:** `lv-LV` · **Numbering system:** Short scale · **Currency:** eiro (Euro) / cents · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'lv-LV' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Cents

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Latvian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country | Currency     | Notes                                        |
| ----------- | ------- | ------------ | -------------------------------------------- |
| `lv-LV`     | Latvia  | eiro / cents | Gender-aware forms; standard Latvian wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Lithuanian](/locales/lithuanian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Latvian number-to-words output?**
Use `lv-LV`.

**Q: Does `lv-LV` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

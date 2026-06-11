---
title: Catalan Number to Words in JavaScript (ca-ES) | to-words
description: Convert numbers to Catalan words in JavaScript with ca-ES support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: catalan number to words javascript, ca-ES number to words npm, nombres en paraules català, euro en paraules javascript
---

# Catalan Number to Words in JavaScript (ca-ES)

Use `ca-ES` when your application needs Catalan number words with gender-aware forms and Euro currency wording for Catalonia-specific documents.

> **Locale codes:** `ca-ES` · **Numbering system:** Short scale · **Currency:** Euro / Cèntim · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ca-ES' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Cèntim

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Catalan has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country           | Currency      | Notes                                        |
| ----------- | ----------------- | ------------- | -------------------------------------------- |
| `ca-ES`     | Spain (Catalonia) | Euro / Cèntim | Gender-aware forms; standard Catalan wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Spanish](/locales/spanish)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Catalan number-to-words output?**
Use `ca-ES`.

**Q: Does `ca-ES` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

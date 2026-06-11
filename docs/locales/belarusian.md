---
title: Belarusian Number to Words in JavaScript (be-BY) | to-words
description: Convert numbers to Belarusian words in JavaScript with be-BY support, gender-aware forms, Belarusian Ruble currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: belarusian number to words javascript, be-BY number to words npm, беларускія лічбы словамі, belarusian ruble in words
---

# Belarusian Number to Words in JavaScript (be-BY)

Use `be-BY` when your application needs Belarusian number words with gender-aware forms, Ruble currency wording, and ordinals.

> **Locale codes:** `be-BY` · **Numbering system:** Short scale · **Currency:** Рубель (Ruble) / Капейка (Kopek) · **Script:** Cyrillic

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'be-BY' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Ruble / Kopek

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Belarusian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country | Currency         | Notes                               |
| ----------- | ------- | ---------------- | ----------------------------------- |
| `be-BY`     | Belarus | Рубель / Капейка | Cyrillic script; gender-aware forms |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Russian](/locales/russian)
- [Ukrainian](/locales/ukrainian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Belarusian number-to-words output?**
Use `be-BY`.

**Q: Does `be-BY` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

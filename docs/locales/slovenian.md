---
title: Slovenian Number to Words in JavaScript (sl-SI) | to-words
description: Convert numbers to Slovenian words in JavaScript with sl-SI support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: slovenian number to words javascript, sl-SI number to words npm, število z besedami slovenščina, evro z besedami javascript
---

# Slovenian Number to Words in JavaScript (sl-SI)

Use `sl-SI` when your application needs Slovenian number words with gender-aware forms and Euro currency wording for Slovenian invoices or legal documents.

> **Locale codes:** `sl-SI` · **Numbering system:** Short scale · **Currency:** Evro / Cent · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sl-SI' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Evro / Cent

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Slovenian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country  | Currency    | Notes                                          |
| ----------- | -------- | ----------- | ---------------------------------------------- |
| `sl-SI`     | Slovenia | Evro / Cent | Gender-aware forms; standard Slovenian wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Croatian](/locales/croatian)
- [Serbian](/locales/serbian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Slovenian number-to-words output?**
Use `sl-SI`.

**Q: Does `sl-SI` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

---
title: Serbian Number to Words in JavaScript (sr-RS) | to-words
description: Convert numbers to Serbian words in JavaScript with sr-RS support, gender-aware forms, Serbian Dinar currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: serbian number to words javascript, sr-RS number to words npm, broj rečima srpski, dinar rečima javascript
---

# Serbian Number to Words in JavaScript (sr-RS)

Use `sr-RS` when your application needs Serbian number words with gender-aware forms and Dinar currency wording for Serbian invoices or legal documents.

> **Locale codes:** `sr-RS` · **Numbering system:** Short scale · **Currency:** Dinar / Para · **Script:** Cyrillic

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sr-RS' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Dinar / Para

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Serbian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country | Currency     | Notes                               |
| ----------- | ------- | ------------ | ----------------------------------- |
| `sr-RS`     | Serbia  | Dinar / Para | Cyrillic script; gender-aware forms |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Croatian](/locales/croatian)
- [Russian](/locales/russian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Serbian number-to-words output?**
Use `sr-RS`.

**Q: Does `sr-RS` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

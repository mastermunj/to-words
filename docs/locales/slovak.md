---
title: Slovak Number to Words in JavaScript (sk-SK) | to-words
description: Convert numbers to Slovak words in JavaScript with sk-SK support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: slovak number to words javascript, sk-SK number to words npm, číslo slovom slovenčina, euro slovom javascript
---

# Slovak Number to Words in JavaScript (sk-SK)

Use `sk-SK` when your application needs Slovak number words with gender-aware forms and Euro currency wording for Slovak invoices or legal documents.

> **Locale codes:** `sk-SK` · **Numbering system:** Short scale · **Currency:** Euro / Cent · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sk-SK' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Cent

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Slovak has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country  | Currency    | Notes                                       |
| ----------- | -------- | ----------- | ------------------------------------------- |
| `sk-SK`     | Slovakia | Euro / Cent | Gender-aware forms; standard Slovak wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Czech](/locales/czech)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Slovak number-to-words output?**
Use `sk-SK`.

**Q: Does `sk-SK` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

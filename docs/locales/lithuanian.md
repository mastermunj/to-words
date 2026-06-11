---
title: Lithuanian Number to Words in JavaScript (lt-LT) | to-words
description: Convert numbers to Lithuanian words in JavaScript with lt-LT support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: lithuanian number to words javascript, lt-LT number to words npm, skaičius žodžiais lietuvių, euras žodžiais javascript
---

# Lithuanian Number to Words in JavaScript (lt-LT)

Use `lt-LT` when your application needs Lithuanian number words with gender-aware forms and Euro currency wording for Lithuanian invoices or legal documents.

> **Locale codes:** `lt-LT` · **Numbering system:** Short scale · **Currency:** Euras (Euro) / Centas · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'lt-LT' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Centas

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Lithuanian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country   | Currency       | Notes                                           |
| ----------- | --------- | -------------- | ----------------------------------------------- |
| `lt-LT`     | Lithuania | Euras / Centas | Gender-aware forms; standard Lithuanian wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Latvian](/locales/latvian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Lithuanian number-to-words output?**
Use `lt-LT`.

**Q: Does `lt-LT` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

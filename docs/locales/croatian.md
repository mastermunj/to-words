---
title: Croatian Number to Words in JavaScript (hr-HR) | to-words
description: Convert numbers to Croatian words in JavaScript with hr-HR support, gender-aware forms, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: croatian number to words javascript, hr-HR number to words npm, broj u riječi hrvatski, euro u riječima javascript
---

# Croatian Number to Words in JavaScript (hr-HR)

Use `hr-HR` when your application needs Croatian number words with gender-aware forms and Euro currency wording for Croatian invoices or legal documents.

> **Locale codes:** `hr-HR` · **Numbering system:** Short scale · **Currency:** Euro / Cent · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'hr-HR' });

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

Croatian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country | Currency    | Notes                                         |
| ----------- | ------- | ----------- | --------------------------------------------- |
| `hr-HR`     | Croatia | Euro / Cent | Gender-aware forms; standard Croatian wording |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Serbian](/locales/serbian)
- [Slovenian](/locales/slovenian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Croatian number-to-words output?**
Use `hr-HR`.

**Q: Does `hr-HR` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

---
title: Ukrainian Number to Words in JavaScript (uk-UA) | to-words
description: Convert numbers to Ukrainian words in JavaScript with uk-UA support, gender-aware forms, Ukrainian Hryvnia currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: ukrainian number to words javascript, uk-UA number to words npm, числа словами українська, гривня словами javascript
faq:
  - question: Does Ukrainian number-to-words handle grammatical gender?
    answer: Yes. uk-UA supports feminine and masculine forms for locale-aware wording.
  - question: Does uk-UA work for Hryvnia and Kopek currency output?
    answer: Yes. Ukrainian currency wording is built into the locale configuration.
---

# Ukrainian Number to Words in JavaScript (uk-UA)

Use `uk-UA` when your application needs Ukrainian number words with gender-aware forms and Hryvnia currency wording for Ukrainian invoices or legal documents.

> **Locale codes:** `uk-UA` · **Numbering system:** Short scale · **Currency:** Гривня (Hryvnia) / Копійка (Kopek) · **Script:** Cyrillic

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'uk-UA' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Hryvnia / Kopek

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Ukrainian has grammatical gender. Pass `gender` in options when the noun context requires it.

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
| `uk-UA`     | Ukraine | Гривня / Копійка | Cyrillic script; gender-aware forms |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Russian](/locales/russian)
- [Belarusian](/locales/belarusian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Ukrainian number-to-words output?**
Use `uk-UA`.

**Q: Does `uk-UA` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

**Q: Does uk-UA work for Hryvnia and Kopek currency output?**
Yes. Ukrainian currency wording is built into the locale configuration.

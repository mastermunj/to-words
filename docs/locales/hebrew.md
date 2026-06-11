---
title: Hebrew Number to Words in JavaScript (he-IL, hbo-IL) | to-words
description: Convert numbers to Hebrew words in JavaScript with he-IL and hbo-IL support, gender-aware forms, Israeli Shekel currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: hebrew number to words javascript, he-IL number to words npm, מספרים במילים עברית, שקל במילים javascript
faq:
  - question: Does Hebrew number-to-words handle grammatical gender?
    answer: Yes. he-IL supports masculine and feminine forms for grammatically correct Hebrew output.
  - question: What is the difference between he-IL and hbo-IL?
    answer: he-IL is Modern Hebrew. hbo-IL is Biblical/Ancient Hebrew used for religious or academic contexts. Both support gender-aware forms.
---

# Hebrew Number to Words in JavaScript (he-IL, hbo-IL)

Use `he-IL` for Modern Hebrew or `hbo-IL` for Biblical Hebrew when your application needs Hebrew number words with gender-aware forms and Shekel currency wording.

> **Locale codes:** `he-IL`, `hbo-IL` · **Numbering system:** Short scale · **Currency:** שקל (Shekel) / אגורה (Agora) · **Script:** Hebrew (RTL)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'he-IL' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Gender

Hebrew has grammatical gender. Pass `gender` in options when the noun context requires it.

```js
tw.convert(1, { gender: 'masculine' });
tw.convert(1, { gender: 'feminine' });
```

## Currency - Shekel / Agora

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Biblical Hebrew

```js
const twBiblical = new ToWords({ localeCode: 'hbo-IL' });
twBiblical.convert(1000);
```

`hbo-IL` uses Biblical Hebrew wording and is suited for religious texts, academic publishing, or Torah study apps.

## Locale Codes

| Locale code | Country | Currency    | Notes                                      |
| ----------- | ------- | ----------- | ------------------------------------------ |
| `he-IL`     | Israel  | שקל / אגורה | Modern Hebrew; RTL; gender-aware           |
| `hbo-IL`    | Israel  | שקל / גרה   | Biblical/Ancient Hebrew; RTL; gender-aware |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Modern Hebrew number-to-words output?**
Use `he-IL`.

**Q: Does `he-IL` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

**Q: What is `hbo-IL` for?**
`hbo-IL` is Biblical/Ancient Hebrew, suited for religious texts, academic publishing, or Torah study applications.

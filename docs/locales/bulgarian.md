---
title: Bulgarian Number to Words in JavaScript (bg-BG) | to-words
description: Convert numbers to Bulgarian words in JavaScript with bg-BG support, gender-aware forms, Bulgarian Lev currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: bulgarian number to words javascript, bg-BG number to words npm, числа с думи български, bulgarian lev in words
---

# Bulgarian Number to Words in JavaScript (bg-BG)

Use `bg-BG` when your application needs Bulgarian number words with gender-aware forms and Lev currency wording.

> **Locale codes:** `bg-BG` · **Numbering system:** Short scale · **Currency:** Лев (Lev) / Стотинка (Stotinka) · **Script:** Cyrillic

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'bg-BG' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Lev / Stotinka

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Gender

Bulgarian has grammatical gender. Pass `gender` in options when the noun context requires it.

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

| Locale code | Country  | Currency       | Notes                               |
| ----------- | -------- | -------------- | ----------------------------------- |
| `bg-BG`     | Bulgaria | Лев / Стотинка | Cyrillic script; gender-aware forms |

## Related

- [Currency guide](/guide/currency)
- [Gender guide](/guide/gender)
- [Russian](/locales/russian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Bulgarian number-to-words output?**
Use `bg-BG`.

**Q: Does `bg-BG` support grammatical gender?**
Yes. Pass `gender: 'masculine'` or `gender: 'feminine'` in the options object.

---
title: Amharic Number to Words in JavaScript (am-ET) | to-words
description: Convert numbers to Amharic words in JavaScript with am-ET support, Ethiopian Birr currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: amharic number to words javascript, am-ET number to words npm, ቁጥር ወደ ቃላት javascript, ethiopian birr in words javascript
---

# Amharic Number to Words in JavaScript (am-ET)

Use `am-ET` when your application needs Amharic number words for Ethiopian invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `am-ET` · **Numbering system:** Short scale · **Currency:** ብር (Birr) / ሳንቲም (Santim) · **Script:** Ethiopic (Ge'ez)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'am-ET' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Birr / Santim

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

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/am-ET';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country  | Currency  | Notes                                              |
| ----------- | -------- | --------- | -------------------------------------------------- |
| `am-ET`     | Ethiopia | ብር / ሳንቲም | Standard Amharic number wording in Ethiopic script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Amharic number-to-words output?**
Use `am-ET`.

**Q: Does `to-words` output Amharic in Ethiopic script?**
Yes. `am-ET` produces output in the Ge'ez (Ethiopic) script used for Amharic.

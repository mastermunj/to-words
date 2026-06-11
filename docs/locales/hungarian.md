---
title: Hungarian Number to Words in JavaScript (hu-HU) | to-words
description: Convert numbers to Hungarian words in JavaScript with hu-HU support, Hungarian Forint currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: hungarian number to words javascript, hu-HU number to words npm, szám szóban magyar, forint szavakkal javascript
---

# Hungarian Number to Words in JavaScript (hu-HU)

Use `hu-HU` when your application needs Hungarian number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `hu-HU` · **Numbering system:** Short scale · **Currency:** Forint · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'hu-HU' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Forint

The Hungarian Forint has no fractional unit in common use. Currency output will omit fractional words by default.

```js
tw.convert(5000, { currency: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Locale Codes

| Locale code | Country | Currency | Notes                                          |
| ----------- | ------- | -------- | ---------------------------------------------- |
| `hu-HU`     | Hungary | Forint   | No fractional unit; standard Hungarian wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Czech](/locales/czech)
- [Slovak](/locales/slovak)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Hungarian number-to-words output?**
Use `hu-HU`.

**Q: Does Hungarian Forint have a fractional unit?**
No. The Forint does not have a subdivided currency unit in everyday use, so fractional wording is omitted.

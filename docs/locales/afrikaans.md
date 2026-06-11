---
title: Afrikaans Number to Words in JavaScript (af-ZA) | to-words
description: Convert numbers to Afrikaans words in JavaScript with af-ZA support, South African Rand currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: afrikaans number to words javascript, af-ZA number to words npm, nommer na woorde javascript, south african rand in words javascript
---

# Afrikaans Number to Words in JavaScript (af-ZA)

Use `af-ZA` when your application needs Afrikaans number words for South African invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `af-ZA` · **Numbering system:** Short scale · **Currency:** Rand / Sent · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'af-ZA' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Rand / Sent

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

## Locale Codes

| Locale code | Country      | Currency    | Notes                             |
| ----------- | ------------ | ----------- | --------------------------------- |
| `af-ZA`     | South Africa | Rand / Sent | Standard Afrikaans number wording |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Afrikaans number-to-words output?**
Use `af-ZA`.

**Q: Does `to-words` support Afrikaans ordinal words?**
Yes. `af-ZA` includes ordinal mappings so `toOrdinal()` works without any custom suffix logic.

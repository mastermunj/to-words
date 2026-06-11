---
title: Swahili Number to Words in JavaScript (sw-KE, sw-TZ) | to-words
description: Convert numbers to Swahili words in JavaScript with sw-KE and sw-TZ support, Kenyan and Tanzanian Shilling currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: swahili number to words javascript, sw-KE number to words npm, nambari kwa maneno kiswahili, shilingi kwa maneno javascript
---

# Swahili Number to Words in JavaScript (sw-KE, sw-TZ)

Use `sw-KE` or `sw-TZ` when your application needs Swahili number words for East African invoicing, checkout flows, or documents that print totals in full words.

> **Locale codes:** `sw-KE`, `sw-TZ` · **Numbering system:** Short scale · **Currency:** Shilingi / Senti · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'sw-KE' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Shilingi / Senti

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Tanzania (sw-TZ)

```js
const twTZ = new ToWords({ localeCode: 'sw-TZ' });
twTZ.convert(1234.56, { currency: true });
// Uses Tanzanian Shilling (TSh)
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Locale Codes

| Locale code | Country  | Currency               | Notes                               |
| ----------- | -------- | ---------------------- | ----------------------------------- |
| `sw-KE`     | Kenya    | Shilingi / Senti (KSh) | Standard Kenyan Swahili wording     |
| `sw-TZ`     | Tanzania | Shilingi / Senti (TSh) | Tanzanian Swahili with TZS currency |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Swahili number-to-words output?**
Use `sw-KE` for Kenya. Use `sw-TZ` for Tanzania.

**Q: Does `to-words` support Swahili ordinal words?**
Yes. Both `sw-KE` and `sw-TZ` include ordinal mappings.

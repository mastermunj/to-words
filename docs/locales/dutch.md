---
title: Dutch Number to Words in JavaScript (nl-NL, nl-SR) | to-words
description: Convert numbers to Dutch words in JavaScript with nl-NL and nl-SR support, Euro and Surinamese Dollar currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: dutch number to words javascript, nl-NL number to words npm, getal naar woorden nederlands, euro in woorden javascript
---

# Dutch Number to Words in JavaScript (nl-NL, nl-SR)

Use `nl-NL` or `nl-SR` when your application needs Dutch number words for invoicing, checkout flows, or legal documents that print totals in full words.

> **Locale codes:** `nl-NL`, `nl-SR` · **Numbering system:** Short scale · **Currency:** Euro / Cent (nl-NL), Surinaamse dollar / Cent (nl-SR) · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'nl-NL' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Euro / Cent

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Suriname (nl-SR)

```js
const twSR = new ToWords({ localeCode: 'nl-SR' });
twSR.convert(1234.56, { currency: true });
// Uses Surinaamse dollar / Cent
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Locale Codes

| Locale code | Country     | Currency                 | Notes                                 |
| ----------- | ----------- | ------------------------ | ------------------------------------- |
| `nl-NL`     | Netherlands | Euro / Cent              | Standard Dutch number wording         |
| `nl-SR`     | Suriname    | Surinaamse dollar / Cent | Dutch-based wording with SRD currency |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [German](/locales/german)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Dutch number-to-words output?**
Use `nl-NL` for Netherlands. Use `nl-SR` for Suriname.

**Q: Does `to-words` support Dutch ordinal words?**
Yes. Both `nl-NL` and `nl-SR` include ordinal mappings.

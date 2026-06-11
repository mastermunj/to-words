---
title: Malay Number to Words in JavaScript (ms-MY, ms-SG) | to-words
description: Convert numbers to Malay words in JavaScript with ms-MY and ms-SG support, Ringgit and Singapore Dollar currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: malay number to words javascript, ms-MY number to words npm, nombor dalam perkataan melayu, ringgit dalam perkataan javascript
---

# Malay Number to Words in JavaScript (ms-MY, ms-SG)

Use `ms-MY` or `ms-SG` when your application needs Malay number words for Malaysian or Singaporean invoicing, checkout flows, or legal documents.

> **Locale codes:** `ms-MY`, `ms-SG` · **Numbering system:** Short scale · **Currency:** Ringgit / Sen (ms-MY), Dolar / Sen (ms-SG) · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ms-MY' });

tw.convert(100);
tw.convert(1000);
tw.convert(1000000);
```

## Currency - Ringgit / Sen

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Singapore (ms-SG)

```js
const twSG = new ToWords({ localeCode: 'ms-SG' });
twSG.convert(1234.56, { currency: true });
// Uses Singapore Dollar (S$)
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(10);
tw.toOrdinal(100);
```

## Locale Codes

| Locale code | Country   | Currency      | Notes                             |
| ----------- | --------- | ------------- | --------------------------------- |
| `ms-MY`     | Malaysia  | Ringgit / Sen | Standard Malaysian Malay wording  |
| `ms-SG`     | Singapore | Dolar / Sen   | Singapore Malay with SGD currency |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [Indonesian / Javanese](/locales/indonesian)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Malaysian Malay number-to-words output?**
Use `ms-MY` for Malaysia. Use `ms-SG` for Singapore.

**Q: Does `to-words` support Malay ordinal words?**
Yes. Both `ms-MY` and `ms-SG` include ordinal mappings.

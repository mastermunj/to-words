---
title: Italian Number to Words in JavaScript (it-IT) | to-words
description: Convert numbers to Italian words in JavaScript with it-IT support, Euro currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: italian number to words javascript, it-IT number to words npm, numero in parole javascript, euro in parole javascript
---

# Italian Number to Words in JavaScript (it-IT)

Use `it-IT` when your application needs Italian number words for finance, checkout flows, ERP systems, or legal documents that print totals in full words.

> **Locale codes:** `it-IT` · **Numbering system:** European long scale · **Currency:** Euro / Centesimi · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'it-IT' });

tw.convert(10); // "Dieci"
tw.convert(100); // "Cento"
tw.convert(1000);
tw.convert(1000000);
```

Italian uses the European long-scale sequence with words such as `Miliardo` and `Bilione`, which matters when your product handles very large values.

## Currency - Euro / Centesimi

```js
tw.convert(1234.56, { currency: true });
tw.convert('500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(12);
tw.toOrdinal(1000000);
```

## Locale Codes

| Locale code | Country | Currency         | Notes                                                       |
| ----------- | ------- | ---------------- | ----------------------------------------------------------- |
| `it-IT`     | Italy   | Euro / Centesimi | Good default for Italian web apps, invoicing, and reporting |

## Related

- [Currency guide](/guide/currency)
- [German](/locales/german)
- [French](/locales/french)

## FAQ

**Q: Which locale code should I use for Italian?**
Use `it-IT`.

**Q: Does the Italian locale handle ordinal words too?**
Yes. `toOrdinal()` works with `it-IT`, so you can generate full ordinal wording without manual suffix rules.

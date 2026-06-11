---
title: Urdu Number to Words in JavaScript (ur-PK) | to-words
description: Convert numbers to Urdu words in JavaScript with ur-PK support, Pakistani Rupee currency, RTL script, and lakh/crore wording. npm install to-words.
head:
  - - meta
    - name: keywords
      content: urdu number to words javascript, ur-PK number to words npm, pakistani rupee in words javascript, urdu lakh crore javascript
---

# Urdu Number to Words in JavaScript (ur-PK)

Use `ur-PK` when your application needs right-to-left Urdu output for invoices, printed forms, cheque flows, or spoken-number interfaces in Pakistan.

> **Locale codes:** `ur-PK` · **Numbering system:** Indian scale · **Currency:** Pakistani Rupee / Paisa · **Script:** Urdu (RTL)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ur-PK' });

tw.convert(137);
tw.convert(100000); // lakh-scale wording
tw.convert(10000000); // crore-scale wording
```

## Currency - Pakistani Rupee / Paisa

```js
tw.convert(452.36, { currency: true });
tw.convert('1500.00', { currency: true, includeZeroFractional: true });
```

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(11);
tw.toOrdinal(100000);
```

## RTL and Legal Output Notes

- Render Urdu output inside a `dir="rtl"` container in HTML so punctuation and UI chrome align correctly
- `ur-PK` supports fraction-style decimals too, which is helpful for cheque and banking language
- Large values follow lakh and crore conventions instead of western million-first grouping

## Locale Codes

| Locale code | Country  | Currency      | Notes                                          |
| ----------- | -------- | ------------- | ---------------------------------------------- |
| `ur-PK`     | Pakistan | Rupee / Paisa | RTL Urdu wording with lakh and crore groupings |

## Related

- [Hindi](/locales/hindi)
- [Bengali](/locales/bengali)
- [Cheque printing](/use-cases/check-printing)

## FAQ

**Q: Does `to-words` support Urdu RTL output?**
Yes. `ur-PK` returns Urdu script, and you should render it inside an RTL container on the web.

**Q: Does the Urdu locale use lakh and crore?**
Yes. `ur-PK` follows South Asian numbering with lakh and crore scale words.

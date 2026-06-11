---
title: Persian Number to Words in JavaScript (fa-IR) | to-words
description: Convert numbers to Persian or Farsi words in JavaScript with fa-IR support, RTL output, and Toman or Rial-style currency wording. npm install to-words.
head:
  - - meta
    - name: keywords
      content: persian number to words javascript, farsi number to words npm, fa-IR number to words, عدد به حروف javascript, rtl persian numbers javascript
---

# Persian Number to Words in JavaScript (fa-IR)

Use `fa-IR` when your app needs Persian or Farsi number words for financial flows, right-to-left UI, or spoken-number output in Iranian deployments.

> **Locale codes:** `fa-IR` · **Numbering system:** Persian large-number words · **Currency:** Toman / Rial forms · **Script:** Persian (RTL)

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'fa-IR' });

tw.convert(137); // "صد و سی و هفت"
tw.convert(63892); // "شصت و سه هزار و هشتصد و نود و دو"
tw.convert(1000000);
```

## Currency - Toman / Rial Forms

```js
tw.convert(1250, { currency: true });
tw.convert('500.50', { currency: true });
```

The built-in currency config uses Persian-friendly forms rather than forcing a westernised currency naming model.

## Ordinal Numbers

```js
tw.toOrdinal(1);
tw.toOrdinal(8);
tw.toOrdinal(1000000);
```

## RTL and Fraction Style

- Render output in an RTL container for correct web layout
- `fa-IR` supports fraction-style decimals, so legal and financial wording can avoid raw digit-by-digit decimal output
- This locale is useful anywhere you would otherwise reach for a bespoke `عدد به حروف` utility

## Locale Codes

| Locale code | Country | Currency           | Notes                                                   |
| ----------- | ------- | ------------------ | ------------------------------------------------------- |
| `fa-IR`     | Iran    | Toman / Rial forms | RTL Persian wording with fraction-style decimal support |

## Related

- [Cheque printing](/use-cases/check-printing)
- [Arabic](/locales/arabic)
- [All locales](/locales/)

## FAQ

**Q: Does `to-words` return RTL Persian text for `fa-IR`?**
Yes. `fa-IR` returns Persian script and should be displayed in an RTL container.

**Q: Can I use `fa-IR` for legal or financial decimal wording?**
Yes. The locale supports fraction-style decimal output for more formal written amounts.

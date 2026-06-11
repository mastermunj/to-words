---
title: Indonesian Number to Words in JavaScript (id-ID, jv-ID) | to-words
description: Convert numbers to Indonesian and Javanese words in JavaScript. Supports id-ID, jv-ID, Rupiah currency, and terbilang-style output. npm install to-words.
head:
  - - meta
    - name: keywords
      content: indonesian number to words javascript, terbilang javascript, id-ID number to words npm, jv-ID number words, rupiah in words javascript
---

# Indonesian Number to Words in JavaScript

Use this page when you need **Bahasa Indonesia** or **Javanese** number words in product flows like invoices, banking summaries, receipts, or spoken-number interfaces.

> **Locale codes:** `id-ID`, `jv-ID` · **Numbering system:** Short scale · **Currency:** Rupiah / Sen · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const id = new ToWords({ localeCode: 'id-ID' });
const jv = new ToWords({ localeCode: 'jv-ID' });

id.convert(137); // "Seratus Tiga Puluh Tujuh"
id.convert(1000000);

jv.convert(2500);
jv.convert(1000000);
```

`id-ID` is the safest default when your UI copy is in Indonesian. `jv-ID` is useful for region-specific experiences where Javanese phrasing matters.

## Currency - Rupiah / Sen

```js
id.convert(98000, { currency: true });
id.convert('1250.50', { currency: true });

jv.convert(78000, { currency: true });
```

## Ordinal Numbers

```js
id.toOrdinal(3);
id.toOrdinal(21);
```

## Regional Notes

- `id-ID` uses Indonesian number words like `Juta`, `Miliar`, and `Triliun`
- `jv-ID` provides Javanese wording while keeping the same API shape, so you can switch locales without rewriting application logic
- `id-ID` also supports fraction-style decimals for legal and financial wording

## Locale Codes

| Locale code | Language   | Currency     | Notes                                                      |
| ----------- | ---------- | ------------ | ---------------------------------------------------------- |
| `id-ID`     | Indonesian | Rupiah / Sen | Best default for Indonesian products and admin tools       |
| `jv-ID`     | Javanese   | Rupiah / Sen | Useful for region-specific apps and localised voice output |

## Related

- [Currency guide](/guide/currency)
- [All locales](/locales/)
- [Vietnamese](/locales/vietnamese)

## FAQ

**Q: Does `to-words` support terbilang-style Indonesian output?**
Yes. Use `id-ID` for Indonesian wording with the standard `convert()`, `toOrdinal()`, and currency APIs.

**Q: Can I switch between Indonesian and Javanese without changing my app code?**
Yes. Keep the same API and swap only the locale code between `id-ID` and `jv-ID`.

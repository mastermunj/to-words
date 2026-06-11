---
title: Arabic Number to Words in JavaScript (9 Locales) | to-words
description: Convert numbers to Arabic words in JavaScript across 9 locales. Supports RTL output, gender-aware wording, and 3-decimal Iraqi Dinar currency. npm to-words.
head:
  - - meta
    - name: keywords
      content: arabic number to words javascript, ar-SA ar-EG ar-AE to-words, arabic words npm, تحويل الأرقام إلى كلمات
  - - meta
    - property: og:title
      content: Arabic Number to Words in JavaScript (9 Locales) | to-words
faq:
  - question: Does to-words support RTL Arabic output?
    answer: Yes. Arabic locales return Arabic script and should be rendered in an RTL container in HTML.
  - question: Which Arabic locale supports 3-decimal currency wording?
    answer: ar-IQ includes Iraqi Dinar precision with three decimal places.
  - question: Can I control grammatical gender in Arabic number words?
    answer: Yes. Arabic locales support feminine and masculine gender-aware conversion.
---

# Arabic Number to Words in JavaScript

Convert numbers to **Arabic words** across 9 regional locales. Handles RTL text, dual (مثنى), 3-decimal currencies (Dinar, Rial), and Eastern Arabic numerals.

> **Locale codes:** `ar-AE`, `ar-DZ`, `ar-EG`, `ar-IQ`, `ar-LB`, `ar-MA`, `ar-SA`, `ar-SD`, `ar-YE` · **Numbering system:** Short scale · **Currency:** Region-specific Arabic currencies · **Script:** Arabic (RTL)

| Locale  | Country      | Currency                  |
| ------- | ------------ | ------------------------- |
| `ar-AE` | UAE          | Dirham (درهم)             |
| `ar-DZ` | Algeria      | Dinar (دينار)             |
| `ar-EG` | Egypt        | Pound (جنيه)              |
| `ar-IQ` | Iraq         | Dinar (دينار) — 3 decimal |
| `ar-LB` | Lebanon      | Pound (ليرة)              |
| `ar-MA` | Morocco      | Dirham (درهم)             |
| `ar-SA` | Saudi Arabia | Riyal (ريال)              |
| `ar-SD` | Sudan        | Pound (جنيه)              |
| `ar-YE` | Yemen        | Rial (ريال)               |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ar-SA' });

tw.convert(12345);
// "اثنا عشر ألفاً وثلاثمائة وخمسة وأربعون"

tw.convert(1234.56, { currency: true });
// "ألف ومئتان وأربعة وثلاثون ريالاً وستة وخمسون هللة"
```

## Gender Support

```js
const tw = new ToWords({ localeCode: 'ar-AE' });

tw.convert(3, { gender: 'masculine' });
tw.convert(3, { gender: 'feminine' });
tw.convert(21, { gender: 'feminine' });
```

Arabic is one of the locale families where gender changes the actual numeral wording, so this matters for invoices, legal text, and voice output.

## Iraq — 3-decimal Dinar (IQD)

```js
const iq = new ToWords({ localeCode: 'ar-IQ' });
iq.convert('1.500', { currency: true });
// "دينار واحد وخمسمائة فلس"
```

## Locale Codes

| Locale code | Country              | Currency       | Notes                                 |
| ----------- | -------------------- | -------------- | ------------------------------------- |
| `ar-AE`     | United Arab Emirates | Dirham / Fils  | Arabic wording for UAE deployments    |
| `ar-DZ`     | Algeria              | Dinar          | Arabic wording for Algeria            |
| `ar-EG`     | Egypt                | Pound          | Arabic wording for Egypt              |
| `ar-IQ`     | Iraq                 | Dinar / Fils   | Built-in 3-decimal currency handling  |
| `ar-LB`     | Lebanon              | Pound          | Arabic wording for Lebanon            |
| `ar-MA`     | Morocco              | Dirham         | Arabic wording for Morocco            |
| `ar-SA`     | Saudi Arabia         | Riyal / Halala | Strong default for Gulf-region Arabic |
| `ar-SD`     | Sudan                | Pound          | Arabic wording for Sudan              |
| `ar-YE`     | Yemen                | Rial           | Arabic wording for Yemen              |

## Tree-shakeable import

```js
import { toWords } from 'to-words/ar-SA';
toWords(1000); // "ألف"
```

## Related

- [Gender guide](/guide/gender)
- [Cheque printing](/use-cases/check-printing)
- [Persian](/locales/persian)

## FAQ

**Q: What locale should I use for Saudi Arabia?**  
A: `ar-SA`.

**Q: Does it handle right-to-left (RTL) output?**  
A: Yes, the output is naturally RTL Arabic text — wrap it in a `dir="rtl"` container in HTML.

**Q: Which Arabic locales support 3-decimal currencies?**  
A: `ar-IQ` (Iraqi Dinar) ships with 3-decimal precision in the current locale set.

---
title: English Number to Words in JavaScript (31 Locales) | to-words
description: Convert numbers to English words in JavaScript across 31 locales including en-US, en-GB, en-IN, en-AU, en-CA, and more. Supports currency wording, ordinals, and regional numbering differences.
head:
  - - meta
    - name: keywords
      content: english number to words javascript, en-US en-GB en-IN to-words, english amount in words npm
faq:
  - question: Which English locale should I use for Indian numbering?
    answer: Use en-IN when you need lakh, crore, arab, kharab, and related Indian-scale wording.
  - question: Do English locales differ by country?
    answer: Yes. Currency names differ by region, and en-IN uses Indian numbering instead of short-scale million and billion wording.
  - question: Can I import a single English locale?
    answer: Yes. Use subpath imports such as to-words/en-US or to-words/en-IN when bundle size matters.
---

# English Number to Words in JavaScript

Convert numbers to English words across 31 regional locales. This is the guide to use when your product spans US, UK, Canada, South Asia, Africa, the Gulf, or APAC English deployments.

> **Locale coverage:** 31 regional English locales · **Numbering systems:** Short scale + Indian scale (`en-IN`) · **Currency:** Region-specific English currencies · **Script:** Latin

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const us = new ToWords({ localeCode: 'en-US' });

us.convert(12345);
// "Twelve Thousand Three Hundred Forty Five"

us.convert(1234.56, { currency: true });
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

## Indian English (`en-IN`)

```js
import { ToWords } from 'to-words/en-IN';

const indian = new ToWords();

indian.convert(792581);
// "Seven Lakh Ninety Two Thousand Five Hundred Eighty One"

indian.convert(86429753);
// "Eight Crore Sixty Four Lakh Twenty Nine Thousand Seven Hundred Fifty Three"
```

Use `en-IN` when finance, payroll, or legal documents need lakh and crore wording rather than million and billion wording.

## Common English Locale Choices

| Locale code | Best fit               | Notes                     |
| ----------- | ---------------------- | ------------------------- |
| `en-US`     | United States apps     | Default US Dollar wording |
| `en-GB`     | United Kingdom apps    | Pound / Pence wording     |
| `en-IN`     | India                  | Indian numbering system   |
| `en-CA`     | Canada                 | Canadian Dollar wording   |
| `en-AU`     | Australia              | Australian Dollar wording |
| `en-SG`     | Singapore              | Singapore Dollar wording  |
| `en-AE`     | UAE English interfaces | Dirham wording in English |
| `en-ZA`     | South Africa           | Rand wording              |

If two locales both read like English, choose the one that matches the deployed country so currency names and regional defaults stay aligned.

## Full Supported English Locale Codes

- Americas: `en-CA`, `en-JM`, `en-TT`, `en-US`
- Europe: `en-GB`, `en-IE`
- Middle East and North Africa: `en-AE`, `en-IQ`, `en-MA`, `en-OM`, `en-SA`
- Africa: `en-GH`, `en-KE`, `en-MU`, `en-NG`, `en-TZ`, `en-UG`, `en-ZA`, `en-ZW`
- South Asia: `en-BD`, `en-IN`, `en-LK`, `en-NP`, `en-PK`
- Asia-Pacific: `en-AU`, `en-HK`, `en-MM`, `en-MY`, `en-NZ`, `en-PH`, `en-SG`

## Ordinal Numbers

```js
import { ToWords } from 'to-words/en-GB';

const gb = new ToWords();

gb.toOrdinal(1); // "First"
gb.toOrdinal(21); // "Twenty First"
```

## Tree-shakeable Import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/en-US';

toWords(1000);
toCurrency(42.5);
toOrdinal(3);
```

## Related

- [All locales](/locales/)
- [Currency guide](/guide/currency)
- [Tree-shaking guide](/guide/tree-shaking)

## FAQ

**Q: Which locale should I use for Indian numbering in English?**  
A: Use `en-IN` when you need lakh and crore wording.

**Q: Do English locales differ by country?**  
A: Yes. Currency names differ across countries, and `en-IN` uses Indian numbering instead of short-scale numbering.

**Q: Can I import just one English locale?**  
A: Yes. Use `to-words/en-US`, `to-words/en-GB`, `to-words/en-IN`, or the locale subpath that matches your deployment.

---
title: Hindi Number to Words in JavaScript (hi-IN) | to-words
description: Convert numbers to words in Hindi with hi-IN, Devanagari script, Rupee currency, and Indian numbering terms like lakh and crore. npm install to-words.
head:
  - - meta
    - name: keywords
      content: hindi number to words javascript, संख्या को शब्दों में, hi-IN to-words, number to words hindi npm, lakh crore to words javascript
  - - meta
    - property: og:title
      content: Hindi Number to Words in JavaScript (hi-IN) | to-words
faq:
  - question: How do I convert numbers to words in Hindi using JavaScript?
    answer: Install to-words, initialize ToWords with hi-IN, and call convert to get Devanagari Hindi output.
  - question: Does to-words support Indian number scale in Hindi?
    answer: Yes. hi-IN uses lakh, crore, arab, kharab, neel, padma, and shankh-style grouping.
  - question: Can I keep Indian grouping but switch to English output?
    answer: Yes. Use en-IN for English wording with Indian-scale grouping.
---

# Hindi Number to Words in JavaScript (hi-IN)

Convert numbers to **Hindi words** in JavaScript and TypeScript using `to-words` — the only npm library with native Devanagari script, Indian scale (लाख, करोड़, अरब), and currency support.

> **Locale codes:** `hi-IN` · **Numbering system:** Indian · **Currency:** Rupee / Paise · **Script:** Devanagari

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'hi-IN' });

tw.convert(12345); // "बारह हजार तीन सौ पैंतालीस"
tw.convert(100000); // "एक लाख"
tw.convert(10000000); // "एक करोड़"
```

## Currency (Rupees & Paise)

```js
tw.convert(1234.56, { currency: true });
// "बारह सौ चौंतीस रुपये और छप्पन पैसे"
```

## Ordinal Numbers

```js
tw.toOrdinal(3); // "तीसरा"
tw.toOrdinal(21);
```

## Indian Scale

| Value                   | English      | Hindi    |
| ----------------------- | ------------ | -------- |
| 100                     | One Hundred  | एक सौ    |
| 1,000                   | One Thousand | एक हजार  |
| 100,000                 | One Lakh     | एक लाख   |
| 10,000,000              | One Crore    | एक करोड़ |
| 1,000,000,000           | One Arab     | एक अरब   |
| 100,000,000,000         | One Kharab   | एक खरब   |
| 10,000,000,000,000      | One Neel     | एक नील   |
| 1,000,000,000,000,000   | One Padma    | एक पद्म  |
| 100,000,000,000,000,000 | One Shankh   | एक शंख   |

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/hi-IN';

toWords(50000); // "पचास हजार"
toCurrency(999.99); // "नौ सौ निन्यानवे रुपये और निन्यानवे पैसे"
```

## Locale Codes

| Locale code | Country | Currency      | Notes                                                 |
| ----------- | ------- | ------------- | ----------------------------------------------------- |
| `hi-IN`     | India   | Rupee / Paise | Hindi output in Devanagari with Indian-scale grouping |

## Related

- [Bengali](/locales/bengali)
- [Urdu](/locales/urdu)
- [Currency guide](/guide/currency)

## FAQ

**Q: What locale code should I use for Hindi?**  
A: `hi-IN`.

**Q: Does it use the Indian numbering system (lakh/crore)?**  
A: Yes — 100,000 = "एक लाख", not "One Hundred Thousand".

**Q: Is Devanagari script output supported?**  
A: Yes, by default. You get native Devanagari for all conversions.

**Q: Can I get numbers in English but with Indian scale?**  
A: Use `en-IN` instead of `hi-IN`.

---
title: Portuguese Number to Words in JavaScript (pt-BR, pt-PT) | to-words
description: Convert numbers to Portuguese words in JavaScript for Brazil, Portugal, Angola, and Mozambique with currency and gender support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: portuguese number to words javascript, pt-BR to-words npm, numero por extenso javascript
faq:
  - question: Is there a difference between pt-BR and pt-PT?
    answer: Yes. Currency names and some wording conventions differ between Brazilian and European Portuguese.
  - question: Does to-words support grammatical gender in Portuguese?
    answer: Yes. Portuguese locales support gender-aware number words such as Dois and Duas.
  - question: Which locale should I use for Brazilian Portuguese?
    answer: Use pt-BR for Brazil and Real currency wording.
---

# Portuguese Number to Words JavaScript

4 Portuguese locales — Brazil, Portugal, Angola, Mozambique.

| Locale  | Country    | Currency |
| ------- | ---------- | -------- |
| `pt-BR` | Brazil     | Real     |
| `pt-PT` | Portugal   | Euro     |
| `pt-AO` | Angola     | Kwanza   |
| `pt-MZ` | Mozambique | Metical  |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'pt-BR' });
tw.convert(12345); // "Doze Mil Trezentos E Quarenta E Cinco"
tw.convert(1234.56, { currency: true }); // "Mil Duzentos E Trinta E Quatro Reais E Cinquenta E Seis Centavos"
```

## FAQ

**Q: Is there a difference between pt-BR and pt-PT?**  
A: Yes — primarily currency and minor spelling conventions.

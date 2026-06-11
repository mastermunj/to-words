---
title: Korean Number to Words in JavaScript (ko-KR) | to-words
description: Convert numbers to Korean words in JavaScript with ko-KR, East Asian large-number units, and Won currency wording. npm install to-words.
head:
  - - meta
    - name: keywords
      content: korean number to words javascript, ko-KR to-words npm, 숫자 한국어 javascript
faq:
  - question: Which locale code is used for Korean number words?
    answer: Use ko-KR.
  - question: Does Korean output use East Asian units such as 만 and 억?
    answer: Yes. ko-KR uses East Asian large-number units such as 만, 억, and 조.
---

# Korean Number to Words in JavaScript (ko-KR)

> **Locale codes:** `ko-KR` · **Numbering system:** East Asian · **Currency:** Won · **Script:** Hangul

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ko-KR' });
tw.convert(12345); // "만 이천삼백사십오"
tw.convert(1234, { currency: true }); // "천이백삼십사 원"
```

## East Asian Scale

| Value | Character |
| ----- | --------- |
| 10^4  | 만        |
| 10^8  | 억        |
| 10^12 | 조        |

## Related

- [Chinese](/locales/chinese)
- [Japanese](/locales/japanese)
- [Currency guide](/guide/currency)

## FAQ

**Q: What locale code is used for Korean?**  
A: `ko-KR`.

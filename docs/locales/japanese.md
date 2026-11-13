---
title: Japanese Number to Words in JavaScript (ja-JP) | to-words
description: Convert numbers to Japanese words in JavaScript with ja-JP, East Asian scale units like 万 and 億, and Yen currency support. npm install to-words.
head:
  - - meta
    - name: keywords
      content: japanese number to words javascript, ja-JP to-words npm, 数字 日本語 javascript
faq:
  - question: Which locale code is used for Japanese number words?
    answer: Use ja-JP.
  - question: Does Japanese output use East Asian scale units like 万 and 億?
    answer: Yes. ja-JP uses East Asian large-number units such as 万, 億, and 兆.
---

# Japanese Number to Words in JavaScript (ja-JP)

> **Locale codes:** `ja-JP` · **Numbering system:** East Asian · **Currency:** Yen · **Script:** Kanji + Kana

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ja-JP' });
tw.convert(12345); // "一万二千三百四十五"
tw.convert(100000000); // "一億"
tw.convert(1234, { currency: true }); // "千二百三十四円"
```

## East Asian Scale

| Value | Character |
| ----- | --------- |
| 10^4  | 万        |
| 10^8  | 億        |
| 10^12 | 兆        |
| 10^16 | 京        |

## Related

- [Chinese](/locales/chinese)
- [Korean](/locales/korean)
- [Currency guide](/guide/currency)

## FAQ

**Q: What locale code is used for Japanese?**  
A: `ja-JP`.

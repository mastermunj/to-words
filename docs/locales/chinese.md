---
title: Chinese Number to Words in JavaScript (zh-CN, zh-TW, yue-HK) | to-words
description: Convert numbers to Chinese words in JavaScript for Simplified Chinese, Traditional Chinese, and Cantonese with formal financial characters. npm to-words.
head:
  - - meta
    - name: keywords
      content: chinese number to words javascript, zh-CN to-words npm, 数字转中文, 大写数字 javascript
faq:
  - question: What does formal Chinese output mean in to-words?
    answer: Formal mode uses financial characters such as 壹 and 貳 that are common in banking and anti-fraud documents.
  - question: Does to-words support Cantonese as well as Mandarin variants?
    answer: Yes. Use yue-HK for Cantonese, zh-CN for Simplified Chinese, and zh-TW for Traditional Chinese.
  - question: Which numbering system do Chinese locales use?
    answer: Chinese locales use East Asian large-number units such as 万, 億, 兆, and 京.
---

# Chinese Number to Words JavaScript

3 Chinese locales — Simplified, Traditional, and Cantonese.

| Locale   | Variant               | Script |
| -------- | --------------------- | ------ |
| `zh-CN`  | Simplified Chinese    | 简体   |
| `zh-TW`  | Traditional Chinese   | 繁體   |
| `yue-HK` | Cantonese (Hong Kong) | 繁體   |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'zh-CN' });
tw.convert(12345); // "一万二千三百四十五"
```

## Formal Characters (大写 / Anti-fraud)

```js
tw.convert(12345, { formal: true }); // "壹万贰仟叁佰肆拾伍"
```

## FAQ

**Q: What is the `formal` option for Chinese?**  
A: Formal characters (大写, dàxiě) are used in banking, invoicing, and legal documents to prevent fraud. Pass `{ formal: true }`.

**Q: Is Cantonese (yue-HK) different from Mandarin zh-TW?**  
A: They share script but use different numerals/vocabulary in some cases.

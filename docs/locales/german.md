---
title: German Number to Words in JavaScript (de-DE, de-AT, de-CH) | to-words
description: Convert numbers to German words in JavaScript for Germany, Austria, and Switzerland. Includes long-scale wording and regional currency differences. npm to-words.
head:
  - - meta
    - name: keywords
      content: german number to words javascript, de-DE to-words npm, Zahl in Worten javascript
faq:
  - question: What is the difference between de-DE, de-AT, and de-CH?
    answer: The main difference is regional currency naming. de-CH uses Swiss Franc wording, while de-DE and de-AT use Euro.
  - question: Does to-words handle German long-scale wording?
    answer: Yes. German uses long-scale names such as Milliarde for 10^9 and the locale follows that convention.
  - question: Can I generate ordinal words in German?
    answer: Yes. German locales support ordinal output through toOrdinal().
---

# German Number to Words JavaScript

3 German locales — Germany, Austria, Switzerland.

| Locale  | Country     | Currency    |
| ------- | ----------- | ----------- |
| `de-DE` | Germany     | Euro        |
| `de-AT` | Austria     | Euro        |
| `de-CH` | Switzerland | Swiss Franc |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'de-DE' });

tw.convert(12345);
// "Zwölf Tausend Drei Hundert Fünf Und Vierzig"

tw.convert(1234.56, { currency: true });
// "Ein Tausend Zwei Hundert Vier Und Dreißig Euro Und Sechsundfünfzig Cent"
```

## FAQ

**Q: What is the difference between de-DE, de-AT, de-CH?**  
A: Primarily the currency name. de-CH uses Swiss Franc (Franken) instead of Euro.

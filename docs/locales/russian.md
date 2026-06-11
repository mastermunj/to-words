---
title: Russian Number to Words in JavaScript (ru-RU) | to-words
description: Convert numbers to Russian words in JavaScript with ru-RU, gender-aware forms, Ruble currency, and Slavic-style decimal behavior. npm install to-words.
head:
  - - meta
    - name: keywords
      content: russian number to words javascript, ru-RU to-words npm, числа словами javascript, число прописью
faq:
  - question: Does Russian number-to-words handle grammatical gender?
    answer: Yes. ru-RU supports feminine and masculine forms for locale-aware wording.
  - question: Does ru-RU work for Ruble and Kopeck currency output?
    answer: Yes. Russian currency wording is built into the locale configuration.
  - question: Is Russian useful for legal decimal wording too?
    answer: Yes. Russian supports fraction-style decimals with Slavic-specific singular behavior.
---

# Russian Number to Words in JavaScript (ru-RU)

> **Locale codes:** `ru-RU` · **Numbering system:** Short scale · **Currency:** Ruble / Kopeck · **Script:** Cyrillic

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'ru-RU' });
tw.convert(12345);
// "Двенадцать Тысяч Триста Сорок Пять"

tw.convert(1234.56, { currency: true });
// "Одна Тысяча Двести Тридцать Четыре Рубля Пятьдесят Шесть Копеек"
```

## Gender

```js
tw.convert(1, { gender: 'masculine' }); // "Один"
tw.convert(1, { gender: 'feminine' }); // "Одна"
```

## Fraction Style

```js
tw.convert(0.21, { decimalStyle: 'fraction' });
tw.convert(1.21, { decimalStyle: 'fraction' });
```

Russian applies Slavic-specific plural logic when fraction-style decimal wording is enabled. Currency mode continues to emit Ruble and Kopeck unit names.

## Related

- [Polish](/locales/polish)
- [Gender guide](/guide/gender)
- [Cheque printing](/use-cases/check-printing)

## FAQ

**Q: Does Russian number-to-words handle grammatical gender?**  
A: Yes. Pass `{ gender: 'feminine' }` or `{ gender: 'masculine' }` to the `convert()` options.

**Q: What locale code for Russian?**  
A: `ru-RU`.

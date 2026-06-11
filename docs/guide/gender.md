---
title: Gender-Aware Number Words — Arabic, Spanish, Slavic | to-words
description: "Use gender-aware number words in Arabic, Spanish, Portuguese, Polish, Russian, and more with gender: 'feminine' or 'masculine'."
head:
  - - meta
    - name: keywords
      content: arabic gender number words javascript, spanish masculine feminine numbers, grammatical gender numbers npm, polish feminine numbers javascript
---

# Gender-Aware Number Words

Many locales need grammatical gender to produce correct number words. `to-words` exposes this through a single option: `gender: 'feminine' | 'masculine'`.

## Basic Usage

```js
import { ToWords } from 'to-words';

const es = new ToWords({ localeCode: 'es-ES' });

es.convert(1); // "Uno"
es.convert(1, { gender: 'feminine' }); // "Una"
es.convert(21, { gender: 'feminine' }); // "Veintiuna"
es.convert(200, { gender: 'feminine' }); // "Doscientas"
```

## Other Locales

```js
const pt = new ToWords({ localeCode: 'pt-BR' });
pt.convert(2, { gender: 'feminine' }); // "Duas"

const ar = new ToWords({ localeCode: 'ar-AE' });
ar.convert(3, { gender: 'feminine' });

const pl = new ToWords({ localeCode: 'pl-PL' });
pl.convert(1, { gender: 'feminine' });
```

## Supported Locale Families

- Spanish locales
- Portuguese locales
- Arabic locales
- Hebrew locales
- Russian, Ukrainian, Polish, Czech, Croatian, Slovak, Serbian, Belarusian, Bulgarian, Latvian, Lithuanian, Slovenian, Romanian, and Catalan

## Notes

- Masculine is the default when you omit `gender`
- Zero is effectively ungendered
- Only the locale-defined gendered words change; neutral values keep the same wording

## Related

- [Spanish locale](/locales/spanish)
- [Arabic locale](/locales/arabic)
- [Polish locale](/locales/polish)

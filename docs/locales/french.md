---
title: French Number to Words in JavaScript (7 Locales) | to-words
description: Convert numbers to French words in JavaScript for France, Canada, Belgium, Switzerland, and more. Handles long-scale wording and regional number variants. npm to-words.
head:
  - - meta
    - name: keywords
      content: french number to words javascript, fr-FR to-words npm, nombre en lettres javascript, soixante-dix quatre-vingts
faq:
  - question: Why is 70 different in Belgium and Switzerland versus France?
    answer: Belgian and Swiss French use septante, and some variants use huitante, while France uses soixante-dix and quatre-vingts.
  - question: Does to-words handle French long-scale number names?
    answer: Yes. French locales use long-scale wording such as milliard for 10^9.
  - question: Which locale should I use for French Canadian output?
    answer: Use fr-CA for French wording aligned with Canada.
---

# French Number to Words JavaScript

7 regional French locales with correct regional variants for 70 (_soixante-dix_ vs _septante_) and 80 (_quatre-vingts_ vs _huitante_).

| Locale  | Country      | 70           | 80            |
| ------- | ------------ | ------------ | ------------- |
| `fr-FR` | France       | soixante-dix | quatre-vingts |
| `fr-BE` | Belgium      | septante     | huitante      |
| `fr-CH` | Switzerland  | septante     | huitante      |
| `fr-CA` | Canada       | soixante-dix | quatre-vingts |
| `fr-DZ` | Algeria      | soixante-dix | quatre-vingts |
| `fr-MA` | Morocco      | soixante-dix | quatre-vingts |
| `fr-SA` | Saudi Arabia | soixante-dix | quatre-vingts |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'fr-FR' });

tw.convert(70); // "Soixante-Dix"
tw.convert(80); // "Quatre-Vingts"
tw.convert(1234.56, { currency: true });
// "Mille Deux Cent Trente Quatre Euros Et Cinquante Six Centimes"
```

## Belgium / Switzerland

```js
const tw = new ToWords({ localeCode: 'fr-BE' });
tw.convert(70); // "Septante"
tw.convert(80); // "Huitante"
```

## FAQ

**Q: Why is 70 different in Belgium vs France?**  
A: Belgium and Switzerland use "septante" while France uses "soixante-dix". to-words handles both correctly.

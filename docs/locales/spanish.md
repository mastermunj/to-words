---
title: Spanish Number to Words in JavaScript (8 Locales) | to-words
description: Convert numbers to Spanish words in JavaScript for Spain, Mexico, Argentina, and more. Supports currency wording, ordinals, and grammatical gender. npm install to-words.
head:
  - - meta
    - name: keywords
      content: spanish number to words javascript, es-ES es-MX to-words, numero a palabras javascript npm
faq:
  - question: Does to-words support feminine and masculine Spanish number words?
    answer: Yes. Spanish locales support feminine and masculine gender-aware conversion.
  - question: Which locale should I use for Mexican Spanish?
    answer: Use es-MX for Spanish wording aligned with Mexico and Mexican Peso currency naming.
  - question: Do Spanish locales differ by country?
    answer: Yes. Currency names and some regional wording differ across Spain, Mexico, Argentina, Colombia, Chile, Peru, the United States, and Venezuela.
---

# Spanish Number to Words in JavaScript

8 regional Spanish locales — Spain, Mexico, Argentina, Colombia, Chile, Peru, USA, Venezuela. Includes grammatical **gender** support.

> **Locale codes:** `es-AR`, `es-CL`, `es-CO`, `es-ES`, `es-MX`, `es-PE`, `es-US`, `es-VE` · **Numbering system:** Short scale · **Currency:** Region-specific Spanish currencies · **Script:** Latin

| Locale  | Country   | Currency |
| ------- | --------- | -------- |
| `es-AR` | Argentina | Peso     |
| `es-CL` | Chile     | Peso     |
| `es-CO` | Colombia  | Peso     |
| `es-ES` | Spain     | Euro     |
| `es-MX` | Mexico    | Peso     |
| `es-PE` | Peru      | Sol      |
| `es-US` | USA       | Dollar   |
| `es-VE` | Venezuela | Bolívar  |

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'es-ES' });

tw.convert(12345);
// "Doce Mil Trescientos Cuarenta Y Cinco"

tw.convert(1234.56, { currency: true });
// "Mil Doscientos Treinta Y Cuatro Euros Con Cincuenta Y Seis Céntimos"
```

## Gender Support

```js
const tw = new ToWords({ localeCode: 'es-ES' });

tw.convert(1, { gender: 'feminine' }); // "Una"
tw.convert(1, { gender: 'masculine' }); // "Uno"
```

Spanish also changes hundreds in feminine contexts, so wording like `Doscientas` matters in invoices and forms.

## Ordinal Numbers

```js
tw.toOrdinal(1); // "Primero"
tw.toOrdinal(2);
tw.toOrdinal(10);
```

## Locale Codes

| Locale code | Country       | Currency | Notes                               |
| ----------- | ------------- | -------- | ----------------------------------- |
| `es-AR`     | Argentina     | Peso     | Argentine Spanish wording           |
| `es-CL`     | Chile         | Peso     | Chilean Spanish wording             |
| `es-CO`     | Colombia      | Peso     | Colombian Spanish wording           |
| `es-ES`     | Spain         | Euro     | Default European Spanish locale     |
| `es-MX`     | Mexico        | Peso     | Best fit for Mexican Spanish output |
| `es-PE`     | Peru          | Sol      | Peruvian Spanish wording            |
| `es-US`     | United States | Dollar   | Spanish wording for US-based apps   |
| `es-VE`     | Venezuela     | Bolívar  | Venezuelan Spanish currency wording |

## Related

- [Gender guide](/guide/gender)
- [Portuguese](/locales/portuguese)
- [Currency guide](/guide/currency)

## FAQ

**Q: Do Spanish locales differ significantly by country?**  
A: Currency names differ. For example es-ES uses Euro, es-MX uses Peso Mexicano.

**Q: Does to-words support feminine/masculine in Spanish?**  
A: Yes — pass `{ gender: 'feminine' }` or `{ gender: 'masculine' }` as a convert option.

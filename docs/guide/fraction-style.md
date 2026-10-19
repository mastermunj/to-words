---
title: Legal Decimal Style — Forty Five Hundredths | to-words
description: "Convert plain decimals to formal wording like Forty Five Hundredths using decimalStyle: 'fraction'. Useful for legal and financial text."
head:
  - - meta
    - name: keywords
      content: fraction style decimal words javascript, legal amount in words, forty five hundredths javascript, cheque decimal wording npm
---

# Legal Decimal Style

By default, the digits after the point are read as a number (`Zero Point Forty Five`). For legal and banking output you often need positional wording instead, such as `Forty Five Hundredths`. Use `decimalStyle: 'fraction'` for that.

## Digit Style vs Fraction Style

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(0.45); // "Zero Point Forty Five"
tw.convert(0.45, { decimalStyle: 'fraction' });
// "Zero And Forty Five Hundredths"
```

## Currency and Cheque Flows

```js
tw.convert(1234.56, { decimalStyle: 'fraction' });

tw.convert(1234.56, {
  currency: true,
});
```

`decimalStyle: 'fraction'` affects plain decimal conversion. It does not currently turn currency output into slash notation like `56/100`, so cheque-specific `xx/100` formatting still belongs in your document layer.

## Slavic Fraction Rules

Some locales such as Polish and Russian apply a singular rule to fractional wording. The library handles that internally when the locale defines it.

```js
import { ToWords } from 'to-words';

const pl = new ToWords({ localeCode: 'pl-PL' });
pl.convert(0.21, { decimalStyle: 'fraction' });
```

## Denominators

The denominator is singular when the fractional value is 1 and plural otherwise, except where a locale's own plural rule applies (the Slavic locales above).

| Decimal places | English                                  | French                         | German             |
| -------------- | ---------------------------------------- | ------------------------------ | ------------------ |
| 1              | Tenth / Tenths                           | Dixième / Dixièmes             | Zehntel            |
| 2              | Hundredth / Hundredths                   | Centième / Centièmes           | Hundertstel        |
| 3              | Thousandth / Thousandths                 | Millième / Millièmes           | Tausendstel        |
| 4              | Ten-Thousandth / Ten-Thousandths         | Dix-Millième / Dix-Millièmes   | Zehntausendstel    |
| 5              | Hundred-Thousandth / Hundred-Thousandths | Cent-Millième / Cent-Millièmes | Hunderttausendstel |
| 6              | Millionth / Millionths                   | Millionième / Millionièmes     | Millionstel        |

Russian, Ukrainian, Belarusian, Polish, Czech and Slovak go up to 15 decimal places. For more places than a locale has words for, the conversion falls back to the default style without an error.

## Supported Locales (100)

| Language group     | Locales                                                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **English**        | en-AE, en-AU, en-BD, en-CA, en-GB, en-GH, en-HK, en-IE, en-IN, en-IQ, en-JM, en-KE, en-LK, en-MA, en-MM, en-MU, en-MY, en-NG, en-NP, en-NZ, en-OM, en-PH, en-PK, en-SA, en-SG, en-TT, en-TZ, en-UG, en-US, en-ZA, en-ZW |
| **German**         | de-AT, de-CH, de-DE                                                                                                                                                                                                     |
| **French**         | fr-BE, fr-CA, fr-CH, fr-CI, fr-CM, fr-DZ, fr-FR, fr-MA, fr-MG, fr-SA                                                                                                                                                    |
| **Spanish**        | es-AR, es-CL, es-CO, es-DO, es-ES, es-MX, es-PE, es-US, es-VE                                                                                                                                                           |
| **Portuguese**     | pt-AO, pt-BR, pt-MZ, pt-PT                                                                                                                                                                                              |
| **Italian**        | it-IT                                                                                                                                                                                                                   |
| **Dutch**          | nl-NL, nl-SR                                                                                                                                                                                                            |
| **Scandinavian**   | da-DK, nb-NO, sv-SE                                                                                                                                                                                                     |
| **Other European** | be-BY, bg-BG, ca-ES, cs-CZ, el-GR, hr-HR, hu-HU, lv-LV, pl-PL, ro-RO, ru-RU, sk-SK, sl-SI, sq-AL, sr-RS, uk-UA                                                                                                          |
| **Indic**          | as-IN, bn-BD, bn-IN, gu-IN, hi-IN, kn-IN, ml-IN, mr-IN, ne-NP, or-IN, pa-IN, ta-IN, te-IN                                                                                                                               |
| **Others**         | af-ZA, fa-IR, he-IL, id-ID, ka-GE, ms-MY, ms-SG, ur-PK, vi-VN                                                                                                                                                           |

Locales not listed (Arabic, East Asian and Turkic locales, among others) don't support fraction style yet; passing the option falls back to the default style. The [capability matrix](/guide/locale-capabilities) shows the same per locale.

## When To Use It

- Cheque or check printing
- Legal contracts and financial paperwork
- Formal invoice wording
- Regions where positional fractional phrases are standard

## Related

- [Cheque printing](/use-cases/check-printing)
- [Currency guide](/guide/currency)
- [Polish locale](/locales/polish)

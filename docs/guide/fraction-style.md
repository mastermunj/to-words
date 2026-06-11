---
title: Legal Decimal Style — Forty-Five Hundredths | to-words
description: "Convert plain decimals to formal wording like Forty-Five Hundredths using decimalStyle: 'fraction'. Useful for legal and financial text."
head:
  - - meta
    - name: keywords
      content: fraction style decimal words javascript, legal amount in words, forty five hundredths javascript, cheque decimal wording npm
---

# Legal Decimal Style

By default, decimals are read digit by digit. For legal and banking output you often need positional wording instead, such as `Forty-Five Hundredths`. Use `decimalStyle: 'fraction'` for that.

## Digit Style vs Fraction Style

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(0.45); // "Zero Point Four Five"
tw.convert(0.45, { decimalStyle: 'fraction' });
// "Forty Five Hundredths"
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

## When To Use It

- Cheque or check printing
- Legal contracts and financial paperwork
- Formal invoice wording
- Regions where positional fractional phrases are standard

## Related

- [Cheque printing](/use-cases/check-printing)
- [Currency guide](/guide/currency)
- [Polish locale](/locales/polish)

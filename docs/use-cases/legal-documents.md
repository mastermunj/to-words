---
title: Legal Document Amount in Words JavaScript — to-words
description: Generate legal and contract amounts in words with locale-specific formatting and fraction-style decimals for formal writing.
head:
  - - meta
    - name: keywords
      content: legal amount in words javascript, contract value in words, agreement amount in words, fraction style legal decimals
---

# Legal Document Amounts in Words

Contracts, agreements, and affidavit-style documents often require numbers in words to avoid interpretation errors. `to-words` keeps this consistent across locales.

## Legal Writing Pattern

```js
import { toCurrency } from 'to-words';

function legalAmount(amount, localeCode) {
  return toCurrency(amount, {
    localeCode,
    doNotAddOnly: true,
  });
}

legalAmount('25000.75', 'en-GB');
legalAmount('25000.75', 'en-IN');
```

## Clause Example

```txt
The Buyer shall pay INR 25,000.75
(Twenty Five Thousand Rupees And Seventy Five Paise)
within seven business days.
```

If a jurisdiction mandates literal `75/100` notation, add that suffix in the document template. Currency mode currently renders the locale's minor unit name instead.

## Region-Aware Contract Generation

```js
const localeCode = party.country === 'AE' ? 'ar-AE' : 'en-GB';

const valueInWords = toCurrency('4500.00', {
  localeCode,
  includeZeroFractional: true,
});
```

## Why It Matters

- Reduces legal ambiguity in written totals
- Supports locale-specific currency and decimal conventions
- Avoids hand-written amount wording errors in generated templates

## Related

- [Cheque printing](/use-cases/check-printing)
- [Fraction-style decimals](/guide/fraction-style)
- [Arabic locale guidance](/locales/arabic)

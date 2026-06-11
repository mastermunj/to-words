---
title: Cheque Amount in Words JavaScript — to-words
description: Print cheque/check amounts in words using locale-aware currency output with to-words across 132 locales. Node.js, TypeScript, npm.
head:
  - - meta
    - name: keywords
      content: cheque amount in words javascript, check amount in words npm, fraction decimal style cheque printing
---

# Cheque / Check Amount in Words

Banks and legal documents require stable amount-in-words output. `to-words` gives you locale-aware currency wording today. If your bank specifically requires a literal `56/100` suffix, that last cheque-formatting step still belongs in your document layer.

## The Problem

Cheque wording is not the same as spoken-number wording. Banks often expect positional fractional output, and many home-grown utilities fail on region-specific currency names or non-English scripts.

## Usage

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(1234.56, {
  currency: true,
});
```

## Multi-Currency Example

```js
import { toCurrency } from 'to-words';

toCurrency('1234.56', { localeCode: 'en-US' });
toCurrency('1234.56', { localeCode: 'en-GB' });
toCurrency('1234.56', { localeCode: 'en-IN' });
toCurrency('1.500', { localeCode: 'en-OM' });
```

Use string input when precision matters, especially for 3-decimal currencies such as OMR or IQD.

## Indian cheque (Rupees)

```js
const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert('25000.75', { currency: true, doNotAddOnly: true });
// "Twenty Five Thousand Rupees And Seventy Five Paise"
```

If your bank requires `75/100`, format that suffix in the document template. `decimalStyle: 'fraction'` changes plain decimal wording, not currency-mode minor-unit output.

## Why to-words Fits Banking Flows

- Locale currency config keeps Rupees/Paise, Dollars/Cents, and Rubles/Kopecks aligned
- Locale currency config prevents mismatched major or minor unit names
- South Asian, RTL, and European locales all use the same API surface

## Related

- [Invoice amount in words](/use-cases/invoicing)
- [Currency guide](/guide/currency)
- [Fraction-style guide](/guide/fraction-style)
- [Polish locale](/locales/polish)

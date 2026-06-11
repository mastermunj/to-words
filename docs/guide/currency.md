---
title: Currency Amount in Words — JavaScript | to-words
description: Convert currency amounts to words in 132 locales. Supports 3-decimal currencies (KWD, OMR, IQD), custom currency, and ignoreDecimal. npm to-words.
head:
  - - meta
    - name: keywords
      content: currency amount in words javascript, invoice amount in words, 3 decimal currency javascript KWD OMR, custom currency to words
---

# Currency Amount in Words

Use currency mode when your UI needs invoice totals, cheque amounts, or banking text in words instead of raw digits. `to-words` ships locale-native currency names and fractional units, so the same API works from USD to Rupees to 3-decimal dinars.

## Basic Usage

```js
import { toCurrency } from 'to-words';

toCurrency(452.36, { localeCode: 'en-IN' });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"

toCurrency(1234.56, { localeCode: 'en-US' });
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

## Useful Currency Options

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert(452, { currency: true, doNotAddOnly: true });
tw.convert(452.36, { currency: true, ignoreDecimal: true });
tw.convert(0.36, { currency: true, ignoreZeroCurrency: true });
tw.convert('452.00', { currency: true, includeZeroFractional: true });
```

- `doNotAddOnly` removes the trailing `Only`
- `ignoreDecimal` drops the fractional unit entirely
- `ignoreZeroCurrency` is useful for values like `0.36`
- `includeZeroFractional` only works reliably with string input because `123.00` loses precision as a JavaScript `number`

## Custom Currency

```js
const tw = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    currencyOptions: {
      name: 'Euro',
      plural: 'Euros',
      symbol: '€',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '',
      },
    },
  },
});

tw.convert(100.5);
```

This is the right path when the locale language should stay the same but the currency changes, such as multilingual marketplaces or cross-border invoicing.

## 3-Decimal Currencies (KWD, OMR, IQD)

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-OM' });
tw.convert('500.500', { currency: true });
// "Five Hundred Omani Rials And Five Hundred Baisa Only"
```

Always pass 3-decimal amounts as strings. `500.500` becomes `500.5` as a JavaScript number, which loses the precision you need for legally correct wording.

## Where This Matters

- Invoice totals in PDF or HTML receipts
- Cheque and bank-style wording
- ERP and accounting exports
- Any app where written amounts must match stored financial precision

## Related

- [Cheque printing](/use-cases/check-printing)
- [Arabic locales](/locales/arabic)
- [Polish legal decimals](/locales/polish)

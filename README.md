# Number to Words

## Introduction

Convert numbers (including decimals) into words with multi-locale and currency support. Ideal for invoicing, e-commerce, and financial apps.

### Features

- **Number to Words**: Convert integers and decimals to text.
- **Currency Support**: Easily handle conversions with locale-specific currency options.
- **Multi-Locale**: Supports multiple languages and regions.
- **Highly Configurable**: Tailor conversion rules to your needs.

### Use Cases

- **Financial Applications**: Generate amount-in-words for invoices or cheques.
- **E-commerce Platforms**: Display totals in words for user receipts.
- **Educational Tools**: Teach number systems through text conversions.
- **Localization**: Support multiple languages and currencies seamlessly.



## Installation

```js
npm install to-words --save
```

## Usage

Importing

```js
const { ToWords } = require('to-words');
```

OR

```js
import { ToWords } from 'to-words';
```

Config Options

```js
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});
```

Options can be set at instance level, or along with individual call to `convert` method.

```js
const toWords = new ToWords();

let words = toWords.convert(123);
// words = One Hundred Twenty Three

words = toWords.convert(123.45);
// words = One Hundred Twenty Three Point Fourty Five

words = toWords.convert(123.045);
// words = One Hundred Twenty Three Point Zero Four Five
```

_Note: When fractional part starts with zero, the digits after decimal points are converted into respective numbers individually_

To convert to currency

```js
const toWords = new ToWords();

let words = toWords.convert(452, { currency: true });
// words = Four Hundred Fifty Two Rupees Only

words = toWords.convert(452.36, { currency: true });
// words = Four Hundred Fifty Two Rupees And Thirty Six Paise Only
```

To discard fractional unit

```js
const toWords = new ToWords();

let words = toWords.convert(452.36, { currency: true, ignoreDecimal: true });
// words = Four Hundred Fifty Two Rupees Only
```

To ignore major currency number when it's zero

```js
const toWords = new ToWords();

let words = toWords.convert(0.572, { currency: true, ignoreZeroCurrency: true });
// words = Five Hundred Seventy Two Paise Only
```

## Options

| Option             | Type    | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| localeCode         | string  | 'en-IN'   | Locale code for selecting i18n.                                                                                                                                                                                                                                                                                                                                                                                                            |
| currency           | boolean | false     | Whether the number to be converted into words written as currency.<br/>_Note: When currency:true, number will be rounded off to two decimals before converting to words_                                                                                                                                                                                                                                                                   |
| ignoreDecimal      | boolean | false     | Whether to ignore fractional unit of number while converting into words.                                                                                                                                                                                                                                                                                                                                                                   |
| ignoreZeroCurrency | boolean | false     | Whether to ignore zero currency value while converting into words.                                                                                                                                                                                                                                                                                                                                                                         |
| doNotAddOnly       | boolean | false     | Do not add `only` at the end of the words. This works only when currency = true                                                                                                                                                                                                                                                                                                                                                            |
| currencyOptions    | object  | undefined | By default currency options are taken from the specified locale.<br/>This option allows to specify different currency options while keeping the language details from the selected locale (e.g. convert to English text but use EUR as a currency). You can define different currencies for each call to `convert()` so it works also if you need to dynamically support multiple currencies.<br/>_This works only when `currency = true`_ |

## Supported Locale

| Country             | Language   | Locale          |
| ------------------- | ---------- | --------------- |
| India               | Bengali    | bn-IN           |
| Estonia             | Estonian   | ee-EE           |
| UAE                 | English    | en-AE           |
| Bangladesh          | English    | en-BD           |
| UK                  | English    | en-GB           |
| Ghana               | English    | en-GH           |
| Ireland             | English    | en-IE           |
| India               | English    | en-IN (default) |
| Myanmar             | English    | en-MM           |
| Mauritius           | English    | en-MU           |
| Nigeria             | English    | en-NG           |
| Nepal               | English    | en-NP           |
| USA                 | English    | en-US           |
| Philippines         | English    | en-PH           |
| Argentina           | Spanish    | es-AR           |
| España              | Spanish    | es-ES           |
| Mexico              | Spanish    | es-MX           |
| Venezuela           | Spanish    | es-VE           |
| Iran                | Persian    | fa-IR           |
| Belgium             | French     | fr-BE           |
| France              | French     | fr-FR           |
| India               | Gujarati   | gu-IN           |
| India               | Hindi      | hi-IN           |
| India               | Kannada    | kn-IN           |
| Korean, Republic of | Hangul     | ko-KR           |
| India               | Marathi    | mr-IN           |
| Suriname            | Dutch      | nl-SR           |
| Nepal               | Nepali     | np-NP           |
| Brazil              | Portuguese | pt-BR           |
| Turkey              | Turkish    | tr-TR           |
| Pakistan            | Urdu       | ur-PK           |


## Inspiration for core logic

[https://stackoverflow.com/a/46221860](https://stackoverflow.com/a/46221860)

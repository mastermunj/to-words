---
title: API Reference — toWords, toOrdinal, toCurrency | to-words
description: Complete API for toWords(), toOrdinal(), toCurrency(), detectLocale(). TypeScript types, all options, and per-locale imports.
head:
  - - meta
    - name: keywords
      content: toWords API, toCurrency typescript, number to words API reference, detectLocale
---

# API Reference

This page covers the class API, full-bundle helpers, per-locale helpers, and the option surface that controls currency, gender, formal numerals, and decimal wording.

## `new ToWords(options?)`

```ts
import { ToWords } from 'to-words';

const tw = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    useAnd: true,
  },
});
```

Constructor options:

| Option             | Type               | Description                                                  |
| ------------------ | ------------------ | ------------------------------------------------------------ |
| `localeCode`       | `string`           | Locale code such as `en-US`, `hi-IN`, or `ar-AE`             |
| `converterOptions` | `ConverterOptions` | Default per-instance options reused across `convert()` calls |

## `toWords(number, options?)`

Converts a number to words.

```ts
import { toWords } from 'to-words';

toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
toWords(12345); // auto-detects runtime locale
```

Accepted input types: `number`, `bigint`, or `string`.

## `tw.convert(number, options?)`

```ts
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert(12345);
tw.convert(452.36, { currency: true });
tw.convert('500.500', { currency: true });
```

Use the class method when you want one reusable instance with stable defaults.

## `toOrdinal(number, options?)`

```ts
import { toOrdinal } from 'to-words';

toOrdinal(21, { localeCode: 'en-US' }); // "Twenty First"
```

Ordinal input must represent a non-negative integer value.

## `toCurrency(number, options?)`

Shorthand for `toWords(number, { currency: true, ...options })`.

```ts
import { toCurrency } from 'to-words';

toCurrency(1234.56, { localeCode: 'en-US' }); // "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

## `detectLocale(fallback?)`

Reads the runtime locale from `navigator.language` (browser) or `Intl` (Node.js).

```ts
import { detectLocale } from 'to-words';

detectLocale(); // e.g. 'en-US'
detectLocale('en-GB'); // custom fallback
```

`detectLocale()` reads `navigator.language` in browsers and `Intl.DateTimeFormat().resolvedOptions().locale` in Node.js-compatible runtimes.

## `setLocaleDetector(fn)`

```ts
import { setLocaleDetector, toWords } from 'to-words';

setLocaleDetector(() => 'fr-FR');
toWords(1000); // "Mille"

setLocaleDetector(null); // restore built-in detection
```

Use this in SSR or middleware when locale should come from the request instead of global process state.

## Converter Options

| Option                  | Type                          | Default        | Description                                           |
| ----------------------- | ----------------------------- | -------------- | ----------------------------------------------------- |
| `currency`              | boolean                       | false          | Currency mode                                         |
| `ignoreDecimal`         | boolean                       | false          | Ignore fractional part                                |
| `ignoreZeroCurrency`    | boolean                       | false          | Skip zero main currency                               |
| `doNotAddOnly`          | boolean                       | false          | Omit "Only" suffix                                    |
| `includeZeroFractional` | boolean                       | false          | Include zero fractional from string input             |
| `currencyOptions`       | `CurrencyOptions`             | locale default | Override currency name, fractional unit, or precision |
| `gender`                | `'masculine'` \| `'feminine'` | undefined      | Grammatical gender                                    |
| `useAnd`                | boolean                       | undefined      | Insert connector before last two digits               |
| `formal`                | boolean                       | undefined      | Formal Chinese characters (大写)                      |
| `decimalStyle`          | `'digit'` \| `'fraction'`     | `'digit'`      | Legal/positional decimal style                        |

## Currency Options

```ts
currencyOptions: {
  name: 'Kuwaiti Dinar',
  plural: 'Kuwaiti Dinars',
  symbol: 'KWD',
  precision: 3,
  fractionalUnit: {
    name: 'Fils',
    plural: 'Fils',
    symbol: '',
  },
}
```

Use `precision: 3` for currencies such as OMR, IQD, KWD, and BHD.

## Per-Locale Imports

```ts
import { ToWords, toWords, toOrdinal, toCurrency } from 'to-words/hi-IN';

toWords(100000); // locale already baked in
```

Per-locale imports do not accept a `localeCode` option, because the locale is part of the import path.

## Error Cases

- Unknown locale code: `new ToWords({ localeCode: 'xx-XX' })`
- Invalid ordinal input: negative or non-integer values passed to `toOrdinal()`
- Precision-sensitive currency values passed as `number` instead of `string`

## Related

- [Getting started](/guide/getting-started)
- [Currency guide](/guide/currency)
- [Tree-shaking](/guide/tree-shaking)

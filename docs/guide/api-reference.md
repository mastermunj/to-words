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

| Option             | Type               | Description                                                                      |
| ------------------ | ------------------ | -------------------------------------------------------------------------------- |
| `localeCode`       | `LocaleCode`       | Supported locale such as `en-US`, `hi-IN`, or `ar-AE`; omitted means auto-detect |
| `converterOptions` | `ConverterOptions` | Default per-instance options reused across `convert()` calls                     |

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
toOrdinal(1, { localeCode: 'es-ES', gender: 'feminine' }); // "Primera"
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

`detectLocale()` reads `navigator.language` in browsers and `Intl.DateTimeFormat().resolvedOptions().locale` in Node.js-compatible runtimes. It canonicalises BCP 47 tags and uses deterministic defaults for language-only or unknown-region inputs, including `en` → `en-US`, `es` → `es-ES`, and `pt` → `pt-BR`. The root `ToWords` class uses this same detection when `localeCode` is omitted.

## `resolveLocale(input)`

Use the pure resolver for dynamic request, profile, or language-picker strings:

```ts
import { resolveLocale, ToWords, type LocaleCode } from 'to-words';

const canonical: LocaleCode | undefined = resolveLocale('EN_us'); // 'en-US'
if (!canonical) throw new Error('Unsupported locale');
const tw = new ToWords({ localeCode: canonical });
```

It applies the same canonical matching as detection but does not read runtime globals or apply a fallback.

## `setLocaleDetector(fn)`

```ts
import { setLocaleDetector, toWords } from 'to-words';

setLocaleDetector(() => 'fr-FR');
toWords(1000); // "Mille"

setLocaleDetector(null); // restore built-in detection
```

This override is process-global. Use it for tests or application-wide configuration, then restore it with `null`. Do not change it per SSR or middleware request; pass the request locale explicitly instead:

```ts
toWords(1000, { localeCode: requestLocale });
```

## Converter Options

| Option                  | Type                          | Default        | Description                                                   |
| ----------------------- | ----------------------------- | -------------- | ------------------------------------------------------------- |
| `currency`              | boolean                       | false          | Currency mode                                                 |
| `ignoreDecimal`         | boolean                       | false          | Ignore fractional part                                        |
| `ignoreZeroCurrency`    | boolean                       | false          | Skip zero main currency                                       |
| `doNotAddOnly`          | boolean                       | false          | Omit "Only" suffix                                            |
| `includeZeroFractional` | boolean                       | false          | Include zero fractional from string input                     |
| `currencyOptions`       | `CurrencyOptions`             | locale default | Override currency name, fractional unit, or precision         |
| `gender`                | `'masculine'` \| `'feminine'` | undefined      | Grammatical gender                                            |
| `useAnd`                | boolean                       | undefined      | Insert connector before last two digits                       |
| `formal`                | boolean                       | undefined      | Formal Chinese characters (大写)                              |
| `decimalStyle`          | `'digit'` \| `'fraction'`     | `'digit'`      | Legal/positional decimal style                                |
| `rangeMode`             | `'strict'` \| `'compose'`     | `'strict'`     | Enforce the supported range or opt into recursive composition |

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

## Locale Capabilities and Contract

Use the opt-in manifest when an application needs to discover supported locale codes or features at runtime:

```ts
import { getLocaleCapabilities, getLocaleMetadata, isSupportedLocale, SUPPORTED_LOCALES } from 'to-words/manifest';

isSupportedLocale('en-US'); // true
getLocaleCapabilities('zh-CN')?.formal; // true
getLocaleMetadata('hi-IN')?.numbering.grouping; // [3, 2]
getLocaleMetadata('en-US')?.range.maximumSupported.cardinal; // exact inclusive ceiling
SUPPORTED_LOCALES.length; // 135
```

The manifest contains compact generated capability, numbering-system, and named-range metadata and does not load locale conversion tables. Size-sensitive conversion code should still use per-locale imports.

Custom locale classes passed to the full `ToWords` class or public `ToWordsCore` are validated automatically once, before their first conversion. Per-locale entry points use smaller prevalidated built-in tables. Authors can also use `assertLocaleConfig()` or `validateLocaleConfig()` from `to-words/locale-contract` in CI. A config may declare form-specific `maximumSupportedValues`; otherwise ceilings are derived from its scale structure. See the [generated locale capability manifest](/guide/locale-capabilities) for the complete API and per-locale feature matrix.

## Utility Methods and Locale Inspection

The class also exposes:

- `toFixed(number, precision?)` — decimal-safe numeric rounding, including `toFixed(1.005, 2) === 1.01`
- `isFloat(number)` — detects a non-zero fractional component in a valid number, BigInt, or numeric string
- `isValidNumber(number)` — validates supported input without performing conversion
- `isNumberZero(number)` — checks for exact numeric zero
- `getLocale()` — returns the active locale for inspection; its configuration is recursively frozen after initialization

Custom locale definitions must therefore be complete and deterministic before their class is passed to `setLocale()`. `LOCALES` and the exported defaults are frozen, and constructor options are snapshotted.

## Error Cases

- Unknown locale code: `new ToWords({ localeCode: 'xx-XX' })`
- Invalid ordinal input: negative or non-integer values passed to `toOrdinal()`
- Invalid numeric input such as an empty string, malformed numeric string, `NaN`, or infinity
- Value above the locale's cardinal, ordinal, or currency ceiling: structured `NumberOutOfRangeError` (`code === 'NUMBER_OUT_OF_RANGE'`). Pass `rangeMode: 'compose'` only when legacy recursive composition is intentional.

## Related

- [Getting started](/guide/getting-started)
- [Currency guide](/guide/currency)
- [Tree-shaking](/guide/tree-shaking)
- [Locale capability manifest](/guide/locale-capabilities)
- [Locale conformance and quality gates](/guide/locale-quality)

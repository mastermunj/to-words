---
title: to-words vs number-to-words vs written-number vs num-words vs n2words
description: 'Capability comparison for leading number-to-words npm packages — locale coverage, TypeScript support, ESM, BigInt, currency, and ordinal.'
head:
  - - meta
    - name: keywords
      content: to-words vs number-to-words, written-number comparison, num-words alternative, n2words javascript, number to words npm comparison
---

# Package Comparison

Choosing a number-to-words npm package? This page compares actively used options across the capabilities that matter most.

## Capability Comparison

| Capability                     | **to-words**    | number-to-words | written-number | num-words      | n2words       |
| ------------------------------ | --------------- | --------------- | -------------- | -------------- | ------------- |
| Locale/language coverage claim | **132 locales** | English-focused | Multi-language | Indian English | 70+ languages |
| TypeScript declarations        | ✅              | ❌              | ❌             | ✅             | ✅            |
| ESM-ready package              | ✅              | ❌              | ❌             | ❌             | ✅            |
| Package `exports` map          | ✅              | ❌              | ❌             | ❌             | ✅            |
| BigInt support                 | ✅              | ❌              | ❌             | ❌             | ✅            |
| Currency conversion mode       | ✅              | ❌              | ❌             | ❌             | ✅            |
| Ordinal conversion             | ✅              | ✅              | ❌             | ❌             | ✅            |
| Subpath locale imports         | ✅              | ❌              | ❌             | ❌             | ✅            |
| Last publish recency           | 2026            | 2018            | 2021           | 2023           | 2026          |

## Where to-words Wins

- You need consistent behavior across many locales (including region-specific variants)
- You need root imports with runtime `localeCode` switching, locale detection, or the `ToWords` class for repeated conversions
- You need built-in currency phrasing plus fraction-style decimals for non-currency values
- You need BigInt-safe conversion with both full-bundle and subpath import options

## When Other Packages May Still Fit

- `number-to-words`: legacy English-only stacks where migration cost outweighs feature gain
- `num-words`: small Indian-English-only utilities
- `n2words`: subpath-first ESM projects where its supported language set already matches your product
- `written-number`: mostly for older projects that already depend on it

## Migration from number-to-words

```js
// Before (number-to-words)
import nw from 'number-to-words';
nw.toWords(12345); // "twelve thousand three hundred forty-five"

// After (to-words)
import { toWords } from 'to-words';
toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
```

The main difference: to-words returns title-cased output and requires a `localeCode`.

## Migration from written-number

```js
// Before (written-number)
import writtenNumber from 'written-number';
writtenNumber(12345, { lang: 'es' }); // "doce mil trescientos cuarenta y cinco"

// After (to-words)
import { toWords } from 'to-words';
toWords(12345, { localeCode: 'es-ES' }); // "Doce Mil Trescientos Cuarenta Y Cinco"
```

## Migration from n2words

```js
import { toWords as en } from 'to-words/en-US';
import { toWords as es } from 'to-words/es-ES';

en(42);
es(42);
```

Both packages support subpath locale imports. The main difference is that `to-words` also lets you stay on the root entry point and pass `localeCode` at runtime when the language is chosen dynamically.

## Verdict

Use `to-words` when you need broader locale coverage, locale-aware currency wording, runtime locale switching from one root import, and both class-based and functional APIs.

If you want raw download trend context, compare packages on [npmtrends](https://npmtrends.com/to-words-vs-number-to-words-vs-written-number-vs-num-words-vs-n2words).

## Related

- [Migration guide](/guide/migration)
- [Tree-shaking guide](/guide/tree-shaking)
- [All locales](/locales/)

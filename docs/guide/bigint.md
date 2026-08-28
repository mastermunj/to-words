---
title: BigInt to Words in JavaScript — Large Numbers | to-words
description: Convert BigInt and very large numbers (up to Vigintillion) to words in JavaScript. Safe for numbers beyond Number.MAX_SAFE_INTEGER.
head:
  - - meta
    - name: keywords
      content: bigint to words javascript, large number to words js, number beyond MAX_SAFE_INTEGER to words
---

# BigInt & Large Numbers

`to-words` accepts `bigint` and precision-preserving string input, so values beyond `Number.MAX_SAFE_INTEGER` are never rounded or truncated. Each locale publishes an inclusive strict ceiling for cardinal, ordinal, and currency output.

## BigInt Example

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(1000000000000000000n);
// "One Quintillion"

tw.convert('9007199254740993');
// "Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion..."

// Indian system
const hi = new ToWords({ localeCode: 'hi-IN' });
hi.convert(100000000000000000n);
// "एक शंख"
```

## String Input For Precision

```js
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert('9007199254740993');
tw.convert('1000000000000000000000');
```

Use string input when the value came from a database, finance system, or API and must remain exact.

## Supported Range and Compose Mode

```js
import { getLocaleMetadata } from 'to-words/manifest';

getLocaleMetadata('en-US').range.maximumSupported.cardinal;
// exact decimal string; safe to parse as BigInt
```

The default `rangeMode: 'strict'` raises `NumberOutOfRangeError` above the applicable ceiling. This prevents the package from silently presenting mechanically repeated scale words as verified locale output.

Use compose mode only when that recursive behavior is explicitly acceptable:

```js
tw.convert('1e100', { rangeMode: 'compose' });
tw.toOrdinal('1e100', { rangeMode: 'compose' });
```

Compose mode preserves exact input and the legacy algorithm, but wording beyond the strict ceiling is not claimed as independently verified.

## Large-Number Systems

- `en-US` and most western locales use short scale
- `de-DE` and `fr-FR` use long scale wording such as `Milliarde` and `Milliard`
- `hi-IN`, `ta-IN`, and `ur-PK` use lakh / crore style grouping
- `ja-JP`, `zh-CN`, and `ko-KR` use East Asian units such as `万`, `億`, and `兆`

## When To Use BigInt vs String

- Use `bigint` when your app already holds whole numbers as integers
- Use `string` when decimal precision or trailing zeros matter
- Use plain `number` only when the value is safely within JavaScript integer limits and fractional precision is not critical

## Related

- [Indian numbering locales](/locales/hindi)
- [Japanese locale](/locales/japanese)
- [API Reference](/guide/api-reference)

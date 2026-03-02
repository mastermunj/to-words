# Migration Guide and Package Comparison

This guide helps teams migrate to `to-words` from common alternatives.

Current as of v5.x — check [npm](https://www.npmjs.com/package/to-words) for the latest.

## Quick Comparison

| Package | Scope | Maintenance Signal | Locales/Languages | Currency | Ordinal | BigInt | Notes |
|---|---|---|---|---|---|---|---|
| `to-words` | Multi-locale number-to-words | Active | 100 locales | Yes | Yes (locale dependent) | Yes | ESM/CJS/UMD, TypeScript types, tree-shakeable locale imports |
| `number-to-words` | English utility | Inactive ([npm](https://www.npmjs.com/package/number-to-words)) | English | No | Yes | Limited by JS number safety | API includes `toWords`, `toOrdinal` (suffix), `toWordsOrdinal` |
| `written-number` | Multi-language text conversion | Inactive ([npm](https://www.npmjs.com/package/written-number)) | Multiple languages | No | No dedicated ordinal API | No BigInt API | CommonJS usage, `lang` and `noAnd` options |
| `num-words` | South Asian (Indian numbering) | Inactive ([npm](https://www.npmjs.com/package/num-words)) | Primarily English Indian style | No | No | No | README notes typical support up to 9 digits |
| `n2words` | Multi-language number-to-words | Active | 52 languages | No built-in currency mode | Language-specific options | Yes | Function-per-language API, option-rich for grammar in some languages |

## Migration from `number-to-words`

Typical old usage:

```js
const converter = require('number-to-words');
converter.toWords(21); // 'twenty-one'
converter.toWordsOrdinal(21); // 'twenty-first'
converter.toOrdinal(21); // '21st'
```

Equivalent with `to-words`:

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(21); // 'Twenty One'
tw.toOrdinal(21); // 'Twenty First'
```

## Migration from `written-number`

Typical old usage:

```js
const writtenNumber = require('written-number');

writtenNumber(1234); // 'one thousand two hundred and thirty-four'
writtenNumber(1234, { lang: 'es' });
```

Equivalent with `to-words`:

```js
import { ToWords } from 'to-words';

const en = new ToWords({ localeCode: 'en-US' });
const es = new ToWords({ localeCode: 'es-ES' });

en.convert(1234);
es.convert(1234);
```

Notes:

- `written-number` language keys (for example `es`, `fr`) map to explicit locale codes in `to-words` (for example `es-ES`, `fr-FR`).
- `to-words` adds built-in currency conversion and locale-specific currency naming.

## Migration from `num-words`

Typical old usage:

```js
const numWords = require('num-words');

numWords(123456); // Indian-style wording
```

Equivalent with `to-words` (Indian system):

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-IN' });

tw.convert(123456); // 'One Lakh Twenty Three Thousand Four Hundred Fifty Six'
```

If you currently rely on a restricted input range, you can keep that guard explicitly:

```js
function convertInvoiceNumber(value) {
  // Use Number.isSafeInteger to guard against precision loss on large values
  const n = Number(value);
  if (!Number.isSafeInteger(n) || Math.abs(n) > 999_999_999) {
    throw new Error('Only up to 9 digits allowed for this workflow');
  }
  return tw.convert(value);
}
```

## Migration from `n2words`

Typical old usage:

```js
import { en, es } from 'n2words';

en(42);
es(42);
```

Equivalent with `to-words`:

```js
import { ToWords } from 'to-words';

const en = new ToWords({ localeCode: 'en-US' });
const es = new ToWords({ localeCode: 'es-ES' });

en.convert(42);
es.convert(42);
```

For single-locale imports (smaller bundle):

```js
import { ToWords } from 'to-words/en-US';

const tw = new ToWords();
tw.convert(42);
```

Important differences:

- `n2words` exposes language-specific grammatical options in some languages (for example gender/formal options). `to-words` captures regional grammar conventions inside each locale implementation — see individual locale source files for locale-specific configuration details.
- `to-words` provides built-in currency conversion modes and options, which can replace custom post-processing in many apps.

## Common Migration Checklist

1. Replace old imports with `to-words` imports (`to-words` or `to-words/<locale>`).
2. Pick a locale code per market (for example `en-US`, `en-IN`, `es-MX`).
3. Update conversion calls to `convert()` and ordinals to `toOrdinal()`.
4. Add regression tests around invoice amounts, negatives, decimals, and edge values.
5. If needed, enable currency mode with `{ currency: true }` and locale defaults.

## Validation Matrix (Suggested)

When migrating, verify at least these inputs in your app tests:

- `0`, `1`, `11`, `21`, `99`, `100`, `101`, `999`, `1000`
- `-1`, `-101`
- `1.01`, `10.50`, `0.04`
- one very large integer (`BigInt` or string)
- one locale-specific currency value

## Need Help?

- **Questions or bugs:** [open an issue](https://github.com/mastermunj/to-words/issues)
- **Full API reference:** [README.md](README.md)
- **Locale-specific behaviour:** browse [`src/locales/`](src/locales/)

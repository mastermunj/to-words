# Migration Guide and Package Comparison

This guide covers two scenarios:

1. **Upgrading within `to-words`** — moving from v4 to v5.
2. **Migrating from another package** — `number-to-words`, `written-number`, `num-words`, `n2words`.

Current as of **v5.x** — check [npm](https://www.npmjs.com/package/to-words) for the latest.

---

## Upgrading from `to-words` v4

### What changed

| Area                     | v4                                                            | v5                                                                   |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Class API                | `new ToWords({ localeCode })` → `.convert()` / `.toOrdinal()` | **Unchanged** — fully backwards-compatible                           |
| Functional helpers       | Not available                                                 | `toWords()`, `toOrdinal()`, `toCurrency()` named exports             |
| Auto locale detection    | Not available                                                 | `detectLocale()` — reads `navigator.language` / `Intl`               |
| Locale detector override | Not available                                                 | `setLocaleDetector(fn)` — for SSR, tests, CF Workers                 |
| Per-locale tree-shaking  | `import { ToWords } from 'to-words/en-US'`                    | Same, plus per-locale `toWords` / `toOrdinal` / `toCurrency` exports |
| BigInt support           | Not available                                                 | `convert(1000000000000n)`                                            |
| ESM                      | Not default                                                   | Native ESM with CJS interop                                          |

### No breaking changes

If you use the class-based API, **nothing breaks**. The upgrade is additive.

```js
// v4 — still works exactly the same in v5
import { ToWords } from 'to-words';
const tw = new ToWords({ localeCode: 'en-IN' });
tw.convert(1234); // 'One Thousand Two Hundred Thirty Four'
tw.toOrdinal(3); // 'Third'
```

### New: functional helpers (v5)

v5 adds three named function exports that cache instances internally — no `new` required:

```js
import { toWords, toOrdinal, toCurrency } from 'to-words';

toWords(1234, { localeCode: 'en-US' }); // 'One Thousand Two Hundred Thirty Four'
toOrdinal(21, { localeCode: 'en-US' }); // 'Twenty First'
toCurrency(1234.56, { localeCode: 'en-US' }); // 'One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only'
```

When `localeCode` is omitted, the runtime locale is auto-detected:

```js
// In a browser set to fr-FR, or a Node.js process with LANG=fr_FR.UTF-8:
toWords(100); // 'Cent' (auto-detected fr-FR)
```

### New: locale auto-detection (v5)

```js
import { detectLocale, setLocaleDetector } from 'to-words';

// Inspect what the auto-detector would return
detectLocale(); // e.g. 'en-US' (from navigator / Intl)
detectLocale('en-GB'); // custom fallback when nothing matches

// Server / SSR: derive locale from the request, not the process
setLocaleDetector(() => req.headers['accept-language']?.split(',')[0] ?? 'en-US');

// Tests: pin to a specific locale without mocking globals
setLocaleDetector(() => 'fr-FR');
// … run tests …
setLocaleDetector(null); // restore built-in detection
```

### New: per-locale functional exports (v5)

Each locale entry point now also exports `toWords`, `toOrdinal`, and `toCurrency` with the locale hard-wired — ideal for maximum tree-shaking:

```js
// ~3–4 KB gzipped: only en-US locale bundled, no localeCode arg needed
import { toWords, toOrdinal, toCurrency } from 'to-words/en-US';

toWords(1234); // 'One Thousand Two Hundred Thirty Four'
toOrdinal(21); // 'Twenty First'
toCurrency(99.5); // 'Ninety Nine Dollars And Fifty Cents Only'
```

---

## Quick Comparison: `to-words` vs alternatives

| Package           | Scope          | Maintenance | Locales     | Currency | Ordinal           | BigInt  |
| ----------------- | -------------- | ----------- | ----------- | -------- | ----------------- | ------- |
| **`to-words`**    | Multi-locale   | Active      | 124 locales | Yes      | Yes               | Yes     |
| `number-to-words` | English only   | Inactive    | 1           | No       | Yes (suffix)      | Limited |
| `written-number`  | Multi-language | Inactive    | Multiple    | No       | No                | No      |
| `num-words`       | Indian English | Inactive    | 1           | No       | No                | No      |
| `n2words`         | Multi-language | Active      | 52          | No       | Language-specific | Yes     |

---

## Migration from `number-to-words`

### Why migrate

`number-to-words` is English-only and no longer maintained. `to-words` provides the same API surface with identical method names, plus multi-locale support, currency, ordinals, and BigInt.

### Drop-in functional replacement

```js
// Before
const converter = require('number-to-words');
converter.toWords(21); // 'twenty-one'
converter.toWordsOrdinal(21); // 'twenty-first'

// After — nearly identical call site, proper casing
import { toWords, toOrdinal } from 'to-words';

toWords(21, { localeCode: 'en-US' }); // 'Twenty One'
toOrdinal(21, { localeCode: 'en-US' }); // 'Twenty First'
```

Or use a per-locale import so you never have to pass `localeCode`:

```js
import { toWords, toOrdinal } from 'to-words/en-US';

toWords(21); // 'Twenty One'
toOrdinal(21); // 'Twenty First'
```

### Class-based equivalent

```js
import { ToWords } from 'to-words';
const tw = new ToWords({ localeCode: 'en-US' });

tw.convert(21); // 'Twenty One'
tw.toOrdinal(21); // 'Twenty First'
```

### Key differences

- Output is title-cased (`'Twenty One'` vs `'twenty-one'`).
- `number-to-words`'s `.toOrdinal()` returns a numeric suffix (`'21st'`); `to-words`'s `.toOrdinal()` returns words (`'Twenty First'`).
- Currency is built-in via `{ currency: true }` — no separate library needed.

---

## Migration from `written-number`

### Typical old usage

```js
const writtenNumber = require('written-number');

writtenNumber(1234); // 'one thousand two hundred and thirty-four'
writtenNumber(1234, { lang: 'es' });
```

### Equivalent with `to-words`

```js
import { toWords } from 'to-words';

toWords(1234, { localeCode: 'en-US' }); // 'One Thousand Two Hundred Thirty Four'
toWords(1234, { localeCode: 'es-ES' });
```

Or with per-locale imports for zero-overhead repeated calls:

```js
import { toWords as toWordsEs } from 'to-words/es-ES';
toWordsEs(1234);
```

### Key differences

- `written-number` language keys (`es`, `fr`) map to BCP 47 locale codes in `to-words` (`es-ES`, `fr-FR`). See the [locale list](src/locales/) for all supported codes.
- `to-words` supports currency conversion natively via `toCurrency()` or `{ currency: true }`.
- Output is title-cased.

---

## Migration from `num-words`

### Typical old usage

```js
const numWords = require('num-words');
numWords(123456); // Indian-style wording, limited to ~9 digits
```

### Equivalent with `to-words`

```js
import { toWords } from 'to-words/en-IN';

toWords(123456); // 'One Lakh Twenty Three Thousand Four Hundred Fifty Six'
```

Or with BigInt for values beyond `Number.MAX_SAFE_INTEGER`:

```js
toWords(9999999999999n); // works without precision loss
```

If your app enforces a digit limit, keep the guard:

```js
function convertInvoiceNumber(value) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || Math.abs(n) > 999_999_999) {
    throw new Error('Only up to 9 digits allowed');
  }
  return toWords(value);
}
```

---

## Migration from `n2words`

### Typical old usage

```js
import { en, es } from 'n2words';

en(42); // 'forty-two'
es(42);
```

### Equivalent with `to-words`

**Functional style (recommended):**

```js
import { toWords } from 'to-words';

toWords(42, { localeCode: 'en-US' });
toWords(42, { localeCode: 'es-ES' });
```

**Per-locale imports (maximum tree-shaking):**

```js
import { toWords as en } from 'to-words/en-US';
import { toWords as es } from 'to-words/es-ES';

en(42);
es(42);
```

**Class-based (when you need shared config):**

```js
import { ToWords } from 'to-words';

const en = new ToWords({ localeCode: 'en-US' });
const es = new ToWords({ localeCode: 'es-ES' });

en.convert(42);
es.convert(42);
```

### Key differences

- `n2words` exposes language-specific grammatical options (gender, formal register) via call-site options. `to-words` bakes regional grammar into each locale file — see [`src/locales/`](src/locales/) for locale-specific configuration.
- `to-words` adds built-in currency and ordinal support, which can replace custom post-processing.
- Output is title-cased.

---

## Common Migration Checklist

1. **Install** `npm install to-words` (requires Node ≥ 20).
2. **Choose an import style:**
  - Full bundle: `import { toWords } from 'to-words'` (all 124 locales, ~60 KB gzipped).
  - Per-locale: `import { toWords } from 'to-words/en-US'` (~3–4 KB gzipped).
3. **Pick a locale code** per market (`en-US`, `en-IN`, `es-MX`, `fr-FR`, …).
4. **Update call sites** — use `toWords()` / `toOrdinal()` / `toCurrency()` for functional style, or `tw.convert()` / `tw.toOrdinal()` for the class-based style.
5. **Handle locale on the server** — call `setLocaleDetector(() => ...)` once at request time so the functional helpers pick up the right locale without requiring an explicit `localeCode` on every call.
6. **Add regression tests** covering: `0`, negatives, decimals, large integers (BigInt), currency amounts, and ordinals.
7. **Check casing expectations** — `to-words` outputs title-case; apply `.toLowerCase()` if your UI requires lower-case.

## Validation Matrix (Suggested)

When migrating, verify at least these inputs in your app tests:

| Input                                                   | Notes                                            |
| ------------------------------------------------------- | ------------------------------------------------ |
| `0`, `1`, `11`, `21`, `99`, `100`, `101`, `999`, `1000` | Core range                                       |
| `-1`, `-101`                                            | Negatives                                        |
| `1.01`, `10.50`, `0.04`                                 | Decimals / currency sub-units                    |
| `9007199254740992n`                                     | Beyond `MAX_SAFE_INTEGER` (BigInt)               |
| Currency amount with your locale                        | e.g. `toCurrency(1.99, { localeCode: 'en-US' })` |
| Ordinal with your locale                                | e.g. `toOrdinal(21, { localeCode: 'en-US' })`    |

## Need Help?

- **Questions or bugs:** [open an issue](https://github.com/mastermunj/to-words/issues)
- **Full API reference:** [README.md](README.md)
- **Locale-specific behaviour:** browse [`src/locales/`](src/locales/)

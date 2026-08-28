# Migration Guide and Package Comparison

This guide covers two scenarios:

1. **Upgrading within `to-words`** — moving from v6 to v7, v5 to v6, or v4 to v5.
2. **Migrating from another package** — `number-to-words`, `written-number`, `num-words`, `n2words`.

Current as of **v7.x** — check [npm](https://www.npmjs.com/package/to-words) for the latest.

---

## Upgrading from `to-words` v6

v7 corrects two locale identifiers and tightens four package-wide contracts:

| Area                            | v6                                      | v7                                                                                |
| ------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| Root class without `localeCode` | Always `en-IN`                          | Uses the same runtime detection as functional helpers, then falls back to `en-IN` |
| Locale inputs                   | Exact registry string                   | Canonical BCP 47 resolution plus the generated `LocaleCode` union                 |
| Public defaults and registry    | Mutable exports                         | Frozen exports; constructor defaults are snapshotted                              |
| Custom locale contract          | Manual validation available             | Full `ToWords` / `ToWordsCore` validate each custom class on first use            |
| Values above a locale range     | Recursively composed without a boundary | `NumberOutOfRangeError` by default; legacy composition is opt-in                  |

### Corrected locale identifiers

| Language | v6 identifier | v7 identifier | Reason                                                            |
| -------- | ------------- | ------------- | ----------------------------------------------------------------- |
| Estonian | `ee-EE`       | `et-EE`       | `ee` identifies Ewe; `et` identifies Estonian.                    |
| Nepali   | `np-NP`       | `ne-NP`       | `np` is not a registered language subtag; `ne` identifies Nepali. |

The region subtags remain unchanged: `EE` identifies Estonia and `NP` identifies Nepal.

Replace the locale code wherever it is passed dynamically:

```diff
-const tw = new ToWords({ localeCode: 'ee-EE' });
+const tw = new ToWords({ localeCode: 'et-EE' });
-const nepali = new ToWords({ localeCode: 'np-NP' });
+const nepali = new ToWords({ localeCode: 'ne-NP' });
```

Replace per-locale imports as well:

```diff
-import { toWords } from 'to-words/ee-EE';
+import { toWords } from 'to-words/et-EE';
-import { toCurrency } from 'to-words/np-NP';
+import { toCurrency } from 'to-words/ne-NP';
```

The same replacements apply to `toWords()`, `toOrdinal()`, `toCurrency()`, CLI `--locale` values, and locale-manifest lookups. The former identifiers are no longer registered or exported, and no compatibility aliases are provided. Applications using automatic locale detection now resolve `et`/`et-EE` to Estonian and `ne`/`ne-NP` to Nepali.

The Estonian and Nepali conversion rules and output are otherwise unchanged.

### Unified, typed locale resolution

`new ToWords()` now auto-detects the runtime locale, matching `toWords()`, `toOrdinal()`, and `toCurrency()`. Pass `en-IN` explicitly if the old implicit class default was intentional:

```diff
-const tw = new ToWords();
+const tw = new ToWords({ localeCode: 'en-IN' });
```

Canonical case, underscore separators, and script-qualified tags now resolve consistently (`EN_us` → `en-US`, `zh-Hant-TW` → `zh-TW`). TypeScript callers receive the generated `LocaleCode` union. Resolve a dynamic user or request string before constructing:

```ts
import { resolveLocale, ToWords } from 'to-words';

const localeCode = resolveLocale(requestLocale);
if (!localeCode) throw new Error('Unsupported locale');
const tw = new ToWords({ localeCode });
```

### Frozen state and automatic custom-locale validation

`LOCALES`, `DefaultToWordsOptions`, and `DefaultConverterOptions` are frozen. A `ToWords` instance also snapshots nested constructor options, so later caller mutation does not change that instance. Treat these exports as read-only and create new option objects for application defaults.

Custom locale classes passed to the full `ToWords` class or public `ToWordsCore` are validated automatically before their first conversion. Configuration must be deterministic for a given class and complete before `setLocale()` is called. Invalid mappings now fail early with a consolidated `TypeError`; `validateLocaleConfig()` remains available for authoring tools and CI. Per-locale entry points stay small by using their prevalidated built-in table directly.

### Strict ranges

Cardinal, ordinal, and currency conversion now default to `rangeMode: 'strict'`. Every locale publishes exact inclusive ceilings through `getLocaleMetadata(code).range.maximumSupported`. Above a ceiling, conversion throws a structured `NumberOutOfRangeError` with `code`, `localeCode`, `form`, `value`, and `maximumSupported` fields.

If you intentionally relied on v6's recursive reuse of the largest scale, opt in explicitly:

```diff
-tw.convert(veryLargeInteger);
+tw.convert(veryLargeInteger, { rangeMode: 'compose' });
```

The same option is supported by ordinals, currency conversion, functional helpers, per-locale entry points, constructor `converterOptions`, and the CLI (`--range-mode compose`). Compose mode preserves the old algorithm but does not claim native-language verification beyond the published strict range.

---

## Upgrading from `to-words` v5

v6 is a correctness-focused major release. The conversion methods keep the same signatures, but a few observable contracts are intentionally stricter:

| Area                           | v5                                            | v6                                                                       |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| Language-only locale detection | First registered regional variant             | Explicit default (`en-US`, `es-ES`, `pt-BR`, `sw-KE`, and equivalents)   |
| Locale configuration           | Publicly mutable after initialization         | Recursively frozen after initialization                                  |
| `toFixed()`                    | Native binary floating-point rounding         | Decimal-safe rounding                                                    |
| `isFloat()`                    | Numeric strings reported as `false`           | Any valid input with a non-zero fractional component reports `true`      |
| `isNumberZero()`               | Positive fractions below one reported as zero | Only exact numeric zero reports as zero                                  |
| CLI arguments                  | Unknown/conflicting options could be ignored  | Unknown options, repeated `--locale`, and conflicting modes are rejected |

If you depended on a regional variant chosen from a language-only tag, pass it explicitly:

```js
toWords(100, { localeCode: 'en-AE' });
```

Define custom locale data completely before the locale is first used. `getLocale().config` remains available for inspection, but mutation is no longer supported because it could leave cached conversion data inconsistent.

`setLocaleDetector()` is process-global. For request-scoped server conversion, pass the locale with each call:

```js
toWords(100, { localeCode: requestLocale });
```

The release also corrects exact large-number input, decimal currency rounding, negative sub-unit signs, locale-table invariants, and Spanish ordinal gender. Those fixes do not require migration changes unless an application relied on the previous incorrect output.

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

// Tests: pin to a specific locale without mocking globals
setLocaleDetector(() => 'fr-FR');
// … run tests …
setLocaleDetector(null); // restore built-in detection
```

`setLocaleDetector()` changes process-wide state. In server and SSR code, pass the request locale directly to `toWords()`, `toCurrency()`, `toOrdinal()`, or the `ToWords` constructor.

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

Snapshot verified on 2026-05-30 from published package metadata, package exports, and npm download API.

| Package           | Maintenance | Locales  | TS types | Currency | Ordinal | BigInt |
| ----------------- | ----------- | -------- | -------- | -------- | ------- | ------ |
| **`to-words`**    | Active      | 135      | Yes      | Yes      | Yes     | Yes    |
| `number-to-words` | Inactive    | 1        | No       | No       | Yes     | No     |
| `written-number`  | Inactive    | Multiple | No       | No       | No      | No     |
| `num-words`       | Inactive    | 1        | Yes      | No       | No      | No     |
| `n2words`         | Active      | 70       | Yes      | Yes      | Yes     | Yes    |

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

- `n2words` exposes language-specific grammatical options at the call site. `to-words` supports shared `gender` and `formal` options where a locale defines them, while regional grammar and currency remain in each locale file — see [`src/locales/`](src/locales/).
- `to-words` adds built-in currency and ordinal support, which can replace custom post-processing.
- Output is title-cased.

---

## Common Migration Checklist

1. **Install** `npm install to-words` (requires Node ≥ 20).
2. **Choose an import style:**

- Full bundle: `import { toWords } from 'to-words'` (all 135 locales, ~70.4 KiB gzipped).
- Per-locale: `import { toWords } from 'to-words/en-US'` (~5.5 KiB gzipped).

3. **Pick a locale code** per market (`en-US`, `en-IN`, `es-MX`, `fr-FR`, …).
4. **Update call sites** — use `toWords()` / `toOrdinal()` / `toCurrency()` for functional style, or `tw.convert()` / `tw.toOrdinal()` for the class-based style.
5. **Handle locale on the server** — pass `{ localeCode }` explicitly per request. `setLocaleDetector()` is process-global and should not be changed while concurrent requests are running.
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

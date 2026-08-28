---
title: Migrate from number-to-words, written-number, n2words | to-words
description: Side-by-side migration guide from number-to-words, written-number, num-words, and n2words to to-words, plus v6 to v7 upgrade notes.
---

# Migration Guide

`to-words` is designed to be low-friction if you are coming from another number-to-words package. The core conversion methods remain consistent across releases, and the functional helpers give you a modern migration path when you want less boilerplate.

## Upgrading from `to-words` v6

v7 corrects the Estonian and Nepali locale identifiers. Update both dynamic locale values and per-locale imports:

```diff
-const tw = new ToWords({ localeCode: 'ee-EE' });
-import { toWords } from 'to-words/ee-EE';
+const tw = new ToWords({ localeCode: 'et-EE' });
+import { toWords } from 'to-words/et-EE';
-const nepali = new ToWords({ localeCode: 'np-NP' });
-import { toCurrency } from 'to-words/np-NP';
+const nepali = new ToWords({ localeCode: 'ne-NP' });
+import { toCurrency } from 'to-words/ne-NP';
```

This also applies to functional helper options, CLI `--locale` values, and manifest lookups. The former codes are not retained as aliases: `ee` identifies the separate Ewe language, while `np` is not a registered language subtag. Estonian and Nepali output is otherwise unchanged, and automatic detection now recognizes `et`/`et-EE` and `ne`/`ne-NP`.

Four other contracts are intentionally stricter:

- `new ToWords()` now auto-detects the runtime locale like the functional helpers. Use `new ToWords({ localeCode: 'en-IN' })` to preserve the old implicit class default.
- Locale options use the generated `LocaleCode` union. Use `resolveLocale(dynamicString)` for request, profile, or picker values; canonical variants such as `EN_us` resolve to `en-US`.
- `LOCALES` and both exported default objects are frozen, constructor options are snapshotted, and the full `ToWords` / public `ToWordsCore` validate custom locale classes on first use. Per-locale entry points keep using their smaller prevalidated table.
- Conversion defaults to `rangeMode: 'strict'` and throws `NumberOutOfRangeError` above the form-specific ceiling. Use `{ rangeMode: 'compose' }` (or CLI `--range-mode compose`) only when legacy recursive composition is intentional.

The exact cardinal, ordinal, and currency ceilings are available from `getLocaleMetadata(localeCode).range.maximumSupported`.

## Upgrading from `to-words` v5

v6 corrects several public behaviors that could silently produce the wrong locale or numeric result. Most applications need no code changes, but check these cases:

- Language-only and unknown-region locale tags now use explicit defaults instead of registry order: `en` → `en-US`, `es` → `es-ES`, `pt` → `pt-BR`, and `sw` → `sw-KE`. Pass a full `localeCode` if your application needs another regional variant.
- `getLocale().config` is recursively frozen after initialization so mutation cannot invalidate internal lookup caches. Complete custom locale configuration before calling `setLocale()` or performing a conversion.
- `toFixed()` now uses decimal-safe rounding, `isFloat()` recognizes valid numeric strings and BigInts, and `isNumberZero()` returns `true` only for exact zero. Audit code that called these public utility methods directly.
- The CLI now rejects unknown options, repeated `--locale`, and conflicting conversion modes, and accepts an exact numeric string for ordinals. Use `--` before negative positional values when needed.
- `setLocaleDetector()` remains process-global. In SSR and APIs, pass `{ localeCode }` per request instead of changing the detector while requests are in flight.

The normal conversion API is unchanged. The release also preserves large integer strings, fixes decimal currency rounding and negative sub-unit signs, and adds Spanish ordinal gender handling.

## Upgrading from `to-words` v4

If you already use the class API, the upgrade is additive rather than disruptive.

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'en-IN' });
tw.convert(1234);
tw.toOrdinal(3);
```

New in v5:

- Functional helpers: `toWords()`, `toOrdinal()`, `toCurrency()`
- Runtime locale detection: `detectLocale()`
- Application-wide/test locale override hook: `setLocaleDetector()` (pass `localeCode` explicitly per server request)
- Per-locale functional exports for better tree-shaking
- BigInt and string-safe large-number handling

## Migrating from `number-to-words`

```js
// Before
const converter = require('number-to-words');
converter.toWords(21);

// After
import { toWords, toOrdinal } from 'to-words/en-US';

toWords(21);
toOrdinal(21);
```

Main differences:

- `to-words` returns full ordinal words, not numeric suffixes
- Output is title-cased instead of lower-case with hyphens
- Currency mode is built in

## Migrating from `written-number`

```js
// Before
writtenNumber(1234, { lang: 'es' });

// After
import { toWords } from 'to-words';

toWords(1234, { localeCode: 'es-ES' });
```

Move from language shorthands like `es` to full BCP 47 locale codes such as `es-ES` and `fr-FR`.

## Migrating from `num-words`

```js
import { toWords } from 'to-words/en-IN';

toWords(123456);
toWords(9999999999999n);
```

This is the best route when you want Indian numbering plus BigInt safety.

## Migrating from `n2words`

```js
import { toWords as en } from 'to-words/en-US';
import { toWords as es } from 'to-words/es-ES';

en(42);
es(42);
```

Both packages support locale subpath imports. `to-words` differs by also supporting root imports with `localeCode` when the language is chosen at runtime.

## Full Reference

For the full side-by-side comparison and regression checklist, see [MIGRATION.md](https://github.com/mastermunj/to-words/blob/main/MIGRATION.md).

## Related

- [Compare packages](/compare/number-to-words-alternatives)
- [Tree-shaking guide](/guide/tree-shaking)
- [API Reference](/guide/api-reference)

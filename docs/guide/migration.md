---
title: Migrate from number-to-words, written-number, n2words | to-words
description: Side-by-side migration guide from number-to-words, written-number, num-words, and n2words to to-words, plus v4 to v5 upgrade notes.
---

# Migration Guide

`to-words` is designed to be low-friction if you are coming from another number-to-words package. The class API stays compatible with earlier `to-words` releases, and the functional helpers give you a modern migration path when you want less boilerplate.

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
- Server override hook: `setLocaleDetector()`
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

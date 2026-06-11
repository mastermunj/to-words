---
title: Ordinal Numbers in JavaScript — First, Second, Third | to-words
description: Generate ordinal numbers in 132 locales. First, Second, Première, Primero, and more. TypeScript, ESM. npm install to-words.
head:
  - - meta
    - name: keywords
      content: ordinal numbers javascript, toOrdinal typescript, first second third javascript
---

# Ordinal Numbers

Use ordinal mode when the UI needs full words like `First`, `Twenty First`, or locale-native equivalents instead of suffixes like `1st` and `21st`.

## Basic Usage

```js
import { toOrdinal } from 'to-words';

toOrdinal(1, { localeCode: 'en-US' }); // "First"
toOrdinal(21, { localeCode: 'en-US' }); // "Twenty First"
toOrdinal(1, { localeCode: 'fr-FR' }); // "Premier"
toOrdinal(1, { localeCode: 'es-ES' }); // "Primero"
```

## Class API

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'tr-TR' });

tw.toOrdinal(3);
tw.toOrdinal(12);
```

## Per-Locale Imports

```js
import { toOrdinal } from 'to-words/en-US';

toOrdinal(1);
toOrdinal(100);
```

## Locale Notes

- English, Spanish, French, Portuguese, Turkish, and Dutch have explicit ordinal word mappings
- Chinese locales can also use `formal: true` for financial-style ordinal characters
- Ordinal conversion expects a non-negative integer input

## Common Uses

- Rankings and leaderboard labels
- Onboarding or checkout step names
- Educational content and voice output
- Report generation where full-word ordinals read better than suffixes

## Related

- [API Reference](/guide/api-reference)
- [Turkish](/locales/turkish)
- [Spanish](/locales/spanish)

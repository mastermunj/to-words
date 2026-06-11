---
title: Tree-Shakeable Locale Imports — Bundle Size Guide | to-words
description: Import only the locale you need with to-words per-locale entry points. Reduce bundle size from the full bundle to small locale-specific imports.
head:
  - - meta
    - name: keywords
      content: tree shaking number to words, per locale import npm, number to words bundle size, to-words locale imports
---

# Tree-Shakeable Locale Imports

If your app only needs one or a small set of locales, import from `to-words/<locale>` instead of the full package entry point. This removes the rest of the locale registry from your client bundle.

## Full Bundle

```js
import { toWords } from 'to-words';

toWords(12345, { localeCode: 'en-US' });
```

Use this when users can switch languages dynamically at runtime.

## Per-Locale Import

```js
import { ToWords, toWords, toOrdinal, toCurrency } from 'to-words/en-US';

const tw = new ToWords();

tw.convert(12345);
toOrdinal(21);
toCurrency(100);
```

Per-locale imports are the best fit for fixed-locale websites, embedded widgets, or any frontend bundle where every kilobyte matters.

## What Changes?

- You stop passing `localeCode`
- The same APIs stay available
- Bundlers can remove every unused locale implementation

## Choosing Between The Two

- Use the full bundle for runtime locale switching
- Use per-locale imports for performance-sensitive frontends
- Mix both patterns if your server uses the full bundle but your client widgets are locale-specific

## Related

- [Getting started](/guide/getting-started)
- [Framework integration](/guide/framework-integration)
- [Compare packages](/compare/number-to-words-alternatives)

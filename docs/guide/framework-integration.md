---
title: Framework Integration — React, Vue, Angular, Next.js | to-words
description: Use to-words in React, Vue 3, Angular, Svelte, Next.js, and Node.js or Express with copy-paste integration examples.
head:
  - - meta
    - name: keywords
      content: number to words react, number to words vue, number to words next.js, angular number to words pipe, express amount in words
---

# Framework Integration

`to-words` works well in frontend apps, SSR frameworks, and backend services because the API is small and locale handling can be either fixed, passed explicitly, or auto-detected.

## React

```tsx
import { toCurrency } from 'to-words/en-US';

export function PriceInWords({ amount }: { amount: number }) {
  return <span>{toCurrency(amount)}</span>;
}
```

## Vue 3

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { ToWords } from 'to-words/en-US';

const props = defineProps<{ amount: number }>();
const tw = new ToWords();
const words = computed(() => tw.convert(props.amount, { currency: true }));
</script>

<template>
  <span>{{ words }}</span>
</template>
```

## Angular

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { ToWords } from 'to-words/en-US';

@Pipe({ name: 'toWords', standalone: true })
export class ToWordsPipe implements PipeTransform {
  private tw = new ToWords();

  transform(value: number, currency = false): string {
    return this.tw.convert(value, { currency });
  }
}
```

## Svelte

```svelte
<script lang="ts">
  import { ToWords } from 'to-words/en-US';

  export let amount: number;

  const tw = new ToWords();
  $: words = tw.convert(amount, { currency: true });
</script>

<span>{words}</span>
```

## Next.js and SSR

```tsx
import { toCurrency } from 'to-words';

export default function AmountInWords({ amount, locale }: { amount: number; locale: string }) {
  return <p>{toCurrency(amount, { localeCode: locale })}</p>;
}
```

Use the full bundle in SSR when locale comes from request headers, cookies, or user preferences.

A client component can let the user switch locale:

```tsx
'use client';

import { useState } from 'react';
import { toCurrency, detectLocale } from 'to-words';

export function CurrencyDisplay({ amount }: { amount: number }) {
  const [locale, setLocale] = useState(detectLocale('en-US'));
  return (
    <div>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="fr-FR">French</option>
        <option value="hi-IN">Hindi</option>
        <option value="ar-AE">Arabic</option>
      </select>
      <p>{toCurrency(amount, { localeCode: locale })}</p>
    </div>
  );
}
```

## Express or Node.js APIs

```ts
import express from 'express';
import { toWords } from 'to-words';

const app = express();

app.get('/convert', (req, res) => {
  const locale = String(req.query.locale ?? req.headers['accept-language']?.split(',')[0] ?? 'en-US');
  const number = String(req.query.number ?? '0');
  try {
    res.json({ result: toWords(number, { localeCode: locale }) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
```

## Integration Tips

- Fixed locale UI: use per-locale imports
- User-selectable locale UI: use full-bundle helpers with explicit `localeCode`
- SSR: derive locale from request state and pass `localeCode` explicitly; `setLocaleDetector()` is process-global
- Finance flows: pass currency values as strings when decimal precision matters

## Related

- [Tree-shaking guide](/guide/tree-shaking)
- [API Reference](/guide/api-reference)
- [Invoice use case](/use-cases/invoicing)

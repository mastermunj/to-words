---
title: E-commerce Checkout Totals in Words — to-words
description: Show checkout and order totals in words to reduce ambiguity on high-value orders. Works across 132 locales with to-words.
head:
  - - meta
    - name: keywords
      content: ecommerce amount in words javascript, checkout total in words, order confirmation amount in words, multilingual cart totals
---

# E-commerce Checkout Totals in Words

For high-value orders, showing the total in words alongside digits helps reduce payment disputes and improves confirmation clarity.

## Where This Helps

- B2B orders with manual approval
- COD and bank-transfer flows
- Localized checkout experiences in multi-country stores

## Checkout Rendering Example

```js
import { toCurrency } from 'to-words';

function checkoutSummary(total, localeCode) {
  return {
    total,
    totalInWords: toCurrency(total, {
      localeCode,
      doNotAddOnly: true,
    }),
  };
}

checkoutSummary('1299.99', 'en-US');
checkoutSummary('1299.99', 'es-MX');
```

## Order Confirmation Email Snippet

```js
const orderTotal = '8450.00';
const localeCode = 'fr-FR';

const amountInWords = toCurrency(orderTotal, {
  localeCode,
  includeZeroFractional: true,
});

// Include amountInWords in email template
```

## Why Teams Add This

- Clearer confirmation for customers and support teams
- Locale-specific currency wording without custom rules per region
- Reusable server-side formatting for checkout, order detail, and invoice pages

## Related

- [Invoicing](/use-cases/invoicing)
- [Framework integration](/guide/framework-integration)
- [Spanish locale guidance](/locales/spanish)

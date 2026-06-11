---
title: Payroll Amount in Words JavaScript — to-words
description: Generate payroll and payslip amounts in words across 132 locales using to-words. Useful for salary slips, HR systems, and statutory forms.
head:
  - - meta
    - name: keywords
      content: payroll amount in words javascript, payslip amount in words nodejs, salary slip amount in words, hr software number to words
---

# Payroll & Payslip Amounts in Words

Payroll exports and salary slips often require totals in words for compliance, auditing, and dispute reduction. `to-words` gives consistent wording across countries and currency systems.

## The Problem

Payroll systems usually store precise numeric values, but final payout documents are human-facing. Teams need locale-correct wording for salary letters, bank upload files, and payslip PDFs.

## Payroll Conversion Pattern

```js
import { toCurrency } from 'to-words';

function payoutWords(netSalary, localeCode) {
  return toCurrency(netSalary, {
    localeCode,
    doNotAddOnly: true,
  });
}

payoutWords('87500.00', 'en-IN');
payoutWords('87500.00', 'ar-SA');
```

## Payslip PDF Example (Node.js)

```js
const netPay = '45230.75';

const words = toCurrency(netPay, {
  localeCode: 'en-IN',
});

doc.text(`Net Pay: INR ${netPay}`);
doc.text(`Net Pay (in words): ${words}`);
```

Use string values for payroll decimals when trailing zeros and exact precision matter.

## Why This Works Well For Payroll

- One conversion API for global payroll entities
- Locale currency units are handled by the locale configuration
- Works for South Asian, European, RTL, and East Asian payroll templates

## Related

- [Invoicing](/use-cases/invoicing)
- [Currency guide](/guide/currency)
- [Indian locale guidance](/locales/hindi)

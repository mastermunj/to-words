---
title: Invoice Amount in Words JavaScript — to-words
description: Print invoice amounts in words across 132 locales using to-words. Node.js, PDFKit, jsPDF, React, Vue. npm install to-words.
head:
  - - meta
    - name: keywords
      content: invoice amount in words javascript, invoice number to words npm, billing amount in words nodejs, amount in words pdf
---

# Invoice Amount in Words

Most invoicing regulations globally require the total to be written in words. `to-words` handles 132 locales — generate the right phrase for every customer's jurisdiction.

## The Problem

Invoice systems often store amounts correctly but render them poorly for print, compliance, or customer-facing PDFs. A generic English-only helper breaks as soon as you need Hindi rupees, Arabic invoices, or region-specific currency names.

## Solution with to-words

```js
import { toCurrency } from 'to-words';

function invoiceWords(amount, localeCode) {
  return toCurrency(amount, { localeCode });
}

invoiceWords(1234.56, 'en-US');
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"

invoiceWords(1234.56, 'hi-IN');
// "बारह सौ चौंतीस रुपये और छप्पन पैसे"

invoiceWords(1234.56, 'ar-SA');
// "ألف ومئتان وأربعة وثلاثون ريالاً وستة وخمسون هللة"
```

## Multi-Locale Invoice Example

```js
const locales = ['en-US', 'hi-IN', 'es-ES', 'ar-SA'];
const amount = '12500.75';

const totals = locales.map((localeCode) => ({
  localeCode,
  words: toCurrency(amount, { localeCode }),
}));
```

This pattern works well when a billing system must generate the same invoice in the seller's language, the buyer's language, and a compliance language.

## With PDFKit (Node.js)

```js
import PDFDocument from 'pdfkit';
import { toCurrency } from 'to-words';

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('invoice.pdf'));

const amount = 4500.0;
const words = toCurrency(amount, { localeCode: 'en-IN' });

doc.text(`Amount: ₹${amount.toFixed(2)}`);
doc.text(`Amount in words: ${words}`);
doc.end();
```

## Why This Works Better Than A Custom Helper

- Currency names already match the locale config
- Decimal handling stays consistent for print and PDF output
- The same conversion call works in frontend previews and backend document generation
- Large values can use `bigint` or string input when finance systems exceed safe integer limits

## Related

- [Currency conversion guide](/guide/currency)
- [Cheque printing](/use-cases/check-printing)
- [Hindi locale](/locales/hindi)
- [Arabic locale](/locales/arabic)

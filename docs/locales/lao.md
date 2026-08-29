---
title: Lao Number to Words in JavaScript (lo-LA) | to-words
description: Convert numbers to Lao words in JavaScript with lo-LA support, Lao Kip currency, and ordinal numbers. npm install to-words.
head:
  - - meta
    - name: keywords
      content: lao number to words javascript, lo-LA number to words npm, ຕົວເລກເປັນຕົວໜັງສື ລາວ, ກີບ ເປັນຄໍາ javascript
---

# Lao Number to Words in JavaScript (lo-LA)

Use `lo-LA` when your application needs Lao number words for invoicing in Laos, checkout flows, or documents that print totals in full words.

> **Locale codes:** `lo-LA` · **Numbering system:** ພັນ 10³, ແສນ 10⁵, ລ້ານ 10⁶ · **Currency:** ກີບ (Kip) · **Script:** Lao

## Install

```bash
npm install to-words
```

## Basic Conversion

```js
import { ToWords } from 'to-words';

const tw = new ToWords({ localeCode: 'lo-LA' });

tw.convert(100); // ໜຶ່ງຮ້ອຍ
tw.convert(1000); // ໜຶ່ງພັນ
tw.convert(1000000); // ໜຶ່ງລ້ານ
```

Lao has a named scale word at 100,000 (ແສນ) but reads 10,000 as ສິບພັນ — "ten
thousand" — which is the form used in Lao banking and finance:

```js
tw.convert(10000); // ສິບພັນ
tw.convert(100000); // ໜຶ່ງແສນ
tw.convert(792581); // ເຈັດແສນເກົ້າສິບສອງພັນຫ້າຮ້ອຍແປດສິບເອັດ
```

A trailing 1 after any ten is ເອັດ, not ໜຶ່ງ, and 20 is ຊາວ rather than a compound of ສອງ and ສິບ:

```js
tw.convert(11); // ສິບເອັດ
tw.convert(20); // ຊາວ
tw.convert(21); // ຊາວເອັດ
```

## Currency - Kip

The kip subunit (ອັດ / att) is defunct, so fractional amounts are read as a decimal
with ຈຸດ rather than being given a subunit name:

```js
tw.convert(1234.56, { currency: true });
// ໜຶ່ງພັນສອງຮ້ອຍສາມສິບສີ່ກີບຈຸດຫ້າສິບຫົກຖ້ວນ

tw.convert(500, { currency: true });
// ຫ້າຮ້ອຍກີບຖ້ວນ
```

## Ordinal Numbers

Lao ordinals are formed with the prefix ທີ:

```js
tw.toOrdinal(1); // ທີໜຶ່ງ
tw.toOrdinal(10); // ທີສິບ
tw.toOrdinal(100); // ທີໜຶ່ງຮ້ອຍ
```

## Tree-shakeable (single-locale) import

```js
import { toWords, toCurrency, toOrdinal } from 'to-words/lo-LA';

toWords(1000);
toCurrency(999.99);
```

## Locale Codes

| Locale code | Country | Currency  | Notes      |
| ----------- | ------- | --------- | ---------- |
| `lo-LA`     | Laos    | ກີບ / ອັດ | Lao script |

## Related

- [Currency guide](/guide/currency)
- [Ordinal guide](/guide/ordinal)
- [All locales](/locales/)

## FAQ

**Q: Which locale code should I use for Lao number-to-words output?**
Use `lo-LA`.

**Q: Does `to-words` output Lao in the Lao script?**
Yes. `lo-LA` produces output in the Lao script.

**Q: Why is 10,000 ສິບພັນ and not ໝື່ນ?**
ໝື່ນ is common in speech, but written Lao finance reads 10,000 as ສິບພັນ. `lo-LA` follows the written banking convention. 100,000 still uses the named scale word ແສນ.

**Q: Does `lo-LA` spell out a subunit for the kip?**
No. The att is no longer in circulation, so `currency: true` renders any fractional part as ຈຸດ plus the digits.

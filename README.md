# to-words

[![npm version](https://img.shields.io/npm/v/to-words.svg)](https://www.npmjs.com/package/to-words)
[![npm downloads](https://img.shields.io/npm/dm/to-words.svg)](https://www.npmjs.com/package/to-words)
[![build](https://img.shields.io/github/actions/workflow/status/mastermunj/to-words/ci.yml?branch=main&label=build)](https://github.com/mastermunj/to-words/actions)
[![coverage](https://img.shields.io/badge/coverage-99%25-brightgreen)](https://github.com/mastermunj/to-words)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/to-words?label=minzipped)](https://bundlephobia.com/package/to-words)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/to-words)](https://github.com/mastermunj/to-words/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/to-words)](https://www.npmjs.com/package/to-words)

Convert numbers and currency amounts into words across 100 locales with production-ready BigInt, ordinal, and TypeScript support.

## 🎮 Live Demo

**Try it now:** **[Open Interactive Demo](https://mastermunj.github.io/to-words/)**

Test locale behavior, currency conversion, ordinals, and large number inputs in the browser.

## 🏆 Why to-words

- **100 locale implementations** with region-specific numbering and currency conventions
- **Built for real financial flows**: amount in words, decimals, currency units, and negatives
- **Large number safe** with `BigInt` and string input support
- **Strong developer ergonomics**: TypeScript types, ESM/CJS/UMD, and per-locale imports
- **Performance focused** for high-volume conversion workloads

## 📑 Table of Contents

- [Use Cases](#-use-cases)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [Migration Guide](#-migration-guide)
- [Framework Integration](#%EF%B8%8F-framework-integration)
- [Numbering Systems](#-numbering-systems)
- [API Reference](#%EF%B8%8F-api-reference)
- [Bundle Sizes](#-bundle-sizes)
- [Performance](#-performance)
- [Browser Compatibility](#-browser-compatibility)
- [Supported Locales](#%EF%B8%8F-supported-locales)
- [Error Handling](#%EF%B8%8F-error-handling)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Changelog](#-changelog)
- [License](#-license)

## 💼 Use Cases

- **Invoicing & Billing** — Display amounts in words on invoices, receipts, and financial documents
- **Check Printing** — Banks and financial institutions require amounts in words for check validation
- **E-commerce** — Show order totals in words for clarity and accessibility
- **Legal Documents** — Contracts and agreements often require written-out amounts
- **Educational Apps** — Teach number pronunciation and spelling in different languages
- **Accessibility** — Screen readers benefit from properly formatted number-to-text conversion
- **Localization** — Support global users with region-specific number formatting

## ✨ Features

- **100 Locales** — The most comprehensive locale coverage available
- **BigInt Support** — Handle numbers up to 10^63 (Vigintillion) and beyond
- **Multiple Numbering Systems** — Short scale, Long scale, Indian, and East Asian
- **Currency Formatting** — Locale-specific currency with fractional units
- **Ordinal Numbers** — First, Second, Third, etc.
- **Tree-Shakeable** — Import only the locales you need
- **TypeScript Native** — Full type definitions included
- **Multiple Formats** — ESM, CommonJS, and UMD browser bundles
- **Zero Dependencies** — Lightweight and self-contained
- **High Performance** — Up to 4.7M ops/sec (small integers; see benchmark section for full breakdown)
- **Wide Browser Support** — All modern browsers (Chrome 67+, Firefox 68+, Safari 14+, Edge 79+)

## 🚀 Quick Start

```js
import { ToWords } from 'to-words';

const toWords = new ToWords({ localeCode: 'en-US' });
toWords.convert(12345);
// "Twelve Thousand Three Hundred Forty Five"
```

> **Note:** If you do not provide `localeCode`, the default locale is `en-IN`.

## 📦 Installation

> **Runtime requirement:** Node.js `>= 20`.
>
> Moving from another library? See [`MIGRATION.md`](MIGRATION.md).

### npm / yarn / pnpm

```bash
npm install to-words
# or
yarn add to-words
# or
pnpm add to-words
```

### CDN (Browser)

```html
<!-- Full bundle with all locales -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>

<!-- Single locale bundle (smaller, recommended) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
```

## 📖 Usage

### Importing

```js
// ESM
import { ToWords } from 'to-words';

// CommonJS
const { ToWords } = require('to-words');
```

### Basic Conversion

```js
const toWords = new ToWords({ localeCode: 'en-US' });

toWords.convert(123);
// "One Hundred Twenty Three"

toWords.convert(123.45);
// "One Hundred Twenty Three Point Four Five"

toWords.convert(123.045);
// "One Hundred Twenty Three Point Zero Four Five"
```

> **Note:** When the fractional part starts with zero, digits after the decimal point are converted individually.

### BigInt & Large Numbers

Handle numbers beyond JavaScript's safe integer limit:

```js
const toWords = new ToWords({ localeCode: 'en-US' });

// Using BigInt
toWords.convert(1000000000000000000n);
// "One Quintillion"

toWords.convert(1000000000000000000000000000000000000000000000000000000000000000n);
// "One Vigintillion"

// Using string for precision
toWords.convert('9007199254740993');
// "Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion
//  Two Hundred Fifty Four Million Seven Hundred Forty Thousand Nine Hundred Ninety Three"
```

### Currency Conversion

```js
const toWords = new ToWords({ localeCode: 'en-IN' });

toWords.convert(452, { currency: true });
// "Four Hundred Fifty Two Rupees Only"

toWords.convert(452.36, { currency: true });
// "Four Hundred Fifty Two Rupees And Thirty Six Paise Only"

// Without "Only" suffix
toWords.convert(452, { currency: true, doNotAddOnly: true });
// "Four Hundred Fifty Two Rupees"

// Ignore decimal/fractional part
toWords.convert(452.36, { currency: true, ignoreDecimal: true });
// "Four Hundred Fifty Two Rupees Only"

// Ignore zero currency
toWords.convert(0.36, { currency: true, ignoreZeroCurrency: true });
// "Thirty Six Paise Only"
```

### Custom Currency

Override currency settings while keeping the locale's language:

```js
const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    currencyOptions: {
      name: 'Euro',
      plural: 'Euros',
      symbol: '€',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '',
      },
    },
  },
});

toWords.convert(100.50);
// "One Hundred Euros And Fifty Cents Only"
```

### Ordinal Numbers

```js
const toWords = new ToWords({ localeCode: 'en-US' });

toWords.toOrdinal(1);    // "First"
toWords.toOrdinal(21);   // "Twenty First"
toWords.toOrdinal(100);  // "One Hundredth"
```

> **Note:** Full ordinal word mappings are available for English, Spanish, French, Portuguese, Turkish, and Dutch locales. Other locales use suffix-based ordinals.

### Tree-Shakeable Imports

Import only the locales you need for smaller bundle sizes:

```js
// Import specific locale directly (includes ToWords configured for that locale)
import { ToWords } from 'to-words/en-US';

const toWords = new ToWords();
toWords.convert(12345);
// "Twelve Thousand Three Hundred Forty Five"
```

### Browser Usage (UMD)

```html
<!-- Single locale (recommended, ~3 KB gzip) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  // ToWords is pre-configured for en-US
  const toWords = new ToWords();
  console.log(toWords.convert(12345));
  // "Twelve Thousand Three Hundred Forty Five"
</script>

<!-- Full bundle with all locales (~54 KB gzip) -->
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/to-words.min.js"></script>
<script>
  // Specify locale when using full bundle
  const toWords = new ToWords({ localeCode: 'fr-FR' });
  console.log(toWords.convert(12345));
  // "Douze Mille Trois Cent Quarante-Cinq"
</script>
```


## 🔄 Migration Guide

Migrating from `number-to-words`, `written-number`, `num-words`, or `n2words`?

- See [`MIGRATION.md`](MIGRATION.md) for side-by-side API mapping and migration recipes.
- Includes package comparison, behavior notes, and a regression checklist.

## ⚛️ Framework Integration

### React

```tsx
// Change the locale import to match your users' region (e.g. 'to-words/en-GB' for UK)
import { ToWords } from 'to-words/en-US';

const toWords = new ToWords();

function PriceInWords({ amount }: { amount: number }) {
  const words = toWords.convert(amount, { currency: true });
  return <span className="price-words">{words}</span>;
}

// Usage: <PriceInWords amount={1234.56} />
// Renders: "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
```

### Vue 3

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { ToWords } from 'to-words/en-US';

const props = defineProps<{ amount: number }>();
const toWords = new ToWords();

const words = computed(() => 
  toWords.convert(props.amount, { currency: true })
);
</script>

<template>
  <span class="price-words">{{ words }}</span>
</template>
```

### Angular

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { ToWords } from 'to-words/en-US';

@Pipe({ name: 'toWords', standalone: true })
export class ToWordsPipe implements PipeTransform {
  private toWords = new ToWords();

  transform(value: number, currency = false): string {
    return this.toWords.convert(value, { currency });
  }
}

// Usage: {{ 1234.56 | toWords:true }}
```

### Svelte

```svelte
<script lang="ts">
  import { ToWords } from 'to-words/en-US';
  
  export let amount: number;
  
  const toWords = new ToWords();
  $: words = toWords.convert(amount, { currency: true });
</script>

<span class="price-words">{words}</span>
```

## 🌍 Numbering Systems

Different regions use different numbering systems. This library supports all major systems:

### Short Scale (Western)

Used in: USA, UK, Canada, Australia, and most English-speaking countries.

| Number | Name |
|--------|------|
| 10^6 | Million |
| 10^9 | Billion |
| 10^12 | Trillion |
| 10^15 | Quadrillion |
| ... | ... |
| 10^63 | Vigintillion |

```js
const toWords = new ToWords({ localeCode: 'en-US' });
toWords.convert(1000000000000000000n);
// "One Quintillion"
```

### Long Scale (European)

Used in: Germany, France, and many European countries.

| Number | German | French |
|--------|--------|--------|
| 10^6 | Million | Million |
| 10^9 | Milliarde | Milliard |
| 10^12 | Billion | Billion |
| 10^15 | Billiarde | Billiard |

```js
const toWords = new ToWords({ localeCode: 'de-DE' });
toWords.convert(1000000000);
// "Eins Milliarde"
```

### Indian System

Used in: India, Bangladesh, Nepal, Pakistan.

| Number | Name |
|--------|------|
| 10^5 | Lakh |
| 10^7 | Crore |
| 10^9 | Arab |
| 10^11 | Kharab |
| 10^13 | Neel |
| 10^15 | Padma |
| 10^17 | Shankh |

```js
const toWords = new ToWords({ localeCode: 'en-IN' });
toWords.convert(100000000000000000n);
// "One Shankh"

const toWordsHindi = new ToWords({ localeCode: 'hi-IN' });
toWordsHindi.convert(100000000000000000n);
// "एक शंख"
```

### East Asian System

Used in: Japan, China, Korea.

| Number | Character |
|--------|-----------|
| 10^4 | 万 (Man/Wan) |
| 10^8 | 億 (Oku/Yi) |
| 10^12 | 兆 (Chō/Zhao) |
| 10^16 | 京 (Kei/Jing) |
| 10^20 | 垓 (Gai) |

```js
const toWords = new ToWords({ localeCode: 'ja-JP' });
toWords.convert(100000000);
// "一 億"
```

## ⚙️ API Reference

### Constructor Options

```typescript
interface ToWordsOptions {
  localeCode?: string;           // Default: 'en-IN'
  converterOptions?: {
    currency?: boolean;          // Default: false
    ignoreDecimal?: boolean;     // Default: false
    ignoreZeroCurrency?: boolean;// Default: false
    doNotAddOnly?: boolean;      // Default: false
    currencyOptions?: {
      name: string;
      plural: string;
      symbol: string;
      fractionalUnit: {
        name: string;
        plural: string;
        symbol: string;
      };
    };
  };
}
```

### Methods

#### `convert(number, options?)`

Converts a number to words.

- **number**: `number | bigint | string` — The number to convert
- **options**: `ConverterOptions` — Override instance options
- **returns**: `string` — The number in words

#### `toOrdinal(number)`

Converts a number to ordinal words.

- **number**: `number` — The number to convert (must be non-negative integer)
- **returns**: `string` — The ordinal in words (e.g., "First", "Twenty Third")

### Converter Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `currency` | boolean | false | Convert as currency with locale-specific formatting |
| `ignoreDecimal` | boolean | false | Ignore fractional part when converting |
| `ignoreZeroCurrency` | boolean | false | Skip zero main currency (e.g., show only "Thirty Six Paise") |
| `doNotAddOnly` | boolean | false | Omit "Only" suffix in currency mode |
| `currencyOptions` | object | undefined | Override locale's default currency settings |

### Common Options Example

```js
const toWords = new ToWords({ localeCode: 'en-US' });

toWords.convert(1234.56, {
  currency: true,
  ignoreDecimal: false,
  doNotAddOnly: true,
});
// "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents"
```

## 📏 Bundle Sizes

| Import Method | Raw | Gzip |
|--------------|-----|------|
| Full bundle (all locales) | 564 KB | 54 KB |
| Single locale (en-US) | 11.5 KB | 3.2 KB |
| Single locale (en-IN) | 9.3 KB | 3.1 KB |

> **Tip:** Use tree-shakeable imports or single-locale UMD bundles for the smallest bundle size.

## ⚡ Performance

Benchmarked on Apple M2 (Node.js 23):

| Operation | Throughput |
|-----------|------------|
| Small integers (42) | ~4.7M ops/sec |
| Medium integers (12,345) | ~2.2M ops/sec |
| Large integers (15 digits) | ~700K ops/sec |
| Currency conversion | ~1M ops/sec |
| BigInt (30+ digits) | ~225K ops/sec |

Run benchmarks locally:

```bash
npm run bench
```

## 🌐 Browser Compatibility

| Browser | Version |
|---------|--------|
| Chrome | 67+ |
| Firefox | 68+ |
| Safari | 14+ |
| Edge | 79+ |
| Opera | 54+ |

**BigInt Support:** BigInt is required for full functionality. Internet Explorer is not supported.

## 🗺️ Supported Locales

All 100 locales with their features:

| Locale | Language | Country | Currency | Scale | Ordinal |
|--------|----------|---------|----------|-------|---------|
| af-ZA | Afrikaans | South Africa | Rand | Short | ✓ |
| am-ET | Amharic | Ethiopia | ብር | Short | ✓ |
| ar-AE | Arabic | UAE | درهم | Short | ✓ |
| ar-LB | Arabic | Lebanon | ليرة | Short | ✓ |
| ar-MA | Arabic | Morocco | درهم | Short | ✓ |
| ar-SA | Arabic | Saudi Arabia | ريال | Short | ✓ |
| az-AZ | Azerbaijani | Azerbaijan | Manat | Short | ✓ |
| be-BY | Belarusian | Belarus | Рубель | Short | ✓ |
| bg-BG | Bulgarian | Bulgaria | Лев | Short | ✓ |
| bn-IN | Bengali | India | টাকা | Short | ✓ |
| ca-ES | Catalan | Spain | Euro | Short | ✓ |
| cs-CZ | Czech | Czech Republic | Koruna | Short | ✓ |
| da-DK | Danish | Denmark | Krone | Long | ✓ |
| de-DE | German | Germany | Euro | Long | ✓ |
| ee-EE | Estonian | Estonia | Euro | Short | ✓ |
| el-GR | Greek | Greece | Ευρώ | Short | ✓ |
| en-AE | English | UAE | Dirham | Short | ✓ |
| en-AU | English | Australia | Dollar | Short | ✓ |
| en-BD | English | Bangladesh | Taka | Indian | ✓ |
| en-CA | English | Canada | Dollar | Short | ✓ |
| en-GB | English | United Kingdom | Pound | Short | ✓ |
| en-GH | English | Ghana | Cedi | Short | ✓ |
| en-HK | English | Hong Kong | Dollar | Short | ✓ |
| en-IE | English | Ireland | Euro | Short | ✓ |
| en-IN | English | India | Rupee | Indian | ✓ |
| en-JM | English | Jamaica | Dollar | Short | ✓ |
| en-KE | English | Kenya | Shilling | Short | ✓ |
| en-LK | English | Sri Lanka | Rupee | Short | ✓ |
| en-MA | English | Morocco | Dirham | Short | ✓ |
| en-MM | English | Myanmar | Kyat | Short | ✓ |
| en-MU | English | Mauritius | Rupee | Indian | ✓ |
| en-MY | English | Malaysia | Ringgit | Short | ✓ |
| en-NG | English | Nigeria | Naira | Short | ✓ |
| en-NP | English | Nepal | Rupee | Indian | ✓ |
| en-NZ | English | New Zealand | Dollar | Short | ✓ |
| en-OM | English | Oman | Rial | Short | ✓ |
| en-PH | English | Philippines | Peso | Short | ✓ |
| en-PK | English | Pakistan | Rupee | Indian | ✓ |
| en-SA | English | Saudi Arabia | Riyal | Short | ✓ |
| en-SG | English | Singapore | Dollar | Short | ✓ |
| en-TT | English | Trinidad and Tobago | Dollar | Short | ✓ |
| en-US | English | USA | Dollar | Short | ✓ |
| en-ZA | English | South Africa | Rand | Short | ✓ |
| es-AR | Spanish | Argentina | Peso | Short | ✓ |
| es-CL | Spanish | Chile | Peso | Short | ✓ |
| es-CO | Spanish | Colombia | Peso | Short | ✓ |
| es-ES | Spanish | Spain | Euro | Short | ✓ |
| es-MX | Spanish | Mexico | Peso | Short | ✓ |
| es-US | Spanish | USA | Dólar | Short | ✓ |
| es-VE | Spanish | Venezuela | Bolívar | Short | ✓ |
| fa-IR | Persian | Iran | تومان | Short | ✓ |
| fi-FI | Finnish | Finland | Euro | Short | ✓ |
| fil-PH | Filipino | Philippines | Piso | Short | ✓ |
| fr-BE | French | Belgium | Euro | Long | ✓ |
| fr-FR | French | France | Euro | Long | ✓ |
| fr-MA | French | Morocco | Dirham | Long | ✓ |
| fr-SA | French | Saudi Arabia | Riyal | Long | ✓ |
| gu-IN | Gujarati | India | રૂપિયો | Short | ✓ |
| ha-NG | Hausa | Nigeria | Naira | Short | ✓ |
| hbo-IL | Biblical Hebrew | Israel | שקל | Short | ✓ |
| he-IL | Hebrew | Israel | שקל | Short | ✓ |
| hi-IN | Hindi | India | रुपया | Indian | ✓ |
| hr-HR | Croatian | Croatia | Euro | Short | ✓ |
| hu-HU | Hungarian | Hungary | Forint | Short | ✓ |
| id-ID | Indonesian | Indonesia | Rupiah | Short | ✓ |
| is-IS | Icelandic | Iceland | Króna | Short | ✓ |
| it-IT | Italian | Italy | Euro | Short | ✓ |
| ja-JP | Japanese | Japan | 円 | East Asian | ✓ |
| ka-GE | Georgian | Georgia | ლარი | Short | ✓ |
| kn-IN | Kannada | India | ರೂಪಾಯಿ | Short | ✓ |
| ko-KR | Korean | South Korea | 원 | Short | ✓ |
| lt-LT | Lithuanian | Lithuania | Euras | Short | ✓ |
| lv-LV | Latvian | Latvia | Eiro | Short | ✓ |
| mr-IN | Marathi | India | रुपया | Indian | ✓ |
| ms-MY | Malay | Malaysia | Ringgit | Short | ✓ |
| nb-NO | Norwegian | Norway | Krone | Long | ✓ |
| nl-NL | Dutch | Netherlands | Euro | Short | ✓ |
| nl-SR | Dutch | Suriname | Dollar | Short | ✓ |
| np-NP | Nepali | Nepal | रुपैयाँ | Indian | ✓ |
| pa-IN | Punjabi | India | ਰੁਪਇਆ | Short | ✓ |
| pl-PL | Polish | Poland | Złoty | Short | ✓ |
| pt-BR | Portuguese | Brazil | Real | Short | ✓ |
| pt-PT | Portuguese | Portugal | Euro | Short | ✓ |
| ro-RO | Romanian | Romania | Leu | Short | ✓ |
| ru-RU | Russian | Russia | Рубль | Short | ✓ |
| sk-SK | Slovak | Slovakia | Euro | Short | ✓ |
| sl-SI | Slovenian | Slovenia | Euro | Short | ✓ |
| sq-AL | Albanian | Albania | Lek | Short | ✓ |
| sr-RS | Serbian | Serbia | Dinar | Short | ✓ |
| sv-SE | Swedish | Sweden | Krona | Short | ✓ |
| sw-KE | Swahili | Kenya | Shilingi | Short | ✓ |
| ta-IN | Tamil | India | ரூபாய் | Short | ✓ |
| te-IN | Telugu | India | రూపాయి | Short | ✓ |
| th-TH | Thai | Thailand | บาท | Short | ✓ |
| tr-TR | Turkish | Turkey | Lira | Short | ✓ |
| uk-UA | Ukrainian | Ukraine | Гривня | Short | ✓ |
| ur-PK | Urdu | Pakistan | روپیہ | Short | ✓ |
| vi-VN | Vietnamese | Vietnam | Đồng | Short | ✓ |
| yo-NG | Yoruba | Nigeria | Naira | Short | ✓ |
| zh-CN | Chinese | China | 元 | East Asian | ✓ |

**Scale Legend:**
- **Short** — Western short scale (Million, Billion, Trillion...)
- **Long** — European long scale (Million, Milliard, Billion, Billiard...)
- **Indian** — Indian numbering (Lakh, Crore, Arab, Kharab...)
- **East Asian** — East Asian numbering (万, 億, 兆, 京...)

## ⚠️ Error Handling

The library throws descriptive errors for invalid inputs:

### Invalid Number

```js
toWords.convert('abc');
// Error: Invalid Number "abc"

toWords.convert(NaN);
// Error: Invalid Number "NaN"

toWords.convert(Infinity);
// Error: Invalid Number "Infinity"
```

### Unknown Locale

```js
const toWords = new ToWords({ localeCode: 'xx-XX' });
toWords.convert(123);
// Error: Unknown Locale "xx-XX"
```

### Invalid Ordinal Input

```js
toWords.toOrdinal(-5);
// Error: Ordinal numbers must be non-negative integers, got "-5"

toWords.toOrdinal(3.14);
// Error: Ordinal numbers must be non-negative integers, got "3.14"
```

### Handling Errors

```js
try {
  const words = toWords.convert(userInput);
  console.log(words);
} catch (error) {
  console.error('Conversion failed:', error.message);
}
```

## 🤝 Contributing

### Adding a New Locale

1. **Create the locale file**: Add `src/locales/<locale-code>.ts` implementing `LocaleInterface` from `src/types.ts`. Use an existing locale as a template.

2. **Register the locale**: Import your class in `src/locales/index.ts` and add it to the `LOCALES` map.

3. **Add tests**: Create `__tests__/<locale-code>.test.ts` covering integers, negatives, decimals, and currency.

4. **Update documentation**: Add the locale to the Supported Locales section above.

5. **Build and test**: Run `npm test` and `npm run build`, then submit your PR.

## ❓ FAQ

<details>
<summary><strong>How do I handle numbers larger than JavaScript's safe integer limit?</strong></summary>

Use BigInt or pass the number as a string:

```js
// Using BigInt
toWords.convert(9007199254740993n);

// Using string
toWords.convert('9007199254740993');
```

</details>

<details>
<summary><strong>Why am I seeing scientific notation in my output?</strong></summary>

JavaScript automatically converts large numbers to scientific notation. Pass them as strings or BigInt instead:

```js
// ❌ This may give unexpected results
toWords.convert(123456789012345678901);

// ✅ Use string or BigInt
toWords.convert('123456789012345678901');
toWords.convert(123456789012345678901n);
```

</details>

<details>
<summary><strong>Can I use a custom currency?</strong></summary>

Yes! Override the currency options:

```js
toWords.convert(1234.56, {
  currency: true,
  currencyOptions: {
    name: 'Bitcoin',
    plural: 'Bitcoins',
    symbol: '₿',
    fractionalUnit: { name: 'Satoshi', plural: 'Satoshis', symbol: 'sat' }
  }
});
// "One Thousand Two Hundred Thirty Four Bitcoins And Fifty Six Satoshis Only"
```

</details>

<details>
<summary><strong>Does this work in the browser?</strong></summary>

Yes! Use the UMD bundles via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/to-words/dist/umd/en-US.min.js"></script>
<script>
  const toWords = new ToWords();
  console.log(toWords.convert(123));
</script>
```

</details>

<details>
<summary><strong>How do I add support for a new locale?</strong></summary>

See the [Contributing](#-contributing) section above. You'll need to create a locale file implementing the `LocaleInterface` and add tests.

</details>

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 📄 License

[MIT](LICENSE)

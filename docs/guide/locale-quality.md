---
title: Locale Conformance and Quality Gates | to-words
description: How to-words validates locale configuration, behavior, generated metadata, documentation drift, coverage, and release readiness.
---

# Locale Conformance and Quality Gates

Every shipped locale passes the same executable contract. This catches structural and cross-locale regressions while each locale's golden tests continue to verify its expected wording.

## Run the Focused Gate

```bash
npm run test:locale-quality
```

The focused command runs the conformance suite, locale-contract unit tests, configuration invariants, and generated manifest tests. It deliberately disables the project-wide coverage reporter because a focused subset cannot represent whole-package coverage. These tests are also included in the normal `npm test` suite used by pull requests and releases.

Use the complete suite for the authoritative coverage report:

```bash
npm test
```

Generated runtime metadata and documentation have an independent drift check:

```bash
npm run docs:check
```

## What Is Verified

For every locale, the gate verifies:

- a valid, descending, duplicate-free cardinal mapping containing zero;
- deterministic, non-empty cardinal output and parity across `number`, `bigint`, and integer-string input;
- localized negative output and non-empty currency output;
- executable ordinal, grammatical-gender, formal-numeral, and fraction-style behavior whenever the capability manifest claims support;
- conversion immediately below, at, and above the largest explicitly named magnitude;
- exact agreement between locale configurations, the public manifest, and generated documentation;
- immutable capability, numbering-system, and named-range metadata.

The full test suite also enforces project coverage thresholds and locale-specific expected strings. The release workflow reruns tests, builds every module format, checks generated artifacts, smoke-tests compiled runtimes, and inspects package contents before publishing.

## What The Gate Does Not Claim

Conformance proves that a locale follows the package's implementation contract. It is not a substitute for native-speaker review of grammar, regional currency usage, or every recursively composed number above the largest named scale.

New or materially changed locales should therefore include:

1. native-speaker or authoritative-reference review;
2. golden tests at grammatical and scale boundaries;
3. currency, decimal, ordinal, and gender examples relevant to that locale;
4. `npm run test:locale-quality`, the full `npm test`, and `npm run docs:check` results.

## Numbering Metadata

Numbering metadata is derived from configured magnitudes rather than a manually curated locale list. The structural families are `base-thousand`, `indian`, `east-asian`, and `locale-specific`.

`base-thousand` intentionally includes vocabularies commonly called short scale and long scale: both use configured units at powers divisible by three. Applications that need a linguistic short-versus-long distinction should inspect locale output or maintain domain-specific policy instead of inferring it from grouping alone.

See the [generated locale capability manifest](/guide/locale-capabilities) for every locale's numbering family, grouping, named powers of ten, and largest explicitly named magnitude.

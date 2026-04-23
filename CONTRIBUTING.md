# Contributing to `to-words`

Thank you for taking the time to contribute! This document covers everything you need — from filing a bug report to shipping a new locale.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Adding a New Locale](#adding-a-new-locale)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Format](#commit-message-format)
- [Running Tests](#running-tests)
- [Building](#building)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree to abide by its terms.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```sh
   git clone https://github.com/<your-username>/to-words.git
   cd to-words
   ```
3. **Install dependencies** (requires Node ≥ 20):
   ```sh
   npm install
   ```
4. **Create a branch** for your change:
   ```sh
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/issue-123
   ```

---

## Development Setup

| Command                          | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| `npm test`                       | Run the full test suite in watch mode                     |
| `npm run test -- run`            | Run tests once (CI mode)                                  |
| `npm run test -- run --coverage` | Run tests with coverage report                            |
| `npm run lint`                   | Check for linting errors                                  |
| `npm run lint:fix`               | Auto-fix linting errors                                   |
| `npm run build`                  | Full production build (tsgo CJS/ESM + Rolldown UMD + CLI) |
| `npm run commit`                 | Interactive commit with Commitizen                        |

> **Tip:** Run `npm run lint:fix` before committing — the pre-commit hook will block if there are lint errors.

---

## Project Structure

```
src/
  ToWordsCore.ts      # Core conversion engine (no bundled locales)
  ToWords.ts          # Full-bundle class + functional exports (toWords, toOrdinal, toCurrency)
                      # + locale auto-detection (detectLocale, setLocaleDetector)
  types.ts            # Shared TypeScript types
  cli.ts              # CLI entry point
  locales/
    index.ts          # LOCALES registry (maps locale code → class)
    en-US.ts          # Example locale
    en-IN.ts
    …                 # 100 locale files total

__tests__/
  ToWords.test.ts     # Full-bundle + functional helper tests
  ToWordsCore.test.ts # Core engine tests
  <locale>.test.ts    # Per-locale tests (one file per locale)

scripts/
  build-umd.ts        # UMD bundle script
```

---

## How to Contribute

### Reporting Bugs

Before opening a bug report, please [search existing issues](https://github.com/mastermunj/to-words/issues) to avoid duplicates.

When filing a new issue, include:

- **Package version** (`npm list to-words`)
- **Node.js version** (`node -v`)
- **Locale code** you are using
- **Minimal reproduction** — a small code snippet that shows the wrong output
- **Expected vs actual output**

### Suggesting Enhancements

Open an issue with the label `enhancement` and describe:

- The use case you are trying to solve
- The proposed API or behaviour change
- Any locales or edge cases that would be affected

### Submitting a Pull Request

1. Make sure `npm test -- run` and `npm run lint` both pass locally.
2. Keep PRs focused — one feature or fix per PR.
3. If you are adding a feature, add tests that cover it.
4. Fill in the PR template completely.
5. Link related issues in the PR description (`Closes #123`).

---

## Adding a New Locale

This is the most common contribution. Follow these steps:

### 1. Create the locale file

Add `src/locales/<locale-code>.ts`. Use an existing locale as a template (e.g. [src/locales/en-US.ts](src/locales/en-US.ts)).

Your file must:

- Export a `default` class that implements `LocaleInterface` from `src/types.ts`.
- Export the three locale-level functional helpers at the bottom — they wrap the class with no extra arguments, so callers import them tree-shaken without needing a `localeCode`:

  ```ts
  import { type ConverterOptions, type NumberInput, type OrdinalOptions } from '../types.js';
  import { ToWordsCore } from '../ToWordsCore.js';

  export default class extends ToWordsCore {
    // … your locale config …
  }

  // ----- locale-level functional helpers -----
  import type { ToWords as ToWordsType } from '../ToWords.js'; // type-only, no runtime cost

  let _instance: ToWordsType;
  function getInstance(): ToWordsType {
    if (!_instance) {
      // lazy import to keep tree-shaking intact; value is assigned once
      const { ToWords } = require('../ToWords.js') as typeof import('../ToWords.js');
      _instance = new ToWords();
    }
    return _instance;
  }
  ```

  In practice, copy the bottom block verbatim from any existing locale file — the pattern is already standardised across all 100 locales.

### 2. Register the locale

Open `src/locales/index.ts` and:

1. Import your class.
2. Add it to the `LOCALES` map with the correct BCP 47 locale code (e.g. `'sw-TZ'`).

### 3. Add tests

Create `__tests__/<locale-code>.test.ts`. Copy an existing test file and adjust the expected values. Your test file must contain:

- Integers (0, positive, negative)
- Decimals
- Currency amounts (`{ currency: true }`)
- Ordinals (if the locale supports them)
- A `describe('Functional helpers (locale-level)')` block with tests for the three exported helpers — **required for 100% coverage**:

  ```ts
  import {
    toWords as localeToWords,
    toOrdinal as localeToOrdinal,
    toCurrency as localeToCurrency,
  } from '../src/locales/<locale-code>';

  describe('Functional helpers (locale-level)', () => {
    test('toWords', () => {
      expect(localeToWords(5)).toBeDefined();
    });
    test('toOrdinal', () => {
      expect(localeToOrdinal(1)).toBeDefined();
    });
    test('toCurrency', () => {
      expect(localeToCurrency(10)).toBeDefined();
    });
  });
  ```

### 4. Update documentation

Add a row for your locale in the **Supported Locales** table in [README.md](README.md).

### 5. Verify everything works

```sh
npm run lint
npm test -- run --coverage
npm run build
```

All tests must pass and coverage must remain at 100% for the files you touched.

---

## Coding Guidelines

- **TypeScript** — all source files are TypeScript. Avoid `any`; use `unknown` and type guards instead.
- **No runtime dependencies** — the package has zero production `dependencies`. Do not add any.
- **ESM-first** — source is native ESM. Import paths must include the `.js` extension (TypeScript resolves these to `.ts` during compilation).
- **No global state** in locale files — each locale class is stateless.
- **Performance** — the conversion hot path is called thousands of times in invoicing apps. Do not add per-call allocations (e.g. `Array.from`, `Object.keys`) inside `convert()` without benchmarking first (`npm run bench`).
- **Linting** — `npm run lint` must pass with zero warnings. The project uses `@mastermunj/eslint-config`.

---

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by `commitlint`. The easiest way to commit is:

```sh
npm run commit
```

This launches an interactive prompt via Commitizen. Manual commit messages must follow the pattern:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

**Types:** `build`, `ci`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

**Examples:**

```
feat(locales): add sw-TZ (Swahili Tanzania) locale
fix(en-IN): correct ordinal for 11th
docs: update README bundle size figures
test(fr-FR): add decimal currency edge cases
init: bootstrap repository metadata
```

---

## Running Tests

```sh
# Watch mode (default)
npm test

# Single run
npm test -- run

# Single run with coverage
npm test -- run --coverage

# Single file
npm test -- run __tests__/en-US.test.ts

# Benchmarks
npm run bench
```

Coverage is measured by [Vitest v8](https://vitest.dev/guide/coverage). The project targets 100% coverage across all `src/**` files. PRs that drop coverage below 100% for touched files will not be merged.

---

## Building

```sh
npm run build
```

This runs (in order): clean → CJS build → ESM build → UMD build → package.json injection → CLI chmod.

The UMD bundles in `dist/umd/` are generated per-locale via [Rolldown](https://rolldown.rs/) — one bundle for the full package (`to-words.min.js`) and one per locale (`en-US.min.js`, etc.).

---

## Questions?

- **Bug or feature?** [Open an issue](https://github.com/mastermunj/to-words/issues)
- **General question?** [Start a discussion](https://github.com/mastermunj/to-words/discussions)
- **Full API docs:** [README.md](README.md)
- **Migration from another package:** [MIGRATION.md](MIGRATION.md)

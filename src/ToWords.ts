/**
 * ToWords - Full-featured class with all bundled locales.
 *
 * This class extends ToWordsCore and adds locale lookup by code string.
 * It imports all locales, so use this when you need dynamic locale switching
 * or don't care about bundle size.
 *
 * For tree-shaken single-locale imports, use per-locale entry points instead:
 *
 * @example
 * // Full package (all locales ~55KB gzipped)
 * import { ToWords } from 'to-words';
 * const tw = new ToWords({ localeCode: 'en-IN' });
 *
 * // Single locale (~3-4KB gzipped) - SAME API!
 * import { ToWords } from 'to-words/en-IN';
 * const tw = new ToWords();
 */

import {
  type ConstructorOf,
  type ConverterOptions,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
} from './types.js';
import { ToWordsCore, DefaultConverterOptions, DefaultToWordsOptions } from './ToWordsCore.js';
import LOCALES from './locales/index.js';

// Re-export everything from ToWordsCore for backwards compatibility
export { DefaultConverterOptions, DefaultToWordsOptions };
export { LOCALES };

// Module-level instance cache for the functional helpers (toWords / toOrdinal / toCurrency).
// Each locale gets one cached instance — repeated calls at the same locale are zero-overhead.
const instanceCache = new Map<string, ToWords>();

// ---------------------------------------------------------------------------
// Locale detection
// ---------------------------------------------------------------------------

/**
 * Reads the raw locale string from the runtime environment.
 * Checks `navigator.language` first (browser), then falls back to
 * `Intl.DateTimeFormat().resolvedOptions().locale` (Node.js, Deno, Bun, CF Workers).
 * Returns an empty string when neither source is available.
 *
 * This is a private helper — callers should use `detectLocale()` or `setLocaleDetector()`.
 */
function readRawLocale(): string {
  // Browser — access through globalThis so it works in all environments
  try {
    const nav = (globalThis as { navigator?: { language?: string } }).navigator;
    if (nav?.language) {
      return nav.language;
    }
  } catch {
    // noop — browser globals unavailable
  }

  // Node.js / Deno / Bun / CF Workers
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale) {
      return locale;
    }
  } catch {
    // noop — Intl unavailable
  }

  return '';
}

/**
 * Module-level override for locale detection.
 * When set, replaces the default `navigator.language` / Intl detection entirely.
 * Pass `null` to restore the built-in detection.
 *
 * Useful for server environments (e.g. derive locale from `Accept-Language` header)
 * or in tests where you want a fixed locale without mocking globals.
 *
 * @example
 * // Server: resolve locale from request header before handling each request
 * setLocaleDetector(() => req.headers['accept-language']?.split(',')[0] ?? 'en-US');
 *
 * // Test: pin to a specific locale
 * setLocaleDetector(() => 'fr-FR');
 * // … run tests …
 * setLocaleDetector(null); // restore
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
let _localeDetector: (() => string) | null = null;

export function setLocaleDetector(fn: (() => string) | null): void {
  _localeDetector = fn;
}

export class ToWords extends ToWordsCore {
  /**
   * Get the locale class, either from setLocale() or by looking up the localeCode.
   * This overrides ToWordsCore to add LOCALES lookup.
   */
  public getLocaleClass(): ConstructorOf<LocaleInterface> {
    // First check if a locale was set directly via setLocale()
    if (this.localeClass) {
      return this.localeClass;
    }

    // Fall back to looking up by localeCode in LOCALES
    if (!(this.options.localeCode! in LOCALES)) {
      throw new Error(`Unknown Locale "${this.options.localeCode}"`);
    }
    return LOCALES[this.options.localeCode!];
  }
}

/**
 * Returns a cached `ToWords` instance for the given locale.
 * When `localeCode` is omitted, `detectLocale()` is called once here —
 * the single place where auto-detection happens for all functional helpers.
 */
function getCachedInstance(localeCode?: string): ToWords {
  const code = localeCode ?? detectLocale();
  let inst = instanceCache.get(code);
  if (!inst) {
    inst = new ToWords({ localeCode: code });
    instanceCache.set(code, inst);
  }
  return inst;
}

/**
 * Detect the current locale from the environment and match it against the supported
 * locale list. This is the single entry point for all auto-detection.
 *
 * Detection order:
 *  1. Custom detector (if registered via `setLocaleDetector()`).
 *  2. `navigator.language` — browser / React Native.
 *  3. `Intl.DateTimeFormat().resolvedOptions().locale` — Node.js, Deno, Bun, CF Workers.
 *
 * Once a raw locale string is obtained it is normalised and matched:
 *  1. Exact match (e.g. `fr-FR`).
 *  2. Strip BCP 47 script tag (e.g. `zh-Hant-TW` → `zh-TW`).
 *  3. Language-prefix fallback (e.g. `sw-ZZ` → first `sw-*` locale in the list).
 *
 * Returns `fallback` (default `'en-IN'`) when nothing matches.
 *
 * @param fallback  Locale code to return when detection yields no match.
 */
export function detectLocale(fallback: string = DefaultToWordsOptions.localeCode!): string {
  const candidate = _localeDetector ? _localeDetector() : readRawLocale();
  if (!candidate) {
    return fallback;
  }

  const parts = candidate.split('-');

  // 1. Exact match
  if (candidate in LOCALES) {
    return candidate;
  }

  // 2. Normalise: strip script tag, upper-case region (e.g. zh-Hant-TW → zh-TW)
  if (parts.length >= 2) {
    const normalized = `${parts[0]}-${parts[parts.length - 1].toUpperCase()}`;
    if (normalized in LOCALES) {
      return normalized;
    }
  }

  // 3. Language-prefix fallback (e.g. sw-ZZ → sw-KE)
  const lang = parts[0].toLowerCase();
  const match = Object.keys(LOCALES).find((code) => code.toLowerCase().startsWith(`${lang}-`));
  if (match) {
    return match;
  }

  return fallback;
}

/**
 * Convert a number to words.
 * Uses the full bundle (all locales). For tree-shaken single-locale usage import from `to-words/<locale>`.
 * Internally caches one `ToWords` instance per locale — no performance penalty on repeated calls.
 * When `localeCode` is omitted, the runtime locale is auto-detected via `detectLocale()`.
 *
 * @example
 * import { toWords } from 'to-words';
 * toWords(12345, { localeCode: 'en-US' }); // "Twelve Thousand Three Hundred Forty Five"
 * toWords(12345); // uses auto-detected runtime locale, falls back to 'en-IN'
 */
export function toWords(number: NumberInput, options?: ConverterOptions & { localeCode?: string }): string {
  // Avoid spread allocation: extra `localeCode` key is silently ignored by convert's
  // fast-path check (which tests individual ConverterOptions fields, not Object.keys).
  if (!options) {
    return getCachedInstance().convert(number);
  }
  return getCachedInstance(options.localeCode).convert(number, options);
}

/**
 * Convert a number to ordinal words.
 * Uses the full bundle (all locales). For tree-shaken single-locale usage import from `to-words/<locale>`.
 * When `localeCode` is omitted, the runtime locale is auto-detected via `detectLocale()`.
 *
 * @example
 * import { toOrdinal } from 'to-words';
 * toOrdinal(21, { localeCode: 'en-US' }); // "Twenty First"
 * toOrdinal(21); // uses auto-detected runtime locale, falls back to 'en-IN'
 */
export function toOrdinal(number: NumberInput, options?: OrdinalOptions & { localeCode?: string }): string {
  // Avoid spread allocation: localeCode key is not consumed by toOrdinal internals.
  if (!options) {
    return getCachedInstance().toOrdinal(number);
  }
  return getCachedInstance(options.localeCode).toOrdinal(number, options);
}

/**
 * Convert a number to currency words.
 * Uses the full bundle (all locales). For tree-shaken single-locale usage import from `to-words/<locale>`.
 * Shorthand for `toWords(number, { currency: true, ...options })`.
 * When `localeCode` is omitted, the runtime locale is auto-detected via `detectLocale()`.
 *
 * @example
 * import { toCurrency } from 'to-words';
 * toCurrency(1234.56, { localeCode: 'en-US' }); // "One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only"
 * toCurrency(1234.56); // uses auto-detected runtime locale, falls back to 'en-IN'
 */
// Shared singleton for the common "no extra converter options" case in toCurrency.
const _CURRENCY_ONLY_OPTS: ConverterOptions = { currency: true };

export function toCurrency(number: NumberInput, options?: ConverterOptions & { localeCode?: string }): string {
  const localeCode = options?.localeCode;
  // Fast path: caller only specified localeCode (or nothing) — reuse shared object, no allocation.
  if (
    !options ||
    (options.currency === undefined &&
      options.ignoreDecimal === undefined &&
      options.ignoreZeroCurrency === undefined &&
      options.doNotAddOnly === undefined &&
      options.includeZeroFractional === undefined &&
      options.currencyOptions === undefined)
  ) {
    return getCachedInstance(localeCode).convert(number, _CURRENCY_ONLY_OPTS);
  }
  // Slow path: caller passed real converter options — one spread + mutation instead of two spreads.
  const { localeCode: _, ...converterOptions } = options;
  converterOptions.currency = true;
  return getCachedInstance(localeCode).convert(number, converterOptions);
}

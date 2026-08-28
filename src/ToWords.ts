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
 * // Full package (all locales)
 * import { ToWords } from 'to-words';
 * const tw = new ToWords({ localeCode: 'en-IN' });
 *
 * // Single-locale bundle - SAME API!
 * import { ToWords } from 'to-words/en-IN';
 * const tw = new ToWords();
 */

import {
  type ConstructorOf,
  type ConverterOptions,
  type LocaleInterface,
  type NumberInput,
  type OrdinalOptions,
  type ToWordsOptions,
} from './types.js';
import { ToWordsCore, DefaultConverterOptions, DefaultToWordsOptions } from './ToWordsCore.js';
import type { LocaleCode } from './locale-manifest.js';
import LOCALES from './locales/index.js';

// Re-export everything from ToWordsCore for backwards compatibility
export { DefaultConverterOptions, DefaultToWordsOptions };
export { LOCALES };
export { NumberOutOfRangeError } from './errors.js';
export type { LocaleCode } from './locale-manifest.js';

export type BundledToWordsOptions = Omit<ToWordsOptions, 'localeCode'> & { localeCode?: LocaleCode };

// Module-level instance cache for the functional helpers (toWords / toOrdinal / toCurrency).
// Each locale gets one cached instance — repeated calls at the same locale are zero-overhead.
const instanceCache = new Map<LocaleCode, ToWords>();

const RENAMED_LOCALES: Readonly<Record<string, string>> = {
  'ee-EE': 'et-EE',
  'np-NP': 'ne-NP',
};

function hasLocale(localeCode: string): boolean {
  return Object.hasOwn(LOCALES, localeCode);
}

function unknownLocaleError(localeCode: string): Error {
  const replacement = Object.hasOwn(RENAMED_LOCALES, localeCode) ? RENAMED_LOCALES[localeCode] : undefined;
  const migrationHint = replacement ? ` This locale code was renamed in v7; use "${replacement}" instead.` : '';
  return new Error(`Unknown Locale "${localeCode}".${migrationHint}`);
}

// Language-only and unknown-region inputs must not depend on registry insertion order.
// These defaults intentionally select the package's canonical regional variant.
const DEFAULT_LOCALE_BY_LANGUAGE: Readonly<Record<string, LocaleCode>> = {
  ar: 'ar-SA',
  bn: 'bn-IN',
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  ms: 'ms-MY',
  nl: 'nl-NL',
  pt: 'pt-BR',
  sw: 'sw-KE',
  zh: 'zh-CN',
};

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
 * Useful for application-wide configuration or tests where you want a fixed locale
 * without mocking globals. This setting is process-global: do not change it per SSR
 * request. Pass an explicit `localeCode` to functional helpers for request-scoped locale.
 *
 * @example
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
  constructor(options: BundledToWordsOptions = {}) {
    const requestedLocale = options.localeCode as string | undefined;
    const localeCode = requestedLocale === undefined ? detectLocale() : resolveLocale(requestedLocale);
    if (!localeCode) {
      throw unknownLocaleError(requestedLocale!);
    }
    super({ ...options, localeCode });
  }

  /**
   * Get the locale class, either from setLocale() or by looking up the localeCode.
   * This overrides ToWordsCore to add LOCALES lookup.
   */
  public getLocaleClass(): ConstructorOf<LocaleInterface> {
    // First check if a locale was set directly via setLocale()
    if (this.localeClass) {
      return this.localeClass;
    }

    // The constructor has already canonicalized and validated this code.
    return LOCALES[this.options.localeCode!];
  }
}

/**
 * Returns a cached `ToWords` instance for the given locale.
 * When `localeCode` is omitted, `detectLocale()` is called once here —
 * the single place where auto-detection happens for all functional helpers.
 */
function getCachedInstance(localeCode?: LocaleCode): ToWords {
  const requestedLocale = localeCode as string | undefined;
  const code = requestedLocale === undefined ? detectLocale() : resolveLocale(requestedLocale);
  if (!code) {
    throw unknownLocaleError(requestedLocale!);
  }
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
 *  2. Canonicalise case and aliases with `Intl.Locale`.
 *  3. Match language and region while ignoring script tags (e.g. `zh-Hant-TW` → `zh-TW`).
 *  4. Use an explicit language default (e.g. `en` → `en-US`, `sw-ZZ` → `sw-KE`).
 *
 * Returns `fallback` (default `'en-IN'`) when nothing matches.
 *
 * @param fallback  Locale code to return when detection yields no match.
 */
export function resolveLocale(input: string): LocaleCode | undefined {
  const candidate = input.trim().replaceAll('_', '-');
  if (!candidate) {
    return undefined;
  }

  // 1. Exact match
  if (hasLocale(candidate)) {
    return candidate as LocaleCode;
  }

  let language: string;
  let region: string | undefined;
  try {
    const locale = new Intl.Locale(candidate);
    language = locale.language.toLowerCase();
    region = locale.region?.toUpperCase();

    const canonical = locale.toString();
    if (hasLocale(canonical)) {
      return canonical as LocaleCode;
    }
    // Script subtags and Unicode extensions can be ignored when the package
    // has the corresponding language-region implementation. Variants cannot:
    // dropping one could select materially different wording.
    const recognisedBaseName = [locale.language, locale.script, locale.region].filter(Boolean).join('-');
    if (locale.baseName !== recognisedBaseName) {
      return undefined;
    }
  } catch {
    const parts = candidate.split('-');
    language = parts[0].toLowerCase();
    const possibleRegion = parts.at(-1);
    if (possibleRegion && /^[a-z]{2}$/i.test(possibleRegion)) {
      region = possibleRegion.toUpperCase();
    }
  }

  // 2. Match language + region after canonicalisation, ignoring script subtags.
  if (region) {
    const languageRegion = `${language}-${region}`;
    if (hasLocale(languageRegion)) {
      return languageRegion as LocaleCode;
    }
  }

  // 3. Explicit language default, followed by the sole/first supported variant.
  const languageDefault = DEFAULT_LOCALE_BY_LANGUAGE[language];
  if (languageDefault && hasLocale(languageDefault)) {
    return languageDefault;
  }

  const languageMatch = Object.keys(LOCALES).find((code) => code.startsWith(`${language}-`));
  if (languageMatch) {
    return languageMatch as LocaleCode;
  }

  return undefined;
}

export function detectLocale(fallback: LocaleCode = DefaultToWordsOptions.localeCode as LocaleCode): LocaleCode {
  const fallbackLocale = resolveLocale(fallback) ?? (DefaultToWordsOptions.localeCode as LocaleCode);
  const rawCandidate = _localeDetector ? _localeDetector() : readRawLocale();
  return resolveLocale(rawCandidate) ?? fallbackLocale;
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
export function toWords(number: NumberInput, options?: ConverterOptions & { localeCode?: LocaleCode }): string {
  const { localeCode, ...converterOptions } = options ?? {};
  return getCachedInstance(localeCode).convert(number, converterOptions);
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
export function toOrdinal(number: NumberInput, options?: OrdinalOptions & { localeCode?: LocaleCode }): string {
  const { localeCode, ...ordinalOptions } = options ?? {};
  return getCachedInstance(localeCode).toOrdinal(number, ordinalOptions);
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
export function toCurrency(number: NumberInput, options?: ConverterOptions & { localeCode?: LocaleCode }): string {
  const { localeCode, ...converterOptions } = options ?? {};
  return getCachedInstance(localeCode).convert(number, { ...converterOptions, currency: true });
}

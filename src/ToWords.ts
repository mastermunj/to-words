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

import { type ConstructorOf, type LocaleInterface } from './types.js';
import { ToWordsCore, DefaultConverterOptions, DefaultToWordsOptions } from './ToWordsCore.js';
import LOCALES from './locales/index.js';

// Re-export everything from ToWordsCore for backwards compatibility
export { DefaultConverterOptions, DefaultToWordsOptions };
export { LOCALES };

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

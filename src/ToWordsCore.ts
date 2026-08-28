/**
 * Public conversion core for custom locale classes.
 * Bundled per-locale entry points use the lighter prevalidated base directly.
 */

import { assertLocaleConfig, deriveMaximumSupportedValues } from './locale-contract.js';
import { ToWordsCore as ToWordsCoreBase } from './ToWordsCoreBase.js';
import type { ConstructorOf, ConversionForm, LocaleConfig, LocaleInterface } from './types.js';

export { DefaultConverterOptions, DefaultToWordsOptions } from './ToWordsCoreBase.js';

const validatedLocaleClasses = new WeakSet<ConstructorOf<LocaleInterface>>();

export class ToWordsCore extends ToWordsCoreBase {
  protected override getMaximumSupportedValues(config: LocaleConfig): Readonly<Record<ConversionForm, string>> {
    return deriveMaximumSupportedValues(config);
  }

  protected override validateLocaleClass(
    LocaleClass: ConstructorOf<LocaleInterface>,
    locale: InstanceType<ConstructorOf<LocaleInterface>>,
  ): void {
    if (!validatedLocaleClasses.has(LocaleClass)) {
      assertLocaleConfig(locale.config, this.localeIdentifier ?? this.options.localeCode!);
      validatedLocaleClasses.add(LocaleClass);
    }
  }
}

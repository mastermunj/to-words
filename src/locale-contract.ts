import type { LocaleConfig, NumberWordMap, OrdinalWordMap } from './types.js';

const DEFAULT_CURRENCY_PRECISION = 2;

export type LocaleCapabilities = Readonly<{
  cardinal: true;
  currency: true;
  ordinal: boolean;
  formal: boolean;
  gender: Readonly<{
    cardinal: boolean;
    ordinal: boolean;
  }>;
  decimals: Readonly<{
    digit: true;
    fraction: boolean;
    fractionDigits: readonly number[];
  }>;
  currencyPrecision: number;
}>;

type MappingEntry = NumberWordMap | OrdinalWordMap;

function hasEntries(entries: readonly MappingEntry[] | undefined): boolean {
  return Boolean(entries?.length);
}

function hasGenderedEntries(entries: readonly MappingEntry[] | undefined): boolean {
  return Boolean(entries?.some((entry) => entry.feminineValue || entry.masculineValue));
}

function getFractionDigits(config: LocaleConfig): readonly number[] {
  return Object.freeze(
    Object.keys(config.fractionDenominatorMapping ?? {})
      .map(Number)
      .sort((left, right) => left - right),
  );
}

/** Derive public feature metadata directly from a locale configuration. */
export function deriveLocaleCapabilities(config: LocaleConfig): LocaleCapabilities {
  const fractionDigits = getFractionDigits(config);

  return Object.freeze({
    cardinal: true as const,
    currency: true as const,
    ordinal:
      hasEntries(config.ordinalWordsMapping) ||
      hasEntries(config.ordinalExactWordsMapping) ||
      Boolean(config.ordinalSuffix) ||
      Boolean(config.ordinalPrefix),
    formal: Boolean(config.formalConfig),
    gender: Object.freeze({
      cardinal: hasGenderedEntries(config.numberWordsMapping) || hasGenderedEntries(config.exactWordsMapping),
      ordinal:
        hasGenderedEntries(config.ordinalWordsMapping) ||
        hasGenderedEntries(config.ordinalExactWordsMapping) ||
        Boolean(config.ordinalGenderSuffixMapping),
    }),
    decimals: Object.freeze({
      digit: true as const,
      fraction: fractionDigits.length > 0,
      fractionDigits,
    }),
    currencyPrecision: config.currency.precision ?? DEFAULT_CURRENCY_PRECISION,
  });
}

function validateMapping(
  name: string,
  entries: readonly MappingEntry[] | undefined,
  issues: string[],
  required: boolean,
  descending: boolean,
): void {
  if (!entries?.length) {
    if (required) {
      issues.push(`${name} must contain at least one entry`);
    }
    return;
  }

  const seen = new Set<string>();
  let previous: bigint | undefined;

  entries.forEach((entry, index) => {
    let number: bigint | undefined;
    try {
      number = BigInt(entry.number);
    } catch {
      issues.push(`${name}[${index}].number must be an integer`);
    }

    if (number !== undefined) {
      const key = number.toString();
      if (number < 0n) {
        issues.push(`${name}[${index}].number must be non-negative`);
      }
      if (seen.has(key)) {
        issues.push(`${name} contains duplicate numeric entry ${key}`);
      }
      seen.add(key);

      if (descending && previous !== undefined && previous <= number) {
        issues.push(`${name} must be strictly descending at index ${index}`);
      }
      previous = number;
    }

    const values = Array.isArray(entry.value) ? entry.value : [entry.value];
    if (values.some((value) => typeof value !== 'string' || value.length === 0)) {
      issues.push(`${name}[${index}].value must contain non-empty strings`);
    }

    for (const property of ['singularValue', 'feminineValue', 'masculineValue'] as const) {
      const value = (entry as NumberWordMap)[property];
      if (value !== undefined && value.length === 0) {
        issues.push(`${name}[${index}].${property} must be non-empty when provided`);
      }
    }
  });
}

function validateResolvedConfig(config: LocaleConfig, name: string): string[] {
  const issues: string[] = [];

  validateMapping(`${name}.numberWordsMapping`, config.numberWordsMapping, issues, true, true);
  validateMapping(`${name}.exactWordsMapping`, config.exactWordsMapping, issues, false, false);
  validateMapping(`${name}.ordinalWordsMapping`, config.ordinalWordsMapping, issues, false, false);
  validateMapping(`${name}.ordinalExactWordsMapping`, config.ordinalExactWordsMapping, issues, false, false);

  if (
    !config.numberWordsMapping.some((entry) => {
      try {
        return BigInt(entry.number) === 0n;
      } catch {
        return false;
      }
    })
  ) {
    issues.push(`${name}.numberWordsMapping must contain zero`);
  }

  const precision = config.currency.precision ?? DEFAULT_CURRENCY_PRECISION;
  if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
    issues.push(`${name}.currency.precision must be an integer between 0 and 100`);
  }

  const ordinalSuffixes = config.ordinalGenderSuffixMapping;
  if (ordinalSuffixes && (!ordinalSuffixes.masculine || !ordinalSuffixes.feminine)) {
    issues.push(`${name}.ordinalGenderSuffixMapping values must be non-empty`);
  }

  for (const [digits, denominator] of Object.entries(config.fractionDenominatorMapping ?? {})) {
    const numericDigits = Number(digits);
    if (!Number.isInteger(numericDigits) || numericDigits <= 0) {
      issues.push(`${name}.fractionDenominatorMapping key ${digits} must be a positive integer`);
    }
    if (!denominator.singular || !denominator.plural) {
      issues.push(`${name}.fractionDenominatorMapping[${digits}] values must be non-empty`);
    }
  }

  return issues;
}

/**
 * Validate the lookup-table invariants required by the conversion engine.
 * The returned messages are empty when both the base and effective formal
 * configurations satisfy the contract.
 */
export function validateLocaleConfig(config: LocaleConfig, name = 'locale'): string[] {
  const issues = validateResolvedConfig(config, name);
  const formal = config.formalConfig;

  if (formal) {
    issues.push(
      ...validateResolvedConfig(
        {
          ...config,
          ...formal,
          currency: formal.currency ?? config.currency,
          numberWordsMapping: formal.numberWordsMapping ?? config.numberWordsMapping,
          formalConfig: undefined,
        },
        `${name}.formalConfig`,
      ),
    );
  }

  return issues;
}

/** Throw a TypeError when a locale configuration violates the contract. */
export function assertLocaleConfig(config: LocaleConfig, name = 'locale'): void {
  const issues = validateLocaleConfig(config, name);
  if (issues.length > 0) {
    throw new TypeError(`Invalid locale configuration:\n- ${issues.join('\n- ')}`);
  }
}

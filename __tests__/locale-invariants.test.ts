import { describe, expect, test } from 'vitest';
import { LOCALES, ToWords } from '../src/ToWords.js';
import type { LocaleConfig, NumberWordMap, OrdinalWordMap } from '../src/types.js';

function findDuplicateIssue(name: string, entries: Array<NumberWordMap | OrdinalWordMap> | undefined): string[] {
  if (!entries) {
    return [];
  }
  const values = entries.map((entry) => BigInt(entry.number).toString());
  return new Set(values).size === values.length ? [] : [`${name} contains duplicate numeric entries`];
}

function findDescendingIssues(name: string, entries: NumberWordMap[]): string[] {
  const issues: string[] = [];
  for (let index = 1; index < entries.length; index += 1) {
    if (BigInt(entries[index - 1].number) <= BigInt(entries[index].number)) {
      issues.push(`${name} must be strictly descending at index ${index}`);
    }
  }
  return issues;
}

function findConfigIssues(localeCode: string, name: string, config: LocaleConfig): string[] {
  const prefix = `${localeCode} ${name}`;
  const issues = [
    ...findDescendingIssues(`${prefix}.numberWordsMapping`, config.numberWordsMapping),
    ...findDuplicateIssue(`${prefix}.numberWordsMapping`, config.numberWordsMapping),
    ...findDuplicateIssue(`${prefix}.exactWordsMapping`, config.exactWordsMapping),
    ...findDuplicateIssue(`${prefix}.ordinalWordsMapping`, config.ordinalWordsMapping),
    ...findDuplicateIssue(`${prefix}.ordinalExactWordsMapping`, config.ordinalExactWordsMapping),
  ];
  if (!config.numberWordsMapping.some((entry) => BigInt(entry.number) === 0n)) {
    issues.push(`${prefix}.numberWordsMapping must contain zero`);
  }

  const precision = config.currency.precision ?? 2;
  if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
    issues.push(`${prefix}.currency.precision must be an integer between 0 and 100`);
  }

  const ordinalSuffixes = config.ordinalGenderSuffixMapping;
  if (ordinalSuffixes && (!ordinalSuffixes.masculine || !ordinalSuffixes.feminine)) {
    issues.push(`${prefix}.ordinalGenderSuffixMapping values must be non-empty`);
  }
  return issues;
}

describe('Locale configuration invariants', () => {
  test.each(Object.keys(LOCALES))('%s has valid lookup-table invariants', (localeCode) => {
    const config = new ToWords({ localeCode }).getLocale().config;
    const issues = findConfigIssues(localeCode, 'base', config);

    if (config.formalConfig) {
      issues.push(
        ...findConfigIssues(localeCode, 'formal', {
          ...config,
          ...config.formalConfig,
          currency: config.formalConfig.currency ?? config.currency,
          texts: config.texts,
          numberWordsMapping: config.formalConfig.numberWordsMapping ?? config.numberWordsMapping,
        }),
      );
    }

    expect(issues).toEqual([]);
  });
});

import { describe, expect, test } from 'vitest';
import { LOCALES, ToWords } from '../src/ToWords.js';
import { validateLocaleConfig } from '../src/locale-contract.js';

describe('Locale configuration invariants', () => {
  test.each(Object.keys(LOCALES))('%s has valid lookup-table invariants', (localeCode) => {
    const config = new ToWords({ localeCode }).getLocale().config;
    expect(validateLocaleConfig(config, localeCode)).toEqual([]);
  });
});

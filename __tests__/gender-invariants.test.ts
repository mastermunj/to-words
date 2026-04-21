import { describe, expect, test } from 'vitest';
import { LOCALES, ToWords } from '../src/ToWords.js';
import type { ConverterOptions, NumberWordMap } from '../src/types.js';

type GenderedNumberEntry = Pick<NumberWordMap, 'number' | 'feminineValue' | 'masculineValue'>;

function toTestInput(value: number | bigint): number | bigint {
  if (typeof value === 'bigint' && value <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(value);
  }
  return value;
}

function extractGenderEntries(entries?: NumberWordMap[]): GenderedNumberEntry[] {
  if (!entries?.length) {
    return [];
  }
  return entries
    .filter((entry) => entry.feminineValue || entry.masculineValue)
    .map((entry) => ({
      number: entry.number,
      feminineValue: entry.feminineValue,
      masculineValue: entry.masculineValue,
    }));
}

function getLocaleGenderEntries(toWords: ToWords): {
  base: GenderedNumberEntry[];
  formal: GenderedNumberEntry[];
} {
  const localeConfig = toWords.getLocale().config;
  const base = [
    ...extractGenderEntries(localeConfig.numberWordsMapping),
    ...extractGenderEntries(localeConfig.exactWordsMapping),
  ];
  const formal = [
    ...extractGenderEntries(localeConfig.formalConfig?.numberWordsMapping),
    ...extractGenderEntries(localeConfig.formalConfig?.exactWordsMapping),
  ];

  return { base, formal };
}

describe('Gender mapping invariants', () => {
  const localeCodes = Object.keys(LOCALES).sort();
  const localesWithGenderEntries = localeCodes.filter((localeCode) => {
    const toWords = new ToWords({ localeCode });
    const { base, formal } = getLocaleGenderEntries(toWords);
    return base.length > 0 || formal.length > 0;
  });

  test('has locales with explicit gender mappings', () => {
    expect(localesWithGenderEntries.length).toBeGreaterThan(0);
  });

  test.each(localesWithGenderEntries)('resolves declared gender values for %s', (localeCode) => {
    const toWords = new ToWords({ localeCode });
    const { base, formal } = getLocaleGenderEntries(toWords);
    const modes: Array<{ name: 'base' | 'formal'; options: ConverterOptions; entries: GenderedNumberEntry[] }> = [
      { name: 'base', options: {}, entries: base },
      { name: 'formal', options: { formal: true }, entries: formal },
    ];

    for (const mode of modes) {
      for (const entry of mode.entries) {
        const input = toTestInput(entry.number);
        const defaultOutput = toWords.convert(input, mode.options);
        const assertions: Array<{ label: string; actual: string; expected: string }> = [];

        if (entry.feminineValue) {
          assertions.push({
            label: `${localeCode} ${mode.name} feminine number=${String(entry.number)}`,
            actual: toWords.convert(input, { ...mode.options, gender: 'feminine' }),
            expected: entry.feminineValue,
          });

          if (!entry.masculineValue) {
            assertions.push({
              label: `${localeCode} ${mode.name} masculine fallback number=${String(entry.number)}`,
              actual: toWords.convert(input, { ...mode.options, gender: 'masculine' }),
              expected: defaultOutput,
            });
          }
        }

        if (entry.masculineValue) {
          assertions.push({
            label: `${localeCode} ${mode.name} masculine number=${String(entry.number)}`,
            actual: toWords.convert(input, { ...mode.options, gender: 'masculine' }),
            expected: entry.masculineValue,
          });

          if (!entry.feminineValue) {
            assertions.push({
              label: `${localeCode} ${mode.name} feminine fallback number=${String(entry.number)}`,
              actual: toWords.convert(input, { ...mode.options, gender: 'feminine' }),
              expected: defaultOutput,
            });
          }
        }

        for (const assertion of assertions) {
          expect({ label: assertion.label, actual: assertion.actual }).toEqual({
            label: assertion.label,
            actual: assertion.expected,
          });
        }
      }
    }
  });
});

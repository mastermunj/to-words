import { describe, expect, test } from 'vitest';
import { deriveLocaleCapabilities, deriveLocaleMetadata, validateLocaleConfig } from '../src/locale-contract.js';
import { LOCALES, ToWords } from '../src/ToWords.js';
import type { LocaleConfig, NumberInput, NumberWordMap, OrdinalWordMap } from '../src/types.js';

type ConformanceCheck = () => boolean;

function runCheck(issues: string[], name: string, check: ConformanceCheck): void {
  try {
    if (!check()) {
      issues.push(name);
    }
  } catch (error) {
    issues.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function hasCardinalGenderWitness(toWords: ToWords, config: LocaleConfig): boolean {
  const candidates = [...config.numberWordsMapping, ...(config.exactWordsMapping ?? [])].filter(
    (entry) => entry.feminineValue || entry.masculineValue,
  );
  return candidates.some(
    ({ number }) =>
      toWords.convert(number, { gender: 'feminine' }) !== toWords.convert(number, { gender: 'masculine' }),
  );
}

function hasOrdinalGenderWitness(toWords: ToWords, config: LocaleConfig): boolean {
  const mappedCandidates: Array<NumberWordMap | OrdinalWordMap> = [
    ...config.numberWordsMapping,
    ...(config.exactWordsMapping ?? []),
    ...(config.ordinalWordsMapping ?? []),
    ...(config.ordinalExactWordsMapping ?? []),
  ].filter((entry) => entry.feminineValue || entry.masculineValue);
  const candidates: NumberInput[] = [...mappedCandidates.map(({ number }) => number), 1, 2, 3, 11, 21];

  return candidates.some(
    (number) =>
      toWords.toOrdinal(number, { gender: 'feminine' }) !== toWords.toOrdinal(number, { gender: 'masculine' }),
  );
}

function hasFormalWitness(toWords: ToWords, config: LocaleConfig): boolean {
  const formal = config.formalConfig;
  const candidates: NumberInput[] = [
    1,
    12,
    123,
    1000,
    ...(formal?.numberWordsMapping ?? []).map(({ number }) => number),
    ...(formal?.exactWordsMapping ?? []).map(({ number }) => number),
    ...(formal?.ordinalWordsMapping ?? []).map(({ number }) => number),
    ...(formal?.ordinalExactWordsMapping ?? []).map(({ number }) => number),
  ];
  return (
    candidates.some((number) => toWords.convert(number) !== toWords.convert(number, { formal: true })) ||
    [...candidates, '1.01'].some(
      (number) =>
        toWords.convert(number, { currency: true }) !== toWords.convert(number, { currency: true, formal: true }),
    ) ||
    candidates.some((number) => toWords.toOrdinal(number) !== toWords.toOrdinal(number, { formal: true }))
  );
}

describe('locale behavioral conformance', () => {
  test.each(Object.keys(LOCALES))('%s satisfies the runtime quality gate', (localeCode) => {
    const toWords = new ToWords({ localeCode });
    const config = toWords.getLocale().config;
    const capabilities = deriveLocaleCapabilities(config);
    const metadata = deriveLocaleMetadata(config);
    const issues = validateLocaleConfig(config, localeCode);

    for (const number of [0n, 1n, 2n, 11n, 42n, 101n, 1001n]) {
      const bigintResult = toWords.convert(number);
      runCheck(issues, `cardinal ${number} is non-empty`, () => bigintResult.length > 0);
      runCheck(issues, `cardinal ${number} is deterministic`, () => toWords.convert(number) === bigintResult);
      runCheck(
        issues,
        `cardinal ${number} has string parity`,
        () => toWords.convert(number.toString()) === bigintResult,
      );
      runCheck(issues, `cardinal ${number} has number parity`, () => toWords.convert(Number(number)) === bigintResult);
    }

    const positive = toWords.convert(42);
    runCheck(issues, 'negative cardinal uses the locale minus marker', () =>
      toWords.convert(-42).startsWith(config.texts.minus),
    );
    runCheck(issues, 'negative cardinal differs from positive cardinal', () => toWords.convert(-42) !== positive);
    runCheck(issues, 'currency conversion is non-empty', () => Boolean(toWords.convert('1.01', { currency: true })));

    if (capabilities.ordinal) {
      const ordinal = toWords.toOrdinal(1n);
      runCheck(issues, 'ordinal is non-empty', () => ordinal.length > 0);
      runCheck(issues, 'ordinal has string parity', () => toWords.toOrdinal('1') === ordinal);
    }

    if (capabilities.decimals.fraction) {
      for (const digits of capabilities.decimals.fractionDigits) {
        const number = `0.${'0'.repeat(digits - 1)}1`;
        const denominator = config.fractionDenominatorMapping![digits].singular;
        runCheck(issues, `fraction style supports ${digits} digits`, () =>
          toWords.convert(number, { decimalStyle: 'fraction' }).includes(denominator),
        );
      }
    }

    if (capabilities.gender.cardinal) {
      runCheck(issues, 'cardinal gender has an executable witness', () => hasCardinalGenderWitness(toWords, config));
    }
    if (capabilities.gender.ordinal) {
      runCheck(issues, 'ordinal gender has an executable witness', () => hasOrdinalGenderWitness(toWords, config));
    }
    if (capabilities.formal) {
      runCheck(issues, 'formal mode has an executable witness', () => hasFormalWitness(toWords, config));
    }

    const largestMagnitude = BigInt(metadata.range.largestNamedMagnitude);
    for (const boundary of [largestMagnitude - 1n, largestMagnitude, largestMagnitude + 1n]) {
      runCheck(issues, `named-range boundary ${boundary} is non-empty`, () => toWords.convert(boundary).length > 0);
      runCheck(
        issues,
        `named-range boundary ${boundary} has string parity`,
        () => toWords.convert(boundary.toString()) === toWords.convert(boundary),
      );
    }

    expect(issues).toEqual([]);
  });
});

/**
 * Sourced accuracy fixtures: `__tests__/fixtures/accuracy/<locale>.json`.
 *
 * Unlike the per-locale regression tests, every expected string here is established
 * independently of the converter and cites at least one source. Rules:
 *
 * - `status: "verified"`   the converter must produce `expected` (a normal test).
 * - `status: "known-wrong"` the converter is known NOT to produce `expected` yet. The case
 *   runs as an expected failure, so CI stays green while the gap stays visible. Once a fix
 *   makes it pass, the expected failure itself fails and the status must be flipped to
 *   "verified" — the scorecard can never claim a fix that did not happen, or miss one that did.
 * - `attested: true` means a source shows the string (or its exact wording) literally;
 *   `false` means it is composed from sourced rules.
 * - `defect` names the engine gap class (A–I) from the accuracy plan for known-wrong cases.
 *
 * Expected strings follow the library's presentation conventions, which are not linguistic
 * claims: every word title-cased, `texts.and` as the major/minor currency connector, and
 * currency cases use `doNotAddOnly` so the "Only" suffix stays out of the comparison.
 *
 * The test also regenerates `__tests__/fixtures/accuracy/SCORECARD.md`.
 * Update it after a fixture change with: npx vitest --run -u __tests__/locale-accuracy.test.ts
 */

import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { LOCALES, ToWords } from '../src/ToWords.js';
import type { LocaleCode } from '../src/locale-manifest.js';
import type { ConverterOptions, OrdinalOptions } from '../src/types.js';

const CAPABILITIES = ['cardinal', 'scale', 'ordinal', 'decimal', 'currency', 'gender', 'formal'] as const;
type Capability = (typeof CAPABILITIES)[number];

type AccuracyCase = {
  id: string;
  capability: Capability;
  form: 'cardinal' | 'ordinal' | 'currency';
  input: string;
  options?: ConverterOptions & OrdinalOptions;
  expected: string;
  status: 'verified' | 'known-wrong';
  defect?: string;
  attested: boolean;
  sources: string[];
};

type AccuracyFixture = {
  locale: LocaleCode;
  sources: Record<string, { title: string; url: string; accessed: string }>;
  cases: AccuracyCase[];
};

const FIXTURE_DIR = new URL('./fixtures/accuracy/', import.meta.url);

const fixtures: AccuracyFixture[] = readdirSync(FIXTURE_DIR)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .map((file) => JSON.parse(readFileSync(new URL(file, FIXTURE_DIR), 'utf8')) as AccuracyFixture);

function render(toWords: ToWords, testCase: AccuracyCase): string {
  const options = testCase.options ?? {};
  if (testCase.form === 'ordinal') {
    return toWords.toOrdinal(testCase.input, options);
  }
  return toWords.convert(testCase.input, testCase.form === 'currency' ? { ...options, currency: true } : options);
}

function validate(fixture: AccuracyFixture): string[] {
  const issues: string[] = [];
  if (!Object.hasOwn(LOCALES, fixture.locale)) {
    issues.push(`unknown locale ${fixture.locale}`);
  }
  for (const [key, source] of Object.entries(fixture.sources)) {
    if (!source.url.startsWith('https://') || !source.title || !/^\d{4}-\d{2}-\d{2}$/.test(source.accessed)) {
      issues.push(`source ${key} needs an https url, a title and an ISO access date`);
    }
  }
  const ids = new Set<string>();
  for (const testCase of fixture.cases) {
    if (ids.has(testCase.id)) {
      issues.push(`duplicate case id ${testCase.id}`);
    }
    ids.add(testCase.id);
    if (!CAPABILITIES.includes(testCase.capability)) {
      issues.push(`${testCase.id}: unknown capability ${testCase.capability}`);
    }
    if (!['cardinal', 'ordinal', 'currency'].includes(testCase.form)) {
      issues.push(`${testCase.id}: unknown form ${testCase.form}`);
    }
    if (testCase.status !== 'verified' && testCase.status !== 'known-wrong') {
      issues.push(`${testCase.id}: unknown status ${testCase.status as string}`);
    }
    if (testCase.status === 'known-wrong' && !testCase.defect) {
      issues.push(`${testCase.id}: known-wrong cases must name a defect class`);
    }
    if (typeof testCase.attested !== 'boolean') {
      issues.push(`${testCase.id}: attested must be true or false`);
    }
    if (!testCase.sources.length || testCase.sources.some((key) => !Object.hasOwn(fixture.sources, key))) {
      issues.push(`${testCase.id}: every case needs at least one declared source`);
    }
    if (typeof testCase.input !== 'string' || !testCase.expected) {
      issues.push(`${testCase.id}: input must be a string and expected must be non-empty`);
    }
  }
  return issues;
}

function buildScorecard(): string {
  const byLocale = new Map(fixtures.map((fixture) => [fixture.locale, fixture]));
  const cell = (fixture: AccuracyFixture | undefined, capability: Capability): string => {
    const cases = fixture?.cases.filter((testCase) => testCase.capability === capability) ?? [];
    if (!cases.length) {
      return '·';
    }
    const verified = cases.filter((testCase) => testCase.status === 'verified').length;
    const wrong = cases.length - verified;
    return wrong ? `${verified}✓ ${wrong}✗` : `${verified}✓`;
  };

  const locales = Object.keys(LOCALES).sort() as LocaleCode[];
  const covered = locales.filter((locale) => byLocale.has(locale)).length;
  const all = fixtures.flatMap((fixture) => fixture.cases);
  const wrong = all.filter((testCase) => testCase.status === 'known-wrong').length;

  const lines = [
    '# Locale accuracy scorecard',
    '',
    '<!-- Generated by __tests__/locale-accuracy.test.ts from __tests__/fixtures/accuracy/*.json. Do not edit. -->',
    '',
    'Counts of independently sourced cases per capability: `✓` the converter matches the source, `✗` a known',
    'defect, `·` nothing checked yet. An unchecked cell means unknown, not correct.',
    '',
    `Locales with sourced cases: ${covered} of ${locales.length}. Cases: ${all.length} (${all.length - wrong} verified, ${wrong} known-wrong).`,
    '',
    `| Locale | ${CAPABILITIES.join(' | ')} |`,
    `| --- | ${CAPABILITIES.map(() => '---').join(' | ')} |`,
    ...locales.map(
      (locale) =>
        `| ${locale} | ${CAPABILITIES.map((capability) => cell(byLocale.get(locale), capability)).join(' | ')} |`,
    ),
    '',
  ];
  return lines.join('\n');
}

describe('accuracy fixtures', () => {
  test('fixtures are well-formed and one file per locale', () => {
    expect(fixtures.length).toBeGreaterThan(0);
    expect(new Set(fixtures.map((fixture) => fixture.locale)).size).toBe(fixtures.length);
    expect(fixtures.flatMap((fixture) => validate(fixture).map((issue) => `${fixture.locale}: ${issue}`))).toEqual([]);
  });

  test('scorecard is current', async () => {
    await expect(buildScorecard()).toMatchFileSnapshot('./fixtures/accuracy/SCORECARD.md');
  });

  describe.each(fixtures)('$locale', (fixture) => {
    const toWords = new ToWords({ localeCode: fixture.locale });
    const verified = fixture.cases.filter((testCase) => testCase.status !== 'known-wrong');
    const knownWrong = fixture.cases.filter((testCase) => testCase.status === 'known-wrong');
    test.each(verified)('$id: $input → $expected', (testCase) => {
      expect(render(toWords, testCase)).toBe(testCase.expected);
    });

    // Known defects stay visible: each is an expected failure until the engine fix lands.
    test.fails.each(knownWrong)('[known-wrong $defect] $id: $input → $expected', (testCase) => {
      expect(render(toWords, testCase)).toBe(testCase.expected);
    });
  });
});

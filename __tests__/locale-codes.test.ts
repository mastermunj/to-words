import * as fs from 'node:fs';
import { describe, expect, test } from 'vitest';
import { LOCALE_LANGUAGE_IDENTITIES, type LocaleLanguageIdentity } from '../scripts/locale-language-identities.js';
import LOCALES from '../src/locales/index.js';

type RegistryEntries = Record<string, readonly string[]>;
type LanguageSubtagRegistry = Readonly<{
  fileDate: string;
  languages: RegistryEntries;
  scripts: RegistryEntries;
  regions: RegistryEntries;
  variants: RegistryEntries;
}>;

const registry = JSON.parse(
  fs.readFileSync(new URL('../scripts/data/iana-language-subtags.json', import.meta.url), 'utf8'),
) as LanguageSubtagRegistry;

const localePattern = /^([a-z]{2,8})(?:-([A-Z][a-z]{3}))?-([A-Z]{2}|\d{3})$/;

function validateLocaleCode(localeCode: string): string[] {
  const issues: string[] = [];
  const match = localePattern.exec(localeCode);
  if (!match) {
    return [`${localeCode} must use canonical language[-Script]-REGION form`];
  }

  const [, language, script, region] = match;
  let canonical: string;
  try {
    canonical = Intl.getCanonicalLocales(localeCode)[0];
  } catch {
    return [`${localeCode} is not structurally valid BCP 47`];
  }

  if (canonical !== localeCode) {
    issues.push(`${localeCode} is not canonical; use ${canonical}`);
  }
  if (!registry.languages[language]) {
    issues.push(`${localeCode} uses unregistered language subtag ${language}`);
  }
  if (script && !registry.scripts[script]) {
    issues.push(`${localeCode} uses unregistered script subtag ${script}`);
  }
  if (!registry.regions[region]) {
    issues.push(`${localeCode} uses unregistered region subtag ${region}`);
  }

  return issues;
}

function validateLanguageIdentity(localeCode: string, identity: LocaleLanguageIdentity | undefined): string[] {
  const language = localeCode.split('-')[0];
  if (!identity) {
    return [`${localeCode} has no reviewed language identity`];
  }

  const registeredDescriptions = registry.languages[language] ?? [];
  if (!registeredDescriptions.includes(identity.registryDescription)) {
    return [
      `${localeCode} is documented as ${identity.displayName}, but IANA describes ${language} as ` +
        `${registeredDescriptions.join(' / ') || 'unregistered'}`,
    ];
  }

  return [];
}

function localeFileCodes(directory: URL, suffix: string): string[] {
  return fs
    .readdirSync(directory)
    .filter((fileName) => new RegExp(`^[a-z]{2,8}-[A-Z]{2}\\.${suffix}$`).test(fileName))
    .map((fileName) => fileName.slice(0, -suffix.length - 1))
    .sort();
}

describe('locale identifier registry', () => {
  const localeCodes = Object.keys(LOCALES).sort();

  test('uses a committed authoritative IANA registry snapshot', () => {
    expect(registry.fileDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Object.keys(registry.languages).length).toBeGreaterThan(8000);
    expect(Object.keys(registry.regions).length).toBeGreaterThan(250);
  });

  test.each(localeCodes)('%s is canonical and uses registered subtags', (localeCode) => {
    expect(validateLocaleCode(localeCode)).toEqual([]);
  });

  test.each(localeCodes)('%s matches its human-reviewed language identity', (localeCode) => {
    const language = localeCode.split('-')[0];
    expect(validateLanguageIdentity(localeCode, LOCALE_LANGUAGE_IDENTITIES[language])).toEqual([]);
  });

  test('contains exactly one reviewed identity for every implemented language', () => {
    const implementedLanguages = [...new Set(localeCodes.map((localeCode) => localeCode.split('-')[0]))].sort();
    expect(Object.keys(LOCALE_LANGUAGE_IDENTITIES).sort()).toEqual(implementedLanguages);

    for (const identity of Object.values(LOCALE_LANGUAGE_IDENTITIES)) {
      expect(fs.existsSync(new URL(`../docs${identity.page}.md`, import.meta.url))).toBe(true);
    }
  });

  test('keeps registry keys, source modules, and locale tests synchronized', () => {
    expect(localeFileCodes(new URL('../src/locales/', import.meta.url), 'ts')).toEqual(localeCodes);
    expect(localeFileCodes(new URL('./', import.meta.url), 'test.ts')).toEqual(localeCodes);
  });

  test('keeps the interactive docs demo locale list synchronized', () => {
    const demoSource = fs.readFileSync(
      new URL('../docs/.vitepress/components/NumberDemo.vue', import.meta.url),
      'utf8',
    );
    const demoLocaleCodes = [...demoSource.matchAll(/\{ code: '([^']+)'/g)].map((match) => match[1]).sort();

    expect(demoLocaleCodes).toEqual(localeCodes);
  });

  test('would reject both classes of locale-code mistake corrected in v7', () => {
    expect(validateLocaleCode('np-NP')).toContain('np-NP uses unregistered language subtag np');
    expect(
      validateLanguageIdentity('ee-EE', {
        displayName: 'Estonian',
        registryDescription: 'Estonian',
        page: '/locales/estonian',
      }),
    ).toContain('ee-EE is documented as Estonian, but IANA describes ee as Ewe');
  });
});

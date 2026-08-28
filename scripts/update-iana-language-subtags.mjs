#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const registryUrl = 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry';
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(repositoryRoot, 'scripts/data/iana-language-subtags.json');
const maximumSourceBytes = 2 * 1024 * 1024;
const entryCountBounds = {
  languages: [8000, 10000],
  scripts: [150, 300],
  regions: [250, 400],
  variants: [100, 250],
};
const subtagPatterns = {
  language: /^(?:[a-z]{2,8}|[a-z]{3}\.\.[a-z]{3})$/,
  script: /^(?:[A-Z][a-z]{3}|[A-Z][a-z]{3}\.\.[A-Z][a-z]{3})$/,
  region: /^(?:[A-Z]{2}|\d{3}|[A-Z]{2}\.\.[A-Z]{2})$/,
  variant: /^(?:\d[a-z0-9]{3}|[a-z0-9]{5,8})$/,
};
const requiredEntries = {
  languages: {
    en: 'English',
    et: 'Estonian',
    ne: 'Nepali (macrolanguage)',
  },
  regions: {
    EE: 'Estonia',
    NP: 'Nepal',
  },
};

function containsUnsafeControlCharacter(value) {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 && code !== 9 && code !== 10 && code !== 13;
  });
}

function parseFields(record) {
  const fields = new Map();
  let currentName;

  for (const line of record.split('\n')) {
    if (/^[ \t]/.test(line) && currentName) {
      const values = fields.get(currentName);
      values[values.length - 1] += ` ${line.trim()}`;
      continue;
    }

    const separator = line.indexOf(':');
    if (separator === -1) {
      currentName = undefined;
      continue;
    }

    currentName = line.slice(0, separator);
    const value = line.slice(separator + 1).trim();
    const values = fields.get(currentName) ?? [];
    values.push(value);
    fields.set(currentName, values);
  }

  return fields;
}

function parseRegistry(source) {
  if (Buffer.byteLength(source, 'utf8') > maximumSourceBytes || source.includes('\0')) {
    throw new Error('The supplied file is too large or contains invalid null bytes.');
  }

  const records = source.replaceAll('\r\n', '\n').split('\n%%\n');
  const header = parseFields(records.shift() ?? '');
  const data = {
    source: registryUrl,
    fileDate: header.get('File-Date')?.[0],
    languages: Object.create(null),
    scripts: Object.create(null),
    regions: Object.create(null),
    variants: Object.create(null),
  };
  const targetByType = {
    language: data.languages,
    script: data.scripts,
    region: data.regions,
    variant: data.variants,
  };

  for (const record of records) {
    const fields = parseFields(record);
    const type = fields.get('Type')?.[0];
    const subtag = fields.get('Subtag')?.[0];
    const target = targetByType[type];

    // Deprecated subtags are valid legacy syntax, but package entry points must
    // use their modern canonical replacement instead.
    if (!target || !subtag || fields.has('Deprecated')) {
      continue;
    }

    const descriptions = fields.get('Description') ?? [];
    if (!subtagPatterns[type].test(subtag)) {
      throw new Error(`The registry contains a non-canonical ${type} subtag: ${subtag}`);
    }
    if (Object.hasOwn(target, subtag)) {
      throw new Error(`The registry contains a duplicate ${type} subtag: ${subtag}`);
    }
    if (
      descriptions.length === 0 ||
      descriptions.length > 10 ||
      descriptions.some(
        (description) => !description || description.length > 500 || containsUnsafeControlCharacter(description),
      )
    ) {
      throw new Error(`The registry contains invalid descriptions for ${type} subtag ${subtag}.`);
    }

    target[subtag] = descriptions;
  }

  const parsedDate = new Date(`${data.fileDate}T00:00:00Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== data.fileDate) {
    throw new Error('The supplied file does not have a valid IANA registry File-Date.');
  }

  for (const [key, [minimum, maximum]] of Object.entries(entryCountBounds)) {
    const count = Object.keys(data[key]).length;
    if (count < minimum || count > maximum) {
      throw new Error(`The supplied file has an implausible number of ${key}: ${count}.`);
    }
  }

  for (const [key, entries] of Object.entries(requiredEntries)) {
    for (const [subtag, description] of Object.entries(entries)) {
      if (!data[key][subtag]?.includes(description)) {
        throw new Error(`The supplied file does not identify ${subtag} as ${description}.`);
      }
    }
  }

  for (const key of ['languages', 'scripts', 'regions', 'variants']) {
    data[key] = Object.fromEntries(Object.entries(data[key]).sort(([left], [right]) => left.localeCompare(right)));
  }

  return data;
}

function readSource() {
  const sourceArg = process.argv[2];
  if (!sourceArg || process.argv.length > 3) {
    throw new Error(
      'Pass exactly one path to a separately downloaded IANA Language Subtag Registry file. ' +
        'See CONTRIBUTING.md for the reviewed update procedure.',
    );
  }

  const sourcePath = path.resolve(sourceArg);
  const sourceStats = fs.statSync(sourcePath);
  if (!sourceStats.isFile() || sourceStats.size > maximumSourceBytes) {
    throw new Error(`The supplied registry must be a regular file no larger than ${maximumSourceBytes} bytes.`);
  }

  return fs.readFileSync(sourcePath, 'utf8');
}

function assertNotOlderThanSnapshot(registry) {
  if (!fs.existsSync(outputPath)) {
    return;
  }

  const current = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  if (typeof current.fileDate === 'string' && registry.fileDate < current.fileDate) {
    throw new Error(
      `Refusing to replace registry snapshot ${current.fileDate} with older data from ${registry.fileDate}.`,
    );
  }
}

function writeSnapshot(registry) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;

  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(registry)}\n`, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(temporaryPath, outputPath);
  } finally {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath);
    }
  }
}

const registry = parseRegistry(readSource());
assertNotOlderThanSnapshot(registry);
writeSnapshot(registry);
console.log(
  `Updated ${path.relative(repositoryRoot, outputPath)} from IANA registry ${registry.fileDate} ` +
    `(${Object.keys(registry.languages).length} languages, ${Object.keys(registry.regions).length} regions).`,
);

#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const registryUrl = 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry';
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(repositoryRoot, 'scripts/data/iana-language-subtags.json');

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
  const records = source.replaceAll('\r\n', '\n').split('\n%%\n');
  const header = parseFields(records.shift() ?? '');
  const data = {
    source: registryUrl,
    fileDate: header.get('File-Date')?.[0],
    languages: {},
    scripts: {},
    regions: {},
    variants: {},
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

    target[subtag] = fields.get('Description') ?? [];
  }

  if (!data.fileDate || Object.keys(data.languages).length < 8000 || Object.keys(data.regions).length < 250) {
    throw new Error('The downloaded file does not look like the IANA Language Subtag Registry.');
  }

  for (const key of ['languages', 'scripts', 'regions', 'variants']) {
    data[key] = Object.fromEntries(Object.entries(data[key]).sort(([left], [right]) => left.localeCompare(right)));
  }

  return data;
}

async function readSource() {
  const sourceArg = process.argv[2];
  if (sourceArg) {
    return fs.readFileSync(path.resolve(sourceArg), 'utf8');
  }

  const response = await fetch(registryUrl);
  if (!response.ok) {
    throw new Error(`IANA registry download failed with HTTP ${response.status}.`);
  }
  return response.text();
}

const registry = parseRegistry(await readSource());
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(registry)}\n`);
console.log(
  `Updated ${path.relative(repositoryRoot, outputPath)} from IANA registry ${registry.fileDate} ` +
    `(${Object.keys(registry.languages).length} languages, ${Object.keys(registry.regions).length} regions).`,
);

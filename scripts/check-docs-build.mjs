#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(repositoryRoot, 'docs/.vitepress/dist');
const basePath = '/to-words/';
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function resolveOutputReference(reference, htmlPath) {
  if (
    reference.startsWith('#') ||
    reference.startsWith('data:') ||
    reference.startsWith('mailto:') ||
    reference.startsWith('tel:') ||
    /^https?:\/\//.test(reference)
  ) {
    return null;
  }

  const relativeHtmlPath = path.relative(outputDirectory, htmlPath).split(path.sep).join('/');
  const pageUrl = new URL(relativeHtmlPath, `https://docs.invalid${basePath}`);
  const resolvedUrl = new URL(reference.replaceAll('&amp;', '&'), pageUrl);

  if (!resolvedUrl.pathname.startsWith(basePath)) {
    fail(`${relativeHtmlPath} contains a reference outside ${basePath}: ${reference}`);
    return null;
  }

  let outputPath = decodeURIComponent(resolvedUrl.pathname.slice(basePath.length));
  if (!outputPath || outputPath.endsWith('/')) {
    outputPath = `${outputPath}index.html`;
  } else if (!path.extname(outputPath)) {
    outputPath = `${outputPath}.html`;
  }

  return path.join(outputDirectory, outputPath);
}

if (!fs.existsSync(outputDirectory)) {
  throw new Error(`Docs output does not exist: ${outputDirectory}`);
}

const htmlFiles = walk(outputDirectory).filter((filePath) => filePath.endsWith('.html'));
const indexPath = path.join(outputDirectory, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

if (!/<meta name="generator" content="VitePress v[^"]+">/.test(indexHtml)) {
  fail('index.html is not a VitePress build');
}
if (!indexHtml.includes('Twelve Thousand Three Hundred Forty Five Dollars And Sixty Seven Cents Only')) {
  fail('the server-rendered number demo did not produce its expected initial result');
}
if (indexHtml.includes('Loading…') || indexHtml.includes('<NumberDemo')) {
  fail('the home page still contains an unrendered number demo');
}

for (const htmlPath of htmlFiles) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const targetPath = resolveOutputReference(match[1], htmlPath);
    if (targetPath && !fs.existsSync(targetPath)) {
      fail(
        `${path.relative(outputDirectory, htmlPath)} references missing output ${path.relative(outputDirectory, targetPath)}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`Docs build verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Verified ${htmlFiles.length} VitePress pages, their local references, and the interactive demo SSR output.`,
);

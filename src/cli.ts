#!/usr/bin/env node

import { ToWords, detectLocale } from './ToWords.js';

function printHelp(): void {
  console.log(`Usage: to-words <number> [options]

Options:
  --locale <code>    Locale code (default: auto-detected, falls back to en-IN)
  --currency         Convert as currency amount
  --ordinal          Convert as ordinal (e.g. "Third")
  --detect-locale    Print the auto-detected locale and exit
  -h, --help         Show this help

Examples:
  to-words 12345
  to-words 12345 --locale en-US
  to-words 1234.56 --locale en-US --currency
  to-words 3 --locale en-US --ordinal
  to-words --detect-locale
`);
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  printHelp();
  process.exit(0);
}

if (args.includes('--detect-locale')) {
  console.log(detectLocale());
  process.exit(0);
}

const isCurrency = args.includes('--currency');
const isOrdinal = args.includes('--ordinal');
const numberArg = args.find((a) => !a.startsWith('-'));

if (!numberArg) {
  console.error('Error: No number provided.\n');
  printHelp();
  process.exit(1);
}

const localeIdx = args.indexOf('--locale');
let localeCode: string;

if (localeIdx !== -1) {
  const provided = args[localeIdx + 1];
  if (!provided || provided.startsWith('-')) {
    console.error('Error: --locale requires a locale code (e.g. --locale en-US)\n');
    process.exit(1);
  }
  localeCode = provided;
} else {
  localeCode = detectLocale();
}

try {
  const tw = new ToWords({ localeCode });
  if (isOrdinal) {
    console.log(tw.toOrdinal(Number.parseInt(numberArg, 10)));
  } else {
    console.log(tw.convert(numberArg, { currency: isCurrency }));
  }
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}

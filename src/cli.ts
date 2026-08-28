#!/usr/bin/env node

import { ToWords, detectLocale } from './ToWords.js';
import type { LocaleCode } from './locale-manifest.js';
import type { RangeMode } from './types.js';

function printHelp(): void {
  console.log(`Usage: to-words <number> [options]

Options:
  --locale <code>    Locale code (default: auto-detected, falls back to en-IN)
  --currency         Convert as currency amount
  --ordinal          Convert as ordinal (e.g. "Third")
  --range-mode <mode>  Range handling: strict (default) or compose
  --detect-locale    Print the auto-detected locale and exit
  --                  End options (useful before a negative number)
  -h, --help         Show this help

Examples:
  to-words 12345
  to-words 12345 --locale en-US
  to-words 1234.56 --locale en-US --currency
  to-words 3 --locale en-US --ordinal
  to-words 1e100 --locale en-US --range-mode compose
  to-words --locale en-US -- -5
  to-words --detect-locale
`);
}

type CliOptions = {
  currency: boolean;
  localeCode?: string;
  number?: string;
  ordinal: boolean;
  rangeMode?: RangeMode;
};

function parseArgs(args: string[]): CliOptions | string {
  const options: CliOptions = { currency: false, ordinal: false };
  const positional: string[] = [];
  let optionsEnded = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (optionsEnded) {
      positional.push(arg);
      continue;
    }

    if (arg === '--') {
      optionsEnded = true;
    } else if (arg === '--currency') {
      options.currency = true;
    } else if (arg === '--ordinal') {
      options.ordinal = true;
    } else if (arg === '--locale') {
      if (options.localeCode !== undefined) {
        return 'The --locale option may only be provided once.';
      }
      const provided = args[index + 1];
      if (!provided || provided.startsWith('-')) {
        return '--locale requires a locale code (e.g. --locale en-US)';
      }
      options.localeCode = provided;
      index += 1;
    } else if (arg === '--range-mode') {
      if (options.rangeMode !== undefined) {
        return 'The --range-mode option may only be provided once.';
      }
      const provided = args[index + 1];
      if (provided !== 'strict' && provided !== 'compose') {
        return '--range-mode requires either "strict" or "compose"';
      }
      options.rangeMode = provided;
      index += 1;
    } else if (arg.startsWith('-') && !/^-(?:\d|\.\d)/.test(arg)) {
      return `Unknown option "${arg}".`;
    } else {
      positional.push(arg);
    }
  }

  if (options.currency && options.ordinal) {
    return '--currency and --ordinal cannot be used together.';
  }
  if (positional.length === 0) {
    return 'No number provided.';
  }
  if (positional.length > 1) {
    return `Expected one number, received ${positional.length}.`;
  }

  options.number = positional[0];
  return options;
}

export function runCli(args: string[]): void {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
    return;
  }

  if (args.includes('--detect-locale')) {
    console.log(detectLocale());
    process.exit(0);
    return;
  }

  const parsed = parseArgs(args);
  if (typeof parsed === 'string') {
    console.error(`Error: ${parsed}\n`);
    if (parsed === 'No number provided.') {
      printHelp();
    }
    process.exit(1);
    return;
  }

  try {
    // CLI input is dynamic; the constructor performs canonical resolution and
    // emits migration-aware errors for unsupported legacy codes.
    const localeCode = (parsed.localeCode ?? detectLocale()) as LocaleCode;
    const tw = new ToWords({ localeCode });
    if (parsed.ordinal) {
      console.log(tw.toOrdinal(parsed.number!, { rangeMode: parsed.rangeMode }));
    } else {
      console.log(tw.convert(parsed.number!, { currency: parsed.currency, rangeMode: parsed.rangeMode }));
    }
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
    process.exit(1);
  }
}

// Only run when executed directly (not when imported in tests)
// require.main === module works in CJS; the compiled CLI is always CJS.
/* c8 ignore next 3 */
if (require.main === module) {
  runCli(process.argv.slice(2));
}

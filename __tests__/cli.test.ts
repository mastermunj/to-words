import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { runCli } from '../src/cli';

describe('CLI', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: string | number | null) => never);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Help / no-args
  // ---------------------------------------------------------------------------

  test('prints help and exits 0 when no args given', () => {
    runCli([]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('prints help and exits 0 for -h', () => {
    runCli(['-h']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('prints help and exits 0 for --help', () => {
    runCli(['--help']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  // ---------------------------------------------------------------------------
  // --detect-locale
  // ---------------------------------------------------------------------------

  test('--detect-locale prints a non-empty locale string and exits 0', () => {
    runCli(['--detect-locale']);
    const printed = logSpy.mock.calls[0][0] as string;
    expect(typeof printed).toBe('string');
    expect(printed.length).toBeGreaterThan(0);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  // ---------------------------------------------------------------------------
  // Number conversion
  // ---------------------------------------------------------------------------

  test('converts an integer with explicit --locale', () => {
    runCli(['12345', '--locale', 'en-US']);
    expect(logSpy).toHaveBeenCalledWith('Twelve Thousand Three Hundred Forty Five');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts Estonian with the et-EE locale code', () => {
    runCli(['42', '--locale', 'et-EE']);
    expect(logSpy).toHaveBeenCalledWith('Nelikümmend Kaks');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts Nepali with the ne-NP locale code', () => {
    runCli(['42', '--locale', 'ne-NP']);
    expect(logSpy).toHaveBeenCalledWith('बयालीस');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('accepts options before the number', () => {
    runCli(['--locale', 'en-US', '123']);
    expect(logSpy).toHaveBeenCalledWith('One Hundred Twenty Three');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts a negative positional number', () => {
    runCli(['--locale', 'en-US', '-5']);
    expect(logSpy).toHaveBeenCalledWith('Minus Five');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('accepts a negative number after the end-of-options marker', () => {
    runCli(['--locale', 'en-US', '--', '-5']);
    expect(logSpy).toHaveBeenCalledWith('Minus Five');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts with --currency flag', () => {
    runCli(['100', '--locale', 'en-US', '--currency']);
    expect(logSpy).toHaveBeenCalledWith('One Hundred Dollars Only');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts with --ordinal flag', () => {
    runCli(['3', '--locale', 'en-US', '--ordinal']);
    expect(logSpy).toHaveBeenCalledWith('Third');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('preserves exact large ordinal strings', () => {
    runCli(['9007199254740993', '--locale', 'en-US', '--ordinal']);
    expect(logSpy).toHaveBeenCalledWith(
      'Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion Two Hundred Fifty Four Million Seven Hundred Forty Thousand Nine Hundred Ninety Third',
    );
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts a decimal number with --currency', () => {
    runCli(['10.5', '--locale', 'en-IN', '--currency']);
    expect(logSpy).toHaveBeenCalledWith('Ten Rupees And Fifty Paise Only');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('supports explicit compose mode for values above the strict locale range', () => {
    runCli(['1e100', '--locale', 'en-US', '--range-mode', 'compose']);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toEqual(expect.any(String));
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('uses strict range handling by default', () => {
    runCli(['1e100', '--locale', 'en-US']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('outside the verified cardinal range'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('uses auto-detected locale when --locale is omitted', () => {
    runCli(['1']);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const printed = logSpy.mock.calls[0][0] as string;
    expect(typeof printed).toBe('string');
    expect(printed.length).toBeGreaterThan(0);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Error paths
  // ---------------------------------------------------------------------------

  test('errors and exits 1 when no number is provided', () => {
    runCli(['--currency']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('No number provided'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 when --locale flag has no value', () => {
    runCli(['100', '--locale']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--locale requires a locale code'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 when --locale value starts with a dash', () => {
    runCli(['100', '--locale', '--currency']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--locale requires a locale code'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects an invalid --range-mode value', () => {
    runCli(['100', '--range-mode', 'unsafe']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('strict'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects repeated --range-mode options', () => {
    runCli(['100', '--range-mode', 'strict', '--range-mode', 'compose']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('only be provided once'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 for an unknown locale', () => {
    runCli(['100', '--locale', 'xx-XX']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown Locale'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects the removed ee-EE locale code', () => {
    runCli(['42', '--locale', 'ee-EE']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('use "et-EE" instead'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects the removed np-NP locale code with a migration hint', () => {
    runCli(['42', '--locale', 'np-NP']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('use "ne-NP" instead'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 for an invalid number string', () => {
    runCli(['abc', '--locale', 'en-US']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects a fractional ordinal instead of truncating it', () => {
    runCli(['3.9', '--locale', 'en-US', '--ordinal']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('non-negative integers'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects unknown options', () => {
    runCli(['123', '--unknown']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown option'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects conflicting conversion modes', () => {
    runCli(['123', '--currency', '--ordinal']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('cannot be used together'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects multiple positional numbers', () => {
    runCli(['123', '456']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Expected one number'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('rejects repeated locale options', () => {
    runCli(['123', '--locale', 'en-US', '--locale', 'en-IN']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('only be provided once'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

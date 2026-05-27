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

  test('converts a decimal number with --currency', () => {
    runCli(['10.5', '--locale', 'en-IN', '--currency']);
    expect(logSpy).toHaveBeenCalledWith('Ten Rupees And Fifty Paise Only');
    expect(exitSpy).not.toHaveBeenCalled();
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

  test('errors and exits 1 for an unknown locale', () => {
    runCli(['100', '--locale', 'xx-XX']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown Locale'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 for an invalid number string', () => {
    runCli(['abc', '--locale', 'en-US']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

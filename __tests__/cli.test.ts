import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper: reset modules so top-level CLI code re-runs fresh for each test,
// set process.argv, then dynamically import the CLI module.
async function runCli(...args: string[]): Promise<void> {
  vi.resetModules();
  process.argv = ['node', 'cli.ts', ...args];
  await import('../src/cli.ts');
}

describe('CLI', () => {
  const originalArgv = process.argv;
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
    process.argv = originalArgv;
  });

  // ---------------------------------------------------------------------------
  // Help / no-args
  // ---------------------------------------------------------------------------

  test('prints help and exits 0 when no args given', async () => {
    await runCli();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('prints help and exits 0 for -h', async () => {
    await runCli('-h');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('prints help and exits 0 for --help', async () => {
    await runCli('--help');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: to-words'));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  // ---------------------------------------------------------------------------
  // --detect-locale
  // ---------------------------------------------------------------------------

  test('--detect-locale prints a non-empty locale string and exits 0', async () => {
    await runCli('--detect-locale');
    // First log call is the locale (process.exit is mocked, so code may continue)
    const printed = logSpy.mock.calls[0][0] as string;
    expect(typeof printed).toBe('string');
    expect(printed.length).toBeGreaterThan(0);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  // ---------------------------------------------------------------------------
  // Number conversion
  // ---------------------------------------------------------------------------

  test('converts an integer with explicit --locale', async () => {
    await runCli('12345', '--locale', 'en-US');
    expect(logSpy).toHaveBeenCalledWith('Twelve Thousand Three Hundred Forty Five');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts with --currency flag', async () => {
    await runCli('100', '--locale', 'en-US', '--currency');
    expect(logSpy).toHaveBeenCalledWith('One Hundred Dollars Only');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts with --ordinal flag', async () => {
    await runCli('3', '--locale', 'en-US', '--ordinal');
    expect(logSpy).toHaveBeenCalledWith('Third');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('converts a decimal number with --currency', async () => {
    await runCli('10.5', '--locale', 'en-IN', '--currency');
    expect(logSpy).toHaveBeenCalledWith('Ten Rupees And Fifty Paise Only');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('uses auto-detected locale when --locale is omitted', async () => {
    await runCli('1');
    // Should produce a non-empty string without crashing
    expect(logSpy).toHaveBeenCalledTimes(1);
    const printed = logSpy.mock.calls[0][0] as string;
    expect(typeof printed).toBe('string');
    expect(printed.length).toBeGreaterThan(0);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Error paths
  // ---------------------------------------------------------------------------

  test('errors and exits 1 when no number is provided', async () => {
    // --currency alone has no non-flag token → numberArg is undefined
    await runCli('--currency');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('No number provided'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 when --locale flag has no value', async () => {
    await runCli('100', '--locale');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--locale requires a locale code'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 when --locale value starts with a dash', async () => {
    await runCli('100', '--locale', '--currency');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--locale requires a locale code'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 for an unknown locale', async () => {
    await runCli('100', '--locale', 'xx-XX');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown Locale'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('errors and exits 1 for an invalid number string', async () => {
    await runCli('abc', '--locale', 'en-US');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

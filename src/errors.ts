import type { ConversionForm } from './types.js';

/** Raised when strict range validation rejects a value outside a locale's verified range. */
export class NumberOutOfRangeError extends RangeError {
  public readonly code = 'NUMBER_OUT_OF_RANGE' as const;

  constructor(
    public readonly localeCode: string,
    public readonly form: ConversionForm,
    public readonly value: string,
    public readonly maximumSupported: string,
  ) {
    super(
      `Number "${value}" is outside the verified ${form} range for locale "${localeCode}" ` +
        `(maximum ${maximumSupported}). Pass { rangeMode: "compose" } to opt into recursive scale composition.`,
    );
    this.name = 'NumberOutOfRangeError';
  }
}

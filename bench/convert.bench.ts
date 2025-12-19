import { bench, describe } from 'vitest';
import { ToWords } from '../src/ToWords';
import type { ConverterOptions } from '../src/types';

const localeCodes = ['en-IN', 'en-US', 'es-MX', 'ar-AE', 'fr-FR'];
const integerSamples = [0, 15, 105, 999, 1234, 98765, 1234567, 900719925474];
const decimalSamples = [0.42, 12.34, 100.01, 9999.99, 12345.678, 4500000.56];
const currencySamples = [0.5, 1, 9.99, 19.5, 101.01, 999.75, 12345.43, 987654.21];

const toWordsInstances = localeCodes.map((localeCode) => new ToWords({ localeCode }));
const currencyConversionOptions: ConverterOptions = { currency: true };

let sink = '';

function runConversion(samples: number[], options?: ConverterOptions): void {
  for (const sample of samples) {
    for (const toWords of toWordsInstances) {
      sink = toWords.convert(sample, options);
    }
  }
}

describe('ToWords performance', () => {
  bench('convert integers across locales', () => {
    runConversion(integerSamples);
  });

  bench('convert decimals across locales', () => {
    runConversion(decimalSamples);
  });

  bench('convert currencies across locales', () => {
    runConversion(currencySamples, currencyConversionOptions);
  });
});

// Prevent tree-shaking in case the benchmark file is bundled in the future
export { sink };

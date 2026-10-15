import { defineConfig } from 'oxlint';
import baseConfig from '@mastermunj/oxc-config/oxlint';

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['docs/.vitepress/cache/**', 'docs/.vitepress/dist/**'],
  overrides: [
    {
      files: ['vitest.config.ts', 'docs/.vitepress/**'],
      rules: {
        'typescript/no-unsafe-argument': 'off',
      },
    },
    {
      // Benchmark tests measure with the `bench` fixture rather than assert.
      files: ['bench/**'],
      rules: {
        'vitest/expect-expect': 'off',
      },
    },
  ],
});

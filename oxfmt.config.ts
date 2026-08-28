import { defineConfig } from 'oxfmt';
import baseConfig from '@mastermunj/oxc-config/oxfmt';

export default defineConfig({
  ...baseConfig,
  ignorePatterns: [...(baseConfig.ignorePatterns ?? []), 'scripts/data/iana-language-subtags.json'],
});

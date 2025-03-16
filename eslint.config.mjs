import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
      },

      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    files: ['**/*.ts'],
  },
  {
    ignores: ['node_modules', 'dist', 'coverage', '**/*.d.ts', '**/*.js', '**/*.cjs'],
  },
];

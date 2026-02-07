import { configPkg } from '@mastermunj/eslint-config';

export default configPkg({
  rules: {
    // Allow kebab-case for locale files like en-US.ts
    '@unicorn/filename-case': 'off',
    // Allow __filename and __dirname variables (ESM compatibility)
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        filter: {
          regex: '^__filename$|^__dirname$',
          match: false,
        },
      },
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'class', format: ['PascalCase'] },
      { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
    ],
  },
});

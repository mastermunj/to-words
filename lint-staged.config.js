module.exports = {
  'package.json': 'sort-package-json',
  '*.{ts,tsx}': 'eslint --max-warnings=0 . --ext=.ts --fix',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json',
};

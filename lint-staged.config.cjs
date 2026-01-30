module.exports = {
  'package.json': 'sort-package-json',
  '*.{ts,tsx}': 'eslint --no-warn-ignored --max-warnings=0 . --fix',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json',
};

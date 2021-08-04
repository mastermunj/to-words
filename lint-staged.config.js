module.exports = {
  'package.json': 'sort-package-json',
  '*.{ts,tsx}': 'eslint --max-warnings=0 . --ext=.ts --fix --no-ignore',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json',
};

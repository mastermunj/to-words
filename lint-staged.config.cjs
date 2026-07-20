module.exports = {
  '*.{ts,tsx}': 'npm run lint:fix',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json',
};

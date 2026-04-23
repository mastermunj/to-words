module.exports = {
  '*.{ts,tsx}': 'npm run lint:fix',
  '**/*.ts?(x)': () => 'tsgo -p tsconfig.json',
};

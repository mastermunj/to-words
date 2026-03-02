import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    watch: false,
    cache: false,
    coverage: {
      enabled: true,
      include: ['src/**'],
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
    },
  },
});

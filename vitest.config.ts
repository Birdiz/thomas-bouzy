import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    // tests/e2e is Playwright's; vitest must not try to run it.
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
});

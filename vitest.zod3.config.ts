import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Runs the same schema tests against Zod v3 (installed as the `zod3` alias).
export default defineConfig({
  resolve: {
    alias: { zod: fileURLToPath(new URL('./node_modules/zod3', import.meta.url)) },
  },
  test: { include: ['test/schemas.test.ts'] },
});

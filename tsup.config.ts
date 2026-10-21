import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/validators.ts', 'src/testing.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
  external: ['zod'],
});

import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';

// Same measurement as a user's bundler: esbuild, minified, then gzipped.
const root = fileURLToPath(new URL('..', import.meta.url));
const DEVANAGARI = /[ऀ-ॿ]/;

async function bundle(contents: string) {
  const result = await build({
    stdin: { contents, resolveDir: root, loader: 'ts' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    external: ['zod'],
    charset: 'utf8', // keep Devanagari as-is so the check below can see it
    logLevel: 'silent',
  });
  const [file] = result.outputFiles;
  if (!file) throw new Error('esbuild produced no output');
  const code = file.text;
  return { code, gzip: gzipSync(code).length };
}

describe('bundle size', () => {
  it('keeps the English words helpers small and free of the Hindi table', async () => {
    const { code, gzip } = await bundle(
      "export { toIndianWords, rupeesInWords } from './src/format';",
    );
    expect(code).not.toMatch(DEVANAGARI);
    // 599 bytes on main when this check was added; the budget leaves room for small fixes.
    expect(gzip).toBeLessThanOrEqual(650);
  });
  it.each(['./src/index', './src/validators', './src/testing'])(
    '%s does not carry the Hindi table',
    async (entry) => {
      const { code } = await bundle(`export * from '${entry}';`);
      expect(code).not.toMatch(DEVANAGARI);
    },
  );
  it('ships the Hindi table only in zod-india/hindi', async () => {
    const { code } = await bundle("export * from './src/hindi';");
    expect(code).toMatch(DEVANAGARI);
  });
});

// Runtime smoke test of the built package (ESM + CJS), used to verify Node 18 support
// where the dev tooling (Vitest, ESLint) itself no longer runs.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as esm from 'zod-india';
import * as esmValidators from 'zod-india/validators';

const cjs = createRequire(import.meta.url)('zod-india');

for (const m of [esm, cjs]) {
  assert.equal(m.zGSTIN().parse(' 27aapfu0939f1zv '), '27AAPFU0939F1ZV');
  assert.equal(m.zMobile().parse('098765 43210'), '+919876543210');
  assert.equal(m.zAadhaar().safeParse('234123412345').success, false);
  assert.equal(m.maskAadhaar('234123412346'), 'XXXX XXXX 2346');
}
assert.equal(esmValidators.isValidIFSC('SBIN0000001'), true);
assert.equal(esmValidators.formatINR(1234567.5), '₹12,34,567.50');
const testing = await import('zod-india/testing');
assert.equal(esm.isValidGSTIN(testing.fakeGSTIN()), true);
console.log(`smoke ok on Node ${process.version}`);

# zod-india

[Zod](https://zod.dev) schemas and zero-dependency validators for Indian identifiers and formats:
**GSTIN, PAN, TAN, IFSC, UPI ID, mobile number, PIN code, Aadhaar and vehicle registration**.

- Real checksums where they exist: GSTIN mod-36 and Aadhaar Verhoeff, not just regexes.
- Normalises messy input (`" 27aapfu0939f1zv "` → `27AAPFU0939F1ZV`, `098765 43210` → `+919876543210`).
- Works with **Zod v3 and v4** (peer dependency). No other runtime dependencies.
- Pure functions are importable without Zod from `zod-india/validators`.
- ESM + CJS, fully typed, tree-shakeable (`sideEffects: false`), Node 18+.

> **Limits.** Every check is offline: format rules plus the published checksum where one exists.
> A value that passes is _well-formed_. It is **not** proof that the number was issued, is active,
> or belongs to the person submitting it. For that you need the relevant government or bank API.

## Install

```sh
npm install zod-india zod
```

## Usage

```ts
import { z } from 'zod';
import { zGSTIN, zPAN, zMobile, zAadhaar, maskAadhaar } from 'zod-india';

const Merchant = z.object({
  gstin: zGSTIN(),
  pan: zPAN(),
  phone: zMobile(),
  aadhaar: zAadhaar().transform((v) => maskAadhaar(v)), // store only the masked form
});

Merchant.parse({
  gstin: '27aapfu0939f1zv',
  pan: 'aapfu0939f',
  phone: '+91 98765 43210',
  aadhaar: '2341 2341 2346',
});
// { gstin: '27AAPFU0939F1ZV', pan: 'AAPFU0939F', phone: '+919876543210', aadhaar: 'XXXX XXXX 2346' }
```

Every schema factory takes the same options:

```ts
zGSTIN({ message: 'Enter a valid GSTIN' }); // custom error message
zGSTIN({ normalize: false }); // no cleaning; input must already be canonical and is returned as-is
```

Without Zod:

```ts
import { isValidGSTIN, normalizeGSTIN, parseGSTIN, panEntityType } from 'zod-india/validators';

isValidGSTIN(normalizeGSTIN(' 27aapfu0939f1zv ')); // true
parseGSTIN('27AAPFU0939F1ZV'); // { stateCode: '27', state: 'Maharashtra', pan: 'AAPFU0939F', entityNumber: '1', checkChar: 'V' }
panEntityType('AAPFU0939F'); // 'Firm / LLP'
```

`isValidX` functions expect normalised input. Call the matching `normalizeX` first, or use the schema.

## Validators

| Format       | Schema             | Function               | How it is checked                                                                                                                         | Normalised output       |
| ------------ | ------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| GSTIN        | `zGSTIN()`         | `isValidGSTIN`         | 15 chars; known GST state code (01–38, 97, 99); characters 3–12 a valid PAN; 13th 1–9/A–Z; 14th `Z`; 15th the GSTN mod-36 check character | `27AAPFU0939F1ZV`       |
| PAN          | `zPAN()`           | `isValidPAN`           | `AAAPA9999A`; 4th char a holder type (A B C F G H J L P T). PAN has no public checksum                                                    | `ABCPD1234E`            |
| TAN          | `zTAN()`           | `isValidTAN`           | `AAAA99999A`                                                                                                                              | `DELA12345B`            |
| IFSC         | `zIFSC()`          | `isValidIFSC`          | 4 letters, a `0`, 6 alphanumerics (RBI format)                                                                                            | `SBIN0000001`           |
| UPI ID (VPA) | `zUPI()`           | `isValidUPI`           | `handle@psp` syntax only. **Does not check that the PSP handle exists**                                                                   | `name@okaxis`           |
| Mobile       | `zMobile()`        | `isValidMobile`        | Optional `+91` / `91` / `0091` / `0`, then 10 digits starting 6–9. Spaces, dashes, brackets allowed                                       | `+919876543210` (E.164) |
| PIN code     | `zPincode()`       | `isValidPincode`       | 6 digits, first 1–9                                                                                                                       | `110001`                |
| Aadhaar      | `zAadhaar()`       | `isValidAadhaar`       | 12 digits, not starting 0 or 1, valid Verhoeff check digit                                                                                | `234123412346`          |
| Vehicle reg. | `zVehicleNumber()` | `isValidVehicleNumber` | `SS NN X(XX) NNNN` with a known state/UT code, or Bharat series `YY BH NNNN XX`                                                           | `DL01AB1234`            |

### Helpers

- `maskAadhaar(value, maskChar = 'X')` → `XXXX XXXX 1234`. Keeps only the last 4 digits.
- `verhoeffValidate(digits)` / `verhoeffGenerate(digits)`: general-purpose Verhoeff.
- `gstinCheckChar(first14)`: compute the GSTIN check character.
- `parseGSTIN`, `panEntityType`, and the tables `GST_STATE_CODES`, `PAN_ENTITY_TYPES`, `VEHICLE_STATE_CODES`.

## Notes and known limits

- **GSTIN**: special registrations (UN bodies, non-resident OIDAR, TDS/TCS) use a different structure in characters 3–12 and are rejected. Use `{ checksum: false }` on `isValidGSTIN` only if you have a reason.
- **Aadhaar**: the Verhoeff check catches all single-digit typos and adjacent swaps, but random 12-digit numbers still pass about 1 time in 10. Never log or store full Aadhaar numbers; mask them (see UIDAI guidance).
- **Vehicle numbers**: state-series formats vary by RTO; the rule here is deliberately permissive within a known state prefix.
- **Mobile**: Indian mobile numbers only, not landlines.

## Comparison

| Package                                                            | Zod schemas | GSTIN checksum  | Aadhaar Verhoeff | Normalisation | Types  | Zod v3 + v4 |
| ------------------------------------------------------------------ | ----------- | --------------- | ---------------- | ------------- | ------ | ----------- |
| **zod-india**                                                      | ✅          | ✅              | ✅               | ✅            | ✅     | ✅          |
| single-format packages (`gstin-validator`, `aadhaar-validator`, …) | ❌          | one format each | one format each  | ❌            | varies | ❌          |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Please never put a real person's identifiers in issues or tests.

## License

MIT © Krrish Kumar

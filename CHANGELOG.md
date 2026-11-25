# zod-india

## 0.6.0

### Minor Changes

- 6670bb9: Add a `zod-india/hindi` entry with `toHindiWords` and `rupeesInHindiWords` for Hindi number words (हज़ार, लाख, करोड़; "… रुपये और … पैसे"). The English entries do not load the Hindi table. Thanks @KaustubhBarve (#9).
- 5a281ad: Add driving licence (`zDrivingLicence`, `isValidDrivingLicence`, `parseDrivingLicence`, 15-character Sarathi layout with state, RTO and issue-year checks), passport (`zPassport`, `isValidPassport`) and voter ID / EPIC (`zVoterID`, `isValidVoterID`) validation. New cross-field check `gstinMatchesPANRefinement()` for `z.object(...).superRefine(...)` reports a GSTIN that belongs to a different PAN, and `gstinMatchesPAN(gstin, pan)` does the same without Zod. Both work with Zod v3 and v4.

### Patch Changes

- 0182586: Accept Telangana's `TG` state code on vehicle numbers (used on new registrations since 2024). `TS` is still accepted.

## 0.5.1

### Patch Changes

- 93bfd4f: Fix `formatINRCompact` rolling over to `₹100K` or `₹100 L` at unit boundaries; 99,999 now shows `₹1 L` and 9,999,999 shows `₹1 Cr`. Thanks @saimskywalker (#8).

## 0.5.0

### Minor Changes

- 08ce7d6: Add CIN (Corporate Identification Number) normalization, validation and a Zod schema (`zCIN`, `isValidCIN`). Thanks @Aaqibhafeezkhan (#6).

### Patch Changes

- npm description and keywords now mention CIN.

## 0.4.0

### Minor Changes

- 6f8601f: Add Udyam (MSME) registration number normalization, validation and Zod schema. Thanks @Aaqibhafeezkhan (#5).

## 0.3.2

### Patch Changes

- npm metadata: shorter description, focused keywords, homepage/bugs links; README links sibling packages.

## 0.3.1

### Patch Changes

- README: clarify which GSTIN registrations are accepted (regular GSTINs; UIN, OIDAR and TAN-based TDS/TCS registrations are rejected on purpose).
- Dev dependency security updates (no runtime changes).

## 0.3.0

### Minor Changes

- 4986045: Add Indian display helpers (`formatINR`, `formatINRCompact`, `toIndianWords`, `rupeesInWords`, `maskPAN`, `maskMobile`, `formatMobile`, `formatAadhaar`), offline lookups (`parseVehicleNumber`, `pincodeZone`, `parseIFSC`), and a `zod-india/testing` entry with seedable, checksum-valid fake data generators.

## 0.2.0

### Minor Changes

- 8440ff5: Initial release: validators and Zod schemas for GSTIN, PAN, TAN, IFSC, UPI, mobile, PIN code, Aadhaar and vehicle registration numbers.

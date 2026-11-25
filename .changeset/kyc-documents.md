---
'zod-india': minor
---

Add driving licence (`zDrivingLicence`, `isValidDrivingLicence`, `parseDrivingLicence`, 15-character Sarathi layout with state, RTO and issue-year checks), passport (`zPassport`, `isValidPassport`) and voter ID / EPIC (`zVoterID`, `isValidVoterID`) validation. New cross-field check `gstinMatchesPANRefinement()` for `z.object(...).superRefine(...)` reports a GSTIN that belongs to a different PAN, and `gstinMatchesPAN(gstin, pan)` does the same without Zod. Both work with Zod v3 and v4.

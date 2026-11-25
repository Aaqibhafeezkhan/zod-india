import { z } from 'zod';
import {
  gstinMatchesPAN,
  isValidAadhaar,
  isValidCIN,
  isValidDrivingLicence,
  isValidGSTIN,
  isValidIFSC,
  isValidMobile,
  isValidPAN,
  isValidPassport,
  isValidPincode,
  isValidTAN,
  isValidUPI,
  isValidUdyam,
  isValidVehicleNumber,
  isValidVoterID,
  normalizeAadhaar,
  normalizeCIN,
  normalizeDrivingLicence,
  normalizeGSTIN,
  normalizeIFSC,
  normalizeMobile,
  normalizePAN,
  normalizePassport,
  normalizePincode,
  normalizeTAN,
  normalizeUPI,
  normalizeUdyam,
  normalizeVehicleNumber,
  normalizeVoterID,
} from './validators';

export * from './validators';

export interface SchemaOptions {
  /** Custom error message. */
  message?: string;
  /**
   * When `true` (default) input is cleaned before validation (trim, strip spaces/hyphens,
   * fix case, E.164 for mobiles) and the parsed output is the normalised value.
   * When `false` the input must already be in canonical form and is returned unchanged.
   */
  normalize?: boolean;
}

function build(
  isValid: (v: string) => boolean,
  normalize: (v: string) => string,
  defaultMessage: string,
  options: SchemaOptions = {},
) {
  const message = options.message ?? defaultMessage;
  if (options.normalize === false) return z.string().refine(isValid, { message });
  return z
    .string()
    .transform((v) => normalize(v.trim()))
    .refine(isValid, { message });
}

/** GSTIN schema: format, state code, embedded PAN and mod-36 checksum. */
export const zGSTIN = (options?: SchemaOptions) =>
  build(isValidGSTIN, normalizeGSTIN, 'Invalid GSTIN', options);
/** PAN schema: `AAAPA9999A` with a valid holder-type 4th character. */
export const zPAN = (options?: SchemaOptions) =>
  build(isValidPAN, normalizePAN, 'Invalid PAN', options);
/** TAN schema: `AAAA99999A`. */
export const zTAN = (options?: SchemaOptions) =>
  build(isValidTAN, normalizeTAN, 'Invalid TAN', options);
/** IFSC schema: `AAAA0XXXXXX`. */
export const zIFSC = (options?: SchemaOptions) =>
  build(isValidIFSC, normalizeIFSC, 'Invalid IFSC code', options);
/** UPI VPA schema (`handle@psp`), syntax only. */
export const zUPI = (options?: SchemaOptions) =>
  build(isValidUPI, normalizeUPI, 'Invalid UPI ID', options);
/** Indian mobile schema; output is E.164 (`+91XXXXXXXXXX`) when normalising. */
export const zMobile = (options?: SchemaOptions) =>
  build(isValidMobile, normalizeMobile, 'Invalid Indian mobile number', options);
/** PIN code schema: 6 digits, first digit 1-9. */
export const zPincode = (options?: SchemaOptions) =>
  build(isValidPincode, normalizePincode, 'Invalid PIN code', options);
/** Aadhaar schema: 12 digits, not starting 0/1, Verhoeff checksum. Output has no spaces. */
export const zAadhaar = (options?: SchemaOptions) =>
  build(isValidAadhaar, normalizeAadhaar, 'Invalid Aadhaar number', options);
/** Udyam (MSME) registration number schema. Output is canonical upper-case with hyphens. */
export const zUdyam = (options?: SchemaOptions) =>
  build(isValidUdyam, normalizeUdyam, 'Invalid Udyam number', options);
/** Vehicle registration schema (state series or BH series). Output is compact upper-case. */
export const zVehicleNumber = (options?: SchemaOptions) =>
  build(
    isValidVehicleNumber,
    normalizeVehicleNumber,
    'Invalid vehicle registration number',
    options,
  );

/** Corporate Identification Number schema: 21-character structure and known state code. */
export const zCIN = (options?: SchemaOptions) =>
  build(isValidCIN, normalizeCIN, 'Invalid CIN', options);

/** Indian passport number schema: one letter and seven digits. */
export const zPassport = (options?: SchemaOptions) =>
  build(isValidPassport, normalizePassport, 'Invalid passport number', options);

/** Voter ID (EPIC) schema: three letters and seven digits. */
export const zVoterID = (options?: SchemaOptions) =>
  build(isValidVoterID, normalizeVoterID, 'Invalid voter ID (EPIC) number', options);

/** Driving licence schema (15-character Sarathi format). Output is compact upper-case. */
export const zDrivingLicence = (options?: SchemaOptions) =>
  build(isValidDrivingLicence, normalizeDrivingLicence, 'Invalid driving licence number', options);

export interface GSTINMatchesPANOptions<K extends string = string> {
  /** Key of the GSTIN field. Default `'gstin'`. */
  gstin?: K;
  /** Key of the PAN field. Default `'pan'`. */
  pan?: K;
  /** Error message, reported on the GSTIN field. */
  message?: string;
}

/**
 * Cross-field check for `z.object(...).superRefine(...)`: the PAN inside the GSTIN must be the PAN
 * on the same form. Skips silently when either field is missing or invalid, so the field schemas
 * report those errors on their own. Works with Zod v3 and v4.
 *
 * ```ts
 * z.object({ gstin: zGSTIN(), pan: zPAN() }).superRefine(gstinMatchesPANRefinement());
 * ```
 */
export function gstinMatchesPANRefinement(options: GSTINMatchesPANOptions = {}) {
  const gstinKey = options.gstin ?? 'gstin';
  const panKey = options.pan ?? 'pan';
  const message = options.message ?? 'GSTIN does not belong to this PAN';
  return (
    data: Record<string, unknown>,
    ctx: {
      addIssue: (issue: { code: 'custom'; message: string; path: (string | number)[] }) => void;
    },
  ): void => {
    const gstin = data[gstinKey];
    const pan = data[panKey];
    if (typeof gstin !== 'string' || typeof pan !== 'string') return;
    if (!isValidGSTIN(normalizeGSTIN(gstin)) || !isValidPAN(normalizePAN(pan))) return;
    if (!gstinMatchesPAN(gstin, pan)) ctx.addIssue({ code: 'custom', message, path: [gstinKey] });
  };
}

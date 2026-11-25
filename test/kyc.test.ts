import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  gstinMatchesPAN,
  gstinMatchesPANRefinement,
  isValidDrivingLicence,
  isValidPassport,
  isValidVoterID,
  normalizeDrivingLicence,
  parseDrivingLicence,
  zDrivingLicence,
  zGSTIN,
  zPAN,
  zPassport,
  zVoterID,
} from '../src/index';

// 27AAPFU0939F1ZV is the GSTIN used in GSTN's own examples; its PAN is AAPFU0939F.
const GSTIN = '27AAPFU0939F1ZV';
const PAN = 'AAPFU0939F';

describe('gstinMatchesPAN', () => {
  it('matches the PAN inside the GSTIN, after normalising both', () => {
    expect(gstinMatchesPAN(GSTIN, PAN)).toBe(true);
    expect(gstinMatchesPAN(' 27aapfu0939f1zv ', 'aapfu 0939f')).toBe(true);
  });
  it('rejects a different PAN and invalid inputs', () => {
    expect(gstinMatchesPAN(GSTIN, 'ABCPD1234E')).toBe(false);
    expect(gstinMatchesPAN('27AAPFU0939F1ZA', PAN)).toBe(false); // bad checksum
    expect(gstinMatchesPAN(GSTIN, 'AAPXU0939F')).toBe(false); // invalid PAN holder type
  });
});

describe('gstinMatchesPANRefinement', () => {
  const Business = z
    .object({ gstin: zGSTIN(), pan: zPAN() })
    .superRefine(gstinMatchesPANRefinement());

  it('passes when the GSTIN belongs to the PAN', () => {
    expect(Business.parse({ gstin: '27aapfu0939f1zv', pan: 'aapfu0939f' })).toEqual({
      gstin: GSTIN,
      pan: PAN,
    });
  });
  it('reports a mismatch on the GSTIN field', () => {
    const r = Business.safeParse({ gstin: GSTIN, pan: 'ABCPD1234E' });
    expect(r.success).toBe(false);
    expect(r.error?.issues).toHaveLength(1);
    expect(r.error?.issues[0]?.path).toEqual(['gstin']);
    expect(r.error?.issues[0]?.message).toBe('GSTIN does not belong to this PAN');
  });
  it('leaves invalid fields to their own schema, so there is no duplicate error', () => {
    const r = Business.safeParse({ gstin: GSTIN, pan: 'nope' });
    expect(r.success).toBe(false);
    expect(r.error?.issues.map((i) => i.message)).toEqual(['Invalid PAN']);
  });
  it('skips when a field is missing or not valid on its own', () => {
    const Loose = z
      .object({ gstin: z.string().optional(), pan: z.string() })
      .superRefine(gstinMatchesPANRefinement());
    expect(Loose.safeParse({ pan: PAN }).success).toBe(true);
    expect(Loose.safeParse({ gstin: 'not-a-gstin', pan: PAN }).success).toBe(true);
  });
  it('supports custom keys and message', () => {
    const S = z
      .object({ businessGstin: z.string(), ownerPan: z.string() })
      .superRefine(
        gstinMatchesPANRefinement({ gstin: 'businessGstin', pan: 'ownerPan', message: 'Mismatch' }),
      );
    const r = S.safeParse({ businessGstin: GSTIN, ownerPan: 'ABCPD1234E' });
    expect(r.error?.issues[0]).toMatchObject({ path: ['businessGstin'], message: 'Mismatch' });
    expect(S.safeParse({ businessGstin: GSTIN, ownerPan: PAN }).success).toBe(true);
  });
});

describe('passport', () => {
  it('accepts one letter and seven digits', () => {
    expect(isValidPassport('K1234567')).toBe(true);
    expect(zPassport().parse(' k123 4567 ')).toBe('K1234567');
  });
  it.each(['K123456', 'K12345678', 'KK123456', '12345678', 'k1234567'])('rejects %s', (v) => {
    expect(isValidPassport(v)).toBe(false);
  });
  it('uses its own default message', () => {
    expect(zPassport().safeParse('x').error?.issues[0]?.message).toBe('Invalid passport number');
  });
});

describe('voter ID (EPIC)', () => {
  it('accepts three letters and seven digits', () => {
    expect(isValidVoterID('ABC1234567')).toBe(true);
    expect(zVoterID().parse('abc-1234567')).toBe('ABC1234567');
  });
  it.each(['AB1234567', 'ABC123456', 'ABCD123456', '1231234567'])('rejects %s', (v) => {
    expect(isValidVoterID(v)).toBe(false);
  });
});

describe('driving licence', () => {
  it('normalises the common printed layouts', () => {
    for (const v of ['MH14 20110062821', 'MH-1420110062821', 'mh14-2011-0062821'])
      expect(normalizeDrivingLicence(v)).toBe('MH1420110062821');
    expect(zDrivingLicence().parse('HR-0619850034761')).toBe('HR0619850034761');
  });
  it('parses state, RTO, year and serial', () => {
    expect(parseDrivingLicence('UP9620110001440')).toEqual({
      stateCode: 'UP',
      rto: '96',
      year: 2011,
      serial: '0001440',
    });
  });
  it('rejects unknown states, RTO 00, impossible years, empty serials and old layouts', () => {
    expect(isValidDrivingLicence('ZZ1420110062821')).toBe(false);
    expect(isValidDrivingLicence('MH0020110062821')).toBe(false);
    expect(isValidDrivingLicence('MH1419400062821')).toBe(false);
    expect(isValidDrivingLicence('MH1420110000000')).toBe(false);
    expect(isValidDrivingLicence('MH142011006282')).toBe(false);
    expect(isValidDrivingLicence('RJ-13/DLC/12/123456')).toBe(false);
    expect(isValidDrivingLicence('MH14 20110062821')).toBe(false); // not normalised
  });
  it('rejects a year after the current one', () => {
    const now = new Date('2026-06-01T00:00:00Z');
    expect(parseDrivingLicence('MH1420260062821', { now })?.year).toBe(2026);
    expect(parseDrivingLicence('MH1420270062821', { now })).toBeUndefined();
  });
  it('accepts Telangana TG, used since 2024', () => {
    expect(isValidDrivingLicence('TG0920240012345')).toBe(true);
  });
});

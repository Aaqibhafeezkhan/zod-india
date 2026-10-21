/**
 * Offline lookups: what can be read straight out of an identifier, with no network calls.
 * (For full IFSC branch details use Razorpay's `ifsc` dataset; this only parses the code.)
 */

/** State / UT names for vehicle registration prefixes (legacy codes included). */
export const VEHICLE_STATES: Readonly<Record<string, string>> = Object.freeze({
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  CH: 'Chandigarh',
  DD: 'Daman and Diu',
  DL: 'Delhi',
  DN: 'Dadra and Nagar Haveli',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu and Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  OR: 'Odisha (legacy)',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TR: 'Tripura',
  TS: 'Telangana',
  UK: 'Uttarakhand',
  UA: 'Uttarakhand (legacy)',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
});

export interface VehicleInfo {
  series: 'state' | 'BH';
  /** Two-letter prefix for state series, `undefined` for BH series. */
  stateCode?: string;
  state?: string;
  /** RTO number for state series (e.g. `'01'`), year of registration for BH series (e.g. `'22'`). */
  rto?: string;
  year?: string;
}

/** Read state and RTO (or BH-series year) from a vehicle number. Returns `undefined` if it does not parse. */
export function parseVehicleNumber(value: string): VehicleInfo | undefined {
  const v = value.replace(/[\s-]+/g, '').toUpperCase();
  const bh = /^(\d{2})BH\d{4}[A-HJ-NP-Z]{1,2}$/.exec(v);
  if (bh) return { series: 'BH', year: bh[1] as string };
  const m = /^([A-Z]{2})(\d{1,2})[A-Z]{0,3}\d{1,4}$/.exec(v);
  const code = m?.[1] as string;
  if (!m || !(code in VEHICLE_STATES) || Number(m[2]) === 0) return undefined;
  return {
    series: 'state',
    stateCode: code,
    state: VEHICLE_STATES[code] as string,
    rto: (m[2] as string).padStart(2, '0'),
  };
}

/** India Post zones keyed by the first PIN digit. */
export const PIN_ZONES: Readonly<Record<string, { zone: string; regions: readonly string[] }>> =
  Object.freeze({
    '1': {
      zone: 'Northern',
      regions: [
        'Delhi',
        'Haryana',
        'Punjab',
        'Himachal Pradesh',
        'Jammu and Kashmir',
        'Ladakh',
        'Chandigarh',
      ],
    },
    '2': { zone: 'Northern', regions: ['Uttar Pradesh', 'Uttarakhand'] },
    '3': {
      zone: 'Western',
      regions: ['Rajasthan', 'Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'],
    },
    '4': { zone: 'Western', regions: ['Maharashtra', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'] },
    '5': { zone: 'Southern', regions: ['Andhra Pradesh', 'Telangana', 'Karnataka'] },
    '6': { zone: 'Southern', regions: ['Tamil Nadu', 'Kerala', 'Puducherry', 'Lakshadweep'] },
    '7': {
      zone: 'Eastern',
      regions: [
        'West Bengal',
        'Odisha',
        'Assam',
        'Sikkim',
        'Arunachal Pradesh',
        'Nagaland',
        'Manipur',
        'Mizoram',
        'Tripura',
        'Meghalaya',
        'Andaman and Nicobar Islands',
      ],
    },
    '8': { zone: 'Eastern', regions: ['Bihar', 'Jharkhand'] },
    '9': { zone: 'Army Postal Service', regions: ['Army Postal Service'] },
  });

/** Postal zone and candidate states/UTs for a PIN code (from its first digit). */
export function pincodeZone(
  value: string,
): { zone: string; regions: readonly string[] } | undefined {
  const v = value.replace(/\s+/g, '');
  if (!/^[1-9]\d{5}$/.test(v)) return undefined;
  return PIN_ZONES[v.charAt(0)];
}

/** Split an IFSC into bank code and branch code: `HDFC0001234` → `{ bank: 'HDFC', branch: '001234' }`. */
export function parseIFSC(value: string): { bank: string; branch: string } | undefined {
  const v = value.replace(/[\s-]+/g, '').toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)) return undefined;
  return { bank: v.slice(0, 4), branch: v.slice(5) };
}

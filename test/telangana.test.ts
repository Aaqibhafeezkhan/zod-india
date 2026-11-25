import { describe, expect, it } from 'vitest';
import { isValidVehicleNumber, parseVehicleNumber } from '../src/index';

describe('Telangana TG (MoRTH S.O. 1306(E), 12 March 2024)', () => {
  it('accepts TG plates and still accepts older TS plates', () => {
    expect(isValidVehicleNumber('TG09AB1234')).toBe(true);
    expect(isValidVehicleNumber('TS09AB1234')).toBe(true);
    expect(parseVehicleNumber('TG09AB1234')?.state).toBe('Telangana');
  });
});

import { describe, expect, it } from 'vitest';
import { rupeesInHindiWords, toHindiWords } from '../src/hindi';

describe('zod-india/hindi', () => {
  it('writes numbers in Hindi words', () => {
    expect(toHindiWords(0)).toBe('शून्य');
    expect(toHindiWords(5)).toBe('पाँच');
    expect(toHindiWords(15)).toBe('पंद्रह');
    expect(toHindiWords(99)).toBe('निन्यानवे');
    expect(toHindiWords(100)).toBe('एक सौ');
    expect(toHindiWords(101)).toBe('एक सौ एक');
    expect(toHindiWords(110000)).toBe('एक लाख दस हज़ार');
    expect([31, 79, 95].map(toHindiWords)).toEqual(['इकत्तीस', 'उनासी', 'पचानवे']);
    expect(toHindiWords(1000)).toBe('एक हज़ार');
    expect(toHindiWords(12345678)).toBe('एक करोड़ तेईस लाख पैंतालीस हज़ार छह सौ अठहत्तर');
    expect(toHindiWords(1e12)).toBe('एक लाख करोड़');
    expect(toHindiWords(-20000000)).toBe('ऋण दो करोड़');
    expect(() => toHindiWords(1.5)).toThrow(TypeError);
    const table = Array.from({ length: 99 }, (_, i) => toHindiWords(i + 1));
    expect(table.every(Boolean)).toBe(true);
    expect(new Set(table).size).toBe(99);
  });
  it('writes rupees in Hindi words', () => {
    expect(rupeesInHindiWords(0)).toBe('शून्य रुपये');
    expect(rupeesInHindiWords(1250.5)).toBe('एक हज़ार दो सौ पचास रुपये और पचास पैसे');
    expect(rupeesInHindiWords(100000)).toBe('एक लाख रुपये');
    expect(rupeesInHindiWords(0.75)).toBe('शून्य रुपये और पचहत्तर पैसे');
    expect(() => rupeesInHindiWords(-1)).toThrow(TypeError);
    expect(() => rupeesInHindiWords(NaN)).toThrow(TypeError);
  });
});

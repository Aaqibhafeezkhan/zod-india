/**
 * Hindi number words for `toIndianWords` / `rupeesInWords` with `{ lang: 'hi' }`.
 * Formal spellings with nukta and chandrabindu (हज़ार, पाँच), as used on invoices.
 */

/**
 * 1-99 in Hindi (index 0 is unused). Each form is irregular, so a full table is needed.
 * Forms follow McGregor, Outline of Hindi Grammar (2nd ed.), pp. 61-62.
 */
const HI_BELOW_100 = [
  '',
  'एक',
  'दो',
  'तीन',
  'चार',
  'पाँच',
  'छह',
  'सात',
  'आठ',
  'नौ',
  'दस',
  'ग्यारह',
  'बारह',
  'तेरह',
  'चौदह',
  'पंद्रह',
  'सोलह',
  'सत्रह',
  'अठारह',
  'उन्नीस',
  'बीस',
  'इक्कीस',
  'बाईस',
  'तेईस',
  'चौबीस',
  'पच्चीस',
  'छब्बीस',
  'सत्ताईस',
  'अट्ठाईस',
  'उनतीस',
  'तीस',
  'इकत्तीस',
  'बत्तीस',
  'तैंतीस',
  'चौंतीस',
  'पैंतीस',
  'छत्तीस',
  'सैंतीस',
  'अड़तीस',
  'उनतालीस',
  'चालीस',
  'इकतालीस',
  'बयालीस',
  'तैंतालीस',
  'चवालीस',
  'पैंतालीस',
  'छियालीस',
  'सैंतालीस',
  'अड़तालीस',
  'उनचास',
  'पचास',
  'इक्यावन',
  'बावन',
  'तिरपन',
  'चौवन',
  'पचपन',
  'छप्पन',
  'सत्तावन',
  'अट्ठावन',
  'उनसठ',
  'साठ',
  'इकसठ',
  'बासठ',
  'तिरसठ',
  'चौंसठ',
  'पैंसठ',
  'छियासठ',
  'सड़सठ',
  'अड़सठ',
  'उनहत्तर',
  'सत्तर',
  'इकहत्तर',
  'बहत्तर',
  'तिहत्तर',
  'चौहत्तर',
  'पचहत्तर',
  'छिहत्तर',
  'सतहत्तर',
  'अठहत्तर',
  'उनासी',
  'अस्सी',
  'इक्यासी',
  'बयासी',
  'तिरासी',
  'चौरासी',
  'पचासी',
  'छियासी',
  'सत्तासी',
  'अट्ठासी',
  'नवासी',
  'नब्बे',
  'इक्यानवे',
  'बानवे',
  'तिरानवे',
  'चौरानवे',
  'पचानवे',
  'छियानवे',
  'सत्तानवे',
  'अट्ठानवे',
  'निन्यानवे',
];

export const hiBelow100 = (n: number): string => HI_BELOW_100[n] as string;

const below1000 = (n: number): string => {
  const h = Math.floor(n / 100);
  const r = n % 100;
  return [h ? `${hiBelow100(h)} सौ` : '', r ? hiBelow100(r) : ''].filter(Boolean).join(' ');
};

/** Positive integer to Hindi words with Indian grouping (same structure as the English path). */
export function hindiWords(n: number): string {
  if (n >= 1e7) {
    const rest = n % 1e7;
    return `${hindiWords(Math.floor(n / 1e7))} करोड़${rest ? ` ${hindiWords(rest)}` : ''}`;
  }
  const parts: string[] = [];
  const lakh = Math.floor(n / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1e3;
  if (lakh) parts.push(`${hiBelow100(lakh)} लाख`);
  if (thousand) parts.push(`${hiBelow100(thousand)} हज़ार`);
  if (rest) parts.push(below1000(rest));
  return parts.join(' ');
}

/**
 * Malaysian Mental Health Emergency Hotlines
 * These are displayed prominently throughout the app,
 * especially during crisis situations.
 */

export interface Hotline {
  name: string;
  nameMs: string;
  number: string;
  description: string;
  descriptionMs: string;
  available: string;
  availableMs: string;
  priority: number;
}

export const MALAYSIA_HOTLINES: Hotline[] = [
  {
    name: 'Talian Kasih',
    nameMs: 'Talian Kasih',
    number: '15999',
    description: 'Government helpline for crisis support',
    descriptionMs: 'Talian bantuan kerajaan untuk sokongan krisis',
    available: '24 hours, 7 days',
    availableMs: '24 jam, 7 hari',
    priority: 1,
  },
  {
    name: 'Befrienders KL',
    nameMs: 'Befrienders KL',
    number: '03-7956 8145',
    description: 'Emotional support and suicide prevention',
    descriptionMs: 'Sokongan emosi dan pencegahan bunuh diri',
    available: '24 hours, 7 days',
    availableMs: '24 jam, 7 hari',
    priority: 2,
  },
  {
    name: 'Emergency Services',
    nameMs: 'Perkhidmatan Kecemasan',
    number: '999',
    description: 'For immediate emergencies',
    descriptionMs: 'Untuk kecemasan segera',
    available: '24 hours, 7 days',
    availableMs: '24 jam, 7 hari',
    priority: 3,
  },
  {
    name: 'MIASA Crisis Line',
    nameMs: 'Talian Krisis MIASA',
    number: '03-7932 1740',
    description: 'Mental Illness Awareness & Support Association',
    descriptionMs: 'Persatuan Kesedaran & Sokongan Penyakit Mental',
    available: 'Mon-Fri, 9am-5pm',
    availableMs: 'Isnin-Jumaat, 9pg-5ptg',
    priority: 4,
  },
];

export const EMERGENCY_DISCLAIMER = {
  en: 'If you are in a life threatening situation or any other person may be in danger, do not use this site. Call the free, 24-hour hotlines: Talian Kasih at 15999 or Befrienders at 03-7956 8145 for immediate help. If you are in an emergency, call 999 or go to your nearest hospital.',
  ms: 'Jika anda dalam keadaan mengancam nyawa atau mana-mana orang lain mungkin dalam bahaya, jangan gunakan laman ini. Hubungi talian percuma 24 jam: Talian Kasih di 15999 atau Befrienders di 03-7956 8145 untuk bantuan segera. Jika anda dalam kecemasan, hubungi 999 atau pergi ke hospital terdekat.',
};

export const SCREENING_DISCLAIMER = {
  en: 'This screening is not a diagnosis. Only a licensed professional can provide a complete assessment. This is simply an initial step to help you understand your mental well-being better.',
  ms: 'Saringan ini bukan diagnosis. Hanya profesional berlesen boleh memberikan penilaian lengkap. Ini hanyalah langkah awal untuk membantu anda memahami kesejahteraan mental anda dengan lebih baik.',
};

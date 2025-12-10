import type { AssessmentType, RiskLevel } from '@/types/assessment';

// ============================================
// Initial Screening Questions
// Based on the PDF flow - quick yes/no questions
// ============================================

export interface InitialScreeningQuestion {
  id: string;
  text: string;
  textMs: string;
  category: AssessmentType | 'general';
  triggerCondition?: AssessmentType;
  triageRisk?: RiskLevel;
  triageReason?: string;
}

export const INITIAL_SCREENING_QUESTIONS: InitialScreeningQuestion[] = [
  // Sleep / Insomnia
  {
    id: 'sleep_wake_easily',
    text: 'Have you easily woken up from your sleep?',
    textMs: 'Adakah anda mudah terjaga dari tidur?',
    category: 'insomnia',
    triggerCondition: 'insomnia',
  },
  // Suicidal Ideation - CRITICAL
  {
    id: 'thoughts_death_dying',
    text: 'Have you ever thought of death or dying recently?',
    textMs: 'Pernahkah anda terfikir tentang kematian atau mati baru-baru ini?',
    category: 'suicidal',
    triggerCondition: 'suicidal',
    triageRisk: 'high',
    triageReason: 'User indicated thoughts of death or dying',
  },
  // Psychosis
  {
    id: 'hearing_voices',
    text: 'Do you frequently hear voices which no one else could hear them?',
    textMs: 'Adakah anda kerap mendengar suara yang orang lain tidak dapat dengar?',
    category: 'psychosis',
    triggerCondition: 'psychosis',
    triageRisk: 'high',
    triageReason: 'User indicated hearing voices others cannot hear',
  },
  // Sexual Addiction
  {
    id: 'sexual_fantasy',
    text: 'Have you been spending a lot of time fantasizing and fulfilling your sexual fantasy, urges and planning to involve in sexual related behaviour?',
    textMs: 'Adakah anda menghabiskan banyak masa untuk berkhayal dan memenuhi fantasi seksual, desakan dan merancang untuk terlibat dalam tingkah laku berkaitan seksual?',
    category: 'sexual_addiction',
    triggerCondition: 'sexual_addiction',
  },
  // Psychosis - Grandiosity
  {
    id: 'extraordinary_powers',
    text: 'Do you believe yourself to have extraordinary, gifts and power?',
    textMs: 'Adakah anda percaya diri anda mempunyai bakat dan kuasa luar biasa?',
    category: 'psychosis',
    triggerCondition: 'psychosis',
    triageRisk: 'high',
    triageReason: 'User indicated belief in extraordinary powers',
  },
  // Suicidal - CRITICAL - IMMINENT
  {
    id: 'ending_life',
    text: 'Have you ever thought about ending your life?',
    textMs: 'Pernahkah anda terfikir untuk menamatkan nyawa anda?',
    category: 'suicidal',
    triggerCondition: 'suicidal',
    triageRisk: 'imminent',
    triageReason: 'User indicated thoughts of ending life',
  },
  // Depression - Anhedonia
  {
    id: 'loss_interest',
    text: 'Have you lost interest or pleasure in doing things you used to enjoy?',
    textMs: 'Adakah anda kehilangan minat atau keseronokan dalam melakukan perkara yang anda biasa nikmati?',
    category: 'depression',
    triggerCondition: 'depression',
  },
  // Anxiety
  {
    id: 'excessive_worry',
    text: 'Do you feel excessive worry or anxiety that is difficult to control?',
    textMs: 'Adakah anda berasa bimbang atau cemas yang berlebihan yang sukar dikawal?',
    category: 'anxiety',
    triggerCondition: 'anxiety',
  },
  // OCD
  {
    id: 'repetitive_thoughts',
    text: 'Do you have repetitive, unwanted thoughts that cause you distress?',
    textMs: 'Adakah anda mempunyai fikiran berulang yang tidak diingini yang menyebabkan anda tertekan?',
    category: 'ocd',
    triggerCondition: 'ocd',
  },
  // PTSD
  {
    id: 'traumatic_memories',
    text: 'Do you experience distressing memories or flashbacks of a traumatic event?',
    textMs: 'Adakah anda mengalami kenangan atau imbasan kembali yang menyedihkan tentang peristiwa traumatik?',
    category: 'ptsd',
    triggerCondition: 'ptsd',
  },
  // Marital Distress
  {
    id: 'relationship_conflict',
    text: 'Are you experiencing significant conflict or distress in your marriage or relationship?',
    textMs: 'Adakah anda mengalami konflik atau tekanan yang ketara dalam perkahwinan atau hubungan anda?',
    category: 'marital_distress',
    triggerCondition: 'marital_distress',
  },
];

// ============================================
// Social Function Questions
// 8 questions with Likert scale (0-4)
// ============================================

export interface SocialFunctionQuestion {
  id: string;
  text: string;
  textMs: string;
  category: string;
}

export const SOCIAL_FUNCTION_QUESTIONS: SocialFunctionQuestion[] = [
  {
    id: 'personal_hygiene',
    text: 'I am able to maintain good personal hygiene and daily routines',
    textMs: 'Saya dapat mengekalkan kebersihan diri dan rutin harian yang baik',
    category: 'self_care',
  },
  {
    id: 'emotion_management',
    text: 'I am able to manage my emotions and stress without feeling overwhelmed',
    textMs: 'Saya dapat mengurus emosi dan tekanan saya tanpa berasa terbeban',
    category: 'emotional',
  },
  {
    id: 'relationships',
    text: 'I have good relationships with my family and friends',
    textMs: 'Saya mempunyai hubungan yang baik dengan keluarga dan rakan-rakan saya',
    category: 'social',
  },
  {
    id: 'social_activities',
    text: 'I feel comfortable and engage in social activities',
    textMs: 'Saya berasa selesa dan terlibat dalam aktiviti sosial',
    category: 'social',
  },
  {
    id: 'work_focus',
    text: 'I am able to focus and complete work tasks well',
    textMs: 'Saya dapat memberi tumpuan dan menyelesaikan tugas kerja dengan baik',
    category: 'occupational',
  },
  {
    id: 'daily_motivation',
    text: 'I feel motivated to carry out my daily responsibilities',
    textMs: 'Saya berasa bermotivasi untuk melaksanakan tanggungjawab harian saya',
    category: 'motivation',
  },
  {
    id: 'community_involvement',
    text: 'I am involved in community activities or help others',
    textMs: 'Saya terlibat dalam aktiviti komuniti atau membantu orang lain',
    category: 'community',
  },
  {
    id: 'life_meaning',
    text: 'I feel that my life gives meaning and benefits to those around me',
    textMs: 'Saya merasakan hidup saya memberi makna dan manfaat kepada orang di sekeliling saya',
    category: 'purpose',
  },
];

export const LIKERT_OPTIONS = [
  { value: 0, label: 'Strongly Disagree', labelMs: 'Sangat Tidak Setuju' },
  { value: 1, label: '1', labelMs: '1' },
  { value: 2, label: '2', labelMs: '2' },
  { value: 3, label: '3', labelMs: '3' },
  { value: 4, label: 'Strongly Agree', labelMs: 'Sangat Setuju' },
];

// ============================================
// Demographics Options
// ============================================

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', labelMs: 'Lelaki' },
  { value: 'female', label: 'Female', labelMs: 'Perempuan' },
  { value: 'other', label: 'Other', labelMs: 'Lain-lain' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', labelMs: 'Tidak mahu menyatakan' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single', labelMs: 'Bujang' },
  { value: 'married', label: 'Married', labelMs: 'Berkahwin' },
  { value: 'divorced', label: 'Divorced', labelMs: 'Bercerai' },
  { value: 'widowed', label: 'Widowed', labelMs: 'Balu/Duda' },
  { value: 'separated', label: 'Separated', labelMs: 'Berpisah' },
];

export const EDUCATION_OPTIONS = [
  { value: 'primary', label: 'Primary School', labelMs: 'Sekolah Rendah' },
  { value: 'secondary', label: 'Secondary School', labelMs: 'Sekolah Menengah' },
  { value: 'diploma', label: 'Diploma', labelMs: 'Diploma' },
  { value: 'degree', label: "Bachelor's Degree", labelMs: 'Ijazah Sarjana Muda' },
  { value: 'masters', label: "Master's Degree", labelMs: 'Ijazah Sarjana' },
  { value: 'phd', label: 'PhD', labelMs: 'PhD' },
  { value: 'other', label: 'Other', labelMs: 'Lain-lain' },
];

export const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam', labelMs: 'Islam' },
  { value: 'buddhism', label: 'Buddhism', labelMs: 'Buddha' },
  { value: 'christianity', label: 'Christianity', labelMs: 'Kristian' },
  { value: 'hinduism', label: 'Hinduism', labelMs: 'Hindu' },
  { value: 'sikhism', label: 'Sikhism', labelMs: 'Sikh' },
  { value: 'other', label: 'Other', labelMs: 'Lain-lain' },
  { value: 'none', label: 'No religion', labelMs: 'Tiada agama' },
];

export const NATIONALITY_OPTIONS = [
  { value: 'malaysian', label: 'Malaysian', labelMs: 'Warganegara Malaysia' },
  { value: 'other', label: 'Other', labelMs: 'Lain-lain' },
];

import type { AssessmentType } from '@/types/assessment';

/**
 * Validated Assessment Instruments
 * These are standardized mental health screening tools
 */

export interface InstrumentQuestion {
  id: string;
  text: string;
  textMs: string;
}

export interface AssessmentInstrument {
  type: AssessmentType;
  name: string;
  nameMs: string;
  description: string;
  descriptionMs: string;
  questions: InstrumentQuestion[];
  scaleType: 'frequency' | 'severity' | 'agreement' | 'yesno';
  scaleOptions: { value: number; label: string; labelMs: string }[];
  scoring: {
    ranges: { min: number; max: number; severity: string; severityMs: string }[];
    maxScore: number;
  };
  timeframe: string;
  timeframeMs: string;
  isPremium: boolean;
}

// PHQ-9 Response Options (0-3 scale)
const PHQ_SCALE = [
  { value: 0, label: 'Not at all', labelMs: 'Tidak langsung' },
  { value: 1, label: 'Several days', labelMs: 'Beberapa hari' },
  { value: 2, label: 'More than half the days', labelMs: 'Lebih separuh hari' },
  { value: 3, label: 'Nearly every day', labelMs: 'Hampir setiap hari' },
];

// GAD-7 uses same scale as PHQ-9
const GAD_SCALE = PHQ_SCALE;

// ISI Response Options (0-4 scale)
const ISI_SCALE = [
  { value: 0, label: 'None', labelMs: 'Tiada' },
  { value: 1, label: 'Mild', labelMs: 'Ringan' },
  { value: 2, label: 'Moderate', labelMs: 'Sederhana' },
  { value: 3, label: 'Severe', labelMs: 'Teruk' },
  { value: 4, label: 'Very Severe', labelMs: 'Sangat Teruk' },
];

export const ASSESSMENT_INSTRUMENTS: Record<AssessmentType, AssessmentInstrument> = {
  depression: {
    type: 'depression',
    name: 'Patient Health Questionnaire (PHQ-9)',
    nameMs: 'Soal Selidik Kesihatan Pesakit (PHQ-9)',
    description: 'A validated 9-question instrument for screening and measuring the severity of depression.',
    descriptionMs: 'Instrumen 9 soalan yang disahkan untuk saringan dan mengukur keterukan kemurungan.',
    questions: [
      {
        id: 'phq9_1',
        text: 'Little interest or pleasure in doing things',
        textMs: 'Kurang minat atau keseronokan dalam melakukan perkara',
      },
      {
        id: 'phq9_2',
        text: 'Feeling down, depressed, or hopeless',
        textMs: 'Berasa sedih, murung, atau tiada harapan',
      },
      {
        id: 'phq9_3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        textMs: 'Susah tidur atau terus tidur, atau tidur terlalu banyak',
      },
      {
        id: 'phq9_4',
        text: 'Feeling tired or having little energy',
        textMs: 'Berasa letih atau kurang tenaga',
      },
      {
        id: 'phq9_5',
        text: 'Poor appetite or overeating',
        textMs: 'Kurang selera makan atau makan berlebihan',
      },
      {
        id: 'phq9_6',
        text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
        textMs: 'Berasa buruk tentang diri sendiri - atau anda gagal atau mengecewakan diri sendiri atau keluarga',
      },
      {
        id: 'phq9_7',
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
        textMs: 'Susah menumpukan perhatian pada perkara, seperti membaca surat khabar atau menonton televisyen',
      },
      {
        id: 'phq9_8',
        text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
        textMs: 'Bergerak atau bercakap dengan perlahan sehingga orang lain perasan. Atau sebaliknya - begitu gelisah sehingga anda bergerak lebih dari biasa',
      },
      {
        id: 'phq9_9',
        text: 'Thoughts that you would be better off dead, or of hurting yourself',
        textMs: 'Fikiran bahawa anda lebih baik mati, atau menyakiti diri sendiri',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal/None', severityMs: 'Minimum/Tiada' },
        { min: 5, max: 9, severity: 'Mild', severityMs: 'Ringan' },
        { min: 10, max: 14, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 15, max: 19, severity: 'Moderately Severe', severityMs: 'Sederhana Teruk' },
        { min: 20, max: 27, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 27,
    },
    timeframe: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    timeframeMs: 'Dalam 2 minggu yang lepas, berapa kerap anda terganggu oleh mana-mana masalah berikut?',
    isPremium: false,
  },

  anxiety: {
    type: 'anxiety',
    name: 'Generalized Anxiety Disorder (GAD-7)',
    nameMs: 'Gangguan Kebimbangan Umum (GAD-7)',
    description: 'A validated 7-question screening tool for generalized anxiety disorder.',
    descriptionMs: 'Alat saringan 7 soalan yang disahkan untuk gangguan kebimbangan umum.',
    questions: [
      {
        id: 'gad7_1',
        text: 'Feeling nervous, anxious, or on edge',
        textMs: 'Berasa gementar, cemas, atau tegang',
      },
      {
        id: 'gad7_2',
        text: 'Not being able to stop or control worrying',
        textMs: 'Tidak dapat berhenti atau mengawal kebimbangan',
      },
      {
        id: 'gad7_3',
        text: 'Worrying too much about different things',
        textMs: 'Terlalu risau tentang pelbagai perkara',
      },
      {
        id: 'gad7_4',
        text: 'Trouble relaxing',
        textMs: 'Susah untuk berehat',
      },
      {
        id: 'gad7_5',
        text: 'Being so restless that it is hard to sit still',
        textMs: 'Begitu gelisah sehingga susah untuk duduk diam',
      },
      {
        id: 'gad7_6',
        text: 'Becoming easily annoyed or irritable',
        textMs: 'Mudah terganggu atau cepat marah',
      },
      {
        id: 'gad7_7',
        text: 'Feeling afraid, as if something awful might happen',
        textMs: 'Berasa takut, seolah-olah sesuatu yang buruk mungkin berlaku',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: GAD_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 5, max: 9, severity: 'Mild', severityMs: 'Ringan' },
        { min: 10, max: 14, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 15, max: 21, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 21,
    },
    timeframe: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    timeframeMs: 'Dalam 2 minggu yang lepas, berapa kerap anda terganggu oleh mana-mana masalah berikut?',
    isPremium: false,
  },

  insomnia: {
    type: 'insomnia',
    name: 'Insomnia Severity Index (ISI)',
    nameMs: 'Indeks Keterukan Insomnia (ISI)',
    description: 'A 7-question instrument to assess the nature, severity, and impact of insomnia.',
    descriptionMs: 'Instrumen 7 soalan untuk menilai sifat, keterukan, dan kesan insomnia.',
    questions: [
      {
        id: 'isi_1',
        text: 'Difficulty falling asleep',
        textMs: 'Kesukaran untuk tidur',
      },
      {
        id: 'isi_2',
        text: 'Difficulty staying asleep',
        textMs: 'Kesukaran untuk terus tidur',
      },
      {
        id: 'isi_3',
        text: 'Problems waking up too early',
        textMs: 'Masalah terjaga terlalu awal',
      },
      {
        id: 'isi_4',
        text: 'How satisfied/dissatisfied are you with your current sleep pattern?',
        textMs: 'Sejauh mana anda berpuas hati/tidak berpuas hati dengan corak tidur semasa anda?',
      },
      {
        id: 'isi_5',
        text: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?',
        textMs: 'Sejauh mana anda fikir masalah tidur anda ketara kepada orang lain dari segi menjejaskan kualiti hidup anda?',
      },
      {
        id: 'isi_6',
        text: 'How worried/distressed are you about your current sleep problem?',
        textMs: 'Sejauh mana anda bimbang/tertekan tentang masalah tidur semasa anda?',
      },
      {
        id: 'isi_7',
        text: 'To what extent do you consider your sleep problem to interfere with your daily functioning?',
        textMs: 'Sejauh mana anda anggap masalah tidur anda mengganggu fungsi harian anda?',
      },
    ],
    scaleType: 'severity',
    scaleOptions: ISI_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 7, severity: 'No clinically significant insomnia', severityMs: 'Tiada insomnia yang signifikan secara klinikal' },
        { min: 8, max: 14, severity: 'Subthreshold insomnia', severityMs: 'Insomnia subambang' },
        { min: 15, max: 21, severity: 'Clinical insomnia (moderate severity)', severityMs: 'Insomnia klinikal (keterukan sederhana)' },
        { min: 22, max: 28, severity: 'Clinical insomnia (severe)', severityMs: 'Insomnia klinikal (teruk)' },
      ],
      maxScore: 28,
    },
    timeframe: 'Please rate the current (i.e., last 2 weeks) severity of your insomnia problem(s).',
    timeframeMs: 'Sila nilai keterukan semasa (iaitu 2 minggu lepas) masalah insomnia anda.',
    isPremium: true,
  },

  ocd: {
    type: 'ocd',
    name: 'OCD Screening Questionnaire',
    nameMs: 'Soal Selidik Saringan OCD',
    description: 'A screening tool to identify potential obsessive-compulsive symptoms.',
    descriptionMs: 'Alat saringan untuk mengenal pasti gejala obsesif-kompulsif yang berpotensi.',
    questions: [
      {
        id: 'ocd_1',
        text: 'Do you have unwanted thoughts, images, or urges that repeatedly enter your mind?',
        textMs: 'Adakah anda mempunyai fikiran, imej, atau desakan yang tidak diingini yang berulang kali memasuki fikiran anda?',
      },
      {
        id: 'ocd_2',
        text: 'Do you wash or clean a lot?',
        textMs: 'Adakah anda membasuh atau membersihkan dengan banyak?',
      },
      {
        id: 'ocd_3',
        text: 'Do you check things a lot?',
        textMs: 'Adakah anda menyemak perkara dengan banyak?',
      },
      {
        id: 'ocd_4',
        text: 'Is there any activity that you must do over and over again?',
        textMs: 'Adakah sebarang aktiviti yang anda mesti lakukan berulang kali?',
      },
      {
        id: 'ocd_5',
        text: 'Do you worry excessively about contamination or germs?',
        textMs: 'Adakah anda bimbang secara berlebihan tentang pencemaran atau kuman?',
      },
      {
        id: 'ocd_6',
        text: 'Do you have thoughts of harming yourself or others that you do not want?',
        textMs: 'Adakah anda mempunyai fikiran untuk mencederakan diri sendiri atau orang lain yang anda tidak mahu?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 5, max: 8, severity: 'Mild', severityMs: 'Ringan' },
        { min: 9, max: 13, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 14, max: 18, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 18,
    },
    timeframe: 'Over the past month, how often have you experienced the following?',
    timeframeMs: 'Dalam sebulan yang lepas, berapa kerap anda mengalami perkara berikut?',
    isPremium: true,
  },

  ptsd: {
    type: 'ptsd',
    name: 'PTSD Screening (PC-PTSD-5)',
    nameMs: 'Saringan PTSD (PC-PTSD-5)',
    description: 'A brief screening tool for post-traumatic stress disorder.',
    descriptionMs: 'Alat saringan ringkas untuk gangguan tekanan selepas trauma.',
    questions: [
      {
        id: 'ptsd_1',
        text: 'Had nightmares about the event(s) or thought about the event(s) when you did not want to?',
        textMs: 'Mempunyai mimpi ngeri tentang peristiwa tersebut atau memikirkan peristiwa tersebut bila anda tidak mahu?',
      },
      {
        id: 'ptsd_2',
        text: 'Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?',
        textMs: 'Cuba keras untuk tidak memikirkan peristiwa tersebut atau mengelak situasi yang mengingatkan anda tentang peristiwa tersebut?',
      },
      {
        id: 'ptsd_3',
        text: 'Been constantly on guard, watchful, or easily startled?',
        textMs: 'Sentiasa berjaga-jaga, waspada, atau mudah terkejut?',
      },
      {
        id: 'ptsd_4',
        text: 'Felt numb or detached from people, activities, or your surroundings?',
        textMs: 'Berasa kebas atau terasing daripada orang, aktiviti, atau persekitaran anda?',
      },
      {
        id: 'ptsd_5',
        text: 'Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?',
        textMs: 'Berasa bersalah atau tidak dapat berhenti menyalahkan diri sendiri atau orang lain untuk peristiwa tersebut atau sebarang masalah yang mungkin disebabkan?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 5, max: 8, severity: 'Mild', severityMs: 'Ringan' },
        { min: 9, max: 11, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 12, max: 15, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 15,
    },
    timeframe: 'In the past month, have you...',
    timeframeMs: 'Dalam sebulan yang lepas, adakah anda...',
    isPremium: true,
  },

  suicidal: {
    type: 'suicidal',
    name: 'Suicidal Ideation Assessment',
    nameMs: 'Penilaian Pemikiran Bunuh Diri',
    description: 'A careful assessment of suicidal thoughts and safety. This is always accompanied by crisis resources.',
    descriptionMs: 'Penilaian berhati-hati tentang pemikiran bunuh diri dan keselamatan. Ini sentiasa disertakan dengan sumber krisis.',
    questions: [
      {
        id: 'sui_1',
        text: 'Have you wished you were dead or wished you could go to sleep and not wake up?',
        textMs: 'Adakah anda berharap anda mati atau berharap anda boleh tidur dan tidak bangun?',
      },
      {
        id: 'sui_2',
        text: 'Have you actually had any thoughts of killing yourself?',
        textMs: 'Adakah anda sebenarnya mempunyai fikiran untuk membunuh diri?',
      },
      {
        id: 'sui_3',
        text: 'Have you been thinking about how you might do this?',
        textMs: 'Adakah anda memikirkan bagaimana anda mungkin melakukan ini?',
      },
      {
        id: 'sui_4',
        text: 'Have you had these thoughts and had some intention of acting on them?',
        textMs: 'Adakah anda mempunyai fikiran ini dan mempunyai niat untuk bertindak ke atasnya?',
      },
      {
        id: 'sui_5',
        text: 'Have you started to work out or worked out the details of how to kill yourself?',
        textMs: 'Adakah anda mula merancang atau telah merancang butiran bagaimana untuk membunuh diri?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 2, severity: 'Low Risk', severityMs: 'Risiko Rendah' },
        { min: 3, max: 6, severity: 'Moderate Risk', severityMs: 'Risiko Sederhana' },
        { min: 7, max: 10, severity: 'High Risk', severityMs: 'Risiko Tinggi' },
        { min: 11, max: 15, severity: 'Imminent Risk', severityMs: 'Risiko Segera' },
      ],
      maxScore: 15,
    },
    timeframe: 'In the past month...',
    timeframeMs: 'Dalam sebulan yang lepas...',
    isPremium: false,
  },

  psychosis: {
    type: 'psychosis',
    name: 'Psychosis Screening',
    nameMs: 'Saringan Psikosis',
    description: 'A screening tool for early signs of psychotic symptoms.',
    descriptionMs: 'Alat saringan untuk tanda-tanda awal gejala psikotik.',
    questions: [
      {
        id: 'psy_1',
        text: 'Do you sometimes feel that people are talking about you or taking special notice of you?',
        textMs: 'Adakah anda kadang-kadang berasa orang sedang bercakap tentang anda atau memberi perhatian khusus kepada anda?',
      },
      {
        id: 'psy_2',
        text: 'Do you sometimes feel that you are being watched or followed?',
        textMs: 'Adakah anda kadang-kadang berasa anda sedang diperhatikan atau diikuti?',
      },
      {
        id: 'psy_3',
        text: 'Have you had experiences with telepathy, psychic forces, or fortune telling?',
        textMs: 'Adakah anda mempunyai pengalaman dengan telepati, kuasa psikik, atau ramalan nasib?',
      },
      {
        id: 'psy_4',
        text: 'Do you hear voices that others cannot hear?',
        textMs: 'Adakah anda mendengar suara yang orang lain tidak dapat dengar?',
      },
      {
        id: 'psy_5',
        text: 'Do you sometimes see things that others cannot see?',
        textMs: 'Adakah anda kadang-kadang melihat perkara yang orang lain tidak dapat lihat?',
      },
      {
        id: 'psy_6',
        text: 'Do you feel you have special powers or abilities?',
        textMs: 'Adakah anda berasa anda mempunyai kuasa atau kebolehan istimewa?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 3, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 4, max: 8, severity: 'Mild', severityMs: 'Ringan' },
        { min: 9, max: 13, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 14, max: 18, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 18,
    },
    timeframe: 'Please indicate how often you have experienced the following in the past year:',
    timeframeMs: 'Sila nyatakan berapa kerap anda mengalami perkara berikut dalam setahun yang lepas:',
    isPremium: true,
  },

  sexual_addiction: {
    type: 'sexual_addiction',
    name: 'Sexual Behavior Screening',
    nameMs: 'Saringan Tingkah Laku Seksual',
    description: 'A screening tool to assess problematic sexual behaviors.',
    descriptionMs: 'Alat saringan untuk menilai tingkah laku seksual yang bermasalah.',
    questions: [
      {
        id: 'sex_1',
        text: 'Do you often find yourself preoccupied with sexual thoughts?',
        textMs: 'Adakah anda sering mendapati diri anda asyik dengan fikiran seksual?',
      },
      {
        id: 'sex_2',
        text: 'Do you hide some of your sexual behavior from others?',
        textMs: 'Adakah anda menyembunyikan sebahagian tingkah laku seksual anda daripada orang lain?',
      },
      {
        id: 'sex_3',
        text: 'Have you ever felt that your sexual behavior was out of control?',
        textMs: 'Adakah anda pernah berasa tingkah laku seksual anda di luar kawalan?',
      },
      {
        id: 'sex_4',
        text: 'Do you use sexual behavior to escape, relieve anxiety, or cope with problems?',
        textMs: 'Adakah anda menggunakan tingkah laku seksual untuk melarikan diri, melegakan kebimbangan, atau mengatasi masalah?',
      },
      {
        id: 'sex_5',
        text: 'Has your sexual behavior ever created problems in your relationships?',
        textMs: 'Adakah tingkah laku seksual anda pernah mencipta masalah dalam hubungan anda?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 3, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 4, max: 7, severity: 'Mild', severityMs: 'Ringan' },
        { min: 8, max: 11, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 12, max: 15, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 15,
    },
    timeframe: 'In the past 6 months...',
    timeframeMs: 'Dalam 6 bulan yang lepas...',
    isPremium: true,
  },

  marital_distress: {
    type: 'marital_distress',
    name: 'Relationship Distress Screening',
    nameMs: 'Saringan Tekanan Hubungan',
    description: 'A screening tool to assess relationship and marital difficulties.',
    descriptionMs: 'Alat saringan untuk menilai kesulitan hubungan dan perkahwinan.',
    questions: [
      {
        id: 'mar_1',
        text: 'How often do you and your partner argue?',
        textMs: 'Berapa kerap anda dan pasangan anda bertengkar?',
      },
      {
        id: 'mar_2',
        text: 'Do you feel emotionally distant from your partner?',
        textMs: 'Adakah anda berasa jauh secara emosi daripada pasangan anda?',
      },
      {
        id: 'mar_3',
        text: 'Do you feel your partner does not understand you?',
        textMs: 'Adakah anda berasa pasangan anda tidak memahami anda?',
      },
      {
        id: 'mar_4',
        text: 'Have you considered separation or divorce?',
        textMs: 'Adakah anda pernah mempertimbangkan perpisahan atau perceraian?',
      },
      {
        id: 'mar_5',
        text: 'Do you feel satisfied with your relationship overall?',
        textMs: 'Adakah anda berasa puas dengan hubungan anda secara keseluruhan?',
      },
      {
        id: 'mar_6',
        text: 'Is there trust between you and your partner?',
        textMs: 'Adakah terdapat kepercayaan antara anda dan pasangan anda?',
      },
    ],
    scaleType: 'frequency',
    scaleOptions: PHQ_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 5, max: 9, severity: 'Mild', severityMs: 'Ringan' },
        { min: 10, max: 13, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 14, max: 18, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 18,
    },
    timeframe: 'Thinking about your relationship over the past month...',
    timeframeMs: 'Memikirkan hubungan anda dalam sebulan yang lepas...',
    isPremium: true,
  },
};

/**
 * Get assessment instrument by type
 */
export function getInstrument(type: AssessmentType): AssessmentInstrument | null {
  return ASSESSMENT_INSTRUMENTS[type] || null;
}

/**
 * Calculate score and severity for an assessment
 */
export function calculateAssessmentScore(
  type: AssessmentType,
  answers: Record<string, number>
): { score: number; severity: string; severityMs: string } {
  const instrument = ASSESSMENT_INSTRUMENTS[type];
  if (!instrument) {
    return { score: 0, severity: 'Unknown', severityMs: 'Tidak Diketahui' };
  }

  const score = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const range = instrument.scoring.ranges.find(
    (r) => score >= r.min && score <= r.max
  );

  return {
    score,
    severity: range?.severity || 'Unknown',
    severityMs: range?.severityMs || 'Tidak Diketahui',
  };
}

/**
 * Get display info for assessment types
 */
export const ASSESSMENT_TYPE_INFO: Record<AssessmentType, { name: string; nameMs: string; icon: string }> = {
  depression: { name: 'Depression', nameMs: 'Kemurungan', icon: '😔' },
  anxiety: { name: 'Anxiety', nameMs: 'Kebimbangan', icon: '😰' },
  ocd: { name: 'OCD', nameMs: 'OCD', icon: '🔄' },
  ptsd: { name: 'PTSD', nameMs: 'PTSD', icon: '💭' },
  insomnia: { name: 'Insomnia', nameMs: 'Insomnia', icon: '😴' },
  suicidal: { name: 'Suicidal Ideation', nameMs: 'Pemikiran Bunuh Diri', icon: '⚠️' },
  psychosis: { name: 'Psychosis', nameMs: 'Psikosis', icon: '🌀' },
  sexual_addiction: { name: 'Sexual Addiction', nameMs: 'Ketagihan Seksual', icon: '🔞' },
  marital_distress: { name: 'Marital Distress', nameMs: 'Tekanan Perkahwinan', icon: '💔' },
};

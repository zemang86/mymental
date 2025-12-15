import type { AssessmentType } from '@/types/assessment';

/**
 * Malaysian-Validated Assessment Instruments
 * These are standardized mental health screening tools validated for Malaysian population
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

// PHQ-9 Response Options (0-3 scale) - Keep for depression which uses validated Malay PHQ-9
const PHQ_SCALE = [
  { value: 0, label: 'Not at all', labelMs: 'Tidak langsung' },
  { value: 1, label: 'Several days', labelMs: 'Beberapa hari' },
  { value: 2, label: 'More than half the days', labelMs: 'Lebih separuh hari' },
  { value: 3, label: 'Nearly every day', labelMs: 'Hampir setiap hari' },
];

// Malaysian AST/General 0-4 Scale (Frequency based)
const MY_FREQUENCY_SCALE = [
  { value: 0, label: 'Never', labelMs: 'Tidak Pernah' },
  { value: 1, label: 'Rarely', labelMs: 'Sekali-sekala' },
  { value: 2, label: 'Sometimes', labelMs: 'Selalu' },
  { value: 3, label: 'Fairly often', labelMs: 'Kerap' },
  { value: 4, label: 'Always', labelMs: 'Amat Kerap' },
];

// PTSD Scale (0-4)
const PTSD_SCALE = [
  { value: 0, label: 'Not at all', labelMs: 'Tidak langsung' },
  { value: 1, label: 'A little', labelMs: 'Sedikit terganggu' },
  { value: 2, label: 'Moderately', labelMs: 'Sederhana terganggu' },
  { value: 3, label: 'Quite a bit', labelMs: 'Agak terganggu' },
  { value: 4, label: 'Extremely', labelMs: 'Sangat terganggu' },
];

// SEGIST Insomnia Scale (0-4)
const SEGIST_SCALE = [
  { value: 0, label: 'Never', labelMs: 'Tidak pernah' },
  { value: 1, label: 'More than a month ago', labelMs: 'Lebih daripada sebulan' },
  { value: 2, label: 'More than a week ago', labelMs: 'Lebih daripada seminggu' },
  { value: 3, label: 'More than 3 times a week', labelMs: 'Lebih daripada 3 kali seminggu' },
  { value: 4, label: 'Almost every day', labelMs: 'Hampir setiap hari' },
];

// YSAS Suicide Scale (1-5, but we use 0-4 for consistency in scoring)
const YSAS_SCALE = [
  { value: 0, label: 'Never', labelMs: 'Tidak pernah' },
  { value: 1, label: 'Sometimes', labelMs: 'Kadang-kadang' },
  { value: 2, label: 'Often', labelMs: 'Selalu' },
  { value: 3, label: 'Frequently', labelMs: 'Kerap' },
  { value: 4, label: 'Very frequently', labelMs: 'Amat kerap' },
];

// OCD Scale (0-4)
const OCD_SCALE = [
  { value: 0, label: 'Not at all', labelMs: 'Tiada langsung' },
  { value: 1, label: 'A little', labelMs: 'Sedikit sahaja' },
  { value: 2, label: 'Moderately', labelMs: 'Sederhana' },
  { value: 3, label: 'A lot', labelMs: 'Kebanyakan' },
  { value: 4, label: 'Extremely', labelMs: 'Sangat' },
];

export const ASSESSMENT_INSTRUMENTS: Record<AssessmentType, AssessmentInstrument> = {
  // Depression - Using validated Malay PHQ-9 (Minda 9)
  depression: {
    type: 'depression',
    name: 'Patient Health Questionnaire (PHQ-9)',
    nameMs: 'Soal Selidik Kesihatan Pesakit (PHQ-9)',
    description: 'A validated 9-question instrument for screening depression, validated for Malaysian population.',
    descriptionMs: 'Instrumen 9 soalan yang disahkan untuk saringan kemurungan, disahkan untuk populasi Malaysia.',
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
        text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless',
        textMs: 'Bergerak atau bercakap dengan perlahan sehingga orang lain perasan. Atau sebaliknya - begitu gelisah',
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

  // Anxiety - Malaysian AST (Ujian Saringan Anzieti) - 19 items
  anxiety: {
    type: 'anxiety',
    name: 'Anxiety Screening Tool (AST)',
    nameMs: 'Ujian Saringan Anzieti (AST)',
    description: 'A 19-question Malaysian-validated screening tool for anxiety symptoms.',
    descriptionMs: 'Alat saringan 19 soalan yang disahkan Malaysia untuk gejala kebimbangan.',
    questions: [
      { id: 'ast_1', text: 'I feel nervous', textMs: 'Saya rasa gelisah' },
      { id: 'ast_2', text: 'I am afraid of something bad will happen to me', textMs: 'Saya takut sesuatu yang buruk akan menimpa diri saya' },
      { id: 'ast_3', text: 'I am feeling of choking', textMs: 'Saya rasa seperti tercekik' },
      { id: 'ast_4', text: "I don't feel calm", textMs: 'Saya tak berasa tenang' },
      { id: 'ast_5', text: 'I have the feeling of shakiness', textMs: 'Saya berasa gementar' },
      { id: 'ast_6', text: 'I feel rushing without any reason', textMs: 'Saya rasa tergesa-gesa tanpa sebab yang jelas' },
      { id: 'ast_7', text: 'I feel dizzy', textMs: 'Saya rasa seperti hendak pitam' },
      { id: 'ast_8', text: 'I feel flushed on my face', textMs: 'Saya rasa muka saya hangat' },
      { id: 'ast_9', text: 'I feel worried', textMs: 'Saya rasa bimbang' },
      { id: 'ast_10', text: 'I feel unsteady', textMs: 'Saya rasa tidak tenteram' },
      { id: 'ast_11', text: 'I panic easily', textMs: 'Saya mudah cemas' },
      { id: 'ast_12', text: 'I am unable to relax', textMs: 'Saya tidak boleh rileks' },
      { id: 'ast_13', text: 'I think I will be hit by some disaster', textMs: 'Saya rasa sesuatu malapetaka akan melanda saya' },
      { id: 'ast_14', text: 'I am always worried', textMs: 'Saya sentiasa risau' },
      { id: 'ast_15', text: 'I am always panic', textMs: 'Saya selalu panik' },
      { id: 'ast_16', text: 'I am always restless/uneasy', textMs: 'Saya sentiasa resah' },
      { id: 'ast_17', text: 'My heart is pounding', textMs: 'Hati saya berdebar-debar' },
      { id: 'ast_18', text: 'I have stomach ache', textMs: 'Saya rasa perut saya tidak selesa' },
      { id: 'ast_19', text: 'I am shivering', textMs: 'Saya rasa menggigil' },
    ],
    scaleType: 'frequency',
    scaleOptions: MY_FREQUENCY_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 19, severity: 'Low', severityMs: 'Rendah' },
        { min: 20, max: 38, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 39, max: 57, severity: 'High', severityMs: 'Tinggi' },
        { min: 58, max: 76, severity: 'Very High', severityMs: 'Sangat Tinggi' },
      ],
      maxScore: 76,
    },
    timeframe: 'Please indicate how often you have experienced the following:',
    timeframeMs: 'Sila nyatakan berapa kerap anda mengalami perkara berikut:',
    isPremium: false,
  },

  // Insomnia - Malaysian SEGIST (Shazli Ezzat Ghazali Insomnia Screening Test) - 11 items
  insomnia: {
    type: 'insomnia',
    name: 'SEGIST Insomnia Screening',
    nameMs: 'Ujian Saringan Insomnia SEGIST',
    description: 'An 11-question Malaysian-validated screening tool for insomnia symptoms.',
    descriptionMs: 'Alat saringan 11 soalan yang disahkan Malaysia untuk gejala insomnia.',
    questions: [
      { id: 'seg_1', text: 'How often do you have difficulty sleeping?', textMs: 'Berapa kerap anda mengalami kesukaran tidur?' },
      { id: 'seg_2', text: 'How often do you feel sleepy while working?', textMs: 'Berapa kerap anda berasa mengantuk ketika bekerja?' },
      { id: 'seg_3', text: 'Do you have difficulty waking up in the morning?', textMs: 'Adakah anda mengalami kesukaran untuk bangun pada waktu pagi?' },
      { id: 'seg_4', text: 'Do you feel restless at night?', textMs: 'Adakah anda berasa gelisah pada waktu malam?' },
      { id: 'seg_5', text: 'Do you feel restless in the morning?', textMs: 'Adakah anda berasa gelisah pada waktu pagi?' },
      { id: 'seg_6', text: 'Is your breathing disturbed during sleep?', textMs: 'Adakah pernafasan anda terganggu pada waktu tidur?' },
      { id: 'seg_7', text: 'Do you snore loudly?', textMs: 'Adakah anda berdengkur dengan kuat?' },
      { id: 'seg_8', text: 'Do you feel hot at night?', textMs: 'Adakah anda berasa panas di malam hari?' },
      { id: 'seg_9', text: 'Do you feel cold at night?', textMs: 'Adakah anda berasa sejuk di malam hari?' },
      { id: 'seg_10', text: 'Do you often have nightmares?', textMs: 'Adakah anda sering mengalami mimpi ngeri?' },
      { id: 'seg_11', text: 'Do you take sleeping pills due to difficulty sleeping?', textMs: 'Adakah anda mengambil pil tidur akibat kesukaran tidur?' },
    ],
    scaleType: 'frequency',
    scaleOptions: SEGIST_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 12, severity: 'Low', severityMs: 'Rendah' },
        { min: 13, max: 23, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 24, max: 36, severity: 'High', severityMs: 'Tinggi' },
        { min: 37, max: 44, severity: 'Very High', severityMs: 'Sangat Tinggi' },
      ],
      maxScore: 44,
    },
    timeframe: 'Please answer the following questions about your sleep:',
    timeframeMs: 'Sila jawab soalan berikut tentang tidur anda:',
    isPremium: true,
  },

  // OCD - Malaysian OCD Screening Tool - 20 items
  ocd: {
    type: 'ocd',
    name: 'OCD Screening Tool - Malaysia',
    nameMs: 'Alat Saringan OCD - Malaysia',
    description: 'A 20-question Malaysian-validated screening tool for obsessive-compulsive symptoms.',
    descriptionMs: 'Alat saringan 20 soalan yang disahkan Malaysia untuk gejala obsesif-kompulsif.',
    questions: [
      { id: 'ocd_1', text: 'Do you experience recurrent and persistent thoughts, impulses, or images?', textMs: 'Adakah anda mempunyai pemikiran, impuls atau imej yang meresahkan atau merisaukan yang berulang dan berterusan?' },
      { id: 'ocd_2', text: 'Do the thoughts, impulses, or images come from your own mind?', textMs: 'Adakah pemikiran, impuls atau imej tersebut datang daripada minda anda sendiri?' },
      { id: 'ocd_3', text: 'Do the thoughts, impulses, or images cause you to feel very anxious or distressed?', textMs: 'Adakah pemikiran, impuls atau imej tersebut menyebabkan anda berasa cemas atau bermasalah?' },
      { id: 'ocd_4', text: 'Do the thoughts, impulses, or images seem intrusive and inappropriate?', textMs: 'Adakah pemikiran, impuls atau imej tersebut seolah-olah tidak sesuai dan menganggu fikiran anda?' },
      { id: 'ocd_5', text: 'Do you try to ignore or suppress the thoughts, impulses, or images?', textMs: 'Adakah anda rasa anda tidak boleh berhenti atau tidak menghiraukan pemikiran atau imej ini walaupun anda telah mencuba?' },
      { id: 'ocd_6', text: 'Do you engage in repetitive behaviors (e.g., hand washing, ordering, checking)?', textMs: 'Adakah anda melakukan perkara berulang kali seperti membilang, memeriksa, membasuh tangan, menyusun objek?' },
      { id: 'ocd_7', text: 'Do you feel driven to perform the repetitive behaviors in response to an obsession?', textMs: 'Adakah perbuatan melakukan sesuatu perkara berulang kali merupakan tindak balas terhadap obsesi?' },
      { id: 'ocd_8', text: 'Are the behaviors aimed at preventing or reducing distress?', textMs: 'Adakah perbuatan melakukan sesuatu perkara berulang kali bertujuan untuk mencegah atau mengurangkan perasaan cemas?' },
      { id: 'ocd_9', text: 'Are the behaviors or mental acts excessive or unreasonable?', textMs: 'Adakah perbuatan melakukan sesuatu perkara berulang kali kelihatan terlalu berlebihan dan tidak munasabah?' },
      { id: 'ocd_10', text: 'Do you worry excessively about dirt, germs, or chemicals?', textMs: 'Adakah anda bimbang berlebihan tentang kotoran, kuman, atau bahan kimia?' },
      { id: 'ocd_11', text: 'Are you constantly worried that something bad will happen because you forgot something important?', textMs: 'Adakah anda sentiasa bimbang bahawa sesuatu yang buruk akan berlaku kerana anda terlupa sesuatu yang penting?' },
      { id: 'ocd_12', text: 'Do you experience shortness of breath?', textMs: 'Adakah anda mengalami sesak nafas?' },
      { id: 'ocd_13', text: 'Are you always afraid you will lose something of importance?', textMs: 'Adakah anda sentiasa takut anda akan kehilangan sesuatu yang penting?' },
      { id: 'ocd_14', text: 'Do you wash yourself or things around you excessively?', textMs: 'Adakah anda membersihkan diri anda atau mencuci benda-benda di sekeliling anda secara berlebihan?' },
      { id: 'ocd_15', text: 'Do you keep many useless things because you feel that you cannot throw them away?', textMs: 'Adakah anda menyimpan barang yang sia-sia kerana anda merasakan bahawa anda tidak boleh membuangnya?' },
      { id: 'ocd_16', text: 'Have you experienced changes in sleeping or eating habits?', textMs: 'Adakah anda mempunyai perubahan dari segi tabiat tidur dan tabiat makan?' },
      { id: 'ocd_17', text: 'Do you have to act or speak aggressively even though you really do not want to?', textMs: 'Adakah anda perlu bertindak atau bercakap secara agresif meskipun anda tidak berniat untuk bertindak sebegitu?' },
      { id: 'ocd_18', text: 'More days than not, do you feel sad or depressed?', textMs: 'Kebanyakan harinya, adakah anda merasa sedih atau tertekan?' },
      { id: 'ocd_19', text: 'More days than not, do you feel disinterested in life?', textMs: 'Kebanyakan harinya, adakah anda merasa tidak atau kurang berminat terhadap soal kehidupan?' },
      { id: 'ocd_20', text: 'More days than not, do you feel worthless or guilty?', textMs: 'Kebanyakan harinya, adakah anda merasa tidak berharga atau bersalah?' },
    ],
    scaleType: 'frequency',
    scaleOptions: OCD_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 20, severity: 'Low', severityMs: 'Rendah' },
        { min: 21, max: 40, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 41, max: 60, severity: 'High', severityMs: 'Tinggi' },
        { min: 61, max: 80, severity: 'Very High', severityMs: 'Sangat Tinggi' },
      ],
      maxScore: 80,
    },
    timeframe: 'During the past month, please indicate how much each statement applies to you:',
    timeframeMs: 'Dalam sebulan yang lepas, sila nyatakan sejauh mana setiap pernyataan berkaitan dengan anda:',
    isPremium: true,
  },

  // PTSD - Malaysian Senarai Semak PTSD - 20 items
  ptsd: {
    type: 'ptsd',
    name: 'PTSD Checklist - Malaysia',
    nameMs: 'Senarai Semak PTSD',
    description: 'A 20-question Malaysian-validated screening tool for post-traumatic stress symptoms.',
    descriptionMs: 'Alat saringan 20 soalan yang disahkan Malaysia untuk gejala tekanan selepas trauma.',
    questions: [
      { id: 'ptsd_1', text: 'Having disturbing and recurrent memories, thoughts or images of a stressful experience', textMs: 'Mempunyai gangguan dan ulangan ingatan, pemikiran atau gambaran pengalaman lampau yang tertekan' },
      { id: 'ptsd_2', text: 'Having disturbing and recurrent dreams related to a stressful experience', textMs: 'Mempunyai gangguan dan ulangan mimpi-mimpi berkaitan dengan pengalaman lampau yang tertekan' },
      { id: 'ptsd_3', text: 'Suddenly acting or feeling as if the stressful experience is happening again', textMs: 'Tiba-tiba berkelakuan atau merasakan seolah-olah pengalaman tertekan berlaku lagi' },
      { id: 'ptsd_4', text: 'Feeling very upset when something reminds you of a stressful experience', textMs: 'Rasa sangat kecewa/marah apabila ada sesuatu yang mengingatkan anda tentang pengalaman lampau yang tertekan' },
      { id: 'ptsd_5', text: 'Having physical reactions when reminded of a stressful experience', textMs: 'Mempunyai reaksi fizikal (seperti berdebar, sesak nafas, berpeluh) apabila ada sesuatu yang mengingatkan anda' },
      { id: 'ptsd_6', text: 'Avoiding thinking or talking about a stressful experience', textMs: 'Mengelak daripada berfikir atau bercakap tentang pengalaman lampau yang tertekan' },
      { id: 'ptsd_7', text: 'Avoiding activities or situations that remind you of a stressful experience', textMs: 'Mengelakkan aktiviti atau situasi yang mengingatkan anda tentang pengalaman lampau yang tertekan' },
      { id: 'ptsd_8', text: 'Difficulty remembering important events from a stressful experience', textMs: 'Sukar untuk ingat kembali peristiwa-peristiwa penting daripada pengalaman lampau yang tertekan' },
      { id: 'ptsd_9', text: 'Loss of interest in things you used to enjoy', textMs: 'Hilang minat terhadap perkara yang pernah anda nikmati' },
      { id: 'ptsd_10', text: 'Feeling distant and isolated from others', textMs: 'Rasa terasing dan tersisih daripada orang lain' },
      { id: 'ptsd_11', text: 'Feeling emotionally numb or unable to love those close to you', textMs: 'Rasa hambar secara emosi atau tidak mampu untuk menyayangi individu yang rapat dengan anda' },
      { id: 'ptsd_12', text: 'Feeling as if your future is bleak', textMs: 'Rasa seolah masa depan anda kelam' },
      { id: 'ptsd_13', text: 'Difficulty falling or staying asleep', textMs: 'Sukar untuk terlelap atau tidur dengan nyenyak' },
      { id: 'ptsd_14', text: 'Feeling irritable or having angry outbursts', textMs: 'Rasa berang atau cepat marah' },
      { id: 'ptsd_15', text: 'Difficulty concentrating', textMs: 'Sukar untuk tumpukan perhatian' },
      { id: 'ptsd_16', text: 'Being very vigilant or on guard', textMs: 'Menjadi sangat berjaga-jaga' },
      { id: 'ptsd_17', text: 'Being easily startled or losing morale', textMs: 'Mudah terkejut atau hilang semangat' },
      { id: 'ptsd_18', text: 'Physical and emotional stress when exposed to reminders of stressful experience', textMs: 'Tekanan fizikal dan emosi apabila terdedah dengan perkara yang mengingatkan pengalaman lampau yang tertekan' },
      { id: 'ptsd_19', text: 'Avoiding places or people that remind you of stressful experience', textMs: 'Mengelak daripada tempat atau individu yang mengingatkan pengalaman lampau yang tertekan' },
      { id: 'ptsd_20', text: 'Affected responsibility in completing daily tasks (work or study)', textMs: 'Terjejas tanggung jawab dalam menyempurkan tugas harian (kerja atau belajar)' },
    ],
    scaleType: 'severity',
    scaleOptions: PTSD_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 32, severity: 'Low Risk', severityMs: 'Risiko Rendah' },
        { min: 33, max: 50, severity: 'Moderate Risk', severityMs: 'Risiko Sederhana' },
        { min: 51, max: 65, severity: 'High Risk', severityMs: 'Risiko Tinggi' },
        { min: 66, max: 80, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 80,
    },
    timeframe: 'Please indicate how much you have been bothered by these difficulties in the past few months:',
    timeframeMs: 'Sila nyatakan setakat mana anda terganggu oleh kesukaran-kesukaran di bawah sejak beberapa bulan yang lalu:',
    isPremium: true,
  },

  // Suicidal - Malaysian YSAS (Yatt Suicide Attitude Scale) - 10 items
  suicidal: {
    type: 'suicidal',
    name: 'YSAS - Suicide Attitude Scale',
    nameMs: 'Skala Sikap Bunuh Diri YSAS',
    description: 'A 10-question Malaysian-validated screening tool for suicide ideation and attempts. This is always accompanied by crisis resources.',
    descriptionMs: 'Alat saringan 10 soalan yang disahkan Malaysia untuk ideasi dan percubaan bunuh diri. Ini sentiasa disertakan dengan sumber krisis.',
    questions: [
      { id: 'ysas_1', text: 'I have no desire to continue living', textMs: 'Saya tidak ada keinginan untuk meneruskan kehidupan ini' },
      { id: 'ysas_2', text: 'I feel there is no reason for me to continue living', textMs: 'Saya merasakan tidak ada sebab untuk saya terus hidup' },
      { id: 'ysas_3', text: 'Thoughts of ending my life cross my mind when facing major problems', textMs: 'Terlintas dalam fikiran saya untuk menamatkan hidup ini apabila berhadapan dengan masalah yang besar' },
      { id: 'ysas_4', text: 'I have thought about ending my life', textMs: 'Saya pernah terfikir untuk menamatkan hidup saya' },
      { id: 'ysas_5', text: 'Thoughts of ending my life cross my mind but I am afraid to do it', textMs: 'Terlintas dalam fikiran saya untuk menamatkan hidup saya namun saya takut untuk melakukannya' },
      { id: 'ysas_6', text: 'I have harmed myself with the intention of ending my life', textMs: 'Saya pernah mencederakan diri sendiri dengan tujuan untuk menamatkan hidup saya' },
      { id: 'ysas_7', text: 'I have used certain methods to end my life', textMs: 'Saya pernah menggunakan kaedah tertentu untuk menamatkan hidup saya' },
      { id: 'ysas_8', text: 'I have attempted to end my life but stopped when I remembered something (loved ones, sin, etc.)', textMs: 'Saya pernah melakukan percubaan untuk menamatkan hidup saya tetapi menghentikannya apabila teringat tentang sesuatu (orang tersayang, dosa dll)' },
      { id: 'ysas_9', text: 'I have tried to end my life but was unsuccessful', textMs: 'Saya pernah mencuba untuk menamatkan hidup ini tetapi tidak berhasil' },
      { id: 'ysas_10', text: 'I have tried to end my life but actually did not want to die', textMs: 'Saya pernah mencuba menamatkan hidup saya tetapi sebenarnya saya tidak berkeinginan untuk mati' },
    ],
    scaleType: 'frequency',
    scaleOptions: YSAS_SCALE,
    scoring: {
      // Note: YSAS scoring - Items 1-5 = Ideation subscale, Items 6-10 = Attempt subscale
      // Cutoff: Score 8+ on ideation (items 1-5) indicates suicide ideation
      // Cutoff: Score 6+ on attempt (items 6-10) indicates suicide attempt history
      ranges: [
        { min: 0, max: 7, severity: 'Low Risk', severityMs: 'Risiko Rendah' },
        { min: 8, max: 15, severity: 'Moderate Risk - Ideation Present', severityMs: 'Risiko Sederhana - Ideasi Hadir' },
        { min: 16, max: 25, severity: 'High Risk', severityMs: 'Risiko Tinggi' },
        { min: 26, max: 40, severity: 'Very High Risk - Seek Help Immediately', severityMs: 'Risiko Sangat Tinggi - Dapatkan Bantuan Segera' },
      ],
      maxScore: 40,
    },
    timeframe: 'Please indicate how often you have experienced the following:',
    timeframeMs: 'Sila bulatkan pernyataan yang menggambarkan situasi anda:',
    isPremium: false,
  },

  // Psychosis - Using adapted prodromal psychosis screening (keeping similar to original)
  psychosis: {
    type: 'psychosis',
    name: 'Psychosis Screening',
    nameMs: 'Saringan Psikosis',
    description: 'A screening tool for early signs of psychotic symptoms.',
    descriptionMs: 'Alat saringan untuk tanda-tanda awal gejala psikotik.',
    questions: [
      { id: 'psy_1', text: 'Do you sometimes feel that people are talking about you or taking special notice of you?', textMs: 'Adakah anda kadang-kadang berasa orang sedang bercakap tentang anda atau memberi perhatian khusus kepada anda?' },
      { id: 'psy_2', text: 'Do you sometimes feel that you are being watched or followed?', textMs: 'Adakah anda kadang-kadang berasa anda sedang diperhatikan atau diikuti?' },
      { id: 'psy_3', text: 'Have you had experiences with telepathy, psychic forces, or fortune telling?', textMs: 'Adakah anda mempunyai pengalaman dengan telepati, kuasa psikik, atau ramalan nasib?' },
      { id: 'psy_4', text: 'Do you hear voices that others cannot hear?', textMs: 'Adakah anda mendengar suara yang orang lain tidak dapat dengar?' },
      { id: 'psy_5', text: 'Do you sometimes see things that others cannot see?', textMs: 'Adakah anda kadang-kadang melihat perkara yang orang lain tidak dapat lihat?' },
      { id: 'psy_6', text: 'Do you feel you have special powers or abilities?', textMs: 'Adakah anda berasa anda mempunyai kuasa atau kebolehan istimewa?' },
    ],
    scaleType: 'frequency',
    scaleOptions: MY_FREQUENCY_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 6, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 7, max: 12, severity: 'Mild', severityMs: 'Ringan' },
        { min: 13, max: 18, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 19, max: 24, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 24,
    },
    timeframe: 'Please indicate how often you have experienced the following in the past year:',
    timeframeMs: 'Sila nyatakan berapa kerap anda mengalami perkara berikut dalam setahun yang lepas:',
    isPremium: true,
  },

  // Sexual Addiction - Keeping adapted version
  sexual_addiction: {
    type: 'sexual_addiction',
    name: 'Sexual Behavior Screening',
    nameMs: 'Saringan Tingkah Laku Seksual',
    description: 'A screening tool to assess problematic sexual behaviors.',
    descriptionMs: 'Alat saringan untuk menilai tingkah laku seksual yang bermasalah.',
    questions: [
      { id: 'sex_1', text: 'Do you often find yourself preoccupied with sexual thoughts?', textMs: 'Adakah anda sering mendapati diri anda asyik dengan fikiran seksual?' },
      { id: 'sex_2', text: 'Do you hide some of your sexual behavior from others?', textMs: 'Adakah anda menyembunyikan sebahagian tingkah laku seksual anda daripada orang lain?' },
      { id: 'sex_3', text: 'Have you ever felt that your sexual behavior was out of control?', textMs: 'Adakah anda pernah berasa tingkah laku seksual anda di luar kawalan?' },
      { id: 'sex_4', text: 'Do you use sexual behavior to escape, relieve anxiety, or cope with problems?', textMs: 'Adakah anda menggunakan tingkah laku seksual untuk melarikan diri, melegakan kebimbangan, atau mengatasi masalah?' },
      { id: 'sex_5', text: 'Has your sexual behavior ever created problems in your relationships?', textMs: 'Adakah tingkah laku seksual anda pernah mencipta masalah dalam hubungan anda?' },
    ],
    scaleType: 'frequency',
    scaleOptions: MY_FREQUENCY_SCALE,
    scoring: {
      ranges: [
        { min: 0, max: 5, severity: 'Minimal', severityMs: 'Minimum' },
        { min: 6, max: 10, severity: 'Mild', severityMs: 'Ringan' },
        { min: 11, max: 15, severity: 'Moderate', severityMs: 'Sederhana' },
        { min: 16, max: 20, severity: 'Severe', severityMs: 'Teruk' },
      ],
      maxScore: 20,
    },
    timeframe: 'In the past 6 months...',
    timeframeMs: 'Dalam 6 bulan yang lepas...',
    isPremium: true,
  },

  // Marital Distress - Simplified from Malaysian Instrumen Saringan Tekanan Dalam Perkahwinan
  marital_distress: {
    type: 'marital_distress',
    name: 'Marital Distress Questionnaire',
    nameMs: 'Soal Selidik Kesukaran Dalam Perkahwinan',
    description: 'A Malaysian-validated screening tool to assess relationship and marital difficulties.',
    descriptionMs: 'Alat saringan yang disahkan Malaysia untuk menilai kesulitan hubungan dan perkahwinan.',
    questions: [
      { id: 'mar_1', text: 'Handling family finances', textMs: 'Menguruskan kewangan keluarga' },
      { id: 'mar_2', text: 'Ways of dealing with children', textMs: 'Cara mendidik/membesarkan anak' },
      { id: 'mar_3', text: 'Demonstration of affection', textMs: 'Cara menunjukkan kemesraan' },
      { id: 'mar_4', text: 'Sexual relationship', textMs: 'Hubungan seksual' },
      { id: 'mar_5', text: 'Making major decisions', textMs: 'Membuat keputusan' },
      { id: 'mar_6', text: 'Managing household tasks', textMs: 'Menguruskan kerja rumah' },
      { id: 'mar_7', text: 'Marriage overall satisfaction', textMs: 'Kepuasan perkahwinan secara keseluruhan' },
      { id: 'mar_8', text: 'Relationship with partner', textMs: 'Perhubungan/kemesraan dengan pasangan' },
      { id: 'mar_9', text: 'My partner is too critical or often has negative outlook', textMs: 'Pasangan saya terlalu kritikal atau sering mempunyai pandangan yang negatif' },
      { id: 'mar_10', text: 'Sometimes I am concerned about my partner\'s temper', textMs: 'Kadang-kadang saya bimbang mengenai panas baran pasangan saya' },
    ],
    scaleType: 'agreement',
    scaleOptions: [
      { value: 0, label: 'Always agree', labelMs: 'Sentiasa bersetuju' },
      { value: 1, label: 'Almost always agree', labelMs: 'Hampir selalu bersetuju' },
      { value: 2, label: 'Sometimes disagree', labelMs: 'Kadang-kadang tidak bersetuju' },
      { value: 3, label: 'Frequently disagree', labelMs: 'Kerap tidak bersetuju' },
      { value: 4, label: 'Almost always disagree', labelMs: 'Hampir selalu tidak bersetuju' },
      { value: 5, label: 'Always disagree', labelMs: 'Sentiasa tidak bersetuju' },
    ],
    scoring: {
      ranges: [
        { min: 0, max: 12, severity: 'Low Distress', severityMs: 'Tekanan Rendah' },
        { min: 13, max: 25, severity: 'Moderate Distress', severityMs: 'Tekanan Sederhana' },
        { min: 26, max: 38, severity: 'High Distress', severityMs: 'Tekanan Tinggi' },
        { min: 39, max: 50, severity: 'Very High Distress', severityMs: 'Tekanan Sangat Tinggi' },
      ],
      maxScore: 50,
    },
    timeframe: 'Thinking about your relationship, please indicate the level of agreement/disagreement with your partner:',
    timeframeMs: 'Memikirkan hubungan anda, sila nyatakan tahap persetujuan/perselisihan dengan pasangan anda:',
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
 * icon: Lucide icon name (lowercase with hyphens)
 */
export const ASSESSMENT_TYPE_INFO: Record<AssessmentType, { name: string; nameMs: string; icon: string }> = {
  depression: { name: 'Depression', nameMs: 'Kemurungan', icon: 'cloud-rain' },
  anxiety: { name: 'Anxiety', nameMs: 'Kebimbangan', icon: 'heart-pulse' },
  ocd: { name: 'OCD', nameMs: 'OCD', icon: 'refresh-cw' },
  ptsd: { name: 'PTSD', nameMs: 'PTSD', icon: 'shield-alert' },
  insomnia: { name: 'Insomnia', nameMs: 'Insomnia', icon: 'moon' },
  suicidal: { name: 'Suicidal Ideation', nameMs: 'Pemikiran Bunuh Diri', icon: 'alert-triangle' },
  psychosis: { name: 'Psychosis', nameMs: 'Psikosis', icon: 'brain' },
  sexual_addiction: { name: 'Sexual Addiction', nameMs: 'Ketagihan Seksual', icon: 'flame' },
  marital_distress: { name: 'Marital Distress', nameMs: 'Tekanan Perkahwinan', icon: 'heart-crack' },
};

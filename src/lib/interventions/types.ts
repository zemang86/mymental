/**
 * Intervention Types
 */

export type InterventionType = 'video' | 'audio' | 'article' | 'exercise';

export type InterventionCategory =
  | 'depression'
  | 'anxiety'
  | 'stress'
  | 'sleep'
  | 'mindfulness'
  | 'relationships'
  | 'general';

export interface InterventionChapter {
  id: string;
  title: string;
  titleMs: string;
  duration: number; // in seconds
  videoUrl?: string;
  audioUrl?: string;
  content?: string; // for articles
}

export interface Intervention {
  id: string;
  type: InterventionType;
  category: InterventionCategory;
  title: string;
  titleMs: string;
  description: string;
  descriptionMs: string;
  thumbnail: string;
  duration: number; // total duration in minutes
  chapters: InterventionChapter[];
  isPremium: boolean;
  createdAt: Date;
}

export interface UserInterventionProgress {
  id: string;
  odId: string;
  interventionId: string;
  currentChapterIndex: number;
  currentTime: number; // in seconds
  completedChapters: string[];
  isCompleted: boolean;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

// Sample interventions data
export const SAMPLE_INTERVENTIONS: Intervention[] = [
  {
    id: 'breathing-101',
    type: 'video',
    category: 'anxiety',
    title: 'Breathing Techniques for Anxiety',
    titleMs: 'Teknik Pernafasan untuk Kebimbangan',
    description: 'Learn simple breathing exercises to calm your mind and reduce anxiety symptoms.',
    descriptionMs: 'Pelajari latihan pernafasan mudah untuk menenangkan fikiran dan mengurangkan gejala kebimbangan.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
    duration: 15,
    isPremium: false,
    chapters: [
      {
        id: 'ch1',
        title: 'Introduction to Breathing',
        titleMs: 'Pengenalan Pernafasan',
        duration: 180,
      },
      {
        id: 'ch2',
        title: '4-7-8 Breathing Technique',
        titleMs: 'Teknik Pernafasan 4-7-8',
        duration: 300,
      },
      {
        id: 'ch3',
        title: 'Box Breathing',
        titleMs: 'Pernafasan Kotak',
        duration: 240,
      },
      {
        id: 'ch4',
        title: 'Daily Practice Tips',
        titleMs: 'Tips Latihan Harian',
        duration: 180,
      },
    ],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'sleep-hygiene',
    type: 'video',
    category: 'sleep',
    title: 'Better Sleep Habits',
    titleMs: 'Tabiat Tidur Lebih Baik',
    description: 'Improve your sleep quality with evidence-based sleep hygiene practices.',
    descriptionMs: 'Tingkatkan kualiti tidur anda dengan amalan kebersihan tidur berasaskan bukti.',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=450&fit=crop',
    duration: 20,
    isPremium: true,
    chapters: [
      {
        id: 'ch1',
        title: 'Understanding Sleep Cycles',
        titleMs: 'Memahami Kitaran Tidur',
        duration: 300,
      },
      {
        id: 'ch2',
        title: 'Creating a Sleep Environment',
        titleMs: 'Mewujudkan Persekitaran Tidur',
        duration: 240,
      },
      {
        id: 'ch3',
        title: 'Pre-Sleep Routine',
        titleMs: 'Rutin Sebelum Tidur',
        duration: 300,
      },
      {
        id: 'ch4',
        title: 'Managing Sleep Disruptions',
        titleMs: 'Menguruskan Gangguan Tidur',
        duration: 360,
      },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'mindfulness-intro',
    type: 'video',
    category: 'mindfulness',
    title: 'Introduction to Mindfulness',
    titleMs: 'Pengenalan Kesedaran Penuh',
    description: 'Begin your mindfulness journey with guided meditation and awareness exercises.',
    descriptionMs: 'Mulakan perjalanan kesedaran penuh anda dengan meditasi berpandu dan latihan kesedaran.',
    thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop',
    duration: 25,
    isPremium: true,
    chapters: [
      {
        id: 'ch1',
        title: 'What is Mindfulness?',
        titleMs: 'Apa itu Kesedaran Penuh?',
        duration: 240,
      },
      {
        id: 'ch2',
        title: 'Body Scan Meditation',
        titleMs: 'Meditasi Imbasan Badan',
        duration: 420,
      },
      {
        id: 'ch3',
        title: 'Mindful Breathing',
        titleMs: 'Pernafasan Penuh Kesedaran',
        duration: 360,
      },
      {
        id: 'ch4',
        title: 'Incorporating Mindfulness Daily',
        titleMs: 'Mengamalkan Kesedaran Penuh Setiap Hari',
        duration: 300,
      },
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'stress-management',
    type: 'video',
    category: 'stress',
    title: 'Stress Management Strategies',
    titleMs: 'Strategi Pengurusan Tekanan',
    description: 'Practical techniques to identify, manage, and reduce stress in daily life.',
    descriptionMs: 'Teknik praktikal untuk mengenal pasti, mengurus dan mengurangkan tekanan dalam kehidupan seharian.',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop',
    duration: 30,
    isPremium: true,
    chapters: [
      {
        id: 'ch1',
        title: 'Understanding Stress',
        titleMs: 'Memahami Tekanan',
        duration: 300,
      },
      {
        id: 'ch2',
        title: 'Identifying Stress Triggers',
        titleMs: 'Mengenal Pasti Pencetus Tekanan',
        duration: 360,
      },
      {
        id: 'ch3',
        title: 'Relaxation Techniques',
        titleMs: 'Teknik Relaksasi',
        duration: 420,
      },
      {
        id: 'ch4',
        title: 'Building Resilience',
        titleMs: 'Membina Daya Tahan',
        duration: 360,
      },
      {
        id: 'ch5',
        title: 'Creating Your Stress Plan',
        titleMs: 'Mencipta Pelan Tekanan Anda',
        duration: 360,
      },
    ],
    createdAt: new Date('2024-02-15'),
  },
];

// Post-edited content type
export interface InterventionContentEdited {
  id: string;
  chapterId: string;
  titleEn?: string;
  titleMs?: string;
  contentEn?: string;
  contentMs?: string;
  summaryEn?: string;
  summaryMs?: string;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'cloudflare';
  videoTitle?: string;
  videoTitleMs?: string;
  videoDurationSeconds?: number;
  isPublished: boolean;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTotalDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

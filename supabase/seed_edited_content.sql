-- Seed file for intervention_content_edited with actual chapter IDs
-- Run this after migration 00012 is applied

-- =====================================================
-- ANXIETY CHAPTERS
-- =====================================================

-- Chapter 1: Understanding Anxiety
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  'e9e91895-c381-436e-8f44-e284d46d6576',
  'Understanding Anxiety',
  'Memahami Kebimbangan',
  E'## What is Anxiety?\n\nAnxiety is your body''s natural response to stress. It''s a feeling of fear or apprehension about what''s to come. While occasional anxiety is normal, persistent or excessive anxiety may indicate an anxiety disorder.\n\n### The Anxiety Response\n\nWhen you feel anxious, your body activates the "fight-or-flight" response:\n\n- **Heart rate increases** - Pumping blood to muscles\n- **Breathing quickens** - Getting more oxygen\n- **Muscles tense** - Preparing for action\n- **Mind becomes alert** - Scanning for threats\n\n### Types of Anxiety\n\n1. **Generalized Anxiety** - Persistent worry about everyday things\n2. **Social Anxiety** - Fear of social situations\n3. **Panic Disorder** - Sudden intense fear episodes\n4. **Specific Phobias** - Intense fear of specific objects or situations\n\n### Key Takeaway\n\nAnxiety is not your enemy—it''s a survival mechanism that sometimes becomes overactive. Understanding this is the first step to managing it effectively.',
  E'## Apa itu Kebimbangan?\n\nKebimbangan adalah tindak balas semula jadi badan anda terhadap tekanan. Ia adalah perasaan takut atau kerisauan tentang apa yang akan datang.\n\n### Tindak Balas Kebimbangan\n\nApabila anda berasa cemas, badan anda mengaktifkan tindak balas "lawan-atau-lari":\n\n- **Kadar jantung meningkat**\n- **Pernafasan menjadi cepat**\n- **Otot menjadi tegang**\n- **Minda menjadi waspada**',
  'Learn what anxiety really is, how it affects your body, and why understanding it is the first step to managing it effectively.',
  'Pelajari apa sebenarnya kebimbangan, bagaimana ia mempengaruhi badan anda, dan mengapa memahaminya adalah langkah pertama untuk menguruskannya dengan berkesan.',
  'https://www.youtube.com/watch?v=BVJsLbhYKQQ',
  'youtube',
  'Understanding Anxiety and How to Manage It',
  'Memahami Kebimbangan dan Cara Menguruskannya',
  312,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  content_ms = EXCLUDED.content_ms,
  video_url = EXCLUDED.video_url,
  video_title = EXCLUDED.video_title,
  is_published = true,
  updated_at = NOW();

-- Chapter 2: Breathing Exercises for Immediate Relief
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  'c613fea4-cff3-4307-b05d-17c711b31a36',
  'Breathing Exercises for Immediate Relief',
  'Latihan Pernafasan untuk Kelegaan Segera',
  E'## The Power of Breath\n\nYour breath is a powerful tool for calming anxiety. When you''re anxious, your breathing becomes shallow and rapid. By consciously slowing your breath, you can activate your body''s relaxation response.\n\n### The 4-7-8 Technique\n\n1. **Inhale** through your nose for **4 seconds**\n2. **Hold** your breath for **7 seconds**\n3. **Exhale** slowly through your mouth for **8 seconds**\n4. Repeat 3-4 times\n\n### Box Breathing\n\n1. **Inhale** for 4 seconds\n2. **Hold** for 4 seconds\n3. **Exhale** for 4 seconds\n4. **Hold** for 4 seconds\n5. Repeat 4 times\n\n### Tips for Success\n\n- Practice when you''re calm first\n- Find a quiet, comfortable place\n- Don''t force it—let it feel natural\n- Practice daily for best results\n\n### When to Use\n\n- Before stressful situations\n- During anxiety attacks\n- At bedtime for better sleep\n- Anytime you feel overwhelmed',
  E'## Kuasa Pernafasan\n\nPernafasan anda adalah alat yang berkuasa untuk menenangkan kebimbangan.\n\n### Teknik 4-7-8\n\n1. **Tarik nafas** melalui hidung selama **4 saat**\n2. **Tahan** nafas selama **7 saat**\n3. **Hembus** perlahan melalui mulut selama **8 saat**\n4. Ulang 3-4 kali',
  'Master simple breathing techniques that can calm your anxiety in minutes. Learn the 4-7-8 and Box Breathing methods.',
  'Kuasai teknik pernafasan mudah yang boleh menenangkan kebimbangan anda dalam beberapa minit.',
  'https://www.youtube.com/watch?v=tEmt1Znux58',
  'youtube',
  '4-7-8 Breathing Exercise by Dr. Andrew Weil',
  'Latihan Pernafasan 4-7-8 oleh Dr. Andrew Weil',
  165,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- =====================================================
-- DEPRESSION CHAPTERS
-- =====================================================

-- Chapter 1: Understanding Depression
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  '304cde70-ce0f-4553-a458-53548c183695',
  'Understanding Depression',
  'Memahami Kemurungan',
  E'## What is Depression?\n\nDepression is more than just feeling sad. It''s a complex mental health condition that affects how you think, feel, and handle daily activities.\n\n### Common Signs of Depression\n\n- **Persistent sad or empty mood** lasting most of the day\n- **Loss of interest** in activities you once enjoyed\n- **Changes in appetite** - eating too much or too little\n- **Sleep problems** - insomnia or sleeping too much\n- **Fatigue** and low energy\n- **Difficulty concentrating** or making decisions\n- **Feelings of worthlessness** or excessive guilt\n- **Thoughts of death** or suicide\n\n### Important Facts\n\n1. **Depression is common** - Millions of people experience it\n2. **It''s not weakness** - It''s a real medical condition\n3. **It''s treatable** - Most people improve with proper help\n4. **You''re not alone** - Support is available\n\n### The Good News\n\nWith the right treatment and support, depression can be managed effectively. This program will teach you practical strategies to feel better.',
  E'## Apa itu Kemurungan?\n\nKemurungan lebih daripada sekadar perasaan sedih. Ia adalah keadaan kesihatan mental yang kompleks yang mempengaruhi cara anda berfikir, berasa, dan mengendalikan aktiviti harian.\n\n### Tanda-tanda Kemurungan\n\n- Mood sedih atau kosong yang berterusan\n- Kehilangan minat dalam aktiviti\n- Perubahan selera makan\n- Masalah tidur\n- Keletihan dan tenaga rendah',
  'Understand what depression really is, recognize its signs, and learn that recovery is possible with the right support.',
  'Fahami apa sebenarnya kemurungan, kenali tanda-tandanya, dan ketahui bahawa pemulihan adalah mungkin dengan sokongan yang betul.',
  'https://www.youtube.com/watch?v=z-IR48Mb3W0',
  'youtube',
  'What is Depression? Symptoms and Treatment',
  'Apa itu Kemurungan? Simptom dan Rawatan',
  287,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- Chapter 3: Mindful Breathing Technique
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  '3b1c031d-2fe5-4acb-aa94-b150010e53ba',
  'Mindful Breathing Technique',
  'Teknik Pernafasan Kesedaran Penuh',
  E'## Mindfulness and Depression\n\nMindful breathing is a powerful tool for managing depression. It helps you:\n\n- Break the cycle of negative thoughts\n- Stay present instead of dwelling on the past\n- Reduce stress and anxiety\n- Create space between you and your emotions\n\n### The Practice\n\n1. **Find a comfortable position** - Sit or lie down\n2. **Close your eyes** or soften your gaze\n3. **Notice your breath** - Don''t change it, just observe\n4. **When your mind wanders** - Gently bring it back\n5. **Start with 5 minutes** - Gradually increase\n\n### Tips for Success\n\n- Practice at the same time daily\n- Be patient with yourself\n- There''s no "wrong" way to do it\n- Even 1 minute counts\n\n### What to Expect\n\nYour mind will wander—that''s normal! The practice is in noticing when it wanders and bringing it back. Each time you do this, you strengthen your mindfulness "muscle."',
  E'## Kesedaran Penuh dan Kemurungan\n\nPernafasan kesedaran penuh adalah alat yang berkuasa untuk menguruskan kemurungan.\n\n### Amalan\n\n1. Cari kedudukan yang selesa\n2. Tutup mata anda\n3. Perhatikan nafas anda\n4. Apabila minda anda merayau, bawa kembali dengan lembut\n5. Mulakan dengan 5 minit',
  'Learn mindful breathing techniques that help break the cycle of negative thoughts and bring peace to your mind.',
  'Pelajari teknik pernafasan kesedaran penuh yang membantu memecahkan kitaran pemikiran negatif.',
  'https://www.youtube.com/watch?v=SEfs5TJZ6Nk',
  'youtube',
  '5-Minute Mindful Breathing Meditation',
  'Meditasi Pernafasan Kesedaran Penuh 5 Minit',
  320,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- =====================================================
-- INSOMNIA CHAPTERS
-- =====================================================

-- Chapter 1: Understanding Insomnia
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  '7ea7473f-8dea-4de5-95bb-bcc336ea816a',
  'Understanding Insomnia',
  'Memahami Insomnia',
  E'## What is Insomnia?\n\nInsomnia is a sleep disorder characterized by difficulty falling asleep, staying asleep, or waking up too early. It affects your energy, mood, health, and quality of life.\n\n### Types of Insomnia\n\n1. **Acute Insomnia** - Short-term, often caused by stress\n2. **Chronic Insomnia** - Long-term, lasting 3+ months\n3. **Onset Insomnia** - Difficulty falling asleep\n4. **Maintenance Insomnia** - Difficulty staying asleep\n\n### Common Causes\n\n- **Stress and anxiety** - Racing thoughts at bedtime\n- **Poor sleep habits** - Irregular schedule, screens before bed\n- **Lifestyle factors** - Caffeine, alcohol, lack of exercise\n- **Medical conditions** - Pain, breathing problems\n- **Medications** - Some can interfere with sleep\n\n### The Sleep-Wake Cycle\n\nYour body has a natural clock (circadian rhythm) that regulates when you feel sleepy and awake. Understanding and working with this rhythm is key to better sleep.\n\n### Good News\n\nInsomnia is highly treatable! This program will teach you evidence-based techniques that have helped millions of people sleep better.',
  E'## Apa itu Insomnia?\n\nInsomnia adalah gangguan tidur yang dicirikan oleh kesukaran untuk tidur, kekal tidur, atau bangun terlalu awal.\n\n### Jenis Insomnia\n\n1. **Insomnia Akut** - Jangka pendek\n2. **Insomnia Kronik** - Jangka panjang\n3. **Insomnia Permulaan** - Kesukaran untuk tidur\n4. **Insomnia Penyelenggaraan** - Kesukaran kekal tidur',
  'Learn what insomnia really is, its different types, and why understanding the root causes is essential for better sleep.',
  'Pelajari apa sebenarnya insomnia, jenis-jenisnya, dan mengapa memahami punca adalah penting untuk tidur yang lebih baik.',
  'https://www.youtube.com/watch?v=t0kACis_dJE',
  'youtube',
  'Understanding Insomnia - Causes and Solutions',
  'Memahami Insomnia - Punca dan Penyelesaian',
  445,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- Chapter 2: Sleep Hygiene and Healthy Habits
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  'a3f35980-ad4e-4cd9-a1e4-d02a50f22bae',
  'Sleep Hygiene and Healthy Habits',
  'Kebersihan Tidur dan Tabiat Sihat',
  E'## What is Sleep Hygiene?\n\nSleep hygiene refers to the habits and practices that help you get good quality sleep. Think of it as creating the perfect conditions for sleep.\n\n### The Sleep Environment\n\n- **Keep it dark** - Use blackout curtains or an eye mask\n- **Keep it cool** - 65-68°F (18-20°C) is ideal\n- **Keep it quiet** - Use earplugs or white noise if needed\n- **Keep it comfortable** - Invest in a good mattress and pillows\n\n### Daily Habits for Better Sleep\n\n1. **Consistent schedule** - Same bedtime and wake time daily\n2. **Limit screens** - No phones/tablets 1 hour before bed\n3. **Watch caffeine** - None after 2 PM\n4. **Exercise regularly** - But not too close to bedtime\n5. **Limit alcohol** - It disrupts sleep quality\n6. **Wind down** - Create a relaxing pre-sleep routine\n\n### The 20-Minute Rule\n\nIf you can''t fall asleep within 20 minutes, get up and do something relaxing in dim light. Return to bed only when sleepy. This prevents your brain from associating bed with frustration.\n\n### Action Step\n\nChoose ONE habit from this chapter to implement tonight. Small changes lead to big improvements!',
  E'## Apa itu Kebersihan Tidur?\n\nKebersihan tidur merujuk kepada tabiat dan amalan yang membantu anda mendapat tidur berkualiti.\n\n### Persekitaran Tidur\n\n- Pastikan gelap\n- Pastikan sejuk\n- Pastikan senyap\n- Pastikan selesa\n\n### Tabiat Harian\n\n1. Jadual yang konsisten\n2. Hadkan skrin\n3. Perhatikan kafein\n4. Bersenam secara teratur',
  'Master the fundamentals of sleep hygiene—simple but powerful habits that create the perfect conditions for restful sleep.',
  'Kuasai asas kebersihan tidur—tabiat mudah tetapi berkuasa yang mewujudkan keadaan sempurna untuk tidur yang nyenyak.',
  'https://www.youtube.com/watch?v=nm1TxQj9IsQ',
  'youtube',
  'Sleep Hygiene: Train Your Brain to Fall Asleep',
  'Kebersihan Tidur: Latih Otak Anda untuk Tidur',
  289,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- Chapter 4: Relaxation Techniques
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
) VALUES (
  '9d2ae5fa-ba0b-4f7e-85ab-3b9cb746ee35',
  'Relaxation Techniques for Sleep',
  'Teknik Relaksasi untuk Tidur',
  E'## Why Relaxation Matters\n\nWhen you''re stressed or anxious, your body is in "alert" mode, making it hard to fall asleep. Relaxation techniques help switch your body into "rest" mode.\n\n### Progressive Muscle Relaxation (PMR)\n\n1. **Start with your feet** - Tense for 5 seconds, then release\n2. **Move up your body** - Calves, thighs, abdomen, chest\n3. **Continue to arms** - Hands, forearms, upper arms\n4. **Finish with face** - Jaw, eyes, forehead\n5. **Notice the difference** between tension and relaxation\n\n### Body Scan Meditation\n\n1. Lie down comfortably\n2. Close your eyes\n3. Slowly bring attention to each body part\n4. Notice sensations without judgment\n5. Release any tension you find\n\n### Deep Breathing for Sleep\n\n- **4-7-8 Technique**: Inhale 4s, hold 7s, exhale 8s\n- Do 3-4 cycles before sleep\n- Focus only on counting\n\n### When to Practice\n\n- 30 minutes before bed is ideal\n- Make it part of your wind-down routine\n- Practice daily for best results',
  E'## Mengapa Relaksasi Penting\n\nApabila anda tertekan, badan anda dalam mod "berjaga-jaga". Teknik relaksasi membantu menukar badan anda ke mod "rehat".\n\n### Relaksasi Otot Progresif\n\n1. Mulakan dengan kaki anda\n2. Bergerak ke atas badan\n3. Teruskan ke lengan\n4. Akhiri dengan muka',
  'Learn powerful relaxation techniques including Progressive Muscle Relaxation and Body Scan Meditation to prepare your body for sleep.',
  'Pelajari teknik relaksasi yang berkuasa termasuk Relaksasi Otot Progresif dan Meditasi Imbasan Badan.',
  'https://www.youtube.com/watch?v=ihO02wUzgkc',
  'youtube',
  'Progressive Muscle Relaxation for Sleep',
  'Relaksasi Otot Progresif untuk Tidur',
  612,
  true
) ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- =====================================================
-- OCD CHAPTERS
-- =====================================================

-- Get OCD chapter IDs first (we'll use a subquery approach)
-- Chapter 1
INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
)
SELECT
  ic.id,
  'Understanding OCD',
  'Memahami OCD',
  E'## What is OCD?\n\nObsessive-Compulsive Disorder (OCD) is a mental health condition characterized by:\n\n### Obsessions\nUnwanted, intrusive thoughts, images, or urges that cause distress:\n- Fear of contamination\n- Fear of harm to self or others\n- Need for symmetry or exactness\n- Unwanted taboo thoughts\n\n### Compulsions\nRepetitive behaviors or mental acts performed to reduce anxiety:\n- Excessive washing or cleaning\n- Checking repeatedly\n- Counting or arranging\n- Seeking reassurance\n\n### The OCD Cycle\n\n1. **Obsession** triggers anxiety\n2. **Compulsion** temporarily reduces anxiety\n3. Relief is short-lived\n4. Obsession returns stronger\n5. Cycle repeats and strengthens\n\n### Breaking the Cycle\n\nThe key to managing OCD is learning to:\n- Tolerate uncertainty\n- Resist compulsions\n- Let anxiety naturally decrease\n\nThis program will teach you evidence-based techniques to break free from OCD''s grip.',
  E'## Apa itu OCD?\n\nKecelaruan Obsesif-Kompulsif (OCD) adalah keadaan kesihatan mental yang dicirikan oleh:\n\n### Obsesi\nPemikiran, imej, atau desakan yang tidak diingini yang menyebabkan tekanan.\n\n### Kompulsi\nTingkah laku atau tindakan mental berulang yang dilakukan untuk mengurangkan kebimbangan.',
  'Understand what OCD really is, how the obsession-compulsion cycle works, and why breaking this cycle is key to recovery.',
  'Fahami apa sebenarnya OCD, bagaimana kitaran obsesi-kompulsi berfungsi, dan mengapa memecahkan kitaran ini adalah kunci kepada pemulihan.',
  'https://www.youtube.com/watch?v=I8Jofzx_8p4',
  'youtube',
  'What is OCD? Understanding Obsessive-Compulsive Disorder',
  'Apa itu OCD? Memahami Kecelaruan Obsesif-Kompulsif',
  398,
  true
FROM intervention_chapters ic
JOIN interventions i ON ic.intervention_id = i.id
WHERE i.category = 'ocd' AND ic.chapter_order = 1
ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- =====================================================
-- PTSD CHAPTERS
-- =====================================================

INSERT INTO intervention_content_edited (
  chapter_id,
  title_en, title_ms,
  content_en, content_ms,
  summary_en, summary_ms,
  video_url, video_provider, video_title, video_title_ms, video_duration_seconds,
  is_published
)
SELECT
  ic.id,
  'Understanding PTSD',
  'Memahami PTSD',
  E'## What is PTSD?\n\nPost-Traumatic Stress Disorder (PTSD) is a mental health condition that can develop after experiencing or witnessing a traumatic event.\n\n### Common Symptoms\n\n**Re-experiencing**\n- Flashbacks and nightmares\n- Intrusive memories\n- Emotional or physical reactions to reminders\n\n**Avoidance**\n- Avoiding places, people, or activities that trigger memories\n- Not wanting to talk about the trauma\n- Feeling emotionally numb\n\n**Hyperarousal**\n- Being easily startled\n- Feeling on edge\n- Difficulty sleeping\n- Irritability or anger\n\n**Negative Changes**\n- Negative thoughts about self or world\n- Feelings of guilt or blame\n- Loss of interest in activities\n\n### Important to Know\n\n- PTSD is NOT a sign of weakness\n- It''s your brain''s normal response to abnormal events\n- Recovery IS possible with proper support\n- You don''t have to face this alone\n\n### This Program\n\nYou''ll learn grounding techniques, coping strategies, and ways to process trauma safely at your own pace.',
  E'## Apa itu PTSD?\n\nKecelaruan Tekanan Pasca-Trauma (PTSD) adalah keadaan kesihatan mental yang boleh berkembang selepas mengalami atau menyaksikan peristiwa traumatik.\n\n### Simptom Biasa\n\n- Mengalami semula\n- Pengelakan\n- Kewaspadaan berlebihan\n- Perubahan negatif',
  'Learn what PTSD is, recognize its symptoms, and understand that recovery is absolutely possible with the right support and techniques.',
  'Pelajari apa itu PTSD, kenali simptomnya, dan fahami bahawa pemulihan adalah mungkin dengan sokongan dan teknik yang betul.',
  'https://www.youtube.com/watch?v=b_n9qegR7C4',
  'youtube',
  'Understanding PTSD and Trauma',
  'Memahami PTSD dan Trauma',
  356,
  true
FROM intervention_chapters ic
JOIN interventions i ON ic.intervention_id = i.id
WHERE i.category = 'ptsd' AND ic.chapter_order = 1
ON CONFLICT (chapter_id) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  video_url = EXCLUDED.video_url,
  is_published = true,
  updated_at = NOW();

-- =====================================================
-- SUMMARY
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Edited content seeded successfully!';
  RAISE NOTICE 'Chapters with videos:';
  RAISE NOTICE '- Anxiety: 2 chapters';
  RAISE NOTICE '- Depression: 2 chapters';
  RAISE NOTICE '- Insomnia: 3 chapters';
  RAISE NOTICE '- OCD: 1 chapter';
  RAISE NOTICE '- PTSD: 1 chapter';
END $$;

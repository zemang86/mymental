-- Sample Quiz Data for Testing
-- This creates a quiz for testing the quiz system

-- First, you need an intervention chapter.
-- Find an existing chapter ID or create one, then replace CHAPTER_ID_HERE below

-- Example: Get a chapter ID from your database
-- SELECT id FROM intervention_chapters LIMIT 1;

-- Insert a sample quiz
INSERT INTO intervention_quizzes (
  id,
  chapter_id,
  title,
  title_ms,
  questions,
  passing_score,
  created_at
) VALUES (
  gen_random_uuid(),
  'CHAPTER_ID_HERE', -- Replace with actual chapter ID
  'Understanding Anxiety - Knowledge Check',
  'Memahami Kebimbangan - Ujian Pengetahuan',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "Which of the following is a common physical symptom of anxiety?",
      "questionMs": "Manakah antara berikut adalah simptom fizikal kebimbangan yang biasa?",
      "options": [
        "Rapid heartbeat",
        "Broken bones",
        "Hair loss",
        "Perfect vision"
      ],
      "correctAnswer": "Rapid heartbeat",
      "explanation": "Rapid heartbeat is a common physical symptom of anxiety as part of the body''s fight-or-flight response.",
      "explanationMs": "Degupan jantung yang pantas adalah simptom fizikal kebimbangan yang biasa sebagai sebahagian daripada tindak balas lawan-atau-lari badan.",
      "isGraded": true
    },
    {
      "id": "q2",
      "type": "true_false",
      "question": "Deep breathing exercises can help reduce anxiety.",
      "questionMs": "Latihan pernafasan dalam boleh membantu mengurangkan kebimbangan.",
      "correctAnswer": "True",
      "explanation": "Deep breathing activates the parasympathetic nervous system, which helps calm the body and reduce anxiety.",
      "explanationMs": "Pernafasan dalam mengaktifkan sistem saraf parasimpatetik yang membantu menenangkan badan dan mengurangkan kebimbangan.",
      "isGraded": true
    },
    {
      "id": "q3",
      "type": "checkbox",
      "question": "Select all healthy coping strategies for anxiety:",
      "questionMs": "Pilih semua strategi mengatasi yang sihat untuk kebimbangan:",
      "options": [
        "Regular exercise",
        "Avoiding all social situations",
        "Mindfulness meditation",
        "Using alcohol to relax",
        "Talking to a therapist"
      ],
      "correctAnswer": [
        "Regular exercise",
        "Mindfulness meditation",
        "Talking to a therapist"
      ],
      "explanation": "Regular exercise, mindfulness meditation, and talking to a therapist are all healthy coping strategies. Avoiding situations and using alcohol can worsen anxiety.",
      "isGraded": true
    },
    {
      "id": "q4",
      "type": "reflection",
      "question": "Think about a time when you successfully managed your anxiety. What helped you in that moment?",
      "questionMs": "Fikirkan tentang masa ketika anda berjaya menguruskan kebimbangan anda. Apa yang membantu anda pada masa itu?",
      "isGraded": false
    }
  ]'::jsonb,
  70,
  NOW()
);

-- =====================================
-- QUICK SETUP SCRIPT
-- =====================================

-- 1. Find all chapters (to see what's available)
SELECT
  ic.id,
  ic.title,
  im.title as intervention_title
FROM intervention_chapters ic
JOIN interventions im ON ic.intervention_id = im.id
ORDER BY im.title, ic.order_index;

-- 2. Check if a chapter already has a quiz
SELECT
  c.id as chapter_id,
  c.title as chapter_title,
  CASE
    WHEN q.id IS NOT NULL THEN 'Has Quiz ✅'
    ELSE 'No Quiz ❌'
  END as quiz_status,
  q.title as quiz_title
FROM intervention_chapters c
LEFT JOIN intervention_quizzes q ON c.chapter_id = q.chapter_id
ORDER BY c.created_at DESC
LIMIT 10;

-- 3. Mark a chapter as having a quiz (after creating the quiz)
UPDATE intervention_chapters
SET has_quiz = TRUE
WHERE id = 'CHAPTER_ID_HERE'; -- Replace with actual chapter ID

-- 4. Verify the quiz was created
SELECT
  q.id,
  q.title,
  c.title as chapter_title,
  jsonb_array_length(q.questions) as question_count,
  q.passing_score
FROM intervention_quizzes q
JOIN intervention_chapters c ON q.chapter_id = c.id
ORDER BY q.created_at DESC;

-- =====================================
-- EXAMPLE: Complete Setup for a Specific Chapter
-- =====================================

-- Step 1: Get a chapter (replace with your actual query)
-- SELECT id FROM intervention_chapters WHERE title LIKE '%Breathing%' LIMIT 1;

-- Step 2: Insert quiz (example with hardcoded UUID for testing)
/*
INSERT INTO intervention_quizzes (chapter_id, title, questions, passing_score)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual chapter UUID
  'Breathing Techniques Quiz',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "How long should you inhale during box breathing?",
      "options": ["2 seconds", "4 seconds", "6 seconds", "8 seconds"],
      "correctAnswer": "4 seconds",
      "explanation": "Box breathing uses a 4-4-4-4 pattern: inhale 4, hold 4, exhale 4, hold 4.",
      "isGraded": true
    }
  ]'::jsonb,
  70
);

-- Step 3: Mark chapter as having quiz
UPDATE intervention_chapters
SET has_quiz = TRUE
WHERE id = '00000000-0000-0000-0000-000000000000';
*/

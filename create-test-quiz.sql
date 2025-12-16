-- Automated Quiz Creation Script
-- This will create a quiz for the first available chapter

-- Step 1: Find the first chapter that doesn't have a quiz yet
DO $$
DECLARE
  target_chapter_id UUID;
  quiz_id UUID;
BEGIN
  -- Get first chapter without a quiz
  SELECT ic.id INTO target_chapter_id
  FROM intervention_chapters ic
  LEFT JOIN intervention_quizzes iq ON ic.id = iq.chapter_id
  WHERE iq.id IS NULL
  LIMIT 1;

  -- If we found a chapter, create a quiz for it
  IF target_chapter_id IS NOT NULL THEN
    quiz_id := gen_random_uuid();

    -- Insert the quiz
    INSERT INTO intervention_quizzes (
      id,
      chapter_id,
      title,
      title_ms,
      questions,
      passing_score,
      created_at
    ) VALUES (
      quiz_id,
      target_chapter_id,
      'Knowledge Check - Understanding Mental Health',
      'Ujian Pengetahuan - Memahami Kesihatan Mental',
      '[
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "Which of the following is a common symptom of anxiety?",
          "questionMs": "Manakah antara berikut adalah simptom kebimbangan yang biasa?",
          "options": [
            "Rapid heartbeat",
            "Improved focus",
            "Increased energy",
            "Better sleep"
          ],
          "correctAnswer": "Rapid heartbeat",
          "explanation": "Rapid heartbeat is a common physical symptom of anxiety as part of the fight-or-flight response.",
          "explanationMs": "Degupan jantung pantas adalah simptom fizikal kebimbangan yang biasa.",
          "isGraded": true
        },
        {
          "id": "q2",
          "type": "true_false",
          "question": "Deep breathing exercises can help reduce anxiety.",
          "questionMs": "Latihan pernafasan dalam boleh membantu mengurangkan kebimbangan.",
          "correctAnswer": "True",
          "explanation": "Deep breathing activates the parasympathetic nervous system, which helps calm the body.",
          "explanationMs": "Pernafasan dalam mengaktifkan sistem saraf yang membantu menenangkan badan.",
          "isGraded": true
        },
        {
          "id": "q3",
          "type": "checkbox",
          "question": "Select all healthy coping strategies:",
          "questionMs": "Pilih semua strategi mengatasi yang sihat:",
          "options": [
            "Regular exercise",
            "Avoiding all situations",
            "Mindfulness meditation",
            "Using substances",
            "Talking to someone"
          ],
          "correctAnswer": [
            "Regular exercise",
            "Mindfulness meditation",
            "Talking to someone"
          ],
          "explanation": "Exercise, meditation, and social support are healthy coping strategies.",
          "explanationMs": "Senaman, meditasi, dan sokongan sosial adalah strategi sihat.",
          "isGraded": true
        },
        {
          "id": "q4",
          "type": "reflection",
          "question": "What is one technique you learned today that you would like to try?",
          "questionMs": "Apakah satu teknik yang anda pelajari hari ini yang ingin anda cuba?",
          "isGraded": false
        }
      ]'::jsonb,
      70,
      NOW()
    );

    -- Mark the chapter as having a quiz
    UPDATE intervention_chapters
    SET has_quiz = TRUE
    WHERE id = target_chapter_id;

    -- Show success message
    RAISE NOTICE 'Quiz created successfully for chapter ID: %', target_chapter_id;
    RAISE NOTICE 'Quiz ID: %', quiz_id;
  ELSE
    RAISE NOTICE 'No chapters found without a quiz. All chapters already have quizzes!';
  END IF;
END $$;

-- Verify the quiz was created
SELECT
  q.id as quiz_id,
  q.title as quiz_title,
  c.id as chapter_id,
  c.title as chapter_title,
  c.has_quiz,
  jsonb_array_length(q.questions) as question_count,
  q.passing_score as passing_score_percent
FROM intervention_quizzes q
JOIN intervention_chapters c ON q.chapter_id = c.id
ORDER BY q.created_at DESC
LIMIT 5;

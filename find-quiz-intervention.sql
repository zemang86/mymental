-- Find which intervention contains the quiz chapter
SELECT
  i.id as intervention_id,
  i.slug,
  i.title,
  i.category,
  c.title as chapter_title,
  c.order_index as chapter_number,
  i.is_premium
FROM interventions i
JOIN intervention_chapters c ON i.id = c.intervention_id
WHERE c.id = 'c264c05b-7e0d-4c00-a456-7a03aa1c8f03';

-- This will show you:
-- 1. The intervention slug (use this in URL)
-- 2. The chapter number (so you know which chapter to go to)

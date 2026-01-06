-- Create questions table for test questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Anyone can view questions for active tests
CREATE POLICY "Anyone can view questions for active tests"
ON public.questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tests 
    WHERE tests.id = questions.test_id 
    AND tests.is_active = true
  )
);

-- Insert sample questions for existing tests
-- Physics - Newton's Laws
INSERT INTO public.questions (test_id, question, options, correct_answer, order_index) 
SELECT id, 'What is Newton''s First Law also known as?', '["Law of Inertia", "Law of Acceleration", "Law of Action-Reaction", "Law of Gravity"]'::jsonb, 0, 1
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is the SI unit of force?', '["Joule", "Newton", "Watt", "Pascal"]'::jsonb, 1, 2
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'F = ma represents which law?', '["First Law", "Second Law", "Third Law", "Universal Law"]'::jsonb, 1, 3
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What happens when two objects interact?', '["One force acts", "Equal opposite forces act", "No force acts", "Random forces act"]'::jsonb, 1, 4
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Mass is a measure of:', '["Weight", "Volume", "Inertia", "Speed"]'::jsonb, 2, 5
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Acceleration due to gravity (g) is approximately:', '["9.8 m/s²", "10.8 m/s²", "8.8 m/s²", "11.8 m/s²"]'::jsonb, 0, 6
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which quantity is a vector?', '["Mass", "Speed", "Force", "Energy"]'::jsonb, 2, 7
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Work done is measured in:', '["Newton", "Joule", "Watt", "Hertz"]'::jsonb, 1, 8
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Power is defined as:', '["Force × Distance", "Work / Time", "Mass × Velocity", "Energy × Time"]'::jsonb, 1, 9
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Momentum = mass × ?', '["Acceleration", "Force", "Velocity", "Distance"]'::jsonb, 2, 10
FROM public.tests WHERE title = 'Newton''s Laws of Motion';

-- Chemistry - Periodic Table
INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is the atomic number of Carbon?', '["5", "6", "7", "8"]'::jsonb, 1, 1
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'H₂O is the formula for:', '["Hydrogen", "Oxygen", "Water", "Helium"]'::jsonb, 2, 2
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which element is a noble gas?', '["Oxygen", "Nitrogen", "Helium", "Hydrogen"]'::jsonb, 2, 3
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'The pH of pure water is:', '["0", "7", "14", "1"]'::jsonb, 1, 4
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'NaCl is commonly known as:', '["Sugar", "Baking Soda", "Table Salt", "Vinegar"]'::jsonb, 2, 5
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which is an alkali metal?', '["Calcium", "Sodium", "Magnesium", "Aluminum"]'::jsonb, 1, 6
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Protons have which charge?', '["Positive", "Negative", "Neutral", "Variable"]'::jsonb, 0, 7
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'How many electrons in a neutral Carbon atom?', '["4", "6", "8", "12"]'::jsonb, 1, 8
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which bond involves sharing of electrons?', '["Ionic", "Covalent", "Metallic", "Hydrogen"]'::jsonb, 1, 9
FROM public.tests WHERE title = 'Periodic Table Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'The center of an atom is called:', '["Electron cloud", "Nucleus", "Orbital", "Shell"]'::jsonb, 1, 10
FROM public.tests WHERE title = 'Periodic Table Basics';

-- Mathematics - Calculus
INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is the derivative of x²?', '["x", "2x", "2", "x³"]'::jsonb, 1, 1
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, '∫ 2x dx = ?', '["x²", "x² + C", "2x²", "x"]'::jsonb, 1, 2
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is sin(90°)?', '["0", "1", "-1", "∞"]'::jsonb, 1, 3
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'The value of π is approximately:', '["3.14", "2.14", "4.14", "3.41"]'::jsonb, 0, 4
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'log₁₀(100) = ?', '["1", "2", "10", "100"]'::jsonb, 1, 5
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is the quadratic formula?', '["x = -b/2a", "x = (-b±√(b²-4ac))/2a", "x = b²-4ac", "x = 2a/b"]'::jsonb, 1, 6
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Sum of angles in a triangle:', '["90°", "180°", "270°", "360°"]'::jsonb, 1, 7
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'If f(x) = x³, then f''(x) = ?', '["x²", "3x²", "3x", "x³"]'::jsonb, 1, 8
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is e approximately equal to?', '["2.718", "3.141", "1.414", "1.732"]'::jsonb, 0, 9
FROM public.tests WHERE title = 'Calculus Fundamentals';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'cos(0°) = ?', '["0", "1", "-1", "∞"]'::jsonb, 1, 10
FROM public.tests WHERE title = 'Calculus Fundamentals';

-- Biology - Cell Biology
INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'What is the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"]'::jsonb, 1, 1
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'DNA stands for:', '["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Acid", "Dinucleic Acid"]'::jsonb, 0, 2
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which organelle contains genetic material?', '["Ribosome", "Lysosome", "Nucleus", "Vacuole"]'::jsonb, 2, 3
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Photosynthesis occurs in:', '["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"]'::jsonb, 1, 4
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'The basic unit of life is:', '["Atom", "Molecule", "Cell", "Tissue"]'::jsonb, 2, 5
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Red blood cells carry:', '["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"]'::jsonb, 1, 6
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which vitamin is produced by sunlight?', '["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"]'::jsonb, 3, 7
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'The human body has how many chromosomes?', '["23", "46", "44", "48"]'::jsonb, 1, 8
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Insulin is produced by:', '["Liver", "Pancreas", "Kidney", "Heart"]'::jsonb, 1, 9
FROM public.tests WHERE title = 'Cell Biology';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which blood type is universal donor?', '["A", "B", "AB", "O"]'::jsonb, 3, 10
FROM public.tests WHERE title = 'Cell Biology';

-- Add questions for remaining tests (Data Structures, Thermodynamics, etc.)
-- Data Structures
INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which data structure follows LIFO principle?', '["Queue", "Stack", "Array", "Linked List"]'::jsonb, 1, 1
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which data structure follows FIFO principle?', '["Stack", "Queue", "Tree", "Graph"]'::jsonb, 1, 2
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Time complexity of binary search is:', '["O(n)", "O(log n)", "O(n²)", "O(1)"]'::jsonb, 1, 3
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Array index starts from:', '["0", "1", "-1", "Depends on language"]'::jsonb, 0, 4
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Linked list nodes contain:', '["Data only", "Pointer only", "Data and pointer", "Neither"]'::jsonb, 2, 5
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which is not a linear data structure?', '["Array", "Stack", "Queue", "Tree"]'::jsonb, 3, 6
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Hash table provides average time complexity of:', '["O(1)", "O(n)", "O(log n)", "O(n²)"]'::jsonb, 0, 7
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'In a queue, elements are added at:', '["Front", "Rear", "Middle", "Random position"]'::jsonb, 1, 8
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Space complexity of an array of size n is:', '["O(1)", "O(n)", "O(log n)", "O(n²)"]'::jsonb, 1, 9
FROM public.tests WHERE title = 'Data Structures Basics';

INSERT INTO public.questions (test_id, question, options, correct_answer, order_index)
SELECT id, 'Which operation is not typical for a stack?', '["Push", "Pop", "Peek", "Enqueue"]'::jsonb, 3, 10
FROM public.tests WHERE title = 'Data Structures Basics';
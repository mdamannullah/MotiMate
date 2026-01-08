// Mock data for local storage-based app

export interface Test {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  course: string | null;
  semester: string | null;
  duration_minutes: number;
  total_questions: number;
  is_active: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
  test_id: string;
  explanation?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  subject: string | null;
  color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

// Sample tests data
export const sampleTests: Test[] = [
  {
    id: '1',
    title: 'Basics of Thermodynamics',
    description: 'Laws of thermodynamics and heat transfer',
    subject: 'Physics',
    course: 'B.Tech',
    semester: '3',
    duration_minutes: 20,
    total_questions: 10,
    is_active: true
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    description: 'Functional groups and reactions',
    subject: 'Chemistry',
    course: 'B.Tech',
    semester: '3',
    duration_minutes: 25,
    total_questions: 10,
    is_active: true
  },
  {
    id: '3',
    title: 'Linear Algebra',
    description: 'Matrices and vector spaces',
    subject: 'Mathematics',
    course: 'B.Tech',
    semester: '2',
    duration_minutes: 30,
    total_questions: 10,
    is_active: true
  },
  {
    id: '4',
    title: 'Operating Systems Basics',
    description: 'Process scheduling and memory management',
    subject: 'Computer Science',
    course: 'B.Tech',
    semester: '4',
    duration_minutes: 25,
    total_questions: 10,
    is_active: true
  },
  {
    id: '5',
    title: 'Database Management',
    description: 'SQL and normalization',
    subject: 'Computer Science',
    course: 'B.Tech',
    semester: '4',
    duration_minutes: 20,
    total_questions: 10,
    is_active: true
  }
];

// Sample questions for each test
export const sampleQuestions: Question[] = [
  // Physics - Thermodynamics
  { id: 'q1', test_id: '1', question: 'What is the first law of thermodynamics?', options: ['Energy cannot be created or destroyed', 'Entropy always increases', 'Heat flows from hot to cold', 'Absolute zero is unattainable'], correct_answer: 0, order_index: 0 },
  { id: 'q2', test_id: '1', question: 'Which is an intensive property?', options: ['Volume', 'Mass', 'Temperature', 'Energy'], correct_answer: 2, order_index: 1 },
  { id: 'q3', test_id: '1', question: 'In an isothermal process, what remains constant?', options: ['Pressure', 'Volume', 'Temperature', 'Entropy'], correct_answer: 2, order_index: 2 },
  { id: 'q4', test_id: '1', question: 'What is the unit of entropy?', options: ['J/K', 'J', 'K', 'W'], correct_answer: 0, order_index: 3 },
  { id: 'q5', test_id: '1', question: 'Which cycle is used in refrigerators?', options: ['Carnot cycle', 'Rankine cycle', 'Reversed Carnot cycle', 'Otto cycle'], correct_answer: 2, order_index: 4 },
  { id: 'q6', test_id: '1', question: 'What is the efficiency formula for Carnot engine?', options: ['1 - Tc/Th', '1 - Th/Tc', 'Th/Tc', 'Tc/Th'], correct_answer: 0, order_index: 5 },
  { id: 'q7', test_id: '1', question: 'In adiabatic process, which is zero?', options: ['Work done', 'Heat transfer', 'Internal energy change', 'Entropy change'], correct_answer: 1, order_index: 6 },
  { id: 'q8', test_id: '1', question: 'What is absolute zero in Celsius?', options: ['-273.15°C', '0°C', '-100°C', '-460°C'], correct_answer: 0, order_index: 7 },
  { id: 'q9', test_id: '1', question: 'Which law states entropy of universe always increases?', options: ['First Law', 'Second Law', 'Third Law', 'Zeroth Law'], correct_answer: 1, order_index: 8 },
  { id: 'q10', test_id: '1', question: 'PV = nRT is called?', options: ['Boyle\'s Law', 'Charles Law', 'Ideal Gas Law', 'Avogadro\'s Law'], correct_answer: 2, order_index: 9 },

  // Chemistry - Organic
  { id: 'q11', test_id: '2', question: 'What is the functional group of alcohols?', options: ['-COOH', '-OH', '-CHO', '-CO-'], correct_answer: 1, order_index: 0 },
  { id: 'q12', test_id: '2', question: 'Which is a saturated hydrocarbon?', options: ['Ethene', 'Ethyne', 'Ethane', 'Benzene'], correct_answer: 2, order_index: 1 },
  { id: 'q13', test_id: '2', question: 'IUPAC name of CH3CHO?', options: ['Methanal', 'Ethanal', 'Propanal', 'Acetone'], correct_answer: 1, order_index: 2 },
  { id: 'q14', test_id: '2', question: 'Which reaction produces alkenes?', options: ['Addition', 'Elimination', 'Substitution', 'Rearrangement'], correct_answer: 1, order_index: 3 },
  { id: 'q15', test_id: '2', question: 'Benzene has how many carbon atoms?', options: ['4', '5', '6', '8'], correct_answer: 2, order_index: 4 },
  { id: 'q16', test_id: '2', question: 'Which is an ester functional group?', options: ['-COOH', '-COO-', '-OH', '-CHO'], correct_answer: 1, order_index: 5 },
  { id: 'q17', test_id: '2', question: 'Polymerization of ethene gives?', options: ['Polypropylene', 'Polyethylene', 'PVC', 'Nylon'], correct_answer: 1, order_index: 6 },
  { id: 'q18', test_id: '2', question: 'Which is an aromatic compound?', options: ['Cyclohexane', 'Benzene', 'Ethane', 'Propene'], correct_answer: 1, order_index: 7 },
  { id: 'q19', test_id: '2', question: 'Grignard reagent contains?', options: ['Sodium', 'Magnesium', 'Lithium', 'Potassium'], correct_answer: 1, order_index: 8 },
  { id: 'q20', test_id: '2', question: 'Which is a ketone?', options: ['CH3CHO', 'CH3COCH3', 'CH3COOH', 'CH3OH'], correct_answer: 1, order_index: 9 },

  // Mathematics - Linear Algebra
  { id: 'q21', test_id: '3', question: 'What is the determinant of identity matrix?', options: ['0', '1', '-1', 'Undefined'], correct_answer: 1, order_index: 0 },
  { id: 'q22', test_id: '3', question: 'Rank of a null matrix is?', options: ['0', '1', 'n', 'Undefined'], correct_answer: 0, order_index: 1 },
  { id: 'q23', test_id: '3', question: 'If A and B are square matrices, (AB)^T equals?', options: ['A^T B^T', 'B^T A^T', 'AB', '(BA)^T'], correct_answer: 1, order_index: 2 },
  { id: 'q24', test_id: '3', question: 'Eigenvalue of identity matrix is?', options: ['0', '1', '-1', 'Any real number'], correct_answer: 1, order_index: 3 },
  { id: 'q25', test_id: '3', question: 'A matrix is singular if determinant is?', options: ['1', '-1', '0', 'Positive'], correct_answer: 2, order_index: 4 },
  { id: 'q26', test_id: '3', question: 'Trace of a matrix is sum of?', options: ['All elements', 'Row elements', 'Diagonal elements', 'Column elements'], correct_answer: 2, order_index: 5 },
  { id: 'q27', test_id: '3', question: 'If A^T = A, matrix is called?', options: ['Symmetric', 'Skew-symmetric', 'Orthogonal', 'Hermitian'], correct_answer: 0, order_index: 6 },
  { id: 'q28', test_id: '3', question: 'Number of pivots equals?', options: ['Rows', 'Columns', 'Rank', 'Determinant'], correct_answer: 2, order_index: 7 },
  { id: 'q29', test_id: '3', question: 'Inverse of 2x2 matrix [a,b;c,d] has denominator?', options: ['a+d', 'ad+bc', 'ad-bc', 'a-d'], correct_answer: 2, order_index: 8 },
  { id: 'q30', test_id: '3', question: 'Orthogonal matrix satisfies?', options: ['A^T = A', 'A^T A = I', 'A = A^-1', 'det(A) = 1'], correct_answer: 1, order_index: 9 },

  // Computer Science - OS
  { id: 'q31', test_id: '4', question: 'Which scheduling is non-preemptive?', options: ['Round Robin', 'SRTF', 'FCFS', 'Priority (preemptive)'], correct_answer: 2, order_index: 0 },
  { id: 'q32', test_id: '4', question: 'Deadlock requires how many conditions?', options: ['2', '3', '4', '5'], correct_answer: 2, order_index: 1 },
  { id: 'q33', test_id: '4', question: 'Virtual memory uses?', options: ['RAM only', 'Disk only', 'Both RAM and Disk', 'Cache'], correct_answer: 2, order_index: 2 },
  { id: 'q34', test_id: '4', question: 'Page fault occurs when?', options: ['Page in RAM', 'Page not in RAM', 'Page is dirty', 'Page is clean'], correct_answer: 1, order_index: 3 },
  { id: 'q35', test_id: '4', question: 'Which is a mutex property?', options: ['Many processes in CS', 'Mutual exclusion', 'No progress', 'Starvation'], correct_answer: 1, order_index: 4 },
  { id: 'q36', test_id: '4', question: 'Semaphore with value 1 is called?', options: ['Counting', 'Binary', 'General', 'Mutex'], correct_answer: 1, order_index: 5 },
  { id: 'q37', test_id: '4', question: 'LRU stands for?', options: ['Last Recently Used', 'Least Recently Used', 'Last Removed Used', 'Least Removed Used'], correct_answer: 1, order_index: 6 },
  { id: 'q38', test_id: '4', question: 'Context switch saves?', options: ['Only registers', 'Only PC', 'PCB state', 'Memory'], correct_answer: 2, order_index: 7 },
  { id: 'q39', test_id: '4', question: 'Thrashing causes?', options: ['High CPU utilization', 'Low page faults', 'High page faults', 'Fast execution'], correct_answer: 2, order_index: 8 },
  { id: 'q40', test_id: '4', question: 'Which algorithm has convoy effect?', options: ['SJF', 'FCFS', 'RR', 'Priority'], correct_answer: 1, order_index: 9 },

  // Computer Science - DBMS
  { id: 'q41', test_id: '5', question: 'Which is a DML command?', options: ['CREATE', 'ALTER', 'SELECT', 'DROP'], correct_answer: 2, order_index: 0 },
  { id: 'q42', test_id: '5', question: 'Primary key allows NULL?', options: ['Yes', 'No', 'Sometimes', 'Depends'], correct_answer: 1, order_index: 1 },
  { id: 'q43', test_id: '5', question: 'BCNF is stricter than?', options: ['1NF', '2NF', '3NF', '4NF'], correct_answer: 2, order_index: 2 },
  { id: 'q44', test_id: '5', question: 'JOIN combines tables based on?', options: ['Primary key only', 'Foreign key only', 'Common column', 'Any column'], correct_answer: 2, order_index: 3 },
  { id: 'q45', test_id: '5', question: 'ACID property I stands for?', options: ['Integrity', 'Isolation', 'Identity', 'Index'], correct_answer: 1, order_index: 4 },
  { id: 'q46', test_id: '5', question: 'Which removes duplicates?', options: ['UNION ALL', 'UNION', 'JOIN', 'INTERSECT ALL'], correct_answer: 1, order_index: 5 },
  { id: 'q47', test_id: '5', question: 'View is a?', options: ['Physical table', 'Virtual table', 'Index', 'Trigger'], correct_answer: 1, order_index: 6 },
  { id: 'q48', test_id: '5', question: 'B+ tree is used for?', options: ['Hashing', 'Indexing', 'Sorting', 'Joining'], correct_answer: 1, order_index: 7 },
  { id: 'q49', test_id: '5', question: 'Relational algebra is?', options: ['Procedural', 'Non-procedural', 'Both', 'Neither'], correct_answer: 0, order_index: 8 },
  { id: 'q50', test_id: '5', question: 'Transaction log helps in?', options: ['Indexing', 'Recovery', 'Optimization', 'Normalization'], correct_answer: 1, order_index: 9 },
];

// AI Tutor knowledge base
export const knowledgeBase: Record<string, string[]> = {
  physics: [
    "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
    "The formula for kinetic energy is KE = ½mv², where m is mass and v is velocity.",
    "Thermodynamics deals with heat, work, and energy transfer. The first law states energy is conserved.",
    "In wave mechanics, wavelength (λ) × frequency (f) = speed of wave (v).",
  ],
  chemistry: [
    "The periodic table organizes elements by atomic number and chemical properties.",
    "In organic chemistry, functional groups determine the chemical behavior of molecules.",
    "Acids donate protons (H+), while bases accept protons according to the Brønsted-Lowry theory.",
    "Chemical equilibrium is when forward and reverse reaction rates are equal.",
  ],
  mathematics: [
    "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a for solving ax² + bx + c = 0.",
    "In calculus, the derivative represents the rate of change of a function.",
    "Matrix multiplication is not commutative: AB ≠ BA in general.",
    "Integration finds the area under a curve, the reverse of differentiation.",
  ],
  'computer science': [
    "Big O notation describes algorithm complexity. O(n) is linear, O(log n) is logarithmic.",
    "A stack is LIFO (Last In First Out), while a queue is FIFO (First In First Out).",
    "SQL uses SELECT, FROM, WHERE, and JOIN for database queries.",
    "Object-oriented programming has four pillars: encapsulation, inheritance, polymorphism, and abstraction.",
  ],
  general: [
    "I can help you understand concepts step by step. Just ask about any topic!",
    "Practice problems regularly to reinforce your understanding of concepts.",
    "Breaking complex problems into smaller parts makes them easier to solve.",
    "Connecting new knowledge to what you already know helps with retention.",
  ]
};

// Get tests
export const getTests = (): Test[] => {
  return sampleTests.filter(t => t.is_active);
};

// Get questions for a test
export const getQuestionsForTest = (testId: string): Question[] => {
  return sampleQuestions.filter(q => q.test_id === testId).sort((a, b) => a.order_index - b.order_index);
};

// Get test by ID
export const getTestById = (testId: string): Test | undefined => {
  return sampleTests.find(t => t.id === testId && t.is_active);
};

// Notes storage helpers
export const getNotes = (userId: string): Note[] => {
  try {
    const key = `motimate_notes_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export const saveNotes = (userId: string, notes: Note[]) => {
  const key = `motimate_notes_${userId}`;
  localStorage.setItem(key, JSON.stringify(notes));
};

export const addNote = (userId: string, note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'color' | 'is_pinned'>): Note => {
  const notes = getNotes(userId);
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    user_id: userId,
    color: '#FEF3C7',
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  notes.unshift(newNote);
  saveNotes(userId, notes);
  return newNote;
};

export const updateNote = (userId: string, noteId: string, updates: Partial<Note>): Note | null => {
  const notes = getNotes(userId);
  const index = notes.findIndex(n => n.id === noteId);
  if (index === -1) return null;
  
  notes[index] = { ...notes[index], ...updates, updated_at: new Date().toISOString() };
  saveNotes(userId, notes);
  return notes[index];
};

export const deleteNote = (userId: string, noteId: string): boolean => {
  const notes = getNotes(userId);
  const filtered = notes.filter(n => n.id !== noteId);
  if (filtered.length === notes.length) return false;
  saveNotes(userId, filtered);
  return true;
};

// AI Tutor response generator
export const generateAiResponse = (message: string, profile?: { subjects?: string[] }): string => {
  const lowerMessage = message.toLowerCase();
  
  // Detect subject from message or user profile
  let subject = 'general';
  const subjects = ['physics', 'chemistry', 'mathematics', 'math', 'computer science', 'cs', 'programming'];
  
  for (const s of subjects) {
    if (lowerMessage.includes(s)) {
      subject = s === 'math' ? 'mathematics' : s === 'cs' || s === 'programming' ? 'computer science' : s;
      break;
    }
  }
  
  // If no subject detected, try user's subjects
  if (subject === 'general' && profile?.subjects?.length) {
    const userSubject = profile.subjects[0].toLowerCase();
    if (knowledgeBase[userSubject]) {
      subject = userSubject;
    }
  }
  
  // Get relevant responses
  const responses = knowledgeBase[subject] || knowledgeBase.general;
  
  // Simple greeting handling
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage === 'hi') {
    return "Hello! 👋 I'm your AI study companion. How can I help you learn today? You can ask me about Physics, Chemistry, Mathematics, or Computer Science!";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're welcome! 😊 Feel free to ask more questions anytime. Keep up the great work with your studies!";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I can help you with:\n\n📚 **Explaining Concepts** - Ask about any topic\n🧮 **Solving Problems** - Walk through solutions step by step\n💡 **Study Tips** - Provide learning strategies\n❓ **Answering Questions** - Clarify doubts\n\nJust type your question and I'll do my best to help!";
  }
  
  // Return a relevant response with educational context
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return `Great question about ${subject === 'general' ? 'your studies' : subject}! 📖\n\n${randomResponse}\n\n💡 **Tip:** ${knowledgeBase.general[Math.floor(Math.random() * knowledgeBase.general.length)]}\n\nWould you like me to explain this further or give you a practice problem?`;
};

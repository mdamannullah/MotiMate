import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiCard } from '@/components/ui/MotiCard';
import { useData } from '@/contexts/DataContext';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { toast } from 'sonner';

// Demo MCQ questions for different subjects
const questionsBank: Record<string, { question: string; options: string[]; correct: number }[]> = {
  'Physics': [
    { question: "What is Newton's First Law also known as?", options: ["Law of Inertia", "Law of Acceleration", "Law of Action-Reaction", "Law of Gravity"], correct: 0 },
    { question: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 1 },
    { question: "F = ma represents which law?", options: ["First Law", "Second Law", "Third Law", "Universal Law"], correct: 1 },
    { question: "What happens when two objects interact?", options: ["One force acts", "Equal opposite forces act", "No force acts", "Random forces act"], correct: 1 },
    { question: "Mass is a measure of:", options: ["Weight", "Volume", "Inertia", "Speed"], correct: 2 },
    { question: "Acceleration due to gravity (g) is approximately:", options: ["9.8 m/s²", "10.8 m/s²", "8.8 m/s²", "11.8 m/s²"], correct: 0 },
    { question: "Which quantity is a vector?", options: ["Mass", "Speed", "Force", "Energy"], correct: 2 },
    { question: "Work done is measured in:", options: ["Newton", "Joule", "Watt", "Hertz"], correct: 1 },
    { question: "Power is defined as:", options: ["Force × Distance", "Work / Time", "Mass × Velocity", "Energy × Time"], correct: 1 },
    { question: "Momentum = mass × ?", options: ["Acceleration", "Force", "Velocity", "Distance"], correct: 2 },
  ],
  'Chemistry': [
    { question: "What is the atomic number of Carbon?", options: ["5", "6", "7", "8"], correct: 1 },
    { question: "H₂O is the formula for:", options: ["Hydrogen", "Oxygen", "Water", "Helium"], correct: 2 },
    { question: "Which element is a noble gas?", options: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"], correct: 2 },
    { question: "The pH of pure water is:", options: ["0", "7", "14", "1"], correct: 1 },
    { question: "NaCl is commonly known as:", options: ["Sugar", "Baking Soda", "Table Salt", "Vinegar"], correct: 2 },
    { question: "Which is an alkali metal?", options: ["Calcium", "Sodium", "Magnesium", "Aluminum"], correct: 1 },
    { question: "Protons have which charge?", options: ["Positive", "Negative", "Neutral", "Variable"], correct: 0 },
    { question: "How many electrons in a neutral Carbon atom?", options: ["4", "6", "8", "12"], correct: 1 },
    { question: "Which bond involves sharing of electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correct: 1 },
    { question: "The center of an atom is called:", options: ["Electron cloud", "Nucleus", "Orbital", "Shell"], correct: 1 },
  ],
  'Mathematics': [
    { question: "What is the derivative of x²?", options: ["x", "2x", "2", "x³"], correct: 1 },
    { question: "∫ 2x dx = ?", options: ["x²", "x² + C", "2x²", "x"], correct: 1 },
    { question: "What is sin(90°)?", options: ["0", "1", "-1", "∞"], correct: 1 },
    { question: "The value of π is approximately:", options: ["3.14", "2.14", "4.14", "3.41"], correct: 0 },
    { question: "log₁₀(100) = ?", options: ["1", "2", "10", "100"], correct: 1 },
    { question: "What is the quadratic formula?", options: ["x = -b/2a", "x = (-b±√(b²-4ac))/2a", "x = b²-4ac", "x = 2a/b"], correct: 1 },
    { question: "Sum of angles in a triangle:", options: ["90°", "180°", "270°", "360°"], correct: 1 },
    { question: "If f(x) = x³, then f'(x) = ?", options: ["x²", "3x²", "3x", "x³"], correct: 1 },
    { question: "What is e approximately equal to?", options: ["2.718", "3.141", "1.414", "1.732"], correct: 0 },
    { question: "cos(0°) = ?", options: ["0", "1", "-1", "∞"], correct: 1 },
  ],
  'Biology': [
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"], correct: 1 },
    { question: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Acid", "Dinucleic Acid"], correct: 0 },
    { question: "Which organelle contains genetic material?", options: ["Ribosome", "Lysosome", "Nucleus", "Vacuole"], correct: 2 },
    { question: "Photosynthesis occurs in:", options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], correct: 1 },
    { question: "The basic unit of life is:", options: ["Atom", "Molecule", "Cell", "Tissue"], correct: 2 },
    { question: "Red blood cells carry:", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], correct: 1 },
    { question: "Which vitamin is produced by sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
    { question: "The human body has how many chromosomes?", options: ["23", "46", "44", "48"], correct: 1 },
    { question: "Insulin is produced by:", options: ["Liver", "Pancreas", "Kidney", "Heart"], correct: 1 },
    { question: "Which blood type is universal donor?", options: ["A", "B", "AB", "O"], correct: 3 },
  ],
};

const testDetails: Record<string, { subject: string; topic: string; duration: number }> = {
  '1': { subject: 'Physics', topic: "Newton's Laws", duration: 20 },
  '2': { subject: 'Chemistry', topic: 'Periodic Table', duration: 15 },
  '3': { subject: 'Mathematics', topic: 'Calculus Basics', duration: 30 },
  '4': { subject: 'Biology', topic: 'Cell Structure', duration: 18 },
};

export default function TakeTestScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { addTestResult, addStudyTime } = useData();

  const test = testDetails[testId || '1'];
  const questions = questionsBank[test?.subject] || questionsBank['Physics'];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState((test?.duration || 20) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const timeTaken = (test?.duration || 20) - Math.floor(timeLeft / 60);

    // Save result
    addTestResult({
      subject: test.subject,
      topic: test.topic,
      score: correct,
      total: questions.length,
      percentage,
      date: new Date().toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    });

    // Add study time
    addStudyTime(timeTaken);

    toast.success(`Test completed! You scored ${percentage}%`);
    setShowResults(true);
  };

  // Results screen
  if (showResults) {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const percentage = Math.round((correct / questions.length) * 100);

    return (
      <div className="mobile-container min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
            percentage >= 70 ? 'bg-success/10' : percentage >= 50 ? 'bg-primary/10' : 'bg-destructive/10'
          }`}
        >
          <span className={`text-4xl font-bold ${
            percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-primary' : 'text-destructive'
          }`}>
            {percentage}%
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2"
        >
          {percentage >= 70 ? 'Great Job! 🎉' : percentage >= 50 ? 'Good Effort! 👍' : 'Keep Practicing! 💪'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-8"
        >
          You got {correct} out of {questions.length} questions correct
        </motion.p>

        <div className="w-full space-y-3">
          <MotiButton onClick={() => navigate('/tests')} size="full">
            Back to Tests
          </MotiButton>
          <MotiButton onClick={() => navigate('/analytics')} variant="outline" size="full">
            View Analytics
          </MotiButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      {/* Header with timer */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold">{test.subject}</h1>
            <p className="text-xs text-muted-foreground">{test.topic}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}>
            <Clock size={16} />
            <span className="font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </header>

      {/* Question */}
      <main className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MotiCard className="mb-6">
              <p className="text-lg font-medium leading-relaxed">
                {questions[currentQuestion].question}
              </p>
            </MotiCard>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    answers[currentQuestion] === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      answers[currentQuestion] === index
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-4 safe-bottom">
        <div className="flex items-center gap-3">
          <MotiButton
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            variant="outline"
            disabled={currentQuestion === 0}
            icon={<ArrowLeft size={18} />}
          >
            Prev
          </MotiButton>

          <div className="flex-1">
            {currentQuestion === questions.length - 1 ? (
              <MotiButton
                onClick={handleSubmit}
                size="full"
                icon={<Flag size={18} />}
              >
                Submit Test
              </MotiButton>
            ) : (
              <MotiButton
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                size="full"
                icon={<ArrowRight size={18} />}
              >
                Next
              </MotiButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

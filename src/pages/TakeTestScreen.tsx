import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiCard } from '@/components/ui/MotiCard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ArrowLeft, ArrowRight, Flag, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

interface TestInfo {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  duration_minutes: number | null;
  total_questions: number | null;
}

export default function TakeTestScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { addTestResult, addStudyTime } = useData();
  const { user } = useAuth();

  const [test, setTest] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (testId) {
      fetchTestAndQuestions();
    }
  }, [testId]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch test info
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .eq('is_active', true)
        .maybeSingle();

      if (testError) throw testError;
      if (!testData) {
        setError('Test not found or is no longer available');
        return;
      }

      setTest(testData);
      setTimeLeft((testData.duration_minutes || 30) * 60);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', testId)
        .order('order_index');

      if (questionsError) throw questionsError;
      
      if (!questionsData || questionsData.length === 0) {
        setError('No questions available for this test');
        return;
      }

      // Parse options from JSONB
      const parsedQuestions: Question[] = questionsData.map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
        correct_answer: q.correct_answer,
        order_index: q.order_index || 0
      }));

      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(null));
    } catch (err) {
      console.error('Error fetching test:', err);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (isSubmitted || loading || !test) return;
    
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
  }, [isSubmitted, loading, test]);

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

  const handleSubmit = async () => {
    if (!test || !user || submitting) return;
    
    setSubmitting(true);
    setIsSubmitted(true);
    
    // Calculate score
    let correct = 0;
    const answersJson: Record<string, { selected: number | null; correct: number }> = {};
    
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
      answersJson[q.id] = {
        selected: answers[i],
        correct: q.correct_answer
      };
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const timeTakenSeconds = (test.duration_minutes || 30) * 60 - timeLeft;

    try {
      // Save to database
      const { error: insertError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          test_id: test.id,
          score: correct,
          total_questions: questions.length,
          time_taken_seconds: timeTakenSeconds,
          answers: answersJson
        });

      if (insertError) throw insertError;

      // Update local state
      addTestResult({
        subject: test.subject,
        topic: test.title,
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

      // Add study time (in minutes)
      addStudyTime(Math.ceil(timeTakenSeconds / 60));

      toast.success(`Test completed! You scored ${percentage}%`);
    } catch (err) {
      console.error('Error saving result:', err);
      toast.error('Failed to save result, but your score was calculated');
    } finally {
      setSubmitting(false);
      setShowResults(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mobile-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !test) {
    return (
      <div className="mobile-container min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold mb-2">Oops!</h1>
          <p className="text-muted-foreground mb-6">{error || 'Test not found'}</p>
          <MotiButton onClick={() => navigate('/tests')}>
            Back to Tests
          </MotiButton>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
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
            <p className="text-xs text-muted-foreground">{test.title}</p>
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
                icon={submitting ? <Loader2 size={18} className="animate-spin" /> : <Flag size={18} />}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
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

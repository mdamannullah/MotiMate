import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, ChevronDown, Check, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  countries, 
  indianStates, 
  educationLevels, 
  departments, 
  getBoardsForState, 
  getUniversitiesForState,
  getSubjectsForDepartment 
} from '@/data/educationData';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Location
  const [country, setCountry] = useState('IN');
  const [state, setState] = useState('');
  const [board, setBoard] = useState('');
  const [university, setUniversity] = useState('');
  const [isAutonomous, setIsAutonomous] = useState(false);
  
  // Education
  const [educationLevel, setEducationLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // Dropdowns
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendingOTP, setSendingOTP] = useState(false);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!country) newErrors.country = 'Please select your country';
    if (country === 'IN' && !state) newErrors.state = 'Please select your state';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!educationLevel) newErrors.education = 'Please select your education level';
    if (!department) newErrors.department = 'Please select your department/stream';
    if (selectedSubjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setSendingOTP(true);
    
    try {
      // Store education info
      const educationData = {
        country,
        state,
        board,
        university,
        isAutonomous,
        level: educationLevel,
        department,
        subjects: selectedSubjects
      };
      localStorage.setItem('motimate_education', JSON.stringify(educationData));
      
      // Send OTP via edge function
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email, name, type: 'signup' }
      });

      if (error) throw error;
      
      // Store pending signup data
      localStorage.setItem('motimate_pending_signup', JSON.stringify({ name, email, password }));
      
      toast.success('OTP sent to your email! 📧');
      navigate('/verify-otp', { state: { email, type: 'signup' } });
      
    } catch (error) {
      console.error('OTP error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  const selectedEducation = educationLevels.find(e => e.id === educationLevel);
  const availableDepartments = educationLevel ? departments[educationLevel] || [] : [];
  const availableBoards = state ? getBoardsForState(state) : [];
  const availableUniversities = state ? getUniversitiesForState(state) : [];
  const availableSubjects = department ? getSubjectsForDepartment(department) : [];
  const isSchoolLevel = educationLevel === 'school';

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <motion.button
        onClick={handleBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col px-6 pt-20 pb-8 overflow-y-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
              {i < 2 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join MotiMate and start learning smarter</p>
              </div>

              <div className="space-y-4">
                <MotiInput
                  label="Full Name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  icon={<User size={20} />}
                />
                <MotiInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  icon={<Mail size={20} />}
                />
                <MotiInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  icon={<Lock size={20} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
                <MotiInput
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  icon={<Lock size={20} />}
                />
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleNext} size="full">Continue</MotiButton>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your Location</h1>
                <p className="text-muted-foreground">This helps personalize your content</p>
              </div>

              <div className="space-y-4">
                {/* Country Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className={`moti-input flex items-center justify-between ${errors.country ? 'border-destructive' : ''}`}
                  >
                    <span className={country ? 'text-foreground' : 'text-muted-foreground'}>
                      {countries.find(c => c.code === country)?.name || 'Select country'}
                    </span>
                    <ChevronDown size={20} className={`transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-card rounded-xl border border-border max-h-48 overflow-y-auto shadow-lg"
                      >
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setCountry(c.code); setState(''); setShowCountryDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                          >
                            <span className="flex-1">{c.name}</span>
                            {country === c.code && <Check size={18} className="text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* State Dropdown (for India) */}
                {country === 'IN' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">State</label>
                    <button
                      onClick={() => setShowStateDropdown(!showStateDropdown)}
                      className={`moti-input flex items-center justify-between ${errors.state ? 'border-destructive' : ''}`}
                    >
                      <span className={state ? 'text-foreground' : 'text-muted-foreground'}>
                        {state || 'Select state'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    <AnimatePresence>
                      {showStateDropdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-card rounded-xl border border-border max-h-48 overflow-y-auto shadow-lg"
                        >
                          {indianStates.map((s) => (
                            <button
                              key={s}
                              onClick={() => { setState(s); setBoard(''); setUniversity(''); setShowStateDropdown(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                            >
                              <span className="flex-1">{s}</span>
                              {state === s && <Check size={18} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Board Dropdown (for school students) */}
                {state && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">Board (for School/+2)</label>
                    <button
                      onClick={() => setShowBoardDropdown(!showBoardDropdown)}
                      className="moti-input flex items-center justify-between"
                    >
                      <span className={board ? 'text-foreground' : 'text-muted-foreground'}>
                        {board || 'Select board (optional)'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${showBoardDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showBoardDropdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-card rounded-xl border border-border max-h-48 overflow-y-auto shadow-lg"
                        >
                          {availableBoards.map((b) => (
                            <button
                              key={b}
                              onClick={() => { setBoard(b); setShowBoardDropdown(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                            >
                              <span className="flex-1">{b}</span>
                              {board === b && <Check size={18} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* University Dropdown (for college students) */}
                {state && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">University (for College)</label>
                    <button
                      onClick={() => setShowUniversityDropdown(!showUniversityDropdown)}
                      className="moti-input flex items-center justify-between"
                    >
                      <span className={university ? 'text-foreground' : 'text-muted-foreground'}>
                        {university || 'Select university (optional)'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${showUniversityDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showUniversityDropdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-card rounded-xl border border-border max-h-48 overflow-y-auto shadow-lg"
                        >
                          {availableUniversities.map((u) => (
                            <button
                              key={u}
                              onClick={() => { setUniversity(u); setShowUniversityDropdown(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                            >
                              <span className="flex-1">{u}</span>
                              {university === u && <Check size={18} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Autonomous College Checkbox */}
                {university && university !== 'Autonomous College' && (
                  <motion.label 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isAutonomous}
                      onChange={(e) => setIsAutonomous(e.target.checked)}
                      className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-sm">Autonomous College</p>
                      <p className="text-xs text-muted-foreground">Check if your college is autonomous</p>
                    </div>
                  </motion.label>
                )}
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleNext} size="full">Continue</MotiButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Education Details</h1>
                <p className="text-muted-foreground">This helps AI personalize your learning</p>
              </div>

              <div className="space-y-4">
                {/* Education Level Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Education Level</label>
                  <button
                    onClick={() => setShowEducationDropdown(!showEducationDropdown)}
                    className={`moti-input flex items-center justify-between ${errors.education ? 'border-destructive' : ''}`}
                  >
                    <span className={selectedEducation ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedEducation ? `${selectedEducation.icon} ${selectedEducation.name}` : 'Select education level'}
                    </span>
                    <ChevronDown size={20} className={`transition-transform ${showEducationDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {errors.education && <p className="text-sm text-destructive mt-1">{errors.education}</p>}
                  
                  <AnimatePresence>
                    {showEducationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-card rounded-xl border border-border max-h-60 overflow-y-auto shadow-lg"
                      >
                        {educationLevels.map((edu) => (
                          <button
                            key={edu.id}
                            onClick={() => {
                              setEducationLevel(edu.id);
                              setDepartment('');
                              setSelectedSubjects([]);
                              setShowEducationDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                          >
                            <span className="text-xl">{edu.icon}</span>
                            <span className="flex-1">{edu.name}</span>
                            {educationLevel === edu.id && <Check size={18} className="text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Department Dropdown */}
                {educationLevel && availableDepartments.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">Department / Stream</label>
                    <button
                      onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      className={`moti-input flex items-center justify-between ${errors.department ? 'border-destructive' : ''}`}
                    >
                      <span className={department ? 'text-foreground' : 'text-muted-foreground'}>
                        {department || 'Select your department'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
                    
                    <AnimatePresence>
                      {showDepartmentDropdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-card rounded-xl border border-border max-h-60 overflow-y-auto shadow-lg"
                        >
                          {availableDepartments.map((dept) => (
                            <button
                              key={dept}
                              onClick={() => {
                                setDepartment(dept);
                                setSelectedSubjects([]);
                                setShowDepartmentDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                            >
                              <span className="flex-1">{dept}</span>
                              {department === dept && <Check size={18} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Subject Selection */}
                {department && availableSubjects.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Your Subjects 
                      <span className="text-muted-foreground font-normal"> (select all that apply)</span>
                    </label>
                    {errors.subjects && <p className="text-sm text-destructive mb-2">{errors.subjects}</p>}
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                      {availableSubjects.map((subject) => (
                        <motion.button
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                            selectedSubjects.includes(subject)
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-card border-border hover:border-primary/50'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                            selectedSubjects.includes(subject)
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {selectedSubjects.includes(subject) && (
                              <Check size={12} className="text-primary-foreground" />
                            )}
                          </div>
                          <span className="flex-1 truncate">{subject}</span>
                        </motion.button>
                      ))}
                    </div>
                    {selectedSubjects.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleSubmit} size="full" loading={isLoading || sendingOTP}>
                  {sendingOTP ? 'Sending OTP...' : 'Sign Up'}
                </MotiButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-semibold">Login</button>
        </p>
      </div>
    </div>
  );
}

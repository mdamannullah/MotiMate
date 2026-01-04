import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, ChevronDown, Check, MapPin, Building2, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  countries, 
  educationLevels,
  ugCourses,
  pgCourses,
  years,
  semesters,
  regulations,
  schoolStreams,
  getStatesForCountry,
  getDistrictsForState,
  getBoardsForState, 
  getUniversitiesForState,
  getCollegesForUniversity,
  getDepartmentsForCourse,
  getSubjectsForDepartment,
  validateName,
  validateEmail,
  validatePassword
} from '@/data/educationData';

interface DropdownProps {
  label: string;
  value: string;
  options: string[] | { id?: string; code?: string; name: string; flag?: string; category?: string }[];
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  showFlag?: boolean;
}

const Dropdown = ({ label, value, options, onChange, placeholder, error, showFlag }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getDisplayValue = () => {
    if (!value) return null;
    const option = options.find(o => {
      if (typeof o === 'string') return o === value;
      return o.id === value || o.code === value || o.name === value;
    });
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      return showFlag && option.flag ? `${option.flag} ${option.name}` : option.name;
    }
    return value;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`moti-input flex items-center justify-between ${error ? 'border-destructive' : ''}`}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {getDisplayValue() || placeholder}
        </span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute z-50 w-full mt-2 bg-card rounded-xl border border-border max-h-48 overflow-y-auto shadow-lg"
          >
            {options.map((option, idx) => {
              const optionValue = typeof option === 'string' ? option : (option.id || option.code || option.name);
              const optionName = typeof option === 'string' ? option : option.name;
              const optionFlag = typeof option === 'object' && option.flag;
              const isSelected = value === optionValue || value === optionName;
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { onChange(optionValue); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
                >
                  {showFlag && optionFlag && <span className="text-xl">{optionFlag}</span>}
                  <span className="flex-1">{optionName}</span>
                  {isSelected && <Check size={18} className="text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SignupScreen() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { addNotification } = useData();
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Step 1: Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: Location
  const [country, setCountry] = useState('IN');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  
  // Step 3: Education
  const [educationLevel, setEducationLevel] = useState('');
  const [board, setBoard] = useState('');
  const [stream, setStream] = useState('');
  const [course, setCourse] = useState('');
  const [university, setUniversity] = useState('');
  const [college, setCollege] = useState('');
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [regulation, setRegulation] = useState('');
  
  // Step 4: Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendingOTP, setSendingOTP] = useState(false);

  // Get derived data
  const states = getStatesForCountry(country);
  const districts = state ? getDistrictsForState(state) : [];
  const boards = state ? getBoardsForState(state) : [];
  const universities = state ? getUniversitiesForState(state) : [];
  const colleges = university ? getCollegesForUniversity(university) : [];
  
  const isSchoolLevel = ['primary', 'middle', 'secondary', 'higher_secondary'].includes(educationLevel);
  const isHigherEducation = ['undergraduate', 'postgraduate', 'diploma', 'phd'].includes(educationLevel);
  const courses = educationLevel === 'postgraduate' ? pgCourses : ugCourses;
  const departments = course ? getDepartmentsForCourse(course) : [];
  const subjects = department ? getSubjectsForDepartment(department) : (stream ? getSubjectsForDepartment(stream) : []);

  // Reset dependent fields when parent changes
  useEffect(() => { setState(''); setDistrict(''); }, [country]);
  useEffect(() => { setDistrict(''); setBoard(''); setUniversity(''); }, [state]);
  useEffect(() => { 
    setBoard(''); setStream(''); setCourse(''); setUniversity(''); 
    setCollege(''); setDepartment(''); setYear(''); setSemester(''); 
    setSelectedSubjects([]);
  }, [educationLevel]);
  useEffect(() => { setDepartment(''); setSelectedSubjects([]); }, [course]);
  useEffect(() => { setCollege(''); }, [university]);
  useEffect(() => { setSelectedSubjects([]); }, [department, stream]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    const nameValidation = validateName(name);
    if (!nameValidation.valid) newErrors.name = nameValidation.error!;
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) newErrors.email = emailValidation.error!;
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error!;
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!country) newErrors.country = 'Please select your country';
    if (!state) newErrors.state = 'Please select your state';
    if (country === 'IN' && !district) newErrors.district = 'Please select your district';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!educationLevel) newErrors.education = 'Please select your education level';
    
    if (isSchoolLevel) {
      if (!board) newErrors.board = 'Please select your board';
      if (educationLevel === 'higher_secondary' && !stream) newErrors.stream = 'Please select your stream';
    } else if (isHigherEducation) {
      if (!course) newErrors.course = 'Please select your course';
      if (!university) newErrors.university = 'Please select your university';
      if (!college) newErrors.college = 'Please enter your college name';
      if (!department) newErrors.department = 'Please select your department';
      if (!year) newErrors.year = 'Please select your year';
      if (!semester) newErrors.semester = 'Please select your semester';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (selectedSubjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
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
    if (!validateStep4()) return;
    
    setSendingOTP(true);
    
    try {
      // Store comprehensive education info
      const educationData = {
        country,
        state,
        district,
        level: educationLevel,
        board: isSchoolLevel ? board : null,
        stream: isSchoolLevel && educationLevel === 'higher_secondary' ? stream : null,
        course: isHigherEducation ? course : null,
        university: isHigherEducation ? university : null,
        college: isHigherEducation ? college : null,
        isAutonomous,
        department: isHigherEducation ? department : null,
        year: isHigherEducation ? year : null,
        semester: isHigherEducation ? semester : null,
        regulation: isHigherEducation ? regulation : null,
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
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= i + 1 ? 'bg-primary' : 'bg-muted'}`} />
              {i < totalSteps - 1 && <div className={`w-6 h-0.5 transition-colors ${step > i + 1 ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">Step {step} of {totalSteps}</p>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-muted-foreground text-sm">Enter your personal details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <MotiInput
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name (alphabets only)"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    error={errors.name}
                    icon={<User size={20} />}
                  />
                </div>
                <MotiInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  icon={<Mail size={20} />}
                />
                <div>
                  <MotiInput
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
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
                  <div className="mt-2 space-y-1">
                    <p className={`text-xs ${password.length >= 8 ? 'text-success' : 'text-muted-foreground'}`}>
                      ✓ At least 8 characters
                    </p>
                    <p className={`text-xs ${/[A-Z]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                      ✓ One uppercase letter
                    </p>
                    <p className={`text-xs ${/[0-9]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                      ✓ One digit (0-9)
                    </p>
                    <p className={`text-xs ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-success' : 'text-muted-foreground'}`}>
                      ✓ One special character
                    </p>
                  </div>
                </div>
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

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your Location</h1>
                <p className="text-muted-foreground text-sm">This helps personalize your content</p>
              </div>

              <div className="space-y-4">
                <Dropdown
                  label="Country"
                  value={country}
                  options={countries}
                  onChange={setCountry}
                  placeholder="Select country"
                  error={errors.country}
                  showFlag
                />
                
                {states.length > 0 && (
                  <Dropdown
                    label="State/Province"
                    value={state}
                    options={states}
                    onChange={setState}
                    placeholder="Select state"
                    error={errors.state}
                  />
                )}
                
                {country === 'IN' && state && districts.length > 0 && (
                  <Dropdown
                    label="District"
                    value={district}
                    options={districts}
                    onChange={setDistrict}
                    placeholder="Select district"
                    error={errors.district}
                  />
                )}
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleNext} size="full">Continue</MotiButton>
              </div>
            </motion.div>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Education Details</h1>
                <p className="text-muted-foreground text-sm">Tell us about your academic background</p>
              </div>

              <div className="space-y-4">
                <Dropdown
                  label="Education Level"
                  value={educationLevel}
                  options={educationLevels}
                  onChange={setEducationLevel}
                  placeholder="Select your current level"
                  error={errors.education}
                />

                {/* School Level Fields */}
                {isSchoolLevel && (
                  <>
                    <Dropdown
                      label="Education Board"
                      value={board}
                      options={boards}
                      onChange={setBoard}
                      placeholder="Select your board"
                      error={errors.board}
                    />
                    
                    {educationLevel === 'higher_secondary' && (
                      <Dropdown
                        label="Stream"
                        value={stream}
                        options={schoolStreams}
                        onChange={setStream}
                        placeholder="Select your stream"
                        error={errors.stream}
                      />
                    )}
                  </>
                )}

                {/* Higher Education Fields */}
                {isHigherEducation && (
                  <>
                    <Dropdown
                      label="Course"
                      value={course}
                      options={courses}
                      onChange={setCourse}
                      placeholder="Select your course"
                      error={errors.course}
                    />

                    <Dropdown
                      label="University"
                      value={university}
                      options={universities}
                      onChange={setUniversity}
                      placeholder="Select your university"
                      error={errors.university}
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">College Name</label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="Enter your college name"
                        className={`moti-input ${errors.college ? 'border-destructive' : ''}`}
                        list="college-suggestions"
                      />
                      <datalist id="college-suggestions">
                        {colleges.map((c, i) => <option key={i} value={c} />)}
                      </datalist>
                      {errors.college && <p className="text-sm text-destructive mt-1">{errors.college}</p>}
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAutonomous}
                        onChange={(e) => setIsAutonomous(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-sm">Autonomous College</p>
                        <p className="text-xs text-muted-foreground">My college follows its own curriculum</p>
                      </div>
                    </label>

                    {departments.length > 0 && (
                      <Dropdown
                        label="Department/Branch"
                        value={department}
                        options={departments}
                        onChange={setDepartment}
                        placeholder="Select your department"
                        error={errors.department}
                      />
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <Dropdown
                        label="Year"
                        value={year}
                        options={years}
                        onChange={setYear}
                        placeholder="Select year"
                        error={errors.year}
                      />
                      <Dropdown
                        label="Semester"
                        value={semester}
                        options={semesters}
                        onChange={setSemester}
                        placeholder="Select sem"
                        error={errors.semester}
                      />
                    </div>

                    <Dropdown
                      label="Regulation (Optional)"
                      value={regulation}
                      options={regulations}
                      onChange={setRegulation}
                      placeholder="Select regulation"
                    />
                  </>
                )}
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleNext} size="full">Continue</MotiButton>
              </div>
            </motion.div>
          )}

          {/* Step 4: Subjects */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Select Subjects</h1>
                <p className="text-muted-foreground text-sm">Choose the subjects you're studying</p>
              </div>

              {errors.subjects && (
                <p className="text-sm text-destructive text-center mb-4">{errors.subjects}</p>
              )}

              <div className="grid grid-cols-2 gap-2 mb-6">
                {subjects.map((subject, idx) => (
                  <motion.button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`p-3 rounded-xl text-sm text-left transition-all ${
                      selectedSubjects.includes(subject)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:border-primary'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <div className="flex items-center gap-2">
                      {selectedSubjects.includes(subject) && <Check size={14} />}
                      <span className="line-clamp-2">{subject}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {selectedSubjects.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mb-4">
                  {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
                </p>
              )}

              <div className="mt-6">
                <MotiButton 
                  onClick={handleSubmit} 
                  size="full" 
                  disabled={sendingOTP || isLoading}
                >
                  {sendingOTP ? 'Sending OTP...' : 'Create Account'}
                </MotiButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-muted-foreground text-sm">Already have an account? </span>
          <button onClick={() => navigate('/login')} className="text-primary font-semibold text-sm">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

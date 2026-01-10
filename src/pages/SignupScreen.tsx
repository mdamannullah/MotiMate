import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { OtpInput } from '@/components/ui/OtpInput';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, ChevronDown, Check, MapPin, Building2, GraduationCap, BookOpen, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { countries, educationLevels, ugCourses, pgCourses, years, semesters, schoolStreams, getStatesForCountry, getDistrictsForState, getBoardsForState, getUniversitiesForState, getDepartmentsForCourse, getSubjectsForDepartment, validateName, validateEmail, validatePassword } from '@/data/educationData';
import { generateOTP, storeOTP, verifyOTP } from '@/services/otpService';
import { showOtpNotification } from '@/components/ui/OtpNotification';
import { Footer } from '@/components/layout/Footer';

interface DropdownProps { 
  label: string; 
  value: string; 
  options: string[] | { id?: string; code?: string; name: string; flag?: string }[]; 
  onChange: (value: string) => void; 
  placeholder: string; 
  error?: string; 
  showFlag?: boolean; 
}

// Reusable Dropdown Component
const Dropdown = ({ label, value, options, onChange, placeholder, error, showFlag }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getDisplayValue = () => { 
    if (!value) return null; 
    const option = options.find(o => typeof o === 'string' ? o === value : o.id === value || o.code === value || o.name === value); 
    if (typeof option === 'string') return option; 
    if (option && typeof option === 'object') return showFlag && option.flag ? `${option.flag} ${option.name}` : option.name; 
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
  
  // Steps: 1-4 = signup form, 5 = OTP verification
  const [step, setStep] = useState(1);
  
  // User info - Step 1
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  
  // Location - Step 2
  const [country, setCountry] = useState('IN'); 
  const [state, setState] = useState(''); 
  const [district, setDistrict] = useState('');
  
  // Education - Step 3
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
  
  // Subjects - Step 4
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // OTP - Step 5
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived data
  const states = getStatesForCountry(country); 
  const districts = state ? getDistrictsForState(state) : []; 
  const boards = state ? getBoardsForState(state) : []; 
  const universities = state ? getUniversitiesForState(state) : [];
  const isSchoolLevel = ['primary', 'middle', 'secondary', 'higher_secondary'].includes(educationLevel); 
  const isHigherEducation = ['undergraduate', 'postgraduate', 'diploma', 'phd'].includes(educationLevel);
  const courses = educationLevel === 'postgraduate' ? pgCourses : ugCourses; 
  const departments = course ? getDepartmentsForCourse(course) : []; 
  const subjects = department ? getSubjectsForDepartment(department) : (stream ? getSubjectsForDepartment(stream) : []);

  // Reset dependent fields when parent changes
  useEffect(() => { setState(''); setDistrict(''); }, [country]);
  useEffect(() => { setDistrict(''); setBoard(''); setUniversity(''); }, [state]);
  useEffect(() => { setBoard(''); setStream(''); setCourse(''); setUniversity(''); setCollege(''); setDepartment(''); setYear(''); setSemester(''); setSelectedSubjects([]); }, [educationLevel]);
  useEffect(() => { setDepartment(''); setSelectedSubjects([]); }, [course]);
  useEffect(() => { setSelectedSubjects([]); }, [department, stream]);

  // Validation functions
  const validateStep1 = () => { 
    const e: Record<string, string> = {}; 
    const nv = validateName(name); if (!nv.valid) e.name = nv.error!; 
    const ev = validateEmail(email); if (!ev.valid) e.email = ev.error!; 
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: { email: string }) => u.email === email)) {
      e.email = 'This email is already registered';
    }
    
    const pv = validatePassword(password); if (!pv.valid) e.password = pv.error!; 
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'; 
    setErrors(e); 
    return Object.keys(e).length === 0; 
  };
  
  const validateStep2 = () => { 
    const e: Record<string, string> = {}; 
    if (!country) e.country = 'Required'; 
    if (!state) e.state = 'Required'; 
    if (country === 'IN' && !district) e.district = 'Required'; 
    setErrors(e); 
    return Object.keys(e).length === 0; 
  };
  
  const validateStep3 = () => { 
    const e: Record<string, string> = {}; 
    if (!educationLevel) e.education = 'Required'; 
    if (isSchoolLevel && !board) e.board = 'Required'; 
    if (isHigherEducation) { 
      if (!course) e.course = 'Required'; 
      if (!university) e.university = 'Required'; 
      if (!college) e.college = 'Required'; 
      if (!department) e.department = 'Required'; 
      if (!year) e.year = 'Required'; 
      if (!semester) e.semester = 'Required'; 
    } 
    setErrors(e); 
    return Object.keys(e).length === 0; 
  };
  
  const validateStep4 = () => { 
    const e: Record<string, string> = {}; 
    if (selectedSubjects.length === 0) e.subjects = 'Select at least one subject'; 
    setErrors(e); 
    return Object.keys(e).length === 0; 
  };

  const handleNext = () => { 
    if (step === 1 && validateStep1()) setStep(2); 
    else if (step === 2 && validateStep2()) setStep(3); 
    else if (step === 3 && validateStep3()) setStep(4); 
  };
  
  const handleBack = () => { 
    if (step === 5) setStep(4);
    else if (step > 1) setStep(step - 1); 
    else navigate(-1); 
  };
  
  const toggleSubject = (subject: string) => { 
    setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]); 
  };

  // Send OTP after form completion
  const handleSendOTP = async () => {
    if (!validateStep4()) return;
    
    // Generate and store OTP
    const newOTP = generateOTP();
    storeOTP(email, newOTP, 'signup');
    
    // Show prominent OTP notification
    showOtpNotification(newOTP, email);
    
    // Move to OTP step
    setStep(5);
  };

  // Verify OTP and complete signup
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter complete 6-digit OTP');
      return;
    }

    setVerifying(true);
    setOtpError('');

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify OTP
    const result = verifyOTP(email, otp, 'signup');

    if (!result.success) {
      setOtpError(result.error || 'Invalid OTP');
      setVerifying(false);
      return;
    }

    // OTP verified - complete signup
    const educationData = { 
      country, state, district, 
      level: educationLevel, 
      board: isSchoolLevel ? board : undefined, 
      stream: isSchoolLevel ? stream : undefined, 
      course: isHigherEducation ? course : undefined, 
      university: isHigherEducation ? university : undefined, 
      college: isHigherEducation ? college : undefined, 
      isAutonomous, 
      department: isHigherEducation ? department : undefined, 
      year: isHigherEducation ? year : undefined, 
      semester: isHigherEducation ? semester : undefined, 
      subjects: selectedSubjects 
    };
    
    const signupResult = await signup(name, email, password, educationData);
    
    if (signupResult.success) { 
      toast.success('Account created successfully! 🎉'); 
      navigate('/dashboard', { replace: true }); 
    } else { 
      setOtpError(signupResult.error || 'Signup failed'); 
    }
    
    setVerifying(false);
  };

  // Resend OTP
  const handleResendOTP = () => {
    const newOTP = generateOTP();
    storeOTP(email, newOTP, 'signup');
    showOtpNotification(newOTP, email);
    setOtp('');
    setOtpError('');
    toast.success('New OTP sent!');
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
      
      <div className="flex-1 flex flex-col px-6 pt-20 pb-4 overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
              {i < 5 && <div className={`w-6 h-0.5 transition-colors ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">Step {step} of 5</p>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Details */}
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
                <MotiInput label="Full Name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} error={errors.name} icon={<User size={20} />} />
                <MotiInput label="Email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} icon={<Mail size={20} />} />
                <MotiInput label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} icon={<Lock size={20} />} rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>} />
                <MotiInput label="Confirm Password" type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={<Lock size={20} />} />
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
                <Dropdown label="Country" value={country} options={countries} onChange={setCountry} placeholder="Select country" error={errors.country} showFlag />
                {states.length > 0 && <Dropdown label="State/Province" value={state} options={states} onChange={setState} placeholder="Select state" error={errors.state} />}
                {country === 'IN' && state && districts.length > 0 && <Dropdown label="District" value={district} options={districts} onChange={setDistrict} placeholder="Select district" error={errors.district} />}
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
                <p className="text-muted-foreground text-sm">Tell us about your education</p>
              </div>
              <div className="space-y-4">
                <Dropdown label="Education Level" value={educationLevel} options={educationLevels} onChange={setEducationLevel} placeholder="Select level" error={errors.education} />
                {isSchoolLevel && boards.length > 0 && <Dropdown label="Board" value={board} options={boards} onChange={setBoard} placeholder="Select board" error={errors.board} />}
                {isSchoolLevel && educationLevel === 'higher_secondary' && <Dropdown label="Stream" value={stream} options={schoolStreams} onChange={setStream} placeholder="Select stream" error={errors.stream} />}
                {isHigherEducation && (
                  <>
                    <Dropdown label="Course" value={course} options={courses} onChange={setCourse} placeholder="Select course" error={errors.course} />
                    {universities.length > 0 && <Dropdown label="University" value={university} options={universities} onChange={setUniversity} placeholder="Select university" error={errors.university} />}
                    <MotiInput label="College Name" type="text" placeholder="Enter your college" value={college} onChange={(e) => setCollege(e.target.value)} error={errors.college} icon={<Building2 size={20} />} />
                    {departments.length > 0 && <Dropdown label="Department" value={department} options={departments} onChange={setDepartment} placeholder="Select department" error={errors.department} />}
                    <div className="grid grid-cols-2 gap-4">
                      <Dropdown label="Year" value={year} options={years} onChange={setYear} placeholder="Year" error={errors.year} />
                      <Dropdown label="Semester" value={semester} options={semesters} onChange={setSemester} placeholder="Semester" error={errors.semester} />
                    </div>
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
                <h1 className="text-2xl font-bold mb-2">Your Subjects</h1>
                <p className="text-muted-foreground text-sm">Select subjects you're studying</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.length > 0 ? subjects.map(subject => (
                  <button 
                    key={subject} 
                    onClick={() => toggleSubject(subject)} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubjects.includes(subject) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                  >
                    {subject}
                  </button>
                )) : (
                  <p className="text-muted-foreground text-sm w-full text-center py-4">Complete previous steps to see subjects</p>
                )}
              </div>
              {errors.subjects && <p className="text-sm text-destructive mt-2">{errors.subjects}</p>}
              <div className="mt-6">
                <MotiButton onClick={handleSendOTP} size="full" loading={isLoading}>
                  Continue to Verify Email
                </MotiButton>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-medium">Login</button>
              </p>
            </motion.div>
          )}
          
          {/* Step 5: OTP Verification */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <KeyRound size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
                <p className="text-muted-foreground text-sm">
                  Enter the 6-digit code sent to<br />
                  <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>
              
              <div className="mb-6">
                <OtpInput
                  length={6}
                  onComplete={(value) => {
                    setOtp(value);
                    setOtpError('');
                  }}
                  error={otpError}
                />
              </div>
              
              <div className="text-center mb-6">
                <button
                  onClick={handleResendOTP}
                  className="text-primary font-medium"
                  disabled={verifying}
                >
                  Resend OTP
                </button>
              </div>
              
              <MotiButton onClick={handleVerifyOTP} size="full" loading={isLoading || verifying}>
                Verify & Create Account
              </MotiButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
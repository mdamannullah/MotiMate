import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MotiButton } from '@/components/ui/MotiButton';
import { MotiInput } from '@/components/ui/MotiInput';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

// Comprehensive education levels for India
const educationLevels = [
  { id: 'school', name: 'School (Class 1-12)', icon: '🏫' },
  { id: 'undergraduate', name: 'Undergraduate (B.A/B.Sc/B.Com)', icon: '🎓' },
  { id: 'engineering', name: 'Engineering (B.Tech/B.E)', icon: '⚙️' },
  { id: 'medical', name: 'Medical (MBBS/BDS/BAMS)', icon: '🏥' },
  { id: 'law', name: 'Law (LLB/LLM)', icon: '⚖️' },
  { id: 'management', name: 'Management (BBA/MBA)', icon: '💼' },
  { id: 'pharmacy', name: 'Pharmacy (B.Pharm/M.Pharm)', icon: '💊' },
  { id: 'architecture', name: 'Architecture (B.Arch)', icon: '🏗️' },
  { id: 'agriculture', name: 'Agriculture (B.Sc Ag)', icon: '🌾' },
  { id: 'arts', name: 'Fine Arts/Design', icon: '🎨' },
  { id: 'nursing', name: 'Nursing (B.Sc Nursing)', icon: '👨‍⚕️' },
  { id: 'education', name: 'Education (B.Ed/M.Ed)', icon: '📚' },
  { id: 'hotel', name: 'Hotel Management', icon: '🏨' },
  { id: 'journalism', name: 'Journalism & Mass Comm', icon: '📰' },
  { id: 'postgraduate', name: 'Postgraduate (M.A/M.Sc/M.Com)', icon: '📖' },
  { id: 'phd', name: 'PhD/Research', icon: '🔬' },
  { id: 'diploma', name: 'Diploma/ITI', icon: '📋' },
  { id: 'competitive', name: 'Competitive Exams', icon: '📝' },
  { id: 'other', name: 'Other', icon: '📌' },
];

// Sub-categories/departments for each education level
const departments: Record<string, string[]> = {
  school: ['Class 1-5 (Primary)', 'Class 6-8 (Middle)', 'Class 9-10 (Secondary)', 'Class 11-12 Science', 'Class 11-12 Commerce', 'Class 11-12 Arts/Humanities'],
  undergraduate: ['B.A. English', 'B.A. Hindi', 'B.A. History', 'B.A. Political Science', 'B.A. Economics', 'B.A. Psychology', 'B.A. Sociology', 'B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Mathematics', 'B.Sc. Biology', 'B.Sc. Computer Science', 'B.Sc. Biotechnology', 'B.Com. General', 'B.Com. Accounting', 'B.Com. Finance', 'BCA', 'BBA', 'Other'],
  engineering: ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics & Communication (ECE)', 'Electrical Engineering (EE)', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Biomedical Engineering', 'Automobile Engineering', 'Robotics & AI', 'Data Science', 'Cybersecurity', 'Other'],
  medical: ['MBBS', 'BDS (Dental)', 'BAMS (Ayurveda)', 'BHMS (Homeopathy)', 'BUMS (Unani)', 'BNYS (Naturopathy)', 'B.Sc. Physiotherapy', 'B.Sc. Radiology', 'B.Sc. MLT', 'Veterinary (B.V.Sc)', 'Other'],
  law: ['LLB (3 Year)', 'BA LLB (5 Year)', 'BBA LLB', 'LLM Constitutional Law', 'LLM Corporate Law', 'LLM Criminal Law', 'LLM International Law', 'Other'],
  management: ['BBA General', 'BBA Finance', 'BBA Marketing', 'BBA HR', 'MBA General', 'MBA Finance', 'MBA Marketing', 'MBA HR', 'MBA Operations', 'MBA IT', 'PGDM', 'Other'],
  pharmacy: ['B.Pharm', 'D.Pharm', 'M.Pharm', 'Pharm.D', 'Clinical Research', 'Other'],
  architecture: ['B.Arch', 'M.Arch', 'Interior Design', 'Urban Planning', 'Landscape Architecture', 'Other'],
  agriculture: ['B.Sc. Agriculture', 'B.Sc. Horticulture', 'B.Sc. Forestry', 'B.Tech. Agricultural Engineering', 'B.F.Sc. (Fisheries)', 'Other'],
  arts: ['B.Des. Fashion', 'B.Des. Graphic', 'B.Des. Product', 'B.Des. Interior', 'BFA Painting', 'BFA Sculpture', 'BFA Applied Arts', 'Film & TV Production', 'Animation', 'Other'],
  nursing: ['B.Sc. Nursing', 'GNM', 'ANM', 'M.Sc. Nursing', 'Other'],
  education: ['B.Ed.', 'M.Ed.', 'D.El.Ed.', 'B.P.Ed.', 'M.P.Ed.', 'Other'],
  hotel: ['B.Sc. Hospitality', 'BHM', 'Culinary Arts', 'Event Management', 'Other'],
  journalism: ['B.A. Journalism', 'B.Sc. Mass Communication', 'M.A. Journalism', 'PR & Advertising', 'Digital Media', 'Other'],
  postgraduate: ['M.A. English', 'M.A. Hindi', 'M.A. History', 'M.A. Economics', 'M.Sc. Physics', 'M.Sc. Chemistry', 'M.Sc. Mathematics', 'M.Sc. Computer Science', 'M.Com.', 'MCA', 'Other'],
  phd: ['Science', 'Arts', 'Commerce', 'Engineering', 'Medical', 'Law', 'Management', 'Other'],
  diploma: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics', 'ITI Fitter', 'ITI Electrician', 'ITI Welder', 'Other'],
  competitive: ['UPSC (IAS/IPS/IFS)', 'SSC (CGL/CHSL)', 'Banking (IBPS/SBI)', 'Railways (RRB)', 'JEE Main/Advanced', 'NEET', 'GATE', 'CAT/MAT/XAT', 'CLAT', 'UGC NET', 'State PSC', 'Defence (NDA/CDS)', 'Other'],
  other: ['Self Study', 'Working Professional', 'Other'],
};

export default function SignupScreen() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [educationLevel, setEducationLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!educationLevel) newErrors.education = 'Please select your education level';
    if (!department) newErrors.department = 'Please select your department/stream';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    try {
      // Store education info
      localStorage.setItem('motimate_education', JSON.stringify({ level: educationLevel, department }));
      
      const success = await signup(name, email, password);
      if (success) {
        toast.success('OTP sent to your email! 📧');
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error('Email already exists. Please login.');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const selectedEducation = educationLevels.find(e => e.id === educationLevel);
  const availableDepartments = educationLevel ? departments[educationLevel] || [] : [];

  return (
    <div className="mobile-container min-h-screen flex flex-col">
      <motion.button
        onClick={() => step === 1 ? navigate(-1) : setStep(1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-muted/50 z-10"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      <div className="flex-1 flex flex-col px-6 pt-20 pb-8 overflow-y-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
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
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
              </div>

              <div className="mt-6">
                <MotiButton onClick={handleSubmit} size="full" loading={isLoading}>Sign Up</MotiButton>
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

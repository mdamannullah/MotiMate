// Countries (focusing on India and nearby)
export const countries = [
  { code: 'IN', name: 'India' },
  { code: 'NP', name: 'Nepal' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'OTHER', name: 'Other' },
];

// Indian States
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

// Boards by state
export const boardsByState: Record<string, string[]> = {
  'Maharashtra': ['Maharashtra State Board (SSC/HSC)', 'CBSE', 'ICSE/ISC', 'IB', 'Cambridge (IGCSE)'],
  'Karnataka': ['Karnataka State Board (PUC)', 'CBSE', 'ICSE/ISC', 'IB'],
  'Tamil Nadu': ['Tamil Nadu State Board', 'CBSE', 'ICSE/ISC', 'Matriculation Board'],
  'Andhra Pradesh': ['AP State Board', 'CBSE', 'ICSE/ISC'],
  'Telangana': ['Telangana State Board', 'CBSE', 'ICSE/ISC'],
  'Kerala': ['Kerala State Board', 'CBSE', 'ICSE/ISC'],
  'Uttar Pradesh': ['UP Board', 'CBSE', 'ICSE/ISC'],
  'Rajasthan': ['Rajasthan Board (RBSE)', 'CBSE', 'ICSE/ISC'],
  'Gujarat': ['Gujarat Board (GSEB)', 'CBSE', 'ICSE/ISC'],
  'West Bengal': ['West Bengal Board (WBBSE/WBCHSE)', 'CBSE', 'ICSE/ISC'],
  'Bihar': ['Bihar Board (BSEB)', 'CBSE', 'ICSE/ISC'],
  'Madhya Pradesh': ['MP Board (MPBSE)', 'CBSE', 'ICSE/ISC'],
  'Punjab': ['Punjab Board (PSEB)', 'CBSE', 'ICSE/ISC'],
  'Haryana': ['Haryana Board (HBSE)', 'CBSE', 'ICSE/ISC'],
  'default': ['CBSE', 'ICSE/ISC', 'State Board', 'IB', 'Cambridge (IGCSE)', 'Open Schooling (NIOS)'],
};

// Universities by state (major ones)
export const universitiesByState: Record<string, string[]> = {
  'Maharashtra': ['Mumbai University', 'Pune University (SPPU)', 'Nagpur University', 'Shivaji University', 'Autonomous College', 'Other'],
  'Karnataka': ['Bangalore University', 'Visvesvaraya Technological University (VTU)', 'Mysore University', 'Autonomous College', 'Other'],
  'Tamil Nadu': ['Anna University', 'Madras University', 'Bharathiar University', 'Autonomous College', 'Other'],
  'Delhi': ['Delhi University (DU)', 'GGSIPU', 'Jamia Millia Islamia', 'JNU', 'Autonomous College', 'Other'],
  'Telangana': ['Osmania University', 'JNTU Hyderabad', 'Autonomous College', 'Other'],
  'Uttar Pradesh': ['Lucknow University', 'Allahabad University', 'AKTU', 'BHU', 'Autonomous College', 'Other'],
  'default': ['State University', 'Central University', 'Private University', 'Deemed University', 'Autonomous College', 'Other'],
};

// Comprehensive education levels
export const educationLevels = [
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

// Departments with new AI/ML courses
export const departments: Record<string, string[]> = {
  school: ['Class 1-5 (Primary)', 'Class 6-8 (Middle)', 'Class 9-10 (Secondary)', 'Class 11-12 Science', 'Class 11-12 Commerce', 'Class 11-12 Arts/Humanities'],
  undergraduate: ['B.A. English', 'B.A. Hindi', 'B.A. History', 'B.A. Political Science', 'B.A. Economics', 'B.A. Psychology', 'B.A. Sociology', 'B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Mathematics', 'B.Sc. Biology', 'B.Sc. Computer Science', 'B.Sc. Biotechnology', 'B.Sc. Data Science', 'B.Sc. AI & ML', 'B.Com. General', 'B.Com. Accounting', 'B.Com. Finance', 'BCA', 'BBA', 'Other'],
  engineering: [
    'Computer Science (CSE)', 
    'CSE - AI & ML', 
    'CSE - Data Science', 
    'CSE - Cybersecurity',
    'CSE - Cloud Computing',
    'CSE - IoT',
    'Artificial Intelligence & ML',
    'Artificial Intelligence & Data Science',
    'Data Science & Engineering',
    'Information Technology (IT)', 
    'Electronics & Communication (ECE)', 
    'Electrical Engineering (EE)', 
    'Mechanical Engineering', 
    'Civil Engineering', 
    'Chemical Engineering', 
    'Aerospace Engineering', 
    'Biomedical Engineering', 
    'Automobile Engineering', 
    'Robotics & Automation',
    'Mechatronics',
    'Other'
  ],
  medical: ['MBBS', 'BDS (Dental)', 'BAMS (Ayurveda)', 'BHMS (Homeopathy)', 'BUMS (Unani)', 'BNYS (Naturopathy)', 'B.Sc. Physiotherapy', 'B.Sc. Radiology', 'B.Sc. MLT', 'Veterinary (B.V.Sc)', 'Other'],
  law: ['LLB (3 Year)', 'BA LLB (5 Year)', 'BBA LLB', 'LLM Constitutional Law', 'LLM Corporate Law', 'LLM Criminal Law', 'LLM International Law', 'Other'],
  management: ['BBA General', 'BBA Finance', 'BBA Marketing', 'BBA HR', 'BBA Business Analytics', 'MBA General', 'MBA Finance', 'MBA Marketing', 'MBA HR', 'MBA Operations', 'MBA IT', 'MBA Business Analytics', 'PGDM', 'Other'],
  pharmacy: ['B.Pharm', 'D.Pharm', 'M.Pharm', 'Pharm.D', 'Clinical Research', 'Other'],
  architecture: ['B.Arch', 'M.Arch', 'Interior Design', 'Urban Planning', 'Landscape Architecture', 'Other'],
  agriculture: ['B.Sc. Agriculture', 'B.Sc. Horticulture', 'B.Sc. Forestry', 'B.Tech. Agricultural Engineering', 'B.F.Sc. (Fisheries)', 'Other'],
  arts: ['B.Des. Fashion', 'B.Des. Graphic', 'B.Des. Product', 'B.Des. Interior', 'B.Des. UI/UX', 'BFA Painting', 'BFA Sculpture', 'BFA Applied Arts', 'Film & TV Production', 'Animation & VFX', 'Game Design', 'Other'],
  nursing: ['B.Sc. Nursing', 'GNM', 'ANM', 'M.Sc. Nursing', 'Other'],
  education: ['B.Ed.', 'M.Ed.', 'D.El.Ed.', 'B.P.Ed.', 'M.P.Ed.', 'Other'],
  hotel: ['B.Sc. Hospitality', 'BHM', 'Culinary Arts', 'Event Management', 'Other'],
  journalism: ['B.A. Journalism', 'B.Sc. Mass Communication', 'M.A. Journalism', 'PR & Advertising', 'Digital Media', 'Other'],
  postgraduate: ['M.A. English', 'M.A. Hindi', 'M.A. History', 'M.A. Economics', 'M.Sc. Physics', 'M.Sc. Chemistry', 'M.Sc. Mathematics', 'M.Sc. Computer Science', 'M.Sc. Data Science', 'M.Sc. AI & ML', 'M.Com.', 'MCA', 'Other'],
  phd: ['Science', 'Arts', 'Commerce', 'Engineering', 'Medical', 'Law', 'Management', 'Other'],
  diploma: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics', 'ITI Fitter', 'ITI Electrician', 'ITI Welder', 'Other'],
  competitive: ['UPSC (IAS/IPS/IFS)', 'SSC (CGL/CHSL)', 'Banking (IBPS/SBI)', 'Railways (RRB)', 'JEE Main/Advanced', 'NEET', 'GATE', 'CAT/MAT/XAT', 'CLAT', 'UGC NET', 'State PSC', 'Defence (NDA/CDS)', 'Other'],
  other: ['Self Study', 'Working Professional', 'Other'],
};

// Subjects by department
export const subjectsByDepartment: Record<string, string[]> = {
  // School
  'Class 1-5 (Primary)': ['English', 'Hindi', 'Mathematics', 'EVS', 'General Knowledge'],
  'Class 6-8 (Middle)': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
  'Class 9-10 (Secondary)': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit'],
  'Class 11-12 Science': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Physical Education'],
  'Class 11-12 Commerce': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Computer Science', 'Informatics Practices'],
  'Class 11-12 Arts/Humanities': ['History', 'Political Science', 'Economics', 'Geography', 'Psychology', 'Sociology', 'English', 'Hindi'],
  
  // Engineering - CSE specializations
  'Computer Science (CSE)': ['Data Structures & Algorithms', 'Operating Systems', 'Database Management', 'Computer Networks', 'Software Engineering', 'Web Development', 'Object Oriented Programming', 'Theory of Computation', 'Compiler Design', 'Computer Architecture'],
  'CSE - AI & ML': ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Structures', 'Python Programming', 'Statistics & Probability', 'Neural Networks', 'Reinforcement Learning', 'AI Ethics'],
  'CSE - Data Science': ['Statistics', 'Machine Learning', 'Data Mining', 'Big Data Analytics', 'Python/R Programming', 'Data Visualization', 'Database Systems', 'Deep Learning', 'Time Series Analysis', 'Business Analytics'],
  'CSE - Cybersecurity': ['Network Security', 'Cryptography', 'Ethical Hacking', 'Information Security', 'Digital Forensics', 'Malware Analysis', 'Security Operations', 'Cloud Security', 'Penetration Testing', 'Risk Management'],
  'CSE - Cloud Computing': ['Cloud Architecture', 'AWS/Azure/GCP', 'Virtualization', 'Containerization (Docker/Kubernetes)', 'Serverless Computing', 'DevOps', 'Microservices', 'Cloud Security', 'Distributed Systems', 'Infrastructure as Code'],
  'CSE - IoT': ['IoT Architecture', 'Embedded Systems', 'Sensor Networks', 'Edge Computing', 'Wireless Communication', 'IoT Security', 'Arduino/Raspberry Pi', 'MQTT Protocol', 'Smart Systems', 'Industrial IoT'],
  'Artificial Intelligence & ML': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision', 'Robotics', 'AI Ethics', 'Reinforcement Learning', 'Knowledge Representation', 'Expert Systems'],
  'Artificial Intelligence & Data Science': ['Machine Learning', 'Deep Learning', 'Data Mining', 'Big Data', 'Statistics', 'NLP', 'Computer Vision', 'Data Visualization', 'Predictive Analytics', 'Business Intelligence'],
  'Data Science & Engineering': ['Data Mining', 'Machine Learning', 'Big Data Technologies', 'Data Warehousing', 'Statistical Analysis', 'Data Visualization', 'ETL Processes', 'Python/R Programming', 'SQL & NoSQL', 'Cloud Data Platforms'],
  
  // Other Engineering
  'Information Technology (IT)': ['Programming', 'Database Management', 'Web Technologies', 'Networking', 'Software Engineering', 'Cloud Computing', 'Information Security', 'Mobile App Development'],
  'Electronics & Communication (ECE)': ['Digital Electronics', 'Analog Electronics', 'Communication Systems', 'Signal Processing', 'Microprocessors', 'VLSI Design', 'Embedded Systems', 'Antenna Theory'],
  'Electrical Engineering (EE)': ['Circuit Theory', 'Power Systems', 'Electrical Machines', 'Control Systems', 'Power Electronics', 'Electromagnetic Theory', 'Instrumentation', 'Renewable Energy'],
  'Mechanical Engineering': ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design', 'Heat Transfer', 'Strength of Materials', 'CAD/CAM', 'Robotics'],
  'Civil Engineering': ['Structural Engineering', 'Concrete Technology', 'Geotechnical Engineering', 'Transportation Engineering', 'Surveying', 'Environmental Engineering', 'Construction Management', 'Hydraulics'],
  
  // Management
  'BBA Business Analytics': ['Business Statistics', 'Data Analysis', 'Predictive Analytics', 'Marketing Analytics', 'Financial Analytics', 'Business Intelligence', 'SQL & Excel', 'Data Visualization'],
  'MBA Business Analytics': ['Advanced Analytics', 'Machine Learning for Business', 'Marketing Analytics', 'Financial Modeling', 'Operations Research', 'Strategic Analytics', 'Big Data Management', 'Decision Science'],
  
  // Default for others
  'default': ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Subject 5'],
};

// Get subjects for a department
export const getSubjectsForDepartment = (department: string): string[] => {
  return subjectsByDepartment[department] || subjectsByDepartment['default'];
};

// Get boards for a state
export const getBoardsForState = (state: string): string[] => {
  return boardsByState[state] || boardsByState['default'];
};

// Get universities for a state
export const getUniversitiesForState = (state: string): string[] => {
  return universitiesByState[state] || universitiesByState['default'];
};

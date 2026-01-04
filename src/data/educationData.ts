// Countries with flags
export const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

// States by country
export const statesByCountry: Record<string, string[]> = {
  'IN': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  ],
  'US': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Other'],
  'GB': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'CA': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Other'],
  'AU': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Other'],
  'NP': ['Province 1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'],
  'BD': ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Other'],
  'default': ['State 1', 'State 2', 'Other'],
};

// Districts by state (for India)
export const districtsByState: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ratnagiri', 'Sindhudurg', 'Ahmednagar', 'Jalgaon', 'Dhule', 'Nandurbar', 'Buldhana', 'Akola', 'Washim', 'Amravati', 'Wardha', 'Nagpur', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli', 'Yavatmal'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangalore', 'Hubli-Dharwad', 'Belgaum', 'Gulbarga', 'Bellary', 'Tumkur', 'Shimoga', 'Davangere', 'Hassan', 'Mandya', 'Udupi', 'Chikmagalur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Cuddalore', 'Kanchipuram', 'Villupuram'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kadapa', 'Anantapur', 'Rajahmundry', 'Kakinada', 'Eluru', 'Ongole', 'Vizianagaram', 'Chittoor'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Miryalaguda'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad', 'Malappuram', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Kasaragod'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Noida', 'Ghaziabad', 'Gorakhpur', 'Aligarh', 'Moradabad', 'Bareilly', 'Saharanpur', 'Jhansi', 'Mathura', 'Firozabad', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Hardoi'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar', 'Pali', 'Nagaur', 'Jhunjhunu', 'Churu', 'Barmer'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Kheda', 'Mehsana', 'Patan', 'Bharuch', 'Valsad', 'Navsari'],
  'West Bengal': ['Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Nadia', 'Murshidabad', 'Hooghly', 'Bardhaman', 'Malda', 'Jalpaiguri', 'Darjeeling', 'Cooch Behar', 'Siliguri', 'Asansol', 'Durgapur'],
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Bihar Sharif', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Saharsa', 'Sasaram', 'Hajipur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Dewas', 'Murwara', 'Ratlam', 'Burhanpur', 'Khandwa', 'Bhind', 'Chhindwara'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Kapurthala', 'Gurdaspur'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Rohtak', 'Karnal', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bhiwani', 'Sirsa', 'Jhajjar', 'Rewari'],
  'default': ['District 1', 'District 2', 'Other'],
};

// Education levels
export const educationLevels = [
  { id: 'primary', name: 'Primary (Class 1-5)', category: 'school' },
  { id: 'middle', name: 'Middle School (Class 6-8)', category: 'school' },
  { id: 'secondary', name: 'Secondary (Class 9-10)', category: 'school' },
  { id: 'higher_secondary', name: 'Higher Secondary (Class 11-12)', category: 'school' },
  { id: 'diploma', name: 'Diploma/ITI', category: 'higher' },
  { id: 'undergraduate', name: 'Undergraduate (UG)', category: 'higher' },
  { id: 'postgraduate', name: 'Postgraduate (PG)', category: 'higher' },
  { id: 'phd', name: 'PhD/Research', category: 'higher' },
  { id: 'competitive', name: 'Competitive Exams', category: 'other' },
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
  'Delhi': ['CBSE', 'ICSE/ISC', 'IB', 'Cambridge'],
  'default': ['CBSE', 'ICSE/ISC', 'State Board', 'IB', 'Cambridge (IGCSE)', 'Open Schooling (NIOS)'],
};

// UG Courses
export const ugCourses = [
  { id: 'btech', name: 'B.Tech/B.E', category: 'engineering' },
  { id: 'bsc', name: 'B.Sc', category: 'science' },
  { id: 'bca', name: 'BCA', category: 'computer' },
  { id: 'bba', name: 'BBA', category: 'management' },
  { id: 'bcom', name: 'B.Com', category: 'commerce' },
  { id: 'ba', name: 'B.A', category: 'arts' },
  { id: 'bpharm', name: 'B.Pharm', category: 'pharmacy' },
  { id: 'barch', name: 'B.Arch', category: 'architecture' },
  { id: 'mbbs', name: 'MBBS', category: 'medical' },
  { id: 'bds', name: 'BDS', category: 'medical' },
  { id: 'bams', name: 'BAMS', category: 'medical' },
  { id: 'llb', name: 'LLB', category: 'law' },
  { id: 'bdes', name: 'B.Des', category: 'design' },
  { id: 'bsc_nursing', name: 'B.Sc Nursing', category: 'nursing' },
  { id: 'bed', name: 'B.Ed', category: 'education' },
  { id: 'bhm', name: 'BHM (Hotel Management)', category: 'hospitality' },
  { id: 'bjmc', name: 'BJMC (Journalism)', category: 'media' },
  { id: 'bfa', name: 'BFA (Fine Arts)', category: 'arts' },
  { id: 'other', name: 'Other', category: 'other' },
];

// PG Courses
export const pgCourses = [
  { id: 'mtech', name: 'M.Tech/M.E', category: 'engineering' },
  { id: 'msc', name: 'M.Sc', category: 'science' },
  { id: 'mca', name: 'MCA', category: 'computer' },
  { id: 'mba', name: 'MBA', category: 'management' },
  { id: 'mcom', name: 'M.Com', category: 'commerce' },
  { id: 'ma', name: 'M.A', category: 'arts' },
  { id: 'mpharm', name: 'M.Pharm', category: 'pharmacy' },
  { id: 'llm', name: 'LLM', category: 'law' },
  { id: 'md', name: 'MD/MS', category: 'medical' },
  { id: 'med', name: 'M.Ed', category: 'education' },
  { id: 'other', name: 'Other', category: 'other' },
];

// Universities by state (major ones)
export const universitiesByState: Record<string, string[]> = {
  'Maharashtra': ['Mumbai University', 'Savitribai Phule Pune University (SPPU)', 'Nagpur University (RTMNU)', 'Shivaji University Kolhapur', 'Dr. Babasaheb Ambedkar Marathwada University', 'North Maharashtra University', 'Sant Gadge Baba Amravati University', 'Solapur University', 'Other'],
  'Karnataka': ['Bangalore University', 'Visvesvaraya Technological University (VTU)', 'Mysore University', 'Mangalore University', 'Karnatak University', 'Kuvempu University', 'Gulbarga University', 'REVA University', 'Christ University', 'PES University', 'Other'],
  'Tamil Nadu': ['Anna University', 'Madras University', 'Bharathiar University', 'Bharathidasan University', 'Madurai Kamaraj University', 'Annamalai University', 'SRM University', 'VIT University', 'SASTRA University', 'Other'],
  'Delhi': ['Delhi University (DU)', 'Guru Gobind Singh Indraprastha University (GGSIPU)', 'Jamia Millia Islamia', 'JNU', 'Delhi Technological University (DTU)', 'NSUT', 'Ambedkar University', 'IGNOU', 'Other'],
  'Telangana': ['Osmania University', 'JNTU Hyderabad', 'Kakatiya University', 'Telangana University', 'Palamuru University', 'BITS Pilani Hyderabad', 'IIIT Hyderabad', 'Other'],
  'Andhra Pradesh': ['Andhra University', 'Sri Venkateswara University', 'JNTU Kakinada', 'JNTU Anantapur', 'Acharya Nagarjuna University', 'Krishna University', 'Vikrama Simhapuri University', 'Other'],
  'Uttar Pradesh': ['Lucknow University', 'Allahabad University', 'AKTU (Dr. APJ Abdul Kalam Technical University)', 'BHU', 'AMU', 'CSJM University', 'DDU University', 'Bundelkhand University', 'Other'],
  'Kerala': ['Kerala University', 'Calicut University', 'MG University', 'Cochin University (CUSAT)', 'Kannur University', 'NIT Calicut', 'IIST', 'Other'],
  'Gujarat': ['Gujarat University', 'GTU (Gujarat Technological University)', 'Saurashtra University', 'MS University Baroda', 'South Gujarat University', 'Nirma University', 'Other'],
  'West Bengal': ['Calcutta University', 'Jadavpur University', 'WBUT (MAKAUT)', 'Burdwan University', 'North Bengal University', 'Kalyani University', 'Presidency University', 'Other'],
  'Rajasthan': ['Rajasthan University', 'RTU (Rajasthan Technical University)', 'MDS University', 'Jai Narain Vyas University', 'BITS Pilani', 'Manipal University Jaipur', 'Other'],
  'Madhya Pradesh': ['RGPV (Rajiv Gandhi Proudyogiki Vishwavidyalaya)', 'Devi Ahilya Vishwavidyalaya', 'Vikram University', 'Barkatullah University', 'Jiwaji University', 'IIT Indore', 'Other'],
  'Bihar': ['Patna University', 'Magadh University', 'Nalanda University', 'Lalit Narayan Mithila University', 'Aryabhatta Knowledge University', 'NIT Patna', 'Other'],
  'Punjab': ['Punjab University', 'Punjabi University Patiala', 'GNDU', 'Punjab Technical University', 'Lovely Professional University', 'Thapar University', 'Other'],
  'Haryana': ['Kurukshetra University', 'MDU Rohtak', 'Guru Jambheshwar University', 'Deenbandhu Chhotu Ram University', 'BITS Pilani', 'O.P. Jindal Global University', 'Amity University', 'Other'],
  'default': ['State University', 'Central University', 'Private University', 'Deemed University', 'Other'],
};

// Colleges by university (sample data)
export const collegesByUniversity: Record<string, string[]> = {
  'Mumbai University': ['St. Xaviers College', 'Jai Hind College', 'KC College', 'HR College', 'Ruia College', 'Mithibai College', 'NM College', 'Sathaye College', 'SIES College', 'Other'],
  'Savitribai Phule Pune University (SPPU)': ['Fergusson College', 'BMCC', 'SP College', 'Modern College', 'Symbiosis College', 'MIT College', 'VIT Pune', 'PICT', 'COEP', 'Other'],
  'Visvesvaraya Technological University (VTU)': ['RV College of Engineering', 'BMS College', 'MSRIT', 'PESIT', 'DSCE', 'SJCE Mysore', 'NIE Mysore', 'NMIT', 'New Horizon', 'Other'],
  'Anna University': ['CEG', 'MIT Anna', 'SSN College', 'RMK College', 'SRM College', 'Saveetha Engineering', 'Jeppiaar Engineering', 'St. Josephs', 'Other'],
  'Delhi University (DU)': ['SRCC', 'Hindu College', 'St. Stephens', 'Hansraj College', 'Miranda House', 'Lady Shri Ram', 'Ramjas College', 'KMC', 'Gargi College', 'Other'],
  'default': ['College 1', 'College 2', 'College 3', 'Other'],
};

// Departments by course
export const departmentsByCourse: Record<string, string[]> = {
  'btech': [
    'Computer Science & Engineering (CSE)',
    'CSE - Artificial Intelligence & Machine Learning',
    'CSE - Data Science',
    'CSE - Cybersecurity',
    'CSE - Cloud Computing',
    'CSE - Internet of Things (IoT)',
    'Artificial Intelligence & Data Science',
    'Information Technology (IT)',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biomedical Engineering',
    'Automobile Engineering',
    'Robotics & Automation',
    'Mechatronics',
    'Other',
  ],
  'bsc': [
    'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Biotechnology', 
    'Computer Science', 'Electronics', 'Statistics', 'Zoology', 'Botany',
    'Microbiology', 'Biochemistry', 'Environmental Science', 'Data Science',
    'Artificial Intelligence', 'Other',
  ],
  'bca': ['Computer Applications', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'Other'],
  'bba': ['General Management', 'Finance', 'Marketing', 'HR', 'Business Analytics', 'International Business', 'Other'],
  'bcom': ['General', 'Accounting & Finance', 'Banking & Insurance', 'Taxation', 'Business Analytics', 'Other'],
  'ba': ['English', 'Hindi', 'History', 'Political Science', 'Economics', 'Psychology', 'Sociology', 'Geography', 'Philosophy', 'Other'],
  'mtech': ['Computer Science', 'AI & ML', 'Data Science', 'VLSI', 'Embedded Systems', 'Software Engineering', 'Structural Engineering', 'Other'],
  'mba': ['General', 'Finance', 'Marketing', 'HR', 'Operations', 'IT & Systems', 'Business Analytics', 'Supply Chain', 'Other'],
  'msc': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Data Science', 'AI & ML', 'Biotechnology', 'Other'],
  'mca': ['Computer Applications', 'Data Science', 'AI & ML', 'Other'],
  'default': ['General'],
};

// Year options
export const years = [
  { id: '1', name: 'First Year' },
  { id: '2', name: 'Second Year' },
  { id: '3', name: 'Third Year' },
  { id: '4', name: 'Fourth Year' },
];

// Semester options
export const semesters = [
  { id: '1', name: 'Semester 1' },
  { id: '2', name: 'Semester 2' },
  { id: '3', name: 'Semester 3' },
  { id: '4', name: 'Semester 4' },
  { id: '5', name: 'Semester 5' },
  { id: '6', name: 'Semester 6' },
  { id: '7', name: 'Semester 7' },
  { id: '8', name: 'Semester 8' },
];

// Regulations
export const regulations = [
  { id: 'R20', name: 'R20 (2020)' },
  { id: 'R19', name: 'R19 (2019)' },
  { id: 'R18', name: 'R18 (2018)' },
  { id: 'R17', name: 'R17 (2017)' },
  { id: 'R16', name: 'R16 (2016)' },
  { id: 'R15', name: 'R15 (2015)' },
  { id: 'other', name: 'Other' },
];

// Subjects by department (comprehensive)
export const subjectsByDepartment: Record<string, string[]> = {
  // School
  'Class 1-5': ['English', 'Hindi', 'Mathematics', 'EVS', 'General Knowledge'],
  'Class 6-8': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
  'Class 9-10': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit'],
  'Class 11-12 Science': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Physical Education'],
  'Class 11-12 Commerce': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Computer Science'],
  'Class 11-12 Arts': ['History', 'Political Science', 'Economics', 'Geography', 'Psychology', 'Sociology', 'English'],

  // Engineering CSE
  'Computer Science & Engineering (CSE)': ['Data Structures & Algorithms', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Web Technologies', 'Object Oriented Programming', 'Theory of Computation', 'Compiler Design', 'Computer Organization & Architecture', 'Discrete Mathematics', 'Design & Analysis of Algorithms', 'Cloud Computing', 'Machine Learning', 'Artificial Intelligence'],
  'CSE - Artificial Intelligence & Machine Learning': ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Structures & Algorithms', 'Python Programming', 'Statistics & Probability', 'Neural Networks', 'Reinforcement Learning', 'AI Ethics', 'Big Data Analytics', 'Data Mining', 'Pattern Recognition'],
  'CSE - Data Science': ['Statistics', 'Machine Learning', 'Data Mining', 'Big Data Analytics', 'Python/R Programming', 'Data Visualization', 'Database Systems', 'Deep Learning', 'Time Series Analysis', 'Business Analytics', 'Natural Language Processing', 'Feature Engineering'],
  'CSE - Cybersecurity': ['Network Security', 'Cryptography', 'Ethical Hacking', 'Information Security', 'Digital Forensics', 'Malware Analysis', 'Security Operations', 'Cloud Security', 'Penetration Testing', 'Risk Management', 'Security Architecture'],
  'CSE - Cloud Computing': ['Cloud Architecture', 'AWS/Azure/GCP', 'Virtualization', 'Containerization (Docker/Kubernetes)', 'Serverless Computing', 'DevOps', 'Microservices', 'Cloud Security', 'Distributed Systems', 'Infrastructure as Code'],
  'CSE - Internet of Things (IoT)': ['IoT Architecture', 'Embedded Systems', 'Sensor Networks', 'Edge Computing', 'Wireless Communication', 'IoT Security', 'Arduino/Raspberry Pi', 'MQTT Protocol', 'Smart Systems', 'Industrial IoT'],
  'Artificial Intelligence & Data Science': ['Machine Learning', 'Deep Learning', 'Data Mining', 'Big Data', 'Statistics', 'NLP', 'Computer Vision', 'Data Visualization', 'Predictive Analytics', 'Business Intelligence', 'Neural Networks'],
  'Information Technology (IT)': ['Programming Fundamentals', 'Database Management', 'Web Technologies', 'Computer Networks', 'Software Engineering', 'Cloud Computing', 'Information Security', 'Mobile App Development', 'Operating Systems', 'Data Structures'],
  'Electronics & Communication (ECE)': ['Digital Electronics', 'Analog Electronics', 'Communication Systems', 'Signal Processing', 'Microprocessors', 'VLSI Design', 'Embedded Systems', 'Antenna Theory', 'Control Systems', 'Electromagnetic Theory'],
  'Electrical & Electronics (EEE)': ['Circuit Theory', 'Power Systems', 'Electrical Machines', 'Control Systems', 'Power Electronics', 'Electromagnetic Theory', 'Instrumentation', 'Renewable Energy', 'High Voltage Engineering'],
  'Mechanical Engineering': ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design', 'Heat Transfer', 'Strength of Materials', 'CAD/CAM', 'Robotics', 'Automobile Engineering'],
  'Civil Engineering': ['Structural Engineering', 'Concrete Technology', 'Geotechnical Engineering', 'Transportation Engineering', 'Surveying', 'Environmental Engineering', 'Construction Management', 'Hydraulics', 'Building Materials'],

  // Science
  'Physics': ['Classical Mechanics', 'Electromagnetism', 'Quantum Mechanics', 'Thermodynamics', 'Optics', 'Nuclear Physics', 'Solid State Physics', 'Mathematical Physics', 'Electronics'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Polymer Chemistry', 'Spectroscopy'],
  'Mathematics': ['Calculus', 'Linear Algebra', 'Real Analysis', 'Complex Analysis', 'Differential Equations', 'Probability & Statistics', 'Discrete Mathematics', 'Numerical Methods', 'Abstract Algebra'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Microbiology', 'Biochemistry', 'Molecular Biology', 'Physiology', 'Immunology'],
  'Computer Science': ['Programming', 'Data Structures', 'Algorithms', 'Operating Systems', 'Databases', 'Networks', 'AI & ML', 'Software Engineering'],
  'Biotechnology': ['Molecular Biology', 'Genetic Engineering', 'Bioprocess Technology', 'Immunology', 'Bioinformatics', 'Cell Culture', 'Downstream Processing'],
  'Data Science': ['Statistics', 'Machine Learning', 'Data Mining', 'Python/R', 'Big Data', 'Data Visualization', 'Deep Learning'],

  // Commerce & Management
  'General Management': ['Principles of Management', 'Business Communication', 'Financial Accounting', 'Marketing Management', 'Human Resource Management', 'Operations Management', 'Business Law'],
  'Finance': ['Financial Management', 'Investment Analysis', 'Corporate Finance', 'Portfolio Management', 'Banking', 'Financial Markets', 'Risk Management'],
  'Marketing': ['Marketing Management', 'Consumer Behavior', 'Digital Marketing', 'Brand Management', 'Sales Management', 'Advertising', 'Market Research'],
  'Accounting & Finance': ['Financial Accounting', 'Cost Accounting', 'Management Accounting', 'Taxation', 'Auditing', 'Corporate Finance', 'Financial Analysis'],
  'Business Analytics': ['Business Statistics', 'Data Analysis', 'Predictive Analytics', 'Marketing Analytics', 'Financial Analytics', 'Business Intelligence', 'SQL & Excel'],

  // Arts & Humanities
  'English': ['English Literature', 'Linguistics', 'Creative Writing', 'Communication Skills', 'Drama', 'Poetry', 'Novel Study'],
  'Psychology': ['General Psychology', 'Developmental Psychology', 'Social Psychology', 'Abnormal Psychology', 'Counseling Psychology', 'Cognitive Psychology'],
  'History': ['Ancient History', 'Medieval History', 'Modern History', 'World History', 'Indian History', 'Historiography'],
  'Economics': ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'International Economics', 'Development Economics', 'Econometrics'],
  'Political Science': ['Political Theory', 'Indian Constitution', 'Comparative Politics', 'International Relations', 'Public Administration'],

  // Default
  'default': ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Subject 5'],
};

// School streams for Class 11-12
export const schoolStreams = [
  { id: 'science_pcm', name: 'Science (PCM)' },
  { id: 'science_pcb', name: 'Science (PCB)' },
  { id: 'science_pcmb', name: 'Science (PCMB)' },
  { id: 'commerce', name: 'Commerce' },
  { id: 'arts', name: 'Arts/Humanities' },
];

// Helper functions
export const getStatesForCountry = (countryCode: string): string[] => {
  return statesByCountry[countryCode] || statesByCountry['default'];
};

export const getDistrictsForState = (state: string): string[] => {
  return districtsByState[state] || districtsByState['default'];
};

export const getBoardsForState = (state: string): string[] => {
  return boardsByState[state] || boardsByState['default'];
};

export const getUniversitiesForState = (state: string): string[] => {
  return universitiesByState[state] || universitiesByState['default'];
};

export const getCollegesForUniversity = (university: string): string[] => {
  return collegesByUniversity[university] || collegesByUniversity['default'];
};

export const getDepartmentsForCourse = (courseId: string): string[] => {
  return departmentsByCourse[courseId] || departmentsByCourse['default'];
};

export const getSubjectsForDepartment = (department: string): string[] => {
  // Find exact match first
  if (subjectsByDepartment[department]) {
    return subjectsByDepartment[department];
  }
  
  // Try partial match
  for (const key of Object.keys(subjectsByDepartment)) {
    if (department.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(department.toLowerCase())) {
      return subjectsByDepartment[key];
    }
  }
  
  return subjectsByDepartment['default'];
};

// Validation helpers
export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name.trim()) return { valid: false, error: 'Name is required' };
  if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, error: 'Name can only contain alphabets and spaces' };
  if (name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (name.trim().length > 50) return { valid: false, error: 'Name must be less than 50 characters' };
  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) return { valid: false, error: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, error: 'Enter a valid email address' };
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain at least one digit (0-9)' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, error: 'Password must contain at least one special character' };
  return { valid: true };
};

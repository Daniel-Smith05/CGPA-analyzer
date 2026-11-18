/**
 * Official University of Nigeria, Nsukka (UNN) Faculties, Departments,
 * Course Catalog (derived from UNN public academic handbooks & NUC CCMAS/BMAS structures),
 * and optional Demonstration Profiles for quick testing from the Student Profile page.
 */

export const UNN_FACULTIES = Object.freeze([
  {
    name: 'Faculty of Agriculture',
    degreePrefix: 'B.Agric.',
    departments: [
      'Agricultural Economics',
      'Agricultural Extension',
      'Animal Science',
      'Crop Science',
      'Food Science and Technology',
      'Home Science, Nutrition and Dietetics',
      'Soil Science',
    ],
  },
  {
    name: 'Faculty of Arts',
    degreePrefix: 'B.A.',
    departments: [
      'Archaeology and Tourism',
      'English and Literary Studies',
      'Fine and Applied Arts',
      'Foreign Languages and Literary Studies',
      'History and International Studies',
      'Linguistics, Igbo and Other Nigerian Languages',
      'Music',
      'Theatre and Film Studies',
    ],
  },
  {
    name: 'Faculty of Basic Medical Sciences',
    degreePrefix: 'B.Sc.',
    departments: ['Anatomy', 'Medical Biochemistry', 'Physiology'],
  },
  {
    name: 'Faculty of Biological Sciences',
    degreePrefix: 'B.Sc.',
    departments: [
      'Biochemistry',
      'Microbiology',
      'Plant Science and Biotechnology',
      'Zoology and Environmental Biology',
    ],
  },
  {
    name: 'Faculty of Business Administration',
    degreePrefix: 'B.Sc.',
    departments: ['Accountancy', 'Banking and Finance', 'Management', 'Marketing'],
  },
  {
    name: 'Faculty of Dentistry',
    degreePrefix: 'B.D.S.',
    departments: [
      'Child Dental Health',
      'Oral and Maxillofacial Surgery',
      'Preventive Dentistry',
      'Restorative Dentistry',
    ],
  },
  {
    name: 'Faculty of Education',
    degreePrefix: 'B.Ed.',
    departments: [
      'Adult Education and Extra-Mural Studies',
      'Arts Education',
      'Educational Foundations',
      'Health and Physical Education',
      'Library and Information Science',
      'Science Education',
      'Social Science Education',
    ],
  },
  {
    name: 'Faculty of Engineering',
    degreePrefix: 'B.Eng.',
    departments: [
      'Agricultural and Bioresources Engineering',
      'Biomedical Engineering',
      'Chemical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Electronic Engineering',
      'Materials and Metallurgical Engineering',
      'Mechanical Engineering',
      'Mechatronic Engineering',
    ],
  },
  {
    name: 'Faculty of Environmental Studies',
    degreePrefix: 'B.Sc.',
    departments: [
      'Architecture',
      'Estate Management',
      'Geoinformatics and Surveying',
      'Urban and Regional Planning',
    ],
  },
  {
    name: 'Faculty of Health Sciences and Technology',
    degreePrefix: 'B.Sc.',
    departments: ['Medical Laboratory Science', 'Medical Rehabilitation', 'Nursing Sciences'],
  },
  {
    name: 'Faculty of Law',
    degreePrefix: 'LL.B.',
    departments: [
      'International Law and Jurisprudence',
      'Property Law',
      'Public and Private Law',
    ],
  },
  {
    name: 'Faculty of Medical Sciences',
    degreePrefix: 'M.B.B.S.',
    departments: [
      'Anaesthesia',
      'Chemical Pathology',
      'Community Medicine',
      'Dermatology',
      'Haematology and Immunology',
      'Medicine',
      'Obstetrics and Gynaecology',
      'Ophthalmology',
      'Paediatrics',
      'Pharmacology and Therapeutics',
      'Surgery',
    ],
  },
  {
    name: 'Faculty of Pharmaceutical Sciences',
    degreePrefix: 'B.Pharm.',
    departments: [
      'Clinical Pharmacy and Pharmacy Management',
      'Pharmaceutical and Medicinal Chemistry',
      'Pharmaceutical Microbiology and Biotechnology',
      'Pharmaceutical Technology and Industrial Pharmacy',
      'Pharmaceutics',
      'Pharmacognosy and Environmental Medicines',
      'Pharmacology and Toxicology',
    ],
  },
  {
    name: 'Faculty of Physical Sciences',
    degreePrefix: 'B.Sc.',
    departments: [
      'Computer Science',
      'Geology',
      'Mathematics',
      'Physics and Astronomy',
      'Pure and Industrial Chemistry',
      'Science Laboratory Technology',
      'Statistics',
    ],
  },
  {
    name: 'Faculty of Social Sciences',
    degreePrefix: 'B.Sc.',
    departments: [
      'Economics',
      'Geography',
      'Mass Communication',
      'Philosophy',
      'Political Science',
      'Psychology',
      'Public Administration and Local Government',
      'Religion and Cultural Studies',
      'Social Work',
      'Sociology and Anthropology',
    ],
  },
  {
    name: 'Faculty of Veterinary Medicine',
    degreePrefix: 'D.V.M.',
    departments: [
      'Veterinary Anatomy',
      'Veterinary Animal Health and Production',
      'Veterinary Medicine',
      'Veterinary Obstetrics and Reproductive Diseases',
      'Veterinary Parasitology and Entomology',
      'Veterinary Pathology and Microbiology',
      'Veterinary Physiology and Pharmacology',
      'Veterinary Public Health and Preventive Medicine',
      'Veterinary Surgery',
    ],
  },
  {
    name: 'Faculty of Vocational and Technical Education',
    degreePrefix: 'B.Sc.(Ed.)',
    departments: [
      'Agricultural Education',
      'Business Education',
      'Computer Education',
      'Home Economics and Hospitality Management Education',
      'Industrial Technical Education',
    ],
  },
]);

export const UNN_GENERAL_COURSES = Object.freeze([
  { code: 'GSP 101', title: 'The Use of English I', units: 2, level: '100 Level' },
  { code: 'GSP 102', title: 'The Use of English II', units: 2, level: '100 Level' },
  { code: 'GSP 111', title: 'Use of Library and Study Skills', units: 2, level: '100 Level' },
  { code: 'GSP 201', title: 'Social Sciences I', units: 2, level: '200 Level' },
  { code: 'GSP 202', title: 'Issues in Peace and Conflict Studies', units: 2, level: '200 Level' },
  { code: 'GSP 207', title: 'Humanities I', units: 2, level: '200 Level' },
  { code: 'GSP 208', title: 'Humanities II', units: 2, level: '200 Level' },
]);

export const UNN_DEPARTMENT_COURSES = Object.freeze({
  'Computer Science': [
    { code: 'COS 101', title: 'Introduction to Computer Science', units: 2, level: '100 Level' },
    { code: 'COS 102', title: 'Introduction to Computer Systems', units: 2, level: '100 Level' },
    { code: 'MTH 111', title: 'Elementary Mathematics I', units: 3, level: '100 Level' },
    { code: 'MTH 121', title: 'Elementary Mathematics II', units: 3, level: '100 Level' },
    { code: 'PHY 115', title: 'General Physics for Physical Sciences I', units: 2, level: '100 Level' },
    { code: 'STA 111', title: 'Probability I', units: 2, level: '100 Level' },
    { code: 'COS 201', title: 'Computer Programming I', units: 2, level: '200 Level' },
    { code: 'COS 202', title: 'Computer Programming II', units: 2, level: '200 Level' },
    { code: 'COS 222', title: 'Introduction to File Processing', units: 2, level: '200 Level' },
    { code: 'COS 251', title: 'Assembly Language Programming', units: 2, level: '200 Level' },
    { code: 'COS 301', title: 'Introduction to Digital Design', units: 2, level: '300 Level' },
    { code: 'COS 303', title: 'Introduction to Microcomputer Systems', units: 2, level: '300 Level' },
    { code: 'COS 311', title: 'Numerical Methods I', units: 2, level: '300 Level' },
    { code: 'COS 321', title: 'Database Design & Management I', units: 2, level: '300 Level' },
    { code: 'COS 411', title: 'Numerical Methods II', units: 2, level: '400 Level' },
    { code: 'COS 451', title: 'Software Engineering', units: 3, level: '400 Level' },
  ],
  Mathematics: [
    { code: 'MTH 111', title: 'Elementary Mathematics I', units: 3, level: '100 Level' },
    { code: 'MTH 121', title: 'Elementary Mathematics II', units: 3, level: '100 Level' },
    { code: 'MTH 122', title: 'Elementary Mathematics III (Vectors & Geometry)', units: 3, level: '100 Level' },
    { code: 'MTH 211', title: 'Sets, Logic and Algebra', units: 3, level: '200 Level' },
    { code: 'MTH 215', title: 'Linear Algebra I', units: 3, level: '200 Level' },
    { code: 'MTH 221', title: 'Real Analysis I', units: 3, level: '200 Level' },
    { code: 'MTH 311', title: 'Abstract Algebra I', units: 3, level: '300 Level' },
    { code: 'MTH 321', title: 'Metric Spaces & Topology', units: 3, level: '300 Level' },
  ],
  Statistics: [
    { code: 'STA 111', title: 'Probability I', units: 2, level: '100 Level' },
    { code: 'STA 131', title: 'Inference I', units: 2, level: '100 Level' },
    { code: 'STA 211', title: 'Probability II', units: 3, level: '200 Level' },
    { code: 'STA 231', title: 'Statistical Inference II', units: 3, level: '200 Level' },
    { code: 'STA 311', title: 'Distribution Theory', units: 3, level: '300 Level' },
    { code: 'STA 341', title: 'Sampling Theory & Survey Methods', units: 3, level: '300 Level' },
  ],
  'Physics and Astronomy': [
    { code: 'PHY 115', title: 'General Physics for Physical Sciences I', units: 2, level: '100 Level' },
    { code: 'PHY 116', title: 'General Physics for Physical Sciences II', units: 2, level: '100 Level' },
    { code: 'PHY 191', title: 'Practical Physics I', units: 2, level: '100 Level' },
    { code: 'PHY 211', title: 'Classical Mechanics I', units: 3, level: '200 Level' },
    { code: 'PHY 221', title: 'Electricity and Magnetism', units: 3, level: '200 Level' },
    { code: 'PHY 311', title: 'Quantum Mechanics I', units: 3, level: '300 Level' },
  ],
  'Pure and Industrial Chemistry': [
    { code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, level: '100 Level' },
    { code: 'CHM 112', title: 'Basic Principles of Chemistry II', units: 2, level: '100 Level' },
    { code: 'CHM 171', title: 'Practical Chemistry I', units: 2, level: '100 Level' },
    { code: 'CHM 211', title: 'Inorganic Chemistry I', units: 3, level: '200 Level' },
    { code: 'CHM 221', title: 'Organic Chemistry I', units: 3, level: '200 Level' },
  ],
  'Electrical Engineering': [
    { code: 'ENGR 101', title: 'Introduction to Engineering', units: 2, level: '100 Level' },
    { code: 'MTH 111', title: 'Elementary Mathematics I', units: 3, level: '100 Level' },
    { code: 'MTH 121', title: 'Elementary Mathematics II', units: 3, level: '100 Level' },
    { code: 'PHY 115', title: 'General Physics for Physical Sciences I', units: 2, level: '100 Level' },
    { code: 'EEE 211', title: 'Basic Electrical Engineering', units: 3, level: '200 Level' },
    { code: 'MEC 211', title: 'Engineering Drawing I', units: 2, level: '200 Level' },
    { code: 'CVE 211', title: 'Strength of Materials I', units: 2, level: '200 Level' },
    { code: 'EEE 311', title: 'Electric Circuit Theory I', units: 3, level: '300 Level' },
    { code: 'EEE 321', title: 'Electromagnetic Fields & Waves', units: 3, level: '300 Level' },
  ],
  'Electronic Engineering': [
    { code: 'ENGR 101', title: 'Introduction to Engineering', units: 2, level: '100 Level' },
    { code: 'EEE 211', title: 'Basic Electrical Engineering', units: 3, level: '200 Level' },
    { code: 'MEC 211', title: 'Engineering Drawing I', units: 2, level: '200 Level' },
    { code: 'ECE 271', title: 'System Programming', units: 2, level: '300 Level' },
    { code: 'ECE 311', title: 'Electronic Circuits I', units: 3, level: '300 Level' },
    { code: 'ECE 331', title: 'Signals and Systems', units: 3, level: '300 Level' },
  ],
  'Civil Engineering': [
    { code: 'ENGR 101', title: 'Introduction to Engineering', units: 2, level: '100 Level' },
    { code: 'CVE 211', title: 'Strength of Materials I', units: 2, level: '200 Level' },
    { code: 'MEC 211', title: 'Engineering Drawing I', units: 2, level: '200 Level' },
    { code: 'CVE 311', title: 'Structural Mechanics I', units: 3, level: '300 Level' },
    { code: 'CVE 321', title: 'Soil Mechanics I', units: 3, level: '300 Level' },
  ],
  'Mechanical Engineering': [
    { code: 'ENGR 101', title: 'Introduction to Engineering', units: 2, level: '100 Level' },
    { code: 'MEC 211', title: 'Engineering Drawing I', units: 2, level: '200 Level' },
    { code: 'CVE 211', title: 'Strength of Materials I', units: 2, level: '200 Level' },
    { code: 'MEC 311', title: 'Engineering Thermodynamics I', units: 3, level: '300 Level' },
    { code: 'MEC 321', title: 'Fluid Mechanics I', units: 3, level: '300 Level' },
  ],
  Economics: [
    { code: 'ECO 101', title: 'Principles of Economics I', units: 2, level: '100 Level' },
    { code: 'ECO 102', title: 'Principles of Economics II', units: 2, level: '100 Level' },
    { code: 'ACC 101', title: 'Elements of Accounting I', units: 2, level: '100 Level' },
    { code: 'ECO 201', title: 'Microeconomic Theory I', units: 3, level: '200 Level' },
    { code: 'ECO 202', title: 'Macroeconomic Theory I', units: 3, level: '200 Level' },
    { code: 'ECO 301', title: 'Microeconomic Theory II', units: 3, level: '300 Level' },
    { code: 'ECO 311', title: 'Econometrics I', units: 3, level: '300 Level' },
  ],
  Accountancy: [
    { code: 'ACC 101', title: 'Elements of Accounting I', units: 3, level: '100 Level' },
    { code: 'ACC 102', title: 'Elements of Accounting II', units: 3, level: '100 Level' },
    { code: 'ECO 101', title: 'Principles of Economics I', units: 2, level: '100 Level' },
    { code: 'ACC 201', title: 'Financial Accounting I', units: 3, level: '200 Level' },
    { code: 'ACC 211', title: 'Cost Accounting I', units: 3, level: '200 Level' },
  ],
  'Mass Communication': [
    { code: 'MAC 101', title: 'Introduction to Mass Communication', units: 4, level: '100 Level' },
    { code: 'MAC 102', title: 'History of Nigerian Mass Media', units: 2, level: '100 Level' },
    { code: 'MAC 201', title: 'News Writing and Reporting', units: 3, level: '200 Level' },
    { code: 'MAC 211', title: 'Theories of Mass Communication', units: 3, level: '200 Level' },
  ],
  Biochemistry: [
    { code: 'BIO 151', title: 'General Biology I', units: 3, level: '100 Level' },
    { code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, level: '100 Level' },
    { code: 'BCH 201', title: 'General Biochemistry I', units: 3, level: '200 Level' },
    { code: 'MCB 201', title: 'General Microbiology I', units: 3, level: '200 Level' },
    { code: 'BCH 301', title: 'Enzymology and Metabolism', units: 3, level: '300 Level' },
  ],
  Microbiology: [
    { code: 'BIO 151', title: 'General Biology I', units: 3, level: '100 Level' },
    { code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, level: '100 Level' },
    { code: 'MCB 201', title: 'General Microbiology I', units: 3, level: '200 Level' },
    { code: 'BCH 201', title: 'General Biochemistry I', units: 3, level: '200 Level' },
    { code: 'MCB 301', title: 'Bacteriology', units: 3, level: '300 Level' },
  ],
  'Nursing Sciences': [
    { code: 'BIO 151', title: 'General Biology I', units: 3, level: '100 Level' },
    { code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, level: '100 Level' },
    { code: 'NSC 201', title: 'Foundations of Professional Nursing Practice I', units: 3, level: '200 Level' },
    { code: 'NSC 202', title: 'Foundations of Professional Nursing Practice II', units: 3, level: '200 Level' },
  ],
  Architecture: [
    { code: 'ARC 101', title: 'Introduction to Architecture I', units: 3, level: '100 Level' },
    { code: 'ARC 111', title: 'Architectural Graphics I', units: 3, level: '100 Level' },
    { code: 'ARC 201', title: 'Architectural Design I', units: 4, level: '200 Level' },
  ],
  'Public and Private Law': [
    { code: 'PUL 201', title: 'Constitutional Law I', units: 4, level: '200 Level' },
    { code: 'PUL 202', title: 'Constitutional Law II', units: 4, level: '200 Level' },
    { code: 'PUL 301', title: 'Criminal Law I', units: 4, level: '300 Level' },
  ],
});

/**
 * Returns UNN departments for a given faculty name.
 * @param {string} facultyName
 */
export function getDepartmentsForFaculty(facultyName) {
  const faculty = UNN_FACULTIES.find((f) => f.name === facultyName);
  return faculty ? faculty.departments : [];
}

/**
 * Suggests a degree programme title given faculty and department.
 * @param {string} facultyName
 * @param {string} departmentName
 */
export function suggestCourseTitle(facultyName, departmentName) {
  const faculty = UNN_FACULTIES.find((f) => f.name === facultyName);
  if (!faculty || !departmentName) return '';
  return `${faculty.degreePrefix} ${departmentName}`;
}

/**
 * Returns quick-pick UNN courses for a given department + General Studies courses.
 * If the department is not explicitly mapped, provides faculty-relevant foundation + GSP courses.
 * @param {string} departmentName
 * @param {string} facultyName
 */
export function getCourseCatalogForStudent(departmentName, facultyName = '') {
  const deptCourses = UNN_DEPARTMENT_COURSES[departmentName] || [];
  let extraCourses = [];

  if (deptCourses.length === 0) {
    if (facultyName === 'Faculty of Engineering') {
      extraCourses = UNN_DEPARTMENT_COURSES['Electrical Engineering'] || [];
    } else if (facultyName === 'Faculty of Physical Sciences') {
      extraCourses = UNN_DEPARTMENT_COURSES['Computer Science'] || [];
    } else if (facultyName === 'Faculty of Biological Sciences' || facultyName === 'Faculty of Health Sciences and Technology') {
      extraCourses = UNN_DEPARTMENT_COURSES.Biochemistry || [];
    } else if (facultyName === 'Faculty of Business Administration' || facultyName === 'Faculty of Social Sciences') {
      extraCourses = UNN_DEPARTMENT_COURSES.Economics || [];
    } else {
      extraCourses = [
        ...(UNN_DEPARTMENT_COURSES['Computer Science']?.slice(0, 2) || []),
        ...(UNN_DEPARTMENT_COURSES.Economics?.slice(0, 2) || []),
      ];
    }
  }

  const combined = [...deptCourses, ...extraCourses, ...UNN_GENERAL_COURSES];
  const seen = new Set();
  return combined.filter((c) => {
    if (seen.has(c.code)) return false;
    seen.add(c.code);
    return true;
  });
}

/**
 * Optional Demonstration Profiles selectable inside the Student Profile page.
 */
export const DEMO_PROFILES = Object.freeze({
  unn_csc_300: {
    label: 'UNN Computer Science · 300 Level (3 Years)',
    profile: {
      name: 'Chinedu Okafor',
      regNo: '2023/256558',
      faculty: 'Faculty of Physical Sciences',
      department: 'Computer Science',
      course: 'B.Sc. Computer Science',
      entryYear: '2023',
      level: '300 Level',
      currentSession: '2025/2026',
      targetCgpa: 4.5,
      avatarDataUrl: '',
    },
    selectedSessionId: 'demo-csc-300-1',
    sessions: [
      {
        id: 'demo-csc-100-1',
        academicYear: '2023/2024',
        level: '100 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'dc1', code: 'COS 101', title: 'Introduction to Computer Science', units: 2, grade: 'A' },
          { id: 'dc2', code: 'MTH 111', title: 'Elementary Mathematics I', units: 3, grade: 'B' },
          { id: 'dc3', code: 'PHY 115', title: 'General Physics for Physical Sciences I', units: 2, grade: 'B' },
          { id: 'dc4', code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, grade: 'A' },
          { id: 'dc5', code: 'GSP 101', title: 'The Use of English I', units: 2, grade: 'A' },
        ],
      },
      {
        id: 'demo-csc-100-2',
        academicYear: '2023/2024',
        level: '100 Level',
        semesterName: 'Second Semester',
        courses: [
          { id: 'dc6', code: 'COS 102', title: 'Introduction to Computer Systems', units: 2, grade: 'A' },
          { id: 'dc7', code: 'MTH 121', title: 'Elementary Mathematics II', units: 3, grade: 'A' },
          { id: 'dc8', code: 'STA 111', title: 'Probability I', units: 2, grade: 'B' },
          { id: 'dc9', code: 'GSP 102', title: 'The Use of English II', units: 2, grade: 'A' },
        ],
      },
      {
        id: 'demo-csc-200-1',
        academicYear: '2024/2025',
        level: '200 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'dc10', code: 'COS 201', title: 'Computer Programming I', units: 2, grade: 'A' },
          { id: 'dc11', code: 'COS 251', title: 'Assembly Language Programming', units: 2, grade: 'B' },
          { id: 'dc12', code: 'GSP 201', title: 'Social Sciences I', units: 2, grade: 'A' },
          { id: 'dc13', code: 'GSP 207', title: 'Humanities I', units: 2, grade: 'A' },
        ],
      },
      {
        id: 'demo-csc-200-2',
        academicYear: '2024/2025',
        level: '200 Level',
        semesterName: 'Second Semester',
        courses: [
          { id: 'dc14', code: 'COS 202', title: 'Computer Programming II', units: 2, grade: 'A' },
          { id: 'dc15', code: 'COS 222', title: 'Introduction to File Processing', units: 2, grade: 'A' },
          { id: 'dc16', code: 'GSP 202', title: 'Issues in Peace and Conflict Studies', units: 2, grade: 'B' },
        ],
      },
      {
        id: 'demo-csc-300-1',
        academicYear: '2025/2026',
        level: '300 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'dc17', code: 'COS 301', title: 'Introduction to Digital Design', units: 2, grade: 'A' },
          { id: 'dc18', code: 'COS 303', title: 'Introduction to Microcomputer Systems', units: 2, grade: 'A' },
          { id: 'dc19', code: 'COS 311', title: 'Numerical Methods I', units: 2, grade: 'B' },
          { id: 'dc20', code: 'COS 321', title: 'Database Design & Management I', units: 2, grade: 'A' },
        ],
      },
    ],
  },
  unn_eee_200: {
    label: 'UNN Electrical Engineering · 200 Level (2 Years)',
    profile: {
      name: 'Adaeze Nwosu',
      regNo: '2024/248912',
      faculty: 'Faculty of Engineering',
      department: 'Electrical Engineering',
      course: 'B.Eng. Electrical Engineering',
      entryYear: '2024',
      level: '200 Level',
      currentSession: '2025/2026',
      targetCgpa: 4.5,
      avatarDataUrl: '',
    },
    selectedSessionId: 'demo-eee-200-1',
    sessions: [
      {
        id: 'demo-eee-100-1',
        academicYear: '2024/2025',
        level: '100 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'de1', code: 'ENGR 101', title: 'Introduction to Engineering', units: 2, grade: 'A' },
          { id: 'de2', code: 'MTH 111', title: 'Elementary Mathematics I', units: 3, grade: 'A' },
          { id: 'de3', code: 'PHY 115', title: 'General Physics for Physical Sciences I', units: 2, grade: 'B' },
          { id: 'de4', code: 'GSP 101', title: 'The Use of English I', units: 2, grade: 'A' },
        ],
      },
      {
        id: 'demo-eee-100-2',
        academicYear: '2024/2025',
        level: '100 Level',
        semesterName: 'Second Semester',
        courses: [
          { id: 'de5', code: 'MTH 121', title: 'Elementary Mathematics II', units: 3, grade: 'B' },
          { id: 'de6', code: 'CHM 101', title: 'Basic Principles of Chemistry I', units: 2, grade: 'A' },
          { id: 'de7', code: 'GSP 102', title: 'The Use of English II', units: 2, grade: 'B' },
        ],
      },
      {
        id: 'demo-eee-200-1',
        academicYear: '2025/2026',
        level: '200 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'de8', code: 'EEE 211', title: 'Basic Electrical Engineering', units: 3, grade: 'A' },
          { id: 'de9', code: 'MEC 211', title: 'Engineering Drawing I', units: 2, grade: 'B' },
          { id: 'de10', code: 'CVE 211', title: 'Strength of Materials I', units: 2, grade: 'A' },
          { id: 'de11', code: 'GSP 201', title: 'Social Sciences I', units: 2, grade: 'A' },
        ],
      },
    ],
  },
  unn_eco_200: {
    label: 'UNN Economics · 200 Level (2 Years)',
    profile: {
      name: 'Ikenna Eze',
      regNo: '2024/243105',
      faculty: 'Faculty of Social Sciences',
      department: 'Economics',
      course: 'B.Sc. Economics',
      entryYear: '2024',
      level: '200 Level',
      currentSession: '2025/2026',
      targetCgpa: 4.0,
      avatarDataUrl: '',
    },
    selectedSessionId: 'demo-eco-200-1',
    sessions: [
      {
        id: 'demo-eco-100-1',
        academicYear: '2024/2025',
        level: '100 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'dec1', code: 'ECO 101', title: 'Principles of Economics I', units: 2, grade: 'A' },
          { id: 'dec2', code: 'ACC 101', title: 'Elements of Accounting I', units: 2, grade: 'B' },
          { id: 'dec3', code: 'GSP 101', title: 'The Use of English I', units: 2, grade: 'B' },
        ],
      },
      {
        id: 'demo-eco-200-1',
        academicYear: '2025/2026',
        level: '200 Level',
        semesterName: 'First Semester',
        courses: [
          { id: 'dec4', code: 'ECO 201', title: 'Microeconomic Theory I', units: 3, grade: 'A' },
          { id: 'dec5', code: 'ECO 202', title: 'Macroeconomic Theory I', units: 3, grade: 'B' },
          { id: 'dec6', code: 'GSP 201', title: 'Social Sciences I', units: 2, grade: 'A' },
        ],
      },
    ],
  },
});

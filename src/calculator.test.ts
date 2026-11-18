import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GRADE_SCALE,
  formatConsecutiveAcademicYear,
  isValidAcademicYear,
  deriveLevelFromAcademicYear,
  deriveAcademicYearFromLevel,
  validateNewSession,
  realignSessionsToEntryYear,
  isValidRegNoFormat,
  validateCourse,
  calculateSemesterMetrics,
  calculatePortalAnalytics,
  getAcademicStanding,
  formatTranscriptCsv,
  parseTranscriptCsv,
} from './calculator.js';

test('GRADE_SCALE maps A=5 down to F=0', () => {
  assert.deepEqual(GRADE_SCALE, { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 });
});

test('Academic Year strictly enforces consecutive YYYY/(YYYY+1) format', () => {
  assert.equal(formatConsecutiveAcademicYear(2024), '2024/2025');
  assert.equal(isValidAcademicYear('2023/2024'), true);
  assert.equal(isValidAcademicYear('2024/2025'), true);
  assert.equal(isValidAcademicYear('2024/2027'), false);
  assert.equal(isValidAcademicYear('2024/2023'), false);
  assert.equal(isValidAcademicYear('2024/2029'), false);
});

test('Level and Academic Year map deterministically from Entry Year', () => {
  assert.equal(deriveLevelFromAcademicYear('2023', '2023/2024'), '100 Level');
  assert.equal(deriveLevelFromAcademicYear('2023', '2024/2025'), '200 Level');
  assert.equal(deriveLevelFromAcademicYear('2023', '2022/2023'), null);
  assert.equal(deriveAcademicYearFromLevel('2023', '200 Level'), '2024/2025');
});

test('validateNewSession rejects contradictory years, levels, and duplicate semesters', () => {
  const existing = [
    { id: 's1', academicYear: '2023/2024', level: '100 Level', semesterName: 'First Semester', courses: [] },
  ];

  // Contradictory non-consecutive year
  assert.equal(
    validateNewSession(existing, { academicYear: '2024/2027', level: '200 Level', semesterName: 'First Semester' }, '2023').valid,
    false
  );

  // Second year cannot be in 2023/2024
  assert.equal(
    validateNewSession(existing, { academicYear: '2023/2024', level: '200 Level', semesterName: 'Second Semester' }, '2023').valid,
    false
  );

  // Duplicate First Semester in 2023/2024
  assert.equal(
    validateNewSession(existing, { academicYear: '2023/2024', level: '100 Level', semesterName: 'First Semester' }, '2023').valid,
    false
  );

  // Valid Second Semester in 2023/2024
  assert.equal(
    validateNewSession(existing, { academicYear: '2023/2024', level: '100 Level', semesterName: 'Second Semester' }, '2023').valid,
    true
  );

  // Valid First Semester in 2024/2025 for 200 Level
  assert.equal(
    validateNewSession(existing, { academicYear: '2024/2025', level: '200 Level', semesterName: 'First Semester' }, '2023').valid,
    true
  );
});

test('isValidRegNoFormat validates YYYY/XXXXXX format e.g. 2023/256558', () => {
  assert.equal(isValidRegNoFormat('2023/256558'), true);
  assert.equal(isValidRegNoFormat('2024/240192'), true);
  assert.equal(isValidRegNoFormat('CSC/2023/0418'), false);
  assert.equal(isValidRegNoFormat('2023/12345'), false);
});

test('validateCourse rejects missing fields and out-of-range credit units', () => {
  assert.equal(validateCourse({ code: '', title: '', units: 3, grade: 'A' }).valid, false);
  assert.equal(validateCourse({ code: 'COS 101', title: 'Intro', units: 0, grade: 'A' }).valid, false);
  assert.equal(validateCourse({ code: 'COS 101', title: 'Intro', units: 7, grade: 'A' }).valid, false);
  assert.equal(validateCourse({ code: 'COS 101', title: 'Intro', units: 2, grade: 'A' }).valid, true);
});

test('calculateSemesterMetrics & calculatePortalAnalytics handle bare empty state and multi-year grouping', () => {
  const bareAnalytics = calculatePortalAnalytics([], null);
  assert.equal(bareAnalytics.cumulativeUnits, 0);
  assert.equal(bareAnalytics.cgpa, 0);
  assert.equal(bareAnalytics.standing.label, 'Not Evaluated');

  const sessions = [
    {
      id: 's1',
      academicYear: '2023/2024',
      level: '100 Level',
      semesterName: 'First Semester',
      courses: [
        { id: '1', code: 'COS 101', title: 'Intro', units: 5, grade: 'B' },
        { id: '1b', code: 'MTH 111', title: 'Math', units: 5, grade: 'B' },
      ],
    },
    {
      id: 's2',
      academicYear: '2023/2024',
      level: '100 Level',
      semesterName: 'Second Semester',
      courses: [
        { id: '2', code: 'COS 102', title: 'Systems', units: 5, grade: 'A' },
        { id: '2b', code: 'MTH 121', title: 'Math II', units: 5, grade: 'A' },
      ],
    },
    {
      id: 's3',
      academicYear: '2024/2025',
      level: '200 Level',
      semesterName: 'First Semester',
      courses: [
        { id: '3', code: 'COS 201', title: 'Prog I', units: 5, grade: 'A' },
        { id: '3b', code: 'GSP 201', title: 'Soc Sci', units: 5, grade: 'A' },
      ],
    },
  ];

  const analytics = calculatePortalAnalytics(sessions, 's1');
  assert.equal(analytics.yearGroups.length, 2);
  assert.equal(analytics.yearGroups[0].yearGpa, 4.5);
  assert.equal(analytics.yearGroups[1].yearGpa, 5.0);
  assert.equal(analytics.cgpa, 4.67);
  assert.equal(analytics.standing.label, 'First Class');
});

test('getAcademicStanding and formatTranscriptCsv cover all boundaries', () => {
  assert.equal(getAcademicStanding(4.5, 18).label, 'First Class');
  assert.equal(getAcademicStanding(3.5, 18).label, 'Second Class Upper');
  assert.equal(getAcademicStanding(0.9, 18).label, 'Probation');

  const sessions = [
    {
      id: 's1',
      academicYear: '2023/2024',
      level: '100 Level',
      semesterName: 'First Semester',
      courses: [{ id: '1', code: 'COS 101', title: 'Intro to CS', units: 2, grade: 'A' }],
    },
  ];
  const analytics = calculatePortalAnalytics(sessions, 's1');
  const csv = formatTranscriptCsv(
    { name: 'Chinedu Okafor', regNo: '2023/256558', faculty: 'Physical Sciences', department: 'Computer Science', course: 'B.Sc. Computer Science', level: '100 Level' },
    analytics,
    'all'
  );
  assert.match(csv, /2023\/256558/);
  assert.match(csv, /COS 101,Intro to CS,2,A,5,10,Pass/);
});

test('realignSessionsToEntryYear shifts session years consistently and validateCourse handles string/decimal units', () => {
  const realigned = realignSessionsToEntryYear(
    [
      { id: 's1', academicYear: '2024/2025', level: '100 Level', semesterName: 'First Semester', courses: [] },
      { id: 's2', academicYear: '2025/2026', level: '200 Level', semesterName: 'First Semester', courses: [] },
    ],
    '2022'
  );
  assert.equal(realigned[0].academicYear, '2022/2023');
  assert.equal(realigned[1].academicYear, '2023/2024');

  assert.equal(validateCourse({ code: 'cos 101', title: 'Intro', units: '3', grade: 'a' }).valid, true);
  assert.equal(validateCourse({ code: 'COS 101', title: 'Intro', units: '3.5', grade: 'A' }).valid, false);
  assert.equal(validateCourse({ code: 'COS 101', title: 'Intro', units: '', grade: 'A' }).valid, false);
});

test('parseTranscriptCsv round-trips both all-years and selected-session exported CSVs', () => {
  const profile = {
    name: 'Daniel Mbibe',
    regNo: '2023/256558',
    faculty: 'Faculty of Physical Sciences',
    department: 'Computer Science',
    course: 'B.Sc. Computer Science',
    level: '200 Level',
  };
  const sessions = [
    {
      id: 's1',
      academicYear: '2023/2024',
      level: '100 Level',
      semesterName: 'First Semester',
      courses: [{ id: 'c1', code: 'COS 101', title: 'Introduction, Computing & Logic', units: 2, grade: 'A' }],
    },
    {
      id: 's2',
      academicYear: '2024/2025',
      level: '200 Level',
      semesterName: 'First Semester',
      courses: [{ id: 'c2', code: 'COS 201', title: 'Computer Programming I', units: 3, grade: 'B' }],
    },
  ];
  const analytics = calculatePortalAnalytics(sessions, 's2');

  // Round-trip "all" scope
  const csvAll = formatTranscriptCsv(profile, analytics, 'all');
  const importedAll = parseTranscriptCsv(csvAll);
  assert.equal(importedAll.ok, true);
  assert.ok(importedAll.profile && importedAll.sessions);
  assert.equal(importedAll.profile.name, 'Daniel Mbibe');
  assert.equal(importedAll.profile.regNo, '2023/256558');
  assert.equal(importedAll.profile.faculty, 'Faculty of Physical Sciences');
  assert.equal(importedAll.profile.department, 'Computer Science');
  assert.equal(importedAll.profile.entryYear, '2023');
  assert.equal(importedAll.profile.currentSession, '2024/2025');
  assert.equal(importedAll.sessions.length, 2);
  assert.equal(importedAll.sessions[0].courses[0].title, 'Introduction, Computing & Logic');

  // Round-trip "selected" scope
  const csvSel = formatTranscriptCsv(profile, analytics, 'selected');
  const importedSel = parseTranscriptCsv(csvSel);
  assert.equal(importedSel.ok, true);
  assert.ok(importedSel.profile && importedSel.sessions);
  assert.equal(importedSel.profile.name, 'Daniel Mbibe');
  assert.equal(importedSel.profile.entryYear, '2023');
  assert.equal(importedSel.sessions.length, 1);
  assert.equal(importedSel.sessions[0].courses[0].code, 'COS 201');

  // Invalid CSV rejected cleanly
  assert.equal(parseTranscriptCsv('foo,bar\n1,2').ok, false);
});

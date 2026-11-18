/**
 * Pure calculation, year/level consistency validation, year-grouping,
 * and academic standing logic for the Student Result & CGPA Analytics Portal.
 */

export const GRADE_SCALE = Object.freeze({
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
});

export const VALID_GRADES = Object.freeze(['A', 'B', 'C', 'D', 'E', 'F']);

export const VALID_LEVELS = Object.freeze([
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  '600 Level',
]);

/**
 * Formats a consecutive academic session string from a start year (e.g. 2024 -> "2024/2025").
 * @param {number|string} startYear
 * @returns {string}
 */
export function formatConsecutiveAcademicYear(startYear) {
  const y = Number.parseInt(String(startYear), 10);
  if (!Number.isInteger(y) || y < 2000 || y > 2099) return '';
  return `${y}/${y + 1}`;
}

/**
 * Checks that an academic year string is strictly consecutive YYYY/(YYYY+1) (e.g. 2023/2024, 2024/2025).
 * Rejects contradictory strings like 2024/2027 or 2024/2023.
 * @param {string} yearStr
 * @returns {boolean}
 */
export function isValidAcademicYear(yearStr) {
  const match = /^(\d{4})\/(\d{4})$/.exec(String(yearStr || '').trim());
  if (!match) return false;
  const start = Number.parseInt(match[1], 10);
  const end = Number.parseInt(match[2], 10);
  return end === start + 1;
}

/**
 * Generates valid consecutive academic year choices for a student's Entry Year (100L–600L).
 * @param {number|string} entryYear
 * @returns {Array<{ academicYear: string, level: string }>}
 */
export function getYearLevelMappings(entryYear) {
  const start = Number.parseInt(String(entryYear || '2024'), 10);
  if (!Number.isInteger(start) || start < 2000 || start > 2099) return [];
  return VALID_LEVELS.map((level, index) => ({
    academicYear: formatConsecutiveAcademicYear(start + index),
    level,
  }));
}

/**
 * Derives the exact expected Level from Entry Year and Academic Year.
 * Example: Entry 2023 + 2023/2024 -> "100 Level"; Entry 2023 + 2024/2025 -> "200 Level".
 * @param {number|string} entryYear
 * @param {string} academicYear
 * @returns {string|null}
 */
export function deriveLevelFromAcademicYear(entryYear, academicYear) {
  if (!isValidAcademicYear(academicYear)) return null;
  const entry = Number.parseInt(String(entryYear), 10);
  const sessionStart = Number.parseInt(academicYear.split('/')[0], 10);
  const offset = sessionStart - entry;
  if (!Number.isInteger(entry) || offset < 0 || offset >= VALID_LEVELS.length) {
    return null;
  }
  return VALID_LEVELS[offset];
}

/**
 * Derives the exact Academic Year from Entry Year and Level.
 * Example: Entry 2023 + "200 Level" -> "2024/2025".
 * @param {number|string} entryYear
 * @param {string} level
 * @returns {string}
 */
export function deriveAcademicYearFromLevel(entryYear, level) {
  const idx = VALID_LEVELS.indexOf(level);
  const entry = Number.parseInt(String(entryYear), 10);
  if (idx === -1 || !Number.isInteger(entry)) return '';
  return formatConsecutiveAcademicYear(entry + idx);
}

/**
 * Validates that a new session does not violate academic year / level consistency:
 * 1. Year must be consecutive YYYY/(YYYY+1).
 * 2. Level must match Entry Year progression (no 100L and 200L in the same year).
 * 3. Cannot assign two different levels to the same Academic Year.
 * 4. Cannot assign the same Level to two different Academic Years.
 * 5. Cannot add a duplicate (academicYear, semesterName).
 * @param {Array} existingSessions
 * @param {{ academicYear: string, level: string, semesterName: string }} candidate
 * @param {number|string} entryYear
 */
export function validateNewSession(existingSessions, candidate, entryYear) {
  const academicYear = String(candidate?.academicYear || '').trim();
  const level = String(candidate?.level || '').trim();
  const semesterName = String(candidate?.semesterName || '').trim();

  if (!isValidAcademicYear(academicYear)) {
    return {
      valid: false,
      error: 'Academic Year must follow consecutive format YYYY/(YYYY+1), such as 2023/2024 or 2024/2025.',
    };
  }

  if (!VALID_LEVELS.includes(level)) {
    return { valid: false, error: 'Please select a valid academic level (100 Level – 600 Level).' };
  }

  if (!semesterName) {
    return { valid: false, error: 'Please select a semester (First Semester or Second Semester).' };
  }

  const expectedLevel = deriveLevelFromAcademicYear(entryYear, academicYear);
  if (!expectedLevel) {
    return {
      valid: false,
      error: `Academic Year ${academicYear} is outside the valid progression starting from Entry Year ${entryYear}.`,
    };
  }

  if (expectedLevel !== level) {
    return {
      valid: false,
      error: `With Entry Year ${entryYear}, ${academicYear} corresponds strictly to ${expectedLevel} (cannot assign ${level} to ${academicYear}).`,
    };
  }

  const sessions = Array.isArray(existingSessions) ? existingSessions : [];

  for (const s of sessions) {
    if (s.academicYear === academicYear && s.level !== level) {
      return {
        valid: false,
        error: `${academicYear} is already assigned to ${s.level}. You cannot place multiple levels in the same year.`,
      };
    }
    if (s.level === level && s.academicYear !== academicYear) {
      return {
        valid: false,
        error: `${level} is already assigned to ${s.academicYear}. Each level belongs to a single academic year.`,
      };
    }
    if (s.academicYear === academicYear && s.semesterName.toLowerCase() === semesterName.toLowerCase()) {
      return {
        valid: false,
        error: `${academicYear} · ${semesterName} already exists. Select it to edit its courses.`,
      };
    }
  }

  return { valid: true, error: '' };
}

/**
 * Realigns existing sessions' academicYear values to remain strictly consistent
 * with their assigned Level whenever a student updates their Entry Year.
 * @param {Array} sessions
 * @param {number|string} entryYear
 * @returns {Array}
 */
export function realignSessionsToEntryYear(sessions, entryYear) {
  return (Array.isArray(sessions) ? sessions : []).map((session) => {
    const syncedYear = deriveAcademicYearFromLevel(entryYear, session.level);
    return syncedYear ? { ...session, academicYear: syncedYear } : session;
  });
}

/**
 * Validates student registration number against the year/6-digit pattern (e.g., 2023/256558).
 * @param {string} regNo
 * @returns {boolean}
 */
export function isValidRegNoFormat(regNo) {
  return /^\d{4}\/\d{6}$/.test(String(regNo || '').trim());
}

/**
 * Validates a single course entry.
 * @param {{ id?: string, code?: string, title?: string, units?: number|string, grade?: string }} course
 */
export function validateCourse(course) {
  const errors = {};
  const code = typeof course?.code === 'string' ? course.code.trim() : '';
  const title = typeof course?.title === 'string' ? course.title.trim() : '';
  const unitsNum = Number(course?.units);
  const grade = typeof course?.grade === 'string' ? course.grade.trim().toUpperCase() : '';

  if (!code) {
    errors.code = 'Course code is required.';
  }
  if (!title) {
    errors.title = 'Course title is required.';
  }
  if (!Number.isInteger(unitsNum) || unitsNum < 1 || unitsNum > 6) {
    errors.units = 'Credit units must be an integer between 1 and 6.';
  }
  if (!Object.prototype.hasOwnProperty.call(GRADE_SCALE, grade)) {
    errors.grade = 'Grade must be A, B, C, D, E, or F.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes metrics for an array of courses in one semester session.
 * @param {Array<{ id?: string, code: string, title: string, units: number|string, grade: string }>} courses
 */
export function calculateSemesterMetrics(courses) {
  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  const rows = [];
  let totalUnits = 0;
  let totalQualityPoints = 0;

  for (const course of Array.isArray(courses) ? courses : []) {
    const check = validateCourse(course);
    if (!check.valid) continue;

    const units = Number(course.units);
    const grade = course.grade.trim().toUpperCase();
    const gradePoint = GRADE_SCALE[grade];
    const qualityPoints = units * gradePoint;

    totalUnits += units;
    totalQualityPoints += qualityPoints;
    gradeDistribution[grade] += 1;

    rows.push({
      id: course.id || course.code.trim(),
      code: course.code.trim().toUpperCase(),
      title: course.title.trim(),
      units,
      grade,
      gradePoint,
      qualityPoints,
      remark: grade === 'F' ? 'Fail' : 'Pass',
    });
  }

  const rawGpa = totalUnits > 0 ? totalQualityPoints / totalUnits : 0;
  const gpa = Math.round(rawGpa * 100) / 100;

  return {
    totalUnits,
    totalQualityPoints,
    gpa,
    rawGpa,
    gradeDistribution,
    rows,
  };
}

/**
 * Computes metrics for a single academic session.
 * @param {{ id: string, academicYear: string, level: string, semesterName: string, courses?: Array }} session
 */
export function calculateSessionMetrics(session) {
  const courses = Array.isArray(session?.courses) ? session.courses : [];
  const courseMetrics = calculateSemesterMetrics(courses);

  return {
    ...courseMetrics,
    courseCount: courseMetrics.rows.length,
  };
}

/**
 * Classifies Academic Standing on the 5.00 grading scale.
 * @param {number} cgpa
 * @param {number} cumulativeUnits
 */
export function getAcademicStanding(cgpa, cumulativeUnits) {
  if (!cumulativeUnits || cumulativeUnits <= 0) {
    return {
      label: 'Not Evaluated',
      detail: 'Add courses to evaluate standing',
      tone: 'neutral',
    };
  }

  const rounded = Math.round(cgpa * 100) / 100;

  if (rounded >= 4.5) {
    return {
      label: 'First Class',
      detail: 'Honours distinction (4.50 – 5.00)',
      tone: 'emerald',
    };
  }
  if (rounded >= 3.5) {
    return {
      label: 'Second Class Upper',
      detail: 'Good standing · 2:1 (3.50 – 4.49)',
      tone: 'gold',
    };
  }
  if (rounded >= 2.4) {
    return {
      label: 'Second Class Lower',
      detail: 'Good standing · 2:2 (2.40 – 3.49)',
      tone: 'gold',
    };
  }
  if (rounded >= 1.5) {
    return {
      label: 'Good Standing (3rd Class)',
      detail: 'Pass standing (1.50 – 2.39)',
      tone: 'amber',
    };
  }
  if (rounded >= 1.0) {
    return {
      label: 'Academic Warning',
      detail: 'Below 1.50 CGPA threshold (1.00 – 1.49)',
      tone: 'amber',
    };
  }
  return {
    label: 'Probation',
    detail: 'Academic probation (< 1.00 CGPA)',
    tone: 'rose',
  };
}

/**
 * Sorts sessions chronologically by Academic Year then First/Second Semester,
 * groups them by Academic Year, and computes Cumulative CGPA metrics.
 * @param {Array} sessions
 * @param {string|null} selectedSessionId
 */
export function calculatePortalAnalytics(sessions, selectedSessionId) {
  const safeSessions = [...(Array.isArray(sessions) ? sessions : [])].sort((a, b) => {
    const yearCmp = String(a.academicYear || '').localeCompare(String(b.academicYear || ''));
    if (yearCmp !== 0) return yearCmp;
    const order = (name) => (String(name).toLowerCase().includes('first') ? 1 : 2);
    return order(a.semesterName) - order(b.semesterName);
  });

  const sessionResults = new Map();
  const yearGroupsMap = new Map();
  const trendSeries = [];

  let cumulativeUnits = 0;
  let cumulativeQualityPoints = 0;

  for (const session of safeSessions) {
    const metrics = calculateSessionMetrics(session);
    sessionResults.set(session.id, metrics);

    if (metrics.totalUnits > 0) {
      cumulativeUnits += metrics.totalUnits;
      cumulativeQualityPoints += metrics.totalQualityPoints;
      trendSeries.push({
        id: session.id,
        label: `${session.academicYear} · ${session.level} · ${session.semesterName}`,
        shortLabel: `${session.academicYear} (${session.semesterName.replace(' Semester', '')})`,
        units: metrics.totalUnits,
        gpa: metrics.gpa,
        isSelected: session.id === selectedSessionId,
      });
    }

    const yearKey = session.academicYear;
    if (!yearGroupsMap.has(yearKey)) {
      yearGroupsMap.set(yearKey, {
        key: yearKey,
        academicYear: session.academicYear,
        level: session.level,
        sessions: [],
        totalUnits: 0,
        totalQualityPoints: 0,
        yearGpa: 0,
      });
    }

    const group = yearGroupsMap.get(yearKey);
    group.sessions.push({ session, metrics });
    group.totalUnits += metrics.totalUnits;
    group.totalQualityPoints += metrics.totalQualityPoints;
  }

  const yearGroups = Array.from(yearGroupsMap.values()).map((group) => ({
    ...group,
    totalQualityPoints: Math.round(group.totalQualityPoints * 100) / 100,
    yearGpa:
      group.totalUnits > 0
        ? Math.round((group.totalQualityPoints / group.totalUnits) * 100) / 100
        : 0,
  }));

  const selectedSession =
    safeSessions.find((s) => s.id === selectedSessionId) || safeSessions[0] || null;
  const selectedMetrics = selectedSession
    ? sessionResults.get(selectedSession.id)
    : calculateSemesterMetrics([]);

  const rawCgpa = cumulativeUnits > 0 ? cumulativeQualityPoints / cumulativeUnits : 0;
  const cgpa = Math.round(rawCgpa * 100) / 100;
  const standing = getAcademicStanding(cgpa, cumulativeUnits);

  return {
    selectedSession,
    selectedMetrics,
    sessionResults,
    yearGroups,
    trendSeries,
    cumulativeUnits,
    cumulativeQualityPoints: Math.round(cumulativeQualityPoints * 100) / 100,
    cgpa,
    standing,
    semestersEvaluated: trendSeries.length,
  };
}

/**
 * Generates a clean CSV transcript string for either the selected session or all grouped years.
 * @param {object} profile
 * @param {ReturnType<typeof calculatePortalAnalytics>} analytics
 * @param {'selected'|'all'} scope
 */
export function formatTranscriptCsv(profile, analytics, scope = 'selected') {
  const escapeCsv = (val) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [
    ['Student Name', profile.name || 'Not Set'],
    ['Registration Number', profile.regNo || 'Not Set'],
    ['Faculty', profile.faculty || 'Not Set'],
    ['Department', profile.department || 'Not Set'],
    ['Course / Programme', profile.course || 'Not Set'],
    ['Current Level', profile.level || 'Not Set'],
    [],
  ];

  if (scope === 'all') {
    for (const group of analytics.yearGroups) {
      lines.push([`Academic Year: ${group.academicYear}`, `Level: ${group.level}`, `Year GPA: ${group.yearGpa.toFixed(2)}`]);
      for (const item of group.sessions) {
        lines.push([`Semester: ${item.session.semesterName}`, `Units: ${item.metrics.totalUnits}`, `GPA: ${item.metrics.gpa.toFixed(2)}`]);
        if (item.metrics.rows.length > 0) {
          lines.push(['Course Code', 'Course Title', 'Credit Units', 'Grade', 'Grade Point', 'Points Earned', 'Remark']);
          for (const row of item.metrics.rows) {
            lines.push([row.code, row.title, String(row.units), row.grade, String(row.gradePoint), String(row.qualityPoints), row.remark]);
          }
        }
        lines.push([]);
      }
    }
  } else if (analytics.selectedSession) {
    const s = analytics.selectedSession;
    lines.push(['Academic Year', s.academicYear]);
    lines.push(['Level', s.level]);
    lines.push(['Semester', s.semesterName]);
    lines.push([]);
    lines.push(['Course Code', 'Course Title', 'Credit Units', 'Grade', 'Grade Point', 'Points Earned', 'Remark']);
    for (const row of analytics.selectedMetrics.rows) {
      lines.push([
        row.code,
        row.title,
        String(row.units),
        row.grade,
        String(row.gradePoint),
        String(row.qualityPoints),
        row.remark,
      ]);
    }
    lines.push([]);
    lines.push(['Selected Session Units', String(analytics.selectedMetrics.totalUnits)]);
    lines.push(['Selected Session GPA', analytics.selectedMetrics.gpa.toFixed(2)]);
  }

  lines.push(['Cumulative Units', String(analytics.cumulativeUnits)]);
  lines.push(['Cumulative CGPA', analytics.cgpa.toFixed(2)]);
  lines.push(['Academic Standing', analytics.standing.label]);

  return lines.map((cols) => cols.map(escapeCsv).join(',')).join('\n');
}

/**
 * Parses RFC-4180 CSV text into an array of string rows, handling quoted fields,
 * escaped quotes (""), embedded commas, UTF-8 BOM, and CRLF/LF line endings.
 * @param {string} csvText
 * @returns {string[][]}
 */
export function parseCsvRows(csvText) {
  const text = String(csvText ?? '').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field.trim());
      field = '';
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Parses a transcript CSV previously exported by formatTranscriptCsv()
 * back into student profile details and academic sessions/courses.
 * Supports both "Selected Session" and "All Years Grouped" CSV exports.
 * @param {string} csvText
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   profile?: {
 *     name: string,
 *     regNo: string,
 *     faculty: string,
 *     department: string,
 *     course: string,
 *     entryYear: string,
 *     level: string,
 *     currentSession: string,
 *     targetCgpa: number
 *   },
 *   sessions?: Array<{
 *     id: string,
 *     academicYear: string,
 *     level: string,
 *     semesterName: string,
 *     courses: Array<{ id: string, code: string, title: string, units: number, grade: string }>
 *   }>
 * }}
 */
export function parseTranscriptCsv(csvText) {
  const rows = parseCsvRows(csvText);
  if (rows.length === 0) {
    return { ok: false, error: 'The selected CSV file is empty.' };
  }

  const cleanValue = (val) => {
    const str = String(val ?? '').trim();
    return str === 'Not Set' ? '' : str;
  };

  const profile = {
    name: '',
    regNo: '',
    faculty: '',
    department: '',
    course: '',
    entryYear: '',
    level: '100 Level',
    currentSession: '',
    targetCgpa: 4.5,
  };

  const sessions = [];
  let activeYear = '';
  let activeLevel = '';
  let activeSession = null;
  let inCourseTable = false;
  let recognizedPortalHeader = false;
  let courseCounter = 0;
  let sessionCounter = 0;

  const ensureSession = (academicYear, level, semesterName) => {
    const cleanYear = String(academicYear || '').trim();
    const cleanLevel = VALID_LEVELS.includes(level) ? level : '100 Level';
    const cleanSemester = String(semesterName || '').trim() || 'First Semester';
    if (!isValidAcademicYear(cleanYear)) return null;

    const existing = sessions.find(
      (s) =>
        s.academicYear === cleanYear &&
        s.semesterName.toLowerCase() === cleanSemester.toLowerCase()
    );
    if (existing) return existing;

    sessionCounter += 1;
    const created = {
      id: `imp-sem-${Date.now().toString(36)}-${sessionCounter}`,
      academicYear: cleanYear,
      level: cleanLevel,
      semesterName: cleanSemester,
      courses: [],
    };
    sessions.push(created);
    return created;
  };

  for (const cols of rows) {
    if (cols.every((c) => !c)) {
      inCourseTable = false;
      continue;
    }

    const first = cols[0] || '';
    const second = cols[1] || '';

    // 1. Key-value student metadata lines
    if (first === 'Student Name') {
      recognizedPortalHeader = true;
      profile.name = cleanValue(second);
      continue;
    }
    if (first === 'Registration Number') {
      recognizedPortalHeader = true;
      profile.regNo = cleanValue(second);
      continue;
    }
    if (first === 'Faculty') {
      recognizedPortalHeader = true;
      profile.faculty = cleanValue(second);
      continue;
    }
    if (first === 'Department') {
      recognizedPortalHeader = true;
      profile.department = cleanValue(second);
      continue;
    }
    if (first === 'Course / Programme') {
      recognizedPortalHeader = true;
      profile.course = cleanValue(second);
      continue;
    }
    if (first === 'Current Level') {
      recognizedPortalHeader = true;
      const lvl = cleanValue(second);
      if (VALID_LEVELS.includes(lvl)) profile.level = lvl;
      continue;
    }
    if (first === 'Entry Year') {
      const yr = cleanValue(second);
      if (/^\d{4}$/.test(yr)) profile.entryYear = yr;
      continue;
    }

    // 2. Scope = "selected" session metadata lines
    if (first === 'Academic Year' && isValidAcademicYear(second)) {
      recognizedPortalHeader = true;
      activeYear = second;
      continue;
    }
    if (first === 'Level' && VALID_LEVELS.includes(second)) {
      activeLevel = second;
      continue;
    }
    if (first === 'Semester' && second) {
      activeSession = ensureSession(activeYear, activeLevel || profile.level, second);
      continue;
    }

    // 3. Scope = "all" year & semester group header lines
    if (first.startsWith('Academic Year:')) {
      recognizedPortalHeader = true;
      activeYear = first.replace(/^Academic Year:\s*/i, '').trim();
      const lvlCol = cols.find((c) => /^Level:\s*/i.test(c));
      if (lvlCol) {
        const parsedLvl = lvlCol.replace(/^Level:\s*/i, '').trim();
        if (VALID_LEVELS.includes(parsedLvl)) activeLevel = parsedLvl;
      }
      inCourseTable = false;
      continue;
    }
    if (first.startsWith('Semester:')) {
      recognizedPortalHeader = true;
      const semName = first.replace(/^Semester:\s*/i, '').trim();
      activeSession = ensureSession(activeYear, activeLevel || profile.level, semName);
      inCourseTable = false;
      continue;
    }

    // 4. Course table header
    if (first === 'Course Code' && second === 'Course Title') {
      recognizedPortalHeader = true;
      inCourseTable = true;
      continue;
    }

    // 5. Subtotal / summary rows end course table
    if (
      first.endsWith('Subtotal') ||
      first.startsWith('Selected Session') ||
      first.startsWith('Cumulative ') ||
      first === 'Academic Standing'
    ) {
      inCourseTable = false;
      continue;
    }

    // 6. Course rows
    if (inCourseTable && activeSession && cols.length >= 4) {
      const code = String(cols[0] || '').trim().toUpperCase();
      const title = String(cols[1] || '').trim();
      const units = Number.parseInt(String(cols[2] || ''), 10);
      const grade = String(cols[3] || '').trim().toUpperCase();
      const candidate = { code, title, units, grade };
      if (validateCourse(candidate).valid) {
        courseCounter += 1;
        activeSession.courses.push({
          id: `imp-crs-${Date.now().toString(36)}-${courseCounter}`,
          ...candidate,
        });
      }
    }
  }

  if (!recognizedPortalHeader) {
    return {
      ok: false,
      error: 'Unrecognized CSV format. Please select a transcript CSV exported from this portal.',
    };
  }

  // Infer Entry Year deterministically from imported sessions or fallback
  if (!profile.entryYear) {
    if (sessions.length > 0) {
      const firstSession = [...sessions].sort((a, b) =>
        a.academicYear.localeCompare(b.academicYear)
      )[0];
      const startYear = Number.parseInt(firstSession.academicYear.split('/')[0], 10);
      const levelIdx = VALID_LEVELS.indexOf(firstSession.level);
      if (Number.isInteger(startYear) && levelIdx >= 0) {
        profile.entryYear = String(startYear - levelIdx);
      }
    } else if (/^\d{4}\/\d{6}$/.test(profile.regNo)) {
      profile.entryYear = profile.regNo.slice(0, 4);
    } else {
      profile.entryYear = '2024';
    }
  }

  // Align currentSession with entryYear + level
  profile.currentSession =
    deriveAcademicYearFromLevel(profile.entryYear, profile.level) ||
    formatConsecutiveAcademicYear(profile.entryYear);

  return {
    ok: true,
    profile,
    sessions,
  };
}


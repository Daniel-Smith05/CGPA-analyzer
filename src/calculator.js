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

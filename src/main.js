/**
 * Main application controller for the Student Result & CGPA Analytics Portal.
 * Written in clear, intermediate ES6+ Vanilla JavaScript without any frontend framework.
 */

import {
  VALID_GRADES,
  GRADE_SCALE,
  getYearLevelMappings,
  deriveLevelFromAcademicYear,
  deriveAcademicYearFromLevel,
  validateNewSession,
  realignSessionsToEntryYear,
  isValidRegNoFormat,
  validateCourse,
  calculatePortalAnalytics,
  formatTranscriptCsv,
  parseTranscriptCsv,
} from './calculator.js';
import { createBareState, loadPortalState, savePortalState } from './storage.js';
import {
  UNN_FACULTIES,
  getDepartmentsForFaculty,
  suggestCourseTitle,
  getCourseCatalogForStudent,
  DEMO_PROFILES,
} from './unnCatalog.js';
import { renderGradeDistributionChart, renderSemesterTrendChart } from './charts.js';

let state = loadPortalState();
let validationErrors = new Map();

const els = {
  sidebar: document.getElementById('portal-sidebar'),
  sidebarBackdrop: document.getElementById('sidebar-backdrop'),
  openSidebarBtn: document.getElementById('open-sidebar-btn'),
  closeSidebarBtn: document.getElementById('close-sidebar-btn'),
  navLinks: document.querySelectorAll('.sidebar-nav-link'),
  sidebarBrandLink: document.querySelector('.sidebar-brand-link'),
  sidebarProfileTrigger: document.getElementById('sidebar-profile-trigger'),

  portalMainView: document.getElementById('portal-main-view'),
  profilePageView: document.getElementById('profile-page-view'),
  backToDashboardBtn: document.getElementById('back-to-dashboard-btn'),

  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeToggleLabel: document.getElementById('theme-toggle-label'),
  themeIconMoon: document.getElementById('theme-icon-moon'),
  themeIconSun: document.getElementById('theme-icon-sun'),

  sidebarAvatarImg: document.getElementById('sidebar-avatar-img'),
  sidebarAvatarFallback: document.getElementById('sidebar-avatar-fallback'),
  sidebarStudentName: document.getElementById('sidebar-student-name'),
  sidebarStudentRegNo: document.getElementById('sidebar-student-regno'),
  sidebarStudentProgram: document.getElementById('sidebar-student-program'),
  headerSessionLabel: document.getElementById('header-session-label'),

  metricTotalUnits: document.getElementById('metric-total-units'),
  metricCumulativeUnits: document.getElementById('metric-cumulative-units'),
  metricGpaTitle: document.getElementById('metric-gpa-title'),
  metricSemesterGpa: document.getElementById('metric-semester-gpa'),
  metricSemesterPoints: document.getElementById('metric-semester-points'),
  metricCumulativeCgpa: document.getElementById('metric-cumulative-cgpa'),
  metricSemestersCount: document.getElementById('metric-semesters-count'),
  metricStandingLabel: document.getElementById('metric-standing-label'),
  metricStandingDetail: document.getElementById('metric-standing-detail'),
  lastSavedLabel: document.getElementById('last-saved-label'),

  toggleAddSessionBtn: document.getElementById('toggle-add-session-btn'),
  cancelAddSessionBtn: document.getElementById('cancel-add-session-btn'),
  goToProfileDemoBtn: document.getElementById('go-to-profile-demo-btn'),
  addSessionForm: document.getElementById('add-session-form'),
  addSessionError: document.getElementById('add-session-error'),
  newSessionYear: document.getElementById('new-session-year'),
  newSessionLevel: document.getElementById('new-session-level'),
  newSessionSemester: document.getElementById('new-session-semester'),

  yearsGroupedContainer: document.getElementById('years-grouped-container'),
  sessionSelector: document.getElementById('session-selector'),
  editingSessionSummary: document.getElementById('editing-session-summary'),

  unnCourseCatalogSelect: document.getElementById('unn-course-catalog-select'),
  quickAddUnnCourseBtn: document.getElementById('quick-add-unn-course-btn'),

  courseForm: document.getElementById('course-calculator-form'),
  courseTableHeadings: document.getElementById('course-table-headings'),
  courseRowsContainer: document.getElementById('course-rows-container'),
  coursesEmptyState: document.getElementById('courses-empty-state'),
  emptyStateTitle: document.getElementById('empty-state-title'),
  emptyStateSubtitle: document.getElementById('empty-state-subtitle'),
  calculatorFeedback: document.getElementById('calculator-feedback'),

  addCourseBtn: document.getElementById('add-course-btn'),
  emptyAddCourseBtn: document.getElementById('empty-add-course-btn'),
  calculateGpaBtn: document.getElementById('calculate-gpa-btn'),
  clearCoursesBtn: document.getElementById('clear-courses-btn'),

  chartTypeBarBtn: document.getElementById('chart-type-bar'),
  chartTypePieBtn: document.getElementById('chart-type-pie'),
  gradeChartCanvas: document.getElementById('grade-distribution-chart'),
  gradeChartEmpty: document.getElementById('grade-chart-empty'),
  gradeChartSubtitle: document.getElementById('grade-chart-subtitle'),
  gradeCountsSummary: document.getElementById('grade-counts-summary'),
  trendChartCanvas: document.getElementById('semester-trend-chart'),
  trendChartEmpty: document.getElementById('trend-chart-empty'),
  trendDeltaText: document.getElementById('trend-delta-text'),
  analyticsTargetCgpa: document.getElementById('analytics-target-cgpa'),

  transcriptScopeSelectedBtn: document.getElementById('transcript-scope-selected'),
  transcriptScopeAllBtn: document.getElementById('transcript-scope-all'),
  transcriptStudentName: document.getElementById('transcript-student-name'),
  transcriptStudentMeta: document.getElementById('transcript-student-meta'),
  transcriptCourse: document.getElementById('transcript-course'),
  transcriptScopeLabel: document.getElementById('transcript-scope-label'),
  transcriptDate: document.getElementById('transcript-date'),
  transcriptBodyContainer: document.getElementById('transcript-body-container'),

  exportCsvBtn: document.getElementById('export-csv-btn'),
  headerPrintBtn: document.getElementById('header-print-btn'),
  transcriptPrintBtn: document.getElementById('transcript-print-btn'),
  printPreviewDialog: document.getElementById('print-preview-dialog'),
  printPreviewSheet: document.getElementById('print-preview-sheet'),
  closePreviewDialogBtn: document.getElementById('close-preview-dialog-btn'),
  dialogExportCsvBtn: document.getElementById('dialog-export-csv-btn'),
  dialogPrintNowBtn: document.getElementById('dialog-print-now-btn'),

  // Student Profile Page Elements
  profileAvatarImg: document.getElementById('profile-avatar-img'),
  profileAvatarFallback: document.getElementById('profile-avatar-fallback'),
  profileAvatarInput: document.getElementById('profile-avatar-input'),
  uploadAvatarBtn: document.getElementById('upload-avatar-btn'),
  removeAvatarBtn: document.getElementById('remove-avatar-btn'),
  demoProfileSelect: document.getElementById('demo-profile-select'),
  loadDemoProfileBtn: document.getElementById('load-demo-profile-btn'),
  importCsvInput: document.getElementById('import-csv-input'),
  importCsvBtn: document.getElementById('import-csv-btn'),
  resetBareBtn: document.getElementById('reset-bare-btn'),
  profileForm: document.getElementById('student-profile-form'),
  profileFeedback: document.getElementById('profile-feedback'),
  profileCardName: document.getElementById('profile-card-name'),
  profileCardMeta: document.getElementById('profile-card-meta'),
  profileCardFaculty: document.getElementById('profile-card-faculty'),
  profileGoalStatus: document.getElementById('profile-goal-status'),
  profileName: document.getElementById('profile-name'),
  profileRegNo: document.getElementById('profile-regno'),
  profileRegNoError: document.getElementById('profile-regno-error'),
  profileFaculty: document.getElementById('profile-faculty'),
  profileDepartment: document.getElementById('profile-department'),
  profileCourse: document.getElementById('profile-course'),
  profileEntryYear: document.getElementById('profile-entry-year'),
  profileLevel: document.getElementById('profile-level'),
  profileSession: document.getElementById('profile-session'),
  profileTargetCgpa: document.getElementById('profile-target-cgpa'),
};

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSelectedSession() {
  return state.sessions.find((s) => s.id === state.selectedSessionId) || state.sessions[0] || null;
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);

  els.themeToggleBtn.setAttribute('aria-pressed', String(isDark));
  els.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  els.themeToggleLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  els.themeIconMoon.classList.toggle('hidden', isDark);
  els.themeIconSun.classList.toggle('hidden', !isDark);
}

function openMobileSidebar() {
  els.sidebar.classList.remove('-translate-x-full');
  els.sidebarBackdrop.classList.remove('hidden');
}

function closeMobileSidebar() {
  els.sidebar.classList.add('-translate-x-full');
  els.sidebarBackdrop.classList.add('hidden');
}

function setActiveNavLink(targetId) {
  els.navLinks.forEach((link) => {
    const isActive = link.dataset.navTarget === targetId;
    link.classList.toggle('bg-gold-400/15', isActive);
    link.classList.toggle('text-gold-300', isActive);
    link.classList.toggle('text-slate-300', !isActive);
  });
}

function switchPage(pageName, scrollToId = null) {
  state.activePage = pageName === 'profile' ? 'profile' : 'dashboard';
  const showProfile = state.activePage === 'profile';

  els.portalMainView.classList.toggle('hidden', showProfile);
  els.profilePageView.classList.toggle('hidden', !showProfile);

  if (showProfile) {
    setActiveNavLink('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    setActiveNavLink(scrollToId || 'dashboard');
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  savePortalState(state);
}

function showFeedback(message, type = 'info') {
  const styles = {
    success:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    error:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    info: 'bg-gold-50 dark:bg-gold-500/10 text-slate-900 dark:text-gold-200 border-gold-200 dark:border-gold-500/30',
  };

  els.calculatorFeedback.className = `px-5 sm:px-6 py-3 border-b text-sm font-medium ${styles[type] || styles.info}`;
  els.calculatorFeedback.textContent = message;
  els.calculatorFeedback.classList.remove('hidden');
}

function hideFeedback() {
  els.calculatorFeedback.classList.add('hidden');
  els.calculatorFeedback.textContent = '';
}

function showProfileFeedback(message, type = 'info') {
  const styles = {
    success:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    error:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    info: 'bg-gold-50 dark:bg-gold-500/10 text-slate-900 dark:text-gold-200 border-gold-200 dark:border-gold-500/30',
  };
  els.profileFeedback.className = `px-5 py-3 rounded-xl border text-sm font-medium ${styles[type] || styles.info}`;
  els.profileFeedback.textContent = message;
  els.profileFeedback.classList.remove('hidden');
}

function renderAvatarImages() {
  const dataUrl = String(state.profile.avatarDataUrl || '').trim();
  const hasAvatar = dataUrl.startsWith('data:image/');

  els.sidebarAvatarImg.src = hasAvatar ? dataUrl : '';
  els.sidebarAvatarImg.classList.toggle('hidden', !hasAvatar);
  els.sidebarAvatarFallback.classList.toggle('hidden', hasAvatar);

  els.profileAvatarImg.src = hasAvatar ? dataUrl : '';
  els.profileAvatarImg.classList.toggle('hidden', !hasAvatar);
  els.profileAvatarFallback.classList.toggle('hidden', hasAvatar);
  els.removeAvatarBtn.classList.toggle('hidden', !hasAvatar);
}

/**
 * Resizes and compresses an uploaded image file into a 200x200 JPEG data URL
 * so it stores reliably inside browser localStorage.
 * @param {File} file
 * @returns {Promise<string>}
 */
function resizeAvatarImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

function populateFacultyAndDepartmentSelects(selectedFaculty, selectedDepartment) {
  const facultyOptions = [
    '<option value="">Select UNN Faculty...</option>',
    ...UNN_FACULTIES.map((f) => {
      const sel = f.name === selectedFaculty ? 'selected' : '';
      return `<option value="${escapeHtml(f.name)}" ${sel}>${escapeHtml(f.name)}</option>`;
    }),
  ];
  els.profileFaculty.innerHTML = facultyOptions.join('');

  const departments = getDepartmentsForFaculty(selectedFaculty);
  if (departments.length === 0) {
    els.profileDepartment.innerHTML = '<option value="">Select a UNN Faculty first...</option>';
    els.profileDepartment.disabled = true;
    return;
  }

  els.profileDepartment.disabled = false;
  els.profileDepartment.innerHTML = [
    '<option value="">Select UNN Department...</option>',
    ...departments.map((dept) => {
      const sel = dept === selectedDepartment ? 'selected' : '';
      return `<option value="${escapeHtml(dept)}" ${sel}>${escapeHtml(dept)}</option>`;
    }),
  ].join('');
}

function populateProfileSessionSelect(entryYear, selectedSession) {
  const mappings = getYearLevelMappings(entryYear || '2024');
  els.profileSession.innerHTML = mappings
    .map((m) => {
      const sel = m.academicYear === selectedSession ? 'selected' : '';
      return `<option value="${escapeHtml(m.academicYear)}" ${sel}>${escapeHtml(m.academicYear)} (${escapeHtml(m.level)})</option>`;
    })
    .join('');

  if (!mappings.some((m) => m.academicYear === selectedSession) && mappings[0]) {
    els.profileSession.value = mappings[0].academicYear;
  }
}

function populateAddSessionOptions() {
  const entryYear = state.profile.entryYear || '2024';
  const mappings = getYearLevelMappings(entryYear);

  els.newSessionYear.innerHTML = mappings
    .map((m) => `<option value="${escapeHtml(m.academicYear)}">${escapeHtml(m.academicYear)} (${escapeHtml(m.level)})</option>`)
    .join('');

  // Pick the first year/semester slot that does not already exist
  let defaultYear = mappings[0]?.academicYear || `${entryYear}/${Number(entryYear) + 1}`;
  let defaultLevel = mappings[0]?.level || '100 Level';
  let defaultSemester = 'First Semester';

  for (const m of mappings) {
    const hasFirst = state.sessions.some(
      (s) => s.academicYear === m.academicYear && s.semesterName.toLowerCase() === 'first semester'
    );
    const hasSecond = state.sessions.some(
      (s) => s.academicYear === m.academicYear && s.semesterName.toLowerCase() === 'second semester'
    );
    if (!hasFirst) {
      defaultYear = m.academicYear;
      defaultLevel = m.level;
      defaultSemester = 'First Semester';
      break;
    }
    if (!hasSecond) {
      defaultYear = m.academicYear;
      defaultLevel = m.level;
      defaultSemester = 'Second Semester';
      break;
    }
  }

  els.newSessionYear.value = defaultYear;
  els.newSessionLevel.value = defaultLevel;
  els.newSessionSemester.value = defaultSemester;
  els.addSessionError.classList.add('hidden');
  els.addSessionError.textContent = '';
}

function populateDemoProfileSelect() {
  els.demoProfileSelect.innerHTML = Object.entries(DEMO_PROFILES)
    .map(([key, item]) => `<option value="${escapeHtml(key)}">${escapeHtml(item.label)}</option>`)
    .join('');
}

function populateUnnCourseCatalog() {
  const catalog = getCourseCatalogForStudent(state.profile.department, state.profile.faculty);
  const deptCourses = catalog.filter((c) => !c.code.startsWith('GSP '));
  const gspCourses = catalog.filter((c) => c.code.startsWith('GSP '));

  const renderOptions = (list) =>
    list
      .map(
        (c) =>
          `<option value="${escapeHtml(c.code)}">${escapeHtml(c.code)} — ${escapeHtml(c.title)} (${c.units} ${
            c.units === 1 ? 'Unit' : 'Units'
          })</option>`
      )
      .join('');

  const deptLabel = state.profile.department
    ? `${state.profile.department} Courses`
    : 'UNN Core Courses';

  els.unnCourseCatalogSelect.innerHTML = `
    <optgroup label="${escapeHtml(deptLabel)}">
      ${renderOptions(deptCourses)}
    </optgroup>
    <optgroup label="UNN General Studies (GSP)">
      ${renderOptions(gspCourses)}
    </optgroup>
  `;
}

function renderProfile(analytics) {
  const p = state.profile;
  const selected = analytics.selectedSession;

  renderAvatarImages();

  els.sidebarStudentName.textContent = p.name || 'Student Profile';
  els.sidebarStudentRegNo.textContent = p.regNo || 'Not set';
  els.sidebarStudentProgram.textContent = p.department
    ? `${p.department} · ${p.level || '100 Level'}`
    : 'Configure UNN profile';

  els.headerSessionLabel.textContent = selected
    ? `${selected.academicYear} Academic Session · ${selected.level} · ${selected.semesterName}`
    : p.name
      ? `${p.currentSession} Academic Session · ${p.level} · No active semester`
      : 'No active session · Add a semester or load a demo profile';

  els.transcriptStudentName.textContent = p.name || 'Student Name Not Set';
  els.transcriptStudentMeta.textContent = `Reg No: ${p.regNo || 'Not Set'} · ${
    p.department ? `Department of ${p.department}` : 'Department Not Set'
  } · ${p.faculty || 'Faculty Not Set'}`;
  els.transcriptCourse.textContent = p.course || 'Not Set';
  els.transcriptDate.textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Profile page summary & form fields
  els.profileCardName.textContent = p.name || 'Student Name Not Set';
  els.profileCardMeta.textContent = `${p.regNo || 'Reg No: Not Set'} · ${p.course || 'Programme Not Set'}`;
  els.profileCardFaculty.textContent =
    p.faculty && p.department
      ? `${p.faculty} · Department of ${p.department} · ${p.level}`
      : 'Select your UNN Faculty & Department below';

  const target = Number(p.targetCgpa) || 4.5;
  const diff = analytics.cgpa - target;
  if (analytics.cumulativeUnits === 0) {
    els.profileGoalStatus.textContent = `Target ${target.toFixed(2)} · No courses yet`;
  } else if (diff >= 0) {
    els.profileGoalStatus.textContent = `Target ${target.toFixed(2)} · Exceeded (+${diff.toFixed(2)})`;
  } else {
    els.profileGoalStatus.textContent = `Target ${target.toFixed(2)} · ${Math.abs(diff).toFixed(2)} gap`;
  }

  els.profileName.value = p.name || '';
  els.profileRegNo.value = p.regNo || '';
  populateFacultyAndDepartmentSelects(p.faculty || '', p.department || '');
  els.profileCourse.value = p.course || '';
  els.profileEntryYear.value = p.entryYear || '2024';
  els.profileLevel.value = p.level || '100 Level';
  populateProfileSessionSelect(p.entryYear || '2024', p.currentSession || '');
  els.profileTargetCgpa.value = String(p.targetCgpa ?? 4.5);

  els.analyticsTargetCgpa.textContent = target.toFixed(2);
}

function renderGroupedYearsAndSelector(analytics) {
  // Populate Session Selector dropdown
  if (state.sessions.length === 0) {
    els.sessionSelector.innerHTML = '<option value="">No semesters created yet</option>';
    els.sessionSelector.disabled = true;
  } else {
    els.sessionSelector.disabled = false;
    els.sessionSelector.innerHTML = state.sessions
      .map((s) => {
        const selectedAttr = s.id === state.selectedSessionId ? 'selected' : '';
        return `<option value="${escapeHtml(s.id)}" ${selectedAttr}>${escapeHtml(s.academicYear)} · ${escapeHtml(s.level)} · ${escapeHtml(s.semesterName)}</option>`;
      })
      .join('');
  }

  // Render Academic Years Grouped Separately (or Bare Empty State)
  if (analytics.yearGroups.length === 0) {
    els.yearsGroupedContainer.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center space-y-4">
        <div class="max-w-lg mx-auto space-y-1.5">
          <h3 class="font-display text-base font-bold text-slate-900 dark:text-white">
            No academic sessions recorded yet
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Your workspace starts clean. Create your first semester with consecutive year &amp; level mapping, or open Student Profile to load a UNN demonstration dataset.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            data-action="open-add-session"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-gold-400 text-slate-950 hover:bg-gold-300 transition-colors"
          >
            + Add First Semester
          </button>
          <button
            type="button"
            data-action="open-profile-demo"
            class="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Open Profile &amp; Load Demo
          </button>
        </div>
      </div>
    `;
    return;
  }

  els.yearsGroupedContainer.innerHTML = analytics.yearGroups
    .map((group) => {
      const semesterCards = group.sessions
        .map(({ session, metrics }) => {
          const isSelected = session.id === state.selectedSessionId;
          const cardBorder = isSelected
            ? 'border-gold-400 bg-gold-50/70 dark:bg-gold-500/10 dark:border-gold-400'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700';

          return `
            <div class="rounded-xl border p-4 transition-colors ${cardBorder} flex flex-col justify-between gap-3">
              <div class="flex items-start justify-between gap-2">
                <button
                  type="button"
                  data-action="select-session"
                  data-session-id="${escapeHtml(session.id)}"
                  class="text-left flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-md"
                >
                  <span class="block font-display text-sm font-bold text-slate-900 dark:text-white">
                    ${escapeHtml(session.semesterName)}
                  </span>
                  <span class="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
                    ${metrics.courseCount} ${metrics.courseCount === 1 ? 'course' : 'courses'} · ${metrics.totalUnits} units
                  </span>
                </button>

                <button
                  type="button"
                  data-action="remove-session"
                  data-session-id="${escapeHtml(session.id)}"
                  aria-label="Remove ${escapeHtml(session.academicYear)} ${escapeHtml(session.semesterName)}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                <span class="font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                  GPA ${metrics.gpa.toFixed(2)}
                </span>
                <button
                  type="button"
                  data-action="select-session"
                  data-session-id="${escapeHtml(session.id)}"
                  class="text-xs font-semibold ${
                    isSelected
                      ? 'text-gold-700 dark:text-gold-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-gold-700 dark:hover:text-gold-300'
                  }"
                >
                  ${isSelected ? 'Editing Now' : 'Edit Courses'}
                </button>
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-display text-base font-bold text-slate-900 dark:text-white">
                ${escapeHtml(group.academicYear)} Academic Year · ${escapeHtml(group.level)}
              </h3>
            </div>
            <div class="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
              <span>Year Units: <strong class="text-slate-900 dark:text-white">${group.totalUnits}</strong></span>
              <span>Year GPA: <strong class="text-gold-600 dark:text-gold-400">${group.yearGpa.toFixed(2)}</strong></span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${semesterCards}
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCourseRows() {
  const session = getSelectedSession();

  if (!session) {
    els.editingSessionSummary.textContent = 'No academic session selected';
    els.addCourseBtn.disabled = true;
    els.clearCoursesBtn.disabled = true;
    els.calculateGpaBtn.disabled = true;
    els.unnCourseCatalogSelect.disabled = true;
    els.quickAddUnnCourseBtn.disabled = true;

    els.courseTableHeadings.classList.add('hidden');
    els.courseRowsContainer.classList.add('hidden');
    els.courseRowsContainer.innerHTML = '';
    els.coursesEmptyState.classList.remove('hidden');
    els.emptyStateTitle.textContent = 'No academic session created yet';
    els.emptyStateSubtitle.textContent =
      'Click "+ Add Semester" above to create a semester first, or open Student Profile to load a UNN demo dataset.';
    els.emptyAddCourseBtn.textContent = '+ Add First Semester';
    return;
  }

  els.addCourseBtn.disabled = false;
  els.calculateGpaBtn.disabled = false;
  els.unnCourseCatalogSelect.disabled = false;
  els.quickAddUnnCourseBtn.disabled = false;
  els.editingSessionSummary.textContent = `Editing: ${session.academicYear} · ${session.level} · ${session.semesterName}`;

  const courses = Array.isArray(session.courses) ? session.courses : [];
  const hasCourses = courses.length > 0;
  els.clearCoursesBtn.disabled = !hasCourses;
  els.courseTableHeadings.classList.toggle('hidden', !hasCourses);
  els.coursesEmptyState.classList.toggle('hidden', hasCourses);
  els.courseRowsContainer.classList.toggle('hidden', !hasCourses);

  if (!hasCourses) {
    els.courseRowsContainer.innerHTML = '';
    els.emptyStateTitle.textContent = 'No courses recorded for this session';
    els.emptyStateSubtitle.textContent =
      'Pick a course from the UNN Course Catalog dropdown above or add a blank course row to compute GPA.';
    els.emptyAddCourseBtn.textContent = 'Add First Course';
    return;
  }

  els.courseRowsContainer.innerHTML = courses
    .map((course, idx) => {
      const err = validationErrors.get(course.id) || {};
      const validUnits = Number.isInteger(Number(course.units)) && Number(course.units) >= 1 && Number(course.units) <= 6;
      const gp = GRADE_SCALE[String(course.grade || '').toUpperCase()] ?? 0;
      const pts = validUnits ? Number(course.units) * gp : 0;
      const courseLabel = course.code?.trim() || `row ${idx + 1}`;

      const inputBase =
        'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500';
      const borderNormal = 'border-slate-200 dark:border-slate-700';
      const borderErr = 'border-rose-500 dark:border-rose-500';

      return `
        <div
          data-course-id="${escapeHtml(course.id)}"
          class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 md:p-2 rounded-xl md:rounded-lg border md:border-transparent border-slate-200 dark:border-slate-800 bg-slate-50/70 md:bg-transparent dark:bg-slate-800/30 md:dark:bg-transparent md:hover:bg-slate-50 dark:md:hover:bg-slate-800/40 transition-colors items-start"
        >
          <div class="md:col-span-2">
            <label for="code-${escapeHtml(course.id)}" class="md:hidden block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Course Code</label>
            <input
              id="code-${escapeHtml(course.id)}"
              data-field="code"
              type="text"
              placeholder="e.g. CSC 401"
              maxlength="16"
              value="${escapeHtml(course.code)}"
              class="${inputBase} font-mono uppercase ${err.code ? borderErr : borderNormal}"
            />
            ${err.code ? `<p class="mt-1 text-xs text-rose-600 dark:text-rose-400">${escapeHtml(err.code)}</p>` : ''}
          </div>

          <div class="md:col-span-4">
            <label for="title-${escapeHtml(course.id)}" class="md:hidden block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Course Title</label>
            <input
              id="title-${escapeHtml(course.id)}"
              data-field="title"
              type="text"
              placeholder="e.g. Artificial Intelligence"
              maxlength="80"
              value="${escapeHtml(course.title)}"
              class="${inputBase} ${err.title ? borderErr : borderNormal}"
            />
            ${err.title ? `<p class="mt-1 text-xs text-rose-600 dark:text-rose-400">${escapeHtml(err.title)}</p>` : ''}
          </div>

          <div class="md:col-span-2">
            <label for="units-${escapeHtml(course.id)}" class="md:hidden block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Credit Units (1–6)</label>
            <input
              id="units-${escapeHtml(course.id)}"
              data-field="units"
              type="number"
              min="1"
              max="6"
              step="1"
              value="${escapeHtml(course.units)}"
              class="${inputBase} font-mono tabular-nums ${err.units ? borderErr : borderNormal}"
            />
            ${err.units ? `<p class="mt-1 text-xs text-rose-600 dark:text-rose-400">${escapeHtml(err.units)}</p>` : ''}
          </div>

          <div class="md:col-span-2">
            <label for="grade-${escapeHtml(course.id)}" class="md:hidden block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Grade</label>
            <select
              id="grade-${escapeHtml(course.id)}"
              data-field="grade"
              class="${inputBase} font-mono ${err.grade ? borderErr : borderNormal}"
            >
              ${VALID_GRADES.map(
                (g) =>
                  `<option value="${g}" ${String(course.grade).toUpperCase() === g ? 'selected' : ''}>${g} (${GRADE_SCALE[g]}.0)</option>`
              ).join('')}
            </select>
          </div>

          <div class="hidden md:flex md:col-span-1 h-9 items-center justify-end font-mono text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200" data-course-points="${escapeHtml(course.id)}">
            ${pts}
          </div>

          <div class="md:col-span-1 flex items-center justify-between md:justify-end gap-2 pt-1 md:pt-0.5">
            <span class="md:hidden text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Earned: ${pts} pts
            </span>
            <button
              type="button"
              data-action="remove-course"
              aria-label="Remove course ${escapeHtml(courseLabel)}"
              class="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderSummaryCards(analytics) {
  const current = analytics.selectedMetrics;
  const session = analytics.selectedSession;

  els.metricTotalUnits.textContent = String(current.totalUnits);
  els.metricCumulativeUnits.textContent = `${analytics.cumulativeUnits} cumulative units total`;

  els.metricGpaTitle.textContent = session
    ? `Selected Session GPA (${session.semesterName})`
    : 'Current Semester GPA';
  els.metricSemesterGpa.textContent = current.gpa.toFixed(2);
  els.metricSemesterPoints.textContent = `${current.totalQualityPoints} / ${current.totalUnits * 5} quality points`;

  els.metricCumulativeCgpa.textContent = analytics.cgpa.toFixed(2);
  els.metricSemestersCount.textContent = `${analytics.semestersEvaluated} ${analytics.semestersEvaluated === 1 ? 'semester' : 'semesters'} across ${analytics.yearGroups.length} ${analytics.yearGroups.length === 1 ? 'year' : 'years'}`;

  const toneClasses = {
    emerald: 'text-emerald-700 dark:text-emerald-400',
    gold: 'text-gold-600 dark:text-gold-400',
    amber: 'text-amber-700 dark:text-amber-400',
    rose: 'text-rose-700 dark:text-rose-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  };

  els.metricStandingLabel.className = `font-display text-lg sm:text-xl font-bold block leading-snug ${toneClasses[analytics.standing.tone] || toneClasses.neutral}`;
  els.metricStandingLabel.textContent = analytics.standing.label;
  els.metricStandingDetail.textContent = analytics.standing.detail;
}

function renderAnalytics(analytics) {
  const isDark = state.theme === 'dark';
  const current = analytics.selectedMetrics;
  const session = analytics.selectedSession;

  els.gradeChartSubtitle.textContent = session
    ? `Count of A–F grades in ${session.academicYear} · ${session.semesterName}`
    : 'Count of A–F grades in selected session';

  const isBar = state.chartType === 'bar';
  els.chartTypeBarBtn.setAttribute('aria-pressed', String(isBar));
  els.chartTypePieBtn.setAttribute('aria-pressed', String(!isBar));

  els.chartTypeBarBtn.className = isBar
    ? 'px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-colors'
    : 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors';

  els.chartTypePieBtn.className = !isBar
    ? 'px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-colors'
    : 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors';

  const hasCourses = current.rows.length > 0;
  els.gradeChartEmpty.classList.toggle('hidden', hasCourses);
  renderGradeDistributionChart(els.gradeChartCanvas, current.gradeDistribution, state.chartType, isDark);

  els.gradeCountsSummary.innerHTML = VALID_GRADES.map((grade) => {
    const count = current.gradeDistribution[grade] || 0;
    return `
      <div class="py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/60">
        <span class="block text-slate-500 dark:text-slate-400">${grade}</span>
        <span class="font-semibold text-slate-900 dark:text-white">${count}</span>
      </div>
    `;
  }).join('');

  const hasTrend = analytics.trendSeries.length > 0;
  els.trendChartEmpty.classList.toggle('hidden', hasTrend);
  renderSemesterTrendChart(els.trendChartCanvas, analytics.trendSeries, isDark);

  if (analytics.trendSeries.length >= 2) {
    const prev = analytics.trendSeries[analytics.trendSeries.length - 2].gpa;
    const latest = analytics.trendSeries[analytics.trendSeries.length - 1].gpa;
    const diff = latest - prev;
    const sign = diff >= 0 ? '+' : '';
    els.trendDeltaText.textContent = `${sign}${diff.toFixed(2)} latest change`;
  } else {
    els.trendDeltaText.textContent = '';
  }
}

function buildTableHtml(rows, footerSummaryLeft, units, gpa, points, cgpa) {
  const bodyHtml =
    rows.length === 0
      ? `<tr>
          <td colspan="7" class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No valid courses recorded for this session.
          </td>
        </tr>`
      : rows
          .map(
            (row) => `
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-2.5 pr-4 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">${escapeHtml(row.code)}</td>
            <td class="py-2.5 pr-4 text-slate-700 dark:text-slate-200">${escapeHtml(row.title)}</td>
            <td class="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">${row.units}</td>
            <td class="py-2.5 px-3 text-center font-mono font-semibold text-slate-900 dark:text-white">${row.grade}</td>
            <td class="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">${row.gradePoint.toFixed(1)}</td>
            <td class="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">${row.qualityPoints}</td>
            <td class="py-2.5 pl-3 text-right text-xs font-medium ${
              row.remark === 'Fail' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
            }">${row.remark}</td>
          </tr>
        `
          )
          .join('');

  return `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <th scope="col" class="py-2.5 pr-4 whitespace-nowrap">Course Code</th>
          <th scope="col" class="py-2.5 pr-4 min-w-[200px]">Course Title</th>
          <th scope="col" class="py-2.5 px-3 text-right whitespace-nowrap">Units</th>
          <th scope="col" class="py-2.5 px-3 text-center whitespace-nowrap">Grade</th>
          <th scope="col" class="py-2.5 px-3 text-right whitespace-nowrap">Grade Point</th>
          <th scope="col" class="py-2.5 px-3 text-right whitespace-nowrap">Points Earned</th>
          <th scope="col" class="py-2.5 pl-3 text-right whitespace-nowrap">Remark</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">${bodyHtml}</tbody>
      <tfoot class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-sm font-semibold">
        <tr>
          <td colspan="2" class="py-3 pr-4 text-slate-900 dark:text-white">${footerSummaryLeft}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">${units}</td>
          <td class="py-3 px-3 text-center text-xs text-slate-500 dark:text-slate-400">GPA</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-gold-600 dark:text-gold-400">${gpa.toFixed(2)}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">${points}</td>
          <td class="py-3 pl-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">CGPA ${cgpa.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function renderTranscript(analytics) {
  const isAll = state.transcriptScope === 'all';
  els.transcriptScopeSelectedBtn.setAttribute('aria-pressed', String(!isAll));
  els.transcriptScopeAllBtn.setAttribute('aria-pressed', String(isAll));

  const activeCls =
    'px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-colors whitespace-nowrap';
  const inactiveCls =
    'px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap';

  els.transcriptScopeSelectedBtn.className = !isAll ? activeCls : inactiveCls;
  els.transcriptScopeAllBtn.className = isAll ? activeCls : inactiveCls;

  if (!isAll) {
    const s = analytics.selectedSession;
    els.transcriptScopeLabel.textContent = s
      ? `${s.academicYear} · ${s.level} · ${s.semesterName}`
      : 'No session selected';

    els.transcriptBodyContainer.innerHTML = buildTableHtml(
      analytics.selectedMetrics.rows,
      `Session Summary · Standing: <span class="text-gold-600 dark:text-gold-400">${escapeHtml(analytics.standing.label)}</span>`,
      analytics.selectedMetrics.totalUnits,
      analytics.selectedMetrics.gpa,
      analytics.selectedMetrics.totalQualityPoints,
      analytics.cgpa
    );
    return;
  }

  els.transcriptScopeLabel.textContent = `All Academic Years (${analytics.yearGroups.length} ${
    analytics.yearGroups.length === 1 ? 'Year' : 'Years'
  })`;

  if (analytics.yearGroups.length === 0) {
    els.transcriptBodyContainer.innerHTML = `
      <div class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No academic years or courses recorded yet. Add semesters or load a demonstration profile from Student Profile.
      </div>
    `;
    return;
  }

  els.transcriptBodyContainer.innerHTML = `
    <div class="space-y-8">
      ${analytics.yearGroups
        .map((group) => {
          const semestersHtml = group.sessions
            .map(({ session, metrics }) => {
              return `
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>${escapeHtml(session.semesterName)}</span>
                    <span class="font-mono tabular-nums">${metrics.totalUnits} Units · GPA ${metrics.gpa.toFixed(2)}</span>
                  </div>
                  ${buildTableHtml(
                    metrics.rows,
                    `${escapeHtml(session.semesterName)} Subtotal`,
                    metrics.totalUnits,
                    metrics.gpa,
                    metrics.totalQualityPoints,
                    analytics.cgpa
                  )}
                </div>
              `;
            })
            .join('');

          return `
            <section class="pt-4 first:pt-0 border-t first:border-t-0 border-slate-200 dark:border-slate-800 space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                <h4 class="font-display text-sm font-bold text-slate-900 dark:text-white">
                  ${escapeHtml(group.academicYear)} Academic Year · ${escapeHtml(group.level)}
                </h4>
                <p class="text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  Year Total: <strong>${group.totalUnits} Units</strong> · Year GPA: <strong class="text-gold-600 dark:text-gold-400">${group.yearGpa.toFixed(2)}</strong>
                </p>
              </div>
              ${semestersHtml}
            </section>
          `;
        })
        .join('')}

      <div class="pt-4 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <span>Overall Cumulative Academic Summary (${escapeHtml(analytics.standing.label)})</span>
        <span class="font-mono tabular-nums">
          Total Units: ${analytics.cumulativeUnits} · Cumulative CGPA: <span class="text-gold-600 dark:text-gold-400">${analytics.cgpa.toFixed(2)} / 5.00</span>
        </span>
      </div>
    </div>
  `;
}

function getLatestAnalytics() {
  return calculatePortalAnalytics(state.sessions, state.selectedSessionId);
}

function renderAll(persist = true) {
  applyTheme(state.theme);

  const analytics = getLatestAnalytics();
  renderProfile(analytics);
  populateUnnCourseCatalog();
  renderGroupedYearsAndSelector(analytics);
  renderCourseRows();
  renderSummaryCards(analytics);
  renderAnalytics(analytics);
  renderTranscript(analytics);

  if (persist) {
    savePortalState(state);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    els.lastSavedLabel.textContent = `Saved locally · ${now}`;
  }
}

function validateAndCompute() {
  const session = getSelectedSession();
  if (!session) return;

  validationErrors = new Map();
  for (const course of session.courses) {
    const check = validateCourse(course);
    if (!check.valid) {
      validationErrors.set(course.id, check.errors);
    }
  }

  renderAll(true);

  if (validationErrors.size > 0) {
    showFeedback(
      'Please fix the highlighted fields (Course Code, Title, and Credit Units 1–6) to include them in the calculation.',
      'error'
    );
    return;
  }

  const analytics = getLatestAnalytics();
  if (session.courses.length === 0) {
    showFeedback('No courses entered in this session. Add at least one course to compute GPA.', 'info');
    return;
  }

  showFeedback(
    `Calculated ${session.academicYear} (${session.semesterName}): ${analytics.selectedMetrics.rows.length} courses (${analytics.selectedMetrics.totalUnits} units) · Session GPA ${analytics.selectedMetrics.gpa.toFixed(2)} · Cumulative CGPA ${analytics.cgpa.toFixed(2)} (${analytics.standing.label}).`,
    'success'
  );
}

function downloadCsvTranscript() {
  const analytics = getLatestAnalytics();
  const csv = formatTranscriptCsv(state.profile, analytics, state.transcriptScope);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeReg = (state.profile.regNo || 'student').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.href = url;
  link.download = `transcript_${safeReg}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openPrintPreviewModal() {
  const clone = document.getElementById('printable-transcript-area').cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[class*="dark:"]').forEach((node) => {
    node.className = node.className
      .split(/\s+/)
      .filter((cls) => !cls.startsWith('dark:'))
      .join(' ');
  });

  els.printPreviewSheet.innerHTML = '';
  els.printPreviewSheet.appendChild(clone);

  if (typeof els.printPreviewDialog.showModal === 'function') {
    els.printPreviewDialog.showModal();
  } else {
    window.print();
  }
}

function bindEvents() {
  // Mobile sidebar controls
  els.openSidebarBtn.addEventListener('click', openMobileSidebar);
  els.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  els.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Sidebar navigation & Profile page routing
  els.navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.navTarget;
      closeMobileSidebar();
      if (target === 'profile') {
        switchPage('profile');
      } else {
        switchPage('dashboard', target);
      }
    });
  });

  els.sidebarBrandLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileSidebar();
    switchPage('dashboard', 'dashboard');
  });

  els.sidebarProfileTrigger.addEventListener('click', () => {
    closeMobileSidebar();
    switchPage('profile');
  });

  els.backToDashboardBtn.addEventListener('click', () => {
    switchPage('dashboard', 'dashboard');
  });

  // Theme toggle
  els.themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    renderAll(true);
  });

  els.goToProfileDemoBtn.addEventListener('click', () => {
    switchPage('profile');
  });

  // Add Semester toggle, year/level sync & submission
  const openAddSessionForm = () => {
    populateAddSessionOptions();
    els.addSessionForm.classList.remove('hidden');
    els.toggleAddSessionBtn.setAttribute('aria-expanded', 'true');
    els.newSessionYear.focus();
  };

  els.toggleAddSessionBtn.addEventListener('click', () => {
    const isCurrentlyHidden = els.addSessionForm.classList.contains('hidden');
    if (isCurrentlyHidden) {
      openAddSessionForm();
    } else {
      els.addSessionForm.classList.add('hidden');
      els.toggleAddSessionBtn.setAttribute('aria-expanded', 'false');
    }
  });

  els.cancelAddSessionBtn.addEventListener('click', () => {
    els.addSessionForm.classList.add('hidden');
    els.toggleAddSessionBtn.setAttribute('aria-expanded', 'false');
    els.addSessionError.classList.add('hidden');
  });

  els.newSessionYear.addEventListener('change', () => {
    const entryYear = state.profile.entryYear || '2024';
    const derivedLevel = deriveLevelFromAcademicYear(entryYear, els.newSessionYear.value);
    if (derivedLevel) {
      els.newSessionLevel.value = derivedLevel;
    }
    els.addSessionError.classList.add('hidden');
  });

  els.newSessionLevel.addEventListener('change', () => {
    const entryYear = state.profile.entryYear || '2024';
    const derivedYear = deriveAcademicYearFromLevel(entryYear, els.newSessionLevel.value);
    if (derivedYear) {
      els.newSessionYear.value = derivedYear;
    }
    els.addSessionError.classList.add('hidden');
  });

  els.addSessionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const academicYear = els.newSessionYear.value.trim();
    const level = els.newSessionLevel.value;
    const semesterName = els.newSessionSemester.value;
    const entryYear = state.profile.entryYear || '2024';

    const check = validateNewSession(
      state.sessions,
      { academicYear, level, semesterName },
      entryYear
    );

    if (!check.valid) {
      els.addSessionError.textContent = check.error;
      els.addSessionError.classList.remove('hidden');
      showFeedback(check.error, 'error');
      return;
    }

    const newSession = {
      id: uid('sem'),
      academicYear,
      level,
      semesterName,
      courses: [],
    };

    state.sessions.push(newSession);
    state.selectedSessionId = newSession.id;
    validationErrors.clear();
    els.addSessionForm.classList.add('hidden');
    els.addSessionError.classList.add('hidden');
    els.toggleAddSessionBtn.setAttribute('aria-expanded', 'false');
    renderAll(true);
    showFeedback(
      `Created and selected ${academicYear} (${level} · ${semesterName}). Use the UNN catalog or "+ Add Course" below.`,
      'success'
    );
  });

  // Session selector dropdown
  els.sessionSelector.addEventListener('change', (e) => {
    state.selectedSessionId = e.target.value || null;
    validationErrors.clear();
    hideFeedback();
    renderAll(true);
  });

  // Grouped Year Cards click delegation (select, remove, or empty state CTAs)
  els.yearsGroupedContainer.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="open-add-session"]')) {
      openAddSessionForm();
      return;
    }
    if (e.target.closest('[data-action="open-profile-demo"]')) {
      switchPage('profile');
      return;
    }

    const removeBtn = e.target.closest('[data-action="remove-session"]');
    if (removeBtn) {
      const removeId = removeBtn.dataset.sessionId;
      state.sessions = state.sessions.filter((s) => s.id !== removeId);
      if (state.selectedSessionId === removeId) {
        state.selectedSessionId =
          state.sessions.length > 0 ? state.sessions[state.sessions.length - 1].id : null;
      }
      validationErrors.clear();
      hideFeedback();
      renderAll(true);
      return;
    }

    const selectBtn = e.target.closest('[data-action="select-session"]');
    if (selectBtn) {
      state.selectedSessionId = selectBtn.dataset.sessionId;
      validationErrors.clear();
      hideFeedback();
      renderAll(true);
    }
  });

  // Add course row to selected session (or open Add Semester when bare)
  const handleAddCourse = () => {
    const session = getSelectedSession();
    if (!session) {
      openAddSessionForm();
      return;
    }
    hideFeedback();
    const newId = uid('crs');
    session.courses.push({
      id: newId,
      code: '',
      title: '',
      units: 3,
      grade: 'A',
    });
    renderAll(true);
    const codeInput = document.getElementById(`code-${newId}`);
    if (codeInput) codeInput.focus();
  };

  els.addCourseBtn.addEventListener('click', handleAddCourse);
  els.emptyAddCourseBtn.addEventListener('click', handleAddCourse);

  // Quick-Add UNN Course from catalog dropdown
  els.quickAddUnnCourseBtn.addEventListener('click', () => {
    const session = getSelectedSession();
    if (!session) {
      openAddSessionForm();
      return;
    }
    const code = els.unnCourseCatalogSelect.value;
    const catalog = getCourseCatalogForStudent(state.profile.department, state.profile.faculty);
    const courseItem = catalog.find((c) => c.code === code);
    if (!courseItem) return;

    const alreadyAdded = session.courses.some(
      (c) => String(c.code || '').trim().toUpperCase() === courseItem.code.toUpperCase()
    );
    if (alreadyAdded) {
      showFeedback(`${courseItem.code} is already listed in ${session.academicYear} · ${session.semesterName}.`, 'info');
      return;
    }

    session.courses.push({
      id: uid('crs'),
      code: courseItem.code,
      title: courseItem.title,
      units: courseItem.units,
      grade: 'A',
    });
    renderAll(true);
    showFeedback(
      `Added ${courseItem.code} (${courseItem.title}, ${courseItem.units} units) to ${session.semesterName}. Adjust grade if needed.`,
      'success'
    );
  });

  // Calculate GPA button
  els.calculateGpaBtn.addEventListener('click', validateAndCompute);
  els.courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateAndCompute();
  });

  // Clear courses in selected session
  els.clearCoursesBtn.addEventListener('click', () => {
    const session = getSelectedSession();
    if (!session) return;
    session.courses = [];
    validationErrors.clear();
    renderAll(true);
    showFeedback(`Cleared courses for ${session.academicYear} · ${session.semesterName}.`, 'info');
  });

  // Course input delegation
  els.courseRowsContainer.addEventListener('input', (e) => {
    const session = getSelectedSession();
    if (!session) return;

    const target = e.target;
    const field = target.dataset?.field;
    if (!field) return;

    const rowEl = target.closest('[data-course-id]');
    if (!rowEl) return;

    const course = session.courses.find((c) => c.id === rowEl.dataset.courseId);
    if (!course) return;

    course[field] = target.value;
    if (validationErrors.has(course.id)) {
      const check = validateCourse(course);
      if (check.valid) validationErrors.delete(course.id);
      else validationErrors.set(course.id, check.errors);
    }

    const ptsEl = rowEl.querySelector(`[data-course-points="${course.id}"]`);
    if (ptsEl) {
      const validUnits = Number.isInteger(Number(course.units)) && Number(course.units) >= 1 && Number(course.units) <= 6;
      const gp = GRADE_SCALE[String(course.grade || '').toUpperCase()] ?? 0;
      ptsEl.textContent = String(validUnits ? Number(course.units) * gp : 0);
    }

    const analytics = getLatestAnalytics();
    renderGroupedYearsAndSelector(analytics);
    renderSummaryCards(analytics);
    renderAnalytics(analytics);
    renderTranscript(analytics);
    savePortalState(state);
  });

  els.courseRowsContainer.addEventListener('change', (e) => {
    if (e.target.dataset?.field === 'grade') {
      renderAll(true);
    }
  });

  els.courseRowsContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-action="remove-course"]');
    if (!removeBtn) return;

    const session = getSelectedSession();
    if (!session) return;

    const rowEl = removeBtn.closest('[data-course-id]');
    if (!rowEl) return;

    session.courses = session.courses.filter((c) => c.id !== rowEl.dataset.courseId);
    validationErrors.delete(rowEl.dataset.courseId);
    renderAll(true);
    hideFeedback();
  });

  // Chart Type Switch (Bar vs Pie)
  els.chartTypeBarBtn.addEventListener('click', () => {
    state.chartType = 'bar';
    renderAll(true);
  });
  els.chartTypePieBtn.addEventListener('click', () => {
    state.chartType = 'pie';
    renderAll(true);
  });

  // Transcript Scope Switch (Selected Session vs All Years Grouped)
  els.transcriptScopeSelectedBtn.addEventListener('click', () => {
    state.transcriptScope = 'selected';
    renderAll(true);
  });
  els.transcriptScopeAllBtn.addEventListener('click', () => {
    state.transcriptScope = 'all';
    renderAll(true);
  });

  // Avatar image upload & removal (persisted in localStorage)
  els.uploadAvatarBtn.addEventListener('click', () => {
    els.profileAvatarInput.click();
  });

  els.profileAvatarInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeAvatarImageFile(file);
      state.profile.avatarDataUrl = dataUrl;
      const saved = savePortalState(state);
      renderAvatarImages();
      if (!saved) {
        showProfileFeedback('Avatar could not be saved because browser localStorage quota was exceeded.', 'error');
      } else {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        els.lastSavedLabel.textContent = `Saved locally · ${now}`;
        showProfileFeedback('Profile avatar uploaded and saved in browser storage.', 'success');
      }
    } catch (err) {
      showProfileFeedback(err instanceof Error ? err.message : 'Unable to process image.', 'error');
    } finally {
      els.profileAvatarInput.value = '';
    }
  });

  els.removeAvatarBtn.addEventListener('click', () => {
    state.profile.avatarDataUrl = '';
    savePortalState(state);
    renderAvatarImages();
    showProfileFeedback('Profile avatar removed.', 'info');
  });

  // Demonstration Profile loader & Clear All Data
  els.loadDemoProfileBtn.addEventListener('click', () => {
    const demoKey = els.demoProfileSelect.value;
    const demo = DEMO_PROFILES[demoKey];
    if (!demo) return;

    const currentAvatar = state.profile.avatarDataUrl || '';
    state.profile = {
      ...demo.profile,
      avatarDataUrl: currentAvatar,
    };
    state.sessions = demo.sessions.map((s) => ({
      ...s,
      courses: s.courses.map((c) => ({ ...c })),
    }));
    state.selectedSessionId = demo.selectedSessionId;
    validationErrors.clear();
    renderAll(true);
    showProfileFeedback(
      `Loaded demonstration profile: ${demo.profile.name} (${demo.profile.department}, ${demo.profile.level}). Click "Back to Dashboard" to inspect analytics.`,
      'success'
    );
  });

  // Import Profile & Sessions from previously exported CSV
  els.importCsvBtn.addEventListener('click', () => {
    els.importCsvInput.click();
  });

  els.importCsvInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const csvText = await file.text();
      const imported = parseTranscriptCsv(csvText);
      if (!imported.ok) {
        showProfileFeedback(imported.error || 'Could not parse CSV file.', 'error');
        return;
      }

      const currentAvatar = state.profile.avatarDataUrl || '';
      state.profile = {
        ...state.profile,
        ...imported.profile,
        avatarDataUrl: currentAvatar,
      };
      state.sessions = imported.sessions;
      state.selectedSessionId =
        imported.sessions.length > 0
          ? imported.sessions[imported.sessions.length - 1].id
          : null;
      validationErrors.clear();
      renderAll(true);

      const totalCourses = imported.sessions.reduce((sum, s) => sum + s.courses.length, 0);
      showProfileFeedback(
        `Imported CSV profile${imported.profile.name ? ` for ${imported.profile.name}` : ''}: ${imported.sessions.length} ${
          imported.sessions.length === 1 ? 'semester' : 'semesters'
        } and ${totalCourses} ${totalCourses === 1 ? 'course' : 'courses'} restored.`,
        'success'
      );
    } catch {
      showProfileFeedback('Unable to read the selected CSV file.', 'error');
    } finally {
      els.importCsvInput.value = '';
    }
  });

  els.resetBareBtn.addEventListener('click', () => {
    const bare = createBareState();
    bare.theme = state.theme;
    bare.activePage = 'profile';
    state = bare;
    validationErrors.clear();
    renderAll(true);
    showProfileFeedback('All student profile details, avatar, and semester records cleared to bare state.', 'info');
  });

  // UNN Faculty -> Department cascading dropdowns & Course Title auto-suggestion
  els.profileFaculty.addEventListener('change', () => {
    const faculty = els.profileFaculty.value;
    populateFacultyAndDepartmentSelects(faculty, '');
    els.profileCourse.value = '';
  });

  els.profileDepartment.addEventListener('change', () => {
    const faculty = els.profileFaculty.value;
    const dept = els.profileDepartment.value;
    const suggested = suggestCourseTitle(faculty, dept);
    if (suggested) {
      els.profileCourse.value = suggested;
    }
  });

  // Entry Year <-> Current Level <-> Consecutive Academic Session synchronization
  els.profileEntryYear.addEventListener('change', () => {
    const entryYear = els.profileEntryYear.value;
    const level = els.profileLevel.value;
    const syncedSession = deriveAcademicYearFromLevel(entryYear, level);
    populateProfileSessionSelect(entryYear, syncedSession);
  });

  els.profileLevel.addEventListener('change', () => {
    const entryYear = els.profileEntryYear.value;
    const syncedSession = deriveAcademicYearFromLevel(entryYear, els.profileLevel.value);
    if (syncedSession) {
      els.profileSession.value = syncedSession;
    }
  });

  els.profileSession.addEventListener('change', () => {
    const entryYear = els.profileEntryYear.value;
    const derivedLevel = deriveLevelFromAcademicYear(entryYear, els.profileSession.value);
    if (derivedLevel) {
      els.profileLevel.value = derivedLevel;
    }
  });

  // Student Profile Page Form Save
  els.profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = els.profileName.value.trim();
    const regNo = els.profileRegNo.value.trim();
    const faculty = els.profileFaculty.value;
    const department = els.profileDepartment.value;
    const course = els.profileCourse.value.trim() || suggestCourseTitle(faculty, department);
    const entryYear = els.profileEntryYear.value;
    const level = els.profileLevel.value;
    const currentSession = els.profileSession.value;

    const regValid = isValidRegNoFormat(regNo);
    els.profileRegNoError.classList.toggle('hidden', regValid);
    els.profileRegNo.classList.toggle('border-rose-500', !regValid);

    if (!name) {
      showProfileFeedback('Please enter the student full name.', 'error');
      els.profileName.focus();
      return;
    }

    if (!regValid) {
      showProfileFeedback('Registration Number must follow the YYYY/XXXXXX format (e.g. 2023/256558).', 'error');
      els.profileRegNo.focus();
      return;
    }

    if (!faculty || !department) {
      showProfileFeedback('Please select both a UNN Faculty and Department.', 'error');
      return;
    }

    const expectedLevel = deriveLevelFromAcademicYear(entryYear, currentSession);
    if (expectedLevel !== level) {
      showProfileFeedback(
        `Entry Year ${entryYear} and Session ${currentSession} require ${expectedLevel || 'a consecutive level'}.`,
        'error'
      );
      return;
    }

    const rawTarget = Number.parseFloat(els.profileTargetCgpa.value);
    const targetCgpa = Number.isFinite(rawTarget) ? Math.min(5, Math.max(0, rawTarget)) : 4.5;
    const entryYearChanged = entryYear !== state.profile.entryYear;

    if (entryYearChanged && state.sessions.length > 0) {
      state.sessions = realignSessionsToEntryYear(state.sessions, entryYear);
    }

    state.profile = {
      ...state.profile,
      name,
      regNo,
      faculty,
      department,
      course,
      entryYear,
      level,
      currentSession,
      targetCgpa,
    };

    renderAll(true);
    showProfileFeedback(
      entryYearChanged && state.sessions.length > 0
        ? 'Student profile saved and existing session years realigned to match your updated Entry Year.'
        : 'Student profile details saved and applied across your portal and UNN course catalog.',
      'success'
    );
  });

  // Transcript Print & Export actions
  els.exportCsvBtn.addEventListener('click', downloadCsvTranscript);
  els.dialogExportCsvBtn.addEventListener('click', downloadCsvTranscript);
  els.headerPrintBtn.addEventListener('click', openPrintPreviewModal);
  els.transcriptPrintBtn.addEventListener('click', openPrintPreviewModal);

  els.closePreviewDialogBtn.addEventListener('click', () => {
    els.printPreviewDialog.close();
  });

  els.dialogPrintNowBtn.addEventListener('click', () => {
    els.printPreviewDialog.close();
    window.print();
  });
}

// Initialize portal
populateDemoProfileSelect();
bindEvents();
renderAll(false);
switchPage(state.activePage === 'profile' ? 'profile' : 'dashboard');

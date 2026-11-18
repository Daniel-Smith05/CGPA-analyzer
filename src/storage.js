/**
 * State persistence module using browser localStorage.
 * Starts completely bare (empty sessions and blank profile) until the user
 * enters their own details or loads a demonstration profile from the Profile page.
 */

export const STORAGE_KEY = 'cgpa_portal_state_v3';

export function createBareState() {
  return {
    theme: 'light',
    chartType: 'bar',
    transcriptScope: 'selected',
    activePage: 'dashboard',
    selectedSessionId: null,
    profile: {
      name: '',
      regNo: '',
      faculty: '',
      department: '',
      course: '',
      entryYear: '2024',
      level: '100 Level',
      currentSession: '2024/2025',
      targetCgpa: 4.5,
      avatarDataUrl: '',
    },
    sessions: [],
  };
}

/**
 * Loads portal state from localStorage safely, starting bare if nothing is saved yet.
 */
export function loadPortalState() {
  const bare = createBareState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return bare;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return bare;

    const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    const selectedExists = sessions.some((s) => s.id === parsed.selectedSessionId);

    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      chartType: parsed.chartType === 'pie' ? 'pie' : 'bar',
      transcriptScope: parsed.transcriptScope === 'all' ? 'all' : 'selected',
      activePage: parsed.activePage === 'profile' ? 'profile' : 'dashboard',
      selectedSessionId: selectedExists ? parsed.selectedSessionId : sessions[0]?.id || null,
      profile: {
        ...bare.profile,
        ...(parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : {}),
      },
      sessions,
    };
  } catch {
    return bare;
  }
}

/**
 * Persists portal state (including uploaded avatar Data URL) to localStorage.
 * @param {object} state
 */
export function savePortalState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

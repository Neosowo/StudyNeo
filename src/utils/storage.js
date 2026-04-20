// ─── Storage helpers ──────────────────────────────────────────
const get = (key, fallback = null) => {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export const storage = { get, set }

export const KEYS = {
  TODOS:      'postpone_todos',
  SETTINGS:   'postpone_settings',
  STATS:      'postpone_stats',
  NOTES:      'postpone_notes',
  THEME:      'postpone_theme',
  GOAL:       'postpone_goal',
  FLASHCARDS: 'postpone_flashcards',
}

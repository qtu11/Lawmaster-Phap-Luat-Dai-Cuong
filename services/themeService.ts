const THEME_KEY = 'lawmaster_theme';

export type Theme = 'light' | 'dark' | 'system';

// Apply or remove the 'dark' class on documentElement
const applyThemeClass = (isDark: boolean) => {
  if (isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

export const getStoredTheme = (): Theme | null => {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return (v as Theme) || null;
  } catch (e) {
    return null;
  }
};

export const setStoredTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // ignore
  }
};

export const systemPrefersDark = () => {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
};

export const initTheme = (): boolean => {
  // returns whether dark is active
  const stored = getStoredTheme();
  if (stored === 'dark') {
    applyThemeClass(true);
    return true;
  }
  if (stored === 'light') {
    applyThemeClass(false);
    return false;
  }
  const sys = systemPrefersDark();
  applyThemeClass(sys);
  return sys;
};

export const setTheme = (theme: Theme) => {
  setStoredTheme(theme);
  if (theme === 'system') {
    applyThemeClass(systemPrefersDark());
  } else {
    applyThemeClass(theme === 'dark');
  }
};

export const toggleTheme = (currentIsDark: boolean) => {
  const next = currentIsDark ? 'light' : 'dark';
  setTheme(next);
  return next === 'dark';
};

export default {
  initTheme,
  setTheme,
  getStoredTheme,
  toggleTheme,
  systemPrefersDark
};

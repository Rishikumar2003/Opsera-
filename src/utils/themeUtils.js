/**
 * Utility functions for managing application theming
 */

// Available themes
const THEMES = {
  light: {
    name: 'light',
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
      success: '#2ecc71',
      background: '#ffffff',
      text: '#333333',
      border: '#e0e0e0',
      cardBackground: '#ffffff',
      headerBackground: '#f8f9fa',
      sidebarBackground: '#f8f9fa'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
      success: '#2ecc71',
      background: '#121212',
      text: '#e0e0e0',
      border: '#333333',
      cardBackground: '#1e1e1e',
      headerBackground: '#1a1a1a',
      sidebarBackground: '#1a1a1a'
    }
  }
};

// Default theme
const DEFAULT_THEME = 'light';

// Local storage key for theme
const THEME_STORAGE_KEY = 'retail_app_theme';

/**
 * Get the current theme
 * @returns {Object} - The current theme object
 */
export const getCurrentTheme = () => {
  // Try to get theme from local storage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  
  // If theme is stored and valid, return it
  if (storedTheme && THEMES[storedTheme]) {
    return THEMES[storedTheme];
  }
  
  // Otherwise return default theme
  return THEMES[DEFAULT_THEME];
};

/**
 * Set the current theme
 * @param {string} themeName - The name of the theme to set
 * @returns {Object} - The set theme object
 */
export const setTheme = (themeName) => {
  // If theme is valid, set it
  if (THEMES[themeName]) {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    applyThemeToDOM(THEMES[themeName]);
    return THEMES[themeName];
  }
  
  // Otherwise return current theme
  return getCurrentTheme();
};

/**
 * Toggle between light and dark themes
 * @returns {Object} - The new theme object
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newThemeName = currentTheme.name === 'light' ? 'dark' : 'light';
  return setTheme(newThemeName);
};

/**
 * Apply theme to DOM
 * @param {Object} theme - The theme object to apply
 */
export const applyThemeToDOM = (theme) => {
  // Get the root element
  const root = document.documentElement;
  
  // Apply theme colors as CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Add theme class to body
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme.name}`);
};

/**
 * Initialize theme
 */
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  applyThemeToDOM(theme);
};

/**
 * Get all available themes
 * @returns {Object} - Object with all available themes
 */
export const getAvailableThemes = () => {
  return { ...THEMES };
};
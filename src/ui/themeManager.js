/**
 * themeManager.js
 * Theme management for the game UI
 */

// LUNARIS_TODO: load themes from external JSON later

/**
 * ThemeManager class
 * Manages UI themes for the game
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = this.getDefaultThemes();
        
        console.log('[ThemeManager] Initialized');
    }

    /**
     * Get default themes
     * @returns {Object} Default themes object
     */
    getDefaultThemes() {
        return {
            default: {
                name: 'Default',
                colors: {
                    primary: '#4a90e2',
                    secondary: '#50c878',
                    background: '#1a1a2e',
                    surface: '#16213e',
                    text: '#ffffff',
                    textSecondary: '#a0a0a0',
                    border: '#2a2a4a',
                    success: '#50c878',
                    warning: '#f4a261',
                    error: '#e76f51'
                },
                fonts: {
                    primary: 'Arial, sans-serif',
                    secondary: 'Georgia, serif'
                },
                spacing: {
                    xs: '4px',
                    sm: '8px',
                    md: '16px',
                    lg: '24px',
                    xl: '32px'
                },
                ui: {
                    borderRadius: '8px',
                    buttonPadding: '10px 20px',
                    inputPadding: '8px 12px',
                    cardPadding: '16px'
                }
            },
            dark: {
                name: 'Dark',
                colors: {
                    primary: '#6c5ce7',
                    secondary: '#00cec9',
                    background: '#0d0d14',
                    surface: '#1a1a2e',
                    text: '#ffffff',
                    textSecondary: '#b0b0b0',
                    border: '#2d2d44',
                    success: '#00b894',
                    warning: '#fdcb6e',
                    error: '#d63031'
                },
                fonts: {
                    primary: 'Segoe UI, sans-serif',
                    secondary: 'Times New Roman, serif'
                },
                spacing: {
                    xs: '4px',
                    sm: '8px',
                    md: '16px',
                    lg: '24px',
                    xl: '32px'
                },
                ui: {
                    borderRadius: '6px',
                    buttonPadding: '10px 20px',
                    inputPadding: '8px 12px',
                    cardPadding: '16px'
                }
            },
            light: {
                name: 'Light',
                colors: {
                    primary: '#0984e3',
                    secondary: '#00b894',
                    background: '#f5f6fa',
                    surface: '#ffffff',
                    text: '#2d3436',
                    textSecondary: '#636e72',
                    border: '#dfe6e9',
                    success: '#00b894',
                    warning: '#fdcb6e',
                    error: '#d63031'
                },
                fonts: {
                    primary: 'Roboto, sans-serif',
                    secondary: 'Open Sans, sans-serif'
                },
                spacing: {
                    xs: '4px',
                    sm: '8px',
                    md: '16px',
                    lg: '24px',
                    xl: '32px'
                },
                ui: {
                    borderRadius: '4px',
                    buttonPadding: '10px 20px',
                    inputPadding: '8px 12px',
                    cardPadding: '16px'
                }
            }
        };
    }

    /**
     * Set the current theme
     * @param {string} name - Theme name
     */
    setTheme(name) {
        if (!this.themes[name]) {
            console.warn('[ThemeManager] Theme not found:', name);
            return;
        }
        
        this.currentTheme = name;
        this.applyTheme();
        console.log('[ThemeManager] Theme set to:', name);
    }

    /**
     * Get the current theme name
     * @returns {string} Current theme name
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Get the current theme object
     * @returns {Object} Current theme
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const theme = this.getCurrentTheme();
        if (!theme) {
            console.warn('[ThemeManager] No theme to apply');
            return;
        }

        // Apply CSS variables
        const root = document.documentElement;
        
        // Colors
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        // Fonts
        Object.entries(theme.fonts).forEach(([key, value]) => {
            root.style.setProperty(`--font-${key}`, value);
        });
        
        // Spacing
        Object.entries(theme.spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });
        
        // UI
        Object.entries(theme.ui).forEach(([key, value]) => {
            root.style.setProperty(`--ui-${key}`, value);
        });
        
        console.log('[ThemeManager] Theme applied');
    }

    /**
     * Get available theme names
     * @returns {Array} Array of theme names
     */
    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    /**
     * Add a custom theme
     * @param {string} name - Theme name
     * @param {Object} theme - Theme object
     */
    addTheme(name, theme) {
        this.themes[name] = theme;
        console.log('[ThemeManager] Theme added:', name);
    }

    /**
     * Get a theme by name
     * @param {string} name - Theme name
     * @returns {Object|null} Theme object
     */
    getThemeByName(name) {
        return this.themes[name] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager };
}

/**
 * themeManager.js
 * Theme management for the game UI - Simple Day/Night Toggle
 */

// Global theme manager instance
let themeManager = null;

/**
 * ThemeManager class
 * Manages UI themes for the game with simple Day/Night toggle
 */
class ThemeManager {
    constructor() {
        this.themeMode = 'dark'; // 'dark' or 'light'
        
        // Load saved theme from localStorage
        this.loadThemeFromStorage();
        
        console.log('[ThemeManager] Initialized with mode:', this.themeMode);
    }

    /**
     * Load theme preference from localStorage
     */
    loadThemeFromStorage() {
        const savedMode = localStorage.getItem('lunaris_theme_mode');
        if (savedMode) {
            this.themeMode = savedMode;
        }
    }

    /**
     * Save theme preference to localStorage
     */
    saveThemeToStorage() {
        localStorage.setItem('lunaris_theme_mode', this.themeMode);
    }

    /**
     * Toggle between Day and Night mode
     */
    toggleTheme() {
        this.themeMode = this.themeMode === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveThemeToStorage();
        console.log('[ThemeManager] Theme toggled to:', this.themeMode);
    }

    /**
     * Set specific theme mode
     * @param {string} mode - 'dark' or 'light'
     */
    setThemeMode(mode) {
        if (mode === 'dark' || mode === 'light') {
            this.themeMode = mode;
            this.applyTheme();
            this.saveThemeToStorage();
            console.log('[ThemeManager] Theme set to:', this.themeMode);
        }
    }

    /**
     * Get current theme mode
     * @returns {string} Current theme mode ('dark' or 'light')
     */
    getThemeMode() {
        return this.themeMode;
    }

    /**
     * Get current theme name
     * @returns {string} Current theme name
     */
    getCurrentThemeName() {
        return this.themeMode === 'dark' ? 'Night' : 'Day';
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        // Remove both classes first
        document.body.classList.remove('light-mode', 'dark-mode');
        
        // Add the appropriate class
        if (this.themeMode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
        
        console.log('[ThemeManager] Theme applied:', this.themeMode);
    }
}

// Initialize theme manager globally
function initThemeManager() {
    if (!themeManager) {
        themeManager = new ThemeManager();
        themeManager.applyTheme();
    }
    return themeManager;
}

// Initialize theme (for game use)
function initTheme() {
    return initThemeManager();
}

// Toggle theme (for game use)
function toggleTheme() {
    if (!themeManager) initTheme();
    themeManager.toggleTheme();
}

// Get current theme mode (for game use)
function getThemeMode() {
    if (!themeManager) initTheme();
    return themeManager.getThemeMode();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, initThemeManager, initTheme, toggleTheme, getThemeMode };
}

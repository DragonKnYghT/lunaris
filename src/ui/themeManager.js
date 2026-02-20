/**
 * themeManager.js
 * Theme management for the game UI
 */

// Global theme manager instance
let themeManager = null;

/**
 * ThemeManager class
 * Manages UI themes for the game with carousel navigation
 */
class ThemeManager {
    constructor() {
        this.currentThemeIndex = 0;
        this.themes = this.getDefaultThemes();
        
        // Load saved theme from localStorage
        this.loadThemeFromStorage();
        
        console.log('[ThemeManager] Initialized with theme:', this.getCurrentThemeName());
    }

    /**
     * Get default themes with 20 predefined themes
     * @returns {Array} Array of theme objects
     */
    getDefaultThemes() {
        return [
            {
                id: 'sakura',
                name: 'Sakura',
                subtitle: 'Rose pastel & Blanc',
                primaryColor: '#FFB7C5',
                secondaryColor: '#FFFFFF',
                colors: {
                    primary: '#FFB7C5',
                    primaryDark: '#FF8FA3',
                    primaryLight: '#FFD1DC',
                    secondary: '#FFFFFF',
                    secondaryDark: '#E8E8E8',
                    background: '#FFF0F5',
                    surface: '#FFF5F8',
                    text: '#4A3728',
                    textSecondary: '#8B7355',
                    border: '#FFCCD5',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#FF6B6B'
                }
            },
            {
                id: 'sakura-nocturne',
                name: 'Sakura Nocturne',
                subtitle: 'Rose vif & Noir',
                primaryColor: '#FF1493',
                secondaryColor: '#0A0A0A',
                colors: {
                    primary: '#FF1493',
                    primaryDark: '#C71585',
                    primaryLight: '#FF69B4',
                    secondary: '#0A0A0A',
                    secondaryDark: '#000000',
                    background: '#1A0A1A',
                    surface: '#2D1A2D',
                    text: '#FFFFFF',
                    textSecondary: '#D8BFD8',
                    border: '#FF1493',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF4500'
                }
            },
            {
                id: 'ocean-mystique',
                name: 'Océan Mystique',
                subtitle: 'Bleu profond & Turquoise',
                primaryColor: '#006994',
                secondaryColor: '#40E0D0',
                colors: {
                    primary: '#006994',
                    primaryDark: '#004C6D',
                    primaryLight: '#40E0D0',
                    secondary: '#40E0D0',
                    secondaryDark: '#00CED1',
                    background: '#001A2D',
                    surface: '#002A4A',
                    text: '#E0FFFF',
                    textSecondary: '#87CEEB',
                    border: '#006994',
                    success: '#00FA9A',
                    warning: '#FFD700',
                    error: '#FF6347'
                }
            },
            {
                id: 'brasier-royal',
                name: 'Brasier Royal',
                subtitle: 'Rouge sombre & Or',
                primaryColor: '#8B0000',
                secondaryColor: '#FFD700',
                colors: {
                    primary: '#8B0000',
                    primaryDark: '#5C0000',
                    primaryLight: '#CD5C5C',
                    secondary: '#FFD700',
                    secondaryDark: '#DAA520',
                    background: '#1A0505',
                    surface: '#2D0A0A',
                    text: '#FFFACD',
                    textSecondary: '#DEB887',
                    border: '#8B0000',
                    success: '#32CD32',
                    warning: '#FFA500',
                    error: '#DC143C'
                }
            },
            {
                id: 'void-eternel',
                name: 'Void Éternel',
                subtitle: 'Noir & Violet néon',
                primaryColor: '#1A0A2E',
                secondaryColor: '#9400D3',
                colors: {
                    primary: '#4B0082',
                    primaryDark: '#2E0050',
                    primaryLight: '#8A2BE2',
                    secondary: '#9400D3',
                    secondaryDark: '#7B00B4',
                    background: '#0A0A0F',
                    surface: '#15101F',
                    text: '#E6E6FA',
                    textSecondary: '#DDA0DD',
                    border: '#4B0082',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF00FF'
                }
            },
            {
                id: 'foudre-divine',
                name: 'Foudre Divine',
                subtitle: 'Jaune électrique & Bleu nuit',
                primaryColor: '#FFD700',
                secondaryColor: '#191970',
                colors: {
                    primary: '#FFD700',
                    primaryDark: '#DAA520',
                    primaryLight: '#FFEC8B',
                    secondary: '#191970',
                    secondaryDark: '#000080',
                    background: '#0A0A1A',
                    surface: '#151530',
                    text: '#F0F8FF',
                    textSecondary: '#B0C4DE',
                    border: '#FFD700',
                    success: '#00FA9A',
                    warning: '#FFA500',
                    error: '#FF4500'
                }
            },
            {
                id: 'hiver-glacial',
                name: 'Hiver Glacial',
                subtitle: 'Bleu clair & Blanc givré',
                primaryColor: '#ADD8E6',
                secondaryColor: '#F0FFFF',
                colors: {
                    primary: '#ADD8E6',
                    primaryDark: '#87CEEB',
                    primaryLight: '#E0FFFF',
                    secondary: '#F0FFFF',
                    secondaryDark: '#E8E8E8',
                    background: '#E8F4F8',
                    surface: '#F5FFFF',
                    text: '#2F4F4F',
                    textSecondary: '#5F9EA0',
                    border: '#B0E0E6',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#CD5C5C'
                }
            },
            {
                id: 'foret-spirituelle',
                name: 'Forêt Spirituelle',
                subtitle: 'Vert émeraude & Brun foncé',
                primaryColor: '#50C878',
                secondaryColor: '#3E2723',
                colors: {
                    primary: '#50C878',
                    primaryDark: '#228B22',
                    primaryLight: '#90EE90',
                    secondary: '#3E2723',
                    secondaryDark: '#1B0F0A',
                    background: '#0D1F0D',
                    surface: '#1A2F1A',
                    text: '#F0FFF0',
                    textSecondary: '#98FB98',
                    border: '#50C878',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF6347'
                }
            },
            {
                id: 'lune-ecarlate',
                name: 'Lune Écarlate',
                subtitle: 'Rouge sang & Noir',
                primaryColor: '#DC143C',
                secondaryColor: '#0A0A0A',
                colors: {
                    primary: '#DC143C',
                    primaryDark: '#8B0000',
                    primaryLight: '#FF6347',
                    secondary: '#0A0A0A',
                    secondaryDark: '#000000',
                    background: '#0F0505',
                    surface: '#1A0A0A',
                    text: '#FFFFFF',
                    textSecondary: '#FFB6C1',
                    border: '#DC143C',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF0000'
                }
            },
            {
                id: 'empire-celeste',
                name: 'Empire Céleste',
                subtitle: 'Blanc & Or lumineux',
                primaryColor: '#FFFFFF',
                secondaryColor: '#FFD700',
                colors: {
                    primary: '#FFFFFF',
                    primaryDark: '#E8E8E8',
                    primaryLight: '#FFFFFF',
                    secondary: '#FFD700',
                    secondaryDark: '#DAA520',
                    background: '#1A1A2E',
                    surface: '#2D2D4A',
                    text: '#1A1A2E',
                    textSecondary: '#4A4A6A',
                    border: '#FFD700',
                    success: '#00FA9A',
                    warning: '#FFD700',
                    error: '#FF4500'
                }
            },
            {
                id: 'brume-fantome',
                name: 'Brume Fantôme',
                subtitle: 'Gris clair & Bleu pâle',
                primaryColor: '#D3D3D3',
                secondaryColor: '#B0C4DE',
                colors: {
                    primary: '#D3D3D3',
                    primaryDark: '#A9A9A9',
                    primaryLight: '#E8E8E8',
                    secondary: '#B0C4DE',
                    secondaryDark: '#8FA8C8',
                    background: '#E8E8F0',
                    surface: '#F0F0F8',
                    text: '#2F2F3F',
                    textSecondary: '#5F5F6F',
                    border: '#C0C0D0',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#CD5C5C'
                }
            },
            {
                id: 'cyber-city',
                name: 'Cyber City',
                subtitle: 'Noir & Cyan néon',
                primaryColor: '#00FFFF',
                secondaryColor: '#0A0A0A',
                colors: {
                    primary: '#00FFFF',
                    primaryDark: '#00CED1',
                    primaryLight: '#7FFFD4',
                    secondary: '#0A0A0A',
                    secondaryDark: '#000000',
                    background: '#050510',
                    surface: '#0A0A1A',
                    text: '#E0FFFF',
                    textSecondary: '#00CED1',
                    border: '#00FFFF',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF00FF'
                }
            },
            {
                id: 'lotus-imperial',
                name: 'Lotus Impérial',
                subtitle: 'Violet & Rose doux',
                primaryColor: '#9932CC',
                secondaryColor: '#FFB6C1',
                colors: {
                    primary: '#9932CC',
                    primaryDark: '#7B1FA2',
                    primaryLight: '#BA68C8',
                    secondary: '#FFB6C1',
                    secondaryDark: '#FF91A4',
                    background: '#1A0A1A',
                    surface: '#2D1A2D',
                    text: '#FFFFFF',
                    textSecondary: '#E1BEE7',
                    border: '#9932CC',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#FF69B4'
                }
            },
            {
                id: 'dragon-ancestral',
                name: 'Dragon Ancestral',
                subtitle: 'Rouge sombre & Noir charbon',
                primaryColor: '#8B0000',
                secondaryColor: '#1C1C1C',
                colors: {
                    primary: '#8B0000',
                    primaryDark: '#5C0000',
                    primaryLight: '#CD5C5C',
                    secondary: '#1C1C1C',
                    secondaryDark: '#0A0A0A',
                    background: '#0A0505',
                    surface: '#151010',
                    text: '#F5F5F5',
                    textSecondary: '#CD853F',
                    border: '#8B0000',
                    success: '#32CD32',
                    warning: '#FFA500',
                    error: '#FF0000'
                }
            },
            {
                id: 'eclipse',
                name: 'Éclipse',
                subtitle: 'Noir & Argent',
                primaryColor: '#0A0A0A',
                secondaryColor: '#C0C0C0',
                colors: {
                    primary: '#2F2F2F',
                    primaryDark: '#1A1A1A',
                    primaryLight: '#4A4A4A',
                    secondary: '#C0C0C0',
                    secondaryDark: '#A8A8A8',
                    background: '#050505',
                    surface: '#0F0F0F',
                    text: '#E8E8E8',
                    textSecondary: '#A0A0A0',
                    border: '#404040',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#CD5C5C'
                }
            },
            {
                id: 'cristal-polaire',
                name: 'Cristal Polaire',
                subtitle: 'Bleu glacier & Argent',
                primaryColor: '#00BFFF',
                secondaryColor: '#C0C0C0',
                colors: {
                    primary: '#00BFFF',
                    primaryDark: '#009ACD',
                    primaryLight: '#87CEEB',
                    secondary: '#C0C0C0',
                    secondaryDark: '#A8A8A8',
                    background: '#E8F4F8',
                    surface: '#F0F8FF',
                    text: '#1A3A4A',
                    textSecondary: '#4A6A7A',
                    border: '#B0E0E6',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#CD5C5C'
                }
            },
            {
                id: 'hanami-dore',
                name: 'Hanami Doré',
                subtitle: 'Rose pâle & Or rosé',
                primaryColor: '#FFB6C1',
                secondaryColor: '#B76E79',
                colors: {
                    primary: '#FFB6C1',
                    primaryDark: '#FF91A4',
                    primaryLight: '#FFD1DC',
                    secondary: '#B76E79',
                    secondaryDark: '#9A5560',
                    background: '#FFF0F3',
                    surface: '#FFF5F7',
                    text: '#4A3035',
                    textSecondary: '#8B6973',
                    border: '#FFD1DC',
                    success: '#90EE90',
                    warning: '#FFD700',
                    error: '#CD5C5C'
                }
            },
            {
                id: 'abyssal',
                name: 'Abyssal',
                subtitle: 'Noir profond & Bleu pétrole',
                primaryColor: '#0A1A2A',
                secondaryColor: '#004953',
                colors: {
                    primary: '#004953',
                    primaryDark: '#002F3A',
                    primaryLight: '#006B7A',
                    secondary: '#0A1A2A',
                    secondaryDark: '#050D15',
                    background: '#020508',
                    surface: '#0A1520',
                    text: '#E0F0FF',
                    textSecondary: '#7090A0',
                    border: '#004953',
                    success: '#00FA9A',
                    warning: '#FFD700',
                    error: '#FF6347'
                }
            },
            {
                id: 'neon-pulse',
                name: 'Néon Pulse',
                subtitle: 'Violet néon & Rose néon',
                primaryColor: '#FF00FF',
                secondaryColor: '#FF1493',
                colors: {
                    primary: '#FF00FF',
                    primaryDark: '#C71585',
                    primaryLight: '#FF69B4',
                    secondary: '#FF1493',
                    secondaryDark: '#C71585',
                    background: '#0A0510',
                    surface: '#150A1A',
                    text: '#FFFFFF',
                    textSecondary: '#FFB6C1',
                    border: '#FF00FF',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#FF4500'
                }
            },
            {
                id: 'mclaren',
                name: 'McLaren',
                subtitle: 'Black & Red',
                primaryColor: '#FF0000',
                secondaryColor: '#000000',
                colors: {
                    primary: '#FF0000',
                    primaryDark: '#CC0000',
                    primaryLight: '#FF4444',
                    secondary: '#000000',
                    secondaryDark: '#000000',
                    background: '#0A0A0A',
                    surface: '#1A1A1A',
                    text: '#FFFFFF',
                    textSecondary: '#CCCCCC',
                    border: '#FF0000',
                    success: '#00FF7F',
                    warning: '#FFD700',
                    error: '#DC143C'
                }
            }
        ];
    }

    /**
     * Load theme from localStorage
     */
    loadThemeFromStorage() {
        try {
            const savedThemeId = localStorage.getItem('lunaris_theme');
            if (savedThemeId) {
                const index = this.themes.findIndex(t => t.id === savedThemeId);
                if (index !== -1) {
                    this.currentThemeIndex = index;
                    console.log('[ThemeManager] Loaded theme from storage:', savedThemeId);
                }
            }
        } catch (e) {
            console.warn('[ThemeManager] Could not load theme from storage:', e);
        }
    }

    /**
     * Save theme to localStorage
     */
    saveThemeToStorage() {
        try {
            const theme = this.getCurrentTheme();
            localStorage.setItem('lunaris_theme', theme.id);
            console.log('[ThemeManager] Theme saved to storage:', theme.id);
        } catch (e) {
            console.warn('[ThemeManager] Could not save theme to storage:', e);
        }
    }

    /**
     * Set theme by index
     * @param {number} index - Theme index
     */
    setThemeByIndex(index) {
        if (index >= 0 && index < this.themes.length) {
            this.currentThemeIndex = index;
            this.applyTheme();
            this.saveThemeToStorage();
            console.log('[ThemeManager] Theme set to index:', index, this.getCurrentThemeName());
        }
    }

    /**
     * Set theme by ID
     * @param {string} themeId - Theme ID
     */
    setTheme(themeId) {
        const index = this.themes.findIndex(t => t.id === themeId);
        if (index !== -1) {
            this.setThemeByIndex(index);
        } else {
            console.warn('[ThemeManager] Theme not found:', themeId);
        }
    }

    /**
     * Go to next theme in carousel
     */
    nextTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        this.applyTheme();
        this.saveThemeToStorage();
        console.log('[ThemeManager] Next theme:', this.getCurrentThemeName());
    }

    /**
     * Go to previous theme in carousel
     */
    previousTheme() {
        this.currentThemeIndex = (this.currentThemeIndex - 1 + this.themes.length) % this.themes.length;
        this.applyTheme();
        this.saveThemeToStorage();
        console.log('[ThemeManager] Previous theme:', this.getCurrentThemeName());
    }

    /**
     * Get the current theme name
     * @returns {string} Current theme name
     */
    getCurrentThemeName() {
        return this.themes[this.currentThemeIndex].name;
    }

    /**
     * Get the current theme object
     * @returns {Object} Current theme
     */
    getCurrentTheme() {
        return this.themes[this.currentThemeIndex];
    }

    /**
     * Get current theme index
     * @returns {number} Current theme index
     */
    getCurrentThemeIndex() {
        return this.currentThemeIndex;
    }

    /**
     * Get total number of themes
     * @returns {number} Number of themes
     */
    getThemeCount() {
        return this.themes.length;
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
        
        // Also set primary and secondary for easy access
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-secondary', theme.secondaryColor);
        
        console.log('[ThemeManager] Theme applied:', theme.name);
    }

    /**
     * Get all themes
     * @returns {Array} All themes
     */
    getAllThemes() {
        return this.themes;
    }

    /**
     * Get theme by ID
     * @param {string} id - Theme ID
     * @returns {Object|null} Theme object
     */
    getThemeById(id) {
        return this.themes.find(t => t.id === id) || null;
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, initThemeManager };
}

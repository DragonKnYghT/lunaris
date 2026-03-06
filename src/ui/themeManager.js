/**
 * themeManager.js
 * Theme management for the game UI - 20 Themes Carousel
 */

let themeManager = null;

/**
 * ThemeManager class
 * Manages UI themes for the game with carousel navigation
 */
class ThemeManager {
    constructor() {
        this.currentThemeIndex = 0;
        this.themes = this.getDefaultThemes();
        this.themeMode = 'dark';
        
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
                textColor: '#4A3728',
                backgroundColor: '#FFF0F5',
                surfaceColor: '#FFF5F8'
            },
            {
                id: 'sakura-nocturne',
                name: 'Sakura Nocturne',
                subtitle: 'Rose vif & Noir',
                primaryColor: '#FF1493',
                textColor: '#FFFFFF',
                backgroundColor: '#1A0A1A',
                surfaceColor: '#2D1A2D'
            },
            {
                id: 'ocean-mystique',
                name: 'Océan Mystique',
                subtitle: 'Bleu profond & Turquoise',
                primaryColor: '#006994',
                textColor: '#E0FFFF',
                backgroundColor: '#001A2D',
                surfaceColor: '#002A4A'
            },
            {
                id: 'brasier-royal',
                name: 'Brasier Royal',
                subtitle: 'Rouge sombre & Or',
                primaryColor: '#8B0000',
                textColor: '#FFFACD',
                backgroundColor: '#1A0505',
                surfaceColor: '#2D0A0A'
            },
            {
                id: 'void-eternel',
                name: 'Void Éternel',
                subtitle: 'Noir & Violet néon',
                primaryColor: '#4B0082',
                textColor: '#E6E6FA',
                backgroundColor: '#0A0A0F',
                surfaceColor: '#15101F'
            },
            {
                id: 'foudre-divine',
                name: 'Foudre Divine',
                subtitle: 'Jaune électrique & Bleu nuit',
                primaryColor: '#FFD700',
                textColor: '#F0F8FF',
                backgroundColor: '#0A0A1A',
                surfaceColor: '#151530'
            },
            {
                id: 'hiver-glacial',
                name: 'Hiver Glacial',
                subtitle: 'Bleu clair & Blanc givré',
                primaryColor: '#ADD8E6',
                textColor: '#2F4F4F',
                backgroundColor: '#E8F4F8',
                surfaceColor: '#F5FFFF'
            },
            {
                id: 'foret-spirituelle',
                name: 'Forêt Spirituelle',
                subtitle: 'Vert émeraude & Brun foncé',
                primaryColor: '#50C878',
                textColor: '#F0FFF0',
                backgroundColor: '#0D1F0D',
                surfaceColor: '#1A2F1A'
            },
            {
                id: 'lune-ecarlate',
                name: 'Lune Écarlate',
                subtitle: 'Rouge sang & Noir',
                primaryColor: '#DC143C',
                textColor: '#FFFFFF',
                backgroundColor: '#0F0505',
                surfaceColor: '#1A0A0A'
            },
            {
                id: 'empire-celeste',
                name: 'Empire Céleste',
                subtitle: 'Blanc & Or lumineux',
                primaryColor: '#FFFFFF',
                textColor: '#1A1A2E',
                backgroundColor: '#1A1A2E',
                surfaceColor: '#2D2D4A'
            },
            {
                id: 'brume-fantome',
                name: 'Brume Fantôme',
                subtitle: 'Gris clair & Bleu pâle',
                primaryColor: '#D3D3D3',
                textColor: '#2F2F3F',
                backgroundColor: '#E8E8F0',
                surfaceColor: '#F0F0F8'
            },
            {
                id: 'cyber-city',
                name: 'Cyber City',
                subtitle: 'Noir & Cyan néon',
                primaryColor: '#00FFFF',
                textColor: '#E0FFFF',
                backgroundColor: '#050510',
                surfaceColor: '#0A0A1A'
            },
            {
                id: 'lotus-imperial',
                name: 'Lotus Impérial',
                subtitle: 'Violet & Rose doux',
                primaryColor: '#9932CC',
                textColor: '#FFFFFF',
                backgroundColor: '#1A0A1A',
                surfaceColor: '#2D1A2D'
            },
            {
                id: 'dragon-ancestral',
                name: 'Dragon Ancestral',
                subtitle: 'Rouge sombre & Noir charbon',
                primaryColor: '#8B0000',
                textColor: '#F5F5F5',
                backgroundColor: '#0A0505',
                surfaceColor: '#151010'
            },
            {
                id: 'eclipse',
                name: 'Éclipse',
                subtitle: 'Noir & Argent',
                primaryColor: '#2F2F2F',
                textColor: '#E8E8E8',
                backgroundColor: '#050505',
                surfaceColor: '#0F0F0F'
            },
            {
                id: 'cristal-polaire',
                name: 'Cristal Polaire',
                subtitle: 'Bleu glacier & Argent',
                primaryColor: '#00BFFF',
                textColor: '#1A3A4A',
                backgroundColor: '#E8F4F8',
                surfaceColor: '#F0F8FF'
            },
            {
                id: 'hanami-dore',
                name: 'Hanami Doré',
                subtitle: 'Rose pâle & Or rosé',
                primaryColor: '#FFB6C1',
                textColor: '#4A3035',
                backgroundColor: '#FFF0F3',
                surfaceColor: '#FFF5F7'
            },
            {
                id: 'abyssal',
                name: 'Abyssal',
                subtitle: 'Noir profond & Bleu pétrole',
                primaryColor: '#004953',
                textColor: '#E0F0FF',
                backgroundColor: '#020508',
                surfaceColor: '#0A1520'
            },
            {
                id: 'neon-pulse',
                name: 'Néon Pulse',
                subtitle: 'Violet néon & Rose néon',
                primaryColor: '#FF00FF',
                textColor: '#FFFFFF',
                backgroundColor: '#0A0510',
                surfaceColor: '#150A1A'
            },
            {
                id: 'mclaren',
                name: 'McLaren',
                subtitle: 'Black & Red',
                primaryColor: '#FF0000',
                textColor: '#FFFFFF',
                backgroundColor: '#0A0A0A',
                surfaceColor: '#1A1A1A'
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
            
            // Also load theme mode (dark/light)
            const savedMode = localStorage.getItem('lunaris_theme_mode');
            if (savedMode) {
                this.themeMode = savedMode;
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
            localStorage.setItem('lunaris_theme_mode', this.themeMode);
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
     * Get all themes
     * @returns {Array} All themes
     */
    getAllThemes() {
        return this.themes;
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
        
        // Set theme colors as CSS variables
        root.style.setProperty('--theme-primary', theme.primaryColor);
        root.style.setProperty('--theme-text', theme.textColor);
        root.style.setProperty('--theme-background', theme.backgroundColor);
        root.style.setProperty('--theme-surface', theme.surfaceColor);
        
        // Also apply to body for easier access
        if (document.body) {
            document.body.style.setProperty('--color-primary', theme.primaryColor);
            document.body.style.setProperty('--text-primary', theme.textColor);
            document.body.style.setProperty('--bg-dark', theme.backgroundColor);
            document.body.style.setProperty('--bg-card', theme.surfaceColor);
        }
        
        console.log('[ThemeManager] Theme applied:', theme.name);
        
        // Update theme dropdown if it exists
        this.updateThemeDropdown();
    }

    /**
     * Update theme dropdown styling to match current theme
     */
    updateThemeDropdown() {
        const select = document.getElementById('theme-select');
        if (select) {
            const theme = this.getCurrentTheme();
            select.style.backgroundColor = theme.primaryColor;
            select.style.color = theme.textColor;
            select.style.borderColor = theme.primaryColor;
        }
    }

    /**
     * Set theme mode (dark/light) - compatibility method
     * @param {string} mode - 'dark' or 'light'
     */
    setThemeMode(mode) {
        if (mode === 'dark' || mode === 'light') {
            this.themeMode = mode;
            this.applyTheme();
            this.saveThemeToStorage();
            
            // Synchronize with site theme
            this.syncThemeWithSite();
        }
    }

    /**
     * Get current theme mode
     * @returns {string} Current theme mode
     */
    getThemeMode() {
        return this.themeMode;
    }

    /**
     * Synchronize game theme with website theme
     * Converts game theme to site theme format and applies it
     */
    syncThemeWithSite() {
        try {
            // Check if siteManager is available
            if (typeof window.siteManager === 'undefined') {
                console.warn('[ThemeManager] siteManager not available for sync');
                return;
            }

            const currentTheme = this.getCurrentTheme();
            if (!currentTheme) return;

            // Map game theme ID to site theme base name
            // Game themes use format like 'sakura', 'void-eternel', etc.
            // Site themes use format like 'sakura_dark', 'sakura_light', etc.
            const themeNameMap = {
                'sakura': 'sakura',
                'sakura-nocturne': 'sakura',
                'ocean-mystique': 'abyssal',
                'brasier-royal': 'samurai',
                'void-eternel': 'void',
                'foudre-divine': 'zenith',
                'hiver-glacial': 'hiver',
                'foret-spirituelle': 'hori',
                'lune-ecarlate': 'lycoris',
                'empire-celeste': 'empire',
                'brume-fantome': 'glacier',
                'cyber-city': 'cyber',
                'lotus-imperial': 'lotus',
                'dragon-ancestral': 'samurai',
                'eclipse': 'void',
                'cristal-polaire': 'glacier',
                'hanami-dore': 'sakura',
                'abyssal': 'abyssal',
                'neon-pulse': 'cyber',
                'eclipse-eternelle': 'void',
                'minuit': 'minuit',
                'ranni': 'ranni',
                'slavekillerfang': 'slavekillerfang',
                'hinata': 'hinata',
                'nat': 'nat',
                'mclaren': 'samurai'
            };

            // Get the base theme name from the map
            const baseName = themeNameMap[currentTheme.id] || currentTheme.id.split('-')[0];
            
            // Build the site theme ID with the current mode
            const siteThemeId = `${baseName}_${this.themeMode}`;
            
            // Find the theme index in siteManager's themes array
            const themeIndex = window.siteManager.themes.findIndex(t => t.id === siteThemeId);
            
            if (themeIndex !== -1) {
                // Update site theme
                window.siteManager.currentThemeIndex = themeIndex;
                window.siteManager.currentThemeMode = this.themeMode;
                window.siteManager.applyTheme();
                
                // Update the site's theme dropdown if it exists
                const select = document.getElementById('theme-select');
                if (select) {
                    select.value = themeIndex;
                }
                
                console.log('[ThemeManager] Synced with site theme:', siteThemeId);
            } else {
                console.warn('[ThemeManager] Site theme not found:', siteThemeId);
            }
        } catch (e) {
            console.warn('[ThemeManager] Error syncing with site:', e);
        }
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
    themeManager.nextTheme();
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

/**
 * Lunaris Site Manager
 * Handles language switching, theme selection, and navbar behavior across all pages
 */

// Simple Day/Night theme system with dropdown
const siteManager = {
    // Current language
    currentLanguage: 'fr',
    
    // Current theme mode: 'dark' or 'light'
    currentThemeMode: 'dark',
    
    // Current theme index (for dropdown)
    currentThemeIndex: 0,
    
    // Available themes - each theme has both light and dark variants
    themes: [
        // Default themes
        { id: 'default_dark', name: 'Default Dark', mode: 'dark', baseTheme: 'default' },
        { id: 'default_light', name: 'Default Light', mode: 'light', baseTheme: 'default' },
        
        // Ocean themes
        { id: 'ocean_dark', name: 'Ocean Dark', mode: 'dark', baseTheme: 'ocean' },
        { id: 'ocean_light', name: 'Ocean Light', mode: 'light', baseTheme: 'ocean' },
        
        // Forest themes
        { id: 'forest_dark', name: 'Forest Dark', mode: 'dark', baseTheme: 'forest' },
        { id: 'forest_light', name: 'Forest Light', mode: 'light', baseTheme: 'forest' },
        
        // Sunset themes
        { id: 'sunset_dark', name: 'Sunset Dark', mode: 'dark', baseTheme: 'sunset' },
        { id: 'sunset_light', name: 'Sunset Light', mode: 'light', baseTheme: 'sunset' },
        
        // Lavender themes
        { id: 'lavender_dark', name: 'Lavender Dark', mode: 'dark', baseTheme: 'lavender' },
        { id: 'lavender_light', name: 'Lavender Light', mode: 'light', baseTheme: 'lavender' },
        
        // Midnight themes
        { id: 'midnight_dark', name: 'Midnight Dark', mode: 'dark', baseTheme: 'midnight' },
        { id: 'midnight_light', name: 'Midnight Light', mode: 'light', baseTheme: 'midnight' },
        
        // Candy themes
        { id: 'candy_dark', name: 'Candy Dark', mode: 'dark', baseTheme: 'candy' },
        { id: 'candy_light', name: 'Candy Light', mode: 'light', baseTheme: 'candy' },
        
        // Lemon themes
        { id: 'lemon_dark', name: 'Lemon Dark', mode: 'dark', baseTheme: 'lemon' },
        { id: 'lemon_light', name: 'Lemon Light', mode: 'light', baseTheme: 'lemon' },
        
        // Mint themes
        { id: 'mint_dark', name: 'Mint Dark', mode: 'dark', baseTheme: 'mint' },
        { id: 'mint_light', name: 'Mint Light', mode: 'light', baseTheme: 'mint' },
        
        // Rose themes
        { id: 'rose_dark', name: 'Rose Dark', mode: 'dark', baseTheme: 'rose' },
        { id: 'rose_light', name: 'Rose Light', mode: 'light', baseTheme: 'rose' },
        
        // Sakura themes
        { id: 'sakura_dark', name: 'Sakura Dark', mode: 'dark', baseTheme: 'sakura' },
        { id: 'sakura_light', name: 'Sakura Light', mode: 'light', baseTheme: 'sakura' },
        
        // Brasier themes (Fire)
        { id: 'brasier_dark', name: 'Brasier Dark', mode: 'dark', baseTheme: 'brasier' },
        { id: 'brasier_light', name: 'Brasier Light', mode: 'light', baseTheme: 'brasier' }
    ],
    
    // Initialize the site manager
    async init() {
        console.log('SiteManager: Initializing...');
        
        // Load saved preferences
        this.loadPreferences();
        
        // Apply theme
        this.applyTheme();
        
        // Initialize language
        await this.initLanguage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('SiteManager: Initialization complete');
    },
    
    // Load preferences from localStorage
    loadPreferences() {
        // Load language preference
        const savedLang = localStorage.getItem('lunaris_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
        } else {
            // Check browser language
            const browserLang = navigator.language || navigator.userLanguage;
            this.currentLanguage = browserLang.startsWith('fr') ? 'fr' : 'en';
        }
        
        // Load theme preference (Day/Night mode)
        const savedMode = localStorage.getItem('lunaris_theme_mode');
        if (savedMode) {
            this.currentThemeMode = savedMode;
        }
        
        // Load theme index
        const savedIndex = localStorage.getItem('lunaris_theme_index');
        if (savedIndex !== null) {
            this.currentThemeIndex = parseInt(savedIndex, 10);
        }
    },
    
    // Initialize language/translation
    async initLanguage() {
        if (typeof translationManager !== 'undefined') {
            await translationManager.init();
            translationManager.setLanguage(this.currentLanguage);
        }
        
        // Update language switch UI
        this.updateLanguageSwitchUI();
        
        // Update theme switch UI
        this.updateThemeSwitchUI();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Language switch button
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Theme toggle button (handles both 'themeToggle' and 'themeSwitch' ids)
        const themeToggle = document.getElementById('themeToggle') || document.getElementById('themeSwitch');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Theme dropdown
        const themeDropdown = document.getElementById('themeDropdown');
        if (themeDropdown) {
            themeDropdown.addEventListener('change', (e) => this.selectTheme(e.target.value));
        }
        
        // Theme select (alternative id)
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.selectTheme(e.target.value));
        }
    },
    
    // Toggle language between EN and FR
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        
        // Save preference
        localStorage.setItem('lunaris_language', this.currentLanguage);
        
        // Update translations
        if (typeof translationManager !== 'undefined') {
            translationManager.setLanguage(this.currentLanguage);
        }
        
        // Update UI
        this.updateLanguageSwitchUI();
        
        console.log('SiteManager: Language changed to', this.currentLanguage);
    },
    
    // Toggle theme between Day and Night
    toggleTheme() {
        this.currentThemeMode = this.currentThemeMode === 'dark' ? 'light' : 'dark';
        
        // Save preference
        localStorage.setItem('lunaris_theme_mode', this.currentThemeMode);
        
        // Apply theme
        this.applyTheme();
        
        // Update UI
        this.updateThemeSwitchUI();
        
        console.log('SiteManager: Theme toggled to', this.currentThemeMode);
    },
    
    // Select theme from dropdown
    selectTheme(themeIndex) {
        this.currentThemeIndex = parseInt(themeIndex, 10);
        
        // Get theme info
        const theme = this.themes[this.currentThemeIndex];
        if (theme) {
            this.currentThemeMode = theme.mode;
            
            // Save preferences
            localStorage.setItem('lunaris_theme_index', this.currentThemeIndex);
            localStorage.setItem('lunaris_theme_mode', this.currentThemeMode);
            
            // Apply theme
            this.applyTheme();
            
            // Update UI
            this.updateThemeSwitchUI();
            
            console.log('SiteManager: Theme selected:', theme.name);
        }
    },
    
    // Apply theme to document
    applyTheme() {
        // Remove both classes first
        document.body.classList.remove('light-mode', 'dark-mode');
        
        // Add the appropriate class
        if (this.currentThemeMode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
        
        // Apply theme-specific colors
        this.applyThemeColors();
    },
    
    // Apply theme-specific colors
    applyThemeColors() {
        const theme = this.themes[this.currentThemeIndex];
        if (!theme) return;
        
        // Apply CSS custom properties based on theme
        const root = document.documentElement;
        
        // Theme color presets - Dark versions
        const themeColors = {
            default: {
                dark: { primary: '#6c5ce7', secondary: '#00d9ff', accent: '#fd79a8', bgDark: '#1a1a2e', bgLight: '#16213e', bgCard: '#1f1f3a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#5b4fd6', secondary: '#00b8d9', accent: '#e05690', bgDark: '#f5f5f5', bgLight: '#ffffff', bgCard: '#ffffff', textPrimary: '#1a1a2e', textSecondary: '#4a4a5a' }
            },
            ocean: {
                dark: { primary: '#0984e3', secondary: '#00cec9', accent: '#fd79a8', bgDark: '#0a1929', bgLight: '#132743', bgCard: '#1a3a5c', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#0077b6', secondary: '#00cec9', accent: '#fd79a8', bgDark: '#e8f4f8', bgLight: '#f0f8ff', bgCard: '#ffffff', textPrimary: '#0a1929', textSecondary: '#4a5568' }
            },
            forest: {
                dark: { primary: '#00b894', secondary: '#55efc4', accent: '#fdcb6e', bgDark: '#0d1f0d', bgLight: '#1a3a1a', bgCard: '#254d25', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#00a878', secondary: '#55efc4', accent: '#fdcb6e', bgDark: '#e8f5e9', bgLight: '#f1f8e9', bgCard: '#ffffff', textPrimary: '#1b4332', textSecondary: '#4a5568' }
            },
            sunset: {
                dark: { primary: '#e17055', secondary: '#fab1a0', accent: '#fdcb6e', bgDark: '#1a0f0a', bgLight: '#2d1810', bgCard: '#3d221a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#d63031', secondary: '#fab1a0', accent: '#fdcb6e', bgDark: '#fff5f5', bgLight: '#ffebee', bgCard: '#ffffff', textPrimary: '#2d1810', textSecondary: '#4a5568' }
            },
            lavender: {
                dark: { primary: '#a29bfe', secondary: '#dfe6e9', accent: '#fd79a8', bgDark: '#1a1625', bgLight: '#2d2640', bgCard: '#3d3654', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#8b7cf7', secondary: '#a29bfe', accent: '#fd79a8', bgDark: '#f3f0ff', bgLight: '#f8f7ff', bgCard: '#ffffff', textPrimary: '#1a1625', textSecondary: '#4a5568' }
            },
            midnight: {
                dark: { primary: '#6c5ce7', secondary: '#74b9ff', accent: '#a29bfe', bgDark: '#0a0a15', bgLight: '#121225', bgCard: '#1a1a35', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#5a4fcf', secondary: '#74b9ff', accent: '#a29bfe', bgDark: '#e8e8f0', bgLight: '#f0f0f8', bgCard: '#ffffff', textPrimary: '#0a0a15', textSecondary: '#4a5568' }
            },
            candy: {
                dark: { primary: '#fd79a8', secondary: '#fdcb6e', accent: '#00cec9', bgDark: '#2d1a25', bgLight: '#3d2233', bgCard: '#4d2a40', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#fd79a8', secondary: '#fdcb6e', accent: '#00cec9', bgDark: '#fff0f5', bgLight: '#fff5f8', bgCard: '#ffffff', textPrimary: '#2d1a25', textSecondary: '#4a5568' }
            },
            lemon: {
                dark: { primary: '#ffeaa7', secondary: '#fdcb6e', accent: '#55efc4', bgDark: '#2d2a1a', bgLight: '#3d3822', bgCard: '#4d482a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#ffeaa7', secondary: '#fdcb6e', accent: '#55efc4', bgDark: '#fffde7', bgLight: '#fffef0', bgCard: '#ffffff', textPrimary: '#2d2a1a', textSecondary: '#4a5568' }
            },
            mint: {
                dark: { primary: '#00b894', secondary: '#55efc4', accent: '#0984e3', bgDark: '#0d2d22', bgLight: '#154030', bgCard: '#1d4d3a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#00b894', secondary: '#55efc4', accent: '#0984e3', bgDark: '#e0f7f1', bgLight: '#e8faf5', bgCard: '#ffffff', textPrimary: '#0d2d22', textSecondary: '#4a5568' }
            },
            rose: {
                dark: { primary: '#e84393', secondary: '#fd79a8', accent: '#a29bfe', bgDark: '#2d1a22', bgLight: '#3d222c', bgCard: '#4d2a35', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#e84393', secondary: '#fd79a8', accent: '#a29bfe', bgDark: '#ffeef3', bgLight: '#fff0f5', bgCard: '#ffffff', textPrimary: '#2d1a22', textSecondary: '#4a5568' }
            },
            sakura: {
                dark: { primary: '#ffb7c5', secondary: '#ffc0cb', accent: '#ff69b4', bgDark: '#1a1215', bgLight: '#2d1a22', bgCard: '#3d222a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#ffb7c5', secondary: '#ffc0cb', accent: '#ff69b4', bgDark: '#fff0f5', bgLight: '#fff5f8', bgCard: '#ffffff', textPrimary: '#4a3728', textSecondary: '#8b7355' }
            },
            brasier: {
                dark: { primary: '#ff6b35', secondary: '#ff9f43', accent: '#feca57', bgDark: '#1a0f0a', bgLight: '#2d1810', bgCard: '#3d221a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
                light: { primary: '#ff6b35', secondary: '#ff9f43', accent: '#feca57', bgDark: '#fff5f0', bgLight: '#ffebe0', bgCard: '#ffffff', textPrimary: '#1a0f0a', textSecondary: '#4a5568' }
            }
        };
        
        const baseTheme = theme.baseTheme || 'default';
        const mode = theme.mode || 'dark';
        const colors = themeColors[baseTheme]?.[mode] || themeColors.default.dark;
        
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--bg-dark', colors.bgDark);
        root.style.setProperty('--bg-light', colors.bgLight);
        root.style.setProperty('--bg-card', colors.bgCard);
        root.style.setProperty('--text-primary', colors.textPrimary);
        root.style.setProperty('--text-secondary', colors.textSecondary);
    },
    
    // Update language switch UI
    updateLanguageSwitchUI() {
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            const langEn = langSwitch.querySelector('.lang-en');
            const langFr = langSwitch.querySelector('.lang-fr');
            
            if (langEn) {
                langEn.classList.toggle('active', this.currentLanguage === 'en');
            }
            if (langFr) {
                langFr.classList.toggle('active', this.currentLanguage === 'fr');
            }
        }
    },
    
    // Update theme switch UI
    updateThemeSwitchUI() {
        const themeSwitch = document.getElementById('themeSwitch') || document.getElementById('themeToggle');
        if (themeSwitch) {
            const icon = themeSwitch.querySelector('.theme-icon');
            if (icon) {
                // Day (light) = Sun, Night (dark) = Moon
                icon.textContent = this.currentThemeMode === 'dark' ? '🌙' : '☀️';
            }
        }
        
        // Update dropdown if exists
        const themeDropdown = document.getElementById('themeDropdown');
        if (themeDropdown) {
            themeDropdown.value = this.currentThemeIndex;
        }
        
        // Update select if exists
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.currentThemeIndex;
        }
    },
    
    // Setup navbar behavior for play page
    setupNavbarBehavior() {
        // Check if we're on the play page
        const isPlayPage = window.location.href.includes('play.html') || document.querySelector('#game-container');
        
        if (isPlayPage) {
            // Listen for game start
            this.setupGameStartDetection();
        }
    },
    
    // Setup detection for when game starts
    setupGameStartDetection() {
        // Check periodically if game has started
        const checkGameStart = setInterval(() => {
            const gameContainer = document.getElementById('game-container');
            const screenContainer = document.getElementById('screen-container');
            
            // If game is rendering content, hide navbar
            if (screenContainer && screenContainer.children.length > 0) {
                this.hideNavbar();
                clearInterval(checkGameStart);
            }
        }, 500);
        
        // Also listen for custom event when game starts
        window.addEventListener('gameStart', () => {
            this.hideNavbar();
        });
        
        // Alternative: check when loading is hidden
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('game-loading');
                if (loading && loading.classList.contains('hidden')) {
                    this.hideNavbar();
                }
            }, 2000);
        });
    },
    
    // Hide navbar and footer
    hideNavbar() {
        document.body.classList.add('game-active');
        console.log('SiteManager: Navbar hidden (game started)');
    },
    
    // Show navbar and footer
    showNavbar() {
        document.body.classList.remove('game-active');
        console.log('SiteManager: Navbar shown');
    },
    
    // Get current language
    getLanguage() {
        return this.currentLanguage;
    },
    
    // Get current theme mode
    getThemeMode() {
        return this.currentThemeMode;
    },
    
    // Get current theme index
    getThemeIndex() {
        return this.currentThemeIndex;
    },
    
    // Get all themes
    getThemes() {
        return this.themes;
    }
};

// Export for use in other scripts
window.siteManager = siteManager;

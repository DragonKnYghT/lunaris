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
    
    // Available themes
    themes: [
        { id: 'default', name: 'Default', mode: 'dark' },
        { id: 'ocean', name: 'Ocean', mode: 'dark' },
        { id: 'forest', name: 'Forest', mode: 'dark' },
        { id: 'sunset', name: 'Sunset', mode: 'dark' },
        { id: 'lavender', name: 'Lavender', mode: 'dark' },
        { id: 'midnight', name: 'Midnight', mode: 'dark' },
        { id: 'candy', name: 'Candy', mode: 'light' },
        { id: 'lemon', name: 'Lemon', mode: 'light' },
        { id: 'mint', name: 'Mint', mode: 'light' },
        { id: 'rose', name: 'Rose', mode: 'light' }
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
        
        // Theme color presets
        const themeColors = {
            default: {
                primary: '#6c5ce7',
                secondary: '#00d9ff',
                accent: '#fd79a8',
                bgDark: '#1a1a2e',
                bgLight: '#16213e',
                bgCard: '#1f1f3a'
            },
            ocean: {
                primary: '#0984e3',
                secondary: '#00cec9',
                accent: '#fd79a8',
                bgDark: '#0a1929',
                bgLight: '#132743',
                bgCard: '#1a3a5c'
            },
            forest: {
                primary: '#00b894',
                secondary: '#55efc4',
                accent: '#fdcb6e',
                bgDark: '#0d1f0d',
                bgLight: '#1a3a1a',
                bgCard: '#254d25'
            },
            sunset: {
                primary: '#e17055',
                secondary: '#fab1a0',
                accent: '#fdcb6e',
                bgDark: '#1a0f0a',
                bgLight: '#2d1810',
                bgCard: '#3d221a'
            },
            lavender: {
                primary: '#a29bfe',
                secondary: '#dfe6e9',
                accent: '#fd79a8',
                bgDark: '#1a1625',
                bgLight: '#2d2640',
                bgCard: '#3d3654'
            },
            midnight: {
                primary: '#6c5ce7',
                secondary: '#74b9ff',
                accent: '#a29bfe',
                bgDark: '#0a0a15',
                bgLight: '#121225',
                bgCard: '#1a1a35'
            },
            candy: {
                primary: '#fd79a8',
                secondary: '#fdcb6e',
                accent: '#00cec9',
                bgDark: '#fff0f5',
                bgLight: '#fff5f8',
                bgCard: '#ffffff'
            },
            lemon: {
                primary: '#ffeaa7',
                secondary: '#fdcb6e',
                accent: '#55efc4',
                bgDark: '#fffde7',
                bgLight: '#fffef0',
                bgCard: '#ffffff'
            },
            mint: {
                primary: '#00b894',
                secondary: '#55efc4',
                accent: '#0984e3',
                bgDark: '#f0fff4',
                bgLight: '#f5fff8',
                bgCard: '#ffffff'
            },
            rose: {
                primary: '#e84393',
                secondary: '#fd79a8',
                accent: '#a29bfe',
                bgDark: '#fff0f3',
                bgLight: '#fff5f7',
                bgCard: '#ffffff'
            }
        };
        
        const colors = themeColors[theme.id] || themeColors.default;
        
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--bg-dark', colors.bgDark);
        root.style.setProperty('--bg-light', colors.bgLight);
        root.style.setProperty('--bg-card', colors.bgCard);
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

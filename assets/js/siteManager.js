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
    
    // Theme color presets (defined once as object property)
    themeColors: {
        default: {
            dark: { primary: '#6c5ce7', secondary: '#00d9ff', accent: '#fd79a8', bgDark: '#1a1a2e', bgLight: '#16213e', bgCard: '#1f1f3a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
            light: { primary: '#5b4fd6', secondary: '#00b8d9', accent: '#e05690', bgDark: '#f5f5f5', bgLight: '#ffffff', bgCard: '#ffffff', textPrimary: '#1a1a2e', textSecondary: '#4a4a5a' }
        },
        sakura: {
            dark: { primary: '#ffb7c5', secondary: '#ffc0cb', accent: '#ff69b4', bgDark: '#1a1215', bgLight: '#2d1a22', bgCard: '#3d222a', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
            light: { primary: '#ffb7c5', secondary: '#ffc0cb', accent: '#ff69b4', bgDark: '#fff0f5', bgLight: '#fff5f8', bgCard: '#ffffff', textPrimary: '#4a3728', textSecondary: '#8b7355' }
        },
        void: {
            dark: { primary: '#8a4fff', secondary: '#b084f5', accent: '#d6b3ff', bgDark: '#0b0b1e', bgLight: '#15152e', bgCard: '#1f1f3d', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
            light: { primary: '#7a3fe0', secondary: '#a57af0', accent: '#caa8ff', bgDark: '#f3f0ff', bgLight: '#faf8ff', bgCard: '#ffffff', textPrimary: '#1a1a2e', textSecondary: '#4a4a5a' }
        },
        hiver: {
            dark: { primary: '#7cc6ff', secondary: '#a8e1ff', accent: '#d0f0ff', bgDark: '#0a1a2e', bgLight: '#132a45', bgCard: '#1a3a5c', textPrimary: '#ffffff', textSecondary: '#c8d8e8' },
            light: { primary: '#5bb0ff', secondary: '#a8e1ff', accent: '#d0f0ff', bgDark: '#e8f4ff', bgLight: '#f5faff', bgCard: '#ffffff', textPrimary: '#0a1a2e', textSecondary: '#4a5568' }
        },
        empire: {
            dark: { primary: '#d4af37', secondary: '#f5d76e', accent: '#fff2b2', bgDark: '#1a1a1a', bgLight: '#2a2a2a', bgCard: '#3a3a3a', textPrimary: '#ffffff', textSecondary: '#e6dca8' },
            light: { primary: '#cfa300', secondary: '#f5d76e', accent: '#ffe9a8', bgDark: '#ffffff', bgLight: '#faf7ef', bgCard: '#ffffff', textPrimary: '#3a2f00', textSecondary: '#6b5a00' }
        },
        cyber: {
            dark: { primary: '#00ffff', secondary: '#00bcd4', accent: '#18ffff', bgDark: '#000000', bgLight: '#0a0a0a', bgCard: '#111111', textPrimary: '#e0ffff', textSecondary: '#88cfd0' },
            light: { primary: '#00bcd4', secondary: '#00e5ff', accent: '#18ffff', bgDark: '#e8faff', bgLight: '#f0fdff', bgCard: '#ffffff', textPrimary: '#00363a', textSecondary: '#4a6a6d' }
        },
        lotus: {
            dark: { primary: '#c77dff', secondary: '#e0b3ff', accent: '#ffb7e8', bgDark: '#1a0f1f', bgLight: '#2a1a2f', bgCard: '#3a2640', textPrimary: '#ffffff', textSecondary: '#d8c6e8' },
            light: { primary: '#b86bff', secondary: '#e0b3ff', accent: '#ffb7e8', bgDark: '#f7f0ff', bgLight: '#fcf7ff', bgCard: '#ffffff', textPrimary: '#2a1a2f', textSecondary: '#5a4a6d' }
        },
        abyssal: {
            dark: { primary: '#0088aa', secondary: '#00aacc', accent: '#33ddff', bgDark: '#001f2d', bgLight: '#003344', bgCard: '#004455', textPrimary: '#e0faff', textSecondary: '#88cfd0' },
            light: { primary: '#0099bb', secondary: '#33ccee', accent: '#66e6ff', bgDark: '#e8faff', bgLight: '#f0fdff', bgCard: '#ffffff', textPrimary: '#003344', textSecondary: '#4a6a6d' }
        },
        lycoris: {
            dark: { primary: '#ff2e63', secondary: '#ff5c8a', accent: '#ff99b3', bgDark: '#1a0005', bgLight: '#2a0008', bgCard: '#3a000c', textPrimary: '#ffffff', textSecondary: '#e8b8c8' },
            light: { primary: '#ff2e63', secondary: '#ff5c8a', accent: '#ff99b3', bgDark: '#fff0f5', bgLight: '#fff5f7', bgCard: '#ffffff', textPrimary: '#3a0008', textSecondary: '#6d3a4a' }
        },
        glacier: {
            dark: { primary: '#C2E0E3', secondary: '#9DB5C0', accent: '#E0FCFC', bgDark: '#253337', bgLight: '#2F4146', bgCard: '#3A4D53', textPrimary: '#E0FCFC', textSecondary: '#9DB5C0' },
            light: { primary: '#5C6C73', secondary: '#9DB5C0', accent: '#253337', bgDark: '#E0FCFC', bgLight: '#F7FFFF', bgCard: '#FFFFFF', textPrimary: '#253337', textSecondary: '#5C6C73' }
        },

        galaxie: {
            dark: { primary: '#8a4fff', secondary: '#ff79c6', accent: '#bd93f9', bgDark: '#0b0b1e', bgLight: '#15152e', bgCard: '#1f1f3d', textPrimary: '#ffffff', textSecondary: '#c8b8e8' },
            light: { primary: '#7a3fe0', secondary: '#ff79c6', accent: '#bd93f9', bgDark: '#f3f0ff', bgLight: '#faf8ff', bgCard: '#ffffff', textPrimary: '#1a1a2e', textSecondary: '#4a4a5a' }
        },
        samurai: {
            dark: { primary: '#d7263d', secondary: '#ff4d5a', accent: '#ff9aa2', bgDark: '#1a0a0a', bgLight: '#2a1212', bgCard: '#3a1a1a', textPrimary: '#ffffff', textSecondary: '#e8b8b8' },
            light: { primary: '#d7263d', secondary: '#ff4d5a', accent: '#ff9aa2', bgDark: '#fff0f0', bgLight: '#fff5f5', bgCard: '#ffffff', textPrimary: '#3a0a0a', textSecondary: '#6d3a3a' }
        },
        phenix: {
            dark: { primary: '#ff6b35', secondary: '#ff9f43', accent: '#ffd180', bgDark: '#1a0f0a', bgLight: '#2d1810', bgCard: '#3d221a', textPrimary: '#ffffff', textSecondary: '#e8c8a8' },
            light: { primary: '#ff6b35', secondary: '#ff9f43', accent: '#ffd180', bgDark: '#fff5f0', bgLight: '#ffebe0', bgCard: '#ffffff', textPrimary: '#3a1a0a', textSecondary: '#6d4a3a' }
        },
        aurora: {
            dark: { primary: '#00ffa6', secondary: '#00e5ff', accent: '#66ffcc', bgDark: '#001a26', bgLight: '#002a3a', bgCard: '#003a4d', textPrimary: '#e0ffff', textSecondary: '#88cfd0' },
            light: { primary: '#00d48f', secondary: '#00c0e0', accent: '#66ffcc', bgDark: '#e8faff', bgLight: '#f0fdff', bgCard: '#ffffff', textPrimary: '#003a4d', textSecondary: '#4a6a6d' }
        },
        zenith: {
            dark: { primary: '#3f51b5', secondary: '#5c6bc0', accent: '#ffd54f', bgDark: '#0a0a1a', bgLight: '#12122a', bgCard: '#1a1a3a', textPrimary: '#ffffff', textSecondary: '#c8c8e8' },
            light: { primary: '#3949ab', secondary: '#5c6bc0', accent: '#ffca28', bgDark: '#f0f2ff', bgLight: '#fafbff', bgCard: '#ffffff', textPrimary: '#1a1a3a', textSecondary: '#4a4a6d' }
        },
        hori: {
            dark: { primary: '#d49a6a', secondary: '#f2c9a0', accent: '#ffb7c5', bgDark: '#1a120c', bgLight: '#2a1e15', bgCard: '#3a2a1f', textPrimary: '#ffffff', textSecondary: '#e8d8c8' },
            light: { primary: '#c6885a', secondary: '#f2c9a0', accent: '#ffb7c5', bgDark: '#fff7f0', bgLight: '#fffaf5', bgCard: '#ffffff', textPrimary: '#3a2a1f', textSecondary: '#6d5a4a' }
        },
        minuit: {
            dark: { primary: '#1F2A44', secondary: '#FF4FA3', accent: '#A37BFF', bgDark: '#0a0a15', bgLight: '#121225', bgCard: '#1a1a35', textPrimary: '#ffffff', textSecondary: '#b8b8d1' },
            light: { primary: '#FF4FA3', secondary: '#1F2A44', accent: '#A37BFF', bgDark: '#f5f0ff', bgLight: '#faf8ff', bgCard: '#ffffff', textPrimary: '#1F2A44', textSecondary: '#4a4a6d' }
        },
        ranni: {
            dark: { primary: '#6AA7FF', secondary: '#A8C8FF', accent: '#C6B8FF', bgDark: '#0A0A15', bgLight: '#121225', bgCard: '#1A1A35', textPrimary: '#FFFFFF', textSecondary: '#C8C8E8' },
            light: { primary: '#6AA7FF', secondary: '#A8C8FF', accent: '#C6B8FF', bgDark: '#F0F4FF', bgLight: '#FAFBFF', bgCard: '#FFFFFF', textPrimary: '#1A1A35', textSecondary: '#4A4A6D' }
        },
        slavekillerfang: {
            dark: { primary: '#b30000', secondary: '#ff0033', accent: '#ff6699', bgDark: '#0a0000', bgLight: '#1a0005', bgCard: '#2a0008', textPrimary: '#ffffff', textSecondary: '#e8b8c8' },
            light: { primary: '#cc0000', secondary: '#ff3355', accent: '#ff99b3', bgDark: '#fff0f3', bgLight: '#fff5f7', bgCard: '#ffffff', textPrimary: '#330000', textSecondary: '#663333' }
        },
        hinata: {
            dark: { primary: '#ff6f00', secondary: '#ffa040', accent: '#ffd180', bgDark: '#0d0d0d', bgLight: '#1a1a1a', bgCard: '#262626', textPrimary: '#ffffff', textSecondary: '#e8c8a8' },
            light: { primary: '#ff6f00', secondary: '#ffa040', accent: '#ffd180', bgDark: '#fff5e6', bgLight: '#fffaf0', bgCard: '#ffffff', textPrimary: '#331a00', textSecondary: '#664d00' }
        },
        nat: {
            dark: { primary: '#ffffff', secondary: '#e0e0e0', accent: '#f5f5f5', bgDark: '#1a1a1a', bgLight: '#2a2a2a', bgCard: '#3a3a3a', textPrimary: '#ffffff', textSecondary: '#d0d0d0' },
            light: { primary: '#ffffff', secondary: '#f5f5f5', accent: '#e0e0e0', bgDark: '#ffffff', bgLight: '#ffffff', bgCard: '#ffffff', textPrimary: '#000000', textSecondary: '#555555' }
        }
    },
    
    // Available themes - each theme has both light and dark variants
    themes: [
        
        // Default
        { id: 'default_dark', name: 'Default Dark', mode: 'dark', baseTheme: 'default' },
        { id: 'default_light', name: 'Default Light', mode: 'light', baseTheme: 'default' },

        // Sakura
        { id: 'sakura_dark', name: 'Sakura Dark', mode: 'dark', baseTheme: 'sakura' },
        { id: 'sakura_light', name: 'Sakura Light', mode: 'light', baseTheme: 'sakura' },

        // Void
        { id: 'void_dark', name: 'Void Dark', mode: 'dark', baseTheme: 'void' },
        { id: 'void_light', name: 'Void Light', mode: 'light', baseTheme: 'void' },

        // Hiver
        { id: 'hiver_dark', name: 'Hiver Dark', mode: 'dark', baseTheme: 'hiver' },
        { id: 'hiver_light', name: 'Hiver Light', mode: 'light', baseTheme: 'hiver' },

        // Empire
        { id: 'empire_dark', name: 'Empire Dark', mode: 'dark', baseTheme: 'empire' },
        { id: 'empire_light', name: 'Empire Light', mode: 'light', baseTheme: 'empire' },

        // Cyber
        { id: 'cyber_dark', name: 'Cyber Dark', mode: 'dark', baseTheme: 'cyber' },
        { id: 'cyber_light', name: 'Cyber Light', mode: 'light', baseTheme: 'cyber' },

        // Lotus
        { id: 'lotus_dark', name: 'Lotus Dark', mode: 'dark', baseTheme: 'lotus' },
        { id: 'lotus_light', name: 'Lotus Light', mode: 'light', baseTheme: 'lotus' },

        // Abyssal
        { id: 'abyssal_dark', name: 'Abyssal Dark', mode: 'dark', baseTheme: 'abyssal' },
        { id: 'abyssal_light', name: 'Abyssal Light', mode: 'light', baseTheme: 'abyssal' },

        // Lycoris Rouge
        { id: 'lycoris_dark', name: 'Lycoris Rouge Dark', mode: 'dark', baseTheme: 'lycoris' },
        { id: 'lycoris_light', name: 'Lycoris Rouge Light', mode: 'light', baseTheme: 'lycoris' },

        // Glacier
        { id: 'glacier_dark', name: 'Glacier Dark', mode: 'dark', baseTheme: 'glacier' },
        { id: 'glacier_light', name: 'Glacier Light', mode: 'light', baseTheme: 'glacier' },

        // Galaxie
        { id: 'galaxie_dark', name: 'Galaxie Dark', mode: 'dark', baseTheme: 'galaxie' },
        { id: 'galaxie_light', name: 'Galaxie Light', mode: 'light', baseTheme: 'galaxie' },

        // Samurai
        { id: 'samurai_dark', name: 'Samurai Dark', mode: 'dark', baseTheme: 'samurai' },
        { id: 'samurai_light', name: 'Samurai Light', mode: 'light', baseTheme: 'samurai' },

        // Phénix
        { id: 'phenix_dark', name: 'Phénix Dark', mode: 'dark', baseTheme: 'phenix' },
        { id: 'phenix_light', name: 'Phénix Light', mode: 'light', baseTheme: 'phenix' },

        // Aurora
        { id: 'aurora_dark', name: 'Aurora Dark', mode: 'dark', baseTheme: 'aurora' },
        { id: 'aurora_light', name: 'Aurora Light', mode: 'light', baseTheme: 'aurora' },

        // Zenith
        { id: 'zenith_dark', name: 'Zenith Dark', mode: 'dark', baseTheme: 'zenith' },
        { id: 'zenith_light', name: 'Zenith Light', mode: 'light', baseTheme: 'zenith' },

        // Hori (Horimiya)
        { id: 'hori_dark', name: 'Hori Dark', mode: 'dark', baseTheme: 'hori' },
        { id: 'hori_light', name: 'Hori Light', mode: 'light', baseTheme: 'hori' },

        // Minuit
        { id: 'minuit_dark', name: 'Minuit Dark', mode: 'dark', baseTheme: 'minuit' },
        { id: 'minuit_light', name: 'Minuit Light', mode: 'light', baseTheme: 'minuit' },

        // Ranni
        { id: 'ranni_dark', name: 'Ranni Dark', mode: 'dark', baseTheme: 'ranni' },
        { id: 'ranni_light', name: 'Ranni Light', mode: 'light', baseTheme: 'ranni' },

        // Slave Killer Fang
        { id: 'slavekillerfang_dark', name: 'Slave Killer Fang Dark', mode: 'dark', baseTheme: 'slavekillerfang' },
        { id: 'slavekillerfang_light', name: 'Slave Killer Fang Light', mode: 'light', baseTheme: 'slavekillerfang' },

        // Hinata Shoyo
        { id: 'hinata_dark', name: 'Hinata Dark', mode: 'dark', baseTheme: 'hinata' },
        { id: 'hinata_light', name: 'Hinata Light', mode: 'light', baseTheme: 'hinata' },

        // Nat (tout blanc)
        { id: 'nat_dark', name: 'Nat Dark', mode: 'dark', baseTheme: 'nat' },
        { id: 'nat_light', name: 'Nat Light', mode: 'light', baseTheme: 'nat' },

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
        
        // Sync dropdown value with saved theme
        this.updateThemeSwitchUI();
        
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
            // Update the theme mode based on the selected theme's mode
            this.currentThemeMode = theme.mode;
            
            // Save preferences
            localStorage.setItem('lunaris_theme_index', this.currentThemeIndex);
            localStorage.setItem('lunaris_theme_mode', this.currentThemeMode);
            
            // Apply theme
            this.applyTheme();
            
            // Update UI
            this.updateThemeSwitchUI();
            
            console.log('SiteManager: Theme selected:', theme.name, 'Mode:', this.currentThemeMode);
        }
    },
    
    // Apply theme to document - FIX: use document.documentElement for CSS :root.dark
    applyTheme() {
        // Remove both classes first from html element (not body)
        document.documentElement.classList.remove('light-mode', 'dark-mode', 'dark');
        
        // Add the appropriate class to html element (matches CSS :root.dark)
        // Light mode = no class (default), Dark mode = 'dark' class
        if (this.currentThemeMode === 'dark') {
            document.documentElement.classList.add('dark');
        }
        // For light mode, we don't add any class (default behavior)
        
        // Apply theme-specific colors
        this.applyThemeColors();
    },
    
    // Apply theme-specific colors
    applyThemeColors() {
        const theme = this.themes[this.currentThemeIndex];
        if (!theme) return;
        
        const root = document.documentElement;
        const baseTheme = theme.baseTheme;
        const mode = this.currentThemeMode;
        const colors = this.themeColors[baseTheme][mode];
        
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

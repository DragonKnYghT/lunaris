/**
 * Lunaris Site Manager
 * Handles language switching, theme selection, and navbar behavior across all pages
 */

const siteManager = {
    currentLanguage: 'fr',
    currentTheme: 'sakura', // thème par défaut

    // Liste des thèmes + couleurs
    themes: {
        sakura: { bg: "#f7c6d9", text: "#000" },
        ocean: { bg: "#0a3d62", text: "#fff" },
        brasier: { bg: "#8b0000", text: "#ffd700" },
        void: { bg: "#0b0b1e", text: "#b084f5" },
        foudre: { bg: "#f7d358", text: "#0a1a3c" },
        hiver: { bg: "#d0eaff", text: "#003366" },
        foret: { bg: "#0f3d2e", text: "#cce8d8" },
        ecarlate: { bg: "#4a0000", text: "#ff4d4d" },
        empire: { bg: "#ffffff", text: "#cfa300" },
        brume: { bg: "#dfe6e9", text: "#2d3436" },
        cyber: { bg: "#000000", text: "#00ffff" },
        lotus: { bg: "#6c3483", text: "#f5c6ea" },
        dragon: { bg: "#330000", text: "#ff3333" },
        eclipse: { bg: "#111111", text: "#cccccc" },
        cristal: { bg: "#b3e5fc", text: "#01579b" },
        hanami: { bg: "#ffe4ec", text: "#b8860b" },
        abyssal: { bg: "#001f2d", text: "#66a3b8" },
        neon: { bg: "#8e2de2", text: "#ff00ff" }
    },

    async init() {
        console.log("SiteManager: Initializing...");

        this.loadPreferences();
        this.applyTheme();
        await this.initLanguage();
        this.setupEventListeners();
        this.setupNavbarBehavior();

        console.log("SiteManager: Initialization complete");
    },

    loadPreferences() {
        const savedLang = localStorage.getItem('lunaris_language');
        if (savedLang) this.currentLanguage = savedLang;

        const savedTheme = localStorage.getItem('lunaris_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
    },

    async initLanguage() {
        if (typeof translationManager !== 'undefined') {
            await translationManager.init();
            translationManager.setLanguage(this.currentLanguage);
        }
        this.updateLanguageSwitchUI();
    },

    setupEventListeners() {
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.toggleLanguage());
        }

        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', () => {
                this.currentTheme = themeSelect.value;
                localStorage.setItem('lunaris_theme', this.currentTheme);
                this.applyTheme();
            });
        }
    },

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        localStorage.setItem('lunaris_language', this.currentLanguage);

        if (typeof translationManager !== 'undefined') {
            translationManager.setLanguage(this.currentLanguage);
        }

        this.updateLanguageSwitchUI();
    },

    applyTheme() {
        const theme = this.themes[this.currentTheme];
        if (!theme) return;

        const root = document.documentElement;

        root.style.setProperty('--theme-bg', theme.bg);
        root.style.setProperty('--theme-text', theme.text);

        // Appliquer la couleur au select
        const select = document.getElementById('theme-select');
        if (select) {
            select.style.backgroundColor = theme.bg;
            select.style.color = theme.text;
        }

        console.log("SiteManager: Theme applied:", this.currentTheme);
    },

    updateLanguageSwitchUI() {
        const langSwitch = document.getElementById('languageSwitch');
        if (!langSwitch) return;

        const langEn = langSwitch.querySelector('.lang-en');
        const langFr = langSwitch.querySelector('.lang-fr');

        if (langEn) langEn.classList.toggle('active', this.currentLanguage === 'en');
        if (langFr) langFr.classList.toggle('active', this.currentLanguage === 'fr');
    },

    setupNavbarBehavior() {
        const isPlayPage =
            window.location.href.includes('play.html') ||
            document.querySelector('#game-container');

        if (isPlayPage) {
            this.setupGameStartDetection();
        }
    },

    setupGameStartDetection() {
        const checkGameStart = setInterval(() => {
            const screenContainer = document.getElementById('screen-container');
            if (screenContainer && screenContainer.children.length > 0) {
                this.hideNavbar();
                clearInterval(checkGameStart);
            }
        }, 500);

        window.addEventListener('gameStart', () => this.hideNavbar());

        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('game-loading');
                if (loading && loading.classList.contains('hidden')) {
                    this.hideNavbar();
                }
            }, 2000);
        });
    },

    hideNavbar() {
        document.body.classList.add('game-active');
    },

    showNavbar() {
        document.body.classList.remove('game-active');
    }
};

window.siteManager = siteManager;
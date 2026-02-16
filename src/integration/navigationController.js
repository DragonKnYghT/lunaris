/**
 * navigationController.js
 * Navigation controller for menu transitions
 */

// Import Router
const { Router } = require('./router.js');

// LUNARIS_TODO: add transitions and animations later

/**
 * NavigationController class
 * Manages navigation between menus and game screens
 */
class NavigationController {
    constructor(router, uiManager) {
        this.router = router || new Router();
        this.uiManager = uiManager;
        
        // Register default routes
        this.registerDefaultRoutes();
        
        console.log('[NavigationController] Initialized');
    }

    /**
     * Set the UI manager
     * @param {Object} uiManager - UI Manager instance
     */
    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    /**
     * Register default navigation routes
     */
    registerDefaultRoutes() {
        this.router.registerRoute('mainMenu', () => this.goToMainMenu());
        this.router.registerRoute('playMenu', () => this.goToPlayMenu());
        this.router.registerRoute('run', (params) => this.goToRun(params));
        this.router.registerRoute('battle', (params) => this.goToBattle(params));
        this.router.registerRoute('versus', () => this.goToVersus());
        this.router.registerRoute('gacha', () => this.goToGacha());
        this.router.registerRoute('settings', () => this.goToSettings());
    }

    /**
     * Navigate to the main menu
     */
    goToMainMenu() {
        console.log('[NavigationController] Going to Main Menu');
        
        if (this.uiManager) {
            // Use UI Manager if available
            // this.uiManager.showScreen(new MainMenuComponent());
        } else if (typeof showMainMenu === 'function') {
            showMainMenu();
        }
        
        this.router.navigateTo('mainMenu');
    }

    /**
     * Navigate to the play menu
     */
    goToPlayMenu() {
        console.log('[NavigationController] Going to Play Menu');
        
        if (this.uiManager) {
            // Use UI Manager if available
        } else if (typeof showPlayMenu === 'function') {
            showPlayMenu();
        }
        
        this.router.navigateTo('playMenu');
    }

    /**
     * Navigate to a new run
     * @param {Object} params - Run parameters
     */
    goToRun(params = {}) {
        console.log('[NavigationController] Going to Run', params);
        
        // Initialize run with parameters
        const mode = params.mode || 'roguelike';
        
        this.router.navigateTo('run', params);
    }

    /**
     * Navigate to a battle
     * @param {Object} params - Battle parameters
     */
    goToBattle(params = {}) {
        console.log('[NavigationController] Going to Battle', params);
        
        // Initialize battle with parameters
        const encounter = params.encounter || null;
        
        this.router.navigateTo('battle', params);
    }

    /**
     * Navigate to versus mode
     */
    goToVersus() {
        console.log('[NavigationController] Going to Versus');
        
        if (this.uiManager) {
            // Use UI Manager if available
        } else if (typeof showVersusMenu === 'function') {
            // showVersusMenu();
        }
        
        this.router.navigateTo('versus');
    }

    /**
     * Navigate to gacha
     */
    goToGacha() {
        console.log('[NavigationController] Going to Gacha');
        
        if (this.uiManager) {
            // Use UI Manager if available
        } else if (typeof showGachaMenu === 'function') {
            // showGachaMenu();
        }
        
        this.router.navigateTo('gacha');
    }

    /**
     * Navigate to settings
     */
    goToSettings() {
        console.log('[NavigationController] Going to Settings');
        
        if (this.uiManager) {
            // Use UI Manager if available
            // this.uiManager.showScreen(new SettingsComponent());
        } else if (typeof showSettingsMenu === 'function') {
            showSettingsMenu();
        }
        
        this.router.navigateTo('settings');
    }

    /**
     * Navigate to a specific route
     * @param {string} routeName - Route name
     * @param {Object} params - Route parameters
     */
    navigate(routeName, params = {}) {
        this.router.navigateTo(routeName, params);
    }

    /**
     * Get the current route
     * @returns {string|null} Current route name
     */
    getCurrentRoute() {
        return this.router.getCurrentRoute();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationController };
}

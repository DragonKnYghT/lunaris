/**
 * gameController.js
 * Main game controller that initializes all systems
 */

// Import other controllers
const { Router } = require('./router.js');
const { NavigationController } = require('./navigationController.js');

// LUNARIS_TODO: add splash screen and loading bar later

/**
 * GameController class
 * Main controller that initializes and manages the game
 */
class GameController {
    constructor(data = null) {
        this.data = data;
        this.router = null;
        this.navigationController = null;
        this.uiManager = null;
        this.isInitialized = false;
        
        console.log('[GameController] Created');
    }

    /**
     * Initialize the game
     * LUNARIS_TODO: add splash screen and loading bar later
     */
    async initializeGame() {
        console.log('[GameController] Initializing game...');
        
        // Initialize Router
        this.router = new Router();
        
        // Initialize Navigation Controller
        this.navigationController = new NavigationController(this.router, this.uiManager);
        
        // Initialize UI Manager if available
        if (typeof UIManager !== 'undefined') {
            this.uiManager = new UIManager();
            this.uiManager.init();
            this.navigationController.setUIManager(this.uiManager);
        }
        
        this.isInitialized = true;
        console.log('[GameController] Game initialized');
    }

    /**
     * Load game data from JSON files
     * @returns {Promise<Object>} Loaded game data
     */
    async loadData() {
        console.log('[GameController] Loading game data...');
        
        try {
            const [creatures, moves, items, zones, modes, gacha, tickets] = await Promise.all([
                fetch("data/creatures.json").then(r => r.json()),
                fetch("data/moves.json").then(r => r.json()),
                fetch("data/items.json").then(r => r.json()),
                fetch("data/zones.json").then(r => r.json()),
                fetch("data/modes.json").then(r => r.json()),
                fetch("data/gacha.json").then(r => r.json()),
                fetch("data/tickets.json").then(r => r.json())
            ]);
            
            this.data = {
                creatures,
                moves,
                items,
                zones,
                modes,
                gacha,
                tickets
            };
            
            console.log('[GameController] Game data loaded successfully');
            return this.data;
            
        } catch (error) {
            console.error('[GameController] Failed to load game data:', error);
            
            // Return empty data structure on failure
            this.data = {
                creatures: {},
                moves: {},
                items: {},
                zones: {},
                modes: {},
                gacha: {},
                tickets: {}
            };
            
            return this.data;
        }
    }

    /**
     * Start the game
     */
    async start() {
        console.log('[GameController] Starting game...');
        
        // Load data first
        await this.loadData();
        
        // Initialize game systems
        await this.initializeGame();
        
        // Navigate to main menu
        if (this.navigationController) {
            this.navigationController.goToMainMenu();
        }
        
        console.log('[GameController] Game started successfully');
    }

    /**
     * Get the game data
     * @returns {Object} Game data
     */
    getData() {
        return this.data;
    }

    /**
     * Get the router
     * @returns {Router} Router instance
     */
    getRouter() {
        return this.router;
    }

    /**
     * Get the navigation controller
     * @returns {NavigationController} Navigation controller instance
     */
    getNavigationController() {
        return this.navigationController;
    }

    /**
     * Get the UI manager
     * @returns {Object} UI manager instance
     */
    getUIManager() {
        return this.uiManager;
    }

    /**
     * Check if game is initialized
     * @returns {boolean} True if initialized
     */
    getIsInitialized() {
        return this.isInitialized;
    }

    /**
     * Pause the game
     */
    pause() {
        console.log('[GameController] Game paused');
    }

    /**
     * Resume the game
     */
    resume() {
        console.log('[GameController] Game resumed');
    }

    /**
     * Quit the game
     */
    quit() {
        console.log('[GameController] Quitting game...');
        // Cleanup and save if needed
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameController };
}

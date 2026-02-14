/**
 * Lunaris - A modular creature-battling roguelike game
 * Main entry point
 */

// LUNARIS_TODO: Game initialization logic will go here
// LUNARIS_TODO: Add game state management
// LUNARIS_TODO: Add game loop
// LUNARIS_TODO: Add scene management

// Screen Manager Functions

/**
 * Shows the main menu screen
 */
function showMainMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="main-menu-screen">
            <h2>Main Menu</h2>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showPlayMenu()">Play</button>
                <button class="menu-button" onclick="showSettingsMenu()">Settings</button>
                <button class="menu-button" onclick="showCreditsMenu()">Credits</button>
            </div>
        </div>
    `;
    console.log('Main menu displayed');
}

/**
 * Shows the play menu screen
 * LUNARIS_TODO: add game mode selection here
 */
function showPlayMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="play-menu-screen">
            <h2>Play</h2>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="startNewRun()">New Run</button>
                <button class="menu-button" onclick="showMainMenu()">Back</button>
            </div>
            <p>Select a game mode to begin your adventure!</p>
            <!-- LUNARIS_TODO: add game mode selection here -->
        </div>
    `;
    console.log('Play menu displayed');
}

/**
 * Shows the settings menu screen
 * LUNARIS_TODO: expand settings options
 */
function showSettingsMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="settings-menu-screen">
            <h2>Settings</h2>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="toggleSound()">Sound: ON</button>
                <button class="menu-button" onclick="toggleFullscreen()">Fullscreen</button>
                <button class="menu-button" onclick="showMainMenu()">Back</button>
            </div>
            <!-- LUNARIS_TODO: expand settings options -->
        </div>
    `;
    console.log('Settings menu displayed');
}

/**
 * Shows the credits screen
 */
function showCreditsMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="credits-screen">
            <h2>Credits</h2>
            <p>Lunaris - A modular creature-battling roguelike game</p>
            <p>Version 0.1.0</p>
            <p>Created with passion for gaming!</p>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
    console.log('Credits screen displayed');
}

// Placeholder functions for menu actions

/**
 * Starts a new game run
 * LUNARIS_TODO: implement new run logic
 */
function startNewRun() {
    console.log('Starting new run...');
    // LUNARIS_TODO: implement new run logic
    alert('New Run - Coming soon!');
}

/**
 * Toggles sound setting
 * LUNARIS_TODO: implement sound toggle
 */
function toggleSound() {
    console.log('Sound toggle clicked');
    // LUNARIS_TODO: implement sound toggle
    showSettingsMenu();
}

/**
 * Toggles fullscreen mode
 * LUNARIS_TODO: implement fullscreen toggle
 */
function toggleFullscreen() {
    console.log('Fullscreen toggle clicked');
    // LUNARIS_TODO: implement fullscreen toggle
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Initialize navigation when DOM is ready
function initNavigation() {
    // Set up button event listeners
    const playBtn = document.getElementById('btn-play');
    const settingsBtn = document.getElementById('btn-settings');
    const creditsBtn = document.getElementById('btn-credits');
    
    if (playBtn) {
        playBtn.addEventListener('click', showPlayMenu);
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsMenu);
    }
    
    if (creditsBtn) {
        creditsBtn.addEventListener('click', showCreditsMenu);
    }
}

/**
 * Main initialization function for Lunaris
 * This is called when the page loads
 */
function init() {
    console.log('Lunaris is initializing...');
    
    // Initialize navigation
    initNavigation();
    
    // Show main menu by default
    showMainMenu();
    
    // LUNARIS_TODO: Initialize game state
    // LUNARIS_TODO: Load game data (creatures, moves, items, etc.)
    // LUNARIS_TODO: Initialize game systems (combat, inventory, etc.)
    
    // Update loading message
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = 'Lunaris is ready!';
    }
    
    console.log('Lunaris initialized successfully!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        init, 
        showMainMenu, 
        showPlayMenu, 
        showSettingsMenu, 
        showCreditsMenu 
    };
}

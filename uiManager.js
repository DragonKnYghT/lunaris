/**
 * uiManager.js
 * UI Manager for the game
 */

// Import UI components
const { UIComponent } = require('./uiComponent.js');
const { Button } = require('./button.js');
const { Modal } = require('./modal.js');
const { ListView } = require('./listView.js');
const { ScreenTransition } = require('./screenTransition.js');
const { ThemeManager } = require('./themeManager.js');

// LUNARIS_TODO: integrate with routing system later

/**
 * UIManager class
 * Manages the game's UI system
 */
class UIManager {
    constructor() {
        this.container = null;
        this.currentScreen = null;
        this.currentModal = null;
        this.transition = new ScreenTransition();
        this.themeManager = new ThemeManager();
        this.componentStack = [];
        
        console.log('[UIManager] Initialized');
    }

    /**
     * Initialize the UI manager
     * @param {string} containerId - ID of the container element
     */
    init(containerId = 'screen-container') {
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('[UIManager] Container not found:', containerId);
            return;
        }
        
        // Apply default theme
        this.themeManager.applyTheme();
        
        console.log('[UIManager] Initialized with container:', containerId);
    }

    /**
     * Show a screen/component
     * @param {UIComponent} component - Component to show
     * @param {boolean} useTransition - Whether to use transition
     */
    showScreen(component, useTransition = true) {
        if (!this.container) {
            console.error('[UIManager] Container not initialized');
            return;
        }

        const previousScreen = this.currentScreen;
        
        if (useTransition && previousScreen && this.transition) {
            // Transition out previous screen
            this.transition.fadeOut(previousScreen.getElement()).then(() => {
                // Remove previous screen
                if (previousScreen.unmount) {
                    previousScreen.unmount();
                }
                this.container.innerHTML = '';
                
                // Mount and transition in new screen
                component.mount(this.container);
                this.currentScreen = component;
                this.transition.fadeIn(component.getElement());
            });
        } else {
            // Direct swap
            if (previousScreen && previousScreen.unmount) {
                previousScreen.unmount();
            }
            
            this.container.innerHTML = '';
            component.mount(this.container);
            this.currentScreen = component;
        }
        
        console.log('[UIManager] Screen shown:', component.constructor.name);
    }

    /**
     * Clear the current screen
     */
    clearScreen() {
        if (this.currentScreen) {
            if (this.currentScreen.unmount) {
                this.currentScreen.unmount();
            }
            this.currentScreen = null;
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('[UIManager] Screen cleared');
    }

    /**
     * Show a modal
     * @param {Modal} modal - Modal to show
     */
    showModal(modal) {
        if (this.currentModal) {
            this.closeModal();
        }
        
        // Render modal to container or body
        const parent = this.container || document.body;
        modal.mount(parent);
        modal.open();
        this.currentModal = modal;
        
        console.log('[UIManager] Modal shown:', modal.title);
    }

    /**
     * Close the current modal
     */
    closeModal() {
        if (this.currentModal) {
            this.currentModal.close();
            if (this.currentModal.unmount) {
                this.currentModal.unmount();
            }
            this.currentModal = null;
            console.log('[UIManager] Modal closed');
        }
    }

    /**
     * Get the current screen component
     * @returns {UIComponent|null} Current screen
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Get the theme manager
     * @returns {ThemeManager} Theme manager instance
     */
    getThemeManager() {
        return this.themeManager;
    }

    /**
     * Get the screen transition
     * @returns {ScreenTransition} Screen transition instance
     */
    getTransition() {
        return this.transition;
    }

    /**
     * Create and show a button
     * @param {string} label - Button label
     * @param {Function} onClick - Click handler
     * @returns {Button} Created button
     */
    createButton(label, onClick) {
        return new Button(label, onClick);
    }

    /**
     * Create and show a modal
     * @param {string} title - Modal title
     * @param {string} content - Modal content
     * @returns {Modal} Created modal
     */
    createModal(title, content) {
        return new Modal(title, content);
    }

    /**
     * Create and show a list view
     * @param {Array} items - List items
     * @param {Object} props - Additional properties
     * @returns {ListView} Created list view
     */
    createListView(items, props = {}) {
        return new ListView(items, props);
    }

    /**
     * Push component to stack
     * @param {UIComponent} component - Component to push
     */
    pushComponent(component) {
        this.componentStack.push(component);
    }

    /**
     * Pop component from stack
     * @returns {UIComponent|null} Popped component
     */
    popComponent() {
        return this.componentStack.pop() || null;
    }

    /**
     * Get component stack
     * @returns {Array} Component stack
     */
    getComponentStack() {
        return [...this.componentStack];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager };
}

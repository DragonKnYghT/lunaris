/**
 * button.js
 * Button component for the game UI
 */

// Import UIComponent
const { UIComponent } = require('./uiComponent.js');

// LUNARIS_TODO: add hover/active animations later

/**
 * Button class
 * A clickable button component extending UIComponent
 */
class Button extends UIComponent {
    /**
     * Create a new button
     * @param {string} label - Button text
     * @param {Function} onClick - Click handler
     * @param {Object} props - Additional properties
     */
    constructor(label, onClick, props = {}) {
        super(props);
        this.label = label || 'Button';
        this.onClick = onClick || (() => {});
        this.enabled = true;
    }

    /**
     * Render the button element
     * @returns {HTMLButtonElement} The button element
     */
    render() {
        const button = document.createElement('button');
        button.className = 'ui-button';
        button.textContent = this.label;
        button.disabled = !this.enabled;

        // Add click handler
        button.addEventListener('click', (e) => {
            if (this.enabled) {
                this.onClick(e);
            }
        });

        this.element = button;
        return button;
    }

    /**
     * Set the button enabled/disabled state
     * @param {boolean} enabled - Whether the button is enabled
     */
    setEnabled(enabled) {
        this.enabled = !!enabled;
        if (this.element) {
            this.element.disabled = !this.enabled;
        }
    }

    /**
     * Set the button label text
     * @param {string} text - New button text
     */
    setLabel(text) {
        this.label = text;
        if (this.element) {
            this.element.textContent = text;
        }
    }

    /**
     * Get the current label
     * @returns {string} Current button label
     */
    getLabel() {
        return this.label;
    }

    /**
     * Check if button is enabled
     * @returns {boolean} True if enabled
     */
    isEnabled() {
        return this.enabled;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Button };
}

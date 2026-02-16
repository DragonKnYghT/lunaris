/**
 * uiComponent.js
 * Base class for all UI components
 */

// LUNARIS_TODO: add event binding helpers later

/**
 * UIComponent class
 * Base class for all UI elements in the game
 */
class UIComponent {
    /**
     * Create a new UI component
     * @param {Object} props - Component properties
     */
    constructor(props = {}) {
        this.props = props;
        this.element = null;
        this.children = [];
        this.isMounted = false;
    }

    /**
     * Render the component to a DOM element
     * @returns {HTMLElement} The rendered element
     */
    render() {
        // Override in subclasses
        const container = document.createElement('div');
        container.className = 'ui-component';
        container.textContent = 'UI Component';
        return container;
    }

    /**
     * Mount the component to a parent element
     * @param {HTMLElement} parent - Parent element to mount to
     */
    mount(parent) {
        if (!parent) {
            console.error('[UIComponent] Cannot mount: parent is null');
            return;
        }

        this.element = this.render();
        parent.appendChild(this.element);
        this.isMounted = true;
        console.log('[UIComponent] Mounted to', parent.tagName);
    }

    /**
     * Unmount the component from the DOM
     */
    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.isMounted = false;
        console.log('[UIComponent] Unmounted');
    }

    /**
     * Update the component
     */
    update() {
        // Override in subclasses to handle updates
        console.log('[UIComponent] Update called');
    }

    /**
     * Set component properties
     * @param {Object} props - New properties
     */
    setProps(props) {
        this.props = { ...this.props, ...props };
        this.update();
    }

    /**
     * Get the component's DOM element
     * @returns {HTMLElement|null} The DOM element
     */
    getElement() {
        return this.element;
    }

    /**
     * Check if component is mounted
     * @returns {boolean} True if mounted
     */
    getIsMounted() {
        return this.isMounted;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIComponent };
}

/**
 * screenTransition.js
 * Screen transition effects for the game UI
 */

// LUNARIS_TODO: add advanced transitions later

/**
 * ScreenTransition class
 * Manages screen transition effects
 */
class ScreenTransition {
    constructor() {
        this.duration = 300; // Default duration in ms
        this.easing = 'ease-in-out';
        
        console.log('[ScreenTransition] Initialized');
    }

    /**
     * Fade in an element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Transition duration in ms
     * @returns {Promise} Promise that resolves when transition completes
     */
    fadeIn(element, duration = null) {
        if (!element) {
            console.warn('[ScreenTransition] Cannot fade in: element is null');
            return Promise.resolve();
        }

        const dur = duration || this.duration;
        
        // Set initial state
        element.style.opacity = '0';
        element.style.display = '';
        element.style.transition = `opacity ${dur}ms ${this.easing}`;
        
        // Trigger reflow
        element.offsetHeight;
        
        // Set final state
        element.style.opacity = '1';
        
        console.log('[ScreenTransition] Fade in:', dur, 'ms');
        
        return new Promise(resolve => {
            setTimeout(resolve, dur);
        });
    }

    /**
     * Fade out an element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Transition duration in ms
     * @returns {Promise} Promise that resolves when transition completes
     */
    fadeOut(element, duration = null) {
        if (!element) {
            console.warn('[ScreenTransition] Cannot fade out: element is null');
            return Promise.resolve();
        }

        const dur = duration || this.duration;
        
        // Set initial state
        element.style.opacity = '1';
        element.style.transition = `opacity ${dur}ms ${this.easing}`;
        
        // Trigger reflow
        element.offsetHeight;
        
        // Set final state
        element.style.opacity = '0';
        
        console.log('[ScreenTransition] Fade out:', dur, 'ms');
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, dur);
        });
    }

    /**
     * Slide in an element from a direction
     * @param {HTMLElement} element - Element to slide in
     * @param {string} direction - Direction: 'left', 'right', 'top', 'bottom'
     * @param {number} duration - Transition duration in ms
     * @returns {Promise} Promise that resolves when transition completes
     */
    slideIn(element, direction = 'left', duration = null) {
        if (!element) {
            console.warn('[ScreenTransition] Cannot slide in: element is null');
            return Promise.resolve();
        }

        const dur = duration || this.duration;
        
        // Set initial position based on direction
        let transform;
        switch (direction) {
            case 'left':
                transform = 'translateX(-100%)';
                break;
            case 'right':
                transform = 'translateX(100%)';
                break;
            case 'top':
                transform = 'translateY(-100%)';
                break;
            case 'bottom':
                transform = 'translateY(100%)';
                break;
            default:
                transform = 'translateX(-100%)';
        }
        
        element.style.transform = transform;
        element.style.display = '';
        element.style.transition = `transform ${dur}ms ${this.easing}`;
        
        // Trigger reflow
        element.offsetHeight;
        
        // Reset transform
        element.style.transform = 'translate(0, 0)';
        
        console.log('[ScreenTransition] Slide in from:', direction, dur, 'ms');
        
        return new Promise(resolve => {
            setTimeout(resolve, dur);
        });
    }

    /**
     * Slide out an element to a direction
     * @param {HTMLElement} element - Element to slide out
     * @param {string} direction - Direction: 'left', 'right', 'top', 'bottom'
     * @param {number} duration - Transition duration in ms
     * @returns {Promise} Promise that resolves when transition completes
     */
    slideOut(element, direction = 'right', duration = null) {
        if (!element) {
            console.warn('[ScreenTransition] Cannot slide out: element is null');
            return Promise.resolve();
        }

        const dur = duration || this.duration;
        
        // Set target position based on direction
        let transform;
        switch (direction) {
            case 'left':
                transform = 'translateX(-100%)';
                break;
            case 'right':
                transform = 'translateX(100%)';
                break;
            case 'top':
                transform = 'translateY(-100%)';
                break;
            case 'bottom':
                transform = 'translateY(100%)';
                break;
            default:
                transform = 'translateX(100%)';
        }
        
        element.style.transition = `transform ${dur}ms ${this.easing}`;
        
        // Trigger reflow
        element.offsetHeight;
        
        // Apply transform
        element.style.transform = transform;
        
        console.log('[ScreenTransition] Slide out to:', direction, dur, 'ms');
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                element.style.transform = '';
                resolve();
            }, dur);
        });
    }

    /**
     * Set the default transition duration
     * @param {number} duration - Duration in ms
     */
    setDuration(duration) {
        this.duration = Math.max(0, duration);
        console.log('[ScreenTransition] Duration set to:', this.duration);
    }

    /**
     * Set the easing function
     * @param {string} easing - CSS transition timing function
     */
    setEasing(easing) {
        this.easing = easing;
        console.log('[ScreenTransition] Easing set to:', this.easing);
    }

    /**
     * Perform a cross-fade between two elements
     * @param {HTMLElement} outElement - Element to fade out
     * @param {HTMLElement} inElement - Element to fade in
     * @param {number} duration - Transition duration in ms
     * @returns {Promise} Promise that resolves when transition completes
     */
    crossFade(outElement, inElement, duration = null) {
        console.log('[ScreenTransition] Cross fade');
        
        // Fade out old element
        const fadeOutPromise = outElement ? this.fadeOut(outElement, duration) : Promise.resolve();
        
        // Fade in new element
        const fadeInPromise = inElement ? this.fadeIn(inElement, duration) : Promise.resolve();
        
        return Promise.all([fadeOutPromise, fadeInPromise]);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScreenTransition };
}

/**
 * router.js
 * Central routing system for navigation
 */

// LUNARIS_TODO: add URL hash routing later

/**
 * Router class
 * Central navigation system
 */
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentParams = {};
        
        console.log('[Router] Initialized');
    }

    /**
     * Register a route with a callback
     * @param {string} name - Route name
     * @param {Function} callback - Route handler function
     */
    registerRoute(name, callback) {
        this.routes.set(name, callback);
        console.log('[Router] Route registered:', name);
    }

    /**
     * Navigate to a route
     * @param {string} name - Route name
     * @param {Object} params - Route parameters
     */
    navigateTo(name, params = {}) {
        const route = this.routes.get(name);
        
        if (!route) {
            console.warn('[Router] Route not found:', name);
            return;
        }
        
        const previousRoute = this.currentRoute;
        this.currentRoute = name;
        this.currentParams = params;
        
        console.log('[Router] Navigating to:', name, params);
        
        try {
            route(params, previousRoute);
        } catch (error) {
            console.error('[Router] Error navigating to route:', name, error);
        }
    }

    /**
     * Get the current route name
     * @returns {string|null} Current route name
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Get the current route parameters
     * @returns {Object} Current parameters
     */
    getCurrentParams() {
        return { ...this.currentParams };
    }

    /**
     * Check if a route exists
     * @param {string} name - Route name
     * @returns {boolean} True if route exists
     */
    hasRoute(name) {
        return this.routes.has(name);
    }

    /**
     * Get all registered routes
     * @returns {Array} Array of route names
     */
    getRoutes() {
        return Array.from(this.routes.keys());
    }

    /**
     * Clear all routes
     */
    clearRoutes() {
        this.routes.clear();
        console.log('[Router] All routes cleared');
    }

    /**
     * Go back to previous route
     */
    goBack() {
        // Implementation depends on history management
        console.log('[Router] goBack called');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Router };
}

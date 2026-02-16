/**
 * currencyManager.js
 * Manages currency in Lunaris
 */

// LUNARIS_TODO: add premium currency or gacha currency later

/**
 * CurrencyManager class
 * Handles currency operations
 */
class CurrencyManager {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.currencies = {
            standard: options.initialStandard || 1000,
            gacha: options.initialGacha || 0
        };
        
        // Track transaction history
        this.transactionHistory = [];
    }

    /**
     * Add currency
     * @param {string} type - Currency type
     * @param {number} amount - Amount to add
     * @returns {Object} Result
     */
    addCurrency(type, amount) {
        if (!this.currencies[type]) {
            this.currencies[type] = 0;
        }
        
        this.currencies[type] += amount;
        
        this.recordTransaction('add', type, amount);
        
        console.log(`[CurrencyManager] Added ${amount} ${type} currency`);
        
        return {
            success: true,
            type: type,
            amount: amount,
            newBalance: this.currencies[type]
        };
    }

    /**
     * Remove currency
     * @param {string} type - Currency type
     * @param {number} amount - Amount to remove
     * @returns {Object} Result
     */
    removeCurrency(type, amount) {
        if (!this.currencies[type] || this.currencies[type] < amount) {
            return {
                success: false,
                message: `Not enough ${type} currency!`
            };
        }
        
        this.currencies[type] -= amount;
        
        this.recordTransaction('remove', type, amount);
        
        console.log(`[CurrencyManager] Removed ${amount} ${type} currency`);
        
        return {
            success: true,
            type: type,
            amount: amount,
            newBalance: this.currencies[type]
        };
    }

    /**
     * Get balance for a currency type
     * @param {string} type - Currency type
     * @returns {number} Balance
     */
    getBalance(type = 'standard') {
        return this.currencies[type] || 0;
    }

    /**
     * Get all balances
     * @returns {Object} All balances
     */
    getAllBalances() {
        return { ...this.currencies };
    }

    /**
     * Check if can afford amount
     * @param {string} type - Currency type
     * @param {number} amount - Amount to check
     * @returns {boolean}
     */
    canAfford(type, amount) {
        return this.currencies[type] >= amount;
    }

    /**
     * Record a transaction
     * @param {string} action - Action (add/remove)
     * @param {string} type - Currency type
     * @param {number} amount - Amount
     */
    recordTransaction(action, type, amount) {
        this.transactionHistory.push({
            action: action,
            type: type,
            amount: amount,
            timestamp: Date.now()
        });
        
        // Keep only last 100 transactions
        if (this.transactionHistory.length > 100) {
            this.transactionHistory = this.transactionHistory.slice(-100);
        }
    }

    /**
     * Get transaction history
     * @param {number} limit - Max number of transactions
     * @returns {Array} Transaction history
     */
    getTransactionHistory(limit = 10) {
        return this.transactionHistory.slice(-limit);
    }

    /**
     * Reset currency (for new game)
     * @param {Object} options - Initial amounts
     */
    reset(options = {}) {
        this.currencies = {
            standard: options.initialStandard || 1000,
            gacha: options.initialGacha || 0
        };
        this.transactionHistory = [];
        console.log('[CurrencyManager] Currency reset');
    }

    /**
     * Set currency directly (for cheats or testing)
     * @param {string} type - Currency type
     * @param {number} amount - Amount to set
     */
    setCurrency(type, amount) {
        this.currencies[type] = amount;
        console.log(`[CurrencyManager] Set ${type} currency to ${amount}`);
    }

    /**
     * Add standard currency (convenience method)
     * @param {number} amount - Amount
     * @returns {Object} Result
     */
    addStandard(amount) {
        return this.addCurrency('standard', amount);
    }

    /**
     * Remove standard currency (convenience method)
     * @param {number} amount - Amount
     * @returns {Object} Result
     */
    removeStandard(amount) {
        return this.removeCurrency('standard', amount);
    }

    /**
     * Get standard balance (convenience method)
     * @returns {number} Balance
     */
    getStandardBalance() {
        return this.getBalance('standard');
    }

    /**
     * Add gacha currency (convenience method)
     * @param {number} amount - Amount
     * @returns {Object} Result
     */
    addGacha(amount) {
        return this.addCurrency('gacha', amount);
    }

    /**
     * Remove gacha currency (convenience method)
     * @param {number} amount - Amount
     * @returns {Object} Result
     */
    removeGacha(amount) {
        return this.removeCurrency('gacha', amount);
    }

    /**
     * Get gacha balance (convenience method)
     * @returns {number} Balance
     */
    getGachaBalance() {
        return this.getBalance('gacha');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurrencyManager };
}

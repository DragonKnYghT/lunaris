/**
 * accountManager.js
 * Manages game accounts and account-linked resources
 */

/**
 * AccountManager class
 * Handles multiple accounts and account-specific resources
 */
class AccountManager {
    constructor() {
        this.storageKey = 'lunaris_accounts_';
        this.currentAccountKey = 'lunaris_current_account';
        this.currentAccount = null;
        this.accounts = {};
        
        this.loadAllAccounts();
        this.loadCurrentAccount();
        
        console.log('[AccountManager] Initialized');
    }

    /**
     * Load all accounts from storage
     */
    loadAllAccounts() {
        try {
            const accountsJson = localStorage.getItem(this.storageKey + 'list');
            if (accountsJson) {
                const accountIds = JSON.parse(accountsJson);
                accountIds.forEach(accountId => {
                    const accountData = localStorage.getItem(this.storageKey + accountId);
                    if (accountData) {
                        this.accounts[accountId] = JSON.parse(accountData);
                    }
                });
                console.log('[AccountManager] Loaded', Object.keys(this.accounts).length, 'accounts');
            }
        } catch (e) {
            console.warn('[AccountManager] Failed to load accounts', e);
            this.accounts = {};
        }
    }

    /**
     * Save all accounts to storage
     */
    saveAllAccounts() {
        try {
            const accountIds = Object.keys(this.accounts);
            localStorage.setItem(this.storageKey + 'list', JSON.stringify(accountIds));
            
            accountIds.forEach(accountId => {
                localStorage.setItem(
                    this.storageKey + accountId,
                    JSON.stringify(this.accounts[accountId])
                );
            });
            console.log('[AccountManager] Saved', accountIds.length, 'accounts');
        } catch (e) {
            console.warn('[AccountManager] Failed to save accounts', e);
        }
    }

    /**
     * Load current active account
     */
    loadCurrentAccount() {
        try {
            const currentAccountId = localStorage.getItem(this.currentAccountKey);
            if (currentAccountId && this.accounts[currentAccountId]) {
                this.currentAccount = this.accounts[currentAccountId];
                console.log('[AccountManager] Loaded current account:', this.currentAccount.username);
            }
        } catch (e) {
            console.warn('[AccountManager] Failed to load current account', e);
        }
    }

    /**
     * Get the current active account
     * @returns {Object|null} Current account
     */
    getCurrentAccount() {
        return this.currentAccount;
    }

    /**
     * Get the current account ID
     * @returns {string|null} Current account ID
     */
    getCurrentAccountId() {
        if (!this.currentAccount) return null;
        return Object.keys(this.accounts).find(
            id => this.accounts[id] === this.currentAccount
        );
    }

    /**
     * Check if an account exists with the given username
     * @param {string} username - Username
     * @returns {boolean} Whether account exists
     */
    accountExists(username) {
        return Object.values(this.accounts).some(acc => acc.username === username);
    }

    /**
     * Create a new account
     * @param {string} username - Account username
     * @param {string} password - Account password (hashed)
     * @returns {Object} Result object
     */
    createAccount(username, password) {
        if (this.accountExists(username)) {
            return {
                success: false,
                message: 'Account already exists'
            };
        }

        const accountId = 'account_' + Date.now();
        
        const newAccount = {
            id: accountId,
            username: username,
            password: password, // Should be hashed in production
            createdAt: Date.now(),
            lastLogin: Date.now(),
            profile: {
                username: username,
                avatar: null
            },
            resources: {
                gems: 0,
                discs: [],
                currency: {
                    standard: 1000,
                    gacha: 0
                }
            },
            settings: {
                language: 'en',
                theme: 'default',
                soundVolume: 100,
                musicVolume: 100
            }
        };

        this.accounts[accountId] = newAccount;
        this.saveAllAccounts();
        
        console.log('[AccountManager] Created account:', username);
        
        return {
            success: true,
            accountId: accountId,
            account: newAccount
        };
    }

    /**
     * Login to an account
     * @param {string} username - Username
     * @param {string} password - Password (hashed)
     * @returns {Object} Result object
     */
    login(username, password) {
        const accountId = Object.keys(this.accounts).find(id => {
            return this.accounts[id].username === username;
        });

        if (!accountId) {
            return {
                success: false,
                message: 'Account not found'
            };
        }

        const account = this.accounts[accountId];
        
        if (account.password !== password) {
            return {
                success: false,
                message: 'Invalid password'
            };
        }

        // Update last login
        account.lastLogin = Date.now();
        this.currentAccount = account;
        
        // Save current account ID
        localStorage.setItem(this.currentAccountKey, accountId);
        this.saveAllAccounts();
        
        console.log('[AccountManager] Logged in:', username);
        
        return {
            success: true,
            accountId: accountId,
            account: account
        };
    }

    /**
     * Switch to a different account
     * @param {string} accountId - Account ID
     * @param {string} password - Account password for verification
     * @returns {Object} Result object
     */
    switchAccount(accountId, password) {
        if (!this.accounts[accountId]) {
            return {
                success: false,
                message: 'Account not found'
            };
        }

        const account = this.accounts[accountId];
        
        if (account.password !== password) {
            return {
                success: false,
                message: 'Invalid password'
            };
        }

        this.currentAccount = account;
        localStorage.setItem(this.currentAccountKey, accountId);
        this.saveAllAccounts();
        
        console.log('[AccountManager] Switched to account:', account.username);
        
        return {
            success: true,
            accountId: accountId,
            account: account
        };
    }

    /**
     * Logout current account
     */
    logout() {
        this.currentAccount = null;
        localStorage.removeItem(this.currentAccountKey);
        console.log('[AccountManager] Logged out');
    }

    /**
     * Get list of all accounts
     * @returns {Array} Array of account info
     */
    getAccountsList() {
        return Object.entries(this.accounts).map(([id, account]) => ({
            id: id,
            username: account.username,
            lastLogin: account.lastLogin,
            createdAt: account.createdAt
        }));
    }

    /**
     * Add gems to current account
     * @param {number} amount - Amount to add
     * @returns {Object} Result
     */
    addGems(amount) {
        if (!this.currentAccount) {
            return { success: false, message: 'No account logged in' };
        }

        this.currentAccount.resources.gems += amount;
        this.saveAllAccounts();
        
        console.log('[AccountManager] Added', amount, 'gems to', this.currentAccount.username);
        
        return {
            success: true,
            gems: this.currentAccount.resources.gems
        };
    }

    /**
     * Get current gems
     * @returns {number} Current gem count
     */
    getGems() {
        if (!this.currentAccount) return 0;
        return this.currentAccount.resources.gems || 0;
    }

    /**
     * Spend gems from current account
     * @param {number} amount - Amount to spend
     * @returns {Object} Result
     */
    spendGems(amount) {
        if (!this.currentAccount) {
            return { success: false, message: 'No account logged in' };
        }

        if (this.currentAccount.resources.gems < amount) {
            return { success: false, message: 'Not enough gems' };
        }

        this.currentAccount.resources.gems -= amount;
        this.saveAllAccounts();
        
        console.log('[AccountManager] Spent', amount, 'gems from', this.currentAccount.username);
        
        return {
            success: true,
            gems: this.currentAccount.resources.gems
        };
    }

    /**
     * Add disc to current account
     * @param {Object} discData - Disc data
     * @returns {Object} Result
     */
    addDisc(discData) {
        if (!this.currentAccount) {
            return { success: false, message: 'No account logged in' };
        }

        const disc = {
            id: `${discData.bannerId || 'banner'}_${discData.creatureId || 'unknown'}_${Date.now()}`,
            rarity: discData.rarity,
            visualRarity: discData.visualRarity || discData.rarity,
            creatureId: discData.creatureId || 'unknown',
            bannerId: discData.bannerId || null,
            timestamp: Date.now()
        };

        this.currentAccount.resources.discs.push(disc);
        this.saveAllAccounts();
        
        console.log('[AccountManager] Added disc to', this.currentAccount.username);
        
        return {
            success: true,
            disc: disc,
            totalDiscs: this.currentAccount.resources.discs.length
        };
    }

    /**
     * Get current account discs
     * @returns {Array} Array of discs
     */
    getDiscs() {
        if (!this.currentAccount) return [];
        return this.currentAccount.resources.discs || [];
    }

    /**
     * Get currency for current account
     * @param {string} type - Currency type ('standard' or 'gacha')
     * @returns {number} Currency amount
     */
    getCurrency(type = 'standard') {
        if (!this.currentAccount) return 0;
        return this.currentAccount.resources.currency[type] || 0;
    }

    /**
     * Add currency to current account
     * @param {string} type - Currency type
     * @param {number} amount - Amount to add
     * @returns {Object} Result
     */
    addCurrency(type, amount) {
        if (!this.currentAccount) {
            return { success: false, message: 'No account logged in' };
        }

        if (!this.currentAccount.resources.currency[type]) {
            this.currentAccount.resources.currency[type] = 0;
        }

        this.currentAccount.resources.currency[type] += amount;
        this.saveAllAccounts();
        
        console.log('[AccountManager] Added', amount, type, 'currency to', this.currentAccount.username);
        
        return {
            success: true,
            type: type,
            amount: this.currentAccount.resources.currency[type]
        };
    }

    /**
     * Spend currency from current account
     * @param {string} type - Currency type
     * @param {number} amount - Amount to spend
     * @returns {Object} Result
     */
    spendCurrency(type, amount) {
        if (!this.currentAccount) {
            return { success: false, message: 'No account logged in' };
        }

        if (!this.currentAccount.resources.currency[type] || 
            this.currentAccount.resources.currency[type] < amount) {
            return { success: false, message: 'Not enough currency' };
        }

        this.currentAccount.resources.currency[type] -= amount;
        this.saveAllAccounts();
        
        console.log('[AccountManager] Spent', amount, type, 'currency from', this.currentAccount.username);
        
        return {
            success: true,
            type: type,
            amount: this.currentAccount.resources.currency[type]
        };
    }

    /**
     * Delete an account
     * @param {string} accountId - Account ID
     * @param {string} password - Account password for confirmation
     * @returns {Object} Result
     */
    deleteAccount(accountId, password) {
        if (!this.accounts[accountId]) {
            return { success: false, message: 'Account not found' };
        }

        const account = this.accounts[accountId];
        
        if (account.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        delete this.accounts[accountId];
        
        // If deleting current account, logout
        if (this.currentAccount && this.currentAccount.id === accountId) {
            this.logout();
        }

        this.saveAllAccounts();
        
        console.log('[AccountManager] Deleted account:', account.username);
        
        return { success: true };
    }
}

// Initialize account manager globally if not in module environment
if (typeof module === 'undefined' || !module.exports) {
    const accountManager = new AccountManager();
}

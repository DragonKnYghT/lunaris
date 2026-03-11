/**
 * accountUI.js
 * UI for account selection, creation, and login
 */

/**
 * AccountUI class
 * Manages account-related UI screens
 */
class AccountUI {
    constructor(accountManager) {
        this.accountManager = accountManager;
        this.container = null;
        
        console.log('[AccountUI] Initialized');
    }

    /**
     * Show account selection screen
     * @param {HTMLElement} container - Container element
     * @param {Function} onAccountSelected - Callback when account is selected
     */
    showAccountSelection(container, onAccountSelected) {
        this.container = container;
        
        const accounts = this.accountManager.getAccountsList();
        
        const screen = document.createElement('div');
        screen.className = 'account-selection-screen';
        screen.innerHTML = `
            <div class="account-selection-header">
                <h1>Choisir un profil</h1>
            </div>
            
            <div class="account-selection-content">
                <div class="account-list" id="account-list">
                    ${accounts.length > 0 ? accounts.map(acc => `
                        <div class="account-item" data-account-id="${acc.id}">
                            <div class="account-info">
                                <div class="account-username">${acc.username}</div>
                                <div class="account-lastlogin">
                                    Dernière connexion: ${new Date(acc.lastLogin).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                            <button class="account-select-btn" data-account-id="${acc.id}">
                                Sélectionner
                            </button>
                        </div>
                    `).join('') : `
                        <div class="no-accounts-message">
                            Aucun profil trouvé
                        </div>
                    `}
                </div>
            </div>
            
            <div class="account-selection-actions">
                <button id="create-account-btn" class="btn btn-primary">
                    Créer un nouveau profil
                </button>
            </div>
        `;
        
        container.innerHTML = '';
        container.appendChild(screen);
        
        // Attach event listeners
        document.querySelectorAll('.account-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const accountId = e.target.getAttribute('data-account-id');
                this.showLoginModal(accountId, onAccountSelected);
            });
        });
        
        document.getElementById('create-account-btn').addEventListener('click', () => {
            this.showCreateAccountScreen(container, onAccountSelected);
        });
    }

    /**
     * Show login modal
     * @param {string} accountId - Account ID
     * @param {Function} onSuccess - Success callback
     */
    showLoginModal(accountId, onSuccess) {
        const account = this.accountManager.accounts[accountId];
        
        const modal = document.createElement('div');
        modal.className = 'login-modal-overlay';
        modal.innerHTML = `
            <div class="login-modal">
                <div class="login-modal-header">
                    <h2>Connexion: ${account.username}</h2>
                </div>
                
                <div class="login-modal-content">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="password">Mot de passe</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <div id="error-message" class="error-message"></div>
                    </form>
                </div>
                
                <div class="login-modal-actions">
                    <button id="login-cancel-btn" class="btn btn-secondary">
                        Annuler
                    </button>
                    <button id="login-confirm-btn" class="btn btn-primary">
                        Connexion
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const passwordInput = document.getElementById('password');
        const cancelBtn = document.getElementById('login-cancel-btn');
        const confirmBtn = document.getElementById('login-confirm-btn');
        const errorMessage = document.getElementById('error-message');
        const form = document.getElementById('login-form');
        
        const handleLogin = () => {
            const password = simpleHash(passwordInput.value);
            const result = this.accountManager.login(account.username, password);
            
            if (result.success) {
                modal.remove();
                onSuccess(result.accountId);
            } else {
                errorMessage.textContent = result.message;
            }
        };
        
        confirmBtn.addEventListener('click', handleLogin);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        passwordInput.focus();
    }

    /**
     * Show create account screen
     * @param {HTMLElement} container - Container element
     * @param {Function} onAccountCreated - Callback when account is created
     */
    showCreateAccountScreen(container, onAccountCreated) {
        const screen = document.createElement('div');
        screen.className = 'account-creation-screen';
        screen.innerHTML = `
            <div class="account-creation-header">
                <h1>Créer un nouveau profil</h1>
            </div>
            
            <div class="account-creation-content">
                <form id="creation-form">
                    <div class="form-group">
                        <label for="username">Nom du profil</label>
                        <input type="text" id="username" name="username" required 
                               placeholder="Entrez votre nom" maxlength="20">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" id="password" name="password" required 
                               placeholder="Entrez un mot de passe">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password">Confirmer le mot de passe</label>
                        <input type="password" id="confirm-password" name="confirm-password" required 
                               placeholder="Confirmez le mot de passe">
                    </div>
                    
                    <div id="error-message" class="error-message"></div>
                </form>
            </div>
            
            <div class="account-creation-actions">
                <button id="creation-back-btn" class="btn btn-secondary">
                    Retour
                </button>
                <button id="creation-create-btn" class="btn btn-primary">
                    Créer le profil
                </button>
            </div>
        `;
        
        container.innerHTML = '';
        container.appendChild(screen);
        
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        const errorMessage = document.getElementById('error-message');
        const backBtn = document.getElementById('creation-back-btn');
        const createBtn = document.getElementById('creation-create-btn');
        
        createBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;
            
            // Validation
            if (!username) {
                errorMessage.textContent = 'Veuillez entrer un nom de profil';
                return;
            }
            
            if (!password) {
                errorMessage.textContent = 'Veuillez entrer un mot de passe';
                return;
            }
            
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Les mots de passe ne correspondent pas';
                return;
            }
            
            if (password.length < 4) {
                errorMessage.textContent = 'Le mot de passe doit faire au moins 4 caractères';
                return;
            }
            
            // Create account
            const hashedPassword = simpleHash(password);
            const result = this.accountManager.createAccount(username, hashedPassword);
            
            if (result.success) {
                // Automatically login to new account
                this.accountManager.currentAccount = result.account;
                localStorage.setItem(this.accountManager.currentAccountKey, result.accountId);
                this.accountManager.saveAllAccounts();
                
                onAccountCreated(result.accountId);
            } else {
                errorMessage.textContent = result.message;
            }
        });
        
        backBtn.addEventListener('click', () => {
            this.showAccountSelection(container, onAccountCreated);
        });
        
        usernameInput.focus();
    }

    /**
     * Show account menu (switch/logout)
     * @param {Function} onAccountSwitched - Callback
     * @param {Function} onLogout - Callback
     */
    showAccountMenu(onAccountSwitched, onLogout) {
        const accounts = this.accountManager.getAccountsList();
        const currentAccount = this.accountManager.getCurrentAccount();
        
        const modal = document.createElement('div');
        modal.className = 'account-menu-overlay';
        modal.innerHTML = `
            <div class="account-menu">
                <div class="account-menu-header">
                    <h2>Gestion des profils</h2>
                </div>
                
                <div class="account-menu-content">
                    <div class="current-account">
                        <span>Profil actuel:</span>
                        <strong>${currentAccount.username}</strong>
                    </div>
                    
                    ${accounts.length > 1 ? `
                        <div class="account-menu-section">
                            <h3>Changer de profil</h3>
                            <div class="account-list-compact">
                                ${accounts.filter(acc => acc.id !== this.accountManager.getCurrentAccountId())
                                    .map(acc => `
                                        <button class="account-menu-item" data-account-id="${acc.id}">
                                            ${acc.username}
                                        </button>
                                    `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="account-menu-actions">
                    <button id="account-menu-close-btn" class="btn btn-secondary">
                        Fermer
                    </button>
                    <button id="account-logout-btn" class="btn btn-danger">
                        Se déconnecter
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('account-menu-close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('account-logout-btn').addEventListener('click', () => {
            this.accountManager.logout();
            modal.remove();
            onLogout();
        });
        
        document.querySelectorAll('.account-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const accountId = e.target.getAttribute('data-account-id');
                this.showLoginModal(accountId, (id) => {
                    modal.remove();
                    onAccountSwitched(id);
                });
            });
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

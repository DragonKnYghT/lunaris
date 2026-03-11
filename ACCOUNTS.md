# Système de Gestion de Comptes Lunaris

## Vue d'ensemble

Le système de gestion de comptes a été implémenté pour permettre aux joueurs de créer plusieurs profils et de gérer leurs ressources (gemmes, disques) de manière liée aux comptes.

## Architecture

### Fichiers principaux

1. **`src/save/accountManager.js`** - Gestionnaire de comptes principal
   - Gère la création, connexion et gestion des comptes
   - Stockage en localStorage pour chaque compte
   - Gestion des ressources liées aux comptes (gemmes, disques, devises)

2. **`src/ui/accountUI.js`** - Interface utilisateur des comptes
   - Écran de sélection de profil
   - Écran de création de compte
   - Menu de changement de compte
   - Modal de connexion

3. **`assets/css/account-ui.css`** - Styles pour l'interface des comptes

4. **`main.js`** - Point d'entrée modifié
   - Initialisation du système de comptes
   - Affichage de l'écran de sélection au démarrage
   - Liaison des ressources au compte actif

## Fonctionnalités

### Création de Compte

- Nom d'utilisateur unique
- Mot de passe (hashé localement)
- Ressources initiales :
  - 1000 de devise standard
  - 0 gemmes
  - 0 disques
  - Paramètres par défaut (langue, thème, volume)

### Connexion et Changement de Compte

- Authentification par mot de passe
- Changement de compte depuis le menu principal
- Menu "Changement de profil" dans la barre d'information du compte
- Déconnexion

### Ressources Liées au Compte

#### Gemmes
- Propriété du compte
- Peuvent être ajoutées/dépensées via `accountManager.addGems()` / `spendGems()`
- Affichée dans le compteur de gemmes du jeu

#### Disques
- Stockés par compte
- Peuvent être ajoutés via `accountManager.addDisc(discData)`
- Consultables via `accountManager.getDiscs()`

#### Devises
- Devise standard et de gacha
- Gérées indépendamment par compte
- Accès via `accountManager.getCurrency(type)` / `addCurrency()` / `spendCurrency()`

## Utilisation

### Initialisation
```javascript
// Automatique lors du démarrage du jeu
initializeAccountSystem();
```

### Créer un compte
```javascript
const result = accountManager.createAccount('username', simpleHash(password));
if (result.success) {
    console.log('Account created:', result.accountId);
}
```

### Se connecter
```javascript
const result = accountManager.login('username', simpleHash(password));
if (result.success) {
    console.log('Logged in:', result.accountId);
}
```

### Ajouter des gemmes
```javascript
const result = accountManager.addGems(100);
console.log('New gem count:', result.gems);
```

### Ajouter un disque
```javascript
const result = accountManager.addDisc({
    rarity: 'rare',
    creatureId: 'creature_123',
    bannerId: 'banner_1'
});
```

### Obtenir les disques du compte actif
```javascript
const discs = accountManager.getDiscs();
console.log('Your discs:', discs);
```

### Afficher le menu de changement de compte
```javascript
accountUI.showAccountMenu(
    (newAccountId) => console.log('Switched to:', newAccountId),
    () => console.log('Logged out')
);
```

## Flux d'utilisation

1. **Démarrage du jeu**
   - L'écran de sélection de profil s'affiche
   - Choix entre créer un nouveau profil ou se connecter

2. **Création de profil**
   - Saisie du nom d'utilisateur
   - Saisie du mot de passe
   - Création automatique et connexion

3. **Connexion à un profil**
   - Sélection du profil dans la liste
   - Saisie du mot de passe
   - Chargement des données du compte

4. **Utilisation du jeu**
   - Les ressources affichées appartiennent au compte actif
   - Changement de compte disponible depuis le menu principal
   - Déconnexion disponible

5. **Changement de compte**
   - Clic sur "⚙ Profils" dans le coin du menu principal
   - Sélection d'un autre profil
   - Les gemmes, disques et devises changent automatiquement

## Stockage

Les données de comptes sont stockées dans `localStorage` avec les clés :
- `lunaris_accounts_list` - Liste des IDs de compte
- `lunaris_accounts_<accountId>` - Données du compte
- `lunaris_current_account` - ID du compte actuellement connecté

## Sécurité

**Note importante**: Ce système utilise un hashage local basique pour les mots de passe. Pour une application de production, implémentez :
- Hashage côté serveur (bcrypt, PBKDF2, etc.)
- Stockage sécurisé des mots de passe
- Authentification serveur complète
- Communication chiffrée (HTTPS)

## Migration depuis l'ancien système

Les anciennes données stockées dans `localStorage` sans compte sont conservées par des fonctions de fallback. Les nouvelles données s'enregistreront automatiquement sur le compte actif.

## APIs principales

### AccountManager
- `createAccount(username, password)` - Créer un compte
- `login(username, password)` - Se connecter
- `switchAccount(accountId, password)` - Changer de compte
- `logout()` - Se déconnecter
- `getCurrentAccount()` - Obtenir le compte actuel
- `getAccountsList()` - Lister tous les comptes
- `addGems(amount)` - Ajouter des gemmes
- `spendGems(amount)` - Dépenser des gemmes
- `getGems()` - Obtenir le nombre de gemmes
- `addDisc(discData)` - Ajouter un disque
- `getDiscs()` - Obtenir les disques
- `getCurrency(type)` - Obtenir une devise
- `addCurrency(type, amount)` - Ajouter une devise
- `spendCurrency(type, amount)` - Dépenser une devise
- `deleteAccount(accountId, password)` - Supprimer un compte

### AccountUI
- `showAccountSelection(container, onAccountSelected)` - Afficher sélection de compte
- `showAccountMenu(onAccountSwitched, onLogout)` - Afficher menu de changement
- `showLoginModal(accountId, onSuccess)` - Afficher modal de connexion
- `showCreateAccountScreen(container, onAccountCreated)` - Afficher création de compte

## Exemple d'intégration dans le code existant

```javascript
// Avant: Accès direct aux gems
addGems(100);

// Après: Utilise le compte actif
accountManager.addGems(100);

// Avant: Sauvegarde globale
saveGemsToStorage(playerGems);

// Après: Sauvegarde liée au compte
saveGemsToStorage(getGems()); // Utilise accountManager automatiquement
```

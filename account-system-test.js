/**
 * account-system-test.js
 * Test file for account system - Run this in the browser console
 */

// Test 1: Account creation
console.log('=== Test 1: Account Creation ===');
let result = accountManager.createAccount('TestPlayer1', simpleHash('password123'));
console.log('Create account result:', result);

// Test 2: Verify account exists
console.log('\n=== Test 2: Verify Account List ===');
let accounts = accountManager.getAccountsList();
console.log('Accounts:', accounts);

// Test 3: Login
console.log('\n=== Test 3: Login ===');
result = accountManager.login('TestPlayer1', simpleHash('password123'));
console.log('Login result:', result);

// Test 4: Check current account
console.log('\n=== Test 4: Current Account ===');
let currentAccount = accountManager.getCurrentAccount();
console.log('Current account:', currentAccount);

// Test 5: Add gems
console.log('\n=== Test 5: Add Gems ===');
result = accountManager.addGems(500);
console.log('Add gems result:', result);

// Test 6: Get gems
console.log('\n=== Test 6: Get Gems ===');
let gems = accountManager.getGems();
console.log('Current gems:', gems);

// Test 7: Spend gems
console.log('\n=== Test 7: Spend Gems ===');
result = accountManager.spendGems(100);
console.log('Spend gems result:', result);

// Test 8: Add disc
console.log('\n=== Test 8: Add Disc ===');
result = accountManager.addDisc({
    rarity: 'rare',
    creatureId: 'creature_001',
    bannerId: 'banner_1'
});
console.log('Add disc result:', result);

// Test 9: Get discs
console.log('\n=== Test 9: Get Discs ===');
let discs = accountManager.getDiscs();
console.log('Current discs:', discs);

// Test 10: Add another account
console.log('\n=== Test 10: Create Second Account ===');
result = accountManager.createAccount('TestPlayer2', simpleHash('password456'));
console.log('Create second account result:', result);

// Test 11: Login to second account
console.log('\n=== Test 11: Login to Second Account ===');
result = accountManager.login('TestPlayer2', simpleHash('password456'));
console.log('Login to second account result:', result);

// Test 12: Verify resources are separate
console.log('\n=== Test 12: Verify Resources Are Separate ===');
console.log('TestPlayer2 gems:', accountManager.getGems());
console.log('TestPlayer2 discs:', accountManager.getDiscs());
result = accountManager.addGems(200);
console.log('Added 200 gems to TestPlayer2, new total:', result.gems);

// Test 13: Switch back to first account
console.log('\n=== Test 13: Switch Back to First Account ===');
result = accountManager.switchAccount(
    Object.keys(accountManager.accounts)[0], 
    simpleHash('password123')
);
console.log('Switch result:', result);
console.log('TestPlayer1 gems (should be 400):', accountManager.getGems());

// Test 14: Test currency
console.log('\n=== Test 14: Test Currency ===');
console.log('Standard currency:', accountManager.getCurrency('standard'));
result = accountManager.addCurrency('standard', 500);
console.log('Add currency result:', result);
result = accountManager.spendCurrency('standard', 100);
console.log('Spend currency result:', result);

// Test 15: Check storage persistence
console.log('\n=== Test 15: Storage Persistence ===');
console.log('localStorage keys:', Object.keys(localStorage).filter(k => k.startsWith('lunaris_accounts')));

console.log('\n=== All Tests Completed ===');
console.log('To verify persistence, close and reopen the browser');

/**
 * rewardManager.js
 * Manages rewards in Lunaris roguelike runs
 */

// LUNARIS_TODO: balance reward tables later

/**
 * RewardManager class
 * Handles all reward generation
 */
class RewardManager {
    /**
     * @param {Object} data - Game data
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Generate battle rewards
     * @param {Object} encounter - The encounter that was defeated
     * @param {RunState} runState - Current run state
     * @returns {Object} Rewards
     */
    generateBattleRewards(encounter, runState) {
        const rewards = {
            exp: 0,
            items: [],
            creature: null
        };
        
        // Calculate EXP
        const baseExp = encounter.level * 10;
        const expMultiplier = encounter.isBoss ? 3 : 1;
        rewards.exp = Math.floor(baseExp * expMultiplier);
        
        // Add encounter's own rewards
        if (encounter.rewards) {
            if (encounter.rewards.exp) {
                rewards.exp += encounter.rewards.exp;
            }
            if (encounter.rewards.items) {
                rewards.items.push(...encounter.rewards.items);
            }
        }
        
        // Random item drops
        const itemDropChance = runState.rng.next();
        if (itemDropChance < 0.3) { // 30% chance
            const randomItem = this.getRandomItem(runState);
            if (randomItem) {
                rewards.items.push(randomItem);
            }
        }
        
        // Boss guaranteed drops
        if (encounter.isBoss && encounter.rewards?.guaranteed) {
            if (encounter.rewards.items) {
                rewards.items.push(...encounter.rewards.items);
            }
        }
        
        // Apply run rules
        if (runState.rules.exp_modifier) {
            rewards.exp = Math.floor(rewards.exp * runState.rules.exp_modifier);
        }
        
        return rewards;
    }

    /**
     * Generate zone completion rewards
     * @param {Object} zone - Zone data
     * @param {RunState} runState - Current run state
     * @returns {Object} Rewards
     */
    generateZoneRewards(zone, runState) {
        const rewards = {
            items: [],
            tickets: [],
            gachaPulls: 0
        };
        
        // Base rewards based on zone difficulty
        const difficulty = zone.difficulty || 1;
        
        // Guaranteed items
        const itemCount = runState.rng.nextInt(1, Math.max(1, difficulty));
        for (let i = 0; i < itemCount; i++) {
            const item = this.getRandomItem(runState);
            if (item) {
                rewards.items.push(item);
            }
        }
        
        // Chance for tickets
        if (runState.rng.next() < 0.3) {
            rewards.tickets.push('run_ticket');
        }
        
        // Gacha pulls based on difficulty
        rewards.gachaPulls = Math.floor(difficulty / 2);
        
        // Bonus for boss zones
        if (zone.boss && runState.rng.next() < 0.5) {
            rewards.items.push('MoonStone');
        }
        
        return rewards;
    }

    /**
     * Generate run completion rewards
     * @param {RunState} runState - Current run state
     * @returns {Object} Rewards
     */
    generateRunEndRewards(runState) {
        const rewards = {
            items: [],
            tickets: [],
            gachaPulls: 0,
            creatureUnlocks: [],
            title: ''
        };
        
        // Calculate total gacha pulls based on performance
        const zonesCompleted = runState.zonesCompleted.length;
        const battlesWon = runState.battlesWon;
        
        // Base pulls for completing run
        rewards.gachaPulls = 10;
        
        // Bonus pulls for additional zones
        rewards.gachaPulls += Math.floor(zonesCompleted / 2);
        
        // Bonus pulls for battles won
        rewards.gachaPulls += Math.floor(battlesWon / 10);
        
        // Guaranteed valuable items
        rewards.items.push('MoonStone');
        rewards.items.push('SunStone');
        
        // Random high-tier items
        const itemCount = runState.rng.nextInt(2, 5);
        for (let i = 0; i < itemCount; i++) {
            const item = this.getRandomValuableItem(runState);
            if (item) {
                rewards.items.push(item);
            }
        }
        
        // Tickets
        rewards.tickets.push('run_ticket', 'revive_ticket');
        
        // Generate title based on performance
        rewards.title = this.generateRunTitle(runState);
        
        // Unlock creatures based on what was caught
        rewards.creatureUnlocks = [...runState.caughtCreatures];
        
        return rewards;
    }

    /**
     * Get random item from available items
     * @param {RunState} runState - Current run state
     * @returns {string} Item ID
     */
    getRandomItem(runState) {
        const items = Object.keys(this.data.items).filter(
            k => !k.startsWith('_')
        );
        
        if (items.length === 0) return null;
        
        return runState.rng.choice(items);
    }

    /**
     * Get random valuable item
     * @param {RunState} runState - Current run state
     * @returns {string} Item ID
     */
    getRandomValuableItem(runState) {
        const valuableItems = ['MoonStone', 'SunStone', 'FullRestore', 'MaxRevive'];
        return runState.rng.choice(valuableItems);
    }

    /**
     * Generate run title based on performance
     * @param {RunState} runState - Current run state
     * @returns {string} Title
     */
    generateRunTitle(runState) {
        const zonesCompleted = runState.zonesCompleted.length;
        const battlesWon = runState.battlesWon;
        const battlesLost = runState.battlesLost;
        
        // Victory titles
        if (runState.isVictory) {
            if (battlesLost === 0) {
                return 'Perfect Champion';
            } else if (battlesLost <= 3) {
                return 'Grand Champion';
            } else if (zonesCompleted >= 5) {
                return 'Veteran Champion';
            } else {
                return 'Champion';
            }
        }
        
        // Defeat titles
        if (battlesWon >= 20) {
            return 'Warrior';
        } else if (battlesWon >= 10) {
            return 'Explorer';
        } else if (battlesWon >= 5) {
            return 'Beginner';
        } else {
            return 'Novice';
        }
    }

    /**
     * Apply EXP rewards to team
     * @param {Object} rewards - Rewards object
     * @param {RunState} runState - Current run state
     * @returns {Object} Level up results
     */
    applyExpRewards(rewards, runState) {
        const results = {
            totalExp: rewards.exp,
            levelUps: []
        };
        
        // Distribute EXP to active creature (simplified)
        const creature = runState.getActiveCreature();
        if (!creature) return results;
        
        creature.exp += rewards.exp;
        
        // Check for level ups
        while (creature.exp >= creature.expToNextLevel) {
            creature.exp -= creature.expToNextLevel;
            creature.level++;
            creature.expToNextLevel = creature.level * 100;
            
            // Increase stats
            const statIncrease = runState.rng.nextInt(2, 5);
            creature.maxHp += statIncrease;
            creature.hp += statIncrease;
            creature.atk += statIncrease;
            creature.def += statIncrease;
            creature.spa += statIncrease;
            creature.spd += statIncrease;
            creature.spe += statIncrease;
            
            results.levelUps.push({
                creature: creature.name,
                newLevel: creature.level
            });
            
            runState.log(`${creature.name} leveled up to ${creature.level}!`);
        }
        
        return results;
    }

    /**
     * Apply item rewards to inventory
     * @param {Array} items - Array of item IDs
     * @param {RunState} runState - Current run state
     */
    applyItemRewards(items, runState) {
        for (const itemId of items) {
            runState.inventory.addItem(itemId, 1);
            runState.log(`Received ${itemId}!`);
        }
    }

    /**
     * Apply ticket rewards to inventory
     * @param {Array} tickets - Array of ticket IDs
     * @param {RunState} runState - Current run state
     */
    applyTicketRewards(tickets, runState) {
        for (const ticketId of tickets) {
            runState.inventory.addTicket(ticketId, 1);
            runState.log(`Received ${ticketId}!`);
        }
    }

    /**
     * Get reward summary
     * @param {Object} rewards - Rewards object
     * @returns {string} Summary string
     */
    getRewardSummary(rewards) {
        const parts = [];
        
        if (rewards.exp) {
            parts.push(`${rewards.exp} EXP`);
        }
        
        if (rewards.items && rewards.items.length > 0) {
            parts.push(rewards.items.join(', '));
        }
        
        if (rewards.tickets && rewards.tickets.length > 0) {
            parts.push(rewards.tickets.join(', '));
        }
        
        if (rewards.gachaPulls > 0) {
            parts.push(`${rewards.gachaPulls} Gacha Pulls`);
        }
        
        return parts.join(' | ') || 'No rewards';
    }

    /**
     * Calculate score based on run performance
     * @param {RunState} runState - Current run state
     * @returns {number} Score
     */
    calculateScore(runState) {
        let score = 0;
        
        // Base score for completing zones
        score += runState.zonesCompleted.length * 1000;
        
        // Bonus for battles won
        score += runState.battlesWon * 100;
        
        // Penalty for battles lost
        score -= runState.battlesLost * 50;
        
        // Bonus for no fainted creatures
        if (runState.creaturesFainted === 0) {
            score += 500;
        }
        
        // Bonus for quick completion (if implemented)
        // const duration = Date.now() - runState.startTime;
        
        return Math.max(0, score);
    }

    /**
     * Generate daily rewards (placeholder)
     * @param {RunState} runState - Current run state
     * @returns {Object} Daily rewards
     */
    generateDailyRewards(runState) {
        // LUNARIS_TODO: Implement daily login rewards
        return {
            items: ['LunarPotion'],
            tickets: [],
            message: 'Daily reward claimed!'
        };
    }

    /**
     * Generate achievement rewards (placeholder)
     * @param {string} achievementId - Achievement ID
     * @returns {Object} Achievement rewards
     */
    generateAchievementRewards(achievementId) {
        // LUNARIS_TODO: Implement achievement system
        const rewards = {
            'first_win': { items: ['LunarPotion', 'LunarPotion'], tickets: [] },
            'first_capture': { items: ['MoonStone'], tickets: [] },
            'zone_5': { items: [], tickets: ['run_ticket'] }
        };
        
        return rewards[achievementId] || { items: [], tickets: [] };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RewardManager };
}

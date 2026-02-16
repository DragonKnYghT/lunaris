/**
 * ai.js
 * Enemy AI system for Lunaris battles
 */

// LUNARIS_TODO: add advanced AI later

/**
 * SimpleAI class
 * Basic enemy AI for battles
 */
class SimpleAI {
    constructor() {
        this.name = 'SimpleAI';
    }
    
    /**
     * Choose an action for the enemy
     * @param {Object} battleState - Current battle state
     * @param {Object} data - Game data
     * @returns {Object} Selected action
     */
    chooseAction(battleState, data) {
        const enemy = battleState.enemyActive;
        
        if (!enemy) {
            return { type: 'run' };
        }
        
        // Check if we should switch
        const shouldSwitch = this.shouldSwitch(enemy, battleState);
        if (shouldSwitch.shouldSwitch) {
            return {
                type: 'switch',
                slot: shouldSwitch.slot
            };
        }
        
        // Choose a move
        const moveChoice = this.chooseMove(enemy, battleState, data);
        
        return {
            type: 'attack',
            move: moveChoice
        };
    }
    
    /**
     * Decide whether to switch creatures
     * @param {Object} enemy - Current enemy creature
     * @param {Object} battleState - Current battle state
     * @returns {Object} {shouldSwitch: boolean, slot: number}
     */
    shouldSwitch(enemy, battleState) {
        // Get team
        const team = battleState.enemyTeam;
        
        // Check if current creature is fainted
        if (enemy.isFainted) {
            // Find first non-fainted creature
            for (let i = 0; i < team.length; i++) {
                if (team[i] && !team[i].isFainted) {
                    return { shouldSwitch: true, slot: i };
                }
            }
            return { shouldSwitch: false };
        }
        
        // Check HP - switch if below 25%
        const hpPercent = enemy.currentHp / enemy.maxHp;
        if (hpPercent < 0.25) {
            // Check if there's a better option
            for (let i = 0; i < team.length; i++) {
                if (team[i] && !team[i].isFainted && team[i] !== enemy) {
                    const teamHpPercent = team[i].currentHp / team[i].maxHp;
                    if (teamHpPercent > 0.5) {
                        return { shouldSwitch: true, slot: i };
                    }
                }
            }
        }
        
        // Check if statused - chance to switch
        if (enemy.status) {
            // 30% chance to switch if statused
            if (Math.random() < 0.3) {
                for (let i = 0; i < team.length; i++) {
                    if (team[i] && !team[i].isFainted && team[i] !== enemy) {
                        const teamHpPercent = team[i].currentHp / team[i].maxHp;
                        if (teamHpPercent > 0.5) {
                            return { shouldSwitch: true, slot: i };
                        }
                    }
                }
            }
        }
        
        return { shouldSwitch: false };
    }
    
    /**
     * Choose which move to use
     * @param {Object} enemy - Current enemy creature
     * @param {Object} battleState - Current battle state
     * @param {Object} data - Game data
     * @returns {string} Move ID
     */
    chooseMove(enemy, battleState, data) {
        const moves = enemy.moves;
        
        if (!moves || moves.length === 0) {
            // No moves available
            return null;
        }
        
        const player = battleState.playerActive;
        
        if (!player) {
            return moves[0];
        }
        
        // Evaluate each move
        const moveEvaluations = moves.map(moveId => {
            const moveData = data.moves[moveId];
            
            if (!moveData) {
                return { moveId, score: 0 };
            }
            
            // Calculate expected damage
            let score = this.evaluateMove(moveData, enemy, player, battleState, data);
            
            return { moveId, score };
        });
        
        // Sort by score (highest first)
        moveEvaluations.sort((a, b) => b.score - a.score);
        
        // Add some randomness - don't always pick the best
        const roll = Math.random();
        if (roll < 0.7) {
            // 70% chance to pick best move
            return moveEvaluations[0].moveId;
        } else if (roll < 0.9) {
            // 20% chance to pick second best
            return moveEvaluations[1]?.moveId || moveEvaluations[0].moveId;
        } else {
            // 10% chance to pick random
            const randomIndex = Math.floor(Math.random() * moveEvaluations.length);
            return moveEvaluations[randomIndex].moveId;
        }
    }
    
    /**
     * Evaluate a move's effectiveness
     * @param {Object} move - Move data
     * @param {Object} attacker - Attacking creature
     * @param {Object} defender - Defending creature
     * @param {Object} battleState - Current battle state
     * @param {Object} data - Game data
     * @returns {number} Score
     */
    evaluateMove(move, attacker, defender, battleState, data) {
        let score = 0;
        
        // Base score
        score += 50;
        
        // Skip status moves in evaluation
        if (!move.power || move.power === 0) {
            // Status moves - lower priority for simple AI
            score -= 30;
            
            // Healing moves
            if (move.healing) {
                const hpPercent = attacker.currentHp / attacker.maxHp;
                if (hpPercent < 0.5) {
                    score += 40;
                }
            }
            
            return score;
        }
        
        // Calculate base damage
        const isPhysical = move.category === 'Physical';
        const atkStat = isPhysical ? attacker.stats.atk : attacker.stats.spa;
        const defStat = isPhysical ? defender.stats.def : defender.stats.spd;
        
        const baseDamage = Math.floor(
            (2 * attacker.level / 5 + 2) * move.power * atkStat / defStat / 50 + 2
        );
        
        // Add damage to score
        score += Math.min(baseDamage, 100);
        
        // Type effectiveness
        const typeChart = require('./typeChart.js');
        const effectiveness = typeChart.calculateMoveEffectiveness(move, defender.types);
        
        if (effectiveness > 1) {
            score += 30;  // Super effective
        } else if (effectiveness < 1 && effectiveness > 0) {
            score -= 20;  // Not very effective
        } else if (effectiveness === 0) {
            score -= 50;  // No effect
        }
        
        // STAB bonus
        if (attacker.types.includes(move.type)) {
            score += 15;
        }
        
        // Priority moves
        if (move.priority && move.priority > 0) {
            score += 10;
        }
        
        // Accuracy
        if (move.accuracy) {
            score += move.accuracy * 0.1;
        }
        
        // Coverage - check against other team members
        const team = battleState.enemyTeam;
        let coverageScore = 0;
        
        for (const teammate of team) {
            if (teammate && teammate !== attacker && !teammate.isFainted) {
                const teammateEffectiveness = typeChart.calculateMoveEffectiveness(move, teammate.types);
                if (teammateEffectiveness > 1) {
                    coverageScore += 5;
                }
            }
        }
        
        score += coverageScore;
        
        // Random factor
        score += Math.random() * 20;
        
        return score;
    }
    
    /**
     * Use an item (placeholder)
     * @param {Object} battleState - Current battle state
     * @returns {Object|null} Item action
     */
    useItem(battleState) {
        // LUNARIS_TODO: Implement item usage for AI
        // For now, return null (no item usage)
        return null;
    }
}

/**
 * AdvancedAI class (placeholder for future)
 */
class AdvancedAI {
    constructor() {
        this.name = 'AdvancedAI';
    }
    
    // LUNARIS_TODO: Implement advanced AI with:
    // - Team preview analysis
    // - Prediction of player moves
    // - Set-up move prioritization
    // - Risk assessment
    
    chooseAction(battleState, data) {
        // Placeholder - use simple AI for now
        const simpleAI = new SimpleAI();
        return simpleAI.chooseAction(battleState, data);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SimpleAI,
        AdvancedAI
    };
}

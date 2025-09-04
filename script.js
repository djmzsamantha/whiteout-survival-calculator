// Whiteout Survivor Calculator - Logic

// Constants
const MIN_LEVEL = 15;
const MAX_LEVEL = 30;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

// Utility functions
function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '0m';
    
    const days = Math.floor(seconds / SECONDS_PER_DAY);
    const hours = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
    const mins = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    
    if (days > 0) {
        return `${days}d ${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h ${mins}m`;
    } else if (mins > 0) {
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0 ? `${mins}m ${remainingSeconds}s` : `${mins}m`;
    } else {
        return `${seconds}s`;
    }
}

function applySpeedBoost(time, boostPercentage) {
    if (typeof time !== 'number' || isNaN(time) || time < 0) return 0;
    if (typeof boostPercentage !== 'number' || isNaN(boostPercentage) || boostPercentage <= 0) return time;
    
    // Apply speed boost: user input is the percentage of original time
    // Example: User inputs 75% construction speed boost = 75% of original time (25% reduction)
    // 100 seconds with 75% boost = 100 * 0.75 = 75 seconds
    const actualTimeReduction = boostPercentage / 100;
    return Math.floor(time * actualTimeReduction);
}

function getInputValue(elementId, defaultValue, min = null, max = null) {
    try {
        const element = document.getElementById(elementId);
        if (!element) return defaultValue;
        
        const value = parseInt(element.value) || defaultValue;
        
        if (min !== null && value < min) return min;
        if (max !== null && value > max) return max;
        
        return value;
    } catch (error) {
        console.error(`Error getting input value for ${elementId}:`, error);
        return defaultValue;
    }
}

function getDecimalInputValue(elementId, defaultValue, min = null, max = null) {
    try {
        const element = document.getElementById(elementId);
        if (!element) return defaultValue;
        
        const value = parseFloat(element.value) || defaultValue;
        
        if (min !== null && value < min) return min;
        if (max !== null && value > max) return max;
        
        return value;
    } catch (error) {
        console.error(`Error getting decimal input value for ${elementId}:`, error);
        return defaultValue;
    }
}

function setElementText(elementId, text) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    } catch (error) {
        console.error(`Error setting text for ${elementId}:`, error);
    }
}

function setElementDisplay(elementId, display) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = display;
        }
    } catch (error) {
        console.error(`Error setting display for ${elementId}:`, error);
    }
}

// Main calculation function
function calculateRequirements() {
    try {
        const currentLevel = getInputValue('current-level', MIN_LEVEL, MIN_LEVEL, MAX_LEVEL);
        const constructionSpeedBoost = getDecimalInputValue('construction-speed', 0, 0, 100);
        
        const targetLevel = getInputValue('building-level', 1, 1, MAX_LEVEL);
        
        // Currently only supporting furnace upgrades, but code is building-agnostic
        const buildingType = 'furnace';
        
        // Get input values
        const vicePresident = document.getElementById('vice-president')?.checked || false;
        const zinmanLevel = getInputValue('zinman-level', 0, 0, 5);
        const chiefOrderDoubleTime = document.getElementById('chief-order-double-time')?.checked || false;
        const petSkillBuildersAide = parseInt(document.getElementById('pet-skill-builders-aide')?.value || 0);
        const allianceAdaptiveTools = parseInt(document.getElementById('alliance-adaptive-tools')?.value || 0);
        const islandFountainJoy = parseFloat(document.getElementById('island-fountain-joy')?.value || 0);
        const islandOakTavern = parseFloat(document.getElementById('island-oak-tavern')?.value || 0);
        
        // Calculate speed boost
        let totalSpeedBoost = constructionSpeedBoost;
        if (vicePresident) {
            totalSpeedBoost -= 10; // VP reduces time by 10% (makes it faster)
        }
        if (chiefOrderDoubleTime) {
            totalSpeedBoost -= 20; // Chief Order reduces time by 20% (makes it faster)
        }
        if (petSkillBuildersAide > 0) {
            totalSpeedBoost -= petSkillBuildersAide; // Pet Skill reduces time by the boost amount
        }
        if (allianceAdaptiveTools > 0) {
            totalSpeedBoost -= allianceAdaptiveTools; // Alliance Adaptive Tools reduces time by the boost amount
        }
        if (islandFountainJoy > 0) {
            totalSpeedBoost -= islandFountainJoy; // Island Fountain of Joy reduces time by the boost amount
        }
        
        if (islandOakTavern > 0) {
            totalSpeedBoost -= islandOakTavern; // Island Oak Tavern reduces time by the boost amount
        }
        
        // Calculate zinman resource reduction (3% per level starting at level 1)
        const zinmanResourceReduction = zinmanLevel > 0 ? (zinmanLevel * 0.03) : 0;
        if (currentLevel < MIN_LEVEL || currentLevel > MAX_LEVEL) {
            alert(`Current level must be between ${MIN_LEVEL} and ${MAX_LEVEL}`);
            return;
        }
        
        if (targetLevel < 1 || targetLevel > MAX_LEVEL) {
            alert(`Target level must be between 1 and ${MAX_LEVEL}`);
            return;
        }
        
        if (currentLevel >= targetLevel) {
            alert(`Target level (${targetLevel}) must be higher than current level (${currentLevel})`);
            return;
        }
        
        // Initialize totals
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        let allDependencies = [];
        
        // Calculate dependent building costs using the new dependency logic
        // This includes both the target building (furnace) and all its dependencies
        const dependencyPlan = planBuildingDependencies(buildingType, currentLevel, targetLevel, currentLevel);
        const allBuildingCosts = calculateDependentBuildingCostsFromPlan(dependencyPlan, totalSpeedBoost, zinmanResourceReduction);
        
        totalMeat += allBuildingCosts.meat || 0;
        totalWood += allBuildingCosts.wood || 0;
        totalCoal += allBuildingCosts.coal || 0;
        totalIron += allBuildingCosts.iron || 0;
        totalTime += allBuildingCosts.time || 0;
        
        // Create net requirements object
        const netRequirements = {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime,
            dependencies: dependencyPlan
        };
        
        // Show dependencies if they exist
        if (netRequirements.dependencies && netRequirements.dependencies.length > 0) {
            generateDependencyBreakdownFromPlan(dependencyPlan, totalSpeedBoost, currentLevel, buildingType);
        }
        
        // Update the display
        updateResultsDisplay(netRequirements, currentLevel, targetLevel, totalSpeedBoost, constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, petSkillBuildersAide, allianceAdaptiveTools, islandFountainJoy, islandOakTavern, buildingType);
        
    } catch (error) {
        console.error('Error in calculateRequirements:', error);
        console.error('Error stack:', error.stack);
        console.error('Current values:', { currentLevel, targetLevel, totalSpeedBoost, zinmanResourceReduction });
        alert('An error occurred while calculating requirements. Please try again.');
    }
}

function calculateDependentBuildingCosts(dependencies, constructionSpeedBoost, zinmanResourceReduction = 0, currentLevel = 1, buildingBeingUpgraded = 'furnace') {
    // Default to 'furnace' for backward compatibility, but function is building-agnostic
    try {
        if (!Array.isArray(dependencies) || dependencies.length === 0) {
            return { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
        }
        
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        
        // Process each dependency
        dependencies.forEach(dep => {
            if (!dep || typeof dep !== 'object' || !dep.building || typeof dep.level !== 'number') {
                return;
            }
            
            const buildingType = dep.building;
            const requiredLevel = dep.level;
            
            // Skip the building we're upgrading (e.g., don't show furnace as a dependency of itself)
            if (buildingType === buildingBeingUpgraded) {
                return;
            }
            
            // Get the building data
            const building = gameData?.buildings?.[buildingType];
            if (!building) {
                return;
            }
            
            // Skip innerCity buildings as they are excluded from calculations
            if (building.innerCity) {
                return;
            }
            
            // All buildings need to be built up from current level to required level
            // Find the highest level this building is required at and calculate from current to that level
            const currentBuildingType = dep.building; // The building we're upgrading (e.g., furnace)
            const currentBuilding = gameData?.buildings?.[currentBuildingType];
            let highestRequiredLevel = requiredLevel;
            
            // Check all levels from current to target to find the highest level this building is required at
            for (let level = currentLevel; level <= currentLevel + (requiredLevel - currentLevel); level++) {
                if (currentBuilding && currentBuilding.levels?.[level]) {
                    const currentLevelData = currentBuilding.levels[level];
                    const currentDependencies = currentLevelData.dependencies || [];
                    
                    if (currentDependencies.some(d => d.building === buildingType)) {
                        highestRequiredLevel = Math.max(highestRequiredLevel, level);
                    }
                }
            }
            
            // Now calculate from current level to the highest required level
            for (let level = currentLevel; level <= highestRequiredLevel; level++) {
                if (building.levels?.[level]) {
                    const levelData = building.levels[level];
                    const requirements = levelData.requirements || {};
                    
                    // Apply Zinman resource cost reduction
                    const applyZinmanReduction = (value) => {
                        return Math.floor(value * (1 - zinmanResourceReduction));
                    };
                    
                    totalMeat += applyZinmanReduction(requirements.meat || 0);
                    totalWood += applyZinmanReduction(requirements.wood || 0);
                    totalCoal += applyZinmanReduction(requirements.coal || 0);
                    totalIron += applyZinmanReduction(requirements.iron || 0);
                    
                    // Apply speed boost to dependent building time
                    const levelTime = applySpeedBoost(levelData.time || 0, constructionSpeedBoost);
                    totalTime += levelTime;
                }
            }
        });
        
        return {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime
        };
    } catch (error) {
        console.error('Error calculating dependent building costs:', error);
        return { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
    }
}

function generateDependencyBreakdown(dependencies, constructionSpeedBoost = 0, currentLevel = 1, calculatedCosts = null, buildingBeingUpgraded = 'furnace') {
    // Default to 'furnace' for backward compatibility, but function is building-agnostic
    try {
        const dependenciesSection = document.getElementById('dependencies-section');
        const breakdownDiv = document.getElementById('dependencies-breakdown');
        
        if (!dependencies || dependencies.length === 0) {
            setElementDisplay('dependencies-section', 'none');
            return;
        }
        
        let html = '<div class="dependency-warning">⚠️ This building requires the following prerequisites (costs included in total):</div>';
        
        // Group dependencies by building type to avoid duplicates
        const dependencyGroups = {};
        
        // First, collect all dependencies from the raw dependency list
        dependencies.forEach(dep => {
            if (!dep || typeof dep !== 'object' || !dep.building || typeof dep.level !== 'number') {
                return;
            }
            
            const buildingType = dep.building;
            const requiredLevel = dep.level;
            
            if (!dependencyGroups[buildingType]) {
                dependencyGroups[buildingType] = {
                    building: buildingType,
                    levels: [],
                    maxLevel: requiredLevel
                };
            }
            
            dependencyGroups[buildingType].levels.push(requiredLevel);
            dependencyGroups[buildingType].maxLevel = Math.max(dependencyGroups[buildingType].maxLevel, requiredLevel);
        });
        
        // Now check ALL levels from current to target to find additional dependencies
        // This ensures we catch embassy requirements at intermediate levels
        const currentBuilding = gameData?.buildings?.[buildingBeingUpgraded];
        
        if (currentBuilding) {
            // Check each level from current to target to find all dependencies
            const maxTargetLevel = Math.max(...dependencies.map(d => d.level));
            
            for (let level = currentLevel; level <= maxTargetLevel; level++) {
                if (currentBuilding.levels?.[level]) {
                    const levelData = currentBuilding.levels[level];
                    const levelDependencies = levelData.dependencies || [];
                    
                    levelDependencies.forEach(dep => {
                        const buildingType = dep.building;
                        const requiredLevel = dep.level;
                        
                        // Skip the building we're upgrading (e.g., don't show furnace as a dependency of itself)
                        if (buildingType === buildingBeingUpgraded) {
                            return;
                        }
                        
                        if (!dependencyGroups[buildingType]) {
                            dependencyGroups[buildingType] = {
                                building: buildingType,
                                levels: [],
                                maxLevel: requiredLevel
                            };
                        }
                        
                        dependencyGroups[buildingType].levels.push(requiredLevel);
                        dependencyGroups[buildingType].maxLevel = Math.max(dependencyGroups[buildingType].maxLevel, requiredLevel);
                    });
                }
            }
        }
        
        // Display each building type once with its highest required level
        Object.values(dependencyGroups).forEach(group => {
            const building = gameData?.buildings?.[group.building];
            if (!building) return;
            
            const isInnerCity = building.innerCity || false;
            const buildingName = building.name || group.building;
            const statusText = isInnerCity ? " (Inner City - Cost Not Included)" : "";
            
            // All buildings show the range from current level to max required level
            const displayLevel = `${currentLevel}-${group.maxLevel}`;
            
            // Calculate the cost for this building type from current level to max required level
            let cost = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            
            // All buildings (including embassy) need to be built up from current level to max required level
            for (let level = currentLevel; level <= group.maxLevel; level++) {
                if (building.levels?.[level]) {
                    const levelData = building.levels[level];
                    const requirements = levelData.requirements || {};
                    
                    cost.meat += requirements.meat || 0;
                    cost.wood += requirements.wood || 0;
                    cost.coal += requirements.coal || 0;
                    cost.iron += requirements.iron || 0;
                    cost.time += levelData.time || 0;
                }
            }

            
            const boostedTime = applySpeedBoost(cost.time, constructionSpeedBoost);
            const boostText = constructionSpeedBoost > 0 ? ` (${constructionSpeedBoost}% boost applied)` : '';
            
            html += `
                <div class="dependency-item">
                    <div class="dependency-header">
                        <h4>${buildingName} (Level ${displayLevel})${statusText}</h4>
                        <span class="dependency-cost">Total Cost: ${formatNumber(cost.meat || 0)} Meat, ${formatNumber(cost.wood || 0)} Wood, ${formatNumber(cost.coal || 0)} Coal, ${formatNumber(cost.iron || 0)} Iron</span>
                    </div>
                    <div class="dependency-details">
                        <p><strong>Time Required:</strong> ${formatTime(boostedTime)}${boostText}</p>
                        <p><strong>Resource Breakdown:</strong></p>
                        <div class="dependency-resources">
                            <span class="resource-item"><i class="fas fa-utensils"></i> Meat: ${formatNumber(cost.meat || 0)}</span>
                            <span class="resource-item"><i class="fas fa-tree"></i> Wood: ${formatNumber(cost.wood || 0)}</span>
                            <span class="resource-item"><i class="fas fa-fire"></i> Coal: ${formatNumber(cost.coal || 0)}</span>
                            <span class="resource-item"><i class="fas fa-hammer"></i> Iron: ${formatNumber(cost.iron || 0)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (breakdownDiv) {
            breakdownDiv.innerHTML = html;
        }
        setElementDisplay('dependencies-section', 'block');
        
    } catch (error) {
        console.error('Error generating dependency breakdown:', error);
    }
}

function updateResultsDisplay(requirements, currentLevel, targetLevel, boostPercentage, constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, petSkillBuildersAide, allianceAdaptiveTools, islandFountainJoy, islandOakTavern, buildingType = 'furnace') {
    try {
        // Update the main results
        setElementText('food-needed', formatNumber(requirements.meat));
        setElementText('wood-needed', formatNumber(requirements.wood));
        setElementText('coal-needed', formatNumber(requirements.coal));
        setElementText('iron-needed', formatNumber(requirements.iron));
        setElementText('time-required', formatTime(requirements.time));
        
        // Generate boost breakdown
        generateBoostBreakdown(constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, petSkillBuildersAide, allianceAdaptiveTools, islandFountainJoy, islandOakTavern, boostPercentage);
        
        // Generate progress breakdown
        generateProgressBreakdown(requirements, currentLevel, targetLevel, boostPercentage, buildingType);
        
        // Show the results section
        setElementDisplay('results-section', 'block');
        
    } catch (error) {
        console.error('Error updating results display:', error);
    }
}

function generateProgressBreakdown(requirements, currentLevel, targetLevel, boostPercentage, buildingType = 'furnace') {
    try {
        const breakdownDiv = document.getElementById('progress-breakdown');
        if (!breakdownDiv) return;
        
        let html = `
            <div class="progress-item summary">
                <h4>📊 Cumulative Requirements (Level ${currentLevel} → ${targetLevel})</h4>
                <p><strong>Total (includes dependent building costs):</strong> Meat: ${formatNumber(requirements.meat)} | Wood: ${formatNumber(requirements.wood)} | Coal: ${formatNumber(requirements.coal)} | Iron: ${formatNumber(requirements.iron)} | Time: ${formatTime(requirements.time)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Generate level-by-level breakdown
        if (currentLevel + 1 <= targetLevel) {
            html += '<div class="level-breakdown">';
            html += '<h4>📈 Level-by-Level Breakdown:</h4>';
            
            for (let level = currentLevel + 1; level <= targetLevel; level++) {
                let levelRequirements = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
                
                if (gameData?.buildings?.[buildingType]?.levels?.[level]) {
                    const levelData = gameData.buildings[buildingType].levels[level];
                    levelRequirements = { ...levelData.requirements };
                    levelRequirements.time = levelData.time || 0;
                }
                
                const levelTime = applySpeedBoost(levelRequirements.time || 0, boostPercentage);
                
                html += `
                    <div class="level-item">
                        <h5>Level ${level}:</h5>
                        <p>Meat: ${formatNumber(levelRequirements.meat || 0)} | Wood: ${formatNumber(levelRequirements.wood || 0)} | Coal: ${formatNumber(levelRequirements.coal || 0)} | Iron: ${formatNumber(levelRequirements.iron || 0)} | Time: ${formatTime(levelTime)}</p>
                    </div>
                `;
            }
            
            html += '</div>';
        }
        
        breakdownDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error generating progress breakdown:', error);
    }
}

function generateBoostBreakdown(constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, petSkillBuildersAide, allianceAdaptiveTools, islandFountainJoy, islandOakTavern, totalSpeedBoost) {
    try {
        const breakdownDiv = document.getElementById('boost-breakdown');
        if (!breakdownDiv) return;
        
        let html = '';
        
        // Base construction speed
        if (constructionSpeedBoost > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Base Construction Speed:</span>
                    <span class="boost-value">${constructionSpeedBoost.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Vice President bonus
        if (vicePresident) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Vice President (+10%):</span>
                    <span class="boost-value">+10.00%</span>
                </div>
            `;
        }
        
        // Chief Order bonus
        if (chiefOrderDoubleTime) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Chief Order Double Time (+20%):</span>
                    <span class="boost-value">+20.00%</span>
                </div>
            `;
        }
        
        // Pet Skill bonus
        if (petSkillBuildersAide > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Pet Skill: Builder's Aide (+${petSkillBuildersAide}%):</span>
                    <span class="boost-value">+${petSkillBuildersAide.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Alliance Adaptive Tools bonus
        if (allianceAdaptiveTools > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Alliance Adaptive Tools (+${allianceAdaptiveTools}%):</span>
                    <span class="boost-value">+${allianceAdaptiveTools.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Island Fountain of Joy bonus
        if (islandFountainJoy > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Island: Fountain of Joy (+${islandFountainJoy}%):</span>
                    <span class="boost-value">+${islandFountainJoy.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Island Oak Tavern bonus
        if (islandOakTavern > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Island: Oak Tavern (+${islandOakTavern}%):</span>
                    <span class="boost-value">+${islandOakTavern.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Total boost
        html += `
            <div class="boost-total">
                Total Speed Boost: ${totalSpeedBoost.toFixed(2)}%
            </div>
        `;
        
        // Time reduction explanation
        const timeReduction = (100 - totalSpeedBoost);
        html += `
            <div class="boost-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                <span class="boost-label">Effective Time Reduction:</span>
                <span class="boost-value">${timeReduction.toFixed(2)}%</span>
            </div>
        `;
        
        breakdownDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error generating boost breakdown:', error);
    }
}

// Input validation functions
function updateTargetLevelMin() {
    try {
        const currentLevelInput = document.getElementById('current-level');
        const targetLevelInput = document.getElementById('building-level');
        
        if (currentLevelInput && targetLevelInput) {
            const currentLevel = parseInt(currentLevelInput.value) || MIN_LEVEL;
            const minTargetLevel = currentLevel + 1;
            
            targetLevelInput.min = minTargetLevel;
            
            // If current target is below the new minimum, update it
            const currentTarget = parseInt(targetLevelInput.value) || 1;
            if (currentTarget <= currentLevel) {
                targetLevelInput.value = minTargetLevel;
            }
        }
    } catch (error) {
        console.error('Error updating target level minimum:', error);
    }
}

// Reset function
function resetAllValues() {
    try {
        // Reset all input values to defaults
        const currentLevelInput = document.getElementById('current-level');
        if (currentLevelInput) currentLevelInput.value = '20';
        
        const targetLevelInput = document.getElementById('building-level');
        if (targetLevelInput) targetLevelInput.value = '1';
        
        const constructionSpeedInput = document.getElementById('construction-speed');
        if (constructionSpeedInput) constructionSpeedInput.value = '0';
        
        const zinmanLevelInput = document.getElementById('zinman-level');
        if (zinmanLevelInput) zinmanLevelInput.value = '0';
        
        const vicePresidentCheckbox = document.getElementById('vice-president');
        if (vicePresidentCheckbox) vicePresidentCheckbox.checked = false;
        
        
        
        const chiefOrderCheckbox = document.getElementById('chief-order-double-time');
        if (chiefOrderCheckbox) chiefOrderCheckbox.checked = false;
        
        const petSkillBuildersAideInput = document.getElementById('pet-skill-builders-aide');
        if (petSkillBuildersAideInput) petSkillBuildersAideInput.value = '0';
        
        const allianceAdaptiveToolsInput = document.getElementById('alliance-adaptive-tools');
        if (allianceAdaptiveToolsInput) allianceAdaptiveToolsInput.value = '0';
        
        const islandFountainJoyInput = document.getElementById('island-fountain-joy');
        if (islandFountainJoyInput) islandFountainJoyInput.value = '0';
        
        const islandOakTavernInput = document.getElementById('island-oak-tavern');
        if (islandOakTavernInput) islandOakTavernInput.value = '0';
        
        // Hide results section
        setElementDisplay('results-section', 'none');
        setElementDisplay('dependencies-section', 'none');
        
        // Clear saved settings
        localStorage.removeItem('woCalculatorSettings');
        
        // Update target level minimum after reset
        updateTargetLevelMin();
        
    } catch (error) {
        console.error('Error resetting values:', error);
    }
}

// Reset troop training values
function resetTroopValues() {
    try {
        // Reset all troop input values to defaults
        
        // Reset training speed and alliance level
        const trainingSpeedInput = document.getElementById('training-speed');
        if (trainingSpeedInput) trainingSpeedInput.value = '100';
        
        const allianceTrainingInput = document.getElementById('alliance-training-level');
        if (allianceTrainingInput) allianceTrainingInput.value = '1';
        
        const trainingCapacityInput = document.getElementById('training-capacity');
        if (trainingCapacityInput) trainingCapacityInput.value = '100';
        
        // Reset time inputs
        const totalDaysInput = document.getElementById('total-days');
        if (totalDaysInput) totalDaysInput.value = '0';
        
        const totalHoursInput = document.getElementById('total-hours');
        if (totalHoursInput) totalHoursInput.value = '0';
        
        const totalMinutesInput = document.getElementById('total-minutes');
        if (totalMinutesInput) totalMinutesInput.value = '0';
        
        // Reset troop distribution percentages
        const infantrySplitInput = document.getElementById('infantry-split');
        if (infantrySplitInput) infantrySplitInput.value = '33';
        
        const marksmanSplitInput = document.getElementById('marksman-split');
        if (marksmanSplitInput) marksmanSplitInput.value = '33';
        
        const lancerSplitInput = document.getElementById('lancer-split');
        if (lancerSplitInput) lancerSplitInput.value = '34';
        
        // Reset target levels
        const infantryLevelInput = document.getElementById('infantry-level');
        if (infantryLevelInput) infantryLevelInput.value = '1';
        
        const marksmanLevelInput = document.getElementById('marksman-level');
        if (marksmanLevelInput) marksmanLevelInput.value = '1';
        
        const lancerLevelInput = document.getElementById('lancer-level');
        if (lancerLevelInput) lancerLevelInput.value = '1';
        
        // Reset even split checkbox
        const evenSplitCheckbox = document.getElementById('even-split-checkbox');
        if (evenSplitCheckbox) evenSplitCheckbox.checked = true;
        
        // Update the split total display
        updateSplitTotal();
        
        // Hide results section
        setElementDisplay('troop-results-section', 'none');
        
        
    } catch (error) {
        console.error('Error resetting troop values:', error);
    }
}

// Local storage functions
function saveSettings() {
    try {
        const settings = {
            currentLevel: getInputValue('current-level', MIN_LEVEL),
            targetLevel: getInputValue('building-level', 1),
            constructionSpeed: getInputValue('construction-speed', 0),
            petSkillBuildersAide: parseInt(document.getElementById('pet-skill-builders-aide')?.value || 0),
            allianceAdaptiveTools: parseInt(document.getElementById('alliance-adaptive-tools')?.value || 0),
            islandFountainJoy: parseFloat(document.getElementById('island-fountain-joy')?.value || 0),
            islandOakTavern: parseFloat(document.getElementById('island-oak-tavern')?.value || 0)
        };
        
        localStorage.setItem('woCalculatorSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function saveTroopTrainingSettings() {
    try {
        const troopSettings = {
            trainingSpeed: getDecimalInputValue('training-speed', 100, 0, 500),
            allianceTrainingLevel: getInputValue('alliance-training-level', 1, 1, 5),
            trainingCapacity: getInputValue('training-capacity', 1, 1, 9999),
            totalDays: getInputValue('total-days', 0, 0, 365),
            totalHours: getInputValue('total-hours', 0, 0, 23),
            totalMinutes: getInputValue('total-minutes', 0, 0, 59),
            infantrySplit: getInputValue('infantry-split', 33, 0, 100),
            marksmanSplit: getInputValue('marksman-split', 33, 0, 100),
            lancerSplit: getInputValue('lancer-split', 34, 0, 100),
            infantryLevel: getInputValue('infantry-level', 1, 1, 11),
            marksmanLevel: getInputValue('marksman-level', 1, 1, 11),
            lancerLevel: getInputValue('lancer-level', 1, 1, 11),
            evenSplitChecked: document.getElementById('even-split-checkbox')?.checked || true
        };
        
        localStorage.setItem('woTroopTrainingSettings', JSON.stringify(troopSettings));
    } catch (error) {
        console.error('Error saving troop training settings:', error);
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('woCalculatorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            if (settings.currentLevel) {
                const element = document.getElementById('current-level');
                if (element) element.value = settings.currentLevel;
            }
            if (settings.targetLevel) {
                const element = document.getElementById('building-level');
                if (element) element.value = settings.targetLevel;
            }
            if (settings.constructionSpeed) {
                const element = document.getElementById('construction-speed');
                if (element) element.value = settings.constructionSpeed;
            }
            if (settings.petSkillBuildersAide !== undefined) {
                const element = document.getElementById('pet-skill-builders-aide');
                if (element) element.value = settings.petSkillBuildersAide;
            }
            if (settings.allianceAdaptiveTools !== undefined) {
                const element = document.getElementById('alliance-adaptive-tools');
                if (element) element.value = settings.allianceAdaptiveTools;
            }
            if (settings.islandFountainJoy !== undefined) {
                const element = document.getElementById('island-fountain-joy');
                if (element) element.value = settings.islandFountainJoy;
            }
            if (settings.islandOakTavern !== undefined) {
                const element = document.getElementById('island-oak-tavern');
                if (element) element.value = settings.islandOakTavern;
            }
            
        }
        
        // Load troop training settings
        const savedTroopSettings = localStorage.getItem('woTroopTrainingSettings');
        if (savedTroopSettings) {
            const troopSettings = JSON.parse(savedTroopSettings);
            
            // Load all troop training inputs
            if (troopSettings.trainingSpeed) {
                const element = document.getElementById('training-speed');
                if (element) element.value = troopSettings.trainingSpeed;
            }
            if (troopSettings.allianceTrainingLevel) {
                const element = document.getElementById('alliance-training-level');
                if (element) element.value = troopSettings.allianceTrainingLevel;
            }
            if (troopSettings.trainingCapacity) {
                const element = document.getElementById('training-capacity');
                if (element) element.value = troopSettings.trainingCapacity;
            }
            if (troopSettings.totalDays) {
                const element = document.getElementById('total-days');
                if (element) element.value = troopSettings.totalDays;
            }
            if (troopSettings.totalHours) {
                const element = document.getElementById('total-hours');
                if (element) element.value = troopSettings.totalHours;
            }
            if (troopSettings.totalMinutes) {
                const element = document.getElementById('total-minutes');
                if (element) element.value = troopSettings.totalMinutes;
            }
            if (troopSettings.infantrySplit) {
                const element = document.getElementById('infantry-split');
                if (element) element.value = troopSettings.infantrySplit;
            }
            if (troopSettings.marksmanSplit) {
                const element = document.getElementById('marksman-split');
                if (element) element.value = troopSettings.marksmanSplit;
            }
            if (troopSettings.lancerSplit) {
                const element = document.getElementById('lancer-split');
                if (element) element.value = troopSettings.lancerSplit;
            }
            if (troopSettings.infantryLevel) {
                const element = document.getElementById('infantry-level');
                if (element) element.value = troopSettings.infantryLevel;
            }
            if (troopSettings.marksmanLevel) {
                const element = document.getElementById('marksman-level');
                if (element) element.value = troopSettings.marksmanLevel;
            }
            if (troopSettings.lancerLevel) {
                const element = document.getElementById('lancer-level');
                if (element) element.value = troopSettings.lancerLevel;
            }
            if (troopSettings.evenSplitChecked !== undefined) {
                const element = document.getElementById('even-split-checkbox');
                if (element) element.checked = troopSettings.evenSplitChecked;
            }
            
            // Update the split total display
            updateSplitTotal();
            
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Plan strategy handling
function handlePlanStrategyChange(strategy) {
        try {
            
            // Show/hide training goal options based on strategy
            const trainNewOptions = document.querySelector('.train-new-options');
            if (trainNewOptions) {
                trainNewOptions.style.display = strategy === 'train' ? 'flex' : 'none';
            }
            
            // Show/hide training boosts based on strategy
            const trainingSpeedGroup = document.querySelector('.training-speed-group');
            const trainingCapacityGroup = document.querySelector('.training-capacity-group');
            
            if (trainingSpeedGroup) {
                trainingSpeedGroup.style.display = strategy === 'train' ? 'flex' : 'none';
            }
            if (trainingCapacityGroup) {
                trainingCapacityGroup.style.display = strategy === 'train' ? 'flex' : 'none';
            }
            
            // Show/hide upgrade coming soon message
            const upgradeComingSoon = document.querySelector('.upgrade-coming-soon');
            if (upgradeComingSoon) {
                upgradeComingSoon.style.display = strategy === 'upgrade' ? 'flex' : 'none';
            }
            
            // Show/hide training-specific inputs
            const trainingInputs = document.querySelectorAll('.training-speed-group, .alliance-training-group, .training-capacity-group, .training-time-simple, .troop-splits-group, .troop-levels-group');
            trainingInputs.forEach(input => {
                input.style.display = strategy === 'train' ? 'flex' : 'none';
            });
            
            // Show/hide buttons based on strategy
            const calculateBtn = document.getElementById('calculate-troops-btn');
            const resetBtn = document.getElementById('reset-troops-btn');
            if (calculateBtn) calculateBtn.style.display = strategy === 'train' ? 'flex' : 'none';
            if (resetBtn) resetBtn.style.display = strategy === 'train' ? 'flex' : 'none';
            
        } catch (error) {
            console.error('Error handling plan strategy change:', error);
        }
    }

// Training goal handling
function handleTrainingGoalChange(goal) {
    try {
        updateTrainingGoalDisplay();
    } catch (error) {
        console.error('Error handling training goal change:', error);
    }
}



// Update split total display and maintain 100% total
function updateSplitTotal() {
    try {
        const infantrySplit = parseFloat(document.getElementById('infantry-split')?.value || 0);
        const marksmanSplit = parseFloat(document.getElementById('marksman-split')?.value || 0);
        const lancerSplit = parseFloat(document.getElementById('lancer-split')?.value || 0);
        
        const total = infantrySplit + marksmanSplit + lancerSplit;
        const totalElement = document.getElementById('split-total');
        
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
            
            // Color coding for total
            if (total === 100) {
                totalElement.style.color = '#28a745'; // Green for perfect 100%
            } else if (total > 100) {
                totalElement.style.color = '#dc3545'; // Red for over 100%
            } else {
                totalElement.style.color = '#ffc107'; // Yellow for under 100%
            }
        }
    } catch (error) {
        console.error('Error updating split total:', error);
    }
}
    
// Validate that total doesn't exceed 100%
function validateTotal() {
    try {
        const infantrySplit = parseFloat(document.getElementById('infantry-split')?.value || 0);
        const marksmanSplit = parseFloat(document.getElementById('marksman-split')?.value || 0);
        const lancerSplit = parseFloat(document.getElementById('lancer-split')?.value || 0);
        
        const total = infantrySplit + marksmanSplit + lancerSplit;
        
        // Update the total display
        const totalElement = document.getElementById('split-total');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
            
            // Color coding for total
            if (total === 100) {
                totalElement.style.color = '#28a745'; // Green for perfect 100%
            } else if (total > 100) {
                totalElement.style.color = '#dc3545'; // Red for over 100%
            } else {
                totalElement.style.color = '#ffc107'; // Yellow for under 100%
            }
        }
        
        // If total exceeds 100%, prevent the input from going over the limit
        if (total > 100) {
            // Find which input was just changed (has focus)
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id && activeElement.id.includes('-split')) {
                // Calculate the maximum allowed value for this input
                const otherTotal = total - parseFloat(activeElement.value);
                const maxAllowed = 100 - otherTotal;
                
                // If the input would exceed the limit, cap it
                if (parseFloat(activeElement.value) > maxAllowed) {
                    activeElement.value = Math.max(0, maxAllowed).toFixed(2);
                }
            }
        }
        
    } catch (error) {
        console.error('Error validating total:', error);
    }
}



// Update split display values
function updateSplitDisplay(inputId) {
    try {
        const input = document.getElementById(inputId);
        const value = parseFloat(input.value || 0);
        const valueSpan = input.previousElementSibling;
        
        
        if (valueSpan && valueSpan.classList.contains('split-value')) {
            valueSpan.textContent = value.toFixed(2) + '%';
        } else {
        }
    } catch (error) {
        console.error('Error updating split display:', error);
    }
}

// Set even split based on current total
function setEvenSplit() {
    try {
        
        // Get current total to distribute evenly
        const currentTotal = parseFloat(document.getElementById('infantry-split')?.value || 0) + 
                           parseFloat(document.getElementById('marksman-split')?.value || 0) + 
                           parseFloat(document.getElementById('lancer-split')?.value || 0);
        
        // If no current total, use 100 as default
        const totalToDistribute = currentTotal > 0 ? currentTotal : 100;
        
        // Calculate even distribution (as close as possible to equal)
        const baseValue = Math.floor(totalToDistribute / 3);
        const remainder = totalToDistribute - (baseValue * 3);
        
        document.getElementById('infantry-split').value = baseValue;
        document.getElementById('marksman-split').value = baseValue;
        document.getElementById('lancer-split').value = baseValue + remainder;
        
        // Disable inputs when even split is enabled
        ['infantry-split', 'marksman-split', 'lancer-split'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.disabled = true;
            } else {
            }
        });
        
        // Update total display
        validateTotal();
    } catch (error) {
        console.error('Error setting even split:', error);
    }
}

// Enable inputs when even split is disabled
function enableSliders() {
    try {
        ['infantry-split', 'marksman-split', 'lancer-split'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.disabled = false;
            } else {
            }
        });
    } catch (error) {
        console.error('Error enabling inputs:', error);
    }
}

// Initialize troops tab functionality
function initializeTroopsTab() {
    try {
        
        // Set up percentage split input listeners
        const splitInputs = ['infantry-split', 'marksman-split', 'lancer-split'];
        splitInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                // Remove existing listeners to prevent duplicates
                input.removeEventListener('input', input._inputHandler);
                
                // Create new handler function
                input._inputHandler = function() {
                    
                    // Only validate total if even split is not checked
                    const evenSplitCheckbox = document.getElementById('even-split-checkbox');
                    if (evenSplitCheckbox && !evenSplitCheckbox.checked) {
                        validateTotal();
                    }
                };
                
                // Add the new listener
                input.addEventListener('input', input._inputHandler);
            } else {
            }
        });
        
        // Set up even split checkbox listener
        const evenSplitCheckbox = document.getElementById('even-split-checkbox');
        if (evenSplitCheckbox) {
            // Remove existing listener to prevent duplicates
            evenSplitCheckbox.removeEventListener('change', evenSplitCheckbox._changeHandler);
            
            // Create new handler function
            evenSplitCheckbox._changeHandler = function() {
                if (this.checked) {
                    setEvenSplit();
                } else {
                    enableSliders();
                }
            };
            
            // Add the new listener
            evenSplitCheckbox.addEventListener('change', evenSplitCheckbox._changeHandler);
            
            // Initialize state based on checkbox
            if (evenSplitCheckbox.checked) {
                setEvenSplit();
            }
        } else {
        }
        
    } catch (error) {
        console.error('Error initializing troops tab:', error);
    }
}

// Tab switching functionality
function restoreActiveTab() {
    try {
        const savedTab = localStorage.getItem('wo_calculator_active_tab');
        if (savedTab && (savedTab === 'construction' || savedTab === 'troops' || savedTab === 'research')) {
            switchTab(savedTab);
        } else {
            // Default to construction tab if no saved tab or invalid value
            switchTab('construction');
        }
    } catch (error) {
        console.error('Error restoring active tab:', error);
        // Fallback to construction tab
        switchTab('construction');
    }
}

function switchTab(tabName) {
    try {
        // Hide all tabs
        const tabs = ['construction-tab', 'troops-tab', 'research-tab'];
        tabs.forEach(tab => {
            const tabElement = document.getElementById(tab);
            if (tabElement) {
                tabElement.style.display = 'none';
            }
        });
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.style.display = 'flex';
        }
        
        // Add active class to selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        
        // Hide results sections when switching tabs
        setElementDisplay('results-section', 'none');
        setElementDisplay('troop-results-section', 'none');
        
        // Initialize troops tab if switching to it
        if (tabName === 'troops') {
            handlePlanStrategyChange('train');
            initializeTroopsTab();
        }
        
        // Save the current tab to localStorage
        localStorage.setItem('wo_calculator_active_tab', tabName);
        
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// Helper function to get troop level costs
function getTroopLevelCost(troopType, level, resourceType) {
    try {
        
        if (gameData?.troopTraining?.[troopType]?.tiers?.[level]) {
            const tierData = gameData.troopTraining[troopType].tiers[level];
            
            if (resourceType === 'time') {
                const timeValue = tierData.time || 0;
                return timeValue;
            } else {
                const resourceValue = tierData.requirements[resourceType] || 0;
                return resourceValue;
            }
        } else {
            console.error(`No data found for ${troopType} level ${level}`);
            console.error('Available troop types:', Object.keys(gameData?.troopTraining || {}));
            if (gameData?.troopTraining?.[troopType]) {
                console.error(`Available levels for ${troopType}:`, Object.keys(gameData.troopTraining[troopType].tiers || {}));
            }
        }
        return 0;
    } catch (error) {
        console.error(`Error getting ${resourceType} cost for ${troopType} level ${level}:`, error);
        return 0;
    }
}

// Troop training calculation function
function calculateTroopRequirements() {
    try {
        
        const trainingSpeed = getDecimalInputValue('training-speed', 100, 0, 500);
        const allianceTrainingLevel = getInputValue('alliance-training-level', 1, 1, 5);
        const trainingCapacity = getInputValue('training-capacity', 1, 1, 9999);
        
        // Get additional troop speed boost inputs
        const islandBarbecueStand = parseFloat(document.getElementById('troop-island-barbecue-stand')?.value || 0);
        const islandSkiResort = parseFloat(document.getElementById('troop-island-ski-resort')?.value || 0);
        
        // Calculate total training speed including all boosts
        // Each alliance level adds 5% to training speed
        const allianceBoost = allianceTrainingLevel * 5;
        const totalSpeedBoost = allianceBoost + islandBarbecueStand + islandSkiResort;
        const totalTrainingSpeed = trainingSpeed + totalSpeedBoost;
        

        
        // Get strategy
        const strategy = document.querySelector('input[name="plan-strategy"]:checked')?.value;
        

        
        // Initialize combined totals
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        
        // Get all troop plans
        const troopTypes = ['infantry', 'marksman', 'lancer'];
        const planDetails = [];
        
        // Get total training time goal
        const totalDaysInput = document.getElementById('total-days');
        const totalHoursInput = document.getElementById('total-hours');
        const totalMinutesInput = document.getElementById('total-minutes');
        
        const totalDays = parseInt(totalDaysInput?.value || 0);
        const totalHours = parseInt(totalHoursInput?.value || 0);
        const totalMinutes = parseInt(totalMinutesInput?.value || 0);
        
        const daysInMinutes = totalDays * 24 * 60;
        const hoursInMinutes = totalHours * 60;
        const totalTimeMinutes = daysInMinutes + hoursInMinutes + totalMinutes;
        
        // Ensure totalTimeMinutes is a number
        if (isNaN(totalTimeMinutes)) {
            console.error('ERROR: totalTimeMinutes is NaN!', { totalDays, totalHours, totalMinutes, daysInMinutes, hoursInMinutes });
            throw new Error('Invalid time calculation');
        }
        
        // Clear previous debug data
        window.timeCalculationDebug = null;
        window.troopCalculationDebug = [];
        
        // Store time calculation details for debug display
        window.timeCalculationDebug = {
            inputValues: { days: totalDaysInput?.value, hours: totalHoursInput?.value, minutes: totalMinutesInput?.value },
            parsedValues: { totalDays, totalHours, totalMinutes },
            calculation: {
                daysInMinutes: `${totalDays} × 24 × 60 = ${daysInMinutes}`,
                hoursInMinutes: `${totalHours} × 60 = ${hoursInMinutes}`,
                minutes: totalMinutes,
                total: `${daysInMinutes} + ${hoursInMinutes} + ${totalMinutes} = ${totalTimeMinutes}`
            },
            totalTimeMinutes,
            totalTimeMinutesType: typeof totalTimeMinutes
        };
        
        troopTypes.forEach(troopType => {
            const targetLevel = parseInt(document.getElementById(`${troopType}-level`)?.value || 1);
            const splitPercentage = parseFloat(document.getElementById(`${troopType}-split`)?.value || 33);
            
                    // Step 1: Get base training time per troop
        const baseTimePerTroop = getTroopLevelCost(troopType, targetLevel, 'time');
        
        if (baseTimePerTroop === 0) {
            throw new Error(`No time data found for ${troopType} level ${targetLevel}`);
        }
        
        // Step 2: Apply training speed boost to get actual time per troop
        const boostedTimePerTroop = Math.floor(baseTimePerTroop / (totalTrainingSpeed / 100));
        
        // Step 3: Calculate how many troops can be trained in the given time
        // Apply the split percentage to the total time
        const timeForThisTroopType = Math.floor(totalTimeMinutes * (splitPercentage / 100));
        
        // Convert boostedTimePerTroop from seconds to minutes for proper division
        const boostedTimePerTroopMinutes = boostedTimePerTroop / 60;
        const troopsThatCanBeTrained = Math.floor(timeForThisTroopType / boostedTimePerTroopMinutes);
            
            
            
            // Step 4: Calculate resource costs for this troop type
            const levelRequirements = {
                meat: getTroopLevelCost(troopType, targetLevel, 'meat'),
                wood: getTroopLevelCost(troopType, targetLevel, 'wood'),
                coal: getTroopLevelCost(troopType, targetLevel, 'coal'),
                iron: getTroopLevelCost(troopType, targetLevel, 'iron'),
                time: boostedTimePerTroop
            };
            
            // Step 5: Multiply resource cost per troop by number of troops
            const planMeat = levelRequirements.meat * troopsThatCanBeTrained;
            const planWood = levelRequirements.wood * troopsThatCanBeTrained;
            const planCoal = levelRequirements.coal * troopsThatCanBeTrained;
            const planIron = levelRequirements.iron * troopsThatCanBeTrained;
            const planTime = levelRequirements.time * troopsThatCanBeTrained;
            
            // Add to totals
            totalMeat += planMeat;
            totalWood += planWood;
            totalCoal += planCoal;
            totalIron += planIron;
            totalTime += planTime;
            
            // Store plan details
            planDetails.push({
                troopType,
                targetLevel,
                quantity: troopsThatCanBeTrained,
                meat: planMeat,
                wood: planWood,
                coal: planCoal,
                iron: planIron,
                time: planTime,
                timePerTroop: boostedTimePerTroop,
                baseTimePerTroop: baseTimePerTroop,
                speedMultiplier: (totalTrainingSpeed / 100).toFixed(2),
                timeAllocation: timeForThisTroopType
            });
        });
        
        // Calculate total troops needed and number of batches
        const totalTroopsNeeded = planDetails.reduce((sum, plan) => sum + plan.quantity, 0);
        
        // Calculate total batches: sum up batches for each troop type
        const totalBatches = planDetails.reduce((sum, plan) => {
            const batchesForThisType = plan.quantity / trainingCapacity;
            return sum + batchesForThisType;
        }, 0);
        
        // Round to 2 decimal places for display
        const totalBatchesFormatted = Math.round(totalBatches * 100) / 100;
        
        // Time per batch: final time per troop × training capacity
        const maxTimePerTroop = Math.max(...planDetails.map(plan => plan.timePerTroop));
        const timePerBatch = maxTimePerTroop * trainingCapacity;
        
        // Create combined requirements object
        const combinedRequirements = {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime, // This is the total resource time, not the user's goal time
            totalTroops: totalTroopsNeeded,
            numberOfGroups: totalBatchesFormatted,
            timePerGroup: timePerBatch
        };
        

        
        // Update the display with combined results
        updateTroopResultsDisplay(combinedRequirements, planDetails, trainingSpeed, allianceTrainingLevel, totalTrainingSpeed, trainingCapacity, totalTimeMinutes, islandBarbecueStand, islandSkiResort);
        
    } catch (error) {
        console.error('Error in calculateTroopRequirements:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            line: error.lineNumber || 'unknown'
        });
        alert('An error occurred while calculating troop requirements. Please try again.');
    }
}

function updateTroopResultsDisplay(requirements, planDetails, trainingSpeed, allianceTrainingLevel, totalTrainingSpeed, trainingCapacity, totalTimeMinutes, islandBarbecueStand, islandSkiResort) {
    try {

        
        // Update the main results
        setElementText('troop-meat-needed', formatNumber(requirements.meat));
        setElementText('troop-wood-needed', formatNumber(requirements.wood));
        setElementText('troop-coal-needed', formatNumber(requirements.coal));
        setElementText('troop-iron-needed', formatNumber(requirements.iron));
        setElementText('troop-time-required', formatTime(requirements.time));
        
        // Generate troop boost breakdown
        generateTroopBoostBreakdown(totalTrainingSpeed, trainingCapacity, requirements.time, trainingSpeed, allianceTrainingLevel, islandBarbecueStand, islandSkiResort, planDetails);
        
        // Generate troop plan breakdown
        generateTroopPlanBreakdown(planDetails, trainingSpeed, requirements.numberOfGroups, requirements.timePerGroup, trainingCapacity);
        
        // Show the results section
        setElementDisplay('troop-results-section', 'block');
        
    } catch (error) {
        console.error('Error updating troop results display:', error);
        console.error('Error stack:', error.stack);
        console.error('Function parameters:', { requirements, trainingSpeed, allianceTrainingLevel, totalTrainingSpeed, trainingCapacity, totalTimeMinutes });
    }
}

function generateTroopBoostBreakdown(totalTrainingSpeed, trainingCapacity, totalTime, baseTrainingSpeed, allianceTrainingLevel, islandBarbecueStand, islandSkiResort, planDetails) {
    try {
        const breakdownDiv = document.getElementById('troop-boost-breakdown');
        if (!breakdownDiv) return;
        
        let html = '';
        
        // Base training speed
        if (baseTrainingSpeed !== 100) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Base Training Speed:</span>
                    <span class="boost-value">${baseTrainingSpeed.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Alliance Advanced Training bonus
        if (allianceTrainingLevel > 0) {
            const allianceBoost = allianceTrainingLevel * 5;
            html += `
                <div class="boost-item">
                    <span class="boost-label">Alliance Advanced Training Level ${allianceTrainingLevel} (+${allianceBoost}%):</span>
                    <span class="boost-value">+${allianceBoost.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Island Barbecue Stand bonus
        if (islandBarbecueStand > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Island: Barbecue Stand (+${islandBarbecueStand}%):</span>
                    <span class="boost-value">+${islandBarbecueStand.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Island Ski Resort bonus
        if (islandSkiResort > 0) {
            html += `
                <div class="boost-item">
                    <span class="boost-label">Island: Ski Resort (+${islandSkiResort}%):</span>
                    <span class="boost-value">+${islandSkiResort.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Total boost
        html += `
            <div class="boost-total">
                Total Training Speed: ${totalTrainingSpeed.toFixed(2)}%
            </div>
        `;
        
        // Time reduction explanation
        const trainingSpeedIncrease = (totalTrainingSpeed - 100);
        html += `
            <div class="boost-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                <span class="boost-label">Effective Speed Increase:</span>
                <span class="boost-value">+${trainingSpeedIncrease.toFixed(2)}%</span>
            </div>
        `;
        
        
        // Time calculation explanation
        const timeMultiplier = baseTrainingSpeed >= 100 ? (100 / baseTrainingSpeed) : 1;
        const timeReduction = baseTrainingSpeed >= 100 ? ((baseTrainingSpeed - 100) / baseTrainingSpeed * 100) : 0;
        
        html += `
            <div class="boost-total">
                Time Multiplier: ${timeMultiplier.toFixed(3)}x
            </div>
        `;
        
        if (baseTrainingSpeed > 100) {
            html += `
                <div class="boost-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <span class="boost-label">Time Reduction:</span>
                    <span class="boost-value">${timeReduction.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Time per troop information
        const avgTimePerTroop = totalTime > 0 ? totalTime / (planDetails.reduce((sum, plan) => sum + plan.quantity, 0)) : 0;
        html += `
            <div class="boost-item">
                <span class="boost-label">Average Time per Troop:</span>
                <span class="boost-value">${formatTime(avgTimePerTroop)}</span>
            </div>
        `;
        
        // Training capacity information
        html += `
            <div class="boost-item">
                <span class="boost-label">Training Capacity:</span>
                <span class="boost-value">${trainingCapacity} troops per batch</span>
            </div>
        `;
        

        
        breakdownDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error generating troop boost breakdown:', error);
    }
}

function generateTroopPlanBreakdown(planDetails, trainingSpeed, numberOfGroups, timePerGroup, trainingCapacity) {
    try {
        const breakdownDiv = document.getElementById('troop-progress-breakdown');
        if (!breakdownDiv) return;
        
        let html = `
            <div class="progress-item summary">
                <h4>📊 Combined Training Plan Summary</h4>
                <p><strong>Total Combined:</strong> Meat: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.meat, 0))} | Wood: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.wood, 0))} | Coal: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.coal, 0))} | Iron: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.iron, 0))} | Time: ${formatTime(planDetails.reduce((sum, plan) => sum + plan.time, 0))}${trainingSpeed > 0 ? ` (${trainingSpeed}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Add training groups information
        html += `
            <div class="progress-item groups">
                <h4>🔄 Training Information</h4>
                <p><strong>Total Troops:</strong> ${planDetails.reduce((sum, plan) => sum + plan.quantity, 0)} troops</p>
                <p><strong>Number of Batches:</strong> ${numberOfGroups} batches</p>
                <p><strong>Time per Batch:</strong> ${formatTime(timePerGroup)}</p>
            </div>
        `;
        
        // Generate plan-by-plan breakdown
        if (planDetails.length > 0) {
            html += '<div class="plan-breakdown">';
            html += '<h4>📈 Plan-by-Plan Breakdown:</h4>';
            
            planDetails.forEach((plan, index) => {
                const planType = plan.currentLevel < plan.targetLevel ? 'Upgrade' : 'Direct Training';
                const levelRange = plan.currentLevel < plan.targetLevel ? 
                    `Level ${plan.currentLevel} → ${plan.targetLevel}` : 
                    `Level ${plan.targetLevel}`;
                
                html += `
                    <div class="plan-item">
                        <h5>${plan.troopType.charAt(0).toUpperCase() + plan.troopType.slice(1)} ${planType} (${levelRange})</h5>
                        <p><strong>Quantity:</strong> ${plan.quantity} troops | <strong>Time per Troop:</strong> ${formatTime(plan.baseTimePerTroop)} → ${formatTime(plan.timePerTroop)} (${plan.speedMultiplier}x speed) | <strong>Batches for this type:</strong> ${(plan.quantity / trainingCapacity).toFixed(2)}</p>
                        <p><strong>Costs:</strong> Meat: ${formatNumber(plan.meat)} | Wood: ${formatNumber(plan.wood)} | Coal: ${formatNumber(plan.coal)} | Iron: ${formatNumber(plan.iron)} | Time: ${formatTime(plan.time)}</p>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        breakdownDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error generating troop progress breakdown:', error);
    }
}

// Generate comprehensive debug information
function generateTroopDebugInfo(requirements, planDetails, trainingSpeed, allianceTrainingLevel, totalTrainingSpeed, trainingCapacity, totalTimeMinutes) {
    try {
        const debugDiv = document.getElementById('troop-debug-info');
        if (!debugDiv) return;
        
        let debugHtml = '<pre>';
        
        // Time calculation debug
        if (window.timeCalculationDebug) {
            debugHtml += '=== TIME CALCULATION DEBUG ===\n';
            debugHtml += `Input Values: Days=${window.timeCalculationDebug.inputValues.days}, Hours=${window.timeCalculationDebug.inputValues.hours}, Minutes=${window.timeCalculationDebug.inputValues.minutes}\n`;
            debugHtml += `Parsed Values: Days=${window.timeCalculationDebug.parsedValues.totalDays}, Hours=${window.timeCalculationDebug.parsedValues.totalHours}, Minutes=${window.timeCalculationDebug.parsedValues.totalMinutes}\n`;
            debugHtml += `Calculation: ${window.timeCalculationDebug.calculation.daysInMinutes} + ${window.timeCalculationDebug.calculation.hoursInMinutes} + ${window.timeCalculationDebug.calculation.minutes} = ${window.timeCalculationDebug.totalTimeMinutes}\n`;
            debugHtml += `Total Time Type: ${window.timeCalculationDebug.totalTimeMinutesType}\n\n`;
        }
        
        // Input values
        debugHtml += '=== INPUT VALUES ===\n';
        debugHtml += `Base Training Speed: ${trainingSpeed}%\n`;
        debugHtml += `Alliance Advanced Training Level: ${allianceTrainingLevel} (+${allianceTrainingLevel * 5}%)\n`;
        debugHtml += `Total Training Speed: ${totalTrainingSpeed}%\n`;
        debugHtml += `Training Capacity: ${trainingCapacity} troops per batch\n`;
        debugHtml += `Total Time Goal: ${totalTimeMinutes} minutes\n`;
        debugHtml += `Total Time Goal: ${Math.floor(totalTimeMinutes / 1440)} days, ${Math.floor((totalTimeMinutes % 1440) / 60)} hours, ${totalTimeMinutes % 60} minutes\n\n`;
        
        // Troop calculation debug
        if (window.troopCalculationDebug) {
            debugHtml += '=== TROOP CALCULATION DEBUG ===\n';
            window.troopCalculationDebug.forEach(troop => {
                debugHtml += `\n${troop.troopType.toUpperCase()}:\n`;
                debugHtml += `  Target Level: ${troop.targetLevel}\n`;
                debugHtml += `  Split Percentage: ${troop.splitPercentage}%\n`;
                debugHtml += `  Base Time: ${troop.baseTimePerTroop}\n`;
                debugHtml += `  Boosted Time: ${troop.boostedTimePerTroop}\n`;
                debugHtml += `  Boosted Time (min): ${troop.boostedTimePerTroopMinutes}\n`;
                debugHtml += `  Time Allocation: ${troop.timeForThisTroopType}\n`;
                debugHtml += `  Troops That Can Be Trained: ${troop.troopsThatCanBeTrained}\n`;
            });
            debugHtml += '\n';
        }
        
        // Individual troop calculations
        debugHtml += '=== INDIVIDUAL TROOP CALCULATIONS ===\n';
        planDetails.forEach((plan, index) => {
            debugHtml += `\n${plan.troopType.toUpperCase()} (Level ${plan.targetLevel}):\n`;
            debugHtml += `  Base Time Per Troop: ${plan.timePerTroop} seconds\n`;
            debugHtml += `  Time Allocation: ${plan.timeAllocation} minutes\n`;
            debugHtml += `  Troops That Can Be Trained: ${plan.quantity}\n`;
            debugHtml += `  Resource Cost Per Troop: Meat=${Math.round(plan.meat/plan.quantity)}, Wood=${Math.round(plan.wood/plan.quantity)}, Coal=${Math.round(plan.coal/plan.quantity)}, Iron=${Math.round(plan.iron/plan.quantity)}\n`;
            debugHtml += `  Total Resources: Meat=${plan.meat}, Wood=${plan.wood}, Coal=${plan.coal}, Iron=${plan.iron}\n`;
        });
        
        // Batch calculations
        debugHtml += '\n=== BATCH CALCULATIONS ===\n';
        debugHtml += `Total Troops Needed: ${requirements.totalTroops}\n`;
        debugHtml += `Training Capacity Per Batch: ${trainingCapacity} troops\n`;
        debugHtml += `Number of Batches: ${requirements.numberOfGroups}\n`;
        debugHtml += `Time Per Batch: ${requirements.timePerGroup} seconds\n`;
        debugHtml += `Total Training Time: ${requirements.time} seconds\n`;
        
        // Final totals
        debugHtml += '\n=== FINAL TOTALS ===\n';
        debugHtml += `Total Meat: ${requirements.meat}\n`;
        debugHtml += `Total Wood: ${requirements.wood}\n`;
        debugHtml += `Total Coal: ${requirements.coal}\n`;
        debugHtml += `Total Iron: ${requirements.iron}\n`;
        debugHtml += `Total Time: ${requirements.time} seconds (${Math.floor(requirements.time / 60)} minutes, ${Math.floor(requirements.time / 3600)} hours)\n`;
        
        // Raw calculation data
        debugHtml += '\n=== RAW CALCULATION DATA ===\n';
        debugHtml += `JSON.stringify(requirements): ${JSON.stringify(requirements, null, 2)}\n\n`;
        debugHtml += `JSON.stringify(planDetails): ${JSON.stringify(planDetails, null, 2)}\n`;
        
        debugHtml += '</pre>';
        
        debugDiv.innerHTML = debugHtml;
        
    } catch (error) {
        console.error('Error generating troop debug info:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    try {
        
        // Load saved settings
        loadSettings();
        
        // Initialize target level minimum
        updateTargetLevelMin();
        
        // Add tab switching event listeners
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        // Restore the previously active tab
        restoreActiveTab();
        
        // Add event listeners
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateRequirements);
        }
        
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAllValues);
        }
        
            // Add plan strategy change listeners
    const planStrategyRadios = document.querySelectorAll('input[name="plan-strategy"]');
    planStrategyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handlePlanStrategyChange(this.value);
        });
    });
    
    // Add training goal change listeners
    const trainingGoalRadios = document.querySelectorAll('input[name="training-goal"]');
    trainingGoalRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handleTrainingGoalChange(this.value);
        });
    });
    

    
            // Initialize strategy-based display will happen when troops tab is shown
        

        
        // Add troop training event listeners
        const calculateTroopsBtn = document.getElementById('calculate-troops-btn');
        if (calculateTroopsBtn) {
            calculateTroopsBtn.addEventListener('click', calculateTroopRequirements);
        }
        
        const resetTroopsBtn = document.getElementById('reset-troops-btn');
        if (resetTroopsBtn) {
            resetTroopsBtn.addEventListener('click', resetTroopValues);
        }
        
        // Add current level change listener for target level validation
        const currentLevelInput = document.getElementById('current-level');
        if (currentLevelInput) {
            currentLevelInput.addEventListener('input', function() {
                updateTargetLevelMin();
                saveSettings();
            });
        }
        
        // Save settings when inputs change
        const inputs = ['building-level', 'construction-speed', 'pet-skill-builders-aide'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', saveSettings);
            }
        });
        
        // Save troop training settings when inputs change
        const troopInputs = [
            'training-speed', 'alliance-training-level', 'training-capacity',
            'total-days', 'total-hours', 'total-minutes',
            'infantry-split', 'marksman-split', 'lancer-split',
            'infantry-level', 'marksman-level', 'lancer-level',
            'troop-island-barbecue-stand', 'troop-island-ski-resort'
        ];
        troopInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', saveTroopTrainingSettings);
            }
        });
        
        // Save even split checkbox state when changed
        const evenSplitCheckbox = document.getElementById('even-split-checkbox');
        if (evenSplitCheckbox) {
            evenSplitCheckbox.addEventListener('change', saveTroopTrainingSettings);
        }
        
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

// New dependency planning functions based on clean pseudocode logic

function planBuildingDependencies(targetBuilding, startLevel, endLevel, floorLevel) {
    try {
        // 1) Start with target levels (e.g., furnace 20-25)
        const seeds = [];
        for (let level = startLevel; level <= endLevel; level++) {
            seeds.push({ building: targetBuilding, level: level });
        }
        
        // 2) Recursively gather all dependencies
        const allReqs = gatherAllRequirements(seeds);
        
        // 3) Collapse to max level per building
        const maxReqs = collapseToMaxLevel(allReqs);
        
        // 4) Expand to include intermediate levels from floor to max (excluding target building)
        const expanded = expandWithFloor(maxReqs, floorLevel, targetBuilding);
        
        // 5) Add target building levels (only the levels that need to be built: current+1 to target)
        for (let level = startLevel + 1; level <= endLevel; level++) {
            expanded.push({ building: targetBuilding, level: level });
        }
        
        // 6) Sort by building code then level
        expanded.sort((a, b) => {
            if (a.building !== b.building) {
                return a.building.localeCompare(b.building);
            }
            return a.level - b.level;
        });
        
        return expanded;
    } catch (error) {
        console.error('Error planning building dependencies:', error);
        return [];
    }
}

function gatherAllRequirements(seeds) {
    const results = [];
    const visited = new Set();
    const stack = [...seeds];
    
    while (stack.length > 0) {
        const { building, level } = stack.pop();
        
        // Get dependencies for this building at this level
        const buildingData = gameData?.buildings?.[building];
        if (buildingData?.levels?.[level]?.dependencies) {
            const dependencies = buildingData.levels[level].dependencies;
            
            dependencies.forEach(dep => {
                results.push({ building: dep.building, level: dep.level });
                
                const node = `${dep.building}-${dep.level}`;
                if (!visited.has(node)) {
                    visited.add(node);
                    stack.push({ building: dep.building, level: dep.level });
                }
            });
        }
    }
    
    return results;
}

function collapseToMaxLevel(reqs) {
    const maxReqs = {};
    
    reqs.forEach(({ building, level }) => {
        if (!maxReqs[building] || level > maxReqs[building]) {
            maxReqs[building] = level;
        }
    });
    
    return maxReqs;
}

function expandWithFloor(maxReqs, floorLevel, excludeBuilding = null) {
    const expanded = [];
    const floor = Math.max(1, floorLevel);
    
    Object.entries(maxReqs).forEach(([building, reqLevel]) => {
        // Skip the target building - it will be handled separately
        if (building === excludeBuilding) {
            return;
        }
        
        if (reqLevel >= floor) {
            for (let level = floor; level <= reqLevel; level++) {
                expanded.push({ building, level });
            }
        }
    });
    
    return expanded;
}

function calculateDependentBuildingCostsFromPlan(dependencyPlan, constructionSpeedBoost, zinmanResourceReduction = 0) {
    try {
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        
        dependencyPlan.forEach(({ building, level }) => {
            const buildingData = gameData?.buildings?.[building];
            if (!buildingData?.levels?.[level]) return;
            
            // Skip innerCity buildings
            if (buildingData.innerCity) return;
            
            const levelData = buildingData.levels[level];
            const requirements = levelData.requirements || {};
            
            // Apply Zinman resource cost reduction
            const applyZinmanReduction = (value) => {
                return Math.floor(value * (1 - zinmanResourceReduction));
            };
            
            totalMeat += applyZinmanReduction(requirements.meat || 0);
            totalWood += applyZinmanReduction(requirements.wood || 0);
            totalCoal += applyZinmanReduction(requirements.coal || 0);
            totalIron += applyZinmanReduction(requirements.iron || 0);
            
            // Apply speed boost to dependent building time
            const levelTime = applySpeedBoost(levelData.time || 0, constructionSpeedBoost);
            totalTime += levelTime;
        });
        
        return { meat: totalMeat, wood: totalWood, coal: totalCoal, iron: totalIron, time: totalTime };
    } catch (error) {
        console.error('Error calculating costs from plan:', error);
        return { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
    }
}

function generateDependencyBreakdownFromPlan(dependencyPlan, constructionSpeedBoost, currentLevel, buildingBeingUpgraded) {
    try {
        const dependenciesSection = document.getElementById('dependencies-section');
        const breakdownDiv = document.getElementById('dependencies-breakdown');
        
        if (!dependencyPlan || dependencyPlan.length === 0) {
            setElementDisplay('dependencies-section', 'none');
            return;
        }
        
        // Group by building type
        const buildingGroups = {};
        dependencyPlan.forEach(({ building, level }) => {
            if (!buildingGroups[building]) {
                buildingGroups[building] = [];
            }
            buildingGroups[building].push(level);
        });
        
        let html = '<div class="dependency-warning">⚠️ This building requires the following prerequisites (costs included in total):</div>';
        
        Object.entries(buildingGroups).forEach(([buildingCode, levels]) => {
            const building = gameData?.buildings?.[buildingCode];
            if (!building) return;
            
            const isInnerCity = building.innerCity || false;
            const buildingName = building.name || buildingCode;
            const statusText = isInnerCity ? " (Inner City - Cost Not Included)" : "";
            
            // Calculate costs for this building
            let cost = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            levels.forEach(level => {
                if (building.levels?.[level]) {
                    const levelData = building.levels[level];
                    const requirements = levelData.requirements || {};
                    
                    cost.meat += requirements.meat || 0;
                    cost.wood += requirements.wood || 0;
                    cost.coal += requirements.coal || 0;
                    cost.iron += requirements.iron || 0;
                    cost.time += levelData.time || 0;
                }
            });
            
            const minLevel = Math.min(...levels);
            const maxLevel = Math.max(...levels);
            const displayLevel = minLevel === maxLevel ? `Level ${minLevel}` : `Levels ${minLevel}-${maxLevel}`;
            
            const boostedTime = applySpeedBoost(cost.time, constructionSpeedBoost);
            const boostText = constructionSpeedBoost > 0 ? ` (${constructionSpeedBoost}% boost applied)` : '';
            
            html += `
                <div class="dependency-item">
                    <div class="dependency-header">
                        <h4>${buildingName} (${displayLevel})${statusText}</h4>
                        <span class="dependency-cost">Total Cost: ${formatNumber(cost.meat || 0)} Meat, ${formatNumber(cost.wood || 0)} Wood, ${formatNumber(cost.coal || 0)} Coal, ${formatNumber(cost.iron || 0)} Iron</span>
                    </div>
                    <div class="dependency-details">
                        <p><strong>Time Required:</strong> ${formatTime(boostedTime)}${boostText}</p>
                        <p><strong>Resource Breakdown:</strong></p>
                        <div class="dependency-resources">
                            <span class="resource-item"><i class="fas fa-utensils"></i> Meat: ${formatNumber(cost.meat || 0)}</span>
                            <span class="resource-item"><i class="fas fa-tree"></i> Wood: ${formatNumber(cost.wood || 0)}</span>
                            <span class="resource-item"><i class="fas fa-fire"></i> Coal: ${formatNumber(cost.coal || 0)}</span>
                            <span class="resource-item"><i class="fas fa-hammer"></i> Iron: ${formatNumber(cost.iron || 0)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (breakdownDiv) {
            breakdownDiv.innerHTML = html;
        }
        setElementDisplay('dependencies-section', 'block');
        
    } catch (error) {
        console.error('Error generating dependency breakdown from plan:', error);
    }
}

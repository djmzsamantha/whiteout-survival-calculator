// Whiteout Survivor Calculator - Logic

// Constants
const MIN_LEVEL = 20;
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
    }
    return `${mins}m`;
}

function applySpeedBoost(time, boostPercentage) {
    if (typeof time !== 'number' || isNaN(time) || time < 0) return 0;
    if (typeof boostPercentage !== 'number' || isNaN(boostPercentage) || boostPercentage <= 0) return time;
    
    return Math.floor(time * (boostPercentage / 100));
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
        const constructionSpeedBoost = getInputValue('construction-speed', 0, 0, 100);
        const buildingType = document.getElementById('building-type')?.value || 'furnace';
        const targetLevel = getInputValue('building-level', 1, 1, MAX_LEVEL);
        
        // Validate inputs
        if (currentLevel < MIN_LEVEL || currentLevel > MAX_LEVEL) {
            alert(`Current level must be between ${MIN_LEVEL} and ${MAX_LEVEL}`);
            return;
        }
        
        if (targetLevel < 1 || targetLevel > MAX_LEVEL) {
            alert(`Target level must be between 1 and ${MAX_LEVEL}`);
            return;
        }
        
        if (currentLevel >= targetLevel) {
            // Same level or current higher than target - no requirements
            const requirements = {
                food: 0,
                wood: 0,
                coal: 0,
                iron: 0,
                time: 0
            };
            
            updateResultsDisplay(requirements, currentLevel, targetLevel, constructionSpeedBoost);
            return;
        }
        
        // Initialize totals
        let totalFood = 0;
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        let allDependencies = [];
        
        // Calculate cumulative requirements for each level from current to target
        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            let levelRequirements = { food: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            
            if (buildingType === 'furnace') {
                // Special handling for furnace with its level-specific requirements
                if (gameData?.buildings?.furnace?.levels?.[level]) {
                    const levelData = gameData.buildings.furnace.levels[level];
                    levelRequirements = { ...levelData.requirements };
                    levelRequirements.time = levelData.time || 0;
                    if (levelData.dependencies) {
                        allDependencies = allDependencies.concat(levelData.dependencies);
                    }
                }
            } else {
                // For other buildings, use the old calculation method
                const building = gameData?.buildings?.[buildingType];
                if (!building) continue;
                
                // Skip inner city buildings
                if (building.innerCity) continue;
                
                // Handle one-time cost buildings
                if (building.oneTimeCost && level === 1) {
                    levelRequirements = { ...building.baseCost };
                } else if (building.levels?.[level]) {
                    // Use new level-specific data if available
                    const levelData = building.levels[level];
                    levelRequirements = { ...levelData.requirements };
                    levelRequirements.time = levelData.time || 0;
                } else if (building.baseCost && building.multiplier) {
                    // Use old multiplier-based calculation
                    for (const resource in building.baseCost) {
                        levelRequirements[resource] = Math.floor(building.baseCost[resource] * Math.pow(building.multiplier, level - 1));
                    }
                }
            }
            
            // Apply speed boost to this level's time
            const levelTime = applySpeedBoost(levelRequirements.time || 0, constructionSpeedBoost);
            
            // Add to totals
            totalFood += levelRequirements.food || 0;
            totalMeat += levelRequirements.meat || 0;
            totalWood += levelRequirements.wood || 0;
            totalCoal += levelRequirements.coal || 0;
            totalIron += levelRequirements.iron || 0;
            totalTime += levelTime;
        }
        
        // Calculate dependent building costs
        const dependentBuildingCosts = calculateDependentBuildingCosts(allDependencies, constructionSpeedBoost);
        
        totalFood += dependentBuildingCosts.food || 0;
        totalMeat += dependentBuildingCosts.meat || 0;
        totalWood += dependentBuildingCosts.wood || 0;
        totalCoal += dependentBuildingCosts.coal || 0;
        totalIron += dependentBuildingCosts.iron || 0;
        totalTime += dependentBuildingCosts.time || 0;
        
        // Create net requirements object
        const netRequirements = {
            food: totalFood + totalMeat, // Combine food and meat
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime,
            dependencies: allDependencies
        };
        
        // Show dependencies if they exist
        if (netRequirements.dependencies && netRequirements.dependencies.length > 0) {
            generateDependencyBreakdown(netRequirements.dependencies, constructionSpeedBoost);
        }
        
        // Update the display
        updateResultsDisplay(netRequirements, currentLevel, targetLevel, constructionSpeedBoost);
        
    } catch (error) {
        console.error('Error in calculateRequirements:', error);
        alert('An error occurred while calculating requirements. Please try again.');
    }
}

function calculateDependentBuildingCosts(dependencies, constructionSpeedBoost) {
    try {
        if (!Array.isArray(dependencies) || dependencies.length === 0) {
            return { food: 0, meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
        }
        
        let totalFood = 0;
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
            
            // Get the building data
            const building = gameData?.buildings?.[buildingType];
            if (!building) {
                return;
            }
            
            // Skip innerCity buildings as they are excluded from calculations
            if (building.innerCity) {
                return;
            }
            
            // Calculate the cost for the required level
            if (building.levels?.[requiredLevel]) {
                const levelData = building.levels[requiredLevel];
                const requirements = levelData.requirements || {};
                
                totalFood += requirements.food || 0;
                totalMeat += requirements.meat || 0;
                totalWood += requirements.wood || 0;
                totalCoal += requirements.coal || 0;
                totalIron += requirements.iron || 0;
                
                // Apply speed boost to dependent building time
                const levelTime = applySpeedBoost(levelData.time || 0, constructionSpeedBoost);
                totalTime += levelTime;
            }
        });
        
        return {
            food: totalFood,
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime
        };
    } catch (error) {
        console.error('Error calculating dependent building costs:', error);
        return { food: 0, meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
    }
}

function generateDependencyBreakdown(dependencies, constructionSpeedBoost = 0) {
    try {
        const dependenciesSection = document.getElementById('dependencies-section');
        const breakdownDiv = document.getElementById('dependencies-breakdown');
        
        if (!dependencies || dependencies.length === 0) {
            setElementDisplay('dependencies-section', 'none');
            return;
        }
        
        let html = '<div class="dependency-warning">⚠️ This building requires the following prerequisites (costs included in total):</div>';
        
        dependencies.forEach(dep => {
            if (!dep || typeof dep !== 'object' || !dep.building || typeof dep.level !== 'number') {
                return;
            }
            
            const buildingType = dep.building;
            const requiredLevel = dep.level;
            
            // Get the building data and calculate actual costs
            const building = gameData?.buildings?.[buildingType];
            let cost = { food: 0, meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            let isInnerCity = false;
            
            if (building) {
                isInnerCity = building.innerCity || false;
                
                if (building.levels?.[requiredLevel]) {
                    const levelData = building.levels[requiredLevel];
                    cost = { ...levelData.requirements };
                    cost.time = levelData.time || 0;
                }
            }
            
            const buildingName = building ? building.name : buildingType;
            const statusText = isInnerCity ? " (Inner City - Cost Not Included)" : " (Cost Included in Total)";
            const boostedTime = applySpeedBoost(cost.time, constructionSpeedBoost);
            const boostText = constructionSpeedBoost > 0 ? ` (${constructionSpeedBoost}% boost applied)` : '';
            
            html += `
                <div class="dependency-item">
                    <div class="dependency-header">
                        <h4>${buildingName} (Level ${requiredLevel})${statusText}</h4>
                        <span class="dependency-cost">Cost: ${formatNumber(cost.meat || cost.food || 0)} Meat, ${formatNumber(cost.wood || 0)} Wood, ${formatNumber(cost.coal || 0)} Coal, ${formatNumber(cost.iron || 0)} Iron</span>
                    </div>
                    <div class="dependency-details">
                        <p><strong>Time Required:</strong> ${formatTime(boostedTime)}${boostText}</p>
                        <p><strong>Resource Breakdown:</strong></p>
                        <div class="dependency-resources">
                            <span class="resource-item"><i class="fas fa-utensils"></i> Meat: ${formatNumber(cost.meat || cost.food || 0)}</span>
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

function updateResultsDisplay(requirements, currentLevel, targetLevel, boostPercentage) {
    try {
        // Update the main results
        setElementText('meat-needed', formatNumber(requirements.food));
        setElementText('wood-needed', formatNumber(requirements.wood));
        setElementText('coal-needed', formatNumber(requirements.coal));
        setElementText('iron-needed', formatNumber(requirements.iron));
        setElementText('time-required', formatTime(requirements.time));
        
        // Generate progress breakdown
        generateProgressBreakdown(requirements, currentLevel, targetLevel, boostPercentage);
        
        // Show the results section
        setElementDisplay('results-section', 'block');
        
    } catch (error) {
        console.error('Error updating results display:', error);
    }
}

function generateProgressBreakdown(requirements, currentLevel, targetLevel, boostPercentage) {
    try {
        const breakdownDiv = document.getElementById('progress-breakdown');
        if (!breakdownDiv) return;
        
        let html = `
            <div class="progress-item summary">
                <h4>📊 Cumulative Requirements (Level ${currentLevel} → ${targetLevel})</h4>
                <p><strong>Total (includes dependent building costs):</strong> Meat: ${formatNumber(requirements.food)} | Wood: ${formatNumber(requirements.wood)} | Coal: ${formatNumber(requirements.coal)} | Iron: ${formatNumber(requirements.iron)} | Time: ${formatTime(requirements.time)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Generate level-by-level breakdown
        if (currentLevel + 1 <= targetLevel) {
            html += '<div class="level-breakdown">';
            html += '<h4>📈 Level-by-Level Breakdown:</h4>';
            
            for (let level = currentLevel + 1; level <= targetLevel; level++) {
                let levelRequirements = { food: 0, wood: 0, coal: 0, iron: 0, time: 0 };
                
                if (gameData?.buildings?.furnace?.levels?.[level]) {
                    const levelData = gameData.buildings.furnace.levels[level];
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

// Local storage functions
function saveSettings() {
    try {
        const settings = {
            currentLevel: getInputValue('current-level', MIN_LEVEL),
            targetLevel: getInputValue('building-level', 1),
            constructionSpeed: getInputValue('construction-speed', 0)
        };
        
        localStorage.setItem('woCalculatorSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
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
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Load saved settings
        loadSettings();
        
        // Add event listeners
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateRequirements);
        }
        
        // Save settings when inputs change
        const inputs = ['current-level', 'building-level', 'construction-speed'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', saveSettings);
            }
        });
        
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

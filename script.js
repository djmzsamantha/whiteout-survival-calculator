// Whiteout Survivor Calculator - Logic and UI

// Constants
const MIN_LEVEL = 20;
const MAX_LEVEL = 30;
const MINUTES_PER_DAY = 1440;
const MINUTES_PER_HOUR = 60;

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(minutes) {
    const days = Math.floor(minutes / MINUTES_PER_DAY);
    const hours = Math.floor((minutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
    const mins = minutes % MINUTES_PER_HOUR;
    
    if (days > 0) {
        return `${days}d ${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function applySpeedBoost(time, boostPercentage) {
    if (boostPercentage > 0) {
        return Math.floor(time * (boostPercentage / 100));
    }
    return time;
}

function calculateBuildingCost(buildingType, level) {
    let building = gameData.buildings[buildingType];
    
    // Handle consolidated shelters
    if (buildingType.startsWith('shelter') && buildingType !== 'shelterTemplate') {
        const shelterNumber = parseInt(buildingType.replace('shelter', ''));
        building = { ...gameData.buildings.shelterTemplate };
        building.name = `Shelter ${shelterNumber}`;
        
        // Override subcomponent name for even-numbered shelters
        if (shelterNumber % 2 === 0) {
            building.subcomponents[1].name = "Desk";
            building.subcomponents[1].cost.wood = 1000;
        } else {
            building.subcomponents[1].name = "Bunk Bed";
            building.subcomponents[1].cost.wood = 1100;
        }
        
        // Update furnace requirements based on shelter number
        if (building.levelUpgrades && building.levelUpgrades[2]) {
            building.levelUpgrades[2].requirements.furnace = gameData.buildings.shelterRequirements[shelterNumber] || shelterNumber;
        }
    }
    
    if (!building) return null;
    
    // Ignore inner city buildings
    if (building.innerCity) {
        return null;
    }
    
    // Handle one-time cost buildings
    if (building.oneTimeCost) {
        if (building.levels && building.levels[1]) {
            return { ...building.levels[1].requirements };
        }
        return null;
    }
    
    // Handle shelter level upgrades
    if (building.isShelter && building.levelUpgrades && building.levelUpgrades[level]) {
        return { ...building.levelUpgrades[level].cost };
    }
    
    // Handle buildings with subcomponents
    if (building.hasSubcomponents && building.subcomponents[level]) {
        return { ...building.subcomponents[level].cost };
    }
    
    // Handle buildings with explicit levels
    if (building.levels && building.levels[level]) {
        return { ...building.levels[level].requirements };
    }
    
    // Fallback to old format if levels don't exist
    if (building.baseCost && building.multiplier) {
        const cost = {};
        for (const resource in building.baseCost) {
            cost[resource] = Math.floor(building.baseCost[resource] * Math.pow(building.multiplier, level - 1));
        }
        return cost;
    }
    
    return null;
}

// Main calculation function
function calculateRequirements() {
    try {
        const currentLevel = parseInt(document.getElementById('current-level').value) || MIN_LEVEL;
        const constructionSpeedBoost = Math.max(0, Math.min(100, parseInt(document.getElementById('construction-speed').value) || 0));
        const buildingType = document.getElementById('building-type').value;
        const targetLevel = parseInt(document.getElementById('building-level').value) || 1;
        
        // Validate inputs
        if (currentLevel < MIN_LEVEL) {
            alert(`Current level must be at least ${MIN_LEVEL}`);
            return;
        }
        
        if (currentLevel > targetLevel) {
            alert('Target level must be higher than or equal to current level');
            return;
        }
        
        // If current level equals target level, no upgrade needed
        if (currentLevel === targetLevel) {
            const netRequirements = {
                meat: 0,
                wood: 0,
                coal: 0,
                iron: 0,
                time: 0,
                dependencies: [],
                levelRange: { from: currentLevel, to: targetLevel }
            };
            
            updateResultsDisplay(netRequirements, constructionSpeedBoost);
            document.getElementById('results-section').style.display = 'block';
            
            // Show message that no upgrade is needed
            const breakdownDiv = document.getElementById('progress-breakdown');
            breakdownDiv.innerHTML = `
                <div class="progress-item summary">
                    <h4>📊 No Upgrade Required</h4>
                    <p>You are already at level ${currentLevel}. No resources or time needed.</p>
                </div>
            `;
            
            return;
        }
        
        // Initialize cumulative totals
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        let allDependencies = [];
        
        // Calculate cumulative requirements for each level from current to target
        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            let levelRequirements = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            
            if (buildingType === 'furnace') {
                // Special handling for furnace with its level-specific requirements
                if (gameData.buildings.furnace.levels[level]) {
                    const levelData = gameData.buildings.furnace.levels[level];
                    levelRequirements = levelData.requirements;
                    levelRequirements.time = levelData.time;
                    if (levelData.dependencies) {
                        allDependencies = allDependencies.concat(levelData.dependencies);
                    }
                }
            } else {
                const buildingCost = calculateBuildingCost(buildingType, level);
                if (buildingCost) {
                    levelRequirements = buildingCost;
                }
                
                // Get time from levels if available
                const building = gameData.buildings[buildingType];
                if (building && building.levels && building.levels[level]) {
                    levelRequirements.time = building.levels[level].time;
                    if (building.levels[level].dependencies) {
                        allDependencies = allDependencies.concat(building.levels[level].dependencies);
                    }
                }
            }
            
            // Apply speed boost to this level's time before adding to totals
            const levelTime = applySpeedBoost(levelRequirements.time || 0, constructionSpeedBoost);
            
            // Add this level's requirements to totals
            totalMeat += levelRequirements.meat || 0;
            totalWood += levelRequirements.wood || 0;
            totalCoal += levelRequirements.coal || 0;
            totalIron += levelRequirements.iron || 0;
            totalTime += levelTime;
        }
        
        const netRequirements = {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime,
            dependencies: allDependencies,
            levelRange: { from: currentLevel + 1, to: targetLevel }
        };
        
        // Update UI
        updateResultsDisplay(netRequirements, constructionSpeedBoost);
        
        // Show results
        document.getElementById('results-section').style.display = 'block';
        
        // Generate progress breakdown
        generateProgressBreakdown(currentLevel, netRequirements, constructionSpeedBoost);
        
        // Show dependencies if they exist
        if (netRequirements.dependencies && netRequirements.dependencies.length > 0) {
            generateDependencyBreakdown(netRequirements.dependencies);
        }
    } catch (error) {
        console.error('Error in calculateRequirements:', error);
        alert('An error occurred while calculating requirements. Please try again.');
    }
}

function updateResultsDisplay(requirements, boostPercentage) {
    try {
        document.getElementById('meat-needed').textContent = formatNumber(requirements.meat);
        document.getElementById('wood-needed').textContent = formatNumber(requirements.wood);
        document.getElementById('coal-needed').textContent = formatNumber(requirements.coal);
        document.getElementById('iron-needed').textContent = formatNumber(requirements.iron);
        
        // Show time with boost information if applicable
        if (boostPercentage > 0) {
            document.getElementById('time-required').textContent = `${formatTime(requirements.time)} (${boostPercentage}% boost applied)`;
        } else {
            document.getElementById('time-required').textContent = formatTime(requirements.time);
        }
    } catch (error) {
        console.error('Error updating results display:', error);
    }
}

function generateProgressBreakdown(currentLevel, requirements, boostPercentage) {
    try {
        const breakdownDiv = document.getElementById('progress-breakdown');
        const buildingType = document.getElementById('building-type').value;
        const targetLevel = parseInt(document.getElementById('building-level').value);
        
        let html = `
            <div class="progress-item summary">
                <h4>📊 Cumulative Requirements (Level ${currentLevel} → ${targetLevel})</h4>
                <p><strong>Total:</strong> Meat: ${formatNumber(requirements.meat)} | Wood: ${formatNumber(requirements.wood)} | Coal: ${formatNumber(requirements.coal)} | Iron: ${formatNumber(requirements.iron)} | Time: ${formatTime(requirements.time)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Show individual level breakdown
        if (requirements.levelRange && requirements.levelRange.from <= requirements.levelRange.to) {
            html += '<div class="level-breakdown">';
            html += '<h5>📋 Level-by-Level Breakdown:</h5>';
            
            for (let level = requirements.levelRange.from; level <= requirements.levelRange.to; level++) {
                let levelRequirements = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
                
                if (buildingType === 'furnace') {
                    if (gameData.buildings.furnace.levels[level]) {
                        const levelData = gameData.buildings.furnace.levels[level];
                        levelRequirements = levelData.requirements;
                        levelRequirements.time = levelData.time;
                    }
                } else {
                    const buildingCost = calculateBuildingCost(buildingType, level);
                    if (buildingCost) {
                        levelRequirements = buildingCost;
                    }
                    
                    // Get time from levels if available
                    const building = gameData.buildings[buildingType];
                    if (building && building.levels && building.levels[level]) {
                        levelRequirements.time = building.levels[level].time;
                    }
                }
                
                const displayTime = applySpeedBoost(levelRequirements.time || 0, boostPercentage);
                
                html += `
                    <div class="level-item">
                        <h6>Level ${level}:</h6>
                        <p>Meat: ${formatNumber(levelRequirements.meat || 0)} | Wood: ${formatNumber(levelRequirements.wood || 0)} | Coal: ${formatNumber(levelRequirements.coal || 0)} | Iron: ${formatNumber(levelRequirements.iron || 0)} | Time: ${formatTime(displayTime)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
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

function generateDependencyBreakdown(dependencies) {
    try {
        const dependenciesSection = document.getElementById('dependencies-section');
        const breakdownDiv = document.getElementById('dependencies-breakdown');
        
        let html = '<div class="dependency-warning">⚠️ This building requires the following prerequisites:</div>';
        
        dependencies.forEach(dep => {
            html += `
                <div class="dependency-item">
                    <div class="dependency-header">
                        <h4>${dep.name} (Level ${dep.requiredLevel})</h4>
                        <span class="dependency-cost">Total Cost: ${formatNumber(dep.cost.meat)} Meat, ${formatNumber(dep.cost.wood)} Wood, ${formatNumber(dep.cost.coal)} Coal, ${formatNumber(dep.cost.iron)} Iron</span>
                    </div>
                    <div class="dependency-details">
                        <p><strong>Time Required:</strong> ${formatTime(dep.cost.time)}</p>
                        <p><strong>Resource Breakdown:</strong></p>
                        <div class="dependency-resources">
                            <span class="resource-item"><i class="fas fa-utensils"></i> Meat: ${formatNumber(dep.cost.meat)}</span>
                            <span class="resource-item"><i class="fas fa-tree"></i> Wood: ${formatNumber(dep.cost.wood)}</span>
                            <span class="resource-item"><i class="fas fa-fire"></i> Coal: ${formatNumber(dep.cost.coal)}</span>
                            <span class="resource-item"><i class="fas fa-hammer"></i> Iron: ${formatNumber(dep.cost.iron)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        breakdownDiv.innerHTML = html;
        dependenciesSection.style.display = 'block';
    } catch (error) {
        console.error('Error generating dependency breakdown:', error);
    }
}

// Settings management functions
function saveSettings() {
    try {
        const settings = {
            currentLevel: document.getElementById('current-level').value,
            constructionSpeed: document.getElementById('construction-speed').value,
            buildingType: 'furnace',
            buildingLevel: document.getElementById('building-level').value
        };
        
        localStorage.setItem('woCalculatorSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function loadSavedSettings() {
    try {
        const savedSettings = localStorage.getItem('woCalculatorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Restore values
            if (settings.currentLevel) {
                document.getElementById('current-level').value = settings.currentLevel;
            }
            if (settings.constructionSpeed) {
                document.getElementById('construction-speed').value = settings.constructionSpeed;
            }
            if (settings.buildingLevel) {
                document.getElementById('building-level').value = settings.buildingLevel;
            }
            
            // Always set building type to furnace and trigger change event
            document.getElementById('building-type').value = 'furnace';
            document.getElementById('building-type').dispatchEvent(new Event('change'));
        } else {
            // If no saved settings, set defaults with furnace as main goal
            document.getElementById('building-type').value = 'furnace';
            document.getElementById('building-type').dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Error loading saved settings:', error);
        // Set defaults on error
        document.getElementById('building-type').value = 'furnace';
        document.getElementById('building-type').dispatchEvent(new Event('change'));
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Load saved settings from localStorage
        loadSavedSettings();
        
        // Main calculate button
        document.getElementById('calculate-btn').addEventListener('click', calculateRequirements);
        
        // Building type change handler
        document.getElementById('building-type').addEventListener('change', function() {
            const buildingType = this.value;
            const buildingLevelInput = document.getElementById('building-level');
            const levelNote = document.querySelector('.level-note');
            
            // This part of the logic needs to be refactored to accept gameData as an argument
            // For now, it will just set the max level and show/hide the note
            if (buildingType && gameData.buildings[buildingType]) {
                const building = gameData.buildings[buildingType];
                
                if (building.oneTimeCost) {
                    buildingLevelInput.value = 1;
                    buildingLevelInput.max = 1;
                    buildingLevelInput.disabled = true;
                    levelNote.style.display = 'none';
                } else if (building.maxLevel === "furnace") {
                    buildingLevelInput.disabled = false;
                    buildingLevelInput.max = MAX_LEVEL;
                    levelNote.style.display = 'block';
                } else if (building.maxLevel) {
                    buildingLevelInput.disabled = false;
                    buildingLevelInput.max = building.maxLevel;
                    levelNote.style.display = 'none';
                } else {
                    buildingLevelInput.disabled = false;
                    buildingLevelInput.max = MAX_LEVEL;
                    levelNote.style.display = 'none';
                }
            }
            
            saveSettings();
        });
        
        // Add event listeners to save settings when inputs change
        const inputsToSave = ['current-level', 'construction-speed', 'building-level'];
        inputsToSave.forEach(id => {
            document.getElementById(id).addEventListener('input', saveSettings);
        });
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

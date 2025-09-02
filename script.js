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
    }
    return `${mins}m`;
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
        
        // Get input values
        const vicePresident = document.getElementById('vice-president')?.checked || false;
        const zinmanLevel = getInputValue('zinman-level', 0, 0, 5);
        const chiefOrderDoubleTime = document.getElementById('chief-order-double-time')?.checked || false;
        
        // Calculate speed boost
        let totalSpeedBoost = constructionSpeedBoost;
        if (vicePresident) {
            totalSpeedBoost -= 10; // VP reduces time by 10% (makes it faster)
        }
        if (chiefOrderDoubleTime) {
            totalSpeedBoost -= 20; // Chief Order reduces time by 20% (makes it faster)
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
        
        // Calculate cumulative requirements for each level from current to target
        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            let levelRequirements = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
            
            // Get furnace level requirements
            if (gameData?.buildings?.furnace?.levels?.[level]) {
                const levelData = gameData.buildings.furnace.levels[level];
                levelRequirements = { ...levelData.requirements };
                levelRequirements.time = levelData.time || 0;
                if (levelData.dependencies) {
                    allDependencies = allDependencies.concat(levelData.dependencies);
                }
            }
            
            // Apply speed boost to this level's time
            const levelTime = applySpeedBoost(levelRequirements.time || 0, totalSpeedBoost);
            
            // Apply Zinman resource cost reduction
            const applyZinmanReduction = (value) => {
                return Math.floor(value * (1 - zinmanResourceReduction));
            };
            
            // Add to totals (with Zinman reduction applied)
            totalMeat += applyZinmanReduction(levelRequirements.meat || 0);
            totalWood += applyZinmanReduction(levelRequirements.wood || 0);
            totalCoal += applyZinmanReduction(levelRequirements.coal || 0);
            totalIron += applyZinmanReduction(levelRequirements.iron || 0);
            totalTime += levelTime;
        }
        
        // Calculate dependent building costs
        const dependentBuildingCosts = calculateDependentBuildingCosts(allDependencies, totalSpeedBoost, zinmanResourceReduction);
        
        totalMeat += dependentBuildingCosts.meat || 0;
        totalWood += dependentBuildingCosts.wood || 0;
        totalCoal += dependentBuildingCosts.coal || 0;
        totalIron += dependentBuildingCosts.iron || 0;
        totalTime += dependentBuildingCosts.time || 0;
        
        // Create net requirements object
        const netRequirements = {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: totalTime,
            dependencies: allDependencies
        };
        
        // Show dependencies if they exist
        if (netRequirements.dependencies && netRequirements.dependencies.length > 0) {
            generateDependencyBreakdown(netRequirements.dependencies, totalSpeedBoost);
        }
        
        // Update the display
        updateResultsDisplay(netRequirements, currentLevel, targetLevel, totalSpeedBoost, constructionSpeedBoost, vicePresident, chiefOrderDoubleTime);
        
    } catch (error) {
        console.error('Error in calculateRequirements:', error);
        console.error('Error stack:', error.stack);
        console.error('Current values:', { currentLevel, targetLevel, totalSpeedBoost, zinmanResourceReduction });
        alert('An error occurred while calculating requirements. Please try again.');
    }
}

function calculateDependentBuildingCosts(dependencies, constructionSpeedBoost, zinmanResourceReduction = 0) {
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
            let cost = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
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
                        <span class="dependency-cost">Cost: ${formatNumber(cost.meat || 0)} Meat, ${formatNumber(cost.wood || 0)} Wood, ${formatNumber(cost.coal || 0)} Coal, ${formatNumber(cost.iron || 0)} Iron</span>
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

function updateResultsDisplay(requirements, currentLevel, targetLevel, boostPercentage, constructionSpeedBoost, vicePresident, chiefOrderDoubleTime) {
    try {
        // Update the main results
        setElementText('food-needed', formatNumber(requirements.meat));
        setElementText('wood-needed', formatNumber(requirements.wood));
        setElementText('coal-needed', formatNumber(requirements.coal));
        setElementText('iron-needed', formatNumber(requirements.iron));
        setElementText('time-required', formatTime(requirements.time));
        
        // Generate boost breakdown
        generateBoostBreakdown(constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, boostPercentage);
        
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
                <p><strong>Total (includes dependent building costs):</strong> Meat: ${formatNumber(requirements.meat)} | Wood: ${formatNumber(requirements.wood)} | Coal: ${formatNumber(requirements.coal)} | Iron: ${formatNumber(requirements.iron)} | Time: ${formatTime(requirements.time)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Generate level-by-level breakdown
        if (currentLevel + 1 <= targetLevel) {
            html += '<div class="level-breakdown">';
            html += '<h4>📈 Level-by-Level Breakdown:</h4>';
            
            for (let level = currentLevel + 1; level <= targetLevel; level++) {
                let levelRequirements = { meat: 0, wood: 0, coal: 0, iron: 0, time: 0 };
                
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

function generateBoostBreakdown(constructionSpeedBoost, vicePresident, chiefOrderDoubleTime, totalSpeedBoost) {
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
        const troopTypeSelect = document.getElementById('troop-type');
        if (troopTypeSelect) troopTypeSelect.value = 'infantryCamp';
        
        const currentLevelInput = document.getElementById('troop-current-level');
        if (currentLevelInput) currentLevelInput.value = '1';
        
        const targetLevelInput = document.getElementById('troop-target-level');
        if (targetLevelInput) targetLevelInput.value = '1';
        
        const trainingSpeedInput = document.getElementById('training-speed');
        if (trainingSpeedInput) trainingSpeedInput.value = '100';
        
        const trainingCapacityInput = document.getElementById('training-capacity');
        if (trainingCapacityInput) trainingCapacityInput.value = '1';
        
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

    // Plan strategy handling
    function handlePlanStrategyChange(strategy) {
        try {
            console.log('Plan strategy changed to:', strategy);
            
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
            
            // Show/hide current level fields based on strategy
            const currentLevelFields = document.querySelectorAll('.upgrade-field');
            currentLevelFields.forEach(field => {
                field.style.display = strategy === 'upgrade' || strategy === 'both' ? 'flex' : 'none';
            });
            
            // Show/hide quantity vs time fields based on training goal
            updateTrainingGoalDisplay();
            
        } catch (error) {
            console.error('Error handling plan strategy change:', error);
        }
    }

// Training goal handling
function handleTrainingGoalChange(goal) {
    try {
        console.log('Training goal changed to:', goal);
        updateTrainingGoalDisplay();
    } catch (error) {
        console.error('Error handling training goal change:', error);
    }
}

// Update display based on training goal
function updateTrainingGoalDisplay() {
    const strategy = document.querySelector('input[name="plan-strategy"]:checked')?.value;
    const goal = document.querySelector('input[name="training-goal"]:checked')?.value;
    
    if (strategy === 'train') {
        const quantityFields = document.querySelectorAll('.quantity-field');
        const timeFields = document.querySelectorAll('.time-field');
        
        quantityFields.forEach(field => {
            field.style.display = goal === 'quantity' ? 'flex' : 'none';
        });
        
        timeFields.forEach(field => {
            field.style.display = goal === 'time' ? 'flex' : 'none';
        });
    }
}

// Tab switching functionality
function restoreActiveTab() {
    try {
        const savedTab = localStorage.getItem('wo_calculator_active_tab');
        if (savedTab && (savedTab === 'construction' || savedTab === 'troops')) {
            console.log('Restoring active tab:', savedTab);
            switchTab(savedTab);
        } else {
            // Default to construction tab if no saved tab or invalid value
            console.log('No saved tab found, defaulting to construction');
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
        const tabs = ['construction-tab', 'troops-tab'];
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
                return tierData.time || 0;
            } else {
                return tierData.requirements[resourceType] || 0;
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
        console.log('Starting troop requirements calculation...');
        
        const trainingSpeed = getDecimalInputValue('training-speed', 100, 0, 500);
        const trainingCapacity = getInputValue('training-capacity', 1, 1, 100);
        
        // Get strategy and training goal
        const strategy = document.querySelector('input[name="plan-strategy"]:checked')?.value;
        const trainingGoal = document.querySelector('input[name="training-goal"]:checked')?.value;
        
        console.log('Strategy:', strategy, 'Training Goal:', trainingGoal);
        
        // Initialize combined totals
        let totalMeat = 0;
        let totalWood = 0;
        let totalCoal = 0;
        let totalIron = 0;
        let totalTime = 0;
        
        // Get all troop plans
        const troopPlans = document.querySelectorAll('.troop-plan');
        const planDetails = [];
        
        troopPlans.forEach(plan => {
            const troopType = plan.getAttribute('data-troop');
            const currentLevel = parseInt(plan.querySelector('.current-level')?.value || 1);
            const targetLevel = parseInt(plan.querySelector('.target-level')?.value || 1);
            const quantity = parseInt(plan.querySelector('.quantity')?.value || 1);
            const trainingTime = parseFloat(plan.querySelector('.training-time')?.value || 1);
            
            console.log(`Processing ${troopType} plan:`, { currentLevel, targetLevel, quantity, trainingTime });
            
            // Calculate costs for this plan
            let planMeat = 0;
            let planWood = 0;
            let planCoal = 0;
            let planIron = 0;
            let planTime = 0;
            let actualQuantity = quantity;
            
            if (strategy === 'upgrade' || strategy === 'both') {
                // Calculate upgrade costs (sum of all levels from current to target-1)
                if (currentLevel < targetLevel) {
                    for (let level = currentLevel + 1; level <= targetLevel; level++) {
                        planMeat += getTroopLevelCost(troopType, level, 'meat');
                        planWood += getTroopLevelCost(troopType, level, 'wood');
                        planCoal += getTroopLevelCost(troopType, level, 'coal');
                        planIron += getTroopLevelCost(troopType, level, 'iron');
                        planTime += getTroopLevelCost(troopType, level, 'time');
                    }
                    
                    // Multiply by quantity
                    planMeat *= quantity;
                    planWood *= quantity;
                    planCoal *= quantity;
                    planIron *= quantity;
                    planTime *= quantity;
                }
            } else if (strategy === 'train') {
                // Calculate direct training costs (target level only)
                const levelRequirements = {
                    meat: getTroopLevelCost(troopType, targetLevel, 'meat'),
                    wood: getTroopLevelCost(troopType, targetLevel, 'wood'),
                    coal: getTroopLevelCost(troopType, targetLevel, 'coal'),
                    iron: getTroopLevelCost(troopType, targetLevel, 'iron'),
                    time: getTroopLevelCost(troopType, targetLevel, 'time')
                };
                
                if (trainingGoal === 'quantity') {
                    // User specified quantity, calculate time
                    planMeat = levelRequirements.meat * quantity;
                    planWood = levelRequirements.wood * quantity;
                    planCoal = levelRequirements.coal * quantity;
                    planIron = levelRequirements.iron * quantity;
                    planTime = levelRequirements.time * quantity;
                    actualQuantity = quantity;
                } else {
                    // User specified time, calculate quantity
                    const baseTime = levelRequirements.time;
                    const adjustedBaseTime = Math.floor(baseTime * (100 / trainingSpeed) / trainingCapacity);
                    actualQuantity = Math.floor(trainingTime / adjustedBaseTime);
                    
                    if (actualQuantity < 1) actualQuantity = 1;
                    
                    planMeat = levelRequirements.meat * actualQuantity;
                    planWood = levelRequirements.wood * actualQuantity;
                    planCoal = levelRequirements.coal * actualQuantity;
                    planIron = levelRequirements.iron * actualQuantity;
                    planTime = levelRequirements.time * actualQuantity;
                }
            }
            
            // Add to totals
            totalMeat += planMeat;
            totalWood += planWood;
            totalCoal += planCoal;
            totalIron += planIron;
            totalTime += planTime;
            
            // Store plan details
            planDetails.push({
                troopType,
                currentLevel,
                targetLevel,
                quantity: actualQuantity,
                meat: planMeat,
                wood: planWood,
                coal: planCoal,
                iron: planIron,
                time: planTime
            });
            
            console.log(`${troopType} plan totals:`, { planMeat, planWood, planCoal, planIron, planTime, actualQuantity });
        });
        
        // Apply training speed and capacity to total time
        const adjustedTime = Math.floor(totalTime * (100 / trainingSpeed) / trainingCapacity);
        
        // Create combined requirements object
        const combinedRequirements = {
            meat: totalMeat,
            wood: totalWood,
            coal: totalCoal,
            iron: totalIron,
            time: adjustedTime
        };
        
        console.log('Combined totals:', { totalMeat, totalWood, totalCoal, totalIron, totalTime });
        console.log('Adjusted time:', adjustedTime);
        console.log('Final requirements:', combinedRequirements);
        console.log('Plan details:', planDetails);
        
        // Update the display with combined results
        updateTroopResultsDisplay(combinedRequirements, planDetails, trainingSpeed, trainingCapacity, adjustedTime);
        
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

function updateTroopResultsDisplay(requirements, planDetails, trainingSpeed, trainingCapacity, adjustedTime) {
    try {
        console.log('Updating troop results display with:', requirements);
        console.log('Starting level:', startingLevel, 'Target level:', targetLevel);
        
        // Update the main results
        setElementText('troop-meat-needed', formatNumber(requirements.meat));
        setElementText('troop-wood-needed', formatNumber(requirements.wood));
        setElementText('troop-coal-needed', formatNumber(requirements.coal));
        setElementText('troop-iron-needed', formatNumber(requirements.iron));
        setElementText('troop-time-required', formatTime(requirements.time));
        
        // Generate troop boost breakdown
        generateTroopBoostBreakdown(trainingSpeed, trainingCapacity, adjustedTime);
        
        // Generate troop plan breakdown
        generateTroopPlanBreakdown(planDetails, trainingSpeed);
        
        // Show the results section
        console.log('About to show troop results section...');
        setElementDisplay('troop-results-section', 'block');
        console.log('Troop results section display set to block');
        
    } catch (error) {
        console.error('Error updating troop results display:', error);
        console.error('Error stack:', error.stack);
        console.error('Function parameters:', { requirements, startingLevel, targetLevel, trainingSpeed, trainingCapacity, totalTime });
    }
}

function generateTroopBoostBreakdown(trainingSpeed, trainingCapacity, totalTime) {
    try {
        const breakdownDiv = document.getElementById('troop-boost-breakdown');
        if (!breakdownDiv) return;
        
        let html = '';
        
        // Base training speed
        html += `
            <div class="boost-item">
                <span class="boost-label">Training Speed:</span>
                <span class="boost-value">${trainingSpeed.toFixed(2)}%</span>
            </div>
        `;
        
        // Speed interpretation
        if (trainingSpeed > 100) {
            const speedIncrease = trainingSpeed - 100;
            html += `
                <div class="boost-item">
                    <span class="boost-label">Speed Increase:</span>
                    <span class="boost-value">+${speedIncrease.toFixed(2)}%</span>
                </div>
            `;
        } else if (trainingSpeed < 100) {
            const speedDecrease = 100 - trainingSpeed;
            html += `
                <div class="boost-item">
                    <span class="boost-label">Speed Decrease:</span>
                    <span class="boost-value">-${speedDecrease.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Time calculation explanation
        const timeMultiplier = trainingSpeed >= 100 ? (100 / trainingSpeed) : 1;
        const timeReduction = trainingSpeed >= 100 ? ((trainingSpeed - 100) / trainingSpeed * 100) : 0;
        
        html += `
            <div class="boost-total">
                Time Multiplier: ${timeMultiplier.toFixed(3)}x
            </div>
        `;
        
        if (trainingSpeed > 100) {
            html += `
                <div class="boost-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <span class="boost-label">Time Reduction:</span>
                    <span class="boost-value">${timeReduction.toFixed(2)}%</span>
                </div>
            `;
        }
        
        // Training capacity information
        html += `
            <div class="boost-item">
                <span class="boost-label">Training Capacity:</span>
                <span class="boost-value">${trainingCapacity} troops</span>
            </div>
        `;
        
        // Total training time explanation
        if (trainingCapacity > 1) {
            html += `
                <div class="boost-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <span class="boost-label">Effective Training Time:</span>
                    <span class="boost-value">${(totalTime / trainingCapacity).toFixed(0)}s (${totalTime}s ÷ ${trainingCapacity})</span>
                </div>
            `;
        }
        
        breakdownDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error generating troop boost breakdown:', error);
    }
}

function generateTroopPlanBreakdown(planDetails, trainingSpeed) {
    try {
        const breakdownDiv = document.getElementById('troop-progress-breakdown');
        if (!breakdownDiv) return;
        
        let html = `
            <div class="progress-item summary">
                <h4>📊 Combined Training Plan Summary</h4>
                <p><strong>Total Combined:</strong> Meat: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.meat, 0))} | Wood: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.wood, 0))} | Coal: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.coal, 0))} | Iron: ${formatNumber(planDetails.reduce((sum, plan) => sum + plan.iron, 0))} | Time: ${formatTime(planDetails.reduce((sum, plan) => sum + plan.time, 0))}${trainingSpeed > 0 ? ` (${trainingSpeed}% boost applied)` : ''}</p>
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
                        <p><strong>Quantity:</strong> ${plan.quantity} troops</p>
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM loaded, checking gameData...');
        console.log('Game data available:', !!gameData);
        console.log('Game data structure:', gameData);
        
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
    
    // Initialize strategy-based display with "Train New" as default
    handlePlanStrategyChange('train');
        
        // Add troop training event listeners
        const calculateTroopsBtn = document.getElementById('calculate-troops-btn');
        console.log('Calculate troops button found:', !!calculateTroopsBtn);
        if (calculateTroopsBtn) {
            calculateTroopsBtn.addEventListener('click', function() {
                console.log('Calculate troops button clicked!');
                calculateTroopRequirements();
            });
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
        const inputs = ['building-level', 'construction-speed'];
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

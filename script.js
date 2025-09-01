/*!
 * Whiteout Survivor Calculator v1.1.0
 * Security Features:
 * - Input validation and sanitization
 * - Rate limiting for calculations  
 * - CSP headers for XSS protection
 * - Safe HTML generation (no user content injection)
 * - Secure localStorage usage (numeric values only)
 */

// Constants
const MIN_LEVEL = 15;
const MAX_LEVEL = 30;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

// Rate limiting
const RATE_LIMIT_MS = 500; // 500ms minimum between calculations
let lastCalculationTime = 0;

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
        
        // Input validation and sanitization
        let rawValue = element.value;
        if (typeof rawValue !== 'string') return defaultValue;
        
        // Remove any non-numeric characters except decimal points for construction-speed
        if (elementId === 'construction-speed') {
            rawValue = rawValue.replace(/[^\d.-]/g, '');
        } else {
            rawValue = rawValue.replace(/[^\d-]/g, '');
        }
        
        // Use parseFloat for decimal support, parseInt for integer inputs
        const value = elementId === 'construction-speed' 
            ? (parseFloat(rawValue) || defaultValue)
            : (parseInt(rawValue) || defaultValue);
        
        // Validate numeric bounds
        if (isNaN(value)) return defaultValue;
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
        if (element && typeof text === 'string') {
            // Use textContent instead of innerHTML for security
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
        // Rate limiting check
        const currentTime = Date.now();
        const calculateBtn = document.getElementById('calculate-btn');
        
        if (currentTime - lastCalculationTime < RATE_LIMIT_MS) {
            // Show brief visual feedback that calculation was rate limited
            if (calculateBtn) {
                calculateBtn.style.opacity = '0.7';
                setTimeout(() => {
                    if (calculateBtn) calculateBtn.style.opacity = '1';
                }, 200);
            }
            return;
        }
        lastCalculationTime = currentTime;
        const currentLevel = getInputValue('current-level', MIN_LEVEL, MIN_LEVEL, MAX_LEVEL);
        let constructionSpeedBoost = getInputValue('construction-speed', 0, 0, 100);
        const zinmanLevel = getInputValue('zinman-level', 0, 0, 5);
        
        // Add Vice President ministry benefit (10% time reduction)
        const vicePresidentChecked = document.getElementById('vice-president')?.checked || false;
        if (vicePresidentChecked) {
            // VP gives 10% time reduction, so we reduce the percentage that gets applied
            // If speed boost is 75% (meaning 75% of original time), adding 10% reduction makes it 65%
            constructionSpeedBoost = Math.max(0, constructionSpeedBoost - 10);
        }
        
        // Add Chief Order: Double Time (20% time reduction)
        const chiefOrderDoubleTimeChecked = document.getElementById('chief-order-double-time')?.checked || false;
        if (chiefOrderDoubleTimeChecked) {
            // Chief Order gives 20% time reduction
            constructionSpeedBoost = Math.max(0, constructionSpeedBoost - 20);
        }
        
        // Calculate Zinman resource cost reduction (3% per level starting at level 1)
        const zinmanResourceReduction = zinmanLevel > 0 ? zinmanLevel * 0.03 : 0;
        
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
        
        // Enforce: current level cannot be greater than target level
        if (currentLevel > targetLevel) {
            alert('Current level cannot be greater than target level. Please choose a target level that is greater than or equal to the current level.');
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
            
            // Always use furnace since it's the only building type available
            if (gameData?.buildings?.furnace?.levels?.[level]) {
                const levelData = gameData.buildings.furnace.levels[level];
                levelRequirements = { ...levelData.requirements };
                levelRequirements.time = levelData.time || 0;
                if (levelData.dependencies) {
                    allDependencies = allDependencies.concat(levelData.dependencies);
                }
            }
            
            // Apply speed boost to this level's time
            const levelTime = applySpeedBoost(levelRequirements.time || 0, constructionSpeedBoost);
            
            // Apply Zinman resource cost reduction
            const applyZinmanReduction = (value) => {
                return Math.floor(value * (1 - zinmanResourceReduction));
            };
            
            // Add to totals (with Zinman reduction applied)
            totalFood += applyZinmanReduction(levelRequirements.food || 0);
            totalMeat += applyZinmanReduction(levelRequirements.meat || 0);
            totalWood += applyZinmanReduction(levelRequirements.wood || 0);
            totalCoal += applyZinmanReduction(levelRequirements.coal || 0);
            totalIron += applyZinmanReduction(levelRequirements.iron || 0);
            totalTime += levelTime;
        }
        
        // Calculate dependent building costs
        const dependentBuildingCosts = calculateDependentBuildingCosts(allDependencies, constructionSpeedBoost, zinmanResourceReduction);
        
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
        alert('Unable to calculate requirements. Please check your inputs and try again.');
    }
}

function calculateDependentBuildingCosts(dependencies, constructionSpeedBoost, zinmanResourceReduction = 0) {
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
        
        // Apply Zinman resource cost reduction
        const applyZinmanReduction = (value) => {
            return Math.floor(value * (1 - zinmanResourceReduction));
        };
        
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
                
                totalFood += applyZinmanReduction(requirements.food || 0);
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
        
        // Ensure display does not show a decreasing range like "20 → 16"
        const displayTargetLevel = Math.max(currentLevel, targetLevel);

        let html = `
            <div class="progress-item summary">
                <h4>📊 Cumulative Requirements (Level ${currentLevel} → ${displayTargetLevel})</h4>
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
                
                const boostText = boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : '';
                html += `
                    <div class="level-item">
                        <span class="level-header">Level ${level}:</span>
                        <span class="level-resources">Meat: ${formatNumber(levelRequirements.meat || 0)} | Wood: ${formatNumber(levelRequirements.wood || 0)} | Coal: ${formatNumber(levelRequirements.coal || 0)} | Iron: ${formatNumber(levelRequirements.iron || 0)} | Time: ${formatTime(levelTime)}${boostText}</span>
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
            constructionSpeed: getInputValue('construction-speed', 0),
            zinmanLevel: getInputValue('zinman-level', 0),
            vicePresident: document.getElementById('vice-president')?.checked || false,
            ministerEducation: document.getElementById('minister-education')?.checked || false,
            chiefOrderDoubleTime: document.getElementById('chief-order-double-time')?.checked || false
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
            if (settings.zinmanLevel !== undefined) {
                const element = document.getElementById('zinman-level');
                if (element) element.value = settings.zinmanLevel;
            }
            if (settings.vicePresident !== undefined) {
                const element = document.getElementById('vice-president');
                if (element) element.checked = settings.vicePresident;
            }
            if (settings.ministerEducation !== undefined) {
                const element = document.getElementById('minister-education');
                if (element) element.checked = settings.ministerEducation;
            }
            if (settings.chiefOrderDoubleTime !== undefined) {
                const element = document.getElementById('chief-order-double-time');
                if (element) element.checked = settings.chiefOrderDoubleTime;
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
        
        // Keep building-level's min aligned to the current level (enforces current <= target)
        const enforceTargetMin = () => {
            const current = getInputValue('current-level', MIN_LEVEL, MIN_LEVEL, MAX_LEVEL);
            const targetEl = document.getElementById('building-level');
            if (targetEl) {
                targetEl.min = String(current);
            }
            const helpEl = document.getElementById('current-level-help');
            if (helpEl) {
                helpEl.textContent = `Minimum level for entry is ${MIN_LEVEL}`;
            }
        };
        enforceTargetMin();

        // Handle ministry benefits
        const setupMinistryBenefits = () => {
            const vicePresidentEl = document.getElementById('vice-president');
            const chiefOrderEl = document.getElementById('chief-order-double-time');
            
            if (vicePresidentEl) {
                vicePresidentEl.addEventListener('change', saveSettings);
            }
            if (chiefOrderEl) {
                chiefOrderEl.addEventListener('change', saveSettings);
            }
        };
        setupMinistryBenefits();

        // Add event listeners
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateRequirements);
        }
        
        // Save settings when inputs change
        const inputs = ['current-level', 'building-level', 'construction-speed', 'zinman-level', 'chief-order-double-time'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', saveSettings);
            }
        });
        
        const currentLevelEl = document.getElementById('current-level');
        if (currentLevelEl) {
            currentLevelEl.addEventListener('input', enforceTargetMin);
        }
        
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

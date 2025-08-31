// Whiteout Survivor Calculator - Game Data and Logic

// Game data structure with requirements for buildings
const gameData = {
    buildings: {
        // Starter Buildings (max level 10)
        clinic: {
            name: "Clinic",
            baseCost: { food: 50, wood: 100, coal: 20, iron: 30, time: 20 },
            multiplier: 1.2,
            dependencies: [],
            maxLevel: 10,
            innerCity: true
        },
        
        // Consolidated Shelter Template
        shelterTemplate: {
            baseCost: { food: 0, wood: 0, coal: 0, iron: 0, time: 0 },
            multiplier: 1.1,
            dependencies: [],
            maxLevel: 10,
            hasSubcomponents: true,
            isShelter: true,
            innerCity: true,
            subcomponents: {
                1: {
                    name: "Bunk Bed",
                    cost: { food: 0, wood: 1100, coal: 0, iron: 0, time: 0 }
                }
            },
            levelUpgrades: {
                2: {
                    cost: { food: 0, wood: 1080, coal: 0, iron: 0, time: 0 },
                    requirements: {
                        furnace: 2,
                        allSubcomponents: 1
                    }
                }
            }
        },
        
        // Shelter furnace level requirements
        shelterRequirements: {
            1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
            6: 6, 7: 7, 8: 8, 9: 9, 10: 10
        },
        
        cookHouse: {
            name: "Cook House",
            baseCost: { food: 0, wood: 1000, coal: 0, iron: 0, time: 2 },
            multiplier: 1.15,
            dependencies: [],
            maxLevel: 10,
            hasSubcomponents: true,
            innerCity: true,
            subcomponents: {
                1: {
                    name: "Level 1 Stove",
                    cost: { food: 0, wood: 929, coal: 0, iron: 0, time: 0 }
                }
            }
        },
        
        heroHall: {
            name: "Hero Hall",
            baseCost: { food: 0, wood: 7600, coal: 1600, iron: 0, time: 600 },
            multiplier: 1.0,
            dependencies: [],
            maxLevel: 1,
            oneTimeCost: true,
            powerBonus: 15500
        },
        
        // Resource Buildings
        coalMine: {
            name: "Coal Mine",
            baseCost: { food: 100, wood: 200, coal: 0, iron: 50, time: 30 },
            multiplier: 1.3,
            dependencies: [],
            maxLevel: "furnace",
            innerCity: true
        },
        
        sawmill: {
            name: "Sawmill", 
            baseCost: { food: 0, wood: 1080, coal: 0, iron: 0, time: 6 },
            multiplier: 1.3,
            dependencies: [],
            maxLevel: "furnace",
            hasSubcomponents: true,
            innerCity: true,
            subcomponents: {
                1: {
                    name: "Workbench",
                    cost: { food: 0, wood: 0, coal: 0, iron: 0, time: 0, meat: 2800 }
                }
            }
        },
        
        ironMine: {
            name: "Iron Mine",
            baseCost: { food: 200, wood: 150, coal: 300, iron: 0, time: 60 },
            multiplier: 1.4,
            dependencies: [],
            maxLevel: "furnace",
            innerCity: true
        },
        
        huntersStation: {
            name: "Hunter's Station",
            baseCost: { food: 0, wood: 20, coal: 0, iron: 0, time: 2 },
            multiplier: 1.2,
            dependencies: [],
            maxLevel: "furnace",
            hasSubcomponents: true,
            isShelter: true,
            innerCity: true,
            subcomponents: {
                1: { name: "Hunter's Station", cost: { food: 0, wood: 15, coal: 0, iron: 0, time: 0 } },
                2: { name: "Hunter's Station", cost: { food: 0, wood: 25, coal: 0, iron: 0, time: 0 } },
                3: { name: "Hunter's Station", cost: { food: 0, wood: 30, coal: 0, iron: 0, time: 0 } },
                4: { name: "Hunter's Station", cost: { food: 0, wood: 35, coal: 0, iron: 0, time: 0 } }
            },
            levelUpgrades: {
                2: {
                    cost: { food: 0, wood: 45, coal: 0, iron: 0, time: 3 },
                    requirements: { furnace: 2, allSubcomponents: 2 }
                },
                3: {
                    cost: { food: 0, wood: 0, coal: 0, iron: 0, time: 0 },
                    requirements: { allSubcomponents: 4 }
                }
            }
        },
        
        // Troop Buildings
        infantryCamp: {
            name: "Infantry Camp",
            baseCost: { food: 200, wood: 150, coal: 100, iron: 250, time: 120 },
            multiplier: 1.5,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        marksmanCamp: {
            name: "Marksman Camp",
            baseCost: { food: 180, wood: 200, coal: 80, iron: 300, time: 140 },
            multiplier: 1.6,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        lancerCamp: {
            name: "Lancer Camp",
            baseCost: { food: 250, wood: 120, coal: 150, iron: 400, time: 160 },
            multiplier: 1.7,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        // Support Buildings
        researchCenter: {
            name: "Research Center",
            baseCost: { food: 300, wood: 250, coal: 200, iron: 350, time: 180 },
            multiplier: 1.8,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        storehouse: {
            name: "Storehouse",
            baseCost: { food: 150, wood: 300, coal: 100, iron: 200, time: 90 },
            multiplier: 1.4,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        infirmary: {
            name: "Infirmary",
            baseCost: { food: 250, wood: 180, coal: 120, iron: 280, time: 150 },
            multiplier: 1.6,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        embassy: {
            name: "Embassy",
            baseCost: { food: 400, wood: 300, coal: 250, iron: 450, time: 200 },
            multiplier: 1.9,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        commandCenter: {
            name: "Command Center",
            baseCost: { food: 500, wood: 400, coal: 300, iron: 500, time: 240 },
            multiplier: 2.0,
            dependencies: [],
            maxLevel: "furnace"
        },
        
        barricade: {
            name: "Barricade",
            baseCost: { food: 100, wood: 500, coal: 50, iron: 200, time: 60 },
            multiplier: 1.3,
            dependencies: [],
            maxLevel: "furnace",
            sporadicLeveling: true
        },
        
        // Main Building
        furnace: {
            name: "Furnace",
            maxLevel: 30,
            levels: {
                2: { requirements: { wood: 180 }, dependencies: [{ building: "sawmill", level: 1 }], time: 6 },
                3: { requirements: { wood: 805 }, dependencies: [{ building: "shelter1", level: 2 }], time: 60 },
                4: { requirements: { wood: 1800, coal: 360 }, dependencies: [{ building: "coalMine", level: 3 }], time: 180 },
                5: { requirements: { wood: 7600, coal: 1500 }, dependencies: [{ building: "heroHall", level: 1 }, { building: "shelter3", level: 3 }], time: 600 },
                6: { requirements: { wood: 19000, coal: 3800, iron: 960 }, dependencies: [{ building: "ironMine", level: 5 }], time: 1800 },
                7: { requirements: { wood: 69000, coal: 13000, iron: 3400 }, dependencies: [{ building: "huntersStation", level: 6 }], time: 3600 },
                8: { requirements: { wood: 120000, coal: 25000, iron: 6300 }, dependencies: [{ building: "infantryCamp", level: 7 }], time: 9000 },
                9: { requirements: { wood: 260000, coal: 52000, iron: 13000 }, dependencies: [{ building: "embassy", level: 8 }, { building: "infirmary", level: 1 }], time: 16200 },
                10: { requirements: { wood: 460000, coal: 92000, iron: 23000 }, dependencies: [{ building: "marksmanCamp", level: 9 }, { building: "researchCenter", level: 1 }], time: 21600 },
                11: { requirements: { meat: 1300000, wood: 1300000, coal: 260000, iron: 65000 }, dependencies: [{ building: "embassy", level: 10 }, { building: "lancerCamp", level: 10 }], time: 27000 },
                12: { requirements: { meat: 1600000, wood: 1600000, coal: 330000, iron: 84000 }, dependencies: [{ building: "embassy", level: 11 }, { building: "commandCenter", level: 1 }], time: 32400 },
                13: { requirements: { meat: 2300000, wood: 2300000, coal: 470000, iron: 110000 }, dependencies: [{ building: "embassy", level: 12 }, { building: "infantryCamp", level: 12 }], time: 39600 },
                14: { requirements: { meat: 3100000, wood: 3100000, coal: 640000, iron: 150000 }, dependencies: [{ building: "embassy", level: 13 }, { building: "marksmanCamp", level: 13 }], time: 50400 },
                15: { requirements: { meat: 4600000, wood: 4600000, coal: 930000, iron: 230000 }, dependencies: [{ building: "embassy", level: 14 }, { building: "lancerCamp", level: 14 }], time: 64800 },
                16: { requirements: { meat: 5900000, wood: 5900000, coal: 1100000, iron: 290000 }, dependencies: [{ building: "embassy", level: 15 }, { building: "researchCenter", level: 15 }], time: 109680 },
                17: { requirements: { meat: 9300000, wood: 9300000, coal: 1800000, iron: 460000 }, dependencies: [{ building: "embassy", level: 16 }, { building: "infantryCamp", level: 16 }], time: 131040 },
                18: { requirements: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 620000 }, dependencies: [{ building: "embassy", level: 17 }, { building: "marksmanCamp", level: 17 }], time: 158340 },
                19: { requirements: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 780000 }, dependencies: [{ building: "embassy", level: 18 }, { building: "lancerCamp", level: 18 }], time: 239400 },
                20: { requirements: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000 }, dependencies: [{ building: "embassy", level: 19 }, { building: "researchCenter", level: 19 }], time: 295080 },
                21: { requirements: { meat: 27000000, wood: 27000000, coal: 5400000, iron: 1300000 }, dependencies: [{ building: "embassy", level: 20 }, { building: "infantryCamp", level: 20 }], time: 383940 },
                22: { requirements: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000 }, dependencies: [{ building: "embassy", level: 21 }, { building: "marksmanCamp", level: 21 }], time: 576000 },
                23: { requirements: { meat: 44000000, wood: 44000000, coal: 8900000, iron: 2200000 }, dependencies: [{ building: "embassy", level: 22 }, { building: "lancerCamp", level: 22 }], time: 811200 },
                24: { requirements: { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000 }, dependencies: [{ building: "embassy", level: 23 }, { building: "researchCenter", level: 23 }], time: 18873 },
                25: { requirements: { meat: 81000000, wood: 81000000, coal: 16000000, iron: 4000000 }, dependencies: [{ building: "embassy", level: 24 }, { building: "infantryCamp", level: 24 }], time: 26422 },
                26: { requirements: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 }, dependencies: [{ building: "embassy", level: 25 }, { building: "marksmanCamp", level: 25 }], time: 30386 },
                27: { requirements: { meat: 140000000, wood: 140000000, coal: 24000000, iron: 7400000 }, dependencies: [{ building: "embassy", level: 26 }, { building: "lancerCamp", level: 26 }], time: 36463 },
                28: { requirements: { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9900000 }, dependencies: [{ building: "embassy", level: 27 }, { building: "researchCenter", level: 27 }], time: 41932 },
                29: { requirements: { meat: 240000000, wood: 240000000, coal: 49000000, iron: 12000000 }, dependencies: [{ building: "embassy", level: 28 }, { building: "infantryCamp", level: 28 }], time: 48102 },
                30: { requirements: { meat: 300000000, wood: 300000000, coal: 60000000, iron: 15000000 }, dependencies: [{ building: "embassy", level: 29 }, { building: "marksmanCamp", level: 29 }], time: 57867 }
            }
        }
    }
};

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
        return { ...building.baseCost };
    }
    
    // Handle shelter level upgrades
    if (building.isShelter && building.levelUpgrades && building.levelUpgrades[level]) {
        return { ...building.levelUpgrades[level].cost };
    }
    
    // Handle buildings with subcomponents
    if (building.hasSubcomponents && building.subcomponents[level]) {
        return { ...building.subcomponents[level].cost };
    }
    
    const cost = {};
    for (const resource in building.baseCost) {
        cost[resource] = Math.floor(building.baseCost[resource] * Math.pow(building.multiplier, level - 1));
    }
    return cost;
}

// Main calculation function
function calculateRequirements() {
    try {
        const currentLevel = parseInt(document.getElementById('current-level').value) || MIN_LEVEL;
        const constructionSpeedBoost = parseInt(document.getElementById('construction-speed').value) || 0;
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
                food: 0,
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
            
            generateTips(netRequirements);
            return;
        }
        
        // Initialize cumulative totals
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
            }
            
            // Apply speed boost to this level's time before adding to totals
            const levelTime = applySpeedBoost(levelRequirements.time || 0, constructionSpeedBoost);
            
            // Add this level's requirements to totals
            totalFood += levelRequirements.food || 0;
            totalMeat += levelRequirements.meat || 0;
            totalWood += levelRequirements.wood || 0;
            totalCoal += levelRequirements.coal || 0;
            totalIron += levelRequirements.iron || 0;
            totalTime += levelTime;
        }
        
        const netRequirements = {
            food: totalFood + totalMeat,
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
        
        // Generate tips
        generateTips(netRequirements);
        
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
        document.getElementById('food-needed').textContent = formatNumber(requirements.food);
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
                <p><strong>Total:</strong> Food/Meat: ${formatNumber(requirements.food)} | Wood: ${formatNumber(requirements.wood)} | Coal: ${formatNumber(requirements.coal)} | Iron: ${formatNumber(requirements.iron)} | Time: ${formatTime(requirements.time)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
            </div>
        `;
        
        // Show individual level breakdown
        if (requirements.levelRange && requirements.levelRange.from <= requirements.levelRange.to) {
            html += '<div class="level-breakdown">';
            html += '<h5>📋 Level-by-Level Breakdown:</h5>';
            
            for (let level = requirements.levelRange.from; level <= requirements.levelRange.to; level++) {
                let levelRequirements = { food: 0, wood: 0, coal: 0, iron: 0, time: 0 };
                
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
                }
                
                const displayTime = applySpeedBoost(levelRequirements.time || 0, boostPercentage);
                
                html += `
                    <div class="level-item">
                        <h6>Level ${level}:</h6>
                        <p>Food/Meat: ${formatNumber(levelRequirements.food || 0)} | Wood: ${formatNumber(levelRequirements.wood || 0)} | Coal: ${formatNumber(levelRequirements.coal || 0)} | Iron: ${formatNumber(levelRequirements.iron || 0)} | Time: ${formatTime(displayTime)}${boostPercentage > 0 ? ` (${boostPercentage}% boost applied)` : ''}</p>
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

function generateTips(requirements) {
    try {
        const tipsDiv = document.getElementById('tips-content');
        tipsDiv.innerHTML = '<div class="tip-item">Message Velouria to have a tip listed here.</div>';
    } catch (error) {
        console.error('Error generating tips:', error);
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
                        <span class="dependency-cost">Total Cost: ${formatNumber(dep.cost.food)} Food, ${formatNumber(dep.cost.wood)} Wood, ${formatNumber(dep.cost.coal)} Coal, ${formatNumber(dep.cost.iron)} Iron</span>
                    </div>
                    <div class="dependency-details">
                        <p><strong>Time Required:</strong> ${formatTime(dep.cost.time)}</p>
                        <p><strong>Resource Breakdown:</strong></p>
                        <div class="dependency-resources">
                            <span class="resource-item"><i class="fas fa-utensils"></i> Food: ${formatNumber(dep.cost.food)}</span>
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
            researchSpeed: document.getElementById('research-speed').value,
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
            if (settings.researchSpeed) {
                document.getElementById('research-speed').value = settings.researchSpeed;
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
        const inputsToSave = ['current-level', 'construction-speed', 'research-speed', 'building-level'];
        inputsToSave.forEach(id => {
            document.getElementById(id).addEventListener('input', saveSettings);
        });
    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

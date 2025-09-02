// Whiteout Survivor Calculator - Game Data

// Game data structure with requirements for buildings
const gameData = {
    buildings: {
        
        heroHall: {
            name: "Hero Hall",
            maxLevel: 1,
            oneTimeCost: true,
            powerBonus: 15500,
            levels: {
                1: { requirements: { meat: 0, wood: 7600, coal: 1600, iron: 0 }, dependencies: [], time: 600 }
            }
        },
        
        // Troop Buildings
        infantryCamp: {
            name: "Infantry Camp",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 0, wood: 0, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 7 }], time: 2 },
                2: { requirements: { meat: 0, wood: 140, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 7 }], time: 9 },
                3: { requirements: { meat: 0, wood: 645, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 7 }], time: 45 },
                4: { requirements: { meat: 0, wood: 1400, coal: 285, iron: 0 }, dependencies: [{ building: "furnace", level: 7 }], time: 135 },
                5: { requirements: { meat: 0, wood: 6000, coal: 1200, iron: 0 }, dependencies: [{ building: "furnace", level: 7 }], time: 270 },
                6: { requirements: { meat: 0, wood: 15000, coal: 3000, iron: 765 }, dependencies: [{ building: "furnace", level: 7 }], time: 540 },
                7: { requirements: { meat: 0, wood: 55000, coal: 11000, iron: 2700 }, dependencies: [{ building: "furnace", level: 7 }], time: 1080 },
                8: { requirements: { meat: 0, wood: 100000, coal: 20000, iron: 5000 }, dependencies: [{ building: "furnace", level: 8 }], time: 1620 },
                9: { requirements: { meat: 0, wood: 200000, coal: 41000, iron: 10000 }, dependencies: [{ building: "furnace", level: 9 }], time: 2430 },
                10: { requirements: { meat: 0, wood: 360000, coal: 73000, iron: 18000 }, dependencies: [{ building: "furnace", level: 10 }], time: 3240 },
                11: { requirements: { meat: 460000, wood: 460000, coal: 92000, iron: 23000 }, dependencies: [{ building: "furnace", level: 11 }], time: 4050 },
                12: { requirements: { meat: 580000, wood: 580000, coal: 110000, iron: 29000 }, dependencies: [{ building: "furnace", level: 12 }], time: 4860 },
                13: { requirements: { meat: 830000, wood: 830000, coal: 160000, iron: 41000 }, dependencies: [{ building: "furnace", level: 13 }], time: 5940 },
                14: { requirements: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000 }, dependencies: [{ building: "furnace", level: 14 }], time: 7560 },
                15: { requirements: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000 }, dependencies: [{ building: "furnace", level: 15 }], time: 9720 },
                16: { requirements: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000 }, dependencies: [{ building: "furnace", level: 16 }], time: 16440 },
                17: { requirements: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000 }, dependencies: [{ building: "furnace", level: 17 }], time: 19740 },
                18: { requirements: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000 }, dependencies: [{ building: "furnace", level: 18 }], time: 23700 },
                19: { requirements: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000 }, dependencies: [{ building: "furnace", level: 19 }], time: 35550 },
                20: { requirements: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000 }, dependencies: [{ building: "furnace", level: 20 }], time: 44430 },
                21: { requirements: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000 }, dependencies: [{ building: "furnace", level: 21 }], time: 57750 },
                22: { requirements: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000 }, dependencies: [{ building: "furnace", level: 22 }], time: 86640 },
                23: { requirements: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 850000 }, dependencies: [{ building: "furnace", level: 23 }], time: 120120 },
                24: { requirements: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000 }, dependencies: [{ building: "furnace", level: 24 }], time: 169860 },
                25: { requirements: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000 }, dependencies: [{ building: "furnace", level: 25 }], time: 240180 },
                26: { requirements: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000 }, dependencies: [{ building: "furnace", level: 26 }], time: 271020 },
                27: { requirements: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000 }, dependencies: [{ building: "furnace", level: 27 }], time: 328140 },
                28: { requirements: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000 }, dependencies: [{ building: "furnace", level: 28 }], time: 374940 },
                29: { requirements: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000 }, dependencies: [{ building: "furnace", level: 29 }], time: 432180 },
                30: { requirements: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 }, dependencies: [{ building: "furnace", level: 30 }], time: 518400 }
            }
        },
        
        marksmanCamp: {
            name: "Marksman Camp",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 0, wood: 95, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 2 },
                2: { requirements: { meat: 0, wood: 140, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 9 },
                3: { requirements: { meat: 0, wood: 645, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 45 },
                4: { requirements: { meat: 0, wood: 1400, coal: 285, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 135 },
                5: { requirements: { meat: 0, wood: 6000, coal: 1200, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 270 },
                6: { requirements: { meat: 0, wood: 15000, coal: 3000, iron: 765 }, dependencies: [{ building: "furnace", level: 8 }], time: 540 },
                7: { requirements: { meat: 0, wood: 55000, coal: 11000, iron: 2700 }, dependencies: [{ building: "furnace", level: 8 }], time: 1080 },
                8: { requirements: { meat: 0, wood: 100000, coal: 20000, iron: 5000 }, dependencies: [{ building: "furnace", level: 8 }], time: 1620 },
                9: { requirements: { meat: 0, wood: 200000, coal: 41000, iron: 10000 }, dependencies: [{ building: "furnace", level: 9 }], time: 2430 },
                10: { requirements: { meat: 0, wood: 360000, coal: 73000, iron: 18000 }, dependencies: [{ building: "furnace", level: 10 }], time: 3240 },
                11: { requirements: { meat: 460000, wood: 460000, coal: 92000, iron: 23000 }, dependencies: [{ building: "furnace", level: 11 }], time: 4050 },
                12: { requirements: { meat: 580000, wood: 580000, coal: 110000, iron: 29000 }, dependencies: [{ building: "furnace", level: 12 }], time: 4860 },
                13: { requirements: { meat: 830000, wood: 830000, coal: 160000, iron: 41000 }, dependencies: [{ building: "furnace", level: 13 }], time: 5940 },
                14: { requirements: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000 }, dependencies: [{ building: "furnace", level: 14 }], time: 7560 },
                15: { requirements: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000 }, dependencies: [{ building: "furnace", level: 15 }], time: 9720 },
                16: { requirements: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000 }, dependencies: [{ building: "furnace", level: 16 }], time: 16440 },
                17: { requirements: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000 }, dependencies: [{ building: "furnace", level: 17 }], time: 19740 },
                18: { requirements: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000 }, dependencies: [{ building: "furnace", level: 18 }], time: 23700 },
                19: { requirements: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000 }, dependencies: [{ building: "furnace", level: 19 }], time: 35550 },
                20: { requirements: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000 }, dependencies: [{ building: "furnace", level: 20 }], time: 44430 },
                21: { requirements: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000 }, dependencies: [{ building: "furnace", level: 21 }], time: 57750 },
                22: { requirements: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000 }, dependencies: [{ building: "furnace", level: 22 }], time: 86640 },
                23: { requirements: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 850000 }, dependencies: [{ building: "furnace", level: 23 }], time: 120120 },
                24: { requirements: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000 }, dependencies: [{ building: "furnace", level: 24 }], time: 169860 },
                25: { requirements: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000 }, dependencies: [{ building: "furnace", level: 25 }], time: 240180 },
                26: { requirements: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000 }, dependencies: [{ building: "furnace", level: 26 }], time: 271020 },
                27: { requirements: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000 }, dependencies: [{ building: "furnace", level: 27 }], time: 328140 },
                28: { requirements: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000 }, dependencies: [{ building: "furnace", level: 28 }], time: 374940 },
                29: { requirements: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000 }, dependencies: [{ building: "furnace", level: 29 }], time: 432180 },
                30: { requirements: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 }, dependencies: [{ building: "furnace", level: 30 }], time: 518400 }
            }
        },
        
        lancerCamp: {
            name: "Lancer Camp",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 0, wood: 95, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 2 },
                2: { requirements: { meat: 0, wood: 140, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 9 },
                3: { requirements: { meat: 0, wood: 645, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 45 },
                4: { requirements: { meat: 0, wood: 1400, coal: 285, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 135 },
                5: { requirements: { meat: 0, wood: 6000, coal: 1200, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 270 },
                6: { requirements: { meat: 0, wood: 15000, coal: 3000, iron: 765 }, dependencies: [{ building: "furnace", level: 9 }], time: 540 },
                7: { requirements: { meat: 0, wood: 55000, coal: 11000, iron: 2700 }, dependencies: [{ building: "furnace", level: 9 }], time: 1080 },
                8: { requirements: { meat: 0, wood: 100000, coal: 20000, iron: 5000 }, dependencies: [{ building: "furnace", level: 9 }], time: 1620 },
                9: { requirements: { meat: 0, wood: 200000, coal: 41000, iron: 10000 }, dependencies: [{ building: "furnace", level: 9 }], time: 2430 },
                10: { requirements: { meat: 0, wood: 360000, coal: 73000, iron: 18000 }, dependencies: [{ building: "furnace", level: 10 }], time: 3240 },
                11: { requirements: { meat: 460000, wood: 460000, coal: 92000, iron: 23000 }, dependencies: [{ building: "furnace", level: 11 }], time: 4050 },
                12: { requirements: { meat: 580000, wood: 580000, coal: 110000, iron: 29000 }, dependencies: [{ building: "furnace", level: 12 }], time: 4860 },
                13: { requirements: { meat: 830000, wood: 830000, coal: 160000, iron: 41000 }, dependencies: [{ building: "furnace", level: 13 }], time: 5940 },
                14: { requirements: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000 }, dependencies: [{ building: "furnace", level: 14 }], time: 7560 },
                15: { requirements: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000 }, dependencies: [{ building: "furnace", level: 15 }], time: 9720 },
                16: { requirements: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000 }, dependencies: [{ building: "furnace", level: 16 }], time: 16440 },
                17: { requirements: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000 }, dependencies: [{ building: "furnace", level: 17 }], time: 19740 },
                18: { requirements: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000 }, dependencies: [{ building: "furnace", level: 18 }], time: 23700 },
                19: { requirements: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000 }, dependencies: [{ building: "furnace", level: 19 }], time: 35550 },
                20: { requirements: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000 }, dependencies: [{ building: "furnace", level: 20 }], time: 44430 },
                21: { requirements: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000 }, dependencies: [{ building: "furnace", level: 21 }], time: 57750 },
                22: { requirements: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000 }, dependencies: [{ building: "furnace", level: 22 }], time: 86640 },
                23: { requirements: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 850000 }, dependencies: [{ building: "furnace", level: 23 }], time: 120120 },
                24: { requirements: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000 }, dependencies: [{ building: "furnace", level: 24 }], time: 169860 },
                25: { requirements: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000 }, dependencies: [{ building: "furnace", level: 25 }], time: 240180 },
                26: { requirements: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000 }, dependencies: [{ building: "furnace", level: 26 }], time: 271020 },
                27: { requirements: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000 }, dependencies: [{ building: "furnace", level: 27 }], time: 328140 },
                28: { requirements: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000 }, dependencies: [{ building: "furnace", level: 28 }], time: 374940 },
                29: { requirements: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000 }, dependencies: [{ building: "furnace", level: 29 }], time: 432180 },
                30: { requirements: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 }, dependencies: [{ building: "furnace", level: 30 }], time: 518400 }
            }
        },
        
        // Support Buildings
        researchCenter: {
            name: "Research Center",
            maxLevel: "furnace",
            levels: {
                 1: { requirements: { meat: 0, wood: 105, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 2 },
                 2: { requirements: { meat: 0, wood: 160, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 9 },
                 3: { requirements: { meat: 0, wood: 725, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 45 },
                 4: { requirements: { meat: 0, wood: 1600, coal: 320, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 135 },
                 5: { requirements: { meat: 0, wood: 6800, coal: 1300, iron: 0 }, dependencies: [{ building: "furnace", level: 9 }], time: 270 },
                 6: { requirements: { meat: 0, wood: 17000, coal: 3400, iron: 860 }, dependencies: [{ building: "furnace", level: 9 }], time: 540 },
                 7: { requirements: { meat: 0, wood: 62000, coal: 12000, iron: 3100 }, dependencies: [{ building: "furnace", level: 9 }], time: 1080 },
                 8: { requirements: { meat: 0, wood: 110000, coal: 22000, iron: 5600 }, dependencies: [{ building: "furnace", level: 9 }], time: 1620 },
                 9: { requirements: { meat: 0, wood: 230000, coal: 47000, iron: 11000 }, dependencies: [{ building: "furnace", level: 9 }], time: 2430 },
                 10: { requirements: { meat: 0, wood: 410000, coal: 82000, iron: 20000 }, dependencies: [{ building: "furnace", level: 10 }], time: 3240 },
                11: { requirements: { meat: 520000, wood: 520000, coal: 100000, iron: 26000 }, dependencies: [{ building: "furnace", level: 11 }], time: 4050 },
                12: { requirements: { meat: 670000, wood: 670000, coal: 130000, iron: 33000 }, dependencies: [{ building: "furnace", level: 12 }], time: 4860 },
                13: { requirements: { meat: 950000, wood: 950000, coal: 190000, iron: 47000 }, dependencies: [{ building: "furnace", level: 13 }], time: 5940 },
                14: { requirements: { meat: 1200000, wood: 1200000, coal: 250000, iron: 63000 }, dependencies: [{ building: "furnace", level: 14 }], time: 7560 },
                15: { requirements: { meat: 1800000, wood: 1800000, coal: 370000, iron: 93000 }, dependencies: [{ building: "furnace", level: 15 }], time: 9720 },
                16: { requirements: { meat: 2300000, wood: 2300000, coal: 470000, iron: 110000 }, dependencies: [{ building: "furnace", level: 16 }], time: 16440 },
                17: { requirements: { meat: 3700000, wood: 3700000, coal: 740000, iron: 180000 }, dependencies: [{ building: "furnace", level: 17 }], time: 19740 },
                18: { requirements: { meat: 5000000, wood: 5000000, coal: 1000000, iron: 250000 }, dependencies: [{ building: "furnace", level: 18 }], time: 23700 },
                19: { requirements: { meat: 6200000, wood: 6200000, coal: 1200000, iron: 310000 }, dependencies: [{ building: "furnace", level: 19 }], time: 35550 },
                20: { requirements: { meat: 8600000, wood: 8600000, coal: 1700000, iron: 430000 }, dependencies: [{ building: "furnace", level: 20 }], time: 44430 },
                21: { requirements: { meat: 10000000, wood: 10000000, coal: 2100000, iron: 540000 }, dependencies: [{ building: "furnace", level: 21 }], time: 57750 },
                22: { requirements: { meat: 14000000, wood: 14000000, coal: 2800000, iron: 720000 }, dependencies: [{ building: "furnace", level: 22 }], time: 86640 },
                23: { requirements: { meat: 17000000, wood: 17000000, coal: 3500000, iron: 890000 }, dependencies: [{ building: "furnace", level: 23 }], time: 120120 },
                24: { requirements: { meat: 24000000, wood: 24000000, coal: 4800000, iron: 1200000 }, dependencies: [{ building: "furnace", level: 24 }], time: 169860 },
                25: { requirements: { meat: 32000000, wood: 32000000, coal: 6500000, iron: 1600000 }, dependencies: [{ building: "furnace", level: 25 }], time: 151380 },
                26: { requirements: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000 }, dependencies: [{ building: "furnace", level: 26 }], time: 271020 },
                27: { requirements: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000 }, dependencies: [{ building: "furnace", level: 27 }], time: 328140 },
                28: { requirements: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000 }, dependencies: [{ building: "furnace", level: 28 }], time: 374940 },
                29: { requirements: { meat: 98000000, wood: 98000000, coal: 19000000, iron: 4900000 }, dependencies: [{ building: "furnace", level: 29 }], time: 432180 },
                30: { requirements: { meat: 120000000, wood: 120000000, coal: 24000000, iron: 6000000 }, dependencies: [{ building: "furnace", level: 30 }], time: 520800 }
            }
        },
        
        storehouse: {
            name: "Storehouse",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 150, wood: 300, coal: 100, iron: 200 }, dependencies: [], time: 90 },
                2: { requirements: { meat: 210, wood: 420, coal: 140, iron: 280 }, dependencies: [], time: 126 },
                3: { requirements: { meat: 294, wood: 588, coal: 196, iron: 392 }, dependencies: [], time: 176 },
                4: { requirements: { meat: 412, wood: 823, coal: 274, iron: 549 }, dependencies: [], time: 247 },
                5: { requirements: { meat: 577, wood: 1152, coal: 384, iron: 768 }, dependencies: [], time: 346 },
                6: { requirements: { meat: 808, wood: 1613, coal: 538, iron: 1075 }, dependencies: [], time: 484 },
                7: { requirements: { meat: 1131, wood: 2258, coal: 753, iron: 1505 }, dependencies: [], time: 678 },
                8: { requirements: { meat: 1583, wood: 3161, coal: 1054, iron: 2107 }, dependencies: [], time: 949 },
                9: { requirements: { meat: 2216, wood: 4426, coal: 1475, iron: 2950 }, dependencies: [], time: 1329 },
                10: { requirements: { meat: 3103, wood: 6196, coal: 2065, iron: 4130 }, dependencies: [], time: 1860 }
            }
        },
        
        infirmary: {
            name: "Infirmary",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 250, wood: 180, coal: 120, iron: 280 }, dependencies: [], time: 150 },
                2: { requirements: { meat: 400, wood: 288, coal: 192, iron: 448 }, dependencies: [], time: 240 },
                3: { requirements: { meat: 640, wood: 461, coal: 307, iron: 717 }, dependencies: [], time: 384 },
                4: { requirements: { meat: 1024, wood: 738, coal: 492, iron: 1147 }, dependencies: [], time: 614 },
                5: { requirements: { meat: 1638, wood: 1181, coal: 787, iron: 1835 }, dependencies: [], time: 983 },
                6: { requirements: { meat: 2621, wood: 1890, coal: 1259, iron: 2936 }, dependencies: [], time: 1573 },
                7: { requirements: { meat: 4194, wood: 3024, coal: 2014, iron: 4698 }, dependencies: [], time: 2517 },
                8: { requirements: { meat: 6710, wood: 4838, coal: 3223, iron: 7517 }, dependencies: [], time: 4027 },
                9: { requirements: { meat: 10736, wood: 7741, coal: 5157, iron: 12027 }, dependencies: [], time: 6443 },
                10: { requirements: { meat: 17178, wood: 12386, coal: 8251, iron: 19243 }, dependencies: [], time: 10309 }
            }
        },
        
        embassy: {
            name: "Embassy",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 0, wood: 60, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 2 },
                2: { requirements: { meat: 0, wood: 90, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 10 },
                3: { requirements: { meat: 0, wood: 400, coal: 0, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 60 },
                4: { requirements: { meat: 0, wood: 900, coal: 180, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 120 },
                5: { requirements: { meat: 0, wood: 3800, coal: 760, iron: 0 }, dependencies: [{ building: "furnace", level: 8 }], time: 360 },
                6: { requirements: { meat: 0, wood: 9600, coal: 1900, iron: 480 }, dependencies: [{ building: "furnace", level: 8 }], time: 800 },
                7: { requirements: { meat: 0, wood: 34000, coal: 6900, iron: 1700 }, dependencies: [{ building: "furnace", level: 8 }], time: 1500 },
                8: { requirements: { meat: 0, wood: 63000, coal: 1200, iron: 3100 }, dependencies: [{ building: "furnace", level: 8 }], time: 2700 },
                9: { requirements: { meat: 0, wood: 130000, coal: 2600, iron: 6500 }, dependencies: [{ building: "furnace", level: 9 }], time: 7200 },
                10: { requirements: { meat: 0, wood: 230000, coal: 4600, iron: 11000 }, dependencies: [{ building: "furnace", level: 10 }], time: 14250 },
                11: { requirements: { meat: 260000, wood: 260000, coal: 52000, iron: 13000 }, dependencies: [{ building: "furnace", level: 11 }], time: 17820 },
                12: { requirements: { meat: 330000, wood: 330000, coal: 67000, iron: 16000 }, dependencies: [{ building: "furnace", level: 12 }], time: 21360 },
                13: { requirements: { meat: 470000, wood: 470000, coal: 95000, iron: 23000 }, dependencies: [{ building: "furnace", level: 13 }], time: 26130 },
                14: { requirements: { meat: 630000, wood: 630000, coal: 120000, iron: 31000 }, dependencies: [{ building: "furnace", level: 14 }], time: 33240 },
                15: { requirements: { meat: 930000, wood: 930000, coal: 180000, iron: 46000 }, dependencies: [{ building: "furnace", level: 15 }], time: 42750 },
                16: { requirements: { meat: 1100000, wood: 1100000, coal: 230000, iron: 59000 }, dependencies: [{ building: "furnace", level: 16 }], time: 72420 },
                17: { requirements: { meat: 1800000, wood: 1800000, coal: 370000, iron: 93000 }, dependencies: [{ building: "furnace", level: 17 }], time: 86880 },
                18: { requirements: { meat: 2500000, wood: 2500000, coal: 500000, iron: 120000 }, dependencies: [{ building: "furnace", level: 18 }], time: 104280 },
                19: { requirements: { meat: 3100000, wood: 3100000, coal: 620000, iron: 150000 }, dependencies: [{ building: "furnace", level: 19 }], time: 156420 },
                20: { requirements: { meat: 4300000, wood: 4300000, coal: 860000, iron: 210000 }, dependencies: [{ building: "furnace", level: 20 }], time: 195540 },
                21: { requirements: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000 }, dependencies: [{ building: "furnace", level: 21 }], time: 254160 },
                22: { requirements: { meat: 7200000, wood: 7200000, coal: 1400000, iron: 360000 }, dependencies: [{ building: "furnace", level: 22 }], time: 371700 },
                23: { requirements: { meat: 8900000, wood: 8900000, coal: 1700000, iron: 440000 }, dependencies: [{ building: "furnace", level: 23 }], time: 533820 },
                24: { requirements: { meat: 12000000, wood: 12000000, coal: 2400000, iron: 600000 }, dependencies: [{ building: "furnace", level: 24 }], time: 745560 },
                25: { requirements: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 810000 }, dependencies: [{ building: "furnace", level: 25 }], time: 1043980 },
                26: { requirements: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000 }, dependencies: [{ building: "furnace", level: 26 }], time: 1203240 },
                27: { requirements: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000 }, dependencies: [{ building: "furnace", level: 27 }], time: 1443900 },
                28: { requirements: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000 }, dependencies: [{ building: "furnace", level: 28 }], time: 1664100 },
                29: { requirements: { meat: 49000000, wood: 49000000, coal: 9800000, iron: 2400000 }, dependencies: [{ building: "furnace", level: 29 }], time: 1907160 },
                30: { requirements: { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000 }, dependencies: [{ building: "furnace", level: 30 }], time: 2296320 }
            }
        },
        
        commandCenter: {
            name: "Command Center",
            maxLevel: "furnace",
            levels: {
                1: { requirements: { meat: 500, wood: 400, coal: 300, iron: 500 }, dependencies: [], time: 240 },
                2: { requirements: { meat: 1000, wood: 800, coal: 600, iron: 1000 }, dependencies: [], time: 480 },
                3: { requirements: { meat: 2000, wood: 1600, coal: 1200, iron: 2000 }, dependencies: [], time: 960 },
                4: { requirements: { meat: 4000, wood: 3200, coal: 2400, iron: 4000 }, dependencies: [], time: 1920 },
                5: { requirements: { meat: 8000, wood: 6400, coal: 4800, iron: 8000 }, dependencies: [], time: 3840 },
                6: { requirements: { meat: 16000, wood: 12800, coal: 9600, iron: 16000 }, dependencies: [], time: 7680 },
                7: { requirements: { meat: 32000, wood: 25600, coal: 19200, iron: 32000 }, dependencies: [], time: 15360 },
                8: { requirements: { meat: 64000, wood: 51200, coal: 38400, iron: 64000 }, dependencies: [], time: 30720 },
                9: { requirements: { meat: 128000, wood: 102400, coal: 76800, iron: 128000 }, dependencies: [], time: 61440 },
                10: { requirements: { meat: 256000, wood: 204800, coal: 153600, iron: 256000 }, dependencies: [], time: 122880 }
            }
        },
        
        barricade: {
            name: "Barricade",
            maxLevel: "furnace",
            sporadicLeveling: true,
            levels: {
                1: { requirements: { meat: 100, wood: 500, coal: 50, iron: 200 }, dependencies: [], time: 60 },
                2: { requirements: { meat: 130, wood: 650, coal: 65, iron: 260 }, dependencies: [], time: 78 },
                3: { requirements: { meat: 169, wood: 845, coal: 85, iron: 338 }, dependencies: [], time: 101 },
                4: { requirements: { meat: 220, wood: 1099, coal: 110, iron: 439 }, dependencies: [], time: 131 },
                5: { requirements: { meat: 286, wood: 1429, coal: 143, iron: 571 }, dependencies: [], time: 170 },
                6: { requirements: { meat: 372, wood: 1858, coal: 186, iron: 743 }, dependencies: [], time: 221 },
                7: { requirements: { meat: 483, wood: 2415, coal: 242, iron: 966 }, dependencies: [], time: 287 },
                8: { requirements: { meat: 628, wood: 3140, coal: 314, iron: 1256 }, dependencies: [], time: 373 },
                9: { requirements: { meat: 816, wood: 4082, coal: 408, iron: 1633 }, dependencies: [], time: 485 },
                10: { requirements: { meat: 1061, wood: 5307, coal: 531, iron: 2123 }, dependencies: [], time: 630 }
            }
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
                24: { requirements: { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000 }, dependencies: [{ building: "embassy", level: 23 }, { building: "researchCenter", level: 23 }], time: 1129980 },
                25: { requirements: { meat: 81000000, wood: 81000000, coal: 16000000, iron: 4000000 }, dependencies: [{ building: "embassy", level: 24 }, { building: "infantryCamp", level: 24 }], time: 1592520 },
                26: { requirements: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000 }, dependencies: [{ building: "embassy", level: 25 }, { building: "marksmanCamp", level: 25 }], time: 1825560 },
                27: { requirements: { meat: 140000000, wood: 140000000, coal: 24000000, iron: 7400000 }, dependencies: [{ building: "embassy", level: 26 }, { building: "lancerCamp", level: 26 }], time: 2192580 },
                28: { requirements: { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9900000 }, dependencies: [{ building: "embassy", level: 27 }, { building: "researchCenter", level: 27 }], time: 2511720 },
                29: { requirements: { meat: 240000000, wood: 240000000, coal: 49000000, iron: 12000000 }, dependencies: [{ building: "embassy", level: 28 }, { building: "infantryCamp", level: 28 }], time: 2893320 },
                30: { requirements: { meat: 300000000, wood: 300000000, coal: 60000000, iron: 15000000 }, dependencies: [{ building: "embassy", level: 29 }, { building: "marksmanCamp", level: 29 }], time: 3472020 }
            }
        }
    },
    
    // Troop Training Data - Tier-based requirements
    troopTraining: {
        infantry: {
            name: "Infantry Training",
            maxTier: 11,
            tiers: {
                1: { requirements: { meat: 36, wood: 27, coal: 7, iron: 2 }, time: 12 },
                2: { requirements: { meat: 58, wood: 44, coal: 10, iron: 3 }, time: 17 },
                3: { requirements: { meat: 92, wood: 69, coal: 17, iron: 4 }, time: 24 },
                4: { requirements: { meat: 120, wood: 90, coal: 21, iron: 5 }, time: 32 },
                5: { requirements: { meat: 156, wood: 117, coal: 27, iron: 6 }, time: 44 },
                6: { requirements: { meat: 186, wood: 140, coal: 33, iron: 7 }, time: 60 },
                7: { requirements: { meat: 279, wood: 210, coal: 49, iron: 11 }, time: 83 },
                8: { requirements: { meat: 558, wood: 419, coal: 98, iron: 21 }, time: 113 },
                9: { requirements: { meat: 1394, wood: 1046, coal: 244, iron: 51 }, time: 131 },
                10: { requirements: { meat: 2788, wood: 2091, coal: 488, iron: 102 }, time: 152 },
                11: { requirements: { meat: 6970, wood: 5228, coal: 1220, iron: 253 }, time: 180 }
            }
        },
        
        marksman: {
            name: "Marksman Training",
            maxTier: 11,
            tiers: {
                1: { requirements: { meat: 23, wood: 34, coal: 6, iron: 2 }, time: 12 },
                2: { requirements: { meat: 36, wood: 54, coal: 9, iron: 4 }, time: 17 },
                3: { requirements: { meat: 58, wood: 86, coal: 15, iron: 5 }, time: 24 },
                4: { requirements: { meat: 75, wood: 111, coal: 19, iron: 6 }, time: 32 },
                5: { requirements: { meat: 97, wood: 144, coal: 24, iron: 8 }, time: 44 },
                6: { requirements: { meat: 117, wood: 173, coal: 29, iron: 10 }, time: 60 },
                7: { requirements: { meat: 175, wood: 258, coal: 44, iron: 14 }, time: 83 },
                8: { requirements: { meat: 349, wood: 516, coal: 87, iron: 28 }, time: 113 },
                9: { requirements: { meat: 872, wood: 1290, coal: 217, iron: 70 }, time: 131 },
                10: { requirements: { meat: 1740, wood: 2579, coal: 433, iron: 140 }, time: 152 },
                11: { requirements: { meat: 4357, wood: 6448, coal: 1081, iron: 349 }, time: 180 }
            }
        },
        
        lancer: {
            name: "Lancer Training",
            maxTier: 11,
            tiers: {
                1: { requirements: { meat: 32, wood: 30, coal: 7, iron: 2 }, time: 12 },
                2: { requirements: { meat: 51, wood: 48, coal: 10, iron: 3 }, time: 17 },
                3: { requirements: { meat: 81, wood: 76, coal: 16, iron: 4 }, time: 24 },
                4: { requirements: { meat: 105, wood: 99, coal: 21, iron: 5 }, time: 32 },
                5: { requirements: { meat: 136, wood: 129, coal: 27, iron: 7 }, time: 44 },
                6: { requirements: { meat: 163, wood: 154, coal: 32, iron: 8 }, time: 60 },
                7: { requirements: { meat: 244, wood: 231, coal: 48, iron: 11 }, time: 83 },
                8: { requirements: { meat: 488, wood: 461, coal: 95, iron: 22 }, time: 113 },
                9: { requirements: { meat: 1220, wood: 1151, coal: 237, iron: 55 }, time: 131 },
                10: { requirements: { meat: 2440, wood: 2301, coal: 474, iron: 109 }, time: 152 },
                11: { requirements: { meat: 6099, wood: 5751, coal: 1185, iron: 271 }, time: 180 }
            }
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gameData;
}

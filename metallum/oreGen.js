const List = require("void-list");
const fs = require('fs')
const path = require('path')

let ores = require('./ores.json');

/**
 * @typedef Rock
 * @property category {string}
 * @property name {string}
 * @typedef Ore
 * @property name {string}
 * @property stoneList {List<Rock>}
 * @property rarity {number}
 * @property minY {number}
 * @property maxY {number}
 * @property size {number}
 */
let rocks = require('./stones.json')
/**
 * @type {List<Rock>}
 */
let rockList = List.fromArray(rocks);
let igneousIntrusiveRocks = rockList.filter(rock => rock.category == 'igneous_intrusive');
let igneousExtrusiveRocks = rockList.filter(rock => rock.category == 'igneous_extrusive');
let sedimentaryRocks = rockList.filter(rock => rock.category == 'sedimentary');
let metamorphicRocks = rockList.filter(rock => rock.category == 'metamorphic');

let veinList = new List();

/**
 * Create the path if it doesn't exist
 * @param {string} pathTo 
 * @returns {string}
 */
 function createTagPath(pathTo) {
    let split = pathTo.includes('/') ? '/' : '\\'
    let tempPath = pathTo.split(split)
    tempPath.pop()
    let p = tempPath.join(split)
    if(!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive:true })
    }
    return pathTo
}

/**
 * Generate the data for a ore
 * @param {string} vein_name
 * @param {Ore} ore 
 * @param {Ore?} ore2
 */
function generateOreData(vein_name, ore, ore2) {
    let placed_feature = {
        feature: `tfc_metallum:vein/${vein_name}`,
        placement: []
    };

    veinList.add(`tfc_metallum:vein/${vein_name}`);

    /**
     * @type {List<{replace: string[], with:{weight: number, block: string}[]}>}
     */
    let stoneData = ore.stoneList.map(rock => {
        let wit = []

        if(ore.name == 'certus_quartz') {
            wit = [
                {
                    weight: 30,
                    block: `tfc_metallum:ore/${ore.name}/${rock.name}`
                }
            ]
        }
        else if(vein_name.includes('surface')) {
            wit = [
                {
                    weight: 40,
                    block: `tfc_metallum:ore/poor_${ore.name}/${rock.name}`
                },
                {
                    weight: 5,
                    block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                }
            ]
        }
        else if(ore2 != undefined) {
            if(ore2.name == 'native_silver') {
                wit = [
                    {
                        weight: 10,
                        block: `tfc_metallum:ore/poor_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 15,
                        block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 10,
                        block: `tfc:ore/poor_${ore2.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc:ore/normal_${ore2.name}/${rock.name}`
                    },
                    {
                        weight: 15,
                        block: `tfc:ore/normal_${ore2.name}/${rock.name}`
                    }
                ]
            }
            else if(ore2.name == 'kaolinite') {
                wit = [
                    {
                        weight: 15,
                        block: `tfc_metallum:ore/poor_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 35,
                        block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc:ore/${ore2.name}/${rock.name}`
                    }
                ]
            }
            else {
                wit = [
                    {
                        weight: 10,
                        block: `tfc_metallum:ore/poor_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 15,
                        block: `tfc_metallum:ore/rich_${ore.name}/${rock.name}`
                    },
                    {
                        weight: 10,
                        block: `tfc_metallum:ore/poor_${ore2.name}/${rock.name}`
                    },
                    {
                        weight: 25,
                        block: `tfc_metallum:ore/normal_${ore2.name}/${rock.name}`
                    },
                    {
                        weight: 15,
                        block: `tfc_metallum:ore/rich_${ore2.name}/${rock.name}`
                    }
                ]
            }
        }
        else {
            wit = [
                {
                    weight: 20,
                    block: `tfc_metallum:ore/poor_${ore.name}/${rock.name}`
                },
                {
                    weight: 50,
                    block: `tfc_metallum:ore/normal_${ore.name}/${rock.name}`
                },
                {
                    weight: 30,
                    block: `tfc_metallum:ore/rich_${ore.name}/${rock.name}`
                }
            ]
        }

        return {
            replace:[
                `tfc:rock/raw/${rock.name}`
            ],
            with: wit
        } 
    });

    let configured_feature = {
        type: 'tfc:cluster_vein',
        config: {
            rarity: ore.rarity,
            min_y: {
                absolute: ore.minY
            },
            max_y: {
                absolute: ore.maxY
            },
            size: ore.size,
            density: 0.6,
            blocks: stoneData.toArray(),
            indicator: {
                rarity: 12,
                blocks: [
                  {
                    block: `tfc_metallum:ore/small_${ore.name}`
                  }
                ]
              },
            random_name: `normal_${ore.name}`
        }
    };

    if(ore.name == 'certus_quartz') {
        configured_feature = {
            type: 'tfc:disc_vein',
            config: {
                rarity: ore.rarity,
                min_y: {
                    absolute: ore.minY
                },
                max_y: {
                    absolute: ore.maxY
                },
                size: ore.size,
                density: 0.6,
                blocks: stoneData.toArray(),
                random_name: ore.name
            }
        };
    }

    fs.writeFileSync(createTagPath(`./data/tfc_metallum/worldgen/placed_feature/vein/${vein_name}.json`), JSON.stringify(placed_feature, null, 2), 'utf8');
    fs.writeFileSync(createTagPath(`./data/tfc_metallum/worldgen/configured_feature/vein/${vein_name}.json`), JSON.stringify(configured_feature, null, 2), 'utf8');
}

generateOreData('certus_quartz', {
    name:'certus_quartz',
    minY: 60,
    maxY: 50,
    rarity: 20,
    size:8,
    stoneList:List.fromArray([{ name:'quartzite' }, {name: 'marble'}, {name: 'limestone'}])
})

generateOreData('deep_uraninite', {
    name:'uraninite',
    minY: -64,
    maxY: 35,
    rarity: 100,
    size:20,
    stoneList:List.merge(igneousIntrusiveRocks, igneousExtrusiveRocks)
})

generateOreData('surface_uraninite', {
    name:'uraninite',
    minY: 50,
    maxY: 100,
    rarity: 60,
    size:10,
    stoneList:List.merge(metamorphicRocks)
})

generateOreData('surface_platinum', {
    name:'native_platinum',
    minY: 60,
    maxY: 100,
    rarity: 30,
    size:10,
    stoneList:List.merge(metamorphicRocks)
})

generateOreData('normal_native_osmium', {
    name:'native_osmium',
    minY: -64,
    maxY: 35,
    rarity: 90,
    size:30,
    stoneList:List.merge(igneousIntrusiveRocks, igneousExtrusiveRocks, metamorphicRocks)
}, {
    name: 'native_iridium',
    minY: -64,
    maxY: 35,
    rarity: 90,
    size:30,
    stoneList:List.merge(igneousIntrusiveRocks, igneousExtrusiveRocks, metamorphicRocks)
})

generateOreData('deep_native_osmium',{
    name: 'native_osmium',
    minY: -64,
    maxY: 30,
    rarity: 80,
    size:20,
    stoneList:List.merge(metamorphicRocks)
})

generateOreData('normal_cobaltite', {
    name:'cobaltite',
    minY: -64,
    maxY: 30,
    rarity: 80,
    size:30,
    stoneList:metamorphicRocks
}, {
    name: 'kernite',
    minY: -64,
    maxY: 30,
    rarity: 80,
    size:30,
    stoneList:metamorphicRocks
})

generateOreData('normal_cobaltite', {
    name:'cobaltite',
    minY: 0,
    maxY: 60,
    rarity: 90,
    size:20,
    stoneList:List.merge(igneousIntrusiveRocks, igneousExtrusiveRocks)
})

generateOreData('normal_kernite', {
    name: 'kernite',
    minY: 20,
    maxY: 100,
    rarity: 60,
    size:20,
    stoneList:List.merge(sedimentaryRocks)
}, {
    name: 'kaolinite',
    minY: 20,
    maxY: 100,
    rarity: 60,
    size:20,
    stoneList:List.merge(sedimentaryRocks)
})

generateOreData('normal_galena', {
    name:'galena',
    minY: 0,
    maxY: 70,
    rarity: 70,
    size:35,
    stoneList:List.merge(igneousExtrusiveRocks, sedimentaryRocks)
}, {
    name: 'native_silver',
    minY: 0,
    maxY: 70,
    rarity: 70,
    size:35,
    stoneList:List.merge(igneousExtrusiveRocks, sedimentaryRocks)
})

generateOreData('normal_bertrandite', {
    name: 'bertrandite',
    minY: 10,
    maxY: 100,
    rarity: 70,
    size:25,
    stoneList:List.merge(igneousExtrusiveRocks, igneousIntrusiveRocks)
})

generateOreData('deep_bertrandite', {
    name: 'bertrandite',
    minY: -64,
    maxY: 0,
    rarity: 50,
    size:40,
    stoneList:List.merge(igneousIntrusiveRocks)
})

generateOreData('normal_monazite', {
    name: 'monazite',
    minY: -10,
    maxY: 60,
    rarity: 50,
    size:40,
    stoneList:List.merge(igneousExtrusiveRocks, List.fromArray([
        {
            "category": "sedimentary",
            "name": "claystone"
        },
        {
            "category": "sedimentary",
            "name": "limestone"
        }
    ]))
})

generateOreData('surface_rutile', {
    name: 'rutile',
    minY: 60,
    maxY: 100,
    rarity: 30,
    size:20,
    stoneList:List.merge(igneousExtrusiveRocks, metamorphicRocks)
})

generateOreData('normal_rutile', {
    name: 'rutile',
    minY: 0,
    maxY: 55,
    rarity: 55,
    size:20,
    stoneList:List.merge(metamorphicRocks)
})

generateOreData('deep_rutile', {
    name: 'rutile',
    minY: -64,
    maxY: 0,
    rarity: 55,
    size:30,
    stoneList:List.merge(igneousExtrusiveRocks, igneousIntrusiveRocks)
})

generateOreData('normal_stibnite', {
    name: 'stibnite',
    minY: 0,
    maxY: 75,
    rarity: 60,
    size:20,
    stoneList:List.merge(igneousExtrusiveRocks)
})

generateOreData('deep_stibnite', {
    name: 'stibnite',
    minY: -64,
    maxY: -10,
    rarity: 80,
    size:15,
    stoneList:List.merge(igneousExtrusiveRocks)
})

generateOreData('normal_wolframite', {
    name: 'wolframite',
    minY: 20,
    maxY: 70,
    rarity: 65,
    size:20,
    stoneList:List.merge(metamorphicRocks, sedimentaryRocks)
})

generateOreData('deep_wolframite', {
    name: 'wolframite',
    minY: -64,
    maxY: 0,
    rarity: 50,
    size:20,
    stoneList:List.merge(metamorphicRocks, sedimentaryRocks)
})

function generateOreTag() {
    let list = new List()
    for(let ore of ores) {
        let oreName = ore.name

        for(let stone of rocks) {
            let rock = stone.name

            list.addAll(`tfc_metallum:ore/poor_${oreName}/${rock}`, `tfc_metallum:ore/normal_${oreName}/${rock}`, `tfc_metallum:ore/rich_${oreName}/${rock}`)
        }
    }

    let output = {
        replace:false,
        values:list.toArray()
    }

    fs.writeFileSync(createTagPath('./data/tfc/tags/worldgen/placed_feature/in_biome/veins.json'), JSON.stringify(veinList.toArray(), null, 2), 'utf8');
    fs.writeFileSync(createTagPath('./data/tfc/tags/blocks/prospectable.json'), JSON.stringify(output, null, 2), 'utf8');
}

// generate the ore tag
generateOreTag()
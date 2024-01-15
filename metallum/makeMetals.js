const fs = require('fs')
const path = require('path')
const List = require('void-list')

let metals = require('./metals.json')

let item_parts = require('./item_parts.json')

/**
 * @type {List<string>}
 */
let metalTypes = new List()
metalTypes.addAll('axe', 'chisel', 'double_ingot', 'double_sheet', 'fishing_rod', 'hammer', 'hoe', 'ingot', 'javelin', 'knife', 'mace', 'pickaxe', 'propick', 'rod', 'saw', 'scythe', 'shears', 'sheet', 'shovel', 'sword', 'tuyere')

let NonToolTypes = List.fromArray(['double_ingot', 'double_sheet', 'ingot', 'sheet', 'rod'])

let ores = require('./ores.json')
let rockList = new List()
rockList.addAll('granite', 'diorite', 'gabbro', 'shale', 'claystone', 'limestone', 'conglomerate', 'dolomite', 'chert', 'chalk', 'rhyolite', 'basalt', 'andesite', 'dacite', 'quartzite', 'slate', 'phyllite', 'schist', 'gneiss', 'marble')


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

function createEmptyTag() {
    return {
        replace:false,
        values:[]
    }
}

let mineable_pickaxe = createEmptyTag()

let ingots = createEmptyTag()
let double_ingots = createEmptyTag()
let sheets = createEmptyTag()
let double_sheets = createEmptyTag()
let rods = createEmptyTag()
let axes = createEmptyTag()
let anvils = createEmptyTag()

// create the tags+metal json
for(let metal of metals) {
    ingots.values.push(`tfc_metallum:metal/ingot/${metal.name}`)
    if(metal.hasParts) {
        double_ingots.values.push(`tfc_metallum:metal/double_ingot/${metal.name}`)
        sheets.values.push(`tfc_metallum:metal/sheet/${metal.name}`)
        double_sheets.values.push(`tfc_metallum:metal/double_sheet/${metal.name}`)
        rods.values.push(`tfc_metallum:metal/rod/${metal.name}`)
    }

    if(metal.hasToolArmor) {
        fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'tags', 'blocks', `needs_${metal.name}_tool.json`)), JSON.stringify(createEmptyTag(), null, 2))
        axes.values.push(`tfc_metallum:metal/axe/${metal.name}`)
        anvils.values.push(`tfc_metallum:metal/anvil/${metal.name}`)
        mineable_pickaxe.values.push(`tfc_metallum:metal/anvil/${metal.name}`, `tfc_metallum:metal/trapdoor/${metal.name}`)
    }

    for(let type of NonToolTypes) {
        let json = {
            replace:false,
            values:[
                `tfc_metallum:metal/${type}/${metal.name}`
            ]
        }
        if(metal.hasToolArmor || NonToolTypes.contain(type)) {
            if(metal.name.includes('weak') && type != 'ingot') {
                continue
            }
            fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', `${type}s`, metal.name+'.json')), JSON.stringify(json, null, 2))
        }
    }
    let metalJson = {
        tier:metal.tier,
        fluid:`tfc_metallum:metal/${metal.name}`,
        melt_temperature:metal.melt_temp,
        specific_heat_capacity:metal.specific_heat,
        ingots:{
            tag:`forge:ingots/${metal.name}`
        },
        sheets:{
            tag:`forge:sheets/${metal.name}`
        }
    }
    fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'tfc', 'metals', metal.name+'.json')), JSON.stringify(metalJson, null, 2))
}

fs.writeFileSync(createTagPath(path.join('.', 'data', 'minecraft', 'tags', 'blocks', 'mineable', 'pickaxe.json')), JSON.stringify(mineable_pickaxe, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc', 'tags', 'items', 'axes.json')), JSON.stringify(axes, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc', 'tags', 'items', 'anvils.json')), JSON.stringify(anvils, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', 'ingots.json')), JSON.stringify(ingots, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', 'double_ingots.json')), JSON.stringify(double_ingots, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', 'sheets.json')), JSON.stringify(sheets, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', 'double_sheets.json')), JSON.stringify(double_sheets, null, 2))
fs.writeFileSync(createTagPath(path.join('.', 'data', 'forge', 'tags', 'items', 'rods.json')), JSON.stringify(rods, null, 2))

// end of the tags+metal json section

// welding types
let types = [
    {
        type:'boots',
        inputs:[
            'unfinished_boots',
            'sheets'
        ]
    },
    {
        type:'chestplate',
        inputs:[
            'unfinished_chestplate',
            'sheets'
        ]
    },
    {
        type:'greaves',
        inputs:[
            'unfinished_greaves',
            'sheets'
        ]
    },
    {
        type:'helmet',
        inputs:[
            'unfinished_helmet',
            'sheets'
        ]
    },
    {
        type:'double_ingot',
        inputs:[
            'ingots',
            'ingots'
        ]
    },
    {
        type:'double_sheet',
        inputs:[
            'sheets',
            'sheets'
        ]
    },
    {
        type:'shears',
        inputs:[
            'knife_blade',
            'knife_blade'
        ]
    }
]
let oreList = List.fromArray(['bauxite', 'bertrandite', 'cobaltite', 'kernite', 'galena', 'monazite', 'native_iridium', 'native_osmium', 'rutile', 'stibnite', 'uraninite', 'wolframite'])

/**
 * @param {string} text 
 */
function cap(text) {
    if(text.includes('_')) {
        let split = text.split('_')
        return split.map(t => t.charAt(0).toUpperCase() + t.slice(1, t.length)).join(' ')
    }
    return text.charAt(0).toUpperCase() + text.slice(1, text.length)
}

// language
let json = {}

for(let metal of metals) {
    json[`metal.tfc_metallum.${metal.name}`] = cap(metal.name)

    for(let type of item_parts) {
        if((metal.hasToolArmor && type.isToolArmor) || !type.isToolArmor) {
            if(['anvil', 'lamp', 'chain'].includes(type)) {
                json[`block.tfc_metallum.metal.${type.name}.${metal.name}`] = cap(`${metal.name}_${type.name}`)
            }
            else {
                if(type.name == 'propick') {
                    json[`item.tfc_metallum.metal.${type.name}.${metal.name}`] = cap(`${metal.name}_Prospector's Pickaxe`)
                }
                else {
                    json[`item.tfc_metallum.metal.${type.name}.${metal.name}`] = cap(`${metal.name}_${type.name}`)
                }
            }
        }
    }
}

for(let ore of oreList) {
    json[`block.tfc_metallum.ore.small_${ore}`] = `Small ${cap(ore)}`
    json[`item.tfc_metallum.ore.small_${ore}`] = `Small ${cap(ore)}`
    for(let rock of rockList) {
        json[`block.tfc_metallum.ore.normal_${ore}.${rock}`] = `Normal ${cap(rock)} ${cap(ore)}`
        json[`block.tfc_metallum.ore.poor_${ore}.${rock}`] = `Poor ${cap(rock)} ${cap(ore)}`
        json[`block.tfc_metallum.ore.rich_${ore}.${rock}`] = `Rich ${cap(rock)} ${cap(ore)}`
    }
}

fs.writeFileSync(createTagPath('./assets/tfc_metallum/lang/en_us.json'), JSON.stringify(json, null, 2))

// welding recipes
for(let metal of metals) {
    let metal_name = metal.name
    for(let type of types) {
        let inputs = type.inputs.map(value => {
            if(value == 'sheets' || value == 'ingots') {
                return `forge:${value}/${metal_name}`
            }
            return `tfc_metallum:metal/${value}/${metal_name}`
        })
        let recipe = {
            "type": "tfc:welding",
            "first_input": {},
            "second_input": {},
            "tier": metal.tier-1,
            "result": {
              "item": `tfc_metallum:metal/${type.type}/${metal_name}`
            }
        }

        if(inputs[0].includes('tfc')) {
            recipe.first_input.item = inputs[0]
        }
        if(inputs[1].includes('tfc')) {
            recipe.second_input.item = inputs[1]
        }

        if(inputs[0].includes('forge')) {
            recipe.first_input.tag = inputs[0]
        }
        if(inputs[1].includes('forge')) {
            recipe.second_input.tag = inputs[1]
        }

        if(metal.hasToolArmor) {
            fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'recipes', 'welding', `${metal.name}_${type.type}.json`)), JSON.stringify(recipe, null, 2), 'utf8')
        }
        else if(type.type == 'double_sheet' || type.type == 'double_ingot') {
            if(!metal_name.includes('weak')) fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'recipes', 'welding', `${metal.name}_${type.type}.json`)), JSON.stringify(recipe, null, 2), 'utf8')
        }
    }
}

// anvil recipes+alloy recipes
let anvilParts = require('./anvil_parts.json')

for(let metal of metals) {
    if(metal.hasOwnProperty('alloy')) {
        fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'recipes', 'alloy', `${metal.name}.json`)), JSON.stringify(metal.alloy, null, 2), 'utf8')
    }
    for(let anvilPart of anvilParts) {
        if(metal.hasParts) {
            if((metal.hasToolArmor && anvilPart.requireTool) || !anvilPart.requireTool) {
                let recipe = {
                    type: 'tfc:anvil',
                    input: {
                        tag:anvilPart.input.replace('metal_name', metal.name)
                    },
                    result:{
                        item:`tfc_metallum:metal/${anvilPart.name}/${metal.name}`
                    },
                    tier:metal.tier,
                    rules:anvilPart.rules,
                    apply_forging_bonus:anvilPart.apply_forging_bonus
                }
                fs.writeFileSync(createTagPath(path.join('.', 'data', 'tfc_metallum', 'recipes', 'anvil', `${metal.name}_${anvilPart.name}.json`)), JSON.stringify(recipe, null, 2), 'utf8')
        
            }
        }
    }
}

for(let metal of metals) {
    let name = metal.name
    for(let itemPart of item_parts) {

        if(itemPart.isToolArmor && !metal.hasToolArmor) {
            continue
        }

        let ingredientValue = itemPart.hasOwnProperty('tag') ? 'tag': 'item'
        let ingredientItem = itemPart.hasOwnProperty('tag') ? `${itemPart.tag}/${name}` : `tfc_metallum:metal/${itemPart.name}/${name}`
        let ingredient = {}
        ingredient[ingredientValue] = ingredientItem
        let forging_tempererature = Math.round(metal.melt_temp*0.6)
        let welding_tempererature = Math.round(metal.melt_temp*0.8)
        let heat_capacity = Math.round(10*metal.ingot_heat_capacity*40) / 1000

        let json = {
            ingredient,
            heat_capacity,
            forging_tempererature,
            welding_tempererature
        }

        fs.writeFileSync(createTagPath(`./data/tfc_metallum/tfc/item_heats/metal/${name}_${itemPart.name}.json`), JSON.stringify(json, null, 2), 'utf8')

        let heating = {
            type: "tfc:heating",
            ingredient,
            temperature:metal.melt_temp,
            result_fluid: {
                fluid: `tfc_metallum:metal/${name}`,
                amount:itemPart.smelt_amount
            }
        }

        if(itemPart.hasOwnProperty('useDurability')) {
            heating.useDurability = true
        }

        fs.writeFileSync(createTagPath(`./data/tfc_metallum/recipes/heating/metal/${name}_${itemPart.name}.json`), JSON.stringify(heating, null, 2), 'utf8')
    }
}

for(let ore of ores) {
    if(ore.isGraded) {
        let metal = metals.find(m => m.name == ore.metal)

        if(metal != undefined) {
    
            fs.writeFileSync(createTagPath(`./data/tfc_metallum/recipes/heating/ore/small_${ore.name}.json`), JSON.stringify({
                type: "tfc:heating",
                ingredient: {
                    item:`tfc_metallum:ore/small_${ore.name}`
                },
                temperature:metal.melt_temp,
                result_fluid: {
                    fluid: `tfc_metallum:metal/${metal.name}`,
                    amount:10
                }
            }, null, 2), 'utf8')

            fs.writeFileSync(`./data/tfc_metallum/recipes/heating/ore/poor_${ore.name}.json`, JSON.stringify({
                type: "tfc:heating",
                ingredient: {
                    item:`tfc_metallum:ore/poor_${ore.name}`
                },
                temperature:metal.melt_temp,
                result_fluid: {
                    fluid: `tfc_metallum:metal/${metal.name}`,
                    amount:15
                }
            }, null, 2), 'utf8')

            fs.writeFileSync(`./data/tfc_metallum/recipes/heating/ore/normal_${ore.name}.json`, JSON.stringify({
                type: "tfc:heating",
                ingredient: {
                    item:`tfc_metallum:ore/normal_${ore.name}`
                },
                temperature:metal.melt_temp,
                result_fluid: {
                    fluid: `tfc_metallum:metal/${metal.name}`,
                    amount:25
                }
            }, null, 2), 'utf8')

            fs.writeFileSync(`./data/tfc_metallum/recipes/heating/ore/rich_${ore.name}.json`, JSON.stringify({
                type: "tfc:heating",
                ingredient: {
                    item:`tfc_metallum:ore/rich_${ore.name}`
                },
                temperature:metal.melt_temp,
                result_fluid: {
                    fluid: `tfc_metallum:metal/${metal.name}`,
                    amount:25
                }
            }, null, 2), 'utf8')
        }
    }
}
const Jimp = require('jimp')
const List = require('void-list')
const fs = require('fs')
const path = require('path')
const { getPaletteFromImage, replacePixels } = require('./index')

let plank_types = [
    "beams",
    "bricks",
    "crate",
    "diagonal_stripes",
    "diagonal_tiles",
    "dotted",
    "flooring",
    "large_tiles",
    "pattern",
    "small_bricks",
    "small_tiles",
    "squares",
    "tiles",
    "wavy",
    "woven"
]

let planks = {
    "rechiseled_eco": [
        "alder",
        "apple",
        "ash",
        "aspen",
        "bald_cypress",
        "balsa",
        "baobab",
        "basswood",
        "beech",
        "butternut",
        "cedar",
        "cherry",
        "chestnut",
        "cypress",
        "deadwood",
        "dogwood",
        "douglas_fir",
        "drago",
        "dragon_bamboo",
        "ebony",
        "elm",
        "eucalyptus",
        "fir",
        "ginkgo",
        "hackberry",
        "hawthorn",
        "hazel",
        "hemlock",
        "hickory",
        "holly",
        "hornbeam",
        "jacaranda",
        "japanese_maple",
        "juniper",
        "kapok",
        "larch",
        "linden",
        "maggiriyl",
        "magnolia",
        "mahogany",
        "mangrove",
        "maple",
        "marula",
        "palm",
        "pine",
        "plane",
        "poplar",
        "rainbow_eucalyptus",
        "redwood",
        "robinia",
        "rosewood",
        "sequoia",
        "teak",
        "tupelo",
        "umaraich",
        "voluclark",
        "walnut",
        "willow",
        "winisugi",
        "wisteria",
        "yew",
        "zelkova"
    ],
    "rechiseled_quark": [
        "black_stained",
        "blue_stained",
        "brown_stained",
        "cyan_stained",
        "gray_stained",
        "green_stained",
        "light_blue_stained",
        "lime_stained",
        "magenta_stained",
        "orange_stained",
        "pink_stained",
        "purple_stained",
        "red_stained",
        "light_gray_stained",
        "white_stained",
        "yellow_stained"
    ]
}

/**
 * convert a json object to a string
 * @param {Object} json 
 * @returns 
 */
function jsonToString(json) {
    return JSON.stringify(json, null, 2)
}

/**
 * Generate the json models/blockstates for the blocks
 * @param {string} modID 
 * @param {string} wood 
 * @param {string} wood_type 
 * @returns 
 */
function generateData(modID, wood, wood_type) {

    let folders = generateFolders(modID)

    let name = `${wood}_planks_${wood_type}`
    let connecting = name+'_connecting'
    let blockstateBase = {
        "variants": {
            "": {
              "model": `${modID}:block/${name}`
            }
        }
    }

    let blockstateConnected = {
        "variants": {
            "": {
              "model": `${modID}:block/${connecting}`
            }
        }
    }

    let blockModel = {
        "parent": "rechiseled:block/connecting_cube_all",
        "textures": {
          "all": `${modID}:block/${name}`
        },
        "loader": "rechiseled:connecting_model"
    }

    let blockModelConnected = {
        "parent": "rechiseled:block/connecting_cube_all",
        "textures": {
          "all": `${modID}:block/${name}`
        },
        "loader": "rechiseled:connecting_model",
        "should_connect": true
    }

    let itemModel = {
        "parent": `${modID}:block/${name}`
    }

    let itemModelConnected = {
        "parent": `${modID}:block/${name}_connecting`
    }

    fs.writeFileSync(`${folders.blockstateFolder}/${name}.json`, jsonToString(blockstateBase))
    fs.writeFileSync(`${folders.blockstateFolder}/${name}_connecting.json`, jsonToString(blockstateConnected))

    fs.writeFileSync(`${folders.blockFolder}/${name}.json`, jsonToString(blockModel))
    fs.writeFileSync(`${folders.blockFolder}/${name}_connecting.json`, jsonToString(blockModelConnected))

    fs.writeFileSync(`${folders.itemFolder}/${name}.json`, jsonToString(itemModel))
    fs.writeFileSync(`${folders.itemFolder}/${name}_connecting.json`, jsonToString(itemModelConnected))

    return folders
}

function generateFolders(modID) {
    let folder = `./export/${modID}`
    let blockstateFolder = path.join(folder, 'blockstates')
    let modelFolder = path.join(folder, 'models')
    let blockFolder = path.join(modelFolder, 'block')
    let itemFolder = path.join(modelFolder, 'item')
    let textureBlockFolder = path.join(folder, 'textures', 'block')
    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
        if(!fs.existsSync(blockstateFolder)) {
            fs.mkdirSync(blockstateFolder)
        }
        if(!fs.existsSync(modelFolder)) {
            fs.mkdirSync(modelFolder)
            if(!fs.existsSync(blockFolder)) {
                fs.mkdirSync(blockFolder)
            }
            if(!fs.existsSync(itemFolder)) {
                fs.mkdirSync(itemFolder)
            }
        }
        if(!fs.existsSync(textureBlockFolder)) {
            fs.mkdirSync(textureBlockFolder, {
                recursive:true
            })
        }
    }

    return {
        blockstateFolder,
        blockFolder,
        itemFolder,
        textureBlockFolder
    }
}

async function main() {
    for(let wood_type of plank_types) {
        for(let [modID, plankList] of Object.entries(planks)) {
            for(let wood of plankList) {

                let folders = generateData(modID, wood, wood_type)

                const base = await Jimp.read(`./planks/${modID}/${wood}_planks.png`)
                const data = await Jimp.read(`./default/planks_${wood_type}.png`)
                let palette = getPaletteFromImage(base)
    
                // only do textures if the mod is loaded
                let tex = path.join(folders.textureBlockFolder, `${wood}_planks_${wood_type}.png`)
                if(!fs.existsSync(tex)) {
                    await replacePixels(data, palette, tex)
                }
            }
        }
    }
}

main()
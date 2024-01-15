const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const LogManager = require('void-logger')
const { getPaletteFromImage, replacePixels } = require('./index')

let logger = LogManager.getOrCreateLogger('./export/log/output.log')
let globalModID = 'rechiseled_compat'

/**
 * Create a folder and return it.
 * @param {string} folder 
 * @returns 
 */
 function createFolder(folder) {
    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
        logger.log(`Created folder ${folder}`)
    }
    return folder
}

/**
 * get the types for a given type
 * @param {string} type 
 */
function getTypes(type='planks') {
    let plank_types = [
        'beams',
        'bricks',
        'crate',
        'diagonal_stripes',
        'diagonal_tiles',
        'dotted',
        'flooring',
        'large_tiles',
        'pattern',
        'small_bricks',
        'small_tiles',
        'squares',
        'tiles',
        'wavy',
        'woven'
    ]

    let sandstone_types = [
        "bricks",
        "large_tiles",
        "polished",
        "tiles"
    ]

    if(type == 'planks') {
        return plank_types
    }
    else if(type == 'stone') {
        return stone_types
    }
    else {
        return sandstone_types
    }
}

/**
 * Initialise the folders
 * @param {string} modID 
 * @returns 
 */
function initFolders(modID) {
    logger.log('Started folders initialisation!')

    let baseFolder = createFolder(path.join(__dirname, 'export'))
    let assetsFolder = createFolder(path.join(baseFolder, 'assets'))
    let dataFolder = createFolder(path.join(baseFolder, 'data'))
    let modFolder = createFolder(path.join(assetsFolder, modID))
    let modDataFolder = createFolder(path.join(dataFolder, modID))
    let langFolder = createFolder(path.join(modFolder, 'lang'))
    
    // blockstates and models
    let blockStateFolder = createFolder(path.join(modFolder, 'blockstates'))
    let modelFolder = createFolder(path.join(modFolder, 'models'))
    let modelBlockFolder = createFolder(path.join(modelFolder, 'block'))
    let modelItemFolder = createFolder(path.join(modelFolder, 'item'))

    // textures
    let textureFolder = createFolder(path.join(modFolder, 'textures'))
    let textureBlockFolder = createFolder(path.join(textureFolder, 'block'))

    let loottablesFolder = createFolder(path.join(modDataFolder, 'loot_tables'))
    let blockLootFolder = createFolder(path.join(loottablesFolder, 'blocks'))

    logger.log('Ended folders initialisation!')

    return {
        baseFolder,
        assetsFolder,
        modFolder,
        langFolder,
        modelFolder,
        blockStateFolder,
        modelFolder,
        modelBlockFolder,
        modelItemFolder,
        textureFolder,
        textureBlockFolder,
        blockLootFolder
    }
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
 * Capitalize a string
 * @param {string} text 
 */
 let capitalize = (text) => {
    if(text.includes('_')) {
        let array = text.split('_')
        array.forEach((element, i, a) => {
            array[i] = element.trim().replace(/^\w/, (c) => c.toUpperCase());
        })
        return array.join(' ')
    }
    return text.trim().replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Generate the json models/blockstates for the blocks
 * @param {{baseFolder:string,assetsFolder:string,modelFolder:string,blockStateFolder:string,modelFolder:string,modelBlockFolder:string,modelmodelItemFolder:string,textureFolder:string,texturemodelBlockFolder:string}} folders 
 * @param {string} name 
 * @param {string} name_connecting 
 * @returns 
 */
 function generateJson(folders, name, name_connecting) {
    let blockstateBase = {
        "variants": {
            "": {
              "model": `${globalModID}:block/${name}`
            }
        }
    }

    let blockstateConnected = {
        "variants": {
            "": {
              "model": `${globalModID}:block/${name_connecting}`
            }
        }
    }

    let blockModel = {
        "parent": "minecraft:block/cube_all",
        "loader": "rechiseled:connecting_model",
        "model_textures": {
          "all": {
            "location": `${globalModID}:block/${name}`,
            "connecting": true
          }
        }
      }

    let blockModelConnected = {
		"parent": "minecraft:block/cube_all",
		"loader": "rechiseled:connecting_model",
		"should_connect": true,
		"model_textures": {
			"all": {
			  "location": `${globalModID}:block/${name}`,
			  "connecting": true
			}
		}
	}

    let blockLootConnecting = {
        "pools": [
          {
            "rolls": 1.0,
            "bonus_rolls": 0.0,
            "entries": [
              {
                "type": "minecraft:item",
                "name": `${globalModID}:${name_connecting}`
              }
            ],
            "conditions": [
              {
                "condition": "minecraft:survives_explosion"
              }
            ]
          }
        ]
      }

      let blockLoot = {
        "pools": [
          {
            "rolls": 1.0,
            "bonus_rolls": 0.0,
            "entries": [
              {
                "type": "minecraft:item",
                "name": `${globalModID}:${name}`
              }
            ],
            "conditions": [
              {
                "condition": "minecraft:survives_explosion"
              }
            ]
          }
        ]
      }

    let itemModel = {
        "parent": `${globalModID}:block/${name}`
    }

    let itemModelConnected = {
        "parent": `${globalModID}:block/${name_connecting}`
    }

    if(!fs.existsSync(`${folders.blockStateFolder}/${name}.json`)) fs.writeFileSync(`${folders.blockStateFolder}/${name}.json`, jsonToString(blockstateBase))
    if(!fs.existsSync(`${folders.blockStateFolder}/${name}_connecting.json`)) fs.writeFileSync(`${folders.blockStateFolder}/${name}_connecting.json`, jsonToString(blockstateConnected))

    if(!fs.existsSync(`${folders.modelBlockFolder}/${name}.json`)) fs.writeFileSync(`${folders.modelBlockFolder}/${name}.json`, jsonToString(blockModel))
    if(!fs.existsSync(`${folders.modelBlockFolder}/${name}_connecting.json`)) fs.writeFileSync(`${folders.modelBlockFolder}/${name}_connecting.json`, jsonToString(blockModelConnected))

    if(!fs.existsSync(`${folders.modelItemFolder}/${name}.json`)) fs.writeFileSync(`${folders.modelItemFolder}/${name}.json`, jsonToString(itemModel))
    if(!fs.existsSync(`${folders.modelItemFolder}/${name}_connecting.json`)) fs.writeFileSync(`${folders.modelItemFolder}/${name}_connecting.json`, jsonToString(itemModelConnected))

    if(!fs.existsSync(`${folders.blockLootFolder}/${name}.json`)) fs.writeFileSync(`${folders.blockLootFolder}/${name}.json`, jsonToString(blockLoot))
    if(!fs.existsSync(`${folders.blockLootFolder}/${name_connecting}.json`)) fs.writeFileSync(`${folders.blockLootFolder}/${name_connecting}.json`, jsonToString(blockLootConnecting))

    return folders
}

class JavaData {
    #path = ''
    #data = ''
    #modID = ''
    #type = ''
    /**
     * @param {string} path
     * @param {string} modID 
     */
    constructor(path, modID, type='block') {
        this.#path = path
        this.#modID = modID
        this.#type = type
        this.#generateJava()
    }

    #generateJava() {
        this.#data+=`package mrthomas20121.rechiseled_compat.compat;`

        if(this.#type == 'block') {
            this.#data+='\n\nimport mrthomas20121.rechiseled_compat.RechiseledCompat;\nimport mrthomas20121.rechiseled_compat.block.ChiseledBlock;\nimport net.minecraft.block.AbstractBlock;'
            this.#data+='\nimport net.minecraft.block.Block;\nimport net.minecraft.block.SoundType;\nimport net.minecraft.block.material.Material;'
            this.#data+='\nimport net.minecraft.block.material.MaterialColor;\nimport net.minecraftforge.fml.RegistryObject;\nimport net.minecraftforge.registries.DeferredRegister;'
            this.#data+=`\npublic class ${capitalize(this.#modID)}Blocks {\n`
            this.#data+='\n    public static DeferredRegister<Block> BLOCKS = DeferredRegister.create(Block.class, RechiseledCompat.MOD_ID);\n'
        }
        else {
            this.#data+= 'import mrthomas20121.rechiseled_compat.RechiseledCompat;\nimport net.minecraft.item.BlockItem;\nimport net.minecraft.item.Item;'
            this.#data+='import net.minecraft.item.ItemGroup;\nimport net.minecraftforge.fml.RegistryObject;\nimport net.minecraftforge.registries.DeferredRegister;'
            this.#data+=`\npublic class ${capitalize(this.#modID)}Items {\n`
            this.#data+='\n    public static DeferredRegister<Item> ITEMS = DeferredRegister.create(Item.class, RechiseledCompat.MOD_ID);\n'
            
        }
    }

    /**
     * @param {string} name 
     * @param {boolean} connected 
     */
    addData(name, connected=false) {
        if(this.#type == 'item') {
            this.#data+=`\n    public static RegistryObject<Item> ${name.toUpperCase()} = ITEMS.register("${name}", () -> new BlockItem(${capitalize(this.#modID)}Blocks.${name.toUpperCase()}.get(), getProperties()));`
        }
        else {
            this.#data+=`\n    public static RegistryObject<Block>  ${name.toUpperCase()} = BLOCKS.register("${name}", ()-> new ChiseledBlock(${connected}, getProperties()));`
        }
    }

    save() {
        if(this.#type == 'item') {
            this.#data+='\n\n    public static Item.Properties getProperties() {\n        return new Item.Properties().tab(ItemGroup.TAB_BUILDING_BLOCKS);\n    }\n}'
        }
        else {
            this.#data+='\n\n    public static AbstractBlock.Properties getProperties() {'
            this.#data+='\n        return AbstractBlock.Properties.of(Material.WOOD, MaterialColor.WOOD).strength(2.0F, 3.0F).sound(SoundType.WOOD);    }\n}'
        }

        fs.writeFileSync(this.#path, this.#data, 'utf8') 
    }
}

let data = require('./compat.json')

async function generateData() {
    logger.clear()
    let folder = initFolders(globalModID)
    let lang_json = {}
    for(let [modID, values] of Object.entries(data)) {
        let itemData = new JavaData(path.join(folder.baseFolder, `${capitalize(modID)}Items.java`), modID, 'item')
        let blockData = new JavaData(path.join(folder.baseFolder, `${capitalize(modID)}Blocks.java`), modID, 'block')

        for(let element of values) {
            let types = getTypes(element.type)
            let block = element.value
            for(let type of types) {
                let name = `${modID}_${block}_${type}`
                let name_without_modID = `${block}_${type}`

                logger.log(`preparing data for ${block}`)

                itemData.addData(name, false)
                itemData.addData(`${name}_connecting`, true)
                blockData.addData(name, false)
                blockData.addData(`${name}_connecting`, true)
                
                generateJson(folder, name, `${name}_connecting`)
                lang_json[`block.${globalModID}.${name}`] = capitalize(name_without_modID)
                lang_json[`block.${globalModID}.${name}_connecting`] = `${capitalize(name_without_modID)} Connecting`

                // only do textures if the texture does not exist.
                let tex = path.join(folder.textureBlockFolder, `${name}.png`)
                if(!fs.existsSync(tex)) {

                    // read the images
                    const base = await Jimp.read(`./textures/${modID}/${block}.png`)
                    const data = await Jimp.read(`./default/${element.type}/${type}.png`)

                    //get the palette from the base image(by base image i mean the block texture)
                    let palette = getPaletteFromImage(base)

                    logger.log(`Creating Image: ${name}.png`)
                    // replace the pixels and save the image
                    await replacePixels(data, palette, tex)
                }
            }
        }
        itemData.save()
        blockData.save()
    }
    fs.writeFileSync(path.join(folder.langFolder, 'en_us.json'), jsonToString(lang_json), 'utf8')
}


generateData()
const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const { getPaletteFromImage, replaceMorePixels } = require('../index')
const List = require('void-list')

/**
 * @param {List<number>} colors 
 */
function getColors(colors) {
    let primary = colors
    let secondary = primary.copy()
    secondary.remove(secondary.size()-3)
    let third = secondary.copy()
    third.remove(secondary.size()-3)

    return {
        primary,
        secondary,
        third
    }
}

/**
 * @param {string} dir 
 * @returns 
 */
function createDir(dir) {
    let temp = dir.split('\\')
    temp.pop()
    let finalDir = temp.join('\\')
    if(!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive:true })
    }
    return dir
}

async function run() {
    let metalTypes = fs.readdirSync('./backup')
    let types = metalTypes
    let metals = require('./metals.json')

    // shield
    for(let metal of metals) {
        let metalName = metal.name

        if(metal.hasToolArmor) {
            let shield = 'tier'+metal.tier

            let shieldBack = await Jimp.read(path.join('.', 'shields', `${shield}_back.png`))
            let shieldFront = await Jimp.read(path.join('.', 'shields', `${shield}_front.png`))

            let metalPalette = getPaletteFromImage(await Jimp.read(path.join('.', 'colors', metalName+'.png')))

            let colors = getColors(metalPalette)

            await replaceMorePixels(createDir(path.join('assets', 'tfc_metallum', 'textures', 'item', 'metal', 'shield', `${metalName}_back.png`)), shieldBack, colors.primary, colors.secondary, colors.third)
            await replaceMorePixels(createDir(path.join('assets', 'tfc_metallum', 'textures', 'item', 'metal', 'shield', `${metalName}_front.png`)), shieldFront, colors.primary, colors.secondary, colors.third)
        }
    }

    // other textures
    for(let metal of metals) {
        let metalName = metal.name
        if(!metal.hasToolArmor) {
            types = ['double_ingot.png', 'double_sheet.png', 'ingot.png', 'sheet.png', 'rod.png', 'full.png']
        }
        else {
            types = metalTypes
        }

        for(let type of types) {
            let pathType = type == 'trapdoor.png' || type == 'chain_block.png' || type == 'full.png' ? 'block' : 'item'

            let typeImage = await Jimp.read(path.join('.', 'backup', type))

            if(!metal.hasParts) {
                typeImage = await Jimp.read(path.join('.', 'weak_ingot.png'))
            }

            if(type == 'chain_block.png') type = 'chain'
            let savePath = type.includes('armor') ? createDir(path.join('.', 'assets', 'tfc_metallum', 'textures', 'models', 'armor', type.replace('armor', metalName))) : createDir(path.join('.', 'assets', 'tfc_metallum', 'textures', pathType, 'metal', type.replace('.png', ''), metalName+'.png'))
            let metalPalette = getPaletteFromImage(await Jimp.read(path.join('.', 'colors', metalName+'.png')))

            let colors = getColors(metalPalette)

            if(!fs.existsSync(savePath)) await replaceMorePixels(savePath, typeImage, colors.primary, colors.secondary, colors.third)
        }
    }
}

run()
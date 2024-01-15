const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const { getPaletteFromImage, replacePixels } = require('../index')

let Rocks = fs.readdirSync('./rock').map(value => value.replace('.png', ''))

async function main() {
    for(let rockName of Rocks) {
        for(let block of ['cut_rockwool', 'pillar', 'pillar_top', 'rockwool_bricks', 'rockwool_brick']) {
            let outputFile = path.join('.', 'output', block, `${rockName}.png`)
            if(!fs.existsSync(outputFile)) {

                // read the images
                const data = await Jimp.read(path.join('.', `${block}.png`))
                const base = await Jimp.read(path.join('.', 'rock', `${rockName}.png`))
    
                //get the palette from the base image(by base image i mean the block texture)
                let palette = getPaletteFromImage(base)
    
                // replace the pixels and save the image
                await replacePixels(data, palette, outputFile)
        }
        }
    }
}

main()
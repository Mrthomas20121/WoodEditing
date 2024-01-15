const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const { getPaletteFromImage, replacePixels } = require('../index')

async function main() {
    let metals = fs.readdirSync('./palette');
    let parts = fs.readdirSync('./parts')
    for(let metal of metals) {
        for(let part of parts) {
            fs.mkdirSync(path.join('.', 'output', part.replace('.png', '')), { recursive:true })
            let file = path.join('.', 'output', part.replace('.png', ''), metal)
            if(!fs.existsSync(file)) {
                // base image to color
                const base = await Jimp.read(path.join('.', 'parts', part))

                // palette to use as color
                const data = await Jimp.read(path.join('.', 'palette', metal))

                // 
                let palette = getPaletteFromImage(data)

                Jimp

                // replace the pixels and save the image
                await replacePixels(base, palette, file)
            }
        }
    }
}

// main()

async function handleImage() {
    const exposed1 = await Jimp.read('./exposed_copper1.png');
    const exposed2 = await Jimp.read('./exposed_copper2.png');

    await exposed1.composite(exposed2, 0, 0).writeAsync('./output.png');
}
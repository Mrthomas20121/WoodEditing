const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const { getPaletteFromImage, replacePixels } = require('../index')

function createTagPath(pathTo) {
    let split = pathTo.includes('/') ? '/' : '\\';
    let tempPath = pathTo.split(split);
    tempPath.pop();
    let p = tempPath.join(split);
    if(!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive:true });
    }
    return pathTo;
}

async function main() {
    let metalsOxidized = fs.readdirSync('./oxidized_palette');
    let parts = ['block', 'cut', 'oxidized_cut', 'oxidized'];
    for(let metal of metalsOxidized) {
        for(let part of parts) {
            //fs.mkdirSync(path.join('.', 'output', part.replace('.png', '')), { recursive:true })
            let partFile = `./blocks/${part}.png`;
            let saveFile = createTagPath(path.join('.', 'textures', 'block', 'metal', part, metal));
            if(!fs.existsSync(saveFile)) {
                // base image to color
                const partData = await Jimp.read(partFile);

                // palette to use as color
                const data = await Jimp.read(path.join('.', part.includes('oxidized') ? 'oxidized_palette' : 'palette', metal));

                // 
                let palette = getPaletteFromImage(data);

                // replace the pixels and save the image
                await replacePixels(partData, palette, saveFile);
            }
        }
    }
}

main()
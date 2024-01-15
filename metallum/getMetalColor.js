const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const List = require('void-list')

let metals = require('./metals.json').map(value => value.name)

let output = []

async function getColor() {
    for(let metal of metals) {
        let image = await Jimp.read(path.join('.', 'colors', metal+'.png'))

        let color = image.getPixelColor(0, 0).toString(16)

        output.push({
            name:metal,
            color:`0x${color}`.slice(0, 7)
        })
    }

    fs.writeFileSync('./metal_colors.json', JSON.stringify(output, null, 2), 'utf8')
}

function transferMetals() {
    let colors = require('./metal_colors.json')
    let metals = require('./metals.json')

    for(let i = 0; i<metals.length; i++) {
        let metal = metals[i]
        let color = colors[i]
        metals[i].color = color.color
    }

    fs.writeFileSync('./metals.json', JSON.stringify(metals, null, 2), 'utf8')

}

getColor().then(() => {
    transferMetals()
})
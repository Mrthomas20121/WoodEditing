const fs = require('fs')
const path = require('path')

let folder = fs.readdirSync('./textures')

let json = {}

for(let file of folder) {
    json[file] = []

    if(!file.endsWith('.ini')) {
        let files = fs.readdirSync(path.join('.', 'textures', file))

        for(let f of files) {
            let fileName = f.replace('.png', '')
            let type = 'stone'
            if(fileName.endsWith('planks')) {
                type = 'planks'
            }
            else if(fileName.endsWith('sandstone')) {
                type = 'sandstone'
            }
            json[file].push({
                type:type,
                value:fileName
            })
        }
    }
}

fs.writeFileSync('./compat.json', JSON.stringify(json, null, 4))
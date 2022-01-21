/**
 * (C) Mrthomas20121 - 2021
 * Add Rechiseled support to Generic Ecosphere
 */
const Jimp = require('jimp')
const List = require('void-list')

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

let planks = [
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
]

async function main() {
    for(let wood_type of plank_types) {
        for(let wood of planks) {
            const base = await Jimp.read(`./planks/${wood}_planks.png`)
            const data = await Jimp.read(`./default/planks_${wood_type}.png`)
            let palette = getPaletteFromImage(base)

            await replacePixels(data, palette, `./export/${wood}_planks_${wood_type}.png`)
        }
    }
}

/**
 * Replace a pixel color with another one
 * @param {Jimp} image 
 * @param {number[]} pal
 */
async function replacePixels(image, pal, image_path='./test_2.png') {
    // get the palette from an image
    let p = getPaletteFromImage(image)
    let curr_palette = sortPalette(p)

    let palette = sortPalette(pal)

    if(palette.length < curr_palette.length) {
        console.log("Palette did not change because too little colors were used")
        return
    }
    else {
        for(let x = 0; x<image.getWidth(); x++) {
            for(let y = 0; y<image.getHeight(); y++) {
                let pixel_color = image.getPixelColor(x, y)
                for(let i = 0; i<curr_palette.size(); i++) {
                    if(pixel_color == curr_palette.get(i)) {
                        image.setPixelColor(palette.get(i), x, y)
                    }
                }
            }
        }
    }
    image.writeAsync(image_path)
}

/**
 * Convert a Decimal to RGB
 * https://stackoverflow.com/a/29242031/16368213
 * @param {number} c 
 * @returns 
 */
function c_to_rgb(c) {
    var b = c % 256,
        g_0 = (c % 65536 - b),
        r_0 = c - g_0 - b,
        g = g_0 / 256,
        r = r_0 / 65536;

    return [r, g, b];
}

/**
 * sort a palette by mode.
 * @param {List} palette 
 */
function sortPalette(palette) {
    let p = palette.map((value, index, arr) => {
        let rgb = c_to_rgb(value)
        let max = rgb[0]+rgb[1]+rgb[2]
        return {
            value:value,
            rgbMax:max
        }
    })

    p.sort((a,b) => b.rgbMax-a.rgbMax)

    return p.map((value, index, arr) => value.value)
}

/**
 * Get a palette from an image
 * @param {Jimp} image Jimp image
 */
function getPaletteFromImage(image) {
    let palette = new List()
    for(let x = 0; x<image.getWidth(); x++) {
        for(let y = 0; y<image.getHeight(); y++) {
            let color = image.getPixelColor(x, y)
            if(!palette.contain(color) && color != 0) {
                palette.add(color)
            }
        }
    }
    return palette
}

main()
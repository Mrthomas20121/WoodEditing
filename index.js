/**
 * (C) Mrthomas20121 - 2021
 * Add Rechiseled support to Generic Ecosphere
 */
const Jimp = require('jimp')
const List = require('void-list')

/**
 * Replace a pixel color with another one
 * @param {Jimp} image 
 * @param {number[]} pal
 */
async function replacePixels(image, pal, image_path='./test_2.png') {
    // get the palette from an image
    let reference_palette = getPaletteFromImage(image)
    reference_palette = sortPalette(reference_palette)

    let palette = sortPalette(pal)

    if(palette.length < reference_palette.length) {
        console.log("Palette did not change because too little colors were used\nSkipping!")
        return
    }
    else {
        for(let x = 0; x<image.getWidth(); x++) {
            for(let y = 0; y<image.getHeight(); y++) {
                let pixel_color = image.getPixelColor(x, y)
                for(let i = 0; i<reference_palette.size(); i++) {
                    if(pixel_color == reference_palette.get(i)) {
                        image.setPixelColor(palette.get(i), x, y)
                    }
                }
            }
        }
    }
    image.writeAsync(image_path)
}

/**
 * Replace a pixel color with another one
 * @param {Jimp} image 
 * @param {number[]} primary
 * @param {number[]} secondary
 * @param {number[]} third
 */
 async function replaceMorePixels(save_path, image, primary, secondary, third) {
    let blacklist = [ 
        1228281343, 1749950207, 
        2305239039, 673057791, 
        488447487,  269488383,
        1145324799,  690563583,
        3031675903, 2526451455,
        892679679,  909522687,
        1684301055, 1953789183,
        1886417151, 1633772031,
        1429876991, 1364283903,
        1665283583, 1111638783,
        1160915967, 1280068863,
        1430008831, 1396389119,
        1144139007, 1312372223
    ]
    // get the palette from an image
    let reference_palette = sortPalette(getPaletteFromImage(image).filter(value => !blacklist.includes(value)))

    let primary_palette = sortPalette(primary)
    let secondary_palette = sortPalette(secondary)
    let third_palette = sortPalette(third)

    if(reference_palette.size() == secondary_palette.size()) {
        primary_palette = secondary_palette
    }

    if(reference_palette.size() == third.size()) {
        primary_palette = third_palette
    }

    if(reference_palette.length > primary.length) {
        console.log("Error, Palette supplied have less colors than the image you are trying to color!")
        return
    }
    else {
        for(let x = 0; x<image.getWidth(); x++) {
            for(let y = 0; y<image.getHeight(); y++) {
                let pixel_color = image.getPixelColor(x, y)
                if(!blacklist.includes(pixel_color)) {
                    for(let i = 0; i<primary_palette.size(); i++) {
                        if(pixel_color == reference_palette.get(i)) {
                            image.setPixelColor(primary_palette.get(i), x, y);
                        }
                    }
                }
            }
        }
    }
    image.writeAsync(save_path)
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
 * sort a palette
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

    p.sort((a,b) => b.rgbMax-a.rgbMax);

    return p.map((value, index, arr) => value.value);
}

/**
 * Get a palette from an image
 * @param {Jimp} image Jimp image
 * @returns {List<number>}
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

module.exports = {
    getPaletteFromImage,
    c_to_rgb,
    sortPalette,
    replacePixels,
    replaceMorePixels
}
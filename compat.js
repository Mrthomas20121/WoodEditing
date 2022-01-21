const Jimp = require('jimp')
const List = require('void-list')
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

main()
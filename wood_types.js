let wood_types = {
    "druidcraft": [
        "elder",
        "darkwood"
    ],
    "infernalexp": [
        "soul_stone",
        "basalt_cobbled",
        "dullstone"
    ],
    "traverse": [
        "fir"
    ],
    "atum": [
        "linestone",
        "palm",
        "deadwood"
    ],
    "betternether": [
        "stalagnate",
        "willow",
        "wart",
        "rubeus",
        "mushroom_fir",
        "anchor_tree",
        "nether_sakura",
        "soul_sandstone?"
    ],
    "betterendforge": [
        "mossy_glowshroom",
        "lacugrove",
        "end_lotus",
        "pythadendron",
        "dragon_tree",
        "tenanea",
        "helix_tree",
        "umbrella_tree",
        "jellyshroom",
        "lucernia",
        "flavolite",
        "violecite",
        "sulfuric_rock",
        "virid_jadestone",
        "azure_jadestone",
        "sandy_jadestone",
        "umbralith"
    ],
    "twilight_forest": [
        "twilight_oak",
        "canopy",
        "mangrove",
        "dark",
        "time",
        "trans",
        "minewood",
        "sort"
    ],
    "blue_skies": [
        "bumble_block",
        "taratite",
        "turquoise_stone",
        "bluebright",
        "starlit",
        "frostbright",
        "midnight_sandstone",
        "lunar_stone",
        "lunar",
        "dusk",
        "maple",
        "crystallized",
        "crystal_sandstone",
        "cherry"
    ],
    "biomesoplenty": [
        "white_sandstone",
        "orange_sandstone",
        "black_sandstone",
        "fir",
        "redwood",
        "cherry",
        "mahogany",
        "jacaranda",
        "palm",
        "willow",
        "dead",
        "magic",
        "umbran",
        "hellbark"
    ],
    "undergarden": [
        "depthrock",
        "shiverstone",
        "tremblecrust",
        "smogstem",
        "wigglewood",
        "grongle"
    ],
    "byg": [
        "dacite",
        "red_rock",
        "travertine",
        "rocky_stone",
        "scoria",
        "soapstone",
        "black_sandstone",
        "white_sandstone",
        "blue_sandstone",
        "purple_sandstone",
        "pink_sandstone",
        "aspen",
        "baobab",
        "blue_enchanted",
        "bulbis",
        "cherry",
        "cika",
        "cypress",
        "ebony",
        "ether",
        "fir",
        "green_enchanted",
        "holly",
        "imparius",
        "jacaranda",
        "lament",
        "mahogany",
        "mangrove",
        "maple",
        "nightshade",
        "palm",
        "pine",
        "rainbow_eucalyptus",
        "redwood",
        "skyris",
        "willow",
        "witch_hazel",
        "zelkova",
        "sythian",
        "embur"
    ]
}

let output = {}

for(let key in wood_types) {
    let value = wood_types[key]
    output[key] = value.map((value, index, arr) => {
        if(value.endsWith('sandstone')) {
            return {
                type:'sandstone',
                value:value
            }
        }
        else if(value.endsWith('stone') || value.endsWith('rock')) {
            return {
                type:'stone',
                value:value
            }
        }
        return {
            type:'planks',
            value:value
        }
    })
}

console.log(JSON.stringify(output, null, 4))
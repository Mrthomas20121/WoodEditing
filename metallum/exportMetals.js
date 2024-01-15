const fs = require('fs')
const List = require('void-list')

let metals = require('./metals.json')

// metals.forEach(metal => {
//     metal.ingot_heat_capacity = 1/metal.specific_heat_base
//     metal.specific_heat = Math.round(300/metal.specific_heat_base) / 100000
// })

// metals.sort((a, b) => a.name.codePointAt(0)-b.name.codePointAt(0))

function getMetalTier(tier) {
    let result = ''
    if(tier == 0) {
        result = 'Metal.Tier.TIER_0'
    }
    else if(tier == 1) {
        result = 'Metal.Tier.TIER_I'
    }
    else if(tier == 2) {
        result = 'Metal.Tier.TIER_II'
    }
    else if(tier == 3) {
        result = 'Metal.Tier.TIER_III'
    }
    else if(tier == 4) {
        result = 'Metal.Tier.TIER_IV'
    }
    else if(tier == 5) {
        result = 'Metal.Tier.TIER_V'
    }
    else {
        result = 'Metal.Tier.TIER_VI'
    }
    return result
}

function getRarity(tier) {
    let result = ''
    switch(tier) {
        case 3:
            result = 'Rarity.UNCOMMON'
            break
        case 4:
        case 5:
            result = 'Rarity.RARE'
            break
        case 6:
            result = 'Rarity.EPIC'
            break
        default:
            result = 'Rarity.COMMON'
    }
    return result
}

let output = ''

for(let metal of metals) {
    let name = metal.name
    let tier = getMetalTier(metal.tier)
    let rarity = getRarity(metal.tier)

    if(metal.hasParts) {
        if(metal.hasToolArmor) {
            output+=`${name.toUpperCase()}(${metal.color}, ${rarity}, ${tier}, MetallumTiers.${name.toUpperCase()}, MetallumArmorMaterials.${name.toUpperCase()}, true, true, true),\n`
        }
        else {
            output+=`${name.toUpperCase()}(${metal.color}, ${rarity}, ${tier}, true, false, false),\n`
        }
    }
    else {
        output+=`${name.toUpperCase()}(${metal.color}, ${rarity}, ${tier}, false, false, false);`
    }
}
fs.writeFileSync('./output.txt', output, 'utf8')
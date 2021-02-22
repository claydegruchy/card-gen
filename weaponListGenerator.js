function calculate(str, factor = 1) {
  console.log("calculate", str, factor)
  var moneyObj = money(str)
  var d = 0
  d += moneyObj.gold * 240
  d += moneyObj.silver * 20
  d += moneyObj.copper / 1

  d = Math.round(d * factor)

  var gold = Math.floor(d / 240);
  var r = d % 240;
  var silver = Math.floor(r / 20);
  r = d % 20;
  var copper = Math.floor(r / 1);
  // var goldQuotient = Math.floor(silverQuotient / 20);
  // var silverRemainder = silverQuotient % 20;


  return money({
    gold,
    silver,
    copper
  })

}


var cost = "2g5s"
// console.log(calculate(cost, .2))

function money(str, multi = 1) {
  //pass in a moneny string to get a money object, and vice versa
  if (typeof str === 'object' && str !== null) {

    // ["gold", "silver", "copper", ]
    // .forEach(v => {
    //     str[v] = Math.round(str[v] * multi)
    // })



    var x = ''
    if (str.gold) {
      x += `${str.gold}G`
    }
    if (str.silver) {
      x += `${str.silver}S`
    }
    if (str.copper) {
      x += `${str.copper}d`
    }

    return x
  }
  str = str.toLowerCase()

  var gold = str.match(/[0-9]{1,40}g/gi)
  var silver = str.match(/[0-9]{1,40}s/gi)
  var copper = str.match(/[0-9]{1,40}d/gi)


  gold = gold && gold[0] && gold[0].match(/[0-9]{1,40}/gi)[0]
  silver = silver && silver[0] && silver[0].match(/[0-9]{1,40}/gi)[0]
  copper = copper && copper[0] && copper[0].match(/[0-9]{1,40}/gi)[0]


  return {
    gold,
    silver,
    copper,
  }
}

// var weapons = [{
//         "title": "Shield (Large)",
//         "damage": "+SB+3",
//         "reach": "Very Short",
//         "weight": 3,
//         "image": "roman-shield",
//         "rarity": "Common",
//         "cost": "3GC",
//         "description": [
//             "Shield 3",
//             "Defensive",
//             "Undamaging"
//         ],
//         "type": "PARRY",
//         "kind": "weapon"
//     },
//     {
//         "title": "Hand Axe",
//         "damage": "+SB+4",
//         "reach": "Medium",
//         "weight": 1,
//         "image": "fire-axe",
//         "rarity": "Common",
//         "cost": "1GC",
//         "description": null,
//         "type": "BASIC",
//         "kind": "weapon"
//     },
//     {
//         "title": "Hand Mace",
//         "damage": "+SB+4",
//         "reach": "Medium",
//         "weight": 1,
//         "image": "flanged-mace",
//         "rarity": "Common",
//         "cost": "1GC",
//         "description": null,
//         "type": "BASIC",
//         "kind": "weapon"
//     },
//     {
//         "title": "Hand Sword",
//         "damage": "+SB+4",
//         "reach": "Medium",
//         "weight": 1,
//         "image": "stiletto",
//         "rarity": "Common",
//         "cost": "1GC",
//         "description": null,
//         "type": "BASIC",
//         "kind": "weapon"
//     },
//     {
//         "title": "Dagger",
//         "damage": "+SB+2",
//         "reach": "Very Short",
//         "weight": 0,
//         "image": "plain-dagger",
//         "rarity": "Common",
//         "cost": "16S",
//         "description": null,
//         "type": "BASIC",
//         "kind": "weapon"
//     },
//     {
//         "title": "Knife",
//         "damage": "+SB+1",
//         "reach": "Very Short",
//         "weight": 0,
//         "image": "curvy-knife",
//         "rarity": "Common",
//         "cost": "8S",
//         "description": [
//             "Undamaging"
//         ],
//         "type": "BASIC",
//         "kind": "weapon"
//     },
//     {
//         "title": "Knuckledusters",
//         "damage": "+SB+2",
//         "reach": "Personal",
//         "weight": 0,
//         "image": "brass-knuckles",
//         "rarity": "Common",
//         "cost": "2S6d",
//         "description": null,
//         "type": "FIST",
//         "kind": "weapon"
//     },
//     {
//         "title": "Grain Flail",
//         "damage": "+SB+3",
//         "reach": "Average",
//         "weight": 0,
//         "image": "wood-stick",
//         "rarity": "Common",
//         "cost": "10S",
//         "description": [
//             "Distract",
//             "Imprecise",
//             "Wrap"
//         ],
//         "type": "FLAIL",
//         "kind": "weapon"
//     },
//     {
//         "title": "Shield (Buckler)",
//         "damage": "+SB+1",
//         "reach": "Personal",
//         "weight": 0,
//         "image": "round-shield",
//         "rarity": "Common",
//         "cost": "18S2d",
//         "description": [
//             "Shield 1",
//             "Defensive",
//             "Undamaging"
//         ],
//         "type": "PARRY",
//         "kind": "weapon"
//     },
//     {
//         "title": "Shield",
//         "damage": "+SB+2",
//         "reach": "Very Short",
//         "weight": 1,
//         "image": "shield",
//         "rarity": "Common",
//         "cost": "2GC",
//         "description": [
//             "Shield 2",
//             "Defensive",
//             "Undamaging"
//         ],
//         "type": "PARRY",
//         "kind": "weapon"
//     },
//     {
//         "title": "Halberd",
//         "damage": "+SB+4",
//         "reach": "Very Long",
//         "weight": 8,
//         "image": "halberd",
//         "rarity": "Common",
//         "cost": "2GC",
//         "description": [
//             "Defensive",
//             "Hack",
//             "Impale"
//         ],
//         "type": "POLEARM",
//         "size": "two handed",
//         "kind": "weapon"
//     },
//     {
//         "title": "Spear",
//         "damage": "+SB+4",
//         "reach": "Long",
//         "weight": 2,
//         "image": "stone-spear",
//         "rarity": "Common",
//         "cost": "15S",
//         "description": [
//             "Impale"
//         ],
//         "type": "POLEARM",
//         "size": "two handed",
//         "kind": "weapon"
//     },
//     {
//         "title": "Quarter Staff",
//         "damage": "+SB+4",
//         "reach": "Long",
//         "weight": 2,
//         "image": "wizard-staff",
//         "rarity": "Common",
//         "cost": "3S",
//         "description": [
//             "Defensive",
//             "Pummel"
//         ],
//         "type": "POLEARM",
//         "size": "two handed",
//         "kind": "weapon"
//     },
//     {
//         "title": "Zweihander",
//         "damage": "+SB+5",
//         "reach": "Long",
//         "weight": 3,
//         "image": "shard-sword",
//         "rarity": "Scarce",
//         "cost": "10GC",
//         "description": [
//             "Damaging",
//             "Hack"
//         ],
//         "type": "two-handed",
//         "size": "two handed",
//         "kind": "weapon"
//     },
// ]
// var armour = [{
//         "title": "Leather Jack",
//         "damage": "1 AP",
//         "reach": "Arms, Body",
//         "weight": 1,
//         "image": "shirt",
//         "rarity": "Common",
//         "cost": "12S",
//         "description": [
//             "Soft"
//         ],
//         "type": "Soft leather",
//         "size": "None",
//         "kind": "Armour"
//     },
//     {
//         "title": "Leather Jerkin",
//         "damage": "1 AP",
//         "reach": "Body",
//         "weight": 1,
//         "image": "leather-vest",
//         "rarity": "Common",
//         "cost": "10S",
//         "description": [
//             "Soft"
//         ],
//         "type": "Soft leather",
//         "size": "None",
//         "kind": "Armour"
//     },
//     {
//         "title": "Leather Leggings",
//         "damage": "1 AP",
//         "reach": "Legs",
//         "weight": 1,
//         "image": "boots",
//         "rarity": "Common",
//         "cost": "14S",
//         "description": [
//             "Soft"
//         ],
//         "type": "Soft leather",
//         "size": "None",
//         "kind": "Armour"
//     },
//     {
//         "title": "Leather Skullcap",
//         "damage": "1 AP",
//         "reach": "Head",
//         "weight": 0,
//         "image": "bandana",
//         "rarity": "Common",
//         "cost": "8S",
//         "description": [
//             "Soft",
//             "Partial"
//         ],
//         "type": "Soft leather",
//         "size": "None",
//         "kind": "Armour"
//     },
//     {
//         "title": "Mail Coat",
//         "damage": "2 AP",
//         "reach": "Arms, Body",
//         "weight": 3,
//         "image": "mail-shirt",
//         "rarity": "Common",
//         "cost": "3GC",
//         "description": [
//             "Loud",
//             "Flexible"
//         ],
//         "type": "Mail",
//         "size": "None",
//         "kind": "Armour"
//     },
//     {
//         "title": "Open Helm",
//         "damage": "2 AP",
//         "reach": "Head",
//         "weight": 1,
//         "image": "brodie-helmet",
//         "rarity": "Common",
//         "cost": "2GC",
//         "description": [
//             "Loud",
//             "Partial"
//         ],
//         "type": "Metal Plate",
//         "size": "-10% Perception",
//         "kind": "Armour"
//     },
//
//
//     {
//         "title": "Mail Chausses",
//         "damage": "2 AP",
//         "reach": "Legs",
//         "weight": 3,
//         "image": "steeltoe-boots",
//         "rarity": "Scarce",
//         "cost": "2GC",
//         "description": [
//             "Loud",
//             "Flexible"
//         ],
//         "type": "Mail",
//         "size": "None",
//         "kind": "Armour"
//     }
// ]
//
// var ranged = [{
//         "title": "Bow",
//         "damage": "+SB+3",
//         "reach": 50,
//         "weight": 2,
//         "image": "bow-string",
//         "rarity": "Common",
//         "cost": "4GC",
//         "description": null,
//         "type": "BOW",
//         "size": "two handed",
//         "kind": "weapon"
//     },
//     {
//         "title": "Shortbow",
//         "damage": "+SB+2",
//         "reach": 20,
//         "weight": 1,
//         "image": "bow-arrow",
//         "rarity": "Common",
//         "cost": "3GC",
//         "description": null,
//         "type": "BOW",
//         "size": "two handed",
//         "kind": "weapon"
//     },
//     {
//         "title": "Sling",
//         "damage": "+6",
//         "reach": 60,
//         "weight": 0,
//         "image": "sling",
//         "rarity": "Common",
//         "cost": "1S",
//         "description": null,
//         "type": "SLING",
//         "kind": "weapon"
//     },
//     {
//         "title": "Arrow (12)",
//         "damage": "+0",
//         "reach": "As weapon",
//         "weight": 0,
//         "image": "arrow-flights",
//         "rarity": "Common",
//         "cost": "5S",
//         "description": [
//             "Impale"
//         ],
//         "type": "Ammunition",
//         "kind": "weapon"
//     },
//     {
//         "title": "Stone Bullet (12)",
//         "damage": "+0",
//         "reach": "As weapon",
//         "weight": 0,
//         "image": "crumbling-ball",
//         "rarity": "Common",
//         "cost": "4d",
//         "description": [
//             "Pummel"
//         ],
//         "type": "Ammunition",
//         "kind": "weapon"
//     }
// ]

var randomElement = array => array[Math.floor(Math.random() * array.length)];
var issues = [
  // "Loud",
  "Unreliable",
  // "Bulky",
  // "Ugly",
  "Shoddy",
]

var hiddenIssue = "Something seems off about this item...";

// var w = [weapons, armour, ranged].forEach(list => {
//     list = list.map(item => {
//         if (["Ammunition", "FIST"].includes(item.type)) return item
//         item.flavour = "From Jahrdrung Market"
//         item.title = randomElement(["Old ", "Worn "]) + item.title
//         // item.description = [...item.description || "", randomElement([hiddenIssue, "", ""])]
//         // item.description = [...new Set(item.description)]
//         // item.description = item.description.filter(e => e.length > 0)
//         // if (item.description.includes(hiddenIssue)) {
//         //     item.cost = calculate(item.cost, .5)
//         // }

//         item.description = [...item.description || "", randomElement([randomElement(issues), "", ""])]
//         item.description = [...new Set(item.description)]
//         item.description = item.description.filter(e => e.length > 0)
//         item.description = item.description
//         if (item.description.filter(e => issues.includes(e)).length > 0) {
//             // console.log("ok",item.description.filter(e => issues.includes(e)))
//             item.cost = calculate(item.cost, .5)
//         } else {
//             // console.log("not")s
//         }

//         return item
//     })
// })
(async () => {
  var cardGen = await require("./card-gen.js").data()
  cardGen.presetList = await Promise.all(cardGen.items.map(async w => await cardGen.mapFields(w)));
  console.log(cardGen.presetList);

})()


// var items = JSON.parse(i)

// var args = process.argv.slice(2);
//
// var cost = args[0]
// var fact = args[1]

// console.log(items);
// console.log("asd", calculate(cost, fact))

// console.log(JSON.stringify([...weapons, ...armour, ...ranged]))

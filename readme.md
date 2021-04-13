## WFRP card generator
A tool to make WFRP cards. The goal of this tool is to make easily referenceable weapon and armour cards to give to players.

Item images can be saved by simply clicking on the image.

### Make custom cards
https://claydegruchy.github.io/card-gen/card-maker

This can be used to customise presets of cards. If the icon you want does not appear, check game-icons.net and use the specific icon name to include it. You can also add custom rules using the description box by simply typing in the rule  you'd like, it  will appear as `custom rule`.

Item images can be saved by simply clicking on the image.

### Bulk generate all weapons
https://claydegruchy.github.io/card-gen/

This will fire out nearly all weapons. It starts with a random selection of ~5.

#### Import/Export
Customised weapons can be exported as JSON strings for later. Heres an example.
```
{
  "title": "Barge Pole",
  "damage": "+SB+3",
  "reach": "Long",
  "weight": "3",
  "image": "bo",
  "rarity": "Common",
  "flavour": "this is where the flavour goes",
  "cost": "3S",
  "kind": "weapon",
  "description": [
    "Pummel"
  ],
  "type": "POLEARM",
  "size": "two handed"
}
```



## TODO
- make configurable card layout

## Running locally
- clone this
- `npm i --save`
- `npm start` (starts `browsify` and `reload`e)

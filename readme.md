## WFRP card generator
A tool to make WFRP cards.

### Make custom cards
https://claydegruchy.github.io/card-gen/card-maker

### Bulk generate all default weapons
https://claydegruchy.github.io/card-gen/

This can be used to customise presets of cards. If the icon you want does not appear, check game-icons.net and use the specific icon name to include it. You can also add custom rules using the description box by simply typing in the rule  you'd like, it  will appear as `custom rule`.

Item images can be saved by simply clicking on the image.

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

window.addEventListener("load", async e => {

    var weaponGen = await require("./card-gen.js").data()
    if (document.querySelector('#cardDump')) {
        weapons = weaponGen.weapons
            // .filter(e => e.Availability.toLowerCase() != "exotic")
            .map(async (e, i) => weaponGen.generateCard(e, { i })
                .then(card => document.querySelector('#cardDump').innerHTML += card))
    }
    if (document.querySelector('#cardMake')) {
        var defaultWeapon = weaponGen.weapons[24];
        refresh = (weapon) => weaponGen.generateCard(weapon)
            .then(card => document.querySelector('#cardMake').innerHTML = card)


        // ingredientsSelector = new SlimSelect({
        //     select: ".ingredients-selector",
        //     placeholder: "What will you add to this potion?",
        //     limit: pm.options.maxComponents,
        //     data: generateComponentOptions(),
        //     showOptionTooltips: true,
        //     // afterClose: function(t) {
        //     //     this.open();
        //     //     console.log('beforeClose' )
        //     // },
        //     // beforeClose: function(t) {
        //     //     this.open();
        //     //     console.log('beforeClose' )
        //     // },
        //     closeOnSelect: false,
        //     onChange: info => {
        //         console.log("info", info);
        //     }
        // });




        var optionTemplate = Handlebars.compile(`
<div class="options grid-container">
    <input placeholder="title" value="{{title}}" class="option title"></input>
    <input placeholder="damage" value="{{damage}}" class="option damage"></input>
    <input placeholder="reach" value="{{reach}}" class="option reach"></input>
    <input placeholder="weight" value="{{{weight}}}" class="option weight"></input>
    <input placeholder="image" value="{{image}}" class="option image"></input>
    <input placeholder="rarity" value="{{rarity}}" class="option rarity"></input>
    <input placeholder="flavour" value="{{flavour}}" class="option flavour"></input>
    <input placeholder="cost" value="{{cost}}" class="option cost"></input>
    <input placeholder="uniqueid" value="{{uniqueid}}" class="option uniqueid"></input>
    <input placeholder="description" value="{{{description}}}" class="option description"></input>
    <input placeholder="type" value="{{type}}" class="option type"></input>
    <input placeholder="size" value="{{size}}" class="option size"></input>
</div>
      `)

        // text.addEventListener('change', e => save(title, text.value));
        // text.addEventListener('keyup', e => save(title, text.value));


        //populate the options
        

        document.querySelector('#cardOptions').innerHTML = optionTemplate(await weaponGen.mapFields(weaponGen.weapons[24]))
        //connect options to listeners




        refresh(defaultWeapon)

    }

    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)



})
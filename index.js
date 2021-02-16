window.addEventListener("load", async e => {

    var cardGen = await require("./card-gen.js").data()
    if (document.querySelector('#cardDump')) {
        weapons = cardGen.weapons
            // .filter(e => e.Availability.toLowerCase() != "exotic")
            .map(async (e, i) => cardGen.generateCard(e, { i })
                .then(card => document.querySelector('#cardDump').innerHTML += card))
    }
    if (document.querySelector('#cardMake')) {
        var defaultWeapon = await cardGen.mapFields(cardGen.weapons[24])



        refresh = (weapon) => cardGen.runCompile(weapon)
            .then(card => {
                console.log(card)
                document.querySelector('#cardMake').innerHTML = cardGen.cardTemplate(card)
            })


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
			    <input data-key="title" placeholder="title" value="{{title}}" class="option title"></input>
			    <input data-key="damage" placeholder="damage" value="{{damage}}" class="option damage"></input>
			    <input data-key="reach" placeholder="reach" value="{{reach}}" class="option reach"></input>
			    <input data-key="weight" placeholder="weight" value="{{{weight}}}" class="option weight"></input>
			    <input data-key="image" placeholder="image" value="{{image}}" class="option image"></input>
			    <input data-key="rarity" placeholder="rarity" value="{{rarity}}" class="option rarity"></input>
			    <input data-key="flavour" placeholder="flavour" value="{{flavour}}" class="option flavour"></input>
			    <input data-key="cost" placeholder="cost" value="{{cost}}" class="option cost"></input>
			    <input data-key="uniqueid" placeholder="uniqueid" value="{{uniqueid}}" class="option uniqueid"></input>
			    <input data-key="description" placeholder="description" value="{{{description}}}" class="option description"></input>
			    <input data-key="type" placeholder="type" value="{{type}}" class="option type"></input>
			    <input data-key="size" placeholder="size" value="{{size}}" class="option size"></input>
			</div>
      `)

        //populate the options
        document.querySelector('#cardOptions').innerHTML = optionTemplate(defaultWeapon)
        //find the inputs
        var inputs = [...document.querySelectorAll("input, textarea, select")]
        //make a fucntion to get the values of the fields
        var getInputInfo = async () => {
            var w = inputs.map(i => ({
                [i.dataset.key]: i.value || cardGen.defaults.fields[i.dataset.key]
            }))
            return await Object.assign({}, ...w)
        }
        //connect options to listeners
        inputs.map(i => {
            i.addEventListener('change', e => getInputInfo()
                .then(weapon => refresh(weapon)));
            i.addEventListener('keyup', e => getInputInfo()
                .then(weapon => refresh(weapon)));
        })





        //get the current input on the first run
        var currentInput = await getInputInfo()
        console.log(currentInput)
//update the card template with that info
        refresh(currentInput)

    }

    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)



})
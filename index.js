window.addEventListener("load", async e => {

    var cardGen = await require("./card-gen.js").data()

    if (document.querySelector('#cardDump')) {
        weapons = cardGen.weapons
            // .filter(e => e.Availability.toLowerCase() != "exotic")
            .map(async (e, i) => cardGen.generateCard(e, { i })
                .then(card => document.querySelector('#cardDump').innerHTML += card))
    }
    if (document.querySelector('#cardMake')) {

        var iconList = require("./icon-list.json")
        //this disables the full icon list which is VERY large
        iconList = [...new Set(cardGen.weapons
            .map(w => w.Art))]

        var defaultWeapon = await cardGen.mapFields(cardGen.weapons[24])
        console.log(defaultWeapon)

        var uiOptions = {
            image: e => iconList
                .map(icon => ({ text: icon, value: icon, selected: e.image.includes(icon) })),
            rarity: e => [...new Set(cardGen.weapons
                    .map(w => w.Availability))]
                .map(i => ({ text: i, value: i, selected: e.rarity.includes(i) })),
            description: e => Object.keys(cardGen.qualities)
                .map(i => ({ text: i, value: i, selected: e.description.includes(i) })),
            type: e => [...new Set(cardGen.weapons
                    .map(w => w.Type))]
                .map(i => ({ text: i, value: i, selected: e.type.includes(i) })),
        }
        console.log(uiOptions)

        var shit = e => this.constructor.name
        console.log(shit())

        refresh = (weapon) => cardGen.runCompile(weapon)
            .then(card => {
                // console.log(card)
                document.querySelector('#cardMake').innerHTML = cardGen.cardTemplate(card)
            })







        var optionTemplate = Handlebars.compile(`
			<div class="options grid-container">
			    <input data-key="title" placeholder="title" value="{{title}}" class="option title"></input>
			    <input data-key="damage" placeholder="damage" value="{{damage}}" class="option damage"></input>
			    <input data-key="reach" placeholder="reach" value="{{reach}}" class="option reach"></input>
			    <input data-key="weight" placeholder="weight" value="{{{weight}}}" class="option weight"></input>
				<select data-key="image" placeholder="image" value="{{image}}" class="option image"></select>
			    <select data-key="rarity" placeholder="rarity" value="{{rarity}}" class="option rarity"></select>
			    <input data-key="flavour" placeholder="flavour" value="{{flavour}}" class="option flavour"></input>
			    <input data-key="cost" placeholder="cost" value="{{cost}}" class="option cost"></input>
			    <input data-key="uniqueid" placeholder="uniqueid" value="{{uniqueid}}" class="option uniqueid"></input>
			    <select multiple data-key="description" placeholder="description" value="{{{description}}}" class="option description"></select>
			    <select data-key="type" placeholder="type" value="{{type}}" class="option type"></select>
			    <input data-key="size" placeholder="size" value="{{size}}" class="option size"></input>
			</div>
			
      `)








        //populate the options
        document.querySelector('#cardOptions').innerHTML = optionTemplate(defaultWeapon)

        //config the selects
        var selects = [...document.querySelectorAll("select")]
        var inputs = [...document.querySelectorAll("input, textarea, select")]


        selects.forEach(select => {



            new SlimSelect({
                select: select,
                placeholder: "How do you want to prepare these ingredients?",
                data: uiOptions[select.dataset.key](defaultWeapon),
                closeOnSelect: true,

            });


        })

        //make a fucntion to get the values of the fields
        var getInputInfo = async () => {




            var w = inputs.map(i => {

                var selected = [...document.querySelectorAll(`select[multiple][data-key=${i.dataset.key}] option:checked`)]
                    .map(el => el.value)
                var v = i.value
                if (selected.length > 0) {
                    v = selected
                } else {
                    selected = null
                }

                return {
                    [i.dataset.key]: v || selected || cardGen.defaults.fields[i.dataset.key]
                }
            })
            console.log(w)
            return await Object.assign({}, ...w)
        }
        //connect options to listeners
        inputs.map(i => {


            i.addEventListener('change', e => getInputInfo()
                .then(weapon => refresh(weapon)));

            i.addEventListener('keyup', e => getInputInfo()
                .then(weapon => refresh(weapon)));

            // if (i.nodeName != "SELECT") return;
        })


        //get the current input on the first run
        var currentInput = await getInputInfo()
        // console.log(currentInput)
        //update the card template with that info
        refresh(currentInput)

    }

    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)



})
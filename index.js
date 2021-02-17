window.addEventListener("load", async e => {

    var cardGen = await require("./card-gen.js").data()
    const Swal = require('sweetalert2')

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
            image: e => {
                if (!iconList.includes(e.image)) {
                    iconList.push(e.image)
                }
                return iconList
                    .map(icon => ({ text: icon, value: icon, selected: e.image.includes(icon) }))
            },
            rarity: e => [...new Set(cardGen.weapons
                    .map(w => w.Availability))]
                .map(i => ({ text: i, value: i, selected: e.rarity.includes(i) })),
            description: e => Object.keys(cardGen.qualities)
                .map(i => ({ text: i, value: i, selected: e.description && e.description.includes(i) })),
            type: e => [...new Set(cardGen.weapons
                    .map(w => w.Type))]
                .map(i => ({ text: i, value: i, selected: e.type.includes(i) })),
        }







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







        var mainOperatingArea = document.querySelector('#cardOptions')
        //populate the options
        mainOperatingArea.innerHTML = optionTemplate(defaultWeapon)

        //config the selects
        var selects = [...mainOperatingArea.querySelectorAll("select.option")]
        var allInputTypes = [...mainOperatingArea.querySelectorAll("input, textarea, select")]



        var populateOptionFields = weaponInfo => {
            var inputs = [...document.querySelectorAll("input")]
            inputs
                .forEach(i => {
                    console.log(weaponInfo[i.dataset.key])
                    i.value = weaponInfo[i.dataset.key] || ""
                })

            selects.forEach(select => {
                new SlimSelect({
                    select: select,
                    placeholder: select.dataset.key,
                    data: uiOptions[select.dataset.key](weaponInfo),
                    closeOnSelect: true,

                    addable: function(value) {
                        // return false or null if you do not want to allow value to be submitted
                        if (!["image", "description"].includes(select.dataset.key)) return false;
                        return {
                            text: value,
                            value: value.toLowerCase()
                        }
                    }
                });
            })
        }

        populateOptionFields(defaultWeapon)

        //make a fucntion to get the values of the fields
        var getInputInfo = async () => {
            var w = allInputTypes.map(i => {
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


        //get the current input on the first run
        var currentInput = await getInputInfo()



        //make the refresh function
        var refresh = (weapon) => cardGen.runCompile(weapon)
            .then(card =>
                document.querySelector('#cardMake').innerHTML = cardGen.cardTemplate(card)
            )

        //connect options to listeners
        allInputTypes.map(i => {


            i.addEventListener('change', e => getInputInfo()
                .then(weapon => refresh(weapon)));

            i.addEventListener('keyup', e => getInputInfo()
                .then(weapon => refresh(weapon)));

            // if (i.nodeName != "SELECT") return;
        })


        //update the card template with that info
        refresh(currentInput)


        // make a list of presests to choos from 

        var presetList = await Promise.all(cardGen.weapons.map(async w => await cardGen.mapFields(w)))

        new SlimSelect({
            select: "#presets",
            searchPlaceholder: "Select a preset weapon template",
            data: presetList.map(w => ({ text: w.title, value: w.title })),
            closeOnSelect: true,
            onChange: async e => {
                populateOptionFields(presetList.find(w => w.title == e.value))
                refresh(await getInputInfo())
                // populateOptionFields())
            }
        });

        // config exporter
        document.getElementById("export").onclick = async e => {
            var inp = JSON.stringify(await getInputInfo(), null, 2)
            Swal.fire({
                    input: 'textarea',
                    title: 'Export data',
                    text: 'Copy your data string below',
                    inputValue: inp,
                    inputAttributes: {
                        'aria-label': 'Type your message here',
                    },
                    showCancelButton: true,
                })
                .disableInput()
        };
        //config importer
        document.getElementById("import").onclick = e => {
            Swal.fire({
                    input: 'textarea',
                    inputPlaceholder: 'Enter your weapon info...',
                    title: 'Import data',
                    text: 'Paste your weapon string below',
                    inputAttributes: {
                        'aria-label': 'Type your message here',
                    },
                    showCancelButton: true,
                })
                .then(o => JSON.parse(o.value))
                .then(o => populateOptionFields(o))
                .then(async o => refresh(await getInputInfo()))
                .then(m => {
                    if (m != 'success') {
                        return ""
                    } else {
                        updateTemplate();
                        return Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Data set loaded',
                            timer: 1300
                        })
                    }
                })
                .catch(e => Swal.fire({
                    icon: 'error',
                    title: 'Import failed',
                    text: 'Something went wrong! ' + e,
                }))
        };
    }
})
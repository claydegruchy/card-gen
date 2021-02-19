window.addEventListener("load", async e => {
    const Swal = require('sweetalert2')

    Swal.fire({
        position: 'top-end',
        icon: 'warning',
        toast: true,
        title: `Loading...`,
        showConfirmButton: false,
        timer: 500
    })

    const html2canvas = require("html2canvas")
    var cardGen = await require("./card-gen.js").data()
    const domtoimage = require('dom-to-image');
    const { rword } = require("rword");

    cardGen.presetList = await Promise.all(cardGen.items.map(async w => await cardGen.mapFields(w)));

    if (document.querySelector('#cardDump')) {

        var dump = document.querySelector('#cardDump')

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        var filterOption = "rarity"
        var filterSelection = []
        var calculateDropdown = async () => {

            cardGen.presetList = cardGen.presetList
                .filter(w => !filterSelection.includes(w.rarity.toLowerCase()))
            // .filter(w => !["improvised", "fist"].includes(w.type.toLowerCase()))

            // console.log(cardGen.presetList)
            var groupingOption = "type"

            // var filterOptions = [...new Set(cardGen.presetList.map(i => i[filterOption]))]

            var weaponOptionList = [...new Set(cardGen.presetList.map(i => i[groupingOption].toUpperCase()))]
                .map(s => ({
                    label: s,
                    options: cardGen.presetList
                        .filter(i => i[groupingOption].toUpperCase() == s)
                        .map(w => ({
                            text: w.title,
                            innerHTML: `<div class="inline">${w.title}</div> - <small class="inline">${w.rarity} ${w.kind} ${w.flavour||""}</div>`,
                            value: w.title
                        })),
                }))


            var weaponFilterList = cardGen.presetList
                .map(type => ({
                    options: cardGen.presetList
                        .filter(i => i[groupingOption] == type)
                        .map(w => ({ text: w.title, value: w.title })),
                }))


            // new SlimSelect({
            //     select: "#presets",
            //     searchPlaceholder: "Select a preset weapon template",
            //     data: weaponOptionList,
            //     selectByGroup: true,
            //     closeOnSelect: true,
            //     onChange: updateView
            // });

            var updateView = async function(selected) {
                //this is weird and stupid but basically it makes sense that we dont try to spwan the same card template twice
                selected = selected.map(s => s.value)
                this.pending = this.pending || []
                this.pending.push(...selected)
                this.instance = this.instance || 0
                this.instance += 1
                var me = this.instance + 0
                await sleep(200)
                this.pending = [...new Set(this.pending)]
                if (this.instance > me) { return; }
                var selectedItems = cardGen.presetList.filter(i => this.pending.includes(i.title))
                dump.innerHTML = ""
                await Promise.all(selectedItems
                    .map(async e => {
                        var c = await cardGen.runCompile(e)
                        dump.insertAdjacentHTML('beforeend', cardGen.cardTemplate(c));
                    }))
                this.pending = []


                var nas = [...document.querySelectorAll(".grid-container.card.card-background")]
                    .forEach(card => {
                        card.onclick = async e => {
                            console.log("clicks")
                            var filename = `${card.querySelector(".title").innerHTML}-${rword.generate(1, { length: '4-5' })}`

                            Swal.fire({
                                position: 'top-end',
                                icon: 'warning',
                                toast: true,
                                title: `Saving image ${filename}.jpg. This may take some time`,
                                showConfirmButton: false,
                                timer: 1000
                            })
                            await domtoimage.toJpeg(card, { quality: 1 })
                                .then(function(dataUrl) {
                                    var link = document.createElement('a');
                                    link.download = filename + '.jpeg';
                                    link.href = dataUrl;
                                    link.click();
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        toast: true,
                                        title: `Image saved`,
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                });
                        }
                    })

            }

            var s = new SlimSelect({
                select: "#presets",
                searchPlaceholder: "Select a preset weapon template",
                data: weaponOptionList,
                selectByGroup: true,
                closeOnSelect: false,
                onChange: updateView
            });

            // new SlimSelect({
            //     select: "#filter",
            //     searchPlaceholder: "Select the " + filterOption,
            //     data: filterOptions.map(e => ({ text: e, value: e, select: filterSelection.includes(e) })),
            //     selectByGroup: true,
            //     closeOnSelect: false,
            //     onChange: e => {
            //         console.log(e)
            //         filterSelection = [...new Set(e)]
            //         calculateDropdown()
            //     }
            // });

            return s


        }

        var presetSelector = await calculateDropdown()
        var randomElement = array => array[Math.floor(Math.random() * array.length)];

        var randomSelection = [...new Set(Array.from(new Array(cardGen.defaults.bulkGenDefault))
            .map((x, i) => randomElement(cardGen.presetList).title))]
        presetSelector.set(randomSelection)






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
                .then(o => {
                    if (!Array.isArray(o)) o = [o]
                    return o
                })
                .then(async o => {
                    var simplePreset = cardGen.presetList.map(i => JSON.stringify(i))
                    o = o.filter(i => !simplePreset.includes(JSON.stringify(i)))
                    cardGen.presetList.push(...o)
                    await calculateDropdown()
                })
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

        // config exporter
        document.getElementById("export").onclick = async e => {
            var inp = presetSelector.selected()
            inp = cardGen.presetList.filter(i => inp.includes(i.title))

            Swal.fire({
                    input: 'textarea',
                    title: 'Export data',
                    text: 'Copy your data string below',
                    inputValue: JSON.stringify(inp, null, 2),
                    inputAttributes: {
                        'aria-label': 'Type your message here',
                    },
                    showCancelButton: true,
                })
                .disableInput()
        };

        // config exporter
        document.getElementById("clear").onclick = async e => {
            presetSelector.set([])
        };





    }
    if (document.querySelector('#cardMake')) {

        var iconList = require("./icon-list.json")
        //this disables the full icon list which is VERY large
        iconList = [...new Set(cardGen.items
            .map(w => w.Art))]



        var defaultWeapon = await cardGen.mapFields(cardGen.items[24])
        console.log(defaultWeapon)

        var uiOptions = {
            image: e => {
                if (!iconList.includes(e.image)) {
                    iconList.push(e.image)
                }
                return iconList
                    .map(icon => ({ text: icon, value: icon, selected: e.image.includes(icon) }))
            },
            rarity: e => [...new Set(cardGen.items
                    .map(w => w.Availability))]
                .map(i => ({ text: i, value: i, selected: e.rarity.includes(i) })),
            description: e => Object.keys(cardGen.qualities)
                .map(i => ({ text: i, value: i, selected: e.description && e.description.includes(i) })),
            type: e => [...new Set(cardGen.items
                    .map(w => w.Type))]
                .map(i => ({ text: i, value: i, selected: e.type.includes(i) })),
            kind: e => [...new Set(cardGen.items
                    .map(w => w.Kind))]
                .map(i => ({ text: i, value: i, selected: e.kind.includes(i) })),
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
			    <select data-key="kind" placeholder="kind" value="{{kind}}" class="option kind"></select>
			    <select multiple data-key="description" placeholder="description" value="{{{description}}}" class="option description"></select>
			    <select data-key="type" placeholder="type" value="{{type}}" class="option type"></select>
			    <input data-key="size" placeholder="size" value="{{size}}" class="option size"></input>
			</div>
			
      `)



        var saveDiv = div => {
            const html2canvas = require("html2canvas")
            html2canvas(div).then(canvas => {
                document.body.appendChild(canvas)
            });
        }




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


        new SlimSelect({
            select: "#presets",
            searchPlaceholder: "Select a preset weapon template",
            data: [...new Set(cardGen.presetList.map(i => i.kind))]
                .map(kind => ({
                    label: kind,
                    options: cardGen.presetList
                        .filter(i => i.kind == kind)
                        .map(w => ({ text: w.title, value: w.title })),
                })),

            closeOnSelect: true,
            onChange: async e => {
                populateOptionFields(cardGen.presetList.find(w => w.title == e.value))
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

    await Swal.fire({
        position: 'top-end',
        icon: 'success',
        toast: true,
        title: `Loading complete!`,
        showConfirmButton: false,
        timer: 500
    })
})
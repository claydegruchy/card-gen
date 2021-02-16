exports.data = async function() {
    var { rword } = require("rword");
    var weapons = require("./weapons.json");
    var qualities = require("./qualities.json");



    async function objectPromise(object) {
        if (!object) return false
        return Promise.all(Object.values(object))
            .then(data => {
                return Object.keys(object).map(function(v, i) {
                    return [v, data[i]];
                });
            })
            .then(data => Object.assign(...data.map(([key, val]) => ({
                [key]: val
            }))))

    }






    // var wewe = Object.entries(qualities)
    //     .sort(function(a, b) {
    //         if (a[1].length < b[1].length) { return -1; }
    //         if (a[1].length > b[1].length) { return 1; }
    //         return 0;
    //     })
    //     .filter(e => e[1].length > 100)
    //     .map(e => e[0])
    // // .filter(e => e[1]==true)

    // console.log(rword.generate(1, { contains: /.*er$/ }))
    // add extra for variable (Rating) weapons
    Object.keys(qualities)
        .filter(qual => qual.includes("(Rating)"))
        .map(qual => {
            var totalRatings = 6;
            Array.from(new Array(totalRatings)).forEach((sd, i) => {
                i += 1
                var nd = qualities[qual]
                var nn = qual
                nn = nn.replace("(Rating)", i)
                nd = nd.replace("(Rating)", i)
                qualities[nn] = nd
            })
            delete qualities[qual]
        })

    Array.prototype.randomElement = function() {
        return this[Math.floor(random() * this.length)];
    };


    var cardTemplate = Handlebars.compile(`
<div class="grid-container card card-background">
    <div class="attrib attrib-background title">{{title}}</div>
    <div class="attrib attrib-background damage">{{damage}}</div>
    <div class="attrib attrib-background reach">{{reach}}</div>
    <div class="attrib attrib-background weight">{{{weight}}}</div>
    <div class="attrib attrib-background image">
        <div class="img">
            {{{image}}}
        </div>
    </div>
    <div class="attrib attrib-background rarity">{{rarity}}</div>
    <div class="attrib attrib-background flavour">{{flavour}}</div>
    <div class="attrib attrib-background cost">{{cost}}</div>
    <div class="attrib attrib-background uniqueid">{{uniqueid}}</div>
    <div class="attrib attrib-background description">{{{description}}}</div>
    <div class="attrib attrib-background type">{{type}}</div>
    <div class="attrib attrib-background size">{{size}}</div>
</div>
                                `)

    var qualityTemplate = Handlebars.compile(`
    <div>
    {{#each this}}
    <div><b>{{this.name}}:</b> {{this.desc}}</div>
    {{/each}}
</div>
        
        `)


    var getSVG = async url => fetch(url)

    var imageURL = name => `../static/icons/${name}.svg`
    var qualLookup = (quals) => {
        if (!quals) return ""
        var nq = quals
            .map(e => ({
                desc: qualities[e],
                // desc: truncate(qualities[e], 100),
                name: e
            }))
        // console.log(nq)
        return qualityTemplate(nq)

    }

    var formatWeight = (w) => formatWeight


    function truncate(str, n) {
        if (!str) return str
        return (str.length > n) ? str.substr(0, n - 1) : str;
    };

    var names = rword.generate(weapons.length, { length: '3-5' })


    var mapFields = e => ({
        title: e.Title,
        damage: e.Damage,
        reach: e.Reach,
        weight: e.Enc,
        image: e.Art,
        rarity: e.Availability,
        cost: e.Price,
        description: e["Qualities and Flaws"],
        type: e.Type,
        size: e.Size,
    })



    var compileData = {
        damage: e => "Damage: " + e.damage,
        image: async e => await getSVG(imageURL(e.image)).then(r => r.text()).then(r => r.replace(` fill="#fff"`, ``)),
        description: e => qualLookup(e.description),
        type: e => (e.type || "basic").toLowerCase(),
        flavour: e => "this is where the flavour goes",
        uniqueid: (e, i) => i && names[i] || rword.generate(1, { length: '3-5' }),
        size: e => e.size || "One handed",

    }






    var runCompile = async (e, i = 1) => {
        var o = { ...e }
        Object.keys(compileData).forEach(df => {
            o[df] = compileData[df](e)
        })
        return objectPromise(o)
    }



    var generateCard = async (data, attrib = { i: false }) => {

        //remap the fields
        var remap = mapFields(data)
        //run processing on the new fields
        var card = await runCompile(remap, attrib)
        //use the processed data to make the card template, why did i make this so overcommplicated?
        var temp = cardTemplate(card)

        return await temp
    }





    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    return {
        generateCard,
        weapons,
        qualities,
        mapFields,
    }


}
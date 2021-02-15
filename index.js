window.addEventListener("load", async e => {
    var weapons = require("./weapons.json");
    var qualities = require("./qualities.json");
    var { rword } = require("rword");


    var wewe = Object.entries(qualities)
        .sort(function(a, b) {
            if (a[1].length < b[1].length) { return -1; }
            if (a[1].length > b[1].length) { return 1; }
            return 0;
        })
        .filter(e => e[1].length > 100)
        .map(e => e[0])
    // .filter(e => e[1]==true)

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


    function truncate(str, n) {
        if (!str) return str
        return (str.length > n) ? str.substr(0, n - 1) : str;
    };

    var names = rword.generate(weapons.length, { length: '3-5' })

    var generateCard = async (data, attrib) => {

        var compileData = async (e, i) => ({
            title: e.Title,
            damage: "Damage: "+e.Damage,
            reach: e.Reach,
            weight: e.Enc+`    <i class="fas fa-weight-hanging"></i>`,
            image: await getSVG(imageURL(e.Art))
                .then(r => r.text())
                .then(r => r.replace(` fill="#fff"`, ``)),
            rarity: e.Availability,
            cost: e.Price,
            description: qualLookup(e["Qualities and Flaws"]),
            type: (e.Type || "basic").toLowerCase(),
            flavour: "this is where the flavour goes",
            uniqueid: names[i],
            size: e.Size || "One handed",

        })
        var card = cardTemplate(await compileData(data, attrib.i))

        return await card


    }


    weapons = weapons.map(async (e, i) => generateCard(e, { i })
        .then(card => document.querySelector('#cardDump').innerHTML += card))



    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)
    // document.querySelector('#cardDump').innerHTML += cardTemplate(props)



})
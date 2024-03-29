exports.data = async function() {
  var items = require("./items.json");
  var qualities = require("./qualities.json");
  var qualitiesMap = require("./qualityTypeMap.json");

  var defaults = {
    fields: {
      type: "basic",
      flavour: "this is where the flavour goes",
      size: "One handed",
      kind: "Weapon",
      image: "meat",
      weight: 0,
    },
    bulkGenDefault: 5,
    descriptionCustomeRuleTitle: "Custom Rule"
  }



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
  // add extra for variable (Rating) items
  Object.keys(qualities)
    .filter(qual => qual.includes("(Rating)"))
    .map(qual => {
      var totalRatings = 6;
      Array.from(new Array(totalRatings)).forEach((sd, i) => {
        i += 1
        var nd = qualities[qual]
        var nn = qual
        nn = nn.replaceAll("(Rating)", i)
        nd = nd.replaceAll("(Rating)", i)
        qualities[nn] = nd
      })
      delete qualities[qual]
    })

  Array.prototype.randomElement = function() {
    return this[Math.floor(random() * this.length)];
  };


  var cardTemplate = Handlebars.compile(`
<div class="grid-container card card-background {{colour}}">
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
    <div class="attrib attrib-background kind">{{kind}}</div>
    <div class="attrib attrib-background description">{{{description}}}</div>
    <div class="attrib attrib-background type">{{type}}</div>
    <div class="attrib attrib-background size">{{size}}</div>
</div>
                                `)

  var qualityTemplate = Handlebars.compile(`
    <div>
        {{#each this}}
            <div><b>{{this.name}}:</b> <div class="inline">{{this.desc}}</div></div>
        {{/each}}
    </div>

        `)



  var imageURL = name => `./static/icons/${name}.svg`
  if (location.hostname === "localhost") var imageURL = name => `../static/icons/${name}.svg`





  var qualLookup = (quals) => {
    console.log("quals", quals);
    if (!quals) return ""
    if (!Array.isArray(quals)) quals = quals.split(",")

    var nq = quals
      .map(e => {
        console.log("something happen", e);
        return {
          desc: (qualities[e] ? qualities[e] : e),
          name: (qualities[e] ? e : defaults.descriptionCustomeRuleTitle),
        }
      })
    // console.log(nq)
    return qualityTemplate(nq)

  }


  function moneyCalculate(str, factor = 1) {
    console.log("moneyCalculate", str, factor)
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
      copper,
    })

  }


  function money(str, multi = 1) {






    //pass in a moneny string to get a money object, and vice versa
    if (typeof str === 'object' && str !== null) {



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

    var gold = str.match(/[0-9]{1,2}g/gi)
    var silver = str.match(/[0-9]{1,2}s/gi)
    var copper = str.match(/[0-9]{1,2}d/gi)


    gold = gold && gold[0] && gold[0].match(/[0-9]{1,2}/gi)[0]
    silver = silver && silver[0] && silver[0].match(/[0-9]{1,2}/gi)[0]
    copper = copper && copper[0] && copper[0].match(/[0-9]{1,2}/gi)[0]



    return {
      gold,
      silver,
      copper,
    }
  }

  function truncate(str, n) {
    if (!str) return str
    return (str.length > n) ? str.substr(0, n - 1) : str;
  };



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
    kind: e.Kind,
  })




  var compileData = {
    image: async e => await fetch(imageURL(e.image)).then(r => r.text()).then(r => r.replace(` fill="#fff"`, ``)),
    type: e => (e.type || defaults.fields.type).toLowerCase(),
    flavour: e => (e.flavour || defaults.fields.flavour),
    size: e => e.size || defaults.fields.size,
    description: e => qualLookup(e.description),
    weight: e => e.weight + `<i class="fas fa-weight-hanging"></i>`,

  }

  var runCompile = async (e, i = 1) => {
    var o = {
      ...e
    }
    Object.keys(compileData).forEach(df => {
      o[df] = compileData[df](e)
    })
    return objectPromise(o)
  }



  var generateCard = async (data, attrib = {
    i: false
  }) => {
    console.log("data", data);
    //remap the fields
    // var remap = mapFields(data)
    //run processing on the new fields
    var card = await runCompile(data, attrib)
    //use the processed data to make the card template, why did i make this so overcommplicated?
    var temp = cardTemplate(card)

    return await temp
  }







  return {
    generateCard,
    items,
    qualities,
    mapFields,
    cardTemplate,
    runCompile,
    defaults,
    qualitiesMap,
    money,
    moneyCalculate
  }


}

example = '''
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z" />
    <path fill="#4e86b1"  d="M136.48 27.746c-2.108.024-4.174.152-6.242.272 42.927 23.035 87.233 59.434 121.902 96.57 8.66 9.276 12.358 18.765 16.371 27.44 2.486 5.37 5.173 10.658 9.297 16.37l30.65-26.373c-3.067-5.031-5.213-10.567-6.044-16.386-.919-6.432.09-13.283 3.039-19.48-32.92-24.035-68.653-47.25-102.75-62.026-22.779-9.871-44.547-15.843-64.1-16.371-.714-.02-1.42-.024-2.123-.016zm226.463 99.256c-2.825 0-5.562.505-8.092 1.293l28.91 28.91c.788-2.53 1.293-5.266 1.293-8.092 0-6.485-2.314-12.726-5.85-16.262-3.535-3.535-9.776-5.85-16.261-5.85zm-23.088 11.754l-21.89 18.836c9.951-2.533 20.985.059 28.712 7.787 7.728 7.728 10.32 18.761 7.788 28.713l18.835-21.89zm-14.39 35.78c-3.053 0-6.104 1.189-8.485 3.57-4.762 4.761-4.762 12.208 0 16.97 4.762 4.762 12.21 4.762 16.97 0 4.763-4.762 4.763-12.209 0-16.97-2.38-2.381-5.433-3.57-8.485-3.57zm-27.582.335l-9.846 8.47-5.352 46.03 46.03-5.352 8.468-9.841c-10.923 4.588-24.09 2.467-32.931-6.373-8.842-8.842-10.959-22.01-6.37-32.934zm72.148 28.727l-26.373 30.65c5.712 4.124 11 6.812 16.371 9.297 8.674 4.013 18.163 7.711 27.44 16.37 37.136 34.67 73.534 78.977 96.57 121.903 1.254-21.638-4.803-46.36-16.115-72.465-14.776-34.097-37.992-69.829-62.026-102.75-6.198 2.95-13.049 3.958-19.48 3.04-5.82-.832-11.355-2.978-16.387-6.045zm-103.375 7.79l-28.398 26.588L274.08 273.8l26.588-28.399-38.489 4.477zm-41.545 38.897l-11.686 10.941 37.405 37.405 10.941-11.686zm-24.832 23.252l-90.564 84.797 44.007 44.008 84.797-90.565zM96.566 370.643l-21.91 20.515 46.242 46.242 20.516-21.91zm-28.09 39.79l-5.656 16.971 21.832 21.832 16.97-5.656zm-18.789 29.295l-18.49 9.686a106.156 106.156 0 0 0-2.746 13.676c-.608 4.548-.852 9.29-.469 12.92.383 3.63 1.496 5.735 1.912 6.152.417.417 2.523 1.53 6.153 1.912 3.63.383 8.372.139 12.92-.469a106.155 106.155 0 0 0 13.675-2.746l9.686-18.49z" /></svg>


'''

:title
:art
:desc
:type
:lower_right
:lr
:lower_left
:ll
:middle_right
:lr
:middle_left
:ll
:upper_right
:lr
:upper_left
:ll
:copyright


require 'squib'
require 'game_icons'
require 'spicy-proton'
require 'namey'
require 'titlecase'

shortText = false
# add lorra epsum text for demoing rules


svgPath = 'icons/'
# data = Squib.csv file: 'weapons.csv'
data = Squib.csv file: 'fullweapons.csv'
layouts = ['economy.yml', 'layout.yml']
innerColour = '<style> /* <![CDATA[ */ path { fill: grey; stroke: black; stroke-width: 10px; /* Note: The value of a pixel depends on the view box */ } /* ]]> */ </style>'

file = File.read "updatedWeaponListQualities.json"
weaponqualities = JSON.parse(file)



names = data['Title'].size.times.collect { |number| [Spicy::Proton.adjective.capitalize, Namey::Generator.new.name(:all,false)].join(' ') }
# data['Title'].size
Squib::Deck.new cards: data['Title'].size, layout: %w(hand.yml) do
  background color: '#f8f7f5'
  # background color: '#0afc',layout: :description
  # hint text: '#a59887' # show extents of text boxes to demo the layout
  # rect layout: :safe
  # rect layout: :cut
  png file: 'background.png', layout: :background
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :title
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :slot1
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :slot2
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :slot3
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :slot4
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :slot5
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :type
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :description
  png file: 'background.png', alpha:0.8, blend: :hard_light, layout: :snark
  # png file: 'background.png', layout: :AllText
 #  QualitiesandFlaws = data['Qualities and Flaws'].map { |x| x.split('|')}
 #  # .map { |e| " <span font_size='x-large'>#{e}</span> (#{weaponqualities[e.titlecase].to_s})" }
 #  QualitiesandFlaws.each { |e| puts e.map {|x| x[/\d+/]} 
 #  # if s =~ /\d/         # Calling String's =~ method.
 #  #   puts "The String #{s} has a number in it."
 #  # else
 #  #   puts "The String #{s} does not have a number in it."
 #  # end
 # }
 #  puts QualitiesandFlaws.inspect


  # text str: 'title location', layout: :title
  # text str: 'art location', layout: :art
  # text str: 'description location', layout: :description
  # text str: 'flavour location', layout: :snark
  # text str: 'type location', layout: :type
  # text str: 'attribute1 slot', layout: :slot1
  # text str: 'attribute2 slot', layout: :slot2
  # text str: 'attribute3 slot', layout: :slot3
  # text str: 'attribute4 slot', layout: :slot4
  # text str: 'attribute5 slot', layout: :slot5
  # text str: 'cut testing', layout: :cut
  # text str: 'safe testing', layout: :safe




  Title = data['Title']
  Damage = data['Damage'].map { |e| e.to_s.gsub(/[^0-9a-z+ ]/i, '') }
  Reach = data['Reach']
  Type = data['Type'].map { |x| x.downcase.titlecase }
  Price = data['Price']
  Enc = data['Enc']
  Availability = data['Availability']
  # Qualities = data['Qualities and Flaws'].map { |x| x.split('|').join("\n") }
  # Qualities = data['Qualities and Flaws'].map { |x| x.split('|').map { |e| e.to_s+': '+weaponqualities[e].to_s  }.join("\n") }


  Qualities = data['Qualities and Flaws'].map { |x| 
    x.split('|').map { |e| 
      unless shortText
        puts 'Short text mode disabled, creating with full text'
        
        if e[/\d+/]
          rating = e[/\d+/]
          quality = weaponqualities[ e.gsub(/[\d]/, '(Rating)')].gsub(/\(Rating\)/, rating) 
        else
          quality = weaponqualities[e.titlecase]
        end
        unless quality.nil?
          " <span font_size='large'>#{e}</span> (<span font_style='italic' font_size='small'>#{quality.to_s}</span>)" 
        else
        end
      else
        puts 'Short text mode enabled, creating with short text'
        e
      end
      
        # puts e
      
    }.join("\n") }


  svg data: data['Art'].collect{|art| GameIcons.get(art.split('|').sample).string.sub('<path d="M0 0h512v512H0z"/>', innerColour)} , layout: :art
  text str: Title.map { |x| "<span font_weight='bold' font_size='large'>"+x.to_s+"</span>" }, layout: :title
  text str: Damage.map { |x| x.to_s+' Damage' }, layout: :slot1
  text str: Reach.map { |x| x.to_s+' Reach' }, layout: :slot2
  text str: Enc.map { |x| x.to_s+' lbs' }, layout: :slot3
  text str: Price.map { |x| x.to_s+'' }, layout: :slot4
  text str: Availability.map { |x| x.to_s+'' }, layout: :slot5
  text str: Type.map { |x| x.to_s+'' }, layout: :type
  text str: Qualities.map { |x| x.to_s+'' }, layout: :description
  # text str: , layout: :description
  # text str: , layout: :description

  text str: names, layout: :snark



#  svg file: data['Title'].map { |t| "#{t.downcase}.svg"},  # method 2
#      layout: 'Art'
  # puts data['Title'].map { |t| "#{t.downcase}.svg"}
  #rect layout: 'cut'
  #rect layout: 'safe'
  #save_sheet prefix: '_part2_03_illustrations_', columns: 4
  #save_pdf trim: 37.5
  save_png prefix: 'weapon_'
end
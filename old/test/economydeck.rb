require 'squib'

Squib::Deck.new(layout: 'economy.yml') do
  background color: 'white'

  set font: 'Times New Roman,Serif 30.5'
  hint text: '#333' # show extents of text boxes to demo the layout

  text str: 'economy.yml', layout: :title
  text str: 'art',         layout: :art
  text str: 'description', layout: :description
  text str: 'type',        layout: :type
  text str: 'lower_right',          layout: :lower_right
  text str: 'lower_left',          layout: :lower_left
  text str: 'credits',     layout: :copy
  text str: 'upper_right',     layout: :upper_right
  text str: 'upper_left',     layout: :upper_left
  text str: 'middle_right',     layout: :middle_right
  text str: 'middle_left',     layout: :middle_left



  rect layout: :safe
  rect layout: :cut
  save_png prefix: 'layouts_builtin_economy_'
end

const sports = `Boxing, Cricket, Cycling, Football, Formula One (or F1), Horse Racing, Racing, Rugby, Rugby League, Rugby Union, Soccer, Tennis, US Sports`

exports.cardImages = {
    'smallImageUrl': 'https://s3.amazonaws.com/alexa-config/images/alexa-small.png',
    'largeImageUrl': 'https://s3.amazonaws.com/alexa-config/images/alexa-large.png'
}

exports.topicsCard = `You can ask for news and opinions on the following topics:
____________________
News
Australia news, Brexit, Business, Climate change, Environment, Technology (or tech), UK News, US Elections, US News, World news
____________________
Culture
Art, Culture, Film, Games, Music, Opinion, Stage, TV
____________________
Sport
` + sports + `
____________________
Lifestyle
Family, Fashion, Food, Garden, Health & fitness, Home, Relationships, Sex, Travel, Wellbeing, Women
`

exports.sportsCard = "You can ask for news and opinions on the following topics:\n" + sports

exports.podcastsCard = `You can listen to the following podcasts:
____________________
Lifestyle & Culture
Books podcast, Close Encounters, Film Weekly, Music Weekly, The Citadel
____________________
News & opinion
Behind the lines, Politics for humans, Politics Weekly, What would a feminist do?
____________________
Science & technology
Brain waves, Chips with everything, Science Weekly
____________________
Sport
Football Weekly, Premier League: the view from Australia
____________________
Storytelling
The Long Read, The Story
`
const config = require("../tmp/config.json");
const CAPI_API_KEY = config.capi_key;

exports.capiQuery = function(endpoint, filter, q) {
    var capiHost = 'https://content.guardianapis.com/';
    var key = '&api-key=' + CAPI_API_KEY;
    var query = q ? '&q=' + q : '';
    return capiHost + endpoint + '?' + filter + query + key;
};

exports.randomMessage = function(messages) {
    return messages[Math.floor(Math.random()*messages.length)]
};

const sectionsWithoutEditions = {
    politics: true,
    football: true,
    world: true,
    fashion: true
};

exports.getSectionPath = (section, edition) => {
    if (section == null) return edition;
    if (sectionsWithoutEditions[section]) return section;
    return edition +"/"+ section;
};

const PAGE_SIZE = 3;
exports.pageSize = PAGE_SIZE;

exports.getMoreOffset = (isNewIntent, currentMoreOffset) => {
  if (typeof currentMoreOffset !== 'undefined') {
    if (isNewIntent) return 0;
    else return currentMoreOffset + PAGE_SIZE;
  } else return 0;
};

exports.localizeEdition = (locale) => {
    switch (locale) {
        case 'en-US': return 'us';
        case 'en-GB': return 'uk';
        case 'en-AU': return 'au';
        default: return 'uk';
    }
};

/**
 * Set the topic based on the lastIntent.
 * If it's a new intent then the topic is set using only the slots.
 * If the last intent was MoreIntent or EntityIntent then only use the attributes.
 */
exports.getTopic = (attributes, slots) => {
    switch (attributes.lastIntent) {
        case "MoreIntent":
        case "EntityIntent": return attributes.topic ? attributes.topic : null;
        default: return (slots.topic && slots.topic.value) ? slots.topic.value : null;
    }
};

exports.getPodcastDirective = (podcastUrl) => {
    return {
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "card": {
                "type": "Simple",
                "title": "Play Audio",
                "content": "Playing the requested podcast."
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": null
                }
            },
            "directives": [
                {
                    "type": "AudioPlayer.Play",
                    "playBehavior": "REPLACE_ALL",
                    "audioItem": {
                        "stream": {
                            "token": "token",
                            "url": podcastUrl,
                            "offsetInMilliseconds": 0
                        }
                    }
                }
            ],
            "shouldEndSession": true
        }
    };

};

exports.sportTopicList = 'US sports, football, soccer, cricket, rugby, rugby union, rugby league, formula one, f1, tennis, cycling, boxing, racing, horse racing';
exports.topicList = 'UK, US, australia, world, sport, opinion, comment, culture, TV, music, games, art, stage, business, lifestyle, food, health and fitness, wellbeing, love and sex, family, women, fashion, home and garden, environment, climate change, tech, technology, travel, film' + ', '+ exports.sportTopicList;

exports.cardImages = {
    "smallImageUrl": "https://s3.amazonaws.com/alexa-config/images/alexa-small.png",
    "largeImageUrl": "https://s3.amazonaws.com/alexa-config/images/alexa-large.png"
};

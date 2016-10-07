const config = require('../conf/config.json')
const CAPI_API_KEY = config.capi_key
const get = require('simple-get-promise').get

exports.capiQuery = function (endpoint, filter, q) {
  var capiHost = 'https://content.guardianapis.com/'
  var key = '&api-key=' + CAPI_API_KEY
  var query = q ? '&q=' + q : ''
  return capiHost + endpoint + '?' + filter + query + key
}

exports.hitOphanEndpoint = function (url, userId, addUrl) {
  addUrl = addUrl || false
  var viewId = new Date().getTime().toString(36) + 'xxxxxxxxxxxx'.replace(/x/g, function () {
    return Math.floor(Math.random() * 36).toString(36)
  })

  const ophanUrl = 'https://ophan.theguardian.com/i.gif'
  const platform = 'amazon-echo'
  const baseUrl = encodeURIComponent('https://www.theguardian.com/')

  if (addUrl) url = baseUrl + url
  url = encodeURIComponent(url)
  const query = `${ophanUrl}?platform=${platform}&url=${url}&viewId=${viewId}&bwid=${userId}`

  if (userId !== 'test') {
    get(query) // Ophan doesn't have callbacks or anything so that's it.
  }
}

exports.randomMessage = function (messages) {
  return messages[Math.floor(Math.random() * messages.length)]
}

const sectionsWithoutEditions = {
  politics: true,
  football: true,
  world: true,
  fashion: true
}

exports.getSectionPath = (section, edition) => {
  if (section == null) return edition
  if (sectionsWithoutEditions[section]) return section
  return edition + '/' + section
}

/**
 * - amazonMaxChars: Amazon's char-limit for the outputSpeech field.
 * - extraChars: Extra chars added at start/end of the article, including byline for which we generously allow 100 chars.
 *
 * e.g. -
 *  "<speak> Absolutely, This article is written by Larry Elliott in Washington and it will take roughly 3 minutes to read.<break strength='x-strong'/> ...article body... <break strength='medium'/>Would you like to hear them again, or hear more headlines? </speak>"
 */
const amazonMaxChars = 8000
const extraChars = 315
exports.maxCharCount = amazonMaxChars - extraChars

const PAGE_SIZE = 3
exports.pageSize = PAGE_SIZE

exports.getMoreOffset = (isNewIntent, currentMoreOffset) => {
  if (typeof currentMoreOffset !== 'undefined') {
    if (isNewIntent) return 0
    else return currentMoreOffset + PAGE_SIZE
  } else return 0
}

exports.localizeEdition = (locale) => {
  switch (locale) {
    case 'en-US': return 'us'
    case 'en-GB': return 'uk'
    case 'en-AU': return 'au'
    default: return 'uk'
  }
}

/**
 * Set the topic based on the lastIntent.
 * If it's a new intent then the topic is set using only the slots.
 * If the last intent was MoreIntent or EntityIntent then only use the attributes.
 */
exports.getTopic = (attributes, slots) => {
  switch (attributes.lastIntent) {
    case 'MoreIntent':
    case 'EntityIntent': return attributes.topic ? attributes.topic : null
    default: return (slots && slots.topic && slots.topic.value) ? slots.topic.value : null
  }
}

exports.getStage = (functionName) => {
  if (functionName && functionName.includes('PROD')) return 'PROD'
  else return 'CODE'
}

exports.getPodcastDirective = (podcastUrl, podcastTitle, offset) => {
  return {
    'version': '1.0',
    'sessionAttributes': {},
    'response': {
      'card': {
        'type': 'Standard',
        'title': 'Playing Podcast',
        'text': podcastTitle,
        'image': this.cardImages
      },
      'reprompt': {
        'outputSpeech': {
          'type': 'PlainText',
          'text': null
        }
      },
      'directives': [
        {
          'type': 'AudioPlayer.Play',
          'playBehavior': 'REPLACE_ALL',
          'audioItem': {
            'stream': {
              'token': JSON.stringify({ url: podcastUrl, title: podcastTitle }),
              'url': podcastUrl,
              'offsetInMilliseconds': offset || 0
            }
          }
        }
      ],
      'shouldEndSession': true
    }
  }
}
exports.stopPodcastDirective = {
  'version': '1.0',
  'sessionAttributes': {},
  'response': {
    'directives': [
      {
        'type': 'AudioPlayer.Stop'
      }
    ]
  }
}

exports.sportTopicList = 'US sports, football, soccer, cricket, rugby, rugby union, rugby league, formula one, f1, tennis, cycling, boxing, racing, horse racing'
exports.topicList = 'UK, US, australia, world, sport, opinion, comment, culture, TV, music, games, art, stage, business, lifestyle, food, health and fitness, wellbeing, relationships, sex, family, women, fashion, home, garden, environment, climate change, tech, technology, travel, film, US elections, Brexit, ' + exports.sportTopicList

exports.cardImages = {
  'smallImageUrl': 'https://s3.amazonaws.com/alexa-config/images/alexa-small.png',
  'largeImageUrl': 'https://s3.amazonaws.com/alexa-config/images/alexa-large.png'
}

exports.podcastList = 'Film Weekly, Football Weekly, Premier League: the view from Australia, The Long Read, The Story, Brain waves, Science Weekly, Close Encounters, Books podcast, Music Weekly, Chips with everything, Politics for humans, What would a feminist do?, Behind the lines, Politics Weekly, The Citadel'

const get = require('simple-get-promise').get
const asJson = require('simple-get-promise').asJson
const striptags = require('striptags')
const xmlescape = require('xml-escape')

const helpers = require('../helpers')
const speech = require('../speech').speech
const sound = require('../speech').sound
const randomMsg = require('../helpers').randomMessage
const config = require('../../conf/config.json')
const CAPI_API_KEY = config.capi_key
const hitOphan = require('../helpers').hitOphanEndpoint

module.exports = function () {
  const slots = this.event.request.intent.slots
  const position = slots.position ? slots.position.value : null
  const playPodcast = (contentId) => {
    get(contentId + '?api-key=' + CAPI_API_KEY + '&show-elements=audio')
      .then(asJson)
      .then((json) => {
        const podcastUrl = json.response.content.elements[0].assets[0].file
        if (podcastUrl) {
          helpers.playPodcast.call(this, podcastUrl, json.response.content.webTitle)
        } else {
          this.emit(':tell', speech.podcasts.notfound)
        }
      })
  }

  const readArticle = (contentId) => {
    const capiQuery = helpers.capiQuery(contentId, '&show-fields=body,bodyText,byline,wordcount')
    get(capiQuery)
      .then(asJson)
      .then((json) => {
        hitOphan(json.response.content.webUrl, this.event.session.user.userId) // single page view
        this.emit(':ask', getArticle(json), speech.help.reprompt)
      })
      .catch(function (error) {
        this.emit(':ask', speech.core.didNotUnderstand, speech.help.reprompt)
      })
  }

  const readContentAtPosition = (position) => {
    if (this.event.session.attributes.positionalContent && this.event.session.attributes.positionalContent[position]) {
      const contentId = this.event.session.attributes.positionalContent[position]
      switch (this.event.session.attributes.lastIntent) {
        case 'LatestPodcastIntent':
          playPodcast(contentId)
          break
        default:
          // Any text article
          readArticle(contentId)
          break
      }
    } else this.emit(':ask', randomMsg(speech.core.questions), speech.help.reprompt)
  }

  switch (position) {
    case 'first':
    case '1st':
      readContentAtPosition(0)
      break
    case 'second':
    case '2nd':
      readContentAtPosition(1)
      break
    case 'third':
    case '3rd':
      readContentAtPosition(2)
      break
    default:
      this.emit(':ask', speech.core.didNotUnderstand, speech.help.reprompt)
  }
}

const getBody = (json) => {
  if (json.response.content.fields.bodyText) return json.response.content.fields.bodyText
  else return striptags(json.response.content.fields.body)   // body field may contain html tags
}

const getArticle = (json) => {
  var articleBody = xmlescape(getBody(json))
  return randomMsg(speech.acknowledgement) +
    speech.positionalContent.articleBy + json.response.content.fields.byline +
    speech.positionalContent.timeToReadPref + (json.response.content.fields.wordcount / 3.5 / 60).toFixed(0) +
    speech.positionalContent.timeToReadSuff + sound.strongBreak +
    articleBody + sound.break + speech.positionalContent.followup
}

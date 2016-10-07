const get = require('simple-get-promise').get
const asJson = require('simple-get-promise').asJson
const format = require('util').format
const xmlescape = require('xml-escape')

const speech = require('../speech').speech
const sound = require('../speech').sound
const randomMsg = require('../helpers').randomMessage
const getMoreOffset = require('../helpers').getMoreOffset
const getTopic = require('../helpers').getTopic
const hitOphan = require('../helpers').hitOphanEndpoint
const capiQueryBuilder = require('../capiQueryBuilder')

module.exports = function () {
  const attributes = this.event.session.attributes
  const slots = this.event.request.intent.slots

  const isNewIntent = attributes.lastIntent !== 'MoreIntent'

  attributes.topic = getTopic(attributes, slots)

  attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset)
  attributes.lastIntent = 'GetOpinionIntent'

  const capiQuery = capiQueryBuilder.opinionQuery(attributes.moreOffset, this.event.request.locale, attributes.topic)
  if (capiQuery !== null) {
    get(capiQuery)
      .then(asJson)
      .then((json) => {
        if (json.response.tag !== undefined) {
          hitOphan(json.response.tag.webUrl, this.event.session.user.userId)
        } else if (json.response.section !== undefined) {
          hitOphan(json.response.section.webUrl, this.event.session.user.userId)
        }
        if (json.response.results && json.response.results.length > 0 && json.response.results.length > 0) {
          attributes.positionalContent = json.response.results.map(result => result.id)
          const opinionSpeech = generateOpinionSpeech(json.response.results, isNewIntent, attributes.topic)
          this.emit(':ask', opinionSpeech)
        } else {
          this.emit(':ask', notFoundMessage(attributes.topic))
        }
      })
      .catch(function (error) {
        this.emit(':ask', notFoundMessage(attributes.topic))
      })
  } else {
    this.emit(':ask', notFoundMessage(attributes.topic))
  }
}

const notFoundMessage = (topic) => {
  if (topic) return format(speech.opinions.topicNotFound, topic)
  else return speech.headlines.headlinesNotFound
}

const generateOpinionSpeech = (results, isNewIntent, topic) => {
  const preamble = generatePreamble(isNewIntent, topic, results.length)
  const conclusion = sound.strongBreak + followupQuestion(results.length)
  const opinions = results.map(result => xmlescape(result.fields.headline) + sound.transition)

  return preamble + opinions.join(' ') + conclusion
}

const generatePreamble = (isNewIntent, topic, howManyStories) => {
  const ack = randomMsg(speech.acknowledgement)
  const numberOfStoriesReturned = howManyStories >= 3 ? 3 : howManyStories

  const buildStories = () => {
    if (topic) {
      if (isNewIntent) return `the top ${numberOfStoriesReturned} ${topic} opinions are: `
      if (numberOfStoriesReturned === 1) return `the next opinion is: `
      return `the next ${numberOfStoriesReturned} ${topic} opinions are; `
    }
    if (isNewIntent) return `the top ${numberOfStoriesReturned} opinions are: `
    return speech.opinions.more
  }

  return ack + buildStories()
}

const followupQuestion = (howManyStories) => {
  if (howManyStories === 1) return speech.opinions.followup1
  if (howManyStories === 2) return speech.opinions.followup2
  return speech.opinions.followup3
}

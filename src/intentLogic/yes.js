// const get = require('simple-get-promise').get
// const asJson = require('simple-get-promise').asJson
const helpers = require('../helpers')
const speech = require('../speech').speech
// const sound = require('../speech').sound

module.exports = function () {
  const attributes = this.event.session.attributes

  switch (attributes.lastIntent) {
    case 'GetPodcastIntent':
      const podcastDirective = helpers.getPodcastDirective(attributes.podcastUrl, attributes.podcastTitle)
      console.log('Playing podcast ' + attributes.podcastUrl)
      this.emit('PlayPodcastIntent', podcastDirective)
      break
    case 'GetHeadlinesIntent':
    case 'GetOpinionIntent':
      // Assume the user has just been asked if they'd like the list of topics
      this.emit(
        ':tellWithCard',
        'Done - check your Alexa app now.',
        'Topics',
        'You can ask for news and opinions on the following topics:\n' + helpers.topicList,
        helpers.cardImages
      )
      break
    default:
      this.emit(':ask', speech.help.reprompt, speech.help.reprompt)
      break
  }
}

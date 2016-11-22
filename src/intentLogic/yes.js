const helpers = require('../helpers')
const speech = require('../speech').speech
const cards = require('../cards')

module.exports = function () {
  const attributes = this.event.session.attributes

  switch (attributes.lastIntent) {
    case 'GetPodcastIntent':
      helpers.playPodcast.call(this, attributes.podcastUrl, attributes.podcastTitle)
      break

    case 'GetHeadlinesIntent':
    case 'GetOpinionIntent':
      // Assume the user has just been asked if they'd like the list of topics
      this.emit(
        ':tellWithCard',
        'Done - check your Alexa app now.',
        'Topics',
        cards.topicsCard,
        cards.cardImages
      )
      break
    default:
      this.emit(':ask', speech.help.reprompt, speech.help.reprompt)
      break
  }
}

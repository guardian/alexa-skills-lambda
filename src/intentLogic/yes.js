const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;

module.exports = function () {
    const attributes = this.event.session.attributes;

    switch (attributes.lastIntent) {
        case 'GetPodcastIntent':
            const podcastDirective = helpers.getPodcastDirective(attributes.podcastUrl);
            this.emit('PlayPodcastIntent', podcastDirective);
            break;
        default:
            this.emit(':ask', speech.help.reprompt);
            break;
    }
};

const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const config = require("../../tmp/config.json");
const CAPI_API_KEY = config.capi_key;
const speech = require('../speech').speech;
const capiQueryBuilder = require('../capiQueryBuilder');

module.exports = function () {

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    attributes.lastIntent = 'GetPodcastIntent';

    const podcastName = (slots && slots.podcast) ? slots.podcast.value : null;
    const capiQuery = capiQueryBuilder.podcastQuery(podcastName);
    var episodeTitle = null;

    if (capiQuery !== null) {
        get(capiQuery)
            .then(asJson)
            .then((seriesJson) => {
                episodeTitle = seriesJson.response.results[0].webTitle;
                return get(seriesJson.response.results[0].apiUrl + '?api-key=' + CAPI_API_KEY + '&show-elements=audio');
            })
            .then(asJson)
            .then((podcastJson) => {
                attributes.podcastUrl = podcastJson.response.content.elements[0].assets[0].file;
                this.emit(':ask', `sure, the latest ${podcastName} was ${episodeTitle}; would you like me to play this now?`);
            })
            .catch(function (error) {
                this.emit(':tell', speech.podcasts.notfound);
            });
    } else {
        this.emit(':tell', speech.podcasts.notfound);
    }
};


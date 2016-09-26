const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const config = require("../../tmp/config.json");
const CAPI_API_KEY = config.capi_key;
const BASE_URL = "https://content.guardianapis.com/";
const speech = require('../speech').speech;
const getMoreOffset = require('../helpers').getMoreOffset;
const capiQueryBuilder = require('../capiQueryBuilder');
const randomMsg = require('../helpers').randomMessage;
const sound = require('../speech').sound;


module.exports = function () {

    const attributes = this.event.session.attributes;

    const isNewIntent = attributes.lastIntent !== "MoreIntent";

    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset);
    attributes.lastIntent = 'LatestPodcastIntent';

    const capiQuery = capiQueryBuilder.latestPodcastQuery(attributes.moreOffset);

    get(capiQuery)
        .then(asJson)
        .then((json) => {
            if (json.response.results && json.response.results.length > 0) {
                attributes.positionalContent = json.response.results.map(result => result.apiUrl);
                this.emit(':ask', generatePodcastSpeech(json.response.results, isNewIntent), speech.podcasts.reprompt);
            }
            else {
                this.emit(':tell', speech.podcasts.notfound);
            }
        })
        .catch(function (error) {
            this.emit(':tell', speech.podcasts.notfound);
        });
};

const generatePodcastSpeech = (results, isNewIntent) => {
    const ack = randomMsg(speech.acknowledgement);
    const podcastTitles = results.map(result => fixPodcastTitle(result.webTitle) + sound.transition);

    const buildLatestPodcastSpeech = () => {
        if (isNewIntent) return `the latest ${results.length} podcasts are: `;
        if (results.length == 1) return `the next podcast is: `;
        return `the next ${results.length} podcasts are: `;
    };

    const followupQuestion = () => {
        if (results.length == 1) return speech.podcasts.followup1;
        if (results.length == 2) return speech.podcasts.followup2;
        return speech.podcasts.followup3
    };

    return ack + buildLatestPodcastSpeech() + podcastTitles + followupQuestion();
};

const fixPodcastTitle = (title) => title.replace(/(-|–)?\s?podcast$/, "");

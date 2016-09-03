const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;
const getMoreOffset = require('../helpers').getMoreOffset;
const getTopic = require('../helpers').getTopic;

const capiQueryBuilder = require('../capiQueryBuilder');

module.exports = function () {

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    const isNewIntent = attributes.lastIntent !== "MoreIntent";

    attributes.topic = getTopic(attributes, slots);

    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset);
    attributes.lastIntent = 'GetHeadlinesIntent';

    const capiQuery = capiQueryBuilder.newsQuery(attributes.moreOffset, this.event.request.locale, attributes.topic);
    if (capiQuery !== null) {

        get(capiQuery)
            .then(asJson)
            .then((json) => {
                const results = getResults(json, attributes.moreOffset);
                if (results !== null) {
                    attributes.positionalContent = results.map(result => result.id);
                    this.emit(':ask', generateHeadlinesSpeech(results, isNewIntent, attributes.topic));
                } else {
                    this.emit(':ask', speech.headlines.notfound);
                }
            })
            .catch(function (error) {
                this.emit(':tell', speech.headlines.notfound);
            });
    } else {
        this.emit(':tell', speech.headlines.notfound);
    }
};

/**
 * Return the array of results, or null if none found.
 * If the editors-picks field is present, use that, otherwise use the main results.
 */
const getResults = (json, moreOffset) => {
    if (json.response.editorsPicks) {
        if (json.response.editorsPicks.length >= moreOffset) {
            return json.response.editorsPicks.slice(moreOffset, moreOffset+3);
        } else {
            return null;
        }
    } else {
        if (json.response.results && json.response.results.length > 0) {
            return json.response.results;
        } else {
            return null;
        }
    }
};

const generateHeadlinesSpeech = (results, isNewIntent, topic) => {
    const preamble = generatePreamble(isNewIntent, topic, results.length);
    const conclusion = sound.strongBreak + followupQuestion(results.length);
    const headlines = results.map(result => result.fields.headline + sound.transition);

    return preamble + headlines + conclusion;
};

const generatePreamble = (isNewIntent, topic, howManyStories) => {
    const ack = randomMsg(speech.acknowledgement);
    const numberOfStoriesReturned = howManyStories >= 3 ? 3 : howManyStories;

    const buildStories = () => {
        if (topic) {
            if (isNewIntent) return `the top ${numberOfStoriesReturned} ${topic} stories are: `;
            if (numberOfStoriesReturned == 1) return `the next story is: `;
            return `the next ${numberOfStoriesReturned} ${topic} stories are; `
        }
        if (isNewIntent) return `the top ${numberOfStoriesReturned} stories are: `;
        return speech.headlines.more;
    };

    return ack + buildStories();
};

const followupQuestion = (howManyStories) => {
    if (howManyStories == 1) return speech.headlines.followup1;
    if (howManyStories == 2) return speech.headlines.followup2;
    return speech.headlines.followup3
};

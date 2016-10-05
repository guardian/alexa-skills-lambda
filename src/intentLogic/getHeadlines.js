const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;
const format = require('util').format;
const xmlescape = require('xml-escape');

const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;
const getMoreOffset = require('../helpers').getMoreOffset;
const getTopic = require('../helpers').getTopic;
const capiQueryBuilder = require('../capiQueryBuilder');
const hitOphan = require('../helpers').hitOphanEndpoint;
const localizeEdition = require('../helpers').localizeEdition;
const maxCharCount = require('../helpers').maxCharCount;

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
                if (json.response.tag !== undefined)
                    hitOphan(json.response.tag.webUrl, this.event.session.user.userId);
                else if (json.response.section !== undefined)
                    hitOphan(json.response.section.webUrl, this.event.session.user.userId);
                else {
                    hitOphan('https://www.theguardian.com/' + capiQuery.split('?')[0].split('/').reverse()[0], this.event.session.user.userId); // front view (uk, us, au, international)
                }

                const results = getResults(json, attributes.moreOffset);
                if (results !== null) {
                    attributes.positionalContent = results.map(result => result.id);
                    this.emit(':ask', generateHeadlinesSpeech(results, isNewIntent, attributes.topic));
                } else {
                    this.emit(':ask', notFoundMessage(attributes.topic));
                }
            })
            .catch(function (error) {
                this.emit(':ask', notFoundMessage(attributes.topic));
            });
    } else {
        this.emit(':ask', notFoundMessage(attributes.topic));
    }
};

const notFoundMessage = (topic) => {
    if (topic) return format(speech.headlines.topicNotFound, topic);
    else return speech.headlines.headlinesNotFound;
};

/**
 * Return the array of results, or null if none found.
 * If the editors-picks field is present, use that, otherwise use the main results.
 */
const getResults = (json, moreOffset) => {
    if (json.response.editorsPicks) {
        //We have to manually filter out long articles when we use editors-picks
        const filteredPicks = json.response.editorsPicks.filter(pick => pick.fields.charCount && pick.fields.charCount < maxCharCount);
        if (filteredPicks.length >= moreOffset) {
            return filteredPicks.slice(moreOffset, moreOffset+3);
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
    const headlines = results.map(result => xmlescape(result.fields.headline) + sound.transition);

    return preamble + headlines.join(" ") + conclusion;
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

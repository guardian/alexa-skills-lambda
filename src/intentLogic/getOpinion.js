const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;
const getMoreOffset = require('../helpers').getMoreOffset;

module.exports = function (isNewIntentFlag) {
    // An intent is a new intent unless this is explicitly set to `false`; `undefined` defaults to `true`.
    const isNewIntent = isNewIntentFlag !== false;

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    attributes.lastIntent = 'GetOpinionIntent';
    if (isNewIntent) attributes.searchTerm = slots.search_term ? slots.search_term.value : null;

    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset);

    get(buildCapiQuery(attributes.searchTerm))
        .then(asJson)   
        .then((json) => {
            if (json.response.results && json.response.results.length > 0 && json.response.results.length >= attributes.moreOffset) {
                updatePositionalContent(json); // side effects, yay!
                this.emit(':ask', generateOpinionSpeech(json));
            } else {
                this.emit(':ask', speech.opinions.notfound);
            }
        })
        .catch(function (error) {
            this.emit(':tell', speech.opinions.notfound);
        });

    var generateOpinionSpeech = (json) => {
        const preamble = generatePreamble(isNewIntent, attributes.searchTerm, json.response.results.length);
        const conclusion = sound.strongBreak + followupQuestion(json.response.results.length);

        var getOpinions = () => {
            return json.response.results.slice(attributes.moreOffset, attributes.moreOffset+3).map(results =>
                results.fields.headline + sound.transition
            );
        };

        return preamble + getOpinions() + conclusion;
    };

    var updatePositionalContent = (json) => {
        attributes.positionalContent = json.response.results.slice(attributes.moreOffset, attributes.moreOffset+3).map(result =>
            result.id );
    };
};

var buildCapiQuery = (searchTerm) => {
    return helpers.capiQuery('search', '&show-fields=standfirst,byline,headline&tag=commentisfree/commentisfree', searchTerm);
};

var generatePreamble = (isNewIntent, searchTerm, howManyStories) => {
    const ack = randomMsg(speech.acknowledgement);
    const numberOfStoriesReturned = howManyStories >= 3 ? 3 : howManyStories;

    const buildStories = () => {
        if (searchTerm) {
            if (numberOfStoriesReturned == 1) return `the next story is: `;
            else return `the next ${numberOfStoriesReturned} ${searchTerm} stories are; `
        }
        if (isNewIntent) return `the top ${numberOfStoriesReturned} stories are: `;
        return speech.opinions.more;
    };

    return ack + buildStories();
};

var followupQuestion = (howManyStories) => {
    if (howManyStories == 1) return speech.opinions.followup1;
    if (howManyStories == 2) return speech.opinions.followup2;
    return speech.opinions.followup3
};

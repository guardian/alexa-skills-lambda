const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;
const getSectionPath = require('../helpers').getSectionPath;
const getMoreOffset = require('../helpers').getMoreOffset;
const localizeEdition = require('../helpers').localizeEdition;

module.exports = function (isNewIntentFlag) {
    // An intent is a new intent unless this is explicitly set to `false`; `undefined` defaults to `true`.
    const isNewIntent = isNewIntentFlag !== false;

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    attributes.lastIntent = 'GetHeadlinesIntent';
    if (isNewIntent) attributes.sectionType = slots.section_type ? slots.section_type.value : null;

    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset);

    get(buildCapiQuery(attributes.sectionType, this.event.request.locale))
        .then(asJson)
        .then((json) => {
            if (json.response.editorsPicks && json.response.editorsPicks.length >= attributes.moreOffset) {
                updatePositionalContent(json); // side effects, yay!
                this.emit(':ask', generateHeadlinesSpeech(json));
            } else {
                this.emit(':ask', speech.headlines.notfound);
            }
        })
        .catch(function (error) {
            this.emit(':tell', speech.headlines.notfound);
        });

    var generateHeadlinesSpeech = (json) => {
    const preamble = generatePreamble(isNewIntent, attributes.sectionType, json.response.editorsPicks.length);
    const conclusion = sound.strongBreak + followupQuestion(json.response.editorsPicks.length);

        var getHeadlines = () => {
            return json.response.editorsPicks.slice(attributes.moreOffset, attributes.moreOffset+3).map(editorsPick =>
                editorsPick.fields.headline + sound.transition
            );
        };

    return preamble + getHeadlines() + conclusion;
  };

  var updatePositionalContent = (json) => {
    attributes.positionalContent = json.response.editorsPicks.slice(attributes.moreOffset, attributes.moreOffset+3).map(editorsPick =>
      editorsPick.id );
  };
};

var buildCapiQuery = (sectionType, locale) => {

    const path = getSectionPath(sectionType, localizeEdition(locale));
    const showEditorsPicks = 'show-editors-picks=true';
    const showFields = '&show-fields=byline,headline&tag=type/article,tone/news,-tone/minutebyminute';
    const filters = showEditorsPicks + showFields;

    return helpers.capiQuery(path, filters);

};

var generatePreamble = (isNewIntent, sectionType, howManyStories) => {
    const ack = randomMsg(speech.acknowledgement);
    const numberOfStoriesReturned = howManyStories >= 3 ? 3 : howManyStories;

    const buildStories = () => {
        if (sectionType) {
            if (numberOfStoriesReturned == 1) return `the next story is: `;
            else return `the next ${numberOfStoriesReturned} ${sectionType} stories are; `
        }
        if (isNewIntent) return `the top ${numberOfStoriesReturned} stories are: `;
        return speech.headlines.more;
    };

    return ack + buildStories();
};

var followupQuestion = (howManyStories) => {
    if (howManyStories == 1) return speech.headlines.followup1;
    if (howManyStories == 2) return speech.headlines.followup2;
    return speech.headlines.followup3
};


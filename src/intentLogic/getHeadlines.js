const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;
const getSectionPath = require('../helpers').getSectionPath;
const getMoreOffset = require('../helpers').getMoreOffset;
const pageSize = require('../helpers').pageSize;

module.exports = function (isNewIntentFlag) {
    // An intent is a new intent unless this is explicitly set to `false`; `undefined` defaults to `true`.
    const isNewIntent = isNewIntentFlag !== false;

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    attributes.lastIntent = 'GetHeadlinesIntent';
    if (isNewIntent) attributes.sectionType = slots.section_type ? slots.section_type.value : null;

    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset)

    get(buildCapiQuery(attributes.sectionType))
        .then(asJson)
        .then((json) => {
            if (json.response.editorsPicks && json.response.editorsPicks.length >= attributes.moreOffset + pageSize) {
              updatePositionalContent(json); // side effects, yay!
              this.emit(':ask', generateHeadlinesSpeech(json), speech.headlines.question);
            } else {
                this.emit(':ask', speech.headlines.notfound);
            }
        })
        .catch(function (error) {
            this.emit(':tell', speech.headlines.notfound);
        });

    var generateHeadlinesSpeech = (json) => {
    const preamble = generatePreamble(isNewIntent, attributes.sectionType);
    const conclusion = sound.break + speech.headlines.question;

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

var buildCapiQuery = (sectionType) => {

    const path = getSectionPath(sectionType, 'uk'); //TODO - other editions?
    const showEditorsPicks = 'show-editors-picks=true';
    const showFields = '&show-fields=byline,headline&tag=type/article,tone/news,-tone/minutebyminute';
    const filters = showEditorsPicks + showFields;

    return helpers.capiQuery(path, filters);

};

var generatePreamble = (isNewIntent, sectionType) => {
    const ack = randomMsg(speech.acknowledgement);

    const buildStories = () => {
      if (isNewIntent) return speech.headlines.top;
      if (sectionType) return 'the next three ' + sectionType + ' stories are: ';
      return speech.headlines.more;
    }

    return ack + buildStories();
};


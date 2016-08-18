const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;

const PAGE_SIZE = 3;

module.exports = function (isNewIntentFlag) {
	// An intent is a new intent unless this is explicitly set to `false`; `undefined` defaults to `true`.
	var isNewIntent = isNewIntentFlag !== false;

	const attributes = this.event.session.attributes;
	attributes.lastIntent = 'GetHeadlines';
	attributes.positionalContent = [];


	if (typeof attributes.moreOffset !== 'undefined') {
		if (isNewIntent) attributes.moreOffset = 0;
		else attributes.moreOffset += PAGE_SIZE;
	}
	else {
		attributes.moreOffset = 0;
	}

	// TODO: check the location - US, UK, AU or International?
	var capiQuery = helpers.capiQuery('uk', 'show-editors-picks=true&show-fields=byline,headline&tag=type/article,tone/news,-tone/minutebyminute');

	get(capiQuery)
		.then(asJson)
		.then((json) => {
			if (json.response.editorsPicks && json.response.editorsPicks.length >= attributes.moreOffset + PAGE_SIZE) {

				var headlinesSpeech = speech.acknowledgement + ((isNewIntent) ? speech.headlines.top : speech.headlines.more);

				json.response.editorsPicks.slice(attributes.moreOffset, attributes.moreOffset+3).forEach(editorsPick => {
					headlinesSpeech += editorsPick.fields.headline + sound.transition;
					attributes.positionalContent.push(editorsPick.id);
				});

				headlinesSpeech += sound.break + speech.headlines.question;
				this.emit(':ask', headlinesSpeech, speech.headlines.reprompt);
			} else {
				this.emit(':ask', speech.headlines.notfound);
			}
		})
		.catch(function (error) {
			this.emit(':tell', headlinesSpeech, speech.headlines.notfound);
		})
};

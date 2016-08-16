const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;

module.exports = function () {
	this.event.session.attributes.lastIntent = 'GetHeadlines';
	this.event.session.attributes.positionalContent = [];

	// TODO: check the location - US, UK, AU or International?
	var capiQuery = helpers.capiQuery('uk', 'show-editors-picks=true&show-fields=standfirst,byline,headline&tag=type/article,tone/news,-tone/minutebyminute');

	get(capiQuery)
		.then(asJson)
		.then((json) => {
			if (json.response.editorsPicks && json.response.editorsPicks.length > 1) {
				var headlinesSpeech = speech.acknowledgement + speech.headlines.top;
				json.response.editorsPicks.splice(0,3).forEach(editorsPick => {
					headlinesSpeech += editorsPick.fields.headline
						+ sound.break
						+ editorsPick.fields.standfirst.replace(/<(?:.|\n)*?>/gm, '').replace('\u2022', '.')
						+ sound.transition;

					this.event.session.attributes.positionalContent.push(editorsPick.id);
				});
				this.emit(':ask', headlinesSpeech, speech.headlines.reprompt)
			} else {
				this.emit(':ask', headlinesSpeech, speech.headlines.notfound)
			}

		})
		.catch(function (error) {
			this.emit(':tell', headlinesSpeech, speech.headlines.notfound);
		})
};

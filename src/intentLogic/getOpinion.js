const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;

module.exports = function (search_term) {
	this.event.session.attributes.lastIntent = 'GetOpinion';

	var capi_filter = 'show-fields=standfirst,byline,headline&show-blocks=all&tag=commentisfree/commentisfree';
	var capi_query = helpers.capiQuery('search', capi_filter, search_term);

	get(capi_query)
		.then(asJson)
		.then(json => {
			if (json.response.results && json.response.results.length > 1) {
				var opinion_speech = speech.acknowledgement + speech.opinions.latest;
				opinion_speech += json.response.results[0].fields.headline + ' by ' + json.response.results[0].fields.byline + '. ' + json.response.results[0].blocks.body[0].bodyTextSummary;
				this.emit(':ask', opinion_speech, speech.opinions.reprompt)
			} else {
				this.emit(':tell', speech.opinions.notfound);
			}
		})
		.catch(error => {
			this.emit(':tell', speech.opinions.notfound);
		})
};

const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;

const PAGE_SIZE = 3;

module.exports = function () {
    const attributes = this.event.session.attributes;
	const slots = this.event.request.intent.slots;

	var newIntent = (event) => {
		return !(event.request.intent.name === "MoreIntent" || event.request.intent.name === event.session.attributes.lastIntent)
	};
	const isNewIntent = newIntent(this.event);

    attributes.lastIntent = 'GetHeadlines';
	if (isNewIntent) attributes.sectionType = slots.section_type ? slots.section_type.value : null;

    if (typeof attributes.moreOffset !== 'undefined') {
        if (isNewIntent) attributes.moreOffset = 0;
        else attributes.moreOffset += PAGE_SIZE;
    }
    else attributes.moreOffset = 0;

    get(buildCapiQuery(attributes.sectionType))
        .then(asJson)
        .then((json) => {
            if (json.response.editorsPicks && json.response.editorsPicks.length >= attributes.moreOffset + PAGE_SIZE) {
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

	// const location = (sectionType) ? 'uk/' + sectionType : 'uk'; // TODO check location

	const path = getSectionPath(sectionType, 'uk');
	const showEditorsPicks = 'show-editors-picks=true';
	const showFields = '&show-fields=byline,headline&tag=type/article,tone/news,-tone/minutebyminute';
	const filters = showEditorsPicks + showFields;

	console.log(helpers.capiQuery(path, filters));
	return helpers.capiQuery(path, filters);

};

var generatePreamble = (isNewIntent, sectionType) => {
	const ack = randomMsg(speech.acknowledgement);

	var stories = '';
	if (isNewIntent) stories = speech.headlines.top;
	else {
		if (sectionType) stories = 'the next three ' + sectionType + ' stories are: ';
		else stories = speech.headlines.more
	}
	return ack + stories;
};

const sectionsWithoutEditions = {
	politics: true,
	football: true,
	world: true,
	fashion: true
};

var getSectionPath = (section, edition) => {
	if (section == null) return edition;
	else if (sectionsWithoutEditions[section]) {
		return section
	} else {
		return edition +"/"+ section
	}
};


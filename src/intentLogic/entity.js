const speech = require('../speech').speech;

/**
 * This may be a topic or a review_type.
 * This is because there is some cross-over between the two, so we need a single handler.
 * We let the appropriate intent handler decide if the entity is valid.
 */
module.exports = function () {
    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;
    const getEntity = () => {
        if (slots.topic && slots.topic.value) return slots.topic.value;
        if (slots.review_type && slots.review_type.value) return slots.review_type.value;
        return null;
    };

    const entity = getEntity();

    if (entity !== null) {
        if (entity.toLowerCase() === "sport" && attributes.lastIntent === "Launch") {
            //Special case - show the sports intro if the skill has just been launched
            this.emit('GetIntroSportIntent')
        } else {
            switch (attributes.lastIntent) {
                case 'GetLatestReviewsIntent':
                case 'GetIntroReviewsIntent' :
                    attributes.lastIntent = "EntityIntent";
                    attributes.reviewType = entity;
                    this.emit('GetLatestReviewsIntent');
                    break;
                case 'GetIntroSportIntent':
                case 'GetIntroNewsIntent':
                    attributes.lastIntent = "EntityIntent";
                    attributes.topic = entity;
                    this.emit('GetHeadlinesIntent');
                    break;
                default:
                    // No last intent or unexpected last intent
                    this.emit(':ask', speech.help.reprompt, speech.help.reprompt)
            }
        }
    } else {
        //This should never happen
        console.log(`Missing entity for EntityIntent: ${this.event.request}`);
        this.emit(':ask', speech.help.reprompt, speech.help.reprompt)
    }
};

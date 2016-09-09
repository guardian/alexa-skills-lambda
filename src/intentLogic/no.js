const randomMsg = require('../helpers').randomMessage;
const speech = require('../speech').speech;

module.exports = function () {
    const attributes = this.event.session.attributes;

    switch (attributes.lastIntent) {
        default:
            this.emit(':ask', randomMsg(speech.core.questions), speech.help.reprompt);
            break;
    }
};

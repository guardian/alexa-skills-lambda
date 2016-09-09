const speech = require('../speech').speech;
const randomMsg = require('../helpers').randomMessage;
const UserStore = require('../userStore');
const Moment = require("moment");

module.exports = function () {
    const userStore = new UserStore(getStage(this.context.functionName));

    this.event.session.attributes.lastIntent = 'Launch';

    const that = this;
    const id = this.event.session.user.userId;
    userStore.getUser(id, (err, dynamoData) => {
        if (err) {
            console.log("Error looking up user " + id + ": " + err);
            that.emit(':ask', speech.launch.welcome_1 + randomMsg(speech.core.questions), speech.launch.reprompt);
        } else {
            const now = Moment.utc();
            if (dynamoData.Item) {
                //Existing user
                userStore.setVisitCount(id, now.format(), dynamoData.Item.visits + 1, (err, data) => {
                    if (err) console.log("Error updating user " + id + ": " + err);
                    const welcome = getWelcome(dynamoData.Item.visits + 1, dynamoData.Item.lastVisit, now);
                    that.emit(':ask', welcome + randomMsg(speech.core.questions), speech.launch.reprompt);
                });
            } else {
                userStore.addUser(id, now.format(), (err) => {
                    if (err) console.log("Error adding new user " + id + ": " + err);
                    that.emit(':ask', speech.launch.welcome_1 + randomMsg(speech.core.questions), speech.launch.reprompt);
                });
            }
        }
    });
};

const getWelcome = (visits, lastVisit, now) => {
    if (visits < 3) return speech.launch.welcome_2;
    else if (now.diff(Moment(lastVisit), 'days') < 7) return speech.launch.welcome_3;
    else return speech.launch.welcome_long_time;
};

const getStage = (functionName) => {
    if (functionName && functionName.includes("PROD")) return "PROD";
    else return "CODE";
};
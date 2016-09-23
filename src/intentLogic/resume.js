const UserStore = require('../userStore');
const helpers = require('../helpers');
const speech = require('../speech').speech;

module.exports = function () {
    const userStore = new UserStore(helpers.getStage(this.context.functionName));
    const that = this;
    userStore.getUser(
        this.event.context.System.user.userId,
        (err, data) => {
            if (err) {
                console.log(`Error getting podcast settings: ${err}`);
                this.emit(':ask', speech.podcasts.notfound, speech.launch.reprompt);

            } else if (data.Item && data.Item.podcastUrl) {
                const podcastDirective = helpers.getPodcastDirective(data.Item.podcastUrl, data.Item.podcastOffset);
                that.emit('PlayPodcastIntent', podcastDirective);

            } else {
                console.log(`User has no url: ${JSON.stringify(data)}`)
                this.emit(':ask', speech.podcasts.notfound, speech.launch.reprompt);
            }
        }
    );
};

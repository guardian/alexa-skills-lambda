const UserStore = require('../userStore');
const helpers = require('../helpers');

module.exports = function () {
    const userStore = new UserStore(helpers.getStage(this.context.functionName));
    const that = this;
    userStore.setAudio(
        this.event.context.System.user.userId,
        this.event.request.token,
        getOffset(this.event),
        (err, data) => {
            if (err) {
                console.log(`Error updating podcast settings: ${err}`);
            }
            that.context.succeed(helpers.stopPodcastDirective);
        }
    );
};

const getOffset = (event) => {
    if (event.request.type === 'AudioPlayer.PlaybackFinished') return 0
    else return event.request.offsetInMilliseconds
};

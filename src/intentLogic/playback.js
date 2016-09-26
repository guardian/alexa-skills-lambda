const UserStore = require('../userStore');
const helpers = require('../helpers');

/**
 * Saves the state of the audio playback in dynamodb
 */
module.exports = function () {
    const userStore = new UserStore(helpers.getStage(this.context.functionName));
    const that = this;
    const data = JSON.parse(this.event.request.token)
    userStore.setAudio(
        this.event.context.System.user.userId,
        data.url,
        data.title,
        getOffset(this.event),
        (err, data) => {
            if (err) {
                console.log(`Error updating podcast settings: ${err}`);
            }
            this.emit(':responseReady');
        }
    );
};

const getOffset = (event) => {
    if (event.request.type === 'AudioPlayer.PlaybackFinished') return 0
    else return event.request.offsetInMilliseconds
};

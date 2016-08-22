const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;

module.exports = function () {
    if(this.event.session.attributes.lastIntent){
        switch(this.event.session.attributes.lastIntent) {
            case "GetReview":
                var review_type = this.event.session.attributes.lastReviewType;
                var search_term = this.event.session.attributes.lastSearchTerm;
                this.emit('GetReview',{ review_type : review_type , search_term : search_term } );
                break;
        }
    } else {
        this.emit(':tell', speech.core.stop)
    }
};

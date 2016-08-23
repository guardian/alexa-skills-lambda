const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const randomMsg = require('../helpers').randomMessage;

module.exports = function (review_item) {
    this.event.session.attributes.lastIntent = 'GetReview';

    var counter = this.event.session.attributes.reviewsRead ? this.event.session.attributes.reviewsRead : 0

    var capi_filter = 'show-fields=standfirst,byline,headline&show-blocks=all&tag=tone/reviews';

    switch (review_item.review_type) {
        case 'film':
            capi_filter += ',film/film';
            break;
        case 'restaurant':
            capi_filter += ',lifeandstyle/restaurants';
            break;
        case 'book':
            capi_filter += ',books/books';
            break;
        case 'music':
            capi_filter += ',music/music';
            break;
    }

    var capi_query = helpers.capiQuery('search', capi_filter, review_item.search_term);

    get(capi_query)
        .then(asJson)
        .then(json => {
            if (json.response.results && json.response.results.length > 1 && json.response.results[counter]) {
                var review_speech = randomMsg(speech.acknowledgement) + speech.reviews.latest;
                var review_counter = counter;

                review_speech += json.response.results[review_counter].fields.headline + ' by ' + json.response.results[review_counter].fields.byline + '. ' + json.response.results[review_counter].blocks.body[0].bodyTextSummary

                if (this.event.session.attributes.lastReviewType && this.event.session.attributes.lastReviewType !== review_item.review_type) {
                    this.event.session.attributes.reviewsRead = 1
                } else if (this.event.session.attributes.lastSearchTerm && this.event.session.attributes.lastSearchTerm !== review_item.search_term) {
                    this.event.session.attributes.reviewsRead = 1
                } else {
                    this.event.session.attributes.reviewsRead = review_counter + 1;
                }

                this.event.session.attributes.lastReviewType = review_item.review_type;
                this.event.session.attributes.lastSearchTerm = review_item.search_term;

                this.emit(':ask', review_speech, speech.reviews.reprompt);
            } else {
                this.emit(':tell', speech.reviews.notfound);
            }
        })
        .catch(error => {
            this.emit(':tell', speech.reviews.notfound);
        })
};

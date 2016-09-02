const get = require('simple-get-promise').get;
const asJson = require('simple-get-promise').asJson;

const helpers = require('../helpers');
const speech = require('../speech').speech;
const sound = require('../speech').sound;
const getMoreOffset = require('../helpers').getMoreOffset;

module.exports = function(isNewIntentFlag) {
    const isNewIntent = isNewIntentFlag !== false;

    const attributes = this.event.session.attributes;
    const slots = this.event.request.intent.slots;

    attributes.lastIntent = 'GetLatestReviewsIntent';

    if (isNewIntent) attributes.reviewType = slots.review_type.value;

    if (attributes.reviewType) {
        attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset);

        const capiQuery = getCapiQuery(attributes.moreOffset, attributes.reviewType);
        if (capiQuery !== null) {
            get(capiQuery)
                .then(asJson)
                .then(json => {
                    if (json.response.results && json.response.results.length > 1) {
                        attributes.positionalContent = json.response.results.map(review => review.id);
                        const preamble = getPreamble(isNewIntent, json.response.results.length, attributes.reviewType);
                        const reviews = json.response.results.map(review => {
                            return review.fields.headline + sound.transition;
                        });
                        const conclusion = getConclusion(json.response.results.length);

                        this.emit(':ask', `${preamble} ${reviews} ${conclusion}`);
                    } else {
                        this.emit(':tell', speech.reviews.notfound);
                    }
                })
                .catch(error => {
                    this.emit(':tell', speech.reviews.notfound);
                })
        } else {
            this.emit(':ask', speech.reviews.clarifyType);
        }
    } else {
        this.emit(':ask', speech.reviews.clarifyType);
    }
}

function getCapiQuery(offset, reviewType) {
    const tagType = getTagType(reviewType);
    if (tagType !== null) {
        const filter = "page="+ ((offset / helpers.pageSize) + 1)
                     + "&page-size="+ helpers.pageSize
                     + "&tag=tone/reviews,"+ tagType
                     + "&show-fields=standfirst,byline,headline&show-blocks=all";
        
        return helpers.capiQuery('search', filter);
    } else {
        return null;
    }
}

function getTagType(reviewType) {
    switch (reviewType) {
        case 'film':
            return 'film/film';
            break;
        case 'restaurant':
            return 'lifeandstyle/restaurants';
            break;
        case 'book':
            return 'books/books';
            break;
        case 'music':
            return 'music/music';
            break;
        default:
            return null
    }
}

function getPreamble(isNewIntent, reviewCount, reviewType) {
    if (isNewIntent) return `Here are the latest ${reviewType} reviews.`;
    if (reviewCount === 1) return `The next ${reviewType} review is`;
    return `The next ${reviewType} reviews are`;
}

function getConclusion(reviewCount) {
    if (reviewCount == 1) return speech.reviews.followup1;
    if (reviewCount == 2) return speech.reviews.followup2;
    return speech.reviews.followup3
}


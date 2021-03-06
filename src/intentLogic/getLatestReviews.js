const get = require('simple-get-promise').get
const asJson = require('simple-get-promise').asJson
const xmlescape = require('xml-escape')

const speech = require('../speech').speech
const sound = require('../speech').sound
const randomMsg = require('../helpers').randomMessage
const getMoreOffset = require('../helpers').getMoreOffset
const helpers = require('../helpers')
const hitOphan = require('../helpers').hitOphanEndpoint

const capiQueryBuilder = require('../capiQueryBuilder')

module.exports = function () {
  const attributes = this.event.session.attributes
  const slots = this.event.request.intent.slots

  const isNewIntent = attributes.lastIntent !== 'MoreIntent'

  const lastIntent = attributes.lastIntent

  const getReviewType = (attributes, slots) => {
    switch (attributes.lastIntent) {
      case 'MoreIntent':
      case 'EntityIntent': return attributes.reviewType ? attributes.reviewType : null
      default: return (slots.review_type && slots.review_type.value) ? slots.review_type.value : null
    }
  }
  attributes.reviewType = getReviewType(attributes, slots)

  attributes.lastIntent = 'GetLatestReviewsIntent'

  if (attributes.reviewType !== null) {
    attributes.moreOffset = getMoreOffset(isNewIntent, attributes.moreOffset)
    const capiQuery = capiQueryBuilder.reviewQuery(attributes.moreOffset, attributes.reviewType)
    if (capiQuery !== null) {
      get(capiQuery)
        .then(asJson)
        .then(json => {
          if (json.response.results && json.response.results.length > 1) {
            hitOphan(getReviewPath(attributes.reviewType), this.event.session.user.userId, true) // review fronts

            attributes.positionalContent = json.response.results.map(review => review.id)
            const preamble = getPreamble(isNewIntent, json.response.results.length, attributes.reviewType)
            const reviews = json.response.results.map(review => {
              return xmlescape(getHeadline(review)) + sound.transition
            })
            const conclusion = getConclusion(json.response.results.length)

            this.emit(':ask', `${preamble} ${reviews.join(' ')} ${conclusion}`)
          } else {
            this.emit(':tell', speech.reviews.notfound)
          }
        })
        .catch(error => {
          this.emit(':tell', speech.reviews.notfound)
        })
    } else {
      this.emit(':ask', speech.reviews.clarifyType)
    }
  } else {
    // Have they just opened the skill?
    if (lastIntent === 'Launch') {
      this.emit(
        ':askWithCard',
        randomMsg(speech.acknowledgement) + speech.reviews.explainer + randomMsg(speech.core.questions),
        speech.core.reprompt,
        'Reviews',
        'You can ask for the latest reviews for the following:\nFilms, books, music and restaurants',
        helpers.cardImages
      )
    } else {
      this.emit(':ask', speech.reviews.clarifyType)
    }
  }
}

const getPreamble = (isNewIntent, reviewCount, reviewType) => {
  if (isNewIntent) return `Here are the latest ${reviewType} reviews.`
  if (reviewCount === 1) return `The next ${reviewType} review is`
  return `The next ${reviewType} reviews are`
}

const getHeadline = (review) => {
  const titleWithoutReview = removeReviewFromTitle(review.fields.headline)
  if (review.fields.starRating) {
    if (review.fields.starRating === 1) return `${titleWithoutReview}. 1 star. `
    else return `${titleWithoutReview}. ${review.fields.starRating} stars. `
  } else return titleWithoutReview
}

const getConclusion = (reviewCount) => {
  if (reviewCount === 1) return speech.reviews.followup1
  if (reviewCount === 2) return speech.reviews.followup2
  return speech.reviews.followup3
}

const removeReviewFromTitle = (title) => title.replace(/(-|–)?\s?(book|restaurant|film|movie)? review$/, '')

const getReviewPath = (reviewType) => {
  switch (reviewType) {
    case 'film': return 'film+tone/reviews'
    case 'restaurant': return 'lifeandstyle/restaurants+tone/reviews'
    case 'music': return 'music/music+tone/reviews'
    case 'book': return 'books/books+tone/reviews'
  }
}

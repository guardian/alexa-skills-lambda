'use strict';

// dependencies
const get = require('simple-get-promise').get;
const config = require('../tmp/config.json');
const Alexa = require('alexa-sdk');

// config
const APP_ID = config.app_id;
const SKILL_NAME = 'The Guardian';

// intent logic
const getHeadlines = require('./intentLogic/getHeadlines');
const getOpinion = require('./intentLogic/getOpinion');
const getReview = require('./intentLogic/getReview');
const getLatestReviews = require('./intentLogic/getLatestReviews');
const readContentAtPosition = require('./intentLogic/readContentAtPosition');
const yes = require('./intentLogic/yes');

// misc
const helpers = require('./helpers');
const speech = require('./speech').speech;
const randomMsg = require('./helpers').randomMessage;

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() {
        this.event.session.attributes.lastIntent = 'Launch';
        this.emit(':ask', speech.launch.welcome + randomMsg(speech.core.questions), speech.launch.reprompt)
    },

    'GetIntroNewsIntent': function() {
        this.emit(':ask', speech.news.explainer + randomMsg(speech.core.questions), speech.news.reprompt)
    },

    'GetIntroReviewsIntent': function() {
        this.emit(':ask', speech.reviews.explainer + randomMsg(speech.core.questions), speech.reviews.reprompt)
    },

    'GetIntroSportIntent': function() {
        this.emit(':ask', speech.sport.explainer + randomMsg(speech.core.questions), speech.sport.reprompt)
    },

    'GetHeadlinesIntent': getHeadlines,

    'ReadContentAtPositionIntent': readContentAtPosition,

    'MoreIntent': function() {
        // repeat last intent action with increased offSet
        this.emit(this.event.session.attributes.lastIntent, false);
    },
    'GetOpinionIntent': getOpinion,

    'GetReviewIntent': getReview,

    'GetLatestReviewsIntent': getLatestReviews,

    //The user has specified a review_type. The reviews intents will prompt for one if missing.
    'ReviewTypeIntent': function() {
        const slots = this.event.request.intent.slots;
        if (slots.review_type && slots.review_type.value) {
            this.event.session.attributes.reviewType = slots.review_type.value;
            this.emit(this.event.session.attributes.lastIntent)
        }
    },

    'AMAZON.HelpIntent': function() {
        this.event.session.attributes.lastIntent = 'Help'

        this.emit(':ask', speech.help.explainer + randomMsg(speech.core.questions), speech.help.reprompt)
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', speech.core.cancel)
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', speech.core.stop)
    },
    'AMAZON.YesIntent': function() {
        return yes
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', speech.core.stop)
    }
};


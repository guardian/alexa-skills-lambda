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
const readContentAtPosition = require('./intentLogic/readContentAtPosition');
const yes = require('./intentLogic/yes');

// misc
const helpers = require('./helpers');
const speech = require('./speech').speech;

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() {
        this.event.session.attributes.lastIntent = 'Launch';
        this.emit(':ask', speech.launch.welcome, speech.launch.reprompt);
    },

    'GetTopNewsIntent': function() {
        this.emit(':ask', speech.news.explainer, speech.news.reprompt)
    },

    'GetTopReviewsIntent': function() {
        this.emit(':ask', speech.reviews.explainer, speech.reviews.reprompt)
    },

    'GetTopSportIntent': function() {
        this.emit(':ask', speech.sport.explainer, speech.sport.reprompt)
    },

    'GetHeadlinesIntent': getHeadlines,

    'ReadContentAtPositionIntent': readContentAtPosition,

    'MoreIntent': function() {
        // repeat last intent action with increased offSet
        this.emit(this.event.session.attributes.lastIntent, false);
    },
    'GetOpinionIntent': getOpinion,

    'GetReviewIntent': getReview,

    'AMAZON.HelpIntent': function() {
        this.event.session.attributes.lastIntent = 'Help';

        this.emit(':ask', speech.help.explainer, speech.help.reprompt)
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


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
    'LaunchRequest': function () {
        this.emit('Launch');
    },
    'Launch': function(){
        this.event.session.attributes.lastIntent = 'Launch';
        this.emit(':ask', speech.launch.welcome, speech.launch.reprompt);
    },
    'GetHeadlinesIntent': function () {
        this.emit('GetHeadlines');
    },
	"GetHeadlines": getHeadlines,

    'ReadContentAtPositionIntent': function() {
        const slots = this.event.request.intent.slots;
        const position = slots.position ? slots.position.value : null;
        this.emit('ReadContentAtPosition', position );
    },
	'ReadContentAtPosition': readContentAtPosition,

    'GetOpinionIntent': function () {
        const slots = this.event.request.intent.slots;
        const searchTerm = slots.search_term ? slots.search_term.value : null;
        this.emit('GetOpinion', searchTerm );
    },
	"GetOpinion": getOpinion,

    'GetReviewIntent': function () {
        const slots = this.event.request.intent.slots;
        const reviewType = slots.review_types ? slots.review_types.value : null;
        const searchTerm = slots.search_term ? slots.search_term.value : null;
        this.emit('GetReview',{ review_type : reviewType , search_term : searchTerm } );
    },
	"GetReview": getReview,

    'AMAZON.HelpIntent': function () {
        this.event.session.attributes.lastIntent = 'Help';

        this.emit(':ask', speech.help.explainer, speech.help.reprompt)
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', speech.core.cancel)
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', speech.core.stop)
    },
    'AMAZON.YesIntent': function () {
		return yes
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', speech.core.stop)
    }
};


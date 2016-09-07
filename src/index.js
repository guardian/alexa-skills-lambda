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
        this.emit(':ask', speech.launch.welcome_1 + randomMsg(speech.core.questions), speech.launch.reprompt)
    },

    'GetIntroNewsIntent': function() {
        this.event.session.attributes.lastIntent = 'GetIntroNewsIntent';
        this.emit(':ask', randomMsg(speech.acknowledgement) + speech.news.explainer + randomMsg(speech.core.questions), speech.news.reprompt)
    },

    'GetIntroSportIntent': function() {
        this.event.session.attributes.lastIntent = 'GetIntroSportIntent';
        this.emit(':ask', randomMsg(speech.acknowledgement) + speech.sport.explainer + randomMsg(speech.core.questions), speech.sport.reprompt)
    },

    'GetHeadlinesIntent': getHeadlines,

    'ReadContentAtPositionIntent': readContentAtPosition,

    'MoreIntent': function() {
        const lastIntent = this.event.session.attributes.lastIntent;
        switch (lastIntent) {
            case 'GetHeadlinesIntent':
            case 'GetLatestReviewsIntent':
            case 'GetOpinionIntent':
                // repeat last intent action with increased offSet
                this.event.session.attributes.lastIntent = 'MoreIntent';
                this.emit(lastIntent);
                break;

            default:
                this.emit(':ask', speech.help.reprompt)
        }
    },
    'GetOpinionIntent': getOpinion,

    'GetLatestReviewsIntent': getLatestReviews,

    /**
     * This may be a topic or a review_type. 
     * This is because there is some cross-over between the two, so we need a single handler.
     * We let the appropriate intent handler decide if the entity is valid.
     */
    'EntityIntent': function() {
        const attributes = this.event.session.attributes;
        const slots = this.event.request.intent.slots;
        const getEntity = () => {
            if (slots.topic && slots.topic.value) return slots.topic.value;
            if (slots.review_type && slots.review_type.value) return slots.review_type.value;
            return null;
        };

        const entity = getEntity();

        if (entity !== null) {
            if (entity.toLowerCase() === "sport" && attributes.lastIntent === "Launch") {
                //Special case - show the sports intro if the skill has just been launched
                this.emit('GetIntroSportIntent')
            } else {
                switch (attributes.lastIntent) {
                    case 'GetLatestReviewsIntent':
                    case 'GetIntroReviewsIntent' :
                        attributes.lastIntent = "EntityIntent";
                        attributes.reviewType = entity;
                        this.emit('GetLatestReviewsIntent');
                        break;
                    case 'GetIntroSportIntent':
                    case 'GetIntroNewsIntent':
                        attributes.lastIntent = "EntityIntent";
                        attributes.topic = entity;
                        this.emit('GetHeadlinesIntent');
                        break;
                    default:
                        // No last intent or unexpected last intent
                        this.emit(':ask', speech.help.reprompt)
                }
            }
        } else {
            //This should never happen
            console.log(`Missing entity for EntityIntent: ${this.event.request}`);
            this.emit(':ask', speech.help.reprompt)
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


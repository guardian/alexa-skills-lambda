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
const no = require('./intentLogic/no');
const launch = require('./intentLogic/launch');
const getPodcast = require('./intentLogic/getPodcast');
const latestPodcast = require('./intentLogic/latestPodcast');
const entity = require('./intentLogic/entity');

// misc
const helpers = require('./helpers');
const speech = require('./speech').speech;
const randomMsg = require('./helpers').randomMessage;


exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(event));
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': launch,

    'PodcastIntent': function() {
        this.event.session.attributes.lastIntent = 'PodcastIntent';
        this.emit(
          ':askWithCard',
          speech.podcasts.intro,
          speech.launch.reprompt,
          'Podcasts',
          'You can listen to the following podcasts:\n'+ helpers.podcastList,
          helpers.cardImages
        );
    },
    'GetPodcastIntent': getPodcast,

    'PlayPodcastIntent': function(jsonObj) {
        this.context.succeed(jsonObj);
    },

    'LatestPodcastIntent': latestPodcast,

    'GetIntroNewsIntent': function() {
        this.event.session.attributes.lastIntent = 'GetIntroNewsIntent';
        this.emit(
            ':askWithCard',
            randomMsg(speech.acknowledgement) + speech.news.explainer + randomMsg(speech.core.questions),
            speech.core.reprompt,
            'Topics',
            'You can ask for news and opinions on the following topics:\n'+ helpers.topicList,
            helpers.cardImages
        );
    },

    'GetIntroSportIntent': function() {
        this.event.session.attributes.lastIntent = 'GetIntroSportIntent';
        this.emit(
            ':askWithCard',
            randomMsg(speech.acknowledgement) + speech.sport.explainer + randomMsg(speech.core.questions),
            speech.sport.reprompt,
            'Sport topics',
            'You can ask for news and opinions on the following topics:\n'+ helpers.sportTopicList,
            helpers.cardImages
        );
    },

    'GetHeadlinesIntent': getHeadlines,

    'ReadContentAtPositionIntent': readContentAtPosition,

    'MoreIntent': function() {
        const lastIntent = this.event.session.attributes.lastIntent;
        switch (lastIntent) {
            case 'GetHeadlinesIntent':
            case 'GetLatestReviewsIntent':
            case 'GetOpinionIntent':
            case 'LatestPodcastIntent':
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

    'EntityIntent': entity,

    'AMAZON.HelpIntent': function() {
        this.event.session.attributes.lastIntent = 'Help';

        this.emit(':ask', speech.help.explainer + randomMsg(speech.core.questions), speech.help.reprompt)
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':ask', speech.core.cancel, speech.help.reprompt)
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', randomMsg(speech.core.stop))
    },
    'AMAZON.YesIntent': yes,

    'AMAZON.NoIntent': no,

    'SessionEndedRequest': function() {
        this.emit(':tell', randomMsg(speech.core.stop))
    },

    'AMAZON.RepeatIntent': function() {
        // try to repeat whatever we were doing
        if (this.event.session.attributes.lastIntent !== undefined) {
            this.emit(this.event.session.attributes.lastIntent)
        }
        // give up
        else {
          this.emit(':ask', speech.help.reprompt, speech.help.reprompt);
        }
    }

};


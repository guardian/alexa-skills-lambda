'use strict';
var get = require('simple-get-promise').get;
var asJson = require('simple-get-promise').asJson;
var Alexa = require('alexa-sdk');

var config = require('../tmp/config.json')

var APP_ID = config.app_Id
var CAPI_API_KEY = config.capi_key
var SKILL_NAME = 'The Guardian'

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', speech.launch.welcome);
    },
    'GetHeadlinesIntent': function () {
        this.emit('GetHeadlines');
    },
    'GetReviewIntent': function () {
        var slots = this.event.request.intent.slots;

        var review_type = slots.review_types ? slots.review_types.value : null;
        var search_term = slots.search_term ? slots.search_term.value : null;
 
        this.emit('GetReview',{ review_type : review_type , search_term : search_term } );
    },
    'GetOpinionIntent': function () {
        var slots = this.event.request.intent.slots;

        var search_term = slots.search_term ? slots.search_term.value : null;
 
        this.emit('GetOpinion', search_term );
    },
    'GetHeadlines': function () {
        var capi_query = helpers.capi_query('uk','show-editors-picks=true&show-fields=standfirst,byline,headline&tag=-tone/minutebyminute');

        get(capi_query)
			.then(asJson)
            .then(json => {
                this.emit(':tell', json.response.editorsPicks[0].fields.headline);
        })
            .catch(error => { speech.headlines.notfound })
    },
    'GetOpinion': function (search_term) {
        var capi_filter = 'show-fields=standfirst,byline,headline&show-blocks=all&tag=commentisfree/commentisfree';       
        var capi_query = helpers.capi_query('search',capi_filter,search_term);

        get(capi_query)
            .then(asJson)
            .then(json => {
                 if(json.response.results && json.response.results.length > 1) {
                    this.emit(':tell', json.response.results[0].fields.headline + ' by ' + json.response.results[0].fields.byline + '. ' + json.response.results[0].blocks.body[0].bodyTextSummary);
                } else {
                    this.emit(':tell', 'I have not been able to find an opinion on ' + search_term + ' for you');
                }
        })
            .catch(error => { "I could not find any headlines"})
    },
    'GetReview': function (review_item) {
        var capi_filter = 'show-fields=standfirst,byline,headline&show-blocks=all&tag=tone/reviews'; 
 
        switch(review_item.review_type) {
            case "film":
                capi_filter += ',film/film'
                break;
            case "restaurant":
                capi_filter += ',lifeandstyle/restaurants'
                break;
            case "book":
                capi_filter += ',books/books'
                break;
            case "music":
                capi_filter += ',music/music'
                break;
        }    

        var capi_query = helpers.capi_query('search',capi_filter,review_item.search_term);

        get(capi_query)
            .then(asJson)
            .then(json => {
                if(json.response.results && json.response.results.length > 1) {
                    this.emit(':tell', json.response.results[0].fields.headline + ' by ' + json.response.results[0].fields.byline + '. ' + json.response.results[0].blocks.body[0].bodyTextSummary);
                } else {
                    this.emit(':tell', 'I have not been able to find a review for you.');
                }
        })
            .catch(error => { "I could not find any headlines" })
    },
    'AMAZON.HelpIntent': function () {
        
        this.emit(':ask', speech.help.explainer, speech.help.reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', speech.core.cancel);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', speech.core.stop);
    }
};

var helpers = {
    capi_query: function(endpoint,filter, q){
        var capi_host = 'http://content.guardianapis.com/'
        var key = '&api-key=' + CAPI_API_KEY
        var query = q ? '&q=' + q : ''
        var full_query = capi_host + endpoint + '?' + filter + query + key
        console.log(full_query)
        return full_query

    }
};

var speech = {
    launch: {
        welcome: 'Welcome to The Guardian. You can ask for news, opinions, reviews and sport. What would you like to hear?'
    },
    headlines: {
        notfound: 'Sorry, I could not find you any headlines.'
    },
    help: {
        explainer: 'Sure, happy to help. You can ask for news, opinions, reviews, sport headlines and football scores.',
        reprompt: 'What would you like to do?'
    },
    core: {
        stop: 'Goodbye for now.',
        cancel: 'Goodbye for now.'
    }
};

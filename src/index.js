'use strict';
var get = require('simple-get-promise').get;
var asJson = require('simple-get-promise').asJson;
var Alexa = require('alexa-sdk');

var config = require('../tmp/config.json')

var APP_ID = config.app_Id
var CAPI_API_KEY = config.capi_key
var SKILL_NAME = 'The Guardian'

exports.handler = function(event, context, callback) {
    //console.log(event)
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
        this.event.session.attributes.lastIntent = 'launch'
        this.emit(':ask', speech.launch.welcome, speech.launch.reprompt);
    },
    'GetHeadlinesIntent': function () {
        this.emit('GetHeadlines');
    },
    'GetHeadlines': function () {
        var capi_query = helpers.capi_query('uk','show-editors-picks=true&show-fields=standfirst,byline,headline&tag=type/article,tone/news,-tone/minutebyminute');

        get(capi_query)
            .then(asJson)
            .then(json => {

                if(json.response.editorsPicks && json.response.editorsPicks.length > 1) {
                    var headlines_speech = speech.acknowledgement + speech.headlines.top
                    //headlines_speech += sound.transition
                    headlines_speech += json.response.editorsPicks[0].fields.headline + sound.break + json.response.editorsPicks[0].fields.standfirst.replace(/<(?:.|\n)*?>/gm, '').replace('\u2022', '.')
                    headlines_speech += sound.transition
                    headlines_speech += json.response.editorsPicks[1].fields.headline + sound.break + json.response.editorsPicks[1].fields.standfirst.replace(/<(?:.|\n)*?>/gm, '').replace('\u2022', '.')
                    headlines_speech += sound.transition
                    headlines_speech += json.response.editorsPicks[2].fields.headline + sound.break + json.response.editorsPicks[2].fields.standfirst.replace(/<(?:.|\n)*?>/gm, '').replace('\u2022', '.')

                    this.emit(':ask', headlines_speech, speech.headlines.reprompt)
                }else{
                    this.emit(':ask', headlines_speech, speech.headlines.notfound)
                }
                
        })
            .catch(error => { speech.headlines.notfound })
    },
    'GetOpinionIntent': function () {
        var slots = this.event.request.intent.slots;

        var search_term = slots.search_term ? slots.search_term.value : null;
 
        this.emit('GetOpinion', search_term );
    },
    'GetOpinion': function (search_term) {
        var capi_filter = 'show-fields=standfirst,byline,headline&show-blocks=all&tag=commentisfree/commentisfree';       
        var capi_query = helpers.capi_query('search',capi_filter,search_term);

        get(capi_query)
            .then(asJson)
            .then(json => {
                 if(json.response.results && json.response.results.length > 1) {
                    var opinion_speech = speech.acknowledgement + speech.opinions.latest
                    opinion_speech += json.response.results[0].fields.headline + ' by ' + json.response.results[0].fields.byline + '. ' + json.response.results[0].blocks.body[0].bodyTextSummary

                    this.emit(':ask', opinion_speech, speech.opinions.reprompt);
                } else {
                    this.emit(':tell', speech.opinions.notfound);
                }
        })
            .catch(error => { speech.opinions.notfound })
    },
    'GetReviewIntent': function () {
        var slots = this.event.request.intent.slots;

        var review_type = slots.review_types ? slots.review_types.value : null;
        var search_term = slots.search_term ? slots.search_term.value : null;
 
        this.emit('GetReview',{ review_type : review_type , search_term : search_term } );
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
                    var review_speech = speech.acknowledgement + speech.reviews.latest
                    review_speech += json.response.results[0].fields.headline + ' by ' + json.response.results[0].fields.byline + '. ' + json.response.results[0].blocks.body[0].bodyTextSummary

                    this.emit(':ask', review_speech, speech.reviews.reprompt);
                } else {
                    this.emit(':tell', speech.reviews.notfound);
                }
        })
            .catch(error => { speech.reviews.notfound })
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', speech.help.explainer, speech.help.reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', speech.core.cancel);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', speech.core.stop);
    }/*,
    'AMAZON.YesIntent': function () {

        this.emit(':tell', speech.core.stop);
    },
    'AMAZON.NoIntent': function () {
        
        this.emit(':tell', speech.core.stop);
    }*/
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
        welcome: 'Welcome to The Guardian. You can ask for news, opinions, reviews and sport.',
        reprompt: 'What would you like to hear?'
    },
    headlines: {
        top: 'the top three stories are: ',
        notfound: 'Sorry, I could not find you any headlines.',
        reprompt: 'Would you like to hear anything else?'
    },
    opinions: {
        latest: '',
        notfound: 'Sorry, I could not find you any opinions on this topic.',
        reprompt: 'Would you like to hear another opinion?'
    },
    reviews: {
        latest: '',
        notfound: 'Sorry, I could not find you any review for you.',
        reprompt: 'Would you like to hear another review?'
    },
    help: {
        explainer: 'Sure, happy to help. You can ask for news, opinions, reviews, sport headlines and football scores.',
        reprompt: 'What would you like to do?'
    },
    core: {
        stop: 'Goodbye for now.',
        cancel: 'Goodbye for now.'
    },
    acknowledgement: randomMessage([
      'Sure, ',
      'Certainly, ',
      'Absolutely, '
    ])
};

var sound = {
    transition: '<break time="1s"/>',
    break: '<break strength="medium"/>'
};


function randomMessage(messages) {
  return messages[Math.floor(Math.random()*messages.length)]
};
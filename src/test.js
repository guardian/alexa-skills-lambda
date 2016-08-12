var lambda = require('./index').handler

lambda({
    "session": {
        "sessionId": "",
        "application": {
            "applicationId": ""
        },
        "attributes": { 
         "lastIntent": 'GetReview',
         "reviewsRead": 2,
         "lastSearchTerm": 'batman',
         "lastReviewType": 'film' 
        },
        "user": {
            "userId": ""
        },
        "new": true
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "",
        "locale": "en-US",
        "timestamp": "2016-08-08T14:18:45Z",
        "intent": {
            "name": "AMAZON.YesIntent",
            "slots": {}
        },
        "version": "1.0"
    }
}, {
    succeed: function (response) {
        console.log(response)
    },
    fail: function (error) {
        console.log(error)
    }
})

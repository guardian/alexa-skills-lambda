const speech = {
    launch: {
        welcome: 'Welcome to The Guardian! You can ask me for news, opinions, reviews and sport. ',
        reprompt: 'Sorry, what would you like to hear?'
    },
    news: {
        explainer: `'OK great. I can give you more than just the headlines. For example, ask: give me the sport headlines.
        If you want me to read you stories on a topic. Ask: give me the latest on Brexit.
        And finally, if you want me to hear the latest opinions on a topic. Say: give me the latest opinions on Brexit. '`,
        reprompt: 'Sorry, what headlines would you like to hear?'
    },
    sport: {
        explainer: 'I can give you headlines for football, cricket, rugby, tennis, Formula One cycling or golf. ',
        reprompt: 'Sorry, what sport would you like the headlines for?'
    },
    headlines: {
        top: 'the top three stories are: ',
        more: 'the next three stories are: ',
        notfound: 'Sorry, I could not find you any headlines. ',
        followup1: 'Would you like me to read the first story?',
        followup2: 'Would you like me to read the first or second story?',
        followup3: 'Would you like me to read the first, second or third story or would you like more headlines?',
        question: 'Would you like me to read the first, second or third story or would you like more headlines?',
        hearAgain: 'OK. Would you like hear the choices again or more headlines?',
        reprompt: 'Sorry, Would you like me to read the first, second or third story or would you like more headlines?',
        explainer: 'I can give you more headlines or get stories by topic by saying: give me the latest on x, or give me the sport headlines. '
    },
    topic: {
        latest: 'the latest three on opinion stories for {0} are: ',
        more: 'the next three opinion stories for {0} are:',
        question: 'Would you like hear the choices again or give you more stories on {0}?',
        hearAgain: 'OK. Would you like hear the choices again or give you more stories on {0}?',
        notfound: 'Sorry - I don’t have any news on {0}. What else could I help you with? ',
        reprompt: 'Would you like to hear another story?'
    },
    opinions: {
        latest: 'the latest three on opinion stories for {0} are: ',
        more: 'the next three opinion stories are: ',
        question: 'Would you like hear the stories again or give you more opinion stories on {0}?',
        hearAgain: 'OK. Would you like hear the stories again or give you more opinion stories on {0}?',
        notfound: 'Sorry - I don’t have any opinions on that. What else could I help you with?',
        reprompt: 'Would you like to hear another opinion?',
        followup1: 'Would you like me to read the first story or would you like more opinions?',
        followup2: 'Would you like me to read the first story, the second one or would you like more opinions?',
        followup3: 'Would you like me to read the first, second or third opinion or would you like more opinions?',
    },
    reviews: {
        latest: 'the latest {0} reviews are:',
        specifc: 'the latest reviews for {0} are:',
        more: 'the next three reviews are:',
        question: 'Would you like me to read the first, second or third review or would you like more {0} reviews?',
        hearAgain: 'OK. Would you like hear the choices again or more reviews?',
        notfound: 'Sorry, I could not find a review for you. Is there anything else I can help with?',
        clarifyType: 'Is it a restaurant, book, film, or music review you\'re after?',
        clarifySearch: 'What would you like a {0} review for?',
        reprompt: 'Would you like to hear another review?',
        explainer: 'I have reviews for films, books, music and restaurants. Just say: give me the latest restaurant reviews. ',
        followup1: 'Would you like me to read this review?',
        followup2: 'Would you like me to read the first review or the second review?',
        followup3: 'Would you like me to read the first, second or third review or would you like more reviews?'
    },
    help: {
        explainer: 'Happy to help. With The Guardian skill you can ask for the news, reviews, sports headlines and football scores. In News, you can ask for more headlines or get stories by topic and author. In Reviews, we have some great reviews for films, books, music and restaurants. You can ask for latest reviews and best by type or for a specific title. In Sport, you can ask for the headlines for football, cricket, rugby, tennis, F1, cycling or golf. Additionally for football, you can ask for the live scores, latest scores or fixtures. ',
        reprompt: 'Sorry, what would you like to do?'
    },
    core: {
        stop: 'Speak to you again soon. ',
        cancel: 'Speak to you again soon. ',
        didNotUnderstand: 'Sorry, I didn\'t catch that',
        questions: [
            'What would you like to hear?',
            'How can I help?',
            'What can I help you with?',
            'What can I tell you?'
        ]
    },
    positionalContent: {
        followup: 'Would you like to hear the headlines again, or more headlines?',
        articleBy: 'This article is written by ',
        timeToReadPref: ' and it will take roughly ',
        timeToReadSuff: ' minutes to read. '
    },
    acknowledgement: [
        'Sure, ',
        'Certainly, ',
        'Absolutely, ',
        'No problem, '
    ]
};

const sound = {
    transition: '<break time="1s"/>',
    break: '<break strength="medium"/>',
    strongBreak: '<break strength="x-strong"/>'
};

exports.speech = speech;
exports.sound = sound;

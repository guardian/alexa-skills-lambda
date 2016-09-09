const speech = {
    launch: {
        welcome_1: `Welcome to The Guardian! 
        You can ask me for news, reviews, sport and podcasts. `,
        welcome_2: `Welcome back to The Guardian! You can ask me for news, reviews, sport and podcasts. `,
        welcome_3: `Welcome to the Guardian!`,
        welcome_long_time: `Welcome back to the Guardian! You can ask me for news, reviews, sport and podcasts. `,
        reprompt: "Sorry, what would you like to hear?"
    },
    news: {
        explainer: `I can give you the headlines, or the latest news or opinions for a topic. `,
        explainer_new_user: `I can give you the headlines, or the latest news or opinions for a topic. I've just sent the list of topics to your companion app. `,
        reprompt: "Sorry, what headlines would you like to hear?"
    },
    sport: {
        explainer: "I can give you the headlines or opinions for football, cricket, rugby, tennis, formula one, cycling, boxing, golf or US sports. ",
        explainer_new_user: "I can give you the headlines or opinions for football, cricket, rugby, tennis, formula one, cycling, boxing, golf or US sports. I've just sent the list of topics to your companion app. ",
        reprompt: "Sorry, what sport would you like the headlines for?"
    },
    headlines: {
        more: "the next three stories are: ",
        headlinesNotFound: "Sorry, I cannot find you any headlines at the moment. ",
        topicNotFound: "Sorry - I don't have any news on %s. What else could I help you with?",
        followup1: "Would you like me to read the first story?",
        followup2: "Would you like me to read the first or second story?",
        followup3: "Would you like me to read the first, second or third story or would you like more headlines?",
        question: "Would you like me to read the first, second or third story or would you like more headlines?",
        hearAgain: "OK. Would you like hear the choices again or more headlines?",
        reprompt: "Sorry, Would you like me to read the first, second or third story or would you like more headlines?"
    },
    opinions: {
        more: "the next three opinion stories are: ",
        notFound: "Sorry - I can't find you any opinions at the moment. ",
        topicNotFound: "Sorry - I don’t have any opinions on %s. What else can I help you with?",
        reprompt: "Would you like to hear another opinion?",
        followup1: "Would you like me to read the first story or would you like more opinions?",
        followup2: "Would you like me to read the first story, the second one or would you like more opinions?",
        followup3: "Would you like me to read the first, second or third opinion or would you like more opinions?",
    },
    reviews: {
        latest: "the latest {0} reviews are:",
        specifc: "the latest reviews for {0} are:",
        more: "the next three reviews are:",
        question: "Would you like me to read the first, second or third review or would you like more {0} reviews?",
        hearAgain: "OK. Would you like hear the choices again or more reviews?",
        notfound: "Sorry, I could not find a review for you. Is there anything else I can help with?",
        clarifyType: "Is it a restaurant, book, film, or music review you're after?",
        clarifySearch: "What would you like a {0} review for?",
        reprompt: "Would you like to hear another review?",
        explainer: "I have reviews for films, books, music and restaurants. ",
        explainer_new_user: "I have reviews for films, books, music and restaurants. I've just sent the list of review types to your companion app. ",
        followup1: "Would you like me to read this review?",
        followup2: "Would you like me to read the first review or the second review?",
        followup3: "Would you like me to read the first, second or third review or would you like more reviews?"
    },
    help: {
        explainer: `Happy to help. You can ask for the news, reviews, sport and podcasts.
        In News, I can give you the headlines, or the latest news or opinions for a topic.
        In Reviews, I have reviews for films, books, music and restaurants.
        In Sport, I can give you the headlines for football, cricket, rugby, tennis, formula one, cycling, boxing, golf.
        In Podcasts, I have weekly podcasts for football, politics, science, news, film, culture and books.
        What would you like?`,
        reprompt: "Sorry, what would you like to do?"
    },
    core: {
        stop: "Goodbye for now",
        cancel: "Goodbye for now.",
        didNotUnderstand: "Sorry, I didn't catch that",
        questions: [
            "What would you like to hear?",
            "How can I help?",
            "What can I help you with?",
            "What can I tell you?"
        ]
    },
    positionalContent: {
        followup: "Would you like to hear the headlines again, or more headlines?",
        articleBy: "This article is written by ",
        timeToReadPref: " and it will take roughly ",
        timeToReadSuff: " minutes to read."
    },
    acknowledgement: [
        'Sure, ',
        'Certainly, ',
        'Absolutely, ',
        'No problem, '
    ],
    podcasts: {
        intro: 'Our most popular podcasts this week are: Football Weekly, Science Weekly, Chips with Everything, ' +
        'and Close Encounters. I’ve sent you the list of podcasts to your Alexa app. ' +
        'I can tell you the latest available or play you a specific one. What would you like to hear?',
        notfound: 'Sorry, I could not find any podcast.',
        followup1: "Would you like me to play the first podcast?",
        followup2: "Would you like me to play the first or second podcast?",
        followup3: "Would you like me to play the first, second or third podcast or would you like more podcasts?",
    }
};

const sound = {
    transition: "<break time='1s'/>",
    break: "<break strength='medium'/>",
    strongBreak: "<break strength='x-strong'/>"
};

exports.speech = speech;
exports.sound = sound;

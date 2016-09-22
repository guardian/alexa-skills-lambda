const speech = {
    launch: {
        welcome_1: `Welcome to the Guardian! 
        You can ask me for news, reviews, sport and podcasts.
        If you need help, just ask. `,
        welcome_2: `Welcome back! 
        You can ask me for news, reviews, sport and podcasts. 
        The Guardian skill is very new, and we would love your feedback. Please send your thoughts and ideas to, alexa.feedback @ the guardian.com. `,
        welcome_3: `Would you like to hear news, reviews, sport or podcasts?`,
        welcome_long_time: `Welcome back to the Guardian! You can ask me for news, reviews, sport and podcasts. `,
        reprompt: "Sorry, what would you like to hear?"
    },
    news: {
        explainer: `I can give you the headlines, or the latest news or opinions for a topic. I've just sent the list of topics to your Alexa app. `,
        reprompt: "Sorry, what headlines would you like to hear?"
    },
    sport: {
        explainer: "I can give you the headlines or opinions for football, cricket, rugby, tennis, formula one, cycling, boxing, golf or US sports. I've just sent the list of topics to your Alexa app. ",
        reprompt: "Sorry, what sport would you like the headlines for?"
    },
    headlines: {
        more: "the next three stories are: ",
        headlinesNotFound: "Sorry, I cannot find you any headlines at the moment. ",
        topicNotFound: "Sorry - I don't have any news on %s. Shall I send a list of topics to your Alexa app?",
        followup1: "Would you like me to read the first story?",
        followup2: "Would you like me to read the first or second story?",
        followup3: "Would you like me to read the first, second or third story? or would you like to hear more?",
        question: "Would you like me to read the first, second or third story? or would you like to hear more?",
        reprompt: "Sorry, would you like me to read the first, second or third story? or would you like to hear more?"
    },
    opinions: {
        more: "the next three opinion stories are: ",
        notFound: "Sorry - I can't find you any opinion stories at the moment. ",
        topicNotFound: "Sorry - I don’t have any opinion stories on %s. Shall I send a list of topics to your Alexa app?",
        followup1: "Would you like me to read the first story?",
        followup2: "Would you like me to read the first story, the second story?",
        followup3: "Would you like me to read the first, second or third story? or would you like to hear more?",
        reprompt: "Sorry, would you like me to read the first, second or third story? or would you like to hear more?"

    },
    reviews: {
        latest: "the latest {0} reviews are:",
        specifc: "the latest reviews for {0} are:",
        more: "the next three reviews are:",
        question: "Would you like me to read the first, second or third review? or would you like to hear more?",
        notfound: "Sorry, I could not find a review for you. Is there anything else I can help with?",
        clarifyType: "Is it a restaurant, book, film, or music review you're after?",
        explainer: "I have reviews for films, books, music and restaurants. I've just sent the list of review types to your Alexa app. ",
        followup1: "Would you like me to read the first review?",
        followup2: "Would you like me to read the first or second review?",
        followup3: "Would you like me to read the first, second or third review? or would you like to hear more?",
        reprompt: "Sorry, would you like me to read the first, second or third review? or would you like to hear more?"
    },
    help: {
        explainer: `Happy to help! Firstly, I can keep you up-to-date with the top stories of the day, and for the topics
            you're interested in. Simply, ask for the headlines for your topic, and from there, I will read three headlines.
            You can choose to hear the whole story or hear more.
            I can give you the latest reviews for films and other topics.
            Simply ask me for the latest reviews.
            Finally, I can play our most popular weekly podcasts.
            Simply ask me for the latest podcasts, and again, I will give you three options to choose from.
            You can ask me to play your favourite, by telling me the name of it.
            If you have any thoughts or ideas, please send them to, alexa.feedback @ the guardian.com.
            Now, go ahead, and ask me something. `,
        reprompt: "Sorry, what would you like to do?"
    },
    core: {
        stop: [
            "Goodbye",
            "Goodbye for now",
            "See you later"
        ],
        cancel: "OK - I'll cancel that. What would you like to hear next?",
        didNotUnderstand: "Sorry, I didn't catch that",
        questions: [
            "What would you like to hear?",
            "How can I help?",
            "What can I help you with?",
            "What can I tell you?"
        ]
    },
    positionalContent: {
        followup: "Would you like to hear them again, or hear more headlines?",
        articleBy: "This article is written by ",
        timeToReadPref: " and it will take roughly ",
        timeToReadSuff: " minutes to read."
    },
    acknowledgement: [
        'Sure, ',
        'Certainly, ',
        'Absolutely, ',
        'No problem, ',
        'OK, ',
        'Very well, ',
        'Right, '
    ],
    podcasts: {
        intro: 'Our most popular podcasts this week are: Football Weekly, Science Weekly, Chips with Everything, ' +
        'and Close Encounters. I’ve sent you the list of podcasts to your Alexa app. ' +
        'I can tell you the latest available or play you a specific one. What would you like to hear?',
        notfound: 'Sorry, I could not find that podcast. Which podcast would you like me to play?',
        followup1: "Would you like me to play the first podcast?",
        followup2: "Would you like me to play the first or second podcast?",
        followup3: "Would you like me to play the first, second or third podcast? or would you like to hear more?"
    }
};

const sound = {
    transition: "<break time='1s'/>",
    break: "<break strength='medium'/>",
    strongBreak: "<break strength='x-strong'/>",
    intro: "<audio src='https://s3.amazonaws.com/alexa-config/audio/alexa-intro.mp3'/> "
};

exports.speech = speech;
exports.sound = sound;

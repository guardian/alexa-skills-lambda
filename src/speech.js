const speech = {
  launch: {
    welcome_1: `Welcome to the Guardian.
        You can ask for news, reviews, sport and podcasts.
        If you need help, just say help. `,
    welcome_2: `Welcome back. 
        You can ask for news, reviews, sport and podcasts. 
        The Guardian skill is new, and we would love your feedback. Please send your thoughts and ideas to, alexa.feedback @ the guardian.com. `,
    welcome_3: `Would you like to hear news, reviews, sport or podcasts?`,
    welcome_long_time: `Welcome back to the Guardian. You can ask for news, reviews, sport and podcasts. `,
    reprompt: 'What would you like to hear?'
  },
  news: {
    explainer: `You can get the headlines, latest news or opinions for a topic. A list of topics has been sent to your Alexa app. `,
    reprompt: 'What headlines would you like to hear?'
  },
  sport: {
    explainer: "You can get the headlines or opinions for football, cricket, rugby, tennis, formula one, cycling, boxing, golf or US sports. The list of sports has been sent to your Alexa app. ",
    reprompt: 'What sport headlines would you like to hear?'
  },
  headlines: {
    more: 'the next three stories are: ',
    headlinesNotFound: 'Sorry, the Guardian cannot find you any headlines at the moment. ', // really unhappy about this, but can't find a better solution at the moment
    topicNotFound: "Sorry - there is no news on %s. Would you like a topics list sent to your Alexa app?",
    followup1: 'Would you like to hear the first story?',
    followup2: 'Would you like to hear the first or second story?',
    followup3: 'Would you like to hear the first, second or third story? Or would you like to hear more?',
    question: 'Would you like to hear the first, second or third story? Or would you like to hear more?',
    reprompt: 'Sorry, would you hear the first, second or third story? Or would you like more headlines?'
  },
  opinions: {
    more: 'the next three opinion stories are: ',
    notFound: "Sorry - I can't find you any opinion stories at the moment. ",
    topicNotFound: "Sorry - there aren't any opinion stories on %s. Would you like a list of topics sent to your Alexa app?",
    followup1: 'Would you like to hear the first story?',
    followup2: 'Would you like to hear the first story, the second story?',
    followup3: 'Would you like to hear the first, second or third story? or would you like to hear more?',
    reprompt: 'Sorry, would you like the first, second or third story? Or would you like more opinion stories?'

  },
  reviews: {
    latest: 'the latest {0} reviews are:',
    specifc: 'the latest reviews for {0} are:',
    more: 'the next three reviews are:',
    question: 'Would you like to hear the first, second or third review? or would you like to hear more?',
    notfound: "Sorry, the Guardian couldn't find a review for you. Is there anything else you'd like to hear about?",
    clarifyType: "Is it a restaurant, book, film, or music review you're after?",
    explainer: 'You can hear reviews for films, books, music and restaurants. A list of review categories has been sent to your Alexa app. ',
    followup1: 'Would you like to hear the first review?',
    followup2: 'Would you like to hear the first or second review?',
    followup3: 'Would you like to hear the first, second or third review? or would you like to hear more?',
    reprompt: 'Sorry, would you like the first, second or third review? or would you like more reviews?'
  },
  help: {
    explainer: `You can keep up-to-date with the top stories of the day, and for topics you're interested in. Ask for the headlines for a topic and you'll hear three headlines for that topic. You can then choose to hear the whole story, or get more headlines. 
    
    You can also get reviews for films, restaurants, books and music. Simply ask for the latest reviews. 
    
    You can also listen to podcasts. Simply ask for the latest podcasts and you hear the most recent three. You can ask me to play your favourite, by telling me the name of it. 
    
    If you have any thoughts, ideas or feedback, please email alexa.feedback @ the guardian.com. 
    
    Now, go ahead, and ask something. `,
    reprompt: 'Sorry, what would you like to do?'
  },
  core: {
    stop: [
      'Goodbye',
      'Goodbye for now',
      'See you later'
    ],
    cancel: 'OK - cancelled. What would you like to hear next?',
    didNotUnderstand: "Sorry, could you repeat that?",
    questions: [
      'What would you like to hear?',
      'What do you need help with?',
    ]
  },
  positionalContent: {
    followup: 'Would you like to hear them again, or hear more headlines?',
    articleBy: 'This article is written by ',
    timeToReadPref: ' and it will take roughly ',
    timeToReadSuff: ' minutes to read.'
  },
  acknowledgement: [
    'Sure, ',
    'Certainly, ',
    'Absolutely, ',
    'No problem, ',
    'OK, ',
    'Right, '
  ],
  podcasts: {
    intro: 'The most popular podcasts this week are: Football Weekly, Science Weekly, Chips with Everything, ' +
        'and Close Encounters. A list of Guardian podcasts has been sent to your Alexa app. ' +
        'Would you like to hear latest available or play a specific one?',
    notfound: "Sorry, the Guardian couldn't find that podcast. Which podcast would you like to play?",
    followup1: 'Would you like to play the first podcast?',
    followup2: 'Would you like to play the first or second podcast?',
    followup3: 'Would you like to play the first, second or third podcast? or would you like more podcasts?',
    reprompt: 'Sorry, would you like the first, second or third podcast? or would you like to hear more?'
  }
}

const sound = {
  transition: "<break time='1s'/>",
  break: "<break strength='medium'/>",
  strongBreak: "<break strength='x-strong'/>",
  intro: [
    "<audio src='https://s3.amazonaws.com/alexa-config/audio/alexa_intro_1.mp3'/> ",
    "<audio src='https://s3.amazonaws.com/alexa-config/audio/alexa_intro_2.mp3'/> ",
    "<audio src='https://s3.amazonaws.com/alexa-config/audio/alexa_intro_3.mp3'/> ",
    "<audio src='https://s3.amazonaws.com/alexa-config/audio/alexa_intro_4.mp3'/> "
  ]
}

exports.speech = speech
exports.sound = sound

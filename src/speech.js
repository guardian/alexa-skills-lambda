const speech = {
	launch: {
		welcome: 'Welcome to The Guardian. You can ask for news, opinions, reviews and sport.',
		reprompt: 'What would you like to hear?'
	},
	headlines: {
		top: 'the top three stories are: ',
		more: 'the next three stories are: ',
		notfound: 'Sorry, I could not find you any headlines.',
		question: 'Would you like me to read the first, second or third story or would you like more headlines?',
		reprompt: 'Sorry, Would you like me to read the first, second or third story or would you like more headlines?'
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
		cancel: 'Goodbye for now.',
		didNotUnderstand: 'Sorry, I didn\'t catch that'
	},
	positionalContent: {
		followup: 'Would you like to hear the headlines again, or more headlines?',
		articleBy: 'This article is written by ',
		timeToReadPref: ' and it will take roughly ',
		timeToReadSuff: ' minutes to read'
	},
	acknowledgement: randomMessage([
		'Sure, ',
		'Certainly, ',
		'Absolutely, '
	])
};

const sound = {
	transition: '<break time="1s"/>',
	break: '<break strength="medium"/>'
};

function randomMessage(messages) {
	return messages[Math.floor(Math.random()*messages.length)]
}

exports.speech = speech;
exports.sound = sound;

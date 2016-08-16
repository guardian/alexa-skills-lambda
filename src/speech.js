const speech = {
	launch: {
		welcome: 'Welcome to The Guardian. You can ask for news, opinions, reviews and sport.',
		reprompt: 'What would you like to hear?'
	},
	headlines: {
		top: 'the top three stories are: ',
		notfound: 'Sorry, I could not find you any headlines.',
		reprompt: 'Would you like me to read the first, second or third story?'
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

const sound = {
	transition: '<break time="1s"/>',
	break: '<break strength="medium"/>'
};

function randomMessage(messages) {
	return messages[Math.floor(Math.random()*messages.length)]
}

exports.speech = speech;
exports.sound = sound;

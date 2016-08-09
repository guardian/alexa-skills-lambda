import AWS from 'aws-sdk';

export function handler (events, context, callback) {
	Promise.resolve()
	.then(() => handleEvents({events, aws: AWS}))
	.then(result => callback(null, result))
	.catch(callback);
}

export default function handleEvents ({events, aws}) {
	return new Promise((resolve, reject) => {
		if (events.ok) {
			resolve({
				ok: true,
				version: aws.version
			});
		} else {
			reject(new Error('Not OK'));
		}
	});
}

const tap = require('tap');

const headLinesJson = require('./fixtures/getHeadlines.json');
const opinionJson = require('./fixtures/getOpinionOn.json');
const reviewJson = require('./fixtures/getReview.json');

var lambda = require('../src/index').handler;

tap.test('Test get headlines intent', test => {
	test.plan(2);

	lambda(
		headLinesJson, {
			succeed: function (response) {
				test.equal(response.sessionAttributes.lastIntent, "GetHeadlines");
				test.equal(response.sessionAttributes.positionalContent.length, 3);
				test.end()
			},
			fail: function (error) {
				test.fail()
			}
		});
}
);


tap.test('Test the get opinion intent', test => {
	test.plan(2);

	lambda(
		opinionJson, {
			succeed: function (response) {
				test.ok(response.response.outputSpeech.ssml);
				test.equal(response.sessionAttributes.lastIntent, "GetOpinion");
				test.end()
			},
			fail: function (error) {
				test.fail()
			}
		});
	}
);

tap.test('Test the get {type} review on {something} intent', test => {
		test.plan(2);

		lambda(
			reviewJson, {
				succeed: function (response) {
					test.ok(response.response.outputSpeech.ssml);
					test.match(response, {
						sessionAttributes: {
						 	lastIntent: 'GetReview',
							reviewsRead: 1,
							lastReviewType: 'book',
							lastSearchTerm: 'houellebecq'
						}
					});
					test.end()
				},
				fail: function (error) {
					test.fail()
				}
			});
	}
);

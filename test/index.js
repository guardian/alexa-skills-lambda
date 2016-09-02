const tap = require('tap');

const headLinesJson = require('./fixtures/getHeadlines.json');
const headLineSectionJson = require('./fixtures/getHeadlinesForSection.json');
const opinionJson = require('./fixtures/getOpinionOn.json');
const inexistentOpinionJson = require('./fixtures/getInexistentOpinion.json');
const latestReviewsJson = require('./fixtures/getLatestReviews.json');
const posAfterHeadJson = require('./fixtures/positionalContentAfterHeadlines.json');
const moreAfterHeadlines = require('./fixtures/moreAfterHeadlines.json');
const moreAfterTechHeadlines = require('./fixtures/moreAfterTechHeadlines.json');
const moreAfterBrexitOpinion = require('./fixtures/moreAfterBrexitOpinions.json');
const localizedHeadlines = require('./fixtures/getLocalizedHeadlines.json');
const moreAfterLatestReviews = require('./fixtures/moreAfterLatestReviews.json');
const reviewTypeAfterLatestReviews = require('./fixtures/reviewTypeAfterLatestReviews.json');

const speech = require('../src/speech').speech;

var lambda = require('../src/index').handler;

tap.test('Test get headlines intent', test => {
    test.plan(3);
    lambda(
        headLinesJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test localized headlines intent', test => {
        test.plan(3);
        lambda(
            localizedHeadlines, {
                succeed: function (response) {
                    console.log(response);
                    test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
                    test.equal(response.sessionAttributes.positionalContent.length, 3);
                    test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                    test.end()
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test get headlines intent with a specific section', test => {
    test.plan(4);
    lambda(
        headLineSectionJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.equal(response.sessionAttributes.sectionType, 'politics');
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test the get opinion on Brexit intent', test => {
    test.plan(5);
    lambda(
        opinionJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                test.ok(response.response.outputSpeech.ssml.indexOf('Brexit') != -1);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.equal(response.sessionAttributes.searchTerm, 'Brexit');
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test more intent after Brexit opinion', test => {
        test.plan(4);
        lambda(
            moreAfterBrexitOpinion, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf("the next 3 brexit stories are") != -1);
                    test.equal(response.sessionAttributes.moreOffset, 3);
                    test.equal(response.sessionAttributes.searchTerm, 'brexit');
                    test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test opinion intent with a search item that does not return any result', test => {
        test.plan(2);
        lambda(
            inexistentOpinionJson, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf(speech.opinions.notfound) != -1);
                    test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test get latest reviews intent', test => {
    test.plan(3);
    lambda(
        latestReviewsJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetLatestReviewsIntent");
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test get more reviews after latest reviews intent', test => {
    test.plan(3);
    lambda(
        moreAfterLatestReviews, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.moreOffset, 3);
                test.equal(response.sessionAttributes.reviewType, 'film');
                test.equal(response.sessionAttributes.lastIntent, "GetLatestReviewsIntent");
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test review_type after get latest reviews intent', test => {
    test.plan(3);
    lambda(
        reviewTypeAfterLatestReviews, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetLatestReviewsIntent");
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test numeric position after headlines', test => {
        test.plan(3);
        lambda(
            posAfterHeadJson, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf("Two former health ministers") != -1);
                    test.ok(response.response.outputSpeech.ssml.indexOf("written by") != -1);
                    test.ok(response.response.outputSpeech.ssml.indexOf("minutes to read") != -1);
                    test.end()
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test more intent after headlines', test => {
        test.plan(2);
        lambda(
            moreAfterHeadlines, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf("the next three stories are") != -1);
                    test.equal(response.sessionAttributes.moreOffset, 6);
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test more intent after tech headlines', test => {
        test.plan(2);
        lambda(
            moreAfterTechHeadlines, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf("the next 3 technology stories are") != -1);
                    test.equal(response.sessionAttributes.moreOffset, 3);
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

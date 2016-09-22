const tap = require('tap');

const headLinesJson = require('./fixtures/getHeadlines.json');
const headLineTopicJson = require('./fixtures/getHeadlinesForTopic.json');
const topicAfterNewsIntro = require('./fixtures/topicAfterNewsIntro.json');
const opinionJson = require('./fixtures/getOpinionOn.json');
const localizedOpinion = require('./fixtures/getLocalizedOpinion.json');
const inexistentOpinionJson = require('./fixtures/getInexistentOpinion.json');
const latestReviewsJson = require('./fixtures/getLatestReviews.json');
const posAfterHeadJson = require('./fixtures/positionalContentAfterHeadlines.json');
const moreAfterHeadlines = require('./fixtures/moreAfterHeadlines.json');
const moreAfterTechHeadlines = require('./fixtures/moreAfterTechHeadlines.json');
const moreAfterSportOpinion = require('./fixtures/moreAfterSportOpinions.json');
const localizedHeadlines = require('./fixtures/getLocalizedHeadlines.json');
const moreAfterLatestReviews = require('./fixtures/moreAfterLatestReviews.json');
const reviewTypeAfterLatestReviews = require('./fixtures/reviewTypeAfterLatestReviews.json');
const getFootballWeeklyPodcast = require('./fixtures/getFootballWeeklyPodcast.json');
const yesAfterGetPodcast = require('./fixtures/yesAfterGetPodcastIntent.json');
const latestPodcast = require('./fixtures/latestPodcast.json');
const moreAfterLatestPodcast = require('./fixtures/moreAfterLatestPodcast.json');
const posAfterLatestPodcast = require('./fixtures/posAfterLatestPodcast.json');
const repeat = require('./fixtures/repeat.json');
const topicAfterLaunch = require('./fixtures/topicAfterLaunch.json');

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

tap.test('Test topic after news intro', test => {
        test.plan(4);
        lambda(
            topicAfterNewsIntro, {
                succeed: function (response) {
                    test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
                    test.equal(response.sessionAttributes.positionalContent.length, 3);
                    test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                    test.equal(response.sessionAttributes.topic, 'politics');
                    test.end()
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test get headlines intent with a specific topic', test => {
    test.plan(4);
    lambda(
        headLineTopicJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.equal(response.sessionAttributes.topic, 'politics');
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test the get opinion on sport intent', test => {
        test.plan(3);
        lambda(
            localizedOpinion, {
                succeed: function (response) {
                    test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                    test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                    test.equal(response.sessionAttributes.positionalContent.length, 3);
                    test.end()
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test the get opinion on sport intent', test => {
    test.plan(5);
    lambda(
        opinionJson, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                test.ok(response.response.outputSpeech.ssml.indexOf('sport') != -1);
                test.ok(response.response.outputSpeech.ssml.indexOf('break time') != -1);
                test.equal(response.sessionAttributes.topic, 'sport');
                test.equal(response.sessionAttributes.positionalContent.length, 3);
                test.end()
            },
            fail: function (error) {
                test.fail()
            }
        });
    }
);

tap.test('Test more intent after sport opinion', test => {
        test.plan(4);
        lambda(
            moreAfterSportOpinion, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf("the next 3 sport opinions are") != -1);
                    test.equal(response.sessionAttributes.moreOffset, 3);
                    test.equal(response.sessionAttributes.topic, 'sport');
                    test.equal(response.sessionAttributes.lastIntent, "GetOpinionIntent");
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test opinion intent with a topic that does not return any result', test => {
        test.plan(2);
        lambda(
            inexistentOpinionJson, {
                succeed: function (response) {
                    test.ok(response.response.outputSpeech.ssml.indexOf(speech.opinions.topicNotFound.slice(0,15)) != -1);
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

tap.test('Test entity after get latest reviews intent', test => {
    test.plan(4);
    lambda(
        reviewTypeAfterLatestReviews, {
            succeed: function (response) {
                test.equal(response.sessionAttributes.lastIntent, "GetLatestReviewsIntent");
                test.equal(response.sessionAttributes.reviewType, "film");
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

tap.test('Test entity after launch', test => {
    test.plan(4);
    lambda(
      topicAfterLaunch, {
        succeed: function (response) {
          test.equal(response.sessionAttributes.lastIntent, "GetHeadlinesIntent");
          test.equal(response.sessionAttributes.topic, "film");
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

tap.test('Test get football weekly podcast', test => {
        test.plan(2);
        lambda(
            getFootballWeeklyPodcast, {
                succeed: function (response) {
                    test.equal(response.sessionAttributes.lastIntent, 'GetPodcastIntent');
                    test.equal(response.sessionAttributes.podcastUrl.split('.').pop(), 'mp3');
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test yes after a GetPodcastIntent', test => {
        test.plan(1);
        lambda(
            yesAfterGetPodcast, {
                succeed: function (response) {
                    test.equal(response.response.directives[0].audioItem.stream.url, 'https://audio.guim.co.uk/2016/09/05-45824-FW-sept05-2016_mixdown.mp3')
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test LatestPodcastIntent', test => {
        test.plan(2);
        lambda(
            latestPodcast, {
                succeed: function (response) {
                    test.equal(response.sessionAttributes.lastIntent, "LatestPodcastIntent");
                    test.equal(response.sessionAttributes.positionalContent.length, 3);
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test MoreIntent after LatestPodcastIntent', test => {
        test.plan(4);
        lambda(
            moreAfterLatestPodcast, {
                succeed: function (response) {
                    test.equal(response.sessionAttributes.lastIntent, "LatestPodcastIntent");
                    test.equal(response.sessionAttributes.positionalContent.length, 3);
                    test.ok(response.response.outputSpeech.ssml.indexOf("the next 3 podcasts are") != -1);
                    test.equal(response.sessionAttributes.moreOffset, 3);
                    test.end();
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test numeric position after latestPodcast', test => {
        test.plan(1);
        lambda(
            posAfterLatestPodcast, {
                succeed: function (response) {
                  test.equal(response.response.directives[0].audioItem.stream.url, 'https://audio.guim.co.uk/2016/09/05-33499-gnl.books.20160903.st.simonrussellbeale.mp3')
                    test.end()
                },
                fail: function (error) {
                    test.fail()
                }
            });
    }
);

tap.test('Test repeat intent', test => {
        test.plan(3);
        lambda(
            repeat, {
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

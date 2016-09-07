const config = require("../tmp/config.json");
const helpers = require('./helpers');

const CAPI_API_KEY = config.capi_key;
const BASE_URL = "https://content.guardianapis.com/";

exports.newsQuery = (offset, locale, topic) => {
    const props = getQueryProperties(locale, topic);
    if (props !== null) {
        return BASE_URL + props.path + "?"
            + "&api-key=" + CAPI_API_KEY
            + "&show-fields=byline,headline"
            + "&tags=type/article,-tone/minutebyminute"
            + (props.toneNews ? ",tone/news" : "")
            + (props.editorsPicks ? "&show-editors-picks=true" : getPageParams(offset))
    } else {
        console.log(`newsQuery: failed to find properties for ${locale} / ${topic}`);
        return null;
    }
};

exports.opinionQuery = (offset, locale, topic) => {
    const getProps = () => {
        if (topic) {
            return getQueryProperties(locale, topic);
        } else {
            //Top-level comment by edition
            return {
                path: localeToEdition(locale) + "/commentisfree"
            }
        }
    };

    const props = getProps();
    if (props !== null) {
        return BASE_URL + props.path + "?"
            + "&api-key=" + CAPI_API_KEY
            + "&show-fields=byline,headline"
            + "&tags=type/article,-tone/minutebyminute"
            + ",tone/comment"
            + getPageParams(offset);
    } else {
        console.log(`opinionQuery: failed to find properties for ${locale} / ${topic}`);
        return null;
    }
};

exports.reviewQuery = (offset, reviewType) => {
    const tagType = reviewTypeToTag(reviewType);
    if (tagType !== null) {
        return BASE_URL + "search"
            + "?api-key=" + CAPI_API_KEY
            + getPageParams(offset)
            + "&tag=tone/reviews,"+ tagType
            + "&show-fields=standfirst,byline,headline&show-blocks=all";
    } else {
        console.log(`reviewQuery: invalid review_type: ${reviewType}`);
        return null;
    }
};

const localeToEdition = (locale) => {
    switch (locale) {
        case 'en-US': return 'us';
        case 'en-GB': return 'uk';
        case 'en-AU': return 'au';
        default: return 'uk';
    }
};

const reviewTypeToTag = (reviewType) => {
    switch (reviewType) {
        case 'film':
        case 'films':
            return 'film/film';
            break;
        case 'restaurant':
        case 'restaurants':
            return 'lifeandstyle/restaurants';
            break;
        case 'book':
        case 'books':
            return 'books/books';
            break;
        case 'music':
            return 'music/music';
            break;
        default:
            return null
    }
};

const getQueryProperties = (locale, topic) => {
    const edition = localeToEdition(locale);
    const props = queryProperties(topic  ? topic : edition);
    if (props !== null) {
        if (props[edition]) return props[edition];
        else return props.default;
    } else return null;
};

const getPageParams = (offset) => {
    return "&page-size="+ helpers.pageSize +"&page="+ ((offset / helpers.pageSize) + 1)
};

/**
 * Get the properties object for a topic. This defines how to build the capi query.
 * The topics here should match the set of topics defined in the Amazon Echo custom slot type 'topic'.
 * Each properties object can contain multiple objects for different editions, but it must have a 'default'
 * object.
 */
const queryProperties = (topic) => {
    switch (topic.toLowerCase()) {
        case "united kingdom":
        case "uk": return {
            default: {
                toneNews: true,       //tags=tone/news
                editorsPicks: true,   //show-editors-picks
                path: "uk"
            }
        };
        case "united states":
        case "usa":
        case "us": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "us"
            }
        };
        case "australia":
        case "au": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "au"
            }
        };
        case "international": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "international"
            }
        };
        case "world": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "world"
            }
        };
        case "politics": return {
            default: {
                //UK politics
                toneNews: true,
                editorsPicks: true,
                path: "politics"
            },
            us: {
                toneNews: true,
                editorsPicks: false,
                path: "us-news/us-politics"
            }
        };
        case "sport": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/sport"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/sport"
            },
            au: {
                toneNews: true,
                editorsPicks: true,
                path: "au/sport"
            }
        };
        case "us sports":
        case "us sport": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "us/sport"
            }
        };
        case "football":
        case "soccer": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "football"
            }
        };
        case "cricket": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/cricket"
            }
        };
        case "rugby":
        case "rugby union": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/rugby-union"
            }
        };
        case "formula 1":
        case "f1": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/formulaone"
            }
        };
        case "tennis": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/tennis"
            }
        };
        case "golf": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/golf"
            }
        };
        case "cycling": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/cycling"
            }
        };
        case "boxing": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/boxing"
            }
        };
        case "horse racing": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/horse-racing"
            }
        };
        case "rugby league": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "sport/rugbyleague"
            }
        };
        case "film":
        case "movies": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/film"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/film"
            },
            au: {
                toneNews: true,
                editorsPicks: true,
                path: "au/film"
            }
        };
        case "tv":
        case "radio":
        case "tv and radio": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "tv-and-radio"
            }
        };
        case "music": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "music"
            }
        };
        case "games": return {
            default: {
                toneNews: false,
                editorsPicks: false,
                path: "technology/games"
            }
        };
        case "books": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "books"
            }
        };
        case "art": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "artanddesign"
            }
        };
        case "stage": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "stage"
            }
        };
        case "business": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/business"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/business"
            },
            au: {
                toneNews: true,
                editorsPicks: true,
                path: "au/business"
            }
        };
        case "life and style":
        case "lifestyle": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "uk/lifeandstyle"
            },
            us: {
                toneNews: false,
                editorsPicks: true,
                path: "us/lifeandstyle"
            },
            au: {
                toneNews: false,
                editorsPicks: true,
                path: "au/lifeandstyle"
            }
        };
        case "food": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/food-and-drink"
            }
        };
        case "health":
        case "fitness":
        case "wellbeing": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/health-and-wellbeing"
            }
        };
        case "sex":
        case "love": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/love-and-sex"
            }
        };
        case "family": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/family"
            }
        };
        case "women": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/women"
            }
        };
        case "garden":
        case "home": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "lifeandstyle/home-and-garden"
            }
        };
        case "fashion": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "fashion"
            }
        };
        case "environment": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/environment"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/environment"
            },
            au: {
                toneNews: true,
                editorsPicks: true,
                path: "au/environment"
            }
        };
        case "climate change": return {
            default: {
                toneNews: true,
                editorsPicks: false,
                path: "environment/climate-change"
            }
        };
        case "technology":
        case "tech": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/technology"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/technology"
            }
        };
        case "travel": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "uk/travel"
            },
            us: {
                toneNews: false,
                editorsPicks: true,
                path: "us/travel"
            },
            au: {
                toneNews: false,
                editorsPicks: true,
                path: "au/travel"
            }
        };
        case "culture": return {
            default: {
                toneNews: false,
                editorsPicks: true,
                path: "uk/culture"
            },
            us: {
                toneNews: false,
                editorsPicks: true,
                path: "us/culture"
            },
            au: {
                toneNews: false,
                editorsPicks: true,
                path: "au/culture"
            }
        };
        case "science": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "science"
            }
        };
        case "money": return {
            default: {
                toneNews: true,
                editorsPicks: true,
                path: "uk/money"
            },
            us: {
                toneNews: true,
                editorsPicks: true,
                path: "us/money"
            },
            au: {
                toneNews: true,
                editorsPicks: true,
                path: "au/money"
            }
        };

        default: return null;
    }
};

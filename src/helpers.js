const config = require("../tmp/config.json");
const CAPI_API_KEY = config.capi_key;

exports.capiQuery = function(endpoint, filter, q) {
    var capiHost = 'http://content.guardianapis.com/';
    var key = '&api-key=' + CAPI_API_KEY;
    var query = q ? '&q=' + q : '';
    return capiHost + endpoint + '?' + filter + query + key;
};

exports.randomMessage = function(messages) {
    return messages[Math.floor(Math.random()*messages.length)]
};

const sectionsWithoutEditions = {
    politics: true,
    football: true,
    world: true,
    fashion: true
};

exports.getSectionPath = (section, edition) => {
    if (section == null) return edition;
    if (sectionsWithoutEditions[section]) return section;
    return edition +"/"+ section;
};

const PAGE_SIZE = 3;
exports.pageSize = PAGE_SIZE;

exports.getMoreOffset = (isNewIntent, currentMoreOffset) => {
  if (typeof currentMoreOffset !== 'undefined') {
    if (isNewIntent) return 0;
    else return currentMoreOffset + PAGE_SIZE;
  } else return 0;
};

exports.localizeEdition = (locale) => {
    switch (locale) {
        case 'en-US': return 'us';
        case 'en-GB': return 'uk';
        case 'en-AU': return 'au';
        default: return 'uk';
    }
};


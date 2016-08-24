var config = require("../tmp/config.json");
var CAPI_API_KEY = config.capi_key;

exports.capiQuery = function(endpoint, filter, q) {
    var capiHost = 'http://content.guardianapis.com/';
    var key = '&api-key=' + CAPI_API_KEY;
    var query = q ? '&q=' + q : '';
    var fullQuery = capiHost + endpoint + '?' + filter + query + key;
    return fullQuery
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
}


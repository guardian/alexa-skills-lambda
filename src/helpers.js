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

#!/usr/bin/env node

var AWS = require('aws-sdk');

if( typeof process.env.TEAMCITY_BRANCH == "undefined"){
    // Retreive the local CAPI credentials if not on teamcity
    var credentials = new AWS.SharedIniFileCredentials({profile: 'capi'});
    AWS.config.credentials = credentials;
}

var s3 = new AWS.S3();

s3.getObject({
    Bucket: 'alexa-config',
    Key: 'config.json'
}, function (err, data) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log(data.Body.toString('utf8'));
        process.exit(0);
    }
});

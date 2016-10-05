const AWS = require('aws-sdk')

module.exports = UserStore

const tables = {
  'CODE': 'alexa-users-dynamo-CODE-alexaUsersTable-1SCEYY228JBRS',
  'PROD': 'alexa-users-dynamo-PROD-alexaUsersTable-UOUWG0VXB6J2'
}

function UserStore (stage) {
  this._tableName = tables[stage]
  this._docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'})
};

UserStore.prototype.getUser = function (id, callback) {
  this._docClient.get({
    TableName: this._tableName,
    Key: {
      'userId': id
    }
  }, callback)
}

UserStore.prototype.addUser = function (id, timestamp, callback) {
  this._docClient.put({
    TableName: this._tableName,
    Item: {
      'userId': id,
      'visits': 1,
      'lastVisit': timestamp
    }
  }, callback)
}

UserStore.prototype.setVisitCount = function (id, timestamp, count, callback) {
  this._docClient.update({
    TableName: this._tableName,
    Key: {
      'userId': id
    },
    UpdateExpression: 'set visits = :v, lastVisit = :l',
    ExpressionAttributeValues: {
      ':v': count,
      ':l': timestamp
    }
  }, callback)
}

UserStore.prototype.setAudio = function (id, url, title, offset, callback) {
  this._docClient.update({
    TableName: this._tableName,
    Key: {
      'userId': id
    },
    UpdateExpression: 'set podcastUrl = :u, podcastOffset = :o, podcastTitle = :t',
    ExpressionAttributeValues: {
      ':u': url,
      ':o': offset,
      ':t': title
    }
  }, callback)
}

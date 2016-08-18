
const passwordless = require('passwordless')
const MongoStore = require('passwordless-mongostore')
const mailer = require('./mailer')
const config = require('./config.json')

passwordless.init(new MongoStore(config.db.database))
passwordless.addDelivery((tokenToSend, uidToSend, recipient, callback) =>
mailer.send({
  text: `Welcome to GuriVR! enter to this url to login ${config.server.baseURL}/stories/?token=${tokenToSend}&uid=${uidToSend}`,
  attachment: {data: `Welcome to GuriVR! enter to <a href="${config.server.baseURL}/stories/?token=${tokenToSend}&uid=${uidToSend}">this url</a> to login`, alternative: true},
  from: config.email.sender,
  to: recipient,
  subject: '[GuriVR] login token'
}, callback))

module.exports = passwordless

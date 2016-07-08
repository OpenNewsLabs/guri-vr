
const passwordless = require('passwordless');
const MongoStore = require('passwordless-mongostore');
const mailer = require('./mailer');
const config = require('./config.json');

passwordless.init(new MongoStore(config.db.database));
passwordless.addDelivery((tokenToSend, uidToSend, recipient, callback) =>
mailer.send({
  text: `Welcome! enter to this url to login ${config.server.baseURL}/?token=${tokenToSend}&uid=${uidToSend}`,
  from: config.email.sender,
  to: recipient,
  subject: '[GuriVR] login token'
}, (err, msg) => {console.log(err, msg);callback(err)}));

module.exports = passwordless;

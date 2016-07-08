
const email = require('emailjs');
const config = require('./config.json');

const smtpServer = email.server.connect(config.email);

module.exports = smtpServer;

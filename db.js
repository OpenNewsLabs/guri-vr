
const config = require('./config.json')

module.exports = require('monk')(config.db.database)

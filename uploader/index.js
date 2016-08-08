
/**
 * Module dependencies
 */

const config = require('../config.json');

/**
 * Expose s3 if available, otherwise use local filesystem
 */

module.exports = !!config.s3.accessKeyId ? require('./s3') : require('./fs');

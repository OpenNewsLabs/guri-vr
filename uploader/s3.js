
/**
 * Module dependencies
 */

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('node-uuid');
const storyBuilder = require('../story-builder');
const config = require('../config.json');

/**
 * S3 configuration
 */

AWS.config.update({
  region: config.s3.region,
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey
});

var s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}});

/**
 * Upload a story to AWS S3
 */

exports.story = story => new Promise((resolve, reject) => {
  story.chapters = JSON.parse(story.body);
  const params = {Bucket: `${config.s3.bucket}/s`, ContentType: 'text/html', Key: `${story._id}.html`, Body: storyBuilder(story)};
  s3bucket.upload(params, function(err, data) {
    if(err) {
      return reject(new Error('Error writing to s3'));
    }
    return resolve(story);
  });
});

/**
 * Upload assets using s3
 */

exports.asset = multer({
  storage: multerS3({
    s3: s3bucket,
    bucket: config.s3.bucket,
    key(req, file, cb) {
      return cb(null, `${uuid.v4()}-${file.originalname}`);
    },
    acl: 'public-read'
  }),
  limits: {
    fileSize: 5000000, // 5mb
    files: 1
  }
});

/**
 * Delete file
 */

exports.deleteStory = id => new Promise((resolve, reject) =>
s3bucket.deleteObject(
  { Bucket: `${config.s3.bucket}`, Key: `s/${id}.html`, },
  (err, data) => err ? reject(new Error('Error deleting file on s3')) : resolve()
));

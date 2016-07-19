
/**
 * Module dependencies
 */

const fs = require('fs');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('node-uuid');
const config = require('./config.json');
const storyBuilder = require('./story-builder');

/**
 * S3 configuration
 */

const isS3 = !!config.s3.accessKeyId;
var s3bucket;

if (isS3) {
  AWS.config.update({
    region: config.s3.region,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  });

  s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}});
}

/**
 * Upload a story to AWS S3
 */

const storyS3 = story => new Promise((resolve, reject) => {
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
 * Upload a story to the filesystem
 * mainly for local testing
 */

const storyFS = story => new Promise((resolve, reject) => {
  story.chapters = JSON.parse(story.body);
  fs.writeFile(`${__dirname}/public/uploads/s/${story._id}.html`, storyBuilder(story),
  err => {
    if (err) {
      return reject(new Error('Error writing to filesystem'));
    } else {
      return resolve(story);
    }
  });
});

/**
 * Expose story upload based on config (s3 or fs)
 */

exports.story = isS3 ? storyS3 : storyFS;

/**
 * Upload assets using s3 or fs
 */

exports.asset = isS3 ? multer({
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
}) :
multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/public/uploads`);
    },
    filename: function (req, file, cb) {
      file.location = `${config.server.baseURL}/uploads/${file.originalname}`;
      cb(null, file.originalname);
    }
  })
});

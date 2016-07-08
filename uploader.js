
const AWS = require('aws-sdk');
const config = require('./config.json');
const storyBuilder = require('./story-builder');

AWS.config.update({
  region: config.s3.region,
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey
});


const s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}});

module.exports = story => {
  return new Promise((resolve, reject) => {
    story.chapters = JSON.parse(story.body);
    const params = {Bucket: `${config.s3.bucket}/s`, ContentType: 'text/html', Key: `${story._id}.html`, Body: storyBuilder(story)};
    s3bucket.upload(params, function(err, data) {
      if(err) {
        return reject(new Error('Error writing to s3'));
      }
      return resolve(story);
    });

  });
};

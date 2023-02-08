const AWS = require('aws-sdk');


const bucket = 'zentrixapp';
const region = 'us-east-2';
const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_S3_ACCESS_KEY_SECRET,
});


module.exports = {
  bucket,
  region,
  s3
};

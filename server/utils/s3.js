const { S3Client } = require('@aws-sdk/client-s3');


const bucket = 'zentrixapp';
const region = 'us-east-2';
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_S3_ACCESS_KEY_SECRET,
  }
});


module.exports = {
  bucket,
  region,
  s3
};

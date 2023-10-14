import AWS, { S3 } from 'aws-sdk';

const storage: AWS.S3 = new S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2',
});

export default storage;

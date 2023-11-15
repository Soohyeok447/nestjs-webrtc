import AWS, { S3 } from 'aws-sdk';

export const configureAWS = () => {
  AWS.config.logger = console;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-northeast-2',
  });
};

export const storage: AWS.S3 = new S3();

export const printAwsCredentials = () =>
  AWS.config.getCredentials((err, credentials) => {
    if (err) {
      console.error('AWS configuration update error:', err);
    } else {
      console.log('AWS configuration update complete \n\n');
      console.log('AWS Credential => ', credentials, '\n\n');
    }
  });

export const printAwsConfig = () => {
  console.log('AWS Configuration => ', AWS.config, '\n\n');
};

export const printS3BucketList = () =>
  storage.listBuckets((err, data) => {
    if (err) {
      console.error('aws s3 connection error occured: ', err);
    } else {
      console.log('aws s3 connected');
      console.log('bucket list:', data.Buckets, '\n');
    }
  });

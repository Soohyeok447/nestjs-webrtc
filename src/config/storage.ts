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
      console.log('[AWS Credential] AWS Credential => ', credentials, '\n\n');
    }
  });

export const printAwsConfigs = () => {
  console.log(
    '[AWS.config] AWS access key => ',
    AWS.config.credentials.accessKeyId,
  );
  console.log(
    '[AWS.config] AWS secret key => ',
    AWS.config.credentials.secretAccessKey,
  );
  console.log('[AWS.config] AWS region => ', AWS.config.region, '\n\n');
};

export const printS3BucketList = () =>
  storage.listBuckets((err, data) => {
    if (err) {
      console.log('aws s3 connection error occured: ', err);
    } else {
      console.log('aws s3 connected');
      console.log('data => ', data);
      console.log('data.buckets => ', data.Buckets, '\n');
    }
  });

export const printStorageInfo = () => {
  console.log('storage.config.credentials => ', storage.config.credentials);
};

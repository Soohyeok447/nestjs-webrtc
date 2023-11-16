import AWS, { S3 } from 'aws-sdk';

const s3: AWS.S3 = new S3();

export const configureAWS = () => {
  console.log('[configureAWS()]');

  console.log('[env] s3 bucket name - ', process.env.S3_BUCKET_NAME);
  console.log('[env] aws accesskey - ', process.env.AWS_ACCESS_KEY);
  console.log('[env] aws secretkey - ', process.env.AWS_SECRET_KEY);

  AWS.config.logger = console;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-northeast-2',
  });

  console.log('AWS.config.update() complete  \n\n');
};

export const storage = s3;

export const printAwsCredentials = () => {
  console.log('[printAwsCredentials()]');

  AWS.config.getCredentials((err, credentials) => {
    if (err) {
      console.error('AWS configuration update error:', err);
    } else {
      console.log('AWS configuration update complete \n\n');
      console.log('[AWS Credential] AWS Credential => ', credentials, '\n\n');
    }
  });
};

export const printAwsConfigs = () => {
  console.log('[printAwsConfigs()]');

  console.log(
    '[AWS.config] AWS access key => ',
    AWS.config.credentials.accessKeyId,
  );
  console.log(
    '[AWS.config] AWS secret key => ',
    AWS.config.credentials.secretAccessKey,
  );
  console.log('[AWS.config] AWS region => ', AWS.config.region);

  console.log('[AWS.config] config => ', AWS.config, '\n\n');
};

export const printS3BucketList = async () => {
  console.log('[printS3BucketList()]');

  storage.listBuckets((err, data) => {
    if (err) {
      console.log('aws s3 connection error occured: ', err);
    } else {
      console.log('aws s3 connected');
      console.log('data => ', data);
      console.log('data.buckets => ', data.Buckets, '\n');
    }
  });
};

export const printStorageInfo = async () => {
  console.log('[printStroageInfo()]');
  console.log('storage => ', storage, '\n');
  console.log('storage.config => ', storage.config, '\n');
  console.log(
    'storage.config.credentialProvider.providers => ',
    storage.config.credentialProvider.providers,
    '\n',
  );
  console.log(
    'storage.config.credentialProvider.resolve => ',
    storage.config.credentialProvider.resolve((err, credentials) => {
      console.log('err => ', err);
      console.log('credentials => ', credentials);
    }),
    '\n',
  );
  console.log(
    'storage.config.credentialProvider.resolvePromise => ',
    await storage.config.credentialProvider.resolvePromise(),
    '\n',
  );
  console.log(
    'storage.config.credentials => ',
    storage.config.credentials,
    '\n\n',
  );
};

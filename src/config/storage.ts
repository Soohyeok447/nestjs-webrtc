import AWS, { S3 } from 'aws-sdk';

export const configureAWS = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-northeast-2',
  });
};

export const storage: AWS.S3 = new S3();

export const getAwsCredentials = () =>
  AWS.config.getCredentials((err, credentials) => {
    if (err) {
      console.error('AWS configuration update error:', err);
    } else {
      console.log('AWS configuration update complete');
      console.log(credentials);
    }
  });

// export default storage;

import AWS, { S3 } from 'aws-sdk';

const s3: AWS.S3 = new S3();

export const configureS3 = () => {
  s3.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-northeast-2',
  });
};

export const printS3BucketList = async () => {
  storage.listBuckets((err) => {
    if (err) {
      console.log('[AWS S3 Connection error occured]\n', err);
    } else {
      console.log('[AWS S3 Connected]');
      // console.log('[S3BucketData] =>', data);
    }
  });
};

export const printStorageInfo = async () => {
  console.log(
    '[storage.config.credentials] => ',
    storage.config.credentials,
    '\n',
  );
};

export const storage = s3;

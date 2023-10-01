import AWS, { S3 } from "aws-sdk";
import { S3Client } from '@aws-sdk/client-s3';

// export const storage = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY
//   }
// });

const storage: AWS.S3 = new S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-northeast-2",
});

export default storage;
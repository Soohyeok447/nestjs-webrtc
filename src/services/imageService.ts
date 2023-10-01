import sharp from "sharp";
import { v4 } from "uuid";
import { storage } from "../config/storage";

export const resizeAndUploadImage = async (file: Express.Multer.File) => {
  const resizedBuffer = await sharp(file.buffer)
    .resize({ height: 800 })
    .toBuffer();

  const key = v4();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `resized/${key}`,
    Body: resizedBuffer,
    ContentType: 'image',
    ACL: 'public-read',
  };

  await storage.putObject(params).promise();

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/resized/${key}`;
};
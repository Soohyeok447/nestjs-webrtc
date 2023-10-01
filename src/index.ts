import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sharp from 'sharp';
import { v4 } from 'uuid'
import { storage } from './config/storage';
import { upload } from './middlewares/multer';

// import { createServer } from "http";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
// const httpServer = createServer(app);

const apiVersion = 'v1';
const apiEndPoint = `/api/${apiVersion}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const resizeAndUploadImage = async (file: Express.Multer.File) => {
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

app.post(`${apiEndPoint}/avatars`, upload.array('avatars'), async (req, res) => {
  try {
    const resizedImageUrls = await Promise.all(
      (req.files as Express.Multer.File[]).map(resizeAndUploadImage)
    );

    res.json({ result: 'success', urls: resizedImageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', error });
  }
})

app.post(`${apiEndPoint}/avatar`, upload.single('avatar'), async (req, res) => {
  try {
    const resizedImageUrl = await resizeAndUploadImage(req.file);

    res.json({ result: 'success', url: resizedImageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', error });
  }
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});


import express, { Express } from 'express';
// import { createServer } from "http";
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { serve, setup, swaggerSpec } from './config/swagger';
import { throttle } from './config/throttle';
import cors from 'cors';
import helmet from 'helmet';
// import { createServer } from 'http';
// import { Server, Socket } from 'socket.io';

// import UserRepository from './repositories/userRepository';
// import ImageRepository from './repositories/imageRepository';
// import { User, UserModel } from './models/userModel';
import {
  configureAWS,
  printAwsConfigs,
  printAwsCredentials,
  printS3BucketList,
  printStorageInfo,
} from './config/storage';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const app: Express = express();
const PORT = process.env.PORT;
const PROXY_PORT = (+PORT + 1).toString();
const SERVER_URL = process.env.SERVER_URL;

// const httpServer = createServer(app);
// const io = new Server(httpServer);

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io/client-dist'),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const corsOptions = {
  origin: environment === 'development' ? '*' : `${SERVER_URL}:${PROXY_PORT}`,
};
app.use(cors(corsOptions));

app.disable('x-powered-by');

app.use('/docs', serve, setup(swaggerSpec));

app.use('/api', throttle);
app.use(`/api`, apiRouter);

app.listen(PORT, () => {
  //TODO delete this
  console.log('environment - ', environment);

  configureAWS();
  printAwsConfigs();
  printAwsCredentials();
  printStorageInfo();
  printS3BucketList();
  setMongoose();
});

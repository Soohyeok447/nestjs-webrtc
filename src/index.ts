import express from 'express';
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { serve, setup, swaggerSpec } from './config/swagger';
import { throttle } from './config/throttle';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';

// import UserRepository from './repositories/userRepository';
// import ImageRepository from './repositories/imageRepository';
// import { User, UserModel } from './models/userModel';
import {
  configureS3,
  printS3BucketList,
  printStorageInfo,
} from './config/storage';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const PORT = process.env.PORT;
const PROXY_PORT = (+PORT + 1).toString();
const SERVER_URL = process.env.SERVER_URL;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));

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

httpServer.listen(PORT, () => {
  configureS3();
  printStorageInfo();
  printS3BucketList();
  setMongoose();
});

io.on('connection', (socket) => {
  console.log(`연결된 socketId => ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

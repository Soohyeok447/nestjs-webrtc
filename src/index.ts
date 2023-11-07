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

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const app: Express = express();
const PORT = process.env.PORT;
const PROXY_PORT = (+PORT + 1).toString();
const SERVER_URL = process.env.SERVER_URL;

// const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: `${SERVER_URL}:${PROXY_PORT}`,
  }),
);
app.disable('x-powered-by');

app.use('/docs', serve, setup(swaggerSpec));

app.use('/api', throttle);
app.use(`/api`, apiRouter);

app.listen(PORT, () => {
  setMongoose();
});
